import { ProjectAnalyzer } from './project-analyzer';
import { MemoryManager } from './memory-manager';
import { CodeGenerator, PageConfig, GenerationOptions } from './code-generator';
import * as path from 'path';

/**
 * PMGR 智能体 - 通用前端开发助手
 */
export class PMGRAgent {
  private analyzer: ProjectAnalyzer;
  private memoryManager: MemoryManager;
  private codeGenerator: CodeGenerator;
  private memory: any;
  private initialized = false;

  constructor(private projectPath: string = process.cwd()) {
    this.analyzer = new ProjectAnalyzer(this.projectPath);
    this.memoryManager = new MemoryManager(this.projectPath);
  }

  /**
   * 初始化智能体
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🤖 初始化 PMGR 智能体...');

    // 尝试加载现有记忆
    this.memory = await this.memoryManager.loadMemory();

    // 如果没有记忆，创建新的
    if (!this.memory) {
      console.log('📊 分析项目结构...');
      const projectProfile = await this.analyzer.analyzeProject();
      this.memory = await this.memoryManager.createProjectMemory(projectProfile);
      console.log('✅ 项目记忆已创建');
    }

    // 创建代码生成器
    this.codeGenerator = new CodeGenerator(this.memory);

    this.initialized = true;
    console.log('🎉 PMGR 智能体初始化完成');
  }

  /**
   * 根据自然语言生成代码
   */
  async generateCode(description: string, options?: GenerationOptions): Promise<{
    files: Array<{ path: string; content: string; type: string }>;
    dependencies: string[];
    instructions: string[];
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('📝 接收需求描述:', description);

    // 生成代码
    const result = await this.codeGenerator.generateFromDescription(description, {
      type: 'page',
      ...options
    });

    // 添加到生成历史
    await this.memoryManager.addGenerationHistory(
      description,
      result.files.map(f => f.path),
      'page',
      options || {}
    );

    return {
      files: result.files,
      dependencies: result.dependencies,
      instructions: result.instructions
    };
  }

  /**
   * 分析项目结构
   */
  async analyzeProjectStructure(): Promise<{
    techStack: any;
    components: any[];
    patterns: any;
    naming: any;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const projectProfile = await this.analyzer.analyzeProject();

    return {
      techStack: projectProfile.techStack,
      components: projectProfile.componentPatterns,
      patterns: projectProfile.componentPatterns,
      naming: projectProfile.namingConventions
    };
  }

  /**
   * 获取项目统计
   */
  async getProjectStats(): Promise<{
    totalGenerations: number;
    lastGeneration?: string;
    componentTypes: string[];
    techStack: string;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    return await this.memoryManager.getMemoryStats();
  }

