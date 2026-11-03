# KONG · Rooftop Rumble

Ein eigenständiges Comic-Arcade-Spiel, inspiriert vom klassischen Plattform-und-Leiter-Spielprinzip. Drei Levels, handgezeichnete Canvas-Grafik, prozeduraler Web-Audio-Soundtrack, Fässer, Funken, Sterne, Hammer-Power-up, lokaler Highscore und Touch-Steuerung.

## Spielen

`index.html` im Browser öffnen oder den Spielordner mit einem beliebigen statischen Webserver bereitstellen. Keine Installation und kein Build nötig. Die Google-Schriftarten sind optional; Systemschriften dienen als Fallback. Grafik und Audio werden vollständig lokal erzeugt.

- Pfeile / WASD: laufen und klettern
- Leertaste / X: springen
- P / Escape: pausieren
- M: Ton an/aus
- Touch: Schaltflächen unter dem Spielfeld

Erreiche die grüne Flagge auf jedem Dach. Sterne geben 250 Punkte, übersprungene Fässer 100, zerstörte Fässer 200. Der Hammer wirkt 8 Sekunden. Drei Leben gelten für den gesamten Durchlauf. Es gibt kein Zeitlimit; nur der Abschlussbonus sinkt mit der Zeit. Der Rekord bleibt im Browser gespeichert, soweit dieser lokale Speicherung erlaubt.

## Dateien

- `index.html`: Oberfläche, Anleitung und barrierefrei beschriftete Bedienelemente
- `style.css`: responsive Arcade-Oberfläche
- `game.js`: feste Physik-Zeitschritte, Zeichnung, Spielzustände und Web Audio

Alle Figuren, Grafiken und Melodien sind eigens für dieses Spiel gestaltet. Keine externen Spiele-Assets, kein Tracking, keine Konten, keine Zahlungen.

