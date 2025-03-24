"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Card, Steps, Typography, Result } from "antd";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Title, Text } = Typography;

const InvoicePage: React.FC = () => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		// Simulating a user fetch
		setTimeout(() => setUserName("John Doe"), 1000);

		// Update date & time every second
		const interval = setInterval(() => {
			setDateTime(new Date().toLocaleString());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: { invoiceNumber: string }) => {
		setInvoiceNumber(values.invoiceNumber);
		next(); // Move to confirmation step
	};

	const handleConfirm = async () => {
		console.log("Submitting Invoice:", { invoiceNumber, userName, dateTime });

		try {
			await fakeApiCall(invoiceNumber);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next(); // Move to success/error step
	};

	const fakeApiCall = (invoice: string) => {
		return new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				invoice ? resolve() : reject("Invalid Invoice Number");
			}, 1000);
		});
	};

	return (
		<Card
			title="Invoice Submission"
			style={{
				textAlign: "center",
				maxWidth: "600px",
				margin: "0 auto"// Centers the card horizontally
				
			}}
		>
			<Steps current={current} direction="horizontal">
				<Step title="Enter Invoice" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item
						label="Invoice Number"
						name="invoiceNumber"
						rules={[{ required: true, message: "Please enter invoice number" }]}
					>
						<Input placeholder="Enter invoice number" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm Invoice</Title>
					<Text>
						<strong>User:</strong> {userName}
					</Text>
					<br />
					<Text>
						<strong>Date & Time:</strong> {dateTime}
					</Text>
					<br />
					<Text>
						<strong>Invoice Number:</strong> {invoiceNumber}
					</Text>
					<div style={{ marginTop: 20 }}>
						<Button onClick={prev} style={{ marginRight: 10 }}>
							Back
						</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</div>
				</div>
			)}

			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{isSuccess ? (
						<Result status="success" title="Invoice Submitted Successfully" />
					) : (
						<Result status="error" title="Invoice Submission Failed" subTitle="Please check the invoice details." />
					)}
				</div>
			)}
		</Card>
	);
};

export default InvoicePage;
