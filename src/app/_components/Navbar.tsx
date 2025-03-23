"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState, useEffect } from "react";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Modal, Flex, Space } from "antd";
import { Header } from "antd/es/layout/layout";

const Navbar: React.FC = () => {
	const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<>
			<Header
				style={{ backgroundColor: "#fff", padding: "0px 55px 0px 20px", borderBottom: "1px solid #f0f0f0", height: "55px" }}
			>
				<Flex align="center" justify="space-between" style={{ height: "100%" }}>
					<img src="/logo.png" alt="Logo" style={{ height: "30px" }} />
					<Space>
						<span>John Doe</span>
						<Avatar icon={<UserOutlined />} onClick={() => setIsProfileModalVisible(true)} />
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

export default Navbar;
