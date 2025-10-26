/**
 * 微信格式化样式配置选项
 * 参考 doocs/md 的样式系统,提供预设选项
 */

export interface StyleOption {
  value: string;
  name: string;
  description?: string;
}

/**
 * 主题选项
 */
export const themeOptions: StyleOption[] = [
  {
    value: 'default',
    name: '经典',
    description: '经典样式,适合大多数场景',
  },
  {
    value: 'grace',
    name: '优雅',
    description: '圆角阴影效果,适合设计/生活类文章',
  },
  {
    value: 'simple',
    name: '简洁',
    description: '扁平化设计,适合技术/极简风文章',
  },
];

/**
 * 字体选项
 */
export const fontFamilyOptions: StyleOption[] = [
  {
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    name: '无衬线',
    description: '适合现代感强的文章',
  },
  {
    value: 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
    name: '衬线',
    description: '适合传统、正式的文章',
  },
  {
    value: 'Menlo, Monaco, "Courier New", monospace',
    name: '等宽',
    description: '适合技术类文章',
  },
];

/**
 * 字号选项
 */
export const fontSizeOptions: StyleOption[] = [
  { value: '14px', name: '14px', description: '更小' },
  { value: '15px', name: '15px', description: '稍小' },
  { value: '16px', name: '16px', description: '推荐' },
  { value: '17px', name: '17px', description: '稍大' },
  { value: '18px', name: '18px', description: '更大' },
];

/**
 * 主题色预设(参考 doocs/md)
 */
export const colorPresets: StyleOption[] = [
  { value: '#0F4C81', name: '经典蓝', description: '稳重冷静' },
  { value: '#009874', name: '翡翠绿', description: '自然平衡' },
  { value: '#FA5151', name: '活力橘', description: '热情活力' },
  { value: '#FECE00', name: '柠檬黄', description: '明亮温暖' },
  { value: '#92617E', name: '薰衣紫', description: '优雅神秘' },
  { value: '#55C9EA', name: '天空蓝', description: '清爽自由' },
  { value: '#B76E79', name: '玫瑰金', description: '奢华现代' },
  { value: '#556B2F', name: '橄榄绿', description: '沉稳自然' },
  { value: '#333333', name: '石墨黑', description: '内敛极简' },
  { value: '#A9A9A9', name: '雾烟灰', description: '柔和低调' },
  { value: '#FFB7C5', name: '樱花粉', description: '浪漫甜美' },
];

/**
 * 根据十六进制颜色值查找预设名称
 */
export function getColorPresetName(color: string): string {
  const preset = colorPresets.find(p => p.value.toLowerCase() === color.toLowerCase());
  return preset ? `${preset.name} (${preset.description})` : color;
}

/**
 * 验证十六进制颜色格式
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}
