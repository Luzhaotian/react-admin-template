import { Drawer as AntdDrawer, Button } from 'antd';
import type { DrawerProps } from 'antd';
import { useMemo, useRef, useState } from 'react';
import screenfull from 'screenfull';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import classNames from 'classnames';

let seed = 0;

const Drawer: React.FC<DrawerProps> = ({ children, extra, closable, className, ...restProps }) => {
  const id = useMemo(() => {
    seed += 1;
    return `__drawer_marker_${seed}__`;
  }, []);
  const drawerRef = useRef<Element | null>();
  const [fullscreen, setFullscreen] = useState(screenfull.isFullscreen);
  const handleClick = () => {
    if (drawerRef.current == null) {
      drawerRef.current = document?.querySelector(`.${id}`);
    }

    if (drawerRef.current != null) {
      if (fullscreen) {
        screenfull.exit();
        setFullscreen(false);
      } else {
        screenfull.request(drawerRef.current);
        setFullscreen(true);
      }
    }
  };

  return (
    <AntdDrawer
      closable={fullscreen ? false : closable}
      className={classNames(className, id)}
      extra={
        <>
          <Button
            shape="circle"
            onClick={handleClick}
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          />
          {extra}
        </>
      }
      {...restProps}
    >
      {children}
    </AntdDrawer>
  );
};

export default Drawer;
