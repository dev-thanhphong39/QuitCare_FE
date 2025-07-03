import React, { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import api from "../../../configs/axios";

function PackagesManagement() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/membership-plans");
      setPackages(res.data);
    } catch (err) {
      toast.error("Lỗi khi lấy danh sách gói!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/membership-plans/${id}`);
      toast.success("Xoá gói thành công!");
      fetchPackages();
    } catch (err) {
      toast.error("Lỗi khi xoá gói!");
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
        await api.put(`/membership-plans/${editing.id}`, {
          ...editing,
          ...values,
        });
        toast.success("Cập nhật gói thành công!");
      } else {
        await api.post("/membership-plans", values);
        toast.success("Tạo gói mới thành công!");
      }
      setModalOpen(false);
      fetchPackages();
    } catch (err) {
      toast.error("Lỗi khi xử lý dữ liệu!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên gói",
      dataIndex: "name",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Thời hạn (tháng)",
      dataIndex: "duration",
      render: (d) => `${d} tháng`,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
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
            title="Bạn có chắc chắn xoá gói này?"
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
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý Gói thành viên</h2>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm mới
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchPackages} loading={loading}>
            Tải lại
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={packages} rowKey="id" loading={loading} />

      <Modal
        open={modalOpen}
        title={editing ? "Cập nhật gói" : "Thêm gói mới"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên gói"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1000}
              formatter={(value) => `${value}₫`}
              parser={(value) => parseFloat(value.replace(/[^\d]/g, ""))}
            />
          </Form.Item>

          <Form.Item
            label="Thời hạn (tháng)"
            name="duration"
            rules={[{ required: true, message: "Vui lòng nhập thời hạn!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              max={24}
              step={1}
              addonAfter="tháng"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PackagesManagement;
