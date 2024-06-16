"use client";
import SignIn from "@/components/SignIn";
import { useChatContext } from "@/context/ChatContextProvider";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function page() {
	return <SignIn />;
}
