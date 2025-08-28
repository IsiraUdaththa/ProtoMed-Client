"use client";

import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import useSWR from "swr";

import { fetcher } from "@/utils/fetcher";

const UserTag: React.FC<{ userId: string }> = ({ userId }) => {
	const { data, error, isLoading } = useSWR(userId ? `/users/${userId}` : null, fetcher);

	if (error || !data) {
		return (
			<Tag icon={<WarningOutlined />} bordered={false} color="orange">
				Not Assigned
			</Tag>
		);
	}

	if (isLoading) {
		return <span>Loading...</span>;
	}

	return (
		<Tag icon={<UserOutlined />} bordered={false} color="cyan">
			{data.name}
		</Tag>
	);
};

export default UserTag;
