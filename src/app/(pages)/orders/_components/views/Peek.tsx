"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Descriptions, Divider, Spin, Image } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface IPEEKPrint {
	material: string;
	printMachine: string;
	printDate: Date;
	batchNumber: string;
	weight: number;
	wasteWeight: number;
	printBy: string;
}

interface IPEEKAnnealing {
	processDate: Date;
	doneBy: string;
}

interface IPEEKPolishing {
	polishingBy: string;
	polishingDate: Date;
}

interface IPeekQCDocs {
	doneBy: string;

	images: string[];

	implantModelA: number;
	implantModelB: number;
	implantModelC: number;
}

interface IPEEKApproval {
	isApproved: boolean;
	checkedBy: string; // ????
	approvalDate: Date;
	approvedBy: string;
	comment?: string;
}
interface IPEEKLaserMarking {
	doneBy: string;
	markingDate: Date;
	image: string;
}

interface IPEEKFinalPolishing extends Document {
	doneBy: string;
	date: Date;
}

interface PEEK {
	print: IPEEKPrint;
	annealing: IPEEKAnnealing;
	screwHoleSize: string;
	polishing: IPEEKPolishing;
	qcDocs: IPeekQCDocs;
	approval: IPEEKApproval;
	laserMarking: IPEEKLaserMarking;
	finalPolishing: IPEEKFinalPolishing;
}

type Data = PEEK[];

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<Data | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data.peek);
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
				const printItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.print?.printBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.print?.printDate} />,
					},
					{
						key: "color",
						label: "Color",
						children: section.print?.material,
					},
					{
						key: "weight",
						label: "Weight",
						children: section.print?.printMachine,
					},
					{
						key: "printMachine",
						label: "Print Machine",
						children: section.print?.batchNumber,
					},
					{
						key: "printTime",
						label: "Print Time",
						children: section.print?.weight,
					},
					{
						key: "printTime",
						label: "Print Time",
						children: section.print?.wasteWeight,
					},
				];

				const annealingItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.annealing?.doneBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.annealing?.processDate} />,
					},
				];

				const polishingItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.polishing?.polishingBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.polishing?.polishingDate} />,
					},
				];

				const qcDocsItems: DescriptionsProps["items"] = [
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.qcDocs?.doneBy} />,
					},
					{
						key: "skullDefectA",
						label: "Skull Defect A",
						children: section.qcDocs?.implantModelA,
					},
					{
						key: "skullDefectB",
						label: "Skull Defect B",
						children: section.qcDocs?.implantModelB,
					},
					{
						key: "skullDefectC",
						label: "Skull Defect C",
						children: section.qcDocs?.implantModelC,
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
						children: <DateDisplay isoDate={section.approval?.approvalDate} />,
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

				const laserMarkingItems: DescriptionsProps["items"] = [
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.laserMarking?.doneBy} />,
					},
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.laserMarking?.markingDate} />,
					},
				];

				const finalPolishingItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.finalPolishing?.doneBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.finalPolishing?.date} />,
					},
				];
				return (
					<div key={index}>
						<Divider orientation="left">PEEK Attempt #{index + 1}</Divider>
						<Descriptions title="Print" items={printItems} />
						<Descriptions title="Annealing" items={annealingItems} />
						<Descriptions title="Polishing" items={polishingItems} />
						<Descriptions title="QC Docs" items={qcDocsItems} />
						<Image.PreviewGroup>
							{section.qcDocs.images.map((imgSrc, index) => (
								<Image key={index} width={200} src={imgSrc} alt={`Image ${index + 1}`} />
							))}
						</Image.PreviewGroup>
						<Descriptions title="Laser Marking" items={laserMarkingItems} />
						<Image key={index} width={200} src={section.laserMarking?.image} alt={``} />
						<Descriptions title="Final Polishing" items={finalPolishingItems} />

						<Descriptions title="Approval" items={approvalItems} />
					</div>
				);
			})}
		</>
	);
};

export default App;
