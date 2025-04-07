"use client";

import { useParams } from "next/navigation";
import Steps from "../_components/ProgressBar";
import { Breadcrumb, Tabs, Alert } from "antd";
import Details from "../_components/views/All";
import Jobs from "../_components/forms/All";
import Link from "next/link";
import OrderInfo from "../_components/views/Patient"; // Fetch order details
import { useState, useEffect } from "react";

export default function OrderDetailsPage() {
	const params = useParams();
	const [orderId, setOrderId] = useState<string | null>(null);

	useEffect(() => {
		const urlOrderId = params?.id;

		// Directly set the orderId from the URL
		if (urlOrderId) {
			setOrderId(urlOrderId);
		}
	}, [params?.id]); // Dependency array to track changes in URL params

	if (!orderId) {
		return <Alert message="Error" description="Order ID is missing." type="error" showIcon />;
	}

	return (
		<>
			<Breadcrumb
				items={[
					{
						title: <Link href="/orders">Orders</Link>,
					},
					{
						title: orderId,
					},
				]}
			/>
			<h2>Order number: {orderId}</h2>

			<OrderInfo orderId={orderId} />

			<Steps />
			<Tabs
				defaultActiveKey="1"
				items={[
					{
						key: "1",
						label: "My Jobs",
						children: <Jobs orderId={orderId} />, // Pass orderId
					},
					{
						key: "2",
						label: "Details",
						children: <Details orderId={orderId} />, // Pass orderId
					},
				]}
			/>
		</>
	);
}
