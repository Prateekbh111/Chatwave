"use client";

import {
	createContext,
	useContext,
	Dispatch,
	SetStateAction,
	useState,
} from "react";

type DataType = null | {
	id: string;
	name: string;
	email: string;
	image: string;
};

interface ChatContextProps {
	activeUserId: string;
	setActiveUserId: Dispatch<SetStateAction<string>>;
}

const ChatContext = createContext<ChatContextProps>({
	activeUserId: "",
	setActiveUserId: (): string => "",
});

export function ChatContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [activeUserId, setActiveUserId] = useState<string>("");

	return (
		<ChatContext.Provider value={{ activeUserId, setActiveUserId }}>
			{children}
		</ChatContext.Provider>
	);
}

export const useChatContext = () => useContext(ChatContext);
