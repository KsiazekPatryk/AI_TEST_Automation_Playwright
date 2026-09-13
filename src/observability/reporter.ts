import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestError, TestResult, TestStep } from '@playwright/test/reporter';
import { capStackFrames, stripAnsi, toRelativePath, truncate } from './sanitize';
import { ObservabilityEvent, StepError, StepTarget } from './types';

const MESSAGE_BYTE_BUDGET = 2048;
const STACK_FRAME_LIMIT = 10;
const OUTPUT_DIR = '.observability';

function sanitizeError(error: TestError): StepError {
  return {
    message: truncate(stripAnsi(error.message ?? ''), MESSAGE_BYTE_BUDGET),
    snippet: error.snippet ? truncate(stripAnsi(error.snippet), MESSAGE_BYTE_BUDGET) : undefined,
    stackTop: capStackFrames(error.stack, STACK_FRAME_LIMIT),
  };
}

function extractTarget(step: TestStep, lastUrlPath: string | undefined): StepTarget {
  const title = step.title;
  const selectorMatch = title.match(/locator\('([^']+)'\)/);
  const navigateMatch = title.match(/Navigate to "([^"]+)"/);
  const action = title.split(' locator(')[0].split(' "')[0].trim();
  return {
    action,
    selector: selectorMatch?.[1],
    urlPath: navigateMatch?.[1] ?? lastUrlPath,
  };
}

function isTestStep(step: TestStep): boolean {
  return step.category === 'test.step';
}

export default class ObservabilityReporter implements Reporter {
  private runId = crypto.randomUUID().slice(0, 8);
  private outFile = '';
  private ci = !!process.env.CI;
  private lastUrlPath = new Map<string, string>();
  private stepIndex = new Map<string, number>();
  private totals = { passed: 0, failed: 0, skipped: 0, flaky: 0 };

  onBegin(config: FullConfig, _suite: Suite): void {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    this.outFile = path.join(OUTPUT_DIR, `run-${this.runId}.jsonl`);
    this.write({
      type: 'run',
      phase: 'begin',
      runId: this.runId,
      startedAt: new Date().toISOString(),
      ci: this.ci,
      projects: config.projects.map((p) => p.name),
    });
  }

  onStepBegin(): void {
    // no-op
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    const navigateMatch = step.title.match(/Navigate to "([^"]+)"/);
    if (navigateMatch) this.lastUrlPath.set(test.id, navigateMatch[1]);

    if (!isTestStep(step)) {
      if (step.error) {
        const target = extractTarget(step, this.lastUrlPath.get(test.id));
        this.emitStepEvent(test, result, step, 'failed', target, sanitizeError(step.error));
      }
      return;
    }

    if (step.error) {
      this.emitStepEvent(test, result, step, 'failed', undefined, sanitizeError(step.error));
    } else {
      this.emitStepEvent(test, result, step, 'passed');
    }
  }

  private emitStepEvent(
    test: TestCase,
    result: TestResult,
    step: TestStep,
    outcome: 'passed' | 'failed',
    target?: StepTarget,
    error?: StepError,
  ): void {
    const idx = (this.stepIndex.get(test.id) ?? 0) + 1;
    this.stepIndex.set(test.id, idx);

    this.write({
      type: 'step',
      runId: this.runId,
      testId: test.id,
      testTitlePath: test.titlePath().join(' > '),
      project: test.parent.project()?.name ?? 'unknown',
      retry: result.retry,
      stepTitle: step.title,
      stepIndex: idx,
      startedAt: step.startTime.toISOString(),
      durationMs: step.duration,
      outcome,
      target,
      error,
    });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const status = result.status;
    const outcome = test.outcome();
    if (outcome === 'flaky') this.totals.flaky += 1;
    else if (status === 'passed') this.totals.passed += 1;
    else if (status === 'skipped') this.totals.skipped += 1;
    else this.totals.failed += 1;

    const artifacts = result.attachments
      .filter((a) => a.path)
      .map((a) => ({
        name: a.name,
        contentType: a.contentType,
        path: toRelativePath(a.path!),
      }));

    this.write({
      type: 'test',
      runId: this.runId,
      testId: test.id,
      testTitlePath: test.titlePath().join(' > '),
      project: test.parent.project()?.name ?? 'unknown',
      status,
      outcome,
      retry: result.retry,
      durationMs: result.duration,
      stepCount: this.stepIndex.get(test.id) ?? 0,
      error: result.error ? sanitizeError(result.error) : undefined,
      artifacts,
    });
  }

  onEnd(_result: FullResult): void {
    this.write({
      type: 'run',
      phase: 'end',
      runId: this.runId,
      endedAt: new Date().toISOString(),
      ci: this.ci,
      totals: this.totals,
    });
  }

  private write(event: ObservabilityEvent): void {
    if (!this.outFile) return;
    fs.appendFileSync(this.outFile, JSON.stringify(event) + '\n', 'utf-8');
  }
}
