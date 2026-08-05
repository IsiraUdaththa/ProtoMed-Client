import { Card, Col, Row, Statistic } from "antd";

interface StatCardsProps {
	totalCases: number;
	pending: number;
	confirmed: number;
	completed: number;
}

export default function StatCards({ totalCases, pending, confirmed, completed }: StatCardsProps) {
	return (
		<>
			<Row gutter={16}>
				<Col span={6}>
					<Card>
						<Statistic title="Total Cases" value={totalCases} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Pending" value={pending} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Confirmed" value={confirmed} />
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic title="Completed" value={completed} />
					</Card>
				</Col>
			</Row>
		</>
	);
}
