<script lang="ts">
  import { onMount } from "svelte";
  import type { WeatherState, Season } from "../utils/weatherState";
  import { useDayCycle, type TimePhase } from "../hooks/useDayCycle";
  import { getComposedOverrides } from "../utils/cycleWeatherCompose";

  import "../styles/weather-themes.css";
  import "../styles/particles.css";
  import "../styles/day-cycle.css";

  export let state: WeatherState;
  export let season: Season;
  export let sunriseStr: string;
  export let sunsetStr: string;
  export let utcOffsetSeconds: number = 0;

  let phase: TimePhase = "noon";
  let cleanup: (() => void) | null = null;
  let sunX = 50,
    sunY = 100,
    moonX = 50,
    moonY = 100,
    starOpacity = 0;

  $: {
    if (cleanup) cleanup();
    if (sunriseStr && sunsetStr) {
      const cycle = useDayCycle(sunriseStr, sunsetStr, utcOffsetSeconds);
      cleanup = cycle.cleanup;

      cycle.store.subscribe((data) => {
        phase = data.phase;
        sunX = data.sunPosition.x;
        sunY = data.sunPosition.y;
        moonX = data.moonPosition.x;
        moonY = data.moonPosition.y;
        starOpacity = data.starOpacity;
      });
    }
  }

  onMount(() => {
    return () => {
      if (cleanup) cleanup();
    };
  });

  $: overrides = getComposedOverrides(phase, state);

  $: numClouds =
    state === "partly-cloudy"
      ? 15
      : state === "cloudy" || state === "overcast"
        ? 35
        : state.includes("rain") || state === "thunderstorm"
          ? 25
          : 0;
  $: isNighttime = ["night", "pre-dawn", "dusk"].includes(phase);
  $: cloudType =
    state === "cloudy" ||
    state === "overcast" ||
    state.includes("rain") ||
    state === "thunderstorm" ||
    isNighttime
      ? "dark"
      : "light";

  $: numFogBands = state === "fog" ? 5 : 0;
  $: rainDrops =
    state.includes("rain") || state === "drizzle" || state === "thunderstorm"
      ? state === "heavy-rain" || state === "thunderstorm"
        ? 80
        : state === "rain"
          ? 50
          : 30
      : 0;
  $: snowFlakes =
    state === "snow" || state === "blizzard"
      ? state === "blizzard"
        ? 100
        : 60
      : 0;
  $: dustMotes = state === "dust" ? 40 : 0;

  function randomStyle(
    type: "rain" | "snow" | "star" | "dust" | "cloud" | "fog",
    index = 0,
  ) {
    const left = Math.random() * 100;
    let top = -10;
    if (type === "cloud") top = -10 + Math.random() * 85;
    else if (type === "fog") top = 30 + Math.random() * 70;
    else if (type === "star") top = Math.random() * 100;

    const delay = Math.random() * -25;
    let duration = 10;
    if (type === "cloud") duration = 25 + Math.random() * 20;
    else if (type === "fog") duration = 30 + Math.random() * 20;
    else if (type === "rain") duration = 0.6 + Math.random() * 0.8;
    else if (type === "snow") duration = 3 + Math.random() * 5;
    else if (type === "star") duration = 2 + Math.random() * 4;
    else if (type === "dust") duration = 10 + Math.random() * 15;

    const zIndex = type === "cloud" ? (index < numClouds * 0.4 ? 1 : 0) : 0;
    const baseSize = type === "cloud" ? 120 + Math.random() * 200 : 0;

    let opacity = 1;
    if (type === "cloud") opacity = zIndex === 1 ? 0.95 : 0.75;
    else if (type === "star") opacity = starOpacity;

    let size = baseSize;
    if (type === "snow") size = 3 + Math.random() * 5;
    else if (type === "star") size = 1 + Math.random() * 2;
    else if (type === "dust") size = 1 + Math.random() * 3;
    else if (type === "rain") size = 2 + Math.random() * 2;

    const width = type === "fog" ? 100 + Math.random() * 50 : size;
    const height =
      type === "cloud"
        ? size / 3
        : type === "fog"
          ? 15 + Math.random() * 10
          : size;

    let style = `left: ${left}%; top: ${top}%; animation-delay: ${delay}s; animation-duration: ${duration}s; width: ${width}px; height: ${height}px; opacity: ${opacity}; z-index: ${zIndex};`;
    if (type === "rain")
      style += ` width: ${size * 1.5}px; height: ${size * 12}px;`;
    return style;
  }

  $: dynamicVars = `
    --sun-x: ${sunX}vw; --sun-y: ${sunY}vh;
    --moon-x: ${moonX}vw; --moon-y: ${moonY}vh;
    --moon-opacity: ${overrides.moonOpacity};
    --star-opacity: ${starOpacity};
    ${overrides.filterStr ? `--cycle-filter: ${overrides.filterStr};` : ""}
  `;
</script>

<div
  class="sky-bg"
  data-weather={state}
  data-season={season}
  data-time={phase}
  style={dynamicVars}
>
  <div class="celestial-body sun"></div>
  <div class="celestial-body moon"></div>

  {#if state === "overcast"}
    <div class="particle-layer overcast-veil"></div>
  {/if}

  {#if numClouds > 0}
    <div class="particle-layer clouds">
      {#each Array(numClouds) as _, i}
        <div
          class="particle cloud"
          class:dark-cloud={cloudType === "dark"}
          class:light-cloud={cloudType === "light"}
          style={randomStyle("cloud", i)}
        >
          <div class="cloud-bubble cb1"></div>
          <div class="cloud-bubble cb2"></div>
          <div class="cloud-bubble cb3"></div>
        </div>
      {/each}
    </div>
  {/if}

  {#if numFogBands > 0}
    <div class="particle-layer fog">
      {#each Array(numFogBands) as _}
        <div class="particle fog-band" style={randomStyle("fog")}></div>
      {/each}
    </div>
  {/if}

  <div class="particle-layer stars">
    {#each Array(60) as _}
      <div class="particle star" style={randomStyle("star")}></div>
    {/each}
  </div>

  {#if rainDrops > 0}
    <div class="particle-layer rain">
      {#each Array(rainDrops) as _}
        <div class="particle rain-drop" style={randomStyle("rain")}></div>
      {/each}
    </div>
  {/if}

  {#if snowFlakes > 0}
    <div class="particle-layer snow">
      {#each Array(snowFlakes) as _}
        <div class="particle snow-flake" style={randomStyle("snow")}></div>
      {/each}
    </div>
  {/if}

  {#if dustMotes > 0}
    <div class="particle-layer dust">
      {#each Array(dustMotes) as _}
        <div class="particle dust-mote" style={randomStyle("dust")}></div>
      {/each}
    </div>
  {/if}

  {#if state === "thunderstorm"}
    <div class="thunder-flash"></div>
  {/if}
</div>

<div
  class="app-content-layer"
  style="--glass-blur-offset: {overrides.glassBlurOffset}px"
>
  <slot />
</div>

<style>
  .sky-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }
  .overcast-veil {
    background: rgba(180, 180, 180, 0.4);
    filter: blur(100px);
    z-index: 0;
  }
  .app-content-layer {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
