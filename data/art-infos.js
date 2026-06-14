// =====================================================================
// Art-Steckbriefe für "Erzähl mir mehr"
// ---------------------------------------------------------------------
// Echte, geprüfte botanische Kurzinfos PRO BAUMART (nicht pro Einzelbaum —
// zu einzelnen Bäumen gibt der offizielle Datensatz keine eigene Geschichte
// her, und erfundene Fakten haben in der Karte nichts verloren).
//
// Schlüssel = wissenschaftlicher Name, klein geschrieben:
//   "gattung art"  (z. B. "quercus robur")  — bevorzugt
//   "gattung"      (z. B. "quercus")        — Rückfall für die ganze Gattung
//   "gattung art sorte" (z. B. "fagus sylvatica pendula") — für Zuchtformen
// Zuordnung passiert in js/kategorien.js → artInfoFuer().
// =====================================================================

const ART_INFOS = {
  // ── Eichen ──────────────────────────────────────────────────────
  'quercus': 'Eichen gehören zu den mächtigsten und langlebigsten Bäumen Europas und können über 1000 Jahre alt werden. Kaum ein anderer Baum beherbergt so viele Tiere und Pilze — von der Eichelmaus bis zum Hirschkäfer.',
  'quercus robur': 'Die Stieleiche trägt ihre Eicheln an langen Stielen. Sie kann uralt und riesig werden und war früher mit ihren Eicheln wichtiges Schweinefutter. Als „Mastbaum" prägte sie ganze Wälder.',
  'quercus petraea': 'Die Traubeneiche sitzt mit ihren Eicheln dicht („traubig") und fast ohne Stiel am Zweig. Sie liebt etwas wärmere, trockenere Hänge und bildet zusammen mit der Stieleiche unsere wichtigsten Eichenwälder.',
  'quercus cerris': 'Die Zerreiche stammt aus Südosteuropa und hat tief gelappte Blätter. Ihre Eichelbecher tragen krause, „zottelige" Schuppen — ein gutes Erkennungszeichen.',
  'quercus pubescens': 'Die Flaumeiche ist eine kleine, knorrige Eiche der heißen, trockenen Hänge. Ihre jungen Blätter und Triebe sind fein behaart („flaumig"). Bei Wien wächst sie an sonnigen Kalkhängen.',
  'quercus turneri': 'Die Turner-Eiche ist eine halb-immergrüne Kreuzung und behält ihr ledriges Laub oft bis weit in den Winter hinein.',

  // ── Föhren / Kiefern ────────────────────────────────────────────
  'pinus': 'Kiefern (auch Föhren genannt) sind robuste Nadelbäume mit langen, paarweise stehenden Nadeln. Viele Arten kommen mit Trockenheit und magerem Boden bestens zurecht.',
  'pinus nigra': 'Die Schwarzföhre stammt aus Südeuropa, und der Wienerwald ist eine ihrer nördlichen Heimaten. Ihre dicke, fast schwarze Borke schützt vor Hitze und Feuer — und aus ihrem Harz gewann man südlich von Wien einst durch „Pechen" das begehrte Harz.',
  'pinus sylvestris': 'Die Waldföhre erkennt man an ihrer oben rötlich-orange leuchtenden Rinde. Sie ist extrem genügsam und wächst sogar auf Sand und Fels, wo andere Bäume aufgeben.',
  'pinus wallichiana': 'Diese Kiefer aus dem Himalaya trägt besonders lange, weiche, hängende Nadeln — daher der Name Tränenkiefer. Ihre schlanken Zapfen sind dick mit Harz überzogen.',

  // ── Eibe ────────────────────────────────────────────────────────
  'taxus': 'Die Eibe ist einer der langlebigsten Bäume Europas — manche Exemplare sind über 1000 Jahre alt. Fast alle Teile sind giftig (nur das rote Fruchtfleisch nicht), und aus ihrem zähen Holz baute man früher Bögen.',
  'taxus baccata': 'Die Eibe ist einer der langlebigsten Bäume Europas — manche Exemplare sind über 1000 Jahre alt. Fast alle Teile sind giftig (nur das rote Fruchtfleisch nicht), und aus ihrem zähen Holz baute man früher Bögen.',

  // ── Platanen ────────────────────────────────────────────────────
  'platanus': 'Die Platane ist ein klassischer Allee- und Stadtbaum. Ihre Rinde blättert in Platten ab und hinterlässt ein cremegrünes Tarnmuster. Sie verträgt Abgase und Hitze hervorragend und wird sehr alt und mächtig.',
  'platanus orientalis': 'Die Morgenländische Platane stammt aus Südosteuropa und Vorderasien und gehört zu den am längsten kultivierten Bäumen überhaupt — manche Exemplare im Orient sollen über 1000 Jahre alt sein. Ihre Blätter sind tiefer gelappt als bei der häufigen Hybrid-Platane.',

  // ── Linden ──────────────────────────────────────────────────────
  'tilia': 'Linden haben herzförmige Blätter und duftende Blüten, die im Sommer von Bienen umschwärmt werden. Als Dorf- und Gerichtsbäume wurden sie traditionell uralt.',
  'tilia platyphyllos': 'Die Sommerlinde blüht etwas früher als die Winterlinde und hat größere, oberseits behaarte Blätter. Linden können über 1000 Jahre alt werden und standen früher als Dorf- und Tanzlinden im Ortsmittelpunkt.',
  'tilia cordata': 'Die Winterlinde hat kleine, herzförmige Blätter mit rostbraunen Härchenbüscheln in den Aderwinkeln. Ihre duftenden Juli-Blüten sind ein Bienenmagnet und ergeben den bekannten Lindenblütentee.',
  'tilia tomentosa': 'Die Silberlinde hat unterseits silbrig-weiß behaarte Blätter, die im Wind aufblitzen. Sie verträgt Stadtklima, Hitze und Trockenheit besonders gut.',

  // ── Ahorne ──────────────────────────────────────────────────────
  'acer': 'Ahorne erkennt man an ihren gelappten Blättern und den geflügelten „Hubschrauber"-Samen, die im Herbst trudelnd zu Boden segeln.',
  'acer pseudoplatanus': 'Der Bergahorn kann über 500 Jahre alt und riesig werden. Seine Samen sind die typischen „Hubschrauber", und sein helles, geflammtes Holz ist bei Instrumentenbauern begehrt.',
  'acer platanoides': 'Der Spitzahorn blüht schon im April vor dem Laub leuchtend gelbgrün. Seine Blätter haben spitz ausgezogene Zipfel, und beim Abbrechen des Blattstiels tritt Milchsaft aus.',
  'acer campestre': 'Der Feldahorn ist der kleinste heimische Ahorn — oft als Hecke oder Strauch. Seine kleinen Blätter färben sich im Herbst goldgelb, und junge Zweige tragen manchmal korkige Leisten.',
  'acer saccharinum': 'Der Silberahorn aus Nordamerika hat tief eingeschnittene Blätter, die unterseits silbrig schimmern. Er wächst schnell und bewegt sein Laub schon bei leisestem Wind.',

  // ── Buchen ──────────────────────────────────────────────────────
  'fagus': 'Die Rotbuche bildet glatte, silbergraue Stämme und im Frühling ein zartgrünes Blätterdach, das im Wald fast alles Licht schluckt. Sie kann über 300 Jahre alt werden; ihre Bucheckern sind wichtiges Waldtierfutter.',
  'fagus sylvatica': 'Die Rotbuche bildet glatte, silbergraue Stämme und im Frühling ein zartgrünes Blätterdach, das im Wald fast alles Licht schluckt. Sie kann über 300 Jahre alt werden; ihre Bucheckern sind wichtiges Waldtierfutter.',
  'fagus sylvatica atropurpurea': 'Die Blutbuche ist eine rotlaubige Zuchtform der Rotbuche: Ein roter Farbstoff überdeckt das Grün, sodass die Blätter purpurn leuchten. Alle Blutbuchen gehen auf wenige Zufallsfunde in der Natur zurück.',
  'fagus sylvatica purpurea': 'Die Blutbuche ist eine rotlaubige Zuchtform der Rotbuche: Ein roter Farbstoff überdeckt das Grün, sodass die Blätter purpurn leuchten. Alle Blutbuchen gehen auf wenige Zufallsfunde in der Natur zurück.',
  'fagus sylvatica pendula': 'Die Hänge- oder Trauerbuche ist eine Zuchtform der Rotbuche mit bizarr überhängenden Ästen, die wie ein grüner Vorhang bis zum Boden reichen können.',
  'fagus sylvatica laciniata': 'Die Farnblättrige Buche ist eine seltene Zuchtform der Rotbuche mit tief geschlitzten, fast farnartigen Blättern.',

  // ── Ulmen ───────────────────────────────────────────────────────
  'ulmus': 'Ulmen haben auffallend asymmetrische Blattansätze. Viele alte Ulmen fielen dem „Ulmensterben" (einem eingeschleppten Pilz) zum Opfer — große alte Exemplare sind daher besonders kostbar.',
  'ulmus laevis': 'Die Flatterulme trägt ihre Blüten und Früchte an langen, „flatternden" Stielen. Sie liebt feuchte Auböden und ist gegen das Ulmensterben etwas widerstandsfähiger als ihre Verwandten.',

  // ── Pappeln ─────────────────────────────────────────────────────
  'populus': 'Pappeln wachsen schnell, lieben Licht und feuchte Böden. Ihre Blätter zittern oft schon im leisesten Wind.',
  'populus nigra': 'Die Schwarzpappel ist ein selten gewordener Aubaum mit tief gefurchter Borke und oft knorrigen Maserknollen am Stamm. Echte Schwarzpappeln sind durch Vermischung mit Hybridpappeln rar geworden.',
  'populus nigra italica': 'Die Pyramidenpappel ist eine schmale, säulenförmige Zuchtform der Schwarzpappel — die markanten „grünen Ausrufezeichen" vieler Alleen und Landschaften.',
  'populus alba': 'Die Silberpappel hat unterseits weißfilzige Blätter, die im Wind silbern aufblitzen. Sie liebt feuchte Auböden und treibt aus den Wurzeln viele Schösslinge.',
  'populus x canescens': 'Die Graupappel ist eine natürliche Kreuzung aus Silber- und Zitterpappel, mit graufilzigen jungen Blättern.',

  // ── Eschen ──────────────────────────────────────────────────────
  'fraxinus': 'Die Esche treibt spät aus und wirft früh ab — dafür trägt sie auffällige schwarze Winterknospen. Ihr zähes, elastisches Holz war für Werkzeugstiele begehrt; heute bedroht sie das Eschentriebsterben.',
  'fraxinus excelsior': 'Die Gemeine Esche treibt spät aus und wirft früh ab — dafür trägt sie auffällige schwarze Winterknospen. Ihr zähes, elastisches Holz war für Werkzeugstiele und Geräte begehrt; heute bedroht sie das Eschentriebsterben.',
  'fraxinus excelsior pendula': 'Die Hänge-Esche ist eine Zuchtform der Esche mit bogig überhängenden Ästen, die ein dichtes grünes Zelt bilden.',

  // ── Weiden ──────────────────────────────────────────────────────
  'salix': 'Weiden lieben Wasser und treiben aus fast jedem Zweig leicht neue Wurzeln. Ihre Kätzchen sind im Vorfrühling eine der ersten Bienennahrungen.',
  'salix alba': 'Die Silberweide ist ein typischer Aubaum mit silbrig schimmernden Blättern. Regelmäßig gekappte alte Weiden bilden knorrige „Kopfweiden" mit wertvollen Höhlen für Tiere.',
  'salix fragilis': 'Die Bruchweide bricht schon bei leichtem Druck am Astgrund — daher der Name. Die abgebrochenen Zweige wurzeln im feuchten Boden leicht von selbst wieder an.',

  // ── Walnüsse ────────────────────────────────────────────────────
  'juglans': 'Walnussbäume tragen die bekannten Nüsse in einer grünen Schale; ihr Laub duftet beim Zerreiben kräftig-aromatisch.',
  'juglans regia': 'Die Echte Walnuss liefert die bekannten Walnüsse und stammt ursprünglich aus Vorderasien. Sie wird seit der Antike kultiviert; ihr Laub duftet aromatisch.',
  'juglans nigra': 'Die Schwarznuss aus Nordamerika hat tief gefurchte, fast schwarze Rinde und liefert wertvolles dunkles Möbelholz. Ihre Nüsse stecken in einer dicken, stark färbenden Schale.',

  // ── Kastanien ───────────────────────────────────────────────────
  'aesculus hippocastanum': 'Die Gewöhnliche Rosskastanie stammt vom Balkan und ist mit ihren weißen Blütenkerzen im Mai ein Frühlingsbote. Ihre glänzenden „Kastanien" sind beliebt zum Basteln, aber nicht essbar — anders als die Edelkastanie.',
  'castanea sativa': 'Die Edelkastanie liefert die essbaren Maroni und wurde schon von den Römern verbreitet. Sie liebt milde, weinbaugeeignete Lagen und kann sehr alt und dickstämmig werden.',

  // ── Nadel-Exoten & Park-Riesen ──────────────────────────────────
  'sequoiadendron giganteum': 'Der Riesenmammutbaum aus Kalifornien ist nach Masse der größte Baum der Welt und kann über 3000 Jahre alt werden. Seine dicke, rotbraune Rinde ist weich wie Kork und schützt vor Waldbränden. In Wien sind die Exemplare noch „jung" — meist im 19. Jahrhundert gepflanzt.',
  'metasequoia glyptostroboides': 'Der Urweltmammutbaum galt nur als Fossil bekannt und ausgestorben — bis man ihn 1944 in China lebend wiederentdeckte. Wie die Lärche wirft dieser Nadelbaum im Herbst seine Nadeln ab.',
  'pseudotsuga menziesii': 'Die Douglasie aus Nordamerika zählt zu den höchsten Bäumen der Welt (in ihrer Heimat über 100 m). Ihre Rinde duftet harzig-zitronig, und ihre Zapfen tragen typische dreizipfelige „Mäuseschwänzchen".',
  'larix decidua': 'Die Lärche ist unser einziger heimischer Nadelbaum, der im Herbst die Nadeln abwirft — vorher leuchten sie goldgelb. Ihr Holz ist sehr witterungsfest und wurde im Gebirge gern für Häuser und Zäune genutzt.',
  'calocedrus decurrens': 'Die Weihrauchzeder aus Kalifornien verströmt beim Zerreiben der Zweige einen weihrauchartigen Duft. Sie wächst schmal und säulenförmig — ein markanter Park- und Friedhofsbaum.',
  'chamaecyparis': 'Die Scheinzypresse stammt aus Nordamerika. Zerreibt man ihre schuppigen Zweige, duften sie harzig-würzig. Wegen ihrer dichten, kegelförmigen Form ist sie in Parks beliebt.',
  'chamaecyparis lawsoniana': 'Die Lawson-Scheinzypresse stammt aus dem Westen Nordamerikas. Zerreibt man ihre schuppigen Zweige, duften sie harzig-würzig — in Parks ist sie wegen ihrer dichten, kegelförmigen Form beliebt.',
  'thuja': 'Lebensbäume (Thujen) tragen flache, schuppige Zweige statt einzelner Nadeln und duften beim Zerreiben würzig. Sie sind beliebte immergrüne Hecken- und Friedhofsbäume.',
  'thuja plicata': 'Der Riesen-Lebensbaum aus Nordamerika wird sehr hoch; zerreibt man seine Zweige, duften sie fruchtig-süß. Die Ureinwohner schnitzten aus seinem Holz Kanus und Totempfähle.',

  // ── Zedern & Tannen & Fichten ───────────────────────────────────
  'cedrus': 'Zedern sind majestätische Nadelbäume mit büschelig stehenden Nadeln. Ihre fassförmigen Zapfen stehen aufrecht und zerfallen am Baum.',
  'cedrus atlantica': 'Die Atlas-Zeder stammt aus dem Atlasgebirge in Nordafrika. Ihre Nadeln stehen in Büscheln, und ihre fassförmigen Zapfen stehen aufrecht und zerfallen am Baum.',
  'cedrus libani': 'Die Libanon-Zeder ist das Wahrzeichen des Libanon und ziert dessen Flagge. Schon in der Antike war ihr duftendes Holz begehrt; alte Bäume bilden flache, etagenartige Kronen.',
  'abies': 'Tannen tragen ihre Zapfen aufrecht (sie zerfallen am Baum, statt herabzufallen), und ihre Nadeln zeigen unterseits zwei helle Wachsstreifen.',
  'abies cephalonica': 'Die Griechische Tanne hat steife, rundum abstehende, leicht stechende Nadeln. Wie bei allen Tannen stehen die Zapfen aufrecht und zerfallen am Baum.',
  'picea': 'Fichten tragen ihre Zapfen hängend (sie fallen ganz ab); die Nadeln sitzen einzeln und rundum am Zweig. Sie sind die klassischen „Christbäume".',
  'picea abies': 'Die Gemeine Fichte ist Mitteleuropas häufigster Nadelbaum und der klassische „Christbaum". Ihre Zapfen hängen nach unten und fallen ganz ab; sie wächst schnell, wurzelt aber flach.',
  'picea orientalis': 'Die Orient-Fichte aus dem Kaukasus hat die kürzesten Nadeln aller Fichten und einen besonders dichten, eleganten Wuchs.',
  'picea omorika': 'Die seltene Omorika- oder Serbische Fichte aus dem Balkan wächst auffallend schmal und säulenförmig. In freier Natur ist sie stark gefährdet.',

  // ── Flügelnuss, Tulpenbaum & weitere Park-Schönheiten ───────────
  'pterocarya fraxinifolia': 'Die Kaukasische Flügelnuss verblüfft mit bis zu einem halben Meter langen, hängenden Ketten aus geflügelten Nüsschen. Sie liebt feuchte Böden und bildet oft mehrere Stämme.',
  'liriodendron tulipifera': 'Der Tulpenbaum aus Nordamerika trägt im Juni große, tulpenähnliche grün-orange Blüten und hat unverwechselbar „abgeschnitten" wirkende Blätter. Er gehört zu den Magnoliengewächsen und wird sehr groß.',
  'paulownia tomentosa': 'Der Blauglockenbaum aus China blüht vor dem Laubaustrieb mit duftenden, violettblauen Glockenblüten. Er wächst extrem schnell und hat riesige, weiche Blätter.',
  'parrotia persica': 'Der Persische Eisenholzbaum hat extrem hartes Holz und eine schön abblätternde Rinde. Im Herbst färbt sich sein Laub spektakulär in Gelb, Orange und Rot.',
  'cercis siliquastrum': 'Der Judasbaum blüht im Frühling rosa-violett — und das direkt aus Stamm und Ästen heraus („Stammblütigkeit"). Seine Blätter sind herzförmig.',
  'gleditsia triacanthos': 'Die Gleditschie (Lederhülsenbaum) aus Nordamerika trägt am Stamm oft furchterregende, verzweigte Dornen und bis zu 40 cm lange, gedrehte Hülsen. Ihr fein gefiedertes Laub wirft nur leichten Schatten.',
  'ailanthus altissima': 'Der Götterbaum aus China wächst rasend schnell und erobert sogar Mauerritzen und Bahndämme — bei uns gilt er heute als invasiv. Zerreibt man seine Blätter, riechen sie streng.',
  'magnolia': 'Magnolien zählen zu den urtümlichsten Blütenpflanzen der Erde — ihre Blüten gab es schon, bevor es Bienen gab, weshalb sie ursprünglich von Käfern bestäubt wurden. Im Frühling blühen sie üppig vor dem Laubaustrieb.',

  // ── Schnurbaum / Robinie / Zürgelbaum / Trompetenbaum ──────────
  'sophora': 'Der Japanische Schnurbaum (auch Honig- oder Perlschnurbaum) blüht erst spät im Hochsommer cremeweiß und ist dann ein Bienenparadies. Seine Hülsen sind wie eine Perlenschnur eingeschnürt — daher der Name.',
  'styphnolobium': 'Der Japanische Schnurbaum (auch Honig- oder Perlschnurbaum) blüht erst spät im Hochsommer cremeweiß und ist dann ein Bienenparadies. Seine Hülsen sind wie eine Perlenschnur eingeschnürt — daher der Name.',
  'robinia pseudoacacia': 'Die Robinie („Scheinakazie") stammt aus Nordamerika und duftet im Juni mit weißen, süßen Blütentrauben (sehr beliebt bei Bienen). Sie hat Dornen, sehr hartes Holz und reichert mit ihren Wurzeln den Boden mit Stickstoff an.',
  'celtis': 'Zürgelbäume tragen kleine, erbsengroße, essbare Steinfrüchte und vertragen Hitze und Trockenheit ausgezeichnet — Stadtbäume mit Zukunft.',
  'celtis australis': 'Der Südliche Zürgelbaum aus dem Mittelmeerraum trägt kleine, essbare Steinfrüchtchen und kommt mit Hitze und Trockenheit bestens zurecht — ein Stadtbaum der Zukunft.',
  'celtis occidentalis': 'Der Amerikanische Zürgelbaum ähnelt seinem südeuropäischen Verwandten und trägt kleine essbare Früchtchen. Er ist robust gegen Stadtklima, Hitze und Wind.',
  'catalpa': 'Der Trompetenbaum aus Nordamerika hat riesige herzförmige Blätter und trägt nach der Blüte auffällig lange, bohnenartige Schoten, die über den Winter hängen bleiben.',
  'catalpa bignonioides': 'Der Trompetenbaum aus Nordamerika hat riesige herzförmige Blätter und trägt nach der Blüte auffällig lange, bohnenartige Schoten, die über den Winter hängen bleiben.',

  // ── Hasel, Hainbuche, Maulbeere, Holunder, Kornelkirsche ───────
  'corylus colurna': 'Die Baumhasel ist die einzige Hasel, die zu einem stattlichen Baum heranwächst — mit auffallend gleichmäßig kegelförmiger Krone. Sie stammt aus Südosteuropa und ist ein robuster Stadtbaum.',
  'carpinus betulus': 'Die Hainbuche ist trotz des Namens keine echte Buche. Ihr Stamm wirkt oft „spannrückig" gedreht, ihr Holz ist extrem hart, und sie verträgt Schnitt so gut, dass man dichte Hecken aus ihr zieht.',
  'morus': 'Maulbeerbäume tragen süße, brombeerähnliche Früchte; ihr Laub war einst das Futter der Seidenraupen.',
  'morus alba': 'Die Weiße Maulbeere stammt aus China — ihre Blätter sind das Futter der Seidenraupe. Ihre Früchte sind weißlich bis rosa und süß.',
  'morus nigra': 'Die Schwarze Maulbeere trägt dunkelrote bis schwarze, saftig-süße Früchte, die kräftig färben. Alte Bäume werden knorrig und tief verzweigt.',
  'sambucus nigra': 'Der Schwarze Holunder duftet im Juni mit großen weißen Blütentellern (für Sirup) und trägt im Spätsommer schwarze Beeren (für Saft und Marmelade — roh aber leicht giftig). Der Sage nach wohnt in ihm „Frau Holle".',
  'cornus mas': 'Die Kornelkirsche — in Österreich „Dirndl" genannt — blüht schon im Februar leuchtend gelb, lange vor dem Laub. Ihre roten, säuerlich-süßen Früchte ergeben Marmelade und Schnaps.',

  // ── Seltene Heimische: Speierling, Elsbeere ────────────────────
  'sorbus': 'Die Sorbus-Arten (Vogelbeere, Elsbeere, Speierling, Mehlbeere) tragen kleine, apfelähnliche Früchte, die bei Vögeln sehr beliebt sind.',
  'sorbus domestica': 'Der Speierling ist eine der seltensten heimischen Baumarten und kann mehrere hundert Jahre alt werden. Seine kleinen, birnen- oder apfelförmigen Früchte sind erst überreif genießbar und wurden früher dem Most zugesetzt.',
  'sorbus torminalis': 'Die Elsbeere ist ein seltener, lichtliebender Baum mit ahornähnlichen Blättern. Ihr Holz zählt zu den wertvollsten Europas, und aus ihren Früchten wird ein edler Schnaps gebrannt.',

  // ── Immergrüne & Sträucher ──────────────────────────────────────
  'ilex aquifolium': 'Die Stechpalme ist eine der wenigen heimischen immergrünen Laubpflanzen — mit stacheligen, glänzenden Blättern und roten Beeren im Winter. In Österreich steht sie unter Naturschutz.',
  'buxus sempervirens': 'Der immergrüne Buchsbaum wächst sehr langsam und kann uralt werden. Sein Holz ist so dicht, dass es in Wasser untergeht — ein Klassiker für formgeschnittene Gartenkunst.',
  'juniperus': 'Wacholder tragen blau bereifte „Beeren" (eigentlich Zapfen), die Vögeln schmecken und als Gewürz dienen. Sie wachsen langsam und werden sehr alt.',
  'juniperus chinensis': 'Der Chinesische Wacholder ist ein anspruchsloser, oft säulenförmig wachsender Nadelbaum mit teils nadeligen, teils schuppigen Blättchen.',
  'prunus': 'Prunus-Arten (Kirschen, Pflaumen, Lorbeerkirsche) blühen meist üppig im Frühling. Ihre Rinde trägt oft auffällige waagrechte „Korkporen".',
  'prunus laurocerasus': 'Der Kirschlorbeer ist ein immergrüner Strauch mit glänzenden Blättern. Achtung: Blätter und Samen sind giftig (sie enthalten Blausäure-Verbindungen).',

  // ── Kletterpflanzen ─────────────────────────────────────────────
  'hedera helix': 'Efeu ist eine immergrüne Kletterpflanze, die mit Haftwurzeln Mauern und Bäume erklimmt. Erst im Alter, weit oben, bildet er Blüten und schwarze Beeren — eine wichtige späte Nahrung für Insekten und Vögel.',
  'parthenocissus': 'Die Jungfernrebe („wilder Wein") klettert mit kleinen Haftscheiben glatte Wände hinauf und überzieht sie im Herbst mit leuchtend rotem Laub.',
  'parthenocissus tricuspidata': 'Die Dreispitzige Jungfernrebe („wilder Wein") klettert mit kleinen Haftscheiben sogar glatte Wände hinauf und färbt sich im Herbst leuchtend rot.',
  'parthenocissus quinquefolia': 'Die Fünfblättrige Jungfernrebe hat handförmig fünfgeteilte Blätter und überzieht Wände und Zäune mit leuchtend rotem Herbstlaub.',

  // ── Tiere & Pflanzen geschützter Lebensräume ───────────────────
  'spermophylus': 'Hier ist nicht ein Baum geschützt, sondern ein Tier: das Europäische Ziesel, ein possierliches, am Boden lebendes Erdhörnchen. Es lebt in Kolonien auf kurzrasigen Trockenwiesen und hält Winterschlaf — in Wien ist es stark gefährdet.',
  'spermophylus citellus': 'Hier ist nicht ein Baum geschützt, sondern ein Tier: das Europäische Ziesel, ein possierliches, am Boden lebendes Erdhörnchen. Es lebt in Kolonien auf kurzrasigen Trockenwiesen und hält Winterschlaf — in Wien ist es stark gefährdet.',
  'ophioglossum vulgare': 'Die Natternzunge ist ein kleiner, unscheinbarer Farn mit nur einem einzigen Blatt und einem „zungenförmigen" Sporenstand. Sie ist selten und zeigt artenreiche, naturnahe Wiesen an.',
  'helleborus viridis': 'Die Grüne Nieswurz blüht schon im Vorfrühling mit unscheinbaren grünen Blüten. Die ganze Pflanze ist giftig; früher diente sie als Niespulver.',
  'malus': 'Alte Apfelbäume sind wertvolle Lebensräume: Ihre Blüten nähren Bienen, ihre Früchte viele Tiere, und ihre alten Stämme bieten Höhlen für Vögel und Insekten.',
  'ginkgo biloba': 'Der Ginkgo ist ein echtes lebendes Fossil: Seine Art existiert seit über 200 Millionen Jahren — schon zur Zeit der Dinosaurier. Er ist weder Laub- noch Nadelbaum, sondern ganz für sich allein, und gilt als extrem zäh: Ein Ginkgo überlebte sogar die Atombombe von Hiroshima.',
};
