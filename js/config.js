// =====================================================================
// Konfiguration der Karte — hier zentrale Einstellungen ändern
// =====================================================================

const KONFIG = {
  // Startansicht (Zentrum von Wien)
  kartenZentrum: [48.2082, 16.3719],
  startZoom: 12,
  minZoom: 10,
  maxZoom: 19,

  // Bewegungsbereich der Karte (grob Wien + Umgebung)
  maxGrenzen: [
    [47.95, 15.95], // Südwest
    [48.45, 16.85], // Nordost
  ],

  // Kartenkacheln (CARTO Voyager — auf OpenStreetMap-Daten basierend)
  // WICHTIG: Nicht tile.openstreetmap.org verwenden! Deren Server blockieren
  // eingebettete/portable Apps nach ihrer Tile-Usage-Policy ("Access blocked,
  // Referer is required"). CARTO erlaubt diese Nutzung und liefert auch ohne
  // Referer (file://-Doppelklick) Kacheln aus. Der Sepia-Filter (css) bleibt.
  kachelUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  kachelAttribution:
    'Karte: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende' +
    ' &middot; &copy; <a href="https://carto.com/attributions">CARTO</a>' +
    ' &middot; Daten: <a href="https://www.data.gv.at/datasets/383408d4-89b8-42df-af53-5c89f91e0cc7?locale=de">Stadt Wien (CC BY 4.0)</a>',

  // Marker-Gruppierung (Cluster)
  clusterRadius: 52,          // Pixel-Radius, ab dem Marker zusammengefasst werden
  clusterBisZoom: 17,         // ab diesem Zoom werden alle Marker einzeln gezeigt
};
