"use client";

import React, { useState } from "react";
import { Button, Form, Input, Card, Image, Flex, Typography, Result } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import router from "next/router";

import api from "@/lib/axiosInstance";

const ForgotPasswordPage: React.FC = () => {
	// State to track the submission result: "idle", "success", "error"
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

	const onFinish = async (values: { email: string }) => {
		try {
			await api.post("/auth/forgot-password", {
				email: values.email,
			});
			setStatus("success"); // Show success result
		} catch (error) {
			setStatus("error"); // Show error result
			console.error(error);
		}
	};

	// Handler to reset form/result to initial state
	const resetForm = () => {
		setStatus("idle");
	};

	return (
		<Flex justify="center" align="center" style={{ height: "100vh", background: "#f9f9f9" }}>
			<Card style={{ width: 400, borderRadius: 12, padding: 20 }}>
				{status === "idle" && (
					<>
						<div style={{ display: "flex", justifyContent: "center" }}>
							<Image
								src="/logo.png"
								alt="Logo"
								preview={false}
								width={200}
								style={{ marginBottom: 40 }}
							/>
						</div>
						<Typography.Text type="secondary">
							Enter your email address to receive a password reset link.
						</Typography.Text>

						<Form name="forgot" onFinish={onFinish} style={{ marginTop: 15 }}>
							<Form.Item
								name="email"
								rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
							>
								<Input prefix={<MailOutlined />} placeholder="Please enter user email" />
							</Form.Item>
							<Form.Item>
								<Button block type="primary" htmlType="submit">
									Send Reset Link
								</Button>
							</Form.Item>
						</Form>
						<Typography.Text>
							Remember your password? <Link href="/login">Sign in</Link>
						</Typography.Text>
					</>
				)}

				{status === "success" && (
					<Result
						status="success"
						title="Email Sent!"
						subTitle="Check your email inbox. The process might take a few seconds, please wait."
						extra={[
							<Button type="primary" key="login" onClick={() => (window.location.href = "/login")}>
								Go to Login
							</Button>,
						]}
					/>
				)}

				{status === "error" && (
					<Result
						title="Submission Failed"
						subTitle="Failed to send reset email. Please check your email and try again."
						extra={[
							<Button type="primary" key="retry" onClick={resetForm}>
								Retry
							</Button>,
							<Button key="login" onClick={() => router.push('/login')}>
								Go to Login
							</Button>,
						]}
					/>
				)}
			</Card>
		</Flex>
	);
};

export default ForgotPasswordPage;
