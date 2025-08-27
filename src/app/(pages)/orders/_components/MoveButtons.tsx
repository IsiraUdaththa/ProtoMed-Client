import { ArrowLeftOutlined, ArrowRightOutlined, DeleteOutlined, EditOutlined, StopOutlined, UndoOutlined } from "@ant-design/icons";
import { message, Dropdown, MenuProps, Button } from "antd";

import api from "@/lib/axiosInstance";

const handleMoveNext = async (orderId: string) => {
	try {
		await api.post(`/orders/${orderId}/moveNext`);
		message.success("Order moved to next step.");
		// Optional: refresh data or update UI here
	} catch (error) {
		console.error(error);
		message.error("Failed to move order forward.");
	}
};

const handleMoveBack = async (orderId: string) => {
	try {
		await api.post(`/orders/${orderId}/moveBack`);
		message.success("Order moved to previous step.");
		// Optional: refresh data or update UI here
	} catch (error) {
		console.error(error);
		message.error("Failed to move order back.");
	}
};

const handleDelete = async (orderId: string) => {
	try {
		await api.delete(`/orders/${orderId}`);
		message.success("Order deleted");
	} catch (error) {
		console.error(error);
		message.error("Failed to delete order");
	}
};

const handleCancel = async (orderId: string) => {
	try {
		await api.patch(`/orders/${orderId}/cancel`);
		message.success("Order Canceled");
	} catch (error) {
		console.error(error);
		message.error("Failed to cancel order");
	}
};

const handleRevoke = async (orderId: string) => {
	try {
		await api.patch(`/orders/${orderId}/revoke`);
		message.success("Order Revoked");
	} catch (error) {
		console.error(error);
		message.error("Failed to revoke order");
	}
};

export const OrderActions = ({ orderId }: { orderId: string }) => {
	const items: MenuProps["items"] = [
		{
			key: "moveForward",
			icon: <ArrowRightOutlined />,
			label: "Move Forward",
		},
		{
			key: "moveBack",
			icon: <ArrowLeftOutlined />,
			label: "Move Backward",
		},
		{
			key: "delete",
			icon: <DeleteOutlined />,
			label: "Delete",
			danger: true,
		},
		{
			key: "cancel",
			icon: <StopOutlined />,
			label: "Cancel",
			danger: true,
		},
		{
			key: "revoke",
			icon: <UndoOutlined />,
			label: "Revoke",
			danger: true,
		},
	];

	const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "moveForward":
				handleMoveNext(orderId);
				break;
			case "moveBack":
				handleMoveBack(orderId);
				break;
			case "delete":
				handleDelete(orderId);
				break;
			case "cancel":
				handleCancel(orderId);
				break;
			case "revoke":
				handleRevoke(orderId);
				break;
			default:
				break;
		}
	};

	return (
		<Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]} placement="bottomLeft">
			<EditOutlined />
		</Dropdown>
	);
};


export const OrderActionsButton = ({ orderId }: { orderId: string }) => {
	const items: MenuProps["items"] = [
		{
			key: "moveForward",
			icon: <ArrowRightOutlined />,
			label: "Move Forward",
		},
		{
			key: "moveBack",
			icon: <ArrowLeftOutlined />,
			label: "Move Backward",
		},
		{
			key: "delete",
			icon: <DeleteOutlined />,
			label: "Delete",
			danger: true,
		},
		{
			key: "cancel",
			icon: <StopOutlined />,
			label: "Cancel",
			danger: true,
		},
		{
			key: "revoke",
			icon: <UndoOutlined />,
			label: "Revoke",
			danger: true,
		},
	];

	const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
		switch (key) {
			case "moveForward":
				handleMoveNext(orderId);
				break;
			case "moveBack":
				handleMoveBack(orderId);
				break;
			case "delete":
				handleDelete(orderId);
				break;
			case "cancel":
				handleCancel(orderId);
				break;
			case "revoke":
				handleRevoke(orderId);
				break;
			default:
				break;
		}
	};

	return (
		<Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]} placement="bottomLeft">
			<Button icon={<EditOutlined />}>Actions</Button>
		</Dropdown>
	);
};

