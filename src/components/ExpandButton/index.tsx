import { DownOutlined, UpOutlined } from '@ant-design/icons';
import TextButton from '@/components/TextButton';
import styles from './index.css';

interface ExpandButtonProps {
  expand?: boolean;
  onClick?: () => void;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({ expand, onClick }) => (
  <TextButton onClick={onClick} className={styles.button}>
    {expand ? (
      <>
        收起
        <UpOutlined />
      </>
    ) : (
      <>
        展开
        <DownOutlined />
      </>
    )}
  </TextButton>
);

export default ExpandButton;
