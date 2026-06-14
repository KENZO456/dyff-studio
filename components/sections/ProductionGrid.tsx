'use client'

import { CardStack, CardStackItem } from '@/components/ui/CardStack'
import { Thunder, Label } from '@/components/ui/Typography'

const CARDS: CardStackItem[] = [
  {
    id:          'books',
    title:       'BOOKS & NOVELS',
    description: 'Stories that refuse to stay on the page. Worlds built word by word, in ink.',
    imageSrc:    '/Images/Ese cover img.jpg',
    href:        '/books',
    tag:         'FICTION',
  },
  {
    id:          'audio',
    title:       'AUDIO SERIES',
    description: 'Cinematic productions with original scores. No visuals needed — the sound paints everything.',
    imageSrc:    '/Images/HAUNTEDHEART cover image.jpg',
    href:        '/audio',
    tag:         'AUDIO',
  },
  {
    id:          'animations',
    title:       'ANIMATIONS',
    description: 'Dark animation made for adults. Frame by frame. Ink by ink.',
    imageSrc:    '/Images/bg (3).jpg',
    href:        '/animations',
    tag:         'ANIMATION',
  },
  {
    id:          'marketplace',
    title:       'MARKETPLACE',
    description: 'Merchandise, collectibles, and limited editions. Own a piece of the DYFF universe.',
    imageSrc:    '/Images/bg (1).jpg',
    href:        '/marketplace',
    tag:         'MERCH',
  },
]

export default function ProductionGrid() {
  return (
    <section className="py-24 px-6 md:px-16 bg-[#080808]/85">

      {/* Section heading */}
      <div className="mb-16">
        <Label variant="meta" className="mb-4 block">03 — Productions</Label>
        <Thunder as="h2" size="display" weight={400} className="text-ink-white">
          WHAT WE
        </Thunder>
        <Thunder as="h2" size="display" weight={400} className="thunder-outline block -mt-4">
          CREATE
        </Thunder>
      </div>

      {/* Fan card stack */}
      <CardStack
        items={CARDS}
        cardWidth={480}
        cardHeight={320}
        spreadDeg={36}
        overlap={0.5}
        depthPx={100}
        activeLiftPx={28}
        maxVisible={5}
        loop
        showDots
        autoAdvance
        intervalMs={3200}
        pauseOnHover
      />

    </section>
  )
}
