"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, User } from "lucide-react";
import { SideBar } from "@/components/SideBar";
import { Silkscreen } from "next/font/google";
import { redisClient } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toastNotify } from "@/components/ui/ToastNotify";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
	id: number;
	senderId: string;
	message: string;
	timestamp: string;
}

interface User {
	id: number;
	name: string;
	avatar: string;
	lastMessage: string;
}

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

interface PageProps {
	params: {
		chatId: string;
	};
}
export default function ChatInterface({ params }: PageProps) {
	const messageView = useRef<HTMLDivElement>(null);
	const { data: session } = useSession();
	const { chatId } = params;

	const [messages, setMessages] = useState<Message[]>([]);
	const [isFetchingMessages, setIsFetchingMessages] = useState<boolean>(false);

	const [inputMessage, setInputMessage] = useState("");

	async function sendMessage() {
		if (inputMessage.trim() === "") return;

		try {
			console.log("Sending message");
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					senderId: session?.user.id!,
					message: inputMessage,
					timestamp: new Date().toISOString(),
				},
			]);
			messageView.current?.scrollIntoView({ behavior: "smooth" });
			setInputMessage("");

			await axios.post<ApiResponse>("/api/sendMessage", {
				message: inputMessage,
				chatId,
			});
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toastNotify(axiosError.response?.data.message!);
		}
	}

	useEffect(() => {
		async function fetchUserMessages() {
			if (session?.user) {
				console.log("Fetching messages");
				const user = session.user;
				const [userId1, userId2] = chatId.split("--");

				if (user.id !== userId1 && user.id !== userId2) return;

				try {
					setIsFetchingMessages(true);
					const allMessages: Message[] = await redisClient.zrange(
						`chat:${chatId}:messages`,
						0,
						-1
					);
					setMessages(allMessages);
					if (allMessages.length > 0)
						messageView.current?.scrollIntoView({ behavior: "smooth" });
				} catch (error) {
					console.log(error);
				} finally {
					setIsFetchingMessages(false);
				}
			}
		}

		fetchUserMessages();
	}, [session]);

	useEffect(() => {
		if (session?.user) {
			pusherClient.subscribe(toPusherKey(`chat:${chatId}:messages`));

			const messageHandler = (data: Message) => {
				if (data.senderId !== session.user.id) {
					setMessages((prevMessage) => [...prevMessage, data]);
					messageView.current?.scrollIntoView({ behavior: "smooth" });
				}
			};

			pusherClient.bind(`messages`, messageHandler);
		}

		return () => {
			pusherClient.unsubscribe(toPusherKey(`chat:${chatId}:messages`));

			pusherClient.unbind(`messages`);
		};
	}, [session]);

	return (
		<div className="h-full w-full  flex flex-col">
			<div className="flex-grow p-4 md:p-6 md:pb-0 space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)]">
				{isFetchingMessages ? (
					<div className="flex-grow p-4 md:p-6 space-y-4">
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className={`flex ${
									i % 2 === 0 ? "justify-start" : "justify-end"
								}`}
							>
								<Skeleton
									className={`h-16 w-1/3 rounded-lg ${
										i % 2 === 0
											? "mr-auto bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200"
											: "ml-auto bg-indigo-500 dark:bg-indigo-600"
									}`}
								>
									<Skeleton className="m-4 h-3 w-3/4" />
									<Skeleton className="ml-auto mb-1 mr-2 h-3 w-1/5" />
								</Skeleton>
							</div>
						))}
					</div>
				) : messages.length === 0 ? (
					<div className="flex h-full justify-center items-center">
						<h1
							className={`${ss.className} text-4xl md:text-5xl font-black tracking-tighter text-center mb-4 sm:mb-6`}
						>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
								No
								<span className="text-indigo-700 dark:text-indigo-400">
									chats
								</span>
							</span>
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
								to
								<span className="text-indigo-700 dark:text-indigo-400">
									show
								</span>
							</span>
						</h1>
					</div>
				) : (
					<ul className="space-y-2">
						{messages.map((message) => (
							<li
								key={message.id}
								className={`flex ${
									message.senderId === session?.user.id
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`rounded-lg p-3 md:p-4 max-w-[70%] ${
										message.senderId === session?.user.id
											? "bg-indigo-500 dark:bg-indigo-600 text-white"
											: "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200"
									}`}
								>
									<p className="text-sm md:text-base">{message.message}</p>
									<p className="text-xs text-right mt-1 opacity-70">
										{new Date(message.timestamp).toLocaleTimeString([], {
											hour: "numeric",
											minute: "2-digit",
										})}
									</p>
								</div>
							</li>
						))}
					</ul>
				)}

				<div className="h-14 md:h-20 " ref={messageView}></div>
			</div>

			<div className="p-4 md:p-6 bg-gray-50 dark:bg-neutral-900 rounded-b-3xl md:rounded-none">
				<div className="flex items-center space-x-2 md:space-x-4">
					<Input
						type="text"
						placeholder="Type your message..."
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						className="mb-2 flex-grow px-4 py-2 md:py-3 rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								sendMessage();
							}
						}}
					/>
					<Button
						onClick={sendMessage}
						className="mb-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 transition duration-300 ease-in-out"
					>
						<SendHorizontal strokeWidth={2} />
					</Button>
				</div>
			</div>
		</div>
	);
}
