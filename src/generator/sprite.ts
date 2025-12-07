import path from 'node:path';
import prettier from 'prettier';
import SVGSpriter from 'svg-sprite';
import type { IconMetadata, SpriteGeneratorConfig } from '../types/config';
import { getIconId, getSvgFiles, readSvgFile, writeFile } from '../utils/file';
import { logger } from '../utils/logger';

type VariantType = 'static' | 'dynamic' | 'resizable';

interface SvgTransformOptions {
  shouldTransformColors: boolean;
}

function getSvgoConfig(options: SvgTransformOptions) {
  const plugins: any[] = [
    'preset-default',
    ...(options.shouldTransformColors
      ? [
          {
            name: 'convertColors',
            params: {
              currentColor: true,
            },
          },
          {
            name: 'removeAttrs',
            params: {
              attrs: '(stroke|fill):(none|black|#000000)',
            },
          },
        ]
      : []),
  ];

  return { plugins };
}

export async function generateSprite(config: SpriteGeneratorConfig): Promise<IconMetadata[]> {
  const spriterConfig: any = {
    mode: {
      symbol: {
        dest: config.outputSpriteDir,
        sprite: 'sprite.svg',
      },
    },
    shape: {
      id: {
        generator: (name: string) => {
          return getIconId(name);
        },
      },
      transform: [
        (shape: any, _sprite: any, callback: Function) => {
          const filePath = shape.source?.path || shape.name || shape.id || shape.base;
          if (!filePath) {
            callback(null);
            return;
          }

          // 파일 경로에서 variant 폴더명 추출
          const normalizedPath = filePath.replace(/\\/g, '/');
          const shouldTransformColors = normalizedPath.includes('/dynamic/');

          const svgoConfig = getSvgoConfig({ shouldTransformColors });
          const { optimize } = require('svgo');
          const result = optimize(shape.getSVG(), svgoConfig);
          shape.setSVG(result.data);
          callback(null);
        },
      ],
    },
  };

  const spriter = new SVGSpriter(spriterConfig);
  const iconMetadata: IconMetadata[] = [];

  // 각 variant 별로 SVG 파일 추가
  const variants: Array<{
    dir: keyof SpriteGeneratorConfig;
    variant: VariantType;
  }> = [
    { dir: 'staticDir', variant: 'static' },
    { dir: 'dynamicDir', variant: 'dynamic' },
    { dir: 'resizableDir', variant: 'resizable' },
  ];

  for (const { dir, variant } of variants) {
    const dirPath = config[dir] as string;
    const files = getSvgFiles(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const content = readSvgFile(filePath);
      const iconId = getIconId(file);

      iconMetadata.push({ id: iconId, variant });

      // spriter에 파일 추가
      spriter.add(filePath, null, content);
    });
  }

  return new Promise((resolve, reject) => {
    spriter.compile(async (error, result) => {
      if (error) {
        logger.error(`Error generating sprite: ${error.message}`);
        reject(error);
        return;
      }

      for (const mode in result) {
        for (const resource in result[mode]) {
          const outputPath = result[mode][resource].path;
          const content = result[mode][resource].contents.toString();

          try {
            const formatted = await prettier.format(content, {
              parser: 'html',
              printWidth: 100,
              tabWidth: 2,
            });

            writeFile(outputPath, formatted);
            logger.success(`Sprite generated: ${outputPath}`);
          } catch (err) {
            logger.warn(`Formatting failed, saving unformatted: ${(err as Error).message}`);
            writeFile(outputPath, content);
          }
        }
      }

      resolve(iconMetadata);
    });
  });
}
