import type { SpriteGeneratorConfig } from '../types/config';

export const DEFAULT_CONFIG: SpriteGeneratorConfig = {
  dynamicDir: 'public/icons/dynamic',
  resizableDir: 'public/icons/resizable',
  outputSpriteDir: 'public/icons',
  outputComponentPath: 'src/components/icon/index.tsx',
};
