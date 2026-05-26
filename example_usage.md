# 前端代码生成器使用说明

## 概述

本工具可以根据配置文件自动生成符合项目规范的前端页面代码，生成的代码基于 microcredit-ms 项目的架构和样式。

## 功能特点

1. **自动生成标准页面结构**：包括主页面、列配置、高级搜索、类型定义等
2. **支持多种搜索类型**：输入框、下拉选择、日期选择、日期范围等
3. **支持异步选项加载**：动态获取下拉框选项
4. **支持枚举映射**：将枚举值映射为可读文本
5. **支持全局状态管理**：集成 store 枚举数据

## 使用方法

### 1. 准备配置文件

创建一个 Python 配置文件，定义页面的搜索字段、表格列、API 等。

示例：`config/user-management.py`

```python
# 类型定义
type_defs = [
    {"dataIndex": "id", "type": "number", "required": True},
    {"dataIndex": "username", "type": "string", "required": True},
    # ... 更多字段定义
]

# 搜索字段配置
search_fields = [
    {
        "key": "username",
        "label": "用户名",
        "type": "input",
        "placeholder": "请输入用户名"
    },
    {
        "key": "status",
        "label": "状态",
        "type": "select",
        "options": [
            {"label": "启用", "value": 1},
            {"label": "禁用", "value": 0}
        ],
        "placeholder": "请选择状态"
    },
    # ... 更多搜索字段
]

# 表格列配置
table_columns = [
    {
        "title": "ID",
        "dataIndex": "id",
        "width": 80
    },
    {
        "title": "用户名",
        "dataIndex": "username",
        "width": 120
    },
    # ... 更多列定义
]

# 页面配置
CONFIG = {
    "path": "user-management",  # 页面路由路径
    "title": "用户管理",       # 页面标题
    "description": "管理系统用户信息",
    "api": {                   # API 配置
        "list": "/api/user/list",
        "create": "/api/user/create",
        "update": "/api/user/update",
        "delete": "/api/user/delete",
        "export": "/api/user/export"
    },
    "rowKey": "id",           # 表格行键
    "searchFields": search_fields,  # 搜索字段配置
    "columns": table_columns,      # 表格列配置
    "fields": type_defs            # 字段类型定义
}
```

### 2. 运行生成器

```bash
python code-generator.py config/user-management.py ./src/pages
```

### 3. 生成的文件结构

运行后会在输出目录下生成以下文件：

```
user-management/
├── index.tsx      # 主页面组件
├── columns.ts     # 表格列配置
├── AdvancedSearch.tsx  # 高级搜索组件
├── types.ts       # 类型定义
├── service.ts     # API 接口
└── index.css      # 样式文件
```

## 配置说明

### 搜索字段类型

| 类型 | 说明 | 支持的配置 |
|------|------|-----------|
| input | 输入框 | placeholder, required |
| select | 下拉选择 | options, placeholder, required |
| date | 日期选择 | placeholder, required |
| dateRange | 日期范围 | placeholder, required |
| number | 数字输入 | placeholder, required |

### 表格列配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| title | 列标题 | "用户名" |
| dataIndex | 数据字段 | "username" |
| width | 列宽度 | 120 |
| fixed | 固定位置 | "left" 或 "right" |
| render | 自定义渲染 | "(text) => text ? '是' : '否'" |

### 特殊配置

- **asyncApi**: 配置需要异步加载的选项数据
  - `name`: API 函数名
  - `mappings`: 数据映射配置

- **storeEnum**: 指定使用的 store 枚举

## 示例

### 1. 基础的用户管理页面

参考 `config/user-management.py` 配置文件。

### 2. 带有异步选项的页面

```python
CONFIG = {
    # ... 其他配置
    "asyncApi": {
        "name": "getChannelOptions",
        "mappings": {
            "channelNameOptions": "channels",
            "nameOptions": "names"
        }
    },
    "storeEnum": "channel"
}
```

### 3. 使用枚举映射的表格列

```python
table_columns = [
    {
        "title": "渠道类型",
        "dataIndex": "channelType",
        "width": 100,
        "render": "(text: string) => channelCategories?.[text] ?? ''"
    }
]
```

## 注意事项

1. 确保配置文件的路径正确
2. 生成的代码需要根据实际项目情况进行微调
3. 需要安装依赖：`memoize-one`, `react-use`, `lodash-es`
4. 确保项目中已有相关的组件和工具函数