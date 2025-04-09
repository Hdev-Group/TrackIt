"use client";
import { cn } from "@/lib/utils"; 
import Button from "@/components/button/button";
import AppFooter from "@/components/footer/appfooter";
import AuthChecks from "../../authchecks";
import { Radar } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth"

export default function Monitors({_orgid}: { _orgid: string }) {
    console.log("Org ID: ", _orgid);

    const [monitors, setMonitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getAuth().currentUser;

    useEffect(() => {
        const getmonitors = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const userToken = await user.getIdToken();
                const res = await fetch(`/api/application/v1/monitoring/restricted/monitors/getmonitors?orgid=${encodeURIComponent(_orgid)}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                });
                const data = await res.json();
                const formattedMonitors = data?.monitors?.map((monitor: any) => ({
                    id: monitor._id,
                    name: monitor.monitoring.webURL,
                    type: monitor.monitoring.monitorType,
                    isValid: monitor.monitoring.isValidURL,
                    locations: monitor.monitoring.geographicLocations.join(", "),
                    alertCondition: monitor.alertConditions.alertCondition,
                    severity: monitor.alertConditions.severityLevel,
                    notificationMethods: monitor.alerts.notificationMethods.join(", "),
                    escalationDelay: monitor.alerts.escalationDelay,
                    checkFrequency: monitor.advancedSettings.checkFrequency,
                    timestamp: new Date(monitor.timestamp).toLocaleString()
                }));
                setMonitors(formattedMonitors);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching monitors:", error);
                setLoading(false);
            }
        };
        getmonitors();
    }, [_orgid, user]);

    return(
        <AuthChecks>
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-between w-full mt-10 mb-2">
                            <h1 className="text-3xl font-medium text-white">Monitors</h1>
                            <Button variant='primary' href='./monitors/create' className='flex flex-row gap-2 items-center'>
                                <div className="flex flex-row items-center gap-2 justify-center">
                                    <Radar className="text-black  w-5 h-5" size={16} />
                                    Create Monitor
                                </div>
                            </Button>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full h-full ">
                            {
                                loading ? (
                                    <div className="flex flex-row items-center justify-center w-full h-full mt-10">
                                        <div className="loader"></div>
                                    </div>
                                ) : (
                                    monitors?.length > 0 ? (
                                        <div className="flex flex-col items-start justify-start gap-2 w-full h-full mt-10">
                                            {
                                                monitors?.map((monitor: any) => {
                                                    return (
                                                        <StatusPageBoxes status={monitor.isValid ? "Online" : "Offline"} site={monitor.name} uptime={2} name={monitor.name} id={monitor.id} key={monitor.id} />
                                                    )
                                                })
                                            }
                                        </div>
                                    ) : (
                                        <div className="flex flex-row items-center justify-center w-full h-full mt-10">
                                            <h1 className="text-xl font-medium text-white">No Monitors Found</h1>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    )
}


interface StatusPageBoxesProps {
    status: "Online" | "Offline";
    site: string;
    name: string;
    id: string;
    uptime: number;
  }
  
  function StatusPageBoxes({ status, site, name, id, uptime }: StatusPageBoxesProps) {
    const formattedUptime = `${uptime.toFixed(1)}%`;
  
    const statusLabel = status === "Online" ? "Online" : "Offline";

    return (
            <a
            href={`./monitors/${id}`}
            className="block w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label={`View status page for ${name}, currently ${statusLabel}`}
            >
            <div className="flex flex-col w-full border border-muted-foreground/10 rounded-md bg-background/10 transition-all duration-300 ease-in-out hover:bg-background/20 hover:shadow-md">
                <div className="flex flex-row justify-between items-center p-4 transition-all w-full hover:bg-muted-foreground/5 cursor-pointer">
                {/* Status Indicator */}
                <div className="w-20 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                    <div
                        className={cn(
                        "absolute rounded-full h-4 w-4 animate-ping",
                        status === "Online" ? "bg-green-500" : "bg-red-500"
                        )}
                        aria-hidden="true"
                    />
                    <div
                        className={cn(
                        "rounded-full h-4 w-4",
                        status === "Online" ? "bg-green-500" : "bg-red-500"
                        )}
                        aria-hidden="true"
                    />
                    <span className="sr-only">{statusLabel}</span> {/* Screen reader text */}
                    </div>
                </div>

                {/* Name and Uptime */}
                <div className="w-full flex flex-col justify-between items-start gap-1">
                    <div className="flex items-center gap-2">
                    <h2 className="text-foreground font-semibold text-[15px]">{name}</h2>

                    </div>
                    <p className="text-muted-foreground/60 font-normal text-[13px]">
                    Uptime: {formattedUptime}
                    </p>
                    <p className="text-muted-foreground/60 font-normal text-[13px]">
                        Used in <a href={`./status-page/${id}`} className="text-white/80 underline">1 status page</a>
                    </p>
                </div>
                </div>
            </div>
            </a>
        );
}