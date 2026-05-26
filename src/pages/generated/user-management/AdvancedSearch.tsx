import {{ Form, Select }} from 'antd';
import type {{ Dayjs }} from 'dayjs';
import RangePicker from '@/components/RangePicker';
import SearchGroup from '@/components/SearchGroup';
import {{ searchFormProps }} from '@/shared/basicProps';
import {{ adapters }} from '@/shared/adaptor';
import {{ omit }} from 'lodash-es';
import type {{ SelectOption }} from './index';
import type {{ GlobalState }} from '@/stores/global';
import type {{ 用户管理Params }} from '@/services/user-management';

type Conditions = 用户管理Params;

interface FormValues extends Omit<Conditions, > {{
  
}}

interface 用户管理AdvancedSearchProps {{
  onSubmit?: (values: Conditions) => void;
  onReset?: (values: Conditions) => void;
  
}}

const transformConditions = (values: FormValues): Conditions => {{
  const  = adapters.daterange2string(values. ?? []);
  return {{
    ...omit(values, ['']),
    
  }};
}};

const 用户管理AdvancedSearch: React.FC<用户管理AdvancedSearchProps> = ({{
  onSubmit,
  onReset,
  
}}) => {{
  const [form] = Form.useForm<FormValues>();

  const  = () ?? [];

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
                <SearchGroup.Item>
          <Form.Item label="用户名" name="username">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </SearchGroup.Item>
        <SearchGroup.Item>
          <Form.Item label="邮箱" name="email">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </SearchGroup.Item>
        <SearchGroup.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
        </SearchGroup.Item>
        <SearchGroup.Item>
          <Form.Item label="状态" name="status">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              options=[{"label": "启用", "value": 1}, {"label": "禁用", "value": 0}]
              placeholder="请选择"
            />
          </Form.Item>
        </SearchGroup.Item>
        <SearchGroup.Item>
          <Form.Item label="创建时间" name="dateRange">
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
        </SearchGroup.Item>
      </SearchGroup>
    </Form>
  );
}};

export default 用户管理AdvancedSearch;
