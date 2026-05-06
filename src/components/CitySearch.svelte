<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { searchCity, type GeocodingResult } from "../api/weather";
  import { bounce } from "../utils/bounce";

  const dispatch = createEventDispatcher<{
    select: { lat: number; lon: number; name: string };
  }>();

  let query = "";
  let results: GeocodingResult[] = [];
  let isSearching = false;
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleInput() {
    clearTimeout(searchTimeout);
    if (query.trim().length < 2) {
      results = [];
      return;
    }

    isSearching = true;
    searchTimeout = setTimeout(async () => {
      try {
        results = await searchCity(query);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        isSearching = false;
      }
    }, 300);
  }

  function handleSelect(result: GeocodingResult) {
    query = "";
    results = [];
    const locationName = result.admin1
      ? `${result.name}, ${result.admin1}`
      : `${result.name}, ${result.country}`;

    dispatch("select", {
      lat: result.latitude,
      lon: result.longitude,
      name: locationName,
    });
  }
</script>

<div class="search-container">
  <input
    type="text"
    class="glass-panel search-input glass-text app-interactive"
    placeholder="Search city..."
    use:bounce
    bind:value={query}
    on:input={handleInput}
  />

  {#if results.length > 0 || isSearching}
    <div class="glass-panel results-dropdown">
      {#if isSearching}
        <div class="dropdown-item glass-text-secondary">Searching...</div>
      {:else}
        {#each results as result}
          <button class="dropdown-item" on:click={() => handleSelect(result)}>
            <span class="city-name glass-text">{result.name}</span>
            <span class="city-detail glass-text-secondary">
              {#if result.admin1}{result.admin1},
              {/if}{result.country}
            </span>
          </button>
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style>
  .search-container {
    position: relative;
    width: 100%;
    z-index: 50;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1.5rem;
    font-size: 1rem;
    font-family: inherit;
    outline: none;
    background: var(--glass-bg);
    /* Matched to thick 2px borders */
    border: 2px solid var(--glass-border);
  }

  .search-input::placeholder {
    color: var(--text-secondary);
  }

  .search-input:focus {
    border-color: var(--glass-highlight);
    box-shadow:
      0 0 15px rgba(255, 255, 255, 0.2),
      inset 0 2px 2px -1px var(--glass-highlight);
  }

  .results-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0.5rem 0;
  }

  .dropdown-item {
    padding: 0.75rem 1.5rem;
    text-align: left;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    transition: background 0.2s;
  }

  .dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .city-name {
    font-weight: 600;
    font-size: 1rem;
  }

  .city-detail {
    font-size: 0.8rem;
  }
</style>
