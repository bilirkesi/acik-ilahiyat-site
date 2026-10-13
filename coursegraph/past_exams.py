"""Çıkmış AÖF vize sorularını ünitelere ve anahtar kelimelere eşler.

Kaynak: data/<slug>/past_exams.json (PDF extract)
Çıktı: unit, keywords, chapter eşlemesi (indexer + site_export kullanır)
"""
from __future__ import annotations

import re
from pathlib import Path

from .indexer import ROOT, fold

# AÖF ünite başlıkları (İslâm Mezhepleri Tarihi, Anadolu Üniv. 2010)
UNIT_TITLES = {
    1: "Mezhepler Tarihine Giriş",
    2: "Mezheplerin Ortaya Çıkış Nedenleri",
    3: "Yönetim, İman-Küfür ve Kader Meseleleri Etrafında Oluşan İlk Mezhepler",
    4: "Ehl-i Sünnet ve’l Cemaat",
    5: "Şiîlik I",
    6: "Şiîlik II",
    7: "Nusayrîlik, Dürzîlik, Yezidîlik",
    8: "Alevîlik ve Bektaşîlik",
    9: "Mehdilik İnancı Temelinde Oluşan Geç Dönem Mezhepler",
    10: "Çağdaş İslâmî Akımlar",
}

# Site bölüm no'ları (study_plan); ünite -> bölüm (boş liste = sitede yok)
UNIT_TO_CHAPTERS = {
    1: [1],
    2: [2],
    3: [3, 4],
    4: [4],
    5: [5],
    6: [6],
    7: [],
    8: [],
    9: [],
    10: [],
}

# Ünite başına ayırt edici anahtar (fold edilmiş, küçük harf)
UNIT_KEYWORDS: dict[int, list[str]] = {
    1: [
        "mezhepler tarihi", "tanimi", "amatlari", "fenomenoloji",
        "dalalat", "dal'let", "ittifak", "tefrika", "makalat",
        "ehl-i heva", "ehli heva", "firka", "isimlendirme", "mezhep isim",
        "yapay olarak", "kirtas", "sebe-i furkan", "ehl-i kilife",
        "ehl-i kilfe", "ehl-i kıble", "mezhep isimlerinin",
        "hak ve batil", "hak, hangilerinin batil", "hangi mezheplerin hak",
        "batil oldugunun", "batil olduğunu", "mezhepsel ve",
        "tarihte biraktiklari", "tarihte bıraktıkları",
    ],
    2: [
        "ortaya cikis", "sebepleri", "sosyo-politik", "sosyopolitik",
        "kulturel", "farkli kultur", "ictimai", "ekonomik faktor",
        "psikolojik sebep", "kurtarici bekleme", "yapay olarak urat",
        "din alanindaki farklil", "ortamin izlerini", "ortamın izlerini",
        "din alanındaki farklılaşmaların", "farklılaşmaların birer ürünü",
    ],
    3: [
        "harici", "hârici", "haricilik", "hricilik", "ibadiye", "ibâdiye",
        "azraki", "ezarika", "sufri", "necdi", "necd", "behteri",
        "mutezile", "mu'tezile", "mürcie", "murci", "cebriye", "kaderci",
        "gulat", "taberi", "tahkim", "tahkîm", "cemel",
        "kader", "irade", "kulun fiilleri", "tevhid", "adl", "adâlet",
        "teberra", "teberri", "kebir", "kabair", "muhasebi", "muhâsıbî",
        "vâsil", "vasil", "bişr", "bisr", "ibn ebi evv", "abdullah ibad",
        "ibâd", "yasir", "selefîlik", "selefilik", "hadis ehli",
        "tahkime gitmesi", "tahrime", "tahkim olayi", "tahkim olayı",
        "haricilerin", "hariciler", "hâricîler", "hâriciler",
    ],
    4: [
        "ehl-i sunnet", "ehlisunnet", "ehl-i sünnet", "esarî", "esari",
        "eş'ari", "esarîyye", "eş'arîyye", "maturidi", "mâtürîdî",
        "gazali", "gazalî", "ibn taymiye", "selefiye", "hadis ehli",
        "imani", "itikad", "akide", "ibn ebi hatim", "ebu hatim",
        "muhasebi", "muhâsıbî", "ibnü'l-vezîr", "vezîr", "nesevi",
        "nesefi", "ebû yûsuf", "ebu yusuf", "hanife", "hânife",
        "hâris", "muhâsıbî", "selefîlik", "selefîye",
    ],
    5: [
        "muhammire", "muhammere", "ehl-i beyt", "ehl beyt",
        "on iki imam", "oniki imam", "imamet", "imamlarin masum",
        "takiyye", "takıyye", "gaybet", "gayb", "kerbela", "kerbelâ",
        "cemel", "tahkim", "kaysani", "muhtar", "zeydi", "zeydiyye",
        "ismail", "ismâil", "vehbi ilim", "gizlilik donemi", "gizlilik",
        "tenasuh", "teberra", "cemel vak", "cemel vaka", "duyular",
        "ehl-i beyt", "ehl beyt", "masum", "imamlarin",
        "kader anlayisinda", "kader anlayışında", "cebriyye",
        "firka-i dalle", "fırka-i dâlle", "dalle",
    ],
    6: [
        "zeydiyye", "ismailiye", "ismailiyye", "karmat", "karamita",
        "nizari", "nizâr", "mustali", "musta'li", "hafizi", "hâfızî",
        "batini", "bâtinî", "mustazhir", "mustanşir", "müstevlia",
        "hakim bi", "sübustayn", "guyumiye", "zeydiyye, kader",
    ],
    7: [
        "nusayri", "nusayrilik", "durzi", "durzilik", "yezidi",
        "yezidilik", "hamdan kartab", "nüseyri",
    ],
    8: [
        "alevi", "alevilik", "bektaski", "bektesi", "kizilbas",
        "kalender", "rifai", "nakibend", "nakşibend", "baba ishak",
        "saltuk", "demirbas", "yesevi", "haksal",
    ],
    9: [
        "mehdilik", "babilik", "bahailik", "mukanna", "kayem",
        "subustayn", "gaib imam", "mezkur imam",
    ],
    10: [
        "ihyacilik", "islamcilik", "vehhabi", "selefilik",
        "cemaluddin afgani", "reşid riza", "muvettidi", "hizb ut",
        "muslim kardesler", "diyalog", "fundamental", "cağdaş",
        "ilimlir", "ılımli", "cağdaş islami",
    ],
}

