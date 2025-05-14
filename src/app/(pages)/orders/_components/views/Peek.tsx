import React, { useEffect, useState } from "react";
import { Descriptions, Divider, Spin, Alert, Space } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import UserTag from "@/app/_components/UserTag";

interface ProcessSection {
	id: number;
	print?: DescriptionsProps["items"];
	annealing?: DescriptionsProps["items"];
	screwHoleSize?: DescriptionsProps["items"];
	polishing?: DescriptionsProps["items"];
	approval?: DescriptionsProps["items"];
	laserMarking?: DescriptionsProps["items"];
	finalPolishing?: DescriptionsProps["items"];
}

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [state, setState] = useState<{
		data: ProcessSection[] | null;
		loading: boolean;
		error: string | null;
	}>({
		data: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		if (!orderId) return;

		const fetchOrder = async () => {
			try {
				setState({ data: null, loading: true, error: null });

				const response = await api.get(`orders/${orderId}/`);
				const order = response.data;
				if (!order || !order.peek) throw new Error("Empty response from server.");

				const structuredData: ProcessSection[] = order.peek.map((item: any, index: number) => ({
					id: index,
					print: [
						{ label: "Print Machine", children: item.print?.printMachine },
						{ label: "Material", children: item.print?.material },
						{
							label: "Print Time",
							children: item.print?.printDate ? <DateDisplay isoDate={item.print?.printDate} /> : null,
						},
						{ label: "Weight", children: item.print?.weight && `${item.print.weight} g` },
						{ label: "Waste Weight", children: item.print?.wasteWeight && `${item.print.wasteWeight} g` },
						{ label: "Batch Number", children: item.print?.batchNumber },
						{ label: "Done By", children: item.print?.printBy ? <UserTag userId={item.print?.printBy} /> : null },
					].filter((i) => i.children),
					annealing: [
						{
							label: "Processed Date",
							children: item.annealing ? <DateDisplay isoDate={item.annealing?.processDate} /> : null,
						},
						{ label: "Done By", children: item.annealing ? <UserTag userId={item.annealing?.doneBy} /> : null },
					].filter((i) => i.children),
					screwHoleSize: [{ label: "Screw Hole Size", children: item.screwHoleSize }].filter((i) => i.children),
					polishing: [
						{
							label: "Date",
							children: item.polishing ? <DateDisplay isoDate={item.polishing?.polishingDate} /> : null,
						},
						{ label: "Done By", children: item.polishing ? <UserTag userId={item.polishing?.polishingBy} /> : null },
					].filter((i) => i.children),
					approval: [
						{ label: "Status", children: item.approval?.isApproved },
						{ label: "Checked By", children: item.approval ? <UserTag userId={item.approval?.checkedBy} /> : null },
						{
							label: "Date",
							children: item.approval ? <DateDisplay isoDate={item.approval?.approvalDate} /> : null,
						},
						{
							label: "Approved By",
							children: item.approval ? <UserTag userId={item.approval?.approvedBy} /> : null,
						},
						{ label: "Comment", children: item.approval?.comment },
					].filter((i) => i.children),
					laserMarking: [
						{
							label: "Date",
							children: item.laserMarking ? <DateDisplay isoDate={item.laserMarking?.markingDate} /> : null,
						},
						{ label: "Done By", children: item.laserMarking ? <UserTag userId={item.laserMarking?.doneBy} /> : null },
					].filter((i) => i.children),
					finalPolishing: [
						{ label: "Date", children: item.finalPolishing ? <DateDisplay isoDate={item.finalPolishing?.date} /> : null },
						{ label: "Done By", children: item.finalPolishing?.doneBy ? <UserTag userId={item.finalPolishing?.doneBy} /> : null },
					].filter((i) => i.children),
				}));

				setState({ data: structuredData, loading: false, error: null });
			} catch (error) {
				console.error("Error fetching order:", error);
				setState({ data: null, loading: false, error: "Failed to fetch order details." });
			}
		};

		fetchOrder();
	}, [orderId]);

	const { data, loading, error } = state;

	if (loading) return <Spin size="large" />;
	if (error) return <Alert message="Error" description={error} type="error" showIcon />;
	if (!data) return <Alert message="No order details available." type="info" showIcon />;

	return (
		<>
			{data.map((section) => (
				<Space direction="vertical">
					<Divider orientation="left">Print Job #{section.id + 1}</Divider>

					{section.print?.length ? <Descriptions title="Print" items={section.print} /> : null}
					{section.annealing?.length ? <Descriptions title="Annealing" items={section.annealing} /> : null}
					{section.screwHoleSize?.length ? <Descriptions title="Screw Hole Size" items={section.screwHoleSize} /> : null}
					{section.polishing?.length ? <Descriptions title="Polishing" items={section.polishing} /> : null}
					{section.approval?.length ? <Descriptions title="Approval" items={section.approval} /> : null}
					{section.laserMarking?.length ? <Descriptions title="Laser Marking" items={section.laserMarking} /> : null}
					{section.finalPolishing?.length ? <Descriptions title="Final Polishing" items={section.finalPolishing} /> : null}
				</Space>
			))}
		</>
	);
};

export default App;
