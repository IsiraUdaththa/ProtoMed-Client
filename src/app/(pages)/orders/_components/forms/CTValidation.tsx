"use client";
import React, { useState } from "react";
import { Form, Input, Upload, Button, Space, Steps, Result, Descriptions, Select, Tooltip, Flex } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface IFormData {
	width: number;
	length: number;
	"size-sqcm"?: string;
	"implant-name"?: string;
	"implant-size"?: string;
	"ct-image-2d"?: string;
	"ct-image-3d"?: string;
}

const MultiStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({
		length: 0,
		width: 0,
	});
	const length = Form.useWatch("length", form);
	const width = Form.useWatch("width", form);
	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const [dateTime, setDateTime] = useState<string>("");
	const dummyUsername = "JohnDoe";

	const getCurrentDateTime = () => new Date().toLocaleString();

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: IFormData) => {
		setFormData(values);
		setDateTime(getCurrentDateTime());
		next();
	};

	const handleConfirm = async () => {
		if (!orderId) {
			console.error("Order ID is missing!");
			setIsSuccess(false);
			next();
			return;
		}

		const submissionData = {
			orderId: orderId,
			username: dummyUsername,
			dateTime: dateTime,
			size: formData["size-sqcm"] || formData["width"] * formData["length"],
			implantName: formData["implant-name"],
			implantSize: formData["implant-size"],
			ctImage2D: formData["ct-image-2d"],
			ctImage3D: formData["ct-image-3d"],
		};

		try {
			const response = await api.post(`/orders/${orderId}/ct-validation`, submissionData);

			if (response.status !== 200) throw new Error("Failed to submit data");

			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}

		next();
	};

	const handleFormChange = (changedValues: { length?: number; width?: number; "size-sqcm"?: number }) => {
		const { length, width } = changedValues;
		if (length && width) {
			const size = (length * width).toFixed(2);
			form.setFieldsValue({
				"size-sqcm": size,
			});
		}
	};

	return (
		<>
			<Steps current={current}>
				<Steps.Step title="Enter Details" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical" onValuesChange={handleFormChange}>
					<Flex justify='space-around' gap="large" align='center' wrap>
					<Form.Item label="CT Image 2D" name="ct-image-2d">
						<Upload.Dragger
							customRequest={uploadToAzure}
							accept="image/*"
							multiple={false}
							maxCount={1}
							onChange={(info) => {
								if (info.file.status === "done") {
									const fileUrl = info.file.response?.url;
									if (fileUrl) {
										form.setFieldsValue({
											"ct-image-2d": fileUrl,
										});
									}
								}
							}}
						>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">Only one file is allowed.</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="CT Image 3D" name="ct-image-3d">
						<Upload.Dragger
							customRequest={uploadToAzure}
							accept="image/*"
							multiple={false}
							maxCount={1}
							onChange={(info) => {
								if (info.file.status === "done") {
									const fileUrl = info.file.response?.url;
									if (fileUrl) {
										form.setFieldsValue({
											"ct-image-3d": fileUrl,
										});
									}
								}
							}}
						>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag file to this area to upload</p>
							<p className="ant-upload-hint">Only one file is allowed.</p>
						</Upload.Dragger>
					</Form.Item>
					</Flex>
					<div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
						<Form.Item label="Length" name="length" rules={[{ message: "Please enter length" }]}>
							<Input type="number" min={1} max={100} step={0.01} addonAfter="cm" />
						</Form.Item>

						<span>x</span>

						<Form.Item label="Width" name="width" rules={[{ message: "Please enter width" }]}>
							<Input type="number" min={0} max={100} step={0.01} addonAfter="cm" />
						</Form.Item>

						<span>=</span>

						<Form.Item label="Area" name="size-sqcm" rules={[{ message: "Please enter size" }]}>
							<Tooltip title="This value is auto-calculated. You can click to change it if needed.">
								<Input
									min={1}
									max={10000}
									type="number"
									addonAfter="cm²"
									placeholder={String((width || 0) * (length || 0))}
									status="warning"
								/>
							</Tooltip>
						</Form.Item>
					</div>
					<Form.Item
						label="Implant Name"
						name="implant-name"
						rules={[{ required: true, message: "Please enter name" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Size of Implant"
						name="implant-size"
						rules={[{ required: true, message: "Please enter size" }]}
					>
						<Select>
							{["S", "M", "L", "XL"].map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && formData && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{
								label: "CT Image 2D",
								children: formData["ct-image-2d"] || "No file uploaded",
							},
							{
								label: "CT Image 3D",
								children: formData["ct-image-3d"] || "No file uploaded",
							},
							{
								label: "Size (sqcm)",
								children: formData["size-sqcm"] || formData["length"] * formData["width"],
							},
							{ label: "Implant Name", children: formData["implant-name"] },
							{ label: "Size of Implant", children: formData["implant-size"] },
						]}
					></Descriptions>

					<Space>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</Space>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="Data Submitted Successfully" />
					) : (
						<Result
							status="error"
							title="Submission Failed"
							subTitle="Please check details and try again."
						/>
					)}
				</>
			)}
		</>
	);
};

export default MultiStepForm;
