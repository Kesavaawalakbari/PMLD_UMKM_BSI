import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter, AnimatedPercentage } from './AnimatedCounter';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  percentageChange?: number;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
  formatAsCurrency?: boolean;
  suffix?: string;
  delay?: number;
}

/**
 * AnimatedStatCard - Animated statistics card with entrance and hover effects
 * Uses framer-motion for smooth spring animations
 */
export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  percentageChange,
  isPositive,
  icon,
  iconBgColor,
  formatAsCurrency = false,
  suffix = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header with title and icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.1 }}
          style={{
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {title}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
            delay: delay + 0.2,
          }}
          whileHover={{ rotate: 10, scale: 1.1 }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Value and percentage */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
          }}
        >
          <AnimatedCounter
            end={value}
            formatAsCurrency={formatAsCurrency}
            suffix={suffix}
            duration={2.5}
          />
        </motion.div>
        {percentageChange !== undefined && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 }}
            style={{
              fontSize: '14px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <AnimatedPercentage value={percentageChange} isPositive={isPositive} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

/**
 * StatCardSkeleton - Loading skeleton for stat cards
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Shimmer animation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
              'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '100px',
            height: '16px',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0',
          }}
        />
        <motion.div
          animate={{
            background: [
              'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
              'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f0f0f0',
          }}
        />
      </div>
      <motion.div
        animate={{
          background: [
            'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
            'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          width: '140px',
          height: '32px',
          borderRadius: '6px',
          backgroundColor: '#f0f0f0',
          marginTop: '16px',
        }}
      />
    </motion.div>
  );
};

export default AnimatedStatCard;
