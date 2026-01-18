import { motion } from 'framer-motion';
import { Droplets, Wind, Eye, Gauge, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '@/hooks/useWeather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  weather: WeatherData;
}

const formatTime = (timestamp: number, timezone: number) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const stats = [
    { icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${weather.wind_speed} m/s` },
    { icon: Eye, label: 'Visibility', value: `${weather.visibility} km` },
    { icon: Gauge, label: 'Pressure', value: `${weather.pressure} hPa` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card p-8 md:p-12 w-full max-w-2xl mx-auto"
    >
      {/* Location */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          {weather.name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {weather.country}
        </p>
      </motion.div>

      {/* Main Weather Display */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <WeatherIcon iconCode={weather.icon} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="text-center"
        >
          <p className="text-8xl md:text-9xl font-light text-gradient tracking-tighter">
            {weather.temp}°
          </p>
          <p className="text-xl text-muted-foreground capitalize mt-2">
            {weather.description}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Feels like {weather.feels_like}°C
          </p>
        </motion.div>
      </div>

      {/* High/Low */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-8 mb-8"
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">High</p>
          <p className="text-xl font-medium text-foreground">{weather.temp_max}°</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Low</p>
          <p className="text-xl font-medium text-foreground">{weather.temp_min}°</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="bg-secondary/50 rounded-2xl p-4 text-center"
          >
            <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-lg font-medium text-foreground mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Sunrise/Sunset */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center gap-12"
      >
        <div className="flex items-center gap-3">
          <Sunrise className="w-5 h-5 text-weather-warm" />
          <div>
            <p className="text-xs text-muted-foreground">Sunrise</p>
            <p className="text-sm font-medium text-foreground">
              {formatTime(weather.sunrise, weather.timezone)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sunset className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Sunset</p>
            <p className="text-sm font-medium text-foreground">
              {formatTime(weather.sunset, weather.timezone)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
