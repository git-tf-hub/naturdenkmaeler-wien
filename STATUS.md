# Status — Naturdenkmäler Wien

**Stand: 13.06.2026**

## ✅ Fertig

- **Art-Steckbriefe bei „Erzähl mir mehr"** (NEU, 14.06.):
  - Statt des immer gleichen Kategorie-Satzes zeigt jeder Baum jetzt einen
    echten botanischen Steckbrief seiner Art (`data/art-infos.js`, ~90 Arten,
    z. B. Ginkgo = lebendes Fossil, Mammutbaum = größter Baum der Welt)
  - Zuordnung über `artInfoFuer()` in `js/kategorien.js` (Sorte→Art→Gattung,
    inkl. Zuchtformen wie Blutbuche/Trauerbuche); Rückfall = Kategorie-Text
  - Deckung 655/762 (86 %); die restlichen 107 sind Nicht-Bäume (Felsen,
    Gewässer, Wiese, Lebensraum) ohne Art → korrekt Kategorie-Text
  - Bewusst NICHT pro Einzelbaum erfunden (Datensatz gibt das nicht her)
  - Geprüft: Logik über alle 762 Einträge + Popup visuell (Ginkgo)

- **Karte füllt am Handy mehr Bildschirm** (NEU, 13.06.):
  - Mobil von `58vh` (max 560px) auf `80dvh` (max 920px) erhöht; `dvh`
    statt `vh` → passt sich der echten sichtbaren Höhe an (Safari-Leiste,
    je nach Handy-Typ). Basis-Höhe ebenfalls auf `dvh` mit vh-Fallback.
  - Getestet: SE 534px · 375×812 650px · Pro Max 746px = überall ~80%

