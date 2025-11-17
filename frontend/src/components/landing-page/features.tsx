import React from 'react';
import { Feature } from "@/components/landing-page/feature";

type FeatureType = {
    title: string;
    description: string;
};

const features: FeatureType[] = [
    {
        title: 'Unified Scans',
        description: 'Run multiple security checks at once. Headers, SSL/TLS, dependency vulnerabilities all in a single dashboard.',
    },
    {
        title: 'Github Repository Analysis',
        description: 'Scan your GitHub repositories for dependency risks and get a clear overview of potential vulnerabilities.',
    },
    {
        title: 'AI Risk Summary',
        description: 'Receive clear, AI-powered insights that highlight vulnerabilities and suggest actionable fixes for your projects.',
    },
];

export const Features = () => {
    return (
        <div className="bg-black text-white py-[72px] sm:py-24">
            <div className="container">
                <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">Everything You Need</h2>
                <div className="max-w-xl mx-auto">
                    <p className="text-center mt-5 text-xl text-white/70">
                        Integrating Mozilla Observatory, SSL Labs, OSV, and AI summarization,
                        Threatly gives developers a unified view of vulnerabilities and
                        actionable recommendations to strengthen projects fast.
                    </p>
                </div>

                <div className="mt-16 flex flex-col sm:flex-row gap-4">
                    {features.map(({ title, description }) => (
                        <Feature key={title} title={title} description={description} />
                    ))}
                </div>
            </div>
        </div>
    );
};
