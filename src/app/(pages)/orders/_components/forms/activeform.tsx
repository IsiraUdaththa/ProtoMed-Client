"use client";

// import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Card, Alert, Space } from "antd";

// Import all individual form components
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
import PEEKApprove from "./PEEKApprove";
import PEEKLaserMarking from "./PEEKLaserMarking";
import PEEKFinalPolishing from "./PEEKFinalPolishing";
import Packing from "./Packing";
import PaymentCompletion from "./PaymentCompletion";
import Invoice from "./Invoice";

const ActiveForm: React.FC<{ orderId: string; status: string }> = ({ orderId, status }) => {
	// Function to get the form title based on status
	const getFormTitle = (status: string): string => {
		const formTitles: { [key: string]: string } = {
			draft: "Patient Details",
			scanUpload: "CT Scan Details",
			scanValidation: "CT Scan Validation",
			quotation: "Quotation",
			advancePayment: "Payment Advance",
			designImages: "Design Submission",
			designQCDocs: "Design QC Docs",
			designFile: "Design File",
			internalApproval: "Design Approval",
			externalApproval: "Doctor Approval",
			outerPrint: "PLA Outer Print",
			flapPrint: "PLA Flap Print",
			plaQCDocs: "PLA QC DOCS",
			plasticApproval: "PLA Approval",
			implantPrint: "PEEK Print",
			annealing: "PEEK Annealing",
			roughPolishing: "PEEK Rough Polishing",
			implantApproval: "PEEK Approval",
			laserMarking: "PEEK Laser Marking",
			finalPolishing: "PEEK Final Polishing",
			packing: "Packing",
			finalPayment: "Payment Completion",
			invoice: "Invoice",
			completed: "Completed",
		};

		return formTitles[status] || "Unknown Form";
	};

	// Function to render the appropriate form based on status
	const renderForm = () => {
		switch (status) {
			case "draft":
				return <Patient orderId={orderId} />;

			case "scanUpload":
				return <CTScan orderId={orderId} />;

			case "scanValidation":
				return <CTValidation orderId={orderId} />;

			case "quotation":
				return <Quotation orderId={orderId} />;

			case "advancePayment":
				return <PaymentAdvance orderId={orderId} />;

			case "designImages":
				return <DesignImage orderId={orderId} />;

			case "designQCDocs":
				return <DesignQCDocs orderId={orderId} />;
				
			case "designFile":
				return <DesignFile orderId={orderId} />;

			case "internalApproval":
				return <DesignApproval orderId={orderId} />;

			case "outerPrint":
				return <PLAOuterPrint orderId={orderId} />;

			case "flapPrint":
				return <PLAFlapPrint orderId={orderId} />;

			case "plaQCDocs":
				return <PLAQCDocs orderId={orderId}/>;

			case "plasticApproval":
				return <PLAApproval orderId={orderId} />;

			case "implantPrint":
				return <PEEKPrint orderId={orderId} />;

			case "annealing":
				return <PEEKAnnealing orderId={orderId} />;

			case "roughPolishing":
				return <PEEKRoughPolishing orderId={orderId} />;

			case "implantApproval":
				return <PEEKApprove orderId={orderId} />;

			case "laserMarking":
				return <PEEKLaserMarking orderId={orderId} />;

			case "finalPolishing":
				return <PEEKFinalPolishing orderId={orderId} />;

			case "packing":
				return <Packing orderId={orderId} />;

			case "finalPayment":
				return <PaymentCompletion orderId={orderId} />;

			case "invoice":
				return <Invoice orderId={orderId} />;
			case "completed":
				return <Alert message="Success Text" type="success" />;
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
				return <Card title={getFormTitle(status)}>{renderForm()}</Card>;
		}
	};

	return renderContextualForms();
};

export default ActiveForm;