# Soru gövdesinden anahtar kelime adayları
_STOP = {
    "hangi", "hangilerinin", "asagidakilerden", "asagidaki", "asagidakilerin",
    "hangisi", "hangisidir", "hangisinin", "degildir", "degildir", "saglar",
    "saglamaktadir", "saglanir", "oldugunu", "olduğu", "olan", "olarak",
    "bicimde", "biçimde", "sekilde", "şekilde", "dahil", "disinda", "dışında",
    "birisi", "biri", "ancak", "yalniz", "yalnız", "hepsi", "tumu", "tümü",
    "dogru", "yanlis", "yanlış", "cevap", "soru", "sorusu", "sorulari",
    "mezheplerin", "mezhepleri", "mezhep", "dinin", "din", "islam", "islami",
    "musluman", "müslüman", "muslumanlarin", "toplumun", "toplum",
    "aşağıdakilerden", "aşağıdakiler", "aşağıdaki", "hangisi", "gerektirir",
    "gösterir", "belirtir", "ifade", "etmektedir", "etmek", "olup", "olduğu",
    "olabilir", "olmaktadır", "nasıl", "nasil", "nedir", "niçin", "neden",
    "sebep", "sebepleri", "hususunda", "konusunda", "hakkında", "hakkinda",
}

_TERM_RE = re.compile(
    r"[A-ZÂÎÛ][A-Za-zÂÎÛâîûıİğĞşŞüÜöÖçÇ'’\-]{2,}(?:\s+(?:b\.\s*)?[A-ZÂÎÛ][A-Za-zÂÎÛâîûıİğĞşŞüÜöÖçÇ'’\-]{1,}|"
    r"(?:el-|es-|ez-|ad-|an-|ibnü'|ebû |ebu |abdullah|muhammed|ömer|ali|hüseyin)[A-Za-zÂÎÛâîûıİğĞşŞüÜöÖçÇ'’\-]*)*"
)


