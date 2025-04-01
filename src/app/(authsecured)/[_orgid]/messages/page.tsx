import Messages from "./homemessage";
import ClientRedirect from "@/components/clientredirect/redirect";

export async function generateMetadata() {
  return {
    title: "TrackIt | Messages",
    description: "TrackIt is a ticket tracking system that allows you to track your tickets faster than ever before.",
  };
}

export default function Page() {
  return (
    <>
      <ClientRedirect />
      <Messages />
    </>
  );
}