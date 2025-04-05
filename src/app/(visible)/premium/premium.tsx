"use client"

import { useRef, useState } from "react"
import { Check, X, User, Radar, Columns3 } from "lucide-react"
import Header from "@/components/header/header"

export default function Premium() {
  const [billingCycle, setBillingCycle] = useState("month")
  const tableRef = useRef<HTMLDivElement>(null)

  const plans = [
    {
      name: "Free",
      price: billingCycle === "month" ? "0" : "0",
      users: "3",
      statuspages: "1",
      monitors: "5",
      description:
        "For individuals, freelancers, and small teams looking to get started with basic monitoring and team collaboration.",
      features: [
        "Basic Uptime Monitoring (15-minute intervals)",
        "Email Alerts",
        "Community Support",
        "Mobile App Access",
        "On call Alerts",
        "Real-time Team Messaging",
        "Basic Incident History Tracking",
      ],
      popular: false,
      highlight: false,
    },
    {
      name: "Premium",
      price: billingCycle === "month" ? "19.99" : "200",
      users: "Up to 15",
      statuspages: "Unlimited",
      monitors: "Unlimited",
      description:
        "For growing teams and businesses that need advanced tools, deeper insights, and mobile access to manage real-time incidents and communications.",
      features: [
        "Advanced Incident History Tracking",
        "Shift Scheduling & On-Call Alerts",
        "Advanced Analytics and Reports",
        "Granular Role-Based Permissions",
        "Premium Badge",
        "Priority Email Support",
        "Automated Downtime Alerts",
        "Incident History with Filtering",
        "Adavanced Integrations (Slack, Discord, etc.)",
      ],
      popular: true,
      highlight: true,
      cta: "Try Premium",
    },
    {
      name: "Enterprise",
      price: billingCycle === "month" ? "99" : "990",
      users: "15+ (Custom User Limits)",
      statuspages: "Unlimited",
      monitors: "Unlimited",
      description:
        "For large enterprises requiring fully customized solutions, advanced security, and dedicated support to ensure maximum uptime and scalability.",
      features: [
        "Dedicated Onboarding Assistance",
        "Priority Support (Email + Zoom)",
        "Custom Integrations (on request)",
        "Uptime SLAs with Guaranteed Response Times",
        "Custom Domain & Branding",
        "Customizable Reporting and Alerts",
        "Advanced Security Features (2FA, IP Whitelisting)",
        "Dedicated Infrastructure Options",
      ],
      popular: false,
      highlight: true,
      cta: "Contact Sales",
    },
  ]

  const allFeatures = Array.from(new Set(plans.flatMap((plan) => plan.features)))

  return (
    <div className="bg-gradient-to-tl from-cyan-900/80 to-cyan-900/20 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 pt-36 pb-20">
        <div className="flex flex-col items-center justify-center mb-16">
          <img src="/trackitlogo/light/logo.png" alt="TrackIt Logo" className="h-20 w-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-white">Go Premium</h1>
          <p className="text-white/70 text-center mt-4 max-w-xl text-sm md:text-base">
            Unlock everything TrackIt has to offer. From unlimited monitoring and status pages to on-call scheduling and
            real-time team communications.
          </p>
        </div>

        {/* Free Trial Card */}
        <div className="bg-cyan-950/50 border border-cyan-400/30 rounded-2xl shadow-xl shadow-cyan-400/20 px-6 py-8 md:px-10 md:py-12 mb-20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Start Your <span className="text-cyan-400">14-Day Free Trial</span>
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-white/80 text-sm">
                <li>Unlimited status pages & monitors</li>
                <li>Real-time team messaging</li>
                <li>Shift scheduling & on-call alerts</li>
                <li>Advanced analytics and reports</li>
                <li>Granular role-based permissions</li>
              </ul>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <button className="w-full md:w-auto px-10 py-3 text-lg bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors">
                Try Premium
              </button>
              <p className="text-xs text-cyan-300/70 mt-2 text-center">No credit card required</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-light tracking-wider text-white text-center mb-10">What's Included</h2>

          <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            <PremiumFeature
              title="Unlimited Status Pages"
              description="Create as many status pages as your org needs — private or public."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Team Messaging"
              description="Communicate in real-time with your team during incidents and deployments."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="On-Call Scheduling"
              description="Define shifts, assign responders, and automate alerting."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="RBAC & Permissions"
              description="Control who can access or edit each area of your workspace."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Advanced Analytics"
              description="Dive into detailed metrics on incidents, uptime, and team response."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Mobile App Access"
              description="Manage incidents, receive alerts, and chat on-the-go."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Priority Support"
              description="Get faster responses and dedicated support for your team."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Custom Integrations"
              description="Integrate with your favorite tools and platforms."
              icon="/placeholder.svg?height=48&width=48"
            />
            <PremiumFeature
              title="Advanced Security"
              description="Ensure your data is safe with advanced security features."
              icon="/placeholder.svg?height=48&width=48"
            />
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">Choose Your Plan</h2>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-10">
            <div className="bg-cyan-900/30 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setBillingCycle("month")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === "month" ? "bg-cyan-500 text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <div className="relative">
                <button
                  onClick={() => setBillingCycle("year")}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    billingCycle === "year" ? "bg-cyan-500 text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  Yearly
                </button>
                <span className="absolute -top-3 -right-3 bg-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-8 md:hidden">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`overflow-hidden relative rounded-lg ${
                  plan.popular ? "border-2 border-cyan-400 relative" : "border border-cyan-400/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-cyan-500 text-white px-4 py-1 text-xs font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/70 ml-1">{billingCycle === "month" ? "/ month" : "/ year"}</span>
                  </div>
                  <p className="text-sm text-white/70 mb-6">{plan.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <User size={16} className="text-cyan-400" />
                    <span className="text-white">{plan.users} users</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Columns3 size={16} className="text-cyan-400" />
                    <span className="text-white">{plan.statuspages} status pages</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Radar size={16} className="text-cyan-400" />
                    <span className="text-white">{plan.monitors} monitors</span>
                  </div>

                  <h4 className="font-medium text-white mb-2">Features:</h4>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.cta && (
                    <button
                      className={`w-full py-2 px-4 rounded-md transition-colors ${
                        plan.popular
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                          : "bg-transparent border border-cyan-400/50 text-white hover:bg-cyan-900/30"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto" ref={tableRef}>
            <table className="w-full border-collapse">
              <thead className="">
                <tr className="border-b border-cyan-400/30">
                  <th className="w-[250px]text-left p-4 text-white border-cyan-400/30 border-r">Features</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={`p-4 text-left ${plan.popular ? "bg-cyan-900/30" : ""}`}>
                      <div className="relative">
                        {plan.popular && (
                          <span className="absolute top-0 right-0 bg-cyan-500 text-white text-xs px-2 py-1 rounded-md">
                            MOST POPULAR
                          </span>
                        )}
                        <div className="font-bold text-white text-lg">{plan.name}</div>
                        <div className="text-2xl font-bold text-white mt-1">
                          ${plan.price}{" "}
                          <span className="text-sm text-white/70">{billingCycle === "month" ? "/ mo" : "/ yr"}</span>
                        </div>
                        <div className="text-xs text-white/70 mt-2 max-w-xs">{plan.description}</div>
                        {plan.cta && (
                          <button
                            className={`mt-4 py-2 px-4 rounded-md transition-colors ${
                              plan.popular
                                ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                                : "bg-transparent border border-cyan-400/50 text-white hover:bg-cyan-900/30"
                            }`}
                          >
                            {plan.cta}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-cyan-400/20 transition-all border-cyan-400/30">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-cyan-400" /> Users
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td key={`${plan.name}-users`} className={`p-4 text-center text-white ${plan.popular ? "bg-cyan-900/30" : ""}`}>
                      {plan.users}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-cyan-400/20 transition-all border-cyan-400/30">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <Columns3 size={16} className="text-cyan-400" /> Status Pages
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td key={`${plan.name}-statuspages`} className={`p-4 text-center text-white ${plan.popular ? "bg-cyan-900/30" : ""}`}>
                      {plan.statuspages}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-cyan-400/20 transition-all border-cyan-400/30">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <Radar size={16} className="text-cyan-400" /> Monitors
                    </div>
                  </td>
                  {plans.map((plan) => (
                    <td key={`${plan.name}-monitors`} className={`p-4 text-center text-white ${plan.popular ? "bg-cyan-900/30" : ""}`}>
                      {plan.monitors}
                    </td>
                  ))}
                </tr>
                {allFeatures.map((feature) => (
                  <tr key={feature} className="border-b hover:bg-cyan-400/20 transition-all border-cyan-400/30">
                    <td className="p-4 font-medium text-white">{feature}</td>
                    {plans.map((plan, planIndex) => {
                      const hasFeature = plan.features.includes(feature)
                      const cumulativeFeatures = plans.slice(0, planIndex + 1).flatMap((p) => p.features);
                      return (
                        <td
                          key={`${plan.name}-${feature}`}
                          className={`p-4 text-center ${plan.popular ? "bg-cyan-900/30" : ""}`}
                        >
                          {hasFeature || cumulativeFeatures.includes(feature) ? (
                            <Check className="mx-auto text-cyan-400" />
                          ) : (
                            <X className="mx-auto text-red-500/70" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Final CTA */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 border border-cyan-400/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-medium text-white mb-4">Power up your workflow with TrackIt Premium.</h3>
            <button className="px-10 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-md font-medium transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PremiumFeature({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-start justify-start bg-[#255566] border-2 border-[#13131d]/70 hover:border-cyan-400/30 transition-all duration-300 rounded-lg p-6 h-full group">
      <div className="p-4 rounded-full mb-4 group-hover:shadow-md transition-all duration-300">
        <img src={icon || "/placeholder.svg"} alt={`${title} Icon`} className="h-12 w-12 object-contain" />
      </div>
      <h3 className="text-lg font-medium text-white mb-3 text-start w-full">{title}</h3>
      <p className="text-sm text-white/70 text-start w-full">{description}</p>
    </div>
  )
}

