import React, { useEffect, useState } from "react";
import { Table, Card, message, Spin } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

import api from "@/lib/axiosInstance";

interface Order {
	_id: string;
	name: string;
	status: string;
	stage: string;
	assignedTo?: string;
}

const OrderManagement = () => {
	const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await api.get("orders/assigned");
			const allOrders: Order[] = response.data;

			setAssignedOrders(allOrders);
		} catch (error) {
			console.error(error);
			console.error(error);
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const columns: ColumnsType<Order> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
			render: (_, record) => {
				return (
					<Link href={`/orders/${record._id}`} passHref>
						<span className="text-blue-500 cursor-pointer">{record.name}</span>
					</Link>
				);
			},
		},
		{
			title: "Order ID",
			dataIndex: "fullCode",
			key: "id",
		},
		{
			title: "Stage",
			dataIndex: "status",
			key: "stage",
		},
	];

	return (
		<Spin spinning={loading}>
			<Card title="Assigned Tasks">
				<Table dataSource={assignedOrders} columns={columns} rowKey="id" pagination={false} />
			</Card>
		</Spin>
	);
};

export default OrderManagement;
