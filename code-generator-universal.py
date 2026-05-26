#!/usr/bin/env python3
"""
通用前端代码生成器
根据项目记忆和自然语言描述生成前端代码

使用方法:
    python code-generator-universal.py <project-path> <description> [options]

示例:
    python code-generator-universal.py ./src "创建一个用户管理页面，包含搜索栏和表格"
"""

import os
import json
import re
import argparse
from typing import Dict, List, Any, Optional, Union
from pathlib import Path
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class SearchField:
    """搜索字段配置"""
    key: str
    label: str
    type: str  # input, select, date, dateRange, number, textarea
    placeholder: Optional[str] = None
    options: Optional[List[Dict[str, Any]]] = None
    required: bool = False
    validation: Optional[Dict[str, Any]] = None
    default: Optional[Any] = None


@dataclass
class TableColumn:
    """表格列配置"""
    title: str
    dataIndex: str
    width: Optional[int] = None
    fixed: Optional[str] = None
    render: Optional[str] = None
    sorter: bool = False
    filters: Optional[List[Dict[str, Any]]] = None
    align: Optional[str] = None
    ellipsis: bool = False


@dataclass
class ActionButton:
    """操作按钮配置"""
    key: str
    label: str
    type: str = 'default'
    icon: Optional[str] = None
    danger: bool = False
    confirm: Optional[str] = None
    permission: Optional[List[str]] = None


@dataclass
class PageConfig:
    """页面配置"""
    name: str
    path: str
    title: str
    description: Optional[str] = None
    searchFields: Optional[List[SearchField]] = None
    columns: Optional[List[TableColumn]] = None
    actions: Optional[Dict[str, List[ActionButton]]] = None
    api: Optional[Dict[str, str]] = None
    features: Optional[Dict[str, bool]] = None


