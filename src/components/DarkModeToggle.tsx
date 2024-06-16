"use client";
import { useState } from "react";

const DarkModeToggle = () => {
	const [isDark, setIsDark] = useState(false);

	const toggleDarkMode = () => {
		const newTheme = !isDark ? "dark" : "light";
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark");
		setIsDark(!isDark);
	};

	return (
		<button
			onClick={toggleDarkMode}
			className="fixed top-4 right-4 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 p-2 rounded-full shadow-md"
		>
			{isDark ? "🌙" : "☀️"}
		</button>
	);
};

export default DarkModeToggle;
