"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Card, FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import OrdersTable from "./table";
import Timeline from "./_components/ProgressBar";
import { Content } from "antd/es/layout/layout";

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
			<FloatButton icon={<PlusOutlined />} tooltip={<div>Create New Order</div>} />
		</>
	);
};

export default Dashboard;
