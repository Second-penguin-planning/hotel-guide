import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useLang } from '../context/LanguageContext'
import Header from '../components/Header'

const PUB_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdUgYZP_qDCSADSbBRLRN8QYZnohkwFfztT1K5m2OJQBFwmn3ysr1OYkFQFbDiqhM9PyR7okk5C03v/pubhtml'
const SHEET_ID = '1ywTeDERoK2cXAqsBOLXI3UzZPdCPHKrTovOg0XqoR58'

const HOTELS = [
  { label: '東横イン大阪梅田東',  gid: '0' },
  { label: '東横イン梅田中津Ⅰ', gid: '372507488' },
]

const LABELS: Record<string, Record<string, string>> = {
  title: { ja: '周辺店舗 一覧表', en: 'Nearby Store List', 'zh-TW': '附近店家列表', ko: '주변 매장 목록', tl: 'Nearby Store List' },
  open:  { ja: 'Google Sheetsで開く', en: 'Open in Google Sheets', 'zh-TW': '在 Google Sheets 開啟', ko: 'Google Sheets에서 열기', tl: 'Open in Google Sheets' },
}

export default function StoreTablePage() {
  const { lang } = useLang()
  const [active, setActive] = useState(0)

  const embedUrl = PUB_BASE + '?widget=true&headers=false'

  const openUrl =
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/view'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header showBack backTo="/" backLabel="ホテル選択" />

      {/* Title bar */}
      <div className="bg-brand-600 bg-hotel-pattern">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-0.5">Toyoko Inn</p>
            <h1 className="text-white text-lg font-bold">{LABELS.title[lang] ?? LABELS.title.ja}</h1>
          </div>
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white border border-white/20 rounded-lg px-3 py-1.5 transition-colors"
          >
            <ExternalLink size={13} />
            {LABELS.open[lang] ?? LABELS.open.ja}
          </a>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      {/* Hotel tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 py-2">
          {HOTELS.map((h, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={
                'px-4 py-2 rounded-lg text-sm font-semibold transition-all ' +
                (active === i
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100')
              }
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded sheet */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-2 py-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            title={HOTELS[active].label + ' 周辺店舗一覧'}
            loading="lazy"
          />
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          データは Google Sheets で管理されています
        </p>
      </div>
    </div>
  )
}
