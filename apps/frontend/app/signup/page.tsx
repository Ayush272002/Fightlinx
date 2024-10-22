'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input, Label } from '@repo/ui';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirm) {
      toast.error('All fields are required');
      return;
    }

    if (password !== passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/signup`,
        payload,
        { withCredentials: true }
      );

      if (res.status === 200) {
        router.push('/dashboard');
        toast.success('Account created successfully');
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            'Login failed. Please check your credentials and try again.'
        );
      } else if (error.request) {
        toast.error('No response from the server. Please try again later.');
      } else {
        toast.error(
          'An unexpected error occurred during login. Please try again.'
        );
      }
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
            Create your FightLinx account
          </h2>
        </motion.div>
        <motion.form
          className="mt-8 space-y-6 bg-black bg-opacity-70 p-8 rounded-lg shadow-xl"
          action="#"
          method="POST"
          variants={childVariants}
          onSubmit={onSubmitHandler}
        >
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="name" className="sr-only">
                Full name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Full name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
              />
            </div>
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Email address"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="password-confirm" className="sr-only">
                Confirm password
              </Label>
              <Input
                id="password-confirm"
                name="password-confirm"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-red-700 placeholder-red-300 text-red-100 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-black bg-opacity-50"
                placeholder="Confirm password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordConfirm(e.target.value)
                }
              />
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
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.span>
              Sign up
            </Button>
          </div>
        </motion.form>
        <motion.div className="text-center" variants={childVariants}>
          <Link
            href="/signin"
            className="font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
