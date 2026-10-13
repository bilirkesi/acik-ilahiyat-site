"""Çıkmış AÖF vize sorularını ünitelere ve anahtar kelimelere eşler.

Kaynak: data/<slug>/past_exams.json (PDF extract)
Çıktı: unit, keywords, chapter eşlemesi (indexer + site_export kullanır)
"""
from __future__ import annotations

import re
from pathlib import Path

from .indexer import ROOT, fold

# ---- kurs konfigürasyonları ---------------------------------------------------
# Varsayılan: İslâm Mezhepleri Tarihi (geriye uyumluluk için modül seviyesinde de tanımlı)
ISLAM_UNIT_TITLES = {
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

ISLAM_UNIT_TO_CHAPTERS = {
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

TD_UNIT_TITLES = {
    1: "Dil ve Kültür",
    2: "Türkçenin Gelişimi ve Tarihsel Dönemleri",
    3: "Ses Bilgisi",
    4: "Biçim Bilgisi",
    5: "Cümle Bilgisi",
    6: "Türkçenin Söz Varlığı",
    7: "Diller Arası Etkileşim ve Türkçe",
    8: "Türkçenin Güncel Sorunları",
}

# study_plan bölümleri ile birebir
TD_UNIT_TO_CHAPTERS = {i: [i] for i in range(1, 9)}

AIT_UNIT_TITLES = {
    1: "Türk İnkılabını Hazırlayan Sebepler ve Doğu Sorunu",
    2: "İkinci Meşrutiyet Dönemi, 31 Mart Vakası ve Yıkıcı Savaşlar",
    3: "Mondros Mütarekesi, İlk İşgaller ve Millî Mücadelenin Doğuşu",
    4: "Yeni Türk Devleti'nin Kuruluşu, TBMM ve Millî Mücadelenin Temelleri",
    5: "Türk İstiklal Harbi, Düzenli Ordunun Kurulması ve Cepheler",
    6: "Lozan Barış Konferansı ve Türkiye Cumhuriyeti'nin Kuruluş Belgesi",
    7: "Atatürk Dönemi İç Politika ve Siyasi Hayattaki Gelişmeler",
    8: "Atatürk Dönemi Türk Dış Politikası (1923-1938)",
}

AIT_UNIT_TO_CHAPTERS = {i: [i] for i in range(1, 9)}

AIT_UNIT_KEYWORDS: dict[int, list[str]] = {
    1: [
        "osmanli devleti", "lale devri", "ii. osman", "katip celebi", "keşfü'z-zünûn",
        "sadrazam", "yeniçeri", "baltacı", "patrona", "kabakçı", "nizam-i cedit",
        "kavaklanma", "sekban-i cedit", "edirne vakası", "lale devri islahatlari",
        "mülki islahat", "kanun-i esasi", "tanzimat", "islahat fermanı", "gülhane",
        "meşrutiyet", "ii. meşrutiyet", "mebusan", "jon turk", "ittihat ve terakki",
        "doğu sorunu", "ermeni meselesi", "ermeni sorunu", "kafkasya", "batı etkisi",
        "avrupa", "islahat", "ıslahatçı", "reform", "osmanlı ıslahat",
        "ii. mahmut", "iii. selim", "abdülhamit", "abdulhamit", "servet-i funun",
        "19. yüzyıl", "20. yüzyıl", "genel bakış", "halefiye", "hal",
        "mekteb-i harbiye", "erkan-i harbiye", "harbiye", "tanzimat dönemi",
        "mustafa reşit", "ali paşa", "fuat paşa", "midhat", "meşveret",
        "şura-yı devlet", "meclis-i vala", "dar-ül funun", "numune-i terakki",
        "çanakkale", "i. dünya savaşı", "birinci dünya savaşı", "kıyık",
        "balkan savaşları", "balkan savaşı", "uşi", "londra antlaşması",
        "monroe", "wilson", "truman", "marshall", "balfor", "14 madde",
        "ırak cephesi", "irak cephesi", "kanal cephesi", "hicaz", "yemen",
        "kafkasya cephesi", "galiçya", "sina", "filistin cephesi", "suriye cephesi",
        "meriç", "bulgaristan", "yunanistan sınır", "osmanlıcılık",
        "batıcılık", "türkçülük", "islamcılık", "adem-i merkeziyet",
        "tercüman-ı ahval", "tasvir-i efkar", "ceride-i havadis", "takvim-i vekayi",
        "vaka-i vakviye", "vaka-i hayriye", "irad-i cedid", "nizam-i cedid",
        "celali", "gümüş", "enflasyon", "tımar", "iltizam", "devşirme",
        "koçi bey", "lütfi paşa", "şark meselesi", "hasta adam", "küçük kaynarca",
    ],
    2: [
        "31 mart", "hak ve hürriyet", "hürriyet fırkası", "alemdar", "müdafaa-i hukuk",
        "halk terakkiperver", "halk fırkası", "aynl zamanda", "aynı zamanda",
        "mahmud şevket", "şevket paşa", "hareket ordusu", "molla efendi",
        "abdulelah", "sultan abdülhamit", "ii. abdülhamit", "kara birlik",
        "mabeyn", "ait mebusan", "sait halim", "talaat", "cavit", "enver",
        "ittihat ve terakki cemiyeti", "ittihat terakki", "bab-ı ali",
        "istifa", "mebusan meclisi", "anayasa", "mecelle", "yıkıcı", "yıpratıcı",
        "savaşlar", "trablusgarp", "libya", "trablus", "balkan", "balkan savaşları",
        "kıbrıs", "adriyatik", "shkodır", "yanya", "selanik", "erzincan",
        "ermeni tehciri", "tehcir", "sürgün", "idman yurdu", "kuvayı milliye",
        "misak-ı milli", "milli misak", "amasya", "erzurum kongresi", "sivas kongresi",
        "havza", "kongre", "cemiyet", "milli cemiyet", "anadolu ve rumeli",
        "müdafaa-i vatan", "red-i ilhak", "ırak", "irak", "irak cephesi",
        "kafkasya cephesi", "kutul amare", "seraskerlik", "mavera-i harp",
    ],
    3: [
        "mondros", "ateşkes", "mütareke", "mudanya", "mudros", "mustafa kemal",
        "9. ordu", "ordu müfettişliği", "müfettiş", "samsun", "havza genelgesi",
        "amasya tamimi", "amasya genelgesi", "milli mücadele", "millimücadele",
        "işgal", "izmir", "işgale", "dortyol", "mersin", "adana", "antep",
        "urfa", "marş", "maras", "sivas", "kuvayı milliye", "kuvayi milli",
        "müdafaa-i hukuk", "müdafaa-i vatan", "cemiyet", "anadolu kadinlari",
        "havza", "orum", "kastamonu", "bolu", "ankara'ya", "heyet-i temsiliye",
        "misak-ı milli", "mebusan", "sevr", "ermeni", "fransız", "ingiliz",
        "italyan", "yunan", "i. ordu", "v. ordu", "kolordu", "karakol",
        "mavera-i harp", "levent", "gönen", "balıkesir", "alassar", "izmit",
    ],
    4: [
        "tbmm", "tbmm'ye", "büyük millet meclisi", "meclis-i ebayan",
        "heyet-i temsiliye", "temsiliye", "ilk meclis", "i. tbmm",
        "sevr", "barış konferansı", "paris", "londra", "san remo",
        "müdafaa-i hukuk", "reis-i cumhur", "mustafa kemal paşa", "hükümet",
        "anadolu ajansı", "hâkimiyet-i milliye", "hakimiyet-i milliye",
        "istiklal", "misak-ı milli", "milli irade", "temsil heyeti",
        "meclis-i mebusan", "meclis-i ayan", "saltanat", "mudanya",
        "ateşkes", "antlaşma", "kuruluş", "yeni türk devleti",
        "milli mücadelenin temelleri", "i. meclis", "ankara hükümeti",
        "cumhuriyet", "reis", "vekil", "şura-yı devlet", "neşriyat",
        "takvim", "havza", "sivas kongresi", "erzurum kongresi",
    ],
    5: [
        "batı cephesi", "doğru cephe", "i. inönü", "ii. inönü", "inönü",
        "sakarya", "başkomutanlık", "taarruz", "dumlupınar", "26 ağustos",
        "30 ağustos", "zafer", "meşale", "kütahya", "eskişehir", "izmir",
        "düşman", "yunan", "ordu", "düzenli ordu", "kağnı", "cebe",
        "tekalif-i milliye", "tekalif", "millet", "milli savunma", "cep",
        "mal", "vatan", "istiklal harbİ", "istiklal harbi", "istiklal",
        "cepheler", "batı anadolu", "anadolu'nun", "yurttan", "kırmızı",
        "yeşil", "sarı", "müfreze", "kuvayı milliye", "düzene", "düzene",
        "düzene", "konya", "isparta", "antalya", "burdur", "i. süvari",
        "kolordu", "tümen", "alay", "tabur", "tugay", "tümen komutanlığı",
        "mustafa kemal", "fevzi", "İsmet", "ismet", "çakmak", "paşa",
        "meclis-i mebusan", "mebusan", "kapatılması", "tehcir", "isyan",
        "koçgiri", "derviş", "sarp", "yağcı", "demirci", "ehmed",
    ],
    6: [
        "lozan", "lozan barış", "barış antlaşması", "mudanya mütarekesi",
        "ismet paşa", "i. inönü", "musul", "kapitülasyon", "boğazlar",
        "boğazlar komisyonu", "mukavele", "karadeniz", "akdeniz",
        "ermenistan", "ermeni", "turancı", "kabul", "ret", "delege",
        "heyet", "başkan", "mustafa kemal", "halil paşa", "rıza nur",
        "beylerbeyi", "antlaşma", "imza", "1923", "sulh",
        "barış", "anlaşmazlık", "tartışma", "müzakere", "görüşme",
        "tebliğ", "not", "hükûmet", "hükümet", "misak-ı milli",
        "milli ant", "sulhname", "zabıt", "kararname", "uygulama",
        "sınır", "suriye", "ırak", "irak", "türkiye-cumhuriyeti",
        "kuruluş belgesi", "uzlaşı", "uzlaşmazlık", "musul vilayeti",
    ],
    7: [
        "saltanatın kaldırılması", "halifeliğin kaldırılması", "cumhuriyet",
        "şapka", "medeni kanun", "latin alfabesi", "kadın", "haklar",
        "tekaüt", "şapka kanunu", "medeni", "hukuk", "mahkeme",
        "şer'iye", "evkaf", "örf", "adet", "tek parti", "cumhuriyet halk",
        "chp", "chf", "istiklal mahkemesi", "istiklal mahkemesi",
        "mustafa kemal atatürk", "atatürk ilkeleri", "inkılap", "inkılaplar",
        "devrim", "devrimler", "lâik", "laik", "seküler", "halkçılık",
        "milliyetçilik", "devletçilik", "iç politika", "siyasi hayat",
        "meclis", "vekil", "cumhurbaşkanı", "reis cumhur", "seçim",
        "tertip", "muhalefet", "serbest cumhuriyet", "fırka", "terakkiperver",
        "serbest fırka", "menemen", "şeyh sait", "dersim", "isyan",
        "takvim", "ölçü", "kılık", "giyim", "latin", "harf", "yazı",
        "ad", "soyadı", "soyadı kanunu", "türk dil kurumu", "tdk",
        "türk tarih kurumu", "ttk", "halk evi", "halkevi",
    ],
    8: [
        "moskova", "kars", "ankara antlaşması", "dostluk", "gürcistan",
        "ermenistan", "azerbaycan", "bolşevik", "rusya", "sovyet",
        "fransa", "ingiltere", "italya", "japonya", "abd",
        "musul", "musul meselesi", "irak", "ırak", "lozan",
        "boğazlar", "montrö", "montro", "cenevre", "kaynaşma",
        "çatalca", "edirne", "kuleli", "istanbul", "adriyatik",
        "yunanistan", "bulgaristan", "yugoslavya", "romanya",
        "balkan antantı", "antant", "sadabad", "pakt", "iki pakt",
        "fransa ile", "ingiltere ile", "italya ile", "almanya",
        "sovyet rusya", "türkiye-cumhuriyeti", "suriye", "fransa-suriye",
        "hatay", "hatay cumhuriyeti", "iskenderun", "antakya",
        "aleksandreta", "1938", "1939", "dış politika", "dis politika",
        "tarafsızlık", "sulh", "barış", "antant", "dostluk antlaşması",
        "salâhiyet", "mustafa kemal", "rusya ile", "gürcistan ile",
    ],
}

TD_UNIT_KEYWORDS: dict[int, list[str]] = {
    1: [
        "dil ve kultur", "dilin ozellikleri", "bilimsel bakimdan",
        "dil nedir", "dil bir sistemdir", "ana dili", "edilen dil",
        "edogmu", "kultur", "medeniyet", "dil ve dusunce", "sapir-whorf",
        "dil felsefesi", "dil bilimi", "dil bilimci", "kavram",
        "sozcuk anlam", "deyim", "kulturel", "irkcilik", "irkcil",
        "milliyetcilik", "dil uygulamasi", "dil politikasi",
        "orta asya", "kultur tasima", "yazi dili", "lehce",
        "agiz", "dialet", "diyalekt", "standart dil",
    ],
    2: [
        "turk dilleri", "ilk yazili belge", "orkhon", "gokturk",
        "uygur", "kutadgu bilig", "divanu lugati", "kashgari",
        "kasgarli", "muhakemet", "lugatut turk", "ahmet yesevi",
        "yunus emre", "asik pasa", "sultan veled", "karahanli",
        "hakanlar", "yusuf has hacib", "edip ahmet", "ali sir nevai",
        "hüseyin baykara", "osmanli", "divan edebiyati",
        "halk edebiyati", "tanzimat", "servet-i funun", "milli edebiyat",
        "genc kalemler", "yeni lisan", "yazim", "alfabe",
        "orkhon yazitlari", "turk dili tarihi", "eski turkce",
        "orta turkce", "yeni turkce", "istanbul turkcesi",
        "osmanlica", "arap alfabesi", "latin alfabesi", "kiril",
        "girift harf", "turk dil kurumu", "tdk", "dil inkilabi",
        "yazi devrimi", "sadelesme", "bilinc dili", "konusma dili",
        "yaziyi kabul", "hun", "aksak timur", "timur",
    ],
    3: [
        "ses bilgisi", "unlu", "unluler", "unsuz", "unsuzler",
        "unlu birlesmesi", "unlu uyumu", "unlu daralmasi", "unlu uzamasi",
        "unlulerin siniflandirilmasi", "kalinses", "ince ses",
        "agizlik", "yardimci unlu", "kalin unlu", "kalin sesli",
        "turkcede sekiz unlu", "unlu dusses", "unlu yukselisi",
        "sessizlerin siniflandirilmasi", "cift dudak", "damak",
        "disdi", "yari sessiz", "sert sessiz", "yumusak sessiz",
        "sessiz benzesmesi", "sertlik uyumu", "yanses", "nefeslenme",
        "kalinlik", "ic ses", "dil ucu", "boyunsuz", "ses olayi",
        "ses bilimi", "fonetik", "fonoloji", "hece", "heceleme",
        "hece kurallari", "vurgu", "tonlama", "bozulma",
        "kalin unlu daralmasi", "yumusama", "sertlesme",
        "sessiz dusmesi", "ses bilgisinde", "unlu birlesmeleri",
        "turkce sesler", "sesli harf", "sessiz harf",
    ],
    4: [
        "bicim bilgisi", "ekler", "eklenme", "son eklenme",
        "yapim eki", "cekim eki", "durum eki", "iyelik eki",
        "cogul eki", "soru eki", "aitlik eki", "ek eylem",
        "fiil eki", "isim hali", "belirtisiz", "belirtili",
        "tamlayici", "isim turleri", "sayi ismi", "zaman ismi",
        "yordam ismi", "ulastirma ismi", "degisme ismi", "nitelik ismi",
        "belli belirsiz", "sozcuk turu", "isim", "sifat", "zamir",
        "edat", "baglac", "unlem", "sayi", "edat sozcu",
        "parcal isim", "birlesik isim", "tamlacli isim",
        "ekli isim", "yapim eylemi", "isim yapim eki",
        "sozcuk yapisi", "kok", "govde", "ek", "yapim",
        "cekim", "isim cekimi", "fiil cekimi", "kisim eki",
        "zaman kipi", "emir kipi", "dilek kipi", "haber kipi",
        "gecmis zaman", "simdi zaman", "gelecek zaman",
    ],
    5: [
        "cumle bilgisi", "cumle ogeleri", "yuklem", "ozne", "nesne",
        "tumleci", "zarf", "belirteci", "ad tamlamasi", "sifat tamlamasi",
        "isim tamlamasi", "tamlama", "belirtisiz ad tamlamasi",
        "belirtili ad tamlamasi", "takissiz ad tamlamasi",
        "unvan obegi", "edat obegi", "baglama obegi", "karma obegi",
        "sozcuk obegi", "cumle turleri", "olumlu", "olumsuz", "soru",
        "emir", "unlem", "basit cumle", "birlesik cumle", "bagli cumle",
        "sirali cumle", "devrik cumle", "kuralli cumle", "eylem cumlesi",
        "ad cumlesi", "yuklem turu", "isim yuklem", "eylem yuklem",
        "sozdizimi", "soru cumlesi", "olumsuzluk", "olumsuz eki",
        "midir", "mi", "değil", "degil", "cumle kurulusu",
        "anlamca", "yuklemin turune gore", "ogelerin dizilisi",
    ],
    6: [
        "soz varligi", "deyimler", "atasozleri", "ikilemeler",
        "alinti sozler", "agiz ogeleri", "argo", "iliski sozleri",
        "alkis", "kargis", "dua", "beddua", "deyim nedir",
        "atasozu", "deyim ile atasozu", "turkce soz varligi",
        "mecaz", "gercek anlam", "yan anlam", "terim",
        "sozcuk anlami", "anlam iliskileri", "elesme", "karsitlik",
        "baglilik", "akrilik", "deyim cesitleri", "yali deyim",
        "sozcuklu deyim", "tekerleme", "sokagi aglatan",
        "kesme sugar", "basari", "ikileme", "mukerrer",
        "tekrarli sozcuk", "kalin agiz", "istanbul agzi",
        "kibris agzi", "urfa", "mus", "galat", "sporcul sozcuk",
    ],
    7: [
        "diller arasi etkilesim", "turkceye giren kelimeler",
        "alinti sozcuk", "arapca", "farsca", "fransizca", "ingilizce",
        "italyanca", "rumca", "almanca", "latince", "rusca",
        "yunanca", "ispanyolca", "ermenice", "bulgarca", "macarca",
        "mongolca", "japonca", "ibranice", "fince", "malay",
        "portekizce", "cince", "korece", "urduca", "farca",
        "turkcenin yayilma alanlari", "afsar turkcesi", "ahiska",
        "altay", "azerbaycan turkcesi", "bashkir", "bashkurt",
        "kazak", "kirgiz", "nogay", "tatar", "tuva", "yakut",
        "turkmen", "uzbek", "gagavuz", "karay", "kirim",
        "yugoslav", "giris sozcuk", "terkip", "kalip",
        "turkceye alinti", "ozgu turkce", "arapca alinti",
        "kultur etkilesimi", "ozturklesme", "karsilikli etkilesim",
    ],
    8: [
        "guncel sorunlar", "turkcenin kullanimi", "yabanci kelimeler",
        "ozgun turkce", "kirlilik", "sokak dili", "sosyal medya",
        "teknoloji", "internet dili", "kisaltma", "lakap",
        "reklam", "medya", "televizyon", "radyo", "gazete",
        "dil bilinci", "dil bilgisi", "dil sevgisi", "dil bilinci",
        "milli dil", "resmi dil", "standart", "kullanim hatasi",
        "yazim kurali", "noktalama", "buyuk harf", "virgul",
        "iki nokta", "dilimizde", "koruma", "zenginlestirme",
        "yeni kelimeler", "terim", "bilim dili", "teknik terim",
        "ingilizce etkisi", "globallesme", "dil tasfiyesi",
        "sadelesme hareketi", "turkce gunu", "dil dernekleri",
    ],
}

# AÖF ünite başlıkları (varsayılan kurs: İslâm Mezhepleri Tarihi)
UNIT_TITLES = ISLAM_UNIT_TITLES
UNIT_TO_CHAPTERS = ISLAM_UNIT_TO_CHAPTERS
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

# slug -> konfigürasyon
COURSE_UNIT_CONFIGS = {
    "islam-mezhepleri-tarihi": {
        "titles": ISLAM_UNIT_TITLES,
        "chapters": ISLAM_UNIT_TO_CHAPTERS,
        "keywords": UNIT_KEYWORDS,  # islam keywords atama sonrası doldurulur
    },
    "turk-dili-1": {
        "titles": TD_UNIT_TITLES,
        "chapters": TD_UNIT_TO_CHAPTERS,
        "keywords": TD_UNIT_KEYWORDS,
    },
    "ataturk-ilkeleri-1": {
        "titles": AIT_UNIT_TITLES,
        "chapters": AIT_UNIT_TO_CHAPTERS,
        "keywords": AIT_UNIT_KEYWORDS,
    },
}

# islam UNIT_KEYWORDS ataması (yukarıdaki dict literalinden sonra)
COURSE_UNIT_CONFIGS["islam-mezhepleri-tarihi"]["keywords"] = UNIT_KEYWORDS


def course_unit_cfg(slug: str) -> dict:
    return COURSE_UNIT_CONFIGS.get(slug, COURSE_UNIT_CONFIGS["islam-mezhepleri-tarihi"])


def unit_titles(slug: str) -> dict[int, str]:
    return course_unit_cfg(slug)["titles"]


def unit_to_chapters(slug: str) -> dict[int, list[int]]:
    return course_unit_cfg(slug)["chapters"]


def unit_keywords(slug: str) -> dict[int, list[str]]:
    return course_unit_cfg(slug)["keywords"]


# Geriye uyumluluk: varsayılan islam
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


def classify_unit(stem: str, options_text: str = "", slug: str = "islam-mezhepleri-tarihi") -> tuple[int | None, dict[int, int]]:
    """Soruyu AÖF ünitesine eşler. (best_unit, scores).

    Stem (soru gövdesi) 3x, seçenekler 1x ağırlıkta; aksi halde doğru cevap
    metnindeki anahtar kelimeler (ör. Boğazlar) üniteyi şaşırtır.
    """
    scores: dict[int, int] = {}
    stems = fold(stem or "")
    opts = fold(options_text or "")
    for unit, keys in unit_keywords(slug).items():
        s = 0
        for k in keys:
            kf = fold(k)
            if not kf:
                continue
            w = 3 if len(kf) > 8 else 2
            if kf in stems:
                s += w * 3
            if kf in opts:
                s += w
        if s:
            scores[unit] = s
    if not scores:
        return None, scores
    best = max(scores, key=scores.get)
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
    titles = unit_titles(slug)
    chapters = unit_to_chapters(slug)
    out = []
    for exam in exams:
        rows = []
        for i, q in enumerate(exam.get("questions") or [], 1):
            stem = q.get("stem") or q.get("question") or ""
            opts = " ".join(o.get("text", "") for o in q.get("options") or [])
            unit, scores = classify_unit(stem, opts, slug=slug)
            kws = extract_keywords(stem)
            rows.append(
                {
                    **q,
                    "index": i,
                    "stem": stem,
                    "unit": unit,
                    "unitTitle": titles.get(unit) if unit else None,
                    "chapters": list(chapters.get(unit, [])) if unit else [],
                    "unit_scores": scores,
                    "keywords": kws,
                }
            )
        out.append({**exam, "questions": rows})
    return out


def unit_coverage(slug: str) -> dict[int, dict]:
    """Ünite başına soru sayısı, yıllar, anahtar kelimeler."""
    titles = unit_titles(slug)
    chapters = unit_to_chapters(slug)
    cov: dict[int, dict] = {}
    for exam in annotate_questions(slug):
        year = exam.get("year") or exam.get("exam_id", "")
        for q in exam.get("questions") or []:
            u = q.get("unit")
            if not u:
                continue
            row = cov.setdefault(u, {"unit": u, "title": titles.get(u, f"Ünite {u}"), "count": 0, "years": set(), "keywords": set(), "samples": []})
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
        row["chapters"] = chapters.get(u, [])
    return cov


if __name__ == "__main__":
    import sys as _sys

    slug = _sys.argv[1] if len(_sys.argv) > 1 else "islam-mezhepleri-tarihi"
    cov = unit_coverage(slug)
    total = sum(c["count"] for c in cov.values())
    print(f"{slug}: {total} labeled / units={len(cov)}")
    for u in sorted(cov):
        c = cov[u]
        print(f"U{u:02d} n={c['count']} years={c['years']} ch={c['chapters']}")
        print(f"   kw={c['keywords'][:8]}")
