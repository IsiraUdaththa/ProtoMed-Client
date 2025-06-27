"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Descriptions, Divider, Spin } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface IPLAOuterPrint {
	printBy: string;
	printDate: Date;
	color: string;
	weight: number;
	printMachine: string;
	printTime: number;
}

interface IPLAFlapPrint {
	printBy: string;
	printDate: Date;
	color: string;
	weight: number;
	printMachine: string;
	printTime: number;
}

interface IPLAQCDocs extends Document {
	doneBy: string;
	designDate: Date;

	skullDefectA: number;
	skullDefectB: number;
	skullDefectC: number;

	implantModelA: number;
	implantModelB: number;
	implantModelC: number;
}

interface IPLAApproval {
	isApproved: boolean;
	approvalDate: Date;
	approvedBy: string;
	fitFinishCheckedBy: string;   // ????
	accuracyCheckedBy: string;    // ????
	qcDesignDoc?: string; // ????
	qcMeasureValuesDoc?: string; // ????
	comment?: string; 
}

interface PLA {
	outerPrint: IPLAOuterPrint;
	flapPrint: IPLAFlapPrint;
	qcdocs: IPLAQCDocs;
	approval: IPLAApproval;
}

type Data = PLA[];

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<Data | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data.pla);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data || data.length === 0) return <Alert message="No PLA details available." type="info" showIcon />;

	return (
		<>
			{data.map((section, index) => {
				const outerItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.outerPrint?.printBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.outerPrint?.printDate} />,
					},
					{
						key: "color",
						label: "Color",
						children: section.outerPrint?.color,
					},
					{
						key: "weight",
						label: "Weight",
						children: section.outerPrint?.weight,
					},
					{
						key: "printMachine",
						label: "Print Machine",
						children: section.outerPrint?.printMachine,
					},
					{
						key: "printTime",
						label: "Print Time",
						children: section.outerPrint?.printTime,
					},
				];

				const innerItems: DescriptionsProps["items"] = [
					{
						key: "printBy",
						label: "Print By",
						children: <UserTag userId={section.flapPrint?.printBy} />,
					},
					{
						key: "printDate",
						label: "Print Date",
						children: <DateDisplay isoDate={section.flapPrint?.printDate} />,
					},
					{
						key: "color",
						label: "Color",
						children: section.flapPrint?.color,
					},
					{
						key: "weight",
						label: "Weight",
						children: section.flapPrint?.weight,
					},
					{
						key: "printMachine",
						label: "Print Machine",
						children: section.flapPrint?.printMachine,
					},
					{
						key: "printTime",
						label: "Print Time",
						children: section.flapPrint?.printTime,
					},
				];

				const qcDocsItems: DescriptionsProps["items"] = [
					{
						key: "approvedBy",
						label: "Approved By",
						children: <UserTag userId={section.qcdocs?.doneBy} />,
					},
					{
						key: "approvalDate",
						label: "Approval Date",
						children: <DateDisplay isoDate={section.qcdocs?.designDate} />,
					},
					{
						key: "skullDefectA",
						label: "Skull Defect A",
						children: section.qcdocs?.skullDefectA,
					},
					{
						key: "skullDefectB",
						label: "Skull Defect B",
						children: section.qcdocs?.skullDefectB,
					},
					{
						key: "skullDefectC",
						label: "Skull Defect C",
						children: section.qcdocs?.skullDefectC,
					},
					{
						key: "implantModelA",
						label: "Implant Model A",
						children: section.qcdocs?.implantModelA,
					},
					{
						key: "implantModelB",
						label: "Implant Model B",
						children: section.qcdocs?.implantModelB,
					},
					{
						key: "implantModelC",
						label: "Implant Model C",
						children: section.qcdocs?.implantModelC,
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

				return (
					<div key={index}>
						<Divider orientation="left">PLA Attempt #{index + 1}</Divider>
						<Descriptions title="Inner Print" items={outerItems} />
						<Descriptions title="Outer Print" items={innerItems} />
						<Descriptions title="QC Docs" items={qcDocsItems} />
						<Descriptions title="Approval" items={approvalItems} />
					</div>
				);
			})}
		</>
	);
};

export default App;
