import AudioProvider from '@/contexts/AudioContext'
import AudioPlayer  from '@/components/audio/AudioPlayer'

export default function AudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      {/* pb-[80px] keeps content above the fixed 80px player */}
      <div className="pb-[80px]">
        {children}
      </div>
      <AudioPlayer />
    </AudioProvider>
  )
}