def extract_keywords(stem: str, max_n: int = 8) -> list[str]:
    """Soru stem'inden ayırt edici terimler."""
    text = re.sub(r"\s+", " ", stem or "").strip()
    found: list[str] = []
    seen: set[str] = set()

    def add(term: str) -> None:
        term = term.strip(" .,:;()[]\"'’‘")
        if len(term) < 4:
            return
        key = fold(term)
        if key in seen or key in _STOP or any(fold(s) == key for s in _STOP):
            return
        # 2 kelime veya daha azsa ve stopword içeriyorsa atla
        words = term.split()
        if len(words) == 1 and key in _STOP:
            return
        seen.add(key)
        found.append(term)

    # bilinen terimler (regex)
    for m in re.finditer(
        r"(Mu['‘’]?tezile|Haric[iî]lik|Hariciler|Mürci[eê]|Mürcie|Eş['‘’]?arî[yi]e?"
        r"|Eş['‘’]?arî|Mâtürîdî|Maturidi|Muhâsıbî|Muhasebî|Vâsıl|Bişr|Muhammire"
        r"|Zeydiyye|İsmail[iî]ye|Karmat|Ehl-i Sünnet|Ehl-i Beyt|Ehl-i Kıble"
        r"|Ehl-i K[bı]le|Makâlât|Makalat|Tefrika|İttifak|Dalâlet|Dal'let"
        r"|Tahk[iî]m|Cemel|Kerbela|Kerbela|Mürcie|Selefîlik|Selefîye"
        r"|Abdullah b\.? ?İbâd|İbâdiyye|İbadiyye|Ebû Hânim|Mâtürîdî"
        r"|İbnü['’]?l-Vezîr|Hâris|Muhâsıbî|Tenâsüh|Teberâ|Teberra"
        r"|Adl|Adâlet|Tevh[idı]|Nass|Gizlilik|Cebriyye|Makâlâtü)",
        text,
    ):
        add(m.group(0))

    for m in _TERM_RE.finditer(text):
        add(m.group(0))

    return found[:max_n]


def classify_unit(stem: str, options_text: str = "") -> tuple[int | None, dict[int, int]]:
    """Soruyu AÖF ünitesine eşler. (best_unit, scores)."""
    blob = fold(f"{stem} {options_text}")
    scores: dict[int, int] = {}
    for unit, keys in UNIT_KEYWORDS.items():
        s = 0
        for k in keys:
            kf = fold(k)
            if kf and kf in blob:
                s += 3 if len(kf) > 8 else 2
        if s:
            scores[unit] = s
    if not scores:
        return None, scores
    best = max(scores, key=scores.get)
    # eşik: en az 2 puan (tek zayıf kelime yeterli değil)
    if scores[best] < 2:
        return None, scores
    return best, scores


def load_past_exams(slug: str) -> list[dict]:
    path = ROOT / "data" / slug / "past_exams.json"
    if not path.exists():
        return []
    import json

    return json.loads(path.read_text(encoding="utf-8-sig"))


def annotate_questions(slug: str) -> list[dict]:
    """past_exams.json sorularına unit + keywords ekler."""
    exams = load_past_exams(slug)
    out = []
    for exam in exams:
        rows = []
        for i, q in enumerate(exam.get("questions") or [], 1):
            stem = q.get("stem") or q.get("question") or ""
            opts = " ".join(o.get("text", "") for o in q.get("options") or [])
            unit, scores = classify_unit(stem, opts)
            kws = extract_keywords(stem)
            rows.append(
                {
                    **q,
                    "index": i,
                    "stem": stem,
                    "unit": unit,
                    "unit_scores": scores,
                    "keywords": kws,
                }
            )
        out.append({**exam, "questions": rows})
    return out


def unit_coverage(slug: str) -> dict[int, dict]:
    """Ünite başına soru sayısı, yıllar, anahtar kelimeler."""
    cov: dict[int, dict] = {}
    for exam in annotate_questions(slug):
        year = exam.get("year") or exam.get("exam_id", "")
        for q in exam.get("questions") or []:
            u = q.get("unit")
            if not u:
                continue
            row = cov.setdefault(u, {"unit": u, "title": UNIT_TITLES.get(u, f"Ünite {u}"), "count": 0, "years": set(), "keywords": set(), "samples": []})
            row["count"] += 1
            if year:
                row["years"].add(year)
            for k in q.get("keywords") or []:
                row["keywords"].add(k)
            if len(row["samples"]) < 3:
                row["samples"].append(q.get("stem", "")[:120])
    for u, row in cov.items():
        row["years"] = sorted(row["years"])
        row["keywords"] = sorted(row["keywords"], key=str.lower)[:20]
        row["chapters"] = UNIT_TO_CHAPTERS.get(u, [])
    return cov


if __name__ == "__main__":
    import json

    cov = unit_coverage("islam-mezhepleri-tarihi")
    for u in sorted(cov):
        c = cov[u]
        print(f"U{u:02d} n={c['count']} years={c['years']} ch={c['chapters']}")
        print(f"   kw={c['keywords'][:8]}")
