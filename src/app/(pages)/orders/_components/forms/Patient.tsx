import "@ant-design/v5-patch-for-react-19";
import React, { useState, useEffect } from "react";
import { Button, Card, DatePicker, Form, Input, Radio, Select, Steps, Typography, Result } from "antd";
import PhoneInput from "antd-phone-input";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";
import axios from "axios";
import api from "@/lib/axiosInstance";
// import moment from "moment"; // Make sure you have moment imported if you're dealing with date objects.

const { Step } = Steps;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PatientProps {
	orderId?: string; // Optional orderId prop
}

const RegistrationForm: React.FC<PatientProps> = ({ orderId }) => {
	const [form] = Form.useForm();
	const [current, setCurrent] = useState(0);
	const [formData, setFormData] = useState<any>(null);
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

	// Fetch data if orderId is provided
	useEffect(() => {
		if (orderId) {
			const fetchOrderData = async () => {
				try {
					const response = await api.get(`http://localhost:5000/api/orders/${orderId}`);
					console.log(response);

					const order = response.data.patientDetails;
					setFormData(order);

					// Populate form fields with the fetched data
					form.setFieldsValue({
						name: order.name,
						gender: order.gender,
						// dob: order.dob ? moment(order.dob) : null,
						category: order.category,
						collectingMethod: order.collectingMethod,
						contactNumber: order.contactNumber,
						doctor: order.doctor,
						hospital: order.hospital,
						// plannedDate: order.plannedDate ? moment(order.plannedDate) : null,
						comment: order.comment,
					});
				} catch (error) {
					console.error("Error fetching order data:", error);
				}
			};
			fetchOrderData();
		} else {
			// If no orderId, initialize form with empty data for a new order
			form.resetFields();
		}
	}, [orderId, form]);

	// Phone number validator
	const phoneValidator = (_: any, value: { valid: () => any }) => {
		if (value?.valid()) return Promise.resolve();
		return Promise.reject("Invalid phone number");
	};

	// Step navigation
	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle Form Submission (First Step)
	const handleNext = async (values: any) => {
		values.contactNumber = `${values.contactNumber.countryCode} ${values.contactNumber?.areaCode}${values.contactNumber.phoneNumber}`;
		setFormData(values);
		next(); // Move to confirmation step
	};

	// Handle Final Confirmation & Send POST or PUT request
	const handleConfirm = async () => {
		const submissionData = {
			...formData,
			userName,
			dateTime,
			plannedDate: formData.plannedDate?.format("YYYY-MM-DD"),
		};

		try {
			if (orderId) {
				// Update existing order (PUT request)
				const response = await api.post(`/orders/${orderId}`, submissionData);
				if (response.status === 200) {
					setIsSuccess(true);
				} else {
					setIsSuccess(false);
				}
			} else {
				// Create new order (POST request)
				const response = await api.post("/orders", submissionData);
				if (response.status === 201) {
					setIsSuccess(true);
				} else {
					setIsSuccess(false);
				}
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

					<Form.Item
						label="Date of Birth"
						name="dob"
						rules={[{ required: true, message: "Please select your birth date" }]}
					>
						<DatePicker style={{ width: "100%" }} />
					</Form.Item>

					<Form.Item label="Category" name="category" rules={[{ required: true, message: "Please select a category" }]}>
						<Select>
							{[
								"Accuplasty",
								"Accupectomy",
								"Accufacial",
								"Accuortho",
								"Lamifix",
								"Screws",
								"Accumesh",
								"Screws and Plates",
								"Other",
							].map((item) => (
								<Select.Option key={item} value={item}>
									{item}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						label="CT Scan Collecting Method"
						name="collectingMethod"
						rules={[{ required: true, message: "Please select a method" }]}
					>
						<Select>
							{[
								"DVD - Courrier by patient",
								"DVD - Collect by company",
								"Google Drive Upload",
								"Website Upload",
								"WeTransfer",
								"Clay Model",
								"None",
							].map((method) => (
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
						Submit
					</Button>
				</div>
			)}

			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{isSuccess !== null && (
						<Result
							status={isSuccess ? "success" : "error"}
							title={isSuccess ? "Order Submitted Successfully" : "Submission Failed"}
							subTitle={
								isSuccess
									? "Your order has been submitted successfully."
									: "There was an issue submitting your order. Please try again."
							}
							extra={[
								<Button key="back" type="primary" onClick={() => setCurrent(0)}>
									Go Back
								</Button>,
							]}
						/>
					)}
				</div>
			)}
		</Card>
	);
};

export default RegistrationForm;
