import React, { useState } from "react";
import { Input, Button, Radio, message } from "antd";
import "./edit-profile.css";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../footer/Footer";
import Navbar from "../navbar/Navbar";
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
    <>
      <Navbar />

      <div className="ep-edit-profile-page">
        <div className="ep-edit-profile-wrapper">
          <div className="ep-profile-container">
            <div className="ep-card">
              <div className="ep-avatar-section">
                <div className="ep-avatar-container">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      form.fullname || "User"
                    )}&background=4f46e5&color=ffffff&size=150&rounded=true`}
                    alt="avatar"
                    className="ep-avatar-preview"
                  />
                </div>
                <h2 className="ep-profile-title">Chỉnh sửa hồ sơ</h2>
              </div>

              <div className="ep-form">
                <div className="ep-form-group">
                  <label htmlFor="email" className="ep-label">
                    Email
                  </label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="ep-input-readonly"
                    placeholder="Email"
                  />
                </div>

                <div className="ep-form-group">
                  <label htmlFor="username-readonly" className="ep-label">
                    Tên đăng nhập
                  </label>
                  <Input
                    id="username-readonly"
                    value={user?.username || ""}
                    disabled
                    className="ep-input-readonly"
                    placeholder="Tên đăng nhập"
                  />
                </div>

                <div className="ep-form-group">
                  <label htmlFor="fullname" className="ep-label">
                    Tên đầy đủ
                  </label>
                  <Input
                    id="fullname"
                    value={form.fullname}
                    onChange={(e) => handleChange("fullname", e.target.value)}
                    placeholder="Nhập tên đầy đủ"
                    className="ep-input"
                  />
                </div>

                <div className="ep-form-group">
                  <label className="ep-label">Giới tính</label>
                  <Radio.Group
                    value={form.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="ep-radio-group"
                  >
                    <Radio value="MALE" className="ep-radio">
                      Nam
                    </Radio>
                    <Radio value="FEMALE" className="ep-radio">
                      Nữ
                    </Radio>
                    <Radio value="OTHER" className="ep-radio">
                      Khác
                    </Radio>
                  </Radio.Group>
                </div>

                <div className="ep-button-container">
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    className="ep-submit-button"
                    size="large"
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
}

export default EditProfile;
