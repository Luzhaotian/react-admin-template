import { glob } from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import * as YAML from 'yaml';

/**
 * 技术栈信息
 */
export interface TechStack {
  framework: string;
  uiLibrary: string;
  stateManagement?: string;
  buildTool: string;
  packageManager: string;
  cssFramework?: string;
  testingFramework?: string;
}

/**
 * 组件模式
 */
export interface ComponentPattern {
  type: string;
  namingConvention: 'kebab-case' | 'PascalCase' | 'camelCase';
  structure: string;
  hooks?: string[];
  imports: string[];
  style?: string;
}

/**
 * 命名规范
 */
export interface NamingConvention {
  component: string;
  page: string;
  service: string;
  type: string;
  constant: string;
}

/**
 * 项目配置
 */
export interface ProjectConfig {
  eslint?: any;
  tsconfig?: any;
  vite?: any;
  webpack?: any;
  babel?: any;
}

/**
 * 项目分析结果
 */
export interface ProjectProfile {
  rootPath: string;
  name: string;
  techStack: TechStack;
  componentPatterns: ComponentPattern[];
  namingConventions: NamingConvention;
  projectConfig: ProjectConfig;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

/**
 * 项目分析器
 */
export class ProjectAnalyzer {
  constructor(private rootPath: string) {}

  /**
   * 分析项目
   */
  async analyzeProject(): Promise<ProjectProfile> {
    console.log('🔍 开始分析项目...');

    const [techStack, componentPatterns, namingConventions, projectConfig, packageJson] = await Promise.all([
      this.detectTechStack(),
      this.extractComponentPatterns(),
      this.identifyNamingConventions(),
      this.extractProjectConfig(),
      this.readPackageJson()
    ]);

    const profile: ProjectProfile = {
      rootPath: this.rootPath,
      name: path.basename(this.rootPath),
      techStack,
      componentPatterns,
      namingConventions,
      projectConfig,
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
      scripts: packageJson.scripts || {}
    };

    console.log('✅ 项目分析完成');
    return profile;
  }

  /**
   * 检测技术栈
   */
  private async detectTechStack(): Promise<TechStack> {
    const packageJson = await this.readPackageJson();
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // 检测框架
    let framework = 'Unknown';
    if (dependencies.react) framework = 'React';
    else if (dependencies.vue) framework = 'Vue';
    else if (dependencies.angular) framework = 'Angular';

    // 检测UI库
    let uiLibrary = 'Unknown';
    if (dependencies['antd']) uiLibrary = 'Ant Design';
    else if (dependencies['element-ui']) uiLibrary = 'Element UI';
    else if (dependencies['@mantine/core']) uiLibrary = 'Mantine';

    // 检测状态管理
    let stateManagement = 'Unknown';
    if (dependencies['redux']) stateManagement = 'Redux';
    else if (dependencies['zustand']) stateManagement = 'Zustand';
    else if (dependencies['mobx']) stateManagement = 'MobX';
    else if (dependencies['vuex']) stateManagement = 'Vuex';

    // 检测构建工具
    let buildTool = 'Unknown';
    if (dependencies['vite']) buildTool = 'Vite';
    else if (dependencies['webpack']) buildTool = 'Webpack';
    else if (dependencies['rollup']) buildTool = 'Rollup';

    // 检测包管理器
    const packageManager = await this.detectPackageManager();

    return {
      framework,
      uiLibrary,
      stateManagement,
      buildTool,
      packageManager,
      cssFramework: dependencies['tailwindcss'] ? 'Tailwind CSS' : undefined,
      testingFramework: dependencies['jest'] ? 'Jest' : dependencies['vitest'] ? 'Vitest' : undefined
    };
  }

  /**
   * 提取组件模式
   */
  private async extractComponentPatterns(): Promise<ComponentPattern[]> {
    const patterns: ComponentPattern[] = [];

    // 查找组件文件
    const componentFiles = await glob('src/**/*.{tsx,ts,jsx,js}', {
      cwd: this.rootPath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });

    // 分析几个示例组件
    const sampleFiles = componentFiles
      .filter(file => file.includes('/components/') || file.includes('/component/'))
      .slice(0, 5);

    for (const file of sampleFiles) {
      const content = await fs.promises.readFile(path.join(this.rootPath, file), 'utf-8');

      // 简单的组件模式分析
      const pattern: ComponentPattern = {
        type: this.detectComponentType(file, content),
        namingConvention: this.detectNamingConvention(file),
        structure: this.detectComponentStructure(content),
        hooks: this.extractHooks(content),
        imports: this.extractImports(content),
        style: this.detectStyleUsage(content)
      };

      patterns.push(pattern);
    }

    return patterns;
  }

