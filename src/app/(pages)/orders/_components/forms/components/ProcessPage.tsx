"use client";

import React, { useState, useEffect } from "react";
import { Button, Typography, Layout, Row, Col, Card, Steps, Result } from "antd";
import { UserOutlined, CheckCircleOutlined, SolutionOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Step } = Steps;

interface ProcessPageProps {
  title: string;
}

export default function ProcessPage({ title }: ProcessPageProps) {
  const [current, setCurrent] = useState(0);
  const [userName, setUserName] = useState("Fetching...");
  const [dateTime, setDateTime] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => setUserName("John Doe"), 1000);
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleSubmit = async () => {
    console.log(`Submitting ${title}:`, { userName, dateTime });
    try {
      await fakeApiCall();
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSuccess(false);
    }
    next();
  };

  const fakeApiCall = () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.2 ? resolve() : reject("Submission failed");
      }, 1000);
    });
  };

  return (
      <Content>
            <Card title={`${title} Process`} style={{ textAlign: "center" }}>
              <Steps current={current} direction="horizontal">
                <Step title="Start" icon={<UserOutlined />} />
                <Step title="Confirm" icon={<SolutionOutlined />} />
                <Step title="Status" icon={<CheckCircleOutlined />} />
              </Steps>

              {current === 0 && (
                <div style={{ marginTop: 20 }}>
                  <Button type="primary" onClick={next}>
                    Get Started
                  </Button>
                </div>
              )}

              {current === 1 && (
                <div style={{ marginTop: 20 }}>
                  <Title level={4}>Confirm Details</Title>
                  <Text><strong>User:</strong> {userName}</Text>
                  <br />
                  <Text><strong>Date & Time:</strong> {dateTime}</Text>
                  <div style={{ marginTop: 20 }}>
                    <Button onClick={prev} style={{ marginRight: 10 }}>
                      Back
                    </Button>
                    <Button type="primary" onClick={handleSubmit}>
                      Confirm
                    </Button>
                  </div>
                </div>
              )}

              {current === 2 && (
                <div style={{ marginTop: 20 }}>
                  {isSuccess ? (
                    <Result status="success" title={`${title} Confirmed Successfully`} />
                  ) : (
                    <Result status="error" title={`${title} Submission Failed`} subTitle="Please try again." />
                  )}
                </div>
              )}
            </Card>
      </Content>

  );
}
