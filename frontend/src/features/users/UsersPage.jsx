import { useState } from 'react';
import { Button, Popconfirm, Space, Table, Tag, Typography, message } from 'antd';
import { DeleteOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useGetUsersQuery, useDeleteUserMutation } from './usersApi';
import AddUserModal from './AddUserModal';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function UsersPage() {
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
      render: (name) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
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
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete this user?"
          description={`This will remove ${record.name}`}
          onConfirm={() => handleDelete(record.email)}
          okText="Delete"
          okType="danger"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Users</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="email"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
        style={{ borderRadius: 8, overflow: 'hidden' }}
      />

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
