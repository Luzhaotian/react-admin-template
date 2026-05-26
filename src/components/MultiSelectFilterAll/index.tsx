/**
 * 可搜索多选：底部「全选」作用于当前筛选结果（与搜索框关键字一致）。
 */
import { Checkbox, Divider, Select } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';

const { Option } = Select;

export type MultiSelectFilterAllOption = { key: string | number; value: string };

export type MultiSelectFilterAllProps = {
  options: MultiSelectFilterAllOption[];
  /** 由 Form.Item 注入 */
  value?: (string | number)[];
  onChange?: (value: (string | number)[]) => void;
  allowClear?: boolean;
  placeholder?: string;
  disabled?: boolean;
};

const defaultFilterOption = (input: string, option?: { children?: ReactNode }) =>
  String(option?.children)
    .toLowerCase()
    .indexOf(String(input).toLowerCase()) > -1;

function MultiSelectFilterAll(props: MultiSelectFilterAllProps) {
  const { options, value, onChange, allowClear, placeholder, disabled } = props;

  const [searchKeyword, setSearchKeyword] = useState('');

  const selected = value ?? [];
  const filteredKeys = useMemo(
    () =>
      options
        .filter((item) => item.value.toLowerCase().indexOf(searchKeyword.toLowerCase()) > -1)
        .map((item) => item.key),
    [options, searchKeyword],
  );

  const checked = filteredKeys.length > 0 && filteredKeys.every((k) => selected.includes(k));
  const indeterminate = filteredKeys.some((k) => selected.includes(k)) && !checked;

  return (
    <Select
      allowClear={allowClear}
      placeholder={placeholder}
      disabled={disabled}
      mode="multiple"
      showSearch
      autoClearSearchValue
      filterOption={defaultFilterOption}
      searchValue={searchKeyword}
      onSearch={setSearchKeyword}
      value={value}
      onChange={(v) => onChange?.(v as (string | number)[])}
      dropdownRender={(menu: ReactNode) => (
        <>
          {menu}
          <Divider style={{ margin: 0 }} />
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div onMouseDown={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              disabled={filteredKeys.length === 0}
              onChange={(e) => {
                const set = new Set(filteredKeys);
                if (e.target.checked) {
                  onChange?.([...new Set([...selected, ...filteredKeys])]);
                } else {
                  onChange?.(selected.filter((k) => !set.has(k)));
                }
              }}
              style={{ width: '100%', padding: '6px 12px' }}
            >
              全选
            </Checkbox>
          </div>
        </>
      )}
    >
      {options.map((item) => (
        <Option value={item.key} key={item.key}>
          {item.value}
        </Option>
      ))}
    </Select>
  );
}

export default MultiSelectFilterAll;
