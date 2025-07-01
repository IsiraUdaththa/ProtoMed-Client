import React, { useEffect, useState } from "react";
import { Card, message, Statistic, Flex } from "antd";
import { FileDoneOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

interface Order {
	status: string;
	count: number;
}

const OrderManagement = () => {
	const [data, setData] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await api.get("orders/statusCounts");
			const allOrders: Order[] = response.data;
			console.log(response.data);

			setData(allOrders);
		} catch (error) {
			console.error(error);
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex gap="middle">
			{data.map(({ status, count }) => (
				<Card key={status}>
					<Statistic title={status} value={count} loading={loading} prefix={<FileDoneOutlined />} />
				</Card>
			))}
		</Flex>
	);
};

export default OrderManagement;
