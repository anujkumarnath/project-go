import { DatePicker, Form, Input, Modal, message } from 'antd';
import { useAddUserMutation } from './usersApi';

export default function AddUserModal({ open, onClose }) {
  const [form] = Form.useForm();
  const [addUser, { isLoading }] = useAddUserMutation();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dob: values.dob.toISOString(),
      };
      await addUser(payload).unwrap();
      message.success('User added');
      form.resetFields();
      onClose();
    } catch (err) {
      if (err.data?.error) {
        message.error(err.data.error);
      }
    }
  };

  return (
    <Modal
      title="Add new user"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isLoading}
      okText="Add"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
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
          label="Date of birth"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
