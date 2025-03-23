"use client";
import React, { useState } from "react";
import { Form, InputNumber, Input, Upload, Button, Space, Steps, Typography, Result, Flex, Card } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Text } = Typography;

const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

const MultiStepForm: React.FC = () => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<any>(null);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const [dateTime, setDateTime] = useState<string>(""); // State to store date/time
	const dummyUsername = "JohnDoe"; // Dummy username

	// Get the current date and time
	const getCurrentDateTime = () => {
		const currentDate = new Date();
		return currentDate.toLocaleString(); // Format the date and time
	};

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle form submission
	const handleSubmit = (values: any) => {
		setFormData(values);
		setDateTime(getCurrentDateTime()); // Set the current date/time
		next(); // Move to confirmation step
	};

	// Handle confirmation step (just sets success or failure)
	const handleConfirm = () => {
		console.log("Data confirmed:", formData);
		setIsSuccess(true); // Simulate success
		next(); // Move to success/error step
	};

	return (
		<Card style={{ maxWidth: 600, margin: "0 auto", paddingTop: "30px" }}>
			<Steps current={current} style={{ width: "100%", maxWidth: 500 }}>
				<Step title="Enter Details" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical" style={{ width: "100%", maxWidth: 500 }}>
					
			<Form.Item label="CT Image 2D" name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-2d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag CT Image 2D file to this area to upload</p>
					<p className="ant-upload-hint">Only one image file supported.</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item label="CT Image 3D" name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-3d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag CT Image 3D file to this area to upload</p>
					<p className="ant-upload-hint">Only one image file supported.</p>
				</Upload.Dragger>
			</Form.Item>
					<Form.Item label="Size (sqcm)" name="size-sqcm" rules={[{ required: true, message: "Please enter size" }]}>
						<InputNumber min={1} max={1000} style={{ width: "100%" }} />
					</Form.Item>

					<Form.Item label="Implant Name" name="implant-name" rules={[{ required: true, message: "Please enter name" }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Size of Implant" name="implant-size" rules={[{ required: true, message: "Please enter size" }]}>
						<Input />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">Next</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && formData && (
				<>
					<Text><strong>Username:</strong> {dummyUsername}</Text><br />
					<Text><strong>Date and Time:</strong> {dateTime}</Text><br />
					<Text><strong>CT Image 2D:</strong> {formData["ct-image-2d"]?.[0]?.name || "No file uploaded"}</Text><br />
					<Text><strong>CT Image 3D:</strong> {formData["ct-image-3d"]?.[0]?.name || "No file uploaded"}</Text><br />
					<Text><strong>Size (sqcm):</strong> {formData["size-sqcm"]}</Text><br />
					<Text><strong>Implant Name:</strong> {formData["implant-name"]}</Text><br />
					<Text><strong>Size of Implant:</strong> {formData["implant-size"]}</Text><br />

					<Space>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>Confirm</Button>
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
		</Card>
	);
};

export default MultiStepForm;
