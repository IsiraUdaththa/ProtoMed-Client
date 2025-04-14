"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Card } from "antd";
import "antd/dist/reset.css";
import OrdersTable from "./table";
import Timeline from "./_components/ProgressBar";
import { Content } from "antd/es/layout/layout";
import AddPatientDrawer from "./Drawer"

const Dashboard: React.FC = () => {
	return (
		<>
			<Content>
				<Timeline />
				<br />
				<Card>
					<OrdersTable />
				</Card>
			</Content>
			<AddPatientDrawer />
		</>
	);
};

export default Dashboard;
