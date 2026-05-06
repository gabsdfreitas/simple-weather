// src/api/weather.ts
export interface Coordinates { lat: number; lon: number; name?: string; }
export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';

export interface CurrentWeather {
  temp: number; feelsLike: number; humidity: number; windSpeed: number;
  condition: WeatherCondition; isDay: boolean; code: number;
}

export interface HourlyForecast { time: string; temp: number; condition: WeatherCondition; precip: number; }
export interface DailyForecast { date: string; maxTemp: number; minTemp: number; condition: WeatherCondition; precip: number; }

export interface WeatherData {
  current: CurrentWeather; hourly: HourlyForecast[]; daily: DailyForecast[]; lastUpdated: number;
  sunrise: string; sunset: string; 
  utcOffsetSeconds: number;
}

export interface GeocodingResult {
  id: number; name: string; admin1?: string; country: string; latitude: number; longitude: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000;

function normalizeCondition(wmoCode: number): WeatherCondition {
  if (wmoCode === 0 || wmoCode === 1) return 'clear';
  if (wmoCode === 2 || wmoCode === 3) return 'cloudy';
  if (wmoCode >= 45 && wmoCode <= 48) return 'fog';
  if (wmoCode >= 51 && wmoCode <= 67) return 'rain';
  if (wmoCode >= 71 && wmoCode <= 86) return 'snow';
  if (wmoCode >= 95 && wmoCode <= 99) return 'storm';
  return 'clear';
}

export async function fetchWeather(lat: number, lon: number, forceRefresh = false): Promise<WeatherData> {
  const cacheKey = `weather_v4_${lat.toFixed(2)}_${lon.toFixed(2)}`; 
  
  if (!forceRefresh) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsedCache = JSON.parse(cached) as WeatherData;
      if (Date.now() - parsedCache.lastUpdated < CACHE_TTL_MS) {
        return parsedCache;
      }
    }
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  const weatherData: WeatherData = {
    current: {
      temp: data.current.temperature_2m, feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m, windSpeed: data.current.wind_speed_10m,
      condition: normalizeCondition(data.current.weather_code), isDay: data.current.is_day === 1,
      code: data.current.weather_code
    },
    hourly: data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time, temp: data.hourly.temperature_2m[index], 
      condition: normalizeCondition(data.hourly.weather_code[index]),
      precip: data.hourly.precipitation_probability[index]
    })),
    daily: data.daily.time.slice(0, 7).map((date: string, index: number) => ({
      date, maxTemp: data.daily.temperature_2m_max[index], minTemp: data.daily.temperature_2m_min[index],
      condition: normalizeCondition(data.daily.weather_code[index]),
      precip: data.daily.precipitation_probability_max[index]
    })),
    sunrise: data.daily.sunrise[0], 
    sunset: data.daily.sunset[0],   
    utcOffsetSeconds: data.utc_offset_seconds,
    lastUpdated: Date.now(),
  };

  localStorage.setItem(cacheKey, JSON.stringify(weatherData));
  return weatherData;
}

export async function searchCity(query: string): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch location data');
  const data = await response.json();
  return data.results || [];
}