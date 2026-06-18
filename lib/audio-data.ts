export interface Episode {
  id: string
  number: number
  title: string
  description: string
  duration: string        // display string e.g. "28:14"
  durationSeconds: number
  audioUrl: string
}

export interface AudioSeries {
  slug: string
  title: string
  subtitle: string
  genre: string
  accentColor: string
  coverFrom: string   // Tailwind gradient-from class
  coverVia: string    // Tailwind gradient-via class
  coverUrl?: string   // Notion page cover / file property image URL
  bgVideoId: string   // DYFF YouTube video ID — update per release
  status: 'ongoing' | 'complete'
  episodeCount: number
  year: number
  logline: string
  episodes: Episode[]
}

// ─── Free CC-licensed audio for mock playback ─────────────────────────────
const SH1 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
const SH2 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
const SH3 = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'

// ─── GWAVA ────────────────────────────────────────────────────────────────
const gwavaEpisodes: Episode[] = [
  {
    id: 'gwava-1',
    number: 1,
    title: 'The Last Broadcast',
    description: 'A distress signal from a journalist who disappeared three weeks ago. Someone is still transmitting from her frequency.',
    duration: '28:14',
    durationSeconds: 1694,
    audioUrl: SH1,
  },
  {
    id: 'gwava-2',
    number: 2,
    title: 'Dead Signal',
    description: 'The signal leads Detective Obi to an abandoned studio in Surulere. What was broadcast from here is still being watched.',
    duration: '31:45',
    durationSeconds: 1905,
    audioUrl: SH2,
  },
  {
    id: 'gwava-3',
    number: 3,
    title: 'Black Site',
    description: 'Every broadcast leaves a fingerprint. Obi finds the station — and realises he was never looking for a journalist.',
    duration: '27:33',
    durationSeconds: 1653,
    audioUrl: SH3,
  },
]

// ─── ESE ──────────────────────────────────────────────────────────────────
const eseEpisodes: Episode[] = [
  {
    id: 'ese-1',
    number: 1,
    title: 'Voicemail',
    description: 'She left a voicemail she did not mean to send. He listened to it fourteen times before calling back.',
    duration: '24:18',
    durationSeconds: 1458,
    audioUrl: SH1,
  },
  {
    id: 'ese-2',
    number: 2,
    title: 'Static',
    description: 'Long distance — Lagos to London — and the specific kind of silence that says more than the call does.',
    duration: '29:07',
    durationSeconds: 1747,
    audioUrl: SH2,
  },
  {
    id: 'ese-3',
    number: 3,
    title: 'Frequency',
    description: 'Some people occupy the exact frequency of your loneliness. The question is whether that is love or just a pattern.',
    duration: '26:55',
    durationSeconds: 1615,
    audioUrl: SH3,
  },
]

// ─── HAUNTED HEART ────────────────────────────────────────────────────────
const hauntedHeartEpisodes: Episode[] = [
  {
    id: 'hh-1',
    number: 1,
    title: 'The Sound in the Walls',
    description: 'A new apartment. A rhythm in the walls at 3am. Adaora tells herself it is the pipes. She is wrong.',
    duration: '33:22',
    durationSeconds: 2002,
    audioUrl: SH1,
  },
  {
    id: 'hh-2',
    number: 2,
    title: 'Midnight Signal',
    description: 'The rhythm is not random. It is Morse. Someone has been sending the same message for six months.',
    duration: '30:48',
    durationSeconds: 1848,
    audioUrl: SH2,
  },
  {
    id: 'hh-3',
    number: 3,
    title: 'What She Heard',
    description: 'The message translates. Five words. Adaora realises she has heard them before — in her own voice.',
    duration: '28:15',
    durationSeconds: 1695,
    audioUrl: SH3,
  },
]

// ─── LEGEND OF LEVITICUS ─────────────────────────────────────────────────
const leviticusEpisodes: Episode[] = [
  {
    id: 'lol-1',
    number: 1,
    title: 'Mark of the Map',
    description: 'The tattoo appeared while he slept. By morning, Leviticus could feel it pointing — north-northwest, precise as a compass.',
    duration: '35:44',
    durationSeconds: 2144,
    audioUrl: SH1,
  },
  {
    id: 'lol-2',
    number: 2,
    title: 'The First Gate',
    description: 'A woman eating noodles outside a rusted door in Apapa Port. She has been waiting nineteen years.',
    duration: '38:12',
    durationSeconds: 2292,
    audioUrl: SH2,
  },
  {
    id: 'lol-3',
    number: 3,
    title: 'Blood and Direction',
    description: 'Three drops. The map ignites. Six gates remain and each one asks for something different.',
    duration: '32:09',
    durationSeconds: 1929,
    audioUrl: SH3,
  },
]

