
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
        <motion.h1 
          className="text-3xl md:text-5xl font-bold mb-6 text-white"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <span className="text-arcu-purple">AR</span>
          <span className="text-arcu-orange">CU</span>
          <span className="text-white"> DAYS 2025</span>
        </motion.h1>
        
        <motion.h2
          className="text-xl md:text-2xl mb-6 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          USTP Claveria Arts and Culture Festival
        </motion.h2>
        
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* ArCu Logo Petals */}
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-full h-full" 
                style={{ 
                  transform: `rotate(${i * 45}deg)`,
                }}
              >
                <div 
                  className={`w-10 h-16 mx-auto rounded-t-full rounded-b-full ${
                    i % 4 === 0 ? 'bg-arcu-purple' : 
                    i % 4 === 1 ? 'bg-arcu-green' : 
                    i % 4 === 2 ? 'bg-arcu-yellow' : 'bg-arcu-orange'
                  }`}
                  style={{ transformOrigin: 'bottom center' }}
                ></div>
              </div>
            ))}
            
            {/* Center Logo Text */}
            <div className="z-10 bg-white rounded-full w-28 h-28 flex items-center justify-center">
              <div>
                <div className="font-bold text-2xl">
                  <span className="text-arcu-purple">AR</span>
                  <span className="text-arcu-orange">CU</span>
                </div>
                <div className="text-arcu-brown text-xs font-semibold">DAYS 2025</div>
              </div>
            </div>
          </div>
        </motion.div>
        
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
