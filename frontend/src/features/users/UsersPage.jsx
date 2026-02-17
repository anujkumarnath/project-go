import { useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from './usersApi';
import AddUserModal from './AddUserModal';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function UsersPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (email) => {
    try {
      await deleteUser(email).unwrap();
      message.success('User deleted');
    } catch (err) {
      message.error(err.data?.error || 'Delete failed');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <a onClick={() => navigate(`/users/${encodeURIComponent(record.email)}`)}>
          <Space>
            <UserOutlined />
            {name}
          </Space>
        </a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <Tag color="blue">{email}</Tag>,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render: (dob) => (dob ? dayjs(dob).format('MMM D, YYYY') : '—'),
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/users/${encodeURIComponent(record.email)}`)} />
          <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/users/${encodeURIComponent(record.email)}/edit`)} />
          <Popconfirm
            title="Delete this user?"
            description={`This will remove ${record.name}`}
            onConfirm={() => handleDelete(record.email)}
            okText="Delete"
            okType="danger"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
        <Title level={3} style={{ margin: 0 }}>Users</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="email"
          loading={isLoading}
          size="small"
          sticky
          scroll={{ y: 'calc(100vh - 310px)' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `${total} users`, position: ['bottomCenter'] }}
          bordered
          style={{ borderRadius: 8 }}
        />
      </div>

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
