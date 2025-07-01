"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Card } from "antd";
import "antd/dist/reset.css";
import { Content } from "antd/es/layout/layout";

import OrdersTable from "./table";
import AddPatientDrawer from "./Drawer";

const Dashboard: React.FC = () => {
	return (
		<>
			<Content>
				<Card>
					<OrdersTable />
				</Card>
			</Content>
			<AddPatientDrawer />
		</>
	);
};

export default Dashboard;
