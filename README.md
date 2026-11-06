# Deepawali — The Grand Diwali Mela

A responsive Diwali celebration website and a small canvas-based mela game, built with plain HTML, CSS and JavaScript.

## Run locally
1. Open `index.html` in a modern browser for the festival page.
2. Select **Enter the Grand Mela** to open `mela.html`.

For the best local development experience, open the folder in VS Code. Either page can also be previewed with the Live Server extension; no build or install step is needed.

## Features
- Royal Indian-inspired palette, typography and decorative details.
- Responsive desktop and mobile navigation.
- Animated string lights, diya flames and subtle floating sparkles.
- Interactive courtyard: tap individual diyas or light all five at once.
- Optional ambient sound generated locally with the Web Audio API. No audio file or third-party music service is used.
- Share festive wishes using the device share sheet, with clipboard fallback.
- Explore the mela with WASD, arrow keys or touch controls; NPC visitors have lightweight autonomous routines.
- Visit twelve food and shopping stalls, watch performances and explore the fairground.
- Play ring toss, spin the lucky wheel, make a rangoli and decorate a diya.
- Find five hidden golden diyas and keep local progress between visits.
- Switch between Explore, Watch and Photographer modes; capture the scene as a PNG.
- Trigger festival lights and optional, locally synthesized sound.
- Reduced-motion preference support.
- No framework, backend, database, build step or JavaScript dependencies.

## Notes
- Google Fonts are loaded from Google Fonts when internet access is available; system serif/sans fallbacks are included.
- Ambient audio is an original synthesized drone, not a recording. Browsers require a user gesture before audio can start.
- The mela artwork and visitors are drawn in Canvas and CSS. No character images, paid AI services or audio files are required.
- Progress is stored locally in the browser. Clearing site data removes it.

## Customization
- Landing page colours and layout: `style.css` (`:root` variables near the top).
- Mela interface: `mela.html` and `css/mela.css`.
- World drawing, visitor behaviour, movement, activities, audio and effects: separate files under `js/`.
