'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input, Label } from '@repo/ui';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignIn() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Email and password are required');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // localStorage.setItem('jwt', response.data.jwt);
        router.push('/dashboard');
        toast.success('Sign in successful');
      } else {
        toast.error(response.data.error || 'Something went wrong');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred during sign in. Please try again.');
      }
      console.error('Signin error:', error);
    }
  };

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <motion.div
        className="max-w-md w-full space-y-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants}>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-red-500">
            Sign in to FightLinx
          </h2>
        </motion.div>
        <motion.form
          className="mt-8 space-y-6 bg-black bg-opacity-70 p-8 rounded-lg shadow-xl"
          action="#"
          method="POST"
          variants={childVariants}
          onSubmit={submitForm}
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-red-300"
              >
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <motion.span
                className="absolute left-0 inset-y-0 flex items-center pl-3"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <svg
                  className="h-5 w-5 text-red-500 group-hover:text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.span>
              Sign in
            </Button>
          </div>
        </motion.form>
        <motion.div className="text-center" variants={childVariants}>
          <Link
            href="/signup"
            className="font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Don't have an account? Sign up
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
