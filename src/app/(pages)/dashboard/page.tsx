"use client";
import React, { useState } from "react";
import { FloatButton, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Registration from "../orders/_components/forms/Patient"; // Import the registration page

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0); // Track modal instance

  const handleOpen = () => {
    setModalKey((prevKey) => prevKey + 1); // Change key to reset form
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>

      {/* Ant Design Floating Button */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 24, bottom: 24 }}
        onClick={handleOpen}
      />

      {/* Ant Design Modal */}
      <Modal
        title="Register"
        open={open}
        onCancel={handleClose}
        footer={null} // No footer buttons
      >
        <Registration key={modalKey} /> {/* Reset on reopen */}
      </Modal>
    </div>
  );
}

