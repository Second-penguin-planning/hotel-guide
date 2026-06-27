"""
Overture Maps → hotel-guide stores.ts generator
梅田・中津エリア (約1.5km 圏内) の店舗データを取得して TypeScript に変換する

Usage:
    python scripts/generate_stores.py
"""

import subprocess, sys, json, re, math, io
from pathlib import Path

# Windows コンソールの文字化け対策
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
from collections import defaultdict

# ── ホテル座標 ──────────────────────────────────────────────
HOTELS = {
    "toyoko-umeda-east":    {"lat": 34.7033, "lng": 135.5021, "name": "東横イン大阪梅田東"},
    "toyoko-umeda-nakatsu": {"lat": 34.7089, "lng": 135.4977, "name": "東横イン梅田中津Ⅰ"},
}

# 梅田・中津を含む bounding box (西,南,東,北)
BBOX = "135.482,34.695,135.515,34.718"

# ── Overture カテゴリ → アプリ categoryId マッピング ────────
CATEGORY_MAP = {
    # restaurant
    "restaurant": "restaurant",
    "sushi_restaurant": "restaurant",
    "ramen_restaurant": "restaurant",
    "izakaya": "restaurant",
    "japanese_restaurant": "restaurant",
    "korean_restaurant": "restaurant",
    "chinese_restaurant": "restaurant",
    "italian_restaurant": "restaurant",
    "french_restaurant": "restaurant",
    "american_restaurant": "restaurant",
    "thai_restaurant": "restaurant",
    "indian_restaurant": "restaurant",
    "vietnamese_restaurant": "restaurant",
    "fast_food_restaurant": "restaurant",
    "burger_restaurant": "restaurant",
    "pizza_restaurant": "restaurant",
    "noodle_restaurant": "restaurant",
    "barbecue_restaurant": "restaurant",
    "seafood_restaurant": "restaurant",
    "teppanyaki_restaurant": "restaurant",
    "tempura_restaurant": "restaurant",
    "udon_restaurant": "restaurant",
    "soba_restaurant": "restaurant",
    "yakitori_restaurant": "restaurant",
    "shabu_shabu_restaurant": "restaurant",
    "okonomiyaki_restaurant": "restaurant",
    "curry_restaurant": "restaurant",
    "gyoza_restaurant": "restaurant",
    "tonkatsu_restaurant": "restaurant",
    "yakiniku_restaurant": "restaurant",
    "hot_pot_restaurant": "restaurant",
    "takoyaki_restaurant": "restaurant",
    # cafe
    "coffee_shop": "cafe",
    "cafe": "cafe",
    "tea_house": "cafe",
    "bakery": "cafe",
    # convenience
    "convenience_store": "convenience",
    # drugstore
    "pharmacy": "drugstore",
    "drug_store": "drugstore",
    # atm
    "atm": "atm",
    # hospital
    "hospital": "hospital",
    "clinic": "hospital",
    "dentist": "hospital",
    # shopping
    "shopping_mall": "shopping",
    "department_store": "shopping",
    "clothing_store": "shopping",
    "electronics_store": "shopping",
    "supermarket": "shopping",
    "grocery_store": "shopping",
    # laundry
    "laundry": "laundry",
    "laundromat": "laundry",
    # tourist
    "tourist_attraction": "tourist",
    "museum": "tourist",
    "art_gallery": "tourist",
    "historic_site": "tourist",
    "amusement_park": "tourist",
    "park": "tourist",
    "observation_deck": "tourist",
}

