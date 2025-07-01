"use client";

import React, { useEffect, useState } from "react";
import { Alert, Descriptions, Divider, Spin } from "antd";
import { Image } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface PackingData {
	packedBy: string;
	packedDate: string;
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
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data.packing);
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
					{ label: "Packed By", children: <UserTag userId={data.packedBy} /> },
					{ label: "Packed Date", children: <DateDisplay isoDate={data.packedDate} /> },
				]}
			/>
			<Divider />

			<Image
				width={200}
				preview={{
					destroyOnClose: true,
					imageRender: () => <video muted height="100%" controls src={data.finalImplantVideo} />,
					toolbarRender: () => null,
				}}
				src="Video"
				fallback="https://placehold.co/200x200/aaf/fff?text=thumbnail"
				alt=""
			/>
			<Image width={200} alt="Implant Picture" src={data.finalImplantPicture} />
			<Image width={200} alt="Final Pack Picture" src={data.finalPackPicture} />
		</>
	);
};

export default App;
