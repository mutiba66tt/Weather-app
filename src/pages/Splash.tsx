import { motion } from 'framer-motion';
import { Cloud, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) return;
      navigate(user ? '/dashboard' : '/login', { replace: true });
    }, 1800);
    return () => clearTimeout(t);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen sky-gradient flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-32 h-32 text-yellow-400/80" strokeWidth={1.2} />
        </motion.div>
        <motion.div
          initial={{ x: -10 }}
          animate={{ x: 10 }}
          transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="relative z-10"
        >
          <Cloud className="w-40 h-40 text-white drop-shadow-2xl" strokeWidth={1.4} />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-10 text-5xl md:text-6xl font-bold text-gradient tracking-tight"
      >
        SkyWeather
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-3 text-muted-foreground text-sm tracking-widest uppercase"
      >
        Real-time forecast at your fingertips
      </motion.p>
    </div>
  );
};

export default Splash;
