
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

interface DonutChartProps {
    data: { name: string; value: number; color: string }[];
    visitors: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, visitors }) => {
    const size = 180;
    const strokeWidth = 25;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const totalValue = data.reduce((sum, item) => sum + item.value, 0);

    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (isInView) {
            // Small delay for staggered effect
            const timer = setTimeout(() => setShouldAnimate(true), 200);
            return () => clearTimeout(timer);
        }
    }, [isInView]);

    let accumulatedPercentage = 0;

    return (
        <motion.div 
            ref={ref}
            className="relative" 
            style={{ width: size, height: size }}
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
                duration: 0.8 
            }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#e6e6e6"
                    strokeWidth={strokeWidth}
                    initial={{ pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                {/* Data segments */}
                {data.map((item, index) => {
                    const percentage = (item.value / totalValue) * 100;
                    const segmentLength = (percentage / 100) * circumference;
                    const offset = circumference - (accumulatedPercentage / 100) * circumference;
                    
                    accumulatedPercentage += percentage;
                    
                    return (
                        <motion.circle
                            key={index}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={`${segmentLength} ${circumference}`}
                            strokeDashoffset={offset}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            initial={{ 
                                strokeDasharray: `0 ${circumference}`,
                                opacity: 0 
                            }}
                            animate={shouldAnimate ? { 
                                strokeDasharray: `${segmentLength} ${circumference}`,
                                opacity: 1 
                            } : {}}
                            transition={{ 
                                type: 'spring',
                                stiffness: 100,
                                damping: 15,
                                delay: 0.3 + (index * 0.15),
                                duration: 1
                            }}
                            whileHover={{
                                strokeWidth: strokeWidth + 4,
                                filter: 'brightness(1.1)',
                            }}
                            style={{ 
                                cursor: 'pointer',
                                transition: 'stroke-width 0.2s ease, filter 0.2s ease'
                            }}
                        />
                    );
                })}
            </svg>
            {/* Center content */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
            >
                <span className="text-3xl font-bold text-gray-800">
                    {shouldAnimate ? (
                        <CountUp
                            start={0}
                            end={visitors}
                            duration={2}
                            separator="."
                            useEasing={true}
                        />
                    ) : (
                        '0'
                    )}
                </span>
                <span className="text-sm text-gray-500">Visitors</span>
            </motion.div>
        </motion.div>
    );
};

export default DonutChart;
