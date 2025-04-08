import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Collapse, Divider, Space } from "antd";
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

interface JobsProps {
	orderId: string;
}

const Jobs: React.FC<JobsProps> = ({ orderId }) => {
	login("admin@example.com", "password");

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
		hasRole(["admin", "designer"]) && {
			key: "1",
			label: "Patient Details",
			children: <Patient orderId={orderId} />,
			extra: genExtra(),
		},
		hasRole(["admin", "designer"]) && {
			key: "2",
			label: "CT Scan Details",
			children: (
				<>
					<CTScan orderId={orderId} />
					<Divider />
					<CTValidation orderId={orderId} />
				</>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "finance"]) && {
			key: "4",
			label: "Quotation & Payment",
			children: (
				<>
					<Quotation orderId={orderId} />
					<Divider />
					<PaymentAdvance orderId={orderId}
					/>
				</>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "designer"]) && {
			key: "5",
			label: "Design Attempts",
			children: (
				<>
					<DesignSubmit orderId={orderId}
					/>
					<DesignApproval orderId={orderId}
					/>
				</>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "designer"]) && {
			key: "6",
			label: "PLA Print Details",
			children: (
				<PLAFlapPrint orderId={orderId}
				/>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "designer"]) && {
			key: "7",
			label: "Peek Print Details",
			children: (
				<>
					<PEEKAnnealing orderId={orderId}
					/>
					<Divider />
					<PEEKRoughPolishing orderId={orderId}
					/>
					<Divider />
					<PEEKApprove orderId={orderId}
					/>
					<Divider />
					<PEEKLaserMarking orderId={orderId}
					/>
					<Divider />
					<PEEKFinalPolishing orderId={orderId}
					/>
				</>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "packing"]) && {
			key: "8",
			label: "Packing Details",
			children: (
				<Packing orderId={orderId}
				/>
			),
			extra: genExtra(),
		},
		hasRole(["admin", "finance"]) && {
			key: "9",
			label: "Final Payment and Invoice",
			children: (
				<>
					<PaymentCompletion orderId={orderId}
					/>
					<Invoice orderId={orderId}
					/>
				</>
			),
			extra: genExtra(),
		},
	].filter(Boolean);

	return <Collapse ghost onChange={onChange} items={items} />;
};

export default Jobs;
