import React from 'react'

export const CallToAction = () => {
    return (
        <div className="bg-black text-white py-[72px] sm:py-24 text-center">
            <div className="container max-w-xl mx-auto">
                <h2 className="text-5xl sm:text-6xl font-bold tracking-tighter">
                    Start Securing
                </h2>
                <p className="text-xl text-white/70 mt-5">
                    Run your first unified security scan in seconds. Get clear insights that help you protect your code and your users.
                </p>
                <div className="flex justify-center mt-8">
                    <button className="bg-white text-black py-3 px-5 rounded-lg font-medium">
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    )
}
