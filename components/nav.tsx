"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="container relative z-50 flex h-16 lg:h-full max-w-[1216px] items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:text-slate-300 transition-colors"
        >
          <Image
            src="/images/jesa-min.png"
            width={72}
            height={20}
            alt="JESA 2024"
            className="ml-[-0.4rem] lg:ml-[-1.2rem] w-auto h-auto"
          />
          <span className="sr-only">JESA</span>
        </Link>

        {/* Main Navigation - Desktop */}
        <ul className="hidden lg:flex items-center gap-x-2">
          <li>
            <Link
              href="/awards"
              className="px-2.5 py-1.5 text-sm   hover:text-slate-300 transition-colors"
            >
              Awards
            </Link>
          </li>
          <li>
            <Link
              href="/hall-of-fame"
              className="px-2.5 py-1.5 text-sm   hover:text-slate-300 transition-colors"
            >
              Hall of Fame
            </Link>
          </li>
        </ul>

        {/* Right Side Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-x-5">
          <Link
            href="/terms"
            className="px-2.5 py-1.5 text-sm   hover:text-slate-300 transition-colors"
          >
            Terms & Conditions
          </Link>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border border-gray-600  hover:border-slate-400 transition-colors rounded-full"
          >
            <Link
              href="/register"
              className="px-2.5 text-sm hover:text-slate-300 transition-colors"
            >
              Registration
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden  hover:text-slate-300 transition-colors"
          type="button"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed bg-background inset-x-0 bottom-0 z-40 block lg:hidden top-16">
          <div className="flex h-full w-full flex-col justify-between text-left pt-[55px]">
            <nav className="px-5 md:px-8">
              <ul className="flex w-full flex-col overflow-y-auto">
                <li className="border-b border-slate-900 group/navitem relative">
                  <Button
                    asChild
                    variant="link"
                    className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-lg leading-none text-slate-300 transition-colors duration-200 hover:text-slate-100 h-auto justify-start"
                    onClick={toggleMenu}
                  >
                    <Link href="/awards">Awards</Link>
                  </Button>
                </li>
                <li className="border-b border-slate-900 group/navitem relative">
                  <Button
                    asChild
                    variant="link"
                    className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-lg leading-none text-slate-300 transition-colors duration-200 hover:text-slate-100 h-auto justify-start"
                    onClick={toggleMenu}
                  >
                    <Link href="/hall-of-fame">Hall of Fame</Link>
                  </Button>
                </li>
              </ul>
            </nav>
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-8">
              <Button
                asChild
                variant="outline"
                className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors border  h-11 text-[15px] leading-none px-3.5 font-medium"
              >
                <Link href="/terms">Terms & Conditions</Link>
              </Button>
              <Button
                asChild
                className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors h-11 text-[15px] leading-none px-3.5 font-medium"
              >
                <Link href="/register">Registration</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
