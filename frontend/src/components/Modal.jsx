import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { delay: 0.1 } },
};

export default function Modal({ show, onClose, children }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {show && (
        <motion.div
          className="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 10,
              padding: 20,
              maxWidth: 500,
              width: '90%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
