import { memo } from 'react';
import styles from './index.css';

export interface PlainCardProps {
  title?: React.ReactElement;
  extra?: React.ReactElement;
  children?: React.ReactElement;
}

const PlainCard: React.FC<PlainCardProps> = ({ title, extra, children }) => (
  <div className={styles.plainCard}>
    <div className={styles.plainCardHeader}>
      <div className={styles.plainCardTitle}>{title}</div>
      {extra && <div className={styles.plainCardExtra}>{extra}</div>}
    </div>
    <div className={styles.plainCardBody}>{children}</div>
  </div>
);

export default memo(PlainCard);
