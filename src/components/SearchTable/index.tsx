import { Card, Space, type TableProps } from 'antd';
import StandardTable from '../StandardTable';
import useSearchTable from './useSearchTable';
import * as styles from './index.module.css';

interface SearchTableProps<T> extends TableProps<T> {
  search: React.ReactNode;
  toolbar?: React.ReactNode;
  extra?: React.ReactNode;
}

function SearchTable<RecordType extends object = any>({
  search,
  toolbar,
  extra,
  children,
  ...restProps
}: SearchTableProps<RecordType>) {
  return (
    <>
      <div className="advanced-search">{search}</div>
      <Card>
        {(toolbar || extra) && (
          <div className={styles.opeartions}>
            {toolbar && <Space>{toolbar}</Space>}
            {extra && <div>{extra}</div>}
          </div>
        )}
        <StandardTable<RecordType> {...restProps}>{children && children}</StandardTable>
      </Card>
    </>
  );
}

SearchTable.SELECTION_COLUMN = StandardTable.SELECTION_COLUMN;
SearchTable.EXPAND_COLUMN = StandardTable.EXPAND_COLUMN;
SearchTable.SELECTION_ALL = StandardTable.SELECTION_ALL;
SearchTable.SELECTION_INVERT = StandardTable.SELECTION_INVERT;
SearchTable.SELECTION_NONE = StandardTable.SELECTION_NONE;
SearchTable.Column = StandardTable.Column;
SearchTable.ColumnGroup = StandardTable.ColumnGroup;
SearchTable.Summary = StandardTable.Summary;

export { useSearchTable };

export default SearchTable;
