"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState, useEffect } from "react";
import { Button, Card, DatePicker, Form, Input, Radio, Select, Steps, Typography, Result } from "antd";
import PhoneInput from "antd-phone-input";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { TextArea } = Input;
const { Title, Text } = Typography;

const RegistrationForm: React.FC = () => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<any>(null);
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		// Simulating a user fetch
		setTimeout(() => setUserName("John Doe"), 1000);

		// Update date & time every second
		const interval = setInterval(() => {
			setDateTime(new Date().toLocaleString());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Phone number validator
	const phoneValidator = (_: any, value: { valid: () => any; }) => {
		if (value?.valid()) return Promise.resolve();
		return Promise.reject("Invalid phone number");
	};

	// Step navigation
	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle Form Submission (First Step)
	const handleNext = async (values: any) => {
		// Store full phone number: "+{countryCode} {phoneNumber}"
		values.contactNumber = `+${values.contactNumber.countryCode} ${values.contactNumber.phoneNumber}`;

		setFormData(values);
		next(); // Move to confirmation step
	};

	// Handle Final Confirmation & Send POST request
	const handleConfirm = async () => {
		const submissionData = {
			...formData,
			userName,
			dateTime,
			dob: formData.dob?.format("YYYY-MM-DD"),
			plannedDate: formData.plannedDate?.format("YYYY-MM-DD"),
		};

		console.log("Submitting Data:", submissionData);

		try {
			const response = await fetch("https://your-api-endpoint.com/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(submissionData),
			});

			if (response.ok) {
				setIsSuccess(true);
			} else {
				console.error("Submission failed:", await response.text());
				setIsSuccess(false);
			}
		} catch (error) {
			console.error("Error during submission:", error);
			setIsSuccess(false);
		}

		next(); // Move to success/error step
	};

	return (
		<Card title="Patient Registration" style={{ maxWidth: 600, margin: "auto" }}>
			<Steps current={current} direction="horizontal">
				<Step title="Enter Details" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical" onFinish={handleNext} style={{ marginTop: 20 }}>
					<Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select your gender" }]}>
						<Radio.Group>
							<Radio value="Male">Male</Radio>
							<Radio value="Female">Female</Radio>
						</Radio.Group>
					</Form.Item>

					<Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: "Please select your birth date" }]}>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>

					<Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
						<Select>
							{["Accuplasty", "Accupectomy", "Accufacial", "Accuortho", "Lamifix", "Screws", "Accumesh", "Screws And Plates", "Other"].map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="CT Scan Collecting Method" name="collectingMethod" rules={[{ required: true, message: "Please select a method" }]}>
						<Select>
							{["DVD - Courrier by patient", "DVD - Collect by company", "Google Drive Upload", "Website Upload", "WeTransfer", "Screws", "Clay Model", "None"].map((method) => (
								<Select.Option key={method} value={method}>
									{method}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="Phone Number" name="contactNumber" rules={[{ validator: phoneValidator }]} required>
						<PhoneInput distinct enableSearch onlyCountries={["us", "lk", "in", "sg"]} />
					</Form.Item>

					<Form.Item label="Doctor's Name" name="doctor">
						<Input />
					</Form.Item>

					<Form.Item label="Hospital Name" name="hospital">
						<Input />
					</Form.Item>

					<Form.Item label="Planned Date" name="plannedDate">
						<DatePicker style={{ width: "100%" }} />
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
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm Your Details</Title>
					<Text strong>User:</Text> <Text>{userName}</Text>
					<br />
					<Text strong>Date & Time:</Text> <Text>{dateTime}</Text>
					<br />
					<Text strong>Name:</Text> <Text>{formData.name}</Text>
					<br />
					<Text strong>Gender:</Text> <Text>{formData.gender}</Text>
					<br />
					<Text strong>Date of Birth:</Text> <Text>{formData.dob?.format("YYYY-MM-DD")}</Text>
					<br />
					<Text strong>Category:</Text> <Text>{formData.category}</Text>
					<br />
					<Text strong>CT Scan Collecting Method:</Text> <Text>{formData.collectingMethod}</Text>
					<br />
					<Text strong>Phone Number:</Text> <Text>{formData.contactNumber}</Text>
					<br />
					<Text strong>Doctor's Name:</Text> <Text>{formData.doctor || "N/A"}</Text>
					<br />
					<Text strong>Hospital Name:</Text> <Text>{formData.hospital || "N/A"}</Text>
					<br />
					<Text strong>Planned Date:</Text> <Text>{formData.plannedDate?.format("YYYY-MM-DD") || "N/A"}</Text>
					<br />
					<Text strong>Comment:</Text> <Text>{formData.comment || "N/A"}</Text>
					<br />
					<Button onClick={prev} style={{ marginRight: 10 }}>
						Back
					</Button>
					<Button type="primary" onClick={handleConfirm}>
						Confirm & Submit
					</Button>
				</div>
			)}

			{current === 2 && <Result status={isSuccess ? "success" : "error"} title={isSuccess ? "Registration Successful" : "Registration Failed"} />}
		</Card>
	);
};

export default RegistrationForm;
