# PMGR 通用前端开发智能体使用指南

## 概述

PMGR 已经升级为一个通用的前端开发智能体，它能够：
- 自动分析项目结构，生成专属记忆
- 根据自然语言描述生成前端代码
- 支持多种技术栈和组件库
- 提供智能化的代码生成建议

## 快速开始

### 1. 初始化项目

```bash
# 初始化 PMGR 智能体
npx pmgr init [项目路径]

# 或者使用 Python 版本
python code-generator-universal.py ./项目路径 "项目描述描述" --init
```

### 2. 生成代码

#### 方式一：使用 CLI 工具

```bash
# 使用自然语言描述生成代码
npx pmgr generate -d "创建一个用户管理页面，包含搜索栏和表格"

# 从文件读取描述
npx pmgr generate -f requirement.txt

# 快速生成 CRUD 页面
npx pmgr crud 用户管理 --fields '[{"key":"name","label":"名称","type":"string"},{"key":"status","label":"状态","type":"select"}]'
```

#### 方式二：使用 Python 脚本

```bash
# 基础用法
python code-generator-universal.py ./src "创建一个用户管理页面，包含搜索栏和表格"

# 指定输出目录
python code-generator-universal.py ./src "创建一个订单管理页面" -o src/pages

# 初始化项目记忆
python code-generator-universal.py ./src "项目描述" --init
```

## 支持的功能

### 1. 自然语言描述

支持多种描述方式：

```
"创建一个用户管理页面，包含：
- 搜索栏：用户名（输入框）、状态（下拉选择）、创建时间（日期范围）
- 表格：显示ID、用户名、邮箱、手机号、状态、创建时间
- 支持新增、编辑、删除操作"
```

### 2. 支持的组件类型

- **搜索组件**：输入框、下拉选择、日期选择、日期范围、数字输入
- **表格组件**：基础表格、分页、排序、筛选
- **操作按钮**：新增、编辑、删除、导出、查看详情
- **表单组件**：创建表单、编辑表单、验证规则

### 3. 支持的技术栈

- **React** + Ant Design
- **Vue** + Element UI
- **Angular** + ng-zorro-antd
- 可扩展支持其他技术栈

## 项目记忆系统

### 记忆文件位置

```
项目根目录/
├── .pmgr/
│   └── project-memory.json
```

### 记忆内容示例

```json
{
  "projectInfo": {
    "name": "项目名称",
    "techStack": {
      "framework": "React",
      "uiLibrary": "Ant Design",
      "buildTool": "Vite"
    },
    "componentPatterns": {
      "naming": "PascalCase",
      "structure": "Standard page layout",
      "style": "CSS Modules"
    }
  },
  "uiComponents": {
    "defaults": {
      "form": {
        "layout": "horizontal",
        "labelAlign": "left",
        "size": "middle"
      },
      "table": {
        "pagination": true,
        "rowKey": "id",
        "scroll": {"y": 500}
      }
    }
  },
  "customRules": {
    "dateFormats": ["YYYY-MM-DD"],
    "currencies": ["CNY", "USD"]
  }
}
```

## 使用示例

### 示例1：生成用户管理页面

```bash
# 使用 CLI
npx pmgr generate -d "创建用户管理页面，包含用户名搜索和状态筛选"

# 使用 Python
python code-generator-universal.py ./src "创建用户管理页面"
```

生成的文件结构：
```
src/pages/user-management/
├── index.tsx      # 主页面
├── types.ts       # 类型定义
├── service.ts     # API 服务
├── index.css      # 样式文件
└── config.json    # 配置文件
```

### 示例2：生成带自定义字段的表单

```python
# Python 脚本中使用
config = {
    "name": "Product",
    "path": "product",
    "title": "产品管理",
    "searchFields": [
        {
            "key": "name",
            "label": "产品名称",
            "type": "input",
            "placeholder": "请输入产品名称"
        },
        {
            "key": "category",
            "label": "产品类别",
            "type": "select",
            "options": [
                {"label": "电子产品", "value": "electronics"},
                {"label": "服装", "value": "clothing"}
            ]
        }
    ],
    "columns": [
        {"title": "ID", "dataIndex": "id", "width": 80},
        {"title": "名称", "dataIndex": "name", "width": 120},
        {"title": "类别", "dataIndex": "category", "width": 100}
    ]
}
```

### 示例3：批量生成多个页面

```bash
# 生成订单管理
npx pmgr crud 订单管理 --fields '[{"key":"orderNo","label":"订单号","type":"string"},{"key":"amount","label":"金额","type":"number"}]'

# 生成客户管理
npx pmgr crud 客户管理 --fields '[{"key":"name","label":"客户名称","type":"string"},{"key":"level","label":"客户等级","type":"select"}]'
```

## 高级功能

### 1. 项目分析

```bash
# 分析项目结构
npx pmgr analyze

# 查看项目统计
npx pmgr stats
```

### 2. 获取生成建议

```bash
# 获取智能建议
npx pmgr suggest
```

### 3. 记忆管理

```bash
# 导出记忆
npx pmgr memory --export memory.json

# 导入记忆
npx pmgr memory --import memory.json

# 查看记忆内容
npx pmgr memory --show
```

### 4. 自定义规则

```python
# 添加自定义验证规则
await agent.addCustomRule('validation', {
    'phone': {'pattern': '^1[3-9]\\d{9}$', 'message': '手机号格式错误'},
    'email': {'pattern': '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', 'message': '邮箱格式错误'}
})
```

## 最佳实践

### 1. 项目初始化

在项目开始时运行初始化：

```bash
npx pmgr init
```

### 2. 遵循命名规范

根据项目记忆中的命名规范生成代码，保持一致性。

### 3. 定期更新记忆

当项目结构发生变化时，重新初始化或更新记忆：

```bash
npx pmgr init --update
```

### 4. 使用版本控制

将 `.pmgr` 目录纳入版本控制，保留项目记忆。

### 5. 自定义模板

可以根据项目需求修改模板，生成符合规范的代码。

## 故障排除

### 常见问题

1. **依赖缺失**
   - 确保安装了所需的依赖包
   - 检查 package.json 中的配置

2. **生成失败**
   - 检查自然语言描述是否清晰
   - 确保项目路径正确

3. **记忆文件损坏**
   - 删除 `.pmgr` 目录重新初始化
   - 从备份恢复记忆文件

### 调试模式

```bash
# 开启详细日志
DEBUG=pmgr* npx pmgr generate -d "描述"
```

## 更新日志

### v2.0.0 (2024-05-16)
- 重构为通用前端开发智能体
- 添加项目记忆系统
- 支持自然语言描述生成
- 支持多种技术栈
- 提供CLI和Python两种接口

### v1.0.0
- 基础代码生成功能
- 单一技术栈支持
- 配置文件驱动

## 贡献指南

欢迎贡献代码和建议！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License