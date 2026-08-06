import { useEffect, useState } from "react";
import { List, Card, message, Spin, Tag, Avatar } from "antd";
import { UserOutlined, FileTextOutlined } from "@ant-design/icons";
import Link from "next/link";

import api from "@/lib/axiosInstance";

interface Order {
	_id: string;
	name: string;
	status: string;
	stage: string;
	assignedTo?: string;
	fullCode?: string;
}

const AssignedOrders = () => {
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
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		const colorMap: { [key: string]: string } = {
			pending: "orange",
			processing: "blue",
			completed: "green",
			cancelled: "red",
		};
		return colorMap[status.toLowerCase()] || "default";
	};

	return (
		<Spin spinning={loading}>
			<Card title="Assigned Tasks">
				<List
					dataSource={assignedOrders}
					rowKey="_id"
					renderItem={(order) => (
						<List.Item
							actions={[
								<Tag key="status" color={getStatusColor(order.status)}>
									{order.status}
								</Tag>,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: "#1890ff" }} />}
								title={
									<Link href={`/orders/${order._id}`} passHref>
										<span className="text-blue-500 cursor-pointer hover:text-blue-700">
											{order.name}
										</span>
									</Link>
								}
								description={
									<div className="space-y-1">
										{order.fullCode && (
											<div className="text-gray-600 text-sm">
												Order ID: <span className="font-mono">{order.fullCode}</span>
											</div>
										)}
										{order.assignedTo && (
											<div className="flex items-center text-gray-600 text-sm">
												<UserOutlined className="mr-1" />
												Assigned to: {order.assignedTo}
											</div>
										)}
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			</Card>
		</Spin>
	);
};

export default AssignedOrders;
