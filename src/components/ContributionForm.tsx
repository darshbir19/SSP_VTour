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

  return (
    <div
      className={`rounded-2xl border border-[#ffffff]/70 bg-[#ffffff] p-6 text-[#0f172a] shadow-sm ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.18) 1px, transparent 0)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="mb-5">
        <p className="text-xs tracking-widest text-[#2563eb] uppercase">Community Archive</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#0f172a]">Contribute Your Memory</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#334155]">
          Share stories, photos, videos, audio, and moments from Sham Shui Po to enrich the living timeline.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-4 rounded-xl border border-[#2563eb]/50 bg-[#2563eb]/20 p-3 text-sm text-[#0f172a]">
          Missing Supabase env vars. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env`.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contrib-title" className="mb-1 block text-sm font-medium text-[#0f172a]">
            Title <span className="text-[#2563eb]">*</span>
          </label>
          <input
            id="contrib-title"
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. First visit to Golden Computer Arcade"
            className="w-full rounded-xl border border-[#ffffff]/70 bg-white px-3 py-2 text-sm text-[#0f172a] outline-none transition-all duration-300 ease-in-out focus:border-[#2563eb]"
          />
        </div>

        <div>
          <label
            htmlFor="contrib-description"
            className="mb-1 block text-sm font-medium text-[#0f172a]"
          >
            Description
          </label>
          <textarea
            id="contrib-description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the memory in a few lines..."
            className="w-full rounded-xl border border-[#ffffff]/70 bg-white px-3 py-2 text-sm leading-relaxed text-[#0f172a] outline-none transition-all duration-300 ease-in-out focus:border-[#2563eb]"
          />
        </div>

        <div>
          <div className="relative">
            <label
              htmlFor="contrib-location"
              className="mb-2 block text-base font-semibold text-[#0f172a]"
            >
              Search location in Sham Shui Po <span className="text-[#2563eb]">*</span>
            </label>
            <div className="relative rounded-2xl border border-[#ffffff]/60 bg-white shadow-sm transition-all duration-300 ease-in-out focus-within:border-[#2563eb] focus-within:ring-4 focus-within:ring-[#2563eb]/20">
              {ghostSuggestionText ? (
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap px-4 py-3 pr-36 text-base leading-relaxed text-[#c4b5a3]"
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
                placeholder="Search streets, shops, landmarks..."
                  className="relative w-full rounded-2xl bg-transparent px-4 py-3 pr-36 text-base leading-relaxed text-[#0f172a] outline-none placeholder:text-[#c68f8f]"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9ca3af]">
                {searchingLocations ? 'Searching' : topSuggestion ? 'Tab to accept' : ''}
              </div>
            </div>
          </div>
          {form.latitude !== null && form.longitude !== null ? (
              <p className="mt-2 rounded-lg bg-[#2563eb]/25 px-3 py-2 text-xs font-medium text-[#0f172a]">
              Location selected: {form.placeName}
            </p>
          ) : (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#334155]">
                Press Tab, Right Arrow, Enter, or submit to use the best match.
              </p>
              <button
                type="button"
                onClick={() => void handleConfirmLocation()}
                disabled={locationQuery.trim().length < 2 || searchingLocations}
                className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-[#2563eb]/50 bg-[#ffffff] px-3 py-2 text-xs font-semibold text-[#0f172a] transition-all duration-200 hover:bg-[#2563eb] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm Location
              </button>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="contrib-media" className="mb-1 block text-sm font-medium text-[#0f172a]">
            Upload media <span className="text-[#2563eb]">*</span>
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
            className="w-full rounded-xl border border-[#ffffff]/70 bg-white px-3 py-2 text-sm text-[#0f172a] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2563eb] file:px-3 file:py-1 file:text-xs file:font-medium file:text-white"
          />
          {form.media ? (
            <p className="mt-2 text-xs text-[#334155]">Selected: {form.media.name}</p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-[#2563eb]/70 bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-[1.01] hover:bg-[#ffffff] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Memory'}
        </button>
      </form>

      {showRecentEntries && entries.length > 0 ? (
        <div className="mt-8 border-t border-[#ffffff]/50 pt-6">
          <h3 className="text-sm tracking-widest text-[#2563eb] uppercase">Recent Contributions</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
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


