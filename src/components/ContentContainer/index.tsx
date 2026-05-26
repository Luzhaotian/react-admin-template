import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, type CardProps, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.css';

interface ContentContainerProps extends Omit<CardProps, 'type'> {
  title?: React.ReactNode;
}

const ContentContainer: React.FC<React.PropsWithChildren<ContentContainerProps>> = ({
  title,
  children,
  ...restProps
}) => {
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  return (
    <Card
      title={
        <Space style={{ color: '#333' }}>
          {window.history.length > 1 && (
            <Tooltip title="返回">
              <Button icon={<ArrowLeftOutlined />} shape="circle" onClick={onBack} />
            </Tooltip>
          )}
          <span style={{ fontSize: 20 }}>{title}</span>
        </Space>
      }
      className={styles.card}
      {...restProps}
    >
      {children}
    </Card>
  );
};

export default ContentContainer;
