import Dashboard from "./dashboard";

export async function generateMetadata() {
  return {
    title: "TrackIt | Dashboard",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default function Page() {
  return(
    <Dashboard />
  )
}