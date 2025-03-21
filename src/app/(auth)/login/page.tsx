"use client";

import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Card, Image, Flex } from "antd";

const Apsdap: React.FC = () => {
	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
	};

	return (
		<Flex justify="center" align="center" style={{ height: "100vh" }}>
			<Card
				style={{
					width: 400,
					borderRadius: 12,
					padding: 20,
				}}
			>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Image src="/logo.png" alt="Logo" preview={false} width={200} style={{ marginBottom: 50 }} />
				</div>

				<Form name="login" initialValues={{ remember: true }} style={{ maxWidth: 360 }} onFinish={onFinish}>
					<Form.Item name="email" rules={[{ required: true, message: "Please input your email!" }]}>
						<Input prefix={<UserOutlined />} placeholder="email" />
					</Form.Item>
					<Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
						<Input prefix={<LockOutlined />} type="password" placeholder="password" />
					</Form.Item>
					<Form.Item>
						<Flex justify="space-between" align="center">
							<Form.Item name="remember" valuePropName="checked" noStyle>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<a href="">Forgot password?</a>
						</Flex>
					</Form.Item>

					<Form.Item>
						<Button block type="primary" htmlType="submit">
							Log in
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</Flex>
	);
};

export default Apsdap;
