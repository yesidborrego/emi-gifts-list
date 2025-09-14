"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InvitationModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md p-8 mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{
              // fontFamily: "'Playfair Display', serif",
              border: "2px solid #f64782",
              backdropFilter: "blur(10px)",
            }}
          >
            <motion.div
              className="mb-2 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-6xl">👧</p>
              <p className="mt-2 text-5xl font-extrabold text-[#f64782] tracking-wider">
                EMILIANA
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center text-lg text-foreground"
            >
              <p className="italic">
                Todavía no sé caminar ni hablar, pero ya sé organizar una fiesta
                (con ayuda de mi mamita, claro). Te espero en mi Baby Shower
                para celebrar juntos mi llegada 🎉
              </p>
            </motion.div>

            <motion.div
              className="my-4 space-y-3 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center text-foreground">
                <Calendar className="mr-3 h-6 w-6 text-[#f64782]" />
                <span>12 de octubre de 2025</span>
              </div>
              <div className="flex items-center text-foreground">
                <Clock className="mr-3 h-6 w-6 text-[#f64782]" />
                <span>5:00 pm</span>
              </div>
              <div className="flex items-center text-foreground">
                <MapPin className="mr-3 h-6 w-6 text-[#f64782]" />
                <span>Calle 19 N 13 16, Villa Josefa – Palmar de Varela</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-foreground"
            >
              <p>
                Tu presencia es el mejor regalo, pero si deseas obsequiarnos
                algo, hemos preparado una lista para facilitar tu elección.
              </p>
              <button
                onClick={closeModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 w-1/2 rounded-md h-10 mt-4"
                // className="absolute top-4 right-4 text-[#989fb4] hover:text-[#f64782] transition-colors duration-300"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvitationModal;
