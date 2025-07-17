/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Breadcrumb, Button, Card, Skeleton, Space, Tabs } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined, CalendarOutlined, ReloadOutlined, UserOutlined } from "@ant-design/icons";

import Details from "../_components/views/All";
import ActiveForm from "../_components/forms/activeform";
import ForumDiscussion from "../_components/ForumDiscussion";
import OrderTimeline from "../_components/OrderTimeline";

import DateDisplay from "@/app/_components/DateDisplay";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

export default function OrderStatusPage() {
	const params = useParams();
	const router = useRouter();
	const [orderStatus, setOrderStatus] : any = useState();

	const orderId = Array.isArray(params["id"]) ? params["id"][0] : params["id"] || "";
	const [activeTab, setActiveTab] = useState("status");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await api.get(`orders/${orderId}/`);

				if (!(response.status === 200)) {
					throw new Error("Failed to fetch CT scan data");
				}

				const result = response.data;
				setOrderStatus(result);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	// Handle if orderId is missing
	if (!orderId) {
		return <Alert message="Error" description="Order ID is missing." type="error" showIcon />;
	}

	// Handle back to orders
	const handleBackToOrders = () => {
		router.push("/orders");
	};

	// Handle refresh status
	const handleRefreshStatus = async () => {
		try {
			setLoading(true);
			const response = await api.get(`orders/${orderId}/`);

			if (!(response.status === 200)) {
				throw new Error("Failed to fetch CT scan data");
			}

			const result = response.data;
			setOrderStatus(result);
	
		} catch (error) {
			console.error("Error fetching order data:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
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
				<Space>
					<Button icon={<ArrowLeftOutlined />} onClick={handleBackToOrders}>
						Back to Orders
					</Button>
					<Button icon={<ReloadOutlined />} onClick={handleRefreshStatus} loading={loading}>
						Refresh Status
					</Button>
				</Space>
			</Space>

			{loading ? (
				<Card>
					<Skeleton active paragraph={{ rows: 6 }} />
				</Card>
			) : orderStatus ? (
				<>
					{/* <Card title={`${orderStatus.orderCode}`} style={{actionsBg: "transparent"}}> */}
					<Space direction="vertical" style={{ width: "100%" }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								<p>
									<strong>Current Stage:</strong> {orderStatus?.status}{" "}
								</p>
								<p>
									<UserOutlined /> <strong>Owner:</strong>{" "}
									<UserTag userId={orderStatus?.patientDetails.registeredBy} />
								</p>
							</div>
							<div>
								<p>
									<UserOutlined /> <strong>Created:</strong>{" "}
									<DateDisplay isoDate={orderStatus?.createdAt} />
								</p>
								<p>
									<CalendarOutlined /> <strong>Expected Completion:</strong>{" "}
									<DateDisplay isoDate={orderStatus?.createdAt} />
								</p>
							</div>
						</div>
					</Space>
					{/* </Card> */}

					<Tabs
						activeKey={activeTab}
						onChange={setActiveTab}
						style={{ marginTop: 16 }}
						items={[
							{
								key: "status",
								label: "Current Status",
								children: orderStatus?.status ? (
									<ActiveForm orderId={orderId} status={orderStatus?.status} />
								) : (
									<Alert message="No form available for current status" type="info" showIcon />
								),
							},
							{
								key: "details",
								label: "Order Details",
								children: <Details orderId={orderId} />,
							},
							{
								key: "timeline",
								label: "Timeline",
								children: <OrderTimeline orderId={orderId} />,
							},
							{
								key: "forum",
								label: "Forum",
								children: <ForumDiscussion orderId={orderId} />,
							},
						]}
					/>
				</>
			) : (
				<Alert
					message="Order Not Found"
					description="The requested order could not be found or there was an error loading the order details."
					type="error"
					showIcon
				/>
			)}
		</>
	);
}
