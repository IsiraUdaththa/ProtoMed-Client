/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Alert, Card, Spin, Timeline, TimelineItemProps, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";
import DateDisplay from "@/app/_components/DateDisplay";

interface OrderTimelineProps {
	orderId: string;
}

interface TimelineEvent {
	date: Date;
	title: string;
	userId?: string;
	comment?: string;
	status?: "approved" | "rejected" | "pending" | "completed";
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ orderId }) => {
	const [data, setData] = useState<any | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await api.get(`orders/${orderId}/`);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching order data:", error);
				setError("Failed to load order timeline");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [orderId]);

	const getTimelineEvents = (orderData: any): TimelineEvent[] => {
		const events: TimelineEvent[] = [];

		// 1. Patient Registration
		if (orderData.patientDetails) {
			events.push({
				date: orderData.patientDetails.createdAt,
				title: "Patient Registered",
				userId: orderData.patientDetails.registeredBy,
				status: "completed",
			});

			// Planned Surgery Date
			if (orderData.patientDetails.plannedSurgeryDate) {
				events.push({
					date: orderData.patientDetails.plannedSurgeryDate,
					title: "Planned Surgery Date",
					status: "pending",
				});
			}
		}

		// 2. CT Scan
		if (orderData.ctScan) {
			events.push({
				date: orderData.ctScan.ctDate || orderData.ctScan.createdAt,
				title: "CT Scan Uploaded",
				userId: orderData.ctScan.checkedBy,
				comment: orderData.ctScan.comment,
				status: "completed",
			});
		}

		// 3. CT Validation
		if (orderData.ctValidation) {
			events.push({
				date: orderData.ctValidation.createdAt,
				title: "CT Scan Validated",
				userId: orderData.ctValidation.validatedBy,
				status: "completed",
			});
		}

		// 4. Quotation
		if (orderData.quotation) {
			events.push({
				date: orderData.quotation.createdAt,
				title: "Quotation Created",
				userId: orderData.quotation.createdBy,
				status: "completed",
			});
		}

		// 5. Advance Payment
		if (orderData.advancePayment) {
			events.push({
				date: orderData.advancePayment.createdAt,
				title: "Advance Payment Received",
				userId: orderData.advancePayment.validatedBy,
				status: "completed",
			});
		}

		// 6. Design Process
		if (orderData.designs && orderData.designs.length > 0) {
			orderData.designs.forEach((design: any, index: number) => {
				const designPrefix = orderData.designs.length > 1 ? `Design ${index + 1}: ` : "";

				// Design Images
				if (design.designImages) {
					events.push({
						date: design.designImages.designDate || design.designImages.createdAt,
						title: `${designPrefix}Design Images Created`,
						userId: design.designImages.designBy,
						status: "completed",
					});
				}

				// QC Documents
				if (design.qcDocs) {
					events.push({
						date: design.qcDocs.designDate || design.qcDocs.createdAt,
						title: `${designPrefix}QC Documents Prepared`,
						userId: design.qcDocs.designBy,
						status: "completed",
					});
				}

				// Design File
				if (design.designFile) {
					events.push({
						date: design.designFile.designDate || design.designFile.createdAt,
						title: `${designPrefix}Design File Uploaded`,
						userId: design.designFile.designBy,
						status: "completed",
					});
				}

				// Design Approval
				if (design.approval) {
					events.push({
						date: design.approval.date || design.approval.createdAt,
						title: `${designPrefix}Design Approval`,
						userId: design.approval.approvedBy,
						comment: design.approval.comment,
						status: "approved",
					});
				}
			});
		}

		// 7. PLA Printing Process
		if (orderData.pla && orderData.pla.length > 0) {
			orderData.pla.forEach((pla: any, index: number) => {
				const plaPrefix = orderData.pla.length > 1 ? `PLA ${index + 1}: ` : "";

				// Outer Print
				if (pla.outerPrint) {
					events.push({
						date: pla.outerPrint.printDate || pla.outerPrint.createdAt,
						title: `${plaPrefix}Outer Print Completed`,
						userId: pla.outerPrint.printBy,
						status: "completed",
					});
				}

				// Flap Print
				if (pla.flapPrint) {
					events.push({
						date: pla.flapPrint.printDate || pla.flapPrint.createdAt,
						title: `${plaPrefix}Flap Print Completed`,
						userId: pla.flapPrint.printBy,
						status: "completed",
					});
				}

				// PLA QC
				if (pla.qcDocs) {
					events.push({
						date: pla.qcDocs.designDate || pla.qcDocs.createdAt,
						title: `${plaPrefix}QC Documentation`,
						userId: pla.qcDocs.doneBy,
						status: "completed",
					});
				}

				// PLA Approval
				if (pla.approval) {
					events.push({
						date: pla.approval.approvalDate || pla.approval.createdAt,
						title: `${plaPrefix}PLA Approval`,
						userId: pla.approval.approvedBy,
						comment: pla.approval.comment,
						status: pla.approval.isApproved ? "approved" : "rejected",
					});
				}
			});
		}

		// 8. PEEK Manufacturing Process
		if (orderData.peek && orderData.peek.length > 0) {
			orderData.peek.forEach((peek: any, index: number) => {
				const peekPrefix = orderData.peek.length > 1 ? `PEEK ${index + 1}: ` : "";

				// Printing
				if (peek.print) {
					events.push({
						date: peek.print.printDate || peek.print.createdAt,
						title: `${peekPrefix}PEEK Printing`,
						userId: peek.print.printBy,
						status: "completed",
					});
				}

				// Annealing
				if (peek.annealing) {
					events.push({
						date: peek.annealing.processDate || peek.annealing.createdAt,
						title: `${peekPrefix}Annealing Process`,
						userId: peek.annealing.doneBy,
						status: "completed",
					});
				}

				// Polishing
				if (peek.polishing) {
					events.push({
						date: peek.polishing.polishingDate || peek.polishing.createdAt,
						title: `${peekPrefix}Polishing`,
						userId: peek.polishing.polishingBy,
						status: "completed",
					});
				}

				// Laser Marking
				if (peek.laserMarking) {
					events.push({
						date: peek.laserMarking.createdAt,
						title: `${peekPrefix}Laser Marking`,
						userId: peek.laserMarking.doneBy,
						status: "completed",
					});
				}

				// Final Polishing
				if (peek.finalPolishing) {
					events.push({
						date: peek.finalPolishing.date || peek.finalPolishing.createdAt,
						title: `${peekPrefix}Final Polishing`,
						userId: peek.finalPolishing.doneBy,
						status: "completed",
					});
				}

				// PEEK QC
				if (peek.qcDocs) {
					events.push({
						date: peek.qcDocs.createdAt,
						title: `${peekPrefix}QC Documentation`,
						userId: peek.qcDocs.doneBy,
						status: "completed",
					});
				}

				// PEEK Approval
				if (peek.approval) {
					events.push({
						date: peek.approval.approvalDate || peek.approval.createdAt,
						title: `${peekPrefix}PEEK Approval`,
						userId: peek.approval.approvedBy,
						comment: peek.approval.comment,
						status: peek.approval.isApproved ? "approved" : "rejected",
					});
				}
			});
		}

		// 9. Packing
		if (orderData.packing) {
			events.push({
				date: orderData.packing.packedDate || orderData.packing.createdAt,
				title: "Product Packed",
				userId: orderData.packing.packedBy,
				status: "completed",
			});
		}

		// 10. Full Payment
		if (orderData.fullPayment) {
			events.push({
				date: orderData.fullPayment.createdAt,
				title: "Full Payment Verification",
				userId: orderData.fullPayment.verifiedBy,
				comment: orderData.fullPayment.comment,
				status: orderData.fullPayment.isPaid ? "approved" : "rejected",
			});
		}

		// 11. Invoice
		if (orderData.invoice) {
			events.push({
				date: orderData.invoice.sentDate || orderData.invoice.createdAt,
				title: "Invoice Sent",
				userId: orderData.invoice.doneBy,
				status: orderData.invoice.isSent ? "completed" : "pending",
			});
		}

		// Sort events by date
		return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	};

	const getStatusIcon = (status?: string) => {
		switch (status) {
			case "approved":
				return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
			case "rejected":
				return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
			case "pending":
				return <ClockCircleOutlined style={{ color: "#faad14" }} />;
			case "completed":
				return <CheckCircleOutlined style={{ color: "#1890ff" }} />;
			default:
				return undefined;
		}
	};

	const getStatusColor = (status?: string) => {
		switch (status) {
			case "approved":
				return "success";
			case "rejected":
				return "error";
			case "pending":
				return "warning";
			case "completed":
				return "processing";
			default:
				return "default";
		}
	};

	if (loading) {
		return (
			<Card>
				<div style={{ textAlign: "center", padding: "20px" }}>
					<Spin size="large" />
					<p style={{ marginTop: "10px" }}>Loading timeline...</p>
				</div>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<Alert message="Error" description={error} type="error" showIcon />
			</Card>
		);
	}

	if (!data) {
		return (
			<Card>
				<Alert message="No Data" description="No order data available." type="info" showIcon />
			</Card>
		);
	}

	const events = getTimelineEvents(data);

	const timelineItems: TimelineItemProps[] = events.map((event, index) => ({
		dot: getStatusIcon(event.status),
		color: event.status === "rejected" ? "red" : event.status === "approved" ? "green" : "blue",
		children: (
			<div key={index}>
				<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
					<strong>{event.title}</strong>
					{event.status && <Tag color={getStatusColor(event.status)}>{event.status.toUpperCase()}</Tag>}
				</div>

				{event.userId && <UserTag userId={event.userId} />}

				<DateDisplay isoDate={event.date} />

				{event.comment && (
					<div
						style={{
							marginTop: "8px",
							padding: "8px",
							backgroundColor: "#f5f5f5",
							borderRadius: "4px",
							fontStyle: "italic",
						}}
					>
						{event.comment}
					</div>
				)}
			</div>
		),
	}));

	return (
		<Card>
			<Timeline items={timelineItems} />
		</Card>
	);
};

export default OrderTimeline;
