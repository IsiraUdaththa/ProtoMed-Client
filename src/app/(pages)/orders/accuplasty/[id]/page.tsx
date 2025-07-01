"use client";

import { useParams } from "next/navigation";
import { Breadcrumb, Tabs } from "antd";

import Steps from "../../_components/ProgressBar";

export default function OrderDetailsPage() {
	const params = useParams();
	console.log(params);
	return (
		<>
			<Breadcrumb
				items={[
					{
						title: "Orders",
						href: "/orders",
					},
					{
						title: "Accuplasty",
						href: "/orders/accuplasty",
					},
					{
						title: ":id",
						href: "",
					},
				]}
				params={{ id: params["id"] }}
			/>
			<h2>Order number: {params["id"]}</h2>
			Basic Info. Lasts Updated, etc...
			<br />
			<br />
			{/* <Patient/> */}
			<Steps />
			<Tabs
				defaultActiveKey="1"
				items={[
					{
						key: "1",
						label: "My Jobs",
						// children: <Jobs />,
					},
					{
						key: "Orders",
						label: "Details",
						// children: <Details />,
					},
				]}
			/>
			<br />
		</>
	);
}
