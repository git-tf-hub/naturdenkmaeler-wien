// =====================================================================
// Legende — zeigt alle Kategorien mit Emoji, Farbe und Anzahl.
// Antippen einer Zeile blendet die Kategorie auf der Karte ein/aus.
// =====================================================================

function erstelleLegende(kartenApi) {
  const liste = document.getElementById('legende-liste');
  const zuruecksetzen = document.getElementById('legende-reset');
  const anzahlen = kartenApi.anzahlProKategorie();

  // Auf schmalen Bildschirmen startet die Legende zugeklappt —
  // weniger Scrollen bis zum Seitenende. Aufklappen geht jederzeit.
  const aufklappElement = liste.closest('details');
  if (aufklappElement && !window.matchMedia('(min-width: 1000px)').matches) {
    aufklappElement.removeAttribute('open');
  }

  // Nur Kategorien zeigen, die auch Daten haben — in Reihenfolge von KATEGORIEN
  const aktiveTypen = Object.keys(KATEGORIEN).filter((typ) => anzahlen[typ]);

  aktiveTypen.forEach((typ) => {
    const kat = KATEGORIEN[typ];

    const zeile = document.createElement('button');
    zeile.type = 'button';
    zeile.className = 'legende-zeile';
    zeile.setAttribute('aria-pressed', 'true');
    zeile.style.setProperty('--kat-farbe', kat.farbe);
    zeile.innerHTML = `
      <span class="legende-emoji">${kat.emoji}</span>
      <span class="legende-label">${kat.kurzLabel}</span>
      <span class="legende-anzahl">${anzahlen[typ]}</span>`;

    zeile.addEventListener('click', () => {
      const sichtbar = zeile.getAttribute('aria-pressed') === 'true';
      zeile.setAttribute('aria-pressed', String(!sichtbar));
      zeile.classList.toggle('aus', sichtbar);
      kartenApi.setzeKategorieSichtbar(typ, !sichtbar);
    });

    liste.appendChild(zeile);
  });

  // "Alle zeigen" — setzt sämtliche Filter zurück
  zuruecksetzen.addEventListener('click', () => {
    liste.querySelectorAll('.legende-zeile.aus').forEach((zeile) => {
      zeile.click();
    });
  });
}
