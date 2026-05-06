// src/utils/cycleWeatherCompose.ts
import type { TimePhase } from '../hooks/useDayCycle';
import type { WeatherState } from './weatherState';

export interface ComposedWeatherOverrides {
  filterStr: string | null;
  glassBlurOffset: number;
  moonOpacity: number;
}

export function getComposedOverrides(phase: TimePhase, weather: WeatherState): ComposedWeatherOverrides {
  let filterStr: string | null = null;
  let glassBlurOffset = 0;
  let moonOpacity = 1;

  if (weather === 'fog') {
    glassBlurOffset = -4; 
  }

  if (weather === 'heavy-rain' && (phase === 'sunset' || phase === 'dusk')) {
    filterStr = 'brightness(0.75) saturate(0.8)';
  }

  const isNightPhase = ['night', 'pre-dawn', 'dusk'].includes(phase);
  
  // FIXED: Strictly enforce moon visibility
  if (!isNightPhase) {
    moonOpacity = 0; // Guarantees no overlap with the sun during the day
  } else if (weather !== 'clear-night') {
    moonOpacity = 0.2; // Dimly visible through clouds/rain
  } else {
    moonOpacity = 1; // Crisp and bright on clear nights
  }

  return { filterStr, glassBlurOffset, moonOpacity };
}