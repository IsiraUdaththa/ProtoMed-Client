"use client";

import React, { useEffect, useState } from "react";
import { Descriptions, Spin, Alert, Tooltip, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";

import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

const OrderInfo: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [data, setData] = useState<DescriptionsProps["items"] | null>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`orders/${orderId}/patient`);

        if (!response.data) {
          throw new Error("Empty response from server.");
        }

        const patient = response.data || {};
        setPatient(patient); // store for tooltip use

        const items: DescriptionsProps["items"] = [
          { key: "1", label: "Name", children: patient.name || "N/A" },
          { key: "2", label: "Age", children: patient.age || "N/A" },
          { key: "3", label: "Gender", children: patient.gender || "N/A" },
          { key: "4", label: "Contact Number", children: patient.contactNumber || "N/A" },
          { key: "5", label: "Address", children: patient.address || "N/A" },
          { key: "6", label: "Category", children: patient.category || "N/A" },
          { key: "7", label: "Surgeon Name", children: patient.surgeonName || "N/A" },
          { key: "9", label: "Hospital", children: patient.hospital || "N/A" },
          { key: "10", label: "Ward", children: patient.ward || "N/A" },
          { key: "8", label: "CT Scan Method", children: patient.ctScanMethod || "N/A" },
          { key: "11", label: "Planned Surgery Date", children: patient.surgeryDate || "N/A" },
          { key: "12", label: "Comment", children: patient.comment || "N/A" },
          // Do NOT include Registered By here
        ].filter((item) => item.children !== "N/A");

        setData(items.length > 0 ? items : null);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setError("Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!data) return <Alert message="No order details available." type="info" showIcon />;

  return (
    <>
      <Descriptions items={data} column={2} />
{patient?.registeredBy && (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
    <Tooltip color="white"
	placement="left"
      title={
        <div>
          
              <UserTag userId={patient.registeredBy} />
          
          <div >
            <span style={{ color: "black" }}>
              {new Date(patient.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      }
    >
      <Button
        type="text"
        shape="circle"
        icon={<ExclamationCircleOutlined />}
      />
    </Tooltip>
  </div>
)}

    </>
  );
};

export default OrderInfo;
