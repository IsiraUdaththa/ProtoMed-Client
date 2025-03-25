"use client";

import { useParams } from "next/navigation";
import Steps from "../_components/ProgressBar";
import { Breadcrumb, Tabs } from "antd";
import Details from "../_components/views/All";
import Jobs from "../_components/forms/All";
import Link from "next/link";

export default function OrderDetailsPage() {
	const params = useParams();
	console.log(params);
	return (
		<>
			<Breadcrumb
				items={[
					{
						title: <Link href="/orders">Orders</Link>,
					},
					{
						title: params.id,
					},
				]}
			/>
			<h2>Order number: {params.id}</h2>
			Basic Info. 
			Lasts Updated, etc... 
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
						children: <Jobs />,
					},
					{
						key: "Orders",
						label: "Details",
						children: <Details />,
					},
				]}
			/>

			<br />
		</>
	);
}
