"use client";

import React, { useState } from "react";
import { Button, Typography, Card, Steps, Result, Space } from "antd";
import { CreditCardOutlined, CheckCircleOutlined, SolutionOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Title, Text } = Typography;
const { Step } = Steps;

const PaymentProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handlePayment = async () => {
		console.log("Processing Payment...");

		try {
			const response = await api.post(`/orders/${orderId}/payment-completion`);
			console.log("File uploaded successfully:", response.data);
			setPaymentStatus("success");
		} catch (error) {
			console.error("Payment failed:", error);
			setPaymentStatus("error");
		}
		next();
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Step title="Details" icon={<SolutionOutlined />} />
				<Step title="Confirm" icon={<CreditCardOutlined />} />
				<Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{/* Step 1: Payment Details */}
			{current === 0 && (
				<>
					<Text>
						<strong>Amount:</strong> $100
					</Text>

					<Text>
						<strong>User:</strong> John Doe
					</Text>

					<Space>
						<Button type="primary" onClick={next}>
							Next
						</Button>
					</Space>
				</>
			)}

			{/* Step 2: Confirm*/}
			{current === 1 && (
				<>
					<Text>Click below to complete your payment.</Text>

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
