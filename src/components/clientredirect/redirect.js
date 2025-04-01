"use client"; 

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientRedirect() {
  const router = useRouter();

  useEffect(() => {
    const activeChannel = localStorage.getItem("activeChannel");

    if (activeChannel) {
      router.replace(`./messages/${activeChannel}`);
    } else {
      router.replace("./messages");
    }
  }, [router]);

  return null;
}