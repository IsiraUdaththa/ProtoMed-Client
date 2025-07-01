"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { Card } from "antd";

import UsersList from "./UsersList";
import AddUserDrawer from "./Drawer";

const App: React.FC = () => {
	return (
		<>
			<Card>
				<UsersList />
			</Card>
			<AddUserDrawer/>
		</>
	);
};

export default App;
