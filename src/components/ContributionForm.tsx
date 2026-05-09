import L, { type LatLngBoundsExpression } from 'leaflet'
import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, SubmissionRow, supabase } from '../lib/supabase'

interface ContributionFormProps {
  className?: string
  showRecentEntries?: boolean
  onSubmitted?: () => void
}

interface FormState {
  title: string
  description: string
  placeName: string
  latitude: number | null
  longitude: number | null
  media: File | null
}

interface LocationSuggestion {
  placeId: string
  placeName: string
  latitude: number
  longitude: number
}

const INITIAL_STATE: FormState = {
  title: '',
  description: '',
  placeName: '',
  latitude: null,
  longitude: null,
  media: null,
}

const SSP_BOUNDS: LatLngBoundsExpression = [
  [22.3258, 114.1553],
  [22.3372, 114.1711],
]
const SSP_LEAFLET_BOUNDS = L.latLngBounds(SSP_BOUNDS)

function mapNominatimResults(results: Array<{ place_id: number; display_name: string; lat: string; lon: string }>) {
  return results
    .map((result) => ({
      placeId: String(result.place_id),
      placeName: result.display_name,
      latitude: Number(result.lat),
      longitude: Number(result.lon),
    }))
    .filter((result) => SSP_LEAFLET_BOUNDS.contains([result.latitude, result.longitude]))
}

async function searchShamShuiPoLocations(query: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    q: `${query.trim()} Sham Shui Po Hong Kong`,
    format: 'jsonv2',
    addressdetails: '1',
    limit: '5',
    bounded: '1',
    viewbox: '114.1553,22.3372,114.1711,22.3258',
  })

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) throw new Error('Location search failed.')
  const results = await response.json() as Array<{ place_id: number; display_name: string; lat: string; lon: string }>
  return mapNominatimResults(results)
}

