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

/**
 * Convert outputSpriteDir to web-accessible sprite path
 * @param outputSpriteDir - e.g., "public/icons" or "public"
 * @returns Web path - e.g., "/icons/sprite.svg" or "/sprite.svg"
 */
export function getSpriteWebPath(outputSpriteDir: string): string {
  // Normalize path separators to forward slashes
  const normalized = outputSpriteDir.replace(/\\/g, '/');

  // Remove 'public' prefix if exists
  const withoutPublic = normalized.replace(/^public\/?/, '');

  // Add leading slash and sprite.svg
  const webPath = withoutPublic ? `/${withoutPublic}/sprite.svg` : '/sprite.svg';

  // Clean up any double slashes
  return webPath.replace(/\/+/g, '/');
}
