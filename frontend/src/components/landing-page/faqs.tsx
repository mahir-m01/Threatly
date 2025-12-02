"use client"
import React from 'react'
import { PlusIcon } from '../icons/PlusIcon'
import { MinusIcon } from '../icons/MinusIcon'
import { motion, AnimatePresence } from 'framer-motion'

type FAQItem = {
    question: string
    answer: string
}

const items: FAQItem[] = [
    {
        "question": "What does Threatly do with my scan data?",
        "answer": "Threatly securely stores your scan results only for displaying your reports. No data is sold or shared with third parties."
    },
    {
        "question": "Is my website information kept private?",
        "answer": "Yes. All domains and scan results remain private to your account, and data is encrypted in transit and at rest."
    },
    {
        "question": "Do Threatly scans harm my website?",
        "answer": "No. Threatly uses safe and non-intrusive checks designed to avoid stressing or damaging your site. Scans follow industry-standard best practices."
    },
    {
        "question": "How accurate are Threatly's security checks?",
        "answer": "Threatly aggregates results from trusted sources like Mozilla Observatory, SSL Labs, OSV, VirusTotal, and Nuclei to provide reliable, multi-layered security insights."
    }
]


const AccordianItem = ({question,answer} : {question:string,answer:string}) => {
    const [isOpen,setIsOpen] = React.useState(false)
    return (
        <div key={question} className="py-7 border-b border-white/30" onClick={()=> setIsOpen(!isOpen)}>
            <div className="flex items-center">
                <span className="flex-1 text-lg font-bold" >{question}</span>
                {isOpen ? <MinusIcon className="text-white w-6 h-6" /> : <PlusIcon className="text-white w-6 h-6" />}
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial ={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                            marginTop: "16px"

                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            marginTop: 0
                        }}
                    >
                        {answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export const FAQs = () => {
    return (
        <div id="faqs" className="bg-black text-white bg-gradient-to-b from-[#2167A1] to-black py-[72px] sm:py-24">
            <div className="container">
                <h2 className="text-center text-5xl sm:text-6xl sm:max-w-[648px] font-bold tracking-tighter mx-auto">
                    Frequently Asked Questions
                </h2>
                <div className="mt-12 max-w-[648px] mx-auto">
                    {items.map(({question,answer})=> (
                        <AccordianItem key={question} question={question} answer={answer} />
                    ))}
                </div>
            </div>
        </div>
    )
}
