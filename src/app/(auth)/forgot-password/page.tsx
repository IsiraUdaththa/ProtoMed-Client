"use client";

import React from "react";
import { Button, Form, Input, Card, message, Image, Flex, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";

import api from "@/lib/axiosInstance";

const ForgotPasswordPage: React.FC = () => {
	const onFinish = async (values: { email: string }) => {
		try {
			await api.post("/auth/forgot-password", {
				email: values.email,
			});
			message.success("Password reset email has been sent.");
		} catch (error) {
			message.error("Failed to send reset email. Check your input.");
			console.error(error);
		}
	};

	return (
		<Flex justify="center" align="center" style={{ height: "100vh", background: "#f9f9f9" }}>
			<Card style={{ width: 400, borderRadius: 12, padding: 20 }}>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Image src="/logo.png" alt="Logo" preview={false} width={200} style={{ marginBottom: 40 }} />
				</div>
				<Typography.Text type="secondary">
					Enter your email address to receive a password reset link.
				</Typography.Text>

				<Form name="forgot" onFinish={onFinish} style={{ marginTop: 15 }}>
					<Form.Item name="email" rules={[{ required: false, type: "email", message: "Invalid email!" }]}>
						<Input prefix={<MailOutlined />} placeholder="Please enter user email" />
					</Form.Item>
					<Form.Item>
						<Button block type="primary" htmlType="submit">
							Send Reset Link
						</Button>
					</Form.Item>
				</Form>
				<Typography.Text>
					Remember your password?
					<Link href="/login">Sign in</Link>
				</Typography.Text>
			</Card>
		</Flex>
	);
};

export default ForgotPasswordPage;
