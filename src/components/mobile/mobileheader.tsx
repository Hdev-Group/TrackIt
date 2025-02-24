import { useEffect, useState } from "react";

export default function Mobileheader() {

    const [isMobie, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
        <div className="w-full h-16 text-white">
            <div className="flex items-center gap-1 flex-col w-5">
                <div className="w-full h-[2px] bg-white" />
                <div className="w-full h-[2px] bg-white" />
            </div>
        </div>
    )
}