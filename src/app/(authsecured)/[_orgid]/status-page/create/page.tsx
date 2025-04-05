import CreateStatusPage from "./createstatus";

export async function generateMetadata() {
  return {
    title: "TrackIt | Create Status Page",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default function Page() {
  return(
    <CreateStatusPage />
  )
}