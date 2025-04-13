"use client";

import React, { useState, useEffect } from "react";
import { Button, Upload, message, Card, Steps, Typography, Result } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import api from "@/lib/axiosInstance";

const { Dragger } = Upload;
const { Step } = Steps;
const { Title, Text } = Typography;

const DesignUploader: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [current, setCurrent] = useState(0);
	const [userName, setUserName] = useState("Fetching...");
	const [dateTime, setDateTime] = useState("");
	const [file, setFile] = useState<File | null>(null);
	const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

	useEffect(() => {
		// Simulating user fetch
		setTimeout(() => setUserName("John Doe"), 1000);

		// Update date & time every second
		const interval = setInterval(() => {
			setDateTime(new Date().toLocaleString());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const next = () => setCurrent(current + 1);
	const prev = () => setCurrent(current - 1);

	const uploadProps: UploadProps = {
		name: "file",
		multiple: false,
		beforeUpload: (file) => {
			setFile(file);
			message.success(`${file.name} file selected.`);
			return false; // Prevent automatic upload
		},
	};

	const handleConfirm = async () => {
		console.log("Submitting File:", { file, userName, dateTime });

		if (!file) {
			message.error("No file selected!");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("designDate", dateTime);

		try {
			const response = await api.post(`/orders/${orderId}/design-submit`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next(); // Move to success/error step
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Step title="Upload File" icon={<FileTextOutlined />} />
				<Step title="Confirm" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<>
					<Dragger {...uploadProps}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to upload</p>
						<p className="ant-upload-hint">Only one file is supported.</p>
					</Dragger>
					<Button type="primary" block onClick={next} disabled={!file}>
						Next
					</Button>
				</>
			)}

			{current === 1 && (
				<>
					<Text>
						<strong>User:</strong> {userName}
					</Text>

					<Text>
						<strong>Date & Time:</strong> {dateTime}
					</Text>

					<Text>
						<strong>File Name:</strong> {file?.name || "No file selected"}
					</Text>
					<>
						<Button onClick={prev}>Back</Button>
						<Button type="primary" onClick={handleConfirm} disabled={!file}>
							Confirm
						</Button>
					</>
				</>
			)}

			{current === 2 && (
				<>
					{isSuccess ? (
						<Result status="success" title="File Uploaded Successfully" />
					) : (
						<Result status="error" title="File Upload Failed" subTitle="Please try again." />
					)}
				</>
			)}
		</>
	);
};

export default DesignUploader;
