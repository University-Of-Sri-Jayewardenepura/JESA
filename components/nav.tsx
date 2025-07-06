"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const Nav: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="container relative z-50 flex h-full max-w-[1216px] items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center text-white hover:text-gray-300 transition-colors">
                    <img src="/_next/static/media/fd0c0324b9d9b1f5d86eb79b641ecb95.svg" alt="Slash" width="64" height="22" />
                    <span className="sr-only">Slash</span>
                </a>

                {/* Main Navigation - Desktop */}
                <ul className="hidden lg:flex items-center gap-x-2">
                    <li>
                        <a href="/pricing" className="px-2.5 py-1.5 text-white hover:text-gray-300 transition-colors">
                            Pricing
                        </a>
                    </li>
                    <li>
                        <a href="/faq" className="px-2.5 py-1.5 text-white hover:text-gray-300 transition-colors">
                            FAQ
                        </a>
                    </li>
                </ul>

                {/* Right Side Actions - Desktop */}
                <div className="hidden lg:flex items-center gap-x-5">
                    <a
                        href="https://app.slash.com/login"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        Log in
                    </a>
                    <Button
                        asChild
                        variant="outline"
                        className="px-3.5 py-2 bg-transparent border border-gray-600 text-white hover:border-gray-400 transition-colors rounded-full"
                    >
                        <a href="https://app.slash.com/onboarding?invite_code=OPENINTERNET">
                            Open Account
                        </a>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden text-white hover:text-gray-300 transition-colors"
                    type="button"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-x-0 bottom-0 z-40 block bg-black bg-opacity-95 lg:hidden top-16">
                    <div className="flex h-full w-full flex-col justify-between text-left pt-[55px]">
                        <nav className="px-5 md:px-8">
                            <ul className="flex w-full flex-col overflow-y-auto">
                                <li className="border-b border-gray-800 group/navitem relative">
                                    <a 
                                        href="/pricing"
                                        className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-18 leading-none text-gray-300 transition-colors duration-200 hover:text-white"
                                        onClick={toggleMenu}
                                    >
                                        Pricing
                                    </a>
                                </li>
                                <li className="border-b border-gray-800 group/navitem relative">
                                    <a 
                                        href="/faq"
                                        className="flex w-full items-center gap-x-1.5 rounded-full py-5 whitespace-pre text-18 leading-none text-gray-300 transition-colors duration-200 hover:text-white"
                                        onClick={toggleMenu}
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        <div className="grid grid-cols-1 gap-5 bg-black p-5 md:grid-cols-2 md:p-8">
                            <a 
                                href="https://app.slash.com/login"
                                className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors border border-gray-600 hover:border-gray-400 h-11 text-[15px] leading-none px-3.5 font-medium text-white"
                            >
                                Log in
                            </a>
                            <a 
                                href="https://app.slash.com/onboarding?invite_code=OPENINTERNET"
                                className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full transition-colors bg-white text-black hover:bg-gray-200 h-11 text-[15px] leading-none px-3.5 font-medium"
                            >
                                Open Account
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Nav;
