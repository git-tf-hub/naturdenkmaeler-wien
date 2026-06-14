# Projekt: Naturdenkmäler Wien

Interaktive Karten-Website (statisches HTML/CSS/JS, kein Build-Schritt).

## Kontext

- Karte aller Naturdenkmäler Wiens auf Basis der offiziellen Open-Data-Daten
  der Stadt Wien (762 Einträge, CC BY 4.0)
- Tim ergänzt später eigene Daten (CSV/JSON) — dafür gibt es
  `data/eigene-daten.js` und den Datenlader (`js/datenlader.js`)

## Zwei Versionen — Workflow beachten!

- **`Naturdenkmäler Wien.html`** = automatisch erzeugte Einzeldatei (CSS/JS/
  Daten inline) — das ist Tims portable Datei zum Öffnen und Weitergeben.
  **Niemals direkt bearbeiten!**
- **`entwicklung.html`** + `css/` + `js/` + `data/` = Arbeitsversion, hier
  werden alle Änderungen gemacht
- Nach jeder Änderung Einzeldatei neu bauen:
  `python3 werkzeuge/baue-einzeldatei.py`
- Der Build erzeugt zugleich `index.html` (gleicher Inhalt, selbst-enthalten)
  — das ist die Startseite der Online-Version.

## Online-Version (GitHub Pages — fürs iPhone)

- Live-Link: **https://git-tf-hub.github.io/naturdenkmaeler-wien/**
  (am iPhone in Safari öffnen → Teilen → „Zum Home-Bildschirm" = app-artig)
- Repo: `git-tf-hub/naturdenkmaeler-wien` (öffentlich), serviert `index.html`
  aus dem `main`-Branch (Root). `Naturdenkmäler Wien.html` ist per
  `.gitignore` ausgeschlossen (redundant zu index.html).
- **Online aktualisieren** (nach Änderungen an css/js/data):
  1. `python3 werkzeuge/baue-einzeldatei.py`  (baut index.html mit)
  2. `git add -A && git commit -m "…" && git push`
  3. Pages baut automatisch neu (~1 Min), Link bleibt gleich
- Erfordert eingeloggte `gh`-CLI (Account `git-tf-hub`).

## Art-Steckbriefe ("Erzähl mir mehr")

- `data/art-infos.js` = echte botanische Kurztexte PRO BAUMART (~90 Arten),
  Schlüssel = wiss. Name klein (`"quercus robur"`, Gattung als Rückfall
  `"quercus"`, Zuchtform `"fagus sylvatica pendula"`).
- Zuordnung: `artInfoFuer(wissName)` in `js/kategorien.js` (Sorte → Art →
  Gattung). Treffer ersetzt im Popup den Kategorie-Text; kein Treffer (Art
  `-`/leer, also Felsen/Gewässer/Wiese/Lebensraum) → Kategorie-Text als
  Rückfall. Deckung aktuell 655/762 (86 %).
- **Bewusst NICHT pro Einzelbaum**: der Stadt-Wien-Datensatz hat keine
  Einzelbaum-Geschichten — erfundene Fakten gehören nicht in die Karte.
  Neue Art ergänzen → einfach Eintrag in `data/art-infos.js`.

## Entdecker-Routen

- 10 vorgespeicherte Spazier-Routen (`data/routen.js`) mit echten
  Fußweg-Linien — werden NICHT von Hand bearbeitet, sondern erzeugt mit
  `python3 werkzeuge/baue-routen.py` (braucht Internet: OSRM-Fußrouting)
- Routen-Definition (Anker-IDs, Namen, Öffi-Infos) liegt im Werkzeug selbst
- Zeit-Annahmen: 4 km/h + 3 min Stopp pro Station, Ziel 60–115 min
- UI-Logik in `js/routen.js`, Rotation/Abhaken via localStorage
  (`naturdenkmaeler-route-*`)
- Entscheidungs-Doku: `~/.claude/brainstorms/2026-06-12-routen-generator-naturdenkmaeler.md`

## Technik

- Leaflet 1.9.4 + Leaflet.markercluster 1.5.3 (CDN, kein npm)
- Reine Script-Tags, keine ES-Module → funktioniert per Doppelklick (file://)
- Daten liegen als `const` in `.js`-Dateien (kein fetch → kein CORS-Problem)
- Lokaler Test-Server: `python3 -m http.server 8642` im Projektordner
  (Konfiguration in `.claude/launch.json`)

## Design (projektspezifisch — NICHT TF-Design)

- Vintage-Naturforscher-Look mit Comic-Elementen, explizit von Tim gewünscht
- Farben: gealtertes Papier (`#f4ecd9`), Tintenbraun (`#3d2f1c`),
  Waldgrün (`#3e7a3a`), Stempelrot (`#a4473a`)
- Schriften: Amatic SC (Titel), Patrick Hand (Text), Caveat (Notizen)
- Handgezeichnete Effekte: wacklige Border-Radien (`--wackel-rund`),
  Offset-Schatten, Papierkorn-Overlay, Emojis als Marker
- Kartenkacheln bekommen Sepia-Filter (`.leaflet-tile`)

## Stolperfallen

- **Nie `tile.openstreetmap.org` als Kachel-Quelle** — deren Server blocken
  eingebettete/portable Apps („Access blocked — Referer is required"). Wir
  nutzen CARTO Voyager (`js/config.js` → `kachelUrl`), das auch ohne Referer
  per file://-Doppelklick lädt. Sepia-Look kommt vom CSS-Filter, nicht vom
  Anbieter — Provider darf also gewechselt werden, ohne dass der Look leidet.
- **Kein `popup.update()`** im „Erzähl mir mehr"-Handler aufrufen — das baut
  den Popup-Inhalt neu auf, entfernt den geklickten Button aus dem DOM und
  Leaflet schließt dadurch das Popup (Klick gilt dann als Karten-Klick)
- Klicks in Popup-Buttons brauchen `stopPropagation()`
- Neue Kategorien immer in `js/kategorien.js` ergänzen — unbekannte Typen
  landen sonst als „Sonstiges" auf der Karte
- **Preview-Server kann nicht direkt aus dem Dokumente-Ordner servieren**
  (macOS-Berechtigung des Preview-Prozesses: kein Lesezugriff, kein `getcwd`).
  `.claude/launch.json` serviert deshalb den Spiegel `/tmp/nd-preview/` —
  als Python-Einzeiler ohne `getcwd` und ohne Shell (`sh -c` scheitert dort
  ebenfalls). Der Spiegel wird NICHT automatisch aktuell gehalten — nach
  jeder Datei-Änderung vor dem Testen einmal ausführen:
  `rsync -a --delete --exclude '.claude' "/Users/timfl/Documents/Tim Dokumente/sOnsTiGEs/Naturdenkmäler/" /tmp/nd-preview/`
- Der Preview-Browser läuft „hidden" → `requestAnimationFrame` pausiert.
  `js/routen.js` zeichnet deshalb bei verstecktem Tab sofort fertig
  (plus Timeout-Sicherheitsnetz) — beim Testen daran denken

## Konventionen

- Alles auf Deutsch: Variablennamen, Kommentare, UI-Texte
- Änderungen an UI vor „fertig"-Meldung in 3 Viewports prüfen
  (375 / 768 / 1280) — siehe Verifikationspflicht in globaler CLAUDE.md
