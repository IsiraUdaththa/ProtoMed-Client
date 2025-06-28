"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Badge, Breadcrumb, Button, Card, Skeleton, Space, Tabs } from "antd";
import Link from "next/link";
import {
	ArrowLeftOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	LoadingOutlined,
	ReloadOutlined,
	UserOutlined,
} from "@ant-design/icons";
import Details from "../_components/views/All";
import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import ActiveForm from "../_components/forms/activeform";
import ForumDiscussion from "../_components/ForumDiscussion";
import OrderTimeline from "../_components/OrderTimeline";
import { login } from "@/services/auth.service";

login("admin@example.com", "password");

// Simulated order status service
const fetchOrderStatus = async (orderId: string) => {
	// Simulate API call delay
	await new Promise((resolve) => setTimeout(resolve, 800));

	// Mock data - in a real app this would come from your API
	const statuses = [
		"draft",
		"scanUpload",
		"scanValidation",
		"quotation",
		"advancePayment",
		"designImages",
		"designQCDocs",
		"designFile",
		"internalApproval",
		"externalApproval",
		"outerPrint",
		"flapPrint",
		"plaQCDocs",
		"plasticApproval",
		"implantPrint",
		"annealing",
		"roughPolishing",
		"laserMarking",
		"finalPolishing",
		"peekQCDocs",
		"implantApproval",
		"packing",
		"finalPayment",
		"invoice",
		"completed",
	];

	const res = (await api.get(`orders/${orderId}`)).data;
	console.log(res.status);

	// Find a stage based on the orderId (just for demo purposes)
	// const stage = parseInt("2", 10) % statuses.length;
	const stage = statuses.indexOf(res.status);

	return {
		orderId,
		orderCode: res.orderId.fullCode,
		currentStatus: statuses[stage],
		lastUpdated: new Date().toISOString(),
		isReady: stage >= statuses.length - 1,
		patientName: res.patientDetails.name,
		createdAt: res.patientDetails.createdAt,
		expectedCompletionDate: res.patientDetails.plannedSurgeryDate,
	};
};

// Helper function to map status to form component mapping
const getFormComponentKey = (status) => {
	const mapping = {
		Patient: "1",
		scanUpload: "2",
		scanValidation: "2",
		quotation: "4",
		advancePayment: "4",
		designImages: "5",
		designQCDocs: "5",
		designFile: "5",
		internalApproval: "5",
		externalApproval: "6",
		outerPrint: "6",
		flapPrint: "7",
		plaQCDocs: "6",
		peek_annealed: "7",
		peek_rough_polished: "7",
		peek_qcdocs: "7",
		peek_approved: "7",
		peek_laser_marked: "7",
		peek_final_polished: "7",
		packed: "8",
		payment_completed: "9",
		invoiced: "9",
	};

	return mapping[status] || "1";
};

// Status Badge component
const StatusBadge = ({ status }) => {
	let color = "default";
	let icon = <ClockCircleOutlined />;
	let text = "Unknown";

	if (status === "invoiced" || status === "payment_completed") {
		color = "success";
		icon = <CheckCircleOutlined />;
		text = "Completed";
	} else if (status.includes("approved") || status.includes("validated") || status === "packed") {
		color = "processing";
		icon = <CheckCircleOutlined />;
		text = "In Progress";
	} else if (
		status.includes("submitted") ||
		status.includes("uploaded") ||
		status.includes("printed") ||
		status.includes("polished")
	) {
		color = "warning";
		icon = <LoadingOutlined />;
		text = "Processing";
	} else if (status.includes("registered") || status.includes("sent")) {
		color = "default";
		icon = <ClockCircleOutlined />;
		text = "Waiting";
	}

	return <Badge status={color} text={text} />;
};

export default function OrderStatusPage() {
	const params = useParams();
	const router = useRouter();
	const orderId = params["id"] || "";
	const [activeTab, setActiveTab] = useState("status");
	const [orderStatus, setOrderStatus] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeFormKey, setActiveFormKey] = useState(null);

	// Fetch order status
	useEffect(() => {
		if (!orderId) return;

		setLoading(true);
		fetchOrderStatus(orderId)
			.then((data) => {
				setOrderStatus(data);
				setActiveFormKey(getFormComponentKey(data.currentStatus));
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to fetch order status:", error);
				setLoading(false);
			});
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
	const handleRefreshStatus = () => {
		setLoading(true);
		fetchOrderStatus(orderId)
			.then((data) => {
				setOrderStatus(data);
				setActiveFormKey(getFormComponentKey(data.currentStatus));
				setLoading(false);
			})
			.catch((error) => {
				console.error("Failed to refresh order status:", error);
				setLoading(false);
			});
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
					<Card title={`${orderStatus.orderCode}`} extra={<StatusBadge status={orderStatus.currentStatus} />}>
						<Space direction="vertical" style={{ width: "100%" }}>
							<div style={{ display: "flex", justifyContent: "space-between" }}>
								<div>
									<p>
										<strong>Patient:</strong> {orderStatus.patientName}
									</p>
									<p>
										<strong>Current Stage:</strong>{" "}
										{orderStatus.currentStatus
											.replace(/_/g, " ")
											.replace(/\b\w/g, (l) => l.toUpperCase())}
									</p>
								</div>
								<div>
									<p>
										<UserOutlined /> <strong>Created:</strong>{" "}
										<DateDisplay isoDate={orderStatus.createdAt} />
									</p>
									<p>
										<CalendarOutlined /> <strong>Expected Completion:</strong>{" "}
										<DateDisplay isoDate={orderStatus.expectedCompletionDate} />
									</p>
								</div>
							</div>
						</Space>
					</Card>

					<Tabs
						activeKey={activeTab}
						onChange={setActiveTab}
						style={{ marginTop: 16 }}
						items={[
							{
								key: "status",
								label: "Current Status",
								children: activeFormKey ? (
									<ActiveForm orderId={orderId} status={orderStatus.currentStatus} />
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
								children: <ForumDiscussion orderId={orderId}/>,
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