- **Online gestellt für iPhone — GitHub Pages** (NEU, 13.06.):
  - Live: **https://git-tf-hub.github.io/naturdenkmaeler-wien/**
    (am iPhone in Safari öffnen, optional „Zum Home-Bildschirm")
  - Repo `git-tf-hub/naturdenkmaeler-wien` (öffentlich), Pages aus
    `main`/Root, serviert die selbst-enthaltene `index.html`
  - Build erzeugt `index.html` jetzt automatisch mit (in `baue-einzeldatei.py`)
  - Mobil getestet (375px): Layout stapelt korrekt, CARTO-Kacheln laden,
    keine Konsolen-Fehler
  - Update-Weg: bauen → `git add -A && git commit && git push` → Pages
    baut in ~1 Min neu (Details in CLAUDE.md)

- **Kacheln von OSM auf CARTO Voyager umgestellt** (NEU, 13.06.):
  - Ursache eines „Access blocked — Referer is required"-Fehlers auf einem
    fremden Laptop: `tile.openstreetmap.org` blockt eingebettete/portable
    Apps nach ihrer Tile-Usage-Policy. Eigener Rechner kam (gecacht) durch.
  - Fix in `js/config.js`: `kachelUrl` → CARTO Voyager
    (`{s}.basemaps.cartocdn.com/rastertiles/voyager/...`), liefert auch ohne
    Referer (file://-Doppelklick) Kacheln; CARTO-Attribution ergänzt.
  - Sepia-Vintage-Look bleibt (CSS-Filter unverändert). Einzeldatei neu
    gebaut, im Browser bei 1280px geprüft: Kacheln laden, keine Fehler.

- **Routen-Audit + Richtungspfeile** (12.06. Abend):
  - Alle 10 Routen rechnerisch geprüft (2-opt-Reihenfolge-Check + Umweg-
    Faktoren pro Etappe via OSRM): 9 Routen waren bereits optimal sortiert
  - Route 8 (Dornbach) umsortiert: erst West-Ast (Heuberg-/Pointengasse),
    dann Ost-Ast — 5,1 → 4,3 km, 113 → 98 min
  - Etappen mit hohem Umweg-Faktor sind echte Geografie (Wienfluss/Bahn
    bei der Hofjagdallee, Hanglagen Grinzing) — dort ist der angezeigte
    Weg trotzdem der kürzeste Fußweg
  - Richtungspfeile ➤ ca. alle 100 m auf der Linie, erscheinen mit der
    Animation; bei weiter Zoomstufe automatisch ausgedünnt
    (200/400/800 m), sonst würden sie überlappen

- **Responsives 3-Spalten-Layout** (NEU, 12.06. Abend):
  - ≥ 1280 px: Routenplaner links · Karte mittig (größer: Seite 1560px,
    Karte volle Fensterhöhe = 100vh−2rem, bündig mit den Seitenspalten) ·
    Legende rechts (schmal, 230px; Label „Lebensraum" statt
    „Pflanzen- & Tierwelt" damit nichts umbricht);
    Seitenspalten kleben + scrollen intern
  - 1000–1279 px: Karte links, rechts Planer oben + Legende darunter
  - < 1000 px: gestapelt Karte → Planer → Legende (zugeklappt);
    „Route generieren" scrollt zur Karte
  - Technik: CSS grid-template-areas in `css/style.css`, Reihenfolge im
    Markup = Handy-Reihenfolge

- **Entdecker-Routen-Feature** (NEU, 12.06.):
  - „Route generieren"-Knopf in der Seitenleiste → zeigt eine von 10
    vorgespeicherten Spazier-Routen (je ca. 70–115 min inkl. 3 min Stopp
    pro Station, 4 km/h Gehtempo)
  - Echte Fußweg-Linien, einmalig via OSRM vorberechnet → Seite bleibt
    offline-fähig. Neu bauen: `python3 werkzeuge/baue-routen.py` (braucht Internet)
  - Schatzkarten-Animation: Zoom auf Route, gestrichelte Stempelrot-Linie
    zeichnet sich in ~3,5 s, Stationen poppen auf, 🚩 Start / 🏁 Ziel
  - Routen-Panel: Expeditions-Name, Beschreibung, Dauer/Länge/Stationen,
    Öffi-Info zu Start und Ziel, nummerierte Stations-Liste
  - Liste: Klick fliegt zur Station + öffnet Popup; Checkboxen zum Abhaken
    (Fortschritt im Browser gespeichert, „Expedition abgeschlossen!"-Stempel)
  - Aktionen: Als Text kopieren · Liste drucken (eigene Druckansicht) ·
    Route ausblenden
  - Rotation der Reihe nach 1→10→1, Position wird im Browser gemerkt
  - Alle Entscheidungen dazu: `~/.claude/brainstorms/2026-06-12-routen-generator-naturdenkmaeler.md`

- **Portable Einzeldatei** `Naturdenkmäler Wien.html` (308 KB, alles inline) —
  funktioniert auch alleine verschoben/verschickt.
  Neu bauen nach Änderungen: `python3 werkzeuge/baue-einzeldatei.py`
- Arbeitsversion heißt `entwicklung.html` (modular, mit css/js/data)

- Website komplett aufgebaut (Karte, Popups, „Erzähl mir mehr", Legende mit Filter)
- Offizielle Daten der Stadt Wien eingebaut: 762 Naturdenkmäler, 11 Kategorien
- Vintage-Comic-Design (Papier-Look, Handschrift-Fonts, Emoji-Marker, Sepia-Karte)
- Responsive geprüft: 375 px / 768 px / 1280 px, keine Konsolen-Fehler
  (Routen-Feature am 12.06. in allen 3 Größen + in der Einzeldatei getestet)
- README mit Anleitung zum Daten-Ergänzen

## ⏳ Offen

- Tims eigene CSV/JSON-Daten einpflegen, sobald sie kommen
  (→ `data/eigene-daten.js` oder als neue Quelle im Datenlader)
- Optional: eigene `kurzinfo`/`details`-Texte für bekannte Highlights
  (z. B. Platane am Karlsplatz, 1000-jährige Eiche)
- Öffi-Angaben der Routen sind plausibel gewählt, aber nicht amtlich
  geprüft — bei Gelegenheit gegen Wiener-Linien-Plan checken

## 💡 Ideen (nicht beauftragt)

- Suchfeld nach Name/Bezirk
- Bezirks-Filter zusätzlich zum Kategorie-Filter
- „In Google Maps öffnen"-Link im Popup
- Weitere Routen (z. B. Dehnepark/Tulpenbaum — flog wegen Überlänge aus Route 7)
