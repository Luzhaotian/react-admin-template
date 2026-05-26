#!/usr/bin/env node

import { Command } from 'commander';
import { PMGRAgentFactory } from '../lib/pmgr-agent';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

program
  .name('pmgr')
  .description('PMGR - 通用前端开发智能体')
  .version('1.0.0');

/**
 * 初始化命令
 */
program
  .command('init [project-path]')
  .description('初始化 PMGR 智能体')
  .action(async (projectPath: string = process.cwd()) => {
    try {
      console.log('🚀 初始化 PMGR 智能体...');

      const agent = await PMGRAgentFactory.create(projectPath);
      const stats = await agent.getProjectStats();

      console.log('✅ 初始化成功');
      console.log('📊 项目信息:');
      console.log(`  技术栈: ${stats.techStack}`);
      console.log(`  生成历史: ${stats.totalGenerations} 次`);
      console.log(`  组件类型: ${stats.componentTypes.join(', ')}`);
    } catch (error) {
      console.error('❌ 初始化失败:', error);
      process.exit(1);
    }
  });

/**
 * 生成命令
 */
program
  .command('generate')
  .description('根据描述生成代码')
  .option('-d, --description <text>', '功能描述')
  .option('-f, --file <path>', '描述文件路径')
  .option('-o, --output <path>', '输出目录', 'src/pages')
  .option('-t, --type <type>', '生成类型', 'page')
  .action(async (options) => {
    try {
      let description = options.description;

      if (options.file) {
        if (!fs.existsSync(options.file)) {
          console.error(`❌ 文件不存在: ${options.file}`);
          process.exit(1);
        }
        description = fs.readFileSync(options.file, 'utf-8');
      }

      if (!description) {
        console.error('❌ 请提供描述 (-d) 或描述文件 (-f)');
        process.exit(1);
      }

      console.log('🚀 开始生成代码...');
      console.log('📝 需求描述:', description);

      const agent = await PMGRAgentFactory.create();
      const result = await agent.generateCode(description, {
        type: options.type as any,
        outputPath: options.output
      });

      // 写入文件
      for (const file of result.files) {
        const fullPath = path.join(process.cwd(), file.path);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, file.content);
        console.log(`✅ 已生成: ${file.path}`);
      }

      console.log('\n📋 生成说明:');
      result.instructions.forEach(instruction => {
        console.log(`  • ${instruction}`);
      });

      if (result.dependencies.length > 0) {
        console.log('\n📦 需要安装的依赖:');
        result.dependencies.forEach(dep => {
          console.log(`  • ${dep}`);
        });
        console.log('\n运行命令: npm install ' + result.dependencies.join(' '));
      }
    } catch (error) {
      console.error('❌ 生成失败:', error);
      process.exit(1);
    }
  });

/**
 * 分析命令
 */
program
  .command('analyze')
  .description('分析项目结构')
  .action(async () => {
    try {
      const agent = await PMGRAgentFactory.create();
      const analysis = await agent.analyzeProjectStructure();

      console.log('📊 项目分析结果:');
      console.log('\n🔧 技术栈:');
      console.log(`  框架: ${analysis.techStack.framework}`);
      console.log(`  UI库: ${analysis.techStack.uiLibrary}`);
      console.log(`  构建工具: ${analysis.techStack.buildTool}`);
      console.log(`  包管理器: ${analysis.techStack.packageManager}`);

      if (analysis.techStack.stateManagement) {
        console.log(`  状态管理: ${analysis.techStack.stateManagement}`);
      }

      console.log('\n📝 命名规范:');
      console.log(`  组件: ${analysis.naming.component}`);
      console.log(`  页面: ${analysis.naming.page}`);
      console.log(`  服务: ${analysis.naming.service}`);

      console.log('\n🔌 组件模式:');
      analysis.patterns.forEach((pattern: any, index: number) => {
        console.log(`  ${index + 1}. ${pattern.type} - ${pattern.structure}`);
      });
    } catch (error) {
      console.error('❌ 分析失败:', error);
      process.exit(1);
    }
  });

/**
 * 统计命令
 */
