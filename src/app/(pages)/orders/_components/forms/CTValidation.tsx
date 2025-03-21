"use client";
import React from "react";
import { Form, InputNumber, Input, Upload, Button, Space, Select, Card, Flex } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;

const formStyle = {
	maxWidth: 600,
	margin: "0 auto",
	paddingTop: "50px",
};

const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};

const normFile = (e: any) => {
	console.log("Upload event:", e);
	if (Array.isArray(e)) {
		return e;
	}
	return e?.fileList;
};

const onFinish = (values: any) => {
	console.log("Received values of form: ", values);
};

const handleBeforeButtonClick = () => {
	console.log("Before Quotation Button clicked");
};

const handleAfterButtonClick = () => {
	console.log("After Quotation Button clicked");
};

const App: React.FC = () => (
	<Flex justify="center" align="center">
		<Form
			name="validate_other"
			{...formItemLayout}
			onFinish={onFinish}
			initialValues={{
				"input-number": 3,
			}}
			style={formStyle}
		>
			<Form.Item label="CT Image 2D" name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-2d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag CT Image 2D file to this area to upload</p>
					<p className="ant-upload-hint">Only one image file supported.</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item label="CT Image 3D" name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-3d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">Click or drag CT Image 3D file to this area to upload</p>
					<p className="ant-upload-hint">Only one image file supported.</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item label="Size (sqcm)" name="size-sqcm" required>
				<InputNumber min={1} max={1000} style={{ width: "100%" }} />
			</Form.Item>

			<Form.Item label="Implant Name" name="implant-name" required>
				<Input />
			</Form.Item>

			<Form.Item label="Size of Implant" name="implant-size" required>
				<Input />
			</Form.Item>

			<Form.Item wrapperCol={{ span: 12, offset: 6 }}>
				<Space>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Space>
			</Form.Item>
		</Form>
	</Flex>
);

export default App;
