"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Form, Input, Button, Card, Steps, Result, message, Descriptions, Upload } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface QCFormValues {
	skullDefectSpecificationA?: number;
	skullDefectSpecificationB?: number;
	skullDefectSpecificationC?: number;
	skullDefectSpecificationImage?: string;
	implantModelSpecificationA?: number;
	implantModelSpecificationB?: number;
	implantModelSpecificationC?: number;
	implantModelSpecificationImage?: string;
}

const DesignQCDocsForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<QCFormValues>();
	const [formData, setFormData] = useState<QCFormValues>({});

	const [current, setCurrent] = useState<number>(0); // Track the current step
	const [loading, setLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: QCFormValues) => {
		setFormData(values);
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

	// Handle the submission of approval or disapproval in Step 2
	const submitApproval = () => {
		if (!formData) return;

		setLoading(true);
		api.post(`orders/${orderId}/design-qcdocs`, formData)
			.then(() => {
				setLoading(false);
				setIsSuccess(true);
				message.success("Design approval successfully submitted.");
			})
			.catch(() => {
				setLoading(false);
				setIsSuccess(false);
				message.error("Error submitting approval. Please try again.");
			});
		next(); // Move to Step 3 (Success/Error)
	};

	return (
		<>
			<Steps current={current}>
				<Steps.Step title="QC Docs" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						key={"skullDefectSpecificationImage"}
						label={"skullDefectSpecificationImage"}
						name={"skullDefectSpecificationImage"}
						rules={[{ required: true, message: `Please upload ${"skullDefectSpecificationImage"}` }]}
					>
						<Upload.Dragger
							customRequest={uploadToAzure}
							multiple={false}
							maxCount={1}
							onChange={(info) => {
								handleChange(info, "skullDefectSpecificationImage");
							}}
						>
							<p className="ant-upload-drag-icon">
								<FileTextOutlined />
							</p>
							<p className="ant-upload-hint">Click or drag file to this area to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="A" name="skullDefectSpecificationA" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>
					<Form.Item label="B" name="skullDefectSpecificationB" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>
					<Form.Item label="C" name="skullDefectSpecificationC" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>

					<Form.Item
						key={"implantModelSpecificationImage"}
						label={"implantModelSpecificationImage"}
						name={"implantModelSpecificationImage"}
						rules={[{ required: true, message: `Please upload ${"implantModelSpecificationImage"}` }]}
					>
						<Upload.Dragger
							customRequest={uploadToAzure}
							multiple={false}
							maxCount={1}
							onChange={(info) => handleChange(info, "implantModelSpecificationImage")}
						>
							<p className="ant-upload-drag-icon">
								<FileTextOutlined />
							</p>
							<p className="ant-upload-hint">Click or drag file to this area to upload</p>
						</Upload.Dragger>
					</Form.Item>

					<Form.Item label="A" name="implantModelSpecificationA" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>
					<Form.Item label="B" name="implantModelSpecificationB" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>
					<Form.Item label="C" name="implantModelSpecificationC" rules={[{ message: "Please enter length" }]}>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm" />
					</Form.Item>

					<Form.Item className="mt-6">
						<Button type="primary" htmlType="submit" size="large">
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
								label: "Implant Model Specification (A)",
								children: formData.implantModelSpecificationA || "Not provided",
							},
							{
								label: "Implant Model Specification (B)",
								children: formData.implantModelSpecificationB || "Not provided",
							},
							{
								label: "Implant Model Specification (C)",
								children: formData.implantModelSpecificationC || "Not provided",
							},
							{
								label: "Skull Model Specification (A)",
								children: formData.skullDefectSpecificationA || "Not provided",
							},
							{
								label: "Skull Model Specification (B)",
								children: formData.skullDefectSpecificationB || "Not provided",
							},
							{
								label: "Skull Model Specification (C)",
								children: formData.skullDefectSpecificationC || "Not provided",
							},
						]}
					></Descriptions>
					<Card></Card>

					<Form.Item>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={submitApproval} loading={loading}>
							Submit Approval
						</Button>
					</Form.Item>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="Design Approval Submitted Successfully" />
					) : (
						<Result
							status="error"
							title="Submission Failed"
							subTitle="Please check the details and try again."
						/>
					)}
				</>
			)}
		</>
	);
};

export default DesignQCDocsForm;
