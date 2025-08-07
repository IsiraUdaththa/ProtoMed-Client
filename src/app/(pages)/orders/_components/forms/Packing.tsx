"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { Form, Upload, Button, Space, Steps, Typography, Result, message } from "antd";
import { FileImageOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface IFormData {
	"implantVideo"?: string;
	"implantImage"?: string;
	"packedImage"?: string;
}

const PackingStepForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const onFinish = (values: IFormData) => {
		setFormData(values);
		next();
	};

	const handleSubmit = async () => {
		if (!formData) return;

		try {
			const response = await api.post(`/orders/${orderId}/packing`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
			message.success("File uploaded successfully.");
		} catch (error) {
			console.error("Upload failed:", error);
			setIsSuccess(false);
			message.error("Error uploading file. Please try again.");
		} finally {
			next();
		}
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
					<Form form={form} onFinish={onFinish}>
						<Form.Item name="implantVideo">
							<Upload.Dragger
								customRequest={uploadToAzure}
								accept="video/*"
								multiple={false}
								maxCount={1}
								onChange={(info) => {
									if (info.file.status === "done") {
										const fileUrl = info.file.response?.url;
										if (fileUrl) {
											form.setFieldsValue({
												"implantVideo": fileUrl,
											});
										}
									}
								}}
							>
								<p className="ant-upload-drag-icon">
									<VideoCameraAddOutlined />
								</p>
								<p className="ant-upload-hint">Upload Implant Video</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item name="implantImage">
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
												"implantImage": fileUrl,
											});
										}
									}
								}}
							>
								<p className="ant-upload-drag-icon">
									<VideoCameraAddOutlined />
								</p>
								<p className="ant-upload-hint">Upload Implant Image</p>
							</Upload.Dragger>
						</Form.Item>

						<Form.Item name="packedImage">
							<Upload.Dragger
								accept="image/*"
								customRequest={uploadToAzure}
								multiple={false}
								maxCount={1}
								onChange={(info) => {
									if (info.file.status === "done") {
										const fileUrl = info.file.response?.url;
										if (fileUrl) {
											form.setFieldsValue({
												"packedImage": fileUrl,
											});
										}
									}
								}}
							>
								<p className="ant-upload-drag-icon">
									<FileImageOutlined />
								</p>
								<p className="ant-upload-hint">Upload Packaged Implant Image</p>
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
						{/* TODO:  */}
						{/* <Typography.Text strong>User: {formData.userName || "Not Provided"}</Typography.Text> */}

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
							<Result
								status="error"
								title="Packing Detail Submission Failed"
								subTitle="Please try again."
							/>
						)}
					</>
				)}
			</>
		</>
	);
};

export default PackingStepForm;
