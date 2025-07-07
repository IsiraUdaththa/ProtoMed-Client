"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

type AdvancePayment = {
	currency: string;
	value: number;
	createdAt: Date;
	validatedBy: string;
};

const PaymentInfo = ({ orderId }: { orderId: string }) => {
	const [data, setData] = useState<AdvancePayment>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPaymentInfo = async () => {
			if (!orderId) {
				setError("Order ID is missing.");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				const advanceRes = await api.get(`/orders/${orderId}/payment-advance`);
				setData(advanceRes.data?.advancePayment || null);
			} catch (err) {
				console.error("Error fetching payment info:", err);
				setError("Failed to fetch payment information. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchPaymentInfo();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;
	if (!data) return <Alert message="No details available." type="info" showIcon />;

	return (
		<>
			<Descriptions
				title="Advanced Payment"
				items={[
					{
						label: "Value",
						children: data.value ? `$${data.value}` : "N/A",
					},
					{
						label: "Verified By",
						children: data.validatedBy ? <UserTag userId={data.validatedBy} /> : "N/A",
					},
					{ label: "Date", children: data.createdAt ? <DateDisplay isoDate={data.createdAt} /> : "N/A" },
				]}
			/>
		</>
	);
};

export default PaymentInfo;
