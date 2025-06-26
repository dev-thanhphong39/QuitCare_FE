import React, { useEffect, useState } from "react";
import { Table, Space, Button, Popconfirm, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../configs/axios"; // import axios instance
import { toast } from "react-toastify";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // loading state

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/user");
      setUsers(response.data);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/user/${id}`);
      toast.success("Xoá người dùng thành công!");
      fetchUsers(); // cập nhật lại danh sách
    } catch (error) {
      toast.error("Lỗi khi xoá người dùng!");
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
        gender === "MALE" ? <Tag color="blue">Nam</Tag> : <Tag color="pink">Nữ</Tag>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => <Tag color={role === "ADMIN" ? "gold" : "default"}>{role}</Tag>,
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
          <Button icon={<EditOutlined />} disabled>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2>Quản lý người dùng</h2>
        <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={loading}>
          Tải lại danh sách
        </Button>
      </div>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
    </div>
  );
}

export default UserManagement;