function buildUploadPath(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const mediaFolder = ['image', 'video', 'audio'].includes(file.type.split('/')[0])
    ? file.type.split('/')[0]
    : 'media'
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`

  return `public/${mediaFolder}/${randomPart}.${ext}`
}

export function ContributionForm({
  className = '',
  showRecentEntries = false,
  onSubmitted,
}: ContributionFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [entries, setEntries] = useState<SubmissionRow[]>([])
  const [locationQuery, setLocationQuery] = useState('')
  const [topSuggestion, setTopSuggestion] = useState<LocationSuggestion | null>(null)
  const [searchingLocations, setSearchingLocations] = useState(false)

  const canSubmit = useMemo(
    () =>
      form.title.trim().length > 0 &&
      form.placeName.trim().length > 0 &&
      form.latitude !== null &&
      form.longitude !== null &&
      Boolean(form.media) &&
      !loading,
    [form.latitude, form.longitude, form.media, form.placeName, form.title, loading],
  )

  const fetchEntries = async () => {
    if (!showRecentEntries || !supabase) return

    const { data, error: queryError } = await supabase
      .from('submissions')
      .select('id, title, description, image_url, place_name, latitude, longitude, created_at')
      .order('created_at', { ascending: false })
      .limit(6)

    if (queryError) {
      setError(queryError.message)
      return
    }

    setEntries((data ?? []) as SubmissionRow[])
  }

  useEffect(() => {
    void fetchEntries()
  }, [showRecentEntries])

  useEffect(() => {
    if (locationQuery.trim().length < 2) {
      setTopSuggestion(null)
      setSearchingLocations(false)
      return undefined
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      setSearchingLocations(true)
      searchShamShuiPoLocations(locationQuery, controller.signal)
        .then((results) => {
          setTopSuggestion(results[0] ?? null)
        })
        .catch((searchError) => {
          if (searchError instanceof DOMException && searchError.name === 'AbortError') return
          setTopSuggestion(null)
        })
        .finally(() => setSearchingLocations(false))
    }, 250)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [locationQuery])

  const resetForm = () => {
    setForm(INITIAL_STATE)
    setLocationQuery('')
    setTopSuggestion(null)
  }

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setForm((prev) => ({
      ...prev,
      placeName: suggestion.placeName,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    }))
    setLocationQuery(suggestion.placeName)
    setTopSuggestion(null)
  }

  const handleConfirmLocation = async () => {
    setError(null)
    const query = locationQuery.trim()
    if (!query) {
      setError('Type a location in Sham Shui Po first.')
      return
    }

    if (topSuggestion) {
      handleSelectSuggestion(topSuggestion)
      return
    }

    setSearchingLocations(true)
    try {
      const results = await searchShamShuiPoLocations(query)
      const bestMatch = results[0]
      if (!bestMatch) {
        setError('No Sham Shui Po location found. Try a nearby street, shop, or landmark.')
        return
      }
      handleSelectSuggestion(bestMatch)
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : 'Location search failed.')
    } finally {
      setSearchingLocations(false)
    }
  }

  const resolveLocationForSubmit = async () => {
    if (form.placeName.trim() && form.latitude !== null && form.longitude !== null) {
      return {
        placeName: form.placeName.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
      }
    }

    const query = locationQuery.trim()
    if (!query) return null

    const bestMatch = topSuggestion ?? (await searchShamShuiPoLocations(query))[0]
    if (!bestMatch) return null

    setForm((prev) => ({
      ...prev,
      placeName: bestMatch.placeName,
      latitude: bestMatch.latitude,
      longitude: bestMatch.longitude,
    }))
    setLocationQuery(bestMatch.placeName)
    setTopSuggestion(null)

    return {
      placeName: bestMatch.placeName,
      latitude: bestMatch.latitude,
      longitude: bestMatch.longitude,
    }
  }

  const handleLocationKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Tab' || event.key === 'ArrowRight') {
      if (!topSuggestion) return
      event.preventDefault()
      handleSelectSuggestion(topSuggestion)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      void handleConfirmLocation()
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    const resolvedLocation = await resolveLocationForSubmit()
    if (!resolvedLocation) {
      setError('Choose or confirm a Sham Shui Po location before submitting.')
      return
    }

    if (!form.media) {
      setError('Please select a media file to upload.')
      return
    }

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    setLoading(true)

    try {
      const uploadPath = buildUploadPath(form.media)
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(uploadPath, form.media, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(uploadPath)
      const mediaUrl = publicUrlData.publicUrl

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: mediaUrl,
        place_name: resolvedLocation.placeName,
        latitude: resolvedLocation.latitude,
        longitude: resolvedLocation.longitude,
      }

      const { error: insertError } = await supabase.from('submissions').insert(payload)
      if (insertError) throw insertError

      resetForm()
      setSuccess('Memory submitted successfully. Thank you for contributing!')
      onSubmitted?.()
      await fetchEntries()
    } catch {
      setError('Failed to submit contribution. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const ghostSuggestionText =
    topSuggestion && locationQuery.trim().length > 0 && topSuggestion.placeName !== locationQuery
      ? topSuggestion.placeName.toLowerCase().startsWith(locationQuery.toLowerCase())
        ? topSuggestion.placeName
        : `${locationQuery}  ${topSuggestion.placeName}`
      : ''

  const labelClass = 'mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#64748b]'
  const fieldInputClass =
    'w-full rounded-lg border border-[#082852]/12 bg-white px-3 py-2.5 text-[0.8125rem] leading-snug text-[#0f172a] shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] placeholder:text-[#94a3b8] transition-[border-color,box-shadow] duration-200 hover:border-[#082852]/20 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20'

  return (
    <div
      className={`rounded-xl border border-[#082852]/10 bg-[#ffffff] p-5 text-[#0f172a] shadow-[0_1px_3px_rgba(8,40,82,0.06)] sm:p-6 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.07) 1px, transparent 0)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="mb-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#2563eb]">Community Archive</p>
        <h2 className="mt-1.5 font-['Georgia',serif] text-2xl font-semibold tracking-tight text-[#082852] sm:text-[1.65rem]">
          Contribute Your Memory
        </h2>
        <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-[#475569]">
          Share stories, photos, videos, audio, and moments from Sham Shui Po to enrich the living timeline.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-3 rounded-lg border border-[#2563eb]/25 bg-[#eff6ff] px-3 py-2.5 text-[0.8125rem] leading-snug text-[#082852]">
          Missing Supabase env vars. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env`.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="contrib-title" className={labelClass}>
            Title <span className="font-bold text-[#2563eb]">*</span>
          </label>
          <input
            id="contrib-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. First visit to Golden Computer Arcade"
            className={fieldInputClass}
          />
        </div>

        <div>
          <label htmlFor="contrib-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="contrib-description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the memory in a few lines..."
            className={`${fieldInputClass} min-h-[5.25rem] resize-y`}
          />
        </div>

        <div>
          <label htmlFor="contrib-location" className={labelClass}>
            Search location in Sham Shui Po <span className="font-bold text-[#2563eb]">*</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div
              className={`relative min-w-0 flex-1 rounded-lg border border-[#082852]/12 bg-white shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 hover:border-[#082852]/20 ${ghostSuggestionText ? 'overflow-hidden' : ''}`}
            >
              {ghostSuggestionText ? (
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap px-3 py-2.5 pr-28 text-[0.8125rem] leading-snug text-[#cbd5e1]"
                  aria-hidden="true"
                >
                  {ghostSuggestionText}
                </div>
              ) : null}
              <input
                id="contrib-location"
                type="text"
                required
                autoComplete="off"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value)
                  setForm((prev) => ({ ...prev, placeName: '', latitude: null, longitude: null }))
                }}
                onKeyDown={handleLocationKeyDown}
                placeholder="Streets, shops, landmarks…"
                className="relative w-full rounded-lg bg-transparent px-3 py-2.5 pr-28 text-[0.8125rem] leading-snug text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 max-w-[6.5rem] -translate-y-1/2 text-right text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.12em] text-[#94a3b8]">
                {searchingLocations ? 'Searching' : topSuggestion ? 'Tab · accept' : ''}
              </div>
            </div>
            {form.latitude === null || form.longitude === null ? (
              <button
                type="button"
                onClick={() => void handleConfirmLocation()}
                disabled={locationQuery.trim().length < 2 || searchingLocations}
                className="inline-flex h-[2.625rem] shrink-0 items-center justify-center self-start rounded-lg border border-[#082852]/18 bg-[#f8fafc] px-3.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#082852] transition duration-200 hover:border-[#2563eb]/35 hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 sm:self-auto sm:px-4"
              >
                Confirm
              </button>
            ) : null}
          </div>
          {form.latitude !== null && form.longitude !== null ? (
            <p className="mt-1.5 rounded-md border border-[#2563eb]/20 bg-[#eff6ff]/80 px-2.5 py-1.5 text-[0.7rem] font-medium leading-snug text-[#082852]">
              Location: <span className="text-[#334155]">{form.placeName}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-[0.7rem] leading-snug text-[#64748b]">
              Tab, Right Arrow, or Enter uses the best match. Confirm pins the location.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-[#082852]/10 bg-[#fafbfc]/90 px-3 py-2.5">
          <label htmlFor="contrib-media" className={labelClass}>
            Upload media <span className="font-bold text-[#2563eb]">*</span>
          </label>
          <input
            id="contrib-media"
            type="file"
            accept="image/*,video/*,audio/*"
            required
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setForm((prev) => ({ ...prev, media: file }))
            }}
            className="mt-1 block w-full cursor-pointer text-[0.75rem] text-[#475569] file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-[#082852]/12 file:bg-white file:px-3 file:py-1.5 file:text-[0.65rem] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#082852] file:shadow-sm file:transition file:duration-200 hover:file:border-[#2563eb]/35 hover:file:bg-[#f8fafc]"
          />
          {form.media ? (
            <p className="mt-1.5 truncate text-[0.7rem] text-[#475569]" title={form.media.name}>
              <span className="font-medium text-[#082852]">Selected:</span> {form.media.name}
            </p>
          ) : (
            <p className="mt-1 text-[0.65rem] text-[#94a3b8]">Images, video, or audio.</p>
          )}
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200/80 bg-red-50/90 px-3 py-2 text-[0.8125rem] leading-snug text-red-800">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/90 px-3 py-2 text-[0.8125rem] leading-snug text-emerald-800">
            {success}
          </div>
        ) : null}

        <div className="pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-lg border border-[#082852] bg-[#082852] px-5 py-2.5 text-[0.8125rem] font-semibold tracking-wide text-white shadow-sm transition duration-200 hover:bg-[#0a3569] hover:shadow-[0_4px_14px_rgba(8,40,82,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/35 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#082852]"
          >
            {loading ? 'Submitting…' : 'Submit memory'}
          </button>
        </div>
      </form>

      {showRecentEntries && entries.length > 0 ? (
        <div className="mt-6 border-t border-[#082852]/10 pt-5">
          <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#2563eb]">Recent Contributions</h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-2xl border border-[#ffffff]/60 bg-[#ffffff] shadow-sm"
              >
                <div className="relative">
                  <img src={entry.image_url} alt={entry.title} className="h-36 w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {entry.year ? (
                    <span className="absolute left-2 top-2 rounded-full bg-[#ffffff]/90 px-2 py-0.5 text-[10px] text-[#2563eb]">
                      {entry.year}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1 p-3">
                  <h4 className="text-sm font-semibold text-[#0f172a]">{entry.title}</h4>
                  {entry.location ? (
                    <p className="text-xs text-[#2563eb]">{entry.location}</p>
                  ) : null}
                  {entry.description ? (
                    <p className="text-xs leading-relaxed text-[#334155] line-clamp-3">{entry.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}


