import { Button, Row, Col, type RowProps, Form, Space } from 'antd';
import React, { isValidElement, useLayoutEffect, useMemo, useState } from 'react';
import ExpandButton from '../ExpandButton';

export interface SearchGroupProps extends RowProps {
  defaultExpand?: boolean;
  extra?: boolean;
  onSubmit?: () => void;
  onReset?: () => void;
}

export interface SearchGroupContext {
  expand?: boolean;
}

export const GroupContext = React.createContext<SearchGroupContext | null>(null);

const SearchGroup: React.FC<SearchGroupProps> = ({
  defaultExpand,
  extra,
  children,
  onReset,
  ...restProps
}) => {
  const [supportEllipsis, setSupportEllipsis] = useState(false);
  const [expand, setExpand] = useState(defaultExpand);
  const value = useMemo(() => ({ expand }), [expand]);

  useLayoutEffect(() => {
    const vnode = React.Children.toArray(children).find((item) =>
      isValidElement(item) ? item.props.ellipsis : false,
    );

    setSupportEllipsis(!!vnode);
  }, [children]);

  return (
    <GroupContext.Provider value={value}>
      <Row gutter={24} justify="space-between" {...restProps}>
        {children}
        <Col flex={1}>
          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              {onReset && <Button onClick={onReset}>重置</Button>}
              {extra}
              {supportEllipsis && (
                <ExpandButton
                  expand={expand}
                  onClick={() => {
                    setExpand(!expand);
                  }}
                />
              )}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </GroupContext.Provider>
  );
};

export default SearchGroup;
