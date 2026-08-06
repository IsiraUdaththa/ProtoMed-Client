import { useEffect, useState } from "react";
import { Card, message, Spin, Steps } from "antd";
import {
	EditOutlined,
	SketchOutlined,
	PrinterOutlined,
	ExperimentOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";

import StatCards from "./StatCards";

import api from "@/lib/axiosInstance";

interface Order {
	status: string;
	count: number;
}

const OrderManagement = () => {
	const [data, setData] = useState<Order[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// Categories with icons
	const categories = [
		{
			title: "Initial Orders",
			icon: <EditOutlined />,
			steps: ["draft", "scanUpload", "scanValidation", "quotation", "advancePayment"],
		},
		{
			title: "Design",
			icon: <SketchOutlined />,
			steps: ["designImages", "designQCDocs", "designFile", "internalApproval"],
		},
		{
			title: "Printing",
			icon: <PrinterOutlined />,
			steps: ["outerPrint", "flapPrint", "plaQCDocs", "plasticApproval"],
		},
		{
			title: "Implant & Polishing",
			icon: <ExperimentOutlined />,
			steps: [
				"implantPrint",
				"annealing",
				"roughPolishing",
				"peekQCDocs",
				"implantApproval",
				"laserMarking",
				"finalPolishing",
			],
		},
		{
			title: "Finalization",
			icon: <CheckCircleOutlined />,
			steps: ["packing", "finalPayment", "invoice", "completed"],
		},
	];

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await api.get("orders/statusCounts");
			const allOrders: Order[] = response.data;
			setData(allOrders);
		} catch (error) {
			console.error(error);
			message.error("Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	// Convert data array to dictionary for fast lookup
	const dataMap = data.reduce(
		(acc, curr) => {
			acc[curr.status] = curr.count;
			return acc;
		},
		{} as Record<string, number>,
	);

	// inside OrderManagement
	const totalCases = data.reduce((sum, o) => sum + o.count, 0);
	const pending = categories
		.flatMap((cat) => cat.steps)
		.filter(
			(step) =>
				step !== "advancePayment" && step !== "finalPayment" && step !== "completed" && step !== "invoice",
		)
		.reduce((sum, step) => sum + (dataMap[step] || 0), 0);

	const confirmed = categories
		.flatMap((cat) => cat.steps)
		.filter((step) => ["advancePayment", "designImages", "outerPrint", "implantPrint", "packing"].includes(step))
		.reduce((sum, step) => sum + (dataMap[step] || 0), 0);

	const completed = dataMap["completed"] || 0;

	return (
		<Spin spinning={loading}>
			<StatCards totalCases={totalCases} pending={pending} confirmed={confirmed} completed={completed} />

			<Card style={{ marginTop: 24 }}>
				<Steps
					current={6} // dynamic if needed
					items={categories.map((cat) => ({
						title: cat.title,
						icon: cat.icon,
						description: (
							<ul style={{ paddingLeft: 16, margin: 0 }}>
								{cat.steps.map((step) => (
									<li key={step}>
										{step}: {dataMap[step] || 0}
									</li>
								))}
							</ul>
						),
					}))}
				/>
			</Card>
		</Spin>
	);
};

export default OrderManagement;
