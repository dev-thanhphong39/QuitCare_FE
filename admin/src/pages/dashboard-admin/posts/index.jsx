import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

const { Option } = Select;

function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/community-posts");
      setPosts(res.data);
    } catch (err) {
      toast.error("Lỗi khi tải bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/community-posts/${id}`);
      toast.success("Xoá bài viết thành công!");
      fetchPosts();
    } catch (err) {
      toast.error("Lỗi khi xoá bài viết!");
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await api.put(`/community-posts/${editing.id}`, {
          ...editing,
          ...values,
        });
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await api.post("/community-posts", values);
        toast.success("Thêm bài viết mới thành công!");
      }
      setModalOpen(false);
      fetchPosts();
    } catch (err) {
      toast.error("Lỗi khi gửi dữ liệu!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      render: (text) => text || "Không có",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },
    {
      title: "Ngày đăng",
      dataIndex: "date",
      render: (date) => date || "Chưa có",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá bài viết này?"
            onConfirm={() => handleDelete(record.id)}
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
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Quản lý Bài viết cộng đồng</h2>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchPosts}
            loading={loading}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
      />

      <Modal
        open={modalOpen}
        title={editing ? "Cập nhật bài viết" : "Thêm bài viết mới"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Chuyên mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng nhập chuyên mục!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="PENDING">PENDING</Option>
              <Option value="APPROVED">APPROVED</Option>
              <Option value="REJECTED">REJECTED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày đăng"
            name="date"
            rules={[{ required: true, message: "Vui lòng nhập ngày đăng!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PostsManagement;
