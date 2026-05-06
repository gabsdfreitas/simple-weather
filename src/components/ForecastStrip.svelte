<script lang="ts">
  import type { DailyForecast } from "../api/weather";
  import WeatherIcon from "./WeatherIcon.svelte";
  import { settings } from "../hooks/useSettings";
  import { convertTemp } from "../utils/units";

  export let daily: DailyForecast[];

  function formatDay(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  }
</script>

<div class="glass-panel forecast-strip">
  {#each daily as day}
    <div class="day-card">
      <span class="day-name glass-text">{formatDay(day.date)}</span>
      <div class="icon-wrapper">
        <WeatherIcon condition={day.condition} isDay={true} />
      </div>
      <div class="temps tabular-nums">
        <span class="hi glass-text"
          >{Math.round(convertTemp(day.maxTemp, $settings.tempUnit))}°</span
        >
        <span class="lo glass-text-secondary"
          >{Math.round(convertTemp(day.minTemp, $settings.tempUnit))}°</span
        >
      </div>
      <div class="precip tabular-nums">
        <svg viewBox="0 0 24 24" fill="currentColor" width="10" height="10">
          <path
            d="M12 21.5c-3.03 0-5.5-2.47-5.5-5.5 0-2.34 1.95-5.44 5.15-9.61.19-.24.52-.24.71 0 3.2 4.17 5.14 7.27 5.14 9.61 0 3.03-2.47 5.5-5.5 5.5zm0-13.43c-2.45 3.32-4 5.86-4 7.93 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.07-1.55-4.61-4-7.93z"
          />
        </svg>
        {day.precip}%
      </div>
    </div>
  {/each}
</div>

<style>
  .forecast-strip {
    display: flex;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    align-items: center;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .forecast-strip::-webkit-scrollbar {
    display: none;
  }
  .day-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 60px;
    flex: 1;
  }
  .day-name {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.9rem;
  }
  .icon-wrapper {
    transform: scale(0.6);
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -10px 0;
  }
  .temps {
    display: flex;
    gap: 0.5rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .precip {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 0.75rem;
    color: var(--text-secondary); /* Fixed: Removed hardcoded blue */
    font-weight: 600;
    text-shadow: var(--text-shadow-glass);
    transition:
      color 0.5s ease,
      text-shadow 0.5s ease;
  }
</style>
