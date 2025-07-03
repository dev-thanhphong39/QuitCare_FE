import React, { useState, useEffect } from "react";
import { Table, Checkbox, Button, message, Tag, Space } from "antd";
import dayjs from "dayjs";
import api from "../../../configs/axios";
import { useSelector } from "react-redux";


const timeSlots = [
  { label: "06:00 - 07:00", value: "06:00" },
  { label: "07:00 - 08:00", value: "07:00" },
  { label: "08:00 - 09:00", value: "08:00" },
  { label: "09:00 - 10:00", value: "09:00" },
  { label: "10:00 - 11:00", value: "10:00" },
  { label: "11:00 - 12:00", value: "11:00" },
  { label: "12:00 - 13:00", value: "12:00" },
  { label: "13:00 - 14:00", value: "13:00" },
  { label: "14:00 - 15:00", value: "14:00" },
];

const WorkScheduleManagement = () => {
  const user = useSelector((state) => state.user);
  const accountId = user?.id;

  const [startDate, setStartDate] = useState(dayjs().startOf("week").add(1, "day"));
  const [data, setData] = useState([]);

  useEffect(() => {
    generate7DaySchedule();
  }, [startDate]);

  const generate7DaySchedule = () => {
    const next7 = Array.from({ length: 7 }, (_, i) => {
      const date = startDate.add(i, "day");
      return {
        key: date.format("YYYY-MM-DD"),
        date,
        dateStr: date.format("YYYY-MM-DD"),
        isLeave: false,
        proposedLeaveSlots: [],
      };
    });
    setData(next7);
  };

  const toggleSlot = (record, slotValue) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.dateStr !== record.dateStr) return item;
        const current = item.proposedLeaveSlots || [];
        const updated = current.includes(slotValue)
          ? current.filter((s) => s !== slotValue)
          : [...current, slotValue];
        return { ...item, proposedLeaveSlots: updated };
      })
    );
  };

  const handleLeaveChange = (record, checked) => {
    setData((prev) =>
      prev.map((item) =>
        item.dateStr === record.dateStr
          ? { ...item, isLeave: checked, proposedLeaveSlots: checked ? [] : item.proposedLeaveSlots }
          : item
      )
    );
  };

  const handleSubmit = async (record) => {
    try {
      await api.post("/session/register", {
        accountId,
        date: record.dateStr,
        isLeave: record.isLeave,
        slots: record.proposedLeaveSlots,
      });
      message.success(`✅ Đã lưu lịch cho ${record.dateStr}`);
    } catch {
      message.error("❌ Lưu thất bại.");
    }
  };

  const renderSlotButton = (record, slot, isPast) => {
    const isSelected = record.proposedLeaveSlots?.includes(slot.value);
    const className = isSelected ? "slot-selected" : "slot-default";

    return (
      <Button
        key={slot.value}
        size="small"
        disabled={record.isLeave || isPast}
        onClick={() => toggleSlot(record, slot.value)}
        className={className}
      >
        {slot.label}
      </Button>
    );
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "dateStr",
      render: (_, record) => {
        const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
        const isToday = dayjs(record.dateStr).isSame(dayjs(), "day");
        let tagClass = "";

        if (isToday) tagClass = "tag-today";
        else if (isPast) tagClass = "tag-past";

        return (
          <Tag className={tagClass}>
            {record.dateStr} {isToday ? "(Hôm nay)" : ""}
          </Tag>
        );
      },
    },
    {
      title: "Nghỉ cả ngày",
      render: (_, record) => {
        const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
        return (
          <Checkbox
            disabled={isPast}
            checked={record.isLeave}
            onChange={(e) => handleLeaveChange(record, e.target.checked)}
          />
        );
      },
    },
    {
      title: "Đề nghị nghỉ slot",
      render: (_, record) => {
        const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
        return (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {timeSlots.map((slot) => renderSlotButton(record, slot, isPast))}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      render: (_, record) => {
        const isPast = dayjs(record.dateStr).isBefore(dayjs(), "day");
        return (
          <Button type="primary" disabled={isPast} onClick={() => handleSubmit(record)}>
            Lưu
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>
        📅 Quản Lý Lịch Làm Việc ({startDate.format("DD/MM")} -{" "}
        {startDate.add(6, "day").format("DD/MM")})
      </h2>

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => setStartDate(startDate.subtract(7, "day"))}>
          ⏪ Tuần trước
        </Button>
        <Button onClick={() => setStartDate(dayjs().startOf("week").add(1, "day"))}>
          📅 Tuần hiện tại
        </Button>
        <Button onClick={() => setStartDate(startDate.add(7, "day"))}>
          ⏩ Tuần sau
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        rowKey="dateStr"
        rowClassName={(record) => {
          const date = dayjs(record.dateStr);
          if (date.isBefore(dayjs(), "day")) return "past-row";
          if (date.isSame(dayjs(), "day")) return "today-row";
          return "future-row";
        }}
        
      />
    </div>
  );
};

export default WorkScheduleManagement;
