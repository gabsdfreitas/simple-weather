// src/utils/weatherState.ts

export type WeatherState = 
  | 'clear-day' | 'clear-night' | 'partly-cloudy' | 'cloudy' 
  | 'overcast' | 'fog' | 'drizzle' | 'rain' | 'heavy-rain' 
  | 'thunderstorm' | 'snow' | 'blizzard' | 'dust' 
  | 'sunrise' | 'sunset' | 'heatwave';

export type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';

function getCurrentSeason(lat: number, date: Date): Season {
  const month = date.getMonth(); // 0-11
  const isNorthernHemisphere = lat >= 0;

  if (month >= 2 && month <= 4) { // Mar, Apr, May
    return isNorthernHemisphere ? 'Spring' : 'Autumn';
  } else if (month >= 5 && month <= 7) { // Jun, Jul, Aug
    return isNorthernHemisphere ? 'Summer' : 'Winter';
  } else if (month >= 8 && month <= 10) { // Sep, Oct, Nov
    return isNorthernHemisphere ? 'Autumn' : 'Spring';
  } else { // Dec, Jan, Feb
    return isNorthernHemisphere ? 'Winter' : 'Summer';
  }
}

export function getWeatherState(
  code: number, 
  tempC: number, 
  lat: number, // Required for season
  currentDate: Date, 
  sunriseStr: string, 
  sunsetStr: string,
  isDay: boolean
): { state: WeatherState, timeOfDay: TimeOfDay, season: Season } {
  
  const sunrise = new Date(sunriseStr);
  const sunset = new Date(sunsetStr);
  
  // 1. Calculate Season
  const season = getCurrentSeason(lat, currentDate);

  // 2. Calculate Time of Day Modifier
  const hour = currentDate.getHours();
  let timeOfDay: TimeOfDay = 'noon';
  if (!isDay) timeOfDay = 'night';
  else if (hour >= 6 && hour < 10) timeOfDay = 'morning';
  else if (hour >= 10 && hour < 15) timeOfDay = 'noon';
  else if (hour >= 15 && hour < 18) timeOfDay = 'afternoon';
  else if (hour >= 18 && hour < 20) timeOfDay = 'evening';

  // 3. Check Sunrise / Sunset windows (±30 mins)
  const windowMs = 30 * 60 * 1000;
  const timeDiffSunrise = Math.abs(currentDate.getTime() - sunrise.getTime());
  const timeDiffSunset = Math.abs(currentDate.getTime() - sunset.getTime());

  if (timeDiffSunrise <= windowMs) return { state: 'sunrise', timeOfDay: 'morning', season };
  if (timeDiffSunset <= windowMs) return { state: 'sunset', timeOfDay: 'evening', season };

  // 4. Check Heatwave (Temp > 38C and relatively clear)
  if (tempC > 38 && [0, 1, 2, 3].includes(code)) {
    return { state: 'heatwave', timeOfDay, season };
  }

  // 5. WMO Mapping
  let state: WeatherState = 'clear-day';
  
  switch (true) {
    case code === 0:
      state = isDay ? 'clear-day' : 'clear-night'; break;
    case [1, 2].includes(code):
      state = 'partly-cloudy'; break;
    case code === 3:
      state = isDay ? 'cloudy' : 'overcast'; break; 
    case [45, 48].includes(code):
      state = 'fog'; break;
    case [51, 53, 55, 56, 57].includes(code):
      state = 'drizzle'; break;
    case [61, 63, 66, 80, 81].includes(code):
      state = 'rain'; break;
    case [65, 67, 82].includes(code):
      state = 'heavy-rain'; break;
    case [71, 73, 75, 77, 85, 86].includes(code):
      state = tempC < -5 && code >= 75 ? 'blizzard' : 'snow'; break;
    case [95, 96, 99].includes(code):
      state = 'thunderstorm'; break;
    default:
      state = isDay ? 'clear-day' : 'clear-night';
  }

  return { state, timeOfDay, season };
}