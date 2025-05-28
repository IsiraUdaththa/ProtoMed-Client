import React, { useEffect, useState } from "react";
import { Descriptions, Divider, Spin, Alert, Space } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";
import DateDisplay from "@/app/_components/DateDisplay";
import UserTag from "@/app/_components/UserTag";

interface ProcessSection {
	id: number;
	outerPrint?: DescriptionsProps["items"];
	flapPrint?: DescriptionsProps["items"];
	approval?: DescriptionsProps["items"];
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
				if (!order || !order.pla) throw new Error("Empty response from server.");

				const structuredData: ProcessSection[] = order.pla.map((item: any, index: number) => ({
					id: index,
					outerPrint: [
						{ label: "Print Machine", children: item.outerPrint?.printMachine },
						{ label: "Color", children: item.outerPrint?.color },
						{ label: "Weight", children: item.outerPrint?.weight && `${item.outerPrint.weight} g` },
						{ label: "Print Time", children: item.outerPrint?.printTime },
						{
							label: "Date",
							children: item.outerPrint?.printDate ? <DateDisplay isoDate={item.outerPrint?.printDate} /> : null,
						},
						{
							label: "Done By",
							children: item.outerPrint?.printBy ? <UserTag userId={item.outerPrint?.printBy} /> : null,
						},
					].filter((i) => i.children),
					flapPrint: [
						{ label: "Print Machine", children: item.flapPrint?.printMachine },
						{ label: "Color", children: item.flapPrint?.color },
						{ label: "Weight", children: item.flapPrint?.weight && `${item.flapPrint.weight} g` },
						{ label: "Print Time", children: item.flapPrint?.printTime },
						{
							label: "Date",
							children: item.flapPrint?.printDate ? <DateDisplay isoDate={item.flapPrint?.printDate} /> : null,
						},
						{
							label: "Done By",
							children: item.flapPrint?.printBy ? <UserTag userId={item.flapPrint?.printBy} /> : null,
						},
					].filter((i) => i.children),
					approval: [
						{ label: "Date", children: item.approval?.date ? <DateDisplay isoDate={item.approval?.date} /> : null },
						{ label: "Done By", children: item.approval?.printBy ? <UserTag userId={item.approval?.printBy} /> : null },
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

					{section.outerPrint?.length ? <Descriptions title="Outer Print" items={section.outerPrint} /> : null}
					{section.flapPrint?.length ? <Descriptions title="Flap Print" items={section.flapPrint} /> : null}
					{section.approval?.length ? <Descriptions title="Approval" items={section.approval} /> : null}
				</Space>
			))}
		</>
	);
};

export default App;
