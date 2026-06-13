// =====================================================================
// App-Start — lädt die Daten, baut Karte und Legende auf.
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
  const daten = ladeAlleDaten();

  // Anzahl im Stempel-Badge eintragen
  const zaehler = document.getElementById('anzahl-denkmaeler');
  if (zaehler) zaehler.textContent = daten.length;

  const kartenApi = erstelleKarte(daten);
  erstelleLegende(kartenApi);
  if (typeof erstelleRouten === 'function') erstelleRouten(kartenApi, daten);
});
