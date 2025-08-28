'use client';
import React, { useState, useEffect } from "react";
import {
  Select,
  Input,
  Button,
  Space,
  Popconfirm,
  Typography,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";

const { Option } = Select;
const { Text } = Typography;

interface DropdownSelectorProps {
  type: string; // e.g. "doctors", "hospitals", "labs"
  label: string; // e.g. "Doctor", "Hospital"
  prefix?: string; // e.g. "Dr." for doctors
  value?: string;
  onChange?: (value: string) => void;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = ({
  type,
  label,
  prefix,
  value,
  onChange,
}) => {
  const [items, setItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | undefined>(value);
  const [newItem, setNewItem] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`dropdowns/${type}`);
        setItems(response.data);
      } catch (err) {
        message.error(`Failed to load ${label.toLowerCase()}s, using fallback list`);
        setItems([`${prefix ? prefix + " " : ""}Default ${label} 1`, `${prefix ? prefix + " " : ""}Default ${label} 2`]);
      }
    };
    fetchItems();
  }, [type, label, prefix]);

  const addItem = async () => {
    const formattedName = `${prefix ? prefix + " " : ""}${newItem.trim()}`;
    if (!newItem.trim()) {
      setError(`Please enter a ${label.toLowerCase()} name`);
      return;
    }
    if (items.includes(formattedName)) {
      setError(`"${formattedName}" already exists`);
      return;
    }
    try {
      await api.put(`dropdowns/${type}`, { name: formattedName });
      setItems([...items, formattedName]);
      setSelectedItem(formattedName);
      onChange?.(formattedName);
      setNewItem("");
      setError("");
      message.success(`${formattedName} added!`);
    } catch (err) {
      message.error(`Failed to add ${label.toLowerCase()}`);
    }
  };

  const deleteItem = async (name: string) => {
    try {
      await api.delete(`dropdowns/${type}/${encodeURIComponent(name)}`);
      setItems(items.filter((i) => i !== name));
      if (selectedItem === name) {
        setSelectedItem(undefined);
        onChange?.("");
      }
      message.success(`${name} deleted!`);
    } catch (err) {
      message.error(`Failed to delete ${label.toLowerCase()}`);
    }
  };

  return (
    <Select
      style={{ width: 300 }}
      placeholder={`Select or add a ${label.toLowerCase()}`}
      value={selectedItem}
      onChange={(val) => {
        setSelectedItem(val);
        onChange?.(val);
      }}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Space direction="vertical" style={{ padding: "8px", display: "flex" }}>
            <Input
              placeholder={`Enter name (without '${prefix || ""}')`}
              value={newItem}
              onChange={(e) => { setNewItem(e.target.value); setError(""); }}
              onPressEnter={addItem}
            />
            {error && <Text type="danger">{error}</Text>}
            <Button type="link" icon={<PlusOutlined />} onClick={addItem}>
              Add
            </Button>
          </Space>
        </>
      )}
      optionLabelProp="label"
    >
      {items.map((item) => (
        <Option key={item} value={item} label={item}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{item}</span>
            <Popconfirm title={`Delete ${item}?`} onConfirm={() => deleteItem(item)} okText="Yes" cancelText="No">
              <DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: "red" }} />
            </Popconfirm>
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default DropdownSelector;
