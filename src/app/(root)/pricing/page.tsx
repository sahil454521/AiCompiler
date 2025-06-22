
import { api } from '../../../../convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { currentUser } from '@clerk/nextjs/server';
import ProPlanView from './_components/ProPlanView';
import NavigationHeader from '@/Components/provider/NavigationHeader';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import LoginButton from '@/Components/LoginButton';
import UpgradeButton from './_components/UpgradeButton';
import { 
  Headset, 
  BarChart3, 
  Users, 
  Puzzle,
  StarIcon 
} from 'lucide-react';

const ENTERPRISE_FEATURES = [
  {
    label: "Priority Support",
    desc: "Get access to 24/7 priority customer support for all your needs.",
    icon: Headset,
  },
  {
    label: "Advanced Analytics",
    desc: "Unlock detailed analytics and insights for your projects.",
    icon: BarChart3,
  },
  {
    label: "Team Collaboration",
    desc: "Collaborate with your team in real-time with advanced tools.",
    icon: Users,
  },
  {
    label: "Custom Integrations",
    desc: "Integrate with your favorite tools and services seamlessly.",
    icon: Puzzle,
  },
];



async function PricingPage() {
    const user = await currentUser();
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const convexUser = await convex.query(api.users.getUser,{
        userId: user?.id || "",
    })

    if(convexUser?.isPro) return <ProPlanView/> 
  return (
    <div className='relative min-h-screen bg-[#0a0a0f] text-white p-6 selection:bg-blue-500/20 selection:text-blue-500'>
        <NavigationHeader/>


        <main className='relative pt-32 pb-24 px-4'>
            <div className='max-w-3xl mx-auto text-center'>
               <div className="text-center mb-24">
            <div className="relative inline-block">
              <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-10" />
              <h1
                className="relative text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r
               from-gray-100 to-gray-300 text-transparent bg-clip-text mb-8"
              >
                Elevate Your <br />
                Development Experience
              </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join the next generation of developers with NeuraCraft Pro. Unlock advanced features,
              enhanced performance, and exclusive tools designed to supercharge your coding journey.
              </p>
          </div> 
            {/* Enterprise Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {ENTERPRISE_FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="group relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
                  flex items-center justify-center mb-4 ring-1 ring-gray-800/60 group-hover:ring-blue-500/20"
                  >
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>

                  <h3 className="text-lg font-medium text-white mb-2">{feature.label}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

            {/* pricing*/ }
             <div className="relative max-w-4xl mx-auto">
            <div
              className="absolute -inset-px bg-gradient-to-r from-blue-500
             to-purple-500 rounded-2xl blur opacity-10"
            />
            <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-2xl">
              <div
                className="absolute inset-x-0 -top-px h-px bg-gradient-to-r 
              from-transparent via-blue-500/50 to-transparent"
              />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

              <div className="relative p-8 md:p-12">
                {/* header */}
                <div className="text-center mb-12">
                    <StarIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-semibold text-white mb-4">Lifetime Pro Access</h2>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-2xl text-gray-400">Rs</span>
                    <span className="text-6xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                      100
                    </span>
                    <span className="text-xl text-gray-400">one-time</span>
                  </div>
                  <p className="text-gray-400 text-lg">Unlock the full potential of NeuraCraft</p>
                </div>

          </div>

            </div>
                <div className="flex relative justify-center items-center gap-4 mt-8">
                  <SignedIn>
                    <UpgradeButton />
                  </SignedIn>

                  <SignedOut>
                    <LoginButton />
                  </SignedOut>
                </div>
              </div>
            </div>
        </main>
      
    </div>
  )
}

export default PricingPage
