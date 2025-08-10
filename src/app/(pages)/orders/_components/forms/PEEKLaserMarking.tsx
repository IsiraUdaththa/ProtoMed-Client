"use client";

import React, { useState } from "react";
import { Button, Steps, Result, Form, message } from "antd";
import { UserOutlined, CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";
import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface IFormData {
	image?: string;
	createdAt?: Date;
}

const PEEKLaserMarkingProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);

	const handleConfirm = async (values: IFormData) => {
		try {
			setFormData(values);
			const response = await api.post(`/orders/${orderId}/peek-laser-marking`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

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

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Start" icon={<UserOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleConfirm} layout="vertical">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Form.Item
							key="image"
							label="image"
							name="image"
							rules={[{ required: true, message: `Please upload the image` }]}
						>
							<Upload
								customRequest={uploadToAzure}
								onChange={(info) => handleChange(info, "image")}
								listType="picture"
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Upload Image</Button>
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
				<>
					{isSuccess ? (
						<Result status="success" title="PEEK Laser Marking Process Confirmed Successfully" />
					) : (
						<Result
							status="error"
							title="PEEK Laser Marking Process Submission Failed"
							subTitle="Please try again."
						/>
					)}
				</>
			)}
		</>
	);
};

export default PEEKLaserMarkingProcess;
