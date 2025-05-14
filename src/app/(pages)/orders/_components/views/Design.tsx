import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Descriptions, Divider, Spin } from "antd";
import type { DescriptionsProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface Approval {
	isApproved: boolean;
	date: string;
	approvedBy: string;
	comment: string;
}

interface Design {
	design: {
		designBy: string;
		designDate: string;
		designFile: string;
		_id: string;
		createdAt: string;
		updatedAt: string;
	};
	_id: string;
	approval: Approval;
}

type PackingData = Design[];

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<PackingData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data.designs);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data || data.length === 0) return <Alert message="No design details available." type="info" showIcon />;

	return (
		<>
			{data.map((section, index) => {
				const designItems: DescriptionsProps["items"] = [
					{
						key: "designBy",
						label: "Done By",
						children: <UserTag userId={section.design.designBy} />,
					},
					{
						key: "designDate",
						label: "Date",
						children: <DateDisplay isoDate={section.design.designDate} />,
					}
				];

				const approvalItems: DescriptionsProps["items"] = [
					{
						key: "isApproved",
						label: "Approved",
						children: section.approval.isApproved ?  <Badge count="Approved" style={{ backgroundColor: "#52c41a" }} /> :  <Badge count="Rejected" />,
					},
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.approval.date} />,
					},
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.approval.approvedBy} />,
					},
					{
						key: "comment",
						label: "Comment",
						children: section.approval.comment,
					},
				];

				return (
					<div key={section._id}>
						<Divider orientation="left">Design Attempt #{index + 1}</Divider>
						<Descriptions title="Design Details" items={designItems} />
						<Button
							icon={<DownloadOutlined />}
							href={section.design.designFile}
							target="_blank"
							rel="noopener noreferrer"
							style={{ marginBottom: "1rem" }}
						>
							Download Design
						</Button>
						<Descriptions title="Approval Info" items={approvalItems} />
					</div>
				);
			})}
		</>
	);
};

export default App;
