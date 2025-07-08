import { Result, Card } from "antd";

export default function DashboardPage() {
	return (
		<>
			<Card>
				<Result status="404" title="404" subTitle="Sorry, the page you visited is under construction." />
			</Card>
		</>
	);
}
