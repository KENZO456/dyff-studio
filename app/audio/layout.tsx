export default function AudioLayout({ children }: { children: React.ReactNode }) {
  // pb-20 keeps episode lists clear of the fixed audio player bar
  return <div className="pb-20">{children}</div>
}
