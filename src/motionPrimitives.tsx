import React from "react";
import { motion, type Variants } from "motion/react";

type Preset = "fade" | "slide" | "blur-sm" | "blur-slide";

const presets: Record<Preset, { container: Variants; item: Variants }> = {
  fade: {
    container: { visible: { transition: { staggerChildren: 0.04 } } },
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  },
  slide: {
    container: { visible: { transition: { staggerChildren: 0.04 } } },
    item: { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } },
  },
  "blur-sm": {
    container: { visible: { transition: { staggerChildren: 0.04 } } },
    item: { hidden: { opacity: 0, filter: "blur(3px)" }, visible: { opacity: 1, filter: "blur(0px)" } },
  },
  "blur-slide": {
    container: { visible: { transition: { staggerChildren: 0.04 } } },
    item: {
      hidden: { opacity: 0, y: 8, filter: "blur(3px)" },
      visible: { opacity: 1, y: 0, filter: "blur(0px)" },
    },
  },
};

export function AnimatedGroup({ children, className, preset = "fade" }: {
  children: React.ReactNode; className?: string; preset?: Preset;
}) {
  const variants = presets[preset];
  return (
    <motion.div className={className} initial="hidden" animate="visible" variants={variants.container}>
      {React.Children.map(children, (child) => (
        <motion.div className="motion-item" variants={variants.item} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function InView({ children, className, once = true }: {
  children: React.ReactNode; className?: string; once?: boolean;
}) {
  const canObserve = typeof IntersectionObserver !== "undefined";
  return (
    <motion.div
      className={className}
      initial={canObserve ? { opacity: 0, y: 10 } : false}
      {...(canObserve
        ? { whileInView: { opacity: 1, y: 0 }, viewport: { once, amount: 0.08 } }
        : { animate: { opacity: 1, y: 0 } })}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function TextEffect({ children, className, as = "h1" }: {
  children: string; className?: string; as?: "h1" | "h2" | "p";
}) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </Tag>
  );
}
