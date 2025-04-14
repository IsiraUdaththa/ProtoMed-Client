import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Drawer, FloatButton } from "antd";

import RegistrationForm from "./_components/forms/Patient";

const App: React.FC = () => {
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<FloatButton icon={<PlusOutlined />} type="primary" style={{ right: 24, bottom: 24 }} onClick={showDrawer} tooltip={<div>Create New Order</div>}/>
			<Drawer title="Create a new order" width={720} onClose={onClose} open={open}>
				<RegistrationForm orderId="" />
			</Drawer>
		</>
	);
};

export default App;
