"use client";

import React from "react";
import { Layout } from "antd";
import SidebarMenu from "../_components/Sidebar";
import Header from "../_components/Navbar";
import Footer from "../_components/Footer";

const { Sider, Content } = Layout;

export default function PagesLayout({ children }: { children: React.ReactNode }) {
	return (
		<Layout style={{ height: "100vh" }}>
			<Header />
			<Layout style={{ background: "linear-gradient(to bottom, white,10%, #f5f5f5)" }}>
				<Sider width={256} style={{ background: "linear-gradient(to bottom, white, 10%, #f5f5f5)" }}>
					<SidebarMenu />
				</Sider>
				<Content style={{ padding: "30px", overflow: "auto" }}>
					{children}
					<Footer />
				</Content>
			</Layout>
		</Layout>
	);
}
