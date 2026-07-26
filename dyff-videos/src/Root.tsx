import React from 'react'
import { Composition, continueRender, delayRender } from 'remotion'
import { DYFFIntro } from './compositions/DYFFIntro'
import { ESETrailer } from './compositions/ESETrailer'
import { SocialClip } from './compositions/SocialClip'
import { OutroCard } from './compositions/OutroCard'

const fontHandle = delayRender('Loading Thunder font')

new FontFace('Thunder', 'url(/fonts/Thunder-LC.ttf)')
  .load()
  .then((font) => {
    document.fonts.add(font)
    continueRender(fontHandle)
  })
  .catch(() => {
    continueRender(fontHandle)
  })

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DYFFIntro"
        component={DYFFIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ESETrailer"
        component={ESETrailer}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SocialClip"
        component={SocialClip}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="OutroCard"
        component={OutroCard}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  )
}
