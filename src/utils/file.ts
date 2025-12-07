import fs from 'node:fs';
import path from 'node:path';

export function ensureDirectoryExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getSvgFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath).filter((file) => file.endsWith('.svg'));
}

export function readSvgFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  ensureDirectoryExists(dir);
  fs.writeFileSync(filePath, content, 'utf8');
}

export function getIconId(fileName: string): string {
  return path.basename(fileName, '.svg').replace(/^icon-/, '');
}
