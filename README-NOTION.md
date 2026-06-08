# DYFF Studio — Notion CMS Setup Guide

Notion is the headless CMS for all DYFF Studio content. The team edits pages in
Notion; the site fetches from the Notion API and caches the data for 1 hour. When
you publish a change in Notion, the site refreshes automatically within 1 hour —
or immediately via the revalidation webhook.

---

## 1. Create a Notion Integration

1. Go to <https://www.notion.so/my-integrations>
2. Click **New integration**
3. Name it `DYFF Studio` and select your Notion workspace
4. Under **Capabilities**, enable:
   - Read content ✅
   - No user information needed
5. Click **Save** and copy the **Internal Integration Token** — this is your `NOTION_API_KEY`

---

## 2. Create the Databases

Create each database as a **full-page** database (not inline). After creating each
one, copy its ID from the URL:

```
https://notion.so/your-workspace/<DATABASE_ID>?v=...
```

The ID is the 32-character string before the `?v=`.

---

### 2a. BOOKS Database

**Properties to create:**

| Property       | Type         | Notes                                      |
|----------------|--------------|--------------------------------------------|
| Title          | Title        | Book title in ALL CAPS                     |
| Slug           | Text         | URL-safe, e.g. `legend-of-leviticus`       |
| Subtitle       | Text         | Short tagline below the title              |
| Author         | Text         | e.g. `DYFF Studio`                         |
| Genre          | Multi-select | e.g. ACTION, SUPERNATURAL, DARK FANTASY    |
| Synopsis       | Text         | 1–3 sentence hook                          |
| Cover          | Files        | Cover image upload                         |
| Status         | Select       | Options: **Published**, **Draft**          |
| Chapters       | Relation     | → links to BOOK CHAPTERS database          |
| Accent Color   | Text         | Hex color, e.g. `#8b0000`                  |
| Cover From     | Text         | Tailwind gradient class, e.g. `from-red-950` |
| BG Video ID    | Text         | YouTube video ID for reader background     |
| Year           | Number       | Release year, e.g. `2024`                  |

---

### 2b. BOOK CHAPTERS Database

**Properties to create:**

| Property       | Type     | Notes                                        |
|----------------|----------|----------------------------------------------|
| Title          | Title    | Chapter title                                |
| Book           | Relation | → links back to BOOKS database               |
| Chapter Number | Number   | 1, 2, 3…                                     |

> **Writing chapter content:** Type the chapter paragraphs directly in the
> Notion page body (not in a property). Each paragraph block in the page body
> becomes one entry in `chapter.paragraphs[]`. Keep each paragraph as a
> separate Notion block — do not use headings or bullet lists inside chapters.

---

### 2c. AUDIO SERIES Database

**Properties to create:**

| Property      | Type   | Notes                                         |
|---------------|--------|-----------------------------------------------|
| Series Name   | Title  | Series title in ALL CAPS                      |
| Slug          | Text   | URL-safe, e.g. `gwava`                        |
| Subtitle      | Text   | Short tagline                                 |
| Genre         | Select | Options: THRILLER, ROMANCE, HORROR, DRAMA, ACTION |
| Description   | Text   | 1–2 sentence logline                          |
| Cover Art     | Files  | Series cover image                            |
| Status        | Select | Options: **Ongoing**, **Complete**            |
| Accent Color  | Text   | Hex color, e.g. `#8b0000`                     |
| Cover From    | Text   | Tailwind gradient class, e.g. `from-red-950`  |
| Cover Via     | Text   | Tailwind gradient class, e.g. `via-red-900/30` |
| BG Video ID   | Text   | YouTube video ID                              |
| Episode Count | Number | Total planned episode count                   |
| Year          | Number | e.g. `2024`                                   |

---

### 2d. EPISODES Database

**Properties to create:**

| Property       | Type     | Notes                                      |
|----------------|----------|--------------------------------------------|
| Title          | Title    | Episode title                              |
| Series         | Relation | → links to AUDIO SERIES database           |
| Episode Number | Number   | 1, 2, 3…                                   |
| Duration       | Text     | Display string, e.g. `28:14`              |
| Audio URL      | URL      | Direct link to the MP3/M4A file            |
| Description    | Text     | 1–2 sentence episode summary              |

