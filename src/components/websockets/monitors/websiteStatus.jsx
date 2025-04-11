import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export default function useWebsiteStatus({ monitorIds = [] }) {
    const socketRef = useRef(null);
    const [websiteStatus, setWebsiteStatus] = useState({});

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });
        }

        const handleWebsiteStatus = (status) => {
            console.log("Received websiteStatus:", status); // Debug log
            setWebsiteStatus((prevStatus) => {
                const updated = { ...prevStatus };
                if (Array.isArray(status)) {
                    status.forEach((s) => {
                        updated[s.monitorId] = s;
                    });
                } else {
                    updated[status.monitorId] = status;
                }
                return updated;
            });
        };

        socketRef.current.on("websiteStatus", handleWebsiteStatus);

        if (Array.isArray(monitorIds) && monitorIds.length > 0) {
            monitorIds.forEach((monitorId) => {
                socketRef.current.emit("checkWebsiteStatus", { monitorId });
                console.log(`Emitted checkWebsiteStatus for monitor: ${monitorId}`);
            });
        }

        return () => {
            socketRef.current.off("websiteStatus", handleWebsiteStatus);
        };
    }, [JSON.stringify(monitorIds)]);

    return websiteStatus;
}