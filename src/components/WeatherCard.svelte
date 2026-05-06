<script lang="ts">
  import type { CurrentWeather } from "../api/weather";
  import type { Season } from "../utils/weatherState";
  import WeatherIcon from "./WeatherIcon.svelte";
  import { settings } from "../hooks/useSettings";
  import { convertTemp, convertSpeed } from "../utils/units";
  // Use centralized metrics styles, which now rely on high-contrast adaptive text variables
  import "../styles/metrics.css";

  export let current: CurrentWeather;
  export let location: string;
  export let season: Season;

  $: temp = Math.round(convertTemp(current.temp, $settings.tempUnit));
  $: feelsLike = Math.round(convertTemp(current.feelsLike, $settings.tempUnit));
  $: wind = convertSpeed(current.windSpeed, $settings.speedUnit).toFixed(1);

  const seasonIcons = {
    Spring: "🌱",
    Summer: "☀️",
    Autumn: "🍂",
    Winter: "❄️",
  };
</script>

<div class="glass-card weather-card">
  <div class="header"><h2 class="glass-text">{location}</h2></div>

  <div class="main-display">
    <WeatherIcon condition={current.condition} isDay={current.isDay} />
    <div class="temperature">
      <span class="value tabular-nums glass-text">{temp}</span>
      <span class="unit glass-text-secondary">°{$settings.tempUnit}</span>
    </div>
    <div class="condition glass-text-secondary">
      {current.condition.toUpperCase()}
    </div>
  </div>

  <div class="metrics-flex">
    <div class="metric">
      <span class="label glass-text-secondary">Feels Like</span>
      <span class="value tabular-nums glass-text">{feelsLike}°</span>
    </div>
    <div class="metric humidity-metric">
      <span class="label glass-text-secondary">Humidity</span>
      <span class="value tabular-nums glass-text">{current.humidity}%</span>
    </div>
    <div class="metric">
      <span class="label glass-text-secondary">Wind</span>
      <span class="value tabular-nums glass-text"
        >{wind} {$settings.speedUnit}</span
      >
    </div>
    <div class="metric season-metric">
      <span class="label glass-text-secondary">Season</span>
      <div class="value season-value glass-text">
        <span class="season-icon">{seasonIcons[season]}</span>
        {season}
      </div>
    </div>
  </div>
</div>

<style>
  .weather-card {
    padding: 2rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .header {
    text-align: center;
  }
  .header h2 {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  .main-display {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
  }
  .temperature {
    display: flex;
    align-items: flex-start;
  }
  .temperature .value {
    font-size: 5rem;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -2px;
  }
  .temperature .unit {
    font-size: 2rem;
    font-weight: 600;
    margin-top: 0.5rem;
  }
  .condition {
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 2px;
  }
</style>
