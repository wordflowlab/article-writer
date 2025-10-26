#!/usr/bin/env node

/**
 * 交互式微信格式化配置器
 * 允许用户通过 CLI 交互界面定制样式
 */

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import {
  themeOptions,
  fontFamilyOptions,
  fontSizeOptions,
  colorPresets,
  getColorPresetName,
  isValidHexColor,
} from '../utils/style-options.js';

interface FormattingConfig {
  theme: string;
  primaryColor: string;
  fontSize: string;
  fontFamily: string;
  isUseIndent: boolean;
  isUseJustify: boolean;
  isShowLineNumber: boolean;
  citeStatus: boolean;
  autoPreview: boolean;
}

/**
 * 读取当前配置
 */
function loadCurrentConfig(): FormattingConfig | null {
  const configPath = path.join(process.cwd(), '.content', 'config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ 错误: 未找到 .content/config.json');
    console.error('请确保在项目根目录运行此命令');
    return null;
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config.formatting || null;
  } catch (error) {
    console.error('❌ 读取配置文件失败:', error);
    return null;
  }
}

/**
 * 保存配置
 */
function saveConfig(formattingConfig: FormattingConfig): boolean {
  const configPath = path.join(process.cwd(), '.content', 'config.json');

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    config.formatting = formattingConfig;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('❌ 保存配置失败:', error);
    return false;
  }
}

/**
 * 显示当前配置
 */
function displayCurrentConfig(config: FormattingConfig): void {
  console.log('\n📋 当前配置:');
  console.log(`  主题: ${config.theme}`);
  console.log(`  主题色: ${getColorPresetName(config.primaryColor)}`);
  console.log(`  字号: ${config.fontSize}`);
  console.log(`  字体: ${config.fontFamily.split(',')[0]}...`);
  console.log(`  首行缩进: ${config.isUseIndent ? '是' : '否'}`);
  console.log(`  两端对齐: ${config.isUseJustify ? '是' : '否'}`);
  console.log(`  代码行号: ${config.isShowLineNumber ? '是' : '否'}`);
  console.log(`  链接转脚注: ${config.citeStatus ? '是' : '否'}`);
  console.log(`  自动预览: ${config.autoPreview ? '是' : '否'}\n`);
}

/**
 * 主函数:交互式配置流程
 */