  /**
   * 添加自定义规则
   */
  async addCustomRule(type: string, rule: any): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.memoryManager.addCustomRule(type as any, rule);
  }

  /**
   * 更新项目记忆
   */
  async updateProjectMemory(update: any): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.memoryManager.updateMemory(update);
  }

  /**
   * 导出项目记忆
   */
  async exportMemory(): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    return await this.memoryManager.exportMemory();
  }

  /**
   * 导入项目记忆
   */
  async importMemory(memoryJson: string): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.memoryManager.importMemory(memoryJson);
  }

  /**
   * 生成常见的CRUD页面
   */
  async generateCRUDPage(
    name: string,
    fields: Array<{
      key: string;
      label: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'select';
      options?: Array<{ label: string; value: any }>;
      required?: boolean;
    }>,
    options?: {
      apiPath?: string;
      enableCreate?: boolean;
      enableEdit?: boolean;
      enableDelete?: boolean;
      enableExport?: boolean;
    }
  ): Promise<{
    files: Array<{ path: string; content: string; type: string }>;
    instructions: string[];
  }> {
    // 构建自然语言描述
    let description = `创建一个${name}管理页面，包含：\n`;
    description += '搜索栏：';

    const searchFields = fields.map(field => {
      if (field.type === 'select') {
        return `${field.label}（下拉选择）`;
      } else if (field.type === 'date') {
        return `${field.label}（日期选择）`;
      } else {
        return `${field.label}（输入框）`;
      }
    }).join('、');
    description += `${searchFields}\n`;

    description += '表格列：';
    const tableColumns = fields.map(field => field.label).join('、');
    description += `${tableColumns}\n`;

    if (options?.enableCreate) {
      description += '支持新增功能\n';
    }
    if (options?.enableEdit) {
      description += '支持编辑功能\n';
    }
    if (options?.enableDelete) {
      description += '支持删除功能\n';
    }

    return await this.generateCode(description, {
      type: 'page',
      outputPath: options?.apiPath ? path.join('src/pages', options.apiPath) : 'src/pages'
    });
  }

  /**
   * 快速创建组件
   */
  async createComponent(
    name: string,
    type: 'form' | 'table' | 'modal' | 'search',
    props: Record<string, any>
  ): Promise<{
    files: Array<{ path: string; content: string; type: string }>;
    instructions: string[];
  }> {
    const description = `创建一个${name}${type}组件，${JSON.stringify(props, null, 2)}`;

    return await this.generateCode(description, {
      type: type as any,
      outputPath: 'src/components'
    });
  }

  /**
   * 获取生成建议
   */
  async getGenerationSuggestions(): Promise<string[]> {
    if (!this.memory) {
      await this.initialize();
    }

    const suggestions: string[] = [];

    // 基于历史记录提供建议
    const history = this.memory?.generationHistory || [];
    if (history.length === 0) {
      suggestions.push('尝试生成一个基础的CRUD页面');
      suggestions.push('创建一个带搜索的表格组件');
      suggestions.push('生成一个表单弹窗组件');
    } else {
      // 分析最近生成的类型
      const recentTypes = history.slice(0, 5).map(h => h.componentType);
      const uniqueTypes = [...new Set(recentTypes)];

      if (uniqueTypes.includes('page')) {
        suggestions.push('您已经生成了页面组件，是否需要创建相关的表单或弹窗组件？');
      }
      if (uniqueTypes.includes('form')) {
        suggestions.push('考虑为表单添加验证规则');
      }
      if (uniqueTypes.includes('table')) {
        suggestions.push('为表格添加排序或筛选功能');
      }

      suggestions.push('尝试使用不同的UI组件组合');
      suggestions.push('优化现有组件的性能');
    }

    return suggestions;
  }

  /**
   * 验证生成的代码
   */
  async validateGeneratedCode(files: Array<{ path: string; content: string }>): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const file of files) {
      // 基础语法检查
      if (file.content.includes('import') && !file.content.includes('from')) {
        errors.push(`文件 ${file.path} 中的 import 语句格式错误`);
      }

      // 检查必要的导出
      if (file.path.endsWith('.tsx') && !file.content.includes('export default')) {
        warnings.push(`文件 ${file.path} 可能缺少默认导出`);
      }

      // 检查组件名称
      if (file.path.includes('.tsx')) {
        const componentNameMatch = file.content.match(/const\s+(\w+)\s*=/);
        if (componentNameMatch) {
          const componentName = componentNameMatch[1];
          if (componentName !== 'Home' && componentName !== 'App') {
            warnings.push(`组件名称 ${componentName} 可能不符合项目的命名规范`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * PMGR 智能体工厂
 */
export class PMGRAgentFactory {
  private static instance: PMGRAgent | null = null;

  /**
   * 创建或获取 PMGR 智能体实例
   */
  static async create(projectPath?: string): Promise<PMGRAgent> {
    if (!PMGRAgentFactory.instance) {
      PMGRAgentFactory.instance = new PMGRAgent(projectPath);
      await PMGRAgentFactory.instance.initialize();
    }
    return PMGRAgentFactory.instance;
  }

  /**
   * 重置实例（主要用于测试）
   */
  static reset(): void {
    PMGRAgentFactory.instance = null;
  }
}