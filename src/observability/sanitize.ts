import * as path from 'path';

// Strip ANSI color codes from error messages
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

export function stripAnsi(input: string): string {
  return input.replace(ANSI_PATTERN, '');
}

export function truncate(input: string, maxBytes: number): string {
  const buf = Buffer.from(input, 'utf-8');
  if (buf.byteLength <= maxBytes) return input;
  return buf.subarray(0, maxBytes).toString('utf-8') + '…';
}

export function capStackFrames(stack: string | undefined, maxFrames: number): string[] | undefined {
  if (!stack) return undefined;
  const frames = stripAnsi(stack)
    .split('\n')
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('at ') && !line.includes('node_modules'));
  if (frames.length === 0) return undefined;
  return frames.slice(0, maxFrames);
}

export function toRelativePath(absPath: string): string {
  return path.relative(process.cwd(), absPath);
}
