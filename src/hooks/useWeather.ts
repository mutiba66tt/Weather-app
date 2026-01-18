import { useState, useEffect } from 'react';

const API_KEY = '7114127368ced20d130b6c62caf7e200';

export interface WeatherData {
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  main: string;
  wind_speed: number;
  wind_deg: number;
  visibility: number;
  clouds: number;
  sunrise: number;
  sunset: number;
  timezone: number;
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = (latitude: number | null, longitude: number | null): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        setWeather({
          name: data.name,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          temp_min: Math.round(data.main.temp_min),
          temp_max: Math.round(data.main.temp_max),
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          main: data.weather[0].main,
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg,
          visibility: data.visibility / 1000, // Convert to km
          clouds: data.clouds.all,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          timezone: data.timezone,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
};
