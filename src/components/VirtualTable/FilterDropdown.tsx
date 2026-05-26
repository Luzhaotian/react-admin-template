import { Checkbox, Dropdown, Button, Divider, Space, theme } from 'antd';
import { FilterFilled } from '@ant-design/icons';
import { type ReactElement, cloneElement, useState } from 'react';
import classNames from 'classnames';
import styles from './FilterDropdown.css';

interface FilterItem {
  text: string;
  value: React.Key;
}

interface FilterDropdownProps {
  className?: string;
  filters: FilterItem[];
  onConfirm?: (filteredKeys: React.Key[]) => void;
}

const { useToken } = theme;

const renderFilterItems = ({
  filters,
  filteredKeys,
}: {
  filters: FilterItem[];
  filteredKeys: React.Key[];
}) =>
  filters.map((item, index) => {
    const key = String(item.value ?? index);

    return {
      key,
      label: (
        <>
          <Checkbox checked={filteredKeys.includes(key)} />
          <span className={styles.filterItemText}>{item.text}</span>
        </>
      ),
    };
  });

const FilterDropdown: React.FC<FilterDropdownProps> = ({ className, filters, onConfirm }) => {
  const [filteredKeys, setFilteredKeys] = useState<React.Key[]>([]);
  const [confirmedKeys, setConfirmedKeys] = useState<React.Key[]>([]);
  const onInternalSelectKeys = ({ selectedKeys }: { selectedKeys: React.Key[] }) => {
    setFilteredKeys(selectedKeys);
  };

  const [visible, setVisible] = useState(false);

  const onInternalReset = () => {
    setFilteredKeys([]);
  };

  const onInternalConfirm = () => {
    setVisible(false);
    setConfirmedKeys(filteredKeys);
    onConfirm?.(filteredKeys);
  };

  const onInternalOpenChange = (newVisible: boolean) => {
    if (newVisible) {
      setFilteredKeys(confirmedKeys);
    }
    setVisible(newVisible);
  };

  const { token } = useToken();
  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };

  return (
    <Dropdown
      trigger={['click']}
      open={visible}
      onOpenChange={onInternalOpenChange}
      menu={{
        selectable: true,
        multiple: true,
        items: renderFilterItems({
          filters,
          filteredKeys,
        }),
        selectedKeys: filteredKeys as string[],
        onSelect: onInternalSelectKeys,
        onDeselect: onInternalSelectKeys,
      }}
      dropdownRender={(menus) => (
        <div style={contentStyle}>
          {cloneElement(menus as ReactElement, {
            style: { boxShadow: 'none' },
          })}
          <Divider style={{ margin: 0 }} />
          <Space style={{ padding: 8 }}>
            <Button
              size="small"
              type="link"
              disabled={filteredKeys.length === 0}
              onClick={onInternalReset}
            >
              重置
            </Button>
            <Button type="primary" size="small" onClick={onInternalConfirm}>
              确定
            </Button>
          </Space>
        </div>
      )}
    >
      <button
        type="button"
        className={classNames(
          styles.filtersBtn,
          { [styles.actived]: confirmedKeys.length > 0 },
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <FilterFilled />
      </button>
    </Dropdown>
  );
};

export default FilterDropdown;
