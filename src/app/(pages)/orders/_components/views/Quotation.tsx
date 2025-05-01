"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

const PaymentInfo = ({ orderId }: { orderId: string }) => {
	const [quotation, setQuotation] = useState<any>(null);
	const [advance, setAdvance] = useState<any>(null);
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

				const [quotationRes, advanceRes] = await Promise.all([
					api.get(`/orders/${orderId}/quotation`),
					api.get(`/orders/${orderId}/payment-advance`),
				]);

				setQuotation(quotationRes.data?.quotation || null);
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

	return (
		<>
			<Descriptions title="Quotation">
				{quotation ? (
					<>
						<Descriptions.Item label="Value">{quotation.value ? `$${quotation.value}` : "N/A"}</Descriptions.Item>
						<Descriptions.Item label="Date">{quotation.createdAt || "N/A"}</Descriptions.Item>
						<Descriptions.Item label="Valued By">
							<UserTag userId={quotation.createdBy} />
						</Descriptions.Item>
					</>
				) : (
					<Descriptions.Item label="Info">No Quotation Data</Descriptions.Item>
				)}
			</Descriptions>

			<Descriptions title="Advance Payment">
				{advance ? (
					<>
						<Descriptions.Item label="Value">{advance.value ? `$${advance.value}` : "N/A"}</Descriptions.Item>
						<Descriptions.Item label="Date">{advance.createdAt || "N/A"}</Descriptions.Item>
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
