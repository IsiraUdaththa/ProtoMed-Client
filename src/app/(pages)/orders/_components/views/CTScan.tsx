"use client";

import React, { useEffect, useState } from "react";
import { Button, Descriptions, Spin, Alert, Tooltip, Divider } from "antd";
import { DownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import UserTag from "@/app/_components/UserTag";

interface data extends Document {
	ctScanLink: string;
	ctNumber: string;
	ctDate: Date;
	checkedBy: string;
	comment: string;
	createdAt: Date;
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

				console.log("CT Scan data:", response.data);

				if (response.status !== 200) {
					throw new Error("Failed to fetch CT scan data");
				}

				setData(response.data);
			} catch (error) {
				console.error("Error fetching CT scan data:", error);
				setError("Failed to load CT scan data.");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;
	if (!data) return <Alert message="No details available." type="info" showIcon />;

	const items = [
		{ key: "1", label: "CT Number", children: data.ctNumber ?? "N/A" },
		//{ key: "2", label: "Date", children: data.ctDate ? <DateDisplay isoDate={data.ctDate} /> : "N/A" },
		{ key: "3", label: "Comment", children: data.comment ?? "No comment" },
	];

	return (
		<div style={{ position: "relative", paddingBottom: 48 }}>
			{/* Download button */}
			<Tooltip title={data.ctScanLink ? "" : "CT Scan link not available"}>
				<span>
					<Button icon={<DownloadOutlined />} href={data.ctScanLink} disabled={!data.ctScanLink}>
						Download Scan
					</Button>
				</span>
			</Tooltip>

			<Divider />

			<Descriptions items={items} column={3} />

			{data.checkedBy && data.createdAt && (
				<Tooltip color="white"
					placement="left"
					title={
						<>
							<div><UserTag userId={data.checkedBy} /></div>
							<div style={{ color: "black" }}><DateDisplay isoDate={data.createdAt} /></div>
						</>
					}
				>
					<Button
						
						type="text"
						shape="circle"
						icon={<ExclamationCircleOutlined />}
						style={{
							position: "absolute",
							bottom: 0,
							right: 0,
						}}
						//aria-label="CT Scan Metadata"
					/>
				</Tooltip>
			)}
		</div>
	);
};

export default CTScan;
