"use client";

import React, { useState } from "react";
import { Button, Steps, Input, DatePicker, Result, Form, Descriptions, Space } from "antd";
import { SolutionOutlined, CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import CustomDropdown from "@/app/_components/CustomDropdown";

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
			const response = await api.post(`/orders/${orderId}/peek-print`, Values);
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
						<Form.Item label="Print Machine" name="printMachine">
							<CustomDropdown type="implantPrintMachines" placeholder="Select Printing Machine" />
						</Form.Item>
						<Form.Item label="Print Date" name="printDate">
							<DatePicker />
						</Form.Item>
						<Form.Item label="Material" name="material">
							<CustomDropdown type="material" placeholder="Select print material" />
						</Form.Item>
						<Form.Item label="Batch Number" name="batchNumber">
							<Input />
						</Form.Item>
						<Form.Item label="Weight" name="weight">
							<Input type="number" min={0} addonAfter="g" />
						</Form.Item>
						<Form.Item label="Waste Weight" name="wasteWeight">
							<Input type="number" min={0} addonAfter="g" />
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
						<Descriptions.Item label="Print Machine">
							{FormData.getFieldValue("printMachine")}
						</Descriptions.Item>
						<Descriptions.Item label="Print Date">
							{FormData.getFieldValue("printDate")?.format("YYYY-MM-DD")}
						</Descriptions.Item>
						<Descriptions.Item label="Material">{FormData.getFieldValue("material")}</Descriptions.Item>
						<Descriptions.Item label="Batch Number">
							{FormData.getFieldValue("batchNumber")}
						</Descriptions.Item>
						<Descriptions.Item label="Weight">{FormData.getFieldValue("weight")} g</Descriptions.Item>
						<Descriptions.Item label="Waste Weight">
							{FormData.getFieldValue("wasteWeight")} g
						</Descriptions.Item>
					</Descriptions>

					<Space style={{ marginTop: 8 }}>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleSubmit}>
							Confirm
						</Button>
					</Space>
				</>
			)}

			{/* Step 3: Print Status */}
			{current === 2 && (
				<>
					{isSuccess === true ? (
						<Result status="success" title="PEEK Print Data Submission Successfully" />
					) : (
						<Result status="error" title="Data Submission Failed" subTitle="Please try again." />
					)}
				</>
			)}
		</>
	);
};

export default PLAFlapPrint;
