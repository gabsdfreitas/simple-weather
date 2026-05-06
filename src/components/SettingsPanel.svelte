<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { settings, type LocationContext } from "../hooks/useSettings";
  import { bounce } from "../utils/bounce";

  export let currentCity: LocationContext | null = null;
  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }

  function setDefaultCity() {
    if (currentCity) $settings.defaultCity = currentCity;
  }
</script>

<div class="modal-backdrop" on:click={close}>
  <div class="glass-panel settings-modal" on:click|stopPropagation>
    <h2 class="glass-text">Settings</h2>

    <div class="setting-group">
      <span class="label glass-text-secondary">Temperature Unit</span>
      <div class="sliding-pill app-interactive" use:bounce>
        <div class="pill-thumb" class:right={$settings.tempUnit === "F"}></div>

        <button
          on:click={() => ($settings.tempUnit = "C")}
          class:active={$settings.tempUnit === "C"}
        >
          <span class="btn-text">°C</span>
        </button>
        <button
          on:click={() => ($settings.tempUnit = "F")}
          class:active={$settings.tempUnit === "F"}
        >
          <span class="btn-text">°F</span>
        </button>
      </div>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Wind Speed Unit</span>
      <div class="sliding-pill app-interactive" use:bounce>
        <div
          class="pill-thumb"
          class:right={$settings.speedUnit === "mph"}
        ></div>

        <button
          on:click={() => ($settings.speedUnit = "km/h")}
          class:active={$settings.speedUnit === "km/h"}
        >
          <span class="btn-text">km/h</span>
        </button>
        <button
          on:click={() => ($settings.speedUnit = "mph")}
          class:active={$settings.speedUnit === "mph"}
        >
          <span class="btn-text">mph</span>
        </button>
      </div>
    </div>

    <div class="setting-group">
      <span class="label glass-text-secondary">Default City</span>
      {#if $settings.defaultCity}
        <div class="current-default glass-text">
          {$settings.defaultCity.name}
        </div>
      {:else}
        <div class="current-default glass-text-secondary">None set</div>
      {/if}

      {#if currentCity && currentCity.name !== $settings.defaultCity?.name && !currentCity.name.includes("Debug")}
        <button
          class="action-btn glass-text app-interactive"
          use:bounce
          on:click={setDefaultCity}
        >
          Set {currentCity.name} as Default
        </button>
      {/if}
    </div>

    <button
      class="close-btn action-btn glass-text app-interactive"
      use:bounce
      on:click={close}>Close</button
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
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  }

  .settings-modal {
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
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
    font-weight: 600;
    text-align: center;
    margin-bottom: 0.5rem;
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

  .sliding-pill {
    position: relative;
    display: flex;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 999px;
    padding: 6px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .pill-thumb {
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 6px;
    width: calc(50% - 6px);
    background: rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    box-shadow:
      0 2px 10px rgba(0, 0, 0, 0.15),
      inset 0 2px 2px rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .pill-thumb.right {
    transform: translateX(100%);
  }

  .sliding-pill button {
    flex: 1;
    position: relative;
    z-index: 1;
    background: transparent;
    border: none;
    padding: 0.6rem 0;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-text {
    font-weight: 600;
    font-size: 1rem;
    color: var(--text-secondary);
    transition:
      color 0.3s ease,
      text-shadow 0.3s ease;
  }

  .sliding-pill button.active .btn-text {
    color: var(--text-primary);
    text-shadow: var(--text-shadow-glass);
  }

  .current-default {
    font-size: 1.1rem;
    font-weight: 600;
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

  .action-btn:hover {
    border-color: var(--glass-highlight);
  }
  .close-btn {
    margin-top: 1rem;
  }
</style>
