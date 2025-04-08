import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Steps, Typography, Result } from "antd";
import { FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text } = Typography;

interface CTScanFormProps {
	orderId: string;
}

const CTScanForm: React.FC<CTScanFormProps> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<any>(null);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const handleSubmit = (values: any) => {
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
			const response = await api.post(`http://localhost:5000/api/orders/${orderId}/ct-scan`, {
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
				<Step title="Enter Details" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 20 }}>
					<Form.Item
						label="CT Scan Link/DVD Number"
						name="ctScanLink"
						rules={[{ required: true, message: "Please enter CT scan link/DVD number" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item label="CT Date" name="ctDate" rules={[{ required: true, message: "Please select CT scan date" }]}>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>

					<Form.Item label="CT Number" name="ctNumber" rules={[{ required: true, message: "Please enter CT number" }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Comment" name="comment">
						<TextArea rows={4} />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Next
						</Button>
					</Form.Item>
				</Form>
			)}

			{current === 1 && formData && (
				<>
					
					<Text>
						<strong>CT Scan Link/DVD:</strong> {formData.ctScanLink}
					</Text>
					<br />
					<Text>
						<strong>CT Date:</strong> {formData.ctDate?.format("YYYY-MM-DD")}
					</Text>
					<br />
					<Text>
						<strong>CT Number:</strong> {formData.ctNumber}
					</Text>
					<br />
					<Text>
						<strong>Comment:</strong> {formData.comment || "No comment"}
					</Text>

					<Button onClick={prev} style={{ marginRight: 10 }}>
						Back
					</Button>
					<Button type="primary" onClick={handleConfirm}>
						Confirm
					</Button>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="CT Scan Data Submitted Successfully" />
					) : (
						<Result status="error" title="Submission Failed" subTitle="Please check the details and try again." />
					)}
				</>
			)}
		</>
	);
};

export default CTScanForm;
