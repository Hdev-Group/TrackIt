"use client"
import AppFooter from '@/components/footer/appfooter';
import AuthChecks from '../../../authchecks';
import Breadcrumb from '@/components/breadcrumb/breadcrumb';
import { Columns3, Home } from 'lucide-react';


export default function Configurations({_statuspageid, _orgid}) {

    const statuspageid = _statuspageid;
    const orgid = _orgid;

    const tabs = [
        {
            name: 'General',
            href: `/${orgid}/status-page/${statuspageid}`
        },
        {
            name: 'Reports',
            href: `/${orgid}/status-page/${statuspageid}/reports`
        },
        {
            name: 'Updates',
            href: `/${orgid}/status-page/${statuspageid}/incidents`
        },
        {
            name: 'Subscribers',
            href: `/${orgid}/status-page/${statuspageid}/subscribers`
        },
        {
            name: 'Components',
            href: `/${orgid}/status-page/${statuspageid}/components`
        }
    ]

    const activeTab = tabs.find(tab => tab.href === window.location.pathname)?.name || 'General';

    return(
        <AuthChecks>
            <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
            <Breadcrumb items={[
                { label: "Home", href: `/${_orgid}/dashboard`, icon: <Home className="w-4 h-4 mr-2" /> },
                { label: "Status Pages", href: `/${_orgid}/status-page`, icon: <Columns3 className="w-4 h-4 mr-2" /> },
              ]} />
                <div className="flex flex-col items-start mb-[20vh] mt-10 justify-start w-full h-full">
                    <div className="border-b border-[#fff]/15 px-2 lg:px-10 flex flex-col justify-start items-start w-full pb-5">
                        <div className='mx-auto container flex flex-col items-start justify-between w-full'>
                            <div className="flex flex-col items-start justify-between w-full mt-10 mb-2">
                                <h1 className="text-3xl font-medium text-white">STATUS PAGE NAME</h1>
                            </div>
                            <div className='flex flex-row mt-4 gap-4 relative'>
                                {
                                    tabs.map((tab, index) => (
                                        <a key={index} href={tab.href} className={`flex flex-row items-center  gap-2 text-white cursor-pointer ${activeTab === tab.name ? 'text-primary border-b-2 border-foreground' : 'text-muted-foreground'}`}>
                                            {tab.name}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-full">
                    </div>
                </div>
            </div>
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    )
}