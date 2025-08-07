"use client";

import React, { useEffect, useState } from "react";
import { Alert, Descriptions, Divider, Spin } from "antd";
import { Image } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface PackingData {
	packedBy: string;
	createdAt: Date;
	finalImplantVideo: string;
	finalImplantPicture: string;
	finalPackPicture: string;
}

const App: React.FC<{ orderId: string }> = ({ orderId }) => {
	const [data, setData] = useState<PackingData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await api.get(`orders/${orderId}/packing`);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching order data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	if (loading) return <Spin size="large" />;
	if (!data) return <Alert message="No order details available." type="info" showIcon />;

	return (
		<>
			<Descriptions
				items={[
					{ label: "Packed By", children: data.packedBy ? <UserTag userId={data.packedBy} /> : "N/A" },
					{
						label: "Packed Date",
						children: data.createdAt ? <DateDisplay isoDate={data.createdAt} /> : "N/A",
					},
				]}
			/>
			<Divider />

			<Image
				width={200}
				preview={
					data.finalImplantVideo
						? {
								destroyOnClose: true,
								imageRender: () => <video muted height="100%" controls src={data.finalImplantVideo} />,
								toolbarRender: () => null,
								mask: "Final Implant Video",
							}
						: false
				}
				src="Video"
				fallback="https://placehold.co/200x200?text=Not+available"
				alt=""
			/>
			<Image
				width={200}
				alt="Implant Picture"
				src={data.finalImplantPicture}
				fallback="https://placehold.co/200x200?text=Not+available"
				preview={
					data.finalImplantPicture
						? {
								visible: data.finalImplantPicture ? true : false,
								mask: "Final Implant Picture",
							}
						: false
				}
			/>
			<Image
				width={200}
				alt="Final Pack Picture"
				src={data.finalPackPicture}
				fallback="https://placehold.co/200x200?text=Not+available"
				preview={
					data.finalPackPicture
						? {
								visible: data.finalPackPicture ? true : false,
								mask: "Final Pack Picture",
							}
						: false
				}
			/>
		</>
	);
};

export default App;