# ── 目標件数 ───────────────────────────────────────────────
TARGET = {
    "restaurant":  50,
    "cafe":         5,
    "convenience":  5,
    "drugstore":    5,
    "atm":          5,
    "hospital":     5,
    "shopping":     5,
    "laundry":      5,
    "tourist":      5,
}
# taxi は Overture に少ないので手動追加
TAXI_STORES = [
    {"id":"daiwa-taxi","name_ja":"大和自動車交通","name_en":"Daiwa Taxi","lat":34.7040,"lng":135.4990,"walk_e":8,"walk_n":7},
    {"id":"mk-taxi","name_ja":"MKタクシー 梅田","name_en":"MK Taxi Umeda","lat":34.7020,"lng":135.5010,"walk_e":10,"walk_n":12},
    {"id":"kintetsu-taxi","name_ja":"近鉄タクシー 梅田","name_en":"Kintetsu Taxi Umeda","lat":34.7035,"lng":135.5000,"walk_e":6,"walk_n":9},
    {"id":"osaka-taxi","name_ja":"大阪タクシー","name_en":"Osaka Taxi","lat":34.7060,"lng":135.4985,"walk_e":5,"walk_n":4},
    {"id":"yasaka-taxi","name_ja":"弥栄自動車 梅田","name_en":"Yasaka Taxi Umeda","lat":34.7015,"lng":135.4995,"walk_e":12,"walk_n":14},
]


def walk_minutes(lat1, lng1, lat2, lng2):
    """直線距離から徒歩分数を概算 (80m/min)"""
    R = 6371000
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = math.sin(d_lat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lng/2)**2
    dist = R * 2 * math.asin(math.sqrt(a))
    minutes = round(dist / 80)
    return max(1, minutes)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text).strip('-')
    return text[:50]


