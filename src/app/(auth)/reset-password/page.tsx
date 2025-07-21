"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Form, Input, Card, message, Image, Flex, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

const ResetPasswordPage: React.FC = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const [valid, setValid] = useState<boolean>(true);

	useEffect(() => {
		if (!token) {
			setValid(false);
		}
	}, [token]);

	const onFinish = async (values: { password1: string; password2: string }) => {
		if (values.password1 !== values.password2) {
			message.error("Passwords do not match.");
			return;
		}

		try {
			await api.post("/auth/reset-password", { token: token!, newPassword: values.password1 });
			return;
		} catch (error) {
			message.error("Reset failed or token expired.");
			console.error(error);
		}
	};

	if (!valid) {
		return <p style={{ textAlign: "center", marginTop: "100px" }}>Invalid or missing token.</p>;
	}

	return (
		<Flex justify="center" align="center" style={{ height: "100vh", background: "#f9f9f9" }}>
			<Card style={{ width: 400, borderRadius: 12, padding: 20 }}>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Image src="/logo.png" alt="Logo" preview={false} width={200} style={{ marginBottom: 40 }} />
				</div>
				<Typography.Text type="secondary">Please enter your new password below.</Typography.Text>

				<Form onFinish={onFinish} style={{ marginTop: 15 }}>
					<Form.Item name="password1" rules={[{ required: true, message: "Please enter a new password" }]}>
						<Input.Password prefix={<LockOutlined />} placeholder="New Password" />
					</Form.Item>

					<Form.Item name="password2" rules={[{ required: true, message: "Please confirm your password" }]}>
						<Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" />
					</Form.Item>

					<Form.Item>
						<Button block type="primary" htmlType="submit">
							Reset Password
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Flex>
	);
};

export default ResetPasswordPage;
