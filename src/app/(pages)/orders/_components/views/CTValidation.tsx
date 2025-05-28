import React, { useEffect, useState } from "react";
import { Button, Descriptions, Divider, Image, Spin, Alert } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import UserTag from "@/app/_components/UserTag";

const CTScan: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await api.get(`orders/${orderId}/ct-validation`);

				// Log the response to see the structure
				console.log("CT Scan data:", response.data);

				if (!(response.status === 200)) {
					throw new Error("Failed to fetch CT scan data");
				}

				const result = response.data.ctValidation;
				setData(result);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data) return <Alert message="No details available." type="info" showIcon />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;

	// Verify data structure here by logging
	console.log("State data:", data);

	const items2 = [
		{ key: "1", label: "Name", children: data?.implantName },
		{ key: "2", label: "Size", children: data?.size },
		{ key: "3", label: "Validated By", children: <UserTag userId={data?.validatedBy} /> },
	];

	return (
		<>
			<Divider />
			<Descriptions items={items2} />

			<Divider />
			<>
				<Image.PreviewGroup>
					<Image width={200} src={data?.ctImage2D} alt="" />
					<Image width={200} src={data?.ctImage3D} alt="" />
				</Image.PreviewGroup>
			</>
		</>
	);
};

export default CTScan;
