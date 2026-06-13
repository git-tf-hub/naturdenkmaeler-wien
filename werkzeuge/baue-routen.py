# =====================================================================
# Baut die 10 Spazier-Routen für die Naturdenkmäler-Karte.
#
# Was passiert hier:
#   1. Für jede Route sind "Anker" definiert (Naturdenkmal-IDs in
#      Geh-Reihenfolge: erster = Start, letzter = Ziel).
#   2. Alle Denkmäler nahe der Strecke werden eingesammelt, gleiche
#      Adressen/Grüppchen zu einer Station zusammengefasst und in
#      Geh-Reihenfolge gebracht.
#   3. Die echte Fußweg-Linie kommt EINMALIG vom OSRM-Routing-Dienst
#      (routing.openstreetmap.de, Fußgänger-Profil) — zur Laufzeit
#      braucht die Karte also kein Internet und keine API.
#   4. Ergebnis wird nach data/routen.js geschrieben.
#
# Zeit-Annahmen (mit Tim abgestimmt, siehe Brainstorm-Notizen):
#   Gehtempo 4 km/h + 3 Minuten Stopp pro Station → Ziel: 60–110 min.
#
# Ausführen (im Projektordner, braucht Internet):
#   python3 werkzeuge/baue-routen.py
# =====================================================================

import json
import math
import re
import subprocess
import time
from datetime import date
from pathlib import Path

projekt = Path(__file__).resolve().parent.parent
daten_datei = projekt / 'data' / 'naturdenkmaeler-wien.js'
ziel_datei = projekt / 'data' / 'routen.js'

OSRM_BASIS = 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/'
GEHTEMPO_KMH = 4.0
STOPP_MIN = 3.0

# ---------------------------------------------------------------------
# Die 10 Routen — von Hand kuratiert (über ganz Wien verteilt)
# ---------------------------------------------------------------------

