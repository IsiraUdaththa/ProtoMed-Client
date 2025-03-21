import React from "react";
import { Badge, Button, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import { Image } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const items: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Status",
		children: <Badge count="Received" style={{ backgroundColor: "#52c41a" }} />,
	},
	{
		key: "2",
		label: "Date",
		children: "2024-08-12",
	},
	{
		key: "3",
		label: "Verified By",
		children: "Name",
	},
];

const items2: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Invoice No",
		children: "654654",
	},
	{
		key: "2",
		label: "Date",
		children: "2024-08-12",
	},
	{
		key: "3",
		label: "Send By",
		children: "ADSADD",
	},
];

const App: React.FC = () => (
	<>
		<Descriptions items={items} />
		<Divider />
		<Descriptions items={items2} />
	</>
);

export default App;
