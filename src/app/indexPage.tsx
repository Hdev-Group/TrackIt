"use client"
import { motion } from "framer-motion"
import Header from "@/components/header/header";
import Button from "@/components/button/button";

export default function Home() {
        

  return (
    <>
      <Header />
      <main className="flex flex-col bg-[#101218] items-center relative justify-center min-h-screen py-2">
        <motion.div className="h-[30rem] z-20 w-[10rem] border-[#0099ff]  border-4 rounded-r-3xl hidden xl:flex  items-center justify-start absolute top-36 -left-1"
          initial={{ opacity: 0, left: -100 }}
          animate={{ opacity: 1, left: -4 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div className="h-[20rem] w-1/2 border-[#0099ff] border-4 border-l-0 flex items-center  rounded-r-3xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          >
          </motion.div>
        </motion.div>
        <motion.div className="h-[30rem] z-20 w-[10rem] border-[#0099ff] border-4 border-r-0  hidden xl:flex rounded-l-3xl items-center justify-end absolute top-36 -right-1"
          initial={{ opacity: 0, right: -100 }}
          animate={{ opacity: 1, right: -4 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div className="h-[20rem] w-1/2 border-[#0099ff] border-4 border-r-0 items-center flex justify-end rounded-l-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          >
          </motion.div>
        </motion.div>
        <div className="flex flex-col items-start justify-start gap-72 w-full h-full">
        <section className="container mx-auto h-auto relative flex flex-col items-center justify-start">
          <div className="relative flex flex-col items-center justify-center">
            <div className="text-6xl leading-normal flex flex-row font-semibold text-transparent pt-80 z-20 bg-clip-text textgradientmovetransition">
            Making Ticketing Simpler With TrackIt
            </div>
            <p className="mt-4 text-xl text-gray-400  z-20 ">
                TrackIt makes it simple for every step of the ticketing process for your business or project.
            </p>
            <div className="flex mt-8 justify-between z-20 gap-5 w-full">
                <Button variant="slide-fill" className="w-full flex items-center justify-center" type="button" href="/auth/signin">
                    TRY TEAMMATE FOR FREE
                </Button>
                <Button variant='ghost-side-fill' className="w-1/3 flex items-center justify-center" href="/features">
                    Learn More
                </Button>
            </div>
            <div className="absolute top-0 flex rounded-xl items-center justify-center -left-28 -rotate-45 h-[40rem] bg-gradient-to-t from-[#0099ff]/35 to-cyan-500/30 blur-[4rem] backdrop-blur-md z-10 w-44 transform-gpu skew-y-12" />
            <div className="absolute top-0 flex rounded-xl items-center justify-center -right-28 rotate-45 h-[40rem] bg-gradient-to-t from-[#0099ff]/35 to-cyan-500/30 blur-[4rem] backdrop-blur-md z-10 w-44 transform-gpu skew-y-12" />
          </div>
        </section>
        <section className="container mx-auto h-auto relative flex flex-col items-center justify-start">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="bg-gradient-to-r movegradient w-full h-4 z-0 flex items-center justify-center backdrop-blur-md blur-[3rem]"/>
            <div className="w-full h-auto bg-background rounded-2xl z-10 flex flex-col items-start justify-start">
              <div className="w-full items-center justify-between flex px-3 flex-row pt-1">
                <div className=" h-10 justify-start gap-1 flex items-center">
                  <div className="w-3 h-3 bg-red-500 hover:bg-red-600 transition-all rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 transition-all rounded-full" />
                  <div className="w-3 h-3 bg-green-500 hover:bg-green-600 transition-all rounded-full" />
                </div>
                <div className="flex flex-row items-center w-full justify-center">
                  <div className="px-4 text-muted-foreground text-sm z-50 bg-white/5 flex items-center justify-center rounded-lg">
                    <p className="">https://trackit.hdev.uk</p>
                  </div>
                </div>
                <div className=""></div>
              </div>
              <div className="w-full border-hidden">
                <img src="https://i.pinimg.com/originals/dd/5a/6b/dd5a6bebdb5854f9d988abd62ec8e121.jpg" alt="img" className="w-full rounded-b-lg border-hidden h-auto" />
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto h-auto relative flex flex-col items-center justify-start">
          
        </section>
      </div>
      </main>
    </>
  );
}
