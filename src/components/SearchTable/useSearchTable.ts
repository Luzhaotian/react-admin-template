import type { TablePaginationConfig, TableProps } from 'antd';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { omit } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ServiceResult<T> {
  total?: number;
  records?: T[];
}

export type Service<T = any> = (args: any) => Promise<ServiceResult<T>>;

export interface ResponseAdapterReturn {
  total: number;
  list: any[];
}

export interface Options {
  manual?: boolean;
  pagination?: TablePaginationConfig | false;
  defaultParams?: Record<string, any>;
  defaultPageSize?: number;
}

interface Pagination {
  page?: number;
  pageSize?: number;
}

export interface State<RecordType> {
  total: number;
  list: RecordType[];
  pagination: Pagination;
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[];
  params: Record<string, any>;
  filters: Record<string, FilterValue | null>;
  loading: boolean;
}

type AntdTableChangeHandler<RecordType> = (
  pagination: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
  extra: TableCurrentDataSource<RecordType>,
) => void;

interface SearchProps {
  onSubmit: (params?: any) => void;
  onReset: (params?: any) => void;
  defaultValues: Record<string, any>;
}

interface Result<RecordType> {
  state: State<RecordType>;
  search: (params?: any) => void;
  refresh: (toFirstPage?: boolean) => void;
  searchProps: SearchProps;
  tableProps: TableProps<RecordType>;
}

/**
 * 提供一个通用的表格查询hook，返回查询相关的信息以及查询和表格变化的事件处理程序
 */
export default function useSearchTable<RecordType extends object = any>(
  service: Service<RecordType>,
  options: Options = {},
): Result<RecordType> {
  const {
    manual = false,
    pagination: hasPagination = true,
    defaultParams = {},
    defaultPageSize = 10,
  } = options;
  const [state, setState] = useState<State<RecordType>>({
    total: 0,
    list: [],
    pagination: {
      page: 1,
      pageSize: defaultPageSize,
    },
    sorter: {},
    filters: {},
    params: defaultParams,
    loading: false,
  });
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const [defaultValues, setDefaultValues] = useState(defaultParams);

  useEffect(() => {
    setDefaultValues(defaultParams);
  }, [defaultParams]);

  const serviceRef = useRef(service);
  useEffect(() => {
    serviceRef.current = service;
  }, [service]);

  // 从接口服务查询数据
  const fetch = useCallback(
    async (params: Record<string, any>) => {
      setState((prevState) => ({ ...prevState, loading: true }));
      try {
        const firstSorter = Array.isArray(params.sorter) ? params.sorter[0] : params.sorter;
        const { field, order = null } = firstSorter;

        const serviceParams = {
          ...omit(params, 'page', 'pageSize', 'filters', 'sorter'),
          ...params.filters,
          sortBy: field,
          orderBy: order,
        };

        if (hasPagination) {
          serviceParams.pageSize = params.pageSize;
          serviceParams.pageIndex = params.page;
        }

        const { total = 0, records } = (await serviceRef.current(serviceParams)) ?? {};

        setState((prevState) => ({
          ...prevState,
          total,
          list: records ?? [],
          sorter: params.sorter,
          filters: params.filters,
          pagination: {
            page: params.page,
            pageSize: params.pageSize,
          },
        }));
      } finally {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    },
    [hasPagination],
  );

  const search = useCallback(
    (params = {}) => {
      const finalParams = {
        ...defaultValues,
        ...params,
      };
      setState((prevState) => ({ ...prevState, params: finalParams }));

      const { sorter, filters, pagination } = stateRef.current;

      fetch({
        ...finalParams,
        sorter,
        filters,
        page: 1,
        pageSize: pagination.pageSize,
      });
    },
    [defaultValues, fetch],
  );

  const refresh = useCallback(
    (toFirstPage?: boolean) => {
      const { params, sorter, filters, pagination } = stateRef.current;

      fetch({
        ...params,
        sorter,
        filters,
        page: toFirstPage ? 1 : pagination.page,
        pageSize: pagination.pageSize,
      });
    },
    [fetch],
  );

  const onTableChange: AntdTableChangeHandler<RecordType> = useCallback(
    ({ current = 0, pageSize = 0 }, filters, sorter) => {
      const { params } = stateRef.current;

      fetch({
        ...params,
        sorter,
        filters,
        page: current,
        pageSize,
      });
    },
    [fetch],
  );

  useEffect(() => {
    if (!manual) {
      search(defaultParams);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pagination = useMemo(() => {
    if (hasPagination) {
      return {
        current: state.pagination.page,
        pageSize: state.pagination.pageSize,
        total: state.total,
      };
    }

    return false;
  }, [hasPagination, state.pagination.page, state.pagination.pageSize, state.total]);

  return {
    state,
    search,
    refresh,
    searchProps: {
      onSubmit: search,
      onReset: search,
      defaultValues,
    },
    tableProps: {
      loading: state.loading,
      onChange: onTableChange,
      dataSource: state.list,
      pagination,
    },
  };
}
