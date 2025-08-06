"use client";

import React, { useState } from "react";
import { Button, Steps, Result, Form, Descriptions, message, Input } from "antd";
import { UserOutlined, CheckCircleOutlined, SolutionOutlined, UploadOutlined } from "@ant-design/icons";
import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

type FormDataType = {
  images: string[]; // array of images URLs
  implantModelA?: string;
  implantModelB?: string;
  implantModelC?: string;
  markingDate?: string;
};

const PEEKLaserMarkingProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<FormDataType>();
	const [formData, setFormData] = useState<FormDataType>({ images: [] });

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: FormDataType) => {
		setFormData(values);
		next();
	};

	const handleConfirm = async () => {
		try {
			const response = await api.post(`/orders/${orderId}/peek-qcdocs`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	const handleChange = (info: UploadChangeParam<UploadFile<{url: string}>>, fieldName: keyof FormDataType) => {
		if (info.file.status === "done") {
			const fileList = info.fileList
				.filter((file) => file.status === "done")
				.map((file) => file.response?.url)
				.filter((url): url is string => typeof url === "string");

			form.setFieldsValue({
				[fieldName]: fileList,
			});

			message.success(`${info.file.name} uploaded successfully`);

			setFormData((prev) => ({
				...prev,
				[fieldName]: fileList,
			}));
		} else if (info.file.status === "error") {
			message.error(`${info.file.name} upload failed.`);
		}
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Start" icon={<UserOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Form.Item
							key="images"
							label="images"
							name="images"
							rules={[{ required: true, message: `Please upload the images` }]}
						>
							<Upload
								customRequest={uploadToAzure}
								onChange={(info) => handleChange(info, "images")}
								listType="picture"
								maxCount={10}
								multiple={true}
							>
								<Button icon={<UploadOutlined />}>Upload Image</Button>
							</Upload>
						</Form.Item>
					</div>

					<Form.Item
						label="A"
						name="implantModelA"
						rules={[{ message: "Please enter implantModel" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="B"
						name="implantModelB"
						rules={[{ message: "Please enter implantModel" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="C"
						name="implantModelC"
						rules={[{ message: "Please enter implantModel" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>

					<Form.Item className="mt-6">
						<Button type="primary" htmlType="submit" size="large">
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
						]}
					></Descriptions>
					<>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</>
				</>
			)}

			{current === 2 && (
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
