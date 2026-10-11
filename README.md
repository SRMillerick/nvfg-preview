# Napa Valley Fly Guides — redesign preview

An **unofficial design concept** for the website of Napa Valley Fly Guides, a guided fly
fishing service run by Richard Loft in Napa, California.

> **This is not the live website.** The production site is
> **https://www.napavalleyflyguides.com/**
>
> This repository exists only to show Richard a proposed redesign. It is marked
> `noindex` throughout and is not affiliated with or endorsed by Napa Valley Fly Guides.

Live preview: **https://srmillerick.github.io/nvfg-preview/**

---

## What this is

A static, front-end-only mock-up. Seven pages of hand-written HTML and CSS, with no
build step, no framework and no dependencies. It can be opened directly from disk.

| Page | |
|---|---|
| `index.html` | Home |
| `trips.html` | Trips & Rates |
| `about.html` | About Richard |
| `gallery.html` | Photo gallery with lightbox |
| `testimonials.html` | Client reviews |
| `contact.html` | Trip request form |
| `memoriam.html` | In memory of Geoff Fernald |

## Approach

The design direction follows the outfitter tradition — Orvis and Redington as reference
points: large, unembellished photography, restrained typography, and enough white space
that the pictures carry the page.

- **Type** — Fraunces (variable serif) for display, Inter for functional text, both
  self-hosted as `woff2` so there are no third-party font requests.
- **Palette** — river slate, warm bone paper, tailwater teal, and a single brass accent
  reserved for calls to action.
- **Photography** — cropped and re-encoded from the existing site. Camera date stamps
  were removed by inpainting rather than cropped around, so no frame is composed worse
  than it needs to be.
- **Motion** — minimal, and disabled automatically for visitors who ask for reduced motion.

## Notes

- The contact form is **not connected**. It is a design element only.
- Video is click-to-load from `youtube-nocookie.com`.
- Prices, contact details and testimonials are taken verbatim from the existing site.

## Credit

All photographs, written copy and testimonials are the property of **Richard Loft /
Napa Valley Fly Guides** and appear here solely so that he can review this proposal.
They are not licensed for reuse.
