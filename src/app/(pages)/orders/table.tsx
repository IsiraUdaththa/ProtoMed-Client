/* eslint-disable compat/compat */
import React, { useEffect, useState } from "react";
import type { GetProp, TableProps } from "antd";
import { Table } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { SorterResult } from "antd/es/table/interface";

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

interface DataType {
	key: string;
	patientDetails: PatientDetails;
}

interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<any>["field"];
	sortOrder?: SorterResult<any>["order"];
	filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
	{
		title: "Name",
		dataIndex: ["patientDetails", "name"],
		sorter: true,
		render: (_, record) => <a href={`orders/${record.patientDetails._id}`}>{record.patientDetails.name}</a>,
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
      return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
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

	const params = toURLSearchParams(getRandomuserParams(tableParams));

	const fetchData = () => {
		setLoading(true);
		fetch(`http://localhost:5000/api/orders?${params.toString()}`)
			.then((res) => res.json())
			.then(({ results, pagination }) => {
				setData(results);
				setLoading(false);
				setTableParams({
					...tableParams,
					pagination: {
						...tableParams.pagination,
						// 200 is mock data, you should read it from server
						total: pagination.total,
					},
				});
			});
	};

	useEffect(fetchData, [
		tableParams.pagination?.current,
		tableParams.pagination?.pageSize,
		tableParams?.sortOrder,
		tableParams?.sortField,
		JSON.stringify(tableParams.filters),
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
