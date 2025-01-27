import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";

const AuthWrapper = ({ children }) => {
    const Router = useRouter();
    const [isUserValid, setIsUserValid] = useState(false);
    useEffect(() => {
      const checkAuth = () => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            setIsUserValid(true);
            console.log("This is the logged in user", user);
          } else {
            console.log("no user found");
            setIsUserValid(false);
            Router.push("/login");
          }
        });
      };
  
      checkAuth();
    }, []);
  
    if (isUserValid) {
      return children;
    } else {
        return <div>Loading...</div>;
    }
};

export default AuthWrapper;