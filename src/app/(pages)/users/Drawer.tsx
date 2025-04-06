import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Drawer, FloatButton } from "antd";

import AddUser from "./AddUser";

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
			<FloatButton icon={<PlusOutlined />} type="primary" style={{ right: 24, bottom: 24 }} onClick={showDrawer} />
			<Drawer title="Create a new account" width={720} onClose={onClose} open={open}>
				<AddUser />
			</Drawer>
		</>
	);
};

export default App;
