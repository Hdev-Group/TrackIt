import Monitors from "./monitors";

export async function generateMetadata() {
  return {
    title: "TrackIt | Monitors",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default function Page() {
  return(
    <Monitors />
  )
}