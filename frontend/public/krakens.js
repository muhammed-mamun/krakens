/**
 * Krakens Analytics - Tracking SDK
 * Lightweight analytics tracking script
 */
(function() {
  'use strict';

  const config = {
    apiUrl: window.KRAKENS_API_URL || (function() {
      // Auto-detect API URL from script source or use relative path
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].src;
        if (src && src.includes('krakens.js')) {
          const url = new URL(src);
          // Try to construct API URL from frontend URL
          return `${url.protocol}//${url.hostname}${url.port && url.port !== '80' && url.port !== '443' ? ':8080' : ''}/api/track`;
        }
      }
      return '/api/track'; // Fallback to relative URL (works with reverse proxy)
    })(),
    apiKey: null,
    visitorId: null,
  };

  // Generate or retrieve visitor ID
  function getVisitorId() {
    let visitorId = localStorage.getItem('hrd_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('hrd_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Track page view
  function track(data) {
    if (!config.apiKey) {
      console.error('Krakens: API key not set');
      return;
    }

    const payload = {
      path: data.path || window.location.pathname,
      referrer: data.referrer || document.referrer,
      user_agent: navigator.userAgent,
      visitor_id: config.visitorId,
    };

    // Use fetch with API key header
    fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.apiKey,
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          console.error('Krakens tracking failed:', err);
        });
      }
      console.log('Krakens: Event tracked successfully');
    })
    .catch(err => console.error('Krakens tracking error:', err));
  }

  // Initialize
  function init(apiKey, options = {}) {
    if (!apiKey) {
      console.error('Krakens: API key is required');
      return;
    }

    config.apiKey = apiKey;
    config.visitorId = getVisitorId();
    
    if (options.apiUrl) {
      config.apiUrl = options.apiUrl;
    }

    console.log('Krakens initialized:', {
      apiUrl: config.apiUrl,
      visitorId: config.visitorId
    });

    // Track initial page view
    track({});

    // Track page changes for SPAs
    let lastPath = window.location.pathname;
    setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        track({});
      }
    }, 500);
  }

  // Expose API
  window.Krakens = {
    init: init,
    track: track,
  };
})();
