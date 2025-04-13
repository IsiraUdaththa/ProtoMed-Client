import React, { useEffect, useState } from "react";
import { Button, Descriptions, Divider, Image, Spin, Alert } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const CTScan: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<any>(null);
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
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;

	// Verify data structure here by logging
	console.log("State data:", data);

	// Access data from the ctScan object
	const items = [
		{ key: "1", label: "Number", children: data?.ctScan?.ctNumber },
		{ key: "2", label: "Date", children: data?.ctScan?.ctDate },
		{ key: "3", label: "Checked By", children: data?.ctScan?.checkedBy },
		{ key: "4", label: "Comment", children: data?.ctScan?.comment },
	];

	const items2 = [
		{ key: "1", label: "Name", children: data?.implantRegion },
		{ key: "2", label: "Size", children: data?.size },
		{ key: "3", label: "Validated By", children: data?.validatedBy },
		{ key: "4", label: "Comment", children: data?.validationComment },
	];

	return (
		<>
			<Button icon={<DownloadOutlined />} href={data?.ctScan?.ctScanLink}>
				Download Model
			</Button>

			<Descriptions items={items} />

			<Divider />
			<Descriptions items={items2} />

			<Divider />
			<>
				<Image.PreviewGroup>
					<Image width={200} src={data?.image1} />
					<Image width={200} src={data?.image2} />
				</Image.PreviewGroup>
			</>
		</>
	);
};

export default CTScan;
