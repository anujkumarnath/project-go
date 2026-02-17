import { Layout, Menu, Typography, Button, theme } from 'antd';
import { UserOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { getUser, clearAuth } from '../features/auth/authApi';

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Users',
    },
  ];

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 10 }}
      >
        <div style={{ padding: '16px 24px', textAlign: 'center' }}>
          <Text strong style={{ color: '#fff', fontSize: 18 }}>UserApp</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout style={{ marginLeft: 200 }}>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 16,
          position: 'sticky',
          top: 0,
          zIndex: 9,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {user && (
            <Text>
              <UserOutlined /> {user.name || user.email}
            </Text>
          )}
          <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ padding: 24, overflow: 'hidden', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
