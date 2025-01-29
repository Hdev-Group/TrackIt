import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const AuthWrapper = ({ children }) => {
  const Router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3001", { transports: ["websocket"] });
    }

    const checkAuth = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setIsUserValid(true);
            if (socket) {
            socket.emit("checkOnlineStatus", { userId: user.uid }, (isOnline) => {
              if (!isOnline) {
              socket.emit("online", { userId: user.uid });
              }
            });
            }

          socket.on("disconnectUser", (userId) => {
            setOnlineUsers((prev) => prev.filter((user) => user.userId !== userId));
          });
        } else {
          setIsUserValid(false);
          Router.push("/login");
        }
      });
    };


    socket.on("userDisconnected", (userId) => {
      setOnlineUsers((prev) => prev.filter((user) => user.userId !== userId));
    });

    checkAuth();

    return () => {
      if (socket) {
        socket.emit("manualDisconnect"); 
        socket.off("userDisconnected");
        socket.off("disconnectUser");
        socket.disconnect();
      }
    };
  }, []);

  return isUserValid ? children : null;
};

export default AuthWrapper;
