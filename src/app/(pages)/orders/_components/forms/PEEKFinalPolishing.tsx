"use client";

import React, { useState, useEffect } from "react";
import { Button, Steps, Result, Form, Descriptions } from "antd";
import { UserOutlined, CheckCircleOutlined, SolutionOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

const PEEKFinalPolishing: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		setTimeout(() => setUserName("John Doe"), 1000);
		const interval = setInterval(() => {
			setDateTime(new Date().toLocaleString());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = async () => {
		console.log(`Submitting PEEK Final Polishing:`, { userName, dateTime });

		const formData = {
			date: dateTime,
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
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{current === 0 && (
				<Form onFinish={next}>
					<Form.Item>
						<Button type="primary" htmlType="submit">
							Get Started
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "User", children: userName },
							{ label: "Date and Time:", children: dateTime },
						]}
					></Descriptions>
					<>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleSubmit}>
							Confirm
						</Button>
					</>
				</>
			)}

			{current === 2 && (
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