export async function runFormatConfig(): Promise<void> {
  console.log('🎨 微信格式化配置器\n');

  // 1. 读取当前配置
  const currentConfig = loadCurrentConfig();
  if (!currentConfig) {
    process.exit(1);
  }

  displayCurrentConfig(currentConfig);

  // 2. 确认是否要修改
  const { shouldModify } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldModify',
      message: '是否要修改配置?',
      default: true,
    },
  ]);

  if (!shouldModify) {
    console.log('✓ 已取消');
    return;
  }

  // 3. 主题选择
  const { theme } = await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: '选择主题',
      choices: themeOptions.map(opt => ({
        value: opt.value,
        name: `${opt.name} - ${opt.description}`,
      })),
      default: currentConfig.theme,
    },
  ]);

  // 4. 主题色选择
  const colorChoices = [
    ...colorPresets.map(opt => ({
      value: opt.value,
      name: `${opt.name} (${opt.description})`,
    })),
    {
      value: 'custom',
      name: '自定义(输入十六进制)',
    },
  ];

  let { primaryColor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'primaryColor',
      message: '选择主题色',
      choices: colorChoices,
      default: currentConfig.primaryColor,
    },
  ]);

  // 如果选择自定义颜色
  if (primaryColor === 'custom') {
    let customColor = '';
    let isValid = false;

    while (!isValid) {
      const result = await inquirer.prompt([
        {
          type: 'input',
          name: 'customColor',
          message: '输入十六进制颜色值(如 #3f51b5)',
          default: currentConfig.primaryColor,
        },
      ]);

      customColor = result.customColor;

      if (isValidHexColor(customColor)) {
        isValid = true;
        primaryColor = customColor;
      } else {
        console.log('❌ 无效的颜色格式,请使用 #RRGGBB 格式');
      }
    }
  }

  // 5. 字号选择
  const { fontSize } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fontSize',
      message: '选择字号',
      choices: fontSizeOptions.map(opt => ({
        value: opt.value,
        name: `${opt.name} (${opt.description})`,
      })),
      default: currentConfig.fontSize,
    },
  ]);

  // 6. 字体选择
  const { fontFamily } = await inquirer.prompt([
    {
      type: 'list',
      name: 'fontFamily',
      message: '选择字体',
      choices: fontFamilyOptions.map(opt => ({
        value: opt.value,
        name: `${opt.name} - ${opt.description}`,
      })),
      default: currentConfig.fontFamily,
    },
  ]);

  // 7. 开关选项
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isUseIndent',
      message: '段落首行缩进?',
      default: currentConfig.isUseIndent,
    },
    {
      type: 'confirm',
      name: 'isUseJustify',
      message: '文本两端对齐?',
      default: currentConfig.isUseJustify,
    },
    {
      type: 'confirm',
      name: 'isShowLineNumber',
      message: '代码块显示行号?',
      default: currentConfig.isShowLineNumber,
    },
    {
      type: 'confirm',
      name: 'citeStatus',
      message: '链接转为脚注?',
      default: currentConfig.citeStatus,
    },
    {
      type: 'confirm',
      name: 'autoPreview',
      message: '自动打开浏览器预览?',
      default: currentConfig.autoPreview,
    },
  ]);

  const { isUseIndent, isUseJustify, isShowLineNumber, citeStatus, autoPreview } = answers;

  // 8. 构建新配置
  const newConfig: FormattingConfig = {
    theme,
    primaryColor,
    fontSize,
    fontFamily,
    isUseIndent,
    isUseJustify,
    isShowLineNumber,
    citeStatus,
    autoPreview,
  };

  // 9. 显示新配置并确认
  console.log('\n✨ 新配置预览:');
  displayCurrentConfig(newConfig);

  const { confirmSave } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmSave',
      message: '确认保存此配置?',
      default: true,
    },
  ]);

  if (!confirmSave) {
    console.log('✓ 已取消保存');
    return;
  }

  // 10. 保存配置
  if (saveConfig(newConfig)) {
    console.log('\n✓ 配置已保存到 .content/config.json');
    console.log('✓ 下次运行 /publish 时将使用新配置');

    // 11. 可选:生成预览
    if (newConfig.autoPreview) {
      console.log('\n📝 提示: autoPreview 已启用');
      console.log('   下次运行 /publish wechat 时会自动打开浏览器预览');
    }

    // 12. 提示下一步操作
    console.log('\n💡 下一步:');
    console.log('   1. 运行 /publish wechat 生成格式化 HTML');
    console.log('   2. 在浏览器中预览效果');
    console.log('   3. 满意后复制到微信公众号编辑器\n');
  } else {
    process.exit(1);
  }
}

/**
 * 保存当前配置为预设
 */
