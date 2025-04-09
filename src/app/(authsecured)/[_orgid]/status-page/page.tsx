import StatusPageMain from "./statuspagemain";

export async function generateMetadata() {
  return {
    title: "TrackIt | StatusPage",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default async function Page({params}: {params: {_orgid: string}}) {
  const { _orgid } = await params;
  return(
    <StatusPageMain _orgid={_orgid} />
  )
}