import "@ant-design/v5-patch-for-react-19";
import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Input, Radio, Select, Steps, Result, Descriptions, Space } from "antd";
import PhoneInput from "antd-phone-input";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const RegistrationForm: React.FC<{ orderId: string }> = ({ orderId }) => {
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
					const response = await api.get(`orders/${orderId}`);
					console.log(response);

					const order = response.data.patientDetails;
					setFormData(order);

					// Populate form fields with the fetched data
					form.setFieldsValue({
						country: order.country,
						name: order.name,
						gender: order.gender,
						age: order.age,
						category: order.category,
						collectingMethod: order.collectingMethod,
						contactNumber: order.contactNumber,
						doctor: order.doctor,
						hospital: order.hospital,
						ward: order.ward,
						plannedDate: order.plannedDate,
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
		<>
			<Steps current={current}>
				<Steps.Step title="Enter Details" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<Form form={form} layout="vertical" onFinish={handleNext}>
					<Form.Item
						label="Country"
						name="country"
						initialValue={"Sri Lanka"}
						rules={[{ message: "Please select a country" }]}
						required
					>
						<Select>
							{["Sri Lanka", "India", "Singapore"].map((method) => (
								<Select.Option key={method} value={method}>
									{method}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item label="Name" name="name" rules={[{ message: "Please enter your name" }]}>
						<Input />
					</Form.Item>

					<Form.Item label="Gender" name="gender" rules={[{ message: "Please select your gender" }]}>
						<Radio.Group>
							<Radio value="Male">Male</Radio>
							<Radio value="Female">Female</Radio>
						</Radio.Group>
					</Form.Item>

					<Form.Item label="Age" name="age" rules={[{ type: "number", message: "Please enter your age" }]}>
						<Input type="number" min={1} max={100} />
					</Form.Item>

					<Form.Item label="Category" name="category" rules={[{ message: "Please select a category" }]}>
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
						rules={[{ message: "Please select a method" }]}
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

					<Form.Item label="Ward" name="ward">
						<Input />
					</Form.Item>

					<Form.Item label="Planned Date" name="plannedDate">
						<DatePicker />
					</Form.Item>

					<Form.Item label="Comment" name="comment">
						<Input.TextArea rows={4} />
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
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "User", children: userName },
							{ label: "Date & Time", children: dateTime },
							{ label: "Name", children: formData.name },
							{ label: "Gender", children: formData.gender },
							{ label: "Age", children: formData.age },
							{ label: "Category", children: formData.category },
							{ label: "CT Scan Collecting Method", children: formData.collectingMethod },
							{ label: "Phone Number", children: formData.contactNumber },
							{ label: "Doctor&apos;s Name", children: formData.doctor || "N/A" },
							{ label: "Hospital Name", children: formData.hospital || "N/A" },
							{ label: "Ward", children: formData.ward || "N/A" },
							{ label: "Planned Date", children: formData.plannedDate?.format("YYYY-MM-DD") || "N/A" },
							{ label: "Comment", children: formData.comment || "N/A" },
						]}
					></Descriptions>
					<Space>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm}>
							Submit
						</Button>
					</Space>
				</>
			)}

			{current === 2 && (
				<>
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
				</>
			)}
		</>
	);
};

export default RegistrationForm;
