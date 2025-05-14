import React, { useEffect, useRef, useState } from "react";
import type { GetProp, InputRef, TableProps } from "antd";
import { Button, Flex, Input, Space, Table, Typography } from "antd";
import type { AnyObject } from "antd/es/_util/type";
import type { FilterDropdownProps, SorterResult } from "antd/es/table/interface";
import Link from "next/link";
import api from "@/lib/axiosInstance";
import AssignOrderButton from "./_components/AssignOrder";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

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
	fullCode: string;
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
	search?: Parameters<GetProp<TableProps, "onChange">>[1];
}

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

	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef<InputRef>(null);

	const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: string) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters?: () => void, confirm: FilterDropdownProps["confirm"]) => {
		if (clearFilters) clearFilters();
		setSearchText("");
		confirm();
	};

	const getColumnSearchProps = (dataIndex: string): ColumnsType<DataType>[number] => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
						Reset
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
		onFilter: (value, record) =>
			(dataIndex === "name" ? record.patientDetails.name : `${record.orderId.fullCode}`)
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		filterDropdownProps: {
			onOpenChange: (open) => {
				if (open) {
					setTimeout(() => searchInput.current?.select(), 100);
				}
			},
		},
		render: (text, record) => {
			let data = "";
			if (dataIndex === "name") {
				data = record.patientDetails.name;
			} else if (dataIndex === "orderId") {
				data = `${record.orderId.fullCode}`;
			}

			return searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={data ? data.toString() : ""}
				/>
			) : (
				data
			);
		},
	});

	const columns: ColumnsType<DataType> = [
		{
			title: "Name",
			dataIndex: ["patientDetails", "name"],
			sorter: true,
			...getColumnSearchProps("name"),
			render: (_, record) => {
				const name = record.patientDetails.name;
				const highlightedName =
					searchedColumn === "name" ? (
						<Highlighter
							highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
							searchWords={[searchText]}
							autoEscape
							textToHighlight={name || ""}
						/>
					) : (
						name
					);

				return (
					<Link href={`/orders/${record._id}`} passHref>
						<span className="text-blue-500 cursor-pointer">{highlightedName}</span>
					</Link>
				);
			},
		},
		{
			title: "Order ID",
			dataIndex: "orderId",
			...getColumnSearchProps("orderId"),
			render: (_, record) => {
				const orderId = `${record.orderId.fullCode}`;
				const highlightedName =
					searchedColumn === "orderId" ? (
						<Highlighter
							highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
							searchWords={[searchText]}
							autoEscape
							textToHighlight={orderId || ""}
						/>
					) : (
						orderId
					);
				return <>{highlightedName}</>;
			},
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
				return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(
					2,
					"0",
				)}`;
			},
		},
		{
			title: "Status",
			dataIndex: ["status"],
			sorter: true,
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
		{
			title: "Assigned to",
			// render: (record) => <AssignOrderButton orderId={record._id} />,
		},
	];

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
