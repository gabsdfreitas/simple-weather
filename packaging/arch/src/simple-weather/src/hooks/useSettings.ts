import { writable } from 'svelte/store';

export interface LocationContext {
  lat: number;
  lon: number;
  name: string;
}

export interface Settings {
  tempUnit: 'C' | 'F';
  speedUnit: 'km/h' | 'mph';
  defaultCity: LocationContext | null;
}

const defaultSettings: Settings = {
  tempUnit: 'C',
  speedUnit: 'km/h',
  defaultCity: null
};

// Safely load from localStorage (checks for browser environment)
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('simple_weather_settings') : null;
const initial = stored ? JSON.parse(stored) : defaultSettings;

export const settings = writable<Settings>(initial);

// Auto-subscribe and save any changes back to localStorage
settings.subscribe(value => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('simple_weather_settings', JSON.stringify(value));
  }
});