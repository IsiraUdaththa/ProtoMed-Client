"use client";
import React, { useState, useEffect } from "react";
import { Steps, Button, Select, Input, Card, Typography, message, Result, Flex } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;

export default function PaymentStepForm() {
	const [current, setCurrent] = useState(0);
	const [currency, setCurrency] = useState("LKR");
	const [amount, setAmount] = useState("");
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null); // Track success or failure

	useEffect(() => {
		setTimeout(() => setUserName("John Doe"), 1000);
		const now = new Date();
		setDateTime(now.toLocaleString());
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

		try {
			await fakeApiCall(paymentData);
			setIsSuccess(true);
			setCurrent(3); // Go to success screen
		} catch (error) {
			console.error("Payment failed:", error);
			setIsSuccess(false);
			setCurrent(3); // Go to error screen
		}
	};

	const fakeApiCall = (data: any) => {
		return new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				parseFloat(data.amount) > 0 ? resolve() : reject("Invalid amount");
			}, 1000);
		});
	};

	return (
		<>
			{current !== 3 && (
				<Steps
					style={{ maxWidth: 600, width: "100%" }}
					current={current}
					direction="horizontal"
					items={[
						{
							title: "Enter Details",
							status: current === 0 ? "process" : current > 0 ? "finish" : "wait",
							icon: <UserOutlined />,
						},
						{
							title: "Confirm Details",
							status: current === 1 ? "process" : current > 1 ? "finish" : "wait",
							icon: <SolutionOutlined />,
						},
						{
							title: "Success",
							status: current === 2 ? "process" : "wait",
							icon: <SmileOutlined />,
						},
					]}
				/>
			)}

			{current === 0 && (
				<div style={{ marginTop: 20 }}>
					<Select value={currency} onChange={setCurrency} style={{ width: 80 }}>
						<Option value="LKR">Rs</Option>
						<Option value="USD">$</Option>
					</Select>
					<Input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="Enter amount"
						style={{ width: 200, marginLeft: 10 }}
						step="0.01"
					/>
					<Button type="primary" onClick={next} style={{ marginTop: 20 }}>
						Submit
					</Button>
				</div>
			)}

			{current === 1 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm Payment</Title>
					<div style={{ textAlign: "left" }}>
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
					</div>
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

			{current === 3 && (
				<div style={{ marginTop: 20, textAlign: "center" }}>
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
							<div className="desc">
								<Text strong style={{ fontSize: 16 }}>
									Error details:
								</Text>
								<br />
								<Text>
									<CloseCircleOutlined style={{ fontSize: 16 }} /> The amount is invalid.
								</Text>
							</div>
						</Result>
					)}
				</div>
			)}
		</>
	);
}
