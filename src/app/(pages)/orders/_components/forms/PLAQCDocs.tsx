"use client";

import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Form, Input, Button, Card, Steps, Result, message, Descriptions } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

interface QCFormRecord {
	skullDefectA?: number;
	skullDefectB?: number;
	skullDefectC?: number;
	implantModelA?: number;
	implantModelB?: number;
	implantModelC?: number;
}

const PLAApproval: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<QCFormRecord>();
	const [formData, setFormData] = useState<QCFormRecord | null>(null);

	const [current, setCurrent] = useState<number>(0); // Track the current step
	const [loading, setLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const [username] = useState("John Doe"); // Example username, replace with actual username from your app
	const [currentDate] = useState(new Date().toLocaleString()); // Get current date and time

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle approval or not approval on Step 1
	const handleSubmit = (values: QCFormRecord) => {
		setFormData(values);
		next();
	};

	// Handle the submission of approval or disapproval in Step 2
	const submitApproval = () => {
		if (!formData) return;

		setLoading(true);
		api.post(`orders/${orderId}/pla-qcdocs`, formData)
			.then(() => {
				setLoading(false);
				setIsSuccess(true);
				message.success("PLA approval successfully submitted.");
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
				<Steps.Step title="Approval" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical" onFinish={handleSubmit}>
					<Form.Item
						label="Enter skullDefectA"
						name="skullDefectA"
						rules={[{ message: "Please enter skullDefectA" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="Enter skullDefectB"
						name="skullDefectB"
						rules={[{ message: "Please enter skullDefectB" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="Enter skullDefectC"
						name="skullDefectC"
						rules={[{ message: "Please enter skullDefectC" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="Enter implantModelA"
						name="implantModelA"
						rules={[{ message: "Please enter implantModel" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="Enter implantModelB"
						name="implantModelB"
						rules={[{ message: "Please enter implantModel" }]}
					>
						<Input type="number" min={1} max={1000} step={0.01} addonAfter="mm"/>
					</Form.Item>
					<Form.Item
						label="Enter implantModelC"
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

			{current === 1 && formData && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "Username", children: username },
							{ label: "Date/Time", children: currentDate },
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
						<Result status="success" title="PLA Approval Submitted Successfully" />
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

export default PLAApproval;
