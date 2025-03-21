import { Card, Steps, Badge } from "antd";
import {
	PaperClipOutlined,
	FileAddOutlined,
	FileDoneOutlined,
	DollarOutlined,
	FileTextOutlined,
	SafetyCertificateOutlined,
	PrinterOutlined,
	DropboxOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";

const App: React.FC = () => {
	return (
		<Card title="Process progress">
			<div style={{ overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "8px" }}>
				<Steps
					style={{ minWidth: "1000px" }} // Ensures it doesn't collapse too much
					items={[
						{
							// title: "Registration",
							status: "finish",
							icon: (
								<>
									<FileAddOutlined />
									<Badge count={25} offset={[5, 0]} size="small">
										{" "}
									</Badge>
								</>
							),
						},
						{
							// title: "CT Verification",
							status: "finish",
							icon: <PaperClipOutlined />,
						},
						{
							// title: "CT Validation",
							status: "finish",
							icon: <FileDoneOutlined />,
						},
						{
							// title: "Payment",
							status: "finish",
							icon: <DollarOutlined />,
						},
						{
							// title: "Payment Verification",
							status: "process",
							icon: <SafetyCertificateOutlined />,
						},
						{
							// title: "Design",
							status: "wait",
							icon: <FileTextOutlined />,
						},
						{
							// title: "PLA Outer Print",
							status: "wait",
							icon: <PrinterOutlined />,
						},
						{
							// title: "PLA Flap Print",
							status: "wait",
							icon: <PrinterOutlined />,
						},
						{
							// title: "Peek Print",
							status: "wait",
							icon: <PrinterOutlined />,
						},
						{
							// title: "Packing",
							status: "wait",
							icon: <DropboxOutlined />,
						},
						{
							// title: "Payment",
							status: "wait",
							icon: <CheckCircleOutlined />,
						},
					]}
				/>
			</div>
		</Card>
	);
};

export default App;
