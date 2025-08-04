"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Descriptions, Spin } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface Data {
	createdAt: Date;
	verifiedBy: string;
	isPaid: boolean;
	comment: string;
}

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<Data | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/payment-completion`);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data) return <Alert message="No order details available." type="info" showIcon />;

	return (
		<>
			<Descriptions
				column={2}
				items={[
					{
						label: "Status",
						children: data.isPaid ? (
							<Badge count="Paid" style={{ backgroundColor: "#52c41a" }} />
						) : (
							<Badge count="Skipped" />
						),
					},
					{ label: "Verified By", children: data.verifiedBy ? <UserTag userId={data.verifiedBy} /> : "N/A" },
					{ label: "Date", children: data.createdAt ? <DateDisplay isoDate={data.createdAt} /> : "N/A" },
					{ label: "Comment", children: data.comment ?? "No comment" },
				]}
			/>
		</>
	);
};

export default App;
