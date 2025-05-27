"use client";

import React, { useState } from "react";
import { Button, Steps, Input, Select, DatePicker, Result, Form, Descriptions } from "antd";
import { SolutionOutlined, CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const PLAFlapPrint: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [FormData] = Form.useForm();
	const [Values, setValues] = useState({});

	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleNext = async () => {
		try {
			const Values = await FormData.validateFields();
			setValues(Values);
			next();
		} catch (err) {
			console.error("Validation error:", err);
		}
	};

	const handleSubmit = async () => {
		try {
			const response = await api.post(`/orders/${orderId}/pla-outer-print`, Values);
			if (response.status === 201) {
				setIsSuccess(true);
			} else {
				setIsSuccess(false);
			}
			console.log("Both requests sent successfully");
		} catch (err) {
			console.error("Validation or network error:", err);
		}
		next();
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Details" icon={<SolutionOutlined />} />
				<Steps.Step title="Confirm" icon={<PrinterOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{/* Step 1: Input Details */}
			{current === 0 && (
				<>
					<Form layout="vertical" form={FormData}>
						<Form.Item label="Color" name="color">
							<Input />
						</Form.Item>
						<Form.Item label="Weight" name="weight">
							<Input type="number" />
						</Form.Item>
						<Form.Item label="Print Machine" name="printMachine">
							<Select placeholder="Select Print Machine">
								<Select.Option value="PM 300">PM 300</Select.Option>
								<Select.Option value="Cubic M3 Max">Cubic M3 Max</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item label="Print Date" name="printDate">
							<DatePicker />
						</Form.Item>
						<Form.Item label="Print Time (min)" name="printTime">
							<Input type="number" />
						</Form.Item>
					</Form>
					<Button type="primary" onClick={handleNext} block>
						Next
					</Button>
				</>
			)}

			{/* Step 2: Confirm*/}
			{current === 1 && (
				<>
					<Descriptions bordered size="small" column={1}>
						<Descriptions.Item label="Color">{FormData.getFieldValue("color")}</Descriptions.Item>
						<Descriptions.Item label="Weight">{FormData.getFieldValue("weight")} g</Descriptions.Item>
						<Descriptions.Item label="Print Machine">{FormData.getFieldValue("printMachine")}</Descriptions.Item>
						<Descriptions.Item label="Print Date">
							{FormData.getFieldValue("printDate")?.format("YYYY-MM-DD")}
						</Descriptions.Item>
						<Descriptions.Item label="Print Time">{FormData.getFieldValue("printTime")}</Descriptions.Item>
					</Descriptions>

					<div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleSubmit}>
							Confirm
						</Button>
					</div>
				</>
			)}

			{/* Step 3: Print Status */}
			{current === 2 && (
				<>
					{isSuccess === true ? (
						<Result status="success" title="Submit Successful" />
					) : (
						<Result status="error" title="Submit Failed" subTitle="Please try again." />
					)}
				</>
			)}
		</>
	);
};

export default PLAFlapPrint;
