import React from "react";
import { Badge, Button, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const items: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Print Machine",
		children: "Bambu Lab A1 Mini, P1P",
	},
	{
		key: "2",
		label: "Date",
		children: "2024-08-12",
	},
	{
		key: "3",
		label: "Operated By",
		children: "Name",
	},
	{
		key: "4",
		label: "Material Usage",
		children: "150 g",
	},
	{
		key: "5",
		label: "Color",
		children: "White",
	},
	{
		key: "6",
		label: "Print Time",
		children: "120 min",
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
		<Descriptions items={items} />
		TODO: - [ ] QC Docs - [ ] QC design doc outer #ask - [ ] QC measure values doc outer #ask
		<Button icon={<DownloadOutlined />} href="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg">
			Download QC Docs????
		</Button>
		<Divider />
		<Descriptions items={items2} />
	</>
);

export default App;