// ─── BDS ──────────────────────────────────────────────────────────────────
const bdsEpisodes: Episode[] = [
  {
    id: 'bds-1',
    number: 1,
    title: 'Brotherhood',
    description: 'Three boys who grew up on the same street. Twenty years later, one is in debt to the other two.',
    duration: '26:33',
    durationSeconds: 1593,
    audioUrl: SH1,
  },
  {
    id: 'bds-2',
    number: 2,
    title: 'Debt',
    description: 'The money was never the point. Emeka finally says what the debt actually was: loyalty, time, silence.',
    duration: '29:18',
    durationSeconds: 1758,
    audioUrl: SH2,
  },
  {
    id: 'bds-3',
    number: 3,
    title: 'Survival',
    description: 'The deal is made. Some stories do not end cleanly. Some end with three men staring at a road and saying nothing.',
    duration: '24:52',
    durationSeconds: 1492,
    audioUrl: SH3,
  },
]

// ─── EXPORTED CATALOGUE ──────────────────────────────────────────────────

export const AUDIO_SERIES: AudioSeries[] = [
  {
    slug:         'gwava',
    title:        'GWAVA',
    subtitle:     'A Missing Journalist. A City With No Memory.',
    genre:        'THRILLER',
    accentColor:  '#8b0000',
    coverFrom:    'from-red-950',
    coverVia:     'via-red-900/30',
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    episodeCount: 12,
    year:         2024,
    logline:      'The ink never dries on this case.',
    episodes:     gwavaEpisodes,
  },
  {
    slug:         'ese',
    title:        'ESE',
    subtitle:     'Love Letters Written in Vanishing Ink.',
    genre:        'ROMANCE',
    accentColor:  '#6c00b3',
    coverFrom:    'from-purple-950',
    coverVia:     'via-purple-900/30',
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    episodeCount: 8,
    year:         2024,
    logline:      'Some things aren\'t meant to last.',
    episodes:     eseEpisodes,
  },
  {
    slug:         'haunted-heart',
    title:        'HAUNTED HEART',
    subtitle:     'What Bleeds on the Page After Midnight Knows Your Name.',
    genre:        'HORROR',
    accentColor:  '#c9a84c',
    coverFrom:    'from-slate-950',
    coverVia:     'via-slate-900/40',
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    episodeCount: 10,
    year:         2024,
    logline:      'Some addresses should stay vacant.',
    episodes:     hauntedHeartEpisodes,
  },
  {
    slug:         'legend-of-leviticus',
    title:        'LEGEND OF LEVITICUS',
    subtitle:     'The Ink on His Skin Is a Map. The Map Is a Weapon.',
    genre:        'ACTION',
    accentColor:  '#c9a84c',
    coverFrom:    'from-amber-950',
    coverVia:     'via-amber-900/30',
    bgVideoId:    '5GqC5Acow4E',
    status:       'ongoing',
    episodeCount: 15,
    year:         2024,
    logline:      'Seven gates. One bloodline. Lagos will never look the same.',
    episodes:     leviticusEpisodes,
  },
  {
    slug:         'bds',
    title:        'BDS',
    subtitle:     'Brotherhood. Debt. Survival.',
    genre:        'DRAMA',
    accentColor:  '#99ca45',
    coverFrom:    'from-green-950',
    coverVia:     'via-green-900/30',
    bgVideoId:    '5GqC5Acow4E',
    status:       'complete',
    episodeCount: 6,
    year:         2024,
    logline:      'Some stories don\'t have clean endings.',
    episodes:     bdsEpisodes,
  },
]

export function getAudioSeries(slug: string): AudioSeries | undefined {
  return AUDIO_SERIES.find(s => s.slug === slug)
}

export function getAllAudioSlugs(): string[] {
  return AUDIO_SERIES.map(s => s.slug)
}
