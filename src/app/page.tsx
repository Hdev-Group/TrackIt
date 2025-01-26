import Home from "./indexPage";

export async function generateMetadata() {
  return {
    title: "TrackIt - Get Tickets Done Faster",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default function Page() {
  return(
    <Home />
  )
}