// =====================================================================
// Kategorien der Naturdenkmäler
// Jede Kategorie hat: Emoji (Kartenmarker), Farbe, kurzes Label für die
// Legende und eine Beschreibung für "Erzähl mir mehr".
// Neue Kategorie ergänzen → einfach einen Eintrag hinzufügen.
// =====================================================================

const KATEGORIEN = {
  'Einzelbaum': {
    emoji: '🌳',
    farbe: '#3e7a3a',
    kurzLabel: 'Einzelbaum',
    beschreibung:
      'Ein einzelner Baum, der wegen seines Alters, seiner Größe oder seiner Schönheit unter Schutz steht. Viele dieser Riesen sind weit über 100 Jahre alt!',
  },
  'Baumgruppe (ab 4 Bäumen)': {
    emoji: '🌲',
    farbe: '#2d5a27',
    kurzLabel: 'Baumgruppe',
    beschreibung:
      'Eine Gruppe von mindestens vier Bäumen, die gemeinsam geschützt ist — oft ein kleines grünes Ensemble mitten in der Stadt.',
  },
  'Baumzeile': {
    emoji: '🌿',
    farbe: '#6b8e23',
    kurzLabel: 'Baumzeile',
    beschreibung:
      'Mehrere Bäume in einer Reihe — zum Beispiel entlang von Wegen, Mauern oder Grundstücksgrenzen.',
  },
  'Allee': {
    emoji: '🍃',
    farbe: '#8a9a3b',
    kurzLabel: 'Allee',
    beschreibung:
      'Eine von Bäumen gesäumte Straße oder ein Weg — meist auf beiden Seiten bepflanzt. Im Sommer ein schattiges Blätterdach!',
  },
  'Wald': {
    emoji: '🦉',
    farbe: '#1f4218',
    kurzLabel: 'Wald',
    beschreibung:
      'Ein ganzes Waldstück, das als Naturdenkmal geschützt ist — Lebensraum für Eulen, Spechte und viele andere Tiere.',
  },
  'Gewässer': {
    emoji: '💧',
    farbe: '#4a7ba6',
    kurzLabel: 'Gewässer',
    beschreibung:
      'Ein Teich, Bach oder anderes Gewässer mit besonderem ökologischem Wert — hier tummeln sich Frösche, Libellen und Wasservögel.',
  },
  'Geologischer Aufschluss': {
    emoji: '🪨',
    farbe: '#8b7355',
    kurzLabel: 'Felsen & Gestein',
    beschreibung:
      'Eine freiliegende Gesteinsformation, die einen Blick in die Erdgeschichte Wiens erlaubt — Millionen Jahre alt!',
  },
  'Wiese': {
    emoji: '🌼',
    farbe: '#c9a227',
    kurzLabel: 'Wiese',
    beschreibung:
      'Eine artenreiche Wiese mit seltenen Blumen und Gräsern — ein Paradies für Bienen und Schmetterlinge.',
  },
  'Standort besonderer Pflanzen-/Tiergemeinschaften': {
    emoji: '🦋',
    farbe: '#a05c2d',
    kurzLabel: 'Lebensraum',
    beschreibung:
      'Ein Lebensraum, in dem seltene Tier- oder Pflanzenarten zuhause sind — besonders schützenswert!',
  },
  'Objekt kulturhistorischer Bedeutung': {
    emoji: '🏛️',
    farbe: '#7a5c8e',
    kurzLabel: 'Kulturerbe',
    beschreibung:
      'Ein Naturobjekt mit besonderer Bedeutung für die Kultur- oder Ortsgeschichte Wiens.',
  },
  'Sonstiges': {
    emoji: '❓',
    farbe: '#857c6e',
    kurzLabel: 'Sonstiges',
    beschreibung: 'Ein besonderes Naturdenkmal, das in keine der üblichen Kategorien passt.',
  },
};

// Liefert die Kategorie zu einem Typ — unbekannte Typen landen bei "Sonstiges"
function kategorieFuer(typ) {
  return KATEGORIEN[typ] || KATEGORIEN['Sonstiges'];
}

// Wiener Bezirke (Nummer → Name)
const BEZIRKE = {
  1: 'Innere Stadt', 2: 'Leopoldstadt', 3: 'Landstraße', 4: 'Wieden',
  5: 'Margareten', 6: 'Mariahilf', 7: 'Neubau', 8: 'Josefstadt',
  9: 'Alsergrund', 10: 'Favoriten', 11: 'Simmering', 12: 'Meidling',
  13: 'Hietzing', 14: 'Penzing', 15: 'Rudolfsheim-Fünfhaus', 16: 'Ottakring',
  17: 'Hernals', 18: 'Währing', 19: 'Döbling', 20: 'Brigittenau',
  21: 'Floridsdorf', 22: 'Donaustadt', 23: 'Liesing',
};
