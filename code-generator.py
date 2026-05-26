#!/usr/bin/env python3
"""
前端代码生成器
根据项目配置自动生成标准的前端页面代码（基于 microcredit-ms 项目风格）

使用方法:
    python code-generator.py <config-file> <output-dir>

示例:
    python code-generator.py config/user-management.py ./src/pages
"""

import os
import sys
import json
import importlib.util
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional


class FrontendCodeGenerator:
    """前端代码生成器"""

    def __init__(self, project_config: Dict[str, Any]):
        """
        初始化代码生成器

        Args:
            project_config: 项目配置字典
        """
        self.project_config = project_config
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict[str, str]:
        """加载代码模板"""
        return {
            'page': '''import SearchTable, {{ useSearchTable }} from '@/components/SearchTable';
import {api_name} from '@/services/{service_name}';
import {advanced_search_name} from './{advanced_search_file}';
import createColumns from './columns';
import type {{ {page_name}Record }} from './types';
import {{ {import_statements} }} from '@/stores/global';

export default function {page_name}() {{
  // 获取全局枚举
  const {{ {store_enums} }} = useGlobalStore((state) => state.{store_enum_name}Map);

  const {{ searchProps, tableProps }} = useSearchTable({api_name});

  // 处理额外的选项数据
  const [{ {async_state_name} = {{ value: {async_options} = {{}} }}, {async_function_name}] = useAsyncFn(async () => {{
    const data = await {async_api_name}();
    const mapToSelectOptions = (list: string[] = []): SelectOption[] =>
      list.map((item) => ({{
        label: item,
        value: item,
      }}));

    return {{
      {async_options_mapping}
    }};
  }}, []);

  useEffect(() => {{
    {async_function_name}();
  }}, []);

  return (
    <SearchTable
      {{...tableProps}}
      search={
        <{advanced_search_name}
          {{...searchProps}}
          {component_props}
        />
      }
      bordered
      rowKey="{row_key}"
      columns={createColumns({{ {column_props} }})}
      scroll={{ {scroll_config} }}
    />
  );
}}
''',

            'css': '''
/* {page_name} 样式 */
''',

            'service': '''import {{ request }} from '@/shared/axios';

// API 接口
export const {api_name} = (params: any) => {{
  return request({{
    url: '{api_path}',
    method: 'get',
    params,
  }});
}};

{additional_apis}
''',
            'columns': '''import memoizeOne from 'memoize-one';
import type {{ TableColumnsType }} from 'antd';
import type {{ GlobalState }} from '@/stores/global';
import type {{ {page_name}Record }} from './types';

function createColumns({{ {column_params} }}) {{
  return [
    {table_columns}
  ] as TableColumnsType<{page_name}Record>;
}}

export default memoizeOne(createColumns);
''',
            'advanced_search': '''import {{ Form, Select }} from 'antd';
import type {{ Dayjs }} from 'dayjs';
import RangePicker from '@/components/RangePicker';
import SearchGroup from '@/components/SearchGroup';
import {{ searchFormProps }} from '@/shared/basicProps';
import {{ adapters }} from '@/shared/adaptor';
import {{ omit }} from 'lodash-es';
import type {{ SelectOption }} from './index';
import type {{ GlobalState }} from '@/stores/global';
import type {{ {page_name}Params }} from '@/services/{service_name}';

type Conditions = {page_name}Params;

interface FormValues extends Omit<Conditions, {date_range_fields}> {{
  {date_range_form_fields}
}}

interface {advanced_search_name}Props {{
  onSubmit?: (values: Conditions) => void;
  onReset?: (values: Conditions) => void;
  {component_interfaces}
}}

const transformConditions = (values: FormValues): Conditions => {{
  const {date_range_transform} = adapters.daterange2string(values.{date_range_form_field} ?? []);
  return {{
    ...omit(values, ['{date_range_form_field}']),
    {date_range_transform}
  }};
}};

const {advanced_search_name}: React.FC<{advanced_search_name}Props> = ({{
  onSubmit,
  onReset,
  {component_props}
}}) => {{
  const [form] = Form.useForm<FormValues>();

  const {enum_mappings} = ({enum_mappings_source}) ?? [];

  const handleSubmit = (values: FormValues) => {{
    onSubmit?.(transformConditions(values));
  }};

  const handleReset = () => {{
    form.resetFields();
    onReset?.(transformConditions(form.getFieldsValue()));
  }};

  return (
    <Form {{...searchFormProps}} form={{form}} onFinish={{handleSubmit}}>
      <SearchGroup onReset={{handleReset}}>
        {search_form_items}
      </SearchGroup>
    </Form>
  );
}};

export default {advanced_search_name};
''',
            'types': '''// {page_name} 相关的类型定义
export interface {page_name}Record {{
{type_definitions}
}}

export interface {page_name}Params {{
{param_definitions}
}}
''',
            'index_css': '''
/* {page_name} page styles */
''',

            'types': '''// {page_name} 相关的类型定义
export interface {page_name}Record {{
{type_definitions}
}}
''',

            'config': '''{
  "path": "{path}",
  "title": "{title}",
  "description": "{description}",
  "api": {
    "list": "{api_list}",
    "create": "{api_create}",
    "update": "{api_update}",
    "delete": "{api_delete}",
    "export": "{api_export}"
  },
  "search": {
    "enabled": true,
    "fields": {search_fields},
    "defaultValues": {default_values},
    "layout": "horizontal",
    "span": 6
  },
  "table": {
    "columns": {table_columns},
    "rowKey": "{row_key}",
    "pagination": {
      "enabled": true,
      "pageSize": 10,
      "showSizeChanger": true,
      "showQuickJumper": true
    },
    "scroll": {{"y": 600}},
    "showSelection": false,
    "showRowNumber": false
  },
  "actions": {
    "rowActions": [
      {{
        "key": "edit",
        "label": "编辑",
        "type": "link",
        "onClick": "handleEdit"
      }},
      {{
        "key": "delete",
        "label": "删除",
        "type": "link",
        "danger": true,
        "onClick": "handleDelete"
      }}
    ],
    "toolbarActions": [
      {{
        "key": "add",
        "label": "新增",
        "type": "primary",
        "icon": "PlusOutlined",
        "onClick": "handleAdd"
      }}
    ]
  },
  "permissions": {{
    "view": ["{path}:view"],
    "create": ["{path}:create"],
    "update": ["{path}:update"],
    "delete": ["{path}:delete"]
  }}
}
'''
        }

    def _render_template(self, template_name: str, **kwargs) -> str:
        """渲染模板"""
        template = self.templates.get(template_name, '')
        # 简单的模板渲染，处理嵌套的大括号
        content = template
        for key, value in kwargs.items():
            if isinstance(value, list):
                content = content.replace(f'{{{key}}}', '\n'.join(str(v) for v in value))
            else:
                content = content.replace(f'{{{key}}}', str(value))
        return content

    def _generate_type_definitions(self, fields: List[Dict[str, Any]]) -> str:
        """生成记录类型定义"""
        definitions = []
        for field in fields:
            type_def = f'  {field["dataIndex"]}: {field.get("type", "any")};'
            if field.get('required', False):
                type_def += ' // 必填'
            definitions.append(type_def)
        return '\n'.join(definitions)

    def _generate_param_definitions(self, search_fields: List[Dict[str, Any]]) -> str:
        """生成查询参数类型定义"""
        definitions = []
        for field in search_fields:
            if field['type'] == 'dateRange':
                # 日期范围特殊处理
                definitions.append(f'  {field["key"]}Start?: string;')
                definitions.append(f'  {field["key"]}End?: string;')
            else:
                type_def = f'  {field["key"]}: {self._get_search_field_type(field)};'
                if field.get('required', False):
                    type_def += ' // 必填'
                definitions.append(type_def)
        return '\n'.join(definitions)

    def _get_search_field_type(self, field: Dict[str, Any]) -> str:
        """获取搜索字段的类型"""
        type_mapping = {
            'input': 'string',
            'select': 'string | string[]',
            'date': 'string',
            'dateRange': '[Dayjs, Dayjs] | null',
            'number': 'number'
        }
        return type_mapping.get(field['type'], 'any')

    def generate_page(self, page_config: Dict[str, Any], output_dir: str) -> None:
        """生成页面代码"""
        page_name = page_config['title'].replace(' ', '').replace('-', '')
        page_path = Path(output_dir) / page_config['path']
        page_path.mkdir(parents=True, exist_ok=True)

        # 准备模板变量
        template_vars = {
            'page_name': page_name,
            'api_name': f'get{page_name}List',
            'service_name': page_config['path'].replace('/', '_'),
            'advanced_search_name': f'{page_name}AdvancedSearch',
            'advanced_search_file': 'AdvancedSearch',
            'import_statements': '',
            'store_enums': '',
            'store_enum_name': '',
            'async_state_name': '',
            'async_options': '',
            'async_function_name': '',
            'async_api_name': '',
            'async_options_mapping': '',
            'row_key': page_config.get('rowKey', 'id'),
            'column_props': '',
            'scroll_config': "'max-content'",
            'date_range_fields': '',
            'date_range_form_fields': '',
            'date_range_form_field': '',
            'date_range_transform': '',
            'component_interfaces': '',
            'component_props': '',
            'enum_mappings': '',
            'enum_mappings_source': '',
            'search_form_items': '',
            'type_definitions': self._generate_type_definitions(page_config.get('fields', [])),
            'param_definitions': self._generate_param_definitions(page_config.get('searchFields', [])),
            'api_path': page_config['api']['list'],
            'table_columns': '',
            'column_params': '',
            'table_column_items': []
        }

        # 处理搜索表单项
        search_form_items = []
        for field in page_config.get('searchFields', []):
            item = self._generate_search_form_item(field, page_name)
            search_form_items.append(item)
        template_vars['search_form_items'] = '\n'.join(search_form_items)

        # 处理表格列
        column_items = []
        for col in page_config.get('columns', []):
            item = self._generate_table_column_item(col)
            column_items.append(item)
        template_vars['table_column_items'] = column_items
        template_vars['table_columns'] = '\n    '.join(column_items)

        # 处理额外的 API 选项
        if page_config.get('asyncApi'):
            template_vars.update(self._generate_async_config(page_config))

        # 生成主页面
        page_content = self._render_template('page', **template_vars)

        # 生成列配置文件
        columns_content = self._render_template('columns', **template_vars)

        # 生成高级搜索组件
        advanced_search_content = self._render_template('advanced_search', **template_vars)

        # 生成类型定义
        types_content = self._render_template('types', **template_vars)

        # 生成 API 服务
        service_content = self._render_template(
            'service',
            api_name=f'get{page_name}List',
            api_path=page_config['api']['list'],
            additional_apis=''
        )

        # 生成 CSS 文件
        css_content = self._render_template('index_css', page_name=page_name)

        # 写入文件
        files_to_write = {
            'index.tsx': page_content,
            'columns.ts': columns_content,
            'AdvancedSearch.tsx': advanced_search_content,
            'types.ts': types_content,
            'service.ts': service_content,
            'index.css': css_content,
        }

        for filename, content in files_to_write.items():
            with open(page_path / filename, 'w', encoding='utf-8') as f:
                f.write(content)

        print(f'✅ 页面 {page_name} 生成完成: {page_path}')

    def _generate_search_form_item(self, field: Dict[str, Any], page_name: str) -> str:
        """生成搜索表单项"""
        item = f'''        <SearchGroup.Item>
          <Form.Item label="{field["label"]}" name="{field["key"]}">
            {self._generate_search_form_field(field)}
          </Form.Item>
        </SearchGroup.Item>'''
        return item

    def _generate_search_form_field(self, field: Dict[str, Any]) -> str:
        """生成搜索表单字段"""
        field_config = {
            'input': '<Input placeholder="请输入" allowClear />',
            'select': '<Select allowClear showSearch optionFilterProp="label" placeholder="请选择" />',
            'date': '<DatePicker style={{ width: "100%" }} placeholder="请选择日期" />',
            'dateRange': '<RangePicker style={{ width: "100%" }} />',
            'number': '<Input type="number" placeholder="请输入" allowClear />'
        }

        field_element = field_config.get(field['type'], '<Input placeholder="请输入" />')

        # 如果有选项配置
        if field.get('options'):
            options = json.dumps(field['options'], ensure_ascii=False)
            field_element = f'''<Select
              allowClear
              showSearch
              optionFilterProp="label"
              options={options}
              placeholder="请选择"
            />'''

        return field_element

    def _generate_table_column_item(self, col: Dict[str, Any]) -> str:
        """生成表格列项"""
        item = f'''    {{
      title: '{col["title"]}',
      dataIndex: '{col["dataIndex"]}',
      width: {col.get("width", "undefined")},'''

        if col.get('render'):
            item += f'''
      render: (text: any, record: any) => {col["render"]},'''

        if col.get('fixed'):
            item += f'''
      fixed: '{col["fixed"]}','''

        item += '''
    },'''
        return item

    def _generate_async_config(self, page_config: Dict[str, Any]) -> Dict[str, str]:
        """生成异步配置"""
        config = {
            'import_statements': 'SelectOption',
            'store_enums': '',
            'store_enum_name': '',
            'async_state_name': 'channelOptionsState',
            'async_options': 'channelNameOptions = [], nameOptions = []',
            'async_function_name': 'fetchChannelOptions',
            'async_api_name': page_config['asyncApi']['name'],
            'async_options_mapping': ''
        }

        if page_config['asyncApi'].get('mappings'):
            mappings = []
            for key, prop in page_config['asyncApi']['mappings'].items():
                mappings.append(f'{key}: mapToSelectOptions(data?.{prop})')
            config['async_options_mapping'] = ',\n      '.join(mappings)

        # 处理 store 枚举
        if page_config.get('storeEnum'):
            config['store_enums'] = page_config['storeEnum']
            config['store_enum_name'] = page_config['storeEnum']

        return config

    def generate_page(self, page_config: Dict[str, Any], output_dir: str) -> None:
        """生成页面代码"""
        page_name = page_config['title'].replace(' ', '').replace('-', '')
        page_path = Path(output_dir) / page_config['path']
        page_path.mkdir(parents=True, exist_ok=True)

        # 生成页面组件
        page_content = self._render_template(
            'page',
            page_name=page_name,
            api_name=f'get{page_name}List',
            service_name=page_config['path'].replace('/', '_'),
            type_definitions=self._generate_type_definitions(page_config.get('fields', [])),
            row_key=page_config.get('rowKey', 'id'),
            pagination_config='''
        pagination={{
          current: 1,
          pageSize: 10,
          showTotal: (total) => `共 ${{total}} 条`,
        }}''' if page_config.get('pagination', {}).get('enabled', True) else '',
            table_columns=self._generate_table_columns(page_config.get('columns', [])),
            api_path=page_config['api']['list']
        )

        # 生成 CSS
        css_content = self._render_template('css', page_name=page_name)

        # 生成 API 服务
        service_content = self._render_template(
            'service',
            api_name=f'get{page_name}List',
            api_path=page_config['api']['list'],
            additional_apis=''
        )

        # 生成类型定义
        types_content = self._render_template(
            'types',
            page_name=page_name,
            type_definitions=self._generate_type_definitions(page_config.get('fields', []))
        )

        # 生成配置文件
        config_content = self._render_template(
            'config',
            path=page_config['path'],
            title=page_config['title'],
            description=page_config.get('description', ''),
            api_list=page_config['api']['list'],
            api_create=page_config['api'].get('create', ''),
            api_update=page_config['api'].get('update', ''),
            api_delete=page_config['api'].get('delete', ''),
            api_export=page_config['api'].get('export', ''),
            search_fields=self._generate_search_fields(page_config.get('searchFields', [])),
            default_values=json.dumps(page_config.get('defaultValues', {}), ensure_ascii=False),
            table_columns=json.dumps(page_config.get('columns', []), ensure_ascii=False),
            row_key=page_config.get('rowKey', 'id')
        )

        # 写入文件
        with open(page_path / 'index.tsx', 'w', encoding='utf-8') as f:
            f.write(page_content)

        with open(page_path / 'index.css', 'w', encoding='utf-8') as f:
            f.write(css_content)

        with open(page_path / 'service.ts', 'w', encoding='utf-8') as f:
            f.write(service_content)

        with open(page_path / 'types.ts', 'w', encoding='utf-8') as f:
            f.write(types_content)

        with open(page_path / 'config.json', 'w', encoding='utf-8') as f:
            f.write(config_content)

        print(f'✅ 页面 {page_name} 生成完成: {page_path}')

    def generate_page(self, page_config: Dict[str, Any], output_dir: str) -> None:
        """生成页面代码"""
        page_name = page_config['title'].replace(' ', '').replace('-', '')
        page_path = Path(output_dir) / page_config['path']
        page_path.mkdir(parents=True, exist_ok=True)

        # 准备模板变量
        template_vars = {
            'page_name': page_name,
            'api_name': f'get{page_name}List',
            'service_name': page_config['path'].replace('/', '_'),
            'advanced_search_name': f'{page_name}AdvancedSearch',
            'advanced_search_file': 'AdvancedSearch',
            'import_statements': '',
            'store_enums': '',
            'store_enum_name': '',
            'async_state_name': '',
            'async_options': '',
            'async_function_name': '',
            'async_api_name': '',
            'async_options_mapping': '',
            'row_key': page_config.get('rowKey', 'id'),
            'column_props': '',
            'scroll_config': "'max-content'",
            'date_range_fields': '',
            'date_range_form_fields': '',
            'date_range_form_field': '',
            'date_range_transform': '',
            'component_interfaces': '',
            'component_props': '',
            'enum_mappings': '',
            'enum_mappings_source': '',
            'search_form_items': '',
            'type_definitions': self._generate_type_definitions(page_config.get('fields', [])),
            'param_definitions': self._generate_param_definitions(page_config.get('searchFields', [])),
            'api_path': page_config['api']['list'],
            'table_columns': '',
            'column_params': '',
            'table_column_items': []
        }

        # 处理搜索表单项
        search_form_items = []
        for field in page_config.get('searchFields', []):
            item = self._generate_search_form_item(field, page_name)
            search_form_items.append(item)
        template_vars['search_form_items'] = '\n'.join(search_form_items)

        # 处理表格列
        column_items = []
        for col in page_config.get('columns', []):
            item = self._generate_table_column_item(col)
            column_items.append(item)
        template_vars['table_column_items'] = column_items
        template_vars['table_columns'] = '\n    '.join(column_items)

        # 处理额外的 API 选项
        if page_config.get('asyncApi'):
            template_vars.update(self._generate_async_config(page_config))

        # 生成主页面
        page_content = self._render_template('page', **template_vars)

        # 生成列配置文件
        columns_content = self._render_template('columns', **template_vars)

        # 生成高级搜索组件
        advanced_search_content = self._render_template('advanced_search', **template_vars)

        # 生成类型定义
        types_content = self._render_template('types', **template_vars)

        # 生成 API 服务
        service_content = self._render_template(
            'service',
            api_name=f'get{page_name}List',
            api_path=page_config['api']['list'],
            additional_apis=''
        )

        # 生成 CSS 文件
        css_content = self._render_template('index_css', page_name=page_name)

        # 写入文件
        files_to_write = {
            'index.tsx': page_content,
            'columns.ts': columns_content,
            'AdvancedSearch.tsx': advanced_search_content,
            'types.ts': types_content,
            'service.ts': service_content,
            'index.css': css_content,
        }

        for filename, content in files_to_write.items():
            with open(page_path / filename, 'w', encoding='utf-8') as f:
                f.write(content)

        print(f'✅ 页面 {page_name} 生成完成: {page_path}')

    def generate_all_pages(self, output_dir: str) -> None:
        """生成所有页面"""
        print(f'🚀 开始生成代码到: {output_dir}')

        # 直接处理配置文件中的页面配置
        if 'pages' in self.project_config:
            for page_config in self.project_config['pages']:
                self.generate_page(page_config, output_dir)
        else:
            # 如果没有 pages 字段，直接处理整个配置作为单个页面
            self.generate_page(self.project_config, output_dir)

        print('🎉 所有页面生成完成！')


def load_config(config_path: str) -> Dict[str, Any]:
    """加载配置文件"""
    if config_path.endswith('.json'):
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # 支持 Python 配置文件
        spec = importlib.util.spec_from_file_location("config", config_path)
        config_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(config_module)
        return config_module.CONFIG


def main():
    parser = argparse.ArgumentParser(description='前端代码生成器')
    parser.add_argument('config', help='配置文件路径 (JSON 或 Python)')
    parser.add_argument('output', help='输出目录')
    parser.add_argument('--template', default='react', choices=['react', 'vue'], help='模板类型')

    args = parser.parse_args()

    # 加载配置
    try:
        config = load_config(args.config)
        print(f'✅ 配置加载成功: {args.config}')
    except Exception as e:
        print(f'❌ 配置加载失败: {e}')
        sys.exit(1)

    # 生成代码
    generator = FrontendCodeGenerator(config)
    generator.generate_all_pages(args.output)


if __name__ == '__main__':
    main()