"""
stores.ts → Google Sheets 用 CSV エクスポート
ホテルごとに CSV を生成します

Usage:
    python scripts/export_csv.py
"""

import re, csv, sys, io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

HOTELS = {
    "toyoko-umeda-east":    "東横イン大阪梅田東",
    "toyoko-umeda-nakatsu": "東横イン梅田中津Ⅰ",
}

CATEGORY_JA = {
    "restaurant": "レストラン",
    "cafe":        "カフェ",
    "convenience": "コンビニ",
    "drugstore":   "ドラッグストア",
    "atm":         "ATM",
    "hospital":    "病院・クリニック",
    "shopping":    "ショッピング",
    "laundry":     "コインランドリー",
    "taxi":        "タクシー",
    "tourist":     "観光スポット",
}

def pick(pattern, src, default=""):
    m = re.search(pattern, src, re.DOTALL)
    return m.group(1).strip() if m else default

def parse_stores(ts_path: Path) -> list[dict]:
    text = ts_path.read_text(encoding="utf-8")

    # { } ブロックをネスト考慮で全て抽出
    stores = []
    depth = 0
    start = None
    for i, ch in enumerate(text):
        if ch == '{':
            if depth == 0:
                start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start is not None:
                block = text[start:i+1]
                # ストアオブジェクトの判定: id: と categoryId: を両方含む
                if "categoryId:" in block and "hotelIds:" in block:
                    s = parse_block(block)
                    if s:
                        stores.append(s)
                start = None
    return stores


def parse_block(block: str) -> dict | None:
    s = {}
    s["id"]         = pick(r"\bid:\s*'([^']*)'", block)
    s["categoryId"] = pick(r"categoryId:\s*'([^']+)'", block)
    if not s["id"] or not s["categoryId"]:
        return None

    s["name_ja"]    = pick(r"name:\s*\{[^}]*?ja:\s*'([^']*)'", block)
    s["name_en"]    = pick(r"name:\s*\{[^}]*?en:\s*'([^']*)'", block)
    s["address_ja"] = pick(r"address:\s*\{[^}]*?ja:\s*'([^']*)'", block)
    s["phone"]      = pick(r"phone:\s*'([^']*)'", block)
    s["hours"]      = pick(r"hours:\s*'([^']*)'", block)
    s["price"]      = pick(r"priceRange:\s*'([^']*)'", block)
    s["gmaps"]      = pick(r"googleMapUrl:\s*'([^']*)'", block)
    s["website"]    = pick(r"website:\s*'([^']*)'", block)
    s["recommended"]= pick(r"recommended:\s*(true|false)", block) == "true"
    s["sponsored"]  = pick(r"sponsored:\s*(true|false)", block) == "true"
    s["halal"]      = pick(r"halal:\s*(true|false)", block) == "true"
    s["vegetarian"] = pick(r"vegetarian:\s*(true|false)", block) == "true"
    s["active"]     = pick(r"active:\s*(true|false)", block, "true") == "true"

    # hotelIds
    hi_m = re.search(r"hotelIds:\s*\[([^\]]+)\]", block)
    s["hotelIds"] = re.findall(r"'([^']+)'", hi_m.group(1)) if hi_m else []

    # walkMinutes
    wm_m = re.search(r"walkMinutes:\s*\{([^}]+)\}", block)
    s["walk"] = {}
    if wm_m:
        for hid in HOTELS:
            m = re.search(rf"'{re.escape(hid)}':\s*(\d+)", wm_m.group(1))
            if m:
                s["walk"][hid] = int(m.group(1))

    return s


HEADERS = [
    "カテゴリ", "店舗名（日本語）", "店舗名（英語）",
    "徒歩（分）", "住所", "電話番号", "営業時間", "価格帯",
    "おすすめ", "スポンサー", "ハラール", "ベジタリアン",
    "Google Maps URL", "ウェブサイト",
]

def make_row(s: dict, hotel_id: str) -> list:
    return [
        CATEGORY_JA.get(s["categoryId"], s["categoryId"]),
        s["name_ja"],
        s["name_en"],
        s["walk"].get(hotel_id, ""),
        s["address_ja"],
        s["phone"],
        s["hours"],
        s["price"],
        "✓" if s["recommended"] else "",
        "✓" if s["sponsored"] else "",
        "✓" if s["halal"] else "",
        "✓" if s["vegetarian"] else "",
        s["gmaps"],
        s["website"],
    ]


def main():
    ts_path = Path(__file__).parent.parent / "src" / "data" / "stores.ts"
    out_dir = Path(__file__).parent

    print("stores.ts を読み込み中...")
    stores = parse_stores(ts_path)
    print(f"  {len(stores)} 件読み込みました")

    cat_order = list(CATEGORY_JA.keys())

    for hotel_id, hotel_name in HOTELS.items():
        hotel_stores = [
            s for s in stores
            if s["active"] and hotel_id in s["hotelIds"]
        ]
        hotel_stores.sort(key=lambda s: (
            cat_order.index(s["categoryId"]) if s["categoryId"] in cat_order else 99,
            s["walk"].get(hotel_id, 99)
        ))

        csv_path = out_dir / (hotel_id + "_stores.csv")
        with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow([f"【{hotel_name}】 周辺店舗リスト"])
            writer.writerow(HEADERS)
            for s in hotel_stores:
                writer.writerow(make_row(s, hotel_id))

        print(f"出力: {csv_path.name}  ({len(hotel_stores)} 件)")

    print("\n完了！ Google Sheets で「ファイル → インポート」から CSV を読み込んでください。")


if __name__ == "__main__":
    main()
