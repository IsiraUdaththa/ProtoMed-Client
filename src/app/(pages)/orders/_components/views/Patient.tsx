"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert } from "antd";
import type { DescriptionsProps } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

const OrderInfo: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<DescriptionsProps["items"] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
				console.log(patient.registeredBy)

				const items: DescriptionsProps["items"] = [
					{ key: "1", label: "Name", children: patient.name || "N/A" },
					{ key: "2", label: "Age", children: patient.age || "N/A" },
					{ key: "3", label: "Gender", children: patient.gender || "N/A" },
					{ key: "4", label: "Contact Number", children: patient.contactNumber || "N/A" },
					{ key: "5", label: "Address", children: patient.address || "N/A" },
					{ key: "6", label: "Category", children: patient.category || "N/A" },
					{ key: "7", label: "surgeonName", children: patient.surgeonName || "N/A" },
					{ key: "8", label: "CT Scan Method", children: patient.ctScanMethod || "N/A" },
					{ key: "9", label: "Hospital", children: patient.hospital || "N/A" },
					{ key: "10", label: "Ward", children: patient.ward || "N/A" },
					{ key: "11", label: "Planned Surgery Date", children: patient.surgeryDate || "N/A" },
					{ key: "12", label: "Comment", children: patient.comment || "N/A" },
					{ key: "13", label: "Registered By", children: patient.registeredBy ? <UserTag userId={patient.registeredBy} /> : "N/A" },
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
			<Descriptions items={data} />
		</>
	);
};

export default OrderInfo;
