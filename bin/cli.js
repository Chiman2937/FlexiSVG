#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { program } = require('commander');
const { generate } = require('../dist/index');
const { createJiti } = require('jiti');

// init 명령어
program
  .command('init')
  .description('Create flexisvg.config.ts file and icon directories')
  .action(() => {
    const targetPath = path.resolve(process.cwd(), 'flexisvg.config.ts');
    const templatePath = path.resolve(__dirname, '../templates/flexisvg.config.ts');

    if (fs.existsSync(targetPath)) {
      console.log('⚠️  flexisvg.config.ts already exists');
      process.exit(1);
    }

    try {
      // config 파일 생성
      const template = fs.readFileSync(templatePath, 'utf-8');
      fs.writeFileSync(targetPath, template);
      console.log('✅ flexisvg.config.ts created successfully');

      // 디렉토리 생성
      const directories = [
        'public/icons/dynamic',
        'public/icons/resizable',
        'public',
        'src/components',
      ];

      directories.forEach((dir) => {
        const dirPath = path.resolve(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
          console.log(`✅ Created directory: ${dir}`);
        } else {
          console.log(`ℹ️  Directory already exists: ${dir}`);
        }
      });

      console.log('\n🎉 Initialization complete! You can now:');
      console.log('   1. Add SVG files to the icon directories');
      console.log('   2. Run "flexisvg" to generate sprite and components');
    } catch (error) {
      console.error('❌ Failed to initialize:', error.message);
      process.exit(1);
    }
  });

// generate 명령어 (기본)
program
  .name('flexisvg')
  .description('Generate SVG sprite and Icon component with TypeScript types')
  .option('-c, --config <path>', 'Path to config file')
  .action(async (options) => {
    try {
      let config = {};

      // config 파일 찾기
      let configPath = null;
      if (options.config) {
        configPath = path.resolve(process.cwd(), options.config);
      } else {
        // 가능한 config 파일 경로들 순서대로 확인
        const possiblePaths = [
          'flexisvg.config.ts',
          'flexisvg.config.cjs',
          'flexisvg.config.js',
          'flexisvg.config.mjs',
        ];

        for (const p of possiblePaths) {
          const fullPath = path.resolve(process.cwd(), p);
          if (fs.existsSync(fullPath)) {
            configPath = fullPath;
            break;
          }
        }
      }

      // config 파일이 있으면 로드
      if (configPath && fs.existsSync(configPath)) {
        try {
          // .ts 파일은 jiti로 로드, 나머지는 require
          let loadedConfig;
          if (configPath.endsWith('.ts')) {
            const jiti = createJiti(__filename);
            loadedConfig = jiti(configPath);
          } else {
            loadedConfig = require(configPath);
          }
          config = loadedConfig.default || loadedConfig;
          console.log(`ℹ️  Using config from: ${configPath}`);
        } catch (err) {
          console.error('⚠️  Failed to load config file:', err.message);
          console.log('ℹ️  Using default configuration');
        }
      } else {
        console.log('ℹ️  No config file found, using default configuration');
      }

      await generate(config);
    } catch (error) {
      console.error('❌ Generation failed:', error.message);
      process.exit(1);
    }
  });

program.parse();
