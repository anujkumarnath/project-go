import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Popconfirm, Space, Spin, Typography, message } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useGetUserQuery, useDeleteUserMutation } from './usersApi';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function UserDetailPage() {
  const { email } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetUserQuery(email);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(email).unwrap();
      message.success('User deleted');
      navigate('/users');
    } catch (err) {
      message.error(err.data?.error || 'Delete failed');
    }
  };

  if (isLoading) return <Spin style={{ display: 'block', marginTop: 64 }} />;
  if (isError || !user) return <Title level={4}>User not found</Title>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/users')} />
          <Title level={3} style={{ margin: 0 }}>{user.name}</Title>
        </Space>
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/users/${encodeURIComponent(email)}/edit`)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this user?"
            description={`This will remove ${user.name}`}
            onConfirm={handleDelete}
            okText="Delete"
            okType="danger"
          >
            <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      </div>

      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">{user.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {user.dob ? dayjs(user.dob).format('MMM D, YYYY') : '—'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
}
