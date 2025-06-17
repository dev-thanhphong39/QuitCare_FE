import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/comments");
      setComments(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách bình luận!");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Xóa bình luận thành công!");
    } catch (err) {
      toast.error("Xóa bình luận thất bại!");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Trạng thái",
      dataIndex: "commentStatus",
      key: "commentStatus",
      render: (status) => {
        let color =
          status === "PENDING"
            ? "orange"
            : status === "APPROVED"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa bình luận này?"
          onConfirm={() => deleteComment(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý bình luận</h2>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchComments}
          loading={loading}
        >
          Tải lại
        </Button>
      </div>
      <Table
        dataSource={comments}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default CommentManagement;
