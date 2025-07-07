"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Breadcrumb, Card } from "antd";
import "antd/dist/reset.css";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";

import AddPatientDrawer from "./Drawer";
import OrdersTable from "./table";

const Dashboard: React.FC = () => {
	return (
		<>
			<Content>
				<Breadcrumb style={{marginLeft: 5, marginBottom:5}}
					items={[
						{
							title: <Link href="/orders">Orders/</Link>,
						},
					]}
				/>
				<Card>
					<OrdersTable />
				</Card>
			</Content>
			<AddPatientDrawer />
		</>
	);
};

export default Dashboard;
