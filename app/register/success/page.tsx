"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const SuccessPage = () => {
  useEffect(() => {
    toast.success("Registration Successful!");
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen pt-32 w-full space-y-3">
      <h1 className="sm:text-5xl text-4xl text-center pl-3 pr-3">JESA 2024 REGISTRATION</h1>
      <h2 className="text-slate-300 text-2xl text-center pl-3 pr-3">
        Your registration form was received. Thank you!
      </h2>
      <div className="flex flex-col">
        <Button className="mt-4">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export default SuccessPage;