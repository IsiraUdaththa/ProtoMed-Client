"use client";
import React, { useState } from "react";
import { Form, InputNumber, Button, Space, Dropdown, Menu, Steps, Typography, Result, Card } from "antd";
import { SaveOutlined, DownOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Step } = Steps;
const { Text } = Typography;

interface QuotationProps {
	orderId: string;
}

const QuotationPage: React.FC<QuotationProps> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [currency, setCurrency] = useState<string>("USD");
	const [formData, setFormData] = useState<{ currency?: string; quotationValue?: number }>({});
	const [dateTime, setDateTime] = useState<string>("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const dummyUsername = "JohnDoe"; // Dummy username

	// Get current date and time
	const getCurrentDateTime = () => new Date().toLocaleString();

	// Steps Navigation
	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle form submission
	const handleSubmit = (values: { quotationValue: number }) => {
		setFormData({ ...values, currency });
		setDateTime(getCurrentDateTime());
		next();
	};

	// Handle confirmation and API request
	const handleConfirm = async () => {
		if (!orderId) {
			console.error("Order ID is missing!");
			setIsSuccess(false);
			next();
			return;
		}

		console.log("Submitting Data:", formData);

		try {
			const response = await api.post(`/orders/${orderId}/quotation`, {
				value: formData.quotationValue,
				currency: formData.currency,
			});

			if (response.status !== 200) {
				throw new Error("Failed to submit data");
			}

			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}

		next();
	};

	// Currency selection menu
	const currencyMenu = (
		<Menu>
			<Menu.Item key="USD" onClick={() => setCurrency("USD")}>
				USD
			</Menu.Item>
			<Menu.Item key="LKR" onClick={() => setCurrency("LKR")}>
				LKR
			</Menu.Item>
			<Menu.Item key="SRD" onClick={() => setCurrency("SRD")}>
				SRD
			</Menu.Item>
		</Menu>
	);

	return (
		<Card title="Quotation Value" style={{ maxWidth: 600, margin: "0 auto", paddingTop: "30px" }}>
			<Steps current={current} style={{ width: "100%", maxWidth: 500 }}>
				<Step title="Enter Details" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{/* Step 1: Enter Quotation Details */}
			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical" style={{ width: "100%", maxWidth: 500 }}>
					<Form.Item
						label="Quotation Value"
						name="quotationValue"
						rules={[{ required: true, message: "Please enter a value!" }]}
					>
						<Space>
							<Dropdown overlay={currencyMenu} trigger={["click"]}>
								<Button>
									{currency} <DownOutlined />
								</Button>
							</Dropdown>
							<InputNumber style={{ width: "100%" }} placeholder="Enter value" min={0} />
						</Space>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{/* Step 2: Confirm Data */}
			{current === 1 && formData.quotationValue !== undefined && (
				<>
					<Text>
						<strong>Username:</strong> {dummyUsername}
					</Text>
					<br />
					<Text>
						<strong>Date and Time:</strong> {dateTime}
					</Text>
					<br />
					<Text>
						<strong>Currency:</strong> {formData.currency}
					</Text>
					<br />
					<Text>
						<strong>Quotation Value:</strong> {formData.quotationValue}
					</Text>
					<br />

					<Space>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</Space>
				</>
			)}

			{/* Step 3: Success or Failure Message */}
			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="Data Submitted Successfully" />
					) : (
						<Result status="error" title="Submission Failed" subTitle="Please check details and try again." />
					)}
				</>
			)}
		</Card>
	);
};

export default QuotationPage;
