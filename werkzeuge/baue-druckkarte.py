# =====================================================================
# Baut eine druckfertige A4-Seite (druckkarte.html) mit QR-Code zum
# Online-Link der Naturdenkmäler-Karte — im Vintage-Naturforscher-Stil.
#
# Der QR-Code wird als Inline-SVG eingebettet (scharf bei jeder Größe,
# kein Internet nötig). Ausführen (im Projektordner):
#   /usr/local/bin/python3 werkzeuge/baue-druckkarte.py
# Benötigt einmalig:  /usr/local/bin/python3 -m pip install segno
# =====================================================================

from pathlib import Path
import segno

URL = 'https://git-tf-hub.github.io/naturdenkmaeler-wien/'
URL_TEXT = 'git-tf-hub.github.io/naturdenkmaeler-wien'

projekt = Path(__file__).resolve().parent.parent
ziel = projekt / 'druckkarte.html'

# --- QR-Code als sauberes Inline-SVG (mit viewBox, scharf skalierbar) ---
qr = segno.make(URL, error='q')          # 25 % Fehlerkorrektur = robust im Druck
matrix = qr.matrix
n = len(matrix)
rand = 4                                  # Ruhezone (Quiet Zone) in Modulen
groesse = n + 2 * rand
rechtecke = []
for r, zeile in enumerate(matrix):
    for c, wert in enumerate(zeile):
        if wert:
            rechtecke.append('M%d %dh1v1h-1z' % (c + rand, r + rand))
pfad = ''.join(rechtecke)
qr_svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
    'shape-rendering="crispEdges" class="qr-svg" role="img" '
    'aria-label="QR-Code zur Naturdenkmaeler-Karte Wien">'
    '<rect width="%d" height="%d" fill="#ffffff"/>'
    '<path d="%s" fill="#2f2417"/></svg>'
) % (groesse, groesse, groesse, groesse, pfad)

