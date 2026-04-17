import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Sparkles } from 'lucide-react'
import { getPublicIcons } from '../../api/icons'
import type { PublicIcon } from '../../api/icons'

export default function IconMarquee() {
  const [icons, setIcons] = useState<PublicIcon[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const track2Ref = useRef<HTMLDivElement>(null)
  const tween2Ref = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    getPublicIcons({ sort: 'latest', page: 0, limit: 25 })
      .then(setIcons)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!icons.length || !track) return

    // Wait one tick so DOM is updated with doubled items
    const raf = requestAnimationFrame(() => {
      const singleWidth = track.scrollWidth / 2
      gsap.set(track, { x: 0 })
      tweenRef.current = gsap.to(track, {
        x: -singleWidth,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })
    })

    return () => {
      cancelAnimationFrame(raf)
      tweenRef.current?.kill()
    }
  }, [icons])

  useEffect(() => {
    const track2 = track2Ref.current
    if (!icons.length || !track2) return

    // Right-to-left reversed: start at -singleWidth, animate to 0
    const raf2 = requestAnimationFrame(() => {
      const singleWidth = track2.scrollWidth / 2
      gsap.set(track2, { x: -singleWidth })
      tween2Ref.current = gsap.to(track2, {
        x: 0,
        duration: 32,
        ease: 'none',
        repeat: -1,
      })
    })

    return () => {
      cancelAnimationFrame(raf2)
      tween2Ref.current?.kill()
    }
  }, [icons])

  // if (!icons.length) {
  //   return (
  //     <div className="border-t-2 border-[#0A1628] py-4 overflow-hidden">
  //       <div className="flex gap-3 px-6">
  //         {Array.from({ length: 10 }).map((_, i) => (
  //           <div key={i} className="w-10 h-10 shrink-0 rounded-full bg-[#0A1628]/20 animate-pulse" />
  //         ))}
  //       </div>
  //     </div>
  //   )
  // }

  const doubled = [...icons, ...icons]

  const renderIcons = (items: typeof doubled, rowRef: React.RefObject<HTMLDivElement | null>) => (
    <div className="overflow-hidden">
      <div ref={rowRef} className="flex px-6 w-max">
        {items.map((icon, i) => (
          <div
            key={`${icon.id}-${i}`}
            className="w-40 xl:w-55 2xl:w-30 3xl:w-40 4xl:w-60 shrink-0 overflow-hidden"
            title={icon.prompt}
          >
            {icon.url ? (
              <img
                src={icon.url}
                alt={icon.prompt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-light-green flex items-center justify-center">
                <Sparkles size={14} className="text-electric-yellow" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="shrink-0 pt-10 lg:pt-0 xl:pt-10 2xl:pt-0 flex flex-col gap-2.5">
      {renderIcons(doubled, trackRef)}
      <div className="hidden 2xl:block">
        {renderIcons(doubled, track2Ref)}
      </div>
    </div>
  )
}
