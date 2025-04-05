"use client";

import Button from "@/components/button/button";
import AppFooter from "@/components/footer/appfooter";
import AuthChecks from "../../authchecks";
import { Radar } from "lucide-react";

export default function Monitors() {
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
                        <div className="flex flex-col items-start justify-start w-full h-full mt-10">
                        </div>
                    </div>
                </div>
            </div>
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    )
}