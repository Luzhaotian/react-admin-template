import * as fs from 'fs';
import * as path from 'path';
import { ProjectProfile } from './project-analyzer';

/**
 * UI组件默认配置
 */
export interface UIComponentDefaults {
  form: {
    layout: 'horizontal' | 'vertical' | 'inline';
    labelAlign: 'left' | 'right' | 'top';
    size: 'large' | 'middle' | 'small';
    colon: boolean;
  };
  table: {
    pagination: boolean;
    rowKey: string;
    scroll: { y?: number } | boolean;
    bordered: boolean;
    size: 'default' | 'middle' | 'small';
  };
  modal: {
    width: number;
    destroyOnClose: boolean;
    maskClosable: boolean;
    keyboard: boolean;
  };
}

/**
 * API配置模式
 */
export interface APIPattern {
  baseURL: string;
  version?: string;
  format?: 'json' | 'rest';
  auth?: {
    type: 'bearer' | 'basic' | 'custom';
    header?: string;
  };
  response: {
    success: string;
    data: string;
    message: string;
    code: string;
  };
}

/**
 * 自定义规则
 */
export interface CustomRules {
  dateFormats: string[];
  timeFormats: string[];
  currencies: string[];
  phoneRegex: string;
  emailRegex: string;
  validationRules: Record<string, any>;
}

/**
 * 生成历史记录
 */
export interface GenerationHistory {
  timestamp: string;
  description: string;
  filesGenerated: string[];
  componentType: string;
  options: any;
}

/**
 * 项目记忆
 */
export interface ProjectMemory {
  projectInfo: {
    name: string;
    version: string;
    description?: string;
    techStack: {
      framework: string;
      uiLibrary: string;
      stateManagement?: string;
      buildTool: string;
      packageManager: string;
      cssFramework?: string;
      testingFramework?: string;
    };
    componentPatterns: {
      naming: 'kebab-case' | 'PascalCase' | 'camelCase';
      structure: string;
      style: string;
    };
    lastUpdated: string;
  };
  uiComponents: {
    defaults: UIComponentDefaults;
    customComponents: Record<string, any>;
    componentMappings: Record<string, string>;
  };
  apiPatterns: {
    default: APIPattern;
    customEndpoints: Record<string, APIPattern>;
  };
  customRules: CustomRules;
  generationHistory: GenerationHistory[];
  projectSpecific: {
    constants: Record<string, any>;
    utils: string[];
    hooks: string[];
    types: string[];
  };
}

/**
 * 默认项目记忆
 */
const DEFAULT_MEMORY: ProjectMemory = {
  projectInfo: {
    name: '',
    version: '1.0.0',
    techStack: {
      framework: 'React',
      uiLibrary: 'Ant Design',
      buildTool: 'Vite',
      packageManager: 'npm'
    },
    componentPatterns: {
      naming: 'PascalCase',
      structure: 'Standard page layout',
      style: 'CSS Modules'
    },
    lastUpdated: new Date().toISOString()
  },
  uiComponents: {
    defaults: {
      form: {
        layout: 'horizontal',
        labelAlign: 'left',
        size: 'middle',
        colon: true
      },
      table: {
        pagination: true,
        rowKey: 'id',
        scroll: { y: 500 },
        bordered: true,
        size: 'middle'
      },
      modal: {
        width: 600,
        destroyOnClose: false,
        maskClosable: true,
        keyboard: true
      }
    },
    customComponents: {},
    componentMappings: {}
  },
  apiPatterns: {
    default: {
      baseURL: '/api',
      format: 'json',
      auth: {
        type: 'bearer',
        header: 'Authorization'
      },
      response: {
        success: 'success',
        data: 'data',
        message: 'message',
        code: 'code'
      }
    },
    customEndpoints: {}
  },
  customRules: {
    dateFormats: ['YYYY-MM-DD', 'YYYY/MM/DD'],
    timeFormats: ['HH:mm:ss', 'HH:mm'],
    currencies: ['CNY', 'USD', 'EUR'],
    phoneRegex: '^1[3-9]\\d{9}$',
    emailRegex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    validationRules: {}
  },
  generationHistory: [],
  projectSpecific: {
    constants: [],
    utils: [],
    hooks: [],
    types: []
  }
};

/**
 * 记忆管理器
 */
export class MemoryManager {
  private memoryDir: string;
  private memoryFile: string;

  constructor(private projectPath: string) {
    this.memoryDir = path.join(projectPath, '.pmgr');
    this.memoryFile = path.join(this.memoryDir, 'project-memory.json');
  }

  /**
   * 创建项目记忆
   */
  async createProjectMemory(projectProfile: ProjectProfile): Promise<ProjectMemory> {
    console.log('🧠 创建项目记忆...');

    const memory: ProjectMemory = {
      ...DEFAULT_MEMORY,
      projectInfo: {
        ...DEFAULT_MEMORY.projectInfo,
        name: projectProfile.name,
        version: '1.0.0',
        description: `Auto-generated memory for ${projectProfile.name}`,
        techStack: projectProfile.techStack,
        componentPatterns: {
          naming: projectProfile.namingConventions.component,
          structure: projectProfile.componentPatterns[0]?.structure || 'Standard page layout',
          style: projectProfile.componentPatterns[0]?.style || 'CSS Modules'
        },
        lastUpdated: new Date().toISOString()
      }
    };

    await this.saveMemory(memory);
    return memory;
  }

