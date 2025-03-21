"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Modal, Flex, Space } from "antd";
import { Header } from "antd/es/layout/layout";

const App: React.FC = () => {
	const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<>
			<Header style={{ backgroundColor: "#fff", padding: "0px 20px" }}>
				<Flex justify="space-between" align="center">
					<img src="/logo.png" alt="Logo" style={{ height: "40px" }} />
					<Space>
						<span>John Doe</span>
						<Avatar size="large" icon={<UserOutlined />} onClick={() => setIsProfileModalVisible(true)} />
					</Space>
				</Flex>
			</Header>

			<Modal
				title="Profile Information"
				open={isProfileModalVisible}
				onCancel={() => setIsProfileModalVisible(false)}
				footer={null}
			>
				<p>
					<strong>Name:</strong> John Doe
				</p>
				<p>
					<strong>Email:</strong> johndoe@example.com
				</p>
				<p>
					<strong>Role:</strong> Administrator
				</p>
			</Modal>
		</>
	);
};

export default App;
