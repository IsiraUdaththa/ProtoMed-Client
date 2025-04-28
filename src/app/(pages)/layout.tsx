"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import SidebarMenu from "../_components/Sidebar";
import Header from "../_components/Navbar";
import Footer from "../_components/Footer";
import Loading from "../loading";

const { Sider, Content } = Layout;

export default function PagesLayout({ children }: { children: React.ReactNode }) {
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return <Loading />;
	}

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
				<Content style={{ padding: "1%", overflow: "auto" }}>
					{children}
					<Footer />
				</Content>
			</Layout>
		</Layout>
	);
}
