"use client";

import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Steps, Result, Descriptions, Space, Upload } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import api from "@/lib/axiosInstance";
import uploadToAzure from "@/services/azure.service";

interface IFormData {
	ctScanLink?: string;
	ctNumber?: string;
	ctDate?: Date;
	comment?: string;
}

const CTScanForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<IFormData>({});
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const [isUploaded, setIsUploaded] = useState(false);
	const [manualEntry, setManualEntry] = useState(false);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: IFormData) => {
		setFormData(values);
		next(); // Move to confirmation step
	};

	const handleConfirm = async () => {
		if (!orderId) {
			console.error("Order ID is missing!");
			setIsSuccess(false);
			next();
			return;
		}

		console.log("Submitting Data:", formData);

		try {
			const response = await api.post(`orders/${orderId}/ct-scan`, {
				ctScanLink: formData.ctScanLink,
				ctNumber: formData.ctNumber,
				ctDate: formData.ctDate?.toISOString(), // Convert date to ISO string
				comment: formData.comment,
			});

			if (response.status !== 200) {
				throw new Error("Failed to submit data");
			}

			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}

		next(); // Move to success/error step
	};

	return (
		<>
			<Steps current={current}>
				<Steps.Step title="Enter Details" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical">
					<Form.Item
						label="CT Scan Link/DVD Number"
						name="ctScanLink"
						rules={[{ required: true, message: "Please enter CT scan link/DVD number" }]}
					>
						<Upload.Dragger
							customRequest={uploadToAzure}
							disabled={manualEntry}
							multiple={false}
							maxCount={1}
							onChange={(info) => {
								if (info.file.status === "done") {
									const fileUrl = info.file.response?.url;
									if (fileUrl) {
										form.setFieldsValue({
											ctScanLink: fileUrl,
										});
									}
									setIsUploaded(true);
									setManualEntry(false);
								} else if (info.file.status === "removed") {
									setIsUploaded(false);
									setManualEntry(true);
								}
							}}
						>
							<p className="ant-upload-drag-icon">
								<FileTextOutlined />
							</p>
							<p className="ant-upload-text">Click or drag a file to this area to upload</p>
							<p className="ant-upload-hint">
								You can either upload a single file or paste a link into the text box.
							</p>
						</Upload.Dragger>
						<Input
							disabled={isUploaded}
							value={form.getFieldValue("ctScanLink")}
							onChange={(e) => {
								setManualEntry(e.target.value !== "");
							}}
							onBlur={(e) => {
								form.setFieldsValue({ ctScanLink: e.target.value });
							}}
						/>
					</Form.Item>

					<Form.Item
						label="CT Date"
						name="ctDate"
						rules={[{ required: true, message: "Please select CT scan date" }]}
					>
						<DatePicker />
					</Form.Item>

					<Form.Item
						label="CT Number"
						name="ctNumber"
						rules={[{ required: true, message: "Please enter CT number" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label="Comment" name="comment">
						<Input.TextArea rows={4} />
					</Form.Item>

					<Button type="primary" htmlType="submit" block>
						Next
					</Button>
				</Form>
			)}

			{current === 1 && formData && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "CT Scan Link/DVD:", children: formData.ctScanLink },
							{
								label: "CT Date:",
								children: formData.ctDate ? dayjs(formData.ctDate).format("YYYY-MM-DD") : "",
							},
							{ label: "CT Number:", children: formData.ctNumber },
							{ label: "Comment:", children: formData.comment },
						]}
					></Descriptions>
					<Space style={{ marginTop: 8 }}>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Confirm
						</Button>
					</Space>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="CT Scan Data Submitted Successfully" />
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

export default CTScanForm;
