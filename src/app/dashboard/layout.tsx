"use client";

import { SideBar } from "@/components/SideBar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black p-4 md:p-0">
			<div className="bg-white dark:bg-neutral-800 rounded-3xl md:rounded-none shadow-xl w-full flex flex-col md:flex-row">
				{/* Left Section: User Info and Recent Chats */}
				<SideBar />
				{children}
			</div>
		</div>
	);
}
