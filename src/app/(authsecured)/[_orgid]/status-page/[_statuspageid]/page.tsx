"use client"
import Configurations from "./configurations"
import { useParams } from "next/navigation";

export default function Page() {
    const { _statuspageid, _orgid } = useParams();


    return (
        <Configurations _statuspageid={_statuspageid} _orgid={_orgid} />
    );
}