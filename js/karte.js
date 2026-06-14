// =====================================================================
// Karte — baut die Leaflet-Karte auf: Kacheln, Marker, Cluster, Popups.
// Gibt eine kleine Steuer-API zurück, die die Legende zum Filtern nutzt.
// =====================================================================

// HTML-Sonderzeichen entschärfen (für sichere Popup-Inhalte)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

// Hübsche Bezirkszeile, z. B. "14. Bezirk · Penzing"
function bezirkText(bezirk) {
  if (!bezirk || !BEZIRKE[bezirk]) return '';
  return `${bezirk}. Bezirk · ${BEZIRKE[bezirk]}`;
}

// --- Popup-Inhalt -----------------------------------------------------

function erstellePopupHtml(d) {
  const kat = kategorieFuer(d.typ);

  const kurzinfo = d.kurzinfo
    ? `<p class="popup-kurzinfo">${escapeHtml(d.kurzinfo)}</p>`
    : '';

  const ort = [bezirkText(d.bezirk), d.adresse ? escapeHtml(d.adresse) : '']
    .filter(Boolean)
    .join('<br>');

  // Details für "Erzähl mir mehr"
  const detailZeilen = [];
  if (d.wissName) {
    detailZeilen.push(`<p><span class="detail-label">Botanischer Name:</span> <em>${escapeHtml(d.wissName)}</em></p>`);
  }
  // Art-spezifischer Steckbrief, falls vorhanden — sonst der Kategorie-Text
  const artInfo = artInfoFuer(d.wissName);
  detailZeilen.push(`<p>${escapeHtml(artInfo || kat.beschreibung)}</p>`);
  if (d.details) {
    detailZeilen.push(`<p>${escapeHtml(d.details)}</p>`);
  }
  if (d.id) {
    detailZeilen.push(`<p class="detail-nummer">Naturdenkmal-Objekt Nr. ${escapeHtml(d.id)}</p>`);
  }

  return `
    <article class="popup-inhalt">
      <h3 class="popup-titel"><span class="popup-emoji">${kat.emoji}</span> ${escapeHtml(d.name)}</h3>
      <p class="popup-kategorie" style="--kat-farbe:${kat.farbe}">${escapeHtml(d.typ)}</p>
      ${ort ? `<p class="popup-ort">📍 ${ort}</p>` : ''}
      ${kurzinfo}
      <button type="button" class="mehr-knopf" aria-expanded="false">Erzähl mir mehr 📖</button>
      <div class="popup-details" hidden>${detailZeilen.join('')}</div>
    </article>`;
}

// Klick auf "Erzähl mir mehr" — wird bei jedem Popup-Öffnen neu verdrahtet
function verdrahteMehrKnopf(popup) {
  const wurzel = popup.getElement();
  if (!wurzel) return;
  const knopf = wurzel.querySelector('.mehr-knopf');
  const details = wurzel.querySelector('.popup-details');
  if (!knopf || !details) return;

  knopf.addEventListener('click', (ereignis) => {
    // Klick darf nicht zur Karte durchsickern — sonst schließt sie das Popup.
    // Wichtig: kein popup.update() aufrufen, das würde den Inhalt neu
    // aufbauen und die aufgeklappten Details sofort wieder verwerfen.
    ereignis.stopPropagation();
    const offen = !details.hidden;
    details.hidden = offen;
    knopf.setAttribute('aria-expanded', String(!offen));
    knopf.textContent = offen ? 'Erzähl mir mehr 📖' : 'Genug gehört 🙈';
  });
}

// --- Marker & Cluster -------------------------------------------------

function erstelleMarkerIcon(kat) {
  return L.divIcon({
    className: 'nd-marker-huelle',
    html: `<div class="nd-marker" style="--kat-farbe:${kat.farbe}">${kat.emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -16],
  });
}

function erstelleClusterIcon(cluster) {
  const anzahl = cluster.getChildCount();
  const groesse = anzahl >= 100 ? 'gross' : anzahl >= 25 ? 'mittel' : 'klein';
  return L.divIcon({
    className: 'nd-cluster-huelle',
    html: `<div class="nd-cluster nd-cluster-${groesse}"><span>${anzahl}</span></div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
  });
}

// --- Hauptfunktion ----------------------------------------------------

function erstelleKarte(daten) {
  const karte = L.map('karte', {
    center: KONFIG.kartenZentrum,
    zoom: KONFIG.startZoom,
    minZoom: KONFIG.minZoom,
    maxZoom: KONFIG.maxZoom,
    maxBounds: KONFIG.maxGrenzen,
    maxBoundsViscosity: 0.8,
    zoomControl: true,
    // Touch-Gesten (Pinch-Zoom, Wischen) sind bei Leaflet standardmäßig aktiv
  });

  L.tileLayer(KONFIG.kachelUrl, {
    attribution: KONFIG.kachelAttribution,
    maxZoom: KONFIG.maxZoom,
  }).addTo(karte);

  const cluster = L.markerClusterGroup({
    maxClusterRadius: KONFIG.clusterRadius,
    disableClusteringAtZoom: KONFIG.clusterBisZoom,
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    iconCreateFunction: erstelleClusterIcon,
    chunkedLoading: true,
  });

  // Marker je Kategorie merken — fürs Ein-/Ausblenden über die Legende
  const markerProKategorie = {};

  daten.forEach((d) => {
    const kat = kategorieFuer(d.typ);
    const marker = L.marker([d.lat, d.lng], {
      icon: erstelleMarkerIcon(kat),
      title: d.name,
      alt: `${d.typ}: ${d.name}`,
    });
    marker.bindPopup(() => erstellePopupHtml(d), { maxWidth: 290, minWidth: 230 });

    if (!markerProKategorie[d.typ]) markerProKategorie[d.typ] = [];
    markerProKategorie[d.typ].push(marker);
  });

  Object.values(markerProKategorie).forEach((liste) => cluster.addLayers(liste));
  karte.addLayer(cluster);

  // "Erzähl mir mehr"-Knopf bei jedem geöffneten Popup aktivieren
  karte.on('popupopen', (e) => verdrahteMehrKnopf(e.popup));

  // --- Steuer-API für die Legende ---
  return {
    karte: karte,

    setzeKategorieSichtbar(typ, sichtbar) {
      const liste = markerProKategorie[typ] || [];
      if (sichtbar) cluster.addLayers(liste);
      else cluster.removeLayers(liste);
    },

    anzahlProKategorie() {
      const zaehler = {};
      Object.keys(markerProKategorie).forEach((typ) => {
        zaehler[typ] = markerProKategorie[typ].length;
      });
      return zaehler;
    },
  };
}
