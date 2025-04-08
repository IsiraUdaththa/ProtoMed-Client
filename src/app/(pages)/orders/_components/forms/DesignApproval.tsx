"use client";
import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Steps, Result, message } from "antd";
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	FileTextOutlined,
	SolutionOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;
const { Step } = Steps;

interface DesignApproval {
	isApproved: boolean;
	comment?: string;
}

const DesignApprovalForm: React.FC = () => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState<number>(0); // Track the current step
	const [approvalData, setApprovalData] = useState<DesignApproval | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
	const [username] = useState("John Doe"); // Example username, replace with actual username from your app
	const [currentDate] = useState(new Date().toLocaleString()); // Get current date and time

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle approval or not approval on Step 1
	const handleApproval = (isApproved: boolean) => {
		form
			.validateFields()
			.then((values) => {
				const data: DesignApproval = {
					isApproved,
					comment: values.comment,
				};

				setApprovalData(data);
				next(); // Move to Step 2 (Confirmation)
			})
			.catch(() => {
				message.error("Please add a comment before proceeding.");
			});
	};

	// Handle the submission of approval or disapproval in Step 2
	const submitApproval = () => {
		if (!approvalData) return;

		setLoading(true);
		axios
			.post("/api/design-approvals", approvalData)
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

	// Handle going back to Step 1 from Step 2
	const goBack = () => {
		setCurrent(0);
	};

	return (
		<Card title="Design Approval" style={{ maxWidth: 600, margin: "auto" }}>
			<Steps current={current}>
				<Step title="Approval" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical" style={{ marginTop: 20 }}>
					<Form.Item name="comment" label="Comment (optional)">
						<Input.TextArea rows={4} placeholder="Add an optional comment" />
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							icon={<CheckCircleOutlined />}
							loading={loading}
							onClick={() => handleApproval(true)}
							style={{
								backgroundColor: "white",
								borderColor: "green",
								color: "green",
								padding: "16px",
								margin: "16px", // Reduced padding
							}}
						>
							Approve
						</Button>
						<Button
							type="default"
							icon={<CloseCircleOutlined />}
							loading={loading}
							danger
							onClick={() => handleApproval(false)}
							style={{
								backgroundColor: "white",
								borderColor: "red",
								color: "red",
								padding: "16px",
								margin: "16px", // Reduced padding
							}}
						>
							Not Approve
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && approvalData && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm Approval</Title>
					<Card style={{ marginBottom: 20 }}>
						<Text>
							<strong>Approval Status:</strong> {approvalData.isApproved ? "Approved" : "Not Approved"}
						</Text>
						<br />
						<Text>
							<strong>Comment:</strong> {approvalData.comment || "No comment provided"}
						</Text>
						<br />
						<Text>
							<strong>Username:</strong> {username}
						</Text>
						<br />
						<Text>
							<strong>Date/Time:</strong> {currentDate}
						</Text>
					</Card>

					<Form.Item>
						<Button onClick={goBack} style={{ marginRight: 10 }}>
							Back
						</Button>
						<Button type="primary" onClick={submitApproval} loading={loading}>
							Submit Approval
						</Button>
					</Form.Item>
				</div>
			)}

			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{isSuccess ? (
						<Result status="success" title="Design Approval Submitted Successfully" />
					) : (
						<Result status="error" title="Submission Failed" subTitle="Please check the details and try again." />
					)}
				</div>
			)}
		</Card>
	);
};

export default DesignApprovalForm;
