"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
	Button,
	Card,
	Cascader,
	Checkbox,
	ColorPicker,
	DatePicker,
	Flex,
	Form,
	Input,
	InputNumber,
	Radio,
	Rate,
	Select,
	Slider,
	Switch,
	TreeSelect,
	Upload,
} from "antd";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
	if (Array.isArray(e)) {
		return e;
	}
	return e?.fileList;
};

const FormDisabledDemo: React.FC = () => {
	const [componentDisabled, setComponentDisabled] = useState<boolean>(false);

	return (
		<Flex justify="center" align="center">
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 14 }}
				layout="horizontal"
				disabled={componentDisabled}
				style={{ maxWidth: 600, width: "100%" }}
			>
				<Form.Item label="CT scan link/DVD number">
					<Input />
				</Form.Item>

				<Form.Item label="CT Date ">
					<DatePicker />
				</Form.Item>

				<Form.Item label="CT Number:">
					<Input />
				</Form.Item>

				<Form.Item label="Comment">
					<TextArea rows={4} />
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 8, span: 50 }}>
					<Button type="primary" htmlType="submit">
						Checked
					</Button>
				</Form.Item>
			</Form>
		</Flex>
	);
};

export default () => <FormDisabledDemo />;
