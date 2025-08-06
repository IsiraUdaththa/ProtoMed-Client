"use client";

// import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Card, Alert, Space, Result } from "antd";
// Import all individual form components
import { SmileOutlined } from "@ant-design/icons";

import Design from "../views/Design";
import CTValidationView from "../views/CTValidation";

import Patient from "./Patient";
import CTScan from "./CTScan";
import CTValidation from "./CTValidation";
import Quotation from "./Quotation";
import PaymentAdvance from "./PaymentAdvance";
import DesignImage from "./DesignImage";
import DesignQCDocs from "./DesignQCDocs";
import DesignFile from "./DesignFile";
import DesignApproval from "./DesignApproval";
import PLAFlapPrint from "./PLAFlapPrint";
import PLAOuterPrint from "./PLAOuterPrint";
import PLAApproval from "./PLAApproval";
import PLAQCDocs from "./PLAQCDocs";
import PEEKPrint from "./PEEKPrint";
import PEEKAnnealing from "./PEEKAnnealing";
import PEEKRoughPolishing from "./PEEKRoughPolishing";
import PEEKQCDocs from "./PEEKQCDocs";
import PEEKApprove from "./PEEKApprove";
import PEEKLaserMarking from "./PEEKLaserMarking";
import PEEKFinalPolishing from "./PEEKFinalPolishing";
import Packing from "./Packing";
import PaymentCompletion from "./PaymentCompletion";
import Invoice from "./Invoice";

// Function to render the appropriate form based on status
const ActiveForm: React.FC<{ orderId: string; status: string }> = ({ orderId, status }) => {
	const renderForm = () => {
		switch (status) {
			case "draft":
				return (
					<Card>
						<Patient orderId={orderId} />
					</Card>
				);

			case "scanUpload":
				return (
					<Card>
						<CTScan orderId={orderId} />
					</Card>
				);

			case "scanValidation":
				return (
					<Card>
						<CTValidation orderId={orderId} />
					</Card>
				);

			case "quotation":
				return (
					<Space direction="vertical">
						<Card>
							<CTValidationView orderId={orderId} />
						</Card>
						<Card>
							<Quotation orderId={orderId} />
						</Card>
					</Space>
				);

			case "advancePayment":
				return (
					<Card>
						<PaymentAdvance orderId={orderId} />
					</Card>
				);

			case "designImages":
				return (
					<Card>
						<DesignImage orderId={orderId} />
					</Card>
				);

			case "designQCDocs":
				return (
					<Card>
						<DesignQCDocs orderId={orderId} />
					</Card>
				);

			case "designFile":
				return (
					<Card>
						<DesignFile orderId={orderId} />
					</Card>
				);

			case "internalApproval":
				return (
					<Card>
						<DesignApproval orderId={orderId} />
					</Card>
				);

			case "outerPrint":
				return (
					<Card>
						<PLAOuterPrint orderId={orderId} />
					</Card>
				);

			case "flapPrint":
				return (
					<Card>
						<PLAFlapPrint orderId={orderId} />
					</Card>
				);

			case "plaQCDocs":
				return (
					<Space direction="vertical">
						<Design orderId={orderId} onlyQCDocs={true} />
						<Card>
							<PLAQCDocs orderId={orderId} />
						</Card>
					</Space>
				);

			case "plasticApproval":
				return (
					<Card>
						<PLAApproval orderId={orderId} />
					</Card>
				);

			case "implantPrint":
				return (
					<Card>
						<PEEKPrint orderId={orderId} />
					</Card>
				);

			case "annealing":
				return (
					<Card>
						<PEEKAnnealing orderId={orderId} />
					</Card>
				);

			case "roughPolishing":
				return (
					<Card>
						<PEEKRoughPolishing orderId={orderId} />
					</Card>
				);

			case "peekQCDocs":
				return (
					<Space direction="vertical">
						<Design orderId={orderId} onlyQCDocs={true} />

						<Card>
							<PEEKQCDocs orderId={orderId} />
						</Card>
					</Space>
				);

			case "implantApproval":
				return (
					<Card>
						<PEEKApprove orderId={orderId} />
					</Card>
				);

			case "laserMarking":
				return (
					<Card>
						<PEEKLaserMarking orderId={orderId} />
					</Card>
				);

			case "finalPolishing":
				return (
					<Card>
						<PEEKFinalPolishing orderId={orderId} />
					</Card>
				);

			case "packing":
				return (
					<Card>
						<Packing orderId={orderId} />
					</Card>
				);

			case "finalPayment":
				return (
					<Card>
						<PaymentCompletion orderId={orderId} />
					</Card>
				);

			case "invoice":
				return (
					<Card>
						<Invoice orderId={orderId} />;
					</Card>
				);
			case "completed":
				return (
					<Card>
						<Result icon={<SmileOutlined />} title="Great, we have done all the operations!" />
					</Card>
				);
			default:
				return (
					<Alert
						message="Unknown Status"
						description={`The form for status "${status}" is not available.`}
						type="warning"
						showIcon
					/>
				);
		}
	};

	// Get contextual forms - sometimes we want to show the previous form for reference
	const renderContextualForms = () => {
		// Special cases where showing additional context is helpful
		switch (status) {
			case "ct_scan_validated":
				// Show the CT scan form along with validation
				return (
					<Space direction="vertical" style={{ width: "100%" }}>
						<Card title="Current CT Scan">
							<CTScan orderId={orderId} />
						</Card>
						<Card title="CT Scan Validation">
							<CTValidation orderId={orderId} />
						</Card>
					</Space>
				);

			case "design_approved":
				// Show design submission along with approval
				return (
					<Space direction="vertical" style={{ width: "100%" }}>
						<Card title="Design Submission">
							<DesignImage orderId={orderId} />
						</Card>
						<Card title="Design Approval">
							<DesignApproval orderId={orderId} />
						</Card>
					</Space>
				);

			case "pla_approved":
				// Show PLA prints along with approval
				return (
					<Space direction="vertical" style={{ width: "100%" }}>
						<Card title="PLA Outer Print">
							<PLAOuterPrint orderId={orderId} />
						</Card>
						<Card title="PLA Flap Print">
							<PLAFlapPrint orderId={orderId} />
						</Card>
						<Card title="PLA Approval">
							<PLAApproval orderId={orderId} />
						</Card>
					</Space>
				);

			case "invoiced":
				// Show payment completion along with invoice
				return (
					<Space direction="vertical" style={{ width: "100%" }}>
						<Card title="Payment Completion">
							<PaymentCompletion orderId={orderId} />
						</Card>
						<Card title="Invoice">
							<Invoice orderId={orderId} />
						</Card>
					</Space>
				);

			default:
				// For most statuses, just show the single form
				return renderForm();
		}
	};

	return renderContextualForms();
};

export default ActiveForm;
