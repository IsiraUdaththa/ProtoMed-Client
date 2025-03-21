"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";
import { Layout, Avatar, Modal, Flex, Space, Card, Steps, Badge, Drawer } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import MySider from "../../_components/Sidebar";
import OrdersTable from "./table";
import Timeline from "./_components/ProgressBar";
import Header from "../../_components/Navbar";
import Footer from "../../_components/Footer";
import { Content } from "antd/es/layout/layout";

const Dashboard: React.FC = () => {
	const [patients, setPatients] = useState([]);

	useEffect(() => {
		fetch("http://localhost:5000/orders")
			.then((res) => res.json())
			.then((data) => setPatients(data))
			.catch((err) => console.error("Error fetching patient data:", err));
	}, []);

	const patientColumns = [
		{ title: "ID", dataIndex: "id", key: "id" },
		{ title: "Name", dataIndex: "name", key: "name" },
		{ title: "Status", dataIndex: "status", key: "status" },
	];

	return (
		<>
			<Content>
				<Timeline />
				<br />
				{/* <Flex justify="flex-end">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              Add
            </Button>
          </Flex>
          <br /> */}
				<Card>
					<OrdersTable />
				</Card>
			</Content>

			{/* <Modal title="Add New Patient" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
					<RegistrationForm onClose={() => setIsModalVisible(false)} />
				</Modal> */}
		</>
	);
};

export default Dashboard;
