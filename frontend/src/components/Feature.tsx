"use client"
import React, {useEffect,useRef} from 'react'
import FeatureIcon from "@/assets/icons/features.svg";
import {motion, useMotionTemplate, useMotionValue} from "framer-motion";

export const Feature = ({title,description} : {title: string, description: string}) => {

    // initial values: setting -100 so it doesnt show on intial render:
    const offsetX = useMotionValue(-100);
    const offsetY = useMotionValue(-100);
    const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;

    const border = useRef<HTMLDivElement>(null);
    useEffect(()=>{

        const updateMousePosition = (e: MouseEvent) => {
            // x posititon is e.x y is e.y
            if(!border.current) return;
            const borderRect = border.current?.getBoundingClientRect();
            offsetX.set(e.x - borderRect.x);
            offsetY.set(e.y - borderRect.y);
        };

        window.addEventListener('mousemove',updateMousePosition)
        return () => {
            window.removeEventListener('mousemove',updateMousePosition)
        }
    }, [offsetX, offsetY])

    return (
        <div className="border border-white/30 px-5 py-10 text-center rounded-xl sm: flex-1 relative">
            <motion.div className="absolute inset-0 border-2 border-[#6EA3DB] rounded-xl"
                 style={{maskImage: maskImage, WebkitMaskImage: maskImage
            }}
                 ref={border}
            >

            </motion.div>
            <div className="inline-flex size-14 bg-white text-black justify-center items-center rounded-lg">
                <FeatureIcon className="size-8 fill-black"/>
            </div>
            <h3 className="mt-6 font-bold">
                {title}
            </h3>
            <p className="mt-2 text-white/70">
                {description}
            </p>
        </div>
    )
}
