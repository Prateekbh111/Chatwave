"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Silkscreen } from "next/font/google";
import Link from "next/link";
import { signIn } from "next-auth/react";
import GoogleButton from "./GoogleButton";
import LogoNFeatures from "./LogoNFeatures";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export default function SignIn() {
	const features = [
		"Pick up where you left off.",
		"Stay connected with your circles.",
		"Instant access to all your chats.",
		"Secure login with advanced encryption.",
		"Available on all your devices.",
	];

	return (
		<div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-black p-4 md:p-0">
			<div className="bg-white dark:bg-neutral-800 p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row">
				{/* Left Section: Brand and Features */}
				<LogoNFeatures features={features} />

				{/* Right Section: Google Login */}
				<div className="w-full md:w-1/2 pl-0 md:pl-12 flex flex-col items-center justify-center">
					<h2
						className={`${ss.className} text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6 md:mb-8`}
					>
						Welcome Back
					</h2>

					<GoogleButton title="Sign In with Google" />

					<p className="text-center text-gray-600 dark:text-gray-400 text-xs md:text-sm mt-4 md:mt-6">
						Don't have an account?{" "}
						<Link
							className="text-indigo-600 dark:text-indigo-400 hover:underline"
							href="/sign-up"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
