import React from 'react'

export const Hero = () => {
    return (
        <div className="bg-[linear-gradient(to_bottom,#000,#0D2042_34%,#2167A1_65%,#6ea3DB_82%)] text-white py-[72px] sm:py-24 relative overflow-clip">
            <div className="absolute h-[375px] w-[750px] sm:h-[768px] sm:w-[1536px] lg:h-[1200px] lg:w-[2400px] left-1/2 -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,#000_82%,#2167A1_100%)] border border-[#82BFFF] top-[calc(100%-96px)] sm:top-[calc(100%-120px)]">
            </div>
            <div className="container relative" >
                <div className="flex justify-center">
                    <h1 className="text-7xl sm:text-8xl font-bold tracking-tighter text-center mt-8 inline-flex">
                        Secure Flaws <br/> Fast
                    </h1>
                </div>

                <div className="flex justify-center">
                    <p className="text-center text-xl mt-8 max-w-md">
                        Scan, analyze, and secure your projects with Threatly, a dashboard built to track vulnerabilities, summarize results, and help you fix them fast.
                    </p>
                </div>

                <div className="flex justify-center mt-8">
                    <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
                        Get Started
                    </button>
                </div>
            </div>

        </div>
    )
}
