"use client"
import React, {useEffect,useRef} from 'react'
import {motion, useMotionTemplate, useMotionValue} from "framer-motion";

// Simple SVG feature icon component
const FeatureIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

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
                <FeatureIcon className="size-8 text-black" />
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
