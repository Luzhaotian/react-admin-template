/* eslint-disable react/default-props-match-prop-types */
import { Pagination, type CheckboxProps, type TablePaginationConfig, Checkbox } from 'antd';
import classNames from 'classnames';
import type { SorterResult } from 'antd/es/table/interface';

import { useEffect, useState, type CSSProperties } from 'react';
import BaseTable, { AutoResizer, type BaseTableProps, type ColumnShape } from 'react-base-table';
import 'react-base-table/styles.css';
import FilterDropdown from './FilterDropdown';
import Sorter, { type SortOrder } from './Sorter';
import styles from './index.css';

export type { ColumnShape };

function showTotal(total: number, range: [number, number]) {
  return `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`;
}

export interface VirtualTableProps<RecordType>
  extends Omit<
    RemoveIndexSignature<BaseTableProps<RecordType>>,
    'width' | 'rowKey' | 'columns' | 'data'
  > {
  bordered?: boolean;
  rowSelection?: {
    getCheckboxProps?: (
      record: RecordType,
    ) => Partial<Omit<CheckboxProps, 'checked' | 'defaultChecked'>>;
    selectedRowKeys?: React.Key[];
    defaultSelectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: RecordType[]) => void;
  };
  rowKey: string | number;
  columns: ColumnShape<RecordType>[];
  data: readonly RecordType[];
  pagination?: false | TablePaginationConfig;
  onFilterChange?: (filters: Record<string, React.Key[]>) => void;
  onSortChange?: (sorter: SorterResult<RecordType> | SorterResult<RecordType>[]) => void;
  sorter?: SorterResult<RecordType> | SorterResult<RecordType>[];
  onPaginationChange?: (page: number, pageSize: number) => void;
  className?: string;
  style?: CSSProperties;
}

function VirtualTable<RecordType extends object = any>({
  className,
  style,
  pagination,
  onFilterChange,
  onSortChange,
  sorter: externalSorter,
  onPaginationChange,
  rowSelection,
  columns,
  rowKey,
  data,
  ...restProps
}: VirtualTableProps<RecordType>) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(() => {
    if (rowSelection?.selectedRowKeys) {
      return rowSelection.selectedRowKeys;
    }

    if (rowSelection?.defaultSelectedRowKeys) {
      return rowSelection.defaultSelectedRowKeys;
    }

    return [];
  });

  useEffect(() => {
    if (rowSelection?.selectedRowKeys !== undefined) {
      setSelectedRowKeys(rowSelection.selectedRowKeys);
    }
  }, [rowSelection?.selectedRowKeys]);

  const [filters, setFilters] = useState<Record<string, React.Key[]>>({});
  const [internalSorter, setInternalSorter] = useState<
    SorterResult<RecordType> | SorterResult<RecordType>[]
  >(externalSorter ?? {});

  useEffect(() => {
    if (externalSorter !== undefined) {
      const currentSorter = Array.isArray(internalSorter) ? internalSorter[0] : internalSorter;
      const newSorter = Array.isArray(externalSorter) ? externalSorter[0] : externalSorter;

      const currentIsEmpty =
        !currentSorter ||
        typeof currentSorter !== 'object' ||
        !('field' in currentSorter) ||
        !currentSorter.field;
      const newIsEmpty =
        !newSorter || typeof newSorter !== 'object' || !('field' in newSorter) || !newSorter.field;

      if (currentIsEmpty && newIsEmpty) {
        return;
      }

      const currentField = currentIsEmpty ? null : String(currentSorter.field);
      const currentOrder = currentIsEmpty ? null : currentSorter.order;
      const newField = newIsEmpty ? null : String(newSorter.field);
      const newOrder = newIsEmpty ? null : newSorter.order;

      if (currentField !== newField || currentOrder !== newOrder) {
        setInternalSorter(externalSorter);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSorter]);

  const getColumnSortOrder = (
    dataKey: string | undefined,
    key: string | number | undefined,
  ): SortOrder => {
    const sorterToCheck = internalSorter;

    if (!sorterToCheck) {
      return null;
    }

    if (Array.isArray(sorterToCheck) && sorterToCheck.length === 0) {
      return null;
    }

    const currentSorter = Array.isArray(sorterToCheck) ? sorterToCheck[0] : sorterToCheck;

    if (!currentSorter || typeof currentSorter !== 'object' || !('field' in currentSorter)) {
      return null;
    }

    const columnKey = dataKey ?? String(key);
    const sorterField = String(currentSorter.field);
    if (sorterField === columnKey) {
      return currentSorter.order ?? null;
    }

    return null;
  };

  let internalColumns: ColumnShape<RecordType>[] = columns.map((item) => {
    const hasFilters = !!item.filters;
    const hasSorter = !!item.sorter;
    const columnKey = item.dataKey ?? String(item.key);
    const sortOrder = getColumnSortOrder(item.dataKey, item.key ? String(item.key) : undefined);

    if (hasFilters || hasSorter) {
      return {
        ...item,
        headerRenderer({ column }) {
          const handleSortChange = (order: SortOrder) => {
            if (order === null) {
              const emptySorter = {} as SorterResult<RecordType>;
              setInternalSorter(emptySorter);
              onSortChange?.(emptySorter);
            } else {
              const newSorter: SorterResult<RecordType> = {
                field: columnKey as any,
                order,
              };
              setInternalSorter(newSorter);
              onSortChange?.(newSorter);
            }
          };

          return (
            <div
              style={{
                position: 'relative',
                paddingRight: hasFilters || hasSorter ? '15px' : '0',
              }}
            >
              {column.title}
              {hasFilters && (
                <FilterDropdown
                  filters={column.filters}
                  onConfirm={(filteredKeys) => {
                    const newFilters = {
                      ...filters,
                      [columnKey]: filteredKeys,
                    };
                    setFilters(newFilters);
                    onFilterChange?.(newFilters);
                  }}
                />
              )}
              {hasSorter && <Sorter sortOrder={sortOrder} onChange={handleSortChange} />}
            </div>
          );
        },
      };
    }

    return item;
  });

  if (rowSelection) {
    const onSelectedRowKeysChange = (rowKeys: React.Key[]) => {
      setSelectedRowKeys(rowKeys);
      rowSelection.onChange?.(
        rowKeys,
        data?.filter((rowData) =>
          rowKeys.includes(rowData[rowKey as keyof RecordType] as string),
        ) ?? [],
      );
    };

    internalColumns = [
      {
        key: '__selection__',
        width: 40,
        flexShrink: 0,
        resizable: false,
        frozen: 'left',
        selectedRowKeys,
        dataLength: data.length,
        cellRenderer({ rowData, column }) {
          const key = rowData[rowKey as keyof RecordType] as React.Key;
          const selectedKeys: React.Key[] = column.selectedRowKeys;
          const checked = selectedKeys.includes(key);

          return (
            <Checkbox
              {...rowSelection.getCheckboxProps?.(rowData)}
              checked={checked}
              onChange={(e) => {
                if (e.target.checked) {
                  if (!selectedKeys.includes(key)) {
                    onSelectedRowKeysChange([...selectedKeys, key]);
                  }
                } else {
                  onSelectedRowKeysChange(selectedKeys.filter((item) => item !== key));
                }
              }}
            />
          );
        },
        headerRenderer({ column }) {
          const selectedKeys: React.Key[] = column.selectedRowKeys;
          const rowTotal: number = column.dataLength;

          return (
            <Checkbox
              indeterminate={selectedKeys.length > 0 && selectedKeys.length < rowTotal}
              checked={selectedKeys.length > 0 && selectedKeys.length === rowTotal}
              disabled={rowTotal === 0}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectedRowKeysChange(
                    data.map((item) => item[rowKey as keyof RecordType] as React.Key),
                  );
                } else {
                  onSelectedRowKeysChange([]);
                }
              }}
            />
          );
        },
      } as ColumnShape<RecordType>,
      ...internalColumns,
    ];
  }

  return (
    <>
      <div
        className={classNames(className, styles.bordered)}
        style={{ height: 440, ...(style ?? {}) }}
      >
        <AutoResizer>
          {({ width, height }) => (
            <BaseTable
              fixed
              rowKey={rowKey}
              height={height}
              headerHeight={40}
              rowHeight={38}
              columns={internalColumns}
              data={data as NonReadonly<RecordType[]>}
              {...restProps}
              width={width}
            />
          )}
        </AutoResizer>
      </div>

      {pagination && (
        <Pagination
          {...pagination}
          className="ant-table-pagination ant-table-pagination-right"
          style={{ marginTop: 16, marginBottom: 0, textAlign: 'right' }}
          size="default"
          showSizeChanger
          showQuickJumper
          pageSizeOptions={['10', '20', '30', '50', '100', '500', '1000']}
          showTotal={showTotal}
          onChange={onPaginationChange}
        />
      )}
    </>
  );
}

VirtualTable.defaultProps = {
  columns: [],
  data: [],
  rowKey: 'id',
};

export default VirtualTable;
