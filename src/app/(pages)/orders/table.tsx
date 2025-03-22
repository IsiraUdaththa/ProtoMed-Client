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
		width: "20%",
	},
	{
		title: "Gender",
		dataIndex: ["patientDetails", "category"],
		filters: [
			{ text: "Male", value: "male" },
			{ text: "Female", value: "female" },
		],
		width: "20%",
	},
	{
		title: "Email",
		dataIndex: ["patientDetails", "age"],
	},
];

const toURLSearchParams = <T extends AnyObject>(record: T) => {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(record)) {
		params.append(key, value);
	}
	return params;
};

const getRandomuserParams = (params: TableParams) => ({
	results: params.pagination?.pageSize,
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
			.then(({ results }) => {
				setData(results);
				setLoading(false);
				setTableParams({
					...tableParams,
					pagination: {
						...tableParams.pagination,
						total: 200,
						// 200 is mock data, you should read it from server
						// total: data.totalCount,
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
			// rowKey={(record) => record.login.uuid}
			dataSource={data}
			pagination={tableParams.pagination}
			loading={loading}
			onChange={handleTableChange}
		/>
	);
};

export default App;
