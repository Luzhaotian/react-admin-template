import { Col, type ColProps } from 'antd';
import { useContext } from 'react';
import { GroupContext } from './Group';

export interface SearchItemProps extends ColProps {
  /**
   * 当前元素是否支持展开/收起控制
   */
  ellipsis?: boolean;
}

const SearchItem: React.FC<SearchItemProps> = ({ ellipsis, children, ...restProps }) => {
  const context = useContext(GroupContext);

  return (
    <Col
      span={ellipsis ? (context?.expand ? 8 : 0) : 8}
      xxl={ellipsis ? (context?.expand ? 6 : 0) : 6}
      {...restProps}
    >
      {children}
    </Col>
  );
};

export default SearchItem;
