"use client";
import React, { useState } from "react";
import { Form, InputNumber, Button, Space, Dropdown, Menu, message, Input, Card, Flex } from "antd";
import { SaveOutlined, DownOutlined } from "@ant-design/icons";

const QuotationPage: React.FC = () => {
	const [currency, setCurrency] = useState<string>("USD");
	const [quotationValue, setQuotationValue] = useState<number>(0);

	const onFinish = (values: any) => {
		console.log("Received values of form: ", values);
		message.success("Quotation submitted successfully!");
	};

	const handleValueChange = (value: number | null) => {
		if (value !== null) {
			setQuotationValue(value);
		}
	};

	const currencyMenu = (
		<Menu>
			<Menu.Item key="USD" onClick={() => setCurrency("USD")}>
				USD
			</Menu.Item>
			<Menu.Item key="LKR" onClick={() => setCurrency("LKR")}>
				LKR
			</Menu.Item>
			<Menu.Item key="SRD" onClick={() => setCurrency("SRD")}>
				SRD
			</Menu.Item>
		</Menu>
	);

	const [form] = Form.useForm();

	const handleReset = () => {
		form.resetFields();
		setCurrency("USD");
		setQuotationValue(0);
	};

	return (
		<Flex justify="center" align="center">
			<Form
				form={form}
				name="quotation"
				onFinish={onFinish}
				layout="vertical"
				initialValues={{
					quantity: 1,
					unitPrice: 100,
				}}
			>
				<Form.Item label="Quotation Value" required>
					<Space>
						<Dropdown overlay={currencyMenu} trigger={["click"]}>
							<Button>
								{currency} <DownOutlined />
							</Button>
						</Dropdown>
						<InputNumber
							value={quotationValue}
							onChange={handleValueChange}
							style={{ width: "100%" }}
							placeholder="Enter value"
							min={0}
						/>
					</Space>
				</Form.Item>

				<Form.Item>
					<Space>
						<Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
							Save Quotation
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Flex>
	);
};

export default QuotationPage;
