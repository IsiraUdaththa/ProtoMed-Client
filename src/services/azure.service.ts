import { RcFile } from "antd/es/upload/interface";
import { UploadProps } from "antd";

import api from "@/lib/axiosInstance";

/**
 * Get the correct options type for customRequest by inferring from UploadProps
 */
type CustomRequestOptions = Parameters<NonNullable<UploadProps["customRequest"]>>[0];

const getSasUploadUrl = async (file: File): Promise<string> => {
	const res = await api.post<{ uploadUrl: string }>("/upload", {
		filename: `${Date.now()}-${file.name}`,
		containerName: "images",
	});
	return res.data.uploadUrl;
};

const uploadToAzure = async (options: CustomRequestOptions): Promise<void> => {
	const { file, onSuccess, onError } = options;

	try {
		const rcFile = file as RcFile;
		const uploadUrl = await getSasUploadUrl(rcFile);

		const response = await fetch(uploadUrl, {
			method: "PUT",
			headers: { "x-ms-blob-type": "BlockBlob" },
			body: rcFile,
		});

		if (response.ok) {
			onSuccess?.({ url: uploadUrl.split("?")[0] });
		} else {
			throw new Error("Upload failed");
		}
	} catch (err) {
		onError?.(err as Error);
	}
};

export default uploadToAzure;
