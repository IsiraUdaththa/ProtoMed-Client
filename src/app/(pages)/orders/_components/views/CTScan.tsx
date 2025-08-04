"use client";

import React, { useEffect, useState } from "react";
import { Button, Descriptions, Spin, Alert, Tooltip, Divider } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import UserTag from "@/app/_components/UserTag";

interface data extends Document {
	ctScanLink: string;
	ctNumber: string;
	ctDate: Date;
	checkedBy: string;
	comment: string;
}

const CTScan: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<data>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await api.get(`orders/${orderId}/ct-scan`);

				// Log the response to see the structure
				console.log("CT Scan data:", response.data);

				if (!(response.status === 200)) {
					throw new Error("Failed to fetch CT scan data");
				}

				const result = response.data;
				setData(result);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data) return <Alert message="No details available." type="info" showIcon />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;

	// Access data from the ctScan object
	const items = [
		{ key: "1", label: "CT Number", children: data?.ctNumber ?? "N/A" },
		{ key: "2", label: "Date", children: data?.ctDate ? <DateDisplay isoDate={data.ctDate} /> : "N/A" },
		{
			key: "3",
			label: "Checked By",
			children: data?.checkedBy ? <UserTag userId={data.checkedBy} /> : "N/A",
		},
		{ key: "4", label: "Comment", children: data?.comment ?? "No comment" },
	];

	return (
		<>
			<Tooltip title={data?.ctScanLink ? "" : "CT Scan link not available"}>
				<span>
					<Button icon={<DownloadOutlined />} href={data?.ctScanLink} disabled={!data?.ctScanLink}>
						Download Scan
					</Button>
				</span>
			</Tooltip>

			<Divider />
			<Descriptions items={items} column={2}/>
		</>
	);
};

export default CTScan;
