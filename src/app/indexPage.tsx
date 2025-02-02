"use client"
import { motion } from "framer-motion"
import Header from "@/components/header/header";
import Button from "@/components/button/button";
import { ArrowRightIcon} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col bg-[#101218] items-center relative justify-center min-h-screen py-2">
        <div className="flex flex-col items-start justify-start gap-24 w-full h-full">
        <section className="container mx-auto h-auto relative flex flex-col items-start justify-start">
          <div className="relative flex flex-col items-start justify-start">
            <div className="text-6xl flex flex-col font-semibold text-transparent leading-tight pt-64 z-20 bg-clip-text textgradientmovetransition">
              <p>Making SaaS</p><p>Simpler With TrackIt</p>
            </div>
            <p className="text-md w-[34rem] text-white  z-20 ">
              TrackIt, an all-in-one platform for start-ups to manage their teams, support requests, shifts and projects.
            </p>
            <div className="flex mt-8 justify-between z-20 gap-5 w-full">
                <Button variant="slide-fill" className="w-1/3 !rounded-full flex flex-row items-center justify-center" type="button" href="/auth/signin">
                    <span className="flex flex-row gap-1 items-center justify-center">
                      TRY IT FREE <ArrowRightIcon className="h-4" />
                    </span>
                </Button>
            </div>
            <motion.div 
            className="absolute top-0 flex rounded-xl items-center justify-center -left-32 -rotate-45 h-[40rem] bg-gradient-to-t from-[#0099ff]/35 to-cyan-500/30 blur-[4rem] backdrop-blur-md z-10 w-44 transform-gpu skew-y-12" 
            initial={{height: "0rem", top: "0rem"}}
            animate={{height: "40rem", top: "0rem"}}
            transition={{delay: 0.5, duration: 1, ease: "easeOut"}}
            />
          </div>
        </section>
        <section className="container mx-auto h-auto relative flex flex-col items-center justify-start">
          <div className="flex flex-col items-start justify-start w-full">
            <div className="bg-gradient-to-r w-full h-4 z-0 flex items-start justify-start backdrop-blur-md blur-[3rem]"/>
            <div className="spinnercard borderspincard h-[40rem] w-auto rounded-2xl z-10  flex flex-col outerzoomer items-start justify-start">
              <div className="inner h-[40rem] w-auto">
                <img src="/trackitindeximages/dashboard.png" alt="TrackIt" className="rounded-md w-auto z-50 h-[40rem]" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-neutral-200/90 h-auto relative flex flex-col mt-24 items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 justify-start">
            <h1 className="text-7xl font-semibold text-black ">Next-level productivity</h1>
            <p className="text-md w-[50%] text-black mt-4">
              TrackIt is a support, team and project management platform that provides seamless collaboration for your team.
            </p>
            <div className="flex mt-8 justify-between gap-5 w-full">
              <div className="flex flex-col items-end justify-end w-1/3">
                <p className="text-md  text-black"><b>Support</b></p>
              </div>
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
