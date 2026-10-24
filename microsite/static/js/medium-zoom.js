// Ref: https://github.com/francoischalifour/medium-zoom#options
window.addEventListener(
  'load',
  () => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/medium-zoom@1.0.6/dist/medium-zoom.min.js';
    script.onload = () => {
      if (typeof window.mediumZoom === 'function') {
        window.mediumZoom('[data-zoomable]', {
          margin: 20,
          background: '#000',
        });
      }
    };
    document.head.appendChild(script);
  },
  false,
);
