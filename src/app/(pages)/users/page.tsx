"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { Card } from "antd";
import UsersList from "./UsersList";

const App: React.FC = () => {
	return (
		<>
			<Card>
				<UsersList />
			</Card>
		</>
	);
};

export default App;
