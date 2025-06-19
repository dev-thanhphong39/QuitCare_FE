import React, { useState } from "react";
import { Input, Button, Radio, message } from "antd";
import "./edit-profile.css";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import api from "../../configs/axios";
import { login } from "../../redux/features/userSlice";

function EditProfile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullname: user?.fullName || "",
    username: user?.username || "",
    gender: user?.gender || "MALE",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    console.log("Token:", localStorage.getItem("token"));
    console.log(">>> Đã click Lưu thay đổi");
  
    if (!user?.id) {
      message.error("Không tìm thấy ID người dùng!");
      return;
    }
  
    try {
      const response = await api.put(`user/${user.id}`, {
        fullname: form.fullname,
        username: form.username,
        gender: form.gender,
      });
      console.log("Updated user:", response.data);
      dispatch(
        login({
          ...response.data,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            response.data.fullname + Date.now()
          )}&background=ececec&color=555&size=64&rounded=true`,
        })
      );
      
      message.success("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      message.error("Cập nhật thất bại!");
      console.error(" Lỗi khi gọi API:", error);
  
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Dữ liệu lỗi:", error.response.data);
        message.error(
          `Lỗi ${error.response.status}: ${
            error.response.data.message || "Không rõ lỗi"
          }`
        );
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        message.error("Không thể kết nối đến máy chủ.");
      } else {
        console.error("Lỗi khác:", error.message);
        message.error("Đã xảy ra lỗi không xác định.");
      }
    }
  };
  

  return (
    <div className="ep-edit-profile-page">
      <Navbar />
      <div className="ep-edit-profile-wrapper">
        <div className="ep-profile-container">
          <div className="ep-card">
            <div className="ep-avatar-only">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  form.fullname || "User"
                )}&background=ececec&color=555&size=128&rounded=true`}
                alt="avatar"
                className="ep-avatar-preview"
              />
            </div>

            <div className="ep-form">
              <label htmlFor="fullname">Tên đầy đủ</label>
              <Input
                id="fullname"
                value={form.fullname}
                onChange={(e) => handleChange("fullname", e.target.value)}
                placeholder="Nhập tên đầy đủ"
              />

              <label htmlFor="username">Tên đăng nhập</label>
              <Input
                id="username"
                value={form.username}
                disabled
                placeholder="Tên đăng nhập không đổi"
              />

              <label>Giới tính</label>
              <Radio.Group
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                style={{ marginBottom: 16 }}
              >
                <Radio value="MALE">Nam</Radio>
                <Radio value="FEMALE">Nữ</Radio>
                <Radio value="OTHER">Khác</Radio>
              </Radio.Group>

              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: 20 }}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfile;
