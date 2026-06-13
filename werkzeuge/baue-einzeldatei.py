# =====================================================================
# Baut aus der modularen Arbeitsversion (entwicklung.html) die portable
# Einzeldatei "Naturdenkmäler Wien.html" — mit CSS, Skripten und Daten
# direkt eingebettet. Die Einzeldatei funktioniert überall, auch wenn
# sie alleine verschoben oder verschickt wird.
#
# Ausführen (im Projektordner):
#   python3 werkzeuge/baue-einzeldatei.py
# =====================================================================

import re
from datetime import date
from pathlib import Path

projekt = Path(__file__).resolve().parent.parent
quelle = projekt / 'entwicklung.html'
ziel = projekt / 'Naturdenkmäler Wien.html'

html = quelle.read_text(encoding='utf-8')

# 1. Lokales Stylesheet einbetten
def style_einbetten(treffer):
    pfad = projekt / treffer.group(1)
    return '<style>\n' + pfad.read_text(encoding='utf-8') + '\n</style>'

html = re.sub(
    r'<link rel="stylesheet" href="((?!https?://)[^"]+)">',
    style_einbetten,
    html,
)

# 2. Lokale Skripte einbetten (CDN-Skripte bleiben unverändert)
def skript_einbetten(treffer):
    pfad = projekt / treffer.group(1)
    inhalt = pfad.read_text(encoding='utf-8')
    if '</script' in inhalt:
        raise SystemExit(f'Fehler: {pfad.name} enthält "</script>" — kann nicht eingebettet werden.')
    return f'<script>\n// ── eingebettet aus {treffer.group(1)} ──\n{inhalt}\n</script>'

html = re.sub(
    r'<script src="((?!https?://)[^"]+)"></script>',
    skript_einbetten,
    html,
)

# 3. Hinweis-Kommentar an den Anfang
hinweis = (
    '<!-- =================================================================\n'
    '  AUTOMATISCH ERZEUGTE EINZELDATEI — bitte nicht von Hand bearbeiten!\n'
    f'  Erzeugt am {date.today().strftime("%d.%m.%Y")} aus entwicklung.html\n'
    '  Änderungen: in css/, js/, data/ machen, dann neu bauen mit\n'
    '  python3 werkzeuge/baue-einzeldatei.py\n'
    '================================================================== -->\n'
)
html = html.replace('<!DOCTYPE html>\n', '<!DOCTYPE html>\n' + hinweis, 1)

ziel.write_text(html, encoding='utf-8')

# Zusätzlich als index.html ablegen — das ist die Startseite für GitHub Pages
# (online-Version fürs iPhone). Gleicher Inhalt, bleibt automatisch in sync.
index = projekt / 'index.html'
index.write_text(html, encoding='utf-8')

groesse_kb = ziel.stat().st_size // 1024
uebrig = re.findall(r'(?:href|src)="((?!https?://|data:|#)[^"]+)"', html)
print(f'✅ {ziel.name} gebaut ({groesse_kb} KB)')
print(f'✅ {index.name} gebaut (Startseite für GitHub Pages)')
if uebrig:
    print('⚠️  Noch lokale Verweise enthalten:', uebrig)
else:
    print('✅ Keine lokalen Verweise mehr — Datei ist überall lauffähig')
