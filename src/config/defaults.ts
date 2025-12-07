import type { SpriteGeneratorConfig } from '../types/config';

export const DEFAULT_CONFIG: SpriteGeneratorConfig = {
  staticDir: 'public/icons/static',
  dynamicDir: 'public/icons/dynamic',
  resizableDir: 'public/icons/resizable',
  outputSpriteDir: 'public/icons',
  outputComponentPath: 'src/components/icon/index.tsx',
};
