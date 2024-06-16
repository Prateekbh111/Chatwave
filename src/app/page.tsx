"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/sign-in");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
				<div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
					Loading...
				</div>
			</div>
		);
	}

	if (!session) {
		return null;
	}

	const handleLogout = () => {
		signOut({ callbackUrl: "/sign-in" });
	};

	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
						Welcome, {session.user?.name || session.user?.email}!
					</h1>
					<Button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out"
					>
						Logout
					</Button>
				</div>
				<div className="space-y-6">
					<div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-xl">
						<h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
							User Session Data
						</h2>
						<pre className="bg-white dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
							{JSON.stringify(session, null, 2)}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
