import { Card, Col, Row, Statistic, Typography } from 'antd';
import { UserOutlined, ShoppingCartOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>工作台</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="用户总数" value={1128} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="今日订单" value={93} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="待处理工单" value={25} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="今日交易额" value={12580} prefix={<DollarOutlined />} suffix="元" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
