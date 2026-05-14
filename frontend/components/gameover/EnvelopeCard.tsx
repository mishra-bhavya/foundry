"use client";

import { motion } from "framer-motion";
import styles from "./EnvelopeCard.module.css";

type EnvelopeCardProps = {
  title: string;
  isOpen: boolean;
  isDimmed?: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

export default function EnvelopeCard({
  title,
  isOpen,
  isDimmed,
  onOpen,
  onClose,
  children,
}: EnvelopeCardProps) {
  return (
    <motion.div
      layout
      className={`${styles.envelope} ${
        isDimmed ? styles.dimmed : ""
      }`}

      onClick={() => {
        if (!isOpen) onOpen();
      }}
      animate={{
        scale: isOpen ? 1.45 : 1,
        top: isOpen ? "50%" : "0%",
        left: isOpen ? "50%" : "0%",
        x: isOpen ? "-50%" : "0%",
        y: isOpen ? "-50%" : "0%",
        zIndex: isOpen ? 999 : 1,
      }}
      style={{
        position: isOpen ? "fixed" : "relative",
      }}
      transition={{
        duration: 0.35,
      }}
    >
      {/* FLAP */}
      <motion.div
        className={styles.flap}
        animate={{
          rotateX: isOpen ? 180 : 0,
        }}
        transition={{
          duration: 0.5,
        }}
      />

      {/* WAX SEAL */}
      {!isOpen && (
        <motion.div
          className={styles.seal}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.4,
          }}
        />
      )}

      {/* TITLE */}
      <div className={styles.title}>
        {title}
      </div>

      {/* PAPER */}
      <motion.div
        className={styles.paper}
        animate={{
          bottom: isOpen ? "6%" : "-100%",
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.45,
        }}
      >
        <button
          className={styles.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>

        <div className={styles.paperContent}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}