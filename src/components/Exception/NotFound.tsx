import { Link } from 'react-router-dom';
import { Button } from 'antd';

import styles from './style.css';

export default function NotFound() {
  return (
    <div className={styles.exception}>
      <div className={styles.content}>
        <h2>404</h2>
        <p>很抱歉，您访问的页面不存在</p>
        <Link to="/">
          <Button type="primary">回到首页</Button>
        </Link>
      </div>
    </div>
  );
}
