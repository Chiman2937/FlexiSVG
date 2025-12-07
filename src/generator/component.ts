import prettier from 'prettier';
import type { IconMetadata } from '../types/config';
import { writeFile } from '../utils/file';
import { logger } from '../utils/logger';

function generateIconComponent(metadata: IconMetadata[], spriteWebPath: string): string {
  // variant별로 그룹화
  const staticIcons = metadata.filter((m) => m.variant === 'static').map((m) => m.id);
  const dynamicIcons = metadata.filter((m) => m.variant === 'dynamic').map((m) => m.id);
  const resizableIcons = metadata.filter((m) => m.variant === 'resizable').map((m) => m.id);

  const generateUnionType = (ids: string[]) => {
    if (ids.length === 0) return 'never';
    return ids.map((id) => `'${id}'`).join(' | ');
  };

  return `// This file is auto-generated. Do not edit manually.
import { type ComponentProps } from 'react';

export type StaticIconId = ${generateUnionType(staticIcons)};
export type DynamicIconId = ${generateUnionType(dynamicIcons)};
export type ResizableIconId = ${generateUnionType(resizableIcons)};

export type IconId = StaticIconId | DynamicIconId | ResizableIconId;

type IconProps = ComponentProps<'svg'> & {
  id: IconId;
  size?: number;
};

export const Icon = ({ id, size = 24, ...props }: IconProps) => {
  return (
    <svg width={size} height={size} {...props}>
      <use href={\`${spriteWebPath}#\${id}\`} />
    </svg>
  );
};

export const iconMetadataMap = ${JSON.stringify(metadata, null, 2)} as const;

`;
}

export async function generateComponent(
  outputPath: string,
  metadata: IconMetadata[],
  spriteWebPath: string
): Promise<void> {
  try {
    const componentCode = generateIconComponent(metadata, spriteWebPath);

    const formatted = await prettier.format(componentCode, {
      parser: 'typescript',
      printWidth: 100,
      tabWidth: 2,
      singleQuote: true,
      trailingComma: 'all',
    });

    writeFile(outputPath, formatted);
    logger.success(`Icon component generated: ${outputPath}`);
  } catch (err) {
    logger.error(`Component generation failed: ${(err as Error).message}`);
    throw err;
  }
}
