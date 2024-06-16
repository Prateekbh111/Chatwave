import { Silkscreen } from "next/font/google";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export default function page() {
	return (
		<div className="flex h-full w-full justify-center items-center">
			<div className={`${ss.className} relative`}>
				<h1 className="text-2xl md:text-3xl font-black tracking-tighter text-center">
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
						Nothing
						<span className="text-indigo-700 dark:text-indigo-400">to</span>
					</span>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
						show
						<span className="text-indigo-700 dark:text-indigo-400">here</span>
					</span>
				</h1>
				<div className="absolute inset-0 blur-2xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-150 animate-pulse"></div>
			</div>
		</div>
	);
}
