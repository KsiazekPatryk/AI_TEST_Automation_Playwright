import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import * as ts from 'typescript';

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const TESTS_DIR = path.join(REPO_ROOT, 'tests');
const TSCONFIG_PATH = path.join(REPO_ROOT, 'tsconfig.json');

const FALLBACK_TRIGGERS = ['playwright.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json'];

export interface AffectedResult {
  specs: string[];
  runAll: boolean;
  changedFiles: string[];
}

function changedFiles(baseRef: string): string[] {
  try {
    const output = execFileSync('git', ['diff', '--name-only', `${baseRef}...HEAD`], {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    return output.split('\n').filter(Boolean);
  } catch {
    // If git diff fails (e.g. detached HEAD or shallow clone), try HEAD~1
    try {
      const output = execFileSync('git', ['diff', '--name-only', 'HEAD~1'], {
        cwd: REPO_ROOT,
        encoding: 'utf-8',
      });
      return output.split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }
}

function triggersFallback(files: string[]): boolean {
  return files.some((f) => FALLBACK_TRIGGERS.includes(f) || f.startsWith('.github/'));
}

function findSpecFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSpecFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.spec.ts')) {
      results.push(full);
    }
  }
  return results;
}

function loadCompilerOptions(): ts.CompilerOptions {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const configFile = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(`Failed to read tsconfig.json: ${ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')}`);
  }
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, REPO_ROOT);
  return parsed.options;
}

function collectLocalDependencies(entryFile: string, compilerOptions: ts.CompilerOptions, memo: Map<string, Set<string>>): Set<string> {
  const cached = memo.get(entryFile);
  if (cached) return cached;

  const deps = new Set<string>([entryFile]);
  memo.set(entryFile, deps);

  let sourceText: string;
  try {
    sourceText = fs.readFileSync(entryFile, 'utf-8');
  } catch {
    return deps;
  }

  const sourceFile = ts.createSourceFile(entryFile, sourceText, ts.ScriptTarget.ES2022, true);

  const specifiers: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      specifiers.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  for (const specifier of specifiers) {
    const resolved = ts.resolveModuleName(specifier, entryFile, compilerOptions, ts.sys);
    const resolvedPath = resolved.resolvedModule?.resolvedFileName;
    if (!resolvedPath) continue;

    const normalized = path.normalize(resolvedPath);
    if (!normalized.startsWith(REPO_ROOT) || normalized.includes(`${path.sep}node_modules${path.sep}`)) {
      continue;
    }

    for (const dep of collectLocalDependencies(normalized, compilerOptions, memo)) {
      deps.add(dep);
    }
  }

  return deps;
}

export function getAffectedSpecs(baseRef: string): AffectedResult {
  const changed = changedFiles(baseRef);

  if (changed.length === 0 || triggersFallback(changed)) {
    return { specs: [], runAll: true, changedFiles: changed };
  }

  const compilerOptions = loadCompilerOptions();
  const specFiles = findSpecFiles(TESTS_DIR);
  const memo = new Map<string, Set<string>>();

  const changedAbsolute = new Set(changed.map((f) => path.normalize(path.join(REPO_ROOT, f))));
  const affected: string[] = [];

  for (const spec of specFiles) {
    const deps = collectLocalDependencies(spec, compilerOptions, memo);
    const isAffected = Array.from(deps).some((dep) => changedAbsolute.has(dep));
    if (isAffected) {
      affected.push(path.relative(REPO_ROOT, spec));
    }
  }

  return { specs: affected, runAll: false, changedFiles: changed };
}
