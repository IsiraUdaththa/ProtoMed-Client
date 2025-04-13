"use client";
import React, { useState } from "react";
import { Form, InputNumber, Input, Upload, Button, Space, Steps, Typography, Result, Card } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Step } = Steps;
const { Text } = Typography;

const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

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

		const submissionData = new FormData();
		submissionData.append("orderId", orderId);
		submissionData.append("username", dummyUsername);
		submissionData.append("dateTime", dateTime);
		submissionData.append("size", formData["size-sqcm"]);
		submissionData.append("implantName", formData["implant-name"]);
		submissionData.append("implantSize", formData["implant-size"]);

		if (formData["ct-image-2d"]?.[0]?.originFileObj) {
			submissionData.append("ctImage2D", formData["ct-image-2d"][0].originFileObj);
		}
		if (formData["ct-image-3d"]?.[0]?.originFileObj) {
			submissionData.append("ctImage3D", formData["ct-image-3d"][0].originFileObj);
		}

		try {
			const response = await api.post(`/orders/${orderId}/ct-validation`, submissionData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

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
				<Step title="Enter Details" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item label="CT Image 2D" name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
						<Upload.Dragger name="ct-image-2d" beforeUpload={() => false}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="CT Image 3D" name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
						<Upload.Dragger name="ct-image-3d" beforeUpload={() => false}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Click or drag to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="Size (sqcm)" name="size-sqcm" rules={[{ required: true, message: "Please enter size" }]}>
						<InputNumber min={1} max={1000} />
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
						<Input />
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
					<Text>
						<strong>Username:</strong> {dummyUsername}
					</Text>

					<Text>
						<strong>Date and Time:</strong> {dateTime}
					</Text>

					<Text>
						<strong>CT Image 2D:</strong> {formData["ct-image-2d"]?.[0]?.name || "No file uploaded"}
					</Text>

					<Text>
						<strong>CT Image 3D:</strong> {formData["ct-image-3d"]?.[0]?.name || "No file uploaded"}
					</Text>

					<Text>
						<strong>Size (sqcm):</strong> {formData["size-sqcm"]}
					</Text>

					<Text>
						<strong>Implant Name:</strong> {formData["implant-name"]}
					</Text>

					<Text>
						<strong>Size of Implant:</strong> {formData["implant-size"]}
					</Text>

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
