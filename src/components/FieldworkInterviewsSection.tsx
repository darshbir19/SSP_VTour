import { useEffect, useRef, useState } from 'react'

import interviewRecordingMp4 from '../assets/Video Recording.mp4'
import audioInterviewMp3 from '../assets/Audio Recording 1.mp3'
import { GentrificationMemorySection } from './GentrificationMemorySection'

function FindingBlock({
  title,
  body,
}: {
  title: string
  body: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`border border-[#082852]/12 bg-[#fafbfc] px-6 py-8 transition-all duration-700 ease-out sm:px-8 sm:py-10 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      <div className="mb-4 h-px w-12 bg-[#2563eb]/70" aria-hidden />
      <h4 className="font-['Georgia',serif] text-xl font-semibold tracking-tight text-[#082852] sm:text-2xl">{title}</h4>
      <p className="mt-4 font-['Montserrat',sans-serif] text-sm leading-relaxed text-[#475569] sm:text-base">{body}</p>
    </div>
  )
}

function DecorativeWaveform({ className }: { className?: string }) {
  const heights = [28, 42, 22, 48, 34, 56, 24, 44, 30, 50, 20, 38]
  return (
    <div className={`flex h-14 items-end justify-center gap-[3px] opacity-80 ${className ?? ''}`} aria-hidden>
      {heights.map((h, i) => (
        <span key={i} className="w-[3px] rounded-full bg-gradient-to-t from-white/35 to-white/85" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

/** Generates a JPEG poster URL from a seeked frame (released on unmount). */
function usePosterUrlFromVideoFrame(videoSrc: string, captureAtSeconds = 1) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [posterUrl, setPosterUrl] = useState<string | undefined>(undefined)
  const posterObjectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const revokePoster = () => {
      if (posterObjectUrlRef.current) {
        URL.revokeObjectURL(posterObjectUrlRef.current)
        posterObjectUrlRef.current = null
      }
    }

    const capture = () => {
      if (cancelled || video.videoWidth < 2 || video.videoHeight < 2) return
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (cancelled || !blob) return
          revokePoster()
          const url = URL.createObjectURL(blob)
          posterObjectUrlRef.current = url
          setPosterUrl(url)
        },
        'image/jpeg',
        0.85,
      )
    }

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked)
      capture()
    }

    const onLoadedMetadata = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      if (cancelled) return
      const duration = video.duration
      let t = captureAtSeconds
      if (Number.isFinite(duration) && duration > 0) {
        const safeEnd = Math.max(duration - 0.05, 0.05)
        t = Math.min(Math.max(captureAtSeconds, 0.05), safeEnd)
      }
      video.addEventListener('seeked', onSeeked)
      video.currentTime = t
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      onLoadedMetadata()
    }

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      revokePoster()
      setPosterUrl(undefined)
    }
  }, [videoSrc, captureAtSeconds])

  return { videoRef, posterUrl }
}

export function FieldworkInterviewsSection({
  onNavigateHome,
  homeAriaLabel,
  homeCaption,
}: {
  onNavigateHome?: () => void
  homeAriaLabel?: string
  homeCaption?: string
} = {}) {
  const { videoRef, posterUrl } = usePosterUrlFromVideoFrame(interviewRecordingMp4, 1)

  return (
    <section
      id="fieldwork-interviews"
      aria-labelledby="fieldwork-interviews-heading"
      className="relative scroll-mt-[calc(3rem+32px)] border-t border-[#082852]/20 bg-gradient-to-b from-[#eef2f7] via-[#f8fafc] to-[#ffffff] px-4 py-16 text-[#0f172a] sm:px-8 sm:py-24"
    >
      {onNavigateHome && homeAriaLabel && homeCaption && (
        <div className="pointer-events-none absolute top-4 right-4 z-20 flex flex-col items-center gap-1 sm:top-8 sm:right-8">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label={homeAriaLabel}
            title={homeAriaLabel}
            className="group pointer-events-auto flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#2563eb]/45 bg-white/92 text-[#2563eb] shadow-[0_14px_40px_rgba(15,23,42,0.14)] backdrop-blur transition duration-300 hover:border-[#2563eb] hover:bg-[#2563eb] hover:text-white hover:shadow-[0_18px_48px_rgba(37,99,235,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
          <span className="pointer-events-none text-center text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#334155] drop-shadow-sm">
            {homeCaption}
          </span>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#082852]/25 to-transparent" />

      <header className="mx-auto max-w-4xl text-center">
        <div className="mx-auto mb-8 h-px max-w-md bg-gradient-to-r from-transparent via-[#082852]/35 to-transparent" aria-hidden />
        <h2
          id="fieldwork-interviews-heading"
          className="font-['Georgia',serif] text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.08] tracking-tight text-[#082852]"
        >
          Fieldwork & Interviews
        </h2>
        <p className="mx-auto mt-8 max-w-3xl font-['Montserrat',sans-serif] text-base italic leading-relaxed text-[#475569] sm:text-lg">
          Documenting the multisensory experiences of Sham Shui Po through ethnography, autoethnography, interviews, and
          sensory field recording.
        </p>
        <div className="mx-auto mt-10 h-px max-w-md bg-gradient-to-r from-transparent via-[#082852]/35 to-transparent" aria-hidden />
      </header>

      <div className="mx-auto mt-20 max-w-6xl">
        <h3 className="font-['Georgia',serif] text-2xl font-semibold tracking-tight text-[#082852] sm:text-3xl">
          Research Methods
        </h3>
        <div className="mt-3 h-px max-w-full bg-[#082852]/15" aria-hidden />

        <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-20 lg:gap-x-16">
          <article className="group flex flex-col gap-8">
            <div className="relative overflow-hidden shadow-[0_40px_90px_rgba(8,40,82,0.12)] transition duration-700 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:shadow-[0_48px_100px_rgba(8,40,82,0.18)]">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#082852]/10">
                <img
                  src="/images/fieldtrip/fieldtrip-03.jpg"
                  alt="Wet market street documentation during fieldwork"
                  className="h-full w-full object-cover transition duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082852]/55 via-transparent to-transparent opacity-80" />
              <p className="absolute bottom-5 left-5 font-['Montserrat',sans-serif] text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/90">
                Ethnography · Observation
              </p>
            </div>
            <div>
              <h4 className="font-['Georgia',serif] text-xl font-semibold text-[#082852] sm:text-2xl">Ethnography</h4>
              <p className="mt-5 font-['Montserrat',sans-serif] text-base leading-relaxed text-[#475569] sm:text-[1.05rem]">
                This study used ethnographic fieldwork to observe everyday life within Sham Shui Po through participant
                observation, photography, sound recording, and street documentation. The research focused on how
                residents interact with the district through sensory experience, memory, and everyday social practices.
              </p>
            </div>
          </article>

          <article className="group flex flex-col gap-8 lg:mt-12">
            <div className="relative overflow-hidden shadow-[0_40px_90px_rgba(8,40,82,0.12)] transition duration-700 ease-out motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:shadow-[0_48px_100px_rgba(8,40,82,0.18)]">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#082852]/10">
                <img
                  src="/images/fieldtrip/fieldtrip-11.jpg"
                  alt="Reflective walking documentation through Sham Shui Po"
                  className="h-full w-full object-cover transition duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082852]/50 via-transparent to-transparent opacity-80" />
              <p className="absolute bottom-5 left-5 font-['Montserrat',sans-serif] text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/90">
                Autoethnography · Field diary
              </p>
            </div>
            <div>
              <h4 className="font-['Georgia',serif] text-xl font-semibold text-[#082852] sm:text-2xl">Autoethnography</h4>
              <p className="mt-5 font-['Montserrat',sans-serif] text-base leading-relaxed text-[#475569] sm:text-[1.05rem]">
                The project also incorporated autoethnography, reflecting on personal experiences of navigating Sham Shui Po
                as a newer observer. This approach explored how atmosphere, sensory intensity, and perceptions of urban
                change differ across individuals and generations.
              </p>
            </div>
          </article>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16">
          <div className="relative aspect-[16/10] overflow-hidden border border-[#082852]/10 shadow-[0_28px_70px_rgba(8,40,82,0.08)]">
            <img
              src="/images/fieldtrip/fieldtrip-06.jpg"
              alt="Street-level participant observation"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden border border-[#082852]/10 shadow-[0_28px_70px_rgba(8,40,82,0.08)]">
            <img
              src="/images/fieldtrip/fieldtrip-12.jpg"
              alt="Sensory mapping and reflective observation"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-24 max-w-[100vw] overflow-hidden bg-[#082852] px-4 py-20 text-white sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(-45deg,#fff_0,#fff_1px,transparent_1px,transparent_12px)]" />
        <div className="relative mx-auto max-w-5xl">
          <h3 className="text-center font-['Georgia',serif] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight">
            Interviews
          </h3>
          <div className="mx-auto mt-6 h-px w-24 bg-white/25" aria-hidden />

          <div className="mt-16 space-y-20">
            <figure className="mx-auto max-w-4xl">
              <div className="group relative aspect-video w-full overflow-hidden bg-black shadow-[0_32px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition duration-500 motion-safe:group-hover:ring-white/20">
                <video
                  ref={videoRef}
                  className="relative z-[1] h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={posterUrl}
                >
                  <source src={interviewRecordingMp4} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/25 opacity-100 transition duration-500 group-hover:opacity-0">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-[#082852]/75 text-3xl text-white shadow-xl backdrop-blur-sm transition duration-300 motion-safe:group-hover:scale-105">
                    ▶
                  </span>
                </div>
              </div>
              <figcaption className="mx-auto mt-6 max-w-2xl text-center font-['Montserrat',sans-serif] text-sm leading-relaxed text-white/75 sm:text-base">
                This interview explored memory, identity, and perceptions of redevelopment within Sham Shui Po.
              </figcaption>
            </figure>

            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:items-start">
              <div className="relative min-h-[280px] overflow-hidden border border-white/10 shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
                <img
                  src="/images/fieldtrip/fieldtrip-08.jpg"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-55"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082852] via-[#082852]/85 to-[#082852]/70" />
                <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                  <DecorativeWaveform className="mb-6 text-white" />
                  <audio controls className="relative z-[1] w-full opacity-95 [&::-webkit-media-controls-panel]:bg-[#0f172a]/90">
                    <source src={audioInterviewMp3} type="audio/mpeg" />
                  </audio>
                  <p className="mt-4 font-['Montserrat',sans-serif] text-[0.65rem] uppercase tracking-[0.28em] text-white/55">
                    Audio interview · Archive excerpt
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center border-l border-white/15 pl-0 lg:border-l lg:pl-10">
                <blockquote className="font-['Georgia',serif] text-2xl font-medium italic leading-snug text-white/95 sm:text-[1.65rem]">
                  “It is losing its culture.”
                </blockquote>
                <p className="mt-8 font-['Montserrat',sans-serif] text-sm leading-relaxed text-white/70 sm:text-base">
                  Transcript excerpt — concerns surrounding redevelopment, disappearing street culture, and changing
                  sensory environments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GentrificationMemorySection />

      <div className="mx-auto mt-24 max-w-6xl px-0 pb-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h3 className="font-['Georgia',serif] text-2xl font-semibold tracking-tight text-[#082852] sm:text-3xl">Key Findings</h3>
          <div className="mx-auto mt-4 h-px w-full max-w-xs bg-[#082852]/20" aria-hidden />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FindingBlock
            title="Multisensory Identity"
            body="Sham Shui Po’s identity is sustained through overlapping sensory cues — street sound, texture of alleyways, food aromas, and rhythms of trade — rather than visual branding alone."
          />
          <FindingBlock
            title="Memory & Attachment"
            body="Residents anchor attachment to place through embodied memory: recurring routes, vendor familiarity, and sensory cues that mark continuity across decades."
          />
          <FindingBlock
            title="Gentrification & Urban Change"
            body="Redevelopment reframes sensory environments — quieter corridors, altered smells, new surfaces — producing uneven experiences across generations."
          />
          <FindingBlock
            title="Continuity & Transformation"
            body="Everyday practices persist alongside transformation; sensory archives help trace both endurance and loss within urban transition."
          />
        </div>
      </div>
    </section>
  )
}