# --- A4-Seite ----------------------------------------------------------
HTML = r"""<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Naturdenkmäler Wien — Druckkarte</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Caveat:wght@600&family=Patrick+Hand&display=swap" rel="stylesheet">
  <style>
    :root{
      --papier:#f4ecd9; --papier-hell:#faf5e8; --papier-rand:#ecdfc4;
      --tinte:#3d2f1c; --tinte-weich:#6f5d42;
      --gruen:#2d5a27; --braun:#8b5e34; --rot:#a4473a;
      --hand:'Patrick Hand','Comic Sans MS',cursive;
      --titel:'Amatic SC',var(--hand);
      --notiz:'Caveat',var(--hand);
    }
    *{box-sizing:border-box;}
    html,body{margin:0;padding:0;}
    body{
      font-family:var(--hand); color:var(--tinte);
      background:#8d8678;
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }
    @page{ size:A4 portrait; margin:0; }

    .blatt{
      position:relative; width:210mm; height:297mm; margin:0 auto; overflow:hidden;
      padding:20mm 18mm 16mm;
      display:flex; flex-direction:column; align-items:center; text-align:center;
      background:radial-gradient(125% 85% at 50% 0%, var(--papier-hell), var(--papier) 52%, var(--papier-rand) 100%);
    }
    /* feines Papierkorn */
    .blatt::before{
      content:""; position:absolute; inset:0; pointer-events:none; opacity:.5;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='k'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.24 0 0 0 0 0.18 0 0 0 0 0.11 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23k)'/%3E%3C/svg%3E");
    }
    .blatt > *{ position:relative; z-index:1; }

    .eyebrow{
      font-family:var(--notiz); font-size:30px; color:var(--rot);
      letter-spacing:.04em; margin-top:4mm;
    }
    .titel{
      font-family:var(--titel); font-weight:700; line-height:.92;
      font-size:108pt; margin:1mm 0 0; letter-spacing:1px;
    }
    .titel .g{ color:var(--gruen); }
    .titel .b{ color:var(--braun); }
    .titel .rot{ color:var(--rot); }
    .untertitel{
      font-size:23px; line-height:1.45; color:var(--tinte); max-width:150mm;
      margin:4mm 0 0;
    }
    .untertitel b{ color:var(--gruen); }

    .emoji-reihe{
      font-size:30px; letter-spacing:5px; margin:6mm 0 0; filter:saturate(.9);
    }

    /* QR als „Stempel" */
    .qr-stempel{ margin:8mm 0 0; display:flex; flex-direction:column; align-items:center; }
    .qr-rahmen{
      width:74mm; height:74mm; padding:5mm; background:#fff;
      border:3px dashed var(--tinte); border-radius:8px;
      box-shadow:5px 6px 0 rgba(61,47,28,.22);
      transform:rotate(-1.6deg);
    }
    .qr-svg{ display:block; width:100%; height:100%; }
    .scan-notiz{
      font-family:var(--notiz); font-size:30px; color:var(--gruen);
      margin-top:6mm; transform:rotate(-1deg);
    }

    .anleitung{
      font-size:21px; line-height:1.5; color:var(--tinte-weich); margin:5mm 0 0;
    }
    .anleitung .url{
      display:inline-block; margin-top:2mm; font-size:22px; color:var(--tinte);
      background:rgba(164,71,58,.12); border:1.5px solid rgba(164,71,58,.5);
      border-radius:6px; padding:1.5mm 4mm; letter-spacing:.3px;
    }

    .fuss{
      margin-top:auto; width:100%; display:flex; justify-content:space-between;
      align-items:flex-end; gap:8mm; font-size:16px; color:var(--tinte-weich);
      padding-top:8mm; border-top:2px dotted rgba(61,47,28,.35);
    }
    .fuss span{ flex:1; }
    .fuss .quelle{ text-align:right; }

    /* Bildschirm-Vorschau: Blatt zentriert mit Schatten */
    @media screen{
      body{ padding:26px 0; }
      .blatt{ box-shadow:0 12px 50px rgba(0,0,0,.45); }
    }
    @media print{ body{ background:#fff; } }
  </style>
</head>
<body>
  <div class="blatt">
    <div class="eyebrow">★ Wiens grüne Schätze entdecken ★</div>
    <h1 class="titel"><span class="g">Natur</span><span class="b">denkmäler</span> <span class="rot">Wien</span></h1>
    <p class="untertitel">Eine interaktive Schatzkarte aller <b>762</b> Naturdenkmäler Wiens —<br>uralte Bäume, schattige Alleen, Felsen &amp; stille Gewässer zum Entdecken.</p>

    <div class="emoji-reihe">🌳&nbsp; 🍃&nbsp; 🌲&nbsp; 🪨&nbsp; 💧&nbsp; 🦉&nbsp; 🦋&nbsp; 🌼</div>

    <div class="qr-stempel">
      <div class="qr-rahmen">__QR_SVG__</div>
      <div class="scan-notiz">Scan mich mit der Handy-Kamera! 📷</div>
    </div>

    <p class="anleitung">
      Kamera öffnen &middot; auf den Code halten &middot; Link antippen<br>
      <span class="url">__URL_TEXT__</span>
    </p>

    <div class="fuss">
      <span>📱 Tipp: am iPhone über „Teilen → Zum Home-Bildschirm" wie eine App ablegen.</span>
      <span class="quelle">Daten: Stadt Wien · CC&nbsp;BY&nbsp;4.0</span>
    </div>
  </div>
</body>
</html>
"""

HTML = HTML.replace('__QR_SVG__', qr_svg).replace('__URL_TEXT__', URL_TEXT)
ziel.write_text(HTML, encoding='utf-8')

print('✅ druckkarte.html gebaut')
print('   QR-Version: %s  (%dx%d Module, Fehlerkorrektur Q)' % (qr.version, n, n))
print('   Link im QR:', URL)
