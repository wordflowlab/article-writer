#!/usr/bin/env node

/**
 * postinstall.js
 *
 * npm 安装后自动执行的脚本
 * 主要功能：为 Codex 平台自动安装 prompts 到用户主目录
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 安装 Codex prompts 到用户主目录
 */
function installCodexPrompts() {
  const codexPromptsDir = path.join(os.homedir(), '.codex', 'prompts');
  const sourceDir = path.join(__dirname, '../dist/codex/.codex/prompts');

  // 检查源目录是否存在
  if (!fs.existsSync(sourceDir)) {
    // 如果 dist 目录不存在，说明是开发环境或首次安装
    // 静默跳过，不报错
    return;
  }

  // 检查是否已安装
  const testFile = path.join(codexPromptsDir, 'content-specify.md');
  if (fs.existsSync(testFile)) {
    // 已安装，跳过
    return;
  }

  try {
    console.log('');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('📋 Article Writer - Codex 平台设置', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');
    log('🔧 检测到 Codex 支持，正在安装 commands...', 'yellow');

    // 创建目标目录
    fs.mkdirSync(codexPromptsDir, { recursive: true });

    // 复制所有 .md 文件
    const files = fs.readdirSync(sourceDir);
    let installedCount = 0;

    files.forEach(file => {
      if (file.endsWith('.md')) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(codexPromptsDir, file);
        fs.copyFileSync(sourcePath, targetPath);
        installedCount++;
      }
    });

    console.log('');
    log(`✅ Codex commands 安装成功！`, 'green');
    log(`📦 已安装 ${installedCount} 个 commands`, 'green');
    log(`📁 安装位置: ~/.codex/prompts/`, 'green');
    console.log('');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('💡 使用方法', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');
    console.log('1. 启动 Codex:');
    console.log('   $ codex');
    console.log('');
    console.log('2. 查看可用 prompts:');
    console.log('   /prompts:');
    console.log('');
    console.log('3. 使用 commands:');
    console.log('   /prompts:content-specify 帮我写一篇文章');
    console.log('   /prompts:content-research');
    console.log('   /prompts:content-write');
    console.log('');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');

  } catch (error) {
    // 安装失败不影响主流程
    log(`⚠️  Codex prompts 安装失败: ${error.message}`, 'yellow');
    log(`💡 可以稍后手动运行: bash scripts/install-codex-prompts.sh`, 'yellow');
  }
}

/**
 * 主函数
 */
function main() {
  // 只在全局安装时执行
  const isGlobalInstall = process.env.npm_config_global === 'true';

  if (isGlobalInstall) {
    installCodexPrompts();
  }
}

// 执行
main();
