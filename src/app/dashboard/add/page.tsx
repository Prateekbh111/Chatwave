"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Silkscreen } from "next/font/google";
import Link from "next/link";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Loader2, LoaderCircle } from "lucide-react";
import { toastNotify } from "@/components/ui/ToastNotify";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export default function AddFriend() {
	const [email, setEmail] = useState("");
	const [sendingRequest, setSendingRequest] = useState<boolean>(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		try {
			setSendingRequest(true);
			const response = await axios.post<ApiResponse>("/api/addFriend", {
				friendEmail: email,
			});
			toastNotify(response.data.message);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>;
			toastNotify(axiosError.response?.data.message!);
		} finally {
			setSendingRequest(false);
		}

		setEmail("");
	};

	return (
		<div className="flex justify-center items-center w-full min-h-screen  p-4 md:p-0">
			<div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-3xl  w-full max-w-md">
				<div className="flex flex-col items-center justify-center h-full">
					<div className={`${ss.className} relative`}>
						<h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-center mb-4">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
								Add
								<span className="text-indigo-700 dark:text-indigo-400">
									Friend
								</span>
							</span>
						</h1>
						<div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-150 animate-pulse"></div>
					</div>
					<p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 font-normal tracking-wide mb-12">
						Add friends to your chat circle
					</p>

					<form onSubmit={handleSubmit} className="w-full">
						<div className="mb-4">
							<input
								type="email"
								placeholder="Enter friend's email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
							/>
						</div>
						<Button
							type="submit"
							className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 transition duration-300 ease-in-out"
						>
							{sendingRequest ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
								</>
							) : (
								"Send Friend Request"
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
