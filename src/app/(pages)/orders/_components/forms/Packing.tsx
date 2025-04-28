"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { Form, Upload, Button, Space, Steps, Typography, Result } from "antd";
import { FileImageOutlined, VideoCameraAddOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

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

		formData.append("ct-image-2d", formValues["ct-image-2d"]);
		formData.append("ct-image-2d-picture", formValues["ct-image-2d"]);
		formData.append("ct-image-3d", formValues["ct-image-2d"]);

		try {
			const response = await api.post(`/orders/${orderId}/packing`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
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
					<Steps.Step title="Upload Files" icon={<VideoCameraAddOutlined />} />
					<Steps.Step title="Confirm" icon={<FileImageOutlined />} />
					<Steps.Step title="Status" icon={<FileImageOutlined />} />
				</Steps>
				
				{current === 0 && (
					<Form onFinish={onFinish}>
						<Form.Item name="implant-image" valuePropName="fileList">
							<Upload.Dragger accept="video/*" action="/upload.do" multiple={false} maxCount={1}>
								<p className="ant-upload-drag-icon">
									<VideoCameraAddOutlined />
								</p>
								<p className="ant-upload-hint">Click or drag Video of Final Implant to this area to upload</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item name="implant-video">
							<Upload.Dragger accept="image/*" action="/upload.do" multiple={false} maxCount={1}>
								<p className="ant-upload-drag-icon">
									<FileImageOutlined />
								</p>
								<p className="ant-upload-hint">Click or drag Picture of Final Implant to this area to upload</p>
							</Upload.Dragger>
						</Form.Item>	

						<Form.Item name="packing-image" valuePropName="fileList">
							<Upload.Dragger accept="image/*" action="/upload.do" multiple={false} maxCount={1}>
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
						<Typography.Text strong>User: {formValues.userName || "Not Provided"}</Typography.Text>

						<Typography.Text strong>Date & Time: {new Date().toLocaleString()}</Typography.Text>

						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleSubmit}>
							Confirm
						</Button>
					</>
				)}

				{current === 2 && (
					<>
						{isSuccess ? (
							<Result status="success" title="Packing Detail Submission Successful" />
						) : (
							<Result status="error" title="Packing Detail Submission Failed" subTitle="Please try again." />
						)}
					</>
				)}
			</>
		</>
	);
};

export default PackingStepForm;
