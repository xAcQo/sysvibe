import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, copyFileSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import * as log from '../utils/logger.js';

/**
 * Get the absolute path to the templates directory.
 * Works in both development (src/) and production (dist/) contexts.
 */
function getTemplatesRoot(): string {
  // In bundled CJS output, __dirname points to dist/
  // Templates are in src/templates/ relative to project root
  const projectRoot = join(__dirname, '..');
  const srcTemplates = join(projectRoot, 'src', 'templates');
  if (existsSync(srcTemplates)) return srcTemplates;

  // Fallback: templates might be alongside dist
  const altTemplates = join(projectRoot, 'templates');
  if (existsSync(altTemplates)) return altTemplates;

  return srcTemplates;
}

export function getTemplatePath(packName: string): string {
  return join(getTemplatesRoot(), packName);
}

export function templateExists(packName: string): boolean {
  return existsSync(getTemplatePath(packName));
}

/**
 * Recursively copy all files from source to target directory,
 * replacing {{PROJECT_NAME}} placeholders in text files.
 */
export function scaffoldProject(
  packName: string,
  projectName: string,
  targetDir: string
): { created: string[]; skipped: string[] } {
  const templateDir = getTemplatePath(packName);
  const created: string[] = [];
  const skipped: string[] = [];

  if (!existsSync(templateDir)) {
    log.error(`Template not found for pack: ${packName}`);
    return { created, skipped };
  }

  const snakeName = projectName.replace(/-/g, '_').replace(/\s+/g, '_').toLowerCase();

  copyRecursive(templateDir, targetDir, projectName, snakeName, created, skipped);
  return { created, skipped };
}

function copyRecursive(
  srcDir: string,
  destDir: string,
  projectName: string,
  snakeName: string,
  created: string[],
  skipped: string[]
): void {
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const entries = readdirSync(srcDir);

  for (const entry of entries) {
    const srcPath = join(srcDir, entry);
    const destPath = join(destDir, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath, projectName, snakeName, created, skipped);
    } else {
      if (existsSync(destPath)) {
        skipped.push(relative(destDir, destPath) || entry);
        continue;
      }

      // Determine if this is a text file that needs placeholder replacement
      if (isTextFile(entry)) {
        let content = readFileSync(srcPath, 'utf-8');
        content = content.replace(/\{\{PROJECT_NAME\}\}/g, projectName);
        content = content.replace(/\{\{PROJECT_NAME_SNAKE\}\}/g, snakeName);

        // Ensure parent directory exists
        const parentDir = dirname(destPath);
        if (!existsSync(parentDir)) {
          mkdirSync(parentDir, { recursive: true });
        }

        writeFileSync(destPath, content, 'utf-8');
      } else {
        copyFileSync(srcPath, destPath);
      }

      created.push(relative(destDir, destPath) || entry);
    }
  }
}

function isTextFile(filename: string): boolean {
  const textExtensions = [
    '.cpp', '.hpp', '.h', '.c', '.cc',
    '.rs', '.toml', '.yaml', '.yml',
    '.json', '.md', '.txt', '.cmake',
    '.gitkeep', '.gitignore',
  ];

  const name = filename.toLowerCase();

  // Files without extensions that are text
  if (['CMakeLists.txt', '.clang-tidy', '.clang-format', '.clippy.toml', 'rustfmt.toml', '.gitkeep'].includes(filename)) {
    return true;
  }

  return textExtensions.some((ext) => name.endsWith(ext));
}

export function printScaffoldReport(result: { created: string[]; skipped: string[] }): void {
  if (result.created.length > 0) {
    log.success(`Scaffolded ${result.created.length} files:`);
    for (const file of result.created) {
      console.log(`  ${file}`);
    }
  }

  if (result.skipped.length > 0) {
    log.warn(`Skipped ${result.skipped.length} existing files:`);
    for (const file of result.skipped) {
      console.log(`  ${file}`);
    }
  }
}
