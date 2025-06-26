"use client";

import React, { useState, useEffect } from "react";
import { Button, Steps, Result, Form, Descriptions, message } from "antd";
import { UserOutlined, CheckCircleOutlined, SolutionOutlined, UploadOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import Upload, { UploadChangeParam, UploadFile } from "antd/es/upload";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const PEEKLaserMarkingProcess: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [formData, setFormData] = useState<{ [key: string]: string }>({});

	const [current, setCurrent] = useState(0);
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		setTimeout(() => setUserName("John Doe"), 1000);
		const interval = setInterval(() => {
			setDateTime(new Date().toLocaleString());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: any) => {
		setFormData(values);
		next();
	};

	const handleConfirm = async () => {
		console.log(`Submitting PEEK Laser Marking Process:`, { userName, dateTime });

		formData["markingDate"] = dateTime;

		try {
			const response = await api.post(`/orders/${orderId}/peek-laser-marking`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	const handleChange = (info: UploadChangeParam<UploadFile<any>>, fieldName: string) => {
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
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<CheckCircleOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Form.Item
							key="image"
							label="image"
							name="image"
							rules={[{ required: true, message: `Please upload the image` }]}
						>
							<Upload
								action={`${apiUrl}/upload`}
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
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "User", children: userName },
							{ label: "Date and Time:", children: dateTime },
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
