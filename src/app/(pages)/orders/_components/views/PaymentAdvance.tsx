"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

type AdvancePayment = {
	currency: string;
	value: number;
	createdAt: string;
	validatedBy: string;
};

const PaymentInfo = ({ orderId }: { orderId: string }) => {
	const [advance, setAdvance] = useState<AdvancePayment>();
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
				setAdvance(advanceRes.data?.advancePayment || null);
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
	if (!advance) return <Alert message="No details available." type="info" showIcon />;

	return (
		<>
			<Descriptions title="Advance Payment">
				{advance ? (
					<>
						<Descriptions.Item label="Value">
							{advance.value ? `$${advance.value}` : "N/A"}
						</Descriptions.Item>
						<Descriptions.Item label="Date">
							<DateDisplay isoDate={advance.createdAt || "N/A"} />
						</Descriptions.Item>
						<Descriptions.Item label="Received By">
							<UserTag userId={advance.validatedBy} />
						</Descriptions.Item>
					</>
				) : (
					<Descriptions.Item label="Info">No Advance Payment Data</Descriptions.Item>
				)}
			</Descriptions>
		</>
	);
};

export default PaymentInfo;
