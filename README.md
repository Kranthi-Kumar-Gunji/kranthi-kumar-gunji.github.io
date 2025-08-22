
# Kranthi Kumar Gunji – Dark Blue Portfolio (v3)

## Pages
- `index.html` – Home (3 sections: title card + profile, summary, education & certs side-by-side with images).
- `skills.html` – 3 sections, 2 cards each; **glowing buttons** (no pictures).
- `experience.html` – Curved, centerline timeline with alternating cards; **year badges** (start year, newest first).
- `projects.html` – 3 sections: featured projects, auto GitHub, auto Trailblazer rank/points.
- `contact.html` – 2 sections: contact form and contact info.

## Run locally (VS Code)
1. Open folder in VS Code.
2. Install extension **Live Server** (Ritwick Dey).
3. Right‑click `index.html` → **Open with Live Server** (or double‑click `index.html`).

## Deploy (GitHub Pages)
1. Create a repo (e.g., `kranthi-portfolio-v3`) and push/upload all files.
2. Repo **Settings → Pages** → Source: `main` branch, root (`/`).
3. Visit `https://<username>.github.io/kranthi-portfolio-v3/`.

## Notes
- **Images not visible?** They are under `assets/images/` with correct relative paths; ensure you keep folder structure.
- **Trailblazer** values are fetched via a CORS-friendly mirror (`r.jina.ai`). If it ever fails, values show `N/A` but the link still works.
- **GitHub feed** reads your public repos from the GitHub API without a token.
