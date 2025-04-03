"use client"
import Button from '@/components/button/button';
import AuthChecks from '../../authchecks';
import { ChevronDown, Plus, Server, X } from 'lucide-react';
import { useState } from 'react';
import AppFooter from '@/components/footer/appfooter';
import { SpinnerLoader } from '@/components/loaders/mainloader';
import { Tooltip } from '@/components/sidebar/sidebar';


export default function StatusPageMain() {
    const [showMore, setShowMore] = useState(true);
    const [openStatus, setOpenStatus] = useState(false);
    const [newStatusPageName, setNewStatusPageName] = useState("");
    const [error, setError] = useState(false);

    function NewStatusPageNameCheck(name) {
        const regex = /^[a-zA-Z0-9-_]+$/;
        const isValid = regex.test(name);
        if (isValid) {
            console.log("Valid channel name");
            setError(false);
        }
        else {
            console.log("Invalid channel name");
            setError(true);
        }
        return isValid;
    }

    return(
        <AuthChecks>
        {openStatus && (
            <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-[#111216] mx-auto md:w-full container px-6 py-4 h-full md:h-auto rounded-md flex flex-col gap-4">
                <div className="w-full flex flex-row justify-between items-center">
                    <h2 className="font-semibold text-xl">Create a status page</h2>
                    <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => setOpenStatus(!openStatus)}
                    >
                    <div className="p-1 transition-all hover:bg-muted-foreground/20 rounded-md">
                        <X className="h-5 w-5" />
                    </div>
                    </button>
                </div>
                <div className="flex flex-col h-full gap-4 justify-between">
                    <div>
                    <p className="text-sm font-semibold">Name</p>
                    <div className={`bg-muted-foreground/5 text-white flex items-center justify-start rounded px-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none ${error ? "ring-2 ring-red-500 focus-within:ring-red-500" : ""}`}>
                        <input
                        type="text"
                        id="newStatusNameInput"
                        value={newStatusPageName}
                        onChange={(e) => {
                            setNewStatusPageName(e.target.value);
                            NewStatusPageNameCheck(e.target.value);
                        }}
                        placeholder="Status Page Name"
                        className="bg-transparent ml-2 focus:outline-none w-full py-2"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                    </p>
                    </div>
                    <div>
                    <p className="text-sm font-semibold">Website URL</p>
                    <div className={`bg-muted-foreground/5 text-white flex items-center justify-start rounded px-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none ${error ? "ring-2 ring-red-500 focus-within:ring-red-500" : ""}`}>
                        <input
                        type="text"
                        id="NewStatusURLInput"
                        value={newStatusPageName}
                        onChange={(e) => {
                            setNewStatusPageName(e.target.value);
                            NewStatusPageNameCheck(e.target.value);
                        }}
                        placeholder="Website URL"
                        className="bg-transparent ml-2 focus:outline-none w-full py-2"
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-2 flex flex-row gap-1">
                        This will be the URL of your status page. For example: <Tooltip text='Why did you attempt to click me?'><a className='underline cursor-pointer'>https://trackit.hdev.uk</a></Tooltip>
                    </div>
                    </div>
                    <div className="w-full flex gap-3 flex-row justify-end items-center">
                    <SpinnerLoader size={30} color="#3B82F6" />
                    <button
                        className="bg-blue-500/20 text-white z-50 rounded px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 mt-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        onClick={() => {
                        console.log("Create Status page button clicked");
                        }}
                    >
                        Create Status Page
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
                <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-between w-full mt-10 mb-2">
                            <h1 className="text-3xl font-medium text-white">Status Page</h1>
                            <Button variant='primary' onClick={() => setOpenStatus(true)} className='flex flex-row gap-2 items-center'>
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
                        <h2 className='text-foreground font-semibold text-[14px]'>{name}</h2>
                        <p className='text-muted-foreground/60 font-normal text-[13px]'>{site}</p>
                    </div>
                </div>
            </div>   
        </a>
    );
}