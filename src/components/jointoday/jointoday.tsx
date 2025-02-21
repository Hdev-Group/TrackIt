import Button from "../button/button";

export default function Jointoday() {
    return(
        <div className="mx-auto w-full h-80 bg-gradient-to-br container from-cyan-600 to-cyan-500 rounded-xl z-50 flex flex-col items-center justify-center gap-8 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-50">
            <div className="absolute inset-0 bg-gradient-radial from-cyan-400/50 to-transparent rounded-full blur-3xl animate-slow-spin" />
            <div className="absolute inset-0 bg-gradient-radial from-cyan-300/30 to-transparent rounded-full blur-2xl -rotate-45 animate-slow-spin-reverse" />
          </div>
        </div>
  
        <h2 className="text-[55px] font-semibold text-center relative">Make your SaaS Powerful.</h2>
        <div className="flex gap-4 relative flex-col md:flex-row w-full mx-auto items-center justify-center container px-5 text-lg">
          <Button variant='simple' className="text-cyan-500 hover:bg-gray-800 md:w-auto w-full border-4 border-white hover:border-gray-800 bg-white ">
            Start for free
          </Button>
          <Button variant="outline" className="text-white !border-white border-2 md:w-auto w-full hover:text-cyan-500  hover:bg-white">
            Learn more
          </Button>
        </div>
      </div>
    )
}