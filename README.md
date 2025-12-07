# FlexiSVG

SVG sprite generator with automatic TypeScript type generation for React projects.

## Features

- **Three Icon Variants**: Static, Dynamic, and Resizable icons
- **Automatic Sprite Generation**: Combines multiple SVG files into a single optimized sprite
- **TypeScript Support**: Auto-generated type-safe Icon component
- **Optimized**: Uses SVGO for SVG optimization
- **Easy Integration**: Simple CLI commands for initialization and generation

## Installation

```bash
# npm
npm install -D flexisvg

# pnpm
pnpm add -D flexisvg
```

## Quick Start

### 1. Initialize Project

Run the init command to create configuration file and folder structure:

```bash
# npm
npx flexisvg init

# pnpm
pnpm dlx flexisvg init
```

This will create:

- `flexisvg.config.ts` - Configuration file
- `public/icons/static/` - Static icons folder
- `public/icons/dynamic/` - Dynamic icons folder
- `public/icons/resizable/` - Resizable icons folder
- `src/components/` - Output folder for Icon component

### 2. Add SVG Files

Place your SVG files in the appropriate folders:

- **static**: Icons with fixed size and color
- **dynamic**: Icons with customizable size and color
- **resizable**: Icons with customizable size only

### 3. Generate Sprite

Run the generate command to create sprite and Icon component:

```bash
npx flexisvg
```

This will generate:

- `public/icons/sprite.svg` - Optimized SVG sprite
- `src/components/icon/index.tsx` - Type-safe React Icon component

## Configuration

The `flexisvg.config.ts` file allows you to customize the folder structure:

```typescript
import { SpriteGeneratorConfig } from 'flexisvg';

const config: SpriteGeneratorConfig = {
  // Input directories
  staticDir: 'public/icons/static',
  dynamicDir: 'public/icons/dynamic',
  resizableDir: 'public/icons/resizable',

  // Output paths
  outputSpriteDir: 'public',
  outputComponentPath: 'src/components/icon/index.tsx',
};

export default config;
```

### Configuration Options

| Option                | Type     | Description                                               |
| --------------------- | -------- | --------------------------------------------------------- |
| `staticDir`           | `string` | Directory for static icons (fixed size and color)         |
| `dynamicDir`          | `string` | Directory for dynamic icons (customizable size and color) |
| `resizableDir`        | `string` | Directory for resizable icons (customizable size only)    |
| `outputSpriteDir`     | `string` | Output directory for `sprite.svg`                         |
| `outputComponentPath` | `string` | Output path for Icon component                            |

## Icon Variants

### Static Icons

- **Use case**: Icons that should never change in size or color
- **Processing**: No modifications applied
- **Example**: Logos, brand icons

```
public/icons/static/
  ├─ logo.svg
  └─ brand-icon.svg
```

### Dynamic Icons

- **Use case**: Icons that need both size and color customization
- **Processing**:
  - Removes `width` and `height` attributes
  - Converts colors to `currentColor`
  - Removes `fill` and `stroke` attributes with values `none`, `black`, or `#000000`
- **Example**: UI icons, action buttons

```
public/icons/dynamic/
  ├─ home.svg
  ├─ user.svg
  └─ settings.svg
```

### Resizable Icons

- **Use case**: Icons that need size customization but should keep original colors
- **Processing**: Removes `width` and `height` attributes only
- **Example**: Colored illustrations, multi-color icons

```
public/icons/resizable/
  ├─ illustration-1.svg
  └─ colored-icon.svg
```

## Generated Output

### 1. Sprite File (`public/icons/sprite.svg`)

An optimized SVG sprite containing all icons as symbols:

```xml
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="home" viewBox="0 0 24 24">
    <!-- SVG content -->
  </symbol>
  <symbol id="user" viewBox="0 0 24 24">
    <!-- SVG content -->
  </symbol>
  <!-- More symbols... -->
</svg>
```

### 2. Icon Component (`src/components/icon/index.tsx`)

A type-safe React component with auto-generated types:

```typescript
// Auto-generated types
export type StaticIconId = 'logo' | 'brand-icon';
export type DynamicIconId = 'home' | 'user' | 'settings';
export type ResizableIconId = 'illustration-1' | 'colored-icon';
export type IconId = StaticIconId | DynamicIconId | ResizableIconId;

// Icon component
export const Icon = ({ id, size = 24, ...props }: IconProps) => {
  return (
    <svg width={size} height={size} {...props}>
      <use href={`/sprite.svg#${id}`} />
    </svg>
  );
};
```

## Usage in Your App

### Basic Usage

```tsx
import { Icon } from '@/components/icon';

function App() {
  return (
    <div>
      {/* Default size (24px) */}
      <Icon id="home" />

      {/* Custom size */}
      <Icon id="user" size={32} />

      {/* With custom color (for dynamic icons) */}
      <Icon id="settings" size={20} style={{ color: 'blue' }} />

      {/* With additional props */}
      <Icon id="logo" className="my-icon" onClick={handleClick} />
    </div>
  );
}
```

### TypeScript Benefits

The generated types provide autocomplete and type checking:

```tsx
// ✅ Valid - 'home' exists in icon set
<Icon id="home" />

// ❌ TypeScript error - 'nonexistent' is not a valid icon id
<Icon id="nonexistent" />
```

## CLI Commands

### `flexisvg init`

Creates configuration file and folder structure.

```bash
npx flexisvg init
```

### `flexisvg`

Generates sprite and Icon component based on configuration.

```bash
npx flexisvg
```

### Custom Config Path

Use a custom configuration file:

```bash
npx flexisvg --config path/to/custom.config.js
```

## License

MIT
