import React from 'react'
import InstaIcon from '../assets/icons/insta.svg'
import XIcon from '../assets/icons/x.svg'

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
                            <InstaIcon />
                        </li>
                        <li>
                            <XIcon />
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}
