"use client";
import React, { useEffect, useState } from "react";
import { Silkscreen } from "next/font/google";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { toastNotify } from "@/components/ui/ToastNotify";
import { redisClient } from "@/lib/redis";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export default function RequestPage() {
	const { data: session } = useSession();

	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [isDenying, setIsDenying] = useState<boolean>(false);
	const [isAccepting, setIsAccepting] = useState<boolean>(false);

	useEffect(() => {
		async function fetchFriendRequests() {
			if (session?.user.id) {
				try {
					setLoading(true);
					console.log("fetching");
					const friendRequest = await redisClient.smembers<FriendRequest[]>(
						`user:${session?.user.id}:friendRequests`
					);
					setFriendRequests(friendRequest);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					toastNotify(axiosError.response?.data.message!);
				} finally {
					setLoading(false);
				}
			}
		}

		fetchFriendRequests();
		if (session?.user) {
			pusherClient.subscribe(
				toPusherKey(`user:${session.user.id}:friendRequests`)
			);

			const friendRequestHandler = (data: FriendRequest) => {
				console.log("new friend request");
				console.log(data);
				setFriendRequests((prevFriendRequest) => [...prevFriendRequest, data]);
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

	const handleAcceptRequest = async (requestId: string) => {
		try {
			setIsAccepting(true);

			const response = await axios.post<ApiResponse>(
				"/api/acceptFriendRequest",
				{
					requestId,
				}
			);
			toastNotify(response.data.message);
			setFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.senderId !== requestId)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toastNotify(axiosError.response?.data.message!);
		} finally {
			setIsAccepting(false);
		}
	};

	const handleRejectRequest = async (requestId: string) => {
		try {
			setIsDenying(true);
			const response = await axios.post<ApiResponse>(
				"/api/rejectFriendRequest",
				{
					requestId,
				}
			);
			toastNotify(response.data.message);
			setFriendRequests((prevRequests) =>
				prevRequests.filter((request) => request.senderId !== requestId)
			);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toastNotify(axiosError.response?.data.message!);
		} finally {
			setIsDenying(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen w-full  p-4">
			<div className="md:max-w-4xl max-w-sm mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-3xl w-full">
					<div className="flex flex-col items-center justify-center h-full">
						<div className={`${ss.className} relative`}>
							<h1 className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-4 sm:mb-6">
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
									Friend
									<span className="text-indigo-700 dark:text-indigo-400">
										Requests
									</span>
								</span>
							</h1>
							<div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-150 animate-pulse"></div>
						</div>
						<p className="text-lg md:text-2xl text-gray-700 dark:text-gray-400 font-normal tracking-wide mb-12">
							Manage your friend requests
						</p>

						{loading || !session ? (
							<p className={ss.className}>Loading...</p>
						) : friendRequests.length === 0 ? (
							<p className={ss.className}>No friend requests</p>
						) : (
							<ul className="w-full max-w-2xl">
								{friendRequests.map((request) => (
									<li
										key={request.senderId}
										className="md:flex justify-between items-center p-6 bg-gray-100 dark:bg-neutral-700 rounded-lg mb-4 space-y-2"
									>
										<div>
											<p className="text-gray-800 dark:text-gray-200 font-semibold text-lg md:text-xl">
												{request.senderName}
											</p>
											<p className="text-gray-600 dark:text-gray-400 text-base md:text-lg ">
												{request.senderEmail}
											</p>
										</div>
										<div className="flex space-x-4">
											<button
												onClick={() => handleAcceptRequest(request.senderId)}
												className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 transition duration-300 ease-in-out flex items-center"
											>
												{isAccepting ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
														Accepting...
													</>
												) : (
													"Accept"
												)}
											</button>
											<button
												onClick={() => handleRejectRequest(request.senderId)}
												className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-neutral-800 transition duration-300 ease-in-out flex items-center"
											>
												{isDenying ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
														Rejecting...
													</>
												) : (
													"Reject"
												)}
											</button>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
