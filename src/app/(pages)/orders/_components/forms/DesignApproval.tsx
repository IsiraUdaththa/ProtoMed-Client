"use client";
import React from "react";
import { Form, Input, Button, Flex } from "antd";
import { useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";

interface DesignApproval {
	isApproved: boolean;
	comment?: string;
}

const DesignApprovalForm: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleApproval = (isApproved: boolean) => {
		setLoading(true);
		axios
			.post("/api/design-approvals", { isApproved })
			.then(() => {
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	};

	return (
		<Flex justify="center" align="center">
			<Form style={{ maxWidth: 400, width: "100%" }}>
				<Form.Item name="comment">
					<Input.TextArea rows={4} placeholder="Add an optional comment" />
				</Form.Item>
				<Form.Item>
					<Flex justify="space-between" align="center">
						<Button
							type="primary"
							icon={<CheckCircleOutlined />}
							loading={loading}
							onClick={() => handleApproval(true)}
							style={{
								backgroundColor: "white",
								borderColor: "green",
								color: "green",
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
							}}
						>
							Not Approve
						</Button>
					</Flex>
				</Form.Item>
			</Form>
		</Flex>
	);
};

export default DesignApprovalForm;
