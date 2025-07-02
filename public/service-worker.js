self.addEventListener("install", (event) => {
    console.log("Service Worker installed");
  });
  
  self.addEventListener("fetch", (event) => {
    // Optionally handle fetch events for offline support
  });