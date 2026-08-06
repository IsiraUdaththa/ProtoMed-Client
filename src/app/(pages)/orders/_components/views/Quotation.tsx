"use client";

import { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

type Quotation = {
	value: number;
	createdAt: Date;
	createdBy: string;
};

const PaymentInfo = ({ orderId }: { orderId: string }) => {
	const [quotation, setQuotation] = useState<Quotation>();
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

				const quotationRes = await api.get(`/orders/${orderId}/quotation`);

				setQuotation(quotationRes.data || null);
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
	if (!quotation) return <Alert message="No CT Scan details available." type="info" showIcon />;

	return (
		<>
			<Descriptions title="Quotation">
				{quotation ? (
					<>
						<Descriptions.Item label="Value">{quotation.value ? `$${quotation.value}` : "N/A"}</Descriptions.Item>
						<Descriptions.Item label="Valued By">
							<UserTag userId={quotation.createdBy} />
						</Descriptions.Item>
						<Descriptions.Item label="Date">
							<DateDisplay isoDate={quotation.createdAt || "N/A"} />
						</Descriptions.Item>
					</>
				) : (
					<Descriptions.Item label="Info">No Quotation Data</Descriptions.Item>
				)}
			</Descriptions>
		</>
	);
};

export default PaymentInfo;
