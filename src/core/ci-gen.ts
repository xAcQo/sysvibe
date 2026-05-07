import { existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import * as log from '../utils/logger.js';
import { getTemplatePath } from './template-engine.js';

export type CiProvider = 'github' | 'gitlab';

export function generateCiConfig(provider: CiProvider, projectDir: string): boolean {
  const ciTemplatesDir = getTemplatePath('ci');
  let srcFile = '';
  let destFile = '';

  switch (provider) {
    case 'github':
      srcFile = join(ciTemplatesDir, 'github-actions.yml');
      destFile = join(projectDir, '.github', 'workflows', 'sysvibe.yml');
      break;
    case 'gitlab':
      srcFile = join(ciTemplatesDir, 'gitlab-ci.yml');
      destFile = join(projectDir, '.gitlab-ci.yml');
      break;
    default:
      log.error(`Unsupported CI provider: ${provider}`);
      return false;
  }

  if (!existsSync(srcFile)) {
    log.error(`CI template not found for provider: ${provider}`);
    return false;
  }

  if (existsSync(destFile)) {
    log.warn(`CI configuration already exists at: ${destFile}`);
    log.info('Skipping CI config generation to prevent overwrite.');
    return false;
  }

  // Ensure destination directory exists
  const targetDir = dirname(destFile);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  try {
    copyFileSync(srcFile, destFile);
    return true;
  } catch (error) {
    log.error(`Failed to write CI configuration: ${(error as Error).message}`);
    return false;
  }
}
