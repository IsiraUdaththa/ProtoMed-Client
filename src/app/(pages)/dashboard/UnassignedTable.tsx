import React, { useEffect, useState } from "react";
import { Table, Button, Card, message, Spin } from "antd";
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
			const response = await api.get("orders/unassigned");
			const allOrders: Order[] = response.data;

			setAssignedOrders(allOrders);
		} catch (error) {
			message.error("Failed to fetch orders");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSelfAssign = async (orderId: string) => {
		try {
			await api.post(`orders/self-assign/${orderId}`);
			message.success("Order assigned to you");
			fetchOrders(); // Refresh after assigning
		} catch (error) {
			message.error("Failed to self-assign order");
			console.error(error);
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
		{
			title: "Action",
			key: "action",
			render: (record: Order) => (
				<Button type="primary" onClick={() => handleSelfAssign(record._id)}>
					Self Assign
				</Button>
			),
		},
	];

	return (
		<Spin spinning={loading}>
			<Card title="Todo List">
				<Table dataSource={assignedOrders} columns={columns} rowKey="id" pagination={false} />
			</Card>
		</Spin>
	);
};

export default OrderManagement;
