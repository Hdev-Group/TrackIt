"use client";

import Button from "@/components/button/button";
import AppFooter from "@/components/footer/appfooter";
import AuthChecks from "../../../authchecks";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/checkbox/checkbox";

export default function CreateMonitor() {

    const [webURL, setWebURL] = useState<string>('');
    const [isValidURL, setIsValidURL] = useState<boolean>(false);
    const [multipleURLs, setmultipleURLs] = useState<boolean>(false);
    const [alertCondition, setAlertCondition] = useState<string>('down');
    const [customConditions, setCustomConditions] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [checkedOptions, setCheckedOptions] = useState<string[]>([]);

    function validateURL(url: string): boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ipv4
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        if (pattern.test(url)) {
            setWebURL(url);
            return true;
        } else {
            return false;
        }
    }

    return (
        <AuthChecks>
        <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
            <div className="flex flex-col items-start mt-10  justify-start w-full h-full">
                <div className="container mx-auto px-2 lg:px-10  flex flex-col justify-start items-start w-full h-screen">
                    <div className="flex flex-row items-center justify-start gap-5 w-full mt-10 mb-2">
                        <ChevronLeft className='w-8 h-8 hover:text-white hover:bg-zinc-700/20 rounded-lg text-muted-foreground cursor-pointer' onClick={() => window.history.back()} />
                        <h1 className="text-3xl font-medium text-white">Monitor Creator</h1>
                    </div>
                    <div className="flex flex-col items-start justify-between w-full mt-10 mb-2">
                        <div className='flex flex-col xl:flex-row gap-4 relative w-full'>
                            <div className='flex flex-col w-full'>
                                <h1 className="text-2xl font-medium text-white">Monitors</h1>
                                <p className="text-muted-foreground mb-4">Add monitors to your status page. These are the components that will be monitored and displayed.</p>
                                <div className='flex flex-col gap-10 w-full'>
                                    <div className='w-full gap-4 flex justify-between items-start flex-col lg:flex-row'>
                                        <div className='flex flex-col w-full xl:sticky top-10'>
                                            <h2 className="text-lg font-medium text-white">What should we monitor?</h2>
                                            <p className="text-muted-foreground mb-4">Enter the URL of the service you want to monitor. Your able to configure more in advanced options.</p>
                                        </div>
                                        <div className="w-full flex flex-col border border-[#23283b] rounded-lg h-auto transition-all duration-300 bg-[#151824] gap-2">
                                            <div className="px-6 py-5 flex w-full flex-col gap-2">
                                                <h2 className="text-md w-auto font-medium text-white">
                                                        Monitoring
                                                </h2>
                                                <h2 className="text-sm font-normal text-white/70">URL to monitor</h2>
                                                {
                                                    multipleURLs ? (
                                                        <div className="flex flex-col gap-2 w-full">
                                                            <textarea className={`bg-[#161922] text-white border rounded-lg px-4 py-2 w-full ${isValidURL ? 'border-green-500' : ''}`} placeholder="https://hdev.uk" onChange={(e) => {
                                                                const url = e.target.value;
                                                                setIsValidURL(validateURL(url));
                                                            }}></textarea>
                                                            <p className="text-muted-foreground text-xs mt-0.5">Enter multiple URL's separated by a comma.</p>
                                                        </div>
                                                    ) : (
                                                        <input type="text" className={`bg-[#161922] text-white border rounded-lg px-4 py-2 w-full ${isValidURL ? 'border-green-500' : ''}`} placeholder="https://hdev.uk" onChange={(e) => {
                                                            const url = e.target.value;
                                                            setIsValidURL(validateURL(url));
                                                        }
                                                        }/>
                                                    )
                                                }
                                                {
                                                    multipleURLs ? (
                                                        <p className="text-muted-foreground text-xs mt-0.5">Need to monitor a single URL? <span onClick={() => setmultipleURLs(false)} className="underline cursor-pointer hover:text-white">Click here</span></p>
                                                    ) : (
                                                        <p className="text-muted-foreground text-xs mt-0.5">Need to monitor multiple URL's? <span onClick={() => setmultipleURLs(true)} className="underline cursor-pointer hover:text-white">Click here</span></p>
                                                    )
                                                }
                                            </div>
                                            <div className="w-full border-b border-[#23283b] my-2"/>
                                            <div className="px-6 py-5 flex w-full flex-col gap-2">
                                            <div className="flex flex-col gap-2">
                                            <h2 className="text-md w-auto font-medium text-white">
                                                    Alert Conditions
                                            </h2>
                                            <div className="flex flex-row gap-2 items-start h-full justify-between w-full">
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="alertConditions" className="text-sm font-normal text-white/70">
                                                        Alert us when:
                                                    </label>
                                                        <select
                                                            id="alertConditions"
                                                            defaultValue="down"
                                                            onChange={(e) => {
                                                                console.log(e.target.value);
                                                                setAlertCondition(e.target.value);
                                                                if (e.target.value === 'custom') {
                                                                    setCustomConditions(true);
                                                                }
                                                                else {
                                                                    setCustomConditions(false);
                                                                }
                                                            }
                                                            }
                                                            className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="down">URL becomes unavailable</option>
                                                            <option value="slow">URL is responding slowly</option>
                                                            <option value="error-rate">The error rate exceeds a threshold</option>
                                                            <option value="timeout">The URL times out</option>
                                                            <option value="keyword">URL contains a keyword</option>
                                                            <option value="http-status">The URL returns a specific HTTP status code</option>
                                                            <option value="ping">Host doesnt respond to ping</option>
                                                            <option value="custom">Based on custom conditions</option>
                                                        </select>
                                                        <div>
                                                        <p className="text-muted-foreground text-xs mt-0.5">We will alert you when this condition is met.</p>
                                                        <p className="text-muted-foreground text-xs mt-0.5">Its recomended to use the keyword condition for uptime monitoring.</p>
                                                    </div>
                                                    </div>
                                                        {alertCondition === 'error-rate' && (
                                                            <div className="flex flex-col gap-2  w-full">
                                                                <label htmlFor="errorRate" className="text-sm font-normal text-white/70">
                                                                    Error Rate Threshold
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="errorRate"
                                                                    min="0"
                                                                    max="1000"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Enter error rate threshold"
                                                                />
                                                            </div>
                                                        )}
                                                        {alertCondition === 'timeout' && (
                                                            <div className="flex flex-col gap-2  w-full">
                                                                <label htmlFor="timeout" className="text-sm font-normal text-white/70">
                                                                    Timeout Duration (seconds)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="timeout"
                                                                    min="1"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Enter timeout duration"
                                                                />
                                                            </div>
                                                        )}
                                                        {alertCondition === 'custom' && (
                                                            <div className="flex flex-col gap-2  w-full">
                                                                <label htmlFor="customConditions" className="text-sm font-normal text-white/70">
                                                                    Custom Conditions
                                                                </label>
                                                                <textarea
                                                                    id="customConditions"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    placeholder="Enter custom conditions for alerts"
                                                                ></textarea>
                                                            </div>
                                                        )}
                                                        {
                                                            alertCondition === 'keyword' && (
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="keyword" className="text-sm font-normal text-white/70">
                                                                        Keyword to find on the page
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="keyword"
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                        placeholder="Enter keyword to monitor"
                                                                    />
                                                                    <p className="text-muted-foreground text-xs mt-0.5">We use insensitive matching</p>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full gap-4 flex justify-between items-start flex-col lg:flex-row'>
                                        <div className='flex flex-col w-full xl:sticky top-10'>
                                            <h2 className="text-lg font-medium text-white">On-Call Response</h2>
                                            <p className="text-muted-foreground mb-4">Set rules for who should be alerted and where when an incident occurs.</p>
                                        </div>
                                        <div className="w-full flex flex-col border border-[#23283b] rounded-lg h-auto transition-all duration-300 bg-[#151824] gap-2">
                                            <div className="px-6 py-5 flex w-full flex-col gap-2">
                                                <h2 className="text-md w-auto font-medium text-white">
                                                        Alerts
                                                </h2>
                                                <div className="flex flex-col gap-2">
                                                    <label htmlFor="alertConditions" className="text-sm font-normal text-white/70">
                                                            When there is an incident, contact via:
                                                    </label>
                                                    <div className="flex flex-row gap-4">
                                                        {["Email", "SMS", "Push Notification"].map((option) => (
                                                            <div key={option} className="flex items-center gap-3 w-auto">
                                                                <Checkbox
                                                                    id={option}
                                                                    checked={checkedOptions.includes(option)}
                                                                    onCheckedChange={(checked) => {
                                                                        if (checked) {
                                                                            setCheckedOptions((prev) => [...prev, option]);
                                                                        } else {
                                                                            setCheckedOptions((prev) => prev.filter((item) => item !== option));
                                                                        }
                                                                    }}
                                                                    className="h-5 w-5 rounded-md border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                                />
                                                                <label
                                                                    htmlFor={option}
                                                                    className="text-sm font-normal text-white/70 cursor-pointer hover:text-white transition-colors"
                                                                >
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-b border-[#23283b] my-2" />
                                            <div className="px-6 py-5 flex w-full flex-col gap-2">
                                            <div className="flex flex-row gap-2 items-start h-full justify-between w-full">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <label htmlFor="alertConditions" className="text-sm font-normal text-white/70">
                                                        If the on-call engineer does not acknowledge the alert
                                                    </label>
                                                    <select
                                                        id="acknowledgeOptions"
                                                        defaultValue="escalate"
                                                        onChange={(e) => {
                                                            console.log(e.target.value);
                                                            setAlertCondition(e.target.value);
                                                            if (e.target.value === 'custom') {
                                                                setCustomConditions(true);
                                                            }
                                                            else {
                                                                setCustomConditions(false);
                                                            }
                                                        }
                                                        }
                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="escalate">Escalate to the next on-call engineer</option>
                                                        <option value="notify">Notify the on-call engineer again</option>
                                                        <option value="escalate-then-notify">Escalate then notify</option>
                                                        <option value="alertall">Alert all on-call engineers</option>
                                                        <option value="3mins">Wait 3 minutes then escalate</option>
                                                        <option value="5mins">Wait 5 minutes then escalate</option>
                                                        <option value="10mins">Wait 10 minutes then escalate</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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