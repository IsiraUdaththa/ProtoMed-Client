"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";

import StageAnalytics from "./StageAnalytics";
import AssignedTable from "./AssignedTable";
import UnassignedTable from "./UnassignedTable";

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
			<StageAnalytics />
			<br />
			<AssignedTable />
			<br />
			<UnassignedTable />
		</div>
	);
}
