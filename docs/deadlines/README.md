# Conference deadlines

`/deadlines` is a venue-centered schedule for the lab's core Computer Vision, Machine Learning / AI, LLM / NLP, and Robotics venues.

## Data source

Edit `content/deadlines/venues.json`. Every venue has a direct official CFP URL, event details, a status, and zero or more milestones. A missing milestone is intentional: it means the next CFP has not published that date yet.

Use the `event` object to show the conference period, city/country, and the specific convention venue. Use `Venue TBA` when the organiser has announced the host city but not the building. Keep `source_url` pointed to the official event page.

```json
{
  "event": {
    "dates": "June 20–24, 2027",
    "location": "Seattle, WA, USA",
    "venue": "Venue TBA",
    "source_url": "https://example.org/official-event",
    "status": "official"
  }
}
```

Each milestone stores the official instant with its timezone. Use a full ISO 8601 value with an offset; for Anywhere on Earth, use `-12:00`.

```json
{
  "id": "paper",
  "label": "Paper deadline",
  "short_label": "Paper",
  "kind": "paper",
  "deadline_at": "2026-09-25T23:59:00-12:00",
  "timezone_label": "AoE",
  "status": "verified"
}
```

Do not add a date by extrapolating from a previous year. Use `awaiting_cfp` until a current official CFP publishes it, then set the venue to `verified`, update `source_checked_at`, and add the official date.

## Commands

```bash
npm run deadlines:validate
npm run deadlines:sync
npm run deadlines:refresh
```

`deadlines:sync` validates the source file and creates `src/generated/deadlines.generated.json` for the site. `deadlines:refresh` additionally checks every official CFP URL, records a source-health result in that generated file, confirms configured evidence text for verified venues, and applies a configured venue-specific date extractor when it can prove a current official date.

The deployment workflow runs the source check once each day at 02:17 UTC. The published site calculates the countdown in the visitor's browser, so the remaining time updates every second without waiting for another deployment.

## Adding a source parser

Official CFP formats differ widely. The initial automation parses the stable WACV and ICLR formats and monitors the remaining official sources. When another venue's current CFP format is stable, add a `source_parser` to its milestone, validate its output against the source, and retain the previous verified date if the parser cannot prove a replacement value. This avoids silently publishing an incorrect deadline after a conference site redesign.