def fetch_overture(geojson_path: Path):
    print("Overture Maps からデータ取得中...")
    import os
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PYTHONIOENCODING"] = "utf-8"
    cmd = [
        sys.executable, "-X", "utf8", "-m", "overturemaps", "download",
        f"--bbox={BBOX}",
        "-f", "geojson",
        "--type=place",
        "-o", str(geojson_path),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", env=env)
    if result.returncode != 0:
        print("STDERR:", result.stderr[-2000:])
        sys.exit(1)
    print(f"取得完了: {geojson_path}")


def parse_name(props: dict) -> tuple[str, str]:
    """(ja_name, en_name) を返す"""
    names = props.get("names", {})
    primary = names.get("primary", "")
    common = names.get("common", [])
    ja = primary
    en = primary
    for entry in (common if isinstance(common, list) else []):
        lang = entry.get("language", "")
        val  = entry.get("value", "")
        if lang == "ja" and val: ja = val
        if lang == "en" and val: en = val
    if not en: en = ja
    if not ja: ja = en
    return ja, en


def parse_address(props: dict) -> tuple[str, str]:
    addrs = props.get("addresses", [])
    if not addrs:
        return "", ""
    a = addrs[0] if isinstance(addrs, list) else addrs
    freeform = a.get("freeform", "")
    locality  = a.get("locality", "")
    country   = a.get("country", "")
    ja = freeform or locality
    en = freeform or f"{locality}, {country}".strip(", ")
    return ja, en


def parse_phone(props: dict) -> str:
    phones = props.get("phones", [])
    if not phones:
        return ""
    p = phones[0] if isinstance(phones, list) else phones
    return p.get("number", "") if isinstance(p, dict) else str(p)


def parse_website(props: dict) -> str:
    sites = props.get("websites", [])
    if not sites:
        return ""
    s = sites[0] if isinstance(sites, list) else sites
    return s.get("value", "") if isinstance(s, dict) else str(s)


def parse_category(props: dict) -> str | None:
    cats = props.get("categories", {})
    primary = cats.get("primary", "") if isinstance(cats, dict) else ""
    return CATEGORY_MAP.get(primary)


# 梅田・中津エリアに実在しないと思われる名称キーワード（他都市・遠方スポット）
EXCLUDE_KEYWORDS = [
    '神戸', '京都', '奈良', '広島', '東京', '名古屋', '福岡', '札幌', '沖縄',
    '横浜', '鎌倉', '箱根', '浅草', '新宿', '渋谷', '上野', '銀座',
    '難波', 'なんば', '心斎橋', '天王寺', '新世界', '通天閣',  # 梅田から遠い大阪市内
    '異人館', '有馬温泉', '六甲', 'USJ', 'ユニバーサル',
    '伊勢', '奥飛騨', '白川郷', '富士', '日光',
]

def build_store_entry(feat: dict, app_cat: str, idx: int) -> dict | None:
    props = feat.get("properties", {})
    geom  = feat.get("geometry", {})
    coords = geom.get("coordinates", [])
    if not coords or len(coords) < 2:
        return None
    lng, lat = coords[0], coords[1]

    ja_name, en_name = parse_name(props)
    if not ja_name:
        return None

    # 他都市・遠方スポット名を含む場合は除外
    full_name = ja_name + en_name
    if any(kw in full_name for kw in EXCLUDE_KEYWORDS):
        return None

    ja_addr, en_addr = parse_address(props)
    phone   = parse_phone(props)
    website = parse_website(props)

    # 徒歩分数
    walk = {}
    for hid, hinfo in HOTELS.items():
        walk[hid] = walk_minutes(hinfo["lat"], hinfo["lng"], lat, lng)

    # 20分超は除外
    if all(v > 20 for v in walk.values()):
        return None

    store_id = slugify(ja_name) + f"-{idx}"

    return {
        "id": store_id,
        "categoryId": app_cat,
        "ja_name": ja_name,
        "en_name": en_name,
        "ja_addr": ja_addr,
        "en_addr": en_addr,
        "phone": phone,
        "website": website,
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "walk": walk,
        "gmaps": f"https://maps.google.com/?q={ja_name}+大阪",
    }


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def render_store_ts(s: dict, sponsored=False, recommended=False) -> str:
    walk_str = ", ".join(f"'{k}': {v}" for k, v in s["walk"].items())
    phone_str = f"phone: '{ts_escape(s['phone'])}', " if s["phone"] else ""
    web_str   = f"website: '{ts_escape(s['website'])}', " if s["website"] else ""
    gmaps_str = f"googleMapUrl: '{ts_escape(s['gmaps'])}', " if s.get("gmaps") else ""

    return (
        f"  {{\n"
        f"    id: '{s['id']}',\n"
        f"    hotelIds: ['toyoko-umeda-east', 'toyoko-umeda-nakatsu'],\n"
        f"    categoryId: '{s['categoryId']}',\n"
        f"    name: {{ en: '{ts_escape(s['en_name'])}', ja: '{ts_escape(s['ja_name'])}', 'zh-TW': '{ts_escape(s['ja_name'])}', ko: '{ts_escape(s['en_name'])}', tl: '{ts_escape(s['en_name'])}' }},\n"
        f"    {phone_str}address: {{ en: '{ts_escape(s['en_addr'])}', ja: '{ts_escape(s['ja_addr'])}', 'zh-TW': '{ts_escape(s['ja_addr'])}', ko: '{ts_escape(s['en_addr'])}', tl: '{ts_escape(s['en_addr'])}' }},\n"
        f"    lat: {s['lat']}, lng: {s['lng']},\n"
        f"    walkMinutes: {{ {walk_str} }},\n"
        f"    hours: '', closedDays: {{ en: 'None', ja: 'なし', 'zh-TW': '無', ko: '없음', tl: 'Wala' }},\n"
        f"    priceRange: '¥¥', languages: [],\n"
        f"    halal: false, vegetarian: false,\n"
        f"    sponsored: {str(sponsored).lower()}, recommended: {str(recommended).lower()},\n"
        f"    photos: [], {gmaps_str}{web_str}\n"
        f"    notes: {{ en: '', ja: '', 'zh-TW': '', ko: '', tl: '' }}, active: true\n"
        f"  }}"
    )


def render_taxi_ts(t: dict) -> str:
    tid      = t['id']
    name_en  = t['name_en']
    name_ja  = t['name_ja']
    lat      = t['lat']
    lng      = t['lng']
    walk_e   = t['walk_e']
    walk_n   = t['walk_n']
    gmaps    = "https://maps.google.com/?q=" + name_ja + "+大阪"
    return (
        f"  {{\n"
        f"    id: '{tid}',\n"
        f"    hotelIds: ['toyoko-umeda-east', 'toyoko-umeda-nakatsu'],\n"
        f"    categoryId: 'taxi',\n"
        f"    name: {{ en: '{name_en}', ja: '{name_ja}', 'zh-TW': '{name_ja}', ko: '{name_en}', tl: '{name_en}' }},\n"
        f"    address: {{ en: 'Osaka', ja: '大阪市北区', 'zh-TW': '大阪市北區', ko: '오사카시 기타구', tl: 'Osaka' }},\n"
        f"    lat: {lat}, lng: {lng},\n"
        f"    walkMinutes: {{ 'toyoko-umeda-east': {walk_e}, 'toyoko-umeda-nakatsu': {walk_n} }},\n"
        f"    hours: '24時間', closedDays: {{ en: 'None', ja: 'なし', 'zh-TW': '無', ko: '없음', tl: 'Wala' }},\n"
        f"    languages: ['en'], halal: false, vegetarian: false,\n"
        f"    sponsored: false, recommended: true,\n"
        f"    photos: [], googleMapUrl: '{gmaps}',\n"
        f"    notes: {{ en: '', ja: '', 'zh-TW': '', ko: '', tl: '' }}, active: true\n"
        f"  }}"
    )


def main():
    scripts_dir = Path(__file__).parent
    geojson_path = scripts_dir / "osaka_places.geojson"
    out_path = scripts_dir.parent / "src" / "data" / "stores.ts"

    # 1. データ取得
    if not geojson_path.exists():
        fetch_overture(geojson_path)
    else:
        print(f"ℹ️  キャッシュ使用: {geojson_path} (削除して再取得する場合は手動削除)")

    # 2. GeoJSON パース
    print("🔍 データ解析中...")
    with open(geojson_path, encoding="utf-8") as f:
        data = json.load(f)

    features = data.get("features", []) if isinstance(data, dict) else data
    print(f"   総フィーチャ数: {len(features)}")

    # 3. カテゴリ別に仕分け・重複排除
    buckets: dict[str, list] = defaultdict(list)
    seen_names: set[str] = set()
    idx = 0

    for feat in features:
        props = feat.get("properties", {})
        app_cat = parse_category(props)
        if not app_cat:
            continue
        if app_cat not in TARGET:
            continue

        entry = build_store_entry(feat, app_cat, idx)
        idx += 1
        if not entry:
            continue

        # 重複名除外
        key = entry["ja_name"].strip()
        if key in seen_names:
            continue
        seen_names.add(key)

        buckets[app_cat].append(entry)

    # 4. 件数調整（ソート: 近い順）
    stores_ts_parts = []
    summary = {}

    for cat, target in TARGET.items():
        items = buckets[cat]
        # 徒歩分数の平均でソート
        items.sort(key=lambda s: sum(s["walk"].values()) / len(s["walk"]))
        selected = items[:target]
        summary[cat] = len(selected)

        for i, s in enumerate(selected):
            recommended = (i < 3)  # 上位3件はおすすめ
            stores_ts_parts.append(render_store_ts(s, sponsored=False, recommended=recommended))

    # taxi は手動データ
    for t in TAXI_STORES:
        stores_ts_parts.append(render_taxi_ts(t))
    summary["taxi"] = len(TAXI_STORES)

    # 5. stores.ts 出力
    ts_content = (
        "import type { Store } from '../types'\n\n"
        "export const stores: Store[] = [\n"
        + ",\n".join(stores_ts_parts)
        + "\n]\n"
    )

    out_path.write_text(ts_content, encoding="utf-8")
    print(f"\n✅ 生成完了: {out_path}")
    print("\n📊 カテゴリ別件数:")
    total = 0
    for cat, count in summary.items():
        print(f"   {cat:15s}: {count} 件")
        total += count
    print(f"   {'合計':15s}: {total} 件")

    if any(v < TARGET.get(c, 5) for c, v in summary.items() if c != "taxi"):
        print("\n⚠️  件数が目標に届かないカテゴリがあります。bounding box を広げるか手動補完してください。")


if __name__ == "__main__":
    main()
