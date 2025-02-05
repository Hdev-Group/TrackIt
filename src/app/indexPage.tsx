"use client"
import { motion } from "framer-motion"
import Header from "@/components/header/header";
import Button from "@/components/button/button";
import { ArrowRightIcon} from "lucide-react";
import Footer from "@/components/footer/footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-col bg-[#101218] items-center relative justify-center min-h-screen pb-2">
      <Header />
        <div className="flex flex-col items-start justify-start w-full h-full">
          <section className="container mx-auto h-auto relative flex mt-24 flex-col items-start justify-start">
            <div className="relative flex flex-col items-start justify-start">
              <div className="w-[10rem]  z-40 py-1 rounded-full flex items-start justify-start">
                <img src="/trackitlogo/light/logo.png" alt="TrackIt" className="w-10 h-10" />
              </div>
              <div className="text-6xl flex flex-col font-semibold text-transparent leading-tight  z-20 bg-clip-text textgradientmovetransition">
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
              animate={{height: "90rem", top: "-50rem"}}
              transition={{delay: 0.5, duration: 1, ease: "easeOut"}}
              />
            </div>
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
        <section className="w-full bg-neutral-100 h-auto relative flex flex-col mt-24 pb-24 items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 justify-start">
            <h1 className="text-7xl font-semibold text-black ">Next-level productivity</h1>
            <p className="text-md w-[50%] text-black mt-2">
              TrackIt is a support, team and project management platform that provides seamless collaboration for your team.
            </p>
            <div className="flex mt-8 justify-between flex-col gap-5 w-full">
              <div className="md:grid flex flex-col md:grid-cols-3 gap-5 w-full">
                <div className="bg-muted rounded-xl col-span-1 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out px-8 py-4 h-96 flex flex-col items-start justify-end">
                  <h2><b>Effortless Support Tickets</b> with TrackIt – Experience real-time, instant collaboration on every ticket.</h2>
                </div>
                <div className="bg-muted rounded-xl col-span-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out px-8 py-4 h-96 flex flex-col items-start justify-end">
                  <h2><b>Simplified Shift Management</b> – Seamlessly organize and manage shifts with TrackIt.</h2>
                </div>
                <div className="bg-muted rounded-xl col-span-2 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out px-8 py-4 h-96 flex flex-col items-start justify-end">
                  <h2><b>Seamless Team Management</b> – Keep your team organized and running smoothly with TrackIt.</h2>
                </div>
                <div className="bg-muted rounded-xl col-span-1 hover:shadow-lg hover:shadow-black transition-all duration-300 ease-in-out px-8 py-4 h-96 flex flex-col items-start justify-end">
                  <h2><b>Streamlined Project Management</b> – Plan, track, and execute projects effortlessly with TrackIt.</h2>
                </div>
              </div>
              <div className="text-background/70 items-end justify-end flex flex-row gap-5 w-full">
                <p className="font-medium relative after:h-[80%] after:w-[1px] after:bg-black/70 after:absolute after:left-full after:top-[10%] after:ml-2">Replaces</p> <div className="flex flex-row gap-2"><Zendesksvg /> <Teamssvg /> <Jirasvg /></div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-black h-auto relative flex flex-col items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 pb-24 justify-start">
          <h1 className="text-7xl font-semibold text-white textgradientmovetransitionincident">
            Instantly Notify the Right Team, <br/> Every Time.
          </h1>
          <p className="text-md text-white/80 mt-2">
            TrackIt’s incident management system ensures your team is immediately alerted, so the right people can respond when an incident occurs.
          </p>
          <div className="flex mt-8 justify-between flex-col gap-5 w-full">
            <div className="md:grid flex flex-col md:grid-cols-3 gap-5 w-full">
              <div className="bg-[#222831] rounded-xl col-span-2 px-8 py-4 h-96 flex flex-col items-start justify-end">
                <h2><b>Incident Management</b> with TrackIt – Instantly alert the right team members when an incident occurs.</h2>
              </div>
              <div className="bg-[#222831] rounded-xl col-span-1 px-8 py-4 h-96 flex flex-col items-start justify-end">
                <h2><b>Real-Time Collaboration</b> – Collaborate in real-time with your team to resolve incidents faster.</h2>
              </div>
              <div className="bg-[#222831] rounded-xl col-span-1 px-8 py-4 h-96 flex flex-col items-start justify-end">
                <h2><b>Customizable Alerts</b> – Customize alerts to ensure the right team members are notified every time.</h2>
              </div>
              <div className="bg-[#222831] rounded-xl col-span-2 px-8 py-4 h-96 flex flex-col items-start justify-end">
                <h2><b>Incident Reporting</b> – Track incidents and generate reports to help prevent future incidents.</h2>
              </div>
            </div>
            <div className="text-foreground items-end justify-end flex flex-row gap-5 w-full">
                <p className="font-medium relative after:h-[80%] after:w-[1px] after:bg-foreground after:absolute after:left-full after:top-[10%] after:ml-2">Replaces</p> <div className="flex flex-row fill-white gap-2"><PagerDutysvg /> <IncidentIO /></div>
              </div>            
            </div>
          </div>
        </section>
        <section className="w-full bg-black/50 h-auto relative flex flex-col items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 pb-24 justify-start">
            <h1 className="text-7xl font-medium text-white">
              GitHub Sync. <br /> With TrackIt.
            </h1>
            <p className="text-md text-white/80 mt-2">Manage your codebase and projects with TrackIt’s GitHub integration.</p>
            <div className="flex mt-8 justify-between gap-5 w-full">
              <img src="/trackitindeximages/githubsync.png" alt="TrackIt" className="rounded-md bg-white h-[40rem] max-h-[40rem] w-full z-40 " />
            </div>
          </div>
        </section>
        <section className="w-full h-auto relative flex flex-col items-center justify-start">
          <div className="flex container mx-auto flex-col items-start mt-24 pb-24 justify-start">
            <h1 className="text-7xl flex flex-row font-semibold text-white">
              Keeping <img src="/trackitlogo/light/logo.png" alt="TrackIt" className="w-[70px] h-[70px] ml-2 -mr-1" /> rack of Security.
            </h1>
            <p className="text-md text-white/80 mt-2">TrackIt’s security features ensure your data is safe and secure.</p>
            <div className="flex mt-8 justify-between flex-col gap-5 w-full">
              <div className="md:grid flex flex-col md:grid-cols-3 gap-5 w-full">
                <div className="bg-[#222831] rounded-xl col-span-2 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                  <h2><b>Secure Data Storage</b> with TrackIt – Your data is stored securely on our servers. a</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-1 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                  <h2><b>Encrypted Data</b> – Your data is encrypted to ensure it remains secure.</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-1 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                    <h2><b>Regular Backups</b> – Your data is backed up regularly to prevent data loss.</h2>
                </div>
                <div className="bg-[#222831] rounded-xl col-span-2 px-8 py-4 h-96 relative flex flex-col group items-start justify-end">
                  <div className="absolute group-hover:h-32 transition-all h-10 w-2 bg-white/20 group-hover:bg-cyan-300 top-10 rounded-r-lg left-0" />
                    <h2><b>Secure Access</b> – Access to your data is secure and protected.</h2>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </main>
      <Footer />
    </>
  );
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