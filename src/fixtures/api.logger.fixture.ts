/* eslint-disable no-console */
import { test as base, APIRequestContext, APIResponse } from '@playwright/test';
import chalk from 'chalk';
chalk.level = 3;

const isLoggerEnabled = process.env.LOGGER === 'true';

const neon = chalk.hex('#22d3a2');
const neonB = chalk.hex('#22d3a2').bold;
const cyan = chalk.hex('#014dbe');
const yel = chalk.hex('#f5c84a');
const red = chalk.hex('#f24e4e');
const white = chalk.hex('#f0f2ff');
const dim = chalk.hex('#ccccda');
const purp = chalk.hex('#8b83ff');

const METHOD_BADGE: Record<string, chalk.Chalk> = {
  get: chalk.bgHex('#22d3a2').hex('#0d0f17').bold,
  post: chalk.bgHex('#6c63ff').hex('#f0f2ff').bold,
  put: chalk.bgHex('#f5c84a').hex('#0d0f17').bold,
  patch: chalk.bgHex('#80d9f0').hex('#0d0f17').bold,
  delete: chalk.bgHex('#f24e4e').hex('#f0f2ff').bold,
  head: chalk.bgHex('#22d3a2').hex('#0d0f17').bold,
  fetch: chalk.bgHex('#8b83ff').hex('#f0f2ff').bold,
};

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch'] as const;

function bar(n = 56): string {
  return neon('━'.repeat(n));
}

function ts(): string {
  return dim(new Date().toISOString().slice(11, 23));
}

function formatJson(obj: unknown, pad = '     '): string {
  const lines = JSON.stringify(obj, null, 2).split('\n');
  return lines
    .map((line, i) => {
      const kvMatch = /^(\s*)("(?:[^"\\]|\\.)*")(\s*:)(\s*.*)$/.exec(line);
      const coloredLine = kvMatch ? kvMatch[1] + cyan(kvMatch[2]) + dim(kvMatch[3] + kvMatch[4]) : dim(line);
      return i === 0 ? coloredLine : pad + coloredLine;
    })
    .join('\n');
}

function formatHeaders(headers: Record<string, string>, pad = '     '): string {
  return Object.entries(headers)
    .map(([k, v]) => pad + dim('│') + '  ' + cyan('"' + k + '"') + ': ' + dim('"' + v + '"'))
    .join('\n');
}

function sectionHeader(label: string, icon: string): void {
  const LINE = dim('─'.repeat(42));
  console.log('\n' + neonB(icon + ' ' + label) + '  ' + LINE + '  ' + ts());
}

function logRequest(method: string, url: string, options?: Record<string, unknown>): void {
  if (!isLoggerEnabled) return;

  const badge = METHOD_BADGE[method.toLowerCase()] ?? chalk.bold;

  sectionHeader('REQUEST', '⚡');
  console.log('  ' + badge(` ${method.toUpperCase()} `) + '  ' + white.bold(url));

  if (options?.headers) {
    console.log(
      '  ' +
        dim('┃') +
        '  ' +
        white.bold('headers') +
        '\n' +
        formatHeaders(options.headers as Record<string, string>, '      '),
    );
  }

  if (options?.data) {
    console.log('  ' + dim('┃') + '  ' + white.bold('payload') + '\n' + '      ' + formatJson(options.data, '      '));
  }
}

async function logResponse(response: APIResponse, elapsedMs?: number): Promise<void> {
  if (!isLoggerEnabled) return;

  const s = response.status();

  function statusStyle(): [string, chalk.Chalk] {
    if (s >= 500) return ['💥 ', red];
    if (s >= 400) return ['✗  ', red];
    if (s >= 300) return ['→  ', yel];
    return ['✓  ', neon];
  }

  const [icon, color] = statusStyle();

  const timing = elapsedMs === undefined ? '' : '  ' + dim('·') + '  ' + neonB(`${elapsedMs}ms`);

  sectionHeader('RESPONSE', '📥');
  console.log('  ' + color.bold(icon + String(s)) + timing);

  const headers = response.headers();
  const headersStr = formatHeaders(headers, '      ');
  console.log('\n  ' + white.bold('headers') + '\n' + headersStr);

  try {
    const ct = headers['content-type'] ?? '';
    if (ct.includes('application/json')) {
      const json = await response.json();
      console.log('\n  ' + white.bold('body'));
      console.log('  ' + formatJson(json, '  '));
    } else {
      const text = await response.text();
      console.log('\n  ' + white.bold('body') + '\n  ' + dim(text));
    }
  } catch (e) {
    console.log('  ' + red('⚠  Could not parse body: ') + dim(String(e)));
  }

  console.log('\n' + neon('─'.repeat(60)) + '\n');
}

function wrapRequest(ctx: APIRequestContext): APIRequestContext {
  return new Proxy(ctx, {
    get(target, prop: string) {
      if ((HTTP_METHODS as readonly string[]).includes(prop)) {
        return async (url: string, options?: Record<string, unknown>) => {
          const t0 = Date.now();
          const response = await (
            target as unknown as Record<string, (u: string, o?: unknown) => Promise<APIResponse>>
          )[prop](url, options);
          logRequest(prop, response.url(), options);
          await logResponse(response, Date.now() - t0);
          return response;
        };
      }
      const value = (target as unknown as Record<string, unknown>)[prop];
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

export const test = base.extend<{ request: APIRequestContext }>({
  request: async ({ request }, use) => {
    await use(wrapRequest(request));
  },
});

export { expect } from '@playwright/test';
