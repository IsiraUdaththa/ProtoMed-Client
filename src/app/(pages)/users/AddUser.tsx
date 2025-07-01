import React from "react";
import { Button, Form, Input, Select, message } from "antd";
import PhoneInput from "antd-phone-input";
import { RuleObject } from "antd/es/form";

import api from "@/lib/axiosInstance";

const App: React.FC = () => {
	const [form] = Form.useForm();
	type PhoneValue = {
		countryCode: string;
		areaCode: string;
		phoneNumber: string;
		valid: () => boolean;
	};

	const phoneValidator = (_: RuleObject, value: PhoneValue): Promise<void> => {
		if (value?.valid()) return Promise.resolve();
		return Promise.reject("Invalid phone number");
	};

	const roleOptions = [
		{ value: "admin", label: "Admin" },
		{ value: "sales", label: "Sales" },
		{ value: "doctor", label: "Doctor" },
		{ value: "designer", label: "Designer" },
		{ value: "technician", label: "Technician" },
		{ value: "qc", label: "QC" },
	];

	const titleOptions = [
		{ value: "Mr.", label: "Mr." },
		{ value: "Ms.", label: "Ms." },
		{ value: "Mrs.", label: "Mrs." },
		{ value: "Miss.", label: "Miss." },
		{ value: "Dr.", label: "Dr." },
	];

	const onFinish = async (values: { phone: { countryCode: string; areaCode: string; phoneNumber: string } }) => {
		console.log(values);
		try {
			const user = {
				...values,
				password: "password",
				phone: `+${values.phone.countryCode}${values.phone.areaCode}${values.phone.phoneNumber}`,
			};
			await api.post(`/users`, user);
			message.success("User created successfully!");
			form.resetFields();
		} catch (error) {
			console.error(error);
			message.error("Failed to create user.");
		}
	};

	return (
		<Form layout="vertical" form={form} onFinish={onFinish}>
			<Form.Item name="title" label="Title" rules={[{ required: false, message: "Please select a Title" }]}>
				<Select style={{ width: "100%" }} options={titleOptions} />
			</Form.Item>
			<Form.Item name="name" label="Name" rules={[{ required: false, message: "Username is required!" }]}>
				<Input placeholder="Please enter user name" />
			</Form.Item>
			<Form.Item
				name="email"
				label="Email"
				rules={[{ required: false, type: "email", message: "Invalid email!" }]}
			>
				<Input placeholder="Please enter user email" />
			</Form.Item>
			<Form.Item name="phone" label="Phone Number" rules={[{ validator: phoneValidator }]} required>
				<PhoneInput distinct enableSearch onlyCountries={["us", "lk", "in", "sg"]} />
			</Form.Item>
			<Form.Item name="roles" label="Roles" rules={[{ required: false, message: "Please select a role" }]}>
				<Select mode="multiple" style={{ width: "100%" }} options={roleOptions} />
			</Form.Item>

			<Form.Item name="address" label="Address">
				<Input.TextArea rows={2} placeholder="Please enter user address" />
			</Form.Item>
			<Button type="primary" htmlType="submit">
				Submit
			</Button>
		</Form>
	);
};

export default App;
