"use client";
import React, { useState, useEffect } from "react";
import { Steps, Button, Select, Input, Card, Typography, message, Result, Flex } from "antd";
import { CloseCircleOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;

const PaymentStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [currency, setCurrency] = useState("lkr");
	const [amount, setAmount] = useState("");
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		setTimeout(() => setUserName("John Doe"), 1000);
		setDateTime(new Date().toLocaleString());
	}, []);

	const next = () => {
		if (current === 0 && !amount) {
			message.error("Please enter an amount");
			return;
		}
		setCurrent(current + 1);
	};

	const prev = () => setCurrent(current - 1);

	const handleConfirm = async () => {
		const paymentData = { userName, currency, amount, dateTime };
		console.log("Payment data confirmed:", paymentData);

		const formData = {
			currency: currency,
			value: amount,
		};

		try {
			const response = await api.post(`/orders/${orderId}/payment-advance`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.log(error);
			setIsSuccess(false);
		}
		setCurrent(3);
	};

	return (
		<>
			<Steps current={current}>
				<Step title="Enter Details" icon={<UserOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<>
					<Flex gap={10} align="center">
						<Select value={currency} onChange={setCurrency}>
							<Option value="lkr">Rs</Option>
							<Option value="usd">$</Option>
						</Select>
						<Input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
							style={{ flex: 1 }}
							step="0.01"
						/>
					</Flex>
					<Button type="primary" onClick={next} style={{ marginTop: 20, width: "100%" }}>
						Next
					</Button>
				</>
			)}

			{current === 1 && (
				<>
					<Text>
						<strong>Name:</strong> {userName}
					</Text>
					<br />
					<Text>
						<strong>Date & Time:</strong> {dateTime}
					</Text>
					<br />
					<Text>
						<strong>Amount:</strong> {currency} {amount}
					</Text>
					<br />
					<Button onClick={prev}>Back</Button>
					<Button type="primary" onClick={handleConfirm}>
						Confirm
					</Button>
				</>
			)}

			{current === 3 && (
				<>
					{isSuccess ? (
						<Result
							status="success"
							title="Payment Successful"
							subTitle="Your payment has been processed successfully."
						/>
					) : (
						<Result
							status="error"
							title="Payment Failed"
							subTitle="There was an issue with your payment. Please check the details."
						>
							<Text strong style={{ fontSize: 16 }}>
								Error details:
							</Text>
							<br />
							<Text>
								<CloseCircleOutlined style={{ fontSize: 16 }} /> The amount is invalid.
							</Text>
						</Result>
					)}
				</>
			)}
		</>
	);
};

export default PaymentStepForm;