export async function savePreset(): Promise<void> {
  console.log('💾 保存配置预设\n');

  const currentConfig = loadCurrentConfig();
  if (!currentConfig) {
    process.exit(1);
  }

  displayCurrentConfig(currentConfig);

  const { presetName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'presetName',
      message: '为此预设命名(如 tech, life, design):',
      validate: (input: string) => {
        if (!input.trim()) {
          return '预设名称不能为空';
        }
        if (!/^[a-z0-9_-]+$/i.test(input)) {
          return '预设名称只能包含字母、数字、下划线和连字符';
        }
        return true;
      },
    },
  ]);

  const presetPath = path.join(process.cwd(), '.content', `config-${presetName}.json`);

  if (fs.existsSync(presetPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `预设 "${presetName}" 已存在,是否覆盖?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log('✓ 已取消保存');
      return;
    }
  }

  try {
    const configContent = fs.readFileSync(path.join(process.cwd(), '.content', 'config.json'), 'utf-8');
    fs.writeFileSync(presetPath, configContent);
    console.log(`\n✓ 已保存预设: ${presetName}`);
    console.log(`✓ 文件位置: .content/config-${presetName}.json\n`);
  } catch (error) {
    console.error('❌ 保存预设失败:', error);
    process.exit(1);
  }
}

/**
 * 加载已保存的预设
 */
export async function loadPreset(): Promise<void> {
  console.log('📂 加载配置预设\n');

  const contentDir = path.join(process.cwd(), '.content');

  if (!fs.existsSync(contentDir)) {
    console.error('❌ 错误: 未找到 .content/ 目录');
    process.exit(1);
  }

  // 查找所有预设文件
  const files = fs.readdirSync(contentDir);
  const presetFiles = files.filter(f => f.startsWith('config-') && f.endsWith('.json') && f !== 'config.json');

  if (presetFiles.length === 0) {
    console.log('暂无保存的预设。');
    console.log('提示: 使用 /format-config --save-preset 保存当前配置为预设\n');
    return;
  }

  console.log(`找到 ${presetFiles.length} 个预设:\n`);

  const presetChoices = presetFiles.map(f => {
    const presetName = f.replace('config-', '').replace('.json', '');
    return {
      value: f,
      name: presetName,
    };
  });

  const { selectedPreset } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedPreset',
      message: '选择要加载的预设:',
      choices: [
        ...presetChoices,
        { value: 'cancel', name: '取消' },
      ],
    },
  ]);

  if (selectedPreset === 'cancel') {
    console.log('✓ 已取消');
    return;
  }

  // 读取预设内容
  const presetPath = path.join(contentDir, selectedPreset);
  const presetContent = fs.readFileSync(presetPath, 'utf-8');
  const presetConfig = JSON.parse(presetContent);

  console.log('\n预设配置:');
  displayCurrentConfig(presetConfig.formatting);

  const { confirmLoad } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmLoad',
      message: '确认加载此预设?',
      default: true,
    },
  ]);

  if (!confirmLoad) {
    console.log('✓ 已取消加载');
    return;
  }

  // 将预设内容写入主配置文件
  const configPath = path.join(contentDir, 'config.json');
  fs.writeFileSync(configPath, presetContent);

  console.log('\n✓ 已加载预设配置');
  console.log('✓ 下次运行 /publish 时将使用此配置\n');
}

/**
 * 重置配置为默认值
 */
export async function resetFormatConfig(): Promise<void> {
  console.log('🔄 重置微信格式化配置\n');

  const currentConfig = loadCurrentConfig();
  if (!currentConfig) {
    process.exit(1);
  }

  console.log('⚠️  将恢复为默认配置:');
  const defaultConfig: FormattingConfig = {
    theme: 'default',
    primaryColor: '#3f51b5',
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    isUseIndent: false,
    isUseJustify: false,
    isShowLineNumber: false,
    citeStatus: true,
    autoPreview: false,
  };

  displayCurrentConfig(defaultConfig);

  const { confirmReset } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmReset',
      message: '确认重置为默认配置?',
      default: false,
    },
  ]);

  if (!confirmReset) {
    console.log('✓ 已取消重置');
    return;
  }

  if (saveConfig(defaultConfig)) {
    console.log('\n✓ 已重置为默认配置');
  } else {
    process.exit(1);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  // 检查命令行参数
  const args = process.argv.slice(2);

  if (args.includes('--reset')) {
    resetFormatConfig().catch(error => {
      console.error('❌ 运行出错:', error);
      process.exit(1);
    });
  } else if (args.includes('--save-preset')) {
    savePreset().catch(error => {
      console.error('❌ 运行出错:', error);
      process.exit(1);
    });
  } else if (args.includes('--load-preset')) {
    loadPreset().catch(error => {
      console.error('❌ 运行出错:', error);
      process.exit(1);
    });
  } else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎨 微信格式化配置器

用法:
  /format-config                交互式配置样式
  /format-config --reset        重置为默认配置
  /format-config --save-preset  保存当前配置为预设
  /format-config --load-preset  加载已保存的预设
  /format-config --help         显示此帮助信息

示例:
  # 启动交互式配置
  /format-config

  # 保存当前配置为"技术文章"预设
  /format-config --save-preset
  > 为此预设命名: tech

  # 加载"技术文章"预设
  /format-config --load-preset
  > 选择: tech

详细文档: templates/commands/format-config.md
    `);
  } else {
    runFormatConfig().catch(error => {
      console.error('❌ 运行出错:', error);
      process.exit(1);
    });
  }
}
