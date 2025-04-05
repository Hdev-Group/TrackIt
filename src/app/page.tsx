import Home from "./indexPage";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TrackIt - The command center for your SaaS.",
    description: "TrackIt is an all-in-one platform for managing teams, support requests, shifts, and projects efficiently.",
  };
}

export default function Page() {
  return(
    <Home />
  )
}