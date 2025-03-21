import React from "react";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const items: DescriptionsProps["items"] = [
	{
		key: "1",
		label: "Name",
		children: "John Doe",
	},
	{
		key: "2",
		label: "Age",
		children: "45",
	},
	{
		key: "3",
		label: "Gender",
		children: "Male",
	},
	{
		key: "4",
		label: "Contact Number",
		children: "+94 (71) 123 4567",
	},
	{
		key: "5",
		label: "Address",
		children: "123 Street, City, Country",
	},
	{
		key: "6",
		label: "Category",
		children: "Accuplasty",
	},
	{
		key: "7",
		label: "CT Scan Method",
		children: "Google Drive Upload",
	},
	{
		key: "8",
		label: "Hospital",
		children: "Kandy Main Hospital",
	},
	{
		key: "9",
		label: "Ward",
		children: "5",
	},
	{
		key: "10",
		label: "Planned Surgery Date",
		children: "2025-04-01",
	},
	{
		key: "11",
		label: "Comment",
		children: "Urgent order",
	},
	{
		key: "12",
		label: "Registred By",
		children: "Name",
	},
];

const App: React.FC = () => <Descriptions items={items}/>;

export default App;
