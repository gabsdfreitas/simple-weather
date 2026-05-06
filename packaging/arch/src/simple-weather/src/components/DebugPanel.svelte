<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { WeatherState, Season } from "../utils/weatherState";
  import type { TimePhase } from "../hooks/useDayCycle";
  import type { WeatherCondition } from "../api/weather";
  import { bounce } from "../utils/bounce";

  export let debugState: WeatherState;
  export let debugPhase: TimePhase;
  export let debugSeason: Season;
  export let debugCondition: WeatherCondition;
  export let debugTemp: number;

  const dispatch = createEventDispatcher();
  function close() {
    dispatch("close");
  }

  const states = [
    "clear-day",
    "clear-night",
    "partly-cloudy",
    "cloudy",
    "overcast",
    "fog",
    "drizzle",
    "rain",
    "heavy-rain",
    "thunderstorm",
    "snow",
    "blizzard",
    "dust",
    "sunrise",
    "sunset",
    "heatwave",
  ];
  const phases = [
    "night",
    "pre-dawn",
    "sunrise",
    "morning",
    "noon",
    "afternoon",
    "late-afternoon",
    "sunset",
    "dusk",
  ];
  const seasons = ["Spring", "Summer", "Autumn", "Winter"];
  const conditions = ["clear", "cloudy", "rain", "snow", "storm", "fog"];
</script>

<div class="modal-backdrop" on:click={close}>
  <div class="glass-panel settings-modal" on:click|stopPropagation>
    <h2 class="glass-text">God Mode</h2>

    <div class="setting-group">
      <span class="label glass-text-secondary">Atmosphere</span>
      <select class="glass-select glass-text" bind:value={debugState}>
        {#each states as s}
          <option value={s}>{s.replace("-", " ").toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Time of Day</span>
      <select class="glass-select glass-text" bind:value={debugPhase}>
        {#each phases as p}
          <option value={p}>{p.replace("-", " ").toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Season Overlay</span>
      <select class="glass-select glass-text" bind:value={debugSeason}>
        {#each seasons as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Card Icon</span>
      <select class="glass-select glass-text" bind:value={debugCondition}>
        {#each conditions as c}
          <option value={c}>{c.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Temperature ({debugTemp}°)</span>
      <input
        type="range"
        min="-30"
        max="50"
        bind:value={debugTemp}
        class="glass-slider"
      />
    </div>

    <button
      class="close-btn action-btn glass-text app-interactive"
      use:bounce
      on:click={close}>Close Sandbox</button
    >
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease-out;
  }
  .settings-modal {
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes scaleUp {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    text-align: center;
    margin-bottom: 0.5rem;
    color: #ffb300;
  }
  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .glass-select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
    font-family: inherit;
    font-weight: 600;
    cursor: pointer;
    outline: none;
  }
  .glass-select option {
    background: #1a2a3a;
    color: white;
  }

  .glass-slider {
    width: 100%;
    -webkit-appearance: none;
    background: transparent;
    margin: 10px 0;
  }
  .glass-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .glass-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
    margin-top: -7px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  }

  .action-btn {
    padding: 0.75rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    border: 2px solid var(--glass-border);
  }
</style>
