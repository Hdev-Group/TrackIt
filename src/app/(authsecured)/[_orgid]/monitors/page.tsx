import Monitors from "./monitors";

export async function generateMetadata() {
  return {
    title: "TrackIt | Monitors",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}
export default async function Page({ params }: { params: { _orgid: string } }) {
  const { _orgid } = await params;

  return (
    <Monitors _orgid={_orgid} />
  );
}