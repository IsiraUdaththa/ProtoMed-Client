import React, { useEffect, useState } from "react";
import { Badge, Descriptions, Divider } from "antd";
import type { DescriptionsProps } from "antd";
import api from "@/lib/axiosInstance";

// Define the types for the fetched data
interface PaymentResponse {
  status: string;
  paymentDate: string;
}

interface InvoiceResponse {
  invoiceNo: string;
  issueDate: string;
  sendBy: string;
}

const PaymentCompletion: React.FC<{ orderId: string }> = ({ orderId }) => {
  const [paymentItems, setPaymentItems] = useState<DescriptionsProps["items"]>([]);
  const [invoiceItems, setInvoiceItems] = useState<DescriptionsProps["items"]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  // Fetch data when the component mounts or when orderId changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the payment completion data for the specific order
        const paymentResponse = await api.get(`/orders/${orderId}/payment-completion`);
        if (!paymentResponse.data) {
          throw new Error("Empty Payment response.");
        }
		console.log("Payment response:", paymentResponse.data.fullPayment); // Log the payment response for debugging
        setPaymentStatus(paymentResponse.data.fullPayment);

        // Fetch the invoice data based on the orderId
        const invoiceResponse = await api.get(`/orders/${orderId}/invoice`);
        if (!invoiceResponse.data) {
          throw new Error("Empty Invoice response.");
        }
console.log("Invoice response:", invoiceResponse.data.invoice); // Log the invoice response for debugging
        // Map the fetched data into the Descriptions format for payment
        setPaymentItems([
          {
            key: "1",
            label: "Payment Status",
            children: paymentResponse.data.fullPayment.verifiedBy,
          },
          {
            key: "2",
            label: "Payment Date",
            children: paymentResponse.data.fullPayment.updatedAt
			,
          },
        ]);

        // Map the fetched data into the Descriptions format for invoice
        setInvoiceItems([
          {
            key: "1",
            label: "Invoice No",
            children: invoiceResponse.data.invoice.invoiceNumber,
          },
          {
            key: "2",
            label: "Issue Date",
            children: invoiceResponse.data.invoice.updatedAt,
          },
          {
            key: "3",
            label: "Sent By",
            children: invoiceResponse.data.invoice._id,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orderId]); // Re-fetch data if the orderId changes

  return (
    <>
      <Descriptions title="Payment Information" items={paymentItems} />
      <Divider />
      <Descriptions title="Invoice Information" items={invoiceItems} />
    </>
  );
};

export default PaymentCompletion;
