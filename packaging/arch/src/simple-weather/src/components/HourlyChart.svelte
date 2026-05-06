<script lang="ts">
  import type { HourlyForecast } from "../api/weather";
  import { settings } from "../hooks/useSettings";
  import { convertTemp } from "../utils/units";

  export let hourly: HourlyForecast[];

  const width = 800;
  const height = 180;
  const padding = 20;
  const chartHeight = 140;

  $: convertedHourly = hourly.map((h) => ({
    ...h,
    temp: convertTemp(h.temp, $settings.tempUnit),
  }));

  $: temps = convertedHourly.map((h) => h.temp);
  $: minTemp = Math.min(...temps) - 2;
  $: maxTemp = Math.max(...temps) + 2;
  $: range = maxTemp - minTemp || 1;

  $: points = convertedHourly.map((h, i) => {
    const x =
      padding + i * ((width - padding * 2) / (convertedHourly.length - 1));
    const y =
      chartHeight -
      padding -
      ((h.temp - minTemp) / range) * (chartHeight - padding * 2);
    return `${x},${y}`;
  });

  $: pathData = points.length > 0 ? `M ${points.join(" L ")}` : "";

  function formatHour(timeStr: string): string {
    return new Date(timeStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }
</script>

<div class="glass-panel chart-container">
  <h3 class="glass-text">24-Hour Forecast</h3>

  <div class="svg-wrapper">
    <svg viewBox="0 0 {width} {height}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--glass-highlight)" />
          <stop offset="100%" stop-color="#ffffff" />
        </linearGradient>
        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.4)" />
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
        </linearGradient>
      </defs>

      {#if points.length > 0}
        <path
          d="{pathData} L {width -
            padding},{chartHeight} L {padding},{chartHeight} Z"
          fill="url(#area-gradient)"
        />
      {/if}

      <path
        d={pathData}
        fill="none"
        stroke="url(#line-gradient)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="glow-line"
      />

      {#each convertedHourly as h, i}
        {@const x =
          padding + i * ((width - padding * 2) / (convertedHourly.length - 1))}
        {@const y =
          chartHeight -
          padding -
          ((h.temp - minTemp) / range) * (chartHeight - padding * 2)}

        {#if i % 3 === 0}
          <circle cx={x} cy={y} r="4" fill="#ffffff" />
          <text
            {x}
            y={y - 12}
            text-anchor="middle"
            fill="var(--text-primary)"
            class="tabular-nums chart-text"
          >
            {Math.round(h.temp)}°
          </text>
          <text
            {x}
            y={chartHeight + 15}
            text-anchor="middle"
            fill="var(--text-secondary)"
            class="chart-label"
          >
            {formatHour(h.time)}
          </text>
          <text
            {x}
            y={chartHeight + 30}
            text-anchor="middle"
            fill="var(--text-secondary)"
            class="chart-label precip-label tabular-nums"
          >
            {h.precip}%
          </text>
        {/if}
      {/each}
    </svg>
  </div>
</div>

<style>
  .chart-container {
    padding: 1.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }
  .svg-wrapper {
    width: 100%;
    height: 180px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .svg-wrapper::-webkit-scrollbar {
    display: none;
  }
  svg {
    width: 100%;
    height: 100%;
    min-width: 600px;
    overflow: visible;
  }
  .glow-line {
    filter: drop-shadow(0 4px 6px rgba(255, 255, 255, 0.3));
  }
  .chart-text {
    font-size: 12px;
    font-weight: 600;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  }
  .chart-label {
    font-size: 10px;
    font-weight: 600;
  }
  .precip-label {
    text-shadow: var(--text-shadow-glass);
    transition: fill 0.5s ease;
  }
</style>
