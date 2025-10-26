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
 * Check if running in interactive terminal
 */
export function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}
