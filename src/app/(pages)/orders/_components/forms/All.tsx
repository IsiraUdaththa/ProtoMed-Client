"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Collapse, Divider, Select, Space } from "antd";
import Patient from "./Patient";
import CTScan from "./CTScan";
import CTValidation from "./CTValidation";
import DesignSubmit from "./DesignSubmit"
import DesignApproval from "./DesignApproval";
import Advance from "./Quotation";
import Packing from "./Packing";
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
			children: <Patient />,
			extra: genExtra(),
		},
		{
			key: "2",
			label: "CT Scan Details",
			children: (
				<>
					<CTScan />
					<Divider /> <CTValidation />
				</>
			),
			extra: genExtra(),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: <Advance />,
			extra: genExtra(),
		},
		{
			key: "5",
			label: "Design Attemps",
			children: <><DesignSubmit/><DesignApproval/></>,
			extra: genExtra(),
		},
		{
			key: "6",
			label: "PLA Print Details",
			// children: <><PLAOuter/><PLAFlap/></>,
			extra: genExtra(),
		},
		{
			key: "7",
			label: "Peek Print Details",
			// children: <Peek/>,
			extra: genExtra(),
		},
		{
			key: "8",
			label: "Packing Details",
			children: <Packing />,
			extra: genExtra(),
		},
		{
			key: "9",
			label: "Final Payment and Invoice",
			// children: <Invoice/>,
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
