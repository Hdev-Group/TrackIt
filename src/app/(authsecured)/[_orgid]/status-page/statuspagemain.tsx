"use client"
import Button from '@/components/button/button';
import AuthChecks from '../../authchecks';
import { ChevronDown, Plus, Server } from 'lucide-react';
import { useState } from 'react';
import AppFooter from '@/components/footer/appfooter';


export default function StatusPageMain() {
    const [showMore, setShowMore] = useState(true);

    return(
        <AuthChecks>
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-between w-full mt-10 mb-2">
                            <h1 className="text-3xl font-medium text-white">Status Page</h1>
                            <Button variant='primary' className='flex flex-row gap-2 items-center'>
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
                                    <StatusPageBoxes status='Offline' site='hdev.uk' name='Hdev Site' id='2' />
                                    <StatusPageBoxes status='Online' site='hdev.uk' name='Hdev Site' id='2' />
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
                        <h2 className='text-foreground font-normal text-[13px]'>{name}</h2>
                        <p className='text-muted-foreground/60 font-normal text-[13px]'>{site}</p>
                    </div>
                </div>
            </div>   
        </a>
    );
}