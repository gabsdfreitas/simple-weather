export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  return unit === 'F' ? (celsius * 9) / 5 + 32 : celsius;
}

export function convertSpeed(kmh: number, unit: 'km/h' | 'mph'): number {
  return unit === 'mph' ? kmh * 0.621371 : kmh;
}