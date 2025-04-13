"use client";

import React, { useState } from "react";
import { Form, Upload, Button, Space, Steps, Card, Typography, Result } from "antd";
import { FileImageOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Step } = Steps;
const { Text } = Typography;

const normFile = (e: any) => {
	console.log("Upload event:", e);
	if (Array.isArray(e)) {
		return e;
	}
	return e?.fileList;
};

const PackingStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [formValues, setFormValues] = useState<any>({});
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const onFinish = (values: any) => {
		setFormValues(values);
		next();
	};

	const handleSubmit = async () => {
		const formData = new FormData();

		try {
			const response = await api.post(`/orders/${orderId}/payment-advance`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.log(error);
			setIsSuccess(false);
		}
		next();
	};

	return (
		<>
			<>
				<Steps current={current} onChange={setCurrent}>
					<Step title="Upload Files" icon={<VideoCameraAddOutlined />} />
					<Step title="Confirm" icon={<FileImageOutlined />} />
					<Step title="Status" icon={<FileImageOutlined />} />
				</Steps>

				{current === 0 && (
					<Form
						name="uploadForm"
						onFinish={onFinish}
						initialValues={{
							"input-number": 3,
						}}
					>
						<Form.Item name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
							<Upload.Dragger name="ct-image-2d" action="/upload.do" multiple={false}>
								<p className="ant-upload-drag-icon">
									<VideoCameraAddOutlined />
								</p>
								<p className="ant-upload-hint">Click or drag Video of Final Implant to this area to upload</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item name="ct-image-2d-picture" valuePropName="fileList" getValueFromEvent={normFile}>
							<Upload.Dragger name="ct-image-2d-picture" action="/upload.do" multiple={false}>
								<p className="ant-upload-drag-icon">
									<FileImageOutlined />
								</p>
								<p className="ant-upload-hint">Click or drag Picture of Final Implant to this area to upload</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
							<Upload.Dragger name="ct-image-3d" action="/upload.do" multiple={false}>
								<p className="ant-upload-drag-icon">
									<FileImageOutlined />
								</p>
								<p className="ant-upload-hint">Click or drag Picture of Packaging to this area to upload</p>
							</Upload.Dragger>
						</Form.Item>
						<Form.Item>
							<Space>
								<Button type="primary" htmlType="submit">
									Next
								</Button>
							</Space>
						</Form.Item>
					</Form>
				)}

				{current === 1 && (
					<>
						<Text strong>User: {formValues?.userName || "Not Provided"}</Text>

						<Text strong>Date & Time: {new Date().toLocaleString()}</Text>

						{/* <> */}
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleSubmit}>
							Confirm
						</Button>
					</>
					// </>
				)}

				{current === 2 && (
					<>
						{isSuccess ? (
							<Result status="success" title="Implant Confirmation Successful" />
						) : (
							<Result status="error" title="Implant Submission Failed" subTitle="Please try again." />
						)}
					</>
				)}
			</>
		</>
	);
};

export default PackingStepForm;
