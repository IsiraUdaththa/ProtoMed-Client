"use client";

import React from "react";
import { AppstoreOutlined, DashboardOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import type { GetProp, MenuProps } from "antd";
import { Menu } from "antd";
import { useRouter } from "next/navigation";

type MenuItem = GetProp<MenuProps, "items">[number];

const items: MenuItem[] = [
	{
		key: "/dashboard",
		icon: <DashboardOutlined />,
		label: "Dashboard",
	},

	{
		key: "/orders",
		label: "Orders",
		icon: <AppstoreOutlined />,
	},
	{
		key: "/users",
		icon: <UserOutlined />,
		label: "Users",
	},
	{
		key: "/settings",
		icon: <SettingOutlined />,
		label: "Settings",
	},
];

const Sidebar: React.FC = () => {
	const router = useRouter();

	const handleMenuClick = (e: { key: string }) => {
		router.push(e.key);
	};

	return (
		<>
			<Menu
				mode="vertical"
				style={{ height: "100%", backgroundColor: "transparent" }}
				items={items}
				onClick={handleMenuClick}
			/>
		</>
	);
};

export default Sidebar;
