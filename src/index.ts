import { DEFAULT_CONFIG } from './config/defaults';
import { generateComponent } from './generator/component';
import { generateSprite } from './generator/sprite';
import type { SpriteGeneratorConfig } from './types/config';
import { getSpriteWebPath } from './utils/file';
import { logger } from './utils/logger';

export async function generate(userConfig: Partial<SpriteGeneratorConfig> = {}): Promise<void> {
  const config: SpriteGeneratorConfig = {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };

  logger.info('Starting SVG sprite generation...');

  try {
    // 1. Sprite 생성
    const iconMetadata = await generateSprite(config);
    logger.info(`Collected ${iconMetadata.length} icons`);

    // 2. Sprite 웹 경로 계산
    const spriteWebPath = getSpriteWebPath(config.outputSpriteDir);
    logger.info(`Sprite web path: ${spriteWebPath}`);

    // 3. Icon 컴포넌트 생성
    await generateComponent(config.outputComponentPath, iconMetadata, spriteWebPath);

    logger.success('SVG sprite generation completed! 🎉');
  } catch (error) {
    logger.error(`Generation failed: ${(error as Error).message}`);
    throw error;
  }
}

export { DEFAULT_CONFIG } from './config/defaults';
export type { IconMetadata, SpriteGeneratorConfig } from './types/config';
