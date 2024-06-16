"use client";
import { ContactRound, MessageSquarePlus, Router } from "lucide-react";
import { Silkscreen } from "next/font/google";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redisClient } from "@/lib/redis";
import { toastNotify } from "./ui/ToastNotify";
import { Skeleton } from "./ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export function SideBar() {
	const { data: session } = useSession();

	const [activeUserId, setActiveUserId] = useState<string>("");

	const [chatSearch, setChatSearch] = useState<string>("");
	const [isFriendRequest, setIsFriendRequest] = useState(false);
	const [isFetchingFriends, setIsFetchingFriends] = useState(false);

	const [userFriends, setUserFriends] = useState<Friend[]>([]);

	const router = useRouter();
	const pathName = usePathname();

	function handleChatSelect(whomToChatWith: string) {
		setActiveUserId(whomToChatWith);
		const userId = session?.user.id;
		const sortedIds = [userId, whomToChatWith].sort();

		const chatId = `${sortedIds[0]}--${sortedIds[1]}`;
		router.replace(`/dashboard/chat/${chatId}`);
	}

	useEffect(() => {
		async function fetchUserFriends() {
			if (session?.user.id) {
				try {
					setIsFetchingFriends(true);
					const response: Friend[] = await redisClient.smembers(
						`user:${session!.user.id}:friends`
					);
					setUserFriends(response);
				} catch (error) {
					toastNotify("Error while fetching friends");
				} finally {
					setIsFetchingFriends(false);
				}
			}
		}
		fetchUserFriends();

		if (session?.user) {
			pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`));

			const friendsHandler = (data: Friend) => {
				setUserFriends((prevFriends) => [...prevFriends, data]);
			};

			pusherClient.bind("friends", friendsHandler);
		}

		return () => {
			pusherClient.unsubscribe(toPusherKey(`user:${session?.user.id}:friends`));

			pusherClient.unbind("friends");
		};
	}, [session]);

	useEffect(() => {
		if (session?.user) {
			pusherClient.subscribe(
				toPusherKey(`user:${session.user.id}:friendRequests`)
			);

			const friendRequestHandler = () => {
				console.log("new friend request");
				if (pathName !== "/dashboard/requests") {
					setIsFriendRequest(true);
				}
			};

			pusherClient.bind("friendRequests", friendRequestHandler);
		}

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${session?.user.id}:friendRequests`)
			);

			pusherClient.unbind("friendRequests");
		};
	}, [session]);

	return (
		<div className="flex flex-col justify-between w-full md:w-2/5 lg:w-2/5 border-b md:border-b-0 md:border-r border-gray-200 dark:border-neutral-700">
			<div className="p-4 md:p-4">
				<Link href="/dashboard" onClick={() => setActiveUserId("")}>
					<div className={`${ss.className} relative mb-6`}>
						<h1 className="text-2xl md:text-3xl font-black tracking-tighter text-center">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
								CHAT
								<span className="text-indigo-700 dark:text-indigo-400">
									WAVE
								</span>
							</span>
						</h1>
						<div className="absolute inset-0 blur-2xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-150 animate-pulse"></div>
					</div>
				</Link>

				<div className="flex justify-between text-gray-700 dark:text-gray-300 mb-4 px-4">
					<div className={ss.className}>
						<h3 className="font-semibold text-gray-700 dark:text-gray-300">
							Chats
						</h3>
					</div>

					<Link
						href={"/dashboard/add"}
						className="hover:text-indigo-400 text-gray-700 dark:text-gray-300 transition duration-300 ease-in-out"
					>
						<MessageSquarePlus className="h-6 w-6" />
					</Link>
				</div>

				<div className="flex space-x-2 mb-4">
					<Input
						type="text"
						placeholder="Search"
						value={chatSearch}
						onChange={(e) => setChatSearch(e.target.value)}
						className=" flex-grow px-4 py-2 md:py-3 rounded-lg bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
					/>
				</div>
				{isFetchingFriends || !session ? (
					<div className="space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center space-x-4">
								<Skeleton className="h-10 w-10 rounded-full bg-neutral-700" />
								<Skeleton className="h-4 w-3/4 bg-neutral-700" />
							</div>
						))}
					</div>
				) : userFriends.length === 0 ? (
					<h1 className={ss.className}>
						No friends yet. Add friends to start your wave
					</h1>
				) : (
					<ul className="space-y-2 mb-4">
						{userFriends
							.filter((user) =>
								user.name.toLowerCase().startsWith(chatSearch.toLowerCase())
							)
							.map((user) => (
								<li
									key={user.id}
									onClick={() => handleChatSelect(user.id)}
									className={
										user.id === activeUserId
											? "flex items-center p-2 rounded-lg transition-colors duration-200 cursor-pointer bg-indigo-100 dark:bg-indigo-900"
											: `flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900 cursor-pointer`
									}
								>
									<div className="w-10 h-10 flex items-center justify-center mr-3">
										<img className="rounded-full" src={user.image} alt="" />
									</div>
									<div className={ss.className}>
										<h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
											{user.name}
										</h4>
									</div>
								</li>
							))}
					</ul>
				)}
			</div>

			<div className="p-4 flex flex-col space-y-5">
				<Link
					onClick={() => setIsFriendRequest(false)}
					href={"/dashboard/requests"}
					className="bg-indigo-600 text-whitefont-semibold py-2 md:py-2 px-3 md:px-3 rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center space-x-2 "
				>
					<ContactRound className="text-gray-300" />
					<div className={ss.className}>
						<h3 className="font-semibold text-gray-300">Friend Requests</h3>
					</div>
					{isFriendRequest && (
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-400"></span>
						</span>
					)}
				</Link>

				{!session ? (
					<div className="flex justify-between">
						<div className="flex items-center space-x-4">
							<Skeleton className="min-h-10 min-w-10 rounded-full bg-neutral-700" />
							<Skeleton className="min-h-4 min-w-32 bg-neutral-700" />
						</div>
						<div>
							<Skeleton className="min-h-10 min-w-20 bg-neutral-700" />
						</div>
					</div>
				) : (
					<>
						<div className=" flex justify-between ">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold">
									<img className="rounded-full" src={session!.user!.image!} />
								</div>
								<div className={ss.className}>
									<h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
										{session!.user!.name}
									</h2>
								</div>
							</div>
							<Button
								onClick={() => signOut({ callbackUrl: "/sign-in" })}
								className=" bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out"
							>
								Logout
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
