// =====================================================================
// Spazier-Routen — der „Route generieren"-Knopf.
// Zeigt eine der 10 vorberechneten Routen (data/routen.js): Schatzkarten-
// Linie mit Aufbau-Animation, Startflagge 🚩, Zielflagge 🏁, nummerierte
// Stationen und ein Panel mit Liste, Öffi-Info, Abhaken, Drucken, Kopieren.
// Die Routen rotieren der Reihe nach durch; die Position wird im
// Browser gemerkt (localStorage).
// =====================================================================

function erstelleRouten(kartenApi, daten) {
  if (typeof ROUTEN_WIEN === 'undefined' || !ROUTEN_WIEN.length) return;

  const ROTATION_SCHLUESSEL = 'naturdenkmaeler-route-index';
  const HAKEN_SCHLUESSEL = 'naturdenkmaeler-route-haken-'; // + Routen-ID
  const ANIMATION_MS = 3500;

  const karte = kartenApi.karte;
  const denkmalNachId = new Map();
  daten.forEach((d) => { if (d.id) denkmalNachId.set(d.id, d); });

  // --- DOM-Elemente -----------------------------------------------------
  const knopf = document.getElementById('route-knopf');
  const panel = document.getElementById('routen-panel');
  const elName = document.getElementById('routen-name');
  const elZaehler = document.getElementById('routen-zaehler');
  const elGegend = document.getElementById('routen-gegend');
  const elBeschreibung = document.getElementById('routen-beschreibung');
  const elFakten = document.getElementById('routen-fakten');
  const elOeffi = document.getElementById('routen-oeffi');
  const elStempel = document.getElementById('routen-stempel');
  const elListe = document.getElementById('routen-liste');
  const knopfKopieren = document.getElementById('route-kopieren');
  const knopfDrucken = document.getElementById('route-drucken');
  const knopfAusblenden = document.getElementById('route-ausblenden');
  if (!knopf || !panel) return;

  // Eigene Karten-Ebene für Linie, Flaggen und Stationen
  const ebene = L.layerGroup().addTo(karte);
  let animationsLauf = 0; // Zähler — entwertet laufende Animationen
  let aktiveStationen = [];
  let aktiveRoute = null;

  const ruhigeAnimation = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // localStorage kann gesperrt sein (strenge Browser-Einstellungen) —
  // dann funktioniert alles, nur ohne Merken.
  function liesSpeicher(schluessel) {
    try { return localStorage.getItem(schluessel); } catch (e) { return null; }
  }
  function schreibSpeicher(schluessel, wert) {
    try { localStorage.setItem(schluessel, wert); } catch (e) { /* egal */ }
  }

  // --- Icons -------------------------------------------------------------

  function flaggenIcon(emoji, klasse) {
    return L.divIcon({
      className: 'routen-flagge-huelle',
      html: `<div class="routen-flagge ${klasse}">${emoji}</div>`,
      iconSize: [40, 40],
      iconAnchor: [7, 36], // Fahnenmast unten links
    });
  }

  function stationsIcon(nummer) {
    return L.divIcon({
      className: 'routen-station-huelle',
      html: `<div class="routen-station">${nummer}</div>`,
      iconSize: [28, 28],
      // Nummer sitzt schräg rechts ÜBER dem Denkmal-Marker (Mitte bei +24/−34),
      // hoch genug, dass das 38px-Emoji-Icon darunter komplett frei bleibt
      iconAnchor: [-10, 48],
      popupAnchor: [24, -48],
    });
  }

  // --- Text-Helfer ---------------------------------------------------------

  function minutenText(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h} h ${m} min` : `${m} min`;
  }

  function kmText(km) {
    return String(km).replace('.', ',') + ' km';
  }

  function stationsName(station) {
    return station.anzeige || station.denkmal.name;
  }

  // --- Panel befüllen ------------------------------------------------------

  function fuellePanel(route, stationen) {
    const erledigt = new Set(liesHaken(route));

    elName.textContent = route.name;
    elZaehler.textContent = `Route ${route.id} von ${ROUTEN_WIEN.length}`;
    elGegend.textContent = route.gegend;
    elBeschreibung.textContent = route.beschreibung;
    elFakten.innerHTML =
      `⏱️ ca. ${minutenText(route.gesamtMin)} &nbsp;·&nbsp; ` +
      `👣 ${kmText(route.distanzKm)} &nbsp;·&nbsp; 📍 ${stationen.length} Stationen`;
    elOeffi.innerHTML =
      `🚩 Start: ${escapeHtml(route.oeffiStart)}<br>` +
      `🏁 Ziel: ${escapeHtml(route.oeffiZiel)}`;

    elListe.innerHTML = '';
    stationen.forEach((station, i) => {
      const d = station.denkmal;
      const kat = kategorieFuer(d.typ);
      const gruppeHinweis = station.gruppe > 1
        ? ` <span class="routen-gruppe">(${station.gruppe} Denkmäler)</span>` : '';

      const zeile = document.createElement('li');
      zeile.className = 'routen-eintrag';
      zeile.innerHTML = `
        <label class="routen-haken" title="Schon besucht? Abhaken!">
          <input type="checkbox" ${erledigt.has(d.id) ? 'checked' : ''}>
        </label>
        <button type="button" class="routen-eintrag-knopf">
          <span class="routen-nummer">${i + 1}</span>
          <span class="routen-eintrag-text">
            <span class="routen-eintrag-name">${kat.emoji} ${escapeHtml(stationsName(station))}${gruppeHinweis}</span>
            <span class="routen-eintrag-adresse">${escapeHtml(d.adresse || '')}</span>
          </span>
        </button>`;
      zeile.classList.toggle('erledigt', erledigt.has(d.id));

      // Abhaken — Fortschritt wird pro Route im Browser gespeichert
      zeile.querySelector('input').addEventListener('change', (ereignis) => {
        zeile.classList.toggle('erledigt', ereignis.target.checked);
        merkeHaken(route, stationen);
      });

      // Antippen — Karte fliegt zur Station und öffnet das Popup
      zeile.querySelector('.routen-eintrag-knopf').addEventListener('click', () => {
        karte.flyTo([d.lat, d.lng], Math.max(karte.getZoom(), 17), { duration: 0.8 });
        if (station.marker) {
          setTimeout(() => station.marker.openPopup(), 850);
        }
      });

      elListe.appendChild(zeile);
    });

    aktualisiereStempel(route, stationen);
    panel.hidden = false;
  }

  function liesHaken(route) {
    try {
      return JSON.parse(liesSpeicher(HAKEN_SCHLUESSEL + route.id)) || [];
    } catch (e) { return []; }
  }

  function merkeHaken(route, stationen) {
    const erledigt = [];
    elListe.querySelectorAll('.routen-eintrag').forEach((zeile, i) => {
      if (zeile.querySelector('input').checked) erledigt.push(stationen[i].denkmal.id);
    });
    schreibSpeicher(HAKEN_SCHLUESSEL + route.id, JSON.stringify(erledigt));
    aktualisiereStempel(route, stationen);
  }

  function aktualisiereStempel(route, stationen) {
    const alle = stationen.length > 0 && elListe.querySelectorAll('input:checked').length === stationen.length;
    elStempel.hidden = !alle;
  }

  // --- Richtungspfeile entlang der Linie -----------------------------------

  const PFEIL_BASIS_M = 100; // ca. alle 100 m ein Pfeil in Gehrichtung
  let aktivePfeile = [];
  let pfeilFrontier = 0; // bis zu dieser Linien-Distanz sind Pfeile erlaubt

  function pfeilIcon(winkel) {
    // ➤ zeigt nach rechts (Osten) → minus 90°, weil der Winkel ab Norden zählt
    return L.divIcon({
      className: 'routen-pfeil-huelle',
      html: `<div class="routen-pfeil" style="transform: rotate(${Math.round(winkel - 90)}deg)">➤</div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
  }

  // Bei weiter Zoomstufe würden sich 100m-Pfeile überlappen → ausdünnen
  function pfeilSchrittweite() {
    const zoom = karte.getZoom();
    if (zoom >= 16) return 100;
    if (zoom >= 15) return 200;
    if (zoom >= 14) return 400;
    return 800;
  }

  function aktualisierePfeile(frontier) {
    pfeilFrontier = frontier;
    const schritt = pfeilSchrittweite();
    aktivePfeile.forEach((pfeil) => {
      const sichtbar = pfeil.distanz <= frontier && pfeil.distanz % schritt === 0;
      if (sichtbar && !pfeil.aufKarte) {
        if (!pfeil.marker) {
          pfeil.marker = L.marker(pfeil.position, {
            icon: pfeilIcon(pfeil.winkel),
            interactive: false,
            keyboard: false,
            zIndexOffset: 600,
          });
        }
        pfeil.marker.addTo(ebene);
        pfeil.aufKarte = true;
      } else if (!sichtbar && pfeil.aufKarte) {
        ebene.removeLayer(pfeil.marker);
        pfeil.aufKarte = false;
      }
    });
  }

  karte.on('zoomend', () => {
    if (aktivePfeile.length) aktualisierePfeile(pfeilFrontier);
  });

  // --- Linie mit Aufbau-Animation -----------------------------------------

  function zeichneRoute(route, stationen) {
    const lauf = ++animationsLauf;
    const punkte = route.linie.map((p) => L.latLng(p[0], p[1]));

    // Kumulierte Distanzen entlang der Linie (für gleichmäßiges Zeichnen
    // und fürs Aufpoppen der Stationen, sobald die Linie sie erreicht)
    const distanzen = [0];
    for (let i = 1; i < punkte.length; i++) {
      distanzen.push(distanzen[i - 1] + punkte[i - 1].distanceTo(punkte[i]));
    }
    const gesamt = distanzen[distanzen.length - 1];

    // Jede Station kennt die Stelle der Linie, an der sie „erreicht" wird
    stationen.forEach((station) => {
      const ziel = L.latLng(station.denkmal.lat, station.denkmal.lng);
      let beste = 0;
      let bester = Infinity;
      punkte.forEach((p, i) => {
        const d = ziel.distanceTo(p);
        if (d < bester) { bester = d; beste = i; }
      });
      station.linienDistanz = distanzen[beste];
      station.gesetzt = false;
    });

    // Richtungspfeile vorbereiten: alle 100 m Position + Gehrichtung bestimmen
    // (kurz vor dem Ziel keiner mehr — da steht die Zielflagge)
    aktivePfeile = [];
    pfeilFrontier = 0;
    for (let zielD = PFEIL_BASIS_M; zielD <= gesamt - 60; zielD += PFEIL_BASIS_M) {
      let i = 1;
      while (i < punkte.length - 1 && distanzen[i] < zielD) i++;
      const a = punkte[i - 1];
      const b = punkte[i];
      const segment = distanzen[i] - distanzen[i - 1];
      if (segment <= 0) continue;
      const anteil = (zielD - distanzen[i - 1]) / segment;
      const dx = (b.lng - a.lng) * Math.cos((a.lat * Math.PI) / 180);
      const dy = b.lat - a.lat;
      aktivePfeile.push({
        distanz: zielD,
        position: L.latLng(a.lat + (b.lat - a.lat) * anteil, a.lng + (b.lng - a.lng) * anteil),
        winkel: (Math.atan2(dx, dy) * 180) / Math.PI, // 0° = Norden, im Uhrzeigersinn
        marker: null,
        aufKarte: false,
      });
    }

    // Startflagge steht von Anfang an
    L.marker(punkte[0], { icon: flaggenIcon('🚩', 'start'), zIndexOffset: 1200 })
      .addTo(ebene);

    const linie = L.polyline([punkte[0]], {
      color: '#a4473a',          // Stempelrot — wie auf einer Schatzkarte
      weight: 4,
      dashArray: '10 8',
      lineCap: 'round',
      opacity: 0.9,
    }).addTo(ebene);

    function setzeStation(station, index) {
      if (station.gesetzt) return;
      station.gesetzt = true;
      const d = station.denkmal;
      const marker = L.marker([d.lat, d.lng], {
        icon: stationsIcon(index + 1),
        zIndexOffset: 1000,
        title: stationsName(station),
        alt: `Station ${index + 1}: ${stationsName(station)}`,
      });
      marker.bindPopup(() => erstellePopupHtml(d), { maxWidth: 290, minWidth: 230 });
      marker.addTo(ebene);
      station.marker = marker;
    }

    function setzeZielflagge() {
      L.marker(punkte[punkte.length - 1], {
        icon: flaggenIcon('🏁', 'ziel'),
        zIndexOffset: 1200,
      }).addTo(ebene);
    }

    let fertig = false;
    function zeichneFertig() {
      if (fertig) return;
      fertig = true;
      linie.setLatLngs(punkte);
      stationen.forEach((station, i) => setzeStation(station, i));
      aktualisierePfeile(gesamt);
      setzeZielflagge();
    }

    // Ohne Animation: bei „weniger Bewegung"-Einstellung oder wenn der
    // Tab gerade nicht sichtbar ist (dort pausiert der Browser Animationen)
    if (ruhigeAnimation || document.hidden) {
      zeichneFertig();
      return;
    }

    // Sicherheitsnetz: falls der Tab mitten in der Animation in den
    // Hintergrund wandert, wird die Route trotzdem fertig gezeichnet
    setTimeout(() => {
      if (lauf === animationsLauf) zeichneFertig();
    }, ANIMATION_MS + 2000);

    const startZeit = performance.now();

    function schritt(jetzt) {
      if (lauf !== animationsLauf) return; // neue Route hat übernommen

      const t = Math.min(1, (jetzt - startZeit) / ANIMATION_MS);
      const sanft = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const zielDistanz = gesamt * sanft;

      // Alle Punkte bis zielDistanz, plus ein interpolierter Spitzenpunkt
      const sichtbar = [];
      for (let i = 0; i < punkte.length; i++) {
        if (distanzen[i] <= zielDistanz) {
          sichtbar.push(punkte[i]);
        } else {
          const vorher = i - 1;
          const segment = distanzen[i] - distanzen[vorher];
          const anteil = segment > 0 ? (zielDistanz - distanzen[vorher]) / segment : 0;
          sichtbar.push(L.latLng(
            punkte[vorher].lat + (punkte[i].lat - punkte[vorher].lat) * anteil,
            punkte[vorher].lng + (punkte[i].lng - punkte[vorher].lng) * anteil
          ));
          break;
        }
      }
      linie.setLatLngs(sichtbar);

      // Stationen poppen auf, sobald die Linie an ihnen vorbeikommt
      stationen.forEach((station, i) => {
        if (!station.gesetzt && station.linienDistanz <= zielDistanz) {
          setzeStation(station, i);
        }
      });

      // Richtungspfeile erscheinen mit der wachsenden Linie
      aktualisierePfeile(zielDistanz);

      if (t < 1 && !fertig) {
        requestAnimationFrame(schritt);
      } else {
        zeichneFertig();
      }
    }

    requestAnimationFrame(schritt);
  }

  // --- Route anzeigen ------------------------------------------------------

  function zeigeRoute(route) {
    animationsLauf++;
    ebene.clearLayers();

    const stationen = route.stationen
      .map((s) => ({ id: s.id, gruppe: s.gruppe || 1, anzeige: s.anzeige || '', denkmal: denkmalNachId.get(s.id) }))
      .filter((s) => s.denkmal);

    aktiveRoute = route;
    aktiveStationen = stationen;
    fuellePanel(route, stationen);

    // Auf schmalen Bildschirmen liegt die Karte über dem Planer —
    // sanft hinscrollen, damit man die Zeichen-Animation auch sieht
    if (window.matchMedia('(max-width: 999px)').matches) {
      const rahmen = document.querySelector('.karten-rahmen');
      const sofort = ruhigeAnimation || document.hidden; // im Hintergrund pausiert Smooth-Scroll
      if (rahmen) rahmen.scrollIntoView({ behavior: sofort ? 'auto' : 'smooth', block: 'start' });
    }

    // Erst auf die Route zoomen, dann die Linie zeichnen
    const grenzen = L.latLngBounds(route.linie.map((p) => [p[0], p[1]]));
    let gestartet = false;
    function starteZeichnen() {
      if (gestartet) return;
      gestartet = true;
      zeichneRoute(route, stationen);
    }
    karte.once('moveend', starteZeichnen);
    karte.flyToBounds(grenzen, { padding: [45, 45], duration: 0.9 });
    setTimeout(starteZeichnen, 1400); // Sicherheitsnetz, falls kein moveend kommt
  }

  // --- Rotation: der Reihe nach, Position wird gemerkt ----------------------

  function naechsteRoute() {
    const roh = parseInt(liesSpeicher(ROTATION_SCHLUESSEL), 10);
    const index = Number.isInteger(roh)
      ? ((roh % ROUTEN_WIEN.length) + ROUTEN_WIEN.length) % ROUTEN_WIEN.length
      : 0;
    schreibSpeicher(ROTATION_SCHLUESSEL, String((index + 1) % ROUTEN_WIEN.length));
    return ROUTEN_WIEN[index];
  }

  knopf.addEventListener('click', () => {
    zeigeRoute(naechsteRoute());
    knopf.textContent = '🥾 Nächste Route generieren';
  });

  // --- Route ausblenden ------------------------------------------------------

  knopfAusblenden.addEventListener('click', () => {
    animationsLauf++;
    ebene.clearLayers();
    panel.hidden = true;
    aktiveRoute = null;
    aktiveStationen = [];
    aktivePfeile = [];
    pfeilFrontier = 0;
    karte.flyTo(KONFIG.kartenZentrum, KONFIG.startZoom, { duration: 0.9 });
  });

  // --- Als Text kopieren (fürs Mitnehmen / Teilen) ----------------------------

  function routenText(route, stationen) {
    const zeilen = [
      `${route.name} — Naturdenkmäler Wien 🌳`,
      route.gegend,
      `ca. ${minutenText(route.gesamtMin)} · ${kmText(route.distanzKm)} · ${stationen.length} Stationen`,
      `Start: ${route.oeffiStart}`,
      `Ziel: ${route.oeffiZiel}`,
      '',
    ];
    stationen.forEach((station, i) => {
      const adresse = station.denkmal.adresse ? ` — ${station.denkmal.adresse}` : '';
      zeilen.push(`${i + 1}. ${stationsName(station)}${adresse}`);
    });
    return zeilen.join('\n');
  }

  knopfKopieren.addEventListener('click', () => {
    if (!aktiveRoute) return;
    const text = routenText(aktiveRoute, aktiveStationen);

    function geschafft() {
      const vorher = knopfKopieren.textContent;
      knopfKopieren.textContent = '✅ Kopiert!';
      setTimeout(() => { knopfKopieren.textContent = vorher; }, 2000);
    }

    // Zwischenablage-API braucht einen "sicheren Kontext" — bei file://
    // klappt sie nicht immer, darum gibt es den Textfeld-Trick als Ersatz.
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(geschafft).catch(() => kopierTrick(text, geschafft));
    } else {
      kopierTrick(text, geschafft);
    }
  });

  function kopierTrick(text, geschafft) {
    const feld = document.createElement('textarea');
    feld.value = text;
    feld.style.position = 'fixed';
    feld.style.opacity = '0';
    document.body.appendChild(feld);
    feld.select();
    try {
      if (document.execCommand('copy')) geschafft();
    } catch (e) { /* dann eben nicht */ }
    document.body.removeChild(feld);
  }

  // --- Drucken (nur das Routen-Panel, siehe Print-CSS) -------------------------

  knopfDrucken.addEventListener('click', () => {
    document.body.classList.add('routen-druck');
    const aufraeumen = () => document.body.classList.remove('routen-druck');
    window.addEventListener('afterprint', aufraeumen, { once: true });
    window.print();
    setTimeout(aufraeumen, 2000); // Sicherheitsnetz für Browser ohne afterprint
  });
}
