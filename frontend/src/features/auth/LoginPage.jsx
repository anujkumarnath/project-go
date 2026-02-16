import { Button, Card, Form, Input, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApi';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    try {
      await login(values).unwrap();
      message.success('Logged in successfully');
      navigate('/users');
    } catch (err) {
      message.error(err.data?.error || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <Title level={2} style={{ margin: 0 }}>Welcome back</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Don't have an account? <Link to="/register">Register</Link>
        </Text>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    width: 400,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderRadius: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
};
