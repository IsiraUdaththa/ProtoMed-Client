"use client";

import React, { useState } from "react";
import { Button, Upload, message, Steps, Result, Form, Card, UploadFile } from "antd";
import { FileTextOutlined, SmileOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface IFormData {
	designFile?: string;
}

const DesignFileForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);

	const handleChange = (info: UploadChangeParam<UploadFile<{ url: string }>>, fieldName: string) => {
		if (info.file.status === "done") {
			const fileUrl = info.file.response?.url || info.file.url;
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

	const handleConfirm = async (values: IFormData) => {
		try {
			setFormData(values);
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
				{/* <Steps.Step title="Confirm" icon={<SolutionOutlined />} /> */}
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleConfirm} layout="vertical">
					<Form.Item
						key="designFile"
						label="Design File"
						name="designFile"
						rules={[{ required: true, message: `Please upload Design File` }]}
					>
						<Upload
							customRequest={uploadToAzure}
							onChange={(info) => handleChange(info, "designFile")}
							listType="picture"
							maxCount={5}
							accept=".stl,.cly"

						>
							<Button icon={<UploadOutlined />}>Upload Design File</Button>
						</Upload>
					</Form.Item>

					<Form.Item style={{ marginTop: 8 }}>
						<Button type="primary" htmlType="submit" size="large">
							Submit
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
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
