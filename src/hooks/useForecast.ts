import { useState, useEffect } from 'react';

const API_KEY = '7114127368ced20d130b6c62caf7e200';

export interface ForecastItem {
  dt: number;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  pop: number; // Probability of precipitation
}

interface UseForecastReturn {
  forecast: ForecastItem[];
  loading: boolean;
  error: string | null;
}

export const useForecast = (latitude: number | null, longitude: number | null): UseForecastReturn => {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      setLoading(false);
      return;
    }

    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using the free 5-day/3-hour forecast API since hourly requires pro subscription
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&cnt=24`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();

        const forecastData: ForecastItem[] = data.list.map((item: any) => ({
          dt: item.dt,
          temp: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          main: item.weather[0].main,
          wind_speed: item.wind.speed,
          pop: Math.round((item.pop || 0) * 100),
        }));

        setForecast(forecastData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [latitude, longitude]);

  return { forecast, loading, error };
};
