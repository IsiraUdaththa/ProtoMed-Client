"use client";
import React, { useState } from "react";
import { Form, Input, Button, Steps, Result, message, Descriptions, Space } from "antd";
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	FileTextOutlined,
	SolutionOutlined,
	SmileOutlined,
} from "@ant-design/icons";

import api from "@/lib/axiosInstance";

interface DesignApproval {
	isApproved: boolean;
	comment?: string;
}

const DesignApprovalForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState<number>(0); // Track the current step
	const [approvalData, setApprovalData] = useState<DesignApproval | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle approval or not approval on Step 1
	const handleApproval = (isApproved: boolean) => {
		form.validateFields()
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
		api.post(`orders/${orderId}/peek-approval`, approvalData)
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
				<Steps.Step title="Approval" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical">
					<Form.Item name="comment" label="Comment (optional)">
						<Input.TextArea rows={4} placeholder="Add an optional comment" />
					</Form.Item>

					<Form.Item>
						<Space>
							<Button
								color="green"
								variant="filled"
								icon={<CheckCircleOutlined />}
								loading={loading}
								onClick={() => handleApproval(true)}
							>
								Approve
							</Button>
							<Button
								color="red"
								variant="filled"
								icon={<CloseCircleOutlined />}
								loading={loading}
								danger
								onClick={() => handleApproval(false)}
							>
								Reject
							</Button>
						</Space>
					</Form.Item>
				</Form>
			)}

			{current === 1 && approvalData && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{
								label: "Approval Status ",
								children: approvalData.isApproved ? "Approved" : "Not Approved",
							},
							{ label: "Comment", children: approvalData.comment },
						]}
					></Descriptions>

					<Space style={{ marginTop: 8 }}>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={submitApproval} loading={loading}>
							Submit Approval
						</Button>
					</Space>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="PEEK Approval Submitted Successfully" />
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

export default DesignApprovalForm;
