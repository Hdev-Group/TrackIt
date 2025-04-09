import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase";
import { useEffect, useState, useCallback } from "react";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const [isUserValid, setIsUserValid] = useState(null); 
  const [isOnline, setIsOnline] = useState(true);

  const handleAuthChange = useCallback(
    (user) => {
      if (user) {
        setIsUserValid(true);
        user
          .getIdToken(true)
          .catch((error) => {
            console.error("Token refresh failed:", error);
            setIsUserValid(false);
            router.push("/auth/signin");
          });
      } else {
        setIsUserValid(false);
        router.push("/auth/signin");
      }
    },
    [router]
  );

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        handleAuthChange(user);
      },
      (error) => {
        console.error("Auth state error:", error);
        setIsUserValid(false);
        router.push("/auth/signin");
      }
    );

    return () => unsubscribe();
  }, [handleAuthChange]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      if (isUserValid) {
        // Give brief grace period before forcing signout
        setTimeout(() => {
          if (!navigator.onLine) {
            setIsUserValid(false);
            router.push("/auth/signin");
          }
        }, 5000); // 5 second grace period
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isUserValid, router]);

  // User activity monitoring for idle timeout
  useEffect(() => {
    let idleTimeout;
    
    const resetIdleTimer = () => {
      clearTimeout(idleTimeout);
      if (isUserValid) {
        idleTimeout = setTimeout(() => {
          auth.signOut();
          setIsUserValid(false);
          router.push("/auth/signin");
        }, 30 * 60 * 1000); // 30 minutes timeout
      }
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keypress", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    resetIdleTimer(); // Start timer initially

    return () => {
      clearTimeout(idleTimeout);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keypress", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [isUserValid, router]);

  // Render logic
  if (isUserValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading authentication...</div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">No internet connection detected</div>
      </div>
    );
  }

  return isUserValid ? children : null;
};

export default AuthWrapper;