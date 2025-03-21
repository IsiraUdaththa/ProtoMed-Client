"use client";
import React from "react";
import { Form, InputNumber, Input, Upload, Button, Space, Select, Card, Flex } from "antd";
import { FileImageOutlined, InboxOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const { Option } = Select;

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
			onFinish={onFinish}
			initialValues={{
				"input-number": 3,
			}}
		>
			<Form.Item name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-2d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<VideoCameraAddOutlined />
					</p>
					<p className="ant-upload-hint">Click or drag Video of Final Implant to this area to upload</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-2d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<FileImageOutlined />
					</p>
					<p className="ant-upload-hint">Click or drag Picture of Final Implant to this area to upload</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
				<Upload.Dragger name="ct-image-3d" action="/upload.do" multiple={false}>
					<p className="ant-upload-drag-icon">
						<FileImageOutlined />
					</p>
					<p className="ant-upload-hint">Click or drag Picture of Packaging to this area to upload</p>
				</Upload.Dragger>
			</Form.Item>

			<Form.Item>
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
