// =====================================================================
// Datenlader — sammelt alle Datenquellen ein und bringt sie in ein
// einheitliches Format. Unterstützt:
//   1. einfache Objekt-Arrays  (wie in data/naturdenkmaeler-wien.js)
//   2. GeoJSON-FeatureCollections (z. B. direkt von data.gv.at)
// Neue Datenquelle ergänzen → Datei in index.html einbinden und die
// Konstante unten in QUELLEN eintragen.
// =====================================================================

// Wandelt ein GeoJSON-Feature in unser einheitliches Format um
function normalisiereGeoJsonFeature(feature) {
  const p = feature.properties || {};
  const koord = feature.geometry && feature.geometry.coordinates;
  if (!koord) return null;
  return {
    id: p.OBJECTID || p.id || null,
    name: (p.ARTBEZ || p.name || 'Naturdenkmal').trim(),
    typ: p.ND_TYP || p.typ || 'Sonstiges',
    lat: koord[1],
    lng: koord[0],
    wissName: (p.WISSBEZ || p.wissName || '').trim(),
    bezirk: p.BEZ ? parseInt(p.BEZ, 10) : (p.bezirk || null),
    adresse: (p.ADRESSE || p.adresse || '').trim(),
    kurzinfo: p.kurzinfo || '',
    details: p.details || '',
  };
}

// Prüft und säubert einen einzelnen Eintrag
function normalisiereEintrag(roh) {
  if (!roh) return null;

  // GeoJSON-Feature?
  if (roh.type === 'Feature') roh = normalisiereGeoJsonFeature(roh);
  if (!roh) return null;

  const lat = Number(roh.lat);
  const lng = Number(roh.lng);
  if (!isFinite(lat) || !isFinite(lng)) {
    console.warn('Naturdenkmal ohne gültige Koordinaten übersprungen:', roh);
    return null;
  }

  let typ = roh.typ || 'Sonstiges';
  if (!KATEGORIEN[typ]) {
    console.warn(`Unbekannte Kategorie "${typ}" → wird als "Sonstiges" angezeigt:`, roh.name);
    typ = 'Sonstiges';
  }

  return {
    id: roh.id || null,
    name: roh.name || 'Naturdenkmal',
    typ: typ,
    lat: lat,
    lng: lng,
    // Platzhalter wie "-" aus dem Originaldatensatz zählen als leer
    wissName: /^[\s\-–—?]*$/.test(roh.wissName || '') ? '' : roh.wissName,
    bezirk: roh.bezirk || null,
    // überflüssige Trennzeichen am Ende entfernen (z. B. "Dehnepark -")
    adresse: (roh.adresse || '').replace(/[\s\-–,]+$/, ''),
    kurzinfo: roh.kurzinfo || '',
    details: roh.details || '',
  };
}

// Nimmt eine beliebige Quelle entgegen (Array oder GeoJSON-Objekt)
function normalisiereQuelle(quelle) {
  if (!quelle) return [];
  const liste = Array.isArray(quelle) ? quelle : (quelle.features || []);
  return liste.map(normalisiereEintrag).filter(Boolean);
}

// Sammelt alle eingebundenen Datenquellen ein
function ladeAlleDaten() {
  const QUELLEN = [
    typeof NATURDENKMAELER_WIEN !== 'undefined' ? NATURDENKMAELER_WIEN : null,
    typeof EIGENE_NATURDENKMAELER !== 'undefined' ? EIGENE_NATURDENKMAELER : null,
  ];

  const alle = QUELLEN.flatMap(normalisiereQuelle);
  console.info(`🌳 ${alle.length} Naturdenkmäler geladen`);
  return alle;
}
