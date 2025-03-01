"use client"
import { motion } from "framer-motion"
import Header from "@/components/header/header";
import Button from "@/components/button/button";
import { AlertOctagon, ArrowRightIcon, CheckIcon, ChevronDown, ChevronLeft, ChevronRight, Columns3Icon, FileLock, Hand, Keyboard, Minus, MinusIcon} from "lucide-react";
import Footer from "@/components/footer/footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import Jointoday from "@/components/jointoday/jointoday";
import { title } from "process";

export default function Home() {
  let currentIndex = 0;
  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('carousel');
    const totalItems = carousel.children.length;
    currentIndex = (currentIndex + direction + totalItems) % totalItems;
    const translateValue = window.innerWidth >= 768 ? currentIndex * 40 : currentIndex * 103;
    carousel.style.transform = `translateX(-${translateValue}%)`;
  };


  let incidentcarouselindex = 0


  const scrollIncidentCarousel = (direction) => {
    const carousel = document.getElementById('incidentcarousel');
    const totalItems = carousel.children.length;
    incidentcarouselindex = (incidentcarouselindex + direction + totalItems) % totalItems;
    const translateValue = window.innerWidth >= 768 ? incidentcarouselindex * 60 : incidentcarouselindex * 103;
    carousel.style.transform = `translateX(-${translateValue}%)`;
  };
  
  const incidentcarousel = [
    {
      title: "Incident Management",
      description: "TrackIt’s incident management system ensures your team is always on the same page.",
      image: "/trackitindeximages/incidentmanagement.png"
    },
    {
      title: "Incident Reporting",
      description: "TrackIt’s incident reporting system ensures your team is always on the same page.",
      image: "/trackitindeximages/incidentreporting.png"
    },
    {
      title: "Customizable Alerts",
      description: "TrackIt’s customizable alerts system ensures your team is always on the same page.",
      image: "/trackitindeximages/customizablealerts.png"
    }, 
    {
      title: "Real-Time Status",
      description: "TrackIt’s real-time status system ensures your team is always on the same page.",
      image: "/trackitindeximages/realtimestatus.png"
    },
    {
      title: "Instant Notifications",
      description: "TrackIt’s instant notification system ensures your team is always on the same page.",

    }
  ];

  let supportcarouselindex = 0

  const scrollSupportCarousel = (direction) => {
    const carousel = document.getElementById('supportcarousel');
    const totalItems = carousel.children.length;
    supportcarouselindex = (supportcarouselindex + direction + totalItems) % totalItems;
    const translateValue = window.innerWidth >= 768 ? supportcarouselindex * 40 : supportcarouselindex * 103;
    carousel.style.transform = `translateX(-${translateValue}%)`;
  }

  const supportcarousel = [
    {
      title: "Support Tickets",
      description: "TrackIt’s ticket support system ensures your customers get the help they need, when they need it.",
      image: "/trackitindeximages/supporttickets.png"
    },
    {
      title: "Talk with your team and customers",
      description: "TrackIt’s communication system ensures your team is always on the same page.",
      image: "/trackitindeximages/communicationchats.png"
    },
    {
      title: "Automated Responses",
      description: "TrackIt’s automated response system helps you quickly address common customer inquiries.",
      image: "/trackitindeximages/automatedresponses.png"
    },
    {
      title: "Detailed Analytics",
      description: "TrackIt’s analytics provide insights into your support team's performance and customer satisfaction.",
      image: "/trackitindeximages/detailedanalytics.png"
    },
    {
      title: "Multi-Channel Support",
      description: "TrackIt’s multi-channel support allows you to manage customer inquiries from various platforms in one place.",
      image: "/trackitindeximages/multichannelsupport.png"
    }
  ];

  const productivitycarousel = [
    {
      title: "Support Tickets",
      description: "TrackIt’s ticket support system ensures your customers get the help they need, when they need it.",
      image: "/trackitindeximages/supporttickets.png"
    },
    {
      title: "Communication Chats",
      description: "TrackIt’s shift management system ensures your team is always on the same page.",
      image: "/trackitindeximages/communicationchats.png"
    },
    {
      title: "Incident Management",
      description: "TrackIt’s incident management system ensures your team is always on the same page.",
    },
    {
      title: "Shift Management",
      description: "TrackIt’s shift management system ensures your team is always on the same page.",
    }
  ];

  return (
    <>
      <main className="flex flex-col bg-[#101218] items-center relative justify-center overflow-hidden  min-h-screen">
      <Header />
        <div className="flex flex-col items-start justify-start w-full h-full">
          <section className="container mx-auto h-auto relative flex mt-24 flex-col items-start justify-start">
            <div className="relative flex flex-col items-start justify-start max-w-full overflow-hidden">
              <div className="w-[10rem] z-40 py-1 rounded-full flex items-start justify-start">
              <img src="/trackitlogo/light/logo.png" alt="TrackIt" className="w-10 h-10" />
              </div>
              <div className="text-6xl flex flex-col font-semibold text-transparent leading-tight z-20 bg-clip-text textgradientmovetransition">
                <p>Making SaaS</p><p>Simpler With TrackIt</p>
              </div>
              <p className="text-md md:max-w-[34rem] w-full text-white text-wrap flex-wrap z-20">
                TrackIt, an all-in-one platform for start-ups to manage their teams, support requests, shifts and projects.
              </p>
              <div className="flex mt-8 justify-between z-20 gap-5 w-full">
                <Button variant="slide-fill" className="md:w-1/3 group !rounded-full flex flex-row items-center justify-center" type="button" href="/auth/signin">
                  <span className="flex flex-row gap-1  items-center justify-center">
                  TRY IT FREE <ArrowRightIcon className="h-4 group-hover:translate-x-2 transition-all" />
                  </span>
                </Button>
              </div>
            </div>
            <motion.div 
              className="absolute top-0 flex rounded-xl items-center justify-center -left-32 -rotate-45 h-[40rem] bg-gradient-to-t from-[#0099ff]/35 to-cyan-500/30 blur-[4rem] backdrop-blur-md z-10 w-44 transform-gpu skew-y-12" 
              initial={{height: "0rem", top: "0rem"}}
              animate={{height: "90rem", top: "-50rem"}}
              transition={{delay: 0.5, duration: 1, ease: "easeOut"}}
            />
          </section>
        <section className="container mx-auto h-auto relative mt-24 z-40 flex flex-col items-center justify-start">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="bg-gradient-to-r w-full h-4 z-0 flex items-start justify-start backdrop-blur-md blur-[3rem]"/>
            <div className="spinnercard borderspincard w-auto rounded-2xl z-10  flex flex-col outerzoomer items-start justify-start">
                <div className="inner  w-auto relative">
                <img src="/trackitindeximages/dashboard.png" alt="TrackIt" className="rounded-md w-auto max-h-[40rem] z-40 " />
                <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-[#101218] to-transparent z-50"></div>
                </div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm text-muted-foreground/90">All the essential tools to streamline and scale your SaaS:</h2>
                <div className="flex flex-wrap lg:flex-row gap-4">
                <span className="text-sm">Team Management</span>
                <span className="text-sm relative before:bg-foreground/40 before:rounded-full before:h-1 before:w-1 before:absolute before:left-[-10px] before:top-[50%] before:transform before:translate-y-[-50%]">Ticket Support</span>
                <span className="text-sm relative before:bg-foreground/40 before:rounded-full before:h-1 before:w-1 before:absolute before:left-[-10px] before:top-[50%] before:transform before:translate-y-[-50%]">Shift Management</span>
                <span className="text-sm relative before:bg-foreground/40 before:rounded-full before:h-1 before:w-1 before:absolute before:left-[-10px] before:top-[50%] before:transform before:translate-y-[-50%]">Project Management</span>
                <span className="text-sm relative before:bg-foreground/40 before:rounded-full before:h-1 before:w-1 before:absolute before:left-[-10px] before:top-[50%] before:transform before:translate-y-[-50%]">Incident Management</span>
                </div>
            </div>
          </div>
        </section>
        <section className="w-full  h-auto relative flex flex-col mt-24 pb-24 items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 justify-start">
            <div className="w-full flex flex-col items-center justify-center relative">
            <div className="flex rounded-md items-center absolute -top-10 justify-center bg-gradient-to-tr linedgrid w-[100%] h-96 z-50" />
              <div className="absolute top-12 flex rounded-md items-center justify-center bg-gradient-to-tr from-indigo-400 to-cyan-400 w-full h-20 backdrop-blur-3xl blur-[8rem] z-40" />
              <div className="px-4 py-2 rounded-full flex flex-row gap-2 items-center z-50 justify-center bg-indigo-500/10 text-indigo-500 backdrop-blur-md">
              <Keyboard className="h-5 w-5 text-indigo-500" />
              <p className="text-md font-semibold text-indigo-500 capitalize">PRODUCTIVITY</p>
              </div>
              <h1 className="text-6xl font-medium text-white my-9 backdrop-blur-md z-50">One place for all <br /> your SaaS Tools</h1>
            </div>
            <div className="flex mt-8 justify-between flex-col gap-5 w-full">
              <div className="md:grid flex flex-col md:grid-cols-4 gap-5 w-full">
                <div className="bg-indigo-700 hover:border-muted-foreground/20 relative border border-muted-foreground/10 rounded-xl col-span-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out h-96 flex flex-col items-start justify-start">
                  <div className="w-full flex flex-col px-4 py-6 gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Support Tickets</h2>
                    <p className="text-sm font-semibold text-white/80">TrackIt’s ticket support system ensures your customers get the help they need, when they need it.</p>
                  </div>
                </div>
                <div className="bg-indigo-700 relative border border-muted-foreground/10 rounded-xl col-span-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out h-96 flex flex-col items-start justify-start">
                  <div className="w-full flex flex-col px-4 py-6 gap-2 mb-2">
                    <h2 className="text-xl font-semibold">Communication Chats</h2>
                    <p className="text-sm font-semibold text-white/80">TrackIt’s shift management system ensures your team is always on the same page.</p>
                  </div>
                </div>
              </div>
                <h2 className="font-medium text-3xl mt-20">The modern everything platform</h2>
                <div className="flex flex-col gap-5 w-full">
                <div className="relative h-auto w-full overflow-visible rounded-xl">
                    <div id="carousel" className="relative flex w-full gap-4 h-full transition-all overflow-visible">
                    {
                      productivitycarousel.map((item, index) => (
                      <div key={index} className="flex-shrink-0 md:w-1/2 w-full h-full">
                        <div className="flex flex-col items-start justify-start w-full h-full">
                        <div className="w-full h-full flex flex-col items-start justify-start">
                          <div className="flex mt-8 justify-between flex-col gap-5 rounded-xl overflow-hidden px-6 py-4 w-full bg-neutral-500/20 relative h-[40rem] max-h-[40rem]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-900 z-10"></div>
                            <div className="flex flex-col items-start gap-3 z-20 justify-start">
                            <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                            <p className="text-md text-white/80">{item.description}</p>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                      ))
                    }
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                  <button onClick={() => scrollCarousel(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button onClick={() => scrollCarousel(1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="flex mt-20 justify-between flex-col gap-5 rounded-xl overflow-hidden px-6 py-4 w-full bg-neutral-500/20 relative h-[40rem] max-h-[40rem]">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-900 z-10"></div>
                    <div className="flex flex-col items-start gap-3 z-20 justify-start">
                      <h2 className="text-2xl font-semibold text-white">Webhooks</h2>
                      <p className="text-md text-white/80">TrackIt’s webhook system ensures your team is always on the same page.</p>
                    </div>
                  </div>
                </div>
              <div className="text-white/70 items-end justify-end flex flex-row gap-5 w-full">
                <p className="font-medium relative after:h-[80%] after:w-[1px] after:bg-white/70 after:absolute after:left-full after:top-[10%] after:ml-2">Replaces</p> <div className="flex flex-row gap-2 fill-white"><Zendesksvg /> <Teamssvg /> <Jirasvg /></div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full  h-auto relative flex flex-col overflow-visible items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 pb-24  justify-start">
          <div className="w-full flex flex-col items-start justify-center relative ">
          <div className="flex rounded-md items-center absolute -top-10 justify-center bg-gradient-to-tr linedgrid w-[100%] h-96 z-50" />
            <div className="absolute -top-0 flex rounded-md items-center  justify-center bg-gradient-to-tr from-red-400 to-red-500 w-full h-20 backdrop-blur-3xl blur-[8rem] z-40" />
              <div className="px-4 py-2 rounded-full flex flex-row gap-2 items-center z-40 justify-center bg-red-500/10 text-red-500 backdrop-blur-md">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              <p className="text-md font-semibold text-red-500 capitalize ">INCIDENT RESPONSE</p>
              </div>
              <h1 className="text-5xl z-50 my-9 overflow-visible line-clamp-6 leading-normal font-semibold text-white textgradientmovetransitionincident">
                Get the right people where they need to be.
              </h1>
            </div>
            <div className="flex mt-8 justify-between flex-col gap-5 w-full">
              <div className="md:grid flex flex-col md:grid-cols-2 grid-rows-2 gap-5 h-full w-full">
                <div className="bg-red-500 rounded-xl col-span-1 px-8 py-4 h-64 flex flex-col items-start justify-end">
                  <h2><b>Incident Management</b> with TrackIt – Instantly alert the right team members when an incident occurs.</h2>
                </div>
                <div className="bg-red-500 rounded-xl rounded-l-3xl col-span-1 row-span-2 px-8 py-4 h-full flex flex-col items-start justify-end">
                <h2><b>Incident Reporting</b> – Track incidents and generate reports to help prevent future incidents.</h2>
                </div>
                <div className="bg-red-500 rounded-xl col-span-1 px-8 py-4 h-64 flex flex-col items-start justify-end">
                  <h2><b>Customizable Alerts</b> – Customize alerts to ensure the right team members are notified every time.</h2>
                </div>
                <div className="relative h-auto w-full overflow-visible rounded-xl">
                  <div id="incidentcarousel" className="relative flex w-full gap-4 mt-20 h-full transition-all overflow-visible">
                    {
                      incidentcarousel.map((item, index) => (
                      <div key={index} className="flex-shrink-0 w-full h-full">
                        <div className="flex flex-col items-start justify-start w-full h-full">
                        <div className="w-full h-full flex flex-col items-start justify-start">
                          <div className="flex mt-8 justify-between flex-col gap-5 rounded-xl overflow-hidden px-6 py-4 w-full bg-red-500 relative h-[40rem] max-h-[40rem]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-red-700 to-red-900 z-10"></div>
                            <div className="flex flex-col items-start gap-3 z-20 justify-start">
                            <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                            <p className="text-md text-white/80">{item.description}</p>
                            </div>
                          </div>
                        </div>
                        </div>
                      </div>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 z-50">
                <button onClick={() => scrollIncidentCarousel(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button onClick={() => scrollIncidentCarousel(1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="text-foreground items-end justify-end flex flex-row gap-5 w-full">
                <p className="font-medium relative after:h-[80%] after:w-[1px] after:bg-foreground after:absolute after:left-full after:top-[10%] after:ml-2">Replaces</p> <div className="flex flex-row fill-white gap-2"><PagerDutysvg /> <IncidentIO /></div>
              </div>         
              </div>
            </div>
        </section>
        <section className="w-full h-auto relative flex flex-col items-center justify-start ">
          <div className="flex container mx-auto flex-col items-center mt-24 pb-24 justify-start">
            <div className="w-full flex flex-col items-center justify-center relative ">
            <div className="flex rounded-md items-center absolute -top-10 justify-center bg-gradient-to-tr linedgrid w-[81%] h-full z-50" />
              <div className="absolute -top-0 flex rounded-md items-center  justify-center bg-gradient-to-tr from-green-400 to-green-500 w-full h-20 backdrop-blur-3xl blur-[8rem] z-40">
              </div>
                <div className="px-4 py-2 rounded-full flex flex-row gap-2 items-center z-40 justify-center bg-green-500/10 text-green-500 backdrop-blur-md">
                <Columns3Icon className="h-5 w-5 text-green-500" />
                <p className="text-md font-semibold text-green-500 capitalize ">STATUS PAGE</p>
                </div>
                <h1 className="text-5xl z-50 my-9 overflow-visible line-clamp-6 text-center leading-normal font-semibold text-white">
                Keep everyone up to date with <br /> TrackIt’s Status Page.
                </h1>
              </div>
            <div className="flex items-center z-50 flex-col w-full rounded-md p-4 mt-8">
              <div className="items-center flex flex-col w-full gap-2">
                <div className="bg-red-500 ring-4 ring-red-300/40 rounded-full w-9 h-9 items-center justify-center flex">
                  <Minus className="h-9 w-9 text-black" />
                </div>
                <div className="flex flex-col items-center justify-center mb-5">
                  <h2 className="text-2xl font-semibold text-white">Partial Outage</h2>
                  <p className="text-sm text-muted-foreground">Last updated: {new Date(Date.now() - 5 * 60 * 1000).toLocaleString([], { hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                </div>
                <div className="border-muted-foreground/20 gap-2 flex flex-col lg:w-1/2 w-full mx-auto rounded-lg border bg-white/10 p-3">
                  <DropDownZone title="Supertime" issue="Partial Outage" projectUrl="supertime.com" />
                  <DropDownZone title="Hdev Site" projectUrl="hdev.uk"  />
                  <DropDownZone title="Securesite" projectUrl="securesite.uk"  issue="Degraded Performance" />
                </div>
              </div>
              <div className="flex flex-col items-center mt-20 justify-center w-full gap-5">
              <div className="md:grid flex flex-col relative md:grid-cols-2 grid-rows-2 h-fullw-full">
                <div className="bg-green-500/80 rounded-xl col-span-1 px-8 mr-5 py-4 h-64 flex flex-col items-start justify-end">
                  <h2><b>Real-Time Status</b> with TrackIt – Keep everyone up to date with TrackIt’s Status Page.</h2>
                </div>
                <div className="bg-green-500/80 rounded-xl rounded-l-3xl rounded-bl-none col-span-1 row-span-2 px-8 py-4 h-full flex flex-col items-start justify-end">
                  <h2><b>Instant Notifications</b> – Get instant notifications when an incident occurs.</h2>
                </div>
                <div className="bg-green-500/80 relative rounded-xl rounded-r-none col-span-1 mt-2.5 px-8 py-4 h-64 flex flex-col items-start justify-end">
                    <div className="right-0 invertedcorner">
                    </div>
                  <h2><b>Secure Access</b> – Access to your data is secure and protected.</h2>
                </div>
              </div>
              </div>
              <div className="text-foreground z-50 mt-10 items-end justify-end flex flex-row gap-5 w-full">
                <p className="font-medium relative after:h-[80%] after:w-[1px] after:bg-foreground after:absolute after:left-full after:top-[10%] after:ml-2">Replaces</p> <div className="flex flex-row fill-white gap-2"><StatusPage /></div>
              </div>   
            </div>
          </div>         
        </section>   
        <section className="w-full  h-auto relative flex flex-col mt-24 pb-24 items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 justify-start">
            <div className="w-full flex flex-col items-center justify-center relative">
            <div className="flex rounded-md items-center absolute -top-10 justify-center bg-gradient-to-tr linedgrid w-[100%] h-96 z-50" />
              <div className="absolute top-12 flex rounded-md items-center justify-center bg-gradient-to-tr from-purple-400 to-purple-400 w-full h-20 backdrop-blur-3xl blur-[8rem] z-40" />
              <div className="px-4 py-2 rounded-full flex flex-row gap-2 items-center z-50 justify-center bg-purple-500/10 text-purple-500 backdrop-blur-md">
              <Hand className="h-5 w-5 text-purple-500" />
              <p className="text-md font-semibold text-purple-500 capitalize">SUPPORT</p>
              </div>
              <h1 className="text-6xl font-medium text-white my-9 backdrop-blur-md z-40">Support your customers with TrackIt.</h1>
            </div>
            <div className="relative h-auto w-full overflow-visible rounded-xl">
              <div id="supportcarousel" className="relative flex w-full gap-4 mt-20 h-full transition-all overflow-visible">
                {
                  supportcarousel.map((item, index) => (
                  <div key={index} className="flex-shrink-0 md:w-1/2 w-full h-full">
                    <div className="flex flex-col items-start justify-start w-full h-full">
                    <div className="w-full h-full flex flex-col items-start justify-start">
                      <div className="flex mt-8 justify-between flex-col gap-5 rounded-xl overflow-hidden px-6 py-4 w-full bg-purple-500 relative h-[40rem] max-h-[40rem]">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-700 to-purple-900 z-10"></div>
                        <div className="flex flex-col items-start gap-3 z-20 justify-start">
                        <h2 className="text-2xl font-semibold text-white">{item.title}</h2>
                        <p className="text-md text-white/80">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  ))
                }
              </div>
            </div>
            <div className="flex flex-row gap-2 mt-4 z-50">
              <button onClick={() => scrollSupportCarousel(-1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button onClick={() => scrollSupportCarousel(1)} className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 ease-in-out">
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </section>
        <section className="w-full  h-auto relative flex flex-col mt-24 pb-24 items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 justify-start">
            <div className="w-full flex flex-col items-center justify-center relative">
            <div className="flex rounded-md items-center absolute -top-10 justify-center bg-gradient-to-tr linedgrid w-[100%] h-96 z-50" />
              <div className="absolute top-12 flex rounded-md items-center justify-center bg-gradient-to-tr from-blue-400 to-blue-400 w-full h-20 backdrop-blur-3xl blur-[8rem] z-40" />
              <div className="px-4 py-2 rounded-full flex flex-row gap-2 items-center z-50 justify-center bg-blue-500/10 text-blue-500 backdrop-blur-md">
              <FileLock className="h-5 w-5 text-blue-500" />
              <p className="text-md font-semibold text-blue-500 capitalize">SECURITY</p>
              </div>
              <h1 className="text-6xl font-medium text-white my-9 backdrop-blur-md flex flex-row text-wrap flex-wrap items-end z-40">Keeping <img src="/trackitlogo/light/logo.png" alt="TrackIt" className="w-[70px] h-[70px] ml-2 -mr-1" /> rack of Security.</h1>
            </div>
            <div className="relative h-auto w-full overflow-visible rounded-xl">
            <div className="flex mt-8 justify-between flex-col gap-5 w-full">
              <div className="md:grid flex flex-col md:grid-cols-3 grid-rows-2 gap-5 w-full">
                <div className="bg-[#222831] rounded-xl col-span-2 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                  <h2><b>Secure Data Storage</b> with TrackIt – Your data is stored securely on our servers. a</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-1 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                  <h2><b>Encrypted Data</b> – Your data is encrypted to ensure it remains secure.</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-1 row-span-1 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                    <h2><b>Regular Backups</b> – Your data is backed up regularly to prevent data loss.</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-2 row-span-2 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                  <h2><b>Secure Access</b> – Access to your data is secure and protected.</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>
      <div className="mt-16 w-full h-auto relative flex flex-col items-center justify-start">
        <Jointoday />
      </div>
      </main>
      <Footer />
    </>
  );
}

type Status = "Operational" | "Degraded Performance" | "Partial Outage" | "Major Outage"

interface DropDownZoneProps {
  title: string
  issue?: Status
  status?: string
  time?: string
  projectUrl?: string
}

const statusConfig: Record<Status, { color: string; icon: React.ReactNode }> = {
  Operational: { color: "bg-green-500", icon: <CheckIcon className="h-4 w-4 text-black" /> },
  "Degraded Performance": { color: "bg-yellow-500", icon: <MinusIcon className="h-5 w-5 text-black" /> },
  "Partial Outage": { color: "bg-red-500", icon: <MinusIcon className="h-5 w-5 text-black" /> },
  "Major Outage": { color: "bg-red-900", icon: <AlertOctagon className="h-5 w-5 text-red-300" /> },
}

function DropDownZone({ title, issue = "Operational", status, time, projectUrl }: DropDownZoneProps) {
  const [open, setOpen] = useState(false)

  const { color, icon } = statusConfig[issue]

  const toggleOpen = () => setOpen(!open)

  // check if a status- has been hovered over

  useEffect(() => {
    if (open) {
      const status = document.getElementById(`status-${89}`)
      if (status) {
        status.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [open])

  return (
  <div className="relative">

    <div className="flex flex-col items-start justify-start bg-muted-foreground/10 rounded-lg overflow-hidden">
      <button
        onClick={toggleOpen}
        className="flex w-full cursor-pointer hover:bg-muted-foreground/20 transition-all py-5 px-3 items-center justify-between gap-2"
        aria-expanded={open}
        aria-controls="dropdown-content"
      >
        <span className="text-sm text-gray-800 dark:text-gray-200">{title}</span>
        <div className="flex items-center gap-2">
          <div className={`${color} rounded-full w-5 h-5 flex items-center justify-center`}>{icon}</div>
          <span className="text-sm text-gray-800 dark:text-gray-200 whitespace-nowrap">{issue}</span>
          <div className="p-0.5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <ChevronDown
              className={`h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>
      <div
        id="dropdown-content"
        className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[500px]" : "max-h-0"}`}
      >
        <div className="p-3 flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <div className={`${color} rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}>{icon}</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{projectUrl}</p>
          </div>
          <div className="flex gap-[1px] relative">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                id={`status-${i}`}
                className={`w-3 h-10 ${i === 89 ? color : "bg-green-500"} rounded-xs first:rounded-l-md last:rounded-r-md relative group`}
              >
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

const Teamssvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
    <path d="M 27.5 5 C 24.08 5 21.269531 7.64 21.019531 11 L 24 11 C 26.76 11 29 13.24 29 16 L 29 17.820312 C 31.87 17.150312 34 14.57 34 11.5 C 34 7.91 31.09 5 27.5 5 z M 42.5 9 A 4.5 4.5 0 0 0 42.5 18 A 4.5 4.5 0 0 0 42.5 9 z M 6 13 C 4.346 13 3 14.346 3 16 L 3 34 C 3 35.654 4.346 37 6 37 L 24 37 C 25.654 37 27 35.654 27 34 L 27 16 C 27 14.346 25.654 13 24 13 L 6 13 z M 10 19 L 20 19 L 20 21 L 16 21 L 16 31 L 14 31 L 14 21 L 10 21 L 10 19 z M 29 21 L 29 34 C 29 36.76 26.76 39 24 39 L 18.199219 39 C 18.599219 40.96 19.569688 42.710313 20.929688 44.070312 C 22.739688 45.880312 25.24 47 28 47 C 33.52 47 38 42.52 38 37 L 38 21 L 29 21 z M 40 21 L 40 37 C 40 37.82 39.919531 38.620625 39.769531 39.390625 C 40.599531 39.780625 41.52 40 42.5 40 C 46.09 40 49 37.09 49 33.5 L 49 21 L 40 21 z"></path>
  </svg>
)
const Zendesksvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
    <path d="M23.33594 17.05859a.99437.99437 0 00-1.11035.3086l-18 22A1.00015 1.00015 0 005 41H23a.99943.99943 0 001-1V18A.99858.99858 0 0023.33594 17.05859zM23 8H5A.99943.99943 0 004 9 10 10 0 0024 9 .99943.99943 0 0023 8zM26.66406 31.94141A.97779.97779 0 0027 32a1.00043 1.00043 0 00.77441-.36719l18-22A1.00015 1.00015 0 0045 8H27a.99943.99943 0 00-1 1V31A.99859.99859 0 0026.66406 31.94141zM36 30A10.01177 10.01177 0 0026 40a.99943.99943 0 001 1H45a.99943.99943 0 001-1A10.01177 10.01177 0 0036 30z"></path>
  </svg>
)
const Jirasvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 44.169 45.988">
    <path d="M 21.955078 0 A 1.029 1.029 0 0 0 21.292969 0.28125 A 11.988 11.988 0 0 0 18 7.9882812 A 11.982 11.982 0 0 0 21.292969 15.699219 L 22.169922 16.578125 L 23.5 17.900391 L 28.585938 22.986328 L 23.5 28.074219 L 24.292969 28.867188 A 13.886 13.886 0 0 1 28.171875 37.988281 A 11.481 11.481 0 0 1 27.880859 40.521484 L 43.292969 25.109375 A 3 3 0 0 0 43.292969 20.867188 L 22.705078 0.28125 A 1.029 1.029 0 0 0 21.955078 0 z M 16.289062 5.4550781 L 0.87695312 20.867188 A 3 3 0 0 0 0.87695312 25.109375 L 21.462891 45.699219 A 1 1 0 0 0 22.876953 45.699219 A 11.982 11.982 0 0 0 26.169922 37.992188 A 11.988 11.988 0 0 0 22.876953 30.285156 L 15.583984 22.988281 L 20.669922 17.900391 L 19.876953 17.107422 A 13.877 13.877 0 0 1 16 7.9882812 A 11.478 11.478 0 0 1 16.289062 5.4550781 z"></path>
  </svg>
)
const PagerDutysvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="25px" height="25px" viewBox="0 0 24 24" role="img"><path d="M16.965 1.18C15.085.164 13.769 0 10.683 0H3.73v14.55h6.926c2.743 0 4.8-.164 6.61-1.37 1.975-1.303 3.004-3.484 3.004-6.007 0-2.716-1.262-4.896-3.305-5.994zm-5.5 10.326h-4.21V3.113l3.977-.027c3.62-.028 5.43 1.234 5.43 4.128 0 3.113-2.248 4.292-5.197 4.292zM3.73 17.61h3.525V24H3.73Z"/></svg>
)
const IncidentIO = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 0H0V25H25V0Z"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M10.9633 21.1945V18.8537H14.0446V21.214C16.878 20.615 18.9628 18.226 18.9628 15.1445C18.9628 12.617 17.198 9.30656 15.1214 8.15707C15.3981 9.167 14.9642 10.4786 14.4098 10.3498C14.1757 10.297 14.1538 9.92234 14.1175 9.22997C14.0482 8.105 13.9354 6.00856 11.9894 3.875C11.8117 5.34125 9.45163 8.18014 7.951 10.2613C7.76463 10.5025 7.58884 10.7286 7.429 10.9415C6.60816 11.9643 6.00759 13.4423 6.00759 15.1445C6.00759 18.315 8.07355 20.4893 10.9633 21.1945ZM14.2564 16.2234C14.2564 17.198 13.426 18.0284 12.4514 18.0284C11.4768 18.0284 10.6464 17.198 10.6464 16.2234C10.6464 15.857 10.792 15.5249 11.0161 15.1801C11.0653 15.1088 11.123 15.0341 11.1898 14.9589L11.1899 14.9588C11.5982 14.426 12.283 13.536 12.3279 13.0903C13.6064 13.977 14.2564 15.4351 14.2564 16.2234Z" fill="white"/>
  </svg>
)

const StatusPage = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32" fill="none">
<path d="M15.9914 25C19.0901 25 21.6022 22.4421 21.6022 19.2868C21.6022 16.1315 19.0901 13.5736 15.9914 13.5736C12.8926 13.5736 10.3806 16.1315 10.3806 19.2868C10.3806 22.4421 12.8926 25 15.9914 25Z" fill="url(#paint0_linear)"/>
<path d="M4.16144 12.6444L7.20346 16.2926C7.44006 16.5679 7.8457 16.6023 8.0823 16.3614C12.9833 11.8872 19.0335 11.8872 23.9346 16.3614C24.205 16.6023 24.6106 16.5679 24.8134 16.2926C25.557 15.3977 27.1118 13.5048 27.8554 12.6444C28.0582 12.369 28.0582 11.9905 27.7878 11.7495C20.6898 5.41682 11.2933 5.41682 4.19527 11.7495C3.95867 11.9905 3.92484 12.4035 4.16144 12.6444Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear" x1="16.0065" y1="12.6405" x2="16.0065" y2="21.3602" gradientUnits="userSpaceOnUse">
<stop stopColor="white" stopOpacity="0.4"/>
<stop offset="1" stopColor="white"/>
</linearGradient>
</defs>
</svg>
)