# Dieses Repo ist Teil einer bachelor-Arbeit

Hier findet man die implementierungen der einzelnen Fuzzer, welche in der Arbeit beschrieben worden sind, ebenso die Evaluierung dieser.

Die aktuellste Version unseres Fuzzer findet man in /src/fuzzers/our.ts

Am besten startet man mit einen `pnpm i` oder `npm i` falls man Zeit hat.
Um die Skripte auszuführen in `runners.ts` die entsprechende Funktion aufgerufen werden.
Bei ausführung von `evaluation/steps` muss `bun` verwendet werden, da wir die bun shell verwenden.

Die Evaluierungsschritte kommunizieren mit der C3-Schnittstelle von Identeco, ein entsprechender CLI-Client muss unter `src/evaluation/cli-client` zufinden sein. der `API_KEY` wird aus den Envirement-Variables genommen.

Um die Datenbank zu starten müssen in der `.env` die C dredentials für eine MySQL-Datenbank hinterlegt sein.
Mit `pnpm db:push` wird das Aktuele Schema mit der Datenbank migriert
Mit `pnpm db:studio` wird eine Webseite gestartet die als Datenbank Browser genutzt werden kann.
