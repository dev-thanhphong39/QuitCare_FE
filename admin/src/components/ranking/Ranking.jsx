import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Ranking.css";
import Confetti from "react-confetti";

function Ranking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const currentUserId = localStorage.getItem("accountId");

  useEffect(() => {
    loadRankingFromLocalStorage();
    const interval = setInterval(loadRankingFromLocalStorage, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadRankingFromLocalStorage = () => {
    try {
      const userRankings = [];

      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("user-total-points-")) {
          const userId = key.replace("user-total-points-", "");
          const totalPoints = parseInt(localStorage.getItem(key) || "0");
          const userName =
            localStorage.getItem(`user-name-${userId}`) || `User ${userId}`;

          if (totalPoints > 0) {
            userRankings.push({
              id: userId,
              name: userName,
              score: totalPoints,
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${userId}`,
              isCurrentUser: userId === currentUserId,
            });
          }
        }
      });

      userRankings.sort((a, b) => b.score - a.score);
      const rankedUsers = userRankings.map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setUsers(rankedUsers);
      setLoading(false);

      if (rankedUsers.length > 0) {
        setTimeout(() => {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }, 500);
      }
    } catch (error) {
      console.error("Error loading ranking:", error);
      setUsers([]);
      setLoading(false);
    }
  };

  if (loading) {
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

          {/* <button
            className="refresh-button"
            onClick={loadRankingFromLocalStorage}
            title="Làm mới bảng xếp hạng"
          >
            🔄 Làm mới
          </button> */}
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
                <img className="avatar" src={user.avatar} alt={user.name} />
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
                />
                <span className="rank-name">
                  {user.name} {user.isCurrentUser ? "(Bạn)" : ""}
                </span>
                <span className="rank-score">
                  {user.score.toLocaleString()} điểm
                </span>
              </div>
            ))}
          </div>
        )}

        {users.length === 0 && (
          <div className="empty-ranking">
            <p>🎯 Chưa có ai có điểm</p>
            <p>
              Hãy bắt đầu theo dõi tiến trình cai thuốc để tham gia xếp hạng!
            </p>
          </div>
        )}

        {/* {currentUserId && (
          <div className="current-user-stats">
            <h3>📊 Thống kê của bạn</h3>
            <p>
              Tên:{" "}
              {localStorage.getItem(`user-name-${currentUserId}`) ||
                "Chưa có tên"}
            </p>
            <p>
              Tổng điểm:{" "}
              {localStorage.getItem(`user-total-points-${currentUserId}`) ||
                "0"}{" "}
              điểm
            </p>
            {users.find((u) => u.isCurrentUser) && (
              <p>
                Xếp hạng: #{users.find((u) => u.isCurrentUser).rank} /{" "}
                {users.length}
              </p>
            )}
          </div>
        )} */}
      </div>
      <Footer />
    </div>
  );
}

export default Ranking;
