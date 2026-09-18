# International Climate News — paper website

Static site for "International Climate News" (Arteaga-Garavito, Colacito, Croce & Yang).
No build step — plain HTML/CSS, ready to serve via GitHub Pages.

## Structure

- `index.html` — Home: title, abstract, authors, BibTeX link, videos
- `attention.html` — Climate Attention Summary: data coverage & CAI methodology
- `results.html` — Main Results: FX, equities, capital flows
- `download.html` — link to SSRN, data/replication link, BibTeX
- `assets/css/style.css` — shared stylesheet
- `assets/js/main.js` — BibTeX "copy" button behavior
- `assets/img/authors/` — author headshots (circular crop via CSS)
- `assets/img/figures/` — figures cropped from the paper PDF (Fig. 1, 9, 12, 13)
- `assets/video/NBER_video_July2025.mp4` — NBER presentation recording

The paper itself is not hosted in this repo — every "Paper" / "View on SSRN" link
points to https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4713016.

## Updating for a new draft

1. Update the dateline in `index.html` and `download.html` ("This draft: ...").
2. If key figures changed, re-crop them from the new draft PDF (kept locally,
   outside this repo) and replace the files in `assets/img/figures/` (same
   filenames, so no HTML changes needed).
3. Commit and push — GitHub Pages redeploys automatically.

## Local preview

```
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `international-climate-news`).
2. Push the contents of this folder to the `main` branch.
3. In the repo's Settings → Pages, set the source to `main` / root.
4. The site will be live at `https://<username>.github.io/<repo-name>/`.
