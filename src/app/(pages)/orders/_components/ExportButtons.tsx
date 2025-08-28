import { AuditOutlined, BarcodeOutlined, PrinterOutlined } from "@ant-design/icons";
import { message, Dropdown, MenuProps, Button, Spin } from "antd";
import ReactDOMServer from "react-dom/server";

import api from "@/lib/axiosInstance";

const LoadingPage = () => (
	<div style={{
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		height: "100vh",
		flexDirection: "column",
		fontFamily: "sans-serif"
	}}>
		<Spin size="large" />
		<p style={{ marginTop: 16 }}>Generating PDF, please wait...</p>
	</div>
);

const openPdf = async (orderId: string, endpoint: string) => {
	// Step 1: Open tab immediately
	const pdfWindow = window.open("", "_blank");
	if (!pdfWindow) {
		message.error("Popup blocked! Please allow popups for this site.");
		return;
	}

	// Step 2: Render loading spinner in that tab
	const loadingHtml = ReactDOMServer.renderToString(<LoadingPage />);
	pdfWindow.document.write(`<!DOCTYPE html><html><head><title>Loading PDF...</title></head><body>${loadingHtml}</body></html>`);
	pdfWindow.document.close();

	try {
		// Step 3: Request PDF from API
		const res = await api.get(`/orders/${orderId}/pdf/${endpoint}`, { responseType: "blob" });

		// Step 4: Replace loading page with PDF
		const fileURL = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
		pdfWindow.location.href = fileURL;

		message.success("PDF generated successfully.");
	} catch (error) {
		pdfWindow.document.body.innerHTML = "<h2 style='color:red;text-align:center;margin-top:50px;'>Failed to generate PDF.</h2>";
		console.error(error);
		message.error("Failed to generate PDF.");
	}
};

const OrderExportButton = ({ orderId }: { orderId: string }) => {
	const items: MenuProps["items"] = [
		{
			key: "Design Confirmation Document",
			icon: <AuditOutlined />,
			label: "Design Confirmation Document",
		},
		{
			key: "Packing Sticker",
			icon: <BarcodeOutlined />,
			label: "Packing Sticker",
		},
	];

	const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "Design Confirmation Document":
				openPdf(orderId, "doctor");
				break;
			case "Packing Sticker":
				openPdf(orderId, "sticker");
				break;
		}
	};

	return (
		<Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]} placement="bottomLeft">
			<Button icon={<PrinterOutlined />}>Export</Button>
		</Dropdown>
	);
};

export default OrderExportButton;