class UniversalCodeGenerator:
    """通用代码生成器"""

    def __init__(self, project_path: str):
        """
        初始化生成器

        Args:
            project_path: 项目根路径
        """
        self.project_path = Path(project_path)
        self.memory_file = self.project_path / '.pmgr' / 'project-memory.json'
        self.memory = self._load_memory()

        # 默认模板
        self.templates = self._load_templates()

    def _load_memory(self) -> Dict[str, Any]:
        """加载项目记忆"""
        if self.memory_file.exists():
            with open(self.memory_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self._get_default_memory()

    def _get_default_memory(self) -> Dict[str, Any]:
        """获取默认记忆"""
        return {
            "projectInfo": {
                "techStack": {
                    "framework": "React",
                    "uiLibrary": "Ant Design",
                    "buildTool": "Vite",
                    "packageManager": "npm"
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
                        "pagination": True,
                        "rowKey": "id",
                        "scroll": {"y": 500},
                        "bordered": True,
                        "size": "middle"
                    }
                }
            },
            "customRules": {
                "dateFormats": ["YYYY-MM-DD"],
                "currencies": ["CNY", "USD"],
                "phoneRegex": "^1[3-9]\\d{9}$",
                "emailRegex": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
            }
        }

    def _load_templates(self) -> Dict[str, str]:
        """加载代码模板"""
        return {
            'page': '''import React, {{ useState, useEffect }} from 'react';
import {{ Table, Form, Input, Select, DatePicker, Button, Space, message }} from 'antd';
import {{ SearchOutlined, ExportOutlined, PlusOutlined }} from '@ant-design/icons';
import type {{ {page_name}Record, {page_name}Params }} from './types';
import {{ get{page_name}List }} from './service';
import {{ useSearchTable }} from '@/components/SearchTable';
import './{file_name}.css';

interface {page_name}Props {{
  // Add custom props here
}}

const {page_name}: React.FC<{page_name}Props> = () => {{
  const {{ searchProps, tableProps }} = useSearchTable(get{page_name}List);

  // Custom state and logic
  const [loading, setLoading] = useState(false);

  const handleCustomAction = (record: {page_name}Record) => {{
    console.log('Custom action:', record);
  }};

  return (
    <div className="{file_name}-container">
      <div className="search-section">
        <Form
          layout="horizontal"
          colon={true}
          {...searchProps}
        >
          {search_form_items}
        </Form>
      </div>

      <div className="action-section">
        <Space>
          {toolbar_actions}
        </Space>
      </div>

      <div className="table-section">
        <Table
          {...tableProps}
          columns={columns}
          rowKey="{row_key}"
          {table_config}
          scroll={{ {scroll_config} }}
        />
      </div>
    </div>
  );
}};

export default {page_name};
''',

            'types': '''// {file_name} 相关类型定义
export interface {page_name}Record {{
{type_definitions}
}}

export interface {page_name}Params {{
{param_definitions}
}}

export interface {page_name}ApiResult {{
  list: {page_name}Record[];
  total: number;
  success: boolean;
  message?: string;
}}
''',

            'service': '''import {{ request }} from '@/shared/axios';

// API 接口
export const get{page_name}List = (params: {page_name}Params) => {{
  return request({{
    url: '{api_path}',
    method: 'get',
    params,
  }});
}};

{additional_apis}
''',

            'css': '''.{file_name}-container {{
  padding: 24px;
}}

.search-section {{
  margin-bottom: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}}

.action-section {{
  margin-bottom: 16px;
}}

.table-section {{
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}}
''',

            'config': '''{{
  "path": "{path}",
  "title": "{title}",
  "description": "{description}",
  "api": {{
    "list": "{api_path}",
    "create": "{api_create}",
    "update": "{api_update}",
    "delete": "{api_delete}",
    "export": "{api_export}"
  }},
  "features": {{
    "create": {create_enabled},
    "edit": {edit_enabled},
    "delete": {delete_enabled},
    "export": {export_enabled}
  }},
  "searchFields": {search_fields_json},
  "columns": {table_columns_json}
}}
'''
        }

    def parse_natural_language(self, description: str) -> PageConfig:
        """
        解析自然语言描述

        Args:
            description: 功能描述

        Returns:
            PageConfig: 页面配置
        """
        print("📝 解析自然语言描述...")

        # 提取页面名称
        name = self._extract_page_name(description)
        path = name.lower()

        # 创建基础配置
        config = PageConfig(
            name=name,
            path=path,
            title=name,
            description=description
        )

        # 解析搜索字段
        config.searchFields = self._parse_search_fields(description)

        # 解析表格列
        config.columns = self._parse_table_columns(description)

        # 解析操作
        config.actions = self._parse_actions(description)

        # 解析API路径
        config.api = self._parse_api(description, path)

        # 解析功能特性
        config.features = self._parse_features(description)

        return config

    def _extract_page_name(self, description: str) -> str:
        """提取页面名称"""
        # 匹配"创建XX管理页面"、"XX列表"等
        patterns = [
            r'创建(.+?)管理页面',
            r'(.+?)列表',
            r'(.+?)管理',
            r'(.+?)页面'
        ]

        for pattern in patterns:
            match = re.search(pattern, description)
            if match:
                return match.group(1) + 'Management'

        # 默认返回
        return 'Page'

    def _parse_search_fields(self, description: str) -> List[SearchField]:
        """解析搜索字段"""
        fields = []

        # 搜索关键词匹配
        search_keywords = {
            '用户名': 'username',
            '名称': 'name',
            '邮箱': 'email',
            '手机号': 'phone',
            '状态': 'status',
            '类型': 'type',
            '时间': 'date',
            '日期': 'date',
            '创建时间': 'createTime',
            '更新时间': 'updateTime'
        }

        # 特殊字段配置
        special_fields = {
            '状态': {
                'type': 'select',
                'options': [
                    {'label': '启用', 'value': 1},
                    {'label': '禁用', 'value': 0}
                ]
            },
            '类型': {
                'type': 'select',
                'options': [
                    {'label': '类型1', 'value': 1},
                    {'label': '类型2', 'value': 2}
                ]
            }
        }

        # 提取搜索字段
        text = description
        for keyword, key in search_keywords.items():
            if keyword in text:
                field_config = special_fields.get(keyword, {})
                fields.append(SearchField(
                    key=key,
                    label=keyword,
                    type=field_config.get('type', 'input'),
                    placeholder=f'请输入{keyword}',
                    options=field_config.get('options')
                ))

        # 如果没有找到搜索字段，添加默认字段
        if not fields and '用户名' not in [f.label for f in fields]:
            fields.append(SearchField(
                key='keyword',
                label='关键词',
                type='input',
                placeholder='请输入关键词'
            ))

        return fields

    def _parse_table_columns(self, description: str) -> List[TableColumn]:
        """解析表格列"""
        columns = []

        # 基础字段映射
        base_fields = {
            'ID': 'id',
            '编号': 'id',
            '用户名': 'username',
            '名称': 'name',
            '邮箱': 'email',
            '手机号': 'phone',
            '状态': 'status',
            '类型': 'type',
            '创建时间': 'createTime',
            '更新时间': 'updateTime',
            '创建日期': 'createDate',
            '操作': 'action'
        }

        # 从描述中提取列
        text = description
        for title, dataIndex in base_fields.items():
            if title in text and title != '操作':
                columns.append(TableColumn(
                    title=title,
                    dataIndex=dataIndex,
                    width=self._get_default_width(dataIndex)
                ))

        # 添加操作列
        columns.append(TableColumn(
            title='操作',
            dataIndex='action',
            width=150,
            fixed='right'
        ))

        return columns

    def _parse_actions(self, description: str) -> Dict[str, List[ActionButton]]:
        """解析操作按钮"""
        actions = {
            'toolbar': [],
            'row': []
        }

        # 工具栏按钮
        if '新增' in description or '添加' in description:
            actions['toolbar'].append(ActionButton(
                key='add',
                label='新增',
                type='primary',
                icon='PlusOutlined'
            ))

        if '导出' in description:
            actions['toolbar'].append(ActionButton(
                key='export',
                label='导出',
                icon='ExportOutlined'
            ))

        # 行操作按钮
        if '编辑' in description:
            actions['row'].append(ActionButton(
                key='edit',
                label='编辑',
                type='link'
            ))

        if '删除' in description:
            actions['row'].append(ActionButton(
                key='delete',
                label='删除',
                type='link',
                danger=True,
                confirm='确定要删除吗？'
            ))

        if '查看' in description or '详情' in description:
            actions['row'].append(ActionButton(
                key='view',
                label='查看',
                type='link'
            ))

        return actions

    def _parse_api(self, description: str, path: str) -> Dict[str, str]:
        """解析API路径"""
        return {
            'list': f'/api/{path}/list',
            'create': f'/api/{path}/create',
            'update': f'/api/{path}/update',
            'delete': f'/api/{path}/delete',
            'export': f'/api/{path}/export'
        }

    def _parse_features(self, description: str) -> Dict[str, bool]:
        """解析功能特性"""
        return {
            'create': '新增' in description or '添加' in description,
            'edit': '编辑' in description or '修改' in description,
            'delete': '删除' in description,
            'export': '导出' in description,
            'import': '导入' in description
        }

    def _get_default_width(self, dataIndex: str) -> Optional[int]:
        """获取默认列宽"""
        width_map = {
            'id': 80,
            'username': 120,
            'name': 120,
            'email': 180,
            'phone': 140,
            'status': 100,
            'type': 100,
            'createTime': 160,
            'updateTime': 160,
            'createDate': 160,
            'action': 150
        }
        return width_map.get(dataIndex)

    def generate_files(self, config: PageConfig, output_dir: str) -> Dict[str, str]:
        """
        生成页面文件

        Args:
            config: 页面配置
            output_dir: 输出目录

        Returns:
            Dict[str, str]: 生成的文件列表
        """
        print(f"🚀 开始生成 {config.name} 页面...")

        # 准备模板变量
        template_vars = {
            'page_name': config.name,
            'file_name': config.name.lower(),
            'path': config.path,
            'title': config.title,
            'description': config.description,
            'search_form_items': self._generate_search_form_items(config.searchFields or []),
            'toolbar_actions': self._generate_toolbar_actions(config.actions.get('toolbar', [])),
            'row_key': config.api.get('list', '').split('/')[-1] if config.api else 'id',
            'table_config': self._generate_table_config(),
            'scroll_config': 'max-content',
            'type_definitions': self._generate_type_definitions(config.columns or []),
            'param_definitions': self._generate_param_definitions(config.searchFields or []),
            'api_path': config.api.get('list', '') if config.api else '',
            'additional_apis': self._generate_additional_apis(config.api),
            'create_enabled': str(config.features.get('create', False)).lower(),
            'edit_enabled': str(config.features.get('edit', False)).lower(),
            'delete_enabled': str(config.features.get('delete', False)).lower(),
            'export_enabled': str(config.features.get('export', False)).lower(),
            'search_fields_json': json.dumps(
                [asdict(field) for field in (config.searchFields or [])],
                ensure_ascii=False,
                indent=2
            ),
            'table_columns_json': json.dumps(
                [asdict(col) for col in (config.columns or [])],
                ensure_ascii=False,
                indent=2
            )
        }

        # 生成的文件
        files = {}

        # 生成主页面
        page_content = self._render_template('page', **template_vars)
        files['index.tsx'] = page_content

        # 生成类型文件
        types_content = self._render_template('types', **template_vars)
        files['types.ts'] = types_content

        # 生成服务文件
        service_content = self._render_template('service', **template_vars)
        files['service.ts'] = service_content

        # 生成样式文件
        css_content = self._render_template('css', **template_vars)
        files['index.css'] = css_content

        # 生成配置文件
        config_content = self._render_template('config', **template_vars)
        files['config.json'] = config_content

        return files

    def _render_template(self, template_name: str, **kwargs) -> str:
        """渲染模板"""
        template = self.templates.get(template_name, '')
        content = template

        # 替换变量
        for key, value in kwargs.items():
            if isinstance(value, list):
                content = content.replace(f'{{{key}}}', '\n'.join(str(v) for v in value))
            else:
                content = content.replace(f'{{{key}}}', str(value))

        return content

    def _generate_search_form_items(self, fields: List[SearchField]) -> str:
        """生成搜索表单项"""
        items = []

        for field in fields:
            if field.type == 'input':
                items.append(f'''          <Form.Item name="{field.key}" label="{field.label}">
            <Input placeholder="{field.placeholder}" allowClear />
          </Form.Item>''')
            elif field.type == 'select':
                options = []
                if field.options:
                    for opt in field.options:
                        options.append(f'''              <Select.Option value="{opt['value']}">{opt['label']}</Select.Option>''')

                items.append(f'''          <Form.Item name="{field.key}" label="{field.label}">
            <Select placeholder="{field.placeholder}" allowClear showSearch optionFilterProp="label">
              {''.join(options)}
            </Select>
          </Form.Item>''')
            elif field.type == 'dateRange':
                items.append(f'''          <Form.Item name="{field.key}" label="{field.label}">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>''')
            elif field.type == 'date':
                items.append(f'''          <Form.Item name="{field.key}" label="{field.label}">
            <DatePicker style={{ width: '100%' }} placeholder="{field.placeholder}" />
          </Form.Item>''')
            elif field.type == 'number':
                items.append(f'''          <Form.Item name="{field.key}" label="{field.label}">
            <Input type="number" placeholder="{field.placeholder}" allowClear />
          </Form.Item>''')

        return '\n'.join(items)

    def _generate_toolbar_actions(self, actions: List[ActionButton]) -> str:
        """生成工具栏按钮"""
        items = []

        for action in actions:
            props = []
            if action.type:
                props.append(f'type="{action.type}"')
            if action.icon:
                props.append(f'icon={<{action.icon} />' if action.icon else '')
            if action.danger:
                props.append('danger')
            if action.confirm:
                props.append(f'onClick={() => confirm("{action.confirm}")}')

            item = f'''          <Button
            key="{action.key}"
            {' '.join(props)}
          >
            {action.label}
          </Button>'''

            items.append(item)

        return '\n'.join(items)

    def _generate_table_config(self) -> str:
        """生成表格配置"""
        config = []

        # 根据记忆添加配置
        if self.memory.get('uiComponents', {}).get('defaults', {}).get('table'):
            table_config = self.memory['uiComponents']['defaults']['table']
            if table_config.get('pagination'):
                config.append('pagination={{\n          current: 1,\n          pageSize: 10,\n          showTotal: (total) => `共 ${{total}} 条`,\n        }}')
            if table_config.get('bordered'):
                config.append('bordered')
            if table_config.get('size'):
                config.append(f'size="{table_config["size"]}"')

        return '\n        '.join(config)

    def _generate_type_definitions(self, columns: List[TableColumn]) -> str:
        """生成类型定义"""
        definitions = []

        for col in columns:
            if col.dataIndex != 'action':  # 跳过操作列
                type_def = f'  {col.dataIndex}: string;'
                definitions.append(type_def)

        return '\n'.join(definitions)

    def _generate_param_definitions(self, fields: List[SearchField]) -> str:
        """生成参数定义"""
        definitions = []

        for field in fields:
            if field.type == 'dateRange':
                definitions.extend([
                    f'  {field.key}Start?: string;',
                    f'  {field.key}End?: string;'
                ])
            else:
                type_def = f'  {field.key}: string;'
                definitions.append(type_def)

        return '\n'.join(definitions)

    def _generate_additional_apis(self, api: Optional[Dict[str, str]]) -> str:
        """生成额外的API"""
        if not api:
            return ''

        apis = []

        if api.get('create'):
            apis.append(f'''export const create{self.memory['projectInfo']['techStack']['framework']} = (data: any) => {{
  return request({{
    url: '{api["create"]}',
    method: 'post',
    data,
  }});
}};''')

        if api.get('update'):
            apis.append(f'''export const update{self.memory['projectInfo']['techStack']['framework']} = (data: any) => {{
  return request({{
    url: '{api["update"]}',
    method: 'put',
    data,
  }});
}};''')

        if api.get('delete'):
            apis.append(f'''export const delete{self.memory['projectInfo']['techStack']['framework']} = (id: number) => {{
  return request({{
    url: '{api["delete"]}',
    method: 'delete',
    params: {{ id }},
  }});
}};''')

        return '\n\n'.join(apis)

    def create_project_memory(self, project_path: str) -> Dict[str, Any]:
        """创建项目记忆文件"""
        print("🧠 创建项目记忆...")

        # 基础记忆信息
        memory = {
            "projectInfo": {
                "name": Path(project_path).name,
                "techStack": self.memory["projectInfo"]["techStack"],
                "componentPatterns": self.memory["projectInfo"]["componentPatterns"],
                "lastUpdated": datetime.now().isoformat()
            },
            "uiComponents": self.memory["uiComponents"],
            "customRules": self.memory["customRules"],
            "generationHistory": []
        }

        # 保存记忆文件
        memory_dir = Path(project_path) / '.pmgr'
        memory_dir.mkdir(exist_ok=True)

        memory_file = memory_dir / 'project-memory.json'
        with open(memory_file, 'w', encoding='utf-8') as f:
            json.dump(memory, f, ensure_ascii=False, indent=2)

        print(f"✅ 项目记忆已保存到: {memory_file}")
        return memory


def main():
    parser = argparse.ArgumentParser(description='通用前端代码生成器')
    parser.add_argument('project_path', help='项目路径')
    parser.add_argument('description', help='功能描述')
    parser.add_argument('-o', '--output', default='src/pages', help='输出目录')
    parser.add_argument('--init', action='store_true', help='初始化项目记忆')

    args = parser.parse_args()

    # 创建生成器
    generator = UniversalCodeGenerator(args.project_path)

    # 如果需要初始化记忆
    if args.init:
        generator.create_project_memory(args.project_path)
        return

    # 解析描述
    config = generator.parse_natural_language(args.description)

    # 生成文件
    output_dir = Path(args.project_path) / args.output / config.path
    output_dir.mkdir(parents=True, exist_ok=True)

    files = generator.generate_files(config, str(output_dir))

    # 写入文件
    for filename, content in files.items():
        file_path = output_dir / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 已生成: {file_path}")

    print(f"\n🎉 {config.name} 页面生成完成！")
    print(f"📁 位置: {output_dir}")
    print("\n📋 接下来需要：")
    print(f"1. 在路由配置中添加: {config.path}")
    print("2. 根据实际需求调整API接口")
    print("3. 安装所需的依赖包")


if __name__ == '__main__':
    main()