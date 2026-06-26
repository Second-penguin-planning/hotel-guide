import type { Hotel } from '../types'

export const hotels: Hotel[] = [
  {
    id: 'toyoko-umeda-east',
    name: {
      en: 'Toyoko Inn Osaka Umeda Higashi',
      ja: '東横イン大阪梅田東',
      'zh-TW': '東橫INN大阪梅田東',
      ko: '토요코인 오사카 우메다 동',
      tl: 'Toyoko Inn Osaka Umeda Higashi',
    },
    address: {
      en: '2-3-15 Nakatsu, Kita-ku, Osaka',
      ja: '大阪府大阪市北区中津2-3-15',
      'zh-TW': '大阪府大阪市北區中津2-3-15',
      ko: '오사카부 오사카시 기타구 나카쓰 2-3-15',
      tl: '2-3-15 Nakatsu, Kita-ku, Osaka',
    },
    phone: '06-6374-1045',
    lat: 34.7075,
    lng: 135.4960,
    imageUrl: '',
  },
  {
    id: 'toyoko-umeda-nakatsu',
    name: {
      en: 'Toyoko Inn Umeda Nakatsu I',
      ja: '東横イン梅田中津Ⅰ',
      'zh-TW': '東橫INN梅田中津Ⅰ',
      ko: '토요코인 우메다 나카쓰 Ⅰ',
      tl: 'Toyoko Inn Umeda Nakatsu I',
    },
    address: {
      en: '2-7-23 Nakatsu, Kita-ku, Osaka',
      ja: '大阪府大阪市北区中津2-7-23',
      'zh-TW': '大阪府大阪市北區中津2-7-23',
      ko: '오사카부 오사카시 기타구 나카쓰 2-7-23',
      tl: '2-7-23 Nakatsu, Kita-ku, Osaka',
    },
    phone: '06-6374-1045',
    lat: 34.7090,
    lng: 135.4965,
    imageUrl: '',
  },
]
