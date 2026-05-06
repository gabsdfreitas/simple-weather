<script lang="ts">
  export let condition: "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog" =
    "clear";
  export let isDay: boolean = true;
</script>

<div class="icon-container" data-condition={condition}>
  {#if condition === "clear"}
    {#if isDay}
      <div class="sun"></div>
    {:else}
      <div class="moon"></div>
    {/if}
  {:else if condition === "cloudy"}
    <div class="cloud"></div>
    {#if isDay}<div class="sun sun-peek"></div>{/if}
  {:else if condition === "rain"}
    <div class="cloud dark-cloud"></div>
    <div class="rain-drops">
      <div class="drop d1"></div>
      <div class="drop d2"></div>
      <div class="drop d3"></div>
    </div>
  {:else if condition === "snow"}
    <div class="cloud"></div>
    <div class="snow-flakes">
      <div class="flake"></div>
      <div class="flake"></div>
      <div class="flake"></div>
    </div>
  {:else if condition === "storm"}
    <div class="cloud dark-cloud"></div>
    <div class="lightning"></div>
  {:else if condition === "fog"}
    <div class="cloud fog-cloud"></div>
    <div class="fog-lines">
      <div class="f-line"></div>
      <div class="f-line"></div>
    </div>
  {/if}
</div>

<style>
  .icon-container {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .sun {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff9c4, #ffb300);
    box-shadow:
      0 0 24px rgba(255, 179, 0, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.8);
  }

  .moon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: transparent;
    box-shadow: -10px 10px 0 0 #e0e0e0;
    filter: drop-shadow(0 0 12px rgba(224, 224, 224, 0.4));
  }

  .cloud {
    width: 60px;
    height: 20px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.9);
    position: relative;
    z-index: 2;
    box-shadow:
      0 8px 16px rgba(0, 0, 0, 0.1),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  }

  .cloud::before,
  .cloud::after {
    content: "";
    position: absolute;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
  }
  .cloud::before {
    width: 24px;
    height: 24px;
    top: -12px;
    left: 10px;
  }
  .cloud::after {
    width: 32px;
    height: 32px;
    top: -16px;
    right: 10px;
  }

  .dark-cloud {
    background: rgba(180, 190, 200, 0.9);
  }
  .dark-cloud::before,
  .dark-cloud::after {
    background: rgba(180, 190, 200, 0.9);
  }

  .sun-peek {
    position: absolute;
    width: 32px;
    height: 32px;
    top: 5px;
    right: 5px;
    z-index: 1;
  }

  .rain-drops {
    position: absolute;
    bottom: 5px;
    display: flex;
    gap: 6px;
    z-index: 1;
  }
  .drop {
    width: 3px;
    height: 12px;
    background: #4fc3f7;
    border-radius: 2px;
    box-shadow: 0 0 4px #4fc3f7;
  }

  .snow-flakes {
    position: absolute;
    bottom: 2px;
    display: flex;
    gap: 10px;
    z-index: 1;
  }
  .flake {
    width: 6px;
    height: 6px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px #fff;
  }

  .lightning {
    position: absolute;
    bottom: -2px;
    z-index: 1;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 18px solid #ffd54f;
    transform: skewX(-15deg);
    filter: drop-shadow(0 0 8px #ffd54f);
  }

  .fog-cloud {
    opacity: 0.6;
  }
  .fog-lines {
    position: absolute;
    bottom: 0px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 3;
  }
  .f-line {
    width: 44px;
    height: 4px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
