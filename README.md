# KONG · Rooftop Rumble

Ein eigenständiges Comic-Arcade-Spiel, inspiriert vom klassischen Plattform-und-Leiter-Spielprinzip. Zehn Levels, handgezeichnete Canvas-Grafik, prozeduraler Web-Audio-Soundtrack, Fässer, Funken, Sterne, Hammer-Power-up, lokaler Highscore und Touch-Steuerung.

## Spielen

`index.html` im Browser öffnen oder den Spielordner mit einem beliebigen statischen Webserver bereitstellen. Keine Installation und kein Build nötig. Die Google-Schriftarten sind optional; Systemschriften dienen als Fallback. Grafik und Audio werden vollständig lokal erzeugt.

- Pfeile / WASD: laufen und klettern
- Leertaste / X: springen
- P / Escape: pausieren
- M: Ton an/aus
- Touch: Schaltflächen unter dem Spielfeld

Befreie Prinzessin Lumi von zehn magischen Schlössern: Erreiche ihren Käfig auf jedem der zehn Dächer. Im letzten Level öffnet sich der Käfig endgültig. Sterne geben 250 Punkte, übersprungene Fässer 100, zerstörte Fässer 200. Der Hammer wirkt 8 Sekunden. Du startest mit drei Leben. Nach jedem zweiten Level wird ein verlorenes Leben aufgefüllt (maximal drei). Es gibt kein Zeitlimit; nur der Abschlussbonus sinkt mit der Zeit. Der Rekord bleibt im Browser gespeichert, soweit dieser lokale Speicherung erlaubt.

## Dateien

- `index.html`: Oberfläche, Anleitung und barrierefrei beschriftete Bedienelemente
- `style.css`: responsive Arcade-Oberfläche
- `game.js`: feste Physik-Zeitschritte, Zeichnung, Spielzustände und Web Audio

Alle Figuren, Grafiken und Melodien sind eigens für dieses Spiel gestaltet. Keine externen Spiele-Assets, kein Tracking, keine Konten, keine Zahlungen.

## Version 2

Neu gezeichnete Charaktere: artikulierte Lauf-, Sprung- und Kletterbewegungen, Körperfederung, wehender Schal; Gorilla mit flacher Nase, breiten Schultern und synchronisierter Fasswurf-Animation. Animierte Prinzessin mit Krone, Kleid und Befreiungssequenz. Zehn individuelle Farbwelten und Leiterlayouts mit begrenzter Schwierigkeitsskalierung.

## Version 3 – Illustrated Edition

Zehn eigenständige Kulissen mit Hafenbecken und Schiffen, Gewächshäusern, Fabrikrohren, Regenbrücke, Schneebergen und Schlossarchitektur. Vorberechnete Hintergrundebenen, Parallaxe, Materialplattformen, Neonlicht und Wettereffekte. Figuren mit Farbverläufen, Sprungstreckung, Landefederung und Laufstaub; hochauflösendes Canvas und variierende Musikphrasen. Alles in JavaScript/Canvas ohne Engine und ohne externe Grafikbibliothek.

Die zusätzliche Datei art.js enthält die Grafikschicht. Automatische Prüfung: node check-game.cjs. FORTSETZEN.md dokumentiert den Arbeitsstand für spätere Fortsetzungen.


