import * as fs from 'fs';
import * as path from 'path';
import { ProjectMemory } from './memory-manager';

/**
 * 搜索字段配置
 */
export interface SearchField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'textarea';
  placeholder?: string | string[];
  options?: Array<{ label: string; value: any }>;
  required?: boolean;
  validation?: any;
  defaultValue?: any;
}

/**
 * 表格列配置
 */
export interface TableColumn {
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  render?: string;
  sorter?: boolean;
  filters?: Array<{ text: string; value: any }>;
  align?: 'left' | 'right' | 'center';
  ellipsis?: boolean;
}

/**
 * 操作按钮配置
 */
export interface ActionButton {
  key: string;
  label: string;
  type: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  danger?: boolean;
  icon?: string;
  onClick?: string;
  confirm?: string;
  permission?: string[];
}

/**
 * 页面配置
 */
export interface PageConfig {
  name: string;
  path: string;
  title: string;
  description?: string;
  searchForm?: {
    fields: SearchField[];
    layout?: 'horizontal' | 'vertical' | 'inline';
    span?: number;
    gutter?: number;
  };
  table?: {
    columns: TableColumn[];
    rowKey?: string;
    pagination?: {
      enabled: boolean;
      pageSize?: number;
      showSizeChanger?: boolean;
      showQuickJumper?: boolean;
      showTotal?: boolean;
    };
    scroll?: { y?: number };
    bordered?: boolean;
    size?: 'default' | 'middle' | 'small';
  };
  actions?: {
    toolbar?: ActionButton[];
    rowActions?: ActionButton[];
    batchActions?: ActionButton[];
  };
  api?: {
    list: string;
    create?: string;
    update?: string;
    delete?: string;
    export?: string;
    detail?: string;
  };
  features?: {
    create?: boolean;
    edit?: boolean;
    delete?: boolean;
    export?: boolean;
    import?: boolean;
    batch?: boolean;
    detail?: boolean;
  };
}

/**
 * 生成选项
 */
export interface GenerationOptions {
  type: 'page' | 'component' | 'form' | 'table' | 'modal';
  template?: string;
  customImports?: string[];
  hooks?: string[];
  styles?: string;
  className?: string;
  outputPath?: string;
}

/**
 * 生成结果
 */
export interface GeneratedCode {
  files: Array<{
    path: string;
    content: string;
    type: 'tsx' | 'ts' | 'jsx' | 'js' | 'css' | 'json';
  }>;
  dependencies: string[];
  devDependencies: string[];
  instructions: string[];
}

/**
 * 代码生成器
 */
export class CodeGenerator {
  constructor(private memory: ProjectMemory) {}

  /**
   * 从自然语言描述生成代码
   */
  async generateFromDescription(
    description: string,
    options: GenerationOptions = { type: 'page' }
  ): Promise<GeneratedCode> {
    console.log('🚀 开始生成代码...');

    // 解析自然语言描述
    const config = this.parseNaturalLanguage(description);

    // 根据类型生成代码
    let files: GeneratedCode['files'] = [];
    const dependencies: string[] = [];
    const devDependencies: string[] = [];
    const instructions: string[] = [];

    switch (options.type) {
      case 'page':
        const pageResult = await this.generatePage(config, options);
        files = pageResult.files;
        dependencies.push(...pageResult.dependencies);
        instructions.push(...pageResult.instructions);
        break;
      case 'form':
        const formResult = await this.generateForm(config, options);
        files = formResult.files;
        dependencies.push(...formResult.dependencies);
        instructions.push(...formResult.instructions);
        break;
      case 'table':
        const tableResult = await this.generateTable(config, options);
        files = tableResult.files;
        dependencies.push(...tableResult.dependencies);
        instructions.push(...tableResult.instructions);
        break;
      case 'modal':
        const modalResult = await this.generateModal(config, options);
        files = modalResult.files;
        dependencies.push(...modalResult.dependencies);
        instructions.push(...modalResult.instructions);
        break;
      default:
        throw new Error(`Unsupported generation type: ${options.type}`);
    }

    // 添加样式文件
    if (options.styles) {
      files.push({
        path: `${this.getComponentPath(config.name || 'Component')}.css`,
        content: options.styles,
        type: 'css'
      });
    }

    console.log('✅ 代码生成完成');
    return {
      files,
      dependencies: [...new Set(dependencies)],
      devDependencies: [...new Set(devDependencies)],
      instructions
    };
  }

