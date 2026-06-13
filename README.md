# 🌳 Naturdenkmäler Wien

Interaktive Karte aller 762 Naturdenkmäler Wiens — im Vintage-Naturforscher-Look.

## Öffnen

Einfach `Naturdenkmäler Wien.html` doppelklicken — die Seite läuft direkt im Browser.
(Internet wird benötigt, weil die Kartenkacheln von OpenStreetMap kommen.)

`Naturdenkmäler Wien.html` ist eine **Alles-in-einer-Datei**: Design, Skripte
und alle 762 Daten stecken direkt drin. Du kannst sie verschieben, kopieren
oder verschicken — sie funktioniert überall.

⚠️ Diese Datei wird automatisch erzeugt — **nicht von Hand bearbeiten**.
Änderungen macht man in der Arbeitsversion (`entwicklung.html` + Ordner
`css/`, `js/`, `data/`) und baut die Einzeldatei dann neu:

```
python3 werkzeuge/baue-einzeldatei.py
```

## Bedienung

- **Marker antippen** → Kurzinfo erscheint
- **„Erzähl mir mehr 📖"** → Details aufklappen
- **Kreise mit Zahlen** → mehrere Denkmäler, antippen zoomt hinein
- **Legende** → Kategorie antippen blendet sie ein/aus
- Touch-Gesten (Wischen, Pinch-Zoom) funktionieren am Handy/Tablet

## Eigene Daten ergänzen

### Weg 1: Einzelne Einträge (am einfachsten)

In `data/eigene-daten.js` neue Einträge in die Liste schreiben — Vorlage
steht als Kommentar in der Datei. Pflichtfelder: `name`, `typ`, `lat`, `lng`.
Optional: `wissName`, `bezirk`, `adresse`, `kurzinfo`, `details`.

Mit `kurzinfo` und `details` kannst du eigene Texte fürs Popup und für
„Erzähl mir mehr" hinterlegen.

### Weg 2: Eigene CSV/JSON-Datei

1. Daten in eine neue Datei legen, z. B. `data/meine-daten.js`:
   `const MEINE_DATEN = [ {…}, {…} ];`
   (CSV vorher in dieses Format umwandeln — Spalten → Felder wie oben)
2. Datei in `entwicklung.html` bei den anderen Daten-Skripten einbinden
3. Konstante in `js/datenlader.js` in die Liste `QUELLEN` eintragen
4. Einzeldatei neu bauen: `python3 werkzeuge/baue-einzeldatei.py`

GeoJSON-FeatureCollections (z. B. von data.gv.at) werden automatisch erkannt.

### Offizielle Daten aktualisieren

Aktuelles GeoJSON der Stadt Wien herunterladen:

```
https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:NATDENKMALPKTOGD&srsName=EPSG:4326&outputFormat=json
```

## Aufbau

| Datei | Zweck |
|---|---|
| `Naturdenkmäler Wien.html` | fertige Einzeldatei (automatisch erzeugt) |
| `entwicklung.html` | Arbeitsversion — bindet die Module unten ein |
| `werkzeuge/baue-einzeldatei.py` | baut die Einzeldatei aus der Arbeitsversion |
| `css/style.css` | Vintage-Comic-Design |
| `js/config.js` | Karteneinstellungen (Zoom, Zentrum, Kacheln) |
| `js/kategorien.js` | Kategorien: Emoji, Farbe, Beschreibung + Bezirksnamen |
| `js/datenlader.js` | sammelt und prüft alle Datenquellen |
| `js/karte.js` | Leaflet-Karte, Marker, Cluster, Popups |
| `js/legende.js` | Legende mit Kategorie-Filter |
| `js/app.js` | Startpunkt |
| `data/naturdenkmaeler-wien.js` | offizielle Daten der Stadt Wien (762 Stück) |
| `data/eigene-daten.js` | Platz für eigene Einträge |

## Datenquelle

[„Naturdenkmäler Standorte Wien"](https://www.data.gv.at/datasets/383408d4-89b8-42df-af53-5c89f91e0cc7?locale=de)
— Stadt Wien, Lizenz CC BY 4.0 · Stand Juni 2026
