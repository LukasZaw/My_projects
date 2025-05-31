# Space Shooter

Kosmiczna gra zręcznościowa napisana w JavaScript, działająca w przeglądarce. Strzelaj do asteroid, zdobywaj punkty, zbieraj power-upy i rywalizuj o miejsce na tablicy wyników!

## Zagraj online

[Zagraj w Space Shooter na GitHub Pages](https://lukaszaw.github.io/My_projects/Space_Shooter/index.html)

## Funkcje

- Dynamiczne poziomy trudności (Level Up)
- Efekty dźwiękowe (strzały, wybuchy, power-upy, Level Up)
- Animacje wybuchów asteroid i gracza
- Power-upy: szybkie strzelanie, tarcza ochronna
- Tablica wyników (Leaderboard) zapisywana w `localStorage`
- Możliwość zmiany nazwy gracza
- Przycisk wyciszenia dźwięków (mute)
- Responsywny interfejs

## Sterowanie

- **Strzałki lewo/prawo** – ruch statku
- **Spacja** – strzał
- **Przycisk "Zmień nazwę gracza"** – zmiana nicku
- **Przycisk wyciszenia** (prawy dolny róg) – włącza/wyłącza dźwięki

## Uruchomienie lokalne

1. Sklonuj repozytorium lub pobierz pliki projektu.
2. Upewnij się, że struktura katalogów wygląda tak:
   ```
   Space_Shooter/
     ├── index.html
     ├── style.css
     ├── script.js
     ├── player.js
     ├── enemies.js
     ├── assets.js
     ├── levels.js
     ├── Images/
     │    └── ... (wszystkie grafiki)
     └── Sounds/
          └── ... (wszystkie pliki dźwiękowe)
   ```
3. Otwórz plik `index.html` w przeglądarce.

## Wymagania

- Przeglądarka obsługująca ES6 modules (np. Chrome, Firefox, Edge)
- Wszystkie pliki graficzne i dźwiękowe muszą znajdować się w odpowiednich katalogach (`Images/`, `Sounds/`)

## Pliki

- `index.html` – główny plik HTML
- `style.css` – stylizacja gry
- `script.js` – główna logika gry
- `player.js` – obsługa gracza i sterowania
- `enemies.js` – obsługa asteroid/przeciwników
- `assets.js` – ładowanie grafik i dźwięków
- `levels.js` – (opcjonalnie) logika poziomów
- `Images/` – grafiki gry (statki, asteroidy, wybuchy, tło, power-upy)
- `Sounds/` – efekty dźwiękowe gry


---

Miłej zabawy!
