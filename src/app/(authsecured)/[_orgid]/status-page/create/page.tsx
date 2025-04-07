import CreateStatusPage from "./createstatus";

export async function generateMetadata() {
  return {
    title: "TrackIt | Create Status Page",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default async function Page({ params }: { params: { _orgid: string } }) {
  const { _orgid } = await params;
  return(
    <CreateStatusPage _orgid={_orgid} />
  )
}