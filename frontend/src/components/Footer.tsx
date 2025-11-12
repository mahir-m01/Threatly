import React from 'react'
import { InstaIcon } from './icons/InstaIcon'
import { XIcon } from './icons/XIcon'

export const Footer = () => {
    return (
        <footer className="py-5 bg-black text-white/60 border-t border-white/20">
            <div className="container">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="text-center">
                        © 2025 Threatly All rights reserved
                    </div>
                    <ul className="flex justify-center gap-2.5">
                        <li>
                            <InstaIcon className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
                        </li>
                        <li>
                            <XIcon className="w-6 h-6 text-white/70 hover:text-white transition-colors" />
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}
