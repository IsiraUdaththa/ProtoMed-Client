"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Card, Descriptions, Divider, Flex, Space, Spin, Table, Tabs } from "antd";
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
	fitFinishCheckedBy: string; // ????
	accuracyCheckedBy: string; // ????
	qcDesignDoc?: string; // ????
	qcMeasureValuesDoc?: string; // ????
	comment?: string;
}

interface PLA {
	outerPrint: IPLAOuterPrint;
	flapPrint: IPLAFlapPrint;
	qcDocs: IPLAQCDocs;
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
			<Tabs defaultActiveKey="0">
				{data.map((section, index) => {
					const outerItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.outerPrint?.printBy ? (
								<UserTag userId={section.outerPrint?.printBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.outerPrint?.printDate ? (
								<DateDisplay isoDate={section.outerPrint?.printDate} />
							) : (
								"N/A"
							),
						},
						{
							key: "color",
							label: "Color",
							children: section.outerPrint?.color ?? "N/A",
						},
						{
							key: "weight",
							label: "Weight",
							children: section.outerPrint?.weight ?? "N/A",
						},
						{
							key: "printMachine",
							label: "Print Machine",
							children: section.outerPrint?.printMachine ?? "N/A",
						},
						{
							key: "printTime",
							label: "Print Time",
							children: section.outerPrint?.printTime ?? "N/A",
						},
					];

					const innerItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.flapPrint?.printBy ? (
								<UserTag userId={section.flapPrint?.printBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.flapPrint?.printDate ? (
								<DateDisplay isoDate={section.flapPrint?.printDate} />
							) : (
								"N/A"
							),
						},
						{
							key: "color",
							label: "Color",
							children: section.flapPrint?.color ?? "N/A",
						},
						{
							key: "weight",
							label: "Weight",
							children: section.flapPrint?.weight ?? "N/A",
						},
						{
							key: "printMachine",
							label: "Print Machine",
							children: section.flapPrint?.printMachine ?? "N/A",
						},
						{
							key: "printTime",
							label: "Print Time",
							children: section.flapPrint?.printTime ?? "N/A",
						},
					];

					const qcDocsItems: DescriptionsProps["items"] = [
						{
							key: "approvedBy",
							label: "Approved By",
							children: section.qcDocs?.doneBy ? <UserTag userId={section.qcDocs?.doneBy} /> : "N/A",
						},
						{
							key: "approvalDate",
							label: "Approval Date",
							children: section.qcDocs?.designDate ? (
								<DateDisplay isoDate={section.qcDocs?.designDate} />
							) : (
								"N/A"
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
							children: section.approval?.approvalDate ? (
								<DateDisplay isoDate={section.approval?.approvalDate} />
							) : (
								"N/A"
							),
						},
						{
							key: "approvedBy",
							label: "Approved By",
							children: section.approval?.approvedBy ? (
								<UserTag userId={section.approval?.approvedBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "comment",
							label: "Comment",
							children: section.approval?.comment ?? "No comment",
						},
					];

					return (
						<Tabs.TabPane tab={`Print Attempt #${index + 1}`} key={index}>
							<Space direction="vertical">
								<Card>
									<Descriptions title="Inner Print" items={outerItems} column={2} />
								</Card>
								<Card>
									<Descriptions title="Outer Print" items={innerItems} column={2} />
								</Card>
								<Card>
									<Descriptions title="QC Docs" items={qcDocsItems} column={2} />
									<Divider />
									<Flex justify="space-around">
										<Table
											columns={[
												{
													title: "No",
													dataIndex: "no",
													key: "no",
													width: 100,
													align: "center",
												},
												{
													title: "Parameter/Specification (mm)",
													dataIndex: "parameter",
													key: "parameter",
													width: 200,
													align: "center",
												},
											]}
											dataSource={[
												{
													key: "1",
													no: "A",
													parameter: section.qcDocs?.implantModelA
														? section.qcDocs.implantModelA
														: "N/A",
												},
												{
													key: "2",
													no: "B",
													parameter: section.qcDocs?.implantModelB
														? section.qcDocs.implantModelB
														: "N/A",
												},
												{
													key: "3",
													no: "C",
													parameter: section.qcDocs?.implantModelC
														? section.qcDocs.implantModelC
														: "N/A",
												},
											]}
											size="small"
											pagination={false}
										/>
										<Table
											columns={[
												{
													title: "No",
													dataIndex: "no",
													key: "no",
													width: 100,
													align: "center",
												},
												{
													title: "Parameter/Specification (mm)",
													dataIndex: "parameter",
													key: "parameter",
													width: 200,
													align: "center",
												},
											]}
											dataSource={[
												{
													key: "1",
													no: "A",
													parameter: section.qcDocs?.skullDefectA
														? section.qcDocs.skullDefectA
														: "N/A",
												},
												{
													key: "2",
													no: "B",
													parameter: section.qcDocs?.skullDefectB
														? section.qcDocs.skullDefectB
														: "N/A",
												},
												{
													key: "3",
													no: "C",
													parameter: section.qcDocs?.skullDefectC
														? section.qcDocs.skullDefectC
														: "N/A",
												},
											]}
											size="small"
											pagination={false}
										/>
									</Flex>
								</Card>

								<Card>
									<Descriptions title="Approval" items={approvalItems} column={2} />
								</Card>
							</Space>
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		</>
	);
};

export default App;
