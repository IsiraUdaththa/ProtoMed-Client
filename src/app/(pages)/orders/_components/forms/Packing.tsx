"use client";

import React, { useState } from "react";
import { Form, Upload, Button, Space, Steps, Card, Typography, Result } from "antd";
import { FileImageOutlined, VideoCameraAddOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Text } = Typography;

const normFile = (e: any) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const App: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [formValues, setFormValues] = useState<any>({});
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const onFinish = (values: any) => {
    setFormValues(values);
    next();
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch (error) {
      setIsSuccess(false);
    }
    next();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card
        title="Implant Confirmation Process"
        style={{ maxWidth: "600px", width: "100%", padding: "20px" }}
      >
        <Steps current={current} onChange={setCurrent}>
          <Step title="Upload Files" icon={<VideoCameraAddOutlined />} />
          <Step title="Confirm Details" icon={<FileImageOutlined />} />
          <Step title="Status" icon={<FileImageOutlined />} />
        </Steps>

        {current === 0 && (
          <Form
            name="uploadForm"
            onFinish={onFinish}
            initialValues={{
              "input-number": 3,
            }}
          >
           <Form.Item name="ct-image-2d" valuePropName="fileList" getValueFromEvent={normFile}>
  <Upload.Dragger
    name="ct-image-2d"
    action="/upload.do"
    multiple={false}
    style={{ width: "80%", height: "150px", margin: "0 auto" }} // Set your desired size here
  >
    <p className="ant-upload-drag-icon">
      <VideoCameraAddOutlined />
    </p>
    <p className="ant-upload-hint">Click or drag Video of Final Implant to this area to upload</p>
  </Upload.Dragger>
</Form.Item>

<Form.Item name="ct-image-2d-picture" valuePropName="fileList" getValueFromEvent={normFile}>
  <Upload.Dragger
    name="ct-image-2d-picture"
    action="/upload.do"
    multiple={false}
    style={{ width: "80%", height: "150px", margin: "0 auto" }} // Set your desired size here
  >
    <p className="ant-upload-drag-icon">
      <FileImageOutlined />
    </p>
    <p className="ant-upload-hint">Click or drag Picture of Final Implant to this area to upload</p>
  </Upload.Dragger>
</Form.Item>

<Form.Item name="ct-image-3d" valuePropName="fileList" getValueFromEvent={normFile}>
  <Upload.Dragger
    name="ct-image-3d"
    action="/upload.do"
    multiple={false}
    style={{ width: "80%", height: "150px", margin: "0 auto" }} // Set your desired size here
  >
    <p className="ant-upload-drag-icon">
      <FileImageOutlined />
    </p>
    <p className="ant-upload-hint">Click or drag Picture of Packaging to this area to upload</p>
  </Upload.Dragger>
</Form.Item>
  <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Next
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}

        {current === 1 && (
          <div style={{ textAlign: "center" }}>
            <Text strong>User: {formValues?.userName || "Not Provided"}</Text>
            <br />
            <Text strong>Date & Time: {new Date().toLocaleString()}</Text>
            <br />
            {/* <div style={{ marginTop: 20 }}> */}
              <Button onClick={prev} style={{ marginRight: 10 }}>
                Back
              </Button>
              <Button type="primary" onClick={handleSubmit}>
                Confirm
              </Button>
            </div>
         // </div>
        )}

        {current === 2 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            {isSuccess ? (
              <Result status="success" title="Implant Confirmation Successful" />
            ) : (
              <Result status="error" title="Implant Submission Failed" subTitle="Please try again." />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default App;
