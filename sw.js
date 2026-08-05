/* ═══════════════════════════════════════════════════════════════════
   LawBase — Service Worker  v5.3.0

   PSE DUHET KY FAJLL
   Një PWA e instaluar e kërkon index.html nga rrjeti sa herë hapet ose
   rifreskohet. Pa service worker, në sallë pa internet nuk hapet fare.
   Shfletuesit e kërkojnë service worker-in si fajll TË VEÇANTË në të
   njëjtin origin — blob:, data: dhe skriptet inline i refuzon vetë
   specifikimi. Prandaj ky është i pashmangshëm.

   SI TA VENDOSËSH
   Ngarkoje pranë index.html, në të njëjtën dosje, në një server HTTPS.
   Asgjë tjetër. Nuk ka nevojë ta redaktosh.

   PËR VERSION TË RI
   Ndrysho CACHE në rreshtin e parë (p.sh. 'lawbase-v5.3.1').
   Kjo është ajo që i detyron pajisjet të marrin fajllin e ri.
   ═══════════════════════════════════════════════════════════════════ */

const CACHE = 'lawbase-v5.3.0';

// Aplikacioni është një fajll i vetëm — kjo është e gjithë "shell"-a.
const SHELL = ['./', './index.html'];

/* ── Instalimi: ruaj aplikacionin menjëherë ── */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // addAll dështon i tëri nëse një URL bie; provojmë veç e veç
    await Promise.allSettled(SHELL.map(u => c.add(new Request(u, {cache: 'reload'}))));
    await self.skipWaiting();
  })());
});

/* ── Aktivizimi: fshi versionet e vjetra ── */
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('lawbase-') && k !== CACHE)
          .map(k => caches.delete(k))
    );
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (_) {}
    }
    await self.clients.claim();
  })());
});

/* ── Kërkesat ── */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  /* API-t (Dropbox, ofruesit e AI-së) kurrë nuk cache-ohen —
     duhet gjithmonë përgjigjja e vërtetë, ose dështimi i vërtetë. */
  const isApi = /dropbox|anthropic|googleapis|groq|openrouter|mistral|cerebras/i.test(url.hostname);
  if (isApi) return;

  /* ── Navigimet (hapja e aplikacionit, rifreskimi) ──
     CACHE-FIRST me qëllim: hapet menjëherë dhe punon gjithmonë pa rrjet.
     Versioni i ri merret në sfond dhe përdoret herën tjetër. */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = await caches.match('./index.html') || await caches.match('./');

      const fresh = (async () => {
        try {
          const preload = await e.preloadResponse;
          const res = preload || await fetch(req);
          if (res && res.ok) {
            const c = await caches.open(CACHE);
            await c.put('./index.html', res.clone());
          }
          return res;
        } catch (_) { return null; }
      })();

      if (cached) { e.waitUntil(fresh); return cached; }   // offline-proof
      const res = await fresh;
      if (res) return res;
      return new Response(
        '<meta charset="utf-8"><body style="font:15px system-ui;padding:40px;text-align:center">' +
        '<h3>LawBase nuk u ngarkua</h3><p>Hape një herë me internet që të ruhet në pajisje.</p></body>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })());
    return;
  }

  /* ── Burimet e tjera (FontAwesome, pdf.js, mammoth) ──
     Cache-first: pas hapjes së parë me internet, punojnë edhe offline. */
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const c = await caches.open(CACHE);
        c.put(req, res.clone()).catch(() => {});
      }
      return res;
    } catch (err) {
      const fallback = await caches.match(req, { ignoreSearch: true });
      if (fallback) return fallback;
      throw err;
    }
  })());
});

/* ── Përditësimi i menjëhershëm nga butoni në Cilësimet ── */
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