ROUTEN = [
    {
        'id': 1,
        'name': 'Ring der Riesen',
        'beschreibung': 'Vom Ginkgo im Stadtpark über den geheimnisvollen '
                        '„Wald von Nachod" im Burggarten bis zu den mächtigen '
                        'Platanen im Rathauspark — die grünen Riesen der Ringstraße.',
        'gegend': '1. Bezirk · Stadtpark bis Rathausplatz',
        'oeffiStart': 'U4 Stadtpark',
        'oeffiZiel': 'U2 Rathaus',
        'anker': [3257446, 3257652, 3257888, 3257855, 3247628, 3257402, 3257543, 3257649],
        'korridor': 0.18,
        'minAbstand': 0.12,
        'maxStationen': 13,
    },
    {
        'id': 2,
        'name': 'Stieleichen-Safari im Prater',
        'beschreibung': 'Von der Venediger Au durch das grüne Herz der '
                        'Leopoldstadt: uralte Stieleichen, ein Ginkgo, eine '
                        'kletternde Jungfernrebe und die Kaiserallee.',
        'gegend': '2. Bezirk · Praterstern bis Stadion',
        'oeffiStart': 'U1/U2 Praterstern',
        'oeffiZiel': 'U2 Stadion',
        'anker': [3257920, 3257933, 3257871, 3247613, 3257977, 3257982],
        'korridor': 0.20,
        'minAbstand': 0.12,
        'maxStationen': 12,
    },
    {
        'id': 3,
        'name': 'Expedition Himmelstraße',
        'beschreibung': 'Steil bergauf durch die Weinberge von Grinzing: '
                        'Eiben, ein Riesenmammutbaum und alte Buchen säumen '
                        'den Weg von der Himmelstraße zum Schreiberweg.',
        'gegend': '19. Bezirk · Grinzing bis Schreiberweg',
        'oeffiStart': 'Straßenbahn 38 Grinzing',
        'oeffiZiel': 'Bus 38A Oberer Schreiberweg',
        'anker': [3257556, 3247605, 3257789, 3257429, 3257397, 3257449, 3257772,
                  3257862, 3257975, 3257553, 3257931, 3257867],
        'korridor': 0.12,
        'minAbstand': 0.11,
        'maxStationen': 14,
    },
    {
        'id': 4,
        'name': 'Vom Schlosspark zur Türkenschanze',
        'beschreibung': 'Durch den Pötzleinsdorfer Schlosspark, vorbei an '
                        'einem uralten Gesteins-Aufschluss und einem '
                        'Riesenmammutbaum, hinüber ins Cottage-Viertel.',
        'gegend': '18. Bezirk · Pötzleinsdorf bis Türkenschanzpark',
        'oeffiStart': 'Straßenbahn 41 Pötzleinsdorf',
        'oeffiZiel': 'Straßenbahn 40/41 Türkenschanzplatz',
        'anker': [3247644, 3247651, 3247692, 3257584, 3257604, 3257557, 3257608, 3257958],
        'korridor': 0.13,
        'minAbstand': 0.13,
        'maxStationen': 12,
        # Der Amtsname "mehrere Baumgruppen und diverse Bäume" ist sperrig —
        # für die Routen-Liste bekommen diese Stationen schönere Namen:
        'anzeigeNamen': {
            3247644: 'Baumriesen im Pötzleinsdorfer Schlosspark',
            3247651: 'Baumgruppen am Schlosspark-Hügel',
        },
    },
    {
        'id': 5,
        'name': 'Kaiserliche Platanen-Promenade',
        'beschreibung': 'Rund um Schönbrunn auf den Spuren alter Hofgärtner: '
                        'morgenländische Platanen, zwei Ginkgos und eine '
                        'kalifornische Flusszeder im noblen Alt-Hietzing.',
        'gegend': '13. Bezirk · Hietzing bis Ober St. Veit',
        'oeffiStart': 'U4 Hietzing',
        'oeffiZiel': 'U4 Ober St. Veit',
        'anker': [3247694, 3257594, 3247640, 3247636, 3257603, 3257483, 3247690,
                  3257582, 3257911, 3257944],
        'korridor': 0.12,
        'minAbstand': 0.12,
        'maxStationen': 13,
    },
    {
        'id': 6,
        'name': 'Der Eiben-Pfad von Mauer',
        'beschreibung': 'Das alte Weinhauerdorf Mauer hütet einen Schatz: '
                        'eine ganze Schar uralter Eiben, dazu Edelkastanien '
                        'und die seltene Elsbeere.',
        'gegend': '23. Bezirk · Maurer Lange Gasse bis Endresstraße',
        'oeffiStart': 'Bus 60A Maurer Lange Gasse',
        'oeffiZiel': 'S-Bahn Atzgersdorf (ca. 10 min Fußweg)',
        'anker': [3257444, 3257614, 3257437, 3257956, 3257775, 3257453, 3257985,
                  3257804, 3257677],
        'korridor': 0.13,
        'minAbstand': 0.12,
        'maxStationen': 12,
    },
    {
        'id': 7,
        'name': 'Expedition Hofjagdallee',
        'beschreibung': 'Wildes West-Wien: von Hütteldorf hinaus zur alten '
                        'kaiserlichen Hofjagdallee, dann die Linzer Straße '
                        'entlang zu Schwarzkiefern und einem Platanen-Wäldchen.',
        'gegend': '14. Bezirk · Hütteldorf bis Bujattigasse',
        'oeffiStart': 'U4/S-Bahn Hütteldorf',
        'oeffiZiel': 'Straßenbahn 49 Bujattigasse (Endstation)',
        'anker': [3257550, 3257384, 3247600, 3257417, 3247585, 3247625],
        'korridor': 0.13,
        'minAbstand': 0.16,
        'maxStationen': 11,
    },
    {
        'id': 8,
        'name': 'Mammutbaum-Parade in Dornbach',
        'beschreibung': 'Eine ganze Parade von Riesenmammutbäumen auf einem '
                        'einzigen Spaziergang! Von Neuwaldegg gemütlich bergab '
                        'durch die Gärten von Dornbach.',
        'gegend': '17. Bezirk · Neuwaldegg bis Hernals',
        'oeffiStart': 'Straßenbahn 43 Neuwaldegg (Endstation)',
        'oeffiZiel': 'S45 Hernals',
        # Reihenfolge: erst der westliche Ast (Heuberggasse/Pointengasse),
        # dann der östliche (Dornbacher Straße) — spart ~20% Weg gegenüber
        # dem alten Ost-West-Ost-Zickzack (per 2-opt-Prüfung ermittelt)
        'anker': [3257690, 3257989, 3257717, 3257545, 3257742, 3257505,
                  3257391, 3257533, 3257950, 3257400, 3257806],
        'korridor': 0.13,
        'minAbstand': 0.12,
        'maxStationen': 13,
    },
    {
        'id': 9,
        'name': 'Auf der Spur des Speierlings',
        'beschreibung': 'Im Wertheimsteinpark wächst einer der seltensten '
                        'Bäume Wiens — der Speierling. Dazu Blutbuchen, '
                        'Ginkgos und Platanen im alten Döbling.',
        'gegend': '19. Bezirk · Spittelau bis Oberdöbling',
        'oeffiStart': 'U4/U6 Spittelau',
        'oeffiZiel': 'Straßenbahn 37 Silbergasse',
        'anker': [3257398, 3257547, 3257972, 3257969, 3257605, 3257785, 3257655,
                  3257401, 3257809],
        'korridor': 0.12,
        'minAbstand': 0.12,
        'maxStationen': 12,
    },
    {
        'id': 10,
        'name': 'Die Kaiser-Allee von Hetzendorf',
        'beschreibung': 'Auf dem alten Weg der Kaiser: vom Wäldchen Gatterhölzl '
                        'über das Schlösschen Altmannsdorf und die historische '
                        'Schönbrunner Allee — mit einer wintergrünen Eiche als Rarität.',
        'gegend': '12. Bezirk · Gatterhölzl bis Hetzendorf',
        'oeffiStart': 'U6 Niederhofstraße (ca. 12 min Fußweg)',
        'oeffiZiel': 'S-Bahn Hetzendorf',
        'anker': [3257380, 3247634, 3247682, 3257393, 3257612, 3257469, 3257470,
                  3257481, 3257459],
        'korridor': 0.12,
        'minAbstand': 0.12,
        'maxStationen': 12,
    },
]

