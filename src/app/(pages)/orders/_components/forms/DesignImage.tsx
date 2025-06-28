"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Upload, message, Steps, Result, Form, Card, Space, Typography, UploadFile } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined, UploadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import { UploadChangeParam } from "antd/es/upload";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"];

type ImageFieldName =
	| "damageFront"
	| "damageSide"
	| "damageTop"
	| "damageBack"
	| "designFront"
	| "designSide"
	| "designTop"
	| "designBack"
	| "damageFrontWithSoftTissues"
	| "damageSideWithSoftTissues"
	| "designFrontWithSoftTissues"
	| "designSideWithSoftTissues"
	| "designWithDimensions";

type DesignImageFormValues = {
	[key in ImageFieldName]: string;
};

const DesignImageForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<DesignImageFormValues>();
	const [formData, setFormData] = useState<Partial<DesignImageFormValues>>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// List of all required image fields
	const imageFields: { name: ImageFieldName; label: string }[] = [
		{ name: "damageFront", label: "Damage Front" },
		{ name: "damageSide", label: "Damage Side" },
		{ name: "damageTop", label: "Damage Top" },
		{ name: "damageBack", label: "Damage Back" },
		{ name: "designFront", label: "Design Front" },
		{ name: "designSide", label: "Design Side" },
		{ name: "designTop", label: "Design Top" },
		{ name: "designBack", label: "Design Back" },
		{ name: "damageFrontWithSoftTissues", label: "Damage Front With Soft Tissues (Isometric)" },
		{ name: "damageSideWithSoftTissues", label: "Damage Side With Soft Tissues (Isometric)" },
		{ name: "designFrontWithSoftTissues", label: "Design Front With Soft Tissues (Isometric)" },
		{ name: "designSideWithSoftTissues", label: "Design Side With Soft Tissues (Isometric)" },
		{ name: "designWithDimensions", label: "Design With Dimensions" },
	];

	const handleChange = (info: UploadChangeParam<UploadFile<{ url: string }>>, fieldName: ImageFieldName) => {
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

	const handleSubmit = (values: DesignImageFormValues) => {
		setFormData(values);
		next();
	};

	const handleConfirm = async () => {
		try {
			const response = await api.post(`/orders/${orderId}/design-images`, formData);
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
						{imageFields.map((field) => (
							<Form.Item
								key={field.name}
								label={field.label}
								name={field.name}
								rules={[{ required: true, message: `Please upload ${field.label}` }]}
							>
								<Upload
									action={`${apiUrl}/upload`}
									onChange={(info) => handleChange(info, field.name)}
									listType="picture"
									maxCount={1}
								>
									<Button icon={<UploadOutlined />}>Upload {field.label}</Button>
								</Upload>
							</Form.Item>
						))}
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
						{imageFields.map((field) => (
							<div key={field.name} className="mb-2">
								<Typography.Text strong>{field.label}:</Typography.Text>{" "}
								{formData[field.name] ? "Uploaded" : "Not uploaded"}
							</div>
						))}
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

export default DesignImageForm;
