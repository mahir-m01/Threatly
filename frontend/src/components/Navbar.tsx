"use client"
import React, { useState } from "react";
import Link from "next/link";
import Logo from "../assets/images/logo.svg";
import MenuIcon from "../assets/icons/menu.svg";
import XIcon from "../assets/icons/x.svg";

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-black">
            <div className="px-4">
                <div className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo className="h-12 w-12 relative" />
                        <h1 className="text-white text-2xl font-medium">Threatly</h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="border border-white/60 h-10 w-10 inline-flex items-center justify-center rounded-lg sm:hidden"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <XIcon className="text-white/80 h-6 w-6" />
                        ) : (
                            <MenuIcon className="text-white/80 h-6 w-6" />
                        )}
                    </button>
                    <nav className="items-center gap-6 hidden sm:flex">
                        <a href="#" className="text-white/80 hover:text-white/100 transition">About</a>
                        <a href="#" className="text-white/80 hover:text-white/100 transition">Features</a>
                        <a href="#" className="text-white/80 hover:text-white/100 transition">FAQs</a>

                        <Link href="/sign-up">
                            <button className="bg-white text-black py-2 px-4 rounded-lg font-medium cursor-pointer hover:bg-[#2167A1] hover:text-white transition-all">
                                Get Started
                            </button>
                        </Link>
                    </nav>
                </div>
            </div>

            {isMobileMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 backdrop-blur-md z-40 sm:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 sm:hidden pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-8 w-80 max-w-[90%] pointer-events-auto">

                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="border border-white/60 border-opacity-30 h-10 w-10 inline-flex items-center justify-center rounded-lg"
                                    aria-label="Close menu"
                                >
                                    <XIcon className="text-white/80 h-6 w-6" />
                                </button>
                            </div>


                            <nav className="flex flex-col gap-6">
                                <a
                                    href="#"
                                    className="text-white text-lg hover:text-white/80 transition py-2 text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About
                                </a>
                                <a
                                    href="#"
                                    className="text-white text-lg hover:text-white/80 transition py-2 text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </a>
                                <a
                                    href="#"
                                    className="text-white text-lg hover:text-white/80 transition py-2 text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    FAQs
                                </a>

                                <Link href="/sign-up" className="w-full flex justify-center">
                                    <button
                                        className="bg-white text-black py-3 px-4 rounded-lg font-medium mt-4 max-w-32 mx-auto cursor-pointer hover:bg-[#2167A1] hover:text-white transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </button>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
