"use client";

import React, { useState } from "react";
import { Button, Upload, message, Steps, Result, Form, Card, Space, Typography, UploadFile } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined, UploadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import { UploadChangeParam } from "antd/es/upload";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"];

interface IFormData {
	designFile?: string;
}

const DesignFileForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleChange = (info: UploadChangeParam<UploadFile<{ url: string }>>, fieldName: string) => {
		if (info.file.status === "done") {
			const fileUrl = info.file.response?.url;
			if (fileUrl) {
				form.setFieldsValue({
					[fieldName]: fileUrl,
				});
				message.success(`${info.file.name} uploaded successfully`);

				// Update form data state
				setFormData({
					...formData,
					[fieldName]: fileUrl,
				});
			}
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} upload failed.`);
		}
	};

	const handleSubmit = (values: IFormData) => {
		setFormData(values);
		next();
	};

	const handleConfirm = async () => {
		try {
			const response = await api.post(`/orders/${orderId}/design-file`, formData);
			console.log("Files uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	return (
		<div className="p-6">
			<Steps current={current} direction="horizontal" className="mb-8">
				<Steps.Step title="Upload Files" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Form.Item
							key="designFile"
							label="Design File"
							name="designFile"
							rules={[{ required: true, message: `Please upload Design File` }]}
						>
							<Upload
								action={`${apiUrl}/upload`}
								onChange={(info) => handleChange(info, "designFile")}
								listType="picture"
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Upload Design File</Button>
							</Upload>
						</Form.Item>
					</div>

					<Form.Item className="mt-6">
						<Button type="primary" htmlType="submit" size="large">
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
				<Card className="mt-4">
					<Typography.Title level={4}>Confirm Uploads</Typography.Title>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
						<div key="designFile" className="mb-2">
							<Typography.Text strong>Design File:</Typography.Text>{" "}
							{formData["designFile"] ? "Uploaded" : "Not uploaded"}
						</div>
					</div>
					<Space className="mt-4">
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</Space>
				</Card>
			)}

			{current === 2 && (
				<Card className="mt-4">
					{isSuccess ? (
						<Result
							status="success"
							title="All Files Uploaded Successfully"
							subTitle="Your design files have been submitted."
						/>
					) : (
						<Result status="error" title="Upload Failed" subTitle="Please try again or contact support." />
					)}
				</Card>
			)}
		</div>
	);
};

export default DesignFileForm;
