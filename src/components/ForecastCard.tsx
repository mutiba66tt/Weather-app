import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ForecastItem } from '@/hooks/useForecast';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ForecastCardProps {
  forecast: ForecastItem[];
  timezone?: number;
}

export const ForecastCard = ({ forecast, timezone = 0 }: ForecastCardProps) => {
  const getLocalTime = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return format(date, 'HH:mm');
  };

  const getLocalDate = (timestamp: number) => {
    const date = new Date((timestamp + timezone) * 1000);
    return format(date, 'EEE, MMM d');
  };

  // Group forecast by day
  const groupedForecast = forecast.reduce((acc, item) => {
    const dateKey = getLocalDate(item.dt);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, ForecastItem[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-8"
    >
      <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
        Upcoming Forecast
      </h2>
      
      <div className="space-y-6">
        {Object.entries(groupedForecast).map(([date, items], dayIndex) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + dayIndex * 0.1 }}
            className="glass-card rounded-2xl p-4 overflow-hidden"
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
              {date}
            </h3>
            
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 pb-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.dt}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + dayIndex * 0.1 + index * 0.05 }}
                    className="flex-shrink-0 w-24 p-3 rounded-xl bg-background/30 backdrop-blur-sm border border-border/20 hover:bg-background/50 transition-all duration-300"
                  >
                    <p className="text-xs text-muted-foreground text-center mb-2">
                      {getLocalTime(item.dt)}
                    </p>
                    
                    <div className="flex justify-center mb-2">
                      <WeatherIcon iconCode={item.icon} size={32} />
                    </div>
                    
                    <p className="text-lg font-bold text-foreground text-center">
                      {item.temp}°
                    </p>
                    
                    <p className="text-[10px] text-muted-foreground text-center capitalize truncate mt-1">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        <span className="text-[10px] text-muted-foreground">{item.pop}%</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Wind className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] text-muted-foreground">{item.wind_speed.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
