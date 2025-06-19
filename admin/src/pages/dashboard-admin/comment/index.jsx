import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Tag } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import api from "../../../configs/axios";
import { toast } from "react-toastify";

function CommentManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllComments = async () => {
    setLoading(true);
    try {
      // 1. Lấy danh sách tất cả các community post
      const postRes = await api.get("/community-posts");
      const posts = postRes.data;

      // 2. Với mỗi bài post, lấy tất cả các comment tương ứng
      const commentPromises = posts.map((post) =>
        api.get(`/comments/community-posts/${post.id}/comments`)
      );

      const commentResponses = await Promise.all(commentPromises);

      // 3. Gộp tất cả các comment lại thành một mảng
      const allComments = commentResponses
        .flatMap((res) => res.data)
        .sort((a, b) => a.id - b.id); // <-- sắp xếp theo ID tăng dần


      setComments(allComments);
    } catch (error) {
      toast.error("Không thể tải danh sách bình luận!");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Xóa bình luận thành công!");
    } catch (err) {
      toast.error("Xóa bình luận thất bại!");
    }
  };

  useEffect(() => {
    fetchAllComments();
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
        const color =
          status === "PENDING"
            ? "orange"
            : status === "APPROVED"
              ? "green"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Post ID",
      dataIndex: "communityPostId",
      key: "communityPostId",
    },
    {
      title: "Tài khoản",
      dataIndex: "accountId",
      key: "accountId",
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
          onClick={fetchAllComments}
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
