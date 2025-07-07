"use client";
import "@ant-design/v5-patch-for-react-19";

import React from "react";
import type { CollapseProps } from "antd";
import { Card, Collapse, Space } from "antd";

import Patient from "./Patient";
import CTScan from "./CTScan";
import Design from "./Design";
import Quotation from "./Quotation";
import Advance from "./PaymentAdvance";
import PLA from "./PLA";
import Peek from "./Peek";
import Packing from "./Packing";
import Payment from "./Payment";
import Invoice from "./Invoice";
import CTValidation from "./CTValidation";

const Details: React.FC<{ orderId: string }> = ({ orderId }) => {
	const items: CollapseProps["items"] = [
		{
			key: "1",
			label: "Patient Details",
			children: (
				<Card>
					<Patient orderId={orderId} />
				</Card>
			),
		},
		{
			key: "2",
			label: "CT Scan Details",
			children: (
				<Space direction="vertical">
					<Card>
						<CTScan orderId={orderId} />
					</Card>
					<Card>
						<CTValidation orderId={orderId} />
					</Card>
				</Space>
			),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: (
				<Space direction="vertical">
					<Card>
						<Quotation orderId={orderId} />
					</Card>
					<Card>
						<Advance orderId={orderId} />
					</Card>
				</Space>
			),
		},
		{
			key: "5",
			label: "Design Attempts",
			children: (
				<Card>
					<Design orderId={orderId} />
				</Card>
			),
		},
		{
			key: "6",
			label: "PLA Print Details",
			children: (
				<Card>
					<PLA orderId={orderId} />
				</Card>
			),
		},
		{
			key: "7",
			label: "Peek Print Details",
			children: (
				<Card>
					<Peek orderId={orderId} />
				</Card>
			),
		},
		{
			key: "8",
			label: "Packing Details",
			children: (
				<Card>
					<Packing orderId={orderId} />
				</Card>
			),
		},
		{
			key: "9",
			label: "Final Payment",
			children: (
				<Card>
					<Payment orderId={orderId} />
				</Card>
			),
		},
		{
			key: "10",
			label: "Invoice",
			children: (
				<Card>
					<Invoice orderId={orderId} />
				</Card>
			),
		},
	];

	return <Collapse ghost items={items} />;
};

export default Details;
