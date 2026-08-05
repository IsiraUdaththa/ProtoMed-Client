"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Button, Upload, message, Steps, Result, Form, Card, UploadFile, Flex, Image } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

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

	// List of all required image fields
	const imageFields1: { name: ImageFieldName; label: string }[] = [
		{ name: "damageFront", label: "Damage Front" },
		{ name: "damageSide", label: "Damage Side" },
		{ name: "damageTop", label: "Damage Top" },
		{ name: "damageBack", label: "Damage Back" },
	];
	const imageFields2: { name: ImageFieldName; label: string }[] = [
		{ name: "designFront", label: "Design Front" },
		{ name: "designSide", label: "Design Side" },
		{ name: "designTop", label: "Design Top" },
		{ name: "designBack", label: "Design Back" },
	];
	const imageFields3: { name: ImageFieldName; label: string }[] = [
		{ name: "damageFrontWithSoftTissues", label: "Damage Front With Soft Tissues (Isometric)" },
		{ name: "damageSideWithSoftTissues", label: "Damage Side With Soft Tissues (Isometric)" },
		{ name: "designFrontWithSoftTissues", label: "Design Front With Soft Tissues (Isometric)" },
		{ name: "designSideWithSoftTissues", label: "Design Side With Soft Tissues (Isometric)" },
	];
	const imageFields4: { name: ImageFieldName; label: string }[] = [
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

	const handleConfirm = async (values: DesignImageFormValues) => {
		try {
			setFormData(values);
			const response = await api.post(`/orders/${orderId}/design-images`, formData);
			console.log("Files uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	const uploadButton = (label: string) => (
		<button style={{ border: 0, background: "none" }} type="button">
			{/* {loading ? <LoadingOutlined /> : <PlusOutlined />} */}
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>{label}</div>
		</button>
	);

	return (
		<div className="p-6">
			<Steps current={current} direction="horizontal" className="mb-8">
				<Steps.Step title="Upload Files" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleConfirm} layout="vertical">
					{[imageFields1, imageFields2, imageFields3, imageFields4].map((row) => (
						<>
							<Flex wrap gap={"large"} justify="space-around">
								{row.map((field) => (
									<Form.Item
										key={field.name}
										// label={field.label}
										name={field.name}
										rules={[{ required: true, message: `Please upload the Image` }]}
									>
										<Upload
											customRequest={uploadToAzure}
											onChange={(info) => handleChange(info, field.name)}
											listType="picture-card"
											maxCount={1}
											showUploadList={false}
											style={{ height: "250px", width: "250px" }}
										>
											{formData[field.name] ? (
												<Image
													src={formData[field.name] as string}
													alt="avatar"
													style={{ width: "100%" }}
												/>
											) : (
												uploadButton(field.label)
											)}
										</Upload>
									</Form.Item>
								))}
							</Flex>
						</>
					))}

					<Form.Item className="mt-6">
						<Button type="primary" htmlType="submit" size="large">
							Next
						</Button>
					</Form.Item>
				</Form>
			)}
			{current === 1 && (
				<Card className="mt-4">
					{isSuccess ? (
						<Result
							status="success"
							title="All Images Uploaded Successfully"
							subTitle="Your design images have been submitted."
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
