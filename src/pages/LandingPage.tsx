
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
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
        style={{ backgroundImage: "url('/lovable-uploads/latest-upload.png')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <motion.div 
        className="z-10 text-center p-8 bg-black/30 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl max-w-3xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* ArCu Logo */}
          <img 
            src="/lovable-uploads/13e6d360-b240-429c-9d62-8e78ffd8fdcb.png" 
            alt="ArCu Days 2025 Logo" 
            className="w-64 h-64 object-contain"
          />
        </motion.div>
        
        <motion.h2
          className="text-xl md:text-2xl mb-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          USTP Claveria Arts and Culture Festival
        </motion.h2>
        
        <motion.p
          className="text-white text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Arts and Culture Festival Live Scoring Platform
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            onClick={handleEnter} 
            disabled={loading}
            className="bg-arcu-purple hover:bg-arcu-purple/80 text-white font-bold text-lg"
          >
            {loading ? "Loading..." : "Enter Live Scoreboard"}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
