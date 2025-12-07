#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { program } = require('commander');
const { generate } = require('../dist/index');

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
        'public/icons/static',
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
  .option('-c, --config <path>', 'Path to config file', 'svg-sprite.config.js')
  .action(async (options) => {
    try {
      let config = {};

      // config 파일이 있으면 로드
      const configPath = path.resolve(process.cwd(), options.config);
      try {
        config = require(configPath);
        console.log(`ℹ️  Using config from: ${configPath}`);
      } catch (_err) {
        console.log('ℹ️  No config file found, using default configuration');
      }

      await generate(config);
    } catch (error) {
      console.error('❌ Generation failed:', error.message);
      process.exit(1);
    }
  });

program.parse();
