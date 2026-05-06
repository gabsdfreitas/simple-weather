// src/hooks/useDayCycle.ts
import { writable, type Writable } from 'svelte/store';

export type TimePhase = 
  'night' | 'pre-dawn' | 'sunrise' | 'morning' | 'noon' | 
  'afternoon' | 'late-afternoon' | 'sunset' | 'dusk';

export interface DayCycleState {
  phase: TimePhase;
  sunPosition: { x: number; y: number };
  moonPosition: { x: number; y: number };
  starOpacity: number;
}

// Safely extracts the local hour from ISO strings without letting the browser warp it
function parseLocalHour(isoStr: string): number {
  if (!isoStr) return 6;
  const timePart = isoStr.split('T')[1];
  if (!timePart) return 6;
  const [hours, minutes] = timePart.split(':');
  return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
}

function getPhase(hour: number, sr: number, ss: number): TimePhase {
  if (hour >= sr - 2.25 && hour < sr - 0.75) return 'pre-dawn';
  if (hour >= sr - 0.75 && hour < sr + 0.75) return 'sunrise';
  if (hour >= sr + 0.75 && hour < 11.5) return 'morning';
  if (hour >= 11.5 && hour < 14.0) return 'noon';
  if (hour >= 14.0 && hour < ss - 2.25) return 'afternoon';
  if (hour >= ss - 2.25 && hour < ss - 0.75) return 'late-afternoon';
  if (hour >= ss - 0.75 && hour < ss + 0.75) return 'sunset';
  if (hour >= ss + 0.75 && hour < ss + 2.25) return 'dusk';
  return 'night';
}

export function useDayCycle(sunriseStr: string, sunsetStr: string, utcOffsetSeconds: number): { store: Writable<DayCycleState>, cleanup: () => void } {
  const store = writable<DayCycleState>({
    phase: 'noon',
    sunPosition: { x: 50, y: 100 },
    moonPosition: { x: 50, y: 100 },
    starOpacity: 0
  });

  function tick() {
    // Perfect Timezone Logic: Shift pure UTC time by the target city's offset
    const utcNow = Date.now();
    const targetNow = utcNow + (utcOffsetSeconds * 1000);
    const date = new Date(targetNow);
    const hour = date.getUTCHours() + date.getUTCMinutes() / 60;

    const sr = parseLocalHour(sunriseStr);
    const ss = parseLocalHour(sunsetStr);
    
    const phase = getPhase(hour, sr, ss);

    let sunProgress = (hour - sr) / (ss - sr);
    sunProgress = Math.max(0, Math.min(1, sunProgress));
    const sunAngle = sunProgress * Math.PI;
    const sunX = 15 + sunProgress * 70; 
    const sunY = 85 - Math.sin(sunAngle) * 72; 

    const moonHour = hour < sr ? hour + 24 : hour;
    const moonDuration = (sr + 24) - ss;
    let moonProgress = (moonHour - ss) / moonDuration;
    moonProgress = Math.max(0, Math.min(1, moonProgress));
    const moonAngle = moonProgress * Math.PI;
    const moonX = 15 + moonProgress * 70;
    const moonY = 85 - Math.sin(moonAngle) * 72;

    let starOpacity = 0;
    if (phase === 'night') starOpacity = 1;
    else if (phase === 'dusk') starOpacity = 0.6;
    else if (phase === 'pre-dawn') starOpacity = 0.4;

    store.set({
      phase,
      sunPosition: { x: sunX, y: sunY },
      moonPosition: { x: moonX, y: moonY },
      starOpacity
    });
  }

  tick(); 
  const interval = setInterval(tick, 60_000); 

  return { store, cleanup: () => clearInterval(interval) };
}