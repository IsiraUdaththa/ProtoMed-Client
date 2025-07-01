"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Descriptions, Divider, Spin, Image, Button } from "antd";
import type { DescriptionsProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface IDesignImages {
	designBy: string;
	designDate: string;

	damageFront: string;
	damageSide: string;
	damageTop: string;
	damageBack: string;
	designFront: string;
	designSide: string;
	designTop: string;
	designBack: string;
	damageFrontWithSoftTissues: string;
	damageSideWithSoftTissues: string;
	designFrontWithSoftTissues: string;
	designSideWithSoftTissues: string;
	designWithDimensions: string;
}

interface IQCDocs {
	designBy: string;
	designDate: Date;

	skullDefectSpecificationImage: string;
	skullDefectSpecificationA: number;
	skullDefectSpecificationB: number;
	skullDefectSpecificationC: number;

	implantModelSpecificationImage: string;
	implantModelSpecificationA: number;
	implantModelSpecificationB: number;
	implantModelSpecificationC: number;
}

interface IDesignFile {
	designBy: string;
	designDate: Date;
	designFile: string;
}

interface IDesignApproval {
	isApproved: boolean;
	date: string;
	approvedBy: string;
	comment: string;
}

interface Design {
	designImages: IDesignImages;
	qcDocs: IQCDocs;
	designFile: IDesignFile;
	approval: IDesignApproval;
}

type Data = Design[];

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<Data | null>(null);
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
						children: <UserTag userId={section.designImages.designBy} />,
					},
					{
						key: "designDate",
						label: "Date",
						children: <DateDisplay isoDate={section.designImages.designDate} />,
					},
				];

				const qcDocsItems: DescriptionsProps["items"] = [
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.approval?.date} />,
					},
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.approval?.approvedBy} />,
					},
					{
						key: "comment",
						label: "Comment",
						children: section.approval?.comment,
					},
				];

				const designFileItems: DescriptionsProps["items"] = [
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.designFile?.designDate} />,
					},
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.designFile?.designBy} />,
					},
					{
						key: "comment",
						label: "Comment",
						children: (
							<Button
								icon={<DownloadOutlined />}
								href={section.designFile.designFile}
								target="_blank"
								rel="noopener noreferrer"
								style={{ marginBottom: "1rem" }}
							>
								Download Design
							</Button>
						),
					},
				];

				const approvalItems: DescriptionsProps["items"] = [
					{
						key: "isApproved",
						label: "Approved",
						children: section.approval.isApproved ? (
							<Badge count="Approved" style={{ backgroundColor: "#52c41a" }} />
						) : (
							<Badge count="Rejected" />
						),
					},
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.approval?.date} />,
					},
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.approval?.approvedBy} />,
					},
					{
						key: "comment",
						label: "Comment",
						children: section.approval?.comment,
					},
				];

				return (
					<div key={index}>
						<Divider orientation="left">Design Attempt #{index + 1}</Divider>
						<Descriptions title="Design Details" items={designItems} />
						<Descriptions title="QC Docs" items={qcDocsItems} />
						<Descriptions title="QC Docs" items={designFileItems} />
						<Image.PreviewGroup>
							<Image width={200} src={section.designImages.damageFront} alt="" />
							<Image width={200} src={section.designImages.damageSide} alt="" />
							<Image width={200} src={section.designImages.damageTop} alt="" />
							<Image width={200} src={section.designImages.damageBack} alt="" />
							<Image width={200} src={section.designImages.designFront} alt="" />
							<Image width={200} src={section.designImages.designSide} alt="" />
							<Image width={200} src={section.designImages.designTop} alt="" />
							<Image width={200} src={section.designImages.designBack} alt="" />
							<Image width={200} src={section.designImages.damageFrontWithSoftTissues} alt="" />
							<Image width={200} src={section.designImages.damageSideWithSoftTissues} alt="" />
							<Image width={200} src={section.designImages.designFrontWithSoftTissues} alt="" />
							<Image width={200} src={section.designImages.designSideWithSoftTissues} alt="" />
							<Image width={200} src={section.designImages.designWithDimensions} alt="" />
						</Image.PreviewGroup>
						{approvalItems[index] != null && <Descriptions title="Approval Info" items={approvalItems} />}
					</div>
				);
			})}
		</>
	);
};

export default App;
