// spa.js - SPA loader and global controller
(function () {
  // Utilities
  function isLocalHtmlLink(href) {
    if (!href) return false;
    // treat links ending with .html as SPA fragments
    return href.endsWith('.html') && !href.startsWith('http');
  }

  // Insert CSS link (avoid duplicate)
  const insertedCSS = new Set();
  function insertCSSLink(href) {
    if (!href || insertedCSS.has(href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    insertedCSS.add(href);
  }

  // Execute external scripts found in fetched document
  function runExternalScripts(doc) {
    const scripts = Array.from(doc.querySelectorAll('script[src]'));
    scripts.forEach(s => {
      const src = s.getAttribute('src');
      // avoid duplicating same script twice (optional)
      const existing = Array.from(document.scripts).some(el => el.src && el.src.endsWith(src));
      if (!existing) {
        const nx = document.createElement('script');
        nx.src = src;
        nx.defer = false;
        document.body.appendChild(nx);
      }
    });
  }

  // Load fragment via fetch, parse, inject content, load CSS & JS
  async function loadPage(path) {
    try {
      const container = document.getElementById('spa-content');
      if (!container) return;

      document.body.classList.add('fade-out');

      // small delay to allow fade-out animation (keeps transition)
      await new Promise(r => setTimeout(r, 300));

      const res = await fetch(path, {cache: "no-store"});
      if (!res.ok) {
        container.innerHTML = `<p style="padding:40px; text-align:center;">Failed to load page: ${path}</p>`;
        document.body.classList.remove('fade-out');
        return;
      }
      const text = await res.text();
      // parse and extract head/body
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      // load CSS links present in the fragment head
      const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
      links.forEach(l => {
        const href = l.getAttribute('href');
        if (href) insertCSSLink(href);
      });

      // Remove any <audio> tags from content to prevent duplicates
      Array.from(doc.querySelectorAll('audio')).forEach(a => a.remove());

      // Inject the body content
      container.innerHTML = doc.body.innerHTML;

      // Execute inline scripts
      Array.from(doc.querySelectorAll('script:not([src])')).forEach(inline => {
        try {
          const code = inline.textContent || inline.innerText || '';
          if (code.trim()) new Function(code)();
        } catch (e) {
          console.warn('Error running inline script', e);
        }
      });

      // Execute external scripts (by appending to document)
      runExternalScripts(doc);

      // Re-wire links inside the loaded fragment to use SPA navigation
      rewireInternalLinks(container);

      // Remove fade-out
      document.body.classList.remove('fade-out');

      // After loading page, ask music iframe for current state and update icon
      requestMusicState();

      // scroll to top
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('loadPage error', err);
    }
  }

  // convert anchors that point to .html to use SPA load
  function rewireInternalLinks(root) {
    const anchors = Array.from(root.querySelectorAll('a[href]'));
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (isLocalHtmlLink(href)) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          loadPage(href);
        });
      } else {
        // external links remain normal - open in new tab if target not set
        if (!a.target && (href.startsWith('http') || href.startsWith('//'))) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      }
    });
  }

  // Envelope open logic (shows SPA area and loads homepage)
  function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const invitation = document.getElementById('invitation');
    const envelopeStage = document.getElementById('envelope-stage');
    const spaApp = document.getElementById('spa-app');

    let isAnimating = false;
    let hasOpened = false;

    function openEnvelope(e) {
      if (!hasOpened && !isAnimating) {
        hasOpened = true;
        isAnimating = true;
        envelope.classList.add('open');
        setTimeout(function () {
          invitation.classList.add('show');
          isAnimating = false;
        }, 600);
      }
      e && e.preventDefault();
      e && e.stopPropagation();
    }

    function goToHomepage(e) {
      if (invitation.classList.contains('show') && !isAnimating) {
        // hide envelope stage and show SPA
        envelopeStage.classList.add('hidden');
        spaApp.classList.remove('hidden');
        // load homepage fragment (no URL change in Option 1)
        loadPage('homepage/homepage.html');
      }
      e && e.preventDefault();
      e && e.stopPropagation();
    }

    if (envelope && invitation) {
      envelope.addEventListener('click', openEnvelope, {passive: false});
      envelope.addEventListener('touchend', openEnvelope, {passive: false});
      invitation.addEventListener('click', goToHomepage, {passive: false});
      invitation.addEventListener('touchend', goToHomepage, {passive: false});
    }
  }

  /* ---------------------------
     Music iframe communication
     --------------------------- */
  const iframe = document.getElementById('bgm-frame');
  const musicIcon = document.getElementById('global-music-icon');
  const musicToggleEl = document.getElementById('global-music-toggle');

  // Ask iframe for music state
  function requestMusicState() {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage('getMusicState', '*');
  }

  // Toggle global music (send toggle command to iframe)
  function toggleMusic() {
    if (!iframe || !iframe.contentWindow) return;
    iframe.contentWindow.postMessage('toggleMusic', '*');
  }

  // Listen for messages from the music iframe
  window.addEventListener('message', function (ev) {
    const data = ev.data;
    // music iframe uses { musicPlaying: true/false } responses after toggle or getMusicState
    if (data && typeof data === 'object' && 'musicPlaying' in data) {
      const playing = !!data.musicPlaying;
      musicIcon.textContent = playing ? '🔊' : '🔇';
    }
  });

  // set up the global toggle click handler
  if (musicToggleEl) {
    musicToggleEl.addEventListener('click', function (e) {
      e.preventDefault();
      toggleMusic();
    });
  }

  // On dom ready
  document.addEventListener('DOMContentLoaded', function () {
    // envelope open behavior
    initEnvelope();

    // if user refreshes while SPA already shown, restore homepage
    const spaApp = document.getElementById('spa-app');
    if (!spaApp.classList.contains('hidden')) {
      // attempt to load homepage
      loadPage('homepage/homepage.html');
    }

    // global capture: if anchor with .html clicked anywhere, intercept (safety net)
    document.body.addEventListener('click', function (ev) {
      const a = ev.target.closest && ev.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (isLocalHtmlLink(href)) {
        ev.preventDefault();
        loadPage(href);
      }
    });
  });
})();
