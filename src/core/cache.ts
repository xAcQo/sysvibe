import { existsSync, readFileSync, writeFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import * as log from '../utils/logger.js';

const IGNORED_DIRS = new Set([
  '.git',
  '.sysvibe',
  'node_modules',
  'build',
  'target',
  'bin',
  'obj',
  'dist',
  '.idea',
  '.vscode'
]);

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = join(dir, file);
    if (statSync(filePath).isDirectory()) {
      if (!IGNORED_DIRS.has(file)) {
        walkDir(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export function hashWorkspace(projectRoot: string): string {
  const files = walkDir(projectRoot);
  // Sort files for deterministic hashing
  files.sort();

  const hash = createHash('sha256');

  for (const file of files) {
    try {
      const stats = statSync(file);
      // We hash the relative path, size, and mtime
      // This is extremely fast and effectively catches all edits
      hash.update(`${file}:${stats.size}:${stats.mtimeMs}\n`);
    } catch (e) {
      // Ignore files that can't be stat'd (e.g. symlinks pointing to nowhere)
    }
  }

  return hash.digest('hex');
}

interface CacheData {
  lastHash: string;
}

function getCachePath(): string {
  return join(process.cwd(), '.sysvibe', 'cache.json');
}

export function getCache(): string | null {
  const cachePath = getCachePath();
  if (existsSync(cachePath)) {
    try {
      const content = readFileSync(cachePath, 'utf-8');
      const data = JSON.parse(content) as CacheData;
      return data.lastHash;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export function saveCache(hash: string): void {
  const cachePath = getCachePath();
  try {
    const data: CacheData = { lastHash: hash };
    writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    log.error(`Failed to save cache: ${(e as Error).message}`);
  }
}
