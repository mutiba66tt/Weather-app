import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, User as UserIcon, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeather } from '@/hooks/useWeather';
import { useForecast } from '@/hooks/useForecast';
import { WeatherCard } from '@/components/WeatherCard';
import { ForecastCard } from '@/components/ForecastCard';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const API_KEY = '7114127368ced20d130b6c62caf7e200';
const RECENTS_KEY = 'recent_searches';

interface Coords { lat: number; lon: number; label: string }

const Dashboard = () => {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [recents, setRecents] = useState<string[]>(
    () => JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]')
  );

  // When geolocation resolves and no manual search yet, use it
  useEffect(() => {
    if (!coords && geo.latitude !== null && geo.longitude !== null) {
      setCoords({ lat: geo.latitude, lon: geo.longitude, label: 'Current location' });
    }
  }, [geo.latitude, geo.longitude, coords]);

  const { weather, loading: wL, error: wE } = useWeather(coords?.lat ?? null, coords?.lon ?? null);
  const { forecast, loading: fL, error: fE } = useForecast(coords?.lat ?? null, coords?.lon ?? null);

  const saveRecent = (city: string) => {
    const next = [city, ...recents.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, 6);
    setRecents(next);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  };

  const searchCity = async (city: string) => {
    const q = city.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${API_KEY}`
      );
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        toast.error('City not found');
        return;
      }
      const { lat, lon, name, country } = data[0];
      setCoords({ lat, lon, label: `${name}, ${country}` });
      saveRecent(name);
      setQuery('');
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const useMyLocation = () => {
    if (geo.latitude !== null && geo.longitude !== null) {
      setCoords({ lat: geo.latitude, lon: geo.longitude, label: 'Current location' });
    } else {
      toast.error(geo.error || 'Location unavailable');
    }
  };

  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem(RECENTS_KEY);
  };

  const isLoading = (geo.loading && !coords) || wL;
  const error = wE || fE;

  return (
    <div className="min-h-screen sky-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6 md:py-10 max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">SkyWeather</h1>
            <p className="text-xs text-muted-foreground">Real-time weather worldwide</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/profile')} aria-label="Profile">
            <UserIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Search bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); searchCity(query); }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any city..."
              className="pl-9 bg-background/60 backdrop-blur"
            />
          </div>
          <Button type="submit" disabled={searching}>
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={useMyLocation} aria-label="Use my location">
            <MapPin className="w-4 h-4" />
          </Button>
        </form>

        {/* Recents */}
        {recents.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Recent:</span>
            {recents.map((c) => (
              <button
                key={c}
                onClick={() => searchCity(c)}
                className="px-3 py-1 text-xs rounded-full bg-secondary/60 hover:bg-secondary text-foreground transition"
              >
                {c}
              </button>
            ))}
            <button onClick={clearRecents} className="text-muted-foreground hover:text-foreground" aria-label="Clear recents">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isLoading && <LoadingState />}
        {error && !isLoading && (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        )}
        {weather && !isLoading && !error && (
          <>
            <WeatherCard weather={weather} />
            {!fL && forecast.length > 0 && (
              <ForecastCard forecast={forecast} timezone={weather.timezone} />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
