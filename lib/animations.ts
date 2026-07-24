import { Variants } from 'framer-motion'

/* ─── Basic Entrance Animations ─── */

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const slideInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export const scaleInBounce: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15 },
  },
}

/* ─── Container / Stagger ─── */

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

/* ─── Hover Interactions ─── */

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2, ease: 'easeOut' },
}

export const hoverLift = {
  whileHover: { y: -6, transition: { duration: 0.3, ease: 'easeOut' } },
  whileTap: { scale: 0.98 },
}

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.15)',
    transition: { duration: 0.3 },
  },
}

export const rotateHover = {
  whileHover: { rotate: 5 },
  transition: { duration: 0.2 },
}

/* ─── Card Animations ─── */

export const cardReveal: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ─── Page Transitions ─── */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
}

/* ─── Hero Specific ─── */

export const heroTextReveal: Variants = {
  initial: { opacity: 0, y: 60, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export const heroSubtextReveal: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

export const heroBadgeReveal: Variants = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
}

export const heroButtonReveal: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const heroStatsReveal: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

/* ─── Floating / Parallax ─── */

export const floatingVariant = (delay: number = 0, duration: number = 6) => ({
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  },
})

/* ─── Notification / Toast ─── */

export const notificationPop: Variants = {
  initial: { opacity: 0, scale: 0.5, y: -20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
}

/* ─── Cart Item ─── */

export const cartItemEnter: Variants = {
  initial: { opacity: 0, x: 60, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: 60,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

/* ─── Section Header ─── */

export const sectionHeaderReveal: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}
