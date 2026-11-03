# KONG – Fortsetzungsstand: Illustrated Edition (Version 3)

## Ergebnis
Die markante Grafiküberarbeitung ohne zusätzliche Engine ist fertig und privat veröffentlicht. Zehn Levels und die Rettung von Prinzessin Lumi sind erhalten.
Veröffentlichter Spielcode: 0231bfaa8f8e409b920ac18e6bdfd7840227337e.
Deployment: appgdep_6ae9bd3f673c819182150dc25c463451 (succeeded).
Diese Datei wird zusammen mit der fertigen Version in GitHub gespeichert. Wenn sie dort im jüngsten Commit sichtbar ist, ist auch der GitHub-Abgleich erfolgt. Nach einer Unterbrechung zuerst den aktuellen Repo-Stand prüfen, nicht blind erneut hochladen.

## Implementiert und geprüft
- Zehn eigenständige Architekturkulissen: Baustelle, Neonstadt, Hafen mit Schiffen, Dachgärten, Kupferwerk, Regenbrücke, Wolken, Frostturm, Glutdächer und Schlossfinale.
- Gecachte Hintergrundebenen, Parallaxe, Materialplattformen, Lichtschein sowie Regen, Schnee, Rauch und Glut.
- Schattierte Figuren, Sprungstreckung, Landefederung, Laufstaub, glänzende Sammelsterne und scharfes Canvas für hochauflösende Displays.
- Variierende Musikphrasen und sichere Audio-Zeitplanung. Audio-Start funktionierte beim abschliessenden Test auf der veröffentlichten Site; keine Warnungen/Fehler.
- Alle zehn Kulissen visuell geprüft. Automatische Tests bestanden: 80 Leitern, zehn Levelwechsel, Physik, Hammer, Animationen, Finale und Neustart. Laufen, Klettern, Springen und Pause auch im Browser geprüft.
- Bilder: outputs/kong-v3-preview.png und outputs/kong-v3-welten.png.

## Wiederaufnahme nach Nutzungslimit
Im selben Chat schreiben: „Weiter mit KONG anhand von outputs/FORTSETZEN.md.“
Der Assistent soll zuerst diese Datei, git status und die jüngsten Commits lesen. Keine Änderungen verwerfen. Falls der letzte Upload unterbrochen wurde, nur die fehlende Synchronisierung abschliessen; die Grafik ist bereits fertig. Für weitere Änderungen am fertigen Spiel den neuen Nutzerauftrag übernehmen. Eine automatische Wiederaufnahme bei neuem Kontingent ist nicht eingerichtet.

## Dateien und Orte
Arbeitsverzeichnis: C:/Users/AndreasHeitz/Documents/Codex/2026-11-03/github-plugin-github-openai-curated-remote/work/kong
GitHub: https://github.com/awheitz265-eng/kong (privat)
Spiel: https://kong-rooftop-rumble-aw265.awheitz.chatgpt.site (privat)
Site project_id: appgprj_6ae9b25f8cf08191b7de58172648e109; static.directory: dist.
Lokaler Git-Remote gehört Sites, NICHT GitHub. GitHub hat die Webdateien im Stamm, lokale Site in dist/.
Webdateien: index.html, style.css, art.js, game.js. Dazu README.md, check-game.cjs und FORTSETZEN.md.
Prüfen: lokal node work/kong/check-game.cjs; in GitHub/Download node check-game.cjs. Für das flache GitHub-Layout sind die Testpfade im Export angepasst.
Download: outputs/kong-rooftop-rumble.zip. Lokale Zwischenstände 1ccbb5e und 0231bfa sind committed.

## Veröffentlichungsablauf bei späteren Änderungen
Sites-Skill: C:/Users/AndreasHeitz/.codex/plugins/cache/openai-curated-remote/sites/1.1.2/skills/sites/SKILL.md.
Helper: .../sites/1.1.2/scripts/site-workflow.mjs --project-id <id>, im Checkout mit TTY. Credential und source über stdin, zur Paketierung commands und archivePath. Credentials niemals in Dateien/Git speichern.
Vor Paketierung aktuellen Spielcode committen und Helper neu öffnen, damit source.commit_sha aktuell ist. Danach exakt die zurückgegebene Quelle/Archiv-Kombination privat veröffentlichen.
GitHub-Plugin hatte zuvor 404 für dieses Repo; angemeldeter Browser-Upload funktionierte. Vor Überschreiben den aktuellen Repo-Stand prüfen.
Vorschau: node work/serve.cjs (Port 8765, benötigt Netzwerkfreigabe), danach wieder beenden. Generator einer temporären Testgalerie: work/review-v3.cjs; .qa.html nicht veröffentlichen.