# ---------------------------------------------------------------------
# Geometrie-Helfer
# ---------------------------------------------------------------------

def haversine_km(a, b):
    R = 6371.0
    la1, lo1, la2, lo2 = map(math.radians, [a[0], a[1], b[0], b[1]])
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


def _xy(p, lat0):
    # Grobe Meter-Projektion (für kurze Distanzen völlig ausreichend)
    return (p[1] * 111320 * math.cos(math.radians(lat0)), p[0] * 110540)


def punkt_zu_strecke_km(p, a, b, lat0):
    px, py = _xy(p, lat0)
    ax, ay = _xy(a, lat0)
    bx, by = _xy(b, lat0)
    dx, dy = bx - ax, by - ay
    laenge2 = dx * dx + dy * dy
    if laenge2 == 0:
        t = 0.0
    else:
        t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / laenge2))
    nx, ny = ax + t * dx, ay + t * dy
    return math.hypot(px - nx, py - ny) / 1000.0, t


def projektion_entlang(p, polyline, lat0):
    """Abstand zur Polylinie + Laufmeter-Position der nächsten Stelle."""
    bester = (float('inf'), 0.0)
    laufmeter = 0.0
    for a, b in zip(polyline, polyline[1:]):
        d, t = punkt_zu_strecke_km(p, a, b, lat0)
        seg = haversine_km(a, b)
        if d < bester[0]:
            bester = (d, laufmeter + t * seg)
        laufmeter += seg
    return bester


def vereinfache(linie, toleranz=0.00006):
    """Douglas-Peucker, Toleranz in Grad (~6 m) — spart Dateigröße."""
    if len(linie) < 3:
        return linie

    def senkrecht(p, a, b):
        if a == b:
            return math.hypot(p[0] - a[0], p[1] - a[1])
        dx, dy = b[0] - a[0], b[1] - a[1]
        return abs(dy * p[1] - dx * p[0] + b[0] * a[1] - b[1] * a[0]) / math.hypot(dx, dy)

    # iterativ statt rekursiv (lange Linien)
    behalten = [False] * len(linie)
    behalten[0] = behalten[-1] = True
    stapel = [(0, len(linie) - 1)]
    while stapel:
        i, j = stapel.pop()
        max_d, max_k = 0.0, -1
        for k in range(i + 1, j):
            d = senkrecht(linie[k], linie[i], linie[j])
            if d > max_d:
                max_d, max_k = d, k
        if max_d > toleranz and max_k > 0:
            behalten[max_k] = True
            stapel.append((i, max_k))
            stapel.append((max_k, j))
    return [p for p, b in zip(linie, behalten) if b]


