"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import SidebarMenu from "../_components/Sidebar";
import Header from "../_components/Navbar";
import Footer from "../_components/Footer";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function PagesLayout({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Layout style={{ height: "100vh" }}>
			<Header />
			<Layout style={{ background: "linear-gradient(to bottom, white,10%, #f5f5f5)" }}>
				<Sider
					breakpoint="lg"
					collapsedWidth="0"
					width={256}
					style={{ background: "linear-gradient(to bottom, white, 10%, #f5f5f5)" }}
				>
					<SidebarMenu />
				</Sider>
				<Content style={{ padding: "40px", overflow: "auto" }}>
					{children}
					<Footer />
				</Content>
			</Layout>
		</Layout>
	);
}
