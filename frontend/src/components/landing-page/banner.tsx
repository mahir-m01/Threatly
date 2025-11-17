import React from 'react'

export const Banner = () => {
    const gradient = 'linear-gradient(to right, rgba(214,237,255,0.7), rgba(41,137,255,0.7), rgba(118,175,255,0.7), rgba(41,137,255,0.7), rgba(214,237,255,0.7))'

    return (
        <div className="py-3 text-center" style={{ background: gradient }}>
            <div className="container">
                <p className="font-medium">
                    <span className="hidden md:inline">
                        Introducing a completely redesigned interface -{" "}
                    </span>
                     <a href="#" className="underline underline-offset-4 font-medium">Explore the demo</a>
                </p>

            </div>
        </div>
    )
}
