# Research Studio · Chapter 4

A polished, interactive reviewer for **Practical Research 2, Chapter 4**: research design, sampling procedure, and data gathering tools.

Everything runs in the browser. There is no backend, database, account system, or build step.

## What is inside

- **Reviewer** — three illustrated lessons (Lessons 6–8), decision trees, worked examples, calculator labs, quick checks, and a printable cheat sheet.
- **Practice test** — 31 items with timed and practice modes, answer review, lesson-by-lesson diagnosis, and saved attempt history.
- **Flashcards** — all 41 terms, flip/reveal, known/review sorting, lesson filters, and keyboard shortcuts.
- **Arcade** — three 90-second games with instant explanations, streak scoring, stars, personal bests, and a missed-question review.
- **Search** — jump to any page, tab, or lesson section from the command palette.
- **Progress** — saved privately in `localStorage`, with JSON export/import and a reset control.
- **Themes** — warm paper (light) and midnight (dark), plus responsive layouts for phones, tablets, and desktop.
- **Print** — the cheat sheet has a dedicated print layout.

## Run it locally

The site is static, so you can double-click `index.html` to open it. For the most reliable behavior, serve the folder over a local HTTP server instead.

Using Python:

```bash
cd path/to/pr
python -m http.server 4173
```

Then open <http://localhost:4173>.

Using Node.js:

```bash
cd path/to/pr
npx serve .
```

Then open the URL printed by `serve` (usually <http://localhost:3000>).

> The Google Fonts request needs internet access. If it is unavailable, the site falls back to local serif, sans-serif, and monospace fonts.

## Deploy it

This is a plain static site. Deploy the contents of this folder, keeping `index.html` at the publish root.

### Netlify Drop

1. Go to <https://app.netlify.com/drop>.
2. Drag the entire project folder onto the drop zone.
3. Leave build settings empty. Netlify serves the folder as-is.
4. Open the generated URL and optionally rename the site.

### GitHub Pages

1. Create a GitHub repository and put the project files at the repository root.
2. Commit and push:

   ```bash
   git init
   git add .
   git commit -m "Add Research Studio reviewer"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. In the repository, open **Settings → Pages**.
4. Set **Source** to **Deploy from a branch**, choose **main** and **/(root)**, then save.
5. GitHub publishes the site at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Relative asset paths are used throughout, so project pages served from a repository subpath work without extra configuration.

### Vercel

From the project folder:

```bash
npx vercel
```

Use these settings if Vercel asks:

- Framework preset: **Other**
- Build command: leave empty
- Output directory: `.` (the project root)

For production:

```bash
npx vercel --prod
```

You can also import the repository in the Vercel dashboard and apply the same settings.

### Other hosts

Cloudflare Pages, Firebase Hosting, S3 static hosting, IIS, Apache, or any file server will work. Publish the whole folder and make sure `index.html` is the default document.

## Routes and controls

| Route | Page |
| --- | --- |
| `#/reviewer` | Reviewer overview |
| `#/reviewer?tab=design` | Lesson 6 · Research design |
| `#/reviewer?tab=sampling` | Lesson 7 · Sampling procedure |
| `#/reviewer?tab=instruments` | Lesson 8 · Data gathering tools |
| `#/reviewer?tab=test` | Practice test |
| `#/reviewer?tab=cheat` | Printable cheat sheet |
| `#/flashcards` | Flashcards |
| `#/games` | Arcade hub |
| `#/games?game=design` | Design Detective |
| `#/games?game=sampling` | Sample Sort |
| `#/games?game=tools` | Instrument Sprint |

### Global shortcuts

- `Ctrl+K` or `Cmd+K` — open search
- `/` — open search
- `Esc` — close search or dialog

### Practice test

- `1`–`5` — answer a multiple-choice item
- `←` / `→` — previous / next question
- `F` — flag the current question
- `Ctrl+Enter` / `Cmd+Enter` — review and submit

### Flashcards

- `Space` / `Enter` — flip the card
- `←` / `→` — previous / next card
- `K` — mark known
- `R` — move back to review
- `S` — shuffle the deck

### Arcade

- `1`–`5` — choose an answer
- `Enter` — next question after feedback
- Click the speaker button to toggle game sound
- Leaving a round preserves it; use **Resume** in the arcade hub to continue

## Saved progress

Progress is stored under this browser key:

```text
researchStudio.ch4.v1
```

It includes lesson completion, flashcard mastery, test attempts and best score, game best scores, sound preference, and theme.

Use **Settings → Export** to download a JSON backup. Use **Import** to restore one. **Reset progress** clears learning data but keeps your theme and sound preference.

Progress is local to the browser and device. It is not synced between devices. Export a backup before clearing browser storage or moving to another computer.

## Project map

```text
index.html        App shell, navigation, dialogs, SVG icon sprite
styles.css        Design system and responsive app shell
reviewer.css      Lesson, lab, cheat-sheet, and print styles
practice.css      Practice-test styles
study.css         Flashcard and arcade styles
data.js           All lesson, flashcard, test, diagnosis, and game data
core.js           State, routing, themes, search, settings, backup, sound
app.js            Route rendering, scrolling, cleanup, boot
reviewer.js       Overview, reviewer tabs, quick checks, cheat sheet, TOC
lesson6.js        Research design lesson and interactive labs
lesson7.js        Sampling lesson, Slovin, and allocation labs
lesson8.js        Data tools lesson, tool chooser, and instrument demo
practice.js       Test engine, timing, review, diagnosis, persistence
flashcards.js     Flashcard deck engine
games.js          Arcade hub and three game engines
assets/           Favicon
```

## Notes

- Built from the Chapter 4 reviewer for Practical Research 2 (Quantitative Research).
- No package manager, framework, or compile step is required.
- Modifying content is mostly a matter of editing `data.js`; page-specific labs live in the lesson modules.
- The app is designed for modern evergreen browsers (Chrome, Edge, Firefox, Safari).
