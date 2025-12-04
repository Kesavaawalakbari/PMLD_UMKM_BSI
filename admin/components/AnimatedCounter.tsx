import React, { useEffect, useRef, useState } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  separator?: string;
  className?: string;
  formatAsCurrency?: boolean;
}

/**
 * AnimatedCounter - Animated number counter with Rupiah formatting support
 * Uses react-countup for smooth number animations
 * Only animates when element comes into view
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2,
  separator = '.',
  className = '',
  formatAsCurrency = false,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Format as Indonesian Rupiah
  const formattedPrefix = formatAsCurrency ? 'Rp ' : prefix;

  return (
    <span ref={ref} className={className}>
      {hasAnimated ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          decimals={decimals}
          separator={separator}
          prefix={formattedPrefix}
          suffix={suffix}
          useEasing={true}
          easingFn={(t, b, c, d) => {
            // Custom easing: easeOutExpo
            return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
          }}
        />
      ) : (
        <span>{formattedPrefix}0{suffix}</span>
      )}
    </span>
  );
};

interface AnimatedPercentageProps {
  value: number;
  isPositive?: boolean;
  className?: string;
}

/**
 * AnimatedPercentage - Animated percentage with color coding
 * Green for positive, red for negative values
 */
export const AnimatedPercentage: React.FC<AnimatedPercentageProps> = ({
  value,
  isPositive,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [hasAnimated, setHasAnimated] = useState(false);

  const positive = isPositive !== undefined ? isPositive : value >= 0;

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ color: positive ? '#10B981' : '#EF4444' }}
    >
      {hasAnimated ? (
        <CountUp
          start={0}
          end={Math.abs(value)}
          duration={1.5}
          decimals={1}
          prefix={positive ? '+' : '-'}
          suffix="%"
          useEasing={true}
        />
      ) : (
        <span>{positive ? '+' : '-'}0%</span>
      )}
    </span>
  );
};

export default AnimatedCounter;
