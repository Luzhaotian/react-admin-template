import { Spin } from 'antd';
import { memo } from 'react';

function PageLoading() {
  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  );
}

export default memo(PageLoading);