---

### 2e. ANIMATIONS Database

**Properties to create:**

| Property    | Type   | Notes                                              |
|-------------|--------|----------------------------------------------------|
| Title       | Title  | Animation title in ALL CAPS                        |
| Slug        | Text   | Used as the `id` field in code, e.g. `gwava-ep1`   |
| Subtitle    | Text   | Episode/series subtitle                            |
| Video URL   | URL    | Full YouTube URL **or** just the 11-char video ID  |
| Thumbnail   | Files  | Thumbnail image (optional — auto-fetched from YT)  |
| Type        | Select | Options: **Series**, **Short**, **Trailer**        |
| Description | Text   | Logline                                            |
| Runtime     | Text   | Display string, e.g. `8:44`                        |
| Year        | Number | e.g. `2024`                                        |

---

### 2f. MARKETPLACE PRODUCTS Database

**Properties to create:**

| Property      | Type         | Notes                                      |
|---------------|--------------|--------------------------------------------|
| Name          | Title        | Product name in ALL CAPS                   |
| Slug          | Text         | Used as `id` in code, e.g. `art-gwava-city` |
| Subtitle      | Text         | Short descriptor below the name            |
| Category      | Select       | Options: **ART**, **BOOKS**, **BEATS**, **ASSETS** |
| Price NGN     | Number       | Price in Nigerian Naira (no commas)        |
| Price USD     | Number       | Price in US Dollars, e.g. `5.99`           |
| Description   | Text         | Full product description                   |
| Product Image | Files        | Product image upload                       |
| Image ID      | Text         | Picsum seed for placeholder (dev only)     |
| Download URL  | URL          | Link to the downloadable file              |
| Tags          | Multi-select | e.g. illustration, limited, print          |
| Popularity    | Number       | 0–100 score for sorting                    |
| Is New        | Checkbox     | Shows the NEW badge on the product card    |
| Status        | Select       | Options: **Active**, **Draft**             |

---

## 3. Share Each Database with the Integration

For **every** database you created:

1. Open the database in Notion (full-page view)
2. Click the **···** menu (top-right) → **Add connections**
3. Search for `DYFF Studio` (your integration name)
4. Click **Confirm**

Repeat for all 6 databases. If you skip this step for any database, the API will
return an error for that collection.

---

## 4. Fill in `.env.local`

Copy `.env.example` to `.env.local` and fill in each value:

```bash
cp .env.example .env.local
```

```env
NOTION_API_KEY=secret_xxxx          # from Step 1
NOTION_BOOKS_DB_ID=xxxx             # from the BOOKS database URL
NOTION_CHAPTERS_DB_ID=xxxx          # from the BOOK CHAPTERS database URL
NOTION_AUDIO_DB_ID=xxxx             # from the AUDIO SERIES database URL
NOTION_EPISODES_DB_ID=xxxx          # from the EPISODES database URL
NOTION_ANIMATIONS_DB_ID=xxxx        # from the ANIMATIONS database URL
NOTION_MARKETPLACE_DB_ID=xxxx       # from the MARKETPLACE PRODUCTS database URL
REVALIDATE_SECRET=your-random-secret
```

> **How to find a Database ID:**
> Open the database in Notion → copy the URL → the ID is the 32-character
> string between the last `/` and the `?v=` parameter.
>
> Example URL:
> `https://notion.so/myworkspace/a1b2c3d4e5f6...?v=...`
> Database ID: `a1b2c3d4e5f6...`

---

## 5. Using Notion Data in Pages

### Option A — Switch a page to Notion data

Replace the static import with the Notion helper:

```ts
// Before (static data)
import { BOOKS } from '@/lib/books-data'

// After (Notion CMS)
import { getBooks } from '@/lib/notion'
const books = await getBooks()
```

The return types are identical — no JSX changes required.

### Option B — Fallback pattern (recommended during migration)