# ---------------------------------------------------------------------
# Stationen wählen
# ---------------------------------------------------------------------

def lade_denkmaeler():
    text = daten_datei.read_text(encoding='utf-8')
    eintraege = [json.loads(m) for m in re.findall(r'\{[^{}]*\}', text)]
    return {e['id']: e for e in eintraege}


def waehle_stationen(route, denkmaeler, namens_haeufigkeit):
    anker = [denkmaeler[i] for i in route['anker']]
    anker_ids = set(route['anker'])
    polyline = [(a['lat'], a['lng']) for a in anker]
    lat0 = polyline[0][0]

    # 1. Kandidaten: alles nahe der Strecke (außer namenlose Einträge)
    kandidaten = []
    for d in denkmaeler.values():
        if d['name'].strip().lower() in ('nicht definiert', '-', ''):
            continue
        abstand, position = projektion_entlang((d['lat'], d['lng']), polyline, lat0)
        if abstand <= route['korridor']:
            kandidaten.append((position, d))

    # 2. Grüppchen zusammenfassen (gleiche Adresse oder < 70 m Abstand)
    kandidaten.sort(key=lambda k: k[0])
    gruppen = []
    for pos, d in kandidaten:
        platziert = False
        for g in gruppen:
            if any(haversine_km((d['lat'], d['lng']), (m['lat'], m['lng'])) < 0.07
                   for _, m in g):
                g.append((pos, d))
                platziert = True
                break
        if not platziert:
            gruppen.append([(pos, d)])

    # 3. Pro Gruppe einen Vertreter: Anker zuerst, sonst der seltenste Baum
    stationen = []
    for g in gruppen:
        anker_drin = [(pos, d) for pos, d in g if d['id'] in anker_ids]
        if anker_drin:
            pos, vertreter = anker_drin[0]
        else:
            pos, vertreter = min(g, key=lambda k: namens_haeufigkeit[k[1]['name']])
        stationen.append({'pos': pos, 'denkmal': vertreter,
                          'gruppe': len(g), 'istAnker': bool(anker_drin)})
    stationen.sort(key=lambda s: s['pos'])

    # 4. Mindestabstand zwischen Stationen (Anker bleiben immer)
    gefiltert = []
    for s in stationen:
        if s['istAnker'] or not gefiltert or (s['pos'] - gefiltert[-1]['pos']) >= route['minAbstand']:
            gefiltert.append(s)
    stationen = gefiltert

    # 5. Deckel: doppelte Baumarten zuerst streichen, dann eng stehende
    while len(stationen) > route['maxStationen']:
        gesehen = set()
        kandidat = None
        for s in stationen:
            name = s['denkmal']['name']
            if not s['istAnker'] and name in gesehen:
                kandidat = s
                break
            gesehen.add(name)
        if kandidat is None:
            ohne_anker = [s for s in stationen if not s['istAnker']]
            if not ohne_anker:
                break
            kandidat = min(ohne_anker, key=lambda s: s['pos'])
        stationen.remove(kandidat)

    return stationen


# ---------------------------------------------------------------------
# OSRM: echte Fußweg-Linie holen
# ---------------------------------------------------------------------

def hole_fussweg(stationen):
    koordinaten = ';'.join(f"{s['denkmal']['lng']:.6f},{s['denkmal']['lat']:.6f}"
                           for s in stationen)
    url = (OSRM_BASIS + koordinaten +
           '?overview=full&geometries=geojson&steps=false')
    # curl statt urllib: das System-Python hat keine SSL-Zertifikate
    lauf = subprocess.run(
        ['curl', '-s', '--max-time', '30',
         '-A', 'naturdenkmaeler-wien-karte (privates Hobby-Projekt)', url],
        capture_output=True, text=True)
    if lauf.returncode != 0 or not lauf.stdout:
        raise SystemExit(f'Routing-Dienst nicht erreichbar (curl-Fehler) — {url}')
    ergebnis = json.loads(lauf.stdout)
    if ergebnis.get('code') != 'Ok' or not ergebnis.get('routes'):
        raise SystemExit(f'OSRM-Fehler: {ergebnis.get("code")} — {url}')
    beste = ergebnis['routes'][0]
    linie = [(round(lat, 5), round(lng, 5))
             for lng, lat in beste['geometry']['coordinates']]
    return vereinfache(linie), beste['distance'] / 1000.0


