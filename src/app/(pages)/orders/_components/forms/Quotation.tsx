"use client";
import React, { useState } from "react";
import { Form, Button, Space, Dropdown, Steps, Result, Descriptions, Input } from "antd";
import { DownOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const QuotationPage: React.FC<{ orderId: string }> = ({ orderId }) => {
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

	const menuProps = {
		items: [
			{
				key: "USD",
				label: <span onClick={() => setCurrency("USD")}>USD</span>,
			},
			{
				key: "LKR",
				label: <span onClick={() => setCurrency("LKR")}>LKR</span>,
			},
			{
				key: "SRD",
				label: <span onClick={() => setCurrency("SRD")}>SRD</span>,
			},
		],
	};

	return (
		<>
			<Steps current={current}>
				<Steps.Step title="Enter Details" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{/* Step 1: Enter Quotation Details */}
			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item
						label="Quotation Value"
						name="quotationValue"
						rules={[{ required: true, message: "Please enter a value!" }]}
					>
						<Space>
							<Dropdown menu={menuProps} trigger={["click"]}>
								<Button>
									{currency} <DownOutlined />
								</Button>
							</Dropdown>
							<Input placeholder="Enter value" min={0} type="number" />
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
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "User", children: dummyUsername },
							{ label: "Date and Time:", children: dateTime },
							{
								label: "Amount",
								children: (
									<>
										{formData.currency} {formData.quotationValue}
									</>
								),
							},
						]}
					></Descriptions>

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
		</>
	);
};

export default QuotationPage;
