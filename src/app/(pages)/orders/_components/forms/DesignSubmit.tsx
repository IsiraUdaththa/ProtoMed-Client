"use client";

import React, { useState, useEffect } from "react";
import { Button, Upload, message, Steps, Result, Descriptions } from "antd";
import { InboxOutlined, FileTextOutlined, SolutionOutlined, SmileOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import api from "@/lib/axiosInstance";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


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

	const handleConfirm = async () => {
		console.log("Submitting File:", { file, userName, dateTime });

		if (!file) {
			message.error("No file selected!");
			return;
		}

		const formData = {
			designFile: file,
			designDate: dateTime,
		};

		try {
			const response = await api.post(`/orders/${orderId}/design-submit`, formData);
			console.log("File uploaded successfully:", response.data);
			setIsSuccess(true);
		} catch (error) {
			console.error("Submission failed:", error);
			setIsSuccess(false);
		}
		next();
	};

	return (
		<>
			<Steps current={current} direction="horizontal">
				<Steps.Step title="Upload File" icon={<FileTextOutlined />} />
				<Steps.Step title="Confirm" icon={<SolutionOutlined />} />
				<Steps.Step title="Status" icon={<SmileOutlined />} />
			</Steps>

			{current === 0 && (
				<>
					<Upload.Dragger
						action={`${apiUrl}/upload`}
						onChange={(info) => {
							if (info.file.status === "done") {
								const fileUrl = info.file.response?.url;
								if (fileUrl) {
									setFile(fileUrl);
								}
							}
						}}
					>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to upload</p>
						<p className="ant-upload-hint">Only one file is supported.</p>
					</Upload.Dragger>
					<Button type="primary" block onClick={next} disabled={!file}>
						Next
					</Button>
				</>
			)}

			{current === 1 && (
				<>
					<Descriptions
						bordered
						size="small"
						column={1}
						items={[
							{ label: "User", children: userName },
							{ label: "Date and Time", children: dateTime },
							{ label: "File Name", children: file?.name || "No file selected" },
						]}
					></Descriptions>
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
