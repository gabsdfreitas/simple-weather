<script lang="ts">
  import { onMount } from "svelte";
  import "../styles/base.css";
  import "../styles/weather-themes.css";
  import "../styles/glass.css";

  onMount(async () => {
    // Keep a consistent title even if the document title changes.
    try {
      const windowApi = await import("@tauri-apps/api/window");
      const appWindow = windowApi.getCurrentWindow();
      await appWindow.setTitle("Simple Weather");
    } catch {
      // Not running under Tauri runtime.
    }
  });
</script>

<slot />
