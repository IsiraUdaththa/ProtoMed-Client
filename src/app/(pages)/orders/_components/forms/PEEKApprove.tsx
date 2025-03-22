'use client';
import React from "react";
import { Button, Form, Input, message, Card } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const PEEKApproval: React.FC = () => {
  const [form] = Form.useForm();

  const handleAction = async (isApproved: boolean) => {
    try {
      const values = await form.validateFields();
      
      const response = await fetch("/api/peekapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApproved,
          comment: values.comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit approval");
      }

      message.success(isApproved ? "Approved successfully" : "Rejected successfully");
      form.resetFields(); // Clear comment after submission
    } catch (error) {
      message.error("Please enter a comment before submitting.");
    }
  };

  return (

      <Card title="Approval Action" >
        <Form form={form} layout="vertical">
          <Form.Item
            name="comment"
            label="Comment"
            rules={[{ required: true, message: "Please enter a comment!" }]}
          >
            <Input.TextArea placeholder="Add your comments here" rows={4} />
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleAction(true)}
              style={{ background: "#fff", color: "#52c41a", borderColor: "#52c41a" }}
            >
              Approve
            </Button>

            <Button
              type="primary"
              icon={<CloseCircleOutlined />}
              danger
              onClick={() => handleAction(false)}
              style={{ background: "#fff", color: "#ff4d4f", borderColor: "#ff4d4f" }}
            >
              Reject
            </Button>
          </div>
        </Form>
      </Card>

  );
};

export default PEEKApproval;
