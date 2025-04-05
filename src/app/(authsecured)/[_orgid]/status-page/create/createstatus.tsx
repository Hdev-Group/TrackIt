"use client"
import AppFooter from '@/components/footer/appfooter';
import AuthChecks from '../../../authchecks';
import { useState } from 'react';
import { Check, ChevronLeft, Clock, X, AlertTriangle } from "lucide-react"
import Button from '@/components/button/button';
import { Tooltip } from '@/components/sidebar/sidebar';


export default function CreateStatusPage() {

    const [selectedMonitors, setSelectedMonitors] = useState<number[]>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [layout, setLayout] = useState<string>('layout1');
    const [webURL, setWebURL] = useState<string>(null);
    const [uptimevisible, setuptimevisible] = useState<boolean>(true);
    const [responsetimevisible, setresponsetimevisible] = useState<boolean>(true);


    

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

    const handleMonitorClick = (index: number, event: React.MouseEvent) => {
        if (event.shiftKey) {
            const lastSelected = selectedMonitors[selectedMonitors.length - 1];
            const range = [Math.min(lastSelected, index), Math.max(lastSelected, index)];
            const newSelection = [...new Set([...selectedMonitors, ...Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i)])];
            setSelectedMonitors(newSelection);
        } else {
            if (selectedMonitors.includes(index)) {
                setSelectedMonitors(selectedMonitors.filter((i) => i !== index));
            } else {
                setSelectedMonitors([...selectedMonitors, index]);
            }
        }
    };
    const systemStatus = "operational" 
    const monitorTabs = [
        "Status",
        "Maintenance",
        "Previous Incidents",
    ]


    return(
        <AuthChecks>
        <div className='bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar'>
            <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                    <div className="flex flex-row items-center justify-start gap-5 w-full mt-10 mb-2">
                        <ChevronLeft className='w-8 h-8 hover:text-white hover:bg-zinc-700/20 rounded-lg text-muted-foreground cursor-pointer' onClick={() => window.history.back()} />
                        <h1 className="text-3xl font-medium text-white">Status Page Creator</h1>
                    </div>
                    <div className="flex flex-col items-start justify-between w-full mt-10 mb-2">
                        <div className='flex flex-col xl:flex-row gap-4 relative w-full'>
                            <div className='flex flex-col'>
                                <h1 className="text-2xl font-medium text-white">Monitors</h1>
                                <p className="text-muted-foreground mb-4">Add monitors to your status page. These are the components that will be monitored and displayed.</p>
                                <div className='flex flex-col gap-2'>
                                    {
                                        [...Array(5)].map((_, index) => (
                                            <div
                                                key={index}
                                                onClick={(event) => handleMonitorClick(index, event)}
                                                className={`flex flex-row justify-between items-center w-full border-muted-foreground/10 rounded-md border-[1px] bg-background/10 hover:bg-background/20 transition-all duration-300 ease-in-out cursor-pointer ${
                                                    selectedMonitors.includes(index) ? 'bg-blue-500/30' : ''
                                                }`}
                                            >
                                                <div className='flex flex-row justify-between items-center hover:bg-muted-foreground/5 transition-all w-full pr-4'>
                                                    <div className='w-20 flex items-center justify-center'>
                                                        <div className='relative flex items-center justify-center py-5'>
                                                            <div className={`absolute rounded-full ${selectedMonitors.includes(index) ? 'bg-blue-300' : 'bg-green-500'} h-3 w-3 animate-ping`}></div>
                                                            <div className={`rounded-full ${selectedMonitors.includes(index) ? 'bg-blue-300' : 'bg-green-500'} h-3 w-3`}></div>
                                                        </div>
                                                    </div>
                                                    <div className='w-full flex flex-col justify-between items-start'>
                                                        <h2 className='text-foreground font-semibold text-[14px]'>Monitor Name</h2>
                                                        <p className='text-muted-foreground/60 font-normal text-[13px]'>Monitor Description</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col relative mb-6 border-t w-full pt-6 mt-6'>
                            <h1 className="text-2xl font-medium text-white">Customisation</h1>
                            <p className="text-muted-foreground mb-4">Customise your status page with a logo, colour scheme and more.</p>
                            <div className='flex flex-col xl:flex-row gap-4 w-full'>
                                <div className='w-full xl:w-1/2 gap-4 flex flex-col'>
                                    {/* Customisation zone */}
                                    <div className='flex flex-col'>
                                        <h2 className="text-lg font-medium text-white">Layout</h2>
                                        <p className="text-muted-foreground mb-4">Choose a layout for your status page.</p>
                                    </div>
                                    <div className='flex flex-row items-start justify-start gap-2 w-full'>
                                        <div className='flex flex-col gap-2 items-center cursor-pointer h-56 w-full'>
                                            <input type="radio" id="layout1" name="layout" onClick={() => setLayout("layout1")} value="layout1" className='hidden peer cursor-pointer' checked={layout === "layout1"} />
                                            <label htmlFor="layout1" className='flex flex-col items-center h-auto justify-center border-[1px] w-full border-muted-foreground/10 rounded-md p-4 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all'>
                                                <img src="/statuspageimages/1.png" alt="Layout 1" className='w-auto h-36 object-fill mb-2' />
                                                <span className='text-muted-foreground'>Layout 1</span>
                                            </label>
                                        </div>
                                        <div className='flex flex-col gap-2 items-center cursor-pointer w-full'>
                                        <input type="radio" id="layout2" name="layout" onClick={() => setLayout("layout2")} value="layout2" className='hidden peer cursor-pointer' checked={layout === "layout2"}  />
                                            <label htmlFor="layout2" className='flex flex-col items-center justify-center h-auto border-[1px] w-full border-muted-foreground/10 rounded-md p-4 peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all'>
                                                <img src="/statuspageimages/2.png" alt="Layout 2" className='w-auto h-36 object-fill mb-2' />
                                                <span className='text-muted-foreground'>Layout 2</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex flex-col mt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Name</h2>
                                            <p className="text-muted-foreground mb-4">Choose a name for your status page.</p>
                                        </div>
                                        <input type="text" className='bg-background/10 border-[1px] border-muted-foreground/10 rounded-md p-4 w-full' placeholder='Status Page Name' />
                                    </div>
                                    <div className='flex flex-col mt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Logo</h2>
                                            <p className="text-muted-foreground">Upload a logo for your status page.</p>
                                            <p className="text-muted-foreground mb-4 text-xs">250px by 250px max file size 300KB</p>
                                        </div>
                                        <div 
                                            className={`flex flex-col items-center  justify-center gap-2 w-full border-[1px] border-dashed border-muted-foreground/10 rounded-md p-4 bg-background/10 hover:bg-background/20 transition-all cursor-pointer ${logo ? 'w-[250px] h-[250px]' : 'h-64'}`}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files[0];
                                                if (file) {
                                                    console.log("File dropped:", file);
                                                    setLogo(file);
                                                    if (file.type.startsWith('image/') && file.size <= 300 * 1024 && file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                                                        setLogo(file);
                                                    }
                                                    else {
                                                        alert("Please upload a valid image file.");
                                                    }
                                                }
                                            }}
                                            onClick={() => {
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) {
                                                        console.log("File selected:", file);
                                                        setLogo(file);
                                                        if (file.type.startsWith('image/') && file.size <= 300 * 1024 && file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                                                            setLogo(file);
                                                        }
                                                        else {
                                                            alert("Please upload a valid image file.");
                                                        }
                                                    }
                                                };
                                                input.click();
                                            }}
                                        >
                                            {logo ? (
                                                <div className="relative">
                                                    <img
                                                        src={URL.createObjectURL(logo)}
                                                        alt="Uploaded Logo"
                                                        className="w-[250px] h-[250px] object-contain mb-2"
                                                    />
                                                    <div className='absolute top-3 -right-2 cursor-pointer z-50' onClick={() => setLogo(null)}><X /></div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Drag & Drop or Click to Upload Logo</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex flex-col mt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">URL</h2>
                                            <p className="text-muted-foreground mb-4">Where do you want your logo to point to?</p>
                                        </div>
                                        <input 
                                            type="text" 
                                            onChange={(e) => {
                                                const url = e.target.value;
                                                setWebURL(url);
                                            }}
                                            onBlur={(e) => {
                                                const url = e.target.value;
                                                if (!validateURL(url)) {
                                                    alert("Please enter a valid URL.");
                                                    setWebURL('');
                                                }
                                            }}
                                            value={webURL || ''}
                                            className='bg-background/10 border-[1px] border-muted-foreground/10 rounded-md p-4 w-full' 
                                            placeholder='Your Website URL' 
                                        />
                                    </div>
                                    <div className='flex flex-col mt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Display Options</h2>
                                            <p className="text-muted-foreground mb-4">Choose what information to display on your status page.</p>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex flex-row items-center gap-2'>
                                                <label htmlFor="showuptime" className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" id="showuptime" defaultChecked={uptimevisible} onChange={() => setuptimevisible(!uptimevisible)} name="showuptime" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none relative peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-500"></div>
                                                    <div className="w-5 h-5 bg-white rounded-full left-0.5 absolute shadow peer-checked:translate-x-5 transform transition-transform"></div>
                                                </label>
                                                <span className='text-muted-foreground cursor-pointer'>Show Uptime</span>
                                            </div>
                                            <div className='flex flex-row items-center gap-2'>
                                                <label htmlFor="showresponse" className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" id="showresponse" defaultChecked={true} onChange={() => setresponsetimevisible(!responsetimevisible)} name="showresponse" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-500"></div>
                                                    <div className="w-5 h-5 bg-white rounded-full left-0.5 absolute shadow peer-checked:translate-x-5 transform transition-transform"></div>
                                                </label>
                                                <span className='text-muted-foreground cursor-pointer'>Show Response Time</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full xl:w-1/2'>
                                    <div className='flex flex-col gap-2 sticky top-48'>
                                        <h2 className="text-lg font-medium text-white">Preview</h2>
                                        <p className="text-muted-foreground mb-4">Preview your status page with the selected layout and theme.</p>
                                        <PreviewPage layout={layout} logo={logo} webURL={webURL} monitorTabs={monitorTabs} systemStatus={systemStatus} selectedMonitors={selectedMonitors} uptimevisible={uptimevisible} responsetimevisible={responsetimevisible} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 border-t pt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Advanced Options</h2>
                                            <p className="text-muted-foreground mb-4"></p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col '>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Custom URL</h2>
                                            <p className="text-muted-foreground">Choose a custom URL for your status page.</p>
                                            <p className=' mb-4 text-sm text-muted-foreground'>For example status.hdev.uk</p>
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <input type="text" className='bg-background/10 border-[1px] border-muted-foreground/10 rounded-md p-4 w-full' placeholder='Custom URL' />
                                            <output>
                                                {/* TODO custom domain URl stuff */}
                                            </output>
                                        </div>
                                    </div>
                                    <div className='flex flex-col mt-4'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Font Options</h2>
                                            <p className="text-muted-foreground mb-4">Choose what information to display on your status page.</p>
                                        </div>
                                        <div className='flex flex-col gap-2'>

                                        </div>
                                    </div>
                        </div>                        

                    </div>
                </div>
            </div>
        </div>
        <SaveFooter readyToSave={false} />
        <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
        );
}

function SaveFooter({readyToSave}) {
    return (
        <div className='flex flex-row items-center justify-between border-gray-800 w-full py-2 border-t'>
            <div className='container mx-auto flex flex-row justify-between px-6 lg:px-14'>
                <div />
                <div className='flex flex-row gap-4'>
                    <Tooltip text='Unable to save status page' position='top'>
                        <Button variant='primary' disabled={!readyToSave} className='flex flex-row gap-2 items-center'>
                            <div className='flex flex-row gap-2 items-center font-medium'>
                                <Check className='w-4 h-4' /> Publish
                            </div>
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}


export function PreviewPage({layout, logo, webURL, monitorTabs, systemStatus, selectedMonitors, uptimevisible, responsetimevisible}) {
    return layout === 'layout1' ? (
            <div className={`flex flex-col items-center justify-center border-[1px] border-muted-foreground/10 rounded-md p-4 pb-6 bg-background/10 h-full`}>
            <div className='w-full border-b justify-between flex flex-row items-center border-muted-foreground/10 pb-2 mb-4'>
                <div>
                    {logo ? (<a href={webURL}><img src={URL?.createObjectURL(logo)} alt="Logo" className='w-[35px] h-[35px] object-contain mb-2' /></a>) : (<div className='w-[35px] h-[35px] bg-muted-foreground/10 rounded-md'></div>)}
                </div>
                <div className='flex flex-row gap-2 items-center'>
                    {
                        monitorTabs.map((tab, index) => (
                            <div key={index} className={`flex flex-row items-center text-sm justify-center gap-2 text-white cursor-pointer px-3 py-1 rounded-lg ${monitorTabs[0] === tab ? 'text-primary bg-zinc-700/20' : 'text-muted-foreground'}`}>
                                {tab}
                            </div>
                        ))
                    }
                </div>
                <div></div>
            </div>
            <div className={`flex flex-col items-center justify-center w-full h-full ${layout} `}>
                <Check className='w-10 h-10 text-green-500' />
                <h2 className='text-foreground font-semibold text-[14px]'>All services are online</h2>
                <p className='text-muted-foreground/60 font-normal text-[13px]'>Updated on {new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })}</p>
            </div>
            <div className='flex flex-row items-center justify-center w-full mt-4'>
                <div className='w-[90%] bg-zinc-800/20 flex flex-col gap-2 border rounded-md px-4 py-2'>
                {
                    selectedMonitors.map((index) => (
                        <div key={index} className='flex flex-row justify-between items-center hover:bg-muted-foreground/5 rounded-lg transition-all w-full pr-4'>
                            <div className='w-20 flex items-center justify-center'>
                                <div className='relative flex items-center justify-center py-5'>
                                    <div className={`absolute rounded-full bg-green-500 h-3 w-3 animate-ping`}></div>
                                    <div className={`rounded-full bg-green-500 h-3 w-3`}></div>
                                </div>
                            </div>
                            <div className='w-full flex flex-row justify-between items-start'>
                                <div>
                                    <h2 className='text-foreground font-semibold text-[14px]'>Monitor Name {index}</h2>
                                    <p className='text-muted-foreground/60 font-normal text-[13px]'>Monitor Description</p>
                                </div>
                                {
                                    responsetimevisible && (
                                        <div className='flex flex-row gap-1 text-xs text-white/70 items-center justify-center'>
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>Response: 124ms</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
        ) : (
            <div
            className={`flex flex-col border-[1px] border-muted-foreground/10 rounded-md p-4 bg-background/10 h-full `}
          >
            <div className="w-full border-b justify-between flex flex-row items-center border-muted-foreground/10 pb-2 mb-4">
              <div>
                {logo ? (
                  <a href={webURL}>
                    <img
                      src={URL?.createObjectURL(logo) || "/placeholder.svg"}
                      alt="Logo"
                      className="w-[35px] h-[35px] object-contain mb-2"
                    />
                  </a>
                ) : (
                  <div className="w-[35px] h-[35px] bg-muted-foreground/10 rounded-md"></div>
                )}
              </div>
              <div className="flex flex-row gap-2 items-center">
                {monitorTabs.map((tab, index) => (
                  <div
                    key={index}
                    className={`flex flex-row items-center text-sm justify-center gap-2 text-white cursor-pointer px-3 py-1 rounded-lg ${
                      monitorTabs[0] === tab ? "text-primary bg-zinc-700/20" : "text-muted-foreground"
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>
              <div></div>
            </div>
      
            <div
              className={`w-full flex items-center justify-between p-3 rounded-md mb-4 ${
                systemStatus === "operational"
                  ? "bg-green-500/10 border border-green-500/20"
                  : systemStatus === "degraded"
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : "bg-red-500/10 border border-red-500/20"
              }`}
            >
              <div className="flex items-center">
                {systemStatus === "operational" ? (
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                ) : systemStatus === "degraded" ? (
                  <Clock className="w-5 h-5 text-amber-500 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span className="font-medium">
                  {systemStatus === "operational"
                    ? "All systems operational"
                    : systemStatus === "degraded"
                      ? "Degraded performance"
                      : "System outage"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated{" "}
                {new Date().toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
      
            {/* Monitor Grid - 2 columns instead of a list */}
            <div className="grid grid-cols-2 gap-3">
              {selectedMonitors.map((index) => (
                <div
                  key={index}
                  className="border border-muted-foreground/10 rounded-md p-3 bg-zinc-800/20 flex items-center"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${systemStatus === "operational" ? "bg-green-500" : systemStatus === "degraded" ? "bg-amber-500" : "bg-red-500"}`}
                  ></div>
                  <div>
                    <div className="text-sm font-medium">Monitor {index}</div>
                    { responsetimevisible && (
                    <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>Response: 124ms</span>
                    </div>
                    ) }
                  </div>
                </div>
              ))}
            </div>
            {
                uptimevisible && (
                    <div className="mt-4 pt-3 border-t border-muted-foreground/10">
                        <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">Uptime last 24h</span>
                        <span className="text-xs font-medium">99.9%</span>
                        </div>
                        <div className="w-full bg-muted-foreground/10 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "99.9%" }}></div>
                        </div>
                    </div>
                )
            }
          </div>
        )
}