export interface AnimationEntry {
  id:         string
  title:      string
  subtitle:   string
  runtime:    string          // display e.g. "8:44"
  category:   'SERIES' | 'SHORTS' | 'TRAILER'
  youtubeId:  string
  year:       number
  logline:    string
}

// Update youtubeId values with real DYFF releases.
// Thumbnails are served automatically from:
//   https://img.youtube.com/vi/{youtubeId}/maxresdefault.jpg
export const ANIMATIONS: AnimationEntry[] = [
  {
    id:        'gwava-ep1',
    title:     'GWAVA',
    subtitle:  'EP 01 — The Last Broadcast',
    runtime:   '8:44',
    category:  'SERIES',
    youtubeId: '5GqC5Acow4E',
    year:      2024,
    logline:   'A detective. A missing journalist. A city with no memory.',
  },
  {
    id:        'leviticus-origins',
    title:     'MARK OF THE MAP',
    subtitle:  'Legend of Leviticus — Origins',
    runtime:   '2:18',
    category:  'SHORTS',
    youtubeId: 'dQw4w9WgXcQ',
    year:      2024,
    logline:   'The tattoo appeared while he slept. The map was already moving.',
  },
  {
    id:        'dyff-2024-reel',
    title:     'DYFF STUDIO 2024',
    subtitle:  'Official Showreel',
    runtime:   '1:32',
    category:  'TRAILER',
    youtubeId: 'jNQXAC9IVRw',
    year:      2024,
    logline:   'Ink. Sound. Motion. One studio. Every story.',
  },
  {
    id:        'ese-animated',
    title:     'ESE',
    subtitle:  'EP 01 — Voicemail (Animated)',
    runtime:   '6:55',
    category:  'SERIES',
    youtubeId: '9bZkp7q19f0',
    year:      2024,
    logline:   'She left a voicemail she did not mean to send.',
  },
]

export function getAnimationById(id: string): AnimationEntry | undefined {
  return ANIMATIONS.find(a => a.id === id)
}

export function getAnimationsByCategory(
  cat: 'ALL' | AnimationEntry['category'],
): AnimationEntry[] {
  return cat === 'ALL' ? ANIMATIONS : ANIMATIONS.filter(a => a.category === cat)
}
