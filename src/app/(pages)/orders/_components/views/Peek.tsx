import React from "react";
import { Badge, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";

const items_print: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Printing Machine",
		children: "Creatbot PEEK-250",
	},
	{
		key: "2",
		label: "Date",
		children: "2025-05-05",
	},
	{
		key: "3",
		label: "Desinged By",
		children: "Name",
	},
	{
		key: "4",
		label: "Material",
		children: "<Material> <Batch No>",
	},
	{
		key: "5",
		label: "Material Usage",
		children: "200 g",
	},
	{
		key: "6",
		label: "Material Waste",
		children: "200 g",
	},
];

const items_annealing: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Date",
		children: "2024-08-15",
	},
	{
		key: "2",
		label: "Done By",
		children: "Abc",
	},
];

const items_polishing: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Date",
		children: "2024-08-15",
	},
	{
		key: "2",
		label: "Done By",
		children: "Abc",
	},
];

const items_approve: DescriptionsProps["items"] = [
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

const items_laser: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Date",
		children: "2024-08-15",
	},
	{
		key: "2",
		label: "Done By",
		children: "Abc",
	},
];

const items_final_polish: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Date",
		children: "2024-08-15",
	},
	{
		key: "2",
		label: "Done By",
		children: "Abc",
	},
];

const App: React.FC = () => (
	<>
		<Descriptions title="Print" items={items_print} />
		<Divider />
		<Descriptions title="Annealing" items={items_annealing} />
		TODO: Add Screw hole size
		<Divider />
		<Descriptions title="Rough Polish" items={items_polishing} />
		<Divider />
		<Descriptions title="Approval" items={items_approve} />
		<Divider />
		<Descriptions title="Laser Marking" items={items_laser} />
		<Divider />
		<Descriptions title="Final Polish" items={items_final_polish} />
	</>
);

export default App;
