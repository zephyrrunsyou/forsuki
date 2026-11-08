# To my beautiful girl

A static romantic website with a password reveal, music, and an interactive heart universe.

## Deploy to Vercel

1. Commit and push this repository, including `public/` and `vercel.json`.
2. Import the repository into Vercel.
3. Keep **Root Directory** at the repository root (leave it blank or use `.`).
4. Use **Framework Preset: Other**. No install or build command is needed; the included `vercel.json` sets the output directory to `public`.
5. Deploy.

No environment variables, server, or package installation are required. All music, character illustrations, scripts, and styles are included in `public/`. Google Fonts is optional; installed fonts are used as a fallback.

## Personalize

Edit `public/config.js` to change the password, hint, sender, main message, floating words, and envelope love notes. The current password is `yabie`, with any capitalization accepted. Set a note's `orbit` to `inner` to place its envelope on the spiral arms.

Unopened envelopes show a little heart badge. Opening a note removes its badge for the current visit. Reloading the page resets every envelope to unread; read status is not saved in browser storage.

This password is a playful reveal, not secure authentication: its value and the notes are visible in the downloaded website files. Do not use a real account password or put sensitive information here.

## Preview locally

From the repository root, run:

```sh
python -m http.server 4173 --directory public
```

Open http://localhost:4173. Click the entrance screen to start music, then unlock the universe. Drag its background to change viewing angles. Click envelopes to read the notes.

## Project layout

```text
public/
  index.html       Website entry point
  config.js        Editable personal details and love notes
  script.js        Home page, music, and password interactions
  galaxy.js        Universe, characters, notes, and unlocking animation
  style.css        Responsive styles and animation
  *.png / *.webp   Character art and heart icon
  pretty-baby.mp3  Music
vercel.json        Static Vercel configuration
```

`public/` is now the source for future website changes. The previous `suki/` preview checkout and generated `.tar.gz` bundles remain locally as backups and are excluded from Git and Vercel uploads. Do not select `suki/` as the Vercel Root Directory.
