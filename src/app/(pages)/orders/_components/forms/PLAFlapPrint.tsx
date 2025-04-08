"use client";

import React, { useState } from "react";
import { Button, Typography, Card, Steps, Input, Select, DatePicker, TimePicker, Result } from "antd";
import { SolutionOutlined, CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

const PLAFlapPrint: React.FC<{ orderId: string }> = ({ orderId }) => {

	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState({
		color: "",
		weight: "",
		printMachine: "",
		printTime: "",
	});
	const [printStatus, setPrintStatus] = useState<"success" | "error" | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handlePrint = async () => {
		console.log("Processing Print...");
		try {
			const response = await api.post(`/orders/${orderId}/pla-flap-print`, formData);
			console.log("File uploaded successfully:", response.data);
			setPrintStatus("success");
		} catch (error) {
			console.error("Print failed:", error);
			setPrintStatus("error");
		}
		next();
	};

	return (
		<Card title="PLA Flap Print Process" style={{ textAlign: "left", maxWidth: 600, margin: "auto" }}>
			<Steps current={current} direction="horizontal">
				<Step title="Details" icon={<SolutionOutlined />} />
				<Step title="Confirm & Print" icon={<PrinterOutlined />} />
				<Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{/* Step 1: Input Details */}
			{current === 0 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Print Details</Title>
					<Input
						placeholder="Color"
						onChange={(e) => setFormData({ ...formData, color: e.target.value })}
						style={{ marginBottom: 10 }}
					/>
					<Input
						placeholder="Weight"
						onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
						style={{ marginBottom: 10 }}
					/>
					<Select
						placeholder="Select Print Machine"
						onChange={(value) => setFormData({ ...formData, printMachine: value })}
						style={{ width: "100%", marginBottom: 10 }}
					>
						<Option value="Machine A">Machine A</Option>
						<Option value="Machine B">Machine B</Option>
					</Select>
					<DatePicker
						style={{ width: "100%", marginBottom: 10 }}
						onChange={(date, dateString) =>
							setFormData({ ...formData, printTime: typeof dateString === "string" ? dateString : "" })
						}
					/>
					<TimePicker
						style={{ width: "100%" }}
						onChange={(time, timeString) =>
							setFormData({ ...formData, printTime: Array.isArray(timeString) ? timeString.join(", ") : timeString })
						}
					/>
					<div style={{ marginTop: 20 }}>
						<Button type="primary" onClick={next}>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Step 2: Confirm & Print */}
			{current === 1 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm & Print</Title>
					<Text>
						<strong>Color:</strong> {formData.color}
					</Text>
					<br />
					<Text>
						<strong>Weight:</strong> {formData.weight}
					</Text>
					<br />
					<Text>
						<strong>Print Machine:</strong> {formData.printMachine}
					</Text>
					<br />
					<Text>
						<strong>Print Time:</strong> {formData.printTime}
					</Text>
					<div style={{ marginTop: 20 }}>
						<Button onClick={prev} style={{ marginRight: 10 }}>
							Back
						</Button>
						<Button type="primary" onClick={handlePrint}>
							Print
						</Button>
					</div>
				</div>
			)}

			{/* Step 3: Print Status */}
			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{printStatus === "success" ? (
						<Result status="success" title="Print Successful" />
					) : (
						<Result status="error" title="Print Failed" subTitle="Please try again." />
					)}
				</div>
			)}
		</Card>
	);
}

export default PLAFlapPrint;