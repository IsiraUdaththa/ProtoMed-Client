"use client";

import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
	const params = useParams();
	return <h1>Viewing Order {params.id}</h1>;
}
