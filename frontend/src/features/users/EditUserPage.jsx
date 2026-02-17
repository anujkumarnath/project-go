import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, DatePicker, Form, Input, Space, Spin, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetUserQuery, useUpdateUserMutation } from './usersApi';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function EditUserPage() {
  const { email } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserQuery(email);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleFinish = async (values) => {
    try {
      await updateUser({
        email,
        name: values.name,
        newEmail: values.email,
        dob: values.dob.toISOString(),
      }).unwrap();
      message.success('User updated');
      navigate(`/users/${encodeURIComponent(values.email)}`);
    } catch (err) {
      message.error(err.data?.error || 'Update failed');
    }
  };

  if (isLoading) return <Spin style={{ display: 'block', marginTop: 64 }} />;
  if (isError || !user) return <Title level={4}>User not found</Title>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/users/${encodeURIComponent(email)}`)} />
        <Title level={3} style={{ margin: 0 }}>Edit User</Title>
      </div>

      <Card>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            name: user.name,
            email: user.email,
            dob: user.dob ? dayjs(user.dob) : null,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="Full name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isUpdating}>
                Save Changes
              </Button>
              <Button onClick={() => navigate(`/users/${encodeURIComponent(email)}`)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}
