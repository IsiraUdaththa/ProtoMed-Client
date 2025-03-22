"use client";

import React, { useState, useEffect } from "react";
import { Button, Upload, message, Card, Steps, Typography, Result } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

const { Dragger } = Upload;
const { Step } = Steps;
const { Title, Text } = Typography;

const DesignUploader: React.FC = () => {
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

		try {
			await fakeApiCall(file);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next(); // Move to success/error step
	};

	const fakeApiCall = (file: File) => {
		return new Promise<void>((resolve, reject) => {
			setTimeout(() => {
				file ? resolve() : reject("File upload failed");
			}, 1000);
		});
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Step title="Upload File" icon={<FileTextOutlined />} />
				<Step title="Confirm Details" icon={<SolutionOutlined />} />
				<Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<div style={{ marginTop: 20 }}>
					<Dragger {...uploadProps}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to upload</p>
						<p className="ant-upload-hint">Only one file is supported.</p>
					</Dragger>
					<Button type="primary" block onClick={next} style={{ marginTop: 16 }} disabled={!file}>
						Next
					</Button>
				</div>
			)}

			{current === 1 && (
				<div style={{ marginTop: 20 }}>
					<Title level={4}>Confirm Details</Title>
					<Text>
						<strong>User:</strong> {userName}
					</Text>
					<br />
					<Text>
						<strong>Date & Time:</strong> {dateTime}
					</Text>
					<br />
					<Text>
						<strong>File Name:</strong> {file?.name || "No file selected"}
					</Text>
					<div style={{ marginTop: 20 }}>
						<Button onClick={prev} style={{ marginRight: 10 }}>
							Back
						</Button>
						<Button type="primary" onClick={handleConfirm} disabled={!file}>
							Confirm
						</Button>
					</div>
				</div>
			)}

			{current === 2 && (
				<div style={{ marginTop: 20 }}>
					{isSuccess ? (
						<Result status="success" title="File Uploaded Successfully" />
					) : (
						<Result status="error" title="File Upload Failed" subTitle="Please try again." />
					)}
				</div>
			)}
		</>
	);
};

export default DesignUploader;
