import Premium from "./premium";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "TrackIt Premium",
    description: "TrackIt is an all-in-one platform for managing teams, support requests, shifts, and projects efficiently.",
  };
}

export default function Page() {
  return(
    <Premium />
  )
}