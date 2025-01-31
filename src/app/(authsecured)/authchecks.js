import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const AuthWrapper = ({ children }) => {
  const Router = useRouter();
  const [isUserValid, setIsUserValid] = useState(false);


  useEffect(() => {
    const checkAuth = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setIsUserValid(true);

        } else {
          setIsUserValid(false);
          Router.push("/auth/login");
        }
      });
    };
    checkAuth();
  }, []);

  return isUserValid ? children : null;
};

export default AuthWrapper;
