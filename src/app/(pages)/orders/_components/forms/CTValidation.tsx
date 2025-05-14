"use client";
import React, { useState } from "react";
import { Form, Input, Upload, Button, Space, Steps, Result, Descriptions, Select } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);
const apiUrl = process.env.NEXT_PUBLIC_API_URL;


const MultiStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<any>(null);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const [dateTime, setDateTime] = useState<string>("");
	const dummyUsername = "JohnDoe";

	const getCurrentDateTime = () => new Date().toLocaleString();

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: any) => {
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
			size: formData["size-sqcm"],
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

	return (
		<>
			<Steps current={current}>
				<Steps.Step title="Enter Details" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item label="CT Image 2D" name="ct-image-2d">
						<Upload.Dragger
							action={`${apiUrl}/upload`}
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
							<p className="ant-upload-text">Click or drag to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="CT Image 3D" name="ct-image-3d">
						<Upload.Dragger
							action={`${apiUrl}/upload`}
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
							<p className="ant-upload-text">Click or drag to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="Size (sqcm)" name="size-sqcm" rules={[{ required: true, message: "Please enter size" }]}>
						<Input min={1} max={1000} type="number" />
					</Form.Item>

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
							{ label: "User", children: dummyUsername },
							{ label: "Date and Time:", children: dateTime },
							{ label: "CT Image 2D:", children: dummyUsername },
							{ label: "Date and Time", children: dateTime },
							{ label: "CT Image 2D", children: formData["ct-image-2d"]?.[0]?.name || "No file uploaded" },
							{ label: "CT Image 3D", children: formData["ct-image-3d"]?.[0]?.name || "No file uploaded" },
							{ label: "Size (sqcm)", children: formData["size-sqcm"] },
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
						<Result status="error" title="Submission Failed" subTitle="Please check details and try again." />
					)}
				</>
			)}
		</>
	);
};

export default MultiStepForm;
