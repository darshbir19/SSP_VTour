import { FormEvent, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, SubmissionRow, supabase } from '../lib/supabase'

interface ContributionFormProps {
  className?: string
  showRecentEntries?: boolean
}

interface FormState {
  title: string
  description: string
  year: string
  location: string
  image: File | null
}

const INITIAL_STATE: FormState = {
  title: '',
  description: '',
  year: '',
  location: '',
  image: null,
}

function buildUploadPath(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const randomPart =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`

  return `public/${randomPart}.${ext}`
}

export function ContributionForm({ className = '', showRecentEntries = true }: ContributionFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [entries, setEntries] = useState<SubmissionRow[]>([])

  const canSubmit = useMemo(
    () => form.title.trim().length > 0 && Boolean(form.image) && !loading,
    [form.image, form.title, loading],
  )

  const fetchEntries = async () => {
    if (!showRecentEntries || !supabase) return

    const { data, error: queryError } = await supabase
      .from('submissions')
      .select('id, title, description, image_url, year, location, created_at')
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

  const resetForm = () => setForm(INITIAL_STATE)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    if (!form.image) {
      setError('Please select an image to upload.')
      return
    }

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    setLoading(true)

    try {
      const uploadPath = buildUploadPath(form.image)
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(uploadPath, form.image, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('uploads').getPublicUrl(uploadPath)
      const imageUrl = publicUrlData.publicUrl

      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: imageUrl,
        year: form.year.trim() || null,
        location: form.location.trim() || null,
      }

      const { error: insertError } = await supabase.from('submissions').insert(payload)
      if (insertError) throw insertError

      resetForm()
      setSuccess('Memory submitted successfully. Thank you for contributing!')
      await fetchEntries()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit contribution.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`rounded-2xl border border-[#e5e7eb] bg-[#fdfaf6] p-6 shadow-sm ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(31,41,55,0.04) 1px, transparent 0)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="mb-5">
        <p className="text-xs tracking-widest text-amber-700 uppercase">Community Archive</p>
        <h2 className="mt-2 text-3xl font-semibold text-[#1f2937]">Contribute Your Memory</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7280]">
          Share stories, photos, and moments from Sham Shui Po to enrich the living timeline.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Missing Supabase env vars. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env`.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contrib-title" className="mb-1 block text-sm font-medium text-[#1f2937]">
            Title <span className="text-amber-700">*</span>
          </label>
          <input
            id="contrib-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. First visit to Golden Computer Arcade"
            className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#1f2937] outline-none transition-all duration-300 ease-in-out focus:border-amber-700/50"
          />
        </div>

        <div>
          <label
            htmlFor="contrib-description"
            className="mb-1 block text-sm font-medium text-[#1f2937]"
          >
            Description
          </label>
          <textarea
            id="contrib-description"
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the memory in a few lines..."
            className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm leading-relaxed text-[#1f2937] outline-none transition-all duration-300 ease-in-out focus:border-amber-700/50"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contrib-year" className="mb-1 block text-sm font-medium text-[#1f2937]">
              Year (optional)
            </label>
            <input
              id="contrib-year"
              type="text"
              value={form.year}
              onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
              placeholder="e.g. 1998"
              className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#1f2937] outline-none transition-all duration-300 ease-in-out focus:border-amber-700/50"
            />
          </div>
          <div>
            <label
              htmlFor="contrib-location"
              className="mb-1 block text-sm font-medium text-[#1f2937]"
            >
              Location (optional)
            </label>
            <input
              id="contrib-location"
              type="text"
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g. Golden Computer Arcade"
              className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#1f2937] outline-none transition-all duration-300 ease-in-out focus:border-amber-700/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contrib-image" className="mb-1 block text-sm font-medium text-[#1f2937]">
            Upload image <span className="text-amber-700">*</span>
          </label>
          <input
            id="contrib-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setForm((prev) => ({ ...prev, image: file }))
            }}
            className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#6b7280] file:mr-4 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1 file:text-xs file:font-medium file:text-amber-700"
          />
          {form.image ? (
            <p className="mt-2 text-xs text-[#6b7280]">Selected: {form.image.name}</p>
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
          className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-amber-700/30 bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-[1.01] hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Memory'}
        </button>
      </form>

      {showRecentEntries && entries.length > 0 ? (
        <div className="mt-8 border-t border-[#e5e7eb] pt-6">
          <h3 className="text-sm tracking-widest text-amber-700 uppercase">Recent Contributions</h3>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#fdfaf6] shadow-sm"
              >
                <div className="relative">
                  <img src={entry.image_url} alt={entry.title} className="h-36 w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {entry.year ? (
                    <span className="absolute left-2 top-2 rounded-full bg-[#fdfaf6]/90 px-2 py-0.5 text-[10px] text-amber-700">
                      {entry.year}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1 p-3">
                  <h4 className="text-sm font-semibold text-[#1f2937]">{entry.title}</h4>
                  {entry.location ? (
                    <p className="text-xs text-amber-700">{entry.location}</p>
                  ) : null}
                  {entry.description ? (
                    <p className="text-xs leading-relaxed text-[#6b7280] line-clamp-3">{entry.description}</p>
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
