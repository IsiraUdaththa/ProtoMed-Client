"use client";

import React, { useState } from "react";
import { Button, Steps, Result, Form } from "antd";
import { UserOutlined, CheckCircleOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

const PEEKFinalPolishing: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);

	const handleSubmit = async () => {
		const formData = {
		};

		try {
			const response = await api.post(`/orders/${orderId}/peek-final-polishing`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Start" icon={<UserOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{current === 0 && (
				<Form onFinish={handleSubmit}>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Mark as Done
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
				<>
					{isSuccess ? (
						<Result status="success" title="PEEK Final Polishing Confirmed Successfully" />
					) : (
						<Result status="error" title="PEEK Final Polishing Submission Failed" subTitle="Please try again." />
					)}
				</>
			)}
		</>
	);
};

export default PEEKFinalPolishing;
