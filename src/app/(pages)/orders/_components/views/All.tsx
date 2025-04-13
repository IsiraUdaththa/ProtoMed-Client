"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Card, Collapse, Space } from "antd";
import Patient from "./Patient";
import CTScan from "./CTScan";
import Design from "./Design";
import Advance from "./Quotation";
import PLAOuter from "./PLAOuter";
import PLAFlap from "./PLAFlap";
import Peek from "./Peek";
import Packing from "./Packing";
import Invoice from "./Payment";

const Details: React.FC<{ orderId: string }> = ({ orderId }) => {
	const genExtra = () => (
		<Space>
			<EditOutlined onClick={(event) => event.stopPropagation()} />
			<DeleteOutlined />
		</Space>
	);

	const items: CollapseProps["items"] = [
		{
			key: "1",
			label: "Patient Details",
			children: (
				<Card>
					<Patient orderId={orderId} />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "2",
			label: "CT Scan Details",
			children: (
				<Card>
					<CTScan orderId={orderId} />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: (
				<Card>
					<Advance //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "5",
			label: "Design Attempts",
			children: (
				<Card>
					<Design //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "6",
			label: "PLA Print Details",
			children: (
				<Card>
					<PLAOuter //orderId={orderId}
					/>
					<PLAFlap //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "7",
			label: "Peek Print Details",
			children: (
				<Card>
					<Peek //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "8",
			label: "Packing Details",
			children: (
				<Card>
					<Packing //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "9",
			label: "Final Payment and Invoice",
			children: (
				<Card>
					<Invoice //orderId={orderId}
					/>
				</Card>
			),
			extra: genExtra(),
		},
	];

	return <Collapse ghost items={items} />;
};

export default Details;
