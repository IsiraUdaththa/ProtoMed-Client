"use client";
import React, { useState, useEffect } from "react";
import { Select, Popconfirm, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import api from "@/lib/axiosInstance";

interface CustomDropdownProps {
	type: string; // e.g. "doctors", "categories", "labs"
	prefix?: string; // optional prefix (e.g. "Dr.")
	value?: string;
	placeholder?: string; // customizable placeholder
	onChange?: (value: string | undefined) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ type, prefix, value, placeholder, onChange }) => {
	const [items, setItems] = useState<string[]>([]);
	const [selectedItem, setSelectedItem] = useState<string | undefined>(value);
	const [error, setError] = useState<string>("");
	const [searchText, setSearchText] = useState<string>("");

	// Load dropdown items
	useEffect(() => {
		const fetchItems = async () => {
			try {
				const response = await api.get(`dropdowns/${type}`);
				setItems(response.data || []);
			} catch {
				// fallback if API fails
			}
		};
		fetchItems();
	}, [type, prefix]);

	useEffect(() => {
		setSelectedItem(value);
	}, [value]);

	// Add new item
	const addItem = async (name: string) => {
		const formattedName = `${prefix ? prefix + " " : ""}${name.trim()}`;
		if (!name.trim()) {
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
			setSearchText(""); // clear search after add
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

	// Check if search text already exists
	const exists = items.some((i) => i.toLowerCase() === searchText.toLowerCase());

	return (
		<>
			<Select
				style={{ width: "100%" }}
				placeholder={placeholder}
				value={selectedItem}
				showSearch
				onSearch={(val) => setSearchText(val)}
				filterOption={(input, option) => (option?.value as string).toLowerCase().includes(input.toLowerCase())}
				onChange={(val) => {
					if (typeof val === "string" && val.startsWith("__add_new__:")) {
						const newVal = val.replace("__add_new__:", "");
						addItem(newVal);
					} else {
						setSelectedItem(val);
						onChange?.(val);
					}
				}}
				onInputKeyDown={(e) => {
					if (e.key === "Enter" && searchText && !exists) {
						addItem(searchText);
					}
				}}
				optionLabelProp="label"
			>
				{/* Normal items */}
				{items.map((item) => (
					<Select.Option key={item} value={item} label={item}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Highlighter
								highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
								searchWords={[searchText]}
								autoEscape
								textToHighlight={item}
							/>
							<Popconfirm title={`Delete "${item}"?`} onConfirm={() => deleteItem(item)}>
								<DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: "red" }} />
							</Popconfirm>
						</div>
					</Select.Option>
				))}

				{/* "Add new" item */}
				{searchText && !exists && (
					<Select.Option
						key="__add_new__"
						value={`__add_new__:${searchText}`} // special value to detect "add new"
						label={`Add "${searchText}"`}
						style={{ display: "flex", alignItems: "center" }}
					>
						<PlusOutlined style={{ marginRight: 8 }} />
						Add &quot;{searchText}&quot;
					</Select.Option>
				)}
			</Select>

			{error && (
				<Typography.Text type="danger" style={{ marginTop: 4, display: "block" }}>
					{error}
				</Typography.Text>
			)}
		</>
	);
};

export default CustomDropdown;