  /**
   * 解析自然语言描述
   */
  private parseNaturalLanguage(description: string): Partial<PageConfig> {
    console.log('📝 解析自然语言描述...');

    const config: Partial<PageConfig> = {
      name: '',
      path: '',
      title: '',
      description,
      searchForm: {
        fields: [],
        layout: 'horizontal',
        span: 6,
        gutter: 16
      },
      table: {
        columns: [],
        rowKey: 'id',
        pagination: {
          enabled: true,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`
        },
        scroll: { y: 500 },
        bordered: true,
        size: 'middle'
      },
      actions: {
        toolbar: [],
        rowActions: []
      },
      features: {
        create: true,
        edit: true,
        delete: true,
        export: false
      }
    };

    // 解析搜索字段
    const searchPatterns = {
      '搜索栏': /搜索栏[：:]\s*(.+?)(?=\n|$)/,
      '搜索条件': /搜索条件[：:]\s*(.+?)(?=\n|$)/,
      '搜索': /搜索[：:]\s*(.+?)(?=\n|$)/
    };

    for (const [key, pattern] of Object.entries(searchPatterns)) {
      const match = description.match(pattern);
      if (match) {
        const fieldsText = match[1];
        const fields = this.parseSearchFields(fieldsText);
        config.searchForm!.fields.push(...fields);
      }
    }

    // 解析表格列
    const tablePatterns = {
      '表格列': /表格列[：:]\s*(.+?)(?=\n|$)/,
      '表格': /表格[：:]\s*(.+?)(?=\n|$)/,
      '列': /列[：:]\s*(.+?)(?=\n|$)/
    };

    for (const [key, pattern] of Object.entries(tablePatterns)) {
      const match = description.match(pattern);
      if (match) {
        const columnsText = match[1];
        const columns = this.parseTableColumns(columnsText);
        config.table!.columns.push(...columns);
      }
    }

    // 解析功能
    if (description.includes('新增') || description.includes('添加')) {
      config.actions!.toolbar!.push({
        key: 'add',
        label: '新增',
        type: 'primary',
        icon: 'PlusOutlined',
        onClick: 'handleAdd'
      });
      config.features!.create = true;
    }

    if (description.includes('编辑') || description.includes('修改')) {
      config.actions!.rowActions!.push({
        key: 'edit',
        label: '编辑',
        type: 'link',
        onClick: 'handleEdit'
      });
      config.features!.edit = true;
    }

    if (description.includes('删除')) {
      config.actions!.rowActions!.push({
        key: 'delete',
        label: '删除',
        type: 'link',
        danger: true,
        onClick: 'handleDelete',
        confirm: '确定要删除吗？'
      });
      config.features!.delete = true;
    }

    // 提取页面名称
    const nameMatch = description.match(/(管理|列表|页面|模块)/);
    if (nameMatch) {
      config.name = nameMatch[0];
      config.path = nameMatch[0].toLowerCase();
      config.title = nameMatch[0];
    }

    return config;
  }

  /**
   * 解析搜索字段
   */
  private parseSearchFields(text: string): SearchField[] {
    const fields: SearchField[] = [];
    const items = text.split(/[,，、]/).map(item => item.trim());

    for (const item of items) {
      if (item.includes('输入框') || item.includes('文本')) {
        fields.push({
          key: item.replace(/[（）()]/g, '').toLowerCase(),
          label: item.replace(/[（）()]/g, ''),
          type: 'input',
          placeholder: `请输入${item.replace(/[（）()]/g, '')}`
        });
      } else if (item.includes('下拉') || item.includes('选择')) {
        fields.push({
          key: item.replace(/[（）()]/g, '').toLowerCase(),
          label: item.replace(/[（）()]/g, ''),
          type: 'select',
          placeholder: `请选择${item.replace(/[（）()]/g, '')}`
        });
      } else if (item.includes('日期范围')) {
        fields.push({
          key: 'dateRange',
          label: '日期范围',
          type: 'dateRange',
          placeholder: ['开始时间', '结束时间']
        });
      } else if (item.includes('日期')) {
        fields.push({
          key: item.replace(/[（）()]/g, '').toLowerCase(),
          label: item.replace(/[（）()]/g, ''),
          type: 'date',
          placeholder: `请选择${item.replace(/[（）()]/g, '')}`
        });
      } else if (item.includes('数字')) {
        fields.push({
          key: item.replace(/[（）()]/g, '').toLowerCase(),
          label: item.replace(/[（）()]/g, ''),
          type: 'number',
          placeholder: `请输入${item.replace(/[（）()]/g, '')}`
        });
      } else {
        // 默认为输入框
        fields.push({
          key: item.replace(/[（）()]/g, '').toLowerCase(),
          label: item.replace(/[（）()]/g, ''),
          type: 'input',
          placeholder: `请输入${item.replace(/[（）()]/g, '')}`
        });
      }
    }

    return fields;
  }

  /**
   * 解析表格列
   */
  private parseTableColumns(text: string): TableColumn[] {
    const columns: TableColumn[] = [];
    const items = text.split(/[,，、]/).map(item => item.trim());

    for (const item of items) {
      const key = item.replace(/[（）()]/g, '').toLowerCase();
      const title = item.replace(/[（）()]/g, '');

      columns.push({
        title,
        dataIndex: key,
        width: undefined,
        align: 'left',
        ellipsis: false
      });
    }

    return columns;
  }

  /**
   * 生成页面代码
   */
  private async generatePage(config: Partial<PageConfig>, options: GenerationOptions): Promise<GeneratedCode> {
    const files: GeneratedCode['files'] = [];
    const dependencies: string[] = [];
    const instructions: string[] = [];

    const pageName = config.name || 'Page';
    const pagePath = path.join(options.outputPath || 'src/pages', config.path || pageName.toLowerCase());

    // 生成主页面
    const pageContent = this.generatePageContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'index.tsx'),
      content: pageContent,
      type: 'tsx'
    });

    // 生成列配置
    const columnsContent = this.generateColumnsContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'columns.ts'),
      content: columnsContent,
      type: 'ts'
    });

    // 生成搜索组件
    const searchContent = this.generateSearchContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'Search.tsx'),
      content: searchContent,
      type: 'tsx'
    });

    // 生成类型定义
    const typesContent = this.generateTypesContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'types.ts'),
      content: typesContent,
      type: 'ts'
    });

    // 生成API服务
    const serviceContent = this.generateServiceContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'service.ts'),
      content: serviceContent,
      type: 'ts'
    });

    // 生成样式
    const styleContent = this.generateStyleContent(config, pageName);
    files.push({
      path: path.join(pagePath, 'index.css'),
      content: styleContent,
      type: 'css'
    });

    instructions.push(
      `页面已生成到: ${pagePath}`,
      `请在路由配置中添加: ${config.path}`,
      `根据实际需求调整API接口和字段`
    );

    return { files, dependencies, devDependencies: [], instructions };
  }

  /**
   * 生成页面内容
   */
  private generatePageContent(config: Partial<PageConfig>, pageName: string): string {
    const { searchForm = {}, table = {}, actions = {} } = config;
    const importStatements = [
      'import Search from \'./Search\';',
      'import { useSearchTable } from \'@/components/SearchTable\';',
      'import { createColumns } from \'./columns\';',
      'import { get' + pageName + 'List } from \'./service\';',
      'import type { ' + pageName + 'Record, ' + pageName + 'Params } from \'./types\';',
      'import { Button, Space, message } from \'antd\';',
      'import { PlusOutlined } from \'@ant-design/icons\';'
    ].join('\n');

    const componentContent = `
const ${pageName} = () => {
  const { searchProps, tableProps } = useSearchTable(get${pageName}List);

  return (
    <div className="${pageName.toLowerCase()}-container">
      <Search {...searchProps} />
      <div className="toolbar">
        ${actions.toolbar?.map(action => `
        <Button
          key="${action.key}"
          type="${action.type}"
          icon={${action.icon ? `<${action.icon} />` : 'undefined'}}
          onClick={() => handle${action.key.charAt(0).toUpperCase() + action.key.slice(1)}}
        >
          ${action.label}
        </Button>`).join('\n        ') || ''}
      </div>
      <div className="table-container">
        <table
          {...tableProps}
          columns={createColumns()}
          rowKey="${table.rowKey || 'id'}"
          ${table.scroll ? `scroll={${JSON.stringify(table.scroll)}}` : ''}
          ${table.bordered ? 'bordered' : ''}
          ${table.size ? `size="${table.size}"` : ''}
        />
      </div>
    </div>
  );
};

export default ${pageName};`;

    return `${importStatements}\n\n${componentContent}`;
  }

  /**
   * 生成列配置内容
   */
  private generateColumnsContent(config: Partial<PageConfig>, pageName: string): string {
    const { table = {} } = config;
    const columns = table.columns || [];

    const columnDefinitions = columns.map(col => {
      return `{
        title: '${col.title}',
        dataIndex: '${col.dataIndex}',
        width: ${col.width || 'undefined'},
        ${col.fixed ? `fixed: '${col.fixed}',` : ''}
        ${col.render ? `render: ${col.render},` : ''}
        ${col.sorter ? 'sorter: true,' : ''}
        ${col.align ? `align: '${col.align}',` : ''}
        ${col.ellipsis ? 'ellipsis: true,' : ''}
      }`;
    }).join(',\n');

    return `
import type { TableColumnsType } from 'antd';
import type { ${pageName}Record } from './types';

export default function createColumns() {
  return [
    ${columnDefinitions}
  ] as TableColumnsType<${pageName}Record>;
}`;
  }

  /**
   * 生成搜索组件内容
   */
  private generateSearchContent(config: Partial<PageConfig>, pageName: string): string {
    const { searchForm = {} } = config;
    const { fields = [], layout = 'horizontal', span = 6 } = searchForm;

    const formItems = fields.map(field => {
      const inputProps = field.placeholder ?
        (Array.isArray(field.placeholder) ?
          `placeholder={${JSON.stringify(field.placeholder)}}` :
          `placeholder="${field.placeholder}"`) : '';

      switch (field.type) {
        case 'input':
          return `<Form.Item name="${field.key}" label="${field.label}">
            <Input ${inputProps} allowClear />
          </Form.Item>`;
        case 'select':
          return `<Form.Item name="${field.key}" label="${field.label}">
            <Select ${inputProps} allowClear showSearch optionFilterProp="label">
              ${field.options?.map(opt =>
                `<Select.Option value="${opt.value}">${opt.label}</Select.Option>`
              ).join('\n              ') || ''}
            </Select>
          </Form.Item>`;
        case 'dateRange':
          return `<Form.Item name="${field.key}" label="${field.label}">
            <RangePicker ${inputProps} style={{ width: '100%' }} />
          </Form.Item>`;
        case 'date':
          return `<Form.Item name="${field.key}" label="${field.label}">
            <DatePicker ${inputProps} style={{ width: '100%' }} />
          </Form.Item>`;
        case 'number':
          return `<Form.Item name="${field.key}" label="${field.label}">
            <Input type="number" ${inputProps} allowClear />
          </Form.Item>`;
        default:
          return `<Form.Item name="${field.key}" label="${field.label}">
            <Input ${inputProps} allowClear />
          </Form.Item>`;
      }
    }).join('\n          ');

    return `
import { Form, Input, Select, DatePicker, RangePicker } from 'antd';
import { SearchFormProps } from '@/shared/basicProps';
import type { ${pageName}Params } from './types';

const SearchForm: React.FC<SearchFormProps<${pageName}Params>> = ({ onReset, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: ${pageName}Params) => {
    onSubmit?.(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.(form.getFieldsValue());
  };

  return (
    <Form
      form={form}
      layout="${layout}"
      onFinish={handleSubmit}
    >
      <Space style={{ width: '100%', marginBottom: 16 }} wrap>
        ${formItems}
      </Space>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">搜索</Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SearchForm;`;
  }

  /**
   * 生成类型定义内容
   */
  private generateTypesContent(config: Partial<PageConfig>, pageName: string): string {
    const { searchForm = {}, table = {} } = config;
    const { fields = [] } = searchForm;
    const { columns = [] } = table;

    // 生成记录类型
    const recordFields = columns.map(col => {
      const fieldType = this.inferFieldType(col.dataIndex);
      return `  ${col.dataIndex}: ${fieldType};`;
    }).join('\n');

    // 生成参数类型
    const paramFields = fields.map(field => {
      let fieldType = 'any';
      switch (field.type) {
        case 'input':
        case 'textarea':
          fieldType = 'string';
          break;
        case 'number':
          fieldType = 'number';
          break;
        case 'select':
          fieldType = field.options ? 'string | number' : 'string';
          break;
        case 'dateRange':
          fieldType = '[string, string] | null';
          break;
        case 'date':
          fieldType = 'string';
          break;
      }

      const required = field.required ? ' // 必填' : '';
      return `  ${field.key}: ${fieldType};${required}`;
    }).join('\n');

    return `
export interface ${pageName}Record {
${recordFields}
}

export interface ${pageName}Params {
${paramFields}
}

export interface ${pageName}ApiResult {
  list: ${pageName}Record[];
  total: number;
  success: boolean;
  message?: string;
}`;
  }

  /**
   * 生成API服务内容
   */
  private generateServiceContent(config: Partial<PageConfig>, pageName: string): string {
    const api = config.api || { list: '/api/' + config.path + '/list' };

    return `
import { request } from '@/shared/axios';

export const get${pageName}List = (params: any) => {
  return request({
    url: '${api.list}',
    method: 'get',
    params,
  });
};

${api.create ? `
export const create${pageName} = (data: any) => {
  return request({
    url: '${api.create}',
    method: 'post',
    data,
  });
};
` : ''}

${api.update ? `
export const update${pageName} = (data: any) => {
  return request({
    url: '${api.update}',
    method: 'put',
    data,
  });
};
` : ''}

${api.delete ? `
export const delete${pageName} = (id: number) => {
  return request({
    url: '${api.delete}',
    method: 'delete',
    params: { id },
  });
};
` : ''}

${api.export ? `
export const export${pageName} = (params: any) => {
  return request({
    url: '${api.export}',
    method: 'get',
    params,
    responseType: 'blob',
  });
};
` : ''}`;
  }

  /**
   * 生成样式内容
   */
  private generateStyleContent(config: Partial<PageConfig>, pageName: string): string {
    return `.${pageName.toLowerCase()}-container {
  padding: 24px;
}

.toolbar {
  margin-bottom: 16px;
}

.table-container {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}`;
  }

  /**
   * 生成表单
   */
  private async generateForm(config: Partial<PageConfig>, options: GenerationOptions): Promise<GeneratedCode> {
    // 简化的表单生成实现
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      instructions: ['表单生成功能待实现']
    };
  }

  /**
   * 生成表格
   */
  private async generateTable(config: Partial<PageConfig>, options: GenerationOptions): Promise<GeneratedCode> {
    // 简化的表格生成实现
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      instructions: ['表格生成功能待实现']
    };
  }

  /**
   * 生成弹窗
   */
  private async generateModal(config: Partial<PageConfig>, options: GenerationOptions): Promise<GeneratedCode> {
    // 简化的弹窗生成实现
    return {
      files: [],
      dependencies: [],
      devDependencies: [],
      instructions: ['弹窗生成功能待实现']
    };
  }

  /**
   * 推断字段类型
   */
  private inferFieldType(dataIndex: string): string {
    const typeMap: Record<string, string> = {
      id: 'number',
      name: 'string',
      title: 'string',
      email: 'string',
      phone: 'string',
      status: 'number',
      price: 'number',
      amount: 'number',
      date: 'string',
      time: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      is: 'boolean'
    };

    // 匹配模式
    if (dataIndex.includes('id')) return 'number';
    if (dataIndex.includes('name') || dataIndex.includes('title')) return 'string';
    if (dataIndex.includes('email')) return 'string';
    if (dataIndex.includes('phone')) return 'string';
    if (dataIndex.includes('status') || dataIndex.includes('type')) return 'number';
    if (dataIndex.includes('price') || dataIndex.includes('amount') || dataIndex.includes('count')) return 'number';
    if (dataIndex.includes('date') || dataIndex.includes('time')) return 'string';
    if (dataIndex.includes('is')) return 'boolean';

    return 'any';
  }

  /**
   * 获取组件路径
   */
  private getComponentPath(name: string): string {
    const naming = this.memory.projectInfo.componentPatterns.naming;
    switch (naming) {
      case 'kebab-case':
        return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      case 'camelCase':
        return name.charAt(0).toLowerCase() + name.slice(1);
      default:
        return name;
    }
  }
}