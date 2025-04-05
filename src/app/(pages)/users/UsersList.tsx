import React, { useEffect, useState } from "react";
import { List, Avatar, Tag, Space, Input, Select, Flex, Pagination } from "antd";
import { MailOutlined, PhoneOutlined, HomeOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Search } = Input;

const PAGE_SIZE = 10;

type User = {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address?: string;
	roles: string[];
};

const roleOptions = [
	{ value: "All", label: "All" },
	{ value: "Admin", label: "Admin" },
	{ value: "Sales", label: "Sales" },
	{ value: "Doctor", label: "Doctors" },
	{ value: "Designer", label: "Designers" },
	{ value: "Technician", label: "Technicians" },
	{ value: "QC", label: "QC" },
];

const UserList: React.FC = () => {
	const [data, setData] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [roleFilter, setRoleFilter] = useState<string>("All");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const fetchData = async () => {
		setLoading(true);
		try {
			const params: Record<string, string | number | undefined> = {
				page: currentPage,
				limit: PAGE_SIZE,
			};
			if (roleFilter !== "All") {
				params.role = roleFilter.toLowerCase();
			}
			if (searchQuery) {
				params.search = searchQuery;
			}

			const response = await api.get("/users", {
				params,
			});

			setData(response.data.results);
			setTotal(response.data.pagination.total);
			console.log(response.data);
		} catch (error) {
			console.error("Failed to fetch users", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [currentPage, roleFilter, searchQuery]);

	const handleRoleChange = (value: string) => {
		setRoleFilter(value);
		setCurrentPage(1);
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);
		setCurrentPage(1);
	};

	return (
		<>
			<Flex justify="flex-end" wrap gap={"8px"}>
				<Select defaultValue="All" style={{ width: 120 }} onChange={handleRoleChange} options={roleOptions} />
				<Search style={{ width: 250 }} placeholder="Search" allowClear onSearch={handleSearch} />
			</Flex>

			<List
				loading={loading}
				dataSource={data}
				pagination={false}
				renderItem={(item, index) => (
					<List.Item>
						<List.Item.Meta
							avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
							title={
								<>
									<a href={`/users/${item._id}`}>{item.name}</a>{" "}
									<Tag bordered={false} color="cyan">
										{item.roles.join(", ")}
									</Tag>
								</>
							}
							description={
								<Space wrap>
									{item.email && (
										<span>
											<MailOutlined style={{ marginRight: 4 }} />
											{item.email}
										</span>
									)}
									{item.phone && (
										<span>
											<PhoneOutlined style={{ marginRight: 4 }} />
											{item.phone}
										</span>
									)}
									{item.address && (
										<span>
											<HomeOutlined style={{ marginRight: 4 }} />
											{item.address}
										</span>
									)}
								</Space>
							}
						/>
					</List.Item>
				)}
			/>

			<Flex justify="center" style={{ marginTop: 20 }}>
				<Pagination
					current={currentPage}
					pageSize={PAGE_SIZE}
					total={total}
					onChange={(page) => setCurrentPage(page)}
					showSizeChanger={false}
				/>
			</Flex>
		</>
	);
};

export default UserList;
