"use client";

import "@ant-design/v5-patch-for-react-19";
import React, { useState, useEffect } from "react";
import {
	Button,
	DatePicker,
	Form,
	Input,
	Radio,
	Select,
	Steps,
	Result,
	Descriptions,
	Space,
	Flex,
} from "antd";
import PhoneInput from "antd-phone-input";
import {
	SolutionOutlined,
	FileTextOutlined,
	SmileOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { RuleObject } from "antd/es/form";

import api from "@/lib/axiosInstance";
import CustomDropdown from "@/app/_components/CustomDropdown";

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
	ctScanMethod?: string;
	contactNumber?: PhoneNumberValue | string;
	surgeonName?: string;
	hospital?: string;
	ward?: string;
	plannedSurgeryDate?: any;
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
					const response = await api.get(`orders/${orderId}/patient`);
					const order = response.data;
					setFormData(order);

					// Populate form fields with fetched data
					form.setFieldsValue({
						country: order.country,
						name: order.name,
						gender: order.gender,
						age: order.age,
						category: order.category,
						ctScanMethod: order.ctScanMethod,
						// ✅ Allow both string and PhoneInput
						contactNumber: order.contactNumber,
						surgeonName: order.surgeonName,
						hospital: order.hospital,
						ward: order.ward,
						plannedSurgeryDate: order.plannedSurgeryDate
							? dayjs(order.plannedSurgeryDate)
							: null,
						comment: order.comment,
					});
				} catch (error) {
					console.error("Error fetching order data:", error);
				}
			};
			fetchOrderData();
		} else {
			form.resetFields();
		}
	}, [orderId, form]);

	// ✅ Phone number validator
	const phoneValidator = (_rule: RuleObject, value: unknown): Promise<void> => {
		const phoneValue = value as PhoneNumberValue | string;

		// Allow non-empty strings (from backend)
		if (typeof phoneValue === "string" && phoneValue.trim() !== "") {
			return Promise.resolve();
		}

		// Allow PhoneInput objects
		if (
			typeof (phoneValue as PhoneNumberValue)?.valid === "function" &&
			(phoneValue as PhoneNumberValue).valid()
		) {
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
		if (contact && typeof contact !== "string") {
			const { countryCode, areaCode = "", phoneNumber } = contact;
			values.contactNumber = `+${countryCode} ${areaCode}${phoneNumber}`;
		}
		setFormData(values);
		next();
	};

	// Handle Final Confirmation & Send POST or PUT request
	const handleConfirm = async () => {
		const submissionData = {
			...formData,
			plannedSurgeryDate: formData.plannedSurgeryDate
				? dayjs(formData.plannedSurgeryDate).format("YYYY-MM-DD")
				: "",
		};

		try {if (orderId) {
	const response = await api.put(`orders/${orderId}/patient`, submissionData);
	setIsSuccess(response.status === 200);
} else {
	const response = await api.post("/orders", submissionData);
	setIsSuccess(response.status === 201);
}

		} catch (error) {
			console.error("Error during submission:", error);
			setIsSuccess(false);
		}
		next();
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
						rules={[{ required: true, message: "Please select a country" }]}
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

					<Form.Item
						label="Name"
						name="name"
						rules={[{ required: true, message: "Please enter your name" }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						label="Gender"
						name="gender"
						rules={[{ required: true, message: "Please select your gender" }]}
					>
						<Radio.Group>
							<Radio value="Male">Male</Radio>
							<Radio value="Female">Female</Radio>
						</Radio.Group>
					</Form.Item>

					<Form.Item
						label="Age"
						name="age"
						rules={[{ required: true, message: "Please enter your age" }]}
					>
						<Input type="number" min={1} max={100} />
					</Form.Item>

					<Form.Item
						label="Category"
						name="category"
						rules={[{ required: true, message: "Please select a category" }]}
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
						name="ctScanMethod"
						rules={[{ required: true, message: "Please select a method" }]}
						valuePropName="value"
						getValueFromEvent={(val) => val}
					>
						<CustomDropdown type="CT Collecting Method" />
					</Form.Item>

					<Form.Item
						label="Phone Number"
						name="contactNumber"
						rules={[{ required: true, validator: phoneValidator }]}
					>
						<PhoneInput
							distinct
							enableSearch
							onlyCountries={["us", "lk", "in", "sg"]}
						/>
					</Form.Item>

					<Form.Item label="Surgeon's Name" name="surgeonName">
						<CustomDropdown type="surgeons" />
					</Form.Item>

					<Form.Item label="Hospital Name" name="hospital">
						<CustomDropdown type="hospitals" />
					</Form.Item>

					<Form.Item label="Ward" name="ward">
						<Input />
					</Form.Item>

					<Form.Item
						label="Planned Date"
						name="plannedSurgeryDate"
						rules={[{ required: true, message: "Please select a date" }]}
					>
						<DatePicker style={{ width: "100%" }} />
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
						<Descriptions bordered size="small" column={1}>
							<Descriptions.Item label="Name">
								{formData.name}
							</Descriptions.Item>
							<Descriptions.Item label="Gender">
								{formData.gender}
							</Descriptions.Item>
							<Descriptions.Item label="Age">
								{formData.age}
							</Descriptions.Item>
							<Descriptions.Item label="Category">
								{formData.category}
							</Descriptions.Item>
							<Descriptions.Item label="CT Scan Collecting Method">
								{formData.ctScanMethod}
							</Descriptions.Item>
							<Descriptions.Item label="Phone Number">
								{formData.contactNumber as string}
							</Descriptions.Item>
							<Descriptions.Item label="Doctor's Name">
								{formData.surgeonName || "N/A"}
							</Descriptions.Item>
							<Descriptions.Item label="Hospital Name">
								{formData.hospital || "N/A"}
							</Descriptions.Item>
							<Descriptions.Item label="Ward">
								{formData.ward || "N/A"}
							</Descriptions.Item>
							<Descriptions.Item label="Planned Date">
								{formData.plannedSurgeryDate
									? dayjs(formData.plannedSurgeryDate).format(
											"YYYY-MM-DD"
									  )
									: "N/A"}
							</Descriptions.Item>
							<Descriptions.Item label="Comment">
								{formData.comment || "N/A"}
							</Descriptions.Item>
						</Descriptions>
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
						title={
							isSuccess
								? "Order Submitted Successfully"
								: "Submission Failed"
						}
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
					</Flex>
				</>
			)}
		</>
	);
};

export default RegistrationForm;
