import Button from "@/components/button/button"
import Header from "@/components/header/header"

export default function Premium() {
  return (
    <>
      <Header />
      <div className="bg-gradient-to-tl from-cyan-900/80 to-cyan-900/20 w-full min-h-screen overflow-y-auto changedscrollbar">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center w-full mt-10 mb-8">
            <div className="flex flex-col gap-2 w-full items-center justify-center">
              <img src="/trackitlogo/light/logo.png" alt="TrackIt Logo" className="h-20 w-auto mb-4" />
              <h1 className="text-4xl font-normal tracking-widest font-Funnel_Sansfont text-white">PREMIUM</h1>
            </div>

            <div className="border bg-gradient-to-br from-cyan-900/90 to-cyan-900/30 border-cyan-400 shadow-lg shadow-cyan-400/30 rounded-lg font-Funnel_Sansfont px-8 py-10 mt-12 w-full max-w-4xl backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl font-medium text-white mb-4">
                    Try TrackIt <span className="text-cyan-400 font-semibold">Premium</span> Today!
                  </h2>
                  <div className="text-white/80 text-sm leading-relaxed mb-6">
                    <p>Elevate your space with the complete TrackIt experience, featuring:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Unlimited status pages</li>
                      <li>Expanded team collaboration</li>
                      <li>Premium profile badge</li>
                      <li>Role-Based Access Control (RBAC)</li>
                      <li>On-call phone applications</li>
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <Button variant="primary" className="w-full md:w-auto px-8 py-3 text-lg">
                    <p>Get Premium Free</p>
                  </Button>
                  <p className="text-xs text-cyan-300/70 mt-2 text-center">
                    14-day free trial, no credit card required
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-light tracking-widest font-Funnel_Sansfont text-white mt-16 mb-10">
              Premium Features
            </h2>

            <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
              <PremiumFeature
                title="Unlimited Status Pages"
                description="Create as many status pages as you need to keep your users informed about your services."
                icon="/trackitlogo/light/icons/unlimitedstatuspages.png"
              />
              <PremiumFeature
                title="Team Collaboration"
                description="Invite unlimited team members to collaborate on your status pages and incidents."
                icon="/trackitlogo/light/icons/team.png"
              />
              <PremiumFeature
                title="Premium Badge"
                description="Show off your premium status with a special badge on your profile and status pages."
                icon="/trackitlogo/light/icons/badge.png"
              />
              <PremiumFeature
                title="Advanced Analytics"
                description="Get detailed insights into your incidents, uptime, and user engagement."
                icon="/trackitlogo/light/icons/analytics.png"
              />
              <PremiumFeature
                title="Role-Based Access"
                description="Control who can view, edit, and manage your status pages with granular permissions."
                icon="/trackitlogo/light/icons/roles.png"
              />
              <PremiumFeature
                title="Mobile Applications"
                description="Manage incidents and receive alerts on-the-go with our dedicated mobile apps."
                icon="/trackitlogo/light/icons/mobile.png"
              />
            </div>

            <div className="mt-16 mb-10 w-full max-w-4xl">
              <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 border border-cyan-400/30 rounded-lg p-6 text-center">
                <h3 className="text-xl font-medium text-white mb-4">Ready to upgrade your experience?</h3>
                <Button variant="primary" className="px-8 py-3">
                  <p>Upgrade to Premium</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function PremiumFeature({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-start bg-[#255566] border-2 border-[#13131d]/70 hover:border-cyan-400/30 transition-all duration-300 rounded-lg font-Funnel_Sansfont p-6 h-full group">      <div className="p-4 rounded-full mb-4 group-hover:shadow-md transition-all duration-300">
        <img src={icon || "/placeholder.svg"} alt={`${title} Icon`} className="h-12 w-12 object-contain" />
      </div>
      <h3 className="text-lg font-medium text-white mb-3 text-start">{title}</h3>
      <p className="text-sm text-white/70 text-start">{description}</p>
    </div>
  )
}
