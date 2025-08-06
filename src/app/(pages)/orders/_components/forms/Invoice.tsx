"use client";

import React, { useState } from "react";
import { Form, Input, Button, Steps, Result, Descriptions } from "antd";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

const InvoicePage: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [invoiceNumber, setInvoiceNumber] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: { invoiceNumber: string }) => {
		setInvoiceNumber(values.invoiceNumber);
		next(); // Move to confirmation step
	};

	const handleConfirm = async () => {
		console.log("Submitting Invoice:", { invoiceNumber });

		const formData = {
			invoiceNumber: invoiceNumber,
		};

		try {
			const response = await api.post(`/orders/${orderId}/invoice`, formData);
			console.log(response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next(); // Move to success/error step
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Enter Invoice" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
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
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[{ label: "Invoice Number", children: invoiceNumber }]}
					></Descriptions>

					<>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="Invoice Submitted Successfully" />
					) : (
						<Result
							status="error"
							title="Invoice Submission Failed"
							subTitle="Please check the invoice details."
						/>
					)}
				</>
			)}
		</>
	);
};

export default InvoicePage;