program
  .command('stats')
  .description('显示项目统计信息')
  .action(async () => {
    try {
      const agent = await PMGRAgentFactory.create();
      const stats = await agent.getProjectStats();

      console.log('📊 项目统计:');
      console.log(`  技术栈: ${stats.techStack}`);
      console.log(`  总生成次数: ${stats.totalGenerations}`);
      console.log(`  组件类型: ${stats.componentTypes.join(', ')}`);

      if (stats.lastGeneration) {
        const lastDate = new Date(stats.lastGeneration);
        console.log(`  最后生成: ${lastDate.toLocaleString()}`);
      }
    } catch (error) {
      console.error('❌ 获取统计失败:', error);
      process.exit(1);
    }
  });

/**
 * CRUD 命令
 */
program
  .command('crud')
  .description('快速生成CRUD页面')
  .argument('<name>', '页面名称')
  .option('-f, --fields <fields>', '字段配置 (JSON格式)')
  .option('--api-path <path>', 'API路径')
  .option('--no-create', '禁用新增')
  .option('--no-edit', '禁用编辑')
  .option('--no-delete', '禁用删除')
  .option('--no-export', '禁用导出')
  .action(async (name, options) => {
    try {
      let fields = [];

      if (options.fields) {
        try {
          fields = JSON.parse(options.fields);
        } catch (error) {
          console.error('❌ 字段配置格式错误，请使用JSON格式');
          process.exit(1);
        }
      } else {
        // 使用默认字段
        fields = [
          { key: 'name', label: '名称', type: 'string', required: true },
          { key: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] },
          { key: 'createdAt', label: '创建时间', type: 'date' }
        ];
      }

      console.log(`🚀 生成${name}CRUD页面...`);

      const agent = await PMGRAgentFactory.create();
      const result = await agent.generateCRUDPage(name, fields, {
        apiPath: options.apiPath,
        enableCreate: options.create,
        enableEdit: options.edit,
        enableDelete: options.delete,
        enableExport: options.export
      });

      // 写入文件
      for (const file of result.files) {
        const fullPath = path.join(process.cwd(), file.path);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(fullPath, file.content);
        console.log(`✅ 已生成: ${file.path}`);
      }

      console.log('\n📋 生成说明:');
      result.instructions.forEach(instruction => {
        console.log(`  • ${instruction}`);
      });
    } catch (error) {
      console.error('❌ 生成CRUD页面失败:', error);
      process.exit(1);
    }
  });

/**
 * 建议命令
 */
program
  .command('suggest')
  .description('获取生成建议')
  .action(async () => {
    try {
      const agent = await PMGRAgentFactory.create();
      const suggestions = await agent.getGenerationSuggestions();

      console.log('💡 生成建议:');
      suggestions.forEach((suggestion, index) => {
        console.log(`  ${index + 1}. ${suggestion}`);
      });
    } catch (error) {
      console.error('❌ 获取建议失败:', error);
      process.exit(1);
    }
  });

/**
 * 记忆命令
 */
program
  .command('memory')
  .description('管理项目记忆')
  .option('-e, --export <file>', '导出记忆到文件')
  .option('-i, --import <file>', '从文件导入记忆')
  .option('--show', '显示记忆内容')
  .action(async (options) => {
    try {
      const agent = await PMGRAgentFactory.create();

      if (options.export) {
        const memory = await agent.exportMemory();
        fs.writeFileSync(options.export, memory);
        console.log(`✅ 记忆已导出到: ${options.export}`);
      } else if (options.import) {
        if (!fs.existsSync(options.import)) {
          console.error(`❌ 文件不存在: ${options.import}`);
          process.exit(1);
        }
        const memory = fs.readFileSync(options.import, 'utf-8');
        await agent.importMemory(memory);
        console.log(`✅ 记忆已从 ${options.import} 导入`);
      } else if (options.show) {
        const memory = await agent.exportMemory();
        console.log('📖 项目记忆:');
        console.log(memory);
      } else {
        console.log('请选择操作: --export, --import, 或 --show');
      }
    } catch (error) {
      console.error('❌ 记忆操作失败:', error);
      process.exit(1);
    }
  });

program.parse();