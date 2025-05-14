"use client";

import api from "@/lib/axiosInstance";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { useEffect, useState } from "react";

const UserTag: React.FC<{ userId: string }> = ({ userId }) => {
	const [user, setUser] = useState<{ name: string } | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get(`/users/${userId}`);
				setUser(response.data);
			} catch (error) {
				console.error("Failed to fetch user", error);
			} finally {
				setLoading(false);
			}
		};

		if (userId) {
			fetchUser();
		}
	}, [userId]);

	if (loading) return <span>Loading...</span>;

	if (!user)
		return (
			<Tag icon={<WarningOutlined />} bordered={false} color="red">
				Invalid User
			</Tag>
		);

	return (
		<Tag icon={<UserOutlined />} bordered={false} color="cyan">
			{user.name}
		</Tag>
	);
};

export default UserTag;
