"use client";

import StageAnalytics from "./StageAnalytics";
import AssignedTable from "./AssignedTable";
import UnassignedTable from "./UnassignedTable";

export default function DashboardPage() {
	return (
		<div>
			<StageAnalytics />
			<br />
			<AssignedTable />
			<br />
			<UnassignedTable />
		</div>
	);
}
