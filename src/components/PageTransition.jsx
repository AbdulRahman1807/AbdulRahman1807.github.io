import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      {/* Orange wipe bar: sweeps from right (100%) to left (-100%) */}
      {!prefersReducedMotion && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "var(--accent-primary)",
            zIndex: 9990,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Page content: fade in/out */}
      <motion.div
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}