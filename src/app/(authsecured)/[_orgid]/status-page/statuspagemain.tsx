"use client"
import Button from '@/components/button/button';
import AuthChecks from '../../authchecks';
import { ChevronDown, Plus, Server } from 'lucide-react';
import { useState } from 'react';


export default function StatusPageMain() {
    return(
        <AuthChecks>
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start mb-[20vh] mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-full">
                        <div className="flex flex-row items-center justify-between w-full mt-10 mb-2">
                            <h1 className="text-3xl font-medium text-white">Status Page</h1>
                            <Button variant='primary' className='flex flex-row gap-2 items-center'>
                                Add Status Page
                            </Button>
                        </div>
                        <div className='flex flex-col mt-5 gap-4 w-full'>
                            <StatusPageBoxes />
                        </div>
                    </div>
                </div>
            </div>
        </AuthChecks>
    )
}

function StatusPageBoxes(){
    const [showMore, setShowMore] = useState(true);
    return (
        <div className='flex flex-col group gap-4 w-full h-full'>
            <div className='flex flex-row justify-start items-center w-full'>
                <div className='flex flex-row justify-between w-full'>
                    <div className='flex flex-row'>
                        <div className="relative">
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col bg-muted-foreground/5 justify-between border-muted-foreground/20 border items-center overflow-hidden w-full rounded-lg'>
                <div onClick={() => setShowMore(!showMore)} className='flex items-center border-b justify-start px-4 w-full h-10 gap-2 cursor-pointer'>
                    <Server className='text-foreground h-4 w-4 -translate-x-8 group-hover:translate-x-0 transition-all' />
                    <div className='flex flex-row items-center gap-1'>
                        <ChevronDown className={`${showMore ? "rotate-0" : "-rotate-90"} text-foreground h-4 w-4 -translate-x-7 group-hover:translate-x-0 transition-all`} />
                        <h2 className='text-foreground font-normal text-[13px] -translate-x-7 group-hover:translate-x-0 transition-all'>
                            Status Pages
                        </h2>
                    </div>
                </div>
                <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className='flex flex-col w-full border-muted-foreground/20 border-t'>
                        <div className='flex flex-row justify-between items-center w-full pr-4'>
                            <div className='w-20 flex items-center justify-center'>
                                <div className='relative flex items-center justify-center py-5'>
                                    <div className='absolute rounded-full bg-green-500 h-3 w-3 animate-ping'></div>
                                    <div className='rounded-full bg-green-500 h-3 w-3'></div>
                                </div>
                            </div>
                            <div className='w-full flex flex-col justify-between items-start'>
                                <h2 className='text-foreground font-normal text-[13px]'>Status Page Name</h2>
                                <p className='text-muted-foreground/60 font-normal text-[13px]'>statuspage.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}