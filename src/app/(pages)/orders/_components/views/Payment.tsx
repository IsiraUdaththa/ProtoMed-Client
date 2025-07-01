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
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data.fullPayment);
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
				items={[
					{
						label: "Status",
						children: data.isPaid ? (
							<Badge count="Paid" style={{ backgroundColor: "#52c41a" }} />
						) : (
							<Badge count="Skipped" />
						),
					},
					{ label: "Verified By", children: <UserTag userId={data.verifiedBy} /> },
					{ label: "Date", children: <DateDisplay isoDate={data.createdAt} /> },
					{ label: "Comment", children: data.comment },
				]}
			/>
		</>
	);
};

export default App;
