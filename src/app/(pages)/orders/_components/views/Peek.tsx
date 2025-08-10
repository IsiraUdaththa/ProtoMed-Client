"use client";

import React, { useEffect, useState } from "react";
import { Alert, Badge, Descriptions, Divider, Spin, Image, Table, Tabs, Space, Card, Flex } from "antd";
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
	createdAt: Date;
	doneBy: string;
}

interface IPEEKPolishing {
	polishingBy: string;
	createdAt: Date;
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
	createdAt: Date;
	approvedBy: string;
	comment?: string;
}
interface IPEEKLaserMarking {
	doneBy: string;
	createdAt: Date;
	image: string;
}

interface IPEEKFinalPolishing extends Document {
	doneBy: string;
	createdAt: Date;
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
	const [columns, setColumns] = useState(2);

	useEffect(() => {
		function handleResize() {
			setColumns(window.innerWidth < 768 ? 1 : 2);
		}
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/peek`);
				setData(response.data);
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
			<Tabs defaultActiveKey="0">
				{data.map((section, index) => {
					const printItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.print?.printBy ? <UserTag userId={section.print?.printBy} /> : "N/A",
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.print?.printDate ? (
								<DateDisplay isoDate={section.print?.printDate} />
							) : (
								"N/A"
							),
						},
						{
							key: "color",
							label: "Color",
							children: section.print?.material ?? "N/A",
						},
						{
							key: "weight",
							label: "Weight",
							children: section.print?.printMachine ?? "N/A",
						},
						{
							key: "printMachine",
							label: "Print Machine",
							children: section.print?.batchNumber ?? "N/A",
						},
						{
							key: "printTime",
							label: "Print Time",
							children: section.print?.weight ?? "N/A",
						},
						{
							key: "printTime",
							label: "Print Time",
							children: section.print?.wasteWeight ?? "N/A",
						},
					];

					const annealingItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.annealing?.doneBy ? (
								<UserTag userId={section.annealing?.doneBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.annealing?.createdAt ? (
								<DateDisplay isoDate={section.annealing?.createdAt} />
							) : (
								"N/A"
							),
						},
					];

					const polishingItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.polishing?.polishingBy ? (
								<UserTag userId={section.polishing?.polishingBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.polishing?.createdAt ? (
								<DateDisplay isoDate={section.polishing?.createdAt} />
							) : (
								"N/A"
							),
						},
					];

					const qcDocsItems: DescriptionsProps["items"] = [
						{
							key: "doneBy",
							label: "Done By",
							children: section.qcDocs?.doneBy ? <UserTag userId={section.qcDocs?.doneBy} /> : "N/A",
						},
					];

					const approvalItems: DescriptionsProps["items"] = [
						{
							key: "isApproved",
							label: "Approved",
							children: section.approval?.isApproved ? (
								<Badge count="Approved" style={{ backgroundColor: "#52c41a" }} />
							) : (
								<Badge count="Rejected" />
							),
						},
						{
							key: "createdAt",
							label: "Approval Date",
							children: section.approval?.createdAt ? (
								<DateDisplay isoDate={section.approval?.createdAt} />
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
							children: section.approval?.comment,
						},
					];

					const laserMarkingItems: DescriptionsProps["items"] = [
						{
							key: "approvedBy",
							label: "Approved By",
							children: section.laserMarking?.doneBy ? (
								<UserTag userId={section.laserMarking?.doneBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "createdAt",
							label: "Approval Date",
							children: section.laserMarking?.createdAt ? (
								<DateDisplay isoDate={section.laserMarking?.createdAt} />
							) : (
								"N/A"
							),
						},
					];

					const finalPolishingItems: DescriptionsProps["items"] = [
						{
							key: "printBy",
							label: "Print By",
							children: section.finalPolishing?.doneBy ? (
								<UserTag userId={section.finalPolishing?.doneBy} />
							) : (
								"N/A"
							),
						},
						{
							key: "printDate",
							label: "Print Date",
							children: section.finalPolishing?.createdAt ? (
								<DateDisplay isoDate={section.finalPolishing?.createdAt} />
							) : (
								"N/A"
							),
						},
					];
					return (
						<Tabs.TabPane tab={`PEEK Attempt #${index + 1}`} key={index}>
							<Space direction="vertical">
								<Card>
									<Descriptions title="Print" items={printItems} column={columns} />
								</Card>

								<Card>
									<Descriptions title="Annealing" items={annealingItems} column={columns} />
								</Card>
								<Card>
									<Descriptions title="Polishing" items={polishingItems} column={columns} />
								</Card>

								<Card>
									<Descriptions title="QC Docs" items={qcDocsItems} column={columns} />
									<Divider />
									<Image.PreviewGroup>
										{section.qcDocs?.images.map((imgSrc, index) => (
											<Image key={index} width={200} src={imgSrc} alt={`Image ${index + 1}`} />
										))}
									</Image.PreviewGroup>
									<Divider />
									<Flex justify="space-around">
										<Table
											columns={[
												{
													title: "No",
													dataIndex: "no",
													key: "no",
													width: 100,
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
									</Flex>
								</Card>
								<Card>
									<Descriptions title="Laser Marking" items={laserMarkingItems} column={columns} />
									<Divider />
									<Flex wrap justify="space-evenly">
										<Image key={index} width={200} src={section.laserMarking?.image} alt={``} />
									</Flex>
								</Card>
								<Card>
									<Descriptions
										title="Final Polishing"
										items={finalPolishingItems}
										column={columns}
									/>
								</Card>
								<Card>
									<Descriptions title="Approval" items={approvalItems} column={columns} />
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
