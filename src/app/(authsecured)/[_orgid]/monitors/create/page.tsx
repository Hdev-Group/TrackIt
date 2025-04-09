import CreateMonitor from "./create";

export async function generateMetadata() {
  return {
    title: "TrackIt | Create Monitor",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default async function Page({ params }: { params: { _orgid: string } }) {
  const { _orgid } = await params;
  console.log("Org ID: ", _orgid);
  return(
    <CreateMonitor spaceid={_orgid} />
  )
}