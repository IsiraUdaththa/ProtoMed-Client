import React, { useEffect, useState } from "react";
import { Badge, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

const PaymentCompletion: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [paymentItems, setPaymentItems] = useState<DescriptionsProps["items"]>([]);
	const [invoiceItems, setInvoiceItems] = useState<DescriptionsProps["items"]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const paymentResponse = await api.get(`/orders/${orderId}/payment-completion`);
				if (!paymentResponse.data) {
					throw new Error("Empty Payment response.");
				}

				const invoiceResponse = await api.get(`/orders/${orderId}/invoice`);
				if (!invoiceResponse.data) {
					throw new Error("Empty Invoice response.");
				}

				setPaymentItems([
					{
						key: "1",
						label: "Verified By",
						children: <UserTag userId={paymentResponse.data.fullPayment.verifiedBy} />,
					},
					{
						key: "2",
						label: "Payment Date",
						children: paymentResponse.data.fullPayment.updatedAt,
					},
				]);

				setInvoiceItems([
					{
						key: "1",
						label: "Invoice No",
						children: invoiceResponse.data.invoice.invoiceNumber,
					},
					{
						key: "2",
						label: "Issue Date",
						children: invoiceResponse.data.invoice.updatedAt,
					},
					{
						key: "3",
						label: "Sent By",
						children: <UserTag userId={invoiceResponse.data.invoice.doneBy} />,
					},
				]);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [orderId]);

	return (
		<>
			<Descriptions title="Payment Information" items={paymentItems} />
			<Divider />
			<Descriptions title="Invoice Information" items={invoiceItems} />
		</>
	);
};

export default PaymentCompletion;
