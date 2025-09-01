"use client";

import { Breadcrumb, Space } from "antd";
import Link from "next/link";

import StageAnalytics from "./StageAnalytics";
import AssignedTable from "./AssignedTable";
import Dashboard from "./Charts";

export default function DashboardPage() {
	return (
		<div>
			<Breadcrumb
				style={{ marginLeft: 5, marginBottom: 15 }}
				items={[
					{
						title: <Link href="/dashboard">Dashboard</Link>,
					},
					{
						title: "Workplace",
					},
				]}
			/>
			<Space direction="vertical" size={"large"} style={{width:"100%"} }>
				<StageAnalytics />
				<Dashboard />
				<AssignedTable />
			</Space>
		</div>
	);
}
