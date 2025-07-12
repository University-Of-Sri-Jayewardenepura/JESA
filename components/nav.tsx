"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CtaButton } from "@/components/ui/cta-button";

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
            alt="JESA 2025"
            className="ml-[-0.4rem] lg:ml-[-1.2rem] w-auto h-auto"
          />
          <span className="sr-only">JESA</span>
        </Link>

        {/* Main Navigation - Desktop */}
        <ul className="hidden lg:flex items-center gap-x-2">
          <li>
            <Button
              asChild
              variant="ghost"
              className="px-2.5 py-1.5 text-md hover:text-slate-300 transition-colors"
            >
              <Link href="/awards">Awards</Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant="ghost"
              className="px-2.5 py-1.5 text-md hover:text-slate-300 transition-colors"
            >
              <Link href="/hall-of-fame">Hall of Fame</Link>
            </Button>
          </li>
        </ul>

        {/* Right Side Actions - Desktop */}
        <div className="hidden lg:flex items-center gap-x-5">
          <Button
            asChild
            variant="ghost"
            className="px-2.5 py-1.5 text-md hover:text-slate-300 transition-colors"
          >
            <Link href="/terms">Terms & Conditions</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border border-gray-600  hover:border-slate-400 transition-colors rounded-full text-md h-8"
          >
            <Link
              href="/register"
              className="px-2  hover:text-slate-300 transition-colors"
            >
              Register Now
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
                    variant="ghost"
                    className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-lg leading-none text-slate-300 transition-colors duration-200 hover:text-slate-100 h-auto justify-start"
                  >
                    <Link href="/awards" onClick={toggleMenu}>
                      Awards
                    </Link>
                  </Button>
                </li>
                <li className="border-b border-slate-900 group/navitem relative">
                  <Button
                    asChild
                    variant="ghost"
                    className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-lg leading-none text-slate-300 transition-colors duration-200 hover:text-slate-100 h-auto justify-start"
                  >
                    <Link href="/hall-of-fame" onClick={toggleMenu}>
                      Hall of Fame
                    </Link>
                  </Button>
                </li>
              </ul>
            </nav>
            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-8">
              <CtaButton
                asChild
                variant="secondary"
                className="w-full"
                onClick={toggleMenu}
              >
                <Link href="/terms">Terms & Conditions</Link>
              </CtaButton>
              <CtaButton asChild className="w-full" onClick={toggleMenu}>
                <Link href="/">Registration Coming Soon</Link>
              </CtaButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
