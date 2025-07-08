import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Ranking.css";
import Confetti from "react-confetti";
import { message } from "antd";
import api from "../../configs/axios";

function Ranking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const currentUserId = localStorage.getItem("accountId");

  useEffect(() => {
    loadRankingFromAPI();
    // Tự động refresh ranking mỗi 5 giây
    const interval = setInterval(loadRankingFromAPI, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRankingFromAPI = async () => {
    try {
      setLoading(true);
      console.log("🔍 Đang tải bảng xếp hạng từ API...");

      const response = await api.get("/auth/ranking");
      console.log("📊 Dữ liệu ranking từ API:", response.data);

      if (!response.data || response.data.length === 0) {
        setUsers([]);
        setLoading(false);
        console.log("ℹ️ Không có dữ liệu ranking");
        return;
      }

      // Xử lý dữ liệu từ API - SỬA LẠI LOGIC
      const processedUsers = response.data.map((user, index) => ({
        id: user.userId,
        name: user.fullName || user.username || `User ${user.userId}`,
        score: user.totalPoint || 0, // Lấy từ totalPoint
        avatar:
          user.avatar ||
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.userId}`,
        isCurrentUser: user.userId?.toString() === currentUserId,
        rank: index + 1,
      }));

      // Sắp xếp theo điểm cao nhất (API có thể đã sắp xếp rồi nhưng đảm bảo)
      const sortedUsers = processedUsers.sort((a, b) => b.score - a.score);

      // Cập nhật rank sau khi sắp xếp
      const rankedUsers = sortedUsers.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setUsers(rankedUsers);
      setLoading(false);

      console.log("✅ Đã tải xong bảng xếp hạng:", rankedUsers);

      // Hiệu ứng confetti nếu có dữ liệu (chỉ lần đầu)
      if (rankedUsers.length > 0 && users.length === 0) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }, 500);
      }
    } catch (error) {
      console.error("❌ Lỗi tải bảng xếp hạng:", error);
      message.error("Không thể tải bảng xếp hạng");
      setUsers([]);
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="ranking-container">
        <Navbar />
        <div className="ranking-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải bảng xếp hạng...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const top3 = users.length >= 3 ? [users[1], users[0], users[2]] : users;

  return (
    <div className="ranking-container">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <Navbar />
      <div className="ranking-content">
        <div className="ranking-header">
          <h2 className="ranking-title">🏆 Bảng Xếp Hạng Cai Thuốc</h2>
          {/* Đã bỏ nút refresh */}
          {loading && (
            <span className="auto-refresh-indicator">🔄 Đang cập nhật...</span>
          )}
        </div>

        {users.length >= 3 && (
          <div className="podium">
            {top3.map((user) => (
              <div
                key={user.rank}
                className={`podium-item podium-${user.rank} ${
                  user.isCurrentUser ? "current-user" : ""
                }`}
              >
                <img
                  className="avatar"
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`;
                  }}
                />
                <p>
                  {user.name} {user.isCurrentUser ? "(Bạn)" : ""}
                </p>
                <strong>{user.score.toLocaleString()} điểm</strong>
                <div className={`podium-step step-${user.rank}`}>
                  {user.rank}
                </div>
              </div>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className="rank-list">
            {(users.length < 3 ? users : users.slice(3)).map((user) => (
              <div
                key={user.id}
                className={`rank-row ${
                  user.isCurrentUser ? "current-user" : ""
                }`}
              >
                <span className="rank-number">#{user.rank}</span>
                <img
                  className="avatar small"
                  src={user.avatar}
                  alt={user.name}
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`;
                  }}
                />
                <span className="rank-name">
                  {user.name} {user.isCurrentUser ? "(Bạn)" : ""}
                </span>
                <span className="rank-score">
                  🏆 {user.score.toLocaleString()} điểm
                </span>
              </div>
            ))}
          </div>
        )}

        {users.length === 0 && (
          <div className="empty-ranking">
            <p>🎯 Chưa có dữ liệu xếp hạng</p>
            <p>
              Hãy bắt đầu theo dõi tiến trình cai thuốc để tham gia xếp hạng!
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Ranking;
