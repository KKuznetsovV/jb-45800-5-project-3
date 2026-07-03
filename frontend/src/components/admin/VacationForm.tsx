import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import VacationModel from '../../models/VacationModel'
import './VacationForm.css'

interface Props {
  title: string
  initialVacation?: VacationModel
  onSubmit: (fd: FormData) => Promise<void>
}

interface FormState {
  destination: string
  description: string
  startDate: string
  endDate: string
  price: string
}

function toInputDate(dateStr: string): string {
  return new Date(dateStr).toISOString().split('T')[0]
}

function VacationForm({ title, initialVacation, onSubmit }: Props) {
  const isEdit = !!initialVacation

  const [form, setForm] = useState<FormState>({
    destination: initialVacation?.destination ?? '',
    description: initialVacation?.description ?? '',
    startDate:   initialVacation ? toInputDate(initialVacation.startDate) : '',
    endDate:     initialVacation ? toInputDate(initialVacation.endDate) : '',
    price:       initialVacation ? String(initialVacation.price) : '',
  })

  const [image, setImage]     = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(
    initialVacation ? `/uploads/${initialVacation.imageName}` : ''
  )
  const [error, setError]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => {
      const updated = { ...prev, [name]: value }
      // clear end date if it's no longer after the new start date
      if (name === 'startDate' && updated.endDate && updated.endDate <= value) {
        updated.endDate = ''
      }
      return updated
    })
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isEdit && !image) {
      setError('Please select an image.')
      return
    }
    setError('')
    setSubmitting(true)

    const fd = new FormData()
    fd.append('destination', form.destination)
    fd.append('description', form.description)
    fd.append('startDate',   form.startDate)
    fd.append('endDate',     form.endDate)
    fd.append('price',       form.price)
    if (image) fd.append('image', image)

    try {
      await onSubmit(fd)
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data
      setError(typeof msg === 'string' && msg ? msg : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="vacation-form-page">
      <form className="vacation-form" onSubmit={handleSubmit} noValidate>
        <h2>{title}</h2>

        {error && <p className="form-error">{error}</p>}

        <label className="form-label">
          Destination
          <input
            name="destination"
            required
            maxLength={100}
            value={form.destination}
            onChange={handleChange}
          />
        </label>

        <label className="form-label">
          Description
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <div className="form-row">
          <label className="form-label">
            Start Date
            <input type="date" name="startDate" required value={form.startDate} onChange={handleChange} />
          </label>
          <label className="form-label">
            End Date
            <input type="date" name="endDate" required min={form.startDate || undefined} value={form.endDate} onChange={handleChange} />
          </label>
        </div>

        <label className="form-label">
          Price ($)
          <input
            type="number"
            name="price"
            required
            min={0}
            max={10000}
            step={0.01}
            value={form.price}
            onChange={handleChange}
          />
        </label>

        <label className="form-label">
          {isEdit ? 'Replace Image (optional)' : 'Image'}
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFile} />
        </label>

        {preview && (
          <div className="form-image-preview">
            <img
              src={preview}
              alt="preview"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VacationForm