# ---------------------------------------------------------------------
# Hauptprogramm
# ---------------------------------------------------------------------

def main():
    denkmaeler = lade_denkmaeler()
    namens_haeufigkeit = {}
    for d in denkmaeler.values():
        namens_haeufigkeit[d['name']] = namens_haeufigkeit.get(d['name'], 0) + 1

    fehlende = [i for r in ROUTEN for i in r['anker'] if i not in denkmaeler]
    if fehlende:
        raise SystemExit(f'Unbekannte Anker-IDs: {fehlende}')

    ergebnisse = []
    for route in ROUTEN:
        stationen = waehle_stationen(route, denkmaeler, namens_haeufigkeit)
        linie, distanz_km = hole_fussweg(stationen)
        geh_min = distanz_km / GEHTEMPO_KMH * 60
        stopp_min = STOPP_MIN * len(stationen)
        gesamt_min = round(geh_min + stopp_min)

        anzeige_namen = route.get('anzeigeNamen', {})
        stationen_js = []
        for s in stationen:
            eintrag = {'id': s['denkmal']['id'], 'gruppe': s['gruppe']}
            if s['denkmal']['id'] in anzeige_namen:
                eintrag['anzeige'] = anzeige_namen[s['denkmal']['id']]
            stationen_js.append(eintrag)

        ergebnisse.append({
            'id': route['id'],
            'name': route['name'],
            'beschreibung': route['beschreibung'],
            'gegend': route['gegend'],
            'oeffiStart': route['oeffiStart'],
            'oeffiZiel': route['oeffiZiel'],
            'distanzKm': round(distanz_km, 1),
            'gehMin': round(geh_min),
            'stoppMin': round(stopp_min),
            'gesamtMin': gesamt_min,
            'stationen': stationen_js,
            'linie': [[p[0], p[1]] for p in linie],
        })

        warnung = '' if 60 <= gesamt_min <= 115 else '  ⚠️ AUSSERHALB 60–115!'
        print(f"\n── Route {route['id']}: {route['name']}{warnung}")
        print(f"   {distanz_km:.1f} km · {round(geh_min)} min Gehzeit + "
              f"{round(stopp_min)} min Stopps = {gesamt_min} min · "
              f"{len(stationen)} Stationen · {len(linie)} Linienpunkte")
        for nr, s in enumerate(stationen, 1):
            d = s['denkmal']
            extra = f' (Grüppchen aus {s["gruppe"]})' if s['gruppe'] > 1 else ''
            print(f"   {nr:>2}. {d['name']}{extra} — {d.get('adresse', '')}")

        time.sleep(1)  # höflich zum kostenlosen Routing-Dienst sein

    js_daten = json.dumps(ergebnisse, ensure_ascii=False, indent=1)
    ziel_datei.write_text(
        '// =====================================================================\n'
        '// Spazier-Routen zu den Naturdenkmälern — AUTOMATISCH ERZEUGT!\n'
        '// Nicht von Hand bearbeiten — Änderungen in werkzeuge/baue-routen.py\n'
        '// machen und neu bauen: python3 werkzeuge/baue-routen.py\n'
        f'// Stand: {date.today().strftime("%d.%m.%Y")} · Fußwege: OSRM/OpenStreetMap\n'
        '// Annahmen: 4 km/h Gehtempo + 3 min Stopp pro Station\n'
        '// =====================================================================\n\n'
        f'const ROUTEN_WIEN = {js_daten};\n',
        encoding='utf-8')
    groesse_kb = ziel_datei.stat().st_size // 1024
    print(f'\n✅ {ziel_datei.relative_to(projekt)} geschrieben ({groesse_kb} KB)')


if __name__ == '__main__':
    main()
