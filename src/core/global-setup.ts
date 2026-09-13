import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `[global-setup] Missing required environment variable "${name}". ` +
        `Please make sure it is defined in your .env file or process environment.`
    );
  }
  return value.trim();
}

function requestedProjects(): string[] | undefined {
  const flag = process.argv.find((a) => a.startsWith('--project='));
  if (!flag) return undefined;
  return [flag.slice('--project='.length)];
}

export default async function globalSetup(): Promise<void> {
  const projects = requestedProjects();

  // Validate API variables if all projects or API/E2E project runs
  const apiInScope = !projects || projects.includes('api') || projects.includes('e2e');
  if (apiInScope) {
    requireEnv('API_URL');
    requireEnv('OPENAPI_SPEC');
  }

  // Validate UI variables if all projects or UI/E2E project runs
  const uiInScope = !projects || projects.includes('ui') || projects.includes('e2e');
  if (uiInScope) {
    requireEnv('UI_URL');
  }
}
