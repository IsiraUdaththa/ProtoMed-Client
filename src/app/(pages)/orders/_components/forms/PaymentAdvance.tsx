"use client";
import React, { useState } from "react";
import { Steps, Button, Select, Input, message, Result, Flex, Descriptions } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

const PaymentStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [currency, setCurrency] = useState("usd");
	const [amount, setAmount] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => {
		if (current === 0 && !amount) {
			message.error("Please enter an amount");
			return;
		}
		setCurrent(current + 1);
	};

	const prev = () => setCurrent(current - 1);

	const handleConfirm = async () => {
		const paymentData = { currency, amount };
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
				<Steps.Step title="Enter Details" icon={<UserOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<>
					<Flex gap={10} align="center">
						<Select value={currency} onChange={setCurrency}>
							<Select.Option value="lkr">Rs</Select.Option>
							<Select.Option value="usd">$</Select.Option>
						</Select>
						<Input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="Enter amount"
							step="0.01"
							min={0}
						/>
					</Flex>
					<Button type="primary" onClick={next}>
						Next
					</Button>
				</>
			)}

			{current === 1 && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{
								label: "Amount",
								children: (
									<>
										{currency} {amount}
									</>
								),
							},
						]}
					></Descriptions>

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
						/>
					)}
				</>
			)}
		</>
	);
};

export default PaymentStepForm;
