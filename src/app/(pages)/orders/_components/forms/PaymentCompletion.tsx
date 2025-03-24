"use client";

import React, { useState } from "react";
import { Button, Typography, Layout, Row, Col, Card, Steps, Result } from "antd";
import { CreditCardOutlined, CheckCircleOutlined, SolutionOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

export default function PaymentProcess() {
	const [current, setCurrent] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState<"success" | "error" | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handlePayment = async () => {
		console.log("Processing Payment...");
		try {
			await fakePaymentApiCall();
			setPaymentStatus("success");
		} catch (error) {
			console.error("Payment failed:", error);
			setPaymentStatus("error");
		}
		next();
	};

	const fakePaymentApiCall = () => {
		return new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				Math.random() > 0.5 ? resolve() : reject("Payment failed");
			}, 1500);
		});
	};

	return (
		<Card title="Payment Process" style={{ textAlign: "center", maxWidth: 600, margin: "auto" }}>
			<Steps current={current} direction="horizontal">
				<Step title="Details" icon={<SolutionOutlined />} />
				<Step title="Confirm & Pay" icon={<CreditCardOutlined />} />
				<Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{/* Step 1: Payment Details */}
			{current === 0 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Payment Details</Title>
					<Text>
						<strong>Amount:</strong> $100
					</Text>
					<br />
					<Text>
						<strong>User:</strong> John Doe
					</Text>
					<div style={{ marginTop: 20 }}>
						<Button type="primary" onClick={next}>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Step 2: Confirm & Pay */}
			{current === 1 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm & Pay</Title>
					<Text>Click below to complete your payment.</Text>
					<div style={{ marginTop: 20 }}>
						<Button onClick={prev} style={{ marginRight: 10 }}>
							Back
						</Button>
						<Button type="primary" onClick={handlePayment}>
							Pay Now
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Payment Status */}
			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{paymentStatus === "success" ? (
						<Result status="success" title="Payment Successful" />
					) : (
						<Result status="error" title="Payment Failed" subTitle="Please try again." />
					)}
				</div>
			)}
		</Card>
	);
}
