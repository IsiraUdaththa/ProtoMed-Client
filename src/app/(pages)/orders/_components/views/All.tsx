"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Card, Collapse, Select, Space } from "antd";
import Patient from "./Patient";
import CTScan from "./CTScan";
import Design from "./Design";
import Advance from "./Quotation";
import PLAOuter from "./PLAOuter";
import PLAFlap from "./PLAFlap";
import Peek from "./Peek";
import Packing from "./Packing";
import Invoice from "./Payment";
const { Option } = Select;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const App: React.FC = () => {
	const onChange = (key: string | string[]) => {
		console.log(key);
	};

	const genExtra = () => (
		<>
			<Space>
				<EditOutlined
					onClick={(event) => {
						// If you don't want click extra trigger collapse, you can prevent this:
						event.stopPropagation();
					}}
				/>
				<DeleteOutlined />
			</Space>
		</>
	);

	const items: CollapseProps["items"] = [
		{
			key: "1",
			label: "Patient Details",
			children: (
				<Card>
					<Patient />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "2",
			label: "CT Scan Details",
			children: (
				<Card>
					<CTScan />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: (
				<Card>
					<Advance />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "5",
			label: "Design Attemps",
			children: (
				<Card>
					<Design />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "6",
			label: "PLA Print Details",
			children: (
				<Card>
					<PLAOuter />
					<PLAFlap />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "7",
			label: "Peek Print Details",
			children: (
				<Card>
					<Peek />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "8",
			label: "Packing Details",
			children: (
				<Card>
					<Packing />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "9",
			label: "Final Payment and Invoice",
			children: (
				<Card>
					<Invoice />
				</Card>
			),
			extra: genExtra(),
		},
	];

	return (
		<>
			<Collapse ghost onChange={onChange} items={items} />
		</>
	);
};

export default App;
