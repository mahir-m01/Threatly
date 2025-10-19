"use client"

import React, {useRef} from 'react'
import Image from "next/image";
import appScreen from "../assets/images/app-screen.png"
import {motion, useScroll, useTransform} from "framer-motion";

export const ProductShowcase = () => {

    const appImage = useRef<HTMLImageElement>(null);
    const { scrollYProgress } = useScroll({
        target: appImage,
        offset: ['start end','end end']
    });

    const opacity = useTransform(scrollYProgress, [0,1],[0,1]);
    const rotateX = useTransform(scrollYProgress, [0,1],[15,0]);


    return (
        <div className="bg-black text-white bg-gradient-to-b from-black to-[#2167A1] py-[72] sm:py-24">
            <div className="container">
                <h2 className="text-center text-5xl sm:text-6xl font-bold tracking-tighter">
                    Intuitive Interface
                </h2>
                <div className="max-w-xl mx-auto">
                    <p className="text-xl text-center text-white/70 mt-5">
                        Easily navigate scans, view detailed results, and track your project’s security status with a clean, responsive dashboard designed for clarity and efficiency.
                    </p>
                </div>
                <motion.div
                    style={{
                        opacity: opacity,
                        rotateX: rotateX,
                        transformPerspective: "800px"
                    }}

                >
                    <Image src={appScreen} alt="Showcase Screenshot" className="mt-14 mx-auto" ref={appImage}
                    />
                </motion.div>

            </div>
        </div>
    )
}
