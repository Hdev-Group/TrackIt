"use client";

import Button from "@/components/button/button";
import AppFooter from "@/components/footer/appfooter";
import AuthChecks from "../../../authchecks";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/checkbox/checkbox";
import { Tooltip } from "@/components/sidebar/sidebar";
import axios from "axios";
import { SpinnerLoader } from '@/components/loaders/mainloader';


export default function CreateMonitor({spaceid}: {spaceid: string}) {

    console.log("Org ID: ", spaceid);
    // State for Monitoring
    const [webURL, setWebURL] = useState<string>("");
    const [isValidURL, setIsValidURL] = useState<boolean>(false);
    const [multipleURLs, setMultipleURLs] = useState<boolean>(false);
    const [monitorType, setMonitorType] = useState<string>("http");
    const [geographicLocations, setGeographicLocations] = useState<string[]>([]); 
    const [customHeaders, setCustomHeaders] = useState<string>("");
    const [port, setPort] = useState<string>(""); 

    // State for Alert Conditions
    const [alertCondition, setAlertCondition] = useState<string>("down");
    const [customConditions, setCustomConditions] = useState<boolean>(false);
    const [errorRateThreshold, setErrorRateThreshold] = useState<number>(0); 
    const [timeoutDuration, setTimeoutDuration] = useState<number>(0); 
    const [keyword, setKeyword] = useState<string>(""); 
    const [httpStatusCode, setHttpStatusCode] = useState<string>(""); 
    const [severityLevel, setSeverityLevel] = useState<string>("warning"); 

    // State for Alerts
    const [checkedOptions, setCheckedOptions] = useState<string[]>([]);
    const [escalationOption, setEscalationOption] = useState<string>("escalate"); 
    const [escalationDelay, setEscalationDelay] = useState<string>("5m"); 
    const [webhookURL, setWebhookURL] = useState<string>(""); 
    const [slackChannel, setSlackChannel] = useState<string>(""); 
    const [trackitChannel, setTrackitChannel] = useState<string>("");

    // State for Advanced Settings
    const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState<boolean>(false);
    const [confirmationTime, setConfirmationTime] = useState<string>("now"); 
    const [recoveryTime, setRecoveryTime] = useState<string>("3m"); 
    const [checkFrequency, setCheckFrequency] = useState<string>("3m");
    const [monitorTags, setMonitorTags] = useState<string>(""); 
    const [maintenanceWindowStart, setMaintenanceWindowStart] = useState<string>("");
    const [maintenanceWindowEnd, setMaintenanceWindowEnd] = useState<string>(""); 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Can save state
    const [canSave, setCanSave] = useState<boolean>(false);
    const [saveTooltip, setSaveTooltip] = useState<string>("Not ready to publish.");

    async function handlePublish() {
        if (!canSave) return; 
        setSaveTooltip("Publishing...");
        setLoading(true);
    
        console.log(spaceid)
        const monitorData = {
            spaceid: {
                id: spaceid,
            },
            monitoring: {
                webURL,
                isValidURL,
                multipleURLs,
                monitorType,
                geographicLocations,
                customHeaders: monitorType === "api" ? (() => {
                    try {
                        return JSON.parse(customHeaders);
                    } catch (error) {
                        console.error("Failed to parse customHeaders:", error);
                        return undefined;
                    }
                })() : undefined,                
                port: monitorType === "port" ? parseInt(port) : undefined, 
            },
            alertConditions: {
                alertCondition,
                customConditions,
                errorRateThreshold: alertCondition === "error-rate" ? errorRateThreshold : undefined,
                timeoutDuration: alertCondition === "timeout" ? timeoutDuration : undefined,
                keyword: alertCondition === "keyword" ? keyword : undefined,
                httpStatusCode: alertCondition === "http-status" ? parseInt(httpStatusCode) : undefined,
                severityLevel,
            },
            alerts: {
                notificationMethods: checkedOptions,
                escalationOption,
                escalationDelay,
                webhookURL: checkedOptions.includes("Webhook") ? webhookURL : undefined,
                slackChannel: checkedOptions.includes("Slack") ? slackChannel : undefined,
                trackitChannel: checkedOptions.includes("TrackIt Channel") ? trackitChannel : undefined,
            },
            advancedSettings: {
                confirmationTime,
                recoveryTime,
                checkFrequency,
                maintenanceWindow: maintenanceWindowStart && maintenanceWindowEnd ? {
                    start: new Date(maintenanceWindowStart).toISOString(),
                    end: new Date(maintenanceWindowEnd).toISOString(),
                } : undefined,
            },
        };
    
        try {
            const response = await axios.post(
                "/api/application/v1/monitoring/restricted/monitors/create",
                monitorData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Monitor created successfully:", response.data);
            setLoading(false);
            setSaveTooltip("Monitor created successfully!");
            setCanSave(false);
            window.location.href = `../monitors`;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("This monitor already exists.");
            } else {
                setError("An unexpected error occurred.");
            }
            setCanSave(true);
            setLoading(false);
        }
    }

    useEffect(() => {
        checkCanSave();
    }, [
        webURL,
        isValidURL,
        multipleURLs,
        monitorType,
        geographicLocations,
        customHeaders,
        port,
        alertCondition,
        customConditions,
        errorRateThreshold,
        timeoutDuration,
        keyword,
        httpStatusCode,
        severityLevel,
        checkedOptions,
        escalationOption,
        escalationDelay,
        webhookURL,
        slackChannel,
        advancedOptionsOpen,
        confirmationTime,
        recoveryTime,
        checkFrequency,
        monitorTags,
        maintenanceWindowStart,
        maintenanceWindowEnd,
    ]);

    function checkCanSave() {
        let isValid = true;
        let tooltipMessage = "Unable to save: ";

        // Monitoring Section
        if (!webURL || !isValidURL || webURL.length > 500) {
            isValid = false;
            tooltipMessage += "Please enter a valid URL under 500 chars. ";
        }
        if (!monitorType) {
            isValid = false;
            tooltipMessage += "Please select a monitor type. ";
        }
        if (geographicLocations.length === 0) {
            isValid = false;
            tooltipMessage += "Please select at least one geographic monitoring location. ";
        }
        if (monitorType === "api" && !customHeaders) {
            isValid = false;
            tooltipMessage += "Please provide custom headers for API monitoring. ";
        } else if (monitorType === "api") {
            try {
                JSON.parse(customHeaders);
            } catch (e) {
                isValid = false;
                tooltipMessage += "Custom headers must be valid JSON. ";
            }
        }
        if (monitorType === "port" && !port) {
            isValid = false;
            tooltipMessage += "Please provide a port number for port monitoring. ";
        } else if (monitorType === "port") {
            const portNum = parseInt(port);
            if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                isValid = false;
                tooltipMessage += "Port number must be between 1 and 65535. ";
            }
        }

        // Alert Conditions Section
        if (!alertCondition) {
            isValid = false;
            tooltipMessage += "Please select an alert condition. ";
        }
        if (alertCondition === "error-rate" && (errorRateThreshold <= 0 || errorRateThreshold > 100)) {
            isValid = false;
            tooltipMessage += "Error rate threshold must be between 1 and 100. ";
        }
        if (alertCondition === "timeout" && (timeoutDuration <= 0 || timeoutDuration > 3600)) {
            isValid = false;
            tooltipMessage += "Timeout duration must be between 1 and 3600 seconds. ";
        }
        if (alertCondition === "keyword" && !keyword) {
            isValid = false;
            tooltipMessage += "Please provide a keyword to monitor. ";
        }
        if (alertCondition === "http-status" && !httpStatusCode) {
            isValid = false;
            tooltipMessage += "Please provide an HTTP status code. ";
        } else if (alertCondition === "http-status") {
            const statusCodeNum = parseInt(httpStatusCode);
            if (isNaN(statusCodeNum) || statusCodeNum < 100 || statusCodeNum > 599) {
                isValid = false;
                tooltipMessage += "HTTP status code must be between 100 and 599. ";
            }
        }
        if (!severityLevel) {
            isValid = false;
            tooltipMessage += "Please select a severity level. ";
        } else if (!["warning", "critical"].includes(severityLevel)) {
            isValid = false;
            tooltipMessage += "Invalid severity level selected. ";
        }

        // Alerts Section
        if (checkedOptions.length === 0) {
            isValid = false;
            tooltipMessage += "Please select at least one notification method. ";
        }
        if (checkedOptions.includes("Slack") && !slackChannel) {
            isValid = false;
            tooltipMessage += "Please provide a Slack channel. ";
        }
        if (checkedOptions.includes("Webhook") && !webhookURL) {
            isValid = false;
            tooltipMessage += "Please provide a Webhook URL. ";
        } else if (checkedOptions.includes("Webhook")) {
            const urlPattern = new RegExp(
                "^(https?:\\/\\/)?" +
                "((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|" +
                "((\\d{1,3}\\.){3}\\d{1,3}))" +
                "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
                "(\\?[;&a-z\\d%_.~+=-]*)?" +
                "(\\#[-a-z\\d_]*)?$",
                "i"
            );
            if (!urlPattern.test(webhookURL)) {
                isValid = false;
                tooltipMessage += "Please provide a valid Webhook URL. ";
            }
        }
        if (!escalationOption) {
            isValid = false;
            tooltipMessage += "Please select an escalation option. ";
        }
        if (maintenanceWindowStart && maintenanceWindowEnd) {
            const startDate = new Date(maintenanceWindowStart);
            const endDate = new Date(maintenanceWindowEnd);
            if (startDate >= endDate) {
                isValid = false;
                tooltipMessage += "Maintenance window end time must be after start time. ";
            }
        }

        if (isValid) {
            setCanSave(true);
            setSaveTooltip("Ready to publish!");
        } else {
            setCanSave(false);
            setSaveTooltip(tooltipMessage);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        checkCanSave();
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        checkCanSave();
    };
    const handleCheckboxChange = (checked: boolean) => {
        checkCanSave();
    };
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        checkCanSave();
    };
    const handleButtonClick = () => {
        checkCanSave();
    };

    // URL validation function
    function validateURL(url: string): boolean {
        const pattern = new RegExp(
            "^(https?:\\/\\/)?" +
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|" +
            "((\\d{1,3}\\.){3}\\d{1,3}))" +
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
            "(\\?[;&a-z\\d%_.~+=-]*)?" +
            "(\\#[-a-z\\d_]*)?$",
            "i"
        );

        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }
        if (pattern.test(url)) {
            setWebURL(url);
            return true;
        } else {
            return false;
        }
    }

    const handleGeographicLocationChange = (location: string) => {
        setGeographicLocations((prev) =>
            prev.includes(location)
                ? prev.filter((loc) => loc !== location)
                : [...prev, location]
        );
        checkCanSave(); 
    };

    function SaveFooter({ readyToSave, saveTooltip, errorMessage }: SaveFooterProps) {
        return (
            <div className="flex flex-row items-center justify-between border-gray-800 w-full py-2 border-t">
                <div className="container mx-auto flex flex-row justify-between px-6 lg:px-14">
                    <div />
                    <div className="flex flex-row items-center justify-center gap-4">
                        {
                            errorMessage && (
                                <div className="text-red-500 text-sm font-medium">
                                    {errorMessage}
                                </div>
                            )
                        }
                        <Tooltip text={saveTooltip} position="top">
                            <Button
                                variant="primary"
                                disabled={!readyToSave}
                                className="flex flex-row gap-2 items-center"
                                onClick={handlePublish} 
                            >
                                <div className="flex flex-row gap-2 items-center font-medium">
                                    {
                                        loading ? (
                                            <SpinnerLoader size={20} />
                                        ) : (
                                            <div className="flex flex-row items-center justify-center gap-2">
                                                <Check className="w-4 h-4" /> Publish
                                            </div>
                                        )
                                    }
                                </div>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        );
    }
    

    return (
        <AuthChecks>
            <div className="bg-[#101218] w-full h-full overflow-y-scroll changedscrollbar">
                <div className="flex flex-col items-start mt-10 justify-start w-full h-full">
                    <div className="container mx-auto px-2 lg:px-10 flex flex-col justify-start items-start w-full h-screen">
                        <div className="flex flex-row items-center justify-start gap-5 w-full mt-10 mb-2">
                            <ChevronLeft
                                className="w-8 h-8 hover:text-white hover:bg-zinc-700/20 rounded-lg text-muted-foreground cursor-pointer"
                                onClick={() => window.history.back()}
                            />
                            <h1 className="text-3xl font-medium text-white">Monitor Creator</h1>
                        </div>
                        <div className="flex flex-col items-start justify-between w-full mt-10 mb-2">
                            <div className="flex flex-col xl:flex-row gap-4 relative w-full">
                                <div className="flex flex-col w-full">
                                    <h1 className="text-2xl font-medium text-white">Monitors</h1>
                                    <p className="text-muted-foreground mb-4">
                                        Add monitors to your status page. These are the components that will be monitored and displayed.
                                    </p>
                                    <div className="flex flex-col gap-10 w-full">
                                        <div className="w-full gap-4 flex justify-between items-start flex-col lg:flex-row">
                                            <div className="flex flex-col w-full xl:sticky top-10">
                                                <h2 className="text-lg font-medium text-white">What should we monitor?</h2>
                                                <p className="text-muted-foreground mb-4">
                                                    Enter the URL of the service you want to monitor. You are able to configure more in advanced options.
                                                </p>
                                            </div>
                                            <div className="w-full flex flex-col border border-[#23283b] rounded-lg h-auto transition-all duration-300 bg-[#151824] gap-2">
                                                <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                    <h2 className="text-md w-auto font-medium text-white">Monitoring</h2>
                                                    {/* Monitor Type Selection */}
                                                    <div className="flex flex-col gap-2">
                                                        <label htmlFor="monitorType" className="text-sm font-normal text-white/70">
                                                            Monitor Type
                                                        </label>
                                                        <select
                                                            id="monitorType"
                                                            value={monitorType}
                                                            onChange={(e) => {
                                                                setMonitorType(e.target.value);
                                                                handleSelectChange(e);
                                                            }}
                                                            className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="http">HTTP/HTTPS</option>
                                                            <option value="api">API Endpoint</option>
                                                            <option value="keyword">Keyword Monitoring</option>
                                                            <option value="dns">DNS Monitoring</option>
                                                            <option value="ssl">SSL/TLS Monitoring</option>
                                                            <option value="port">Port Monitoring</option>
                                                        </select>
                                                    </div>
                                                    {/* URL Input */}
                                                    <div className="flex flex-col gap-2">
                                                        <h2 className="text-sm font-normal text-white/70">URL to monitor</h2>
                                                        {multipleURLs ? (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <textarea
                                                                    maxLength={500}
                                                                    className={`bg-[#161922] text-white border rounded-lg px-4 py-2 w-full ${isValidURL ? "border-green-500" : "border-red-500"}`}
                                                                    placeholder="https://hdev.uk"
                                                                    onChange={(e) => {
                                                                        const url = e.target.value;
                                                                        setIsValidURL(validateURL(url));
                                                                        handleTextareaChange(e);
                                                                    }}
                                                                ></textarea>
                                                                <p className="text-muted-foreground text-xs mt-0.5">
                                                                    Enter multiple URLs separated by a comma.
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                maxLength={200}
                                                                className={`bg-[#161922] text-white border rounded-lg px-4 py-2 w-full ${isValidURL ? "border-green-500" : "border-red-500"}`}
                                                                placeholder="https://hdev.uk"
                                                                onChange={(e) => {
                                                                    const url = e.target.value;
                                                                    setIsValidURL(validateURL(url));
                                                                    handleInputChange(e);
                                                                }}
                                                            />
                                                        )}
                                                        {multipleURLs ? (
                                                            <p className="text-muted-foreground text-xs mt-0.5">
                                                                Need to monitor a single URL?{" "}
                                                                <span onClick={() => { setMultipleURLs(false); handleButtonClick(); }} className="underline cursor-pointer hover:text-white">
                                                                    Click here
                                                                </span>
                                                            </p>
                                                        ) : (
                                                            <p className="text-muted-foreground text-xs mt-0.5">
                                                                Need to monitor multiple URLs?{" "}
                                                                <span onClick={() => { setMultipleURLs(true); handleButtonClick(); }} className="underline cursor-pointer hover:text-white">
                                                                    Click here
                                                                </span>
                                                            </p>
                                                        )}
                                                    </div>
                                                    {/* Geographic Locations */}
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-sm font-normal text-white/70">Geographic Monitoring Locations</label>
                                                        <div className="flex flex-row gap-4 flex-wrap">
                                                            {["North America", "Europe", "Asia", "South America", "Australia"].map((location) => (
                                                                <div key={location} className="flex items-center gap-3">
                                                                    <Checkbox
                                                                        id={location}
                                                                        checked={geographicLocations.includes(location)}
                                                                        onCheckedChange={(checked) => {
                                                                            handleGeographicLocationChange(location);
                                                                            handleCheckboxChange(checked as boolean);
                                                                        }}
                                                                        className="h-5 w-5 rounded-md border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                    <label htmlFor={location} className="text-sm font-normal text-white/70 cursor-pointer hover:text-white">
                                                                        {location}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Custom Headers */}
                                                    {monitorType === "api" && (
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="customHeaders" className="text-sm font-normal text-white/70">
                                                                Custom Headers (JSON format)
                                                            </label>
                                                            <textarea
                                                                id="customHeaders"
                                                                maxLength={1000}
                                                                className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full h-24"
                                                                placeholder='{"Authorization": "Bearer token"}'
                                                                value={customHeaders}
                                                                onChange={(e) => {
                                                                    setCustomHeaders(e.target.value);
                                                                    handleTextareaChange(e);
                                                                }}
                                                            ></textarea>
                                                        </div>
                                                    )}
                                                    {/* Port Monitoring */}
                                                    {monitorType === "port" && (
                                                        <div className="flex flex-col gap-2">
                                                            <label htmlFor="port" className="text-sm font-normal text-white/70">
                                                                Port to Monitor
                                                            </label>
                                                            <input
                                                                type="text"
                                                                min={1}
                                                                max={65535}
                                                                id="port"
                                                                className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                placeholder="e.g., 3306 for MySQL"
                                                                value={port}
                                                                onChange={(e) => {
                                                                    setPort(e.target.value);
                                                                    handleInputChange(e);
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="w-full border-b border-[#23283b] my-2" />
                                                {/* Alert Conditions */}
                                                <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                    <h2 className="text-md w-auto font-medium text-white">Alert Conditions</h2>
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex flex-row gap-4 items-start justify-between w-full">
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="alertConditions" className="text-sm font-normal text-white/70">
                                                                    Alert us when:
                                                                </label>
                                                                <select
                                                                    id="alertConditions"
                                                                    value={alertCondition}
                                                                    onChange={(e) => {
                                                                        setAlertCondition(e.target.value);
                                                                        if (e.target.value === "custom") {
                                                                            setCustomConditions(true);
                                                                        } else {
                                                                            setCustomConditions(false);
                                                                        }
                                                                        handleSelectChange(e);
                                                                    }}
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                >
                                                                    <option value="down">URL becomes unavailable</option>
                                                                    <option value="slow">URL is responding slowly</option>
                                                                    <option value="error-rate">The error rate exceeds a threshold</option>
                                                                    <option value="timeout">The URL times out</option>
                                                                    <option value="keyword">URL contains a keyword</option>
                                                                    <option value="http-status">The URL returns a specific HTTP status code</option>
                                                                    <option value="ping">Host doesn’t respond to ping</option>
                                                                    <option value="ssl-expiry">SSL certificate is about to expire</option>
                                                                    <option value="dns-failure">DNS resolution fails</option>
                                                                </select>
                                                                <p className="text-muted-foreground text-xs mt-0.5">
                                                                    We will alert you when this condition is met.
                                                                </p>
                                                                <p className="text-muted-foreground text-xs mt-0.5">
                                                                    It’s recommended to use the keyword condition for uptime monitoring.
                                                                </p>
                                                            </div>
                                                            {/* Severity Level */}
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="severityLevel" className="text-sm font-normal text-white/70">
                                                                    Severity Level
                                                                </label>
                                                                <select
                                                                    id="severityLevel"
                                                                    value={severityLevel}
                                                                    onChange={(e) => {
                                                                        setSeverityLevel(e.target.value);
                                                                        handleSelectChange(e);
                                                                    }}
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                >
                                                                    <option value="warning">Warning</option>
                                                                    <option value="critical">Critical</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        {/* Conditional Inputs for Alert Conditions */}
                                                        {alertCondition === "error-rate" && (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="errorRate" className="text-sm font-normal text-white/70">
                                                                    Error Rate Threshold (%)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="errorRate"
                                                                    min="0"
                                                                    max="100"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="Enter error rate threshold"
                                                                    value={errorRateThreshold}
                                                                    onChange={(e) => {
                                                                        setErrorRateThreshold(Number(e.target.value));
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {alertCondition === "timeout" && (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="timeout" className="text-sm font-normal text-white/70">
                                                                    Timeout Duration (seconds)
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="timeout"
                                                                    min="1"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="Enter timeout duration"
                                                                    value={timeoutDuration}
                                                                    onChange={(e) => {
                                                                        setTimeoutDuration(Number(e.target.value));
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {alertCondition === "keyword" && (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="keyword" className="text-sm font-normal text-white/70">
                                                                    Keyword to find on the page
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="keyword"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="Enter keyword to monitor"
                                                                    value={keyword}
                                                                    onChange={(e) => {
                                                                        setKeyword(e.target.value);
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                                <p className="text-muted-foreground text-xs mt-0.5">We use insensitive matching</p>
                                                            </div>
                                                        )}
                                                        {alertCondition === "http-status" && (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <label htmlFor="httpStatusCode" className="text-sm font-normal text-white/70">
                                                                    HTTP Status Code
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="httpStatusCode"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="e.g., 500"
                                                                    value={httpStatusCode}
                                                                    onChange={(e) => {
                                                                        setHttpStatusCode(e.target.value);
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* On-Call Response */}
                                        <div className="w-full gap-4 flex justify-between items-start flex-col lg:flex-row">
                                            <div className="flex flex-col w-full xl:sticky top-10">
                                                <h2 className="text-lg font-medium text-white">On-Call Response</h2>
                                                <p className="text-muted-foreground mb-4">
                                                    Set rules for who should be alerted and where when an incident occurs.
                                                </p>
                                            </div>
                                            <div className="w-full flex flex-col border border-[#23283b] rounded-lg h-auto transition-all duration-300 bg-[#151824] gap-2">
                                                <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                    <h2 className="text-md w-auto font-medium text-white">Alerts</h2>
                                                    <div className="flex flex-col gap-4">
                                                        <label className="text-sm font-normal text-white/70">
                                                            When there is an incident, contact via:
                                                        </label>
                                                        <div className="flex flex-row gap-4 flex-wrap">
                                                            {["TrackIt Channel", "Email", "SMS", "Push Notification", "Slack", "Webhook"].map((option) => (
                                                                <div key={option} className="flex items-center gap-3">
                                                                    <Checkbox
                                                                        id={option}
                                                                        checked={checkedOptions.includes(option)}
                                                                        onCheckedChange={(checked) => {
                                                                            if (checked) {
                                                                                setCheckedOptions((prev) => [...prev, option]);
                                                                            } else {
                                                                                setCheckedOptions((prev) =>
                                                                                    prev.filter((item) => item !== option)
                                                                                );
                                                                            }
                                                                            handleCheckboxChange(checked as boolean);
                                                                        }}
                                                                        className="h-5 w-5 rounded-md border-gray-300 text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={option}
                                                                        className="text-sm font-normal text-white/70 cursor-pointer hover:text-white"
                                                                    >
                                                                        {option}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {
                                                            checkedOptions.includes("TrackIt Channel") && (
                                                                <div className="flex flex-col gap-2">
                                                                    <label htmlFor="trackitChannel" className="text-sm font-normal text-white/70">
                                                                        TrackIt Channel
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="trackitChannel"
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                        placeholder="#alerts"
                                                                        value={trackitChannel}
                                                                        onChange={(e) => {
                                                                            setTrackitChannel(e.target.value);
                                                                            handleInputChange(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }
                                                        {/* Slack Channel */}
                                                        {checkedOptions.includes("Slack") && (
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="slackChannel" className="text-sm font-normal text-white/70">
                                                                    Slack Channel
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="slackChannel"
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="#alerts"
                                                                    value={slackChannel}
                                                                    onChange={(e) => {
                                                                        setSlackChannel(e.target.value);
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Webhook URL */}
                                                        {checkedOptions.includes("Webhook") && (
                                                            <div className="flex flex-col gap-2">
                                                                <label htmlFor="webhookURL" className="text-sm font-normal text-white/70">
                                                                    Webhook URL
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="webhookURL"
                                                                    maxLength={1000}
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    placeholder="https://your-webhook-url.com"
                                                                    value={webhookURL}
                                                                    onChange={(e) => {
                                                                        setWebhookURL(e.target.value);
                                                                        handleInputChange(e);
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="border-b border-[#23283b] my-2" />
                                                <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                    <div className="flex flex-col gap-4 w-full">
                                                        <label className="text-sm font-normal text-white/70">
                                                            If the on-call engineer does not acknowledge the alert
                                                        </label>
                                                        <div className="flex flex-row gap-4 w-full">
                                                            <select
                                                                id="escalationOptions"
                                                                value={escalationOption}
                                                                onChange={(e) => {
                                                                    setEscalationOption(e.target.value);
                                                                    handleSelectChange(e);
                                                                }}
                                                                className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                            >
                                                                <option value="escalate">Escalate to the next on-call engineer</option>
                                                                <option value="notify">Notify the on-call engineer again</option>
                                                                <option value="escalate-then-notify">Escalate then notify</option>
                                                                <option value="alertall">Alert all on-call engineers</option>
                                                            </select>
                                                            {(escalationOption === "escalate" || escalationOption === "escalate-then-notify") && (
                                                                <select
                                                                    id="escalationDelay"
                                                                    value={escalationDelay}
                                                                    onChange={(e) => {
                                                                        setEscalationDelay(e.target.value);
                                                                        handleSelectChange(e);
                                                                    }}
                                                                    className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                >
                                                                    <option value="1m">1 minute</option>
                                                                    <option value="3m">3 minutes</option>
                                                                    <option value="5m">5 minutes</option>
                                                                    <option value="10m">10 minutes</option>
                                                                </select>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Advanced Settings */}
                                        <div className="flex flex-col gap-2 w-full pb-20">
                                            <div className="flex flex-row gap-2 my-4">
                                                <div
                                                    className="flex flex-col gap-2 cursor-pointer"
                                                    onClick={() => {
                                                        setAdvancedOptionsOpen(!advancedOptionsOpen);
                                                        handleButtonClick();
                                                    }}
                                                >
                                                    <ChevronDown
                                                        className={`w-4 h-4 hover:text-[#393f57] text-[#272c3f] transition-all ${
                                                            advancedOptionsOpen ? "" : "-rotate-90"
                                                        }`}
                                                    />
                                                </div>
                                                <div
                                                    className="border-b w-full cursor-pointer hover:border-[#313750] transition-all border-[#23283b] my-2 relative"
                                                    onClick={() => {
                                                        setAdvancedOptionsOpen(!advancedOptionsOpen);
                                                        handleButtonClick();
                                                    }}
                                                >
                                                    <div className="absolute -top-2 left-1/2 px-2 text-sm font-medium">Advanced Options</div>
                                                </div>
                                            </div>
                                            <div
                                                className={`flex flex-col gap-2 mt-4 transition-all duration-300 ${
                                                    advancedOptionsOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                                                }`}
                                            >
                                                <div className="w-full gap-4 flex justify-between items-start flex-col lg:flex-row">
                                                    <div className="flex flex-col w-full xl:sticky top-10">
                                                        <h2 className="text-lg font-medium text-white">Advanced Settings</h2>
                                                        <p className="text-muted-foreground mb-4">Configure advanced settings for your monitor.</p>
                                                    </div>
                                                    <div className="w-full flex flex-col border border-[#23283b] rounded-lg h-auto transition-all duration-300 bg-[#151824] gap-2">
                                                        <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                            <h2 className="text-md font-medium text-white">Incident Response</h2>
                                                            <div className="flex flex-row gap-4 items-start w-full">
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="confirmationTime" className="text-sm font-normal text-white/70">
                                                                        Confirmation Time
                                                                    </label>
                                                                    <select
                                                                        id="confirmationTime"
                                                                        value={confirmationTime}
                                                                        onChange={(e) => {
                                                                            setConfirmationTime(e.target.value);
                                                                            handleSelectChange(e);
                                                                        }}
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    >
                                                                        <option value="now">Instant Confirmation</option>
                                                                        <option value="1m">1 minute</option>
                                                                        <option value="2m">2 minutes</option>
                                                                        <option value="3m">3 minutes</option>
                                                                        <option value="5m">5 minutes</option>
                                                                        <option value="10m">10 minutes</option>
                                                                        <option value="15m">15 minutes</option>
                                                                        <option value="30m">30 minutes</option>
                                                                        <option value="1h">1 hour</option>
                                                                    </select>
                                                                    <p className="text-muted-foreground text-xs mt-0.5">
                                                                        How long should we wait before we consider the incident confirmed?
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="recoveryTime" className="text-sm font-normal text-white/70">
                                                                        Recovery Time
                                                                    </label>
                                                                    <select
                                                                        id="recoveryTime"
                                                                        value={recoveryTime}
                                                                        onChange={(e) => {
                                                                            setRecoveryTime(e.target.value);
                                                                            handleSelectChange(e);
                                                                        }}
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    >
                                                                        <option value="now">Instant Recovery</option>
                                                                        <option value="1m">1 minute</option>
                                                                        <option value="2m">2 minutes</option>
                                                                        <option value="3m">3 minutes</option>
                                                                        <option value="5m">5 minutes</option>
                                                                        <option value="10m">10 minutes</option>
                                                                        <option value="15m">15 minutes</option>
                                                                        <option value="30m">30 minutes</option>
                                                                        <option value="1h">1 hour</option>
                                                                        <option value="2h">2 hours</option>
                                                                    </select>
                                                                    <p className="text-muted-foreground text-xs mt-0.5">
                                                                        How long should we wait before we consider the incident resolved?
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-row gap-4 items-start w-full">
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="checkFrequency" className="text-sm font-normal text-white/70">
                                                                        Check Frequency
                                                                    </label>
                                                                    <select
                                                                        id="checkFrequency"
                                                                        value={checkFrequency}
                                                                        onChange={(e) => {
                                                                            setCheckFrequency(e.target.value);
                                                                            handleSelectChange(e);
                                                                        }}
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                    >
                                                                        <option value="30s">30 seconds</option>
                                                                        <option value="1m">1 minute</option>
                                                                        <option value="2m">2 minutes</option>
                                                                        <option value="3m">3 minutes</option>
                                                                        <option value="5m">5 minutes</option>
                                                                        <option value="10m">10 minutes</option>
                                                                        <option value="15m">15 minutes</option>
                                                                        <option value="30m">30 minutes</option>
                                                                        <option value="1h">1 hour</option>
                                                                    </select>
                                                                    <p className="text-muted-foreground text-xs mt-0.5">
                                                                        How often should we check your monitor?
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="border-b border-[#23283b] my-2" />
                                                        <div className="px-6 py-5 flex w-full flex-col gap-4">
                                                            <h2 className="text-md font-medium text-white">Maintenance Window</h2>
                                                            <div className="flex flex-row gap-4 items-start w-full">
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="maintenanceWindowStart" className="text-sm font-normal text-white/70">
                                                                        Start Time
                                                                    </label>
                                                                    <input
                                                                        type="datetime-local"
                                                                        id="maintenanceWindowStart"
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                        value={maintenanceWindowStart}
                                                                        onChange={(e) => {
                                                                            setMaintenanceWindowStart(e.target.value);
                                                                            handleInputChange(e);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <label htmlFor="maintenanceWindowEnd" className="text-sm font-normal text-white/70">
                                                                        End Time
                                                                    </label>
                                                                    <input
                                                                        type="datetime-local"
                                                                        id="maintenanceWindowEnd"
                                                                        className="bg-[#161922] text-white border border-[#23283b] rounded-lg px-4 py-2 w-full"
                                                                        value={maintenanceWindowEnd}
                                                                        onChange={(e) => {
                                                                            setMaintenanceWindowEnd(e.target.value);
                                                                            handleInputChange(e);
                                                                        }}
                                                                    />
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
                </div>
            </div>
            <SaveFooter readyToSave={canSave} saveTooltip={saveTooltip} errorMessage={error} />
            <AppFooter className={"px-6 lg:px-14"} />
        </AuthChecks>
    );
}

interface SaveFooterProps {
    readyToSave: boolean;
    saveTooltip: string;
    errorMessage?: string;
}

