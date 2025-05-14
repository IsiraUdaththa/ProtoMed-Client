"use client";

import { useParams } from "next/navigation";
import { Breadcrumb, Tabs, Alert } from "antd";
import Details from "../_components/views/All";
import Jobs from "../_components/forms/All";
import Link from "next/link";

export default function OrderDetailsPage() {
	const params = useParams();
	const orderId = params.id as string;

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
