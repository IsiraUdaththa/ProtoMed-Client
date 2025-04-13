import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Card, Collapse, Divider, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import Patient from "./Patient";
import CTScan from "./CTScan";
import CTValidation from "./CTValidation";
import Quotation from "./Quotation";
import PaymentAdvance from "./PaymentAdvance";
import DesignSubmit from "./DesignSubmit";
import DesignApproval from "./DesignApproval";
import PLAFlapPrint from "./PLAFlapPrint";
import PEEKAnnealing from "./PEEKAnnealing";
import PEEKRoughPolishing from "./PEEKRoughPolishing";
import PEEKApprove from "./PEEKApprove";
import PEEKLaserMarking from "./PEEKLaserMarking";
import PEEKFinalPolishing from "./PEEKFinalPolishing";
import Packing from "./Packing";
import PaymentCompletion from "./PaymentCompletion";
import Invoice from "./Invoice";

import useRole from "../forms/hooks/userole"; // Import role hook
import { login } from "@/services/authService";

login("admin@example.com", "password");

const Jobs: React.FC<{ orderId: string }> = ({ orderId }) => {
	const { hasRole } = useRole();

	const onChange = (key: string | string[]) => {
		console.log(key);
	};

	const genExtra = () => (
		<Space>
			<EditOutlined onClick={(event) => event.stopPropagation()} />
			<DeleteOutlined />
		</Space>
	);

	const items = [
		{
			key: "1",
			label: "Patient Details",
			children: (
				<Card>
					<Patient orderId={orderId} />,
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "2",
			label: "CT Scan Details",
			children: (
				<>
					<Card>
						<CTScan orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<CTValidation orderId={orderId} />
					</Card>
				</>
			),
			extra: genExtra(),
		},
		{
			key: "4",
			label: "Quotation & Payment",
			children: (
				<>
					<Card>
						<Quotation orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<PaymentAdvance orderId={orderId} />
					</Card>
				</>
			),
			extra: genExtra(),
		},
		{
			key: "5",
			label: "Design Attempts",
			children: (
				<>
					<Card>
						<DesignSubmit orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<DesignApproval orderId={orderId} />
					</Card>
				</>
			),
			extra: genExtra(),
		},
		{
			key: "6",
			label: "PLA Print Details",
			children: (
				<Card>
					<PLAFlapPrint orderId={orderId} />
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "7",
			label: "Peek Print Details",
			children: (
				<>
					<Card>
						<PEEKAnnealing orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<PEEKRoughPolishing orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<PEEKApprove orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<PEEKLaserMarking orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<PEEKFinalPolishing orderId={orderId} />
					</Card>
				</>
			),
			extra: genExtra(),
		},
		{
			key: "8",
			label: "Packing Details",
			children: (
				<Card>
					<Packing orderId={orderId} />,
				</Card>
			),
			extra: genExtra(),
		},
		{
			key: "9",
			label: "Final Payment and Invoice",
			children: (
				<>
					<Card>
						<PaymentCompletion orderId={orderId} />
					</Card>
					<Divider />
					<Card>
						<Invoice orderId={orderId} />
					</Card>
				</>
			),
			extra: genExtra(),
		},
	];

	return <Collapse ghost onChange={onChange} items={items} defaultActiveKey={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />;
};

export default Jobs;
