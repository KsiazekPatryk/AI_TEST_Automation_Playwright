import { execFileSync } from 'child_process';
import { getAffectedSpecs } from './affected-tests';

function main(): void {
  const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : 'main';
  const { specs, runAll, changedFiles } = getAffectedSpecs(baseRef);

  process.stderr.write(`[test-selection] diffing against ${baseRef}\n`);
  process.stderr.write(`[test-selection] changed files:\n${changedFiles.map((f) => `  - ${f}`).join('\n') || '  (none)'}\n`);

  if (runAll) {
    process.stderr.write('[test-selection] change touches global config / build files — running the full test suite\n');
    execFileSync('npx', ['playwright', 'test'], { stdio: 'inherit' });
    return;
  }

  if (specs.length === 0) {
    process.stderr.write('[test-selection] no specs depend on the changed files — nothing to run\n');
    return;
  }

  process.stderr.write(`[test-selection] running ${specs.length} affected spec(s):\n${specs.map((f) => `  - ${f}`).join('\n')}\n`);
  execFileSync('npx', ['playwright', 'test', ...specs], { stdio: 'inherit' });
}

main();
