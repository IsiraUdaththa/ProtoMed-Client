"use client";

import React, { useState, useEffect } from "react";
import { Card, List, Avatar, Input, Button, Typography, Space, message as AntMessage } from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "@/lib/axiosInstance";
import UserTag from "@/app/_components/UserTag";

const { Text } = Typography;
const { TextArea } = Input;

type Discussion = {
	_id: string;
	author: string;
	content: string;
	createdAt: string;
	replies?: Discussion[];
};

interface ForumDiscussionProps {
	orderId: string;
}

const ForumDiscussion: React.FC<ForumDiscussionProps> = ({ orderId }) => {
	const [discussions, setDiscussions] = useState<Discussion[]>([]);
	const [loading, setLoading] = useState(false);
	const [newContent, setNewContent] = useState("");

	const fetchDiscussions = async () => {
		setLoading(true);
		try {
			const res = await api.get(`/orders/${orderId}/discussions`);
			console.log(res.data);
			setDiscussions(res.data.discussions);
		} catch (err) {
			AntMessage.error("Failed to fetch discussions.");
		} finally {
			setLoading(false);
		}
	};

	const postDiscussion = async () => {
		if (!newContent.trim()) return;
		try {
			const res = await api.post(`/orders/${orderId}/discussions`, {
				content: newContent,
			});
			setDiscussions((prev) => [res.data, ...prev]);
			setNewContent("");
		} catch (err) {
			AntMessage.error("Failed to post discussion.");
		}
	};

	const postReply = async (discussionId: string, replyContent: string) => {
		if (!replyContent.trim()) return;

		try {
			const res = await api.post(`/orders/${orderId}/discussions/`, {
				content: replyContent,
				replyToMessageId: discussionId,
			});

			setDiscussions((prev) =>
				prev.map((d) => (d._id === discussionId ? { ...d, replies: [...(d.replies || []), res.data] } : d)),
			);
		} catch (err) {
			AntMessage.error("Failed to post reply.");
		}
	};

	useEffect(() => {
		fetchDiscussions();
	}, []);

	const PostItem: React.FC<{ post: Discussion }> = ({ post }) => {
		const [replyContent, setReplyContent] = useState("");

		return (
			<Card style={{ marginBottom: 16 }}>
				<Space align="start">
					<Avatar icon={<UserOutlined />} />
					<div>
						<Text strong>
							<UserTag userId={post.author} />{" "}
							<Text type="secondary" style={{ fontSize: 12 }}>
								{new Date(post.createdAt).toLocaleString()}
							</Text>
						</Text>
						<br />
						<Text>{post.content}</Text>
					</div>
				</Space>

				<div style={{ marginTop: 12, marginLeft: 40 }}>
					{post.replies?.map((reply) => (
						<Card size="small" key={reply._id} style={{ marginBottom: 8, background: "#fafafa" }}>
							<Space align="start">
								<Avatar size="small" icon={<UserOutlined />} />
								<div>
									<Text strong>
										<UserTag userId={post.author} />{" "}
										<Text type="secondary" style={{ fontSize: 12 }}>
											{new Date(reply.createdAt).toLocaleString()}
										</Text>
									</Text>
									<div>{reply.content}</div>
								</div>
							</Space>
						</Card>
					))}

					<TextArea
						rows={2}
						placeholder="Write a reply..."
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
					/>
					<Button
						size="small"
						onClick={async () => {
							await postReply(post._id, replyContent);
							setReplyContent("");
						}}
						type="link"
						style={{ paddingLeft: 0 }}
					>
						Reply
					</Button>
				</div>
			</Card>
		);
	};

	return (
		<Card>
			<TextArea
				rows={3}
				placeholder="Start a new discussion..."
				value={newContent}
				onChange={(e) => setNewContent(e.target.value)}
			/>
			<Button type="primary" onClick={postDiscussion} style={{ marginTop: 8 }} loading={loading}>
				Post
			</Button>

			<List
				itemLayout="vertical"
				dataSource={discussions}
				renderItem={(post) => <PostItem key={post._id} post={post} />}
				style={{ marginTop: 24 }}
			/>
		</Card>
	);
};

export default ForumDiscussion;
