/**
 * 工作区检测和管理工具
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export type WorkspaceType = 'wechat' | 'video' | 'general';

export interface WorkspaceConfig {
  name: string;
  description: string;
  features: {
    字数要求: string;
    配图?: string;
    风格: string;
    排版?: string;
    特殊限制?: string;
    结构?: string;
    特殊要求?: string;
  };
  briefTemplate: {
    必填字段: string[];
    建议字数范围: string;
    默认平台: string;
  };
  specificationTemplate: {
    结构建议: string;
    语言风格: string;
    配图要求?: string;
    特殊标注?: string;
  };
  auditRules: {
    AI味目标: string;
    段落长度?: string;
    句子长度?: string;
    敏感词检查: boolean;
    标点规范?: string;
    口语化程度?: string;
  };
  publishFormats: string[];
}

export interface WorkspaceDetectionResult {
  workspace: WorkspaceType;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  config: WorkspaceConfig;
}

/**
 * 加载工作区配置
 */
export async function loadWorkspaceConfig(): Promise<Record<WorkspaceType, WorkspaceConfig>> {
  const configPath = path.join(__dirname, '../../templates/workspace-config.json');
  const config = await fs.readJSON(configPath);
  return config.workspaces;
}

/**
 * 自动检测当前项目的工作区类型
 */
export async function detectWorkspace(projectPath: string): Promise<WorkspaceDetectionResult> {
  const configs = await loadWorkspaceConfig();

  // 规则1: 检查目录结构
  const workspaceFromDir = await detectFromDirectory(projectPath);
  if (workspaceFromDir) {
    return {
      workspace: workspaceFromDir,
      confidence: 'high',
      reason: `检测到项目位于 workspaces/${workspaceFromDir}/ 目录`,
      config: configs[workspaceFromDir]
    };
  }

  // 规则2: 检查brief文件
  const workspaceFromBrief = await detectFromBrief(projectPath);
  if (workspaceFromBrief) {
    return {
      workspace: workspaceFromBrief,
      confidence: 'high',
      reason: 'Brief文件中明确指定了平台类型',
      config: configs[workspaceFromBrief]
    };
  }

  // 规则3: 检查specification文件
  const workspaceFromSpec = await detectFromSpecification(projectPath);
  if (workspaceFromSpec) {
    return {
      workspace: workspaceFromSpec,
      confidence: 'medium',
      reason: 'Specification文件中包含特定工作区的特征标记',
      config: configs[workspaceFromSpec]
    };
  }

  // 默认: general
  return {
    workspace: 'general',
    confidence: 'low',
    reason: '未检测到明确的工作区特征,使用通用工作区',
    config: configs.general
  };
}

/**
 * 从目录结构检测
 */
async function detectFromDirectory(projectPath: string): Promise<WorkspaceType | null> {
  // 检查项目路径是否包含 workspaces/<type>/
  if (projectPath.includes('workspaces/wechat')) {
    return 'wechat';
  }
  if (projectPath.includes('workspaces/video')) {
    return 'video';
  }
  if (projectPath.includes('workspaces/general')) {
    return 'general';
  }
  return null;
}

/**
 * 从Brief文件检测
 */
