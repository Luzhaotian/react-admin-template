import { Link } from 'react-router-dom';
import { Button } from 'antd';

import styles from './style.css';

export default function Forbidden() {
  return (
    <div className={styles.exception}>
      <div className={styles.content}>
        <h2>403</h2>
        <p>很抱歉，你没有权限访问此页面</p>
        <Link to="/">
          <Button type="primary">回到首页</Button>
        </Link>
      </div>
    </div>
  );
}
