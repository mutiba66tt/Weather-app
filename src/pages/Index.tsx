import { motion } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useForecast } from '@/hooks/useForecast';
import { WeatherCard } from '@/components/WeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';

const Index = () => {
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather(latitude, longitude);
  const { forecast, loading: forecastLoading, error: forecastError } = useForecast(latitude, longitude);

  const isLoading = geoLoading || weatherLoading;
  const error = geoError || weatherError || forecastError;

  return (
    <div className="min-h-screen sky-gradient overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
            Weather Now
          </h1>
          <p className="text-muted-foreground text-sm">
            Real-time weather for your location
          </p>
        </motion.header>

        {isLoading && <LoadingState />}
        
        {error && !isLoading && (
          <ErrorState 
            message={error} 
            onRetry={() => window.location.reload()}
          />
        )}
        
        {weather && !isLoading && !error && (
          <>
            <WeatherCard weather={weather} />
            {!forecastLoading && forecast.length > 0 && (
              <ForecastCard forecast={forecast} timezone={weather.timezone} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <p className="text-xs text-muted-foreground/50">
          Powered by OpenWeatherMap
        </p>
      </motion.footer>
    </div>
  );
};

export default Index;
