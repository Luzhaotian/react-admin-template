import SearchTable, {{ useSearchTable }} from '@/components/SearchTable';
import get用户管理List from '@/services/user-management';
import 用户管理AdvancedSearch from './AdvancedSearch';
import createColumns from './columns';
import type {{ 用户管理Record }} from './types';
import {{ SelectOption }} from '@/stores/global';

export default function 用户管理() {{
  // 获取全局枚举
  const {{ user }} = useGlobalStore((state) => state.userMap);

  const {{ searchProps, tableProps }} = useSearchTable(get用户管理List);

  // 处理额外的选项数据
  const [{ channelOptionsState = {{ value: channelNameOptions = [], nameOptions = [] = {{}} }}, fetchChannelOptions] = useAsyncFn(async () => {{
    const data = await getUserOptions();
    const mapToSelectOptions = (list: string[] = []): SelectOption[] =>
      list.map((item) => ({{
        label: item,
        value: item,
      }}));

    return {{
      channelNameOptions: mapToSelectOptions(data?.channels),
      nameOptions: mapToSelectOptions(data?.names)
    }};
  }}, []);

  useEffect(() => {{
    fetchChannelOptions();
  }}, []);

  return (
    <SearchTable
      {{...tableProps}}
      search={
        <用户管理AdvancedSearch
          {{...searchProps}}
          
        />
      }
      bordered
      rowKey="id"
      columns={createColumns({{  }})}
      scroll={{ 'max-content' }}
    />
  );
}}
