'use client';
import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Form, Input, Radio, Select } from 'antd';

const { TextArea } = Input;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select style={{ width: 70 }}>
      <Select.Option value="+94">+94</Select.Option>
      <Select.Option value="+87">+87</Select.Option>
    </Select>
  </Form.Item>
);

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Handle form submission
  const handleSubmit = async (values: any) => {
    console.log('Submitted Data:', values);

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2NlZGFkY2VmMjIwODQyNGM3OTk4YzkiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDE4ODM2OTQsImV4cCI6MTc0MTg4NzI5NH0.m6TgEiivCUUV00BoFyFKdIKFonDTdPrpS0jwXVXL1Wk';  // Your token
    const url = 'http://localhost:5000/api/orders';  // The backend URL

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sending token in the header
        },
        body: JSON.stringify(values), // Sending form data
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        disabled={componentDisabled}
        style={{ maxWidth: 600, width: '100%' }}
        onFinish={handleSubmit}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select your gender' }]}>
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Date of Birth" name="dob" rules={[{ required: true, message: 'Please select your birth date' }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
          <Select>
            {['Accuplasty', 'Accupectomy', 'Accufacial', 'Accuortho', 'Lamifix', 'Screws', 'Accumesh', 'Screws And Plates', 'Other'].map((item) => (
              <Select.Option key={item} value={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="CT Scan Collecting Method" name="collectingMethod" rules={[{ required: true, message: 'Please select a method' }]}>
          <Select>
            {['DVD - Courrier by patient', 'DVD - Collect by company', 'Google Drive Upload', 'Website Upload', 'WeTransfer', 'Screws', 'Clay Model', 'None'].map((method) => (
              <Select.Option key={method} value={method}>{method}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Phone Number" name="contactNumber" rules={[{ required: true, message: 'Please enter your phone number', max: 10 }]}>
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Doctor's Name" name="doctor">
          <Input />
        </Form.Item>

        <Form.Item label="Hospital Name" name="hospital">
          <Input />
        </Form.Item>

        <Form.Item label="Form Filled by" name="filledBy" rules={[{ required: true, message: 'Please enter the name' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Planned Date" name="plannedDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Comment" name="comment">
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationForm;
