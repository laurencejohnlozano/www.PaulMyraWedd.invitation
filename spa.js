// spa.js — SPA loader that keeps music playing (works with your existing folders)
(function () {
  // small helpers
  function isLocalHtml(href) {
    return !!href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//');
  }

  const insertedCSS = new Set();
  function addCss(href) {
    if (!href || insertedCSS.has(href)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    insertedCSS.add(href);
  }

  function runExternalScripts(doc) {
    const scripts = Array.from(doc.querySelectorAll('script[src]'));
    scripts.forEach(s => {
      const src = s.getAttribute('src');
      if (!src) return;
      // avoid duplicate
      if (Array.from(document.scripts).some(existing => existing.src && existing.src.endsWith(src))) return;
      const sc = document.createElement('script');
      sc.src = src;
      document.body.appendChild(sc);
    });
  }

  async function loadFragment(path) {
    const container = document.getElementById('spa-content');
    if (!container) return;
    document.body.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error('Failed to fetch ' + path);
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      // load CSS references inside fragment (use folder-prefixed hrefs)
      Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).forEach(l => {
        const href = l.getAttribute('href');
        if (href) addCss(href);
      });
      // remove audio tags from fragment to avoid duplicates
      Array.from(doc.querySelectorAll('audio')).forEach(a => a.remove());
      // inject innerHTML
      container.innerHTML = doc.body.innerHTML;
      // run inline scripts immediately
      Array.from(doc.querySelectorAll('script:not([src])')).forEach(inline => {
        const code = inline.textContent || inline.innerText || '';
        if (code.trim()) {
          try { new Function(code)(); } catch (e) { console.warn('inline script error', e); }
        }
      });
      // then add external scripts
      runExternalScripts(doc);
      // rewire internal links in loaded fragment
      rewireLinks(container);
      // done transition
      document.body.classList.remove('fade-out');
      window.scrollTo(0, 0);
      // ask music iframe for state (so toggle icon is correct)
      requestMusicState();
    } catch (err) {
      console.error(err);
      container.innerHTML = '<p style="padding:36px;text-align:center">Could not load page.</p>';
      document.body.classList.remove('fade-out');
    }
  }

  function rewireLinks(root) {
    const anchors = Array.from(root.querySelectorAll('a[href]'));
    anchors.forEach(a => {
      const href = a.getAttribute('href');
      if (isLocalHtml(href)) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
          loadFragment(href);
        });
      } else {
        // external links open in new tab
        if ((href.startsWith('http') || href.startsWith('//')) && !a.target) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
      }
    });
  }

  // Envelope logic (uses existing envelope elements in your original index layout)
  function initEnvelope() {
    const envelope = document.getElementById('envelope');
    const invitation = document.getElementById('invitation');
    const envelopeStage = document.getElementById('envelope-stage');
    const spaApp = document.getElementById('spa-app');

    if (!envelope || !invitation || !envelopeStage || !spaApp) return;

    let isAnimating = false;
    let hasOpened = false;

    function openEnvelope(e) {
      if (!hasOpened && !isAnimating) {
        hasOpened = true;
        isAnimating = true;
        envelope.classList.add('open');
        setTimeout(() => {
          invitation.classList.add('show');
          isAnimating = false;
        }, 600);
      }
      e && e.preventDefault();
      e && e.stopPropagation();
    }

    function revealSPA(e) {
      if (invitation.classList.contains('show') && !isAnimating) {
        envelopeStage.classList.add('hidden');
        spaApp.classList.remove('hidden');
        // load homepage fragment (keep URL clean — Option 1)
        loadFragment('homepage/homepage.html');
      }
      e && e.preventDefault();
      e && e.stopPropagation();
    }

    envelope.addEventListener('click', openEnvelope, { passive: false });
    envelope.addEventListener('touchend', openEnvelope, { passive: false });
    invitation.addEventListener('click', revealSPA, { passive: false });
    invitation.addEventListener('touchend', revealSPA, { passive: false });
  }

  /* Music iframe comms */
  const iframe = document.getElementById('bgm-frame');
  const musicIcon = document.getElementById('global-music-icon');
  const musicToggle = document.getElementById('global-music-toggle');

  function requestMusicState() {
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage('getMusicState', '*');
  }

  function toggleMusic() {
    if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage('toggleMusic', '*');
  }

  window.addEventListener('message', function (ev) {
    const d = ev.data;
    if (d && typeof d === 'object' && 'musicPlaying' in d) {
      if (musicIcon) musicIcon.textContent = d.musicPlaying ? '🔊' : '🔇';
    }
  });

  if (musicToggle) {
    musicToggle.addEventListener('click', function (e) {
      e.preventDefault();
      toggleMusic();
    });
  }

  // intercept global clicks as safety net
  document.addEventListener('click', function (ev) {
    const a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (isLocalHtml(href)) {
      ev.preventDefault();
      loadFragment(href);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    initEnvelope();
    // if user refreshes and SPA area visible, load homepage
    const spaApp = document.getElementById('spa-app');
    if (spaApp && !spaApp.classList.contains('hidden')) {
      loadFragment('homepage/homepage.html');
    }
  });
})();
