import { Silkscreen } from "next/font/google";
import toast from "react-hot-toast";

const ss = Silkscreen({
	weight: "400",
	subsets: ["latin"],
});

export function toastNotify(message: string) {
	toast.custom(
		(t) => (
			<div
				className={`${
					t.visible ? "animate-enter" : "animate-leave"
				} max-w-sm w-full bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg flex items-center justify-center`}
			>
				<div className="flex flex-col items-center">
					<div className={`${ss.className} relative`}>
						<p className="text-xs md:text-sm text-gray-700 dark:text-gray-400 font-normal tracking-wide mb-2 text-center">
							{message}
						</p>
						<div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-50 bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-600 dark:to-indigo-800 rounded-full transform scale-100 animate-pulse"></div>
					</div>

					<button
						onClick={() => toast.dismiss(t.id)}
						className="bg-indigo-600 dark:bg-indigo-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-neutral-800 transition duration-300 ease-in-out"
					>
						Dismiss
					</button>
				</div>
			</div>
		),
		{ duration: 3000 }
	);
}
