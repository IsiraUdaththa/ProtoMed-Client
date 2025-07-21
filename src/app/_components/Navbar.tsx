"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Modal, Flex, Space } from "antd";
import { Header } from "antd/es/layout/layout";
import Image from "next/image";
import Link from "next/link";

import { getUser } from "@/services/auth.service";

const Navbar: React.FC = () => {
	const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

	const user = getUser();

	return (
		<>
			<Header
				style={{
					backgroundColor: "#fff",
					padding: "0px 20px 0px 20px",
					borderBottom: "1px solid #f0f0f0",
					height: "55px",
				}}
			>
				<Flex align="center" justify="space-between" style={{ height: "100%" }}>
					<Link href="/dashboard">
						<Image src="/logo.png" alt="Logo" width={121} height={30} />
					</Link>
					<Space>
						<span>{user?.name}</span>
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
					<strong>Name:</strong> {user?.name}
				</p>
				<p>
					<strong>Email:</strong> {user?.email}
				</p>
				<p>
					<strong>Role:</strong> {user?.roles}
				</p>
			</Modal>
		</>
	);
};

export default Navbar;
