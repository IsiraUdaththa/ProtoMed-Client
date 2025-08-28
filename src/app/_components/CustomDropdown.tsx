"use client";
import React, { useState, useEffect } from "react";
import { Select, Input, Button, Space, Popconfirm, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

import api from "@/lib/axiosInstance";

interface CustomDropdownProps {
	type: string; // e.g. "doctors", "categories", "labs"
	prefix?: string; // optional prefix (e.g. "Dr.")
	value?: string;
	placeholder?: string; // customizable placeholder
	onChange?: (value: string | undefined) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
	type,
	prefix,
	value,
	placeholder,
	onChange,
}) => {
	const [items, setItems] = useState<string[]>([]);
	const [selectedItem, setSelectedItem] = useState<string | undefined>(value);
	const [newItem, setNewItem] = useState<string>("");
	const [error, setError] = useState<string>("");

	// Load dropdown items
	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await api.get(`dropdowns/${type}`);
				setItems(response.data || []);
			} catch {
				// setItems([`${prefix ? prefix + " " : ""}Default 1`, `${prefix ? prefix + " " : ""}Default 2`]);
			}
		};
		fetchItems();
	}, [type, prefix]);

	// Add new item
	const addItem = async () => {
		const formattedName = `${prefix ? prefix + " " : ""}${newItem.trim()}`;
		if (!newItem.trim()) {
			setError("Please enter a valid value");
			return;
		}
		if (items.includes(formattedName)) {
			setError(`"${formattedName}" already exists`);
			return;
		}
		try {
			await api.post(`dropdowns/${type}`, { item: formattedName });
			const updatedItems = [...items, formattedName];
			setItems(updatedItems);
			setSelectedItem(formattedName);
			onChange?.(formattedName);
			setNewItem("");
			setError("");
		} catch {
			setError("Failed to add item");
		}
	};

	// Delete item
	const deleteItem = async (name: string) => {
		try {
			await api.delete(`dropdowns/${type}`, { data: { item: name } });
			const updatedItems = items.filter((i) => i !== name);
			setItems(updatedItems);
			if (selectedItem === name) {
				setSelectedItem(undefined);
				onChange?.("");
			}
		} catch {
			setError("Failed to delete item");
		}
	};

	return (
		<Select
			style={{ width: "100%" }}
			placeholder={placeholder}
			value={selectedItem}
			onChange={(val) => {
				setSelectedItem(val);
				onChange?.(val);
			}}
			popupRender={(menu) => (
				<>
					{menu}
					<Space direction="vertical" style={{ padding: "8px", display: "flex" }}>
						<Input
							placeholder={`Enter value${prefix ? ` (without '${prefix}')` : ""}`}
							value={newItem}
							onChange={(e) => {
								setNewItem(e.target.value);
								setError("");
							}}
							onPressEnter={addItem}
						/>
						{error && <Typography.Text type="danger">{error}</Typography.Text>}
						<Button type="link" icon={<PlusOutlined />} onClick={addItem}>
							Add new
						</Button>
					</Space>
				</>
			)}
			optionLabelProp="label"
		>
			{items.map((item) => (
				<Select.Option key={item} value={item} label={item}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<span>{item}</span>
						<Popconfirm title={`Delete "${item}"?`} onConfirm={() => deleteItem(item)}>
							<DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: "red" }} />
						</Popconfirm>
					</div>
				</Select.Option>
			))}
		</Select>
	);
};

export default CustomDropdown;
