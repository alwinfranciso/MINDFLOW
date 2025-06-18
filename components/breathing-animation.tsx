
"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingAnimationProps {
  phase: 'inhale' | 'hold' | 'exhale' | 'pause' | 'idle';
  duration: number; // Duration of the current phase in seconds
  text: string;
}

export default function BreathingAnimation({ phase, duration, text }: BreathingAnimationProps) {
  const [key, setKey] = useState(0); // Used to re-trigger animation

  useEffect(() => {
    setKey(prevKey => prevKey + 1); // Change key to force re-render and re-animate
  }, [phase, duration]);

  const circleVariants = {
    idle: { scale: 0.8, opacity: 0.7 },
    inhale: { scale: 1.2, opacity: 1, transition: { duration: duration, ease: "easeInOut" } },
    hold: { scale: 1.2, opacity: 1, transition: { duration: duration, ease: "easeInOut" } }, // or slightly different visual for hold
    exhale: { scale: 0.8, opacity: 0.7, transition: { duration: duration, ease: "easeInOut" } },
    pause: { scale: 0.8, opacity: 0.7, transition: { duration: duration, ease: "easeInOut" } },
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-48 w-48 sm:h-56 sm:w-56 md:h-64 md:w-64 rounded-full bg-primary/10 relative overflow-hidden">
      <motion.div
        key={`${phase}-circle-${key}`}
        className="absolute w-full h-full rounded-full bg-primary/30"
        variants={circleVariants}
        initial="idle"
        animate={phase}
        aria-hidden="true"
      />
       <motion.div
        key={`${phase}-inner-circle-${key}`}
        className="absolute w-3/4 h-3/4 rounded-full bg-primary/20"
        variants={circleVariants}
        initial="idle"
        animate={phase}
        transition={{delay: 0.1, duration: duration}} 
        aria-hidden="true"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={`${text}-${key}`}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="z-10 text-lg sm:text-xl font-semibold text-center text-primary-foreground bg-primary/80 px-4 py-2 rounded-md shadow-md"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
