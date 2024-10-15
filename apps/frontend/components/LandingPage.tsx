'use client';

import { useState } from 'react';
import { Calendar, Users, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const getStartedHandler = () => {
    router.push('/signup');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b border-red-800">
        <motion.a
          className="flex items-center justify-center"
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap className="h-8 w-8 text-red-500" />
          <span className="ml-2 text-3xl font-bold text-red-500">
            Fightlinx
          </span>
        </motion.a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
            <motion.a
              key={item}
              className="text-sm font-medium hover:text-red-500 transition-colors"
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-black to-red-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Simplify Fight Events with{' '}
                  <span className="text-red-500">AI-Powered Matchmaking</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-gray-400 md:text-2xl">
                  Fightlinx is the go-to network for clubs and promoters. Plan
                  your events hassle-free and connect with the right fighters
                  with ease!
                </p>
              </motion.div>
              <motion.div
                className="space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  className="bg-red-500 text-white hover:bg-red-600 rounded text-lg py-6 px-8"
                  onClick={getStartedHandler}
                >
                  Get Started
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-500 border-red-500 bg-slate-200 hover:bg-red-500 hover:text-white text-lg py-6 px-8 rounded"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-950">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-red-500">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'AI-Powered Matchmaking',
                  description:
                    'Find the perfect match for your fighters with our advanced AI algorithm.',
                },
                {
                  icon: Calendar,
                  title: 'Event Planning Tools',
                  description:
                    'Streamline your event planning process with our comprehensive toolset.',
                },
                {
                  icon: Trophy,
                  title: 'Fighter Network',
                  description:
                    'Connect with a vast network of fighters across various disciplines.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-6 bg-gray-900 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <feature.icon className="h-16 w-16 text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-red-900 to-black">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-white">
              For Clubs and Promoters
            </h2>
            <Tabs defaultValue="clubs" className="max-w-3xl mx-auto rounded">
              <TabsList className="flex w-full justify-between bg-gray-900">
                <TabsTrigger
                  value="clubs"
                  className="w-full text-lg rounded data-[state=active]:bg-red-500 data-[state=active]:text-white flex justify-center items-center"
                >
                  Clubs
                </TabsTrigger>
                <TabsTrigger
                  value="promoters"
                  className="w-full text-lg rounded data-[state=active]:bg-red-500 data-[state=active]:text-white flex justify-center items-center"
                >
                  Promoters
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="clubs"
                className="mt-6 bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-red-500">
                  Elevate Your Club's Events
                </h3>
                <p className="text-gray-300 mb-4">
                  Fightlinx provides clubs with powerful tools to organize
                  successful events, manage fighters, and grow their audience.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Easily manage fighter rosters</li>
                  <li>Create and promote events</li>
                  <li>Access detailed analytics and insights</li>
                </ul>
              </TabsContent>
              <TabsContent
                value="promoters"
                className="mt-6 bg-gray-900 p-6 rounded-lg"
              >
                <h3 className="text-2xl font-bold mb-4 text-red-500">
                  Amplify Your Promotions
                </h3>
                <p className="text-gray-300 mb-4">
                  Fightlinx empowers promoters with cutting-edge tools to create
                  unforgettable fight events and maximize audience engagement.
                </p>
                <ul className="list-disc list-inside text-gray-300">
                  <li>Discover top talent with AI matchmaking</li>
                  <li>Streamline event logistics</li>
                  <li>Boost ticket sales with targeted marketing</li>
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Revolutionize Your Fight Events?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                  Join Fightlinx today and experience the future of fight event
                  management.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Submitted email:', email);
                    // TODO: send the email to your backend
                  }}
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Label htmlFor="email" className="sr-only">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/10 text-white placeholder:text-gray-400"
                      required
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      className="bg-white text-red-900 hover:bg-gray-200 rounded"
                    >
                      Get Started
                    </Button>
                  </div>
                </form>
                <p className="text-xs text-gray-300">
                  By signing up, you agree to our Terms & Conditions and Privacy
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800 bg-black">
        <p className="text-xs text-gray-400">
          © 2024 Fightlinx. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-red-500"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-red-500"
            href="#"
          >
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
