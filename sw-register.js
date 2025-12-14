// sw-register.js – advanced SW registration and update flow

(function () {
  if (!("serviceWorker" in navigator)) {
    console.log("[SW] Service worker not supported in this browser.");
    return;
  }

  const SW_URL = "sw.js";

  let refreshing = false;

  // When the controlling SW changes, reload the page once
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(SW_URL)
      .then((registration) => {
        console.log("[SW] Registered with scope:", registration.scope);

        // If there's an already waiting worker, prompt to update
        if (registration.waiting) {
          promptUserToRefresh(registration.waiting);
        }

        // Listen for new installing workers
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              promptUserToRefresh(newWorker);
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
  });

  function promptUserToRefresh(worker) {
    // You can replace this confirm() with a custom in‑app UI if you want
    const shouldUpdate = window.confirm(
      "A new version of the Night Workout app is available. Reload now to update?"
    );
    if (shouldUpdate) {
      // Tell the new worker to skip waiting
      worker.postMessage({ type: "SKIP_WAITING" });
    } else {
      console.log("[SW] User chose to keep using the current version.");
    }
  }
})();