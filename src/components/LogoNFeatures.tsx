import { Silkscreen } from "next/font/google";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export default function LogoNFeatures({ features }: { features: string[] }) {
	return (
		<div className="w-full md:w-1/2 pr-0 md:pr-12 border-r-0 md:border-r border-gray-200 dark:border-neutral-700 mb-8 md:mb-0">
			<div className="flex flex-col items-center justify-center h-full">
				<div className={`${ss.className} relative`}>
					<h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-center mb-4">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
							CHAT
							<span className="text-indigo-700 dark:text-indigo-400">WAVE</span>
						</span>
					</h1>
					<div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-150 animate-pulse"></div>
				</div>
				<p className="text-lg md:text-xl text-gray-700 dark:text-gray-400 font-normal tracking-wide mb-12">
					Ride the Wave of Conversations
				</p>

				<ul className="space-y-1 text-gray-600 dark:text-gray-300">
					{features.map((feature, index) => (
						<li
							key={index}
							className="flex items-center p-3 rounded-lg transition-colors duration-200 hover:bg-indigo-50 dark:hover:bg-indigo-900 group"
						>
							<span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-800 rounded-full mr-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-700 transition-colors duration-200">
								{index === 0 && (
									<svg
										className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
										></path>
									</svg>
								)}
								{index === 1 && (
									<svg
										className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										></path>
									</svg>
								)}
								{index === 2 && (
									<svg
										className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										></path>
									</svg>
								)}
								{index === 3 && (
									<svg
										className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
										></path>
									</svg>
								)}
								{index === 4 && (
									<svg
										className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										></path>
									</svg>
								)}
							</span>
							<span className="font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
								{feature}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
