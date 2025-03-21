import React from "react";
import { Badge, Button, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import { Image } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const items: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Date",
		children: "2024-08-12",
	},
	{
		key: "2",
		label: "Desinged By",
		children: "Name",
	},
];

const items2: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Status",
		children: <Badge count="Approved" style={{ backgroundColor: "#52c41a" }} />,
	},
	{
		key: "2",
		label: "Date",
		children: "2024-08-12",
	},
	{
		key: "3",
		label: "Approved By",
		children: "ADSADD",
	},
	{
		key: "4",
		label: "Comment",
		children:
			"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla conseq",
	},
];

const App: React.FC = () => (
	<>
		<Descriptions title="Design Attempt No. 1" items={items} />
		<br />
		<Button icon={<DownloadOutlined />} href="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">
			Download Design
		</Button>
		<Divider />

		<Descriptions items={items2} />
	</>
);

export default App;
