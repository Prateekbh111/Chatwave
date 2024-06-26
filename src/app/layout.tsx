import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import DarkModeToggle from "@/components/DarkModeToggle";
import { ChatContextProvider } from "@/context/ChatContextProvider";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={roboto.className}>
				<AuthProvider>
					<ChatContextProvider>
						<Toaster position="bottom-right" reverseOrder={false} />
						<DarkModeToggle />
						{children}
					</ChatContextProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
