'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui';

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex flex-col items-center justify-center p-4 rounded">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl bg-white/10 backdrop-blur-lg text-white border-none shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center mb-2">
              FightLinx Superuser Portal
            </CardTitle>
            <CardDescription className="text-xl text-center text-purple-200">
              Manage matches with unprecedented control
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-8 w-8 text-purple-300" />}
              title="Fighter Management"
              description="Oversee fighter profiles and statistics"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-purple-300" />}
              title="Match Scheduling"
              description="Efficiently schedule and update match statuses"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-purple-300" />}
              title="Secure Access"
              description="Exclusive tools for authorized personnel"
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signin">
                <Button
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Enter Portal
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

interface FeatureCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white/5 border-none text-white rounded">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
