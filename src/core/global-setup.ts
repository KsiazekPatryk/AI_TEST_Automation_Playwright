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
  const projects = process.argv
    .filter((arg) => arg.startsWith('--project='))
    .flatMap((arg) => arg.slice('--project='.length).split(',').filter(Boolean));
  return projects.length > 0 ? projects : undefined;
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
