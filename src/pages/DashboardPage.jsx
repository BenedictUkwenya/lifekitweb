import { useState, useEffect, useCallback, useRef, Fragment, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import {
  Sparkles, LogOut, PlusCircle, Briefcase, Settings,
  ChevronRight, X, Upload, Loader2, CheckCircle2,
  AlertCircle, ImageIcon, Tag, DollarSign, FileText,
  LayoutGrid, Clock, Eye, Pencil, MoreVertical,
  Plus, Trash2, LayoutDashboard, Calendar, ArrowLeftRight,
  TrendingUp, Users, Bell, ChevronDown, Menu,
} from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'

const PRIMARY   = '#89273B'
const API_BASE  = import.meta.env.VITE_API_URL

const api = axios.create({ baseURL: API_BASE })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('provider_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['Accept-Language'] = localStorage.getItem('lifekit_lang') ?? 'en'
  return config
})

function relativeTime(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium text-white transition-all animate-fade-in
            ${t.type === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}
        >
          {t.type === 'error'
            ? <AlertCircle size={16} className="flex-shrink-0" />
            : <CheckCircle2 size={16} className="flex-shrink-0 text-green-400" />}
          {t.message}
        </div>
      ))}
    </div>
  )
}

function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  const { t } = useTranslation()
  const NAV = [
    { id: 'overview',  label: t('dashboard.overview'),    icon: <LayoutDashboard size={18} /> },
    { id: 'services',  label: t('dashboard.myServices'),  icon: <Briefcase size={18} /> },
    { id: 'bookings',  label: t('dashboard.bookings'),    icon: <Calendar size={18} /> },
    { id: 'swaps',     label: t('dashboard.skillSwaps'),  icon: <ArrowLeftRight size={18} /> },
    { id: 'settings',  label: t('dashboard.settings'),    icon: <Settings size={18} /> },
  ]

  const handleTabClick = (id) => {
    setActiveTab(id)
    setMobileOpen(false)
  }

  const sidebarContent = (
    <>
      <Link to="/" className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">LifeKit</span>
      </Link>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${active ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              style={active ? { backgroundColor: PRIMARY } : {}}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">{t('dashboard.portalVersion')}</p>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-gray-100 bg-white flex-shrink-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 min-h-screen bg-white flex flex-col shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}

function ErrorBanner({ msg }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
      {msg}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-100" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="h-4 bg-gray-100 rounded-full w-1/2 mt-1" />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-100 rounded-full w-2/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      </div>
      <div className="h-6 w-16 bg-gray-100 rounded-full" />
    </div>
  )
}

function StatCard({ icon, label, value, tint }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tint }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status, map }) {
  const meta = map[(status || '').toLowerCase()] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600' }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bg} ${meta.text} whitespace-nowrap`}>
      {meta.label}
    </span>
  )
}

