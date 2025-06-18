import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import "./BlogDetail.css";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
import api from "../../configs/axios";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/community-posts/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handleCommentChange = (e) => {
    setCommentInput(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim() === "") return;
    setComments([
      ...comments,
      {
        text: commentInput,
        date: new Date().toLocaleString(),
      },
    ]);
    setCommentInput("");
  };

  const relatedBlogs = useMemo(() => {
    return []; // sẽ cải tiến sau khi bạn muốn load thêm từ API
  }, [id]);

  if (loading)
    return <div className="blog-detail-loading">Đang tải bài viết...</div>;

  if (!blog)
    return <div className="blog-detail-notfound">Không tìm thấy bài viết</div>;

  return (
    <>
      <Navbar />
      <div className="blog-detail-page">
        <Link to="/blog" className="back-to-blog">
          <i className="fa-solid fa-circle-chevron-left"></i> Quay lại
        </Link>

        <div className="blog-detail-wrapper">
          <div className="blog-detail-header">
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-detail-img"
            />
            <div className="blog-detail-meta">
              <span className="blog-detail-date">{blog.date}</span>
              <span className="blog-detail-dot">•</span>
              <span className="blog-detail-category">{blog.category}</span>
            </div>
            <h1 className="blog-detail-title">{blog.title}</h1>
          </div>

          <div className="blog-detail-body">
            {blog.description?.split("\n").map((para, index) => (
              <p key={index} className="blog-detail-paragraph">
                {para.trim()}
              </p>
            ))}
          </div>

          {/* Phần bình luận */}
          <div className="blog-comments-section">
            <h2>Bình luận</h2>
            <form onSubmit={handleCommentSubmit} className="blog-comment-form">
              <textarea
                value={commentInput}
                onChange={handleCommentChange}
                placeholder="Nhập bình luận của bạn..."
                rows={3}
                className="blog-comment-input"
              />
              <button type="submit" className="blog-comment-submit">
                Gửi bình luận
              </button>
            </form>
            <div className="blog-comments-list">
              {comments.length === 0 && (
                <p className="blog-no-comments">Chưa có bình luận nào.</p>
              )}
              {comments.map((c, idx) => (
                <div key={idx} className="blog-comment-item">
                  <div className="blog-comment-text">{c.text}</div>
                  <div className="blog-comment-date">{c.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bài viết liên quan - bạn có thể thêm gọi API liên quan theo category sau */}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BlogDetail;