  /**
   * 加载项目记忆
   */
  async loadMemory(): Promise<ProjectMemory | null> {
    try {
      if (!await this.fileExists(this.memoryFile)) {
        return null;
      }

      const content = await fs.promises.readFile(this.memoryFile, 'utf-8');
      const memory = JSON.parse(content);

      // 验证记忆文件格式
      if (!this.validateMemory(memory)) {
        throw new Error('Invalid memory file format');
      }

      return memory;
    } catch (error) {
      console.error('Failed to load memory:', error);
      return null;
    }
  }

  /**
   * 保存项目记忆
   */
  async saveMemory(memory: ProjectMemory): Promise<void> {
    // 确保记忆目录存在
    await fs.promises.mkdir(this.memoryDir, { recursive: true });

    const content = JSON.stringify(memory, null, 2);
    await fs.promises.writeFile(this.memoryFile, content, 'utf-8');
  }

  /**
   * 更新项目记忆
   */
  async updateMemory(update: Partial<ProjectMemory>): Promise<void> {
    let memory = await this.loadMemory();
    if (!memory) {
      memory = DEFAULT_MEMORY;
    }

    const updatedMemory = {
      ...memory,
      ...update,
      projectInfo: {
        ...memory.projectInfo,
        ...update.projectInfo,
        lastUpdated: new Date().toISOString()
      }
    };

    await this.saveMemory(updatedMemory);
  }

  /**
   * 添加生成历史
   */
  async addGenerationHistory(description: string, filesGenerated: string[], componentType: string, options: any): Promise<void> {
    const memory = await this.loadMemory();
    if (!memory) return;

    const history: GenerationHistory = {
      timestamp: new Date().toISOString(),
      description,
      filesGenerated,
      componentType,
      options
    };

    memory.generationHistory.unshift(history);

    // 保持最近100条记录
    if (memory.generationHistory.length > 100) {
      memory.generationHistory = memory.generationHistory.slice(0, 100);
    }

    await this.saveMemory(memory);
  }

  /**
   * 获取UI组件配置
   */
  async getUIComponentConfig(componentType: string): Promise<any> {
    const memory = await this.loadMemory();
    if (!memory) return DEFAULT_MEMORY.uiComponents.defaults[componentType];

    // 先尝试获取自定义组件配置
    if (memory.uiComponents.customComponents[componentType]) {
      return memory.uiComponents.customComponents[componentType];
    }

    return memory.uiComponents.defaults[componentType];
  }

  /**
   * 设置UI组件配置
   */
  async setUIComponentConfig(componentType: string, config: any): Promise<void> {
    await this.updateMemory({
      uiComponents: {
        ...DEFAULT_MEMORY.uiComponents,
        customComponents: {
          ...DEFAULT_MEMORY.uiComponents.customComponents,
          [componentType]: config
        }
      }
    });
  }

  /**
   * 添加自定义规则
   */
  async addCustomRule(type: keyof CustomRules, rule: any): Promise<void> {
    await this.updateMemory({
      customRules: {
        ...DEFAULT_MEMORY.customRules,
        [type]: rule
      }
    });
  }

  /**
   * 导出记忆
   */
  async exportMemory(): Promise<string> {
    const memory = await this.loadMemory();
    if (!memory) throw new Error('No memory to export');

    return JSON.stringify(memory, null, 2);
  }

  /**
   * 导入记忆
   */
  async importMemory(memoryJson: string): Promise<void> {
    try {
      const memory = JSON.parse(memoryJson);
      if (!this.validateMemory(memory)) {
        throw new Error('Invalid memory format');
      }

      await this.saveMemory(memory);
      console.log('✅ 记忆导入成功');
    } catch (error) {
      console.error('记忆导入失败:', error);
      throw error;
    }
  }

  /**
   * 获取记忆统计
   */
  async getMemoryStats(): Promise<{
    totalGenerations: number;
    lastGeneration?: string;
    componentTypes: string[];
    techStack: string;
  }> {
    const memory = await this.loadMemory();
    if (!memory) {
      return {
        totalGenerations: 0,
        componentTypes: [],
        techStack: 'Unknown'
      };
    }

    const componentTypes = [...new Set(memory.generationHistory.map(h => h.componentType))];
    const lastGeneration = memory.generationHistory[0]?.timestamp;

    return {
      totalGenerations: memory.generationHistory.length,
      lastGeneration,
      componentTypes,
      techStack: memory.projectInfo.techStack.framework
    };
  }

  /**
   * 验证记忆文件
   */
  private validateMemory(memory: any): memory is ProjectMemory {
    return (
      memory &&
      memory.projectInfo &&
      memory.uiComponents &&
      memory.apiPatterns &&
      memory.customRules &&
      memory.generationHistory !== undefined
    );
  }

  /**
   * 检查文件是否存在
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 清理旧的记忆
   */
  async cleanupOldMemories(keepVersions: number = 5): Promise<void> {
    const memoryDir = this.memoryDir;
    if (!await this.fileExists(memoryDir)) return;

    const files = await fs.promises.readdir(memoryDir);
    const memoryFiles = files
      .filter(file => file.startsWith('project-memory-'))
      .sort()
      .reverse();

    // 删除旧版本
    for (let i = keepVersions; i < memoryFiles.length; i++) {
      const filePath = path.join(memoryDir, memoryFiles[i]);
      await fs.promises.unlink(filePath);
    }
  }
}