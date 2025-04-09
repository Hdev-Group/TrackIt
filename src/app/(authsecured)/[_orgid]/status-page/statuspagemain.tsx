"use client"
import Button from '@/components/button/button';
import AuthChecks from '../../authchecks';
import { ChevronDown, Plus, Server, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppFooter from '@/components/footer/appfooter';
import { SpinnerLoader } from '@/components/loaders/mainloader';
import { Tooltip } from '@/components/sidebar/sidebar';
import { getAuth, type User } from "firebase/auth"


export default function StatusPageMain({_orgid}: {_orgid: string}) {
    const [showMore, setShowMore] = useState(true);
    const [statusPages, setStatusPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const user = getAuth().currentUser as User;

    useEffect(() => {
        async function fetchStatusPages(){
            const userToken = await user?.getIdToken();
            const res = await fetch(`/api/application/v1/statuspage/restricted/get?orgid=${encodeURIComponent(_orgid)}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
            });
            const data = await res.json();
            if (res.status === 200) {
                setStatusPages(data.monitors);
                console.log(data);
                setLoading(false);
            } else {
                console.error("Error fetching status pages:", data.message);
            }
        }
        fetchStatusPages();
    }, []);

    return(
        <AuthChecks>
            <div className='dark:bg-[#101218] bg-[#fff] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-between w-full mt-10 mb-2">
                            <h1 className="text-3xl font-medium">Status Page</h1>
                            <Button variant='primary' href='./status-page/create' className='flex flex-row gap-2 items-center'>
                                Add Status Page
                            </Button>
                        </div>
                        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                        <div className='flex flex-col mt-5 gap-4 w-full'>
                        <div className='flex flex-col group gap-4 w-full h-full'>
                            <div className='flex flex-row justify-start  items-center w-full'>
                                <div className='flex flex-row justify-between w-full'>
                                    <div className='flex flex-row'>
                                        <div className="relative">
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className='flex flex-col gap-2'>
                                    {loading ? (
                                        <div className='flex flex-row justify-center items-center w-full h-full'>
                                            <SpinnerLoader size={20} color={"#ffffff"} />
                                        </div>
                                    ) : (
                                        statusPages.length > 0 ? (
                                            statusPages.map((statusPage) => (
                                                <StatusPageBoxes key={statusPage._id?.toString()} status={statusPage.status} site={statusPage.site} name={statusPage.name} id={statusPage._id?.toString()} />
                                            ))
                                        ) : (
                                            <div className='flex flex-row justify-center items-center w-full h-full'>
                                                <p className="text-muted-foreground/60 font-normal text-[14px]">No status pages available.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    )
}

function StatusPageBoxes({status, site, name, id}){
    return (
        <a href={`./status-page/${id}`} className='w-full'>
            <div className='flex flex-col w-full border-muted-foreground/10 rounded-md border-[1px] bg-background/10 hover:bg-background/20 transition-all duration-300 ease-in-out'>
                <div className='flex flex-row justify-between items-center  hover:bg-muted-foreground/5 cursor-pointer transition-all w-full pr-4'>
                    <div className='w-20 flex items-center justify-center'>
                        <div className='relative flex items-center justify-center py-5'>
                            <div className={`absolute rounded-full bg-${status === "Online" ? "green" : "red"}-500 h-3 w-3 animate-ping`}></div>
                            <div className={`rounded-full bg-${status === "Online" ? "green" : "red"}-500 h-3 w-3`}></div>
                        </div>
                    </div>
                    <div className='w-full flex flex-col justify-between items-start'>
                        <h2 className='text-foreground font-semibold text-[14px]'>{name}</h2>
                        <p className='text-muted-foreground/60 font-normal text-[13px]'>{site}</p>
                    </div>
                </div>
            </div>   
        </a>
    );
}