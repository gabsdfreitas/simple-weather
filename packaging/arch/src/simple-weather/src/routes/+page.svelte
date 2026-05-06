<script lang="ts">
  import { onMount } from "svelte";
  import WeatherCard from "../components/WeatherCard.svelte";
  import ForecastStrip from "../components/ForecastStrip.svelte";
  import HourlyChart from "../components/HourlyChart.svelte";
  import CitySearch from "../components/CitySearch.svelte";
  import SettingsPanel from "../components/SettingsPanel.svelte";
  import WeatherBackground from "../components/WeatherBackground.svelte";

  import { fetchWeather, type WeatherData } from "../api/weather";
  import { settings, type LocationContext } from "../hooks/useSettings";
  import { bounce } from "../utils/bounce";
  import {
    getWeatherState,
    type WeatherState,
    type Season,
  } from "../utils/weatherState";

  let weatherData: WeatherData | null = null;
  let currentLoc: LocationContext | null = null;

  let loading = true;
  let errorMsg = "";
  let showSettings = false;

  let currentState: WeatherState = "clear-day";
  let currentSeason: Season = "Summer";
  let currentSunrise = new Date(new Date().setHours(6, 0, 0, 0)).toISOString();
  let currentSunset = new Date(new Date().setHours(18, 0, 0, 0)).toISOString();
  let currentUtcOffset = 0;

  async function loadWeather(
    lat: number,
    lon: number,
    name: string,
    force = false,
  ) {
    loading = true;
    errorMsg = "";

    try {
      weatherData = await fetchWeather(lat, lon, force);
      currentLoc = { lat, lon, name };

      currentSunrise = weatherData.sunrise;
      currentSunset = weatherData.sunset;
      currentUtcOffset = weatherData.utcOffsetSeconds;

      const computedState = getWeatherState(
        weatherData.current.code,
        weatherData.current.temp,
        lat,
        new Date(),
        weatherData.sunrise,
        weatherData.sunset,
        weatherData.current.isDay,
      );

      currentState = computedState.state;
      currentSeason = computedState.season;
    } catch (err) {
      console.error(err);
      errorMsg = "Failed to load atmospheric data.";
    } finally {
      loading = false;
    }
  }

  function handleCitySelect(event: CustomEvent<LocationContext>) {
    loadWeather(event.detail.lat, event.detail.lon, event.detail.name);
  }

  function handleRefresh() {
    if (currentLoc)
      loadWeather(currentLoc.lat, currentLoc.lon, currentLoc.name, true);
  }

  onMount(() => {
    if ($settings.defaultCity) {
      loadWeather(
        $settings.defaultCity.lat,
        $settings.defaultCity.lon,
        $settings.defaultCity.name,
      );
    } else {
      loadWeather(46.948, 7.4474, "Bern, Switzerland");
    }
  });
</script>

<main
  id="app"
  data-weather={currentState}
  style="background: transparent !important;"
>
  <WeatherBackground
    state={currentState}
    season={currentSeason}
    sunriseStr={currentSunrise}
    sunsetStr={currentSunset}
    utcOffsetSeconds={currentUtcOffset}
  >
    <div class="app-window">
      <header class="top-bar">
        <div class="left-spacer"></div>

        <div class="search-wrapper">
          <CitySearch on:select={handleCitySelect} />
        </div>

        <div class="action-buttons">
          <button
            class="icon-btn glass-panel glass-text app-interactive"
            use:bounce
            on:click={handleRefresh}
            title="Refresh Weather"
          >
            <svg
              style="flex-shrink: 0; pointer-events: none;"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>

          <button
            class="icon-btn glass-panel glass-text app-interactive"
            use:bounce
            on:click={() => (showSettings = true)}
            title="Settings"
          >
            <svg
              style="flex-shrink: 0; pointer-events: none;"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
              ></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </header>

      <div class="dashboard-grid">
        <div class="column left-col">
          {#if loading}
            <div class="glass-card skeleton-card skeleton-shimmer"></div>
          {:else if errorMsg}
            <div class="glass-panel skeleton-card glass-text">{errorMsg}</div>
          {:else if weatherData && currentLoc}
            <WeatherCard
              current={weatherData.current}
              location={currentLoc.name}
              season={currentSeason}
            />
          {/if}
        </div>

        <div class="column right-col">
          {#if !loading && weatherData}
            <ForecastStrip daily={weatherData.daily} />
            <HourlyChart hourly={weatherData.hourly} />
          {:else}
            <div class="glass-panel skeleton-strip skeleton-shimmer"></div>
            <div class="glass-panel skeleton-chart skeleton-shimmer"></div>
          {/if}
        </div>
      </div>
    </div>
  </WeatherBackground>

  {#if showSettings}
    <SettingsPanel
      currentCity={currentLoc}
      on:close={() => (showSettings = false)}
    />
  {/if}
</main>

<style>
  .app-window {
    width: 100%;
    max-width: 1200px;
    aspect-ratio: 16 / 9;
    max-height: 90vh;
    margin: auto;
    display: flex;
    flex-direction: column;
    padding: 2rem;
  }

  .top-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 50;
    width: 100%;
  }

  .left-spacer {
    grid-column: 1;
  }
  .search-wrapper {
    grid-column: 2;
    width: 100%;
    justify-self: center;
    min-width: 500px;
    max-width: 800px;
  }

  .action-buttons {
    grid-column: 3;
    justify-self: end;
    display: flex;
    gap: 1rem;
  }

  .icon-btn {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 2px solid var(--glass-border);
    cursor: pointer;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    gap: 2rem;
    flex: 1;
    min-height: 0;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .right-col {
    min-width: 0;
    justify-content: space-between;
  }
  .right-col > * {
    width: 100%;
  }
  .skeleton-card {
    height: 100%;
  }
  .skeleton-strip {
    height: 130px;
  }
  .skeleton-chart {
    height: 230px;
  }

  .skeleton-shimmer {
    position: relative;
    overflow: hidden;
  }
  .skeleton-shimmer::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (max-width: 950px) {
    .app-window {
      aspect-ratio: auto;
      height: 100%;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    .top-bar {
      display: flex;
      flex-direction: column-reverse;
    }
    .search-wrapper {
      min-width: 100%;
    }
  }
</style>
