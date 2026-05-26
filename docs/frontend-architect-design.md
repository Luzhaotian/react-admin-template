# 通用前端开发智能体架构设计

## 概述

本文档描述了一个通用的前端开发智能体（Frontend Architect Agent）的设计，该智能体能够根据项目特征自动生成专属记忆，并根据简单的需求描述生成完整的前端代码。

## 核心特性

### 1. 智能项目分析
- 自动识别项目技术栈（React、Vue、Angular等）
- 分析项目组件结构和命名规范
- 提取项目的UI模式和设计系统
- 识别项目的状态管理方案

### 2. 项目记忆系统
- 为每个项目生成专属的记忆文件
- 记录项目的技术选型、组件模式、API规范
- 保存项目的最佳实践和约束条件
- 支持记忆文件的版本管理和更新

### 3. 通用代码生成器
- 基于自然语言描述生成代码
- 支持多种组件类型（搜索栏、表格、表单等）
- 自动适配项目的架构规范
- 生成符合项目风格的代码

## 系统架构

### 1. 项目分析器 (Project Analyzer)
```typescript
interface ProjectAnalyzer {
  analyzeProject(rootPath: string): ProjectProfile;
  detectTechStack(): TechStack;
  extractComponentPatterns(): ComponentPattern[];
  identifyNamingConventions(): NamingConvention;
}
```

### 2. 记忆管理器 (Memory Manager)
```typescript
interface MemoryManager {
  createProjectMemory(projectProfile: ProjectProfile): ProjectMemory;
  updateMemory(memory: ProjectMemory, newInfo: any): void;
  loadMemory(projectPath: string): ProjectMemory;
  saveMemory(memory: ProjectMemory): void;
}
```

### 3. 代码生成器 (Code Generator)
```typescript
interface CodeGenerator {
  generateFromDescription(description: string, options: GenerationOptions): GeneratedCode;
  generateSearchForm(formConfig: SearchFormConfig): FormComponent;
  generateDataTable(tableConfig: TableConfig): TableComponent;
  generateModal(modalConfig: ModalConfig): ModalComponent;
}
```

### 4. 智能配置解析器 (Config Parser)
```typescript
interface ConfigParser {
  parseNaturalLanguage(input: string): ParsedConfig;
  validateConfig(config: any): ValidationResult;
  optimizeConfig(config: any): OptimizedConfig;
}
```

## 工作流程

### 1. 项目初始化
```bash
# 第一次使用时，智能体会自动分析项目
npx pmgr init [project-path]
```

### 2. 需求描述
```bash
# 使用自然语言描述需求
npx pmgr generate "创建一个用户管理页面，包含：
- 搜索栏：用户名（输入框）、状态（下拉选择）、创建时间（日期范围）
- 表格：显示ID、用户名、邮箱、手机号、状态、创建时间
- 支持新增、编辑、删除操作"
```

### 3. 代码生成
- 智能体读取项目记忆
- 解析自然语言需求
- 生成符合项目规范的代码
- 自动创建相关文件

## 记忆文件结构

### project-memory.json
```json
{
  "projectInfo": {
    "name": "项目名称",
    "techStack": {
      "framework": "React",
      "uiLibrary": "Ant Design",
      "stateManagement": "Zustand",
      "buildTool": "Vite"
    },
    "componentPatterns": {
      "naming": "PascalCase",
      "structure": "Standard page layout",
      "styles": "CSS Modules"
    }
  },
  "uiComponents": {
    "form": {
      "defaultLayout": "vertical",
      "labelAlign": "left",
      "size": "middle"
    },
    "table": {
      "pagination": "default",
      "rowKey": "id",
      "scroll": "auto"
    }
  },
  "apiPatterns": {
    "baseURL": "/api",
    "responseFormat": "standard",
    "authMethod": "Bearer token"
  },
  "customPatterns": {
    "dateFormats": ["YYYY-MM-DD"],
    "currencies": ["CNY"],
    "phoneValidation": "^1[3-9]\\d{9}$"
  },
  "generationHistory": [
    {
      "timestamp": "2024-05-15T10:00:00Z",
      "description": "生成用户管理页面",
      "filesGenerated": ["UserManagement.tsx", ...]
    }
  ]
}
```

## 支持的组件类型

### 1. 搜索栏组件
- 输入框（支持占位符、验证）
- 下拉选择（支持多选、搜索）
- 日期选择（单日期、日期范围）
- 数字输入（范围、步进）
- 组合搜索条件

### 2. 表格组件
- 基础表格（列配置、排序、筛选）
- 高级表格（树形、展开行、选择）
- 分页配置
- 工具栏操作

### 3. 表单组件
- 创建表单
- 编辑表单
- 批量操作
- 步骤表单

### 4. 弹窗组件
- 模态弹窗
- 抽屉弹窗
- 通知提示
- 确认对话框

## 配置解析示例

### 自然语言输入
```
创建一个订单管理页面，包含：
- 搜索条件：订单编号（输入框）、订单状态（下拉选择：全部/待支付/已支付/已取消）、下单时间（日期范围）
- 表格列：订单编号、客户名称、订单金额、状态、下单时间、操作（查看/编辑/删除）
- 功能：新增订单、批量导出
```

### 解析后的配置
```json
{
  "page": {
    "name": "OrderManagement",
    "path": "order-management",
    "title": "订单管理"
  },
  "searchForm": {
    "fields": [
      {
        "key": "orderNo",
        "label": "订单编号",
        "type": "input",
        "placeholder": "请输入订单编号"
      },
      {
        "key": "status",
        "label": "订单状态",
        "type": "select",
        "options": [
          {"label": "全部", "value": "all"},
          {"label": "待支付", "value": "pending"},
          {"label": "已支付", "value": "paid"},
          {"label": "已取消", "value": "cancelled"}
        ]
      },
      {
        "key": "dateRange",
        "label": "下单时间",
        "type": "dateRange",
        "format": "YYYY-MM-DD"
      }
    ]
  },
  "table": {
    "columns": [
      {
        "title": "订单编号",
        "dataIndex": "orderNo",
        "width": 180
      },
      {
        "title": "客户名称",
        "dataIndex": "customerName",
        "width": 120
      },
      {
        "title": "订单金额",
        "dataIndex": "amount",
        "width": 100,
        "render": "formatCurrency"
      },
      {
        "title": "状态",
        "dataIndex": "status",
        "width": 100,
        "render": "formatStatus"
      },
      {
        "title": "下单时间",
        "dataIndex": "createTime",
        "width": 180
      },
      {
        "title": "操作",
        "type": "action",
        "actions": ["view", "edit", "delete"]
      }
    ]
  },
  "actions": {
    "toolbar": ["create", "export"],
    "rowActions": ["view", "edit", "delete"]
  }
}
```

## 实现计划

### 阶段1：项目分析系统
1. 实现项目文件扫描
2. 识别技术栈和框架
3. 提取组件模式
4. 生成项目记忆文件

### 阶段2：自然语言处理
1. 实现配置解析器
2. 支持中文描述解析
3. 建立组件映射规则
4. 优化解析准确性

### 阶段3：代码生成引擎
1. 重构现有代码生成器
2. 实现模板系统
3. 支持多种技术栈
4. 添加代码优化功能

### 阶段4：智能体集成
1. 创建 PMGR 智能体
2. 集成项目分析、记忆管理、代码生成
3. 添加交互式功能
4. 完善错误处理和日志