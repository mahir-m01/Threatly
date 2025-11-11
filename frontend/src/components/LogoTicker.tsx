"use client"
import React from 'react'
import Image from "next/image";
import NextLogo from '../assets/images/nextjs.svg';
import GeminiLogo from '../assets/images/gemini.svg';
import reactLogo from '../assets/images/react.png';
import TailwindLogo from '../assets/images/tailwind.svg';
import TypescriptLogo from '../assets/images/typescript.svg';
import {motion} from 'framer-motion';


export const LogoTicker = () => {
    return (
        <div className="bg-black text-white py-[72px] sm:py-24">
            <div className="container">
                <h2 className="text-xl text-center text-white/70">
                    Powered by the latest tech and frameworks
                </h2>
                <div className="flex overflow-hidden mt-9 before:content-[''] after:conent-[''] before:absolute after:absolute before:h-full after:h-full before:w-5 after:w-5 relative after:right-0 before:left-0 before:top-0 after:top-0 before:bg-[linear-gradient(to_right,#000,rgba(0,0,0,0))] after:bg-[linear-gradient(to_left,#000,rgba(0,0,0,0))] before:z-10">
                    <motion.div
                        initial={{translateX: 0}}
                        animate={{translateX: "-50%"}}
                        transition={{duration: 10, repeat: Infinity, ease: "linear"}}

                        className="flex gap-16 flex-none pr-16">

                        <NextLogo className="flex-none h-8 w-auto"/>
                        <GeminiLogo className="flex-none h-8 w-auto"/>
                        <Image src={reactLogo} alt="react logo" className="flex-none h-8 w-auto"/>
                        <TypescriptLogo className="flex-none h-8 w-auto"/>
                        <TailwindLogo className="flex-none h-8 w-auto"/>
                        <NextLogo className="flex-none h-8 w-auto"/>
                        <GeminiLogo className="flex-none h-8 w-auto"/>
                        <Image src={reactLogo} alt="react logo" className="flex-none h-8 w-auto"/>
                        <TypescriptLogo className="flex-none h-8 w-auto"/>
                        <TailwindLogo className="flex-none h-8 w-auto"/>
                        <NextLogo className="flex-none h-8 w-auto"/>
                        <GeminiLogo className="flex-none h-8 w-auto"/>
                        <Image src={reactLogo} alt="react logo" className="flex-none h-8 w-auto"/>
                        <TypescriptLogo className="flex-none h-8 w-auto"/>
                        <TailwindLogo className="flex-none h-8 w-auto"/>
                        <NextLogo className="flex-none h-8 w-auto"/>
                        <GeminiLogo className="flex-none h-8 w-auto"/>
                        <Image src={reactLogo} alt="react logo" className="flex-none h-8 w-auto"/>
                        <TypescriptLogo className="flex-none h-8 w-auto"/>
                        <TailwindLogo className="flex-none h-8 w-auto"/>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
