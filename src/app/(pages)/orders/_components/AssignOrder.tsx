"use client";

import { useState } from "react";
import { Modal, Select, message } from "antd";
import UserTag from "@/app/_components/UserTag";
import api from "@/lib/axiosInstance";


interface AssignOrderProps {
	currentAssignee: string;
	orderId: string;
	onAssignSuccess?: () => {
		

	}; 
}

interface User {
	_id: string;
	name: string;
}

const AssignOrder: React.FC<AssignOrderProps> = ({ currentAssignee, orderId, onAssignSuccess }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

	const openModal = async () => {
		setModalOpen(true);
		try {
			const usersRes = await api.get("/users");
			setUsers(usersRes.data.results || []);
		} catch (err) {
			message.error("Failed to fetch users.");
		}
	};

	const handleAssign = async () => {
		console.log(selectedUserId)
		if (!selectedUserId) return;
		
		try {
			await api.post(`/orders/${orderId}/assign`, { userId: selectedUserId });
			message.success("Order assigned successfully.");
			setModalOpen(false);
			setSelectedUserId(undefined);
			onAssignSuccess?.();
		} catch (err) {
			message.error("Failed to assign order.");
		}
	};

	return (
		<>
			<span onClick={openModal} style={{ cursor: "pointer" }}>
				<UserTag userId={currentAssignee} />
			</span>

			<Modal
				title="Assign Order to User"
				open={modalOpen}
				onOk={handleAssign}
				onCancel={() => setModalOpen(false)}
				okButtonProps={{ disabled: !selectedUserId }}
			>
				<Select
					style={{ width: "100%" }}
					placeholder="Select a user"
					value={selectedUserId}
					onChange={(value) => setSelectedUserId(value)}
				>
					{users.map((user) => (
						<Select.Option key={user._id} value={user._id}>
							{user.name}
						</Select.Option>
					))}
				</Select>
			</Modal>
		</>
	);
};

export default AssignOrder;
