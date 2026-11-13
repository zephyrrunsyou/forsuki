# To my beautiful girl

A little corner of the internet for my Yabie. There’s a galaxy full of notes and a [Date Night invitation](public/datenight/index.html) where we can pick a movie or game night together.

## Deploy to Vercel

1. Commit and push this repository, including `public/` and `vercel.json`.
2. Import the repository into Vercel.
3. Keep **Root Directory** at the repository root (leave it blank or use `.`).
4. Use **Framework Preset: Other**. No install or build command is needed; the included `vercel.json` sets the output directory to `public`.
5. Deploy.

The site runs directly from `public/` with the music and artwork included.

## Personalize

Edit `public/config.js` to change the password, hint, sender, main message, floating words, and envelope love notes. The current password is `yabie`, with any capitalization accepted. Set a note's `orbit` to `inner` to place its envelope on the spiral arms.

The little heart badges mark unread envelopes and reset on reload.

This password is a playful reveal, not secure authentication: its value and the notes are visible in the downloaded website files. Do not use a real account password or put sensitive information here.

## Preview locally

From the repository root, run:

```sh
python -m http.server 4173 --directory public
```

Open http://localhost:4173 for the galaxy or http://localhost:4173/datenight/ for the invitation.

## Project layout

```text
public/
  index.html       Website entry point
  datenight/       Invitation, date picker, ticket, and countdown
  config.js        Editable personal details and love notes
  script.js        Home page, music, and password interactions
  galaxy.js        Universe, characters, notes, and unlocking animation
  style.css        Responsive styles and animation
  *.png / *.webp   Character art and heart icon
  pretty-baby.mp3  Music
vercel.json        Static Vercel configuration
```
