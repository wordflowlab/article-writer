#!/usr/bin/env node
/**
 * Interactive selection utilities for Article Writer
 * Provides arrow-key based selection interface similar to spec-kit
 */

import inquirer from 'inquirer';
import chalk from 'chalk';

export interface AIConfig {
  name: string;
  dir: string;
  commandsDir: string;
  displayName: string;
  extraDirs?: string[];
}

/**
 * Display project banner
 */
export function displayProjectBanner(): void {
  console.log('');
  console.log(chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log(chalk.cyan.bold('  Article Writer - AI 驱动的智能写作系统'));
  console.log(chalk.cyan.bold('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  console.log('');
}

/**
 * Select AI assistant interactively
 */
export async function selectAIAssistant(aiConfigs: AIConfig[]): Promise<string> {
  const choices = aiConfigs.map(config => ({
    name: `${chalk.cyan(config.name.padEnd(12))} ${chalk.dim(`(${config.displayName})`)}`,
    value: config.name,
    short: config.name
  }));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'ai',
      message: chalk.bold('选择你的 AI 助手:'),
      choices,
      default: 'claude',
      pageSize: 15
    }
  ]);

  return answer.ai;
}

/**
 * Select workspace type interactively
 */
export async function selectWorkspace(): Promise<string> {
  const workspaceChoices = [
    {
      name: `${chalk.cyan('wechat'.padEnd(12))} ${chalk.dim('(公众号/自媒体文章)')}`,
      value: 'wechat',
      short: 'wechat'
    },
    {
      name: `${chalk.cyan('video'.padEnd(12))} ${chalk.dim('(视频脚本/口播稿)')}`,
      value: 'video',
      short: 'video'
    },
    {
      name: `${chalk.cyan('general'.padEnd(12))} ${chalk.dim('(通用内容创作)')}`,
      value: 'general',
      short: 'general'
    }
  ];

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'workspace',
      message: chalk.bold('选择工作区类型:'),
      choices: workspaceChoices,
      default: 'wechat'
    }
  ]);

  return answer.workspace;
}

/**
 * Select script type interactively
 */
export async function selectScriptType(): Promise<string> {
  const scriptChoices = [
    {
      name: `${chalk.cyan('sh'.padEnd(12))} ${chalk.dim('(POSIX Shell - macOS/Linux)')}`,
      value: 'sh',
      short: 'sh'
    },
    {
      name: `${chalk.cyan('ps'.padEnd(12))} ${chalk.dim('(PowerShell - Windows)')}`,
      value: 'ps',
      short: 'ps'
    }
  ];

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'scriptType',
      message: chalk.bold('选择脚本类型:'),
      choices: scriptChoices,
      default: 'sh'
    }
  ]);

  return answer.scriptType;
}

/**
 * Display initialization step
 */
export function displayStep(step: number, total: number, message: string): void {
  console.log(chalk.dim(`[${step}/${total}]`) + ' ' + message);
}

/**
 * Select formatting theme interactively (for wechat workspace)
 */
export async function selectFormattingTheme(): Promise<{
  theme: string;
  primaryColor: string;
}> {
  const themeChoices = [
    {
      name: `${chalk.cyan('default'.padEnd(12))} ${chalk.dim('(经典样式 - 适合大多数场景)')}`,
      value: 'default',
      short: 'default'
    },
    {
      name: `${chalk.cyan('grace'.padEnd(12))} ${chalk.dim('(优雅样式 - 圆角阴影效果)')}`,
      value: 'grace',
      short: 'grace'
    },
    {
      name: `${chalk.cyan('simple'.padEnd(12))} ${chalk.dim('(简洁样式 - 扁平化设计)')}`,
      value: 'simple',
      short: 'simple'
    }
  ];

  const themeAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'theme',
      message: chalk.bold('选择微信文章主题:'),
      choices: themeChoices,
      default: 'default'
    }
  ]);

  const colorChoices = [
    {
      name: `${chalk.hex('#3f51b5')('■')} 靛蓝 (默认)`,
      value: '#3f51b5',
      short: '靛蓝'
    },
    {
      name: `${chalk.hex('#1976d2')('■')} 蓝色`,
      value: '#1976d2',
      short: '蓝色'
    },
    {
      name: `${chalk.hex('#388e3c')('■')} 绿色`,
      value: '#388e3c',
      short: '绿色'
    },
    {
      name: `${chalk.hex('#d32f2f')('■')} 红色`,
      value: '#d32f2f',
      short: '红色'
    },
    {
      name: `${chalk.hex('#f57c00')('■')} 橙色`,
      value: '#f57c00',
      short: '橙色'
    },
    {
      name: `${chalk.hex('#000000')('■')} 黑色`,
      value: '#000000',
      short: '黑色'
    }
  ];

  const colorAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'color',
      message: chalk.bold('选择主题色:'),
      choices: colorChoices,
      default: '#3f51b5'
    }
  ]);

  return {
    theme: themeAnswer.theme,
    primaryColor: colorAnswer.color
  };
}

/**
 * Check if running in interactive terminal
 */
export function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}
