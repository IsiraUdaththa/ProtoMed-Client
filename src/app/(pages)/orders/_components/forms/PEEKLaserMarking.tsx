"use client";

import React, { useState, useEffect } from "react";
import { Button, Typography, Card, Steps, Result, Form } from "antd";
import { UserOutlined, CheckCircleOutlined, SolutionOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Title, Text } = Typography;
const { Step } = Steps;

const PEEKLaserMarkingProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
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
		console.log(`Submitting PEEK Laser Marking Process:`, { userName, dateTime });

		const formData = {
			markingDate: dateTime,
		};

		try {
			const response = await api.post(`/orders/${orderId}/peek-laser-marking`, formData);
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
					<Step title="Start" icon={<UserOutlined />} />
					<Step title="Confirm" icon={<SolutionOutlined />} />
					<Step title="Status" icon={<CheckCircleOutlined />} />
				</Steps>

				{current === 0 && (
					<Form onFinish={next} style={{ marginTop: 20 }}>
						<Form.Item >
							<Button type="primary" htmlType="submit">
								Get Started
							</Button>
						</Form.Item>
					</Form>
				)}

				{current === 1 && (
					<>
						
						<Text>
							<strong>User:</strong> {userName}
						</Text>
						<br />
						<Text>
							<strong>Date & Time:</strong> {dateTime}
						</Text>
						<>
							<Button onClick={prev} style={{ marginRight: 10 }}>
								Back
							</Button>
							<Button type="primary" onClick={handleSubmit}>
								Confirm
							</Button>
						</>
					</>
				)}

				{current === 2 && (
					<>
						{isSuccess ? (
							<Result status="success" title="PEEK Laser Marking Process Confirmed Successfully" />
						) : (
							<Result
								status="error"
								title="PEEK Laser Marking Process Submission Failed"
								subTitle="Please try again."
							/>
						)}
					</>
				)}
			</>
	);
}


export default PEEKLaserMarkingProcess;