  /**
   * 识别命名规范
   */
  private async identifyNamingConventions(): Promise<NamingConvention> {
    const files = await glob('src/**/*.{tsx,ts,jsx,js}', {
      cwd: this.rootPath,
      ignore: ['**/node_modules/**']
    });

    const namingConvention: NamingConvention = {
      component: 'PascalCase',
      page: 'PascalCase',
      service: 'camelCase',
      type: 'PascalCase',
      constant: 'SCREAMING_SNAKE_CASE'
    };

    // 分析实际文件名来确定命名规范
    const componentFiles = files.filter(file =>
      file.includes('/components/') ||
      file.includes('/component/') ||
      file.includes('/pages/') ||
      file.includes('/views/')
    );

    if (componentFiles.length > 0) {
      // 检查文件名模式
      const fileName = path.basename(componentFiles[0], path.extname(componentFiles[0]));
      if (fileName === fileName.toLowerCase()) {
        namingConvention.component = 'kebab-case';
      } else if (fileName[0] === fileName[0].toUpperCase()) {
        namingConvention.component = 'PascalCase';
      } else {
        namingConvention.component = 'camelCase';
      }
    }

    return namingConvention;
  }

  /**
   * 提取项目配置
   */
  private async extractProjectConfig(): Promise<ProjectConfig> {
    const config: ProjectConfig = {};

    const configFiles = [
      'tsconfig.json',
      'package.json',
      'vite.config.ts',
      'vite.config.js',
      'webpack.config.js',
      '.eslintrc.js',
      '.eslintrc.json'
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(this.rootPath, configFile);
      if (await fs.promises.access(configPath).then(() => true).catch(() => false)) {
        const content = await fs.promises.readFile(configPath, 'utf-8');

        if (configFile === 'tsconfig.json') {
          config.tsconfig = JSON.parse(content);
        } else if (configFile === 'package.json') {
          const pkg = JSON.parse(content);
          config.eslint = pkg.devDependencies?.eslint ? { ...pkg.eslint } : undefined;
        } else if (configFile.startsWith('vite.')) {
          config.vite = YAML.parse(content) || JSON.parse(content);
        } else if (configFile.startsWith('.eslintrc')) {
          config.eslint = JSON.parse(content);
        }
      }
    }

    return config;
  }

  /**
   * 读取package.json
   */
  private async readPackageJson(): Promise<any> {
    const packagePath = path.join(this.rootPath, 'package.json');
    const content = await fs.promises.readFile(packagePath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 检测包管理器
   */
  private async detectPackageManager(): Promise<string> {
    const files = await fs.promises.readdir(this.rootPath);

    if (files.includes('yarn.lock')) return 'yarn';
    if (files.includes('pnpm-lock.yaml')) return 'pnpm';
    if (files.includes('package-lock.json')) return 'npm';
    return 'npm';
  }

  /**
   * 检测组件类型
   */
  private detectComponentType(filePath: string, content: string): string {
    if (filePath.includes('button')) return 'Button';
    if (filePath.includes('input')) return 'Input';
    if (filePath.includes('table')) return 'Table';
    if (filePath.includes('modal')) return 'Modal';
    if (filePath.includes('form')) return 'Form';
    if (filePath.includes('search')) return 'Search';
    return 'Generic';
  }

  /**
   * 检测命名规范
   */
  private detectNamingConvention(filePath: string): 'kebab-case' | 'PascalCase' | 'camelCase' {
    const fileName = path.basename(filePath, path.extname(filePath));

    if (/^[a-z]+(-[a-z]+)*$/.test(fileName)) return 'kebab-case';
    if (/^[A-Z][a-zA-Z0-9]*$/.test(fileName)) return 'PascalCase';
    if (/^[a-z][a-zA-Z0-9]*$/.test(fileName)) return 'camelCase';
    return 'PascalCase';
  }

  /**
   * 检测组件结构
   */
  private detectComponentStructure(content: string): string {
    if (content.includes('function') && !content.includes('class')) {
      if (content.includes('const ') && content.includes('React.FC')) {
        return 'Function Component with FC';
      }
      return 'Function Component';
    }
    if (content.includes('class ') && content.includes('extends React.Component')) {
      return 'Class Component';
    }
    if (content.includes('const ') && content.includes('=>')) {
      return 'Arrow Function Component';
    }
    return 'Unknown';
  }

  /**
   * 提取hooks
   */
  private extractHooks(content: string): string[] {
    const hooks = [];
    const hookRegex = /use([A-Z][a-zA-Z0-9]*)/g;
    let match;

    while ((match = hookRegex.exec(content)) !== null) {
      hooks.push(`use${match[1]}`);
    }

    return [...new Set(hooks)];
  }

  /**
   * 提取导入
   */
  private extractImports(content: string): string[] {
    const imports = [];
    const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        const packageName = importPath.split('/')[0];
        imports.push(packageName);
      }
    }

    return [...new Set(imports)];
  }

  /**
   * 检测样式使用
   */
  private detectStyleUsage(content: string): string {
    if (content.includes('.module.css')) return 'CSS Modules';
    if (content.includes('.css')) return 'Plain CSS';
    if (content.includes('styled-components')) return 'Styled Components';
    if (content.includes('@emotion/styled')) return 'Emotion';
    if (content.includes('style=')) return 'Inline Style';
    return 'Unknown';
  }
}