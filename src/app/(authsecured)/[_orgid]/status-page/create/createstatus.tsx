"use client"
import AppFooter from '@/components/footer/appfooter';
import AuthChecks from '../../../authchecks';
import { useEffect, useState } from 'react';
import { Check, ChevronLeft, Clock, X, AlertTriangle, XCircle, CheckCircle, Loader2 } from "lucide-react"
import Button from '@/components/button/button';
import { Tooltip } from '@/components/sidebar/sidebar';
import { getAuth } from "firebase/auth"
import { useDebounce } from 'use-debounce';


export default function CreateStatusPage({_orgid}: { _orgid: string }) {
    const [selectedMonitors, setSelectedMonitors] = useState<Array<{ name: string; id: string }>>([]);
    const [logo, setLogo] = useState<File | null>(null);
    const [layout, setLayout] = useState<string>('layout1');
    const [webURL, setWebURL] = useState<string>(null);
    const [uptimevisible, setuptimevisible] = useState<boolean>(true);
    const [loading, setLoading] = useState(false); // Initialize as false since it's not used
    const [monitors, setMonitors] = useState([]);
    const [responsetimevisible, setresponsetimevisible] = useState<boolean>(true);
    const [customURL, setCustomURL] = useState<string>('');
    const [pageName, setPageName] = useState<string>('');
    const [dnsRecords, setDnsRecords] = useState(null);
    const [canSave, setCanSave] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]); 
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
    const [domainStatus, setDomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [debouncedCustomURL] = useDebounce(customURL, 500); 
    const user = getAuth().currentUser;


    useEffect(() => {
        const getMonitors = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true); 
                const userToken = await user.getIdToken();
                const res = await fetch(`/api/application/v1/monitoring/restricted/monitors/getmonitors?orgid=${encodeURIComponent(_orgid)}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                });
                if (!res.ok) {
                    throw new Error(`Failed to fetch monitors: ${res.statusText}`);
                }
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
            } catch (error) {
                console.error("Error fetching monitors:", error);
            } finally {
                setLoading(false); 
            }
        };

        getMonitors();
        const intervalId = setInterval(getMonitors, 60000); 

        return () => clearInterval(intervalId);
    }, [_orgid, user]);


    useEffect(() => {
        const checkDomainAvailabilityAndSetup = async () => {
            if (!debouncedCustomURL || !user) return;
            
            setDomainStatus('checking');
            
            try {
                const userToken = await user.getIdToken();
                const response = await fetch('/api/application/v1/statuspage/restricted/check-domain', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({
                        domain: debouncedCustomURL,
                        orgid: _orgid
                    }),
                });

                const result = await response.json();
                
                if (!response.ok) {
                    setDomainStatus('invalid');
                    return;
                }

                if (result.available) {
                    setDomainStatus('available');
                    setDnsRecords(result.dnsRecords);
                    checkDomainVerification();
                } else {
                    setDomainStatus('taken');
                }
            } catch (error) {
                console.error('Error checking domain:', error);
                setDomainStatus('invalid');
            }
        };

        if (debouncedCustomURL) {
            checkDomainAvailabilityAndSetup();
        } else {
            setDomainStatus('idle');
            setDnsRecords(null);
        }
    }, [debouncedCustomURL, user, _orgid]);

        function validateDomain(url: string): boolean {
            const pattern = new RegExp('^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.[A-Za-z]{2,}$', 'i');
            return pattern.test(url);
        }

        const checkDomainVerification = async () => {
            if (!customURL || !user) return;
    
            try {
                const userToken = await user.getIdToken();
                const response = await fetch('/api/application/v1/statuspage/restricted/verify-domain', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({
                        domain: customURL,
                        orgid: _orgid
                    }),
                });
    
                const result = await response.json();
                setVerificationStatus(result.verified ? 'verified' : 'failed');
            } catch (error) {
                console.error('Domain verification error:', error);
                setVerificationStatus('failed');
            }
        };
        

        useEffect(() => {
            const checkDomainAvailability = async () => {
                if (!debouncedCustomURL || !user) return;
                
                setDomainStatus('checking');
                
                try {
                    const userToken = await user.getIdToken();
                    const response = await fetch('/api/application/v1/statuspage/restricted/check-domain', {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${userToken}`,
                        },
                        body: JSON.stringify({
                            domain: debouncedCustomURL,
                            orgid: _orgid
                        }),
                    });
    
                    const result = await response.json();
                    
                    if (!response.ok) {
                        setDomainStatus('invalid');
                        return;
                    }
    
                    setDomainStatus(result.available ? 'available' : 'taken');
                } catch (error) {
                    console.error('Error checking domain:', error);
                    setDomainStatus('invalid');
                }
            };
    
            if (debouncedCustomURL) {
                checkDomainAvailability();
            } else {
                setDomainStatus('idle');
            }
        }, [debouncedCustomURL, user, _orgid]);

        console.log("hello", monitors)
    

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

    

    const handleMonitorClick = (monitor: any, event: React.MouseEvent) => {
        const monitorIndex = monitors.findIndex((m) => m.name === monitor.name);
        if (event.shiftKey && selectedMonitors.length > 0) {
            const lastSelectedIndex = monitors.findIndex((m) => m.name === selectedMonitors[selectedMonitors.length - 1]);
            const range = [Math.min(lastSelectedIndex, monitorIndex), Math.max(lastSelectedIndex, monitorIndex)];
            const newSelection = monitors
                .slice(range[0], range[1] + 1)
                .map((m) => m.name);
            setSelectedMonitors([...new Set([...selectedMonitors, ...newSelection])]);
        } else {
            if (selectedMonitors.some((selected) => selected.id === monitor.id)) {
                setSelectedMonitors(selectedMonitors.filter((selected) => selected.id !== monitor.id));
            } else {
                setSelectedMonitors([...selectedMonitors, { name: monitor.name, id: monitor.id }]);
            }
        }
    };
    const systemStatus = "operational" 
    const monitorTabs = [
        "Status",
        "Maintenance",
        "Previous Incidents",
    ]

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };



    useEffect(() => {
        const validateSaveConditions = () => {
            const newErrors: string[] = [];

            if (!pageName.trim()) {
                newErrors.push("Status page name is required");
            }

            if (selectedMonitors.length === 0) {
                newErrors.push("At least one monitor must be selected");
            }

            if (logo) {
                if (!logo.type.startsWith('image/')) {
                    newErrors.push("Logo must be an image file");
                }
                if (logo.size > 300 * 1024) {
                    newErrors.push("Logo file size must not exceed 300KB");
                }
                if (!logo.name.match(/\.(jpg|jpeg|png|gif)$/)) {
                    newErrors.push("Logo must be a JPG, JPEG, PNG, or GIF file");
                }
            }

            if (webURL && !validateURL(webURL)) {
                newErrors.push("Website URL is invalid");
            }

            if (customURL) {
                if (!validateDomain(customURL)) {
                    newErrors.push("Custom URL format is invalid (e.g., status.yourdomain.com)");
                }
                if (domainStatus === 'taken') {
                    newErrors.push("Custom URL is already taken");
                }
                if (domainStatus === 'invalid') {
                    newErrors.push("Custom URL is invalid");
                }
                if (domainStatus === 'available' && verificationStatus !== 'verified') {
                    newErrors.push("Custom URL must be verified before saving");
                }
            }

            setErrors(newErrors);
            setCanSave(newErrors.length === 0);
        };

        validateSaveConditions();
    }, [pageName, selectedMonitors, logo, webURL, customURL, domainStatus, verificationStatus]);

    console.log(selectedMonitors)

    const handleSave = async () => {
        if (!user) {
            setErrors(["User authentication required"]);
            return;
        }

        if (!canSave) {
            return;
        }

        try {
            setLoading(true);
            setErrors([]);
            const userToken = await user.getIdToken();

            const statusPageData = {
                orgid: _orgid,
                name: pageName,
                monitors: selectedMonitors.filter(monitor => monitor.id).map(monitor => monitor.id),
                layout: layout,
                webURL: webURL || undefined,
                uptimeVisible: uptimevisible,
                responseTimeVisible: responsetimevisible,
                customURL: customURL || undefined,
                logo: logo ? await convertFileToBase64(logo) : undefined,
            };

            const response = await fetch('/api/application/v1/statuspage/restricted/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify(statusPageData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to save status page');
            }

            console.log('Status page saved successfully:', result);
            alert("Status page saved successfully!");
            window.location.href = `./${_orgid}/statuspage`;
        } catch (error) {
            console.error('Error saving status page:', error);
            setErrors([`Failed to save status page: ${error.message}`]);
        } finally {
            setLoading(false);
        }
    };


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
                                        monitors?.map((monitor) => (
                                            <div
                                                key={monitor}
                                                onClick={(event) => handleMonitorClick(monitor, event)}
                                                className={`flex flex-row justify-between items-center w-full border-muted-foreground/10 rounded-md border-[1px] bg-background/10 hover:bg-background/20 transition-all duration-300 ease-in-out cursor-pointer ${
                                                    selectedMonitors.find(selected => selected.id === monitor.id) ? 'bg-blue-500/30' : ''
                                                }`}
                                            >
                                                <div className='flex flex-row justify-between items-center hover:bg-muted-foreground/5 transition-all w-full pr-4'>
                                                    <div className='w-20 flex items-center justify-center'>
                                                        <div className='relative flex items-center justify-center py-5'>
                                                            <div className={`absolute rounded-full ${selectedMonitors.find(selected => selected.id === monitor.id) ? 'bg-blue-300' : 'bg-green-500'} h-3 w-3 animate-ping`}></div>
                                                            <div className={`rounded-full ${selectedMonitors.find(selected => selected.id === monitor.id) ? 'bg-blue-300' : 'bg-green-500'} h-3 w-3`}></div>
                                                        </div>
                                                    </div>
                                                    <div className='w-full flex flex-col justify-between items-start'>
                                                        <h2 className='text-foreground font-semibold text-[14px]'>{monitor.name}</h2>
                                                        <p className='text-muted-foreground/60 font-normal text-[13px]'></p>
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
                                        <input type="text" onChange={(e) => setPageName(e.target.value)} className='bg-background/10 border-[1px] border-muted-foreground/10 rounded-md p-4 w-full' placeholder='Status Page Name' />
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
                                    <div className='flex flex-col'>
                                        <div className='flex flex-col'>
                                            <h2 className="text-lg font-medium text-white">Custom URL</h2>
                                            <p className="text-muted-foreground">Choose a custom URL for your status page.</p>
                                            <p className='mb-4 text-sm text-muted-foreground'>For example: status.yourdomain.com</p>
                                        </div>
                                        <div className='flex flex-col gap-4'>
                                            <div className='relative'>
                                                <input 
                                                    type="text" 
                                                    value={customURL}
                                                    onChange={(e) => {
                                                        const value = e.target.value.toLowerCase().trim();
                                                        setCustomURL(value);
                                                        if (!value) {
                                                            setDomainStatus('idle');
                                                            setDnsRecords(null);
                                                            setVerificationStatus('pending');
                                                        }
                                                    }}
                                                    className={`bg-background/10 border-[1px] rounded-md p-4 w-full pr-10
                                                        ${domainStatus === 'taken' ? 'border-red-500/50' : ''}
                                                        ${domainStatus === 'available' ? 'border-green-500/50' : ''}
                                                        ${domainStatus === 'invalid' ? 'border-red-500/50' : ''}`}
                                                    placeholder='status.yourdomain.com'
                                                />
                                                <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                                                    {domainStatus === 'checking' && <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />}
                                                    {domainStatus === 'available' && <CheckCircle className='w-5 h-5 text-green-500' />}
                                                    {(domainStatus === 'taken' || domainStatus === 'invalid') && <XCircle className='w-5 h-5 text-red-500' />}
                                                </div>
                                            </div>
                                            {dnsRecords && (
                                                <div className='bg-background/20 p-4 rounded-md'>
                                                    <h3 className="text-md font-medium text-white mb-2">DNS Configuration</h3>
                                                    <p className="text-muted-foreground text-sm mb-2">Add these DNS records to verify and activate your domain:</p>
                                                    <div className='space-y-2'>
                                                        <div>
                                                            <span className='text-muted-foreground text-sm'>Type: </span>
                                                            <span className='text-white text-sm'>{dnsRecords.type}</span>
                                                        </div>
                                                        <div>
                                                            <span className='text-muted-foreground text-sm'>Name: </span>
                                                            <span className='text-white text-sm'>{dnsRecords.name}</span>
                                                        </div>
                                                        <div>
                                                            <span className='text-muted-foreground text-sm'>Value: </span>
                                                            <span className='text-white text-sm'>{dnsRecords.value}</span>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        variant="secondary" 
                                                        className="mt-4" 
                                                        onClick={checkDomainVerification}
                                                        disabled={verificationStatus === 'verified'}
                                                    >
                                                        {verificationStatus === 'pending' && 'Verify Now'}
                                                        {verificationStatus === 'failed' && 'Retry Verification'}
                                                        {verificationStatus === 'verified' && 'Verified'}
                                                    </Button>
                                                    {verificationStatus === 'verified' && (
                                                        <span className='text-green-500 text-sm ml-2'>Domain verified successfully!</span>
                                                    )}
                                                    {verificationStatus === 'failed' && (
                                                        <span className='text-red-500 text-sm ml-2'>Verification failed. Please check your DNS records.</span>
                                                    )}
                                                </div>
                                            )}
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
        <SaveFooter readyToSave={canSave} onSave={handleSave} loading={loading} />
        <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
        );
}

function SaveFooter({ readyToSave, onSave, loading }) {
    return (
        <div className='flex flex-row items-center justify-between border-gray-800 w-full py-2 border-t'>
            <div className='container mx-auto flex flex-row justify-between px-6 lg:px-14'>
                <div />
                <div className='flex flex-row gap-4'>
                    <Tooltip 
                        text={!readyToSave ? 'Please resolve errors before saving' : 'Publish status page'} 
                        position='top'
                    >
                        <Button 
                            variant='primary' 
                            disabled={!readyToSave || loading} 
                            onClick={onSave}
                            className='flex flex-row gap-2 items-center'
                        >
                            <div className='flex flex-row gap-2 items-center font-medium'>
                                {loading ? (
                                    <Loader2 className='w-4 h-4 animate-spin' />
                                ) : (
                                    <Check className='w-4 h-4' />
                                )}
                                Publish
                            </div>
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
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
                        monitorTabs.map((tab: string, index: number) => (
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
                    selectedMonitors.map((monitor: { name: string; id: string }, index: number) => (
                        <div key={index} className='flex flex-row justify-between items-center hover:bg-muted-foreground/5 rounded-lg transition-all w-full pr-4'>
                            <div className='w-20 flex items-center justify-center'>
                                <div className='relative flex items-center justify-center py-5'>
                                    <div className={`absolute rounded-full bg-green-500 h-3 w-3 animate-ping`}></div>
                                    <div className={`rounded-full bg-green-500 h-3 w-3`}></div>
                                </div>
                            </div>
                            <div className='w-full flex flex-row justify-between items-start'>
                                <div>
                                    <h2 className='text-foreground font-semibold text-[14px]'>{monitor.name}</h2>
                                    <p className='text-muted-foreground/60 font-normal text-[13px]'></p>
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
                {monitorTabs.map((tab: string, index: number) => (
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
      
            <div className="grid grid-cols-2 gap-3">
              {selectedMonitors.map((monitor: { name: string; id: string }, index: number) => (
                <div
                  key={index}
                  className="border border-muted-foreground/10 rounded-md p-3 bg-zinc-800/20 flex items-center"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${systemStatus === "operational" ? "bg-green-500" : systemStatus === "degraded" ? "bg-amber-500" : "bg-red-500"}`}
                  ></div>
                  <div>
                    <div className="text-sm font-medium">{monitor.name}</div>
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