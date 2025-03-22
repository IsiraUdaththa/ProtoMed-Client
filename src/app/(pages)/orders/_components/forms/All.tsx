"use client";
import "@ant-design/v5-patch-for-react-19";

import React, { useState } from "react";
import { DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Collapse, Divider, Select, Space } from "antd";

import Patient from "./Patient";
import CTScan from "./CTScan";
import CTValidation from "./CTValidation";
import Quotation from "./Quotation";
import PaymentAdvance from "./PaymentAdvance";
import DesignSubmit from "./DesignSubmit";
import DesignApproval from "./DesignApproval";
// import PLAOuterPrint from "./PLAOuterPrint"
// import PLAOuterApproval from "./PLAOuterApproval"
import PLAFlapPrint from "./PLAFlapPrint";
// import PLAApproval from "./PLAApproval"
// import PEEKPrint from "./PEEKPrint";
import PEEKAnnealing from "./PEEKAnnealing";
import PEEKRoughPolishing from "./PEEKRoughPolishing";
import PEEKApprove from "./PEEKApprove";
import PEEKLaserMarking from "./PEEKLaserMarking";
import PEEKFinalPolishing from "./PEEKFinalPolishing";
import Packing from "./Packing";
import PaymentCompletion from "./PaymentCompletion";
import Invoice from "./Invoice";
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
					<Divider />
					<CTValidation />
				</>
			),
			extra: genExtra(),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: (
				<>
					<Quotation />
					<Divider />
					<PaymentAdvance />
				</>
			),
			extra: genExtra(),
		},
		{
			key: "5",
			label: "Design Attemps",
			children: (
				<>
					<DesignSubmit />
					<DesignApproval />
				</>
			),
			extra: genExtra(),
		},
		{
			key: "6",
			label: "PLA Print Details",
			children: (
				<>
					<PLAFlapPrint />
				</>
			),
			extra: genExtra(),
		},
		{
			key: "7",
			label: "Peek Print Details",
			children: (
				<>
					<PEEKAnnealing />
					<Divider />
					<PEEKRoughPolishing />
					<Divider />
					<PEEKApprove />
					<Divider />
					<PEEKLaserMarking />
					<Divider />
					<PEEKFinalPolishing />
				</>
			),
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
			children: (
				<>
					<PaymentCompletion />
					<Invoice />
				</>
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
