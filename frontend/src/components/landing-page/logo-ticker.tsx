"use client"
import React from 'react'
import Image from "next/image";
import {motion} from 'framer-motion';

export const LogoTicker = () => {
    const logos = [
        { src: '/nextjs.svg', alt: 'Next.js' },
        { src: '/gemini.svg', alt: 'Gemini' },
        { src: '/typescript.svg', alt: 'TypeScript' },
        { src: '/tailwind.svg', alt: 'Tailwind' },
    ];

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
                        {/* Repeat logos 4 times for smooth scrolling */}
                        {[...Array(4)].map((_, idx) => (
                            <React.Fragment key={idx}>
                                {logos.map((logo, logoIdx) => (
                                    <Image
                                        key={`${idx}-${logoIdx}`}
                                        src={logo.src}
                                        alt={logo.alt}
                                        width={32}
                                        height={32}
                                        className="flex-none h-8 w-auto"
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