async function detectFromBrief(projectPath: string): Promise<WorkspaceType | null> {
  try {
    // 查找_briefs目录
    const briefsDir = path.join(projectPath, '_briefs');
    if (!await fs.pathExists(briefsDir)) {
      // 尝试在父目录查找
      const parentBriefsDir = path.join(projectPath, '..', '..', '_briefs');
      if (!await fs.pathExists(parentBriefsDir)) {
        return null;
      }
    }

    // 读取最新的brief文件 (简化实现,实际应该读取对应项目的brief)
    const briefFiles = await fs.readdir(briefsDir || path.join(projectPath, '..', '..', '_briefs'));
    if (briefFiles.length === 0) {
      return null;
    }

    // 读取第一个brief文件
    const briefPath = path.join(briefsDir || path.join(projectPath, '..', '..', '_briefs'), briefFiles[0]);
    const briefContent = await fs.readFile(briefPath, 'utf-8');

    // 检测平台关键词
    const platformMapping: Record<string, WorkspaceType> = {
      '公众号': 'wechat',
      '微信': 'wechat',
      'wechat': 'wechat',
      '视频': 'video',
      'YouTube': 'video',
      'B站': 'video',
      'bilibili': 'video',
      '抖音': 'video'
    };

    for (const [keyword, workspace] of Object.entries(platformMapping)) {
      if (briefContent.includes(keyword)) {
        return workspace;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 从Specification文件检测
 */
async function detectFromSpecification(projectPath: string): Promise<WorkspaceType | null> {
  try {
    const specPath = path.join(projectPath, 'specification.md');
    if (!await fs.pathExists(specPath)) {
      return null;
    }

    const specContent = await fs.readFile(specPath, 'utf-8');

    // 检测视频脚本特征
    if (specContent.includes('[画面]') ||
        specContent.includes('[镜头]') ||
        specContent.includes('分镜')) {
      return 'video';
    }

    // 检测公众号特征
    if (specContent.includes('封面图') ||
        specContent.includes('公众号')) {
      return 'wechat';
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 获取工作区的推荐配置
 */
export async function getWorkspaceRecommendations(workspace: WorkspaceType): Promise<{
  briefTips: string[];
  writingTips: string[];
  auditTips: string[];
}> {
  const configs = await loadWorkspaceConfig();
  const config = configs[workspace];

  const recommendations = {
    wechat: {
      briefTips: [
        '字数建议: 800-3000字(根据主题深度调整)',
        '必须准备封面图(900x500px或2:1比例)',
        '注意敏感词限制,尤其是政治、宗教、医疗相关',
        '考虑是否需要"阅读原文"链接'
      ],
      writingTips: [
        '段落控制在150字以内,提升手机阅读体验',
        '开头3句话决定打开率,务必吸引人',
        '适度使用emoji增强表现力(但不要过度)',
        '结尾引导互动(点赞/在看/转发)'
      ],
      auditTips: [
        '检查是否有微信敏感词(可能导致不推荐)',
        '确保AI味 < 30%,否则可能被判定为低质内容',
        '检查外链是否可访问(微信对外链有限制)',
        '测试在手机端的阅读体验'
      ]
    },
    video: {
      briefTips: [
        '明确视频时长(1分钟约150-180字口播)',
        '确定目标平台(YouTube/B站/抖音风格差异大)',
        '考虑是否需要字幕(影响脚本格式)',
        '预留分镜和画面提示的空间'
      ],
      writingTips: [
        '极度口语化,写完后大声读一遍看是否顺口',
        '句子要短(< 30字),适合口播节奏',
        '标注画面提示 [画面: XX]、重点强调 [重点]',
        '前3秒Hook要抓人,否则观众会划走'
      ],
      auditTips: [
        'AI味要求更低(< 20%),因为口语化要求高',
        '检查是否有难读的词语或绕口的句子',
        '确认分镜标注清晰,方便拍摄团队理解',
        '测试口播节奏(可以自己录音试听)'
      ]
    },
    general: {
      briefTips: [
        '明确目标平台(知乎/博客/Medium风格不同)',
        '字数灵活,根据主题深度决定(500-5000字)',
        '考虑SEO需求(如果是个人博客)',
        '确定是否需要配图'
      ],
      writingTips: [
        '风格根据主题调整(技术文偏正式,生活类可轻松)',
        '使用Markdown标准格式,方便多平台发布',
        '长文章建议添加目录',
        '注意段落间的逻辑衔接'
      ],
      auditTips: [
        'AI味目标 < 30%',
        '检查格式在不同平台的兼容性',
        '确认链接和引用格式正确',
        '根据目标平台调整风格'
      ]
    }
  };

  return recommendations[workspace];
}

/**
 * 验证当前项目是否符合工作区要求
 */
export async function validateWorkspace(
  projectPath: string,
  expectedWorkspace: WorkspaceType
): Promise<{ valid: boolean; warnings: string[] }> {
  const detection = await detectWorkspace(projectPath);
  const warnings: string[] = [];

  if (detection.workspace !== expectedWorkspace) {
    warnings.push(
      `⚠️  检测到的工作区(${detection.workspace})与预期(${expectedWorkspace})不符`
    );
    warnings.push(`   原因: ${detection.reason}`);
    warnings.push(`   建议: 检查项目路径或brief文件中的平台设置`);
  }

  return {
    valid: detection.workspace === expectedWorkspace,
    warnings
  };
}
