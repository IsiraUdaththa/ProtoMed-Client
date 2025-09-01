import React, { useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import PhoneInput from "antd-phone-input";
import { RuleObject } from "antd/es/form";

import api from "@/lib/axiosInstance";

interface User {
	_id: string;
	title?: string;
	name: string;
	email: string;
	phone: string;
	address?: string;
	roles: string[];
}

interface AppProps {
	user?: User;
}

const App: React.FC<AppProps> = ({ user }) => {
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

	useEffect(() => {
		if (user) {
			let phoneValue;
			if (user.phone && typeof user.phone === "string") {
				// Extract countryCode, areaCode, and phoneNumber safely
				const match = user.phone.match(/^\+?(\d{1,3})(\d{0,4})(\d+)$/);
				if (match) {
					const [, countryCode, areaCode = "", phoneNumber] = match;
					phoneValue = {
						countryCode,
						areaCode,
						phoneNumber,
						valid: () => true,
					};
				}
			}

			form.setFieldsValue({
				title: user.title,
				name: user.name,
				email: user.email,
				phone: phoneValue,
				roles: user.roles,
				address: user.address,
			});
		}
	}, [user, form]);

	const onFinish = async (values: { phone: { countryCode: string; areaCode: string; phoneNumber: string } }) => {
		console.log(values);
		try {
			const phone = values.phone
				? `+${values.phone.countryCode}${values.phone.areaCode}${values.phone.phoneNumber}`
				: "";

			const payload = {
				...values,
				phone,
			};
			if (user?._id) {
				// Update existing user
				await api.put(`/users/${user._id}`, payload);
				message.success("User updated successfully!");
			} else {
				// Create new user
				await api.post("/users", { ...payload, password: "password" });
				message.success("User created successfully!");
				form.resetFields();
			}
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
