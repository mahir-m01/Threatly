"use client"
import React from 'react'
import PlusIcon from '../assets/icons/plus.svg'
import MinusIcon from '../assets/icons/minus.svg'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'

type FAQItem = {
    question: string
    answer: string
}

const items: FAQItem[] = [
    {
        question: "What payement methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and Apple Pay."
    },
    {
        question: "How long does shipping take?",
        answer: "Shipping typically takes 5-7 business days."
    },
    {
        question: "Can I return a product?",
        answer: "Yes, we have a 30-day return policy for unused products."
    },
    {
        question: "Is my data secure?",
        answer: "We use industry-standard encryption to protect your data."
    }
]

const AccordianItem = ({question,answer} : {question:string,answer:string}) => {
    const [isOpen,setIsOpen] = React.useState(false)
    return (
        <div key={question} className="py-7 border-b border-white/30" onClick={()=> setIsOpen(!isOpen)}>
            <div className="flex items-center">
                <span className="flex-1 text-lg font-bold" >{question}</span>
                {isOpen ? <MinusIcon /> : <PlusIcon />}
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
        <div className="bg-black text-white bg-gradient-to-b from-[#2167A1] to-black py-[72px] sm:py-24">
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
