"use client";

import React, { useState } from "react";
import { Button, Typography, Steps, Result, Form, Input, message, Space } from "antd";
import { CreditCardOutlined, CheckCircleOutlined, SolutionOutlined, CloseCircleOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

interface IFormData {
	isPaid: boolean;
	comment?: string | undefined;
}

const PaymentProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setformData] = useState<IFormData>();

	const [loading, setLoading] = useState<boolean>(false);

	const [current, setCurrent] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleApproval = (isPaid: boolean) => {
		form.validateFields()
			.then((values) => {
				const data: IFormData = {
					isPaid,
					comment: values.comment,
				};

				setformData(data);
				next(); // Move to Step 2 (Confirmation)
			})
			.catch(() => {
				message.error("Please add a comment before proceeding.");
			});
	};

	const handlePayment = async () => {
		if (!formData) return;
		setLoading(true);
		try {
			const response = await api.post(`/orders/${orderId}/payment-completion`, formData);
			console.log("File uploaded successfully:", response.data);
			setPaymentStatus("success");
		} catch (error) {
			console.error("Payment failed:", error);
			setPaymentStatus("error");
		} finally {
			setLoading(false);
			next();
		}
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Details" icon={<SolutionOutlined />} />
				<Steps.Step title="Confirm" icon={<CreditCardOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{/* Step 1: Payment Details */}
			{current === 0 && (
				<Form form={form} layout="vertical">
					<Form.Item name="comment" label="Comment (optional)">
						<Input.TextArea rows={4} placeholder="Add an optional comment" />
					</Form.Item>

					<Form.Item>
						<Space>
							<Button
								color="green"
								variant="filled"
								icon={<CheckCircleOutlined />}
								loading={loading}
								onClick={() => handleApproval(true)}
							>
								Accept
							</Button>
							<Button
								color="red"
								variant="filled"
								icon={<CloseCircleOutlined />}
								loading={loading}
								danger
								onClick={() => handleApproval(false)}
							>
								Skip
							</Button>
						</Space>
					</Form.Item>
				</Form>
			)}

			{/* Step 2: Confirm*/}
			{current === 1 && (
				<>
					<Typography.Text>Click below to complete your payment.</Typography.Text>

					<>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handlePayment}>
							Pay Now
						</Button>
					</>
				</>
			)}

			{/* Step 3: Payment Status */}
			{current === 2 && (
				<>
					{paymentStatus === "success" ? (
						<Result status="success" title="Payment Successful" />
					) : (
						<Result status="error" title="Payment Failed" subTitle="Please try again." />
					)}
				</>
			)}
		</>
	);
};

export default PaymentProcess;
