import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import { Space, Table, Typography } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { SorterResult } from "antd/es/table/interface";
import Link from "next/link";
import api from "@/lib/axiosInstance";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;

interface PatientDetails {
	_id: string;
	name: string;
	age: number;
	address: string;
	category: string;
	surgeonName: string;
	plannedSurgeryDate: string;
	hospital: string;
	ward: number;
	comment: string;
	registeredBy: string;
	createdAt: string;
	updatedAt: string;
}
interface OrderId {
	country: string;
	year: number;
	orderNo: number;
}

interface DataType {
	_id: string;
	key: string;
	orderId: OrderId;
	patientDetails: PatientDetails;
}

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<string>["field"];
	sortOrder?: SorterResult<string>["order"];
	filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		dataIndex: ["patientDetails", "name"],
		sorter: true,
		render: (_, record) => (
			<Space>
				<Link href={`/orders/${record._id}`} passHref>
					<span className="text-blue-500 cursor-pointer">{record.patientDetails.name}</span>
				</Link>
				<Typography.Text type="secondary" style={{ fontSize: 12 }}>
					({record.orderId.country}
					{record.orderId.year}
					{record.orderId.orderNo.toString().padStart(4, "0")})
				</Typography.Text>
			</Space>
		),
	},
	{
		title: "Age",
		dataIndex: ["patientDetails", "age"],
		sorter: true,
	},
	{
		title: "Date Created",
		dataIndex: ["patientDetails", "createdAt"],
		sorter: true,
		render: (createdAt) => {
			const date = new Date(createdAt);
			return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
		},
	},
	{
		title: "Category",
		dataIndex: ["patientDetails", "category"],
		filters: [
			{ text: "Accuplasty", value: "Accuplasty" },
			{ text: "Accupectomy", value: "Accupectomy" },
			{ text: "Accufacial", value: "Accufacial" },
			{ text: "Accuortho", value: "Accuortho" },
			{ text: "Lamifix", value: "Lamifix" },
			{ text: "Screws", value: "Screws" },
			{ text: "Accumesh", value: "Accumesh" },
			{ text: "Screws and Plates", value: "Screws and Plates" },
			{ text: "Other", value: "Other" },
		],
	},
	{
		title: "Doctor",
		dataIndex: ["patientDetails", "surgeonName"],
	},
];

const toURLSearchParams = <T extends AnyObject>(record: T) => {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(record)) {
		if (key === "sortField" && typeof value === "object" && value !== null) {
			params.append(key, String(value).replace(",", ".")); // Convert it to a dot seperated
		} else if (key === "filters" && typeof value === "object" && value !== null) {
			params.append(key, JSON.stringify(value)); // Convert it to a dot seperated
		} else {
			params.append(key, String(value)); // For other keys, convert normally
		}
	}
	return params;
};

const getRandomuserParams = (params: TableParams) => ({
	pageLimit: params.pagination?.pageSize,
	page: params.pagination?.current,

	...params,
});

const App: React.FC = () => {
	const [data, setData] = useState<DataType[]>();
	const [loading, setLoading] = useState(false);
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	});

	// Extract the filters into a separate state variable
	const [filtersValue, setFiltersValue] = useState("");

	// Update filtersValue whenever tableParams.filters changes
	useEffect(() => {
		setFiltersValue(JSON.stringify(tableParams.filters));
	}, [tableParams.filters]);

	useEffect(() => {
		const params = toURLSearchParams(getRandomuserParams(tableParams));
		const fetchData = () => {
			setLoading(true);

			api
				.get(`/orders?${params.toString()}`)
				.then((response) => {
					const { results, pagination } = response.data;
					setData(results);
					setLoading(false);

					setTableParams((prev) => ({
						...prev,
						pagination: {
							...prev.pagination,
							total: pagination.total,
						},
					}));
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
					setLoading(false);
				});
		};
		fetchData();
	}, [
		tableParams.pagination?.current,
		tableParams.pagination?.pageSize,
		tableParams?.sortField,
		tableParams?.sortOrder,
		filtersValue, // Use the separate state variable instead
	]);

	const handleTableChange: TableProps<DataType>["onChange"] = (pagination, filters, sorter) => {
		setTableParams({
			pagination,
			filters,
			sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
			sortField: Array.isArray(sorter) ? undefined : sorter.field,
		});

		// `dataSource` is useless since `pageSize` changed
		if (pagination.pageSize !== tableParams.pagination?.pageSize) {
			setData([]);
		}
	};

	return (
		<Table<DataType>
			columns={columns}
			rowKey={(record) => record.patientDetails._id}
			dataSource={data}
			pagination={tableParams.pagination}
			loading={loading}
			onChange={handleTableChange}
		/>
	);
};

export default App;
