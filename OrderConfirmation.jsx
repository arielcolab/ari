import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { CheckCircle, Heart } from 'lucide-react';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const mascotUrl = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c370bd465_28F7DC15-363B-4095-BE17-CE7F55F65A67.png';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl('Home'));
    }, 8000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex flex-col items-center justify-center text-white p-4 text-center overflow-hidden relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-white drop-shadow-lg" />
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-bold mb-2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.p 
          className="text-lg opacity-90 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your delicious meal is being prepared with love <Heart className="inline w-4 h-4 text-pink-200" />
        </motion.p>

        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <img
            src={mascotUrl}
            alt="DishDash Chef"
            className="max-w-xs md:max-w-sm mx-auto drop-shadow-2xl"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Button
            onClick={() => navigate(createPageUrl('Home'))}
            className="bg-white text-red-600 hover:bg-gray-100 font-bold text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          >
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}