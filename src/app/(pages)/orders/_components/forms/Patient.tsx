"use client";

import "@ant-design/v5-patch-for-react-19";
import React, { useState, useEffect } from "react";
import { Button, DatePicker, Form, Input, Radio, Select, Steps, Result, Descriptions, Space, Flex } from "antd";
import PhoneInput from "antd-phone-input";
import { SolutionOutlined, FileTextOutlined, SmileOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { RuleObject } from "antd/es/form";

import api from "@/lib/axiosInstance";

interface PhoneNumberValue {
	areaCode: string;
	countryCode: number;
	isoCode: string;
	phoneNumber: string;
	valid: (strict?: boolean) => boolean;
}

interface IFormData {
	country?: string;
	name?: string;
	gender?: string;
	age?: string;
	category?: string;
	collectingMethod?: string;
	contactNumber?: PhoneNumberValue | string;
	surgeonName?: string;
	hospital?: string;
	ward?: string;
	plannedDate?: Date;
	comment?: string;
}

const RegistrationForm: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [form] = Form.useForm<IFormData>();
	const [formData, setFormData] = useState<IFormData>({});

	const [current, setCurrent] = useState(0);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	// Fetch data if orderId is provided
	useEffect(() => {
		if (orderId) {
			const fetchOrderData = async () => {
				try {
					const response = await api.get(`orders/${orderId}`);
					console.log(response);

					const order = response.data;
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
						surgeonName: order.surgeonName,
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
	const phoneValidator = (_rule: RuleObject, value: unknown): Promise<void> => {
		const phoneValue = value as PhoneNumberValue;

		if (typeof phoneValue?.valid === "function" && phoneValue.valid()) {
			return Promise.resolve();
		}

		return Promise.reject("Invalid phone number");
	};
	// Step navigation
	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	// Handle Form Submission (First Step)
	const handleNext = async (values: IFormData) => {
		const contact = values.contactNumber as PhoneNumberValue;
		if (contact) {
			const { countryCode, areaCode = "", phoneNumber } = contact;
			values.contactNumber = `+${countryCode} ${areaCode}${phoneNumber}`;
		}

		setFormData(values);
		next(); // Move to confirmation step
	};

	// Handle Final Confirmation & Send POST or PUT request
	const handleConfirm = async () => {
		const submissionData = {
			...formData,
			plannedDate: formData.plannedDate ? dayjs(formData.plannedDate).format("YYYY-MM-DD") : "",
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

		next();
		 // Move to success/error step
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
						initialValue={"SL"}
						rules={[{ message: "Please select a country" }]}
						required
					>
						<Select>
							{[
								{ label: "Sri Lanka", value: "SL" },
								{ label: "India", value: "IN" },
								{ label: "Malaysia", value: "MY" },
								{ label: "Thailand", value: "TH" },
							].map(({ label, value }) => (
								<Select.Option key={label} value={value}>
									{label}
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

					<Form.Item label="Age" name="age" rules={[{ message: "Please enter your age" }]}>
						<Input type="number" min={1} max={100} />
					</Form.Item>

					<Form.Item
						label="Category"
						name="category"
						rules={[{ message: "Please select a category" }]}
						required
					>
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

					<Form.Item
						label="Phone Number"
						name="contactNumber"
						rules={[{ validator: phoneValidator }]}
						required
					>
						<PhoneInput distinct enableSearch onlyCountries={["us", "lk", "in", "sg"]} />
					</Form.Item>

					<Form.Item label="Doctor's Name" name="surgeonName">
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
					<Space direction="vertical" style={{ width: "100%" }}>
						<Descriptions
							bordered
							size="small"
							column={1}
							items={[
								{ label: "Name", children: formData.name },
								{ label: "Gender", children: formData.gender },
								{ label: "Age", children: formData.age },
								{ label: "Category", children: formData.category },
								{ label: "CT Scan Collecting Method", children: formData.collectingMethod },
								{ label: "Phone Number", children: formData.contactNumber as string },
								{ label: "Doctor&apos;s Name", children: formData.surgeonName || "N/A" },
								{ label: "Hospital Name", children: formData.hospital || "N/A" },
								{ label: "Ward", children: formData.ward || "N/A" },
								{
									label: "Planned Date",
									children: formData.plannedDate
										? dayjs(formData.plannedDate).format("YYYY-MM-DD")
										: "N/A",
								},
								{ label: "Comment", children: formData.comment || "N/A" },
							]}
						></Descriptions>
						<Space>
							<Button onClick={prev}>Back</Button>
							<Button type="primary" onClick={handleConfirm}>
								Submit
							</Button>
						</Space>
					</Space>
				</>
			)}
{current === 2 && isSuccess !== null && (
	<>
		<Result
			status={isSuccess ? "success" : "error"}
			title={isSuccess ? "Order Submitted Successfully" : "Submission Failed"}
			subTitle={
				isSuccess
					? "Your order has been submitted successfully."
					: "There was an issue submitting your order. Please try again."
			}
		/>
		<Flex justify="center" align="center" gap="10px">
					<Button
						type="primary"
						onClick={() => {
							form.resetFields();
							setFormData({});
							setIsSuccess(null);
							setCurrent(0);
						}}
					>
						Make a New Order
					</Button>
			</Flex>	</>
			)}
		</>
	);
};

export default RegistrationForm;
