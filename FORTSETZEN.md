# KONG – Fortsetzungsstand: Version 4

## Aktueller Auftrag
Erledigt: Fässer fallen gelegentlich über Leitern nach unten und werden von Level zu Level schneller.
- Einmalige Zufallsentscheidung beim Überqueren jeder Leiter: 24 % in Level 1, schrittweise bis 34,8 % in Level 10.
- Senkrechter Fall, Landung auf der nächsten Plattform, Weiterrollen in Gegenrichtung. Kantenfälle bleiben erhalten.
- Tempo: 112 + 14 × Levelindex ± 5 Pixel/s; 107–117 in Level 1, 233–243 in Level 10. Bereiche überlappen nicht.
- Spielanleitung aktualisiert. Grafik, zehn Level und Prinzessinnenrettung erhalten.

## Prüfungen
Automatisch bestanden: alle 80 Leitern in beiden Richtungen, Fallen/Weiterrollen, keine erneute Zufallsentscheidung pro Frame, Fallposition, Landung, Richtungswechsel, Kanten, Entfernen unten, steigendes Tempo, Kollisionen und Hammer. Bestehende Spieltests ebenfalls bestanden. Browser-Spielstart und Anleitung geprüft, keine Konsolenfehler.

## Veröffentlichung
Site: https://kong-rooftop-rumble-aw265.awheitz.chatgpt.site
Site project_id: appgprj_6ae9b25f8cf08191b7de58172648e109
Spielcode: 090ba79ab751111660e17aa5a9c00b52b697676c
Deployment: appgdep_6ae9c7067d048191bfc8dcc23a1037ae (succeeded).
GitHub: https://github.com/awheitz265-eng/kong (privat).
Wenn diese Version der Datei im jüngsten GitHub-Commit sichtbar ist, ist der GitHub-Abgleich abgeschlossen. Falls lokal vorliegend und der Upload unterbrochen wurde, zuerst den neuesten GitHub-Commit prüfen und nur den fehlenden Abgleich erledigen.

## Wiederaufnahme nach Nutzungslimit
Im selben Chat schreiben: „Weiter mit KONG anhand von outputs/FORTSETZEN.md.“
Zuerst diese Datei, git status und jüngste Commits lesen. Keine Änderungen verwerfen. Aktuellen Auftrag übernehmen; nichts bereits Erledigtes neu erstellen. Automatische Wiederaufnahme nach einem Limit ist nicht eingerichtet.

## Dateien
Checkout: C:/Users/AndreasHeitz/Documents/Codex/2026-11-03/github-plugin-github-openai-curated-remote/work/kong
Lokaler Git-Remote gehört Sites, NICHT GitHub. Site-Webdateien in dist/, GitHub-Webdateien flach im Stamm.
Webdateien: index.html, style.css, game.js, art.js. Dazu README.md, check-game.cjs, FORTSETZEN.md.
Prüfen: node work/kong/check-game.cjs; im GitHub-Export node check-game.cjs.
Download: outputs/kong-rooftop-rumble.zip. Export: outputs/kong/.

## Spätere Veröffentlichungen
Sites-Skill: C:/Users/AndreasHeitz/.codex/plugins/cache/openai-curated-remote/sites/1.1.2/skills/sites/SKILL.md.
Helper: dort ../../scripts/site-workflow.mjs, im Checkout mit TTY. Quelle erst committen, Helper neu öffnen, dann mit dem aktuellen source-Ergebnis paketieren. Credentials ausschliesslich per stdin; nie in Dateien oder Ausgaben. Audience owner-private erhalten.
GitHub-Plugin weiterhin 404; Browser-Upload funktioniert. Nur geänderte Dateien aus outputs/kong hochladen, vorher aktuellen Repo-Stand prüfen.
Vorschau: node work/serve.cjs, Port 8765. Server nach Prüfung stoppen.
