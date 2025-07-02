import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Card,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Search } = Input;
const { Option } = Select;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGender, setFilterGender] = useState("");

  // Gọi API lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/user");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Áp dụng filter và search
  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Role filter
    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Status filter
    if (filterStatus) {
      filtered = filtered.filter((user) => user.status === filterStatus);
    }

    // Gender filter
    if (filterGender) {
      filtered = filtered.filter((user) => user.gender === filterGender);
    }

    setFilteredUsers(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchText("");
    setFilterRole("");
    setFilterStatus("");
    setFilterGender("");
    setFilteredUsers(users);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [searchText, filterRole, filterStatus, filterGender, users]);

  // Gọi API xoá người dùng
  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success("Xoá người dùng thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xoá người dùng!");
    }
  };

  // Mở modal sửa và đổ dữ liệu vào form
  const showEditModal = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
    form.setFieldsValue(user);
  };

  // Gọi API cập nhật người dùng
  const handleUpdateUser = async () => {
    try {
      const updatedUser = await form.validateFields();
      await api.put(`/admin/user/${editingUser.id}`, {
        ...editingUser,
        ...updatedUser,
      });
      toast.success("Cập nhật người dùng thành công!");
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi cập nhật người dùng!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) =>
        gender === "MALE" ? (
          <Tag color="blue">Nam</Tag>
        ) : (
          <Tag color="pink">Nữ</Tag>
        ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "default";
        switch (role) {
          case "ADMIN":
            color = "gold";
            break;
          case "COACH":
            color = "cyan";
            break;
          case "STAFF":
            color = "blue";
            break;
          case "CUSTOMER":
            color = "green";
            break;
          case "GUEST":
            color = "gray";
            break;
          default:
            break;
        }
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "ACTIVE" ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Không hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá người dùng này không?"
            onConfirm={() => deleteUser(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h2>Quản lý người dùng</h2>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          loading={loading}
        >
          Tải lại danh sách
        </Button>
      </div>

      {/* Filter và Search Section */}
      <Card style={{ marginBottom: "16px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Lọc theo vai trò"
              value={filterRole}
              onChange={setFilterRole}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="ADMIN">ADMIN</Option>
              <Option value="COACH">COACH</Option>
              <Option value="STAFF">STAFF</Option>
              <Option value="CUSTOMER">CUSTOMER</Option>
              <Option value="GUEST">GUEST</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="ACTIVE">Đang hoạt động</Option>
              <Option value="INACTIVE">Không hoạt động</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Lọc theo giới tính"
              value={filterGender}
              onChange={setFilterGender}
              allowClear
              style={{ width: "100%" }}
            >
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={applyFilters}
                type="primary"
              >
                Áp dụng bộ lọc
              </Button>
              <Button onClick={resetFilters}>Xóa bộ lọc</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalVisible}
        onOk={handleUpdateUser}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Tên người dùng"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true, message: "Chọn giới tính" }]}
          >
            <Select>
              <Select.Option value="MALE">Nam</Select.Option>
              <Select.Option value="FEMALE">Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Chọn vai trò" }]}
          >
            <Select>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
              <Select.Option value="COACH">COACH</Select.Option>
              <Select.Option value="STAFF">STAFF</Select.Option>
              <Select.Option value="CUSTOMER">CUSTOMER</Select.Option>
              <Select.Option value="GUEST">GUEST</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select>
              <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
              <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