```ts
import { getBooks } from '@/lib/notion'
import { BOOKS } from '@/lib/books-data'

let books
try {
  books = await getBooks()
} catch {
  books = BOOKS   // fall back to static data if Notion is unreachable
}
```

---

## 6. On-Demand Revalidation (Webhook)

The site caches Notion data for **1 hour** by default. To flush the cache
immediately when you publish changes in Notion:

### Set up a Notion Automation

1. Open any of the CMS databases in Notion
2. Click **···** → **Automations** (or the lightning bolt icon)
3. Create an automation:
   - **Trigger:** Page added or Page property edited
   - **Action:** Send a webhook
   - **URL:** `https://your-domain.com/api/revalidate?secret=<REVALIDATE_SECRET>&tag=<tag>`

Replace `<tag>` with the appropriate value:

| Database         | Tag          |
|------------------|--------------|
| BOOKS            | `books`      |
| BOOK CHAPTERS    | `books`      |
| AUDIO SERIES     | `audio`      |
| EPISODES         | `audio`      |
| ANIMATIONS       | `animations` |
| MARKETPLACE      | `marketplace`|

> **Note:** Notion automations are available on paid plans. On free plans,
> the 1-hour cache TTL handles updates automatically.

### Test the webhook manually

```bash
curl -X POST \
  "https://your-domain.com/api/revalidate?secret=your-secret&tag=books"
```

Expected response:
```json
{ "revalidated": true, "tag": "books", "ts": 1718000000000 }
```

---

## 7. Content Guidelines for the Team

### Books — Writing Chapters

- Each **paragraph** in the Notion chapter page body = one entry in `paragraphs[]`
- Use plain paragraph blocks only (no headings, bullets, or callouts inside chapters)
- Keep paragraphs long and literary — each block renders as one `<p>` tag
- The drop-cap applies to the **first** paragraph automatically

### Status conventions

| Status      | What happens                                               |
|-------------|-----------------------------------------------------------|
| Published   | Appears on the site                                        |
| Draft       | Hidden from all public pages; only visible via direct URL  |
| Active      | (Marketplace) Product appears in the shop                  |

### Accent Colors

Use these standard DYFF colors to keep the visual system consistent:

| Color    | Hex       | Used for                   |
|----------|-----------|----------------------------|
| Crimson  | `#8b0000` | GWAVA, LEGEND OF LEVITICUS |
| Violet   | `#6c00b3` | ESE series                 |
| Gold     | `#c9a84c` | HAUNTED HEART              |
| Green    | `#99ca45` | BDS, ANIMATIONS            |
| Indigo   | `#1a0050` | ASSETS category            |

### Cover From / Cover Via (gradient classes)

Match these with the accent color:

| Accent  | Cover From        | Cover Via             |
|---------|-------------------|-----------------------|
| Crimson | `from-red-950`    | `via-red-900/30`      |
| Violet  | `from-purple-950` | `via-purple-900/30`   |
| Gold    | `from-amber-950`  | `via-amber-900/30`    |
| Green   | `from-green-950`  | `via-green-900/30`    |
| Indigo  | `from-slate-950`  | `via-slate-900/40`    |

---

## 8. Local Development

Notion API calls require a live internet connection. During local dev:

1. Make sure `.env.local` is filled in (see Step 4)
2. Run `npm run dev`
3. Pages that use `getBooks()` etc. will fetch from Notion on first request
4. Data is cached in-memory for 1 hour (or until you restart the dev server)

If you want to keep working without Notion during local dev, use the static
data fallback pattern from Step 5, Option B.

---

## Architecture Overview

```
Notion databases
       │
       │  @notionhq/client (REST API)
       ▼
lib/notion.ts          ← server-only, cached with unstable_cache
       │
       │  revalidateTag() on webhook
       ▼
app/api/revalidate/    ← POST /api/revalidate?secret=&tag=
       │
       │  return types match lib/books-data, lib/audio-data, etc.
       ▼
Page components        ← zero JSX changes needed
```

Cache is keyed by function name + args and tagged per content type. The webhook
flushes only the affected tag — editing a book doesn't invalidate the audio cache.