function CreateServiceWizard({ onClose, onSuccess, addToast }) {
  const { t } = useTranslation()
  const [step, setStep]               = useState(1)
  const [error, setError]             = useState('')

  const [mainCats, setMainCats]         = useState([])
  const [loadingMain, setLoadingMain]   = useState(true)
  const [selectedMain, setSelectedMain] = useState(null)
  const [requestMode, setRequestMode]   = useState(false)
  const [reqForm, setReqForm]           = useState({ category_name: '', description: '' })
  const [reqLoading, setReqLoading]     = useState(false)

  const [subCats, setSubCats]             = useState([])
  const [loadingSubcats, setLoadingSubcats] = useState(false)
  const [selectedSubIds, setSelectedSubIds] = useState(new Set())
  const [creatingDrafts, setCreatingDrafts] = useState(false)

  const [draftService, setDraftService]   = useState(null)
  const [isStandalone, setIsStandalone]   = useState(false)
  const [title, setTitle]                 = useState('')
  const [description, setDescription]     = useState('')
  const [pricingType, setPricingType]     = useState('fixed')
  const [serviceType, setServiceType]     = useState('Home Service (HS)')
  const [basePrice, setBasePrice]         = useState('')
  const [serviceOptions, setServiceOptions] = useState([{ name: '', price: '' }])
  const [imageFiles, setImageFiles]       = useState([])
  const [saveLabel, setSaveLabel]         = useState('')
  const fileRef = useRef()

  const MAX_IMAGES = 5
  const SERVICE_TYPES = ['Home Service (HS)', 'Outdoor', 'Both']
  const STEP_LABELS   = [t('wizard.stepCategory'), t('wizard.stepSubCategory'), t('wizard.stepDetails')]
  const stepNum = typeof step === 'number' ? step : 3

  const fieldFocus = (e) => { e.target.style.boxShadow = `0 0 0 3px ${PRIMARY}25`; e.target.style.borderColor = PRIMARY }
  const fieldBlur  = (e) => { e.target.style.boxShadow = ''; e.target.style.borderColor = '' }

  useEffect(() => {
    api.get('/home/categories')
      .then(({ data }) => setMainCats(data.categories || []))
      .catch(() => addToast(t('dashboard.failedLoadCategories'), 'error'))
      .finally(() => setLoadingMain(false))
  }, [addToast, t])

  const selectMainCat = async (cat) => {
    setError('')
    setSelectedMain(cat)
    setSelectedSubIds(new Set())
    setStep(2)
    setLoadingSubcats(true)
    try {
      const { data } = await api.get(`/home/categories/children/${cat.id}`)
      setSubCats((data.categories || []).sort((a, b) => a.name.localeCompare(b.name)))
    } catch {
      setError(t('wizard.failedLoadSubcats'))
    } finally {
      setLoadingSubcats(false)
    }
  }

  const submitCategoryRequest = async () => {
    if (!reqForm.category_name.trim()) return setError(t('wizard.categoryNameRequired'))
    setError('')
    setReqLoading(true)
    try {
      await api.post('/services/request-category', reqForm)
      addToast(t('wizard.categoryRequestSuccess'))
      setRequestMode(false)
      setReqForm({ category_name: '', description: '' })
    } catch (err) {
      setError(err.response?.data?.error || t('wizard.failedSubmitRequest'))
    } finally {
      setReqLoading(false)
    }
  }

  const toggleSub = (id) =>
    setSelectedSubIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const createDrafts = async () => {
    if (!selectedSubIds.size) return setError(t('wizard.selectAtLeastOne'))
    setError('')
    setCreatingDrafts(true)
    try {
      const { data } = await api.post('/services', { category_ids: [...selectedSubIds] })
      const svcList = data.services || []
      if (!svcList.length) throw new Error('No services returned from server.')
      const first = svcList[0]
      setDraftService(first)
      setTitle(first.title || '')
      setDescription(first.description || '')
      setPricingType(first.pricing_type || 'fixed')
      setServiceType(first.service_type || 'Home Service (HS)')
      if (first.price) setBasePrice(String(first.price))
      const standalone = !!(selectedMain?.is_standalone || (first.service_options?.length > 0))
      setIsStandalone(standalone)
      if (standalone && first.service_options?.length) {
        setServiceOptions(first.service_options.map(o => ({ name: o.name || '', price: String(o.price ?? 0) })))
      } else if (standalone) {
        setServiceOptions([{ name: '', price: '' }])
      }
      setStep(3)
    } catch (err) {
      if (err.response?.status === 403) {
        setError(t('wizard.planLimitReached'))
      } else {
        setError(err.response?.data?.error || err.message || t('wizard.failedCreateService'))
      }
    } finally {
      setCreatingDrafts(false)
    }
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_IMAGES - imageFiles.length
    const toAdd = files.slice(0, remaining)
    const oversized = toAdd.find(f => f.size > 5 * 1024 * 1024)
    if (oversized) { setError(t('wizard.imageTooLarge')); return }
    setImageFiles(prev => [
      ...prev,
      ...toAdd.map(f => ({ file: f, preview: URL.createObjectURL(f) })),
    ])
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (idx) => {
    setImageFiles(prev => {
      const copy = [...prev]
      URL.revokeObjectURL(copy[idx].preview)
      copy.splice(idx, 1)
      return copy
    })
  }

  const addOption    = () => setServiceOptions(p => [...p, { name: '', price: '' }])
  const removeOption = (i) => setServiceOptions(p => p.filter((_, idx) => idx !== i))
  const updateOption = (i, field, val) =>
    setServiceOptions(p => p.map((o, idx) => idx === i ? { ...o, [field]: val } : o))

  const handleSave = async () => {
    if (!title.trim()) return setError(t('wizard.serviceTitleRequired'))
    if (!isStandalone && basePrice !== '' && isNaN(Number(basePrice))) return setError(t('wizard.invalidPrice'))
    setError('')
    setStep('saving')
    try {
      let imageUrls = []
      if (imageFiles.length > 0) {
        setSaveLabel(t('wizard.uploadingImage'))
        for (let i = 0; i < imageFiles.length; i++) {
          const fd = new FormData()
          fd.append('file', imageFiles[i].file)
          const { data: up } = await api.post('/storage/upload/services', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          imageUrls.push(up.url)
        }
      }
      setSaveLabel(t('wizard.publishingService'))
      let finalPrice = 0
      if (isStandalone) {
        const prices = serviceOptions.map(o => parseFloat(o.price) || 0).filter(p => p > 0)
        finalPrice = prices.length ? Math.min(...prices) : 0
      } else {
        finalPrice = parseFloat(basePrice) || 0
      }
      await api.put(`/services/${draftService.id}`, {
        title:           title.trim(),
        description:     description.trim(),
        price:           finalPrice,
        pricing_type:    pricingType,
        service_type:    serviceType,
        status:          'active',
        service_options: isStandalone
          ? serviceOptions.map(o => ({ name: o.name, price: parseFloat(o.price) || 0 }))
          : [],
        ...(imageUrls.length ? { image_urls: imageUrls } : {}),
      })
      setStep('done')
      setTimeout(() => { onSuccess(); onClose() }, 900)
    } catch (err) {
      setError(err.response?.data?.error || err.message || t('wizard.failedSaveService'))
      setStep(3)
    }
  }

  const canClose = step !== 'saving'

  const wizardHeader = () => {
    if (step === 1 && !requestMode) return t('wizard.headerSelectCategory')
    if (step === 1 && requestMode)  return t('wizard.headerRequestCategory')
    if (step === 2) return t('wizard.headerSubCategories', { name: selectedMain?.name })
    if (step === 3) return t('wizard.headerDetails')
    if (step === 'saving') return t('wizard.headerSaving')
    return t('wizard.headerDone')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={canClose ? onClose : undefined} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{wizardHeader()}</h2>
            {canClose && (
              <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => {
              const n    = i + 1
              const done = (n < stepNum) || step === 'done'
              const active = n === stepNum && step !== 'done'
              return (
                <Fragment key={n}>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0
                        ${done ? 'bg-green-500 text-white' : active ? 'text-white' : 'bg-gray-100 text-gray-400'}`}
                      style={active ? { backgroundColor: PRIMARY } : {}}
                    >
                      {done ? '✓' : n}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${active ? 'text-gray-800' : 'text-gray-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px bg-gray-100 min-w-[8px]" />}
                </Fragment>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {(step === 'saving' || step === 'done') && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              {step === 'saving'
                ? <><Loader2 size={36} className="animate-spin" style={{ color: PRIMARY }} /><p className="text-sm text-gray-500 font-medium">{saveLabel || t('wizard.savingLabel')}</p></>
                : <><CheckCircle2 size={40} className="text-green-500" /><p className="text-base font-semibold text-gray-800">{t('wizard.doneLabel')}</p></>}
            </div>
          )}

          {step === 1 && !requestMode && (
            <div className="p-5 flex flex-col gap-3">
              {loadingMain ? (
                <div className="flex items-center justify-center py-14">
                  <Loader2 size={26} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    {mainCats.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectMainCat(cat)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 hover:shadow-md hover:border-transparent text-left transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}12` }}>
                          <Tag size={15} style={{ color: PRIMARY }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-800 leading-snug flex-1">{cat.name}</span>
                        <ChevronRight size={13} className="text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                  {error && <ErrorBanner msg={error} />}
                  <button
                    onClick={() => { setRequestMode(true); setError('') }}
                    className="mt-1 w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    {t('wizard.cantFind')}
                  </button>
                </>
              )}
            </div>
          )}

          {step === 1 && requestMode && (
            <div className="p-5 flex flex-col gap-4">
              <button
                onClick={() => { setRequestMode(false); setError('') }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors self-start"
              >
                {t('wizard.backToCategories')}
              </button>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('wizard.categoryNameLabel')}</label>
                <input
                  type="text"
                  placeholder={t('wizard.categoryNamePlaceholder')}
                  value={reqForm.category_name}
                  onChange={e => setReqForm(p => ({ ...p, category_name: e.target.value }))}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('wizard.descriptionLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('wizard.descriptionPlaceholder')}
                  value={reqForm.description}
                  onChange={e => setReqForm(p => ({ ...p, description: e.target.value }))}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none resize-none transition"
                />
              </div>
              {error && <ErrorBanner msg={error} />}
              <button
                onClick={submitCategoryRequest}
                disabled={reqLoading}
                className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-60 transition-all"
                style={{ backgroundColor: PRIMARY }}
              >
                {reqLoading && <Loader2 size={15} className="animate-spin" />}
                {t('wizard.submitRequest')}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-5 flex flex-col gap-4">
              <button
                onClick={() => { setStep(1); setError('') }}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors self-start"
              >
                {t('wizard.back')}
              </button>
              {loadingSubcats ? (
                <div className="flex justify-center py-10"><Loader2 size={26} className="animate-spin text-gray-400" /></div>
              ) : subCats.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">{t('wizard.noSubCategories')}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">{t('wizard.selectAllApply')}</p>
                  {subCats.map((c) => {
                    const checked = selectedSubIds.has(c.id)
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggleSub(c.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all
                          ${checked ? 'shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                        style={checked ? { backgroundColor: `${PRIMARY}10`, borderColor: `${PRIMARY}35` } : {}}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? 'border-transparent' : 'border-gray-300'}`}
                          style={checked ? { backgroundColor: PRIMARY } : {}}
                        >
                          {checked && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{c.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              {error && <ErrorBanner msg={error} />}
              <button
                onClick={createDrafts}
                disabled={creatingDrafts || selectedSubIds.size === 0}
                className="w-full py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                style={{ backgroundColor: PRIMARY }}
              >
                {creatingDrafts
                  ? <><Loader2 size={16} className="animate-spin" /> {t('wizard.creating')}</>
                  : t('wizard.nextSelected', { count: selectedSubIds.size })}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('wizard.serviceTitleLabel')}</label>
                <input
                  type="text"
                  placeholder={t('wizard.serviceTitlePlaceholder')}
                  value={title}
                  onChange={e => { setTitle(e.target.value); setError('') }}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('wizard.pricingTypeLabel')}</label>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  {['fixed', 'hourly'].map(pt => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setPricingType(pt)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${pricingType === pt ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      style={pricingType === pt ? { color: PRIMARY } : {}}
                    >
                      {pt === 'fixed' ? t('wizard.fixedPrice') : t('wizard.hourlyRate')}
                    </button>
                  ))}
                </div>
              </div>

              {isStandalone && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">{t('wizard.serviceOptionsLabel')}</label>
                    <button type="button" onClick={addOption} className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color: PRIMARY }}>
                      <Plus size={13} /> {t('wizard.addOption')}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {serviceOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={t('wizard.optionNamePlaceholder')}
                          value={opt.name}
                          onChange={e => updateOption(i, 'name', e.target.value)}
                          onFocus={fieldFocus} onBlur={fieldBlur}
                          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 outline-none transition"
                        />
                        <div className="relative w-28 flex-shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
                            type="number" min="0" placeholder="0.00"
                            value={opt.price}
                            onChange={e => updateOption(i, 'price', e.target.value)}
                            onFocus={fieldFocus} onBlur={fieldBlur}
                            className={`w-full border border-gray-200 rounded-xl pl-7 text-sm bg-gray-50 outline-none transition py-2.5 ${pricingType === 'hourly' ? 'pr-9' : 'pr-3'}`}
                          />
                          {pricingType === 'hourly' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">/hr</span>}
                        </div>
                        {serviceOptions.length > 1 && (
                          <button type="button" onClick={() => removeOption(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isStandalone && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t('wizard.basePriceLabel')} {pricingType === 'hourly' && <span className="text-gray-400 font-normal text-xs">{t('wizard.basePricePerHour')}</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input
                      type="number" min="0" step="0.01"
                      placeholder={pricingType === 'fixed' ? t('wizard.flatFeePlaceholder') : t('wizard.ratePlaceholder')}
                      value={basePrice}
                      onChange={e => { setBasePrice(e.target.value); setError('') }}
                      onFocus={fieldFocus} onBlur={fieldBlur}
                      className={`w-full border border-gray-200 rounded-xl pl-8 py-3 text-sm bg-gray-50 outline-none transition ${pricingType === 'hourly' ? 'pr-12' : 'pr-4'}`}
                    />
                    {pricingType === 'hourly' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/hr</span>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('wizard.descriptionFieldLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('wizard.descriptionFieldPlaceholder')}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  onFocus={fieldFocus} onBlur={fieldBlur}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none resize-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('wizard.serviceTypeLabel')}</label>
                <div className="flex gap-2 flex-wrap">
                  {SERVICE_TYPES.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setServiceType(st)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${serviceType === st ? 'border-transparent text-white' : 'border-gray-100 text-gray-600 hover:border-gray-200 bg-white'}`}
                      style={serviceType === st ? { backgroundColor: PRIMARY } : {}}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {t('wizard.serviceImageLabel')}
                  <span className="text-gray-400 font-normal text-xs ml-1">({imageFiles.length}/{MAX_IMAGES})</span>
                </label>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

                <div className="flex flex-wrap gap-2.5">
                  {imageFiles.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                      <img src={img.preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {imageFiles.length < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all flex-shrink-0"
                    >
                      <Plus size={18} />
                      <span className="text-[10px] font-medium">{t('wizard.addPhoto')}</span>
                    </button>
                  )}
                </div>

                {imageFiles.length === 0 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 w-full border-2 border-dashed border-gray-200 rounded-2xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    <Upload size={20} />
                    <span className="text-sm font-medium">{t('wizard.clickToUpload')}</span>
                    <span className="text-xs">{t('wizard.uploadHintMulti')}</span>
                  </button>
                )}
              </div>

              {error && <ErrorBanner msg={error} />}

              <div className="flex gap-3 pb-1">
                <button
                  type="button"
                  onClick={() => { setStep(2); setError('') }}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  {t('wizard.backBtn')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {t('wizard.publishService')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service }) {
  const { t } = useTranslation()

  const statusMeta = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active':   return { label: t('dashboard.statusActive'),   bg: 'bg-green-100',  text: 'text-green-700' }
      case 'pending':  return { label: t('dashboard.statusPending'),  bg: 'bg-yellow-100', text: 'text-yellow-700' }
      case 'draft':    return { label: t('dashboard.statusDraft'),    bg: 'bg-gray-100',   text: 'text-gray-600' }
      case 'inactive': return { label: t('dashboard.statusInactive'), bg: 'bg-red-100',    text: 'text-red-600' }
      default:         return { label: status,                        bg: 'bg-gray-100',   text: 'text-gray-600' }
    }
  }

  const { label, bg, text } = statusMeta(service.status)
  const categoryName = service.service_categories?.name || '—'
  const thumb = service.image_urls?.[0]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="aspect-video bg-gray-50 relative overflow-hidden">
        {thumb ? (
          <img src={thumb} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={28} className="text-gray-300" />
          </div>
        )}
        <span className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
          {label}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{categoryName}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{service.title || 'Untitled Service'}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-extrabold" style={{ color: PRIMARY }}>
            {service.price ? `$${Number(service.price).toFixed(2)}` : t('dashboard.freeTbd')}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={12} />
            <span className="text-xs">{new Date(service.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onCreateClick }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: `${PRIMARY}12` }}>
        <Briefcase size={32} style={{ color: PRIMARY }} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.emptyTitle')}</h3>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">{t('dashboard.emptySubtitle')}</p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
        style={{ backgroundColor: PRIMARY }}
      >
        <PlusCircle size={17} />
        {t('dashboard.emptyButton')}
      </button>
    </div>
  )
}

function OverviewTab({ services, bookings, incomingSwaps, outgoingSwaps, loading, setActiveTab }) {
  const { t } = useTranslation()
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('provider_user') || '{}') } catch { return {} }
  }, [])
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('dashboard.provider')

  const activeCount = services.filter(s => (s.status || '').toLowerCase() === 'active').length
  const totalBookings = bookings.length
  const completedSwaps = [...incomingSwaps, ...outgoingSwaps].filter(
    s => (s.status || '').toLowerCase() === 'accepted' || (s.status || '').toLowerCase() === 'completed'
  ).length
  const pendingRequests =
    incomingSwaps.filter(s => (s.status || '').toLowerCase() === 'pending').length +
    bookings.filter(b => (b.status || '').toLowerCase() === 'pending').length

  const pendingIncoming = incomingSwaps.filter(s => (s.status || '').toLowerCase() === 'pending').length

  const recentActivity = useMemo(() => {
    const items = []
    bookings.forEach(b => items.push({
      type: 'booking',
      title: b.service?.title || b.service_title || t('dashboard.booking'),
      date: b.created_at || b.booking_date,
      status: b.status,
    }))
    ;[...incomingSwaps, ...outgoingSwaps].forEach(s => items.push({
      type: 'swap',
      title: s.offered_service?.title || s.service?.title || t('dashboard.skillSwap'),
      date: s.created_at,
      status: s.status,
    }))
    items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    return items.slice(0, 8)
  }, [bookings, incomingSwaps, outgoingSwaps, t])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse rounded-2xl bg-gray-100 h-28" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 h-24" />
          ))}
        </div>
        <div className="animate-pulse rounded-2xl bg-gray-100 h-36" />
        <div className="animate-pulse bg-white rounded-2xl border border-gray-100 p-5 h-48" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}0D 0%, ${PRIMARY}05 100%)` }}
      >
        <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
          {t('dashboard.welcomeBack', { name: displayName })}
        </h1>
        <p className="text-sm text-gray-600 mt-1.5 max-w-lg leading-relaxed">
          {t('dashboard.welcomeSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase size={20} style={{ color: PRIMARY }} />}
          label={t('dashboard.activeServices')}
          value={activeCount}
          tint={`${PRIMARY}12`}
        />
        <StatCard
          icon={<Calendar size={20} className="text-blue-600" />}
          label={t('dashboard.totalBookings')}
          value={totalBookings}
          tint="#EFF6FF"
        />
        <StatCard
          icon={<ArrowLeftRight size={20} className="text-emerald-600" />}
          label={t('dashboard.skillSwapsCompleted')}
          value={completedSwaps}
          tint="#ECFDF5"
        />
        <StatCard
          icon={<Clock size={20} className="text-amber-600" />}
          label={t('dashboard.pendingRequests')}
          value={pendingRequests}
          tint="#FFFBEB"
        />
      </div>

      <div
        className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #6B1D2E 100%)` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4" style={{ backgroundColor: '#fff' }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <ArrowLeftRight size={22} />
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">{t('dashboard.spotlightLabel')}</span>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold mb-1">
            {t('dashboard.spotlightHeading')}
          </h2>
          {pendingIncoming > 0 ? (
            <p className="text-sm opacity-90 mb-4">
              {t('dashboard.spotlightDemand', { count: pendingIncoming })}
            </p>
          ) : (
            <p className="text-sm opacity-90 mb-4">
              {t('dashboard.spotlightEmpty')}
            </p>
          )}
          <button
            onClick={() => setActiveTab('swaps')}
            className="inline-flex items-center gap-2 bg-white text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            style={{ color: PRIMARY }}
          >
            {t('dashboard.viewSwapProposals')}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{t('dashboard.recentActivity')}</h3>
        </div>
        {recentActivity.length === 0 ? (
          <div className="py-14 text-center">
            <Clock size={28} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 font-medium">{t('dashboard.noActivity')}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.type === 'booking' ? 'bg-blue-50' : 'bg-emerald-50'
                }`}>
                  {item.type === 'booking'
                    ? <Calendar size={16} className="text-blue-600" />
                    : <ArrowLeftRight size={16} className="text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{relativeTime(item.date)}</p>
                </div>
                {item.status && (
                  <span className="text-xs font-medium text-gray-500 capitalize">{item.status}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingsTab({ bookings, loading }) {
  const { t } = useTranslation()

  const statusMap = {
    pending:   { label: t('dashboard.statusPending'),   bg: 'bg-yellow-100', text: 'text-yellow-700' },
    confirmed: { label: t('dashboard.statusConfirmed'), bg: 'bg-blue-100',   text: 'text-blue-700' },
    completed: { label: t('dashboard.statusCompleted'), bg: 'bg-green-100',  text: 'text-green-700' },
    cancelled: { label: t('dashboard.statusCancelled'), bg: 'bg-red-100',    text: 'text-red-600' },
    disputed:  { label: t('dashboard.statusDisputed'),  bg: 'bg-orange-100', text: 'text-orange-700' },
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">{t('dashboard.bookings')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t('dashboard.bookingsCount', { count: bookings.length })}
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-6">
            <Calendar size={32} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{t('dashboard.bookingsEmptyTitle')}</h3>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed">{t('dashboard.bookingsEmptySubtitle')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking, idx) => (
            <div key={booking.id || idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 truncate">
                      {booking.service?.title || booking.service_title || t('dashboard.untitledService')}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {booking.client?.full_name || booking.client_name || t('dashboard.unknownClient')}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      {booking.booking_date && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </span>
                      )}
                      {booking.price != null && (
                        <span className="text-xs font-bold" style={{ color: PRIMARY }}>
                          ${Number(booking.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <StatusBadge status={booking.status} map={statusMap} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SkillSwapsTab({ incomingSwaps, outgoingSwaps, loading }) {
  const { t } = useTranslation()

  const swapStatusMap = {
    pending:  { label: t('dashboard.statusPending'),  bg: 'bg-yellow-100', text: 'text-yellow-700' },
    accepted: { label: t('dashboard.statusAccepted'), bg: 'bg-green-100',  text: 'text-green-700' },
    declined: { label: t('dashboard.statusDeclined'), bg: 'bg-red-100',    text: 'text-red-600' },
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    )
  }

  const SwapList = ({ swaps, emptyMsg, isIncoming }) => (
    swaps.length === 0 ? (
      <div className="py-10 text-center">
        <ArrowLeftRight size={24} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-400">{emptyMsg}</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {swaps.map((swap, idx) => (
          <div key={swap.id || idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}12` }}>
                  <ArrowLeftRight size={18} style={{ color: PRIMARY }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {isIncoming
                      ? (swap.proposer?.full_name || swap.proposer_name || t('dashboard.unknownUser'))
                      : (swap.target?.full_name || swap.target_name || t('dashboard.unknownUser'))}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {swap.offered_service?.title || swap.service?.title || t('dashboard.serviceOffered')}
                  </p>
                  {swap.created_at && (
                    <span className="text-xs text-gray-400 mt-1.5 inline-block">
                      {relativeTime(swap.created_at)}
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={swap.status} map={swapStatusMap} />
            </div>
          </div>
        ))}
      </div>
    )
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">{t('dashboard.skillSwaps')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t('dashboard.swapsSubtitle')}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIMARY }} />
            {t('dashboard.incomingProposals')}
            {incomingSwaps.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: PRIMARY }}>
                {incomingSwaps.length}
              </span>
            )}
          </h2>
          <SwapList swaps={incomingSwaps} emptyMsg={t('dashboard.noIncomingSwaps')} isIncoming />
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            {t('dashboard.myProposals')}
            {outgoingSwaps.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                {outgoingSwaps.length}
              </span>
            )}
          </h2>
          <SwapList swaps={outgoingSwaps} emptyMsg={t('dashboard.noOutgoingSwaps')} isIncoming={false} />
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  const { t } = useTranslation()
  const [emailNotifs, setEmailNotifs] = useState(true)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">{t('dashboard.accountSettings')}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t('dashboard.settingsSubtitle')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Bell size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{t('dashboard.emailNotifications')}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('dashboard.emailNotificationsDesc')}</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${emailNotifs ? '' : 'bg-gray-200'}`}
              style={emailNotifs ? { backgroundColor: PRIMARY } : {}}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${emailNotifs ? 'translate-x-5.5 left-0' : 'translate-x-0.5 left-0'}`}
                style={{ transform: emailNotifs ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 px-5 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <Settings size={18} className="text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{t('dashboard.comingSoonSettings')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [activeTab, setActiveTab]             = useState('overview')
  const [mobileOpen, setMobileOpen]           = useState(false)
  const [user, setUser]                       = useState(null)
  const [services, setServices]               = useState([])
  const [bookings, setBookings]               = useState([])
  const [incomingSwaps, setIncomingSwaps]      = useState([])
  const [outgoingSwaps, setOutgoingSwaps]      = useState([])
  const [loadingServices, setLoadingServices]  = useState(true)
  const [loadingBookings, setLoadingBookings]  = useState(true)
  const [loadingSwaps, setLoadingSwaps]        = useState(true)
  const [showModal, setShowModal]             = useState(false)
  const [toasts, setToasts]                   = useState([])

  const tabDataLoaded = useRef({ bookings: false, swaps: false })

  useEffect(() => {
    const token = localStorage.getItem('provider_token')
    const stored = localStorage.getItem('provider_user')
    if (!token) { navigate('/login'); return }
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem('provider_user')
      }
    }
  }, [navigate])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 4000)
  }, [])

  const fetchServices = useCallback(async () => {
    setLoadingServices(true)
    try {
      const { data } = await api.get('/services/my-services')
      setServices(data.services || [])
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        addToast(t('dashboard.failedLoadServices'), 'error')
      }
    } finally {
      setLoadingServices(false)
    }
  }, [navigate, addToast, t])

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true)
    try {
      const { data } = await api.get('/bookings/provider')
      setBookings(data.bookings || [])
    } catch (err) {
      if (err.response?.status !== 401) {
        addToast(t('dashboard.failedLoadBookings'), 'error')
      }
    } finally {
      setLoadingBookings(false)
    }
  }, [addToast, t])

  const fetchSwaps = useCallback(async () => {
    setLoadingSwaps(true)
    try {
      const [inc, out] = await Promise.all([
        api.get('/swap-requests/incoming'),
        api.get('/swap-requests/outgoing'),
      ])
      setIncomingSwaps(inc.data.swaps || [])
      setOutgoingSwaps(out.data.swaps || [])
    } catch (err) {
      if (err.response?.status !== 401) {
        addToast(t('dashboard.failedLoadSwaps'), 'error')
      }
    } finally {
      setLoadingSwaps(false)
    }
  }, [addToast, t])

  useEffect(() => {
    fetchServices()
    fetchBookings()
    fetchSwaps()
  }, [fetchServices, fetchBookings, fetchSwaps])

  useEffect(() => {
    if (activeTab === 'bookings' && !tabDataLoaded.current.bookings) {
      tabDataLoaded.current.bookings = true
      fetchBookings()
    }
    if (activeTab === 'swaps' && !tabDataLoaded.current.swaps) {
      tabDataLoaded.current.swaps = true
      fetchSwaps()
    }
  }, [activeTab, fetchBookings, fetchSwaps])

  const handleLogout = () => {
    localStorage.removeItem('provider_token')
    localStorage.removeItem('provider_user')
    navigate('/login')
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('dashboard.provider')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white uppercase tracking-wider" style={{ backgroundColor: PRIMARY }}>
                  {t('dashboard.proProvider')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t('dashboard.signOut')}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-6 py-6 md:py-7 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              services={services}
              bookings={bookings}
              incomingSwaps={incomingSwaps}
              outgoingSwaps={outgoingSwaps}
              loading={loadingServices || loadingBookings || loadingSwaps}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'services' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">{t('dashboard.myServices')}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t('dashboard.servicesCount_other', { count: services.length })}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">{t('dashboard.newService')}</span>
                  <span className="sm:hidden">{t('dashboard.newServiceShort')}</span>
                </button>
              </div>

              {loadingServices ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : services.length === 0 ? (
                <EmptyState onCreateClick={() => setShowModal(true)} />
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'bookings' && (
            <BookingsTab bookings={bookings} loading={loadingBookings} />
          )}

          {activeTab === 'swaps' && (
            <SkillSwapsTab
              incomingSwaps={incomingSwaps}
              outgoingSwaps={outgoingSwaps}
              loading={loadingSwaps}
            />
          )}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {showModal && (
        <CreateServiceWizard
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            fetchServices()
            addToast(t('dashboard.servicePublished'))
          }}
          addToast={addToast}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  )
}
