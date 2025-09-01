import { useEffect, useState } from "react";
import { Card, Typography, Segmented } from "antd";
import { Line } from "@ant-design/plots";

import api from "@/lib/axiosInstance";

const { Title } = Typography;

interface IData {
	weeklyStats: [];
	monthlyStats: [];
}

export default function Dashboard() {
	const [data, setData] = useState<IData>();
	const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");

	useEffect(() => {
		const fetchData = async () => {
			const response = await api.get("dashboard");
			setData(response.data);
		};
		fetchData();
	}, []);

	if (!data) return <div>Loading...</div>;

	// Transform weekly data into long format
	const weeklyData: { month: number; type: string; value: number }[] = [];
	data.weeklyStats.forEach(
		(item: { month: number; totalCases: number; pending: number; confirmed: number; completed: number }) => {
			weeklyData.push({ month: item.month, type: "Total Cases", value: item.totalCases });
			weeklyData.push({ month: item.month, type: "Pending", value: item.pending });
			weeklyData.push({ month: item.month, type: "Confirmed", value: item.confirmed });
			weeklyData.push({ month: item.month, type: "Completed", value: item.completed });
		},
	);

	const weeklyConfig = {
		data: weeklyData,
		xField: "month",
		yField: "value",
		seriesField: "type",
		colorField: "type",
		point: { size: 4, shape: "circle" },
		smooth: true,
		legend: { position: "top" as const },
	};

	const monthlyData: { month: number; type: string; value: number }[] = [];
	data.monthlyStats.forEach(
		(item: { month: number; totalCases: number; pending: number; confirmed: number; completed: number }) => {
			monthlyData.push({ month: item.month, type: "Total Cases", value: item.totalCases });
			monthlyData.push({ month: item.month, type: "Pending", value: item.pending });
			monthlyData.push({ month: item.month, type: "Confirmed", value: item.confirmed });
			monthlyData.push({ month: item.month, type: "Completed", value: item.completed });
		},
	);

	const monthlyConfig = {
		data: monthlyData,
		xField: "month",
		yField: "value",
		seriesField: "type",
		colorField: "type",
		point: { size: 4, shape: "circle" },
		smooth: true,
		legend: { position: "top" as const },
	};

	return (
		<>
			{/* View Toggle */}
			<div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Title level={4} style={{ margin: 0 }}>
					{viewType === "weekly" ? "Weekly Cases" : "Monthly Cases"}
				</Title>
				<Segmented
					value={viewType}
					onChange={(value) => setViewType(value as "weekly" | "monthly")}
					options={[
						{ label: "Weekly", value: "weekly" },
						{ label: "Monthly", value: "monthly" },
					]}
				/>
			</div>

			{/* Chart Card */}
			<Card>
				<Line {...(viewType === "weekly" ? weeklyConfig : monthlyConfig)} />
			</Card>
		</>
	);
}
