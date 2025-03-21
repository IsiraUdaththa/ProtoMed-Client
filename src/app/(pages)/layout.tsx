"use client";

import React from "react";
import { Layout } from "antd";
import SidebarMenu from "../components/sidemenu";
import Header from "../components/header";
import Footer from "../components/footer";

const { Sider, Content } = Layout;

export default function PagesLayout({ children }: { children: React.ReactNode }) {
	return (
		<Layout style={{ height: "100vh" }}>
			<Header />
			<Layout>
				<SidebarMenu />
				<Content style={{ padding: "10px", overflow: "auto" }}>{children}</Content>
			</Layout>
			<Footer />
		</Layout>
	);
}
