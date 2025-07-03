import React, { useEffect, useState } from "react";
import api from "../../../configs/axios"; // đường dẫn API config của bạn

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/api/appointments"); // Đổi theo API thực tế
        setAppointments(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch cuộc hẹn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatTime = (timeObj) => {
    if (!timeObj) return "--:--";
    const { hour, minute } = timeObj;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách cuộc hẹn</h2>
      <table className="table-auto w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 border">#</th>
            <th className="px-2 py-1 border">Họ tên</th>
            <th className="px-2 py-1 border">Ngày</th>
            <th className="px-2 py-1 border">Bắt đầu</th>
            <th className="px-2 py-1 border">Kết thúc</th>
            <th className="px-2 py-1 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((item, index) => {
            const fullName = item.account?.fullName || "Không rõ";
            const session = item.sessionUser?.session;
            const startTime = formatTime(session?.start);
            const endTime = formatTime(session?.end);

            return (
              <tr key={item.id} className="border-t">
                <td className="px-2 py-1 border text-center">{index + 1}</td>
                <td className="px-2 py-1 border">{fullName}</td>
                <td className="px-2 py-1 border">{session?.date || "?"}</td>
                <td className="px-2 py-1 border">{startTime}</td>
                <td className="px-2 py-1 border">{endTime}</td>
                <td className="px-2 py-1 border">{item.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;
