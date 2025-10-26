/**
 * 进度条显示组件
 */

import type { CrawlProgress } from './types.js';

export class ProgressBar {
  private lastUpdate = 0;
  private updateInterval = 500; // 更新间隔（毫秒）

  /**
   * 更新进度
   */
  update(progress: CrawlProgress): void {
    const now = Date.now();
    
    // 限制更新频率
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }
    this.lastUpdate = now;

    const percent = Math.min(100, Math.floor((progress.current / progress.total) * 100));
    const bar = this.createBar(percent);
    const speed = progress.speed || 0;
    const eta = this.calculateETA(progress);

    // 清除当前行
    process.stdout.write('\r\x1b[K');

    // 输出进度信息
    const info = [
      `🔄 [${bar}] ${percent}%`,
      `(${progress.current}/${progress.total})`,
      `队列: ${progress.queue}`,
      `速度: ${speed.toFixed(1)} 页/秒`,
      eta ? `预计: ${this.formatTime(eta)}` : ''
    ].filter(Boolean).join(' | ');

    process.stdout.write(info);
  }

  /**
   * 完成进度
   */
  complete(duration: number, totalPages: number): void {
    process.stdout.write('\r\x1b[K'); // 清除当前行
    console.log(`✅ 爬取完成: ${totalPages} 页, 用时 ${this.formatDuration(duration)}`);
  }

  /**
   * 创建进度条
   */
  private createBar(percent: number, width = 30): string {
    const filled = Math.floor(width * percent / 100);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  /**
   * 计算剩余时间
   */
  private calculateETA(progress: CrawlProgress): number | null {
    if (!progress.speed || progress.speed === 0) {
      return null;
    }

    const remaining = progress.total - progress.current;
    return remaining / progress.speed;
  }

  /**
   * 格式化时间（秒）
   */
  private formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${Math.floor(seconds)}秒`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes < 60) {
      return `${minutes}分${remainingSeconds}秒`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}小时${remainingMinutes}分`;
  }

  /**
   * 格式化持续时间（毫秒）
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours}小时${remainingMinutes}分`;
    }
    
    if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes}分${remainingSeconds}秒`;
    }
    
    return `${seconds}秒`;
  }
}

