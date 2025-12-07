export interface SpriteGeneratorConfig {
  /** 정적 SVG 폴더 (색상, 크기 변경 불가) */
  staticDir: string;
  /** 동적 SVG 폴더 (색상, 크기 모두 변경 가능) */
  dynamicDir: string;
  /** 크기 조절 SVG 폴더 (크기만 변경 가능) */
  resizableDir: string;
  /** sprite.svg 출력 폴더 */
  outputSpriteDir: string;
  /** Icon.tsx 컴포넌트 출력 경로 */
  outputComponentPath: string;
}

export interface IconMetadata {
  id: string;
  variant: 'static' | 'dynamic' | 'resizable';
}
