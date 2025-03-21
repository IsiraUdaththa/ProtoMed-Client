import React from "react";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const items: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Value",
		children: "$ 1600",
	},
	{
		key: "2",
		label: "Date",
		children: "2025-05-02",
	},
	{
		key: "3",
		label: "Valued By",
		children: "Abcd",
	},
];

const items2: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Value",
		children: "$ 800",
	},
	{
		key: "2",
		label: "Date",
		children: "2025-05-02",
	},
	{
		key: "3",
		label: "Valued By",
		children: "Abcd",
	},
];

const App: React.FC = () => (
	<>
		<Descriptions title="Quotation" items={items} />
		<br />
		<Descriptions title="Advance" items={items2} />
	</>
);

export default App;
