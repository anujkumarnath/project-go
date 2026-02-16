import { Button, Card, DatePicker, Form, Input, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from './authApi';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        dob: values.dob.toISOString(),
      };
      await register(payload).unwrap();
      message.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      message.error(err.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <Title level={2} style={{ margin: 0 }}>Create account</Title>
          <Text type="secondary">Fill in the details to get started</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full name" />
          </Form.Item>

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
            name="dob"
            rules={[{ required: true, message: 'Please select your date of birth' }]}
          >
            <DatePicker
              placeholder="Date of birth"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Create account
            </Button>
          </Form.Item>
        </Form>

        <Text>
          Already have an account? <Link to="/login">Sign in</Link>
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
    width: 420,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderRadius: 12,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
};
