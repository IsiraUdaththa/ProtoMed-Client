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
		children: [
			{ key: "/orders/", label: "All" },
			{ key: "/orders/accuplasty", label: "Accuplasty" },
			{ key: "/orders/accupectomy", label: "Accupectomy" },
			{ key: "/orders/accufacial", label: "Accufacial" },
			{ key: "/orders/accuortho", label: "Accuortho" },
			{ key: "/orders/lamifix", label: "Lamifix" },
			{ key: "/orders/screws", label: "Screws" },
			{ key: "/orders/accumesh", label: "Accumesh" },
			{ key: "/orders/screws-and-plates", label: "Screws and plates" },
			{ key: "/orders/other", label: "Other" },
		],
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
