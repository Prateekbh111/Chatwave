import { useEffect, useState } from "react";

const WS_URL = "ws://localhost:8080";

export default function useSocket() {
	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		const ws = new WebSocket(WS_URL);

		ws.onopen = async () => {
			console.log("CONNECTED!");
			setSocket(ws);
		};

		ws.onclose = async () => {
			console.log("DISCONNECTED!");
			setSocket(null);
		};

		return () => ws.close();
	}, []);

	return socket;
}
