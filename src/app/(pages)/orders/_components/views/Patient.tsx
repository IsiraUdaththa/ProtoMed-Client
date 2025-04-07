"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";

interface OrderInfoProps {
	orderId?: string; // Make orderId optional in props to support fallback from localStorage
}

const OrderInfo: React.FC<OrderInfoProps> = ({ orderId: propOrderId }) => {
	const [orderId, setOrderId] = useState<string | null>(null);
	const [data, setData] = useState<DescriptionsProps["items"] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Get orderId from localStorage if it's not provided as a prop
	useEffect(() => {
		if (propOrderId) {
			setOrderId(propOrderId); // Set from props if provided
		} else {
			const storedOrderId = localStorage.getItem("orderId");
			if (storedOrderId) {
				setOrderId(storedOrderId); // Set from localStorage if available
			} else {
				setError("Order ID is missing.");
				setLoading(false);
			}
		}
	}, [propOrderId]);

	// Fetch order details if orderId is available
	useEffect(() => {
		if (!orderId) return;

		const fetchOrder = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await api.get(`orders/${orderId}`);

				if (!response.data) {
					throw new Error("Empty response from server.");
				}

				const order = response.data;
				const patient = order?.patientDetails || {};

				const items: DescriptionsProps["items"] = [
					{ key: "1", label: "Order Number", children: order?.orderId || "N/A" },
					{ key: "2", label: "Customer Name", children: patient.name || "N/A" },
					{ key: "3", label: "Age", children: patient.age || "N/A" },
					{ key: "4", label: "Gender", children: patient.gender || "N/A" },
					{ key: "5", label: "Contact Number", children: patient.contactNumber || "N/A" },
					{ key: "6", label: "Address", children: patient.address || "N/A" },
					{ key: "7", label: "Category", children: patient.category || "N/A" },
					{ key: "8", label: "CT Scan Method", children: patient.ctScanMethod || "N/A" },
					{ key: "9", label: "Hospital", children: patient.hospital || "N/A" },
					{ key: "10", label: "Ward", children: patient.ward || "N/A" },
					{ key: "11", label: "Planned Surgery Date", children: patient.surgeryDate || "N/A" },
					{ key: "12", label: "Comment", children: patient.comment || "N/A" },
					{ key: "13", label: "Registered By", children: patient.registeredBy || "N/A" },
					{ key: "14", label: "Order Status", children: order?.status || "N/A" },
					{ key: "15", label: "Total Price", children: order?.totalPrice ? `$${order.totalPrice}` : "N/A" },
					{ key: "16", label: "Order Date", children: order?.orderDate || "N/A" },
					{ key: "17", label: "Last Updated", children: order?.lastUpdated || "N/A" },
				].filter((item) => item.children !== "N/A");

				setData(items.length > 0 ? items : null);
			} catch (error) {
				console.error("Error fetching order data:", error);
				setError("Failed to fetch order details. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		fetchOrder();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;
	if (!data) return <Alert message="No order details available." type="info" showIcon />;

	return (
		<>
			<p>Order ID: {orderId}</p> {/* Display Order ID */}
			<Descriptions bordered items={data} />
		</>
	);
};

export default OrderInfo;
