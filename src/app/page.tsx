import Home from "./indexPage";

export async function generateMetadata() {
  return {
    title: "TrackIt - Making SaaS Simple",
    description: "TrackIt is an all-in-one platform for managing teams, support requests, shifts, and projects efficiently.",
  };
}

export default function Page() {
  return(
    <Home />
  )
}