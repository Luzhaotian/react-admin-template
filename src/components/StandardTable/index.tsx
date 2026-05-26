import { useMemo } from 'react';
import type { TableProps, TablePaginationConfig } from 'antd';
import { Table } from 'antd';
import { isNumber, isObject, isString } from 'lodash';

const DEFAULT_HEIGHT = 500;

interface ScrollProperties {
  x?: string | number | true;
  y?: string | number;
  scrollToFirstRowOnChange?: boolean;
}

/**
 * 构造表格滚动属性
 */
function makeScrollProperties(scroll?: ScrollProperties): ScrollProperties {
  let x: string | number | true = '100%';

  if (scroll && (isNumber(scroll.x) || isString(scroll.x))) {
    x = scroll.x;
  }

  let y: string | number = Math.max(window.innerHeight - 190, DEFAULT_HEIGHT);

  if (scroll && (isNumber(scroll.y) || isString(scroll.y))) {
    y = scroll.y;
  }

  return {
    y,
    x,
    scrollToFirstRowOnChange: scroll?.scrollToFirstRowOnChange,
  };
}

/**
 * 展示分页汇总信息
 */
function showTotal(total: number, range: [number, number]) {
  return `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`;
}

/**
 * 构造表格分页属性
 */
function makePaginationProperties(
  pagination?: false | TablePaginationConfig,
): false | TablePaginationConfig | undefined {
  if (!pagination) {
    return false;
  }

  if (isObject(pagination)) {
    return {
      size: 'default',
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '30', '50', '100'],
      style: {
        marginBottom: 0,
      },
      showTotal,
      ...pagination,
    };
  }
}

function StandardTable<RecordType extends object = any>({
  scroll,
  children,
  pagination,
  ...restProps
}: TableProps<RecordType>) {
  const tableScroll = useMemo(() => makeScrollProperties(scroll), [scroll]);
  const tablePagination = useMemo(() => makePaginationProperties(pagination), [pagination]);

  return (
    <Table<RecordType>
      {...restProps}
      size="small"
      scroll={tableScroll}
      pagination={tablePagination}
    >
      {children && children}
    </Table>
  );
}

StandardTable.SELECTION_COLUMN = Table.SELECTION_COLUMN;
StandardTable.EXPAND_COLUMN = Table.EXPAND_COLUMN;
StandardTable.SELECTION_ALL = Table.SELECTION_ALL;
StandardTable.SELECTION_INVERT = Table.SELECTION_INVERT;
StandardTable.SELECTION_NONE = Table.SELECTION_NONE;
StandardTable.Column = Table.Column;
StandardTable.ColumnGroup = Table.ColumnGroup;
StandardTable.Summary = Table.Summary;

export default StandardTable;
