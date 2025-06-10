import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import "./Ranking.css";
import Confetti from "react-confetti";

const users = [
  { rank: 1, name: "Nguyễn Văn A", score: 2240, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=A" },
  { rank: 2, name: "Trần Thị B", score: 1982, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=B" },
  { rank: 3, name: "Lê Văn C", score: 1834, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=C" },
  { rank: 4, name: "Phạm Thị D", score: 1500, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=D" },
  { rank: 5, name: "Hoàng Văn E", score: 1431, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=E" },
  { rank: 6, name: "Vũ Thị F", score: 1322, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=F" },
  { rank: 7, name: "Đặng Văn G", score: 1221, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=G" },
  { rank: 8, name: "Bùi Thị H", score: 1102, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=H" },
  { rank: 9, name: "Phan Văn I", score: 1102, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=I" },
  { rank: 10, name: "Đỗ Thị K", score: 1102, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=K" },
];

function Ranking() {
  const [showConfetti, setShowConfetti] = useState(false);
  const top3 = [users[1], users[0], users[2]];

  useEffect(() => {
    const confettiTimeout = setTimeout(() => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Hide confetti after 5 seconds
    }, 3000); // Show confetti after 1 second

    return () => clearTimeout(confettiTimeout);
  })

  return (
    <div className="ranking-container">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <Navbar />
      <div className="ranking-content">
        <h2 className="ranking-title">Bảng Xếp Hạng</h2>

        <div className="podium">
          {top3.map((user) => (
            <div key={user.rank} className={`podium-item podium-${user.rank}`}>
              <img className="avatar" src={user.avatar} alt={user.name} />
              <p>{user.name}</p>
              <strong>{user.score}</strong>
              <div className={`podium-step step-${user.rank}`}>{user.rank}</div>
            </div>
          ))}
        </div>

        <div className="rank-list">
          {users.slice(3).map((user, index) => (
            <div className="rank-row" key={index}>
              <span className="rank-number">{user.rank}</span>
              <img className="avatar small" src={user.avatar} alt={user.name} />
              <span className="rank-name">{user.name}</span>
              <span className="rank-score">{user.score}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Ranking;
