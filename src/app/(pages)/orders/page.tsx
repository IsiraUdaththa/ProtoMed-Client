"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";
import { Layout, Avatar, Modal, Flex, Space, Card, Steps, Badge, Drawer, Button, FloatButton } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import MySider from "../../_components/Sidebar";
import OrdersTable from "./table";
import Timeline from "./_components/ProgressBar";
import Header from "../../_components/Navbar";
import Footer from "../../_components/Footer";
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
