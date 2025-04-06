"use client";

import { Spin } from "antd";

export default function Loading() {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100%",
				width: "100%",
				padding: "100px 0",
			}}
		>
			<Spin size="large" />
		</div>
	);
}
