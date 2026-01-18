import { motion } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Moon,
  CloudSun,
  CloudMoon
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
}

export const WeatherIcon = ({ iconCode, size = 120 }: WeatherIconProps) => {
  const isNight = iconCode.includes('n');
  
  const getIcon = () => {
    const code = iconCode.slice(0, 2);
    
    switch (code) {
      case '01': // Clear
        return isNight ? Moon : Sun;
      case '02': // Few clouds
        return isNight ? CloudMoon : CloudSun;
      case '03': // Scattered clouds
      case '04': // Broken/overcast clouds
        return Cloud;
      case '09': // Shower rain
      case '10': // Rain
        return CloudRain;
      case '11': // Thunderstorm
        return CloudLightning;
      case '13': // Snow
        return CloudSnow;
      case '50': // Mist/fog
        return CloudFog;
      default:
        return Sun;
    }
  };

  const Icon = getIcon();
  const isSunny = iconCode.startsWith('01') && !isNight;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.2 
      }}
      className="relative"
    >
      <motion.div
        animate={isSunny ? { rotate: 360 } : { y: [0, -5, 0] }}
        transition={isSunny ? { 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon 
          size={size} 
          className={`
            ${isSunny ? 'text-weather-icon drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]' : ''}
            ${isNight && iconCode.startsWith('01') ? 'text-blue-200 drop-shadow-[0_0_25px_rgba(191,219,254,0.5)]' : ''}
            ${!isSunny && !isNight ? 'text-foreground/80' : ''}
          `}
          strokeWidth={1.5}
        />
      </motion.div>
      
      {/* Glow effect for sunny weather */}
      {isSunny && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full bg-weather-icon/20 blur-3xl" />
        </motion.div>
      )}
    </motion.div>
  );
};
