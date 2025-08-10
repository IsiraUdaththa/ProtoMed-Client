"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Breadcrumb, Card } from "antd";
import Link from "next/link";

import UsersList from "./UsersList";
import AddUserDrawer from "./Drawer";

const App: React.FC = () => {
	return (
		<>
			<Breadcrumb
				style={{ marginLeft: 5, marginBottom: 15 }}
				items={[
					{
						title: <Link href="/users">Users</Link>,
					},
					{
						title: "All",
					},
				]}
			/>
			<Card>
				<UsersList />
			</Card>
			<AddUserDrawer />
		</>
	);
};

export default App;
