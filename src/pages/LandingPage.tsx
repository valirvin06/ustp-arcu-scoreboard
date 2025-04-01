
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnter = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/scoreboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative bg-gradient-to-br from-ustp to-ustp-dark overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      <motion.div 
        className="z-10 text-center p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-6 text-white"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to USTP Claveria ArCu Days 2025
        </motion.h1>
        
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-40 h-40 mx-auto mb-4 bg-ustp-gold rounded-full flex items-center justify-center">
            <span className="text-ustp text-6xl font-bold">USTP</span>
          </div>
          <p className="text-white text-lg md:text-xl">Arts and Culture Festival Live Scoring Platform</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            onClick={handleEnter} 
            disabled={loading}
            className="bg-ustp-gold hover:bg-amber-500 text-ustp font-bold text-lg"
          >
            {loading ? "Loading..." : "Enter Live Scoreboard"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
