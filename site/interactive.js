/* İnteraktif özet verisi. build.py bu dosyayı ezmez; her proje kendi verisini burada tutar.
   Şema: window.INTERACTIVE[slug] = { title?, subtitle?, labels?, takeaways, concepts, timeline, matrix, tree }
   - labels: sekme etiketleri { concepts, timeline, matrix, tree } (opsiyonel)
   - matrix: { rowTerm?, hint?, axes: [], rows: [{ label, cells: [] }] }
   - tree:   [{ label, desc, branches: [{ label, d }] }] */
window.INTERACTIVE = {
  "islam-mezhepleri-tarihi": {
    title: "İslam Mezhepleri Tarihi İnteraktif Paneli",
    subtitle: "Doç. Dr. Kadir Gömbeyaz müfredatına uygun modüler analiz",
    labels: { matrix: "İhtilaf matrisi", tree: "Ekoller" },
    takeaways: [
      { t: "Din ve Mezhep Farkı", d: "Din ilahi, tek ve sabittir. Mezhep ise beşeri içtihat, ceht ve yorum sonucu oluşan dinamik yoldur." },
      { t: "Krizlerden Ekolleşmeye", d: "Cemel, Sıffın, Tahkim ve Kerbelâ gibi siyasi kırılmalar, Kebîre, Kader ve İmamet tartışmalarını doğurmuş; bu tartışmalar sivil alimler etrafında zamanla kurumsallaşarak ekollere dönüşmüştür." },
      { t: "Şehristanî'nin Eksenleri", d: "Kebîre, Kader, Sıfatlar ve İmamet başlıkları İslam düşünce tarihinin temel kelami akslarını oluşturur." },
      { t: "Zengin Ekol Çeşitliliği", d: "Hâricîlik'ten günümüze ılımlı İbadiyye ulaşmış; Mu'tezile akılcı kelam zeminini kurmuş; Mürciye toplumsal sükuneti vurgulamış; Şîa ise Zeydiyye, İsmailiyye ve 12 İmam kollarıyla günümüze taşınmıştır." }
    ],
    concepts: [
      { term: "Din", def: "Cenâb-ı Hak tarafından vahiy yoluyla gönderilen, zamanın ve mekânın ötesinde tek, mutlak ve ilahi olan hakikattir." },
      { term: "Mezhep", def: "'Zehebe' (gitmek) kökünden türeyen, beşeri içtihat ve yorumla oluşan; sıradan Müslümanın dinini anlama ve yaşamasını kolaylaştıran kılavuz ve metodolojidir." },
      { term: "Fırka", def: "Kök itibarıyla parçalanma ve bölünme anlamı taşır. Ayrılıkçı fırka, farklılığı birlik parçalayan kavgaya dönüştürür." },
      { term: "İhtilaf", def: "Farklı düşünme; Kur'an'da yasaklanan şey ihtilafın kendisi değil, ümmetin birliğini bozan iftiraktır." },
      { term: "İftirak", def: "Farklılıkları birliği parçalayan kavgaya dönüştürmek; Kur'an'ın yasakladığı asıl şey budur." },
      { term: "Taassup", def: "'Tek hak benim mezhebimdir, diğerleri tamamen sapkındır' demek; ilmi gerçeklikle bağdaşmayan tutumdur." },
      { term: "Mezhepsizlik", def: "'Doğrudan Kur'an ve Sünnet'e dönelim' söylemi pratikte usulsüzlüktür; asırlık ilmi birikimi reddedip bireysel görüşü mezhep kılmasıyla sonuçlanır." }
    ],
    timeline: [
      { year: "656", name: "Cemel", desc: "İslam toplumundaki ilk iç savaş; büyük günah (Kebîre) ve imamet tartışmalarını başlattı." },
      { year: "657", name: "Sıffın & Tahkim", desc: "Hâricîliğin doğuşu; siyasi bölünmenin itikadileşmesi ve 'hüküm ancak Allah'a aittir' sloganının doğuşu." },
      { year: "680", name: "Kerbelâ", desc: "Şîa bilincinin ve adanmışlığının kesinleştiği trajik kırılma; imamet meselesi kalıcı bir itikat eksenine dönüştü." },
      { year: "833", name: "Mihne", desc: "Mu'tezile'nin 'Kur'an mahluktur' dayatması ve Ahmed b. Hanbel'in direnci; kelami ayrışmanın devlet eliyle zorlanışı." }
    ],
    matrix: {
      rowTerm: "Mezhep",
      hint: "Şehristanî'nin dört ana ihtilaf ekseninde ekollerin tutumları. Mobilde tabloyu yana kaydırın.",
      axes: ["Kebîre (Büyük Günah)", "Kader ve İrade", "Sıfatlar", "İmamet"],
      rows: [
        { label: "Hâricîler", cells: ["Büyük günah işleyen küfre düşer (tekfir).", "İnsan iradesi öne çıkar.", "Tenzih vurgusu yüksektir.", "Siyasi ve seçimlidir; Kureyş şartı yoktur."] },
        { label: "Mürciye", cells: ["Hüküm Allah'a ertelenir; günah imana zarar vermez.", "Cebir ile irade arasında değişken tutum.", "Ehl-i Sünnet'e yakın.", "Siyasi krizden uzak kalmayı seçer."] },
        { label: "Mu'tezile", cells: ["el-Menzile beyne'l-menzileteyn (fasık).", "Tefviz: insan fiilinin tek mücididir.", "Tatil: zâta zait ezeli sıfat reddedilir.", "İçtihat ve ehliyet meselesidir."] },
        { label: "Şîa", cells: ["Büyük günah işleyen fasıktır.", "İrade kabul edilir (Zeydiyye ve İsmailiyye).", "Mu'tezile tenzihine yakındır.", "İtikat esasıdır; nass ve tayinle masum imam."] },
        { label: "Ehl-i Sünnet", cells: ["Günahkar bir mümindir; durumu Allah'ın iradesine kalmıştır.", "Kesp teorisi: fiili yaratan Allah, kesbeden kul.", "Zâta zait ezeli sıfatlar vardır; ne aynı ne gayr.", "Siyasi ve idari meseledir; imanın şartı değildir."] }
      ]
    },
    tree: [
      { label: "Hâricîlik", desc: "Tahkim Olayı'nda Hz. Ali'nin ordusundan ayrılan ilk radikal akım. 'La hükme illa lillah' (Hüküm ancak Allah'a aittir) sloganını benimser.",
        branches: [{ label: "Ezarika", d: "Nafi b. el-Ezrak'a nispet edilir; kendilerinden olmayan tüm Müslümanları tekfir etmiş, mallarını ve canlarını helal saymışlardır (isti'raz)." },
                   { label: "İbadiyye", d: "Abdullah b. İbaz'a nispet edilir; Hâricîliğin günümüze ulaşan tek ılımlı koludur. Büyük günahı 'küfr-i nimet' olarak yorumlar. Umman ve Kuzey Afrika'da yaşar." }] },
      { label: "Mürciye", desc: "Hâricîlerin tekfirci tutumuna tepki olarak doğan, toplumsal huzuru ve barışı arzulayan ekoldür. İmanı kalbin tasdiki olarak tanımlar, ameli imandan ayırır. İmam-ı Azam Ebu Hanife sünnet mürciyesi çizgisinde değerlendirilir.",
        branches: [] },
      { label: "Mu'tezile", desc: "Vasıl b. Ata ve Amr b. Ubeyd tarafından kurulmuş, Ebu'l-Hüzeyl el-Allaf tarafından sistemleştirilmiş akılcı kelam ekolüdür.",
        branches: [{ label: "Usûl-i Hamse", d: "Tevhid (zâta zait sıfatların reddi), Adalet (insanın fiillerinde özgürlüğü), el-Va'd ve'l-Va'id (ahirette ceza ve ödülün kesinliği), el-Menzile beyne'l-menzileteyn (fasık tanımı) ve el-Emr bi'l-ma'ruf ve'n-nehy 'ani'l-münker." }] },
      { label: "Şîa", desc: "Hz. Ali ve soyunun ilahi nass ve tayinle imam olması gerektiğini savunan ekoldür.",
        branches: [{ label: "Zeydiyye", d: "Zeyd b. Ali'ye nispet edilir; Şîa'nın en ılımlı ve Ehl-i Sünnet'e en yakın koludur. Mefzûlün imametini kabul eder. İtikatta Mu'tezile'ye, fıkıhta Hanefiliğe yakındır (Yemen)." },
                   { label: "İsmailiyye", d: "Cafer-i Sadık'ın büyük oğlu İsmail'e dayanır; nasların bâtıni anlamları olduğunu savunur (Talimiyye). Karmatiler, Fatımiler ve Alamut nizari kolu ile öne çıkmıştır." },
                   { label: "İsnaaşeriyye", d: "12 İmam Şîılığı (Caferiye); günümüz Şîa nüfusunun kahir ekseriyetini oluşturur. 12. İmam Muhammed el-Mehdi'nin gaybette olduğuna ve kıyamete yakın döneceğine inanır (İran, Irak, Azerbaycan, Lübnan)." }] },
      { label: "Ehl-i Sünnet", desc: "Gerek kelami, gerek fıkhi düzeyde ümmetin çoğunluk çizgisidir. İmamet siyasi ve idari bir mesele; imanın şartı değildir.",
        branches: [{ label: "Eş'arî", d: "Abu'l-Hasan Eş'arî tarafından kurulan kelam ekolü; akli delilleri nass hizmetinde kullanır. Büyük günah işleyen günahkar bir mümin olarak görülür." },
                   { label: "Matüridî", d: "Ebû Mansûr Matüridî tarafından kurulan; irade ve insan fiillerinde Eş'arî'den daha ılımlı bir tutum sergileyen kelam ekolü (Türk-İslam coğrafyasında yaygın)." },
                   { label: "İbadet Mezhepleri", d: "Hanefî, Mâlikî, Şâfiî ve Hanbelî fıkıh mezhepleri; amelî alanda içtihat okulları olarak düzenlenmiştir." }] }
    ],
    chapters: {
      "1": {
        title: "Din - Mezhep İlişkisi ve Mezhepleşme Süreci",
        labels: { compare: "Din vs Mezhep", timeline: "Mezhepleşme aşamaları", factors: "İç ve dış sâikler", quiz: "Pekiştirme testi", concepts: "Kavramlar" },
        takeaways: [
          { t: "Din vs Mezhep Ayrımı", d: "Din tektir, ilahidir ve masumdur. Mezhepler ise çokludur, beşeridir, dinamiktir ve ulema zihninin ürünüdür." },
          { t: "Mezhepleşmenin Doğallığı", d: "Hz. Peygamber'in vefatıyla masum otorite sona ermiş, yerini metinlere (Nas) bırakmıştır. Metinleri yorumlayan ulema masum olmadığı için ihtilaf ve mezhepleşme kaçınılmaz bir gerekliliktir." },
          { t: "4 Aşamalı Serüven", d: "Mezhepler masa başında kurulmaz. Şahsi görüşle başlar, cemaatleşir, 'İkinci Adam' ile sistemleşir ve nihayetinde kurumsallaşır." },
          { t: "Çift Yönlü Dinamikler", d: "İtikadî ayrışmalar sadece iç siyasi krizlerden (Cemel, Sıffîn, Tahkim) değil, aynı zamanda dış felsefi karşılaşmalardan ve tercüme faaliyetlerinden beslenmiştir." },
          { t: "Orta Yol Tavrı", d: "Mezhebi dinin kendisiyle aynileştiren 'mezhepçilik' ile mezhepleri tamamen reddedip metot kazasını doğuran 'mezhepsizlik' iki aşırı uçtur; makbul olan metodolojik bağımlılıktır." }
        ],
        concepts: [
          { term: "Nas", def: "Kur'an ve Sünnetten gelen yazılı ve şifahi metinler. Hz. Peygamber'den sonra otoritenin kaynağı hâline gelmiştir; ancak metin kendi kendine konuşmaz." },
          { term: "İçtihat", def: "Masum olmayan alimin, naslardan hareketle hüküm çıkarma çabası (ceht). Dinin sarih hüküm koymadığı alanlarda beşeri çözüm üretir." },
          { term: "Tahkim", def: "Sıffîn Savaşı'nda anlaşmazlığın hakemliğe götürülmesi olayı; Hâricîliğin doğuşunu tetikleyen siyasi kırılma." },
          { term: "İkinci Adam", def: "Kurucu imamın vefatından sonra görüşleri derleyip usûl çizen sistemleştiren şahsiyet. Örnek: Hanefilikte Ebu Yusuf ve İmam Muhammed." },
          { term: "Teşbih ve Tecsim", def: "Haberi sıfatları zahiriyle anlayıp Allah'ı yaratılmışlara benzetme riski; sıfatlar tartışmasının merkezindeki sapma endişesi." },
          { term: "Haberi Sıfatlar", def: "Kur'an'da geçen 'Allah'ın eli', 'yüzü', 'arşa istivası' gibi ifadeler; fethin ardından Arap olmayan unsurların katılımıyla tartışma odağı olmuştur." },
          { term: "Halku'l-Qur'an", def: "'Allah'ın Kelam sıfatı ezeli midir, mahluk mudur?' tartışması. Yuhanna ed-Dımeşkî'nin Hz. İsa'nın tanrısallığı iddiasına cevap arayışından doğmuştur." },
          { term: "Mezhepsizlik", def: "Uzmanlığı olmayan her bireyin doğrudan hüküm çıkarmaya kalkışması birlik yerine milyonlarca kontrolsüz görüş doğurur; pratikte imkânsıza yakındır." }
        ],
        compare: {
          left: {
            title: "DİN (İlahi ve Sabit)",
            points: [
              { k: "Kaynak", v: "Doğrudan vahiy (Cenâb-ı Hak)." },
              { k: "Nitelik", v: "Tek, sabit, evrensel ve hatasız." },
              { k: "Otorite", v: "Vahiy ve masum peygamber." },
              { k: "Sınır", v: "İnanç umdeleri ve sarih naslar." }
            ]
          },
          right: {
            title: "MEZHEP (Beşeri ve Dinamik)",
            points: [
              { k: "Kaynak", v: "Beşeri içtihat ve anlayış (ulema)." },
              { k: "Nitelik", v: "Çoklu, yerel; zamanla gelişip değişebilen." },
              { k: "Otorite", v: "Masum olmayan alimlerin metodolojisi." },
              { k: "Sınır", v: "Yorumlamaya açık içtihat sahası." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Sivil İnisiyatif ve Şahsi İçtihat", desc: "İslam coğrafyasının genişlemesiyle yeni sosyal, hukuki ve itikadî sorunlar doğar; yetkin bir alim, ceht ve içtihatla özgün çözümler üretir." },
          { year: "2", name: "Cemaat ve Halka Oluşumu", desc: "Üretilen çözümler ve metodolojik duruş çevresinde talebe ve takipçi kitlesi toplanır; henüz bir mezhepten değil, bir cemaat veya ders halkasından söz edilir." },
          { year: "3", name: "Sistemleştirme ve İkinci Adam Evresi", desc: "Kurucu imamın vefatından sonraki kuşakta, görüşleri derleyip usûl ilkelerini çıkaran ve yazılı literatürü oluşturan 'İkinci Adam' şahsiyeti belirir." },
          { year: "4", name: "Kurumsallaşmış Mezhep", desc: "Fikirler medreselerde okutulur, müçtehit tabakaları oluşur, usûl netleşir. Bireyler artık 'Ben Hanefiyim' gibi kimliklerle tanımlanır." }
        ],
        factors: {
          items: [
            { side: "ic", t: "İnsan Faktörü", d: "İnsan doğası gereği tek tip düşünmeye uygun yaratılmamıştır; algı ve kapasite farkları ihtilafı beraberinde getirir." },
            { side: "ic", t: "Siyasi Hadiseler ve İç Çatışmalar", d: "Hz. Osman'ın şehadeti, Cemel, Sıffîn ve Tahkim; Kebîre, Kader ve İmamet tartışmalarını doğuran derin travmalardır." },
            { side: "ic", t: "Dini Nasların Mahiyeti", d: "Kur'an ders kitabı gibi değil, 23 yıllık hayatın olayları üzerine (esbab-ı nüzul) inmiş bir hitaptır; farklı tevil ve kıyas imkânları doğurur." },
            { side: "dis", t: "Hızlı Fütuhat ve Kadim Medeniyetlerle Yüzleşme", d: "Bizans, Sasani ve Mısır coğrafyalarının Hristiyan, Yahudi, Mecusi alimleri, Müslümanların gündemine yeni sorunlar taşımıştır." },
            { side: "dis", t: "Kelami ve Felsefi Tartışmalar", d: "Yuhanna ed-Dımeşkî'nin Hz. İsa iddiaları karşısında 'Kelam ezeli midir, mahluk mudur?' sorusu ve Halku'l-Qur'an meselesi doğmuştur." },
            { side: "dis", t: "Tercüme Faaliyetleri ve Haberi Sıfatlar", d: "Felsefi metinlerin Arapçaya çevrilmesi ve Mevali'nin İslam'a girmesiyle sıfat ifadelerinin yorumu tartışma odağı olmuştur." }
          ]
        },
        quiz: [
          { q: "Hz. Peygamber döneminde mezheplerin bulunmama temel sebebi nedir?",
            options: ["Müslümanların henüz devletleşmemiş olması", "Vahiy alan ve kararları bağlayıcı olan masum bir otoritenin varlığı", "Hiçbir siyasi ihtilafın yaşanmamış olması"],
            answer: 1,
            why: "Mezhep, yoruma açık konularda ve otorite boşluğunda doğar. Vahiy ve masum otorite devam ederken böyle bir boşluk oluşmazdı." },
          { q: "Bir cemaatin mezhep haline gelmesinde görüşleri derleyip usûl çizen kişiye ne ad verilir?",
            options: ["İkinci Adam / Sistemleştiren Alim", "Kurucu İmam", "Mukallit Alim"],
            answer: 0,
            why: "Kurucu imamdan sonraki kuşakta sistemi derleyip literatüre dönüştüren şahsiyete 'İkinci Adam' denir (ör. Ebu Yusuf, İmam Muhammed)." },
          { q: "Aşağıdakilerden hangisi itikadî mezhepleşmeyi tetikleyen 'Dış Sâikler' arasında yer alır?",
            options: ["Cemel ve Sıffîn Savaşları", "Farklı kültür ve dinlerle yüzleşme ve felsefi tercümeler", "Tahkim Hadisesi ve Hâricîliğin çıkışı"],
            answer: 1,
            why: "Cemel, Sıffîn ve Tahkim iç siyasi krizlerdir; dış sâikler ise kültürel yüzleşme ve tercüme faaliyetleridir." }
        ]
      },
      "2": {
        title: "Hak Mezhep Söylemi ve Mezhepleşmenin Sebepleri",
        labels: { compare: "Mezhepçilik vs Mezhepsizlik", timeline: "İhtilaf ve iftirak", factors: "Mezhepleşme sebepleri", quiz: "Pekiştirme testi", concepts: "Kavramlar" },
        takeaways: [
          { t: "İhtilaf vs İftirak", d: "İhtilaf farklı düşünmektir ve doğaldır. Yasaklanan şey, farklılıkları ümmeti bölen bir ayrılık vesilesine (iftirak) dönüştürmektir." },
          { t: "Hak Mezhep Söylemi", d: "Her mezhep kendini en doğru yorum olarak görür; bu tabiidir. Ancak bunu Allah katında da kesin doğru kabul edip diğerlerini din dışına atmak problemli bir tutumdur." },
          { t: "İki Aşırı Uç", d: "Mezhebi din ile aynileştirmek (mezhepçilik) ve mezhepleri bütünüyle reddetmek (mezhepsizlik) birbirinin aynasıdır; her ikisi de metodolojik çöküşe götürür." },
          { t: "Çok Nedenli Yapı", d: "İtikadî mezhepleşme tek bir nedene indirgenemez; iç siyasi krizler, metinlerin yapısı ve dış kültürle yüzleşme bir arada çalışır." }
        ],
        concepts: [
          { term: "İhtilaf", def: "İnsanın farklı düşünmesi, nasın açıkça hüküm koymadığı konularda farklı çözümlere ulaşması. Doğal ve meşru bir süreçtir." },
          { term: "İftirak", def: "İhtilafların taassup ve düşmanlığa dönüşerek ümmetin birliğini parçalaması. Kur'an'ın yasakladığı budur." },
          { term: "Hak Mezhep Söylemi", def: "Bir mezhebin yalnızca kendini hak değil, Allah katında da mutlak doğru kabul edip diğerlerini din dışına atması." },
          { term: "Mezhepsizlik", def: "Uzmanlığı olmayan herkesin doğrudan hüküm çıkarmaya kalkışması; birlik yerine milyonlarca kontrolsüz görüş doğurur." },
          { term: "Sünnet Mürciyesi", def: "Ameli imandan ayıran ılımlı çizgi; Ebu Hanîfe gibi fakihler toplumsal bütünleşmeyi bu yöntemle sağlamıştır." },
          { term: "İstihrâz", def: "Hâricîlerin safına çekmek için sadakat testi uygulaması; Ezârika kolunun ayırıcı uygulamalarındandır." }
        ],
        compare: {
          left: {
            title: "MEZHEPÇİLİK (Aşırı Bağlanma)",
            points: [
              { k: "İddia", v: "Kendi mezhebi dinin kendisiyle aynidir." },
              { k: "Sonuç", v: "Diğer Müslümanlar din dışına itilir; taassup doğar." },
              { k: "Risk", v: "Mezhep, dini nasların yerine geçer." }
            ]
          },
          right: {
            title: "MEZHEPSİZLİK (Aşırı Red)",
            points: [
              { k: "İddia", v: "Mezhepler bidattir; herkes kendi içtihadını yapmalıdır." },
              { k: "Sonuç", v: "Metodoloji kazası; uygulanabilir bir din yaşamı kalmaz." },
              { k: "Risk", v: "Bireysel kapasitesizlikler dinin anlaşılmasını bozar." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Doğal İhtilaf", desc: "Farklı bakış açıları ve beşeri kapasite farkları nasın açıkça konuşmadığı alanlarda farklı hükümler üretir." },
          { year: "2", name: "Siyasi Kriz ve Kimlik", desc: "Cemel, Sıffîn, Tahkim gibi olaylar itikadi tartışmaları ateşler; ihtilaf siyasal kimliklerle örtüşür." },
          { year: "3", name: "İftirak Tehlikesi", desc: "Taassup, farklılıkları ümmeti bölen bir ayrılık vesilesine dönüştürür; fitne ve iç çatışma kapıya dayanır." },
          { year: "4", name: "Orta Yol Çağrısı", desc: "Metodolojik bağımlılık, hak mezhep söylemini reddeder ve mezhepsizlik uçlarına karşı dengeli bir pratik önerir." }
        ],
        factors: {
          items: [
            { side: "ic", t: "İnsan Faktörü", d: "İnsan farklı düşünmeye yaratılmıştır; bilgi birikimi ve bakış açısı farklılıkları kaçınılmazdır." },
            { side: "ic", t: "Metinlerin Mahiyeti", d: "Kur'an olaylar üzerine inmiş bir hitaptır; farklı tevil ve kıyas imkânları ihtilafı beraberinde getirir." },
            { side: "ic", t: "Siyasi Olaylar", d: "Hz. Osman'ın şehadeti, Cemel, Sıffîn; kebire, kader ve imamet tartışmalarına zemin hazırlamıştır." },
            { side: "ic", t: "Otorite Boşluğu", d: "Masum peygamberin vefatından sonra hüküm çıkarma işi masum olmayan ulemaya kalmıştır." },
            { side: "dis", t: "Dış Kültürlerle Karşılaşma", d: "Hristiyanlık, Pers ve Grek felsefesiyle yüzleşme; Kur'an'ın mahiyeti ve ilahi sıfatlar gibi yeni sorular doğurmuştur." },
            { side: "dis", t: "Psikososyal Etkiler", d: "Çevre, talebe halkası ve toplumsal beklentiler, mezhep imamının görüşlerinin teşekkülünde rol oynamıştır." }
          ]
        },
        quiz: [
          { q: "Kur'an'ın yasakladığı şey aşağıdakilerden hangisidir?",
            options: ["Farklı düşünmek ve farklı görüşe sahip olmak", "Farklılıkları ümmeti bölen bir ayrılık vesilesine dönüştürmek", "Nasın açıkça konuşmadığı konularda içtihat etmek"],
            answer: 1,
            why: "Din ihtilafı engellemez; engellenmesi istenen şey iftiraktır, yani farklılıkların bölünme aracı hâline getirilmesidir." },
          { q: "Mezhepçilik ve mezhepsizlik arasındaki ortak nokta nedir?",
            options: ["Her ikisi de naslara sıkı sıkıya bağlıdır", "Her ikisi de metodolojik kazaya düşer ve dinin pratik yaşamını bozar", "Her ikisi de içtihada tamamen kapalıdır"],
            answer: 1,
            why: "Biri mezhebi din ile aynileştirir, diğeri tümüyle reddeder; ikisi de metodolojik bağımlılığı yok sayar." },
          { q: "İhtilaf ile iftirak arasındaki temel fark nedir?",
            options: ["İhtilaf siyasi, iftirak dini bir kavramdır", "İhtilaf farklı düşünmektir; iftirak bu farklılığın birlik bağlarını koparmasıdır", "İkisi de aynı anlama gelir"],
            answer: 1,
            why: "İhtilaf doğal bir farklılıktır; iftirak ise bu farklılığın düşmanlığa ve bölünmeye dönüşmesidir." }
        ]
      },
      "3": {
        title: "İlk Siyasi-İtikadi Kırılma: Hâricîler",
        labels: { timeline: "Tarihsel kırılma", tree: "Hâricî kolları", quiz: "Pekiştirme testi", concepts: "Kavramlar", matrix: "Radikallik spektrumu" },
        takeaways: [
          { t: "Siyasî Köken, İtikadî Sonuç", d: "Hâricîlik Sıffîn ve Tahkim sonrası doğdu; siyasî bir tepki hızla katı bir itikadî sisteme dönüştü." },
          { t: "Kebîre ve Tekfir", d: "Büyük günah işleyen derhal kâfir/müşrik sayıldı; bu tutum ümmet içinde güvensizlik ve şiddet iklimi yarattı." },
          { t: "Eşitlikçi İmamet", d: "Kureyşilik şartı reddedildi; takva, ilim ve adalet sahibi herkes (köle dahi olsa) imam olabilir." },
          { t: "Günümüze Ulaşan Kol", d: "Radikal kollar yok oldu; muhalifleri 'küfr-i nimet' sahibi muvahhit gören ılımlı İbâdiyye varlığını korudu." }
        ],
        concepts: [
          { term: "Muhakkime", def: "Tahkime karşı çıkıp Hz. Ali'nin ordusundan ayrılan ilk grup; 'Lâ hükme illâ lillâh' sloganıyla Harûrâ'da toplandı." },
          { term: "Kebîre", def: "Büyük günah. Hâricîler ameli imanın rüknü saydıkları için kebîre sahibini dinden çıkmış kabul etmiştir." },
          { term: "Tekfir", def: "Bir Müslümanın dinden çıkmış (kâfir) ilan edilmesi. Hâricî zihniyetinin ayırıcı uygulamasıdır." },
          { term: "Kureyşizm", def: "İmametin Kureyş kabilesine ait olduğu anlayışı; Hâricîler buna radikal biçimde karşı çıkmıştır." },
          { term: "İsti'râz", def: "Muhalif Müslümanların kadın ve çocuklarının katlini meşru gören Ezârika uygulaması." },
          { term: "Küfr-i Nimet", def: "Muhaliflerin müşrik değil, nimete nankörlük eden muvahhitler olduğunu savunan İbâdiyye anlayışı." }
        ],
        timeline: [
          { year: "657", name: "Sıffîn Savaşı", desc: "Şam ordusu mızraklara Kur'an bağlayınca savaş durdu; Hz. Ali istemeyerek tahkimi kabul etti." },
          { year: "657", name: "Harûrâ ve Muhakkime", desc: "Tahkime karşı çıkan yaklaşık 12.000 kişilik kitle 'Lâ hükme illâ lillâh' diyerek ayrıldı." },
          { year: "658", name: "Nehrevan Savaşı", desc: "Aşırılığa kaçan ve masumları katleden Muhakkime, Hz. Ali tarafından ağır bir yenilgiye uğratıldı." },
          { year: "661", name: "Hz. Ali'nin Şehadeti", desc: "İbn Mülcem adlı Hâricî suikastçı; siyasî bölünme kalıcı hâle geldi." }
        ],
        matrix: {
          rowTerm: "Kol",
          hint: "Hâricî kollarının radikallikten mutedilliğe sıralanışı. Mobilde tabloyu yana kaydırın.",
          axes: ["Radikallik", "Tekfir Anlayışı", "Eylem"],
          rows: [
            { label: "Ezârika", cells: ["En radikal", "Ka'ade dahi kâfir", "İsti'râz: kadın-çocuk katliamı meşru"] },
            { label: "Sufrîyye", cells: ["Orta-radikal", "Şiddet savunmada sınırlı", "Ka'ade'yi doğrudan tekfir etmez"] },
            { label: "Necdât", cells: ["Ara çizgi", "Cehalet mazeret kabul", "Bazı günahlarda tekfiri sınırlandırır"] },
            { label: "İbâdiyye", cells: ["Mutedil", "Küfr-i nimet; müşrik değil", "Kan-mal-çocuk katliamı haram"] }
          ]
        },
        tree: [
          { label: "Muhakkime (Harûriyye)", desc: "Tahkim sonrası kopuşun adıdır; tarihin ilk büyük itikadî kırılmasını başlatmıştır.",
            branches: [{ label: "Ezârika", d: "Nâfi b. el-Ezrak'ın liderliğinde en radikal kol; isti'râz ve istihrâz uygulamalarıyla bilinir." },
                       { label: "İbâdiyye", d: "Câbir b. Zeyd ve Ebû Ubeyde Müslim çizgisi; günümüz Umman ve Kuzey Afrika'sına uzanır." },
                       { label: "Sufrîyye ve Necdât", d: "Ara çizgi; biri şiddeti savunmaya sınırlar, diğeri cehaleti mazeret kabul eder." }] }
        ],
        quiz: [
          { q: "Hâricîliğin doğuşunu tetikleyen tarihsel olay nedir?",
            options: ["Kerbelâ Vakası", "Sıffîn Savaşı ve Tahkim Olayı", "Cemel Vakası"],
            answer: 1,
            why: "Sıffîn'de tahkime rıza gösteren Hz. Ali'ye ve hakemlere tepki, Hâricî kopuşunun doğrudan sebebidir." },
          { q: "Hangi Hâricî kol muhaliflerin kadın ve çocuklarının katlini meşru görmüştür?",
            options: ["İbâdiyye", "Necdât", "Ezârika"],
            answer: 2,
            why: "Ezârika, isti'râz uygulamasıyla muhaliflerin aile fertlerini de katletmeyi caiz görmüştür." },
          { q: "İbâdiyye'nin günümüze ulaşmasının temel sebebi nedir?",
            options: ["Aşırı tekfirci söylemi", "Mutedil tutum ve 'küfr-i nimet' anlayışı", "Kureyşizm şartını koruması"],
            answer: 1,
            why: "Muhalifleri müşrik saymayan ılımlı İbâdiyye, toplumsal uyumu koruyarak varlığını sürdürmüştür." }
        ]
      },
      "4": {
        title: "Kebîre Tartışması, Mürciye ve Mu'tezile",
        labels: { compare: "Hâricî vs Mürciye vs Mu'tezile", timeline: "Kebîre tartışmasının seyri", matrix: "Şehristânî'nin 4 ekseni", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Usûl-i Hamse" },
        takeaways: [
          { t: "Üç Temel Cevap", d: "Kebîre sorusuna Hâricîler tekfir, Mürciye irca, Mu'tezile ise 'el-Menzile' ile orta yol cevabını vermiştir." },
          { t: "İrca Düşüncesi", d: "Mürciye imanı kalbin tasdikine bağlayıp ameli ayrı tutmuş; toplumsal barışı böylece tesis etmiştir." },
          { t: "Mu'tezile Orta Yolu", d: "Büyük günah işleyen ne mümin ne kafirdir; 'fasık'tır. Tövbesiz ölürse cehennemde ebedi kalır." },
          { t: "Sistematik Kelam", d: "Mu'tezile, Usûl-i Hamse ile İslam düşünce tarihinde ilk sistematik kelam ekolünü kurmuştur." }
        ],
        concepts: [
          { term: "İrca", def: "Hükmü erteleme. Mürciye siyasi tartışmaları ve günahkârın ahiretteki durumunu Allah'a bırakmıştır." },
          { term: "el-Menzile beyne'l-menzileteyn", def: "İki konum arasında bir konum. Büyük günah işleyen fasıktır; Mu'tezile'nin orta yol ilkesi." },
          { term: "Usûl-i Hamse", def: "Mu'tezile'nin beş esası: Tevhid, Adalet, Va'd ve Va'îd, el-Menzile, Emr-i bi'l-Ma'rûf." },
          { term: "Tevhid (Mu'tezile)", def: "Zât tek ve kadimdir; zâta zaid sıfat yoktur. Teşbih ve tecsim kesinlikle reddedilir." },
          { term: "Adalet (Mu'tezile)", def: "Allah adildir; insan fiillerinin yaratıcısı ve failidir (hâlıkı'l-ef'âl). Özgür irade esastır." },
          { term: "Va'd ve Va'îd", def: "Cennet vaadi ve cehennem tehdidi mutlaktır; tövbesiz ölen büyük günah sahibi af olunmaz." },
          { term: "Sünnet Mürciyesi", def: "Ameli imandan ayıran ılımlı çizgi; İmam-ı Âzam Ebu Hanîfe bu yaklaşımı benimsemiştir." },
          { term: "Hâlıkı'l-Ef'âl", def: "İnsanın kendi fiillerinin yaratıcısı olduğu anlayışı; Mu'tezile'nin Adalet ilkesinin temelidir." }
        ],
        compare: {
          left: {
            title: "HÂRICÎLER (Tekfir)",
            points: [
              { k: "İman-Amel", v: "Amel imanın ayrılmaz parçasıdır." },
              { k: "Günahkâr", v: "Kebîre sahibi kâfir/müşriktir." },
              { k: "Sonuç", v: "Sokakta tekfirci şiddet ve fitne." }
            ]
          },
          right: {
            title: "MÜRCİYE (İrca)",
            points: [
              { k: "İman-Amel", v: "İman kalbin tasdiki; amel ayrıdır." },
              { k: "Günahkâr", v: "Mümin kalır; akıbet Allah'a ertelenir." },
              { k: "Sonuç", v: "Toplumsal barış ve sükûnet." }
            ]
          }
        },
        timeline: [
          { year: "657+", name: "Hâricî Tekfiri", desc: "Büyük günah işleyen dinden çıkmış sayıldı; toplum güvensizliğe boğuldu." },
          { year: "1-2. yy", name: "Mürciye ve İrca", desc: "Siyasi tartışmalar ve günahkârın ahireti Allah'a ertelendi; iman-amel ayrıldı." },
          { year: "2. yy", name: "Basra Mescidi", desc: "Vâsıl b. Atâ, Hasan-ı Basrî meclisinden ayrılıp 'el-Menzile' tezini ortaya koydu." },
          { year: "2-3. yy", name: "Usûl-i Hamse", desc: "Ebu'l-Hüzeyl el-Allâf'ın çerçevesini çizdiği beş esas etrafında sistematik kelam kuruldu." }
        ],
        matrix: {
          rowTerm: "Ekol",
          hint: "Şehristânî'nin belirlediği 4 ana ihtilaf ekseninde ekollerin tutumları. Mobilde tabloyu yana kaydırın.",
          axes: ["İmamet", "Kebîre", "Kader", "Sıfatlar"],
          rows: [
            { label: "Hâricîler", cells: ["Liyakat esastır; zalim imama isyan farz", "Amel imandan; kebîre sahibi kâfir", "İrade ve sorumluluk öne çıkar", "Tenzih ağırlıklı; teşbih reddedilir"] },
            { label: "Mürciye", cells: ["Sahabe tartışmaları irca edilir", "İman tasdiktir; günah imana zarar vermez", "Cebre yakın veya ılımlı", "Genel tenzih prensipleri"] },
            { label: "Mu'tezile", cells: ["Seçim ve şûrâ; adalet şart", "el-Menzile; fasık, tövbesiz cehennemlik", "İrade tam; hâlıkı'l-ef'âl", "Zâta zaid sıfat yok; tevil"] },
            { label: "Şîa (İmâmiyye)", cells: ["Nass ve tayin; imamlar masum", "İmandan çıkmaz; velayet iman şartı", "Bada ve adalet ilkeleriyle irade", "Mu'tezilî tenzih eğilimi"] },
            { label: "Ehl-i Sünnet", cells: ["Seçim, biat, şûrâ; ameli mesele", "Amel kemal şartı; mümin-i âsî", "Kesp: hâlık Allah, kâsib kul", "Zâta zaid ezeli sıfat; bila-keyf"] }
          ]
        },
        factors: {
          items: [
            { side: "ic", t: "Tevhid", d: "Zât tek ve kadimdir; zâta zaid sıfat taaddüd-i kudemâ tehlikesi doğurur. Kur'an mahluktur." },
            { side: "ic", t: "Adalet", d: "Allah adildir; insan fiillerinin failidir. Ahirette adil yargılanma için özgür irade gerekir." },
            { side: "ic", t: "Va'd ve Va'îd", d: "Cennet vaadi ve cehennem tehdidi mutlaktır; tövbesiz büyük günah sahibi af olunmaz." },
            { side: "dis", t: "el-Menzile", d: "Büyük günah işleyen ne mümin ne kafirdir; fasıktır. Orta yol mantığının çekirdeği." },
            { side: "dis", t: "Emr-i bi'l-Ma'rûf", d: "Toplumda iyiliği emretmek, kötülükten menetmek; gerektiğinde aktif sorumluluk." }
          ]
        },
        quiz: [
          { q: "Mürciye'nin getirdiği temel çözüm aşağıdakilerden hangisidir?",
            options: ["Tekfir: büyük günah sahibi kâfirdir", "İrca: hükmü Allah'a ertelemek ve imanı amelden ayırmak", "Fısk: iki konum arasında bir konum"],
            answer: 1,
            why: "İrca, siyasi tartışmaları ve günahkârın ahiret akıbetini Allah'a havale eden sükûnet ilkesidir." },
          { q: "Mu'tezile'nin büyük günah işleyen için getirdiği kavram nedir?",
            options: ["Mümin-i âsî", "Fasık (el-Menzile)", "Kâfir-i müstebâh"],
            answer: 1,
            why: "el-Menzile beyne'l-menzileteyn gereği büyük günah sahibi fasıktır; tövbesiz ölürse cehennemliktir." },
          { q: "Aşağıdakilerden hangisi Usûl-i Hamse'den biri değildir?",
            options: ["Tevhid", "Kesp", "Adalet", "Va'd ve Va'îd"],
            answer: 1,
            why: "Kesp teorisi Ehl-i Sünnet'in kader anlayışıdır; Usûl-i Hamse Tevhid, Adalet, Va'd-Va'îd, el-Menzile ve Emr-i Ma'rûf'tan oluşur." }
        ]
      },
      "5": {
        title: "İslam Toplumunun Temel Ayrılığı: Şîa ve İmamet",
        labels: { compare: "Sünnî vs Şîî İmamet", timeline: "Siyasi taraftarlıktan itikada", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "İmametin dört taşı" },
        takeaways: [
          { t: "Şîa'nın Anlamı", d: "Sözlükte 'taraftar'; tarihsel süreçte Hz. Ali ve soyunun ilahi nass ile imam kılındığını savunan itikadî mezhebin adı olmuştur." },
          { t: "Kerbelâ Kırılması", d: "Hz. Hüseyin'in şehit edilmesi, Şîî bilincin vicdanını, hüzün kültürü ve itikadî harcını oluşturan ana dönüm noktasıdır." },
          { t: "İmamet = İman Esası", d: "Şîa'da imamet siyasi makam değil, dinin aslî rüknüdür; nass/tayin, ismet, ilahi ilim ve gaybet/rec'at üzerine kuruludur." },
          { t: "İki Paradigma", d: "Sünnîlik imameti kamusal düzen için fıkhî bir mesele sayar; Şîa onu peygamberliğin ilmi ve manevi devamı kabul eder." }
        ],
        concepts: [
          { term: "Şîa", def: "Arapçada 'taraftar, destekçi'. İlk dönemlerde siyasi aidiyet iken Kerbelâ sonrası itikadî mezhebe evrilmiştir." },
          { term: "Râfıza", def: "'Terk edenler'. Zeyd b. Ali'nin isyanında kendisini terk eden gruba verilen isim; aşırı Şiîler için kullanılmıştır." },
          { term: "Gadir-i Hum", def: "Veda Haccı dönüşü Hz. Ali'nin elinin kaldırılması olayı; Şîa'ya göre açık ilahi tayin ve vasiyettir." },
          { term: "Nass ve Tayin", def: "İmametin seçime bırakılmayıp Cenab-ı Hak tarafından belirlenmesi ve Peygamber'in bunu ilan etmesi." },
          { term: "İsmet", def: "İmamların tıpkı peygamberler gibi büyük-küçük her türlü günah ve hatadan ilahi olarak korunmuş olması." },
          { term: "Ledünnî İlim", def: "İmamların kesbî değil, Allah tarafından kalplerine ilham edilen hususi bilgisi; Kur'an'ın batınî hakikatlerini bilirler." },
          { term: "Gaybet", def: "12. İmam'ın gizleniş hali. Gaybet-i Suğrâ (aracılar) ve Gaybet-i Kübrâ (bugüne uzanan büyük gizlilik) olarak ikiye ayrılır." },
          { term: "Rec'at", def: "12. İmam'ın kıyametten önce Mehdi olarak yeryüzüne geri dönmesi ve adaleti tesis etmesi inancı." }
        ],
        compare: {
          left: {
            title: "SÜNNÎ İMAMET",
            points: [
              { k: "Mahiyet", v: "Amelî/fıkhî yönetim meselesi; iman esası değildir." },
              { k: "Belirleme", v: "Seçim, şûrâ ve biat." },
              { k: "Lider", v: "Masum değildir; adalet sınırları içinde itaat." },
              { k: "İlim", v: "İçtihat ve kurumsal birikim." }
            ]
          },
          right: {
            title: "ŞÎÎ İMAMET (İsnaaşeriyye)",
            points: [
              { k: "Mahiyet", v: "İmanın ve akaidin temel şartı; aslî rükn." },
              { k: "Belirleme", v: "İlahi nass ve tayin." },
              { k: "Lider", v: "Masum; hatasız ve yanılmaz." },
              { k: "İlim", v: "İlahi/ledünnî varislik ilmi." }
            ]
          }
        },
        timeline: [
          { year: "Siyasi", name: "Taraftarlık", d: "Hz. Ali'nin ilmi yetkinliği ve Haşimoğulları soyundan oluşu; destek siyasi ve insani bir tercihti." },
          { year: "61 H", name: "Kerbelâ", d: "Hz. Hüseyin ve 70'i aşkın aile ferdi katledildi; İslam toplumunda derin infial ve vicdan azabı." },
          { year: "Tevvâbûn", name: "Tövbe Hareketi", d: "Kûfe kitlelerindeki suçluluk duygusu, intikam amacıyla canlarını feda eden bir hareketi doğurdu." },
          { year: "Muhtar", name: "İtikadîleşme", d: "Ehlibeyt sevgisi kutsallık, ezilmişlik ve adalet arayışıyla donatılarak itikatlaştırıldı." }
        ],
        factors: {
          items: [
            { side: "ic", t: "Nass ve Tayin", d: "İmamet seçime bırakılamaz; Cenab-ı Hak Peygamber'den sonraki imamı bizzat belirlemiştir. Gadir-i Hum buna delil sayılır." },
            { side: "ic", t: "İsmet (Masumiyet)", d: "İmamlar peygamberler gibi her türlü günah ve hatadan korunmuştur; aksi hâlde rehberliğe güven kalmaz." },
            { side: "ic", t: "İlahi İlim", d: "İmamların ilmi kesbî değil ledünnîdir; Kur'an'ın hem zahirî hem batınî anlamlarını yalnız masum imamlar bilir." },
            { side: "dis", t: "Gaybet", d: "12. İmam küçük yaşta gizlenmiştir; önce aracılar, ardından büyük gizlilik dönemi başlamıştır." },
            { side: "dis", t: "Rec'at", d: "12. İmam ölmemiştir; kıyamete yakın Mehdi olarak dönüp dünyayı adaletle dolduracaktır." }
          ]
        },
        quiz: [
          { q: "Şîa teolojisine göre Hz. Ali'nin imametinin meşruiyet dayanağı nedir?",
            options: ["Ashabın şûrada oy birliğiyle karar alması", "Gadir-i Hum'daki ilahi nass ve tayin", "Kûfelerin biat mektubu yazması"],
            answer: 1,
            why: "Şîa sistematiği insan seçimine değil, ilahi tayine (nass) dayanır; Gadir-i Hum bunun merkezî delilidir." },
          { q: "İmamet doktrininin dört temel taşı hangileridir?",
            options: ["Nass, İsmet, İlahi İlim, Gaybet/Rec'at", "Kader, Sıfat, İrade, Meşruiyet", "Biat, Şûrâ, İcma, Kıyas"],
            answer: 0,
            why: "Şîî imamet doktrini nass/tayin, ismet, ledünnî ilim ve gaybet/rec'at üzerine kurulmuştur." },
          { q: "Gaybet-i Kübrâ ne anlama gelir?",
            options: ["12. İmam'ın ölümü", "Araçılar vasıtasıyla cemaatle iletişimin sürdüğü dönem", "12. İmam'ın bugüne uzanan büyük gizlilik dönemi"],
            answer: 2,
            why: "Gaybet-i Suğrâ aracılar dönemidir; Kübrâ ise 12. İmam'ın gizliliğinin bugüne uzanan evresidir." }
        ]
      },
      "6": {
        title: "Günümüze Ulaşan Şiî Kollar: Zeydiyye ve İsmailiyye",
        labels: { compare: "İmamet Şartları", matrix: "Şiî kollar matrisi", tree: "İsmailiyye şubeleri", quiz: "Pekiştirme testi", concepts: "Kavramlar", timeline: "Zeydiyye ve İsmailiyye serüveni" },
        takeaways: [
          { t: "Zeydiyye Mutedilliği", d: "Gaybeti reddeden, alim ve cesur imamın kılıçla alenen ortaya çıkmasını şart koşan; Sünnî fıkha en yakın Şiî koldur." },
          { t: "Meftûlün İmameti", d: "Eftal (daha üstün) varken Meftûl'ün imameti geçerlidir; Zeydiyye ilk iki halifeyi tekfir etmemiştir." },
          { t: "Zâhir-Bâtın", d: "İsmailiyye'ye göre şeriat kabuktur; asıl değer masum imamın ta'limiyle ulaşılan bâtınî özdür." },
          { t: "Yedili Devir", d: "Tarih 7 Nâtık peygamber ve suskun yardımcıları (Sâmit) üzerinden dönemselleştirilir; son devir Muhammed b. İsmail'dir." }
        ],
        concepts: [
          { term: "Zeydiyye", def: "Zeyd b. Ali'nin isyanıyla doğmuş; gaybet ve masumiyeti reddeden, kılıçla hurucu şart koşan mutedil Şiî ekol." },
          { term: "Râfıza", def: "Zeyd'in ilk iki halife hakkındaki olumlu görüşünü beğenmeyip onu terk eden radikal grup; 'terk edenler' anlamına gelir." },
          { term: "Kılıçla Huruç", def: "Zeydiyye'de imametin şartı: alim, takva sahibi ve cesur adayın kılıcıyla alenen ortaya çıkıp imametini ilan etmesi." },
          { term: "Meftûlün İmameti", def: "Eftal (daha üstün) aday varken daha az üstün olanın (Meftûl) beyat alması durumunda imametinin geçerli olması." },
          { term: "İsmailiyye", def: "6. İmam Ca'fer es-Sâdık'ın büyük oğlu İsmail'in soyundan imameti savunan; Bâtıniyye ve Ta'limiyye de denilen ekol." },
          { term: "Ta'lim", def: "Kur'an ve hadislerin bâtınî hakikatlerinin ancak masum imamın öğretmesiyle öğrenilebileceği ilkesi." },
          { term: "Nâtık ve Sâmit", def: "Her devirde şeriat getiren konuşan peygamber (Nâtık) ve bâtınî anlamı açıklayan suskun yardımcı (Sâmit/Asas)." },
          { term: "Nizârî ve Müsta'lî", def: "Fatımî halifesinin ölümü sonrası oğulları Nizâr ve Müsta'lî etrafında ayrışan İsmailiyye kolları." }
        ],
        compare: {
          left: {
            title: "ZEYDİYYE",
            points: [
              { k: "İmamet Şartı", v: "Alim, takva, kılıçla huruç." },
              { k: "Gaybet", v: "Yok; imam aşikâr olmalıdır." },
              { k: "Masumiyet", v: "Reddedilir; imam hata yapabilir." },
              { k: "Soy", v: "Hasan veya Hüseyin soyundan." },
              { k: "Fıkha Yakınlık", v: "Hanefî/Kûfe ekolüne çok yakın." }
            ]
          },
          right: {
            title: "İSMAİLİYYE",
            points: [
              { k: "İmamet Şartı", v: "İsmail soyundan; bâtınî bilginin kaynağı." },
              { k: "Gaybet", v: "Nizârîlerde sürekli imam; Müsta'lîlerde dâî." },
              { k: "Masumiyet", v: "Masum otorite; ta'lim yetkisi." },
              { k: "Soy", v: "İsmail b. Ca'fer es-Sâdık soyundan." },
              { k: "Metodoloji", v: "Zâhir-bâtın; ta'lim merkezli." }
            ]
          }
        },
        timeline: [
          { year: "122/740", name: "Zeyd b. Ali", desc: "Emevî zulme karşı isyan; ilk iki halifeyi hayırla anması Râfıza'nın ayrılmasına yol açtı." },
          { year: "Fatımî", name: "İsmailiyye Zirvesi", desc: "Kuzey Afrika ve Mısır'da kurulan Fatımî Devleti ile siyasi gücün zirvesine ulaşıldı." },
          { year: "Alamut", name: "Hasan el-Sabbah", desc: "Nizârî hattın merkez üssü; aşırı bâtınî yorumlarla anılan bir dönem." },
          { year: "Bugün", name: "Günümüz Coğrafyası", desc: "Zeydiyye ağırlıklı Yemen'de; İsmailiyye Nizârî (Ağa Han) ve Müsta'lî (Bohralar) kollarıyla yaşar." }
        ],
        matrix: {
          rowTerm: "Kol",
          hint: "Şiî kollarda imamet şartları. Mobilde tabloyu yana kaydırın.",
          axes: ["İmam Sayısı", "Atama", "Gaybet/Masumiyet"],
          rows: [
            { label: "İsnaaşeriyye", cells: ["12 ile sınırlı", "Nass ve tayin", "Gaybet var; imamlar masum"] },
            { label: "Zeydiyye", cells: ["Sınırsız", "Kılıçla huruç; nass şart değil", "Gaybet ve masumiyet reddedilir"] },
            { label: "İsmailiyye", cells: ["Kesintisiz zincir", "Babadan oğula nass", "Masum otorite; bâtınî yetki"] }
          ]
        },
        tree: [
          { label: "İsnaaşeriyye", desc: "12 İmam Şiiliği; günümüz Şiî nüfusunun kahir ekseriyeti. Hüseyin soyundan kesintisiz devam eder.",
            branches: [{ label: "İran, Irak, Azerbaycan", d: "Merkezî coğrafyalar; meşrutî-imamet yapısı ve güçlü fıkhi kurumlar." }] },
          { label: "Zeydiyye", desc: "Mutedil; gaybet yok, huruç şart, Meftûl caiz. Bugün ağırlıklı olarak Yemen'de.",
            branches: [{ label: "Yemen İmametleri", d: "Tarihte Yemen'de imamet devletleri kurmuş; Sünnî fıkha yakınlığını korumuştur." }] },
          { label: "İsmailiyye", desc: "Bâtınî ve ta'limî ekol; Yedili Devir anlayışı ve zâhir-bâtın metodolojisi.",
            branches: [{ label: "Nizârî", d: "Hasan el-Sabbah ve Alamut çizgisi; günümüzde 4. Ağa Han liderliğinde." },
                       { label: "Müsta'lî", d: "Hindistan ve Yemen'de Bohralar; dâî-i mutlak liderliğinde zâhirî şeriatı uygular." }] }
        ],
        quiz: [
          { q: "Hangi Şiî kolunda Meftûlün İmameti caiz görülmüş ve gaybet kesinlikle reddedilmiştir?",
            options: ["Zeydiyye", "İsmailiyye", "İsnaaşeriyye"],
            answer: 0,
            why: "Zeydiyye'de imam aşikâr olmalı ve kılıçla huruç etmelidir; Meftûlün imameti caizdir." },
          { q: "İsmailiyye'nin Yedili Devir anlayışında 7. devrin (son devrin) Nâtık'ı kimdir?",
            options: ["Hz. Muhammed", "Muhammed b. İsmail", "Hz. İsa"],
            answer: 1,
            why: "7. devir Muhammed b. İsmail ile başlar; o aynı zamanda Kaim/Mehdi olarak kabul edilir." },
          { q: "Zeydiyye'nin Sünnî fıkha yakın olmasının temel sebebi nedir?",
            options: ["Mu'tezilî tevhid ve adalet ilkelerinden etkilenmesi ve ilk iki halifeyi tekfir etmemesi", "Gaybet inancını koruması", "Kureyşizm şartını sürdürmesi"],
            answer: 0,
            why: "Zeyd'in ilk iki halife hakkında hayırdan başka söz söylememesi ve Mu'tezilî etki, mutedil çizgiyi belirlemiştir." }
        ]
      }
    }
  },

  "turk-dili-1": {
    title: "Türk Dili I İnteraktif Paneli",
    subtitle: "AÖF TÜR201U müfredatına uygun modüler analiz",
    labels: { timeline: "Tarihsel gelişim", matrix: "Cümle ögeleri matrisi", tree: "Alfabeler" },
    takeaways: [
      { t: "Dil, Kültür ve Düşünce", d: "Dil sesli bir işaretler sistemi ve kültürel hafızadır. Safir-Whorf varsayımına göre dil, konuşanının düşünme biçimini ve dünya algısını şekillendirir." },
      { t: "Tarihsel Katmanlar", d: "Türkçe, Hun Döneminden günümüze kesintisiz bir yazılı geleneğe sahiptir. Alfabe değişimlerinin ardında din ve kültür dönüşümleri yatar." },
      { t: "Yapı Bilgisi", d: "Türkçe sondan eklemeli bir dildir; Özne-Nesne-Yüklem dizilimi, ünlü-ünsüz uyumu ve kök-gövde-ek ilişkisi çözümlemenin temelini oluşturur." },
      { t: "Söz Varlığı ve Bilinç", d: "Deyim, atasözü, ağız ve ikilemeler dilin zenginliğini kurar; yozlaşma ve yabancılaşmaya karşı dil bilinci koruyucudur." }
    ],
    concepts: [
      { term: "Dil", def: "Düşünceyi aktarmaya yarayan sesli bir işaretler sistemi; toplumsal bir antlaşma, kültürel hafızanın taşıyıcısıdır." },
      { term: "Safir-Whorf Varsayımı", def: "Dil, konuşanının düşünme biçimini ve dünya algısını sınırlar ya da şekillendirir; her dil ayrı bir dünya görüşüdür." },
      { term: "Sondan Eklemeli", def: "Türkçenin yapı tipi; sözcüğün sonuna eklenen birimler anlam ve görev belirler. Söz dizimi Özne-Nesne-Yüklem şeklindedir." },
      { term: "Kök", def: "Sözcüğün çekim veya yapım eki olmadan taşıyan, en küçük anlamlı birimidir." },
      { term: "Gövde", def: "Kökün yapım eki almasıyla oluşan, türetme işlemlerinin dayanağı birimdir (basit gövde veya türemiş sözcük)." },
      { term: "Yapım Eki", def: "Yeni sözcükler türetmeye yarar; işlek (canlı) ve fosilleşmiş (ölü) ekler olarak ikiye ayrılır." },
      { term: "Çekim Eki", def: "Sözcükler arası ilişki kurar. Ad çekim ekleri (durum, iyelik, çoğul...) ve eylem çekim ekleri (eylemsiler dâhil) vardır." },
      { term: "Deyim", def: "Kalıplaşmış, aktarılmış bir olaya ya da duruma atıfla anlatım gücü yüksek söz öbeğidir; cümle içinde tek öge gibi davranır." },
      { term: "Atasözü", def: "Deneyime dayanan, yargı bildiren ve öğüt veren kalıplaşmış cümleli anlatımlardır; halkbilimsel hazine sayılır." },
      { term: "Argo", def: "Bir topluluk içinde, gündelik dilin yerine kullanılan; zamanla yayılan ve kimi zaman sözlü kültürün parçası olan özel söz varlığıdır." }
    ],
    timeline: [
      { year: "MS 5-10", name: "Eski Türkçe Dönemi", desc: "Orhun-Göktürk Yazıtları bu dönemin en önemli yazılı belgeleridir; ilk Türk yazıtları sayılır." },
      { year: "11. yy", name: "Orta Türkçe Dönemi", desc: "Karakahanlılar çağında Divânü Lugâti't-Türk ve Kutadgu Bilig gibi klasik eserler kaleme alınmıştır." },
      { year: "13-19. yy", name: "Osmanlı Türkçesi", desc: "Arap ve Fars etkilerinin yoğunlaştığı dönem; divan edebiyatı ve resmî dil bu yapı içinde gelişmiştir." },
      { year: "19. yy", name: "Yeni Lisan Hareketi", desc: "Dilde sadeleşme ve gündelik dile dönüş arayışı; Tanzimat şair ve yazarlarıyla ivme kazanmıştır." },
      { year: "1928", name: "Harf Devrimi", desc: "Latin alfabesine geçiş; okuma yazma oranının artışı ve çağdaş Türkiye Türkçesinin kurumsallaşması." },
      { year: "Bugün", name: "Çağdaş Türkiye Türkçesi", desc: "Türkiye, Kıbrıs ve yurt dışı diasporada konuşulan; bilim ve teknoloji dili olarak gelişen standart dil." }
    ],
    matrix: {
      rowTerm: "Öğe",
      hint: "Cümlenin temel, tamamlayıcı ve bağımsız ögeleri. Mobilde tabloyu yana kaydırın.",
      axes: ["Görevi", "Sorulacak Soru", "Örnek"],
      rows: [
        { label: "Yüklem", cells: ["Cümlenin çekirdeği; olgu, yargı veya tasarı bildirir.", "Cümlede ne anlatılıyor, ne söyleniyor?", "Öğrenciler sınava hazırlandı."] },
        { label: "Özne", cells: ["Yüklemdeki işi, eylemi ya da durumu gerçekleştiren temel öğe.", "Kim? Ne yaptı?", "Öğrenciler sınava hazırlandı."] },
        { label: "Nesne", cells: ["Eylemin doğrudan etkilendiği, işin düştüğü tamamlayıcı öğe.", "Ne(e)? Kimi? Ne(yi)?", "Öğrenciler sınavı hazırladı."] },
        { label: "Yer Tamlayıcısı", cells: ["Eylemin gerçekleştiği yeri, yönü belirten dolaylı tümleç.", "Nerede? Nereye? Nereden?", "Öğrenciler salonda hazırlandı."] },
        { label: "Zarf Tümleci", cells: ["Eylemin nasıl, ne zaman, niçin olduğunu belirten tamamlayıcı.", "Nasıl? Ne zaman? Niçin?", "Öğrenciler özenle hazırlandı."] }
      ]
    },
    tree: [
      { label: "Köktürk", desc: "Türklerin bilinen ilk alfabesi; Orhun Yazıtları'nda kullanılmıştır. Runik karakterlerden oluşur.",
        branches: [{ label: "Orhun Yazıtları", d: "Bilge Kağan ve Kül Tigin anıtları; Eski Türkçe'nin en anıtsal yazılı belgeleridir." }] },
      { label: "Uygur", desc: "Soğd alfabesi temel alınarak geliştirilmiştir; Maniheizm ve Budizm metinlerinin yazımında kullanılmıştır.",
        branches: [] },
      { label: "Arap", desc: "İslam'ın kabulüyle kullanılmaya başlanmıştır; sesli harf bulunmaması okuma-yazmayı güçleştirmiştir.",
        branches: [{ label: "Osmanlı Türkçesi", d: "Arap alfabesiyle yüzyıllarca yazılan resmî ve edebî dil; Yeni Lisan ile sadeleşme tartışmaları başlamıştır." }] },
      { label: "Kiril", desc: "19. yüzyıldan itibaren Kuzey Türkçesi (Kıpçak) lehçelerinde ve Sovyet döneminde yaygınlaşmıştır.",
        branches: [] },
      { label: "Latin", desc: "1928 Harf Devrimi ile Türkiye Türkçesine geçirilmiştir; okuma yazma seferberliğinin ana aracı olmuştur.",
        branches: [{ label: "Kurumsallaşma", d: "Türk Dil Kurumu (1932) ve Türk Tarih Kurumu ile dil ve tarih bilinci devlet eliyle güçlendirilmiştir." }] }
    ],
    chapters: {
      "1": {
        title: "Dil, Kültür ve Dünya Dilleri",
        labels: { compare: "Eklemeli vs Çekimli", timeline: "Dilin bilimsel özellikleri", factors: "Yapı ve köken sınıflandırması", quiz: "Pekiştirme testi", concepts: "Kavramlar" },
        takeaways: [
          { t: "Dil Bir Mimardır", d: "Dil pasif bir araç değil, dünyayı algıladığımız ve kimliğimizi kurduğumudur. Ergin'e göre gizli antlaşmalar sistemi, Bangoğlu'na göre sesli işaretler sistemidir." },
          { t: "Üç Yapı Türü", d: "Eklemeli (Türkçe), çekimli (Arapça/İngilizce) ve yalınlayan (Çince) diller; kökün korunup korunmamasıyla ayrışır." },
          { t: "Ural-Altay Bağı", d: "Türkçe Altay kolunun en zengin temsilcisidir; Moğolca, Mançu-Tunguzca, Korece ve Japonca ile akrabadır." },
          { t: "Sapir-Whorf", d: "Dil, düşünme biçimini ve dünya algısını şekillendirir; her dil ayrı bir dünya görüşüdür." }
        ],
        concepts: [
          { term: "Dil (Ergin)", def: "Temeli bilinmeyen zamanlarda atılmış gizli bir antlaşmalar sistemi ve kendine özgü kanunları olan canlı bir varlıktır." },
          { term: "Dil (Bangoğlu)", def: "İnsanın kendini ifade etmek için kullandığı sesli bir işaretler sistemidir." },
          { term: "Eklemeli Dil", def: "Sözcük kökleri sabittir; dil bilgisel ulamlar eklerle karşılanır. Türkçe, Moğolca, Farsça, Macarca." },
          { term: "Çekimli Dil", def: "Çekim ve türetmede kök bükümlenir, değişir. Arapça (k-t-b kökünden mektup, katip), İngilizce." },
          { term: "Yalınlayan Dil", def: "Ek alınmaz, çekimlenmez; anlamı söz sırası ve tonlama belirler. Çince, Tibetçe." },
          { term: "Sapir-Whorf Hipotezi", def: "Dil, konuşanının düşünme biçimini ve dünya algısını sınırlar ya da şekillendirir." },
          { term: "Gizli Anlaşma", def: "Yansıma sözcükler dışında sözcüğün sesi ile nesnesi arasında nedensellik yoktur; toplumsal uzlaşıya dayanır." },
          { term: "Altay Ailesi", def: "Türkçe, Moğolca, Mançu-Tunguzca, Korece ve Japonca'yı kapsayan köken grubu; Türkçe en zengin temsilcidir." }
        ],
        compare: {
          left: {
            title: "EKLEMELİ (Türkçe)",
            points: [
              { k: "Kök", v: "Sabit kalır: göz-lük-çü." },
              { k: "Yapı", v: "Sondan eklemeli (bitişken)." },
              { k: "Örnek", v: "ev-ler-im-iz-den." }
            ]
          },
          right: {
            title: "ÇEKİMLİ (Arapça/İngilizce)",
            points: [
              { k: "Kök", v: "Bükümlenir, değişir: k-t-b." },
              { k: "Yapı", v: "Çekim ve ön ek ağırlıklı." },
              { k: "Örnek", v: "mektup, katip, mektep." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Ses Temellilik", desc: "Dil yazıdan çok eski; temelinde sesli işaretler yatar. Zihin duyduğu ses dizilimlerini anlamlandırır." },
          { year: "2", name: "Canlılık", desc: "Dil statik değildir; yeni kavramlar kazanır, sözcükler yiter veya dönüşür." },
          { year: "3", name: "Nedensizlik", desc: "Ses ile anlam arasındaki bağ toplumsal uzlaşıdır; yalnız yansıma sözcükleri istisnadır." },
          { year: "4", name: "Toplumsallık", desc: "Dil, bir yığını ortak bilinç, kültür ve ulusal kimlik kazandıran en birincil bağdır." }
        ],
        factors: {
          items: [
            { side: "ic", t: "Yapı Ölçütü", d: "Diller eklemeli, çekimli veya yalınlayan olarak; kökün korunup korunmamasına göre ayrılır." },
            { side: "ic", t: "Köken Ölçütü", d: "Dil aileleri akrabalık bağlarına göre kurulur; Türkçe Ural-Altay'ın Altay kolundadır." },
            { side: "dis", t: "Kültürel Etkileşim", d: "Dil, toplumun tarihsel, sosyal ve teknolojik gelişmelerinin doğrudan yansımasıdır." },
            { side: "dis", t: "Kimlik İnşası", d: "Dil, ulusal kimliğin ve kültürel sürekliliğin en güçlü taşıyıcısıdır." }
          ]
        },
        quiz: [
          { q: "Türkçenin yapı (biçim bilgisi) bakımından hangi gruba girdiği gösterilir?",
            options: ["Çekimli (bükümlü)", "Yalınlayan (tek heceli)", "Eklemeli (bitişken)"],
            answer: 2,
            why: "Türkçe kökleri sabit tutup eklerle anlam üreten eklemeli (sondan eklemeli) bir dildir." },
          { q: "Arapça k-t-b kökünden mektup, katip, mektep türetmek hangi yapı özelliğine örnektir?",
            options: ["Eklemeli yapı", "Çekimli (bükümlü) yapı", "Yalınlayan yapı"],
            answer: 1,
            why: "Çekimli dillerde kök bükümlenir; aynı kökten farklı türevler kökün değişmesiyle oluşur." },
          { q: "Sapir-Whorf hipotezi neyi savunur?",
            options: ["Dil pasif bir araçtır", "Dil, düşünme biçimini ve dünya algısını şekillendirir", "Dil yalnız yazıyı ifade eder"],
            answer: 1,
            why: "Hipoteze göre dil sınırlayıcı veya şekillendirici bir etki yapar; her dil ayrı bir dünya görüşüdür." }
        ]
      },
      "2": {
        title: "Türk Dilinin Tarihsel Gelişimi ve Alfabeler",
        labels: { timeline: "Tarihsel dönemler", tree: "Alfabeler", matrix: "Dönemler matrisi", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Yazı dili kolları" },
        takeaways: [
          { t: "İki Bin Yıllık Yolculuk", d: "Çoğur Yazıtı (687-692) bilinen ilk belgedir; Sümerce denklemleri kökleri MÖ 4000'lere kadar uzatır." },
          { t: "13 Alfabe", d: "Köktürk'ten Latin'e 13 ana alfabe kullanılmıştır; her geçiş din, kültür veya siyasi değişimle olmuştur." },
          { t: "Üç Yazı Dili Kolu", d: "13. yüzyıldan sonra Kuzey (Kıpçak), Doğu (Çağatay) ve Batı (Oğuz) kolları ayrışmıştır." },
          { t: "Yeni Lisan", d: "Genç Kalemler'den TDK'ya uzanan sadeleşme, çağdaş Türkiye Türkçesinin temelini atmıştır." }
        ],
        concepts: [
          { term: "Çoğur Yazıtı", def: "Türkçeye ait bilinen ilk yazılı belge; MS 687-692 yıllarına tarihlenir." },
          { term: "Orhun Yazıtları", def: "Tonyukuk, Kül Tigin ve Bilge Kağan adına dikilen; Eski Türkçe'nin en gelişmiş edebi ürünleridir." },
          { term: "Kutadgu Bilig", def: "Yusuf Has Hacip'in eseri; Orta Türkçe dönemin başyapıtlarından biridir." },
          { term: "Divanu Lugati't-Türk", def: "Kaşgarlı Mahmud'un Türkçe-Arapça sözlüğü; Karahanlı dönemin anıtsal eseridir." },
          { term: "Codex Cumanicus", def: "Kıpçak Türkçesinin en önemli eseri; Batılılarca ilk Latin alfabesi kullanımı." },
          { term: "Yeni Lisan", def: "Genç Kalemler dergisinde başlayan sadeleşme hareketi; Ömer Seyfettin ve Ziya Gökalp öncülüğünde." },
          { term: "Harf İnkılabı", def: "1 Kasım 1928; Bakü Türkoloji Kongresi tavsiyeleri ve Atatürk önderliğinde Latin alfabesine geçiş." },
          { term: "Müyessiretü'l-Ulum", def: "Bergamalı Kadri'nin 1530'da yazdığı ilk Oğuz Türkçesi grameri." }
        ],
        timeline: [
          { year: "Hun", name: "İlk İzler", desc: "Çin kaynaklarında Çince söyleyişli kelimeler ve iki cümle olarak ilk Türkçe izleri." },
          { year: "5-10. yy", name: "Eski Türkçe", desc: "Köktürk (Orhun) ve Uygur safhaları; ilk hacimli yazılı belgeler bu dönemde." },
          { year: "11-15. yy", name: "Orta Türkçe", desc: "İslamiyet'le Karahanlılar; Kutadgu Bilig ve Divanu Lugati't-Türk gibi başyapıtlar." },
          { year: "13. yy+", name: "Üç Kola Ayrılış", desc: "Kuzey (Kıpçak), Doğu (Çağatay) ve Batı (Oğuz) yazı dili kollarının oluşumu." },
          { year: "1928", name: "Harf İnkılabı", desc: "Latin alfabesine geçiş; okuma yazma seferberliği ve çağdaş dilin kurumsallaşması." }
        ],
        matrix: {
          rowTerm: "Alfabe",
          hint: "Türklerin kullandığı ana alfabeler. Mobilde tabloyu yana kaydırın.",
          axes: ["Harf Sayısı", "Dönem", "Özellik"],
          rows: [
            { label: "Köktürk", cells: ["38", "5-8. yy", "İlk milli alfabe; taşa kazınır; sağdan sola"] },
            { label: "Uygur", cells: ["18", "8-15. yy", "Soğd kökenli; diplomasi dili olarak uzun süre"] },
            { label: "Arap", cells: ["28", "11-20. yy", "İslamiyet sonrası bin yıl; ünlü sistemi yetersiz"] },
            { label: "Kiril", cells: ["33", "20. yy", "Sovyet yönetiminde zorunlu kılınmış"] },
            { label: "Latin", cells: ["29", "1928-", "Ses yapısına en uygun; Harf İnkılabı ile"] }
          ]
        },
        tree: [
          { label: "Köktürk", desc: "38 harf; taşa kazınmaya elverişli; Orhun Yazıtları bu alfabedir.",
            branches: [{ label: "Tonyukuk", d: "Bilge Kağan dönemindeki ünlü devlet adamı; kendi adına dikilen yazıttır." }] },
          { label: "Uygur", desc: "Soğd alfabesinden geliştirilmiş 18 harf; Budizm ve Maniheizm metinlerinde.",
            branches: [] },
          { label: "Arap", desc: "İslamiyet'le kabul; geniş edebi külliyatın oluşmasını sağlamıştır.",
            branches: [{ label: "Osmanlı", d: "Divan edebiyatı ve resmî dil; Arapça-Farsça ögeler yoğunlaşır." }] },
          { label: "Latin", desc: "Codex Cumanicus'ta ilk kullanım; 1928'de Türkiye'ye geçiş.",
            branches: [{ label: "TDK", d: "1932'de kuruldu; Öz Türkçe terim çalışmalarıyla dilin bilim dili oluşu." }] }
        ],
        quiz: [
          { q: "Türkçenin bilinen ilk yazılı belgesi hangisidir?",
            options: ["Orhun Yazıtları", "Çoğur Yazıtı", "Kutadgu Bilig"],
            answer: 1,
            why: "Çoğur Yazıtı MS 687-692'ye tarihlenir; Orhun Yazıtları bilinen ilk hacimli belgelerdir." },
          { q: "Türk yazı dili 13. yüzyıldan sonra hangi üç ana kola ayrılmıştır?",
            options: ["Kuzey, Doğu, Batı", "İç, Dış, Orta", "Eski, Orta, Yeni"],
            answer: 0,
            why: "Kıpçak (Kuzey), Çağatay (Doğu) ve Oğuz (Batı) kolları 13. yüzyıldan itibaren ayrışmıştır." },
          { q: "Harf İnkılabı hangi yıl ve hangi kongrenin tavsiyeleriyle olmuştur?",
            options: ["1926 Bakü Türkoloji Kongresi önerileriyle 1928", "1932 TDK kurulmasıyla", "1908 II. Meşrutiyet ile"],
            answer: 0,
            why: "Bakü Türkoloji Kongresi (1926) tavsiyeleri esas alınarak 1 Kasım 1928'de Latin alfabesine geçilmiştir." }
        ]
      },
      "3": {
        title: "Türkçenin Ses Yapısı ve Ses Özellikleri",
        labels: { timeline: "Ses olayları", factors: "Ses uyumları", quiz: "Pekiştirme testi", concepts: "Kavramlar", matrix: "Ses sınıflandırması" },
        takeaways: [
          { t: "Üç Boyutlu Ünlu Matrisi", d: "8 temel ünlü önlük/artlık, darlık/genişlik ve düzlük/yuvarlaklık eksenlerinde konumlanır." },
          { t: "Büyük Ünlü Uyumu", d: "İlk hecede art ünlü varsa sonraki heceler de art; ön ünlü varsa ön olmak zorundadır." },
          { t: "Küçük Ünlü Uyumu", d: "Dudak uyumu: düz ünlüden düz, yuvarlak ünlüden dar-yuvarlak veya düz-geniş ünlü gelir." },
          { t: "Ses Olayları", d: "Düşme, daralma, ötümlüleşme, ikizleşme, göçüşme gibi değişimler en az çaba yasasıyla açıklanır." }
        ],
        concepts: [
          { term: "Art Ünlü", def: "Dilin arkaya çekilmesiyle oluşan ünlüler: a, ı, o, u." },
          { term: "Ön Ünlü", def: "Dilin öne kaymasıyla oluşan ünlüler: e, i, ö, ü." },
          { term: "Büyük Ünlü Uyumu", def: "Bir sözcüğün tüm ünlülerinin art veya ön olması kuralı; Türkçenin en temel ses yasası." },
          { term: "Küçük Ünlü Uyumu", def: "Dudak kaslarını en az hareket ettirme kuralı: düz-düz, yuvarlak-dar-yuvarlak veya düz-geniş." },
          { term: "Ötümlü Ünsüz", def: "Ses tellerinin titreşmesiyle oluşan ünsüzler: b, c, d, g, ğ, j, l, m, n, r, v, y, z." },
          { term: "Ötümsüz Ünsüz", def: "Titreşimsiz oluşan ünsüzler: ç, f, h, k, p, s, ş, t." },
          { term: "Ünlü Düşmesi", def: "Konuşma hızıyla ünlünün kaybolması: ısıcak > sıcak, yalnız > yalnız, ne asıl > nasıl." },
          { term: "Göçüşme (Metatez)", def: "İki ünsüzün yer değiştirmesi: ekşi > eşki, yalnız > yanlış." }
        ],
        compare: {
          left: {
            title: "BÜYÜK ÜNLÜ UYUMU",
            points: [
              { k: "Eksen", v: "Önlük - Artlık (kalınlık-incelik)." },
              { k: "Kural", v: "İlk hece belirleyici; sonraki heceler uyar." },
              { k: "Örnek", v: "başkanlarımızdan (tümü art)." }
            ]
          },
          right: {
            title: "KÜÇÜK ÜNLÜ UYUMU",
            points: [
              { k: "Eksen", v: "Dudak uyumu." },
              { k: "Kural", v: "Düz→düz; yuvarlak→dar-yuvarlak veya düz-geniş." },
              { k: "İstisna", v: "o, ö sadece birinci hecede; kabuk, kavun tarihsel." }
            ]
          }
        },
        timeline: [
          { year: "Ünlü", name: "Düşme ve Daralma", desc: "Isıcak > sıcak (düşme); almayor > almıyor (daralma)." },
          { year: "Ünlü", name: "İncelme ve Yuvarlaklaşma", desc: "Yanı > yeni (ön damaksıllaşma); divar > duvar (yuvarlaklaşma)." },
          { year: "Ünsüz", name: "Ötümlüleşme", desc: "Git-er > gider; kör- > gör-; tiş > diş." },
          { year: "Ünsüz", name: "İkizleşme ve Düşme", desc: "Ana > anne (ikizleşme); ölig > ölü (Batı Türkçesinde düşme)." },
          { year: "Ünsüz", name: "Türeme ve Göçüşme", desc: "Mâ'i > mavi (türeme); ekşi > eşki (göçüşme)." }
        ],
        matrix: {
          rowTerm: "Ölçüt",
          hint: "Ünsüz seslerin dört boyutlu sınıflandırması. Mobilde tabloyu yana kaydırın.",
          axes: ["Ötümlü", "Ötümsüz"],
          rows: [
            { label: "Çift Dudak", cells: ["b, m", "p, f"] },
            { label: "Diş", cells: ["d, z, v", "t, s, ç"] },
            { label: "Damak", cells: ["g, ğ, l, r, n, y, j", "k, ş"] },
            { label: "Gırtlak", cells: ["-", "h"] }
          ]
        },
        factors: {
          items: [
            { side: "ic", t: "Büyük Ünlü Uyumu", d: "İlk hecedeki ünlünün art veya ön olması, sonraki tüm heceleri belirler." },
            { side: "ic", t: "Küçük Ünlü Uyumu", d: "Dudak kaslarının en az hareket etmesini hedefleyen iki temel kural (A ve B)." },
            { side: "dis", t: "En Az Çaba Yasası", d: "Ses değişimlerinin arkasında enerji tasarrufu ve boğumlanma kolaylığı yatar." },
            { side: "dis", t: "Komşu Ses Etkisi", d: "Yan yana gelen sesler birbirini ötümlüleştirir, ötümsüzleştirir veya yuvarlaştırır." }
          ]
        },
        quiz: [
          { q: "Türkçede art ünlüler hangileridir?",
            options: ["e, i, ö, ü", "a, ı, o, u", "a, e, o, ö"],
            answer: 1,
            why: "Dilin arkaya çekilmesiyle oluşan art (kalın) ünlüler a, ı, o, u'dur." },
          { q: "tüp-cü birleşiminin tüpçü olarak söylenmesi hangi ses olayıdır?",
            options: ["Ünsüz ikizleşmesi", "Ötümsüzleşme", "Ötümlüleşme"],
            answer: 1,
            why: "Ötümsüz ünsüzle biten sözcüğe ötümlü ek geldiğinde ek başındaki ünsüz ötümsüzleşir." },
          { q: "yalnız > yanlış değişimi hangi ses olayına örnektir?",
            options: ["Ünlü düşmesi", "Göçüşme (metatez)", "İkizleşme"],
            answer: 1,
            why: "Göçüşmede iki ses yer değiştirir; yalnız sözcüğünde l ve n yer değiştirmiştir." }
        ]
      },
      "4": {
        title: "Biçim Bilgisi, Ekler ve Sözcük Türetme",
        labels: { compare: "Yapım vs Çekim", timeline: "Türetme yolları", tree: "Çatı ekleri", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Ek kategorileri" },
        takeaways: [
          { t: "Biçim Bilgisi", d: "Sözcüklerin iç yapısını inceleyen bilim dalıdır; en küçük birim biçimbirim (morfem)dir." },
          { t: "Yapım ve Çekim", d: "Yapım ekleri yeni sözcük türetir; çekim ekleri anlam değiştirmeden dil bilgisel ilişki kurar." },
          { t: "Çatı Ekleri", d: "Eylemin özne-nesne ilişkisini düzenler: dönüşlü, edilgen, işteş, ettirgen." },
          { t: "Türkçe Legolar", d: "Kök + eklerle 'biçimlendirilemeyeceklerindendir' gibi yapılar kurulabilir." }
        ],
        concepts: [
          { term: "Biçimbirim (Morfem)", def: "Daha küçük birimlere ayrılamayan, ses ve yapı yönünden anlamlı veya görevli en küçük dil birimi." },
          { term: "Kök", def: "Sözcüğün biçim bilgisel bakımdan bölünemeyen en temel anlamlı çekirdeği: ak, git-, el." },
          { term: "Gövde", def: "Köke en az bir yapım eki getirilerek türetilen yeni yapı: geç- + -(i)t = geçit." },
          { term: "Taban", def: "Ekin eklendiği sözcük katmanı; kök de olabilir türemiş gövde de: göz (kök), gözlük (gövde)." },
          { term: "Yapım Eki", def: "Yeni anlamda veya türde sözcükler türeten ekler: -A, -An, -dirik, -Al, -ırga, -anak." },
          { term: "Çekim Eki", def: "Anlamı değiştirmeyen, cümle içinde geçici ilişki kuran görevsel birimler: durum, iyelik, kip, zaman." },
          { term: "Eylemsi", def: "Eylemleri sıfat, zarf veya isim yapan yargı bildirmeyen yapılar: -arak, -an, -ma, -mak." },
          { term: "Çatı Eki", def: "Eylemin özne ve nesne ile ilişkisini düzenleyen ekler: dönüşlü, edilgen, işteş, ettirgen." }
        ],
        compare: {
          left: {
            title: "YAPIM (TÜRETİM) EKLERİ",
            points: [
              { k: "İşlev", v: "Yeni sözcük veya anlam türetir." },
              { k: "Sonuç", v: "Sözcük türü veya anlamı değişir." },
              { k: "Örnek", v: "göz + -lük = gözlük; geç + -it = geçit." }
            ]
          },
          right: {
            title: "ÇEKİM EKLERİ",
            points: [
              { k: "İşlev", v: "Cümle içinde geçici ilişki kurar." },
              { k: "Sonuç", v: "Anlam ve tür korunur; görev değişir." },
              { k: "Örnek", v: "ev-im, ev-de, ev-i-n-e; git-ti, git-miş." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Biçimbirim", desc: "Bağımsız (çocuk, ev) ve bağımlı (-lar, -e, -ti) olarak ikiye ayrılır." },
          { year: "2", name: "Kök ve Gövde", desc: "Kök bölünemez çekirdek; gövde kök + yapım eki ile türemiş yapıdır." },
          { year: "3", name: "Yapım Ekleri", desc: "Addan ad, addan eylem, eylemden ad ve eylemden eylem (çatı) olarak dört kategori." },
          { year: "4", name: "Çekim Ekleri", desc: "Durum, iyelik, çoğul (ad) ve kip, zaman, kişi (eylem) ekleri; eylemsiler." }
        ],
        factors: {
          items: [
            { side: "ic", t: "Addan Ad Yapma", d: "-A (göze), -An (oğlan), -dirik (boyunduruk)." },
            { side: "ic", t: "Addan Eylem Yapma", d: "-A (kana-), -Al (çoğal-), -ırga (esirge-)." },
            { side: "dis", t: "Eylemden Ad Yapma", d: "-anak (görenek), -agan (durağan), -mur (yağmur)." },
            { side: "dis", t: "Çatı Ekleri", d: "Eylemin özne-nesne ilişkisini düzenleyen dönüşlü, edilgen, işteş, ettirgen ekler." }
          ]
        },
        tree: [
          { label: "Dönüşlü (-l, -n)", desc: "Eylem özne tarafından yapılır ve özne bundan etkilenir; nesne almaz.",
            branches: [{ label: "yıka- → yıkan-", d: "Yıkama eylemi özneyi de etkiler; dönüşlü çatı." }] },
          { label: "Edilgen (-l, -n)", desc: "Gerçek özne cümleden çıkar; etkilenen nesne sözde özne olur.",
            branches: [{ label: "boya- → boyan-", d: "Kim boyadı belirsiz; odalar boyandı." }] },
          { label: "İşteş (-ş, -iş)", desc: "Eylem birden fazla özne tarafından birlikte veya karşılıklı yapılır.",
            branches: [{ label: "gör- → görüş-", d: "İki veya daha fazla taraf karşılıklı görür." }] },
          { label: "Ettirgen (-tir, -r, -t)", desc: "Eylem başkasına yaptırılır veya geçişsiz eylem geçişli hâle gelir.",
            branches: [{ label: "kes- → kestir-", d: "Kesme eylemi başkasına yaptırılır." }] }
        ],
        quiz: [
          { q: "evlilikten sözcüğü kaç biçimbirimden oluşur?",
            options: ["Üç: ev-lik-ten", "Dört: ev-li-lik-ten", "İki: ev-lilik"],
            answer: 1,
            why: "ev - li - lik - ten şeklinde dört biçimbirim vardır." },
          { q: "Yapım ekleri ile çekim eklerinin temel farkı nedir?",
            options: ["Yapım anlam değiştirir, çekim değiştirmez", "İkisi de anlam değiştirir", "Çekim yeni sözcük türetir"],
            answer: 0,
            why: "Yapım ekleri yeni sözcük/ anlam türetir; çekim ekleri yalnız cümle içi ilişki kurar." },
          { q: "gör- > görüş- dönüşümü hangi çatı ekine örnektir?",
            options: ["Dönüşlü", "İşteş", "Ettirgen"],
            answer: 1,
            why: "İşteş çatı eylemin birden fazla özne tarafından birlikte yapılmasını gösterir." }
        ]
      },
      "5": {
        title: "Cümle Bilgisi, Ögeler ve Cümle Türleri",
        labels: { matrix: "Cümle ögeleri matrisi", timeline: "Cümle türleri", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Sözcük öbekleri", compare: "Basit vs Bileşik" },
        takeaways: [
          { t: "Yüklem ve Özne", d: "Cümlenin iki temel taşıdır; diğer tüm ögeler yüklemle ilişki üzerinden görev kazanır." },
          { t: "Özel Sorular", d: "Her ögenin yükleme ayrı bir sorusu vardır: Kim? Neyi? Nerede? Nasıl? Ne zaman?" },
          { t: "Sözcük Öbeği", d: "Birden çok sözcüğün tek bir gramer işlevi görmesiyle oluşan yargısız dil birimidir." },
          { t: "Cümle Türleri", d: "Yapı, yüklem, öge dizilişi ve anlam olmak üzere dört ana eksende sınıflandırılır." }
        ],
        concepts: [
          { term: "Yüklem", def: "Cümlenin merkez çekim kuvveti; iş, oluş, hareket, duygu veya yargı bildiren çekimli öge." },
          { term: "Özne", def: "Yüklemde gösterilen kılışı gerçekleştiren öge; Kim? Ne? sorularıyla bulunur." },
          { term: "Belirtili Nesne", def: "-ı/-i/-u/-ü yükleme ekini alır; Neyi? Kimi? sorularına yanıt verir." },
          { term: "Belirtiz Nesne", def: "Yalın durumdadır; Ne? sorusuyla bulunur." },
          { term: "Yer Tamlayıcısı", def: "-e, -de, -den durum eklerini alır; Nerede? Nereye? Nereden? sorularıyla." },
          { term: "Zarf Tümleci", def: "Yüklemi zaman, durum, miktar, yön, sebep veya vasıta yönünden tamamlar." },
          { term: "Cümle Dışı Öge", def: "Ünlemler, bağlama öbekleri ve hitap sözcükleri; pekiştirme ve açıklama işlevi görür." },
          { term: "Devrik Cümle", def: "Yüklemin başında veya ortasında yer aldığı cümle; şiirsel ve duygusal vurguda kullanılır." }
        ],
        compare: {
          left: {
            title: "BASİT CÜMLE",
            points: [
              { k: "Yargı", v: "Tek bir çekimli yükleme sahiptir." },
              { k: "Dikkat", v: "Zarf-fiil/sıfat-fiil öbeği olsa da basittir." },
              { k: "Örnek", v: "Öğrenciler sınava hazırlandı." }
            ]
          },
          right: {
            title: "BİLEŞİK CÜMLE",
            points: [
              { k: "Yapı", v: "Temel yargı + yan cümleler." },
              { k: "Türler", v: "Şartlı, iç içe, ki'li." },
              { k: "Örnek", v: "Eğer çalışırsan başarılı olursun." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Yapılarına Göre", desc: "Basit (tek yüklem), bileşik (şartlı, iç içe, ki'li), sıralı, bağlı cümleler." },
          { year: "2", name: "Yükleme Göre", desc: "Eylem (fiil) cümlesi ve ad (isim) cümlesi; -dır, -di, -miş ile çekimli ad cümleleri." },
          { year: "3", name: "Dizilişe Göre", desc: "Kurallı (düz): yüklem sonda; devrik: yüklem başta veya ortada." },
          { year: "4", name: "Anlamlarına Göre", desc: "Olumlu/olumsuz, soru, ünlem ve emir cümleleri." }
        ],
        factors: {
          items: [
            { side: "ic", t: "Ad Tamlamaları", d: "Belirtili (arabanın camı), belirtisiz (gül kokusu), takısız (tahta kapı)." },
            { side: "ic", t: "Sıfat Tamlamaları", d: "Bir adın nitelenmesiyle oluşur: şu yüksek bina." },
            { side: "dis", t: "Aitlik Öbeği", d: "-ki ekiyle kurulur: sokaktaki insan." },
            { side: "dis", t: "Fiilimsi Öbeği", d: "İsim/sıfat/zarf fiil ekleriyle: bakmadan gitti, yaşanacak günler." },
            { side: "dis", t: "Birleşik Eylem", d: "Ad + yardımcı eylem (yardım etmek) veya iki eylem (kala kalmak)." }
          ]
        },
        matrix: {
          rowTerm: "Öge",
          hint: "Cümlenin ögeleri ve yükleme sorulan sorular. Mobilde tabloyu yana kaydırın.",
          axes: ["Görevi", "Soru", "Örnek"],
          rows: [
            { label: "Yüklem", cells: ["Çekirdek; yargı bildirir", "Ne söyleniyor?", "Öğrenciler hazırlandı."] },
            { label: "Özne", cells: ["İşi yapan", "Kim? Ne?", "Öğrenciler hazırlandı."] },
            { label: "Nesne", cells: ["Eylemden etkilenen", "Neyi? Kimi?", "Sınavı hazırladı."] },
            { label: "Yer Tamlayıcısı", cells: ["Yer/yön belirtir", "Nerede? Nereye?", "Salonda hazırlandı."] },
            { label: "Zarf Tümleci", cells: ["Zaman/durum/sebep", "Nasıl? Ne zaman? Niçin?", "Özenle hazırlandı."] }
          ]
        },
        quiz: [
          { q: "Yükleme 'Neyi?' sorusuyla bulunan öge hangisidir?",
            options: ["Özne", "Belirtili nesne", "Yer tamlayıcısı"],
            answer: 1,
            why: "Belirtili nesne -ı/-i/-u/-ü ekini alır ve Neyi? Kimi? sorularıyla bulunur." },
          { q: "Zarf-fiil öbeği bulunan cümle hangi türdendir?",
            options: ["Bileşik cümle", "Basit cümle", "Sıralı cümle"],
            answer: 1,
            why: "Zarf-fiil öbeği zarf işlevinde olduğu için cümle tek yükleme sahip basit cümle sayılır." },
          { q: "Yüklemi cümlenin başında yer alan cümle türü hangisidir?",
            options: ["Kurallı (düz)", "Devrik", "Bağlı"],
            answer: 1,
            why: "Devrik cümlede yüklem başta veya ortada yer alır; şiirsel anlatımda sık kullanılır." }
        ]
      },
      "6": {
        title: "Türkçenin Söz Varlığı, Deyimler ve Atasözleri",
        labels: { timeline: "İkileme türleri", factors: "Söz varlığı ögeleri", quiz: "Pekiştirme testi", concepts: "Kavramlar", compare: "Deyim vs Atasözü", matrix: "Anlatım kalıpları" },
        takeaways: [
          { t: "Söz Varlığı Bütünü", d: "Sadece sözcük değil; deyim, atasözü, ikileme, kalıp söz, argo ve ağız bir arada anlam taşır." },
          { t: "Deyim ve Atasözü Farkı", d: "Deyim yargı bildirmez, tasvir eder; atasözü yargı bildirir ve öğüt verir." },
          { t: "İkileme Ritmi", d: "Ahenk, zıtlık, yansıma veya alıntı-öz kaynaklı ikilemeler dilin müzikal yönünü besler." },
          { t: "Alkış ve Kargış", d: "Dede Korkut gibi klasiklerde dile gelen dua ve beddua kalıpları, toplumsal ahlakın yansımasıdır." }
        ],
        concepts: [
          { term: "Söz Varlığı", def: "Sözlükteki kelimelerin yanı sıra deyim, atasözü, ikileme, kalıp söz, terim, argo ve ağız unsurlarının bütünü." },
          { term: "Deyim", def: "En az iki sözcükten oluşan, gerçek anlamından uzaklaşmış, yargı bildirmeyen kalıplaşmış söz öbeği: göz koymak." },
          { term: "Atasözü", def: "Deneyime dayanan, kesin yargı bildiren, öğüt veren anonim cümleler: Sabırla koruk helva olur." },
          { term: "Birleşik Sözcük", def: "İki kelimenin kalıplaşarak tek kavram olması: hanımeli; deyimden farkı ögelerin ayrılmamasıdır." },
          { term: "Argo", def: "Belirli grupların anlaşılmamak için kullandığı özel anlatım; mizahi zekâ barındırır: kirişi kırmak." },
          { term: "Ağız", def: "Bir dilin bölgesel ses ve biçim farklılıkları; ölçünlü dil ağızlardan alıntı yapabilir." },
          { term: "İkileme", def: "Anlamı pekiştirmek için ses veya anlam ilişkili iki sözcüğün yan yana kullanımı: pırıl pırıl." },
          { term: "Alkış (Dua)", def: "Sağlık, refah ve huzur dilemesi: Gölgelice kaba ağacın kesilmesin!" },
          { term: "Kargış (Beddua)", def: "Haksızlığa uğrayanın ilahi adalet dilemesi; küfür değil edebi bir arayıştır." }
        ],
        compare: {
          left: {
            title: "DEYİM",
            points: [
              { k: "Yargı", v: "Bildirmez; durumu tasvir eder." },
              { k: "Yapı", v: "Mecazlı, mantık dışı anlam yükü." },
              { k: "Örnek", v: "göz koymak, çam devirmek, ayağının tozuyla." }
            ]
          },
          right: {
            title: "ATASÖZÜ",
            points: [
              { k: "Yargı", v: "Kesin yargı ve öğüt bildirir." },
              { k: "Kaynak", v: "Deneyim ve gözlem." },
              { k: "Örnek", v: "Sabırla koruk helva olur, dut yaprağı atlas." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Ahenk ve Ses Benzerliği", desc: "Baş/son harf uyumu: cümbür cemaat, düğün dernek, tuz buz." },
          { year: "2", name: "Ünlü Uyumu", desc: "Simetrik kalıplar: a + u/ü → çat çut, allak bullak, tak tuk." },
          { year: "3", name: "Yakın ve Zıt Anlam", desc: "Güçlendirme: dağ taş, yorgun argın; karşıtlık: gece gündüz, az çok." },
          { year: "4", name: "Yansıma ve Alıntı", desc: "Harıl harıl, fokur fokur; kılık [Türkçe] kıyafet [Arapça]." }
        ],
        matrix: {
          rowTerm: "Kalıp",
          hint: "Dede Korkut ve Türk kültüründe anlatım kalıpları. Mobilde tabloyu yana kaydırın.",
          axes: ["İşlev", "Örnek"],
          rows: [
            { label: "İlişki Sözleri", cells: ["Nezaket ve toplumsal bağ", "Gözün aydın, kolay gelsin"] },
            { label: "Alkış (Dua)", cells: ["Sağlık ve refah dileme", "Kamın akan görklü suyun kurumasın!"] },
            { label: "Kargış (Beddua)", cells: ["İlahi adalet dileme", "Canı yananın tanrıdan ceza dilemesi"] },
            { label: "Yansıma İkileme", cells: ["Doğa sesinin takidi", "Harıl harıl, fokur fokur"] }
          ]
        },
        factors: {
          items: [
            { side: "ic", t: "Deyim", d: "Mecazlı, yargı bildirmeyen, kalıplaşmış söz öbeği." },
            { side: "ic", t: "Atasözü", d: "Deneyimden gelen, kesin yargı ve öğüt bildiren anonim cümle." },
            { side: "dis", t: "Argo", d: "Özel grup dili; mizahi zekâ barındırır, küfürden farklıdır." },
            { side: "dis", t: "Ağız", d: "Bölgesel farklılıklar; ölçünlü dilin tazelenmesine katkı sağlar." },
            { side: "dis", t: "Kalıp Söz", d: "İlişki sözleri, alkış ve kargış; toplumsal birliğin dildeki yansıması." }
          ]
        },
        quiz: [
          { q: "Deyim ile atasözü arasındaki temel fark nedir?",
            options: ["İkisi de yargı bildirir", "Deyim tasvir eder, atasözü yargı ve öğüt verir", "Atasözü iki sözcükten azdır"],
            answer: 1,
            why: "Deyimler yargı bildirmez, durumu vurucu biçimde tasvir eder; atasözleri kesin yargı ve öğüt taşır." },
          { q: "çat çut, allak bullak ikilemeleri hangi yolla oluşmuştur?",
            options: ["Zıt anlam", "Ünlü uyumu (a + u/ü)", "Yansıma sözcük"],
            answer: 1,
            why: "İlk sözcükte a, ikincide u/ü sesinin tercih edildiği simetrik kalıplar ünlü uyumundan doğar." },
          { q: "Dede Korkut'ta 'Kamın akan görklü suyun kurumasın!' hangi kalıp söz türüdür?",
            options: ["Kargış", "İlişki sözü", "Alkış (dua)"],
            answer: 2,
            why: "Alkış, insanın kendisi ve toplumu için sağlık ve refah dilemesidir." }
        ]
      },
      "7": {
        title: "Diller Arası Etkileşim ve Türkçenin Yaygınlığı",
        labels: { timeline: "Etkileşim dönemleri", matrix: "Alıntı-Verinti matrisi", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Yaygınlık göstergeleri", compare: "Alıntı vs Verinti" },
        takeaways: [
          { t: "Çift Yönlü Süreç", d: "Türkçe hem alıntı almış hem 10.000'den fazla sözcük verinti olarak dünyaya yaymıştır." },
          { t: "Terim Türetme Gücü", d: "Sondan eklemeli yapı, soyut bilimsel terimleri bile kolayca karşılar: bilişim, veri, nicelik." },
          { t: "12 Milyon km²", d: "200 milyondan fazla konuşucu; dünyanın 5. büyük dili; 20 yazı dili statüsü." },
          { t: "Atatürk'ün Geometrisi", d: "1937'de müselles yerine üçgen, zaviyetan-ı mütekabiletan yerine iç ters açılar türetmiştir." }
        ],
        concepts: [
          { term: "Alıntı", def: "Başka bir dilden alınan sözcük: Arapça, Farsça, Fransızca, İngilizce kaynaklılar." },
          { term: "Verinti", def: "Türkçenin başka dillere verdiği sözcük: divan, kahve, kervansaray, sultan." },
          { term: "Öztürkçe", def: "Cumhuriyet dönemi sadeleşme ve türetme hareketi; TDK'nın bilim dili çalışmaları." },
          { term: "Yazı Dili", def: "Dünyadaki 7.100 dilden yalnızca birkaç yüzü gelişmiş yazı diline sahiptir; Türkçe bunlardandır." },
          { term: "Ajun ve Tamu", def: "Uygur döneminde Çin ve Budizm etkisiyle Türkçeye giren alıntılar: dünya ve cehennem." },
          { term: "Bilişim Terimleri", def: "Öztürkçe ile türetilen çağdaş kavramlar: yazılım, donanım, veri, değişken, denklem." },
          { term: "Armin Vambery", def: "Macar Türkolog; Balkanlar'dan Mançurya'ya Türkçe bilenin iletişim kurabileceğini belirtmiştir." },
          { term: "Etkileşim Etmenleri", def: "Savaş, göç, inanç değişimi, ticaret ve teknoloji diller arası geçirgenliği artırır." }
        ],
        compare: {
          left: {
            title: "ALINTI",
            points: [
              { k: "Yön", v: "Başka dilden Türkçeye." },
              { k: "Kaynaklar", v: "Arapça, Farsça, Fransızca, İngilizce." },
              { k: "Örnek", v: "balkon, moda, format, server, tamu." }
            ]
          },
          right: {
            title: "VERİNTİ",
            points: [
              { k: "Yön", v: "Türkçeden dünya dillerine." },
              { k: "Hedef", v: "Sırpça, Macarca, Batı dilleri." },
              { k: "Örnek", v: "divan, kahve, kervansaray, sultan, ark." }
            ]
          }
        },
        timeline: [
          { year: "Uygur", name: "Çin ve Budizm", desc: "Ajun (dünya), tamu (cehennem) gibi sözcükler dilimize girmiştir." },
          { year: "İslamiyet", name: "Arapça ve Farsça", desc: "Söz varlığı ve gramer yapıları Türkçeyi yoğun biçimde etkilemiştir." },
          { year: "Tanzimat", name: "Batı'ya Dönüş", desc: "Fransızcadan balkon, moda, abone, lamba; aydınlar aracılığıyla." },
          { year: "Bugün", name: "Küreselleşme", desc: "İngilizceden format, server, billboard, e-mail alıntıları." }
        ],
        matrix: {
          rowTerm: "Dönem",
          hint: "Etkileşim dönemleri ve kaynak diller. Mobilde tabloyu yana kaydırın.",
          axes: ["Kaynak", "Örnekler"],
          rows: [
            { label: "Uygur/Çin", cells: ["Çince, Budizm", "ajun, tamu"] },
            { label: "İslamiyet", cells: ["Arapça, Farsça", "Geniş söz varlığı ve gramer"] },
            { label: "Tanzimat", cells: ["Fransızca", "balkon, moda, abone, lamba"] },
            { label: "Küreselleşme", cells: ["İngilizce", "format, server, billboard, e-mail"] }
          ]
        },
        factors: {
          items: [
            { side: "ic", t: "Coğrafi Alan", d: "Kuzey Buz Denizi'nden Hindistan'a, Atlas Okyanusu'ndan Çin içlerine 12 milyon km²." },
            { side: "ic", t: "Konuşucu Sayısı", d: "200 milyondan fazla; dünyanın 5. büyük dili." },
            { side: "dis", t: "Yazı Dili Statüsü", d: "20 farklı yazı dili halinde devlet, resmi veya özerk dil." },
            { side: "dis", t: "Terim Gücü", d: "Sondan eklemeli yapı sayesinde soyut kavramlar bile kolayca karşılanır." }
          ]
        },
        quiz: [
          { q: "Türkçenin başka dillere verdiği sözcüklere ne denir?",
            options: ["Alıntı", "Verinti", "Öztürkçe"],
            answer: 1,
            why: "Verinti, bir dilin başka dillere armağan ettiği sözcüklerdir; divan, kahve gibi." },
          { q: "Türkçenin yaklaşık coğrafi yayılımı ve konuşucu sayısı nedir?",
            options: ["5 milyon km², 50 milyon", "12 milyon km², 200 milyondan fazla", "8 milyon km², 100 milyon"],
            answer: 1,
            why: "Türkçe yaklaşık 12 milyon km²'lik alanda 200 milyondan fazla konuşucuyla dünyanın 5. büyük dilidir." },
          { q: "Atatürk 1937'de geometri için hangi terimleri türetmiştir?",
            options: ["Müselles yerine üçgen, mütesaviyül yerine eşkenar", "Algoritma yerine çözümleme", "Teorem yerine kanıt"],
            answer: 0,
            why: "Atatürk müselles yerine üçgen, zaviyetan-ı mütekabiletan yerine iç ters açılar, müselles-i mütesaviyül adla yerine eşkenar üçgen demiştir." }
        ]
      },
      "8": {
        title: "Yazım Kuralları ve Noktalama İşaretleri",
        labels: { timeline: "Yazım kuralları", matrix: "Noktalama işareti matrisi", quiz: "Pekiştirme testi", concepts: "Kavramlar", factors: "Ek yazımı", compare: "Ek vs Bağlaç" },
        takeaways: [
          { t: "Ölçünlü Dil", d: "Toplumun ortak anlaşma noktası; resmi iletişim ve öğretimde geçerli standarttır." },
          { t: "Düzeltme İşareti", d: "Yazılış aynı okunuş farklı sözcükleri ayırır: adet/âdet, kar/kâr, katil/kâtil." },
          { t: "Ek ve Bağlaç Ayrımı", d: "-da/-de, -ki, mi'nin ek mi bağlaç mı olduğu yazımı kökten ayırır." },
          { t: "Noktalama", d: "Durak, ses tonu, vurgu ve cümle yapısını gösterir; anlam belirsizliğini giderir." }
        ],
        concepts: [
          { term: "Ölçünlü Dil", def: "Toplumda ortak anlaşma noktası sağlayan, resmi iletişimde ve öğretimde geçerli standart dil." },
          { term: "İmla", def: "Seslerin belirlenmiş standartlarla yazıya aktarılması; yazım kuralları." },
          { term: "Düzeltme İşareti (^)", def: "Yazılışları aynı, anlamları ve okunuşları farklı sözcükleri ayıran işaret: adet/âdet." },
          { term: "Bulunma Durumu Eki", def: "-da/-de/-ta/-te; sözcüğe bitişik yazılır, cümleden çıkarılınca anlam bozulur: evde." },
          { term: "Bağlaç da/de", def: "Müstakil sözcüktür, her zaman ayrı yazılır; ta/te olmaz: sen de gel." },
          { term: "Aitlik Eki -ki", def: "Bitişik yazılır; aitlik veya sıfat yapar: evdeki hesap, seninki." },
          { term: "Bağlaç ki", def: "Ayrı yazılır; iki yargı veya cümleyi bağlar: duydum ki unutmuşsun." },
          { term: "Soru Eki mi", def: "Geleneksel olarak ayrı yazılır; sonraki ekler bitişik: geliyor musunuz?" },
          { term: "Nokta", def: "Tamamlanmış cümlenin sonuna; kısaltma ve sıra bildiren sayıların sonuna konur." },
          { term: "Virgül", def: "Eş görevli ögeleri, uzun cümlede özneyi ve sıralı cümleleri ayırır: Yeşil, gözlere iyi gelir." }
        ],
        compare: {
          left: {
            title: "EK (-da/-de, -ki)",
            points: [
              { k: "Yazım", v: "Önceki sözcüğe bitişik." },
              { k: "İşlev", v: "Cümlenin anlamını değiştirir." },
              { k: "Örnek", v: "evde, evdeki hesap." }
            ]
          },
          right: {
            title: "BAĞLAÇ (da/de, ki)",
            points: [
              { k: "Yazım", v: "Her zaman ayrı." },
              { k: "İşlev", v: "Cümleden çıkarılınca anlam bozulmaz." },
              { k: "Örnek", v: "Sen de gel; duydum ki." }
            ]
          }
        },
        timeline: [
          { year: "1", name: "Ölçünlü Dil", desc: "Ağızdaki yöresel kullanımlar yazı dilinde yer almaz; standart belirleyicidir." },
          { year: "2", name: "Düzeltme İşareti", desc: "Adet/âdet, kar/kâr, katil/kâtil gibi ayrım için kullanılır." },
          { year: "3", name: "Ek ve Bağlaç", desc: "-da/-de, -ki, mi'nin ek/bağlaç ayrımı yazımın en sık hata noktasıdır." },
          { year: "4", name: "Noktalama", desc: "Nokta, virgül, noktalı virgül, iki nokta; anlam ve yapıyı gösterir." }
        ],
        matrix: {
          rowTerm: "İşaret",
          hint: "Temel noktalama işaretleri ve işlevleri. Mobilde tabloyu yana kaydırın.",
          axes: ["İşaret", "Temel İşlev"],
          rows: [
            { label: "Nokta", cells: ["(.)", "Tamamlanmış cümle sonu; sıra bildirim: 5. sınıf"] },
            { label: "Virgül", cells: ["(,)", "Eş görevli ögeler, uzun cümlede özne, sıralı cümleler"] },
            { label: "Noktalı Virgül", cells: ["(;)", "Virgüllü tür/takım ayırma; sıralı cümle bağlama"] },
            { label: "İki Nokta", cells: [":", "Örnek veya açıklama; tam cümlese büyük harfle başlar"] }
          ]
        },
        factors: {
          items: [
            { side: "ic", t: "İletişim İşlevi", d: "Kurallara uyulmazsa dil iletişim gücünü kaybeder; anlam karmaşası doğar." },
            { side: "ic", t: "Anlam Ayrımı", d: "Düzeltme işareti olmadan söyleyiş ve anlam karışıklıkları yaşanır." },
            { side: "dis", t: "Birleşik Sözcükler", d: "Ses olayı varsa bitişik (hissetmek, kaybolmak); yoksa ayrı (terk etmek)." },
            { side: "dis", t: "Büyük Harf", d: "Cümle başı, özel adlar, unvanlar, tarih/dönem adları; kuruma ek kesme ile ayrılmaz." }
          ]
        },
        quiz: [
          { q: "'Kitabım evde kaldı' ve 'Sen de bizimle gel' cümlelerindeki da/de nasıl yazılır?",
            options: ["İkisi de bitişik", "İkisi de ayrı", "İlki bitişik (ek), ikinci ayrı (bağlaç)"],
            answer: 2,
            why: "evde bulunma durumu ekidir ve bitişik; 'sen de' bağlaçtır ve ayrı yazılır." },
          { q: "'Duydum ki unutmuşsun' undaki ki nasıl yazılır?",
            options: ["Bağlaç olduğu için ayrı", "Aitlik eki olduğu için bitişik", "Her iki şekilde de caiz"],
            answer: 0,
            why: "İki yargı bağlandığı için bağlaç 'ki' ayrı yazılır; aitlik eki '-ki' bitişiktir." },
          { q: "'Yeşil gözlere iyi gelir' cümlesindeki virgülün işlevi nedir?",
            options: ["Sıralı cümle ayırmak", "'Yeşil'i özneleştirip anlam belirsizliğini gidermek", "Nokta yerine kullanmak"],
            answer: 1,
            why: "Virgül, 'yeşil' sözcüğünün niteleme mi özne mi olduğunu belirginleştirerek anlam karışıklığını önler." }
        ]
      }
    }
  },

  "ataturk-ilkeleri-1": {
    title: "Atatürk İlkeleri ve İnkılap Tarihi I İnteraktif Paneli",
    subtitle: "AÖF TAR201U müfredatına uygun modüler analiz",
    labels: { timeline: "İnkılabın kronolojisi", matrix: "Kongreler matrisi", tree: "Siyasi teşekküller" },
    takeaways: [
      { t: "Hazırlık Aşaması", d: "17-18. yüzyıl buhranları, Şark Meselesi ve büyük devletlerin paylaşım planları Türk inkılabını hazırlayan temel dinamiklerdir." },
      { t: "Millî Mücadele Örgütü", d: "Amasya Genelgesi, Erzurum ve Sivas Kongreleri ile TBMM, millî egemenlik temelli bir devletleşme sürecinin basamaklarıdır." },
      { t: "Lozan ve Cumhuriyet", d: "Saltanatın kaldırılması ve Lozan Barış Antlaşması, tam bağımsızlığın hukuki ve uluslararası dayanağıdır." },
      { t: "Atatürk Dönemi Politika", d: "İçeride çok partili hayata geçiş denemeleri, dışarıda barışçı ve millî diplomasi (Musul'dan Montrö'ye) izlenmiştir." }
    ],
    concepts: [
      { term: "Şark Meselesi", def: "Doğu Sorunu; Osmanlı toprak bütünlüğünü parçalamayı amaçlayan büyük devletlerin plan ve politikalarının genel adıdır." },
      { term: "II. Meşrutiyet", def: "1908'de ilan edilen anayasal yönetim; İttihat ve Terakki'nin iktidara gelişi ve ardından gelen siyasi çalkantıların başlangıcıdır." },
      { term: "31 Mart Vakası", def: "1909'da gerici bir ayaklanma; Hareket Ordusu tarafından bastırılmış, II. Meşrutiyet rejiminin ilk ciddi sınavıdır." },
      { term: "Mondros Mütarekesi", def: "1918'de imzalanan ateşkes; maddeleri İtilaf Devletleri'ne geniş yetkiler vermiş, işgallerin hukuki zeminini hazırlamıştır." },
      { term: "Kuvayı Milliye", def: "İşgallere karşı halkın kendiliğinden kurduğu direniş birlikleri; düzensiz yapıları nedeniyle yerini düzenli orduya bırakmıştır." },
      { term: "Amasya Genelgesi", def: "22 Haziran 1919; 'Milletin istiklalini yine milletin azim ve kararı kurtaracaktır' ifadesiyle millî egemenlik düşüncesi ilk kez dile getirilmiştir." },
      { term: "TBMM", def: "23 Nisan 1920'de Ankara'da açılmıştır; egemenliği millete dayandıran, kuvvetler birliği esasına göre çalışan yeni Türk devletinin hukuki temelidir." },
      { term: "Saltanatın Kaldırılması", def: "1 Kasım 1922; Türkiye'nin tek meşru temsilcisinin TBMM olduğu tescil edilmiştir." },
      { term: "Lozan Barış Antlaşması", def: "24 Temmuz 1923; tam bağımsızlığın uluslararası tanınması, Misak-ı Millî'nin büyük ölçüde gerçekleştirilmesidir." },
      { term: "Montrö Boğazlar Sözleşmesi", def: "1936; Boğazlar üzerindeki egemenliğin Türkiye'ye tam olarak devri, Atatürk dönemi dış politikasının önemli kazanımıdır." }
    ],
    timeline: [
      { year: "1774", name: "Küçük Kaynarca", desc: "Rusya ile imzalanan antlaşma; Osmanlı'nın toprak kayıplarının ve Avrupa diplomasisinde zayıflamanın sembolüdür." },
      { year: "1908", name: "II. Meşrutiyet", desc: "Anayasal yönetimin ilanı; İttihat ve Terakki'nin iktidara gelişi." },
      { year: "1909", name: "31 Mart Vakası", desc: "Geri ayaklanma; Hareket Ordusu ile bastırılması ve Meşrutiyet rejiminin pekişmesi." },
      { year: "1918", name: "Mondros Mütarekesi", desc: "Birinci Dünya Savaşı'nın Osmanlı cephesindeki sonu; işgallerin kapısını açan ateşkes." },
      { year: "1919", name: "Millî Mücadele'nin Başlangıcı", desc: "Amasya Genelgesi, Erzurum ve Sivas Kongreleri ile millî irade örgütlenmesi." },
      { year: "1920", name: "TBMM'nin Açılışı", desc: "23 Nisan 1920; Ankara'da egemenliğin millete dayandırıldığı yeni devletin kuruluşu." },
      { year: "1922", name: "Saltanatın Kaldırılması", desc: "1 Kasım 1922; tek temsilcinin TBMM olduğu hukuki olarak tescillendi." },
      { year: "1923", name: "Lozan ve Cumhuriyet", desc: "24 Temmuz Lozan Barış Antlaşması; 29 Ekim Cumhuriyet'in ilanı." },
      { year: "1936", name: "Montrö Sözleşmesi", desc: "Boğazlar üzerindeki tam egemenlik; Atatürk dönemi dış politikasının doruk noktası." }
    ],
    matrix: {
      rowTerm: "Kuruluş",
      hint: "Millî Mücadele'nin örgütsel basamakları. Mobilde tabloyu yana kaydırın.",
      axes: ["Tarih", "Yer", "Önemi"],
      rows: [
        { label: "Amasya Genelgesi", cells: ["22 Haziran 1919", "Amasya", "Millî egemenlik düşüncesinin ilk ifadesi; manda ve himaye reddedildi." ] },
        { label: "Erzurum Kongresi", cells: ["23 Temmuz - 7 Ağustos 1919", "Erzurum", "Doğu vilayetlerini temsil eden kongre; Millî Mücadele'nin programı belirlendi." ] },
        { label: "Sivas Kongresi", cells: ["4 - 11 Eylül 1919", "Sivas", "Tüm yurdu temsil eden kongre; Erzurum kararları ülke geneline yayıldı." ] },
        { label: "TBMM", cells: ["23 Nisan 1920", "Ankara", "Yeni Türk devletinin hukuki temeli; millî egemenlik esasına dayalı meclis hükümeti." ] }
      ]
    },
    tree: [
      { label: "Halk Fırkası", desc: "1923'te kurulan ilk siyasi teşekkül; sonradan adı Cumhuriyet Halk Fırkası (CHP) olarak değiştirilmiştir.",
        branches: [{ label: "CHP", d: "Atatürk'ün ölümüne dek iktidarda kalan; tek parti döneminde devrimlerin ve inkılabın taşıyıcısı olan parti." }] },
      { label: "Terakkiperver Cumhuriyet Fırkası", desc: "1924'te Kazım Karabekir, Ali Fethi Okyar ve Refik Saydam tarafından kurulan ilk muhalefet partisi; daha ılımlı bir yönetim önermiştir.",
        branches: [{ label: "Kapanış (1925)", d: "Şeyh Said isyanı sonrası ilan edilen takihat kanunu kapsamında kapatılmıştır." }] },
      { label: "Serbest Cumhuriyet Fırkası", desc: "1930'da Ali Fethi Okyar tarafından kurulan ikinci çok partili deneme; hızlı bir yükselişin ardından kısa sürede kapanmıştır.",
        branches: [{ label: "Fırka Faciası", d: "Halkın yoğun ilgisi ve iktidarın çekinceleri üzerine fırka üç ay gibi kısa bir sürede kendini feshetmiştir." }] }
    ],
    chapters: {
      "1": {
        "title": "İnkılabı Hazırlayan Sebepler ve Doğu Sorunu",
        "labels": {
          "compare": "Gerileme vs Dönüşüm",
          "timeline": "Islahatların kronolojisi",
          "matrix": "Büyük güçler matrisi",
          "tree": "Islahat çizgisi",
          "factors": "İç ve dış dinamikler",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Gerileme Değil Dönüşüm",
            "d": "Osmanlı tarihi düz bir çizgide çöküş değil; mutlak monarşiden parlamenter rejime evrilen bürokratik bir devlet evrimidir."
          },
          {
            "t": "Zincirleme Ekonomik Kriz",
            "d": "Coğrafi Keşiflerle ticaret yollarının kayması, tağşiş ve tımarın iltizama dönmesi enflasyonu ve Celali isyanlarını doğurdu."
          },
          {
            "t": "Şark Meselesi Dış Baskının Eksenidir",
            "d": "Rusyanın Panslavizmi, İngiltere ve Fransanın paylaşımcı politikaları Osmanlı toprak bütünlüğünü asıl tehdit eden dış dinamiktir."
          },
          {
            "t": "Islahatlardan İnkılap",
            "d": "Risalelerden Tanzimat, Islahat ve Meşrutiyete uzanan çizgi, Türk inkılabının kurumsal ve hukuki temelini atmıştır."
          }
        ],
        "concepts": [
          {
            "term": "Gerileme Paradigması",
            "def": "Osmanlı tarihini yükseliş, duraklama ve gerileme olarak şematize eden geleneksel anlatım; çağdaş tarihçilik tarafından sorgulanır."
          },
          {
            "term": "Tağşiş",
            "def": "Para basımında değerli maden oranını düşürme politikası; pahalılık ve enflasyonist baskı yoluyla toplumsal düzeni altüst etmiştir."
          },
          {
            "term": "Tımar ve İltizam",
            "def": "Tımarın bozulup vergi toplama hakkının mültezimlere dönmesi; köylünün toprağını terk etmesine yol açmıştır."
          },
          {
            "term": "Celali İsyanları",
            "def": "17. yüzyıldan itibaren vergi baskısı ve toprak kaybından doğan, Anadoluyu yüzyıllar boyunca felç eden büyük halk ayaklanmaları."
          },
          {
            "term": "Şark Meselesi",
            "def": "Büyük devletlerin Osmanlıyı zayıflatıp topraklarını paylaşma mücadelesidir; Doğu Sorunu adıyla da anılır."
          },
          {
            "term": "Panslavizm",
            "def": "Rusyanın Balkanlardaki Slav ve Ortodoks halkları kışkırtarak nüfuzunu genişletme politikası; Osmanlıya karşı kullanılmıştır."
          },
          {
            "term": "Tanzimat Fermanı",
            "def": "1839da ilan edildi; kanun gücünün üstünlüğünü, can-mal-namus güvenliğini ve adil vergiyi devlet garantisi altına aldı."
          },
          {
            "term": "Islahat Fermanı",
            "def": "1856da Kırım Savaşı sonrası ilan edildi; gayrimüslimlere geniş haklar tanıyarak dış müdahaleleri önlemeyi amaçladı."
          }
        ],
        "timeline": [
          {
            "year": "16. yy",
            "name": "Islahat Risaleleri",
            "desc": "Lütfi Paşa, Koçi Bey ve Kâtip Çelebi bozulmayı teşhis etti; dönüşüm idealize geçmişe dönüşle sınırlı kaldı."
          },
          {
            "year": "17. yy",
            "name": "Ekonomik ve Sosyal Çöküş",
            "desc": "Tımar iltizama döndü, enflasyon yükseldi; Celali ve Suhte isyanları Anadoluyu uzun yıllar felç etti."
          },
          {
            "year": "1839",
            "name": "Tanzimat Fermanı",
            "desc": "Gülhanede okundu; hukuki devlet anlayışının ilk adımı olarak kanun gücünün üstünlüğü kabul edildi."
          },
          {
            "year": "1856",
            "name": "Islahat Fermanı",
            "desc": "Gayrimüslimlere geniş haklar tanındı; Şark Meselesi bağlamında dış müdahalelerin önü kesilmek istendi."
          },
          {
            "year": "1908",
            "name": "II. Meşrutiyet",
            "desc": "1876 ve 1908 meşrutiyetleriyle parlamenter rejime geçildi; ulusal devlete giden yol açıldı."
          }
        ],
        "matrix": {
          "rowTerm": "Güç",
          "hint": "Büyük devletlerin Osmanlıya karşı hedefleri ve araçları. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Temel Hedef",
            "Araç ve Eylem"
          ],
          "rows": [
            {
              "label": "Rusya",
              "cells": [
                "Sıcak denizlere inme ve Boğazları kontrol",
                "Panslavizm; Berlin 1878 ile Ermeni Meselesinin uluslararasılaştırılması"
              ]
            },
            {
              "label": "İngiltere",
              "cells": [
                "Hindistan yolu ve Ortadoğu ticareti",
                "1908e dek toprak bütünlüğü savunusu, sonra Reval ile Rusya ile paylaşım"
              ]
            },
            {
              "label": "Fransa",
              "cells": [
                "Doğu Akdeniz ticareti ve Kuzey Afrika",
                "Mısır 1798, Cezayir 1830 ve Tunus 1881 işgalleri"
              ]
            },
            {
              "label": "Almanya",
              "cells": [
                "Ortadoğuda siyasi ve iktisadi nüfuz",
                "Bağdat Demiryolu; denge unsuru olarak Osmanlı dostluğu"
              ]
            },
            {
              "label": "Avusturya",
              "cells": [
                "Balkanlarda Adriyatik ve Makedonyaya yayılma",
                "1908de Bosna-Hersekin ilhakı; savaşın tohumları"
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "Islahat Risaleleri (16. yy)",
            "desc": "Devlet adamlarının çözüm önerilerini içeren nasihat literatürü; idealize geçmişe dönüşü hedeflediği için köklü değişim getirmedi.",
            "branches": [
              {
                "label": "Âsafnâme",
                "d": "Lütfi Paşanın eseri; devlet kurumlarındaki çözülmeleri ilk teşhis eden rapordur."
              },
              {
                "label": "Koçi Bey Raporu",
                "d": "IV. Murada sunuldu; rüşvet, iltimas ve tımar bozulmasını cesaretle dile getirdi."
              },
              {
                "label": "Mîzânü'l-Hak",
                "d": "Kâtip Çelebinin eseri; medrese ilminin düşüşünü eleştirdi ve rasyonel çözüm aradı."
              }
            ]
          },
          {
            "label": "Islahat ve Anayasal Dönüşüm",
            "desc": "19. yüzyılda sorunun Cedidde, yani yeni ve Batılı tarzda düzenlendiğinde görüldüğü kurumsallaşma evresidir.",
            "branches": [
              {
                "label": "Tanzimat (1839)",
                "d": "Kanun gücünün üstünlüğü ve eşit yurttaşlık temelinin atıldığı fermandır."
              },
              {
                "label": "Islahat (1856)",
                "d": "Gayrimüslim haklarını genişletti; dış müdahaleleri önlemeyi amaçladı."
              },
              {
                "label": "Meşrutiyet (1876-1908)",
                "d": "Kanun-ı Esasi ile anayasal yönetim; ulusal devlete giden yolun başlangıcıdır."
              }
            ]
          }
        ],
        "factors": {
          "items": [
            {
              "side": "ic",
              "t": "Sosyo-Ekonomik Çözülme",
              "d": "Tımarın iltizama dönmesi, mültezim baskısı ve enflasyon kırsal düzeni çökertti."
            },
            {
              "side": "ic",
              "t": "Askeri ve Siyasi Otorite Krizi",
              "d": "Yeniçeri bozulması, sefere çıkmayan padişahlar, Edirne Vakası ve II. Osman'ın katli meşruiyeti zayıflattı."
            },
            {
              "side": "ic",
              "t": "Islahatçı Düşünce",
              "d": "Risalelerle başlayan teşhis ve çözüm arayışı zamanla Cedidde karar kıldı."
            },
            {
              "side": "dis",
              "t": "Ticaret Yollarının Kayması",
              "d": "Coğrafi Keşiflerle Atlantige kayan ticaret ve Avrupaya akan gümüş Akdenizi ve Osmanlıyı yalnızlaştırdı."
            },
            {
              "side": "dis",
              "t": "Şark Meselesi Baskısı",
              "d": "Büyük güçlerin paylaşım planları toprak bütünlüğünü sürekli tehdit eden dış etkendir."
            },
            {
              "side": "dis",
              "t": "Avrupa İktisadi ve Hukuki Nüfuzu",
              "d": "Kapitülasyonlar ve dış ticaret bağımlılığı yerli üretimi ve maliye yapısını sınırladı."
            }
          ]
        },
        "quiz": [
          {
            "q": "Coğrafi Keşiflerle gelen bol gümüşün Osmanlıda yol açtığı temel sorun nedir?",
            "options": [
              "Tımar sisteminin güçlenmesi",
              "Enflasyon ve gıda fiyatlarının artması",
              "Gümrük gelirlerinin tavan yapması"
            ],
            "answer": 1,
            "why": "Bol gümüş girişi ve tağşiş politikası pahalılığa ve toplumsal sarsıntıya yol açmıştır."
          },
          {
            "q": "Rusyanın Balkanlardaki Slav ve Ortodoks halklarını kışkırtma politikası hangisidir?",
            "options": [
              "Panslavizm",
              "Manda yönetimi",
              "İltizam usulü"
            ],
            "answer": 0,
            "why": "Rusya Panslavizm ile Balkanlarda nüfuzunu genişletmeyi ve Boğazlara ulaşmayı hedeflemiştir."
          },
          {
            "q": "Kâtip Çelebinin medreselerin ıslahı ve devletin durumu için yazdığı eser hangisidir?",
            "options": [
              "Âsafnâme",
              "Mîzânü'l-Hak",
              "Kanun-ı Esasi"
            ],
            "answer": 1,
            "why": "Kâtip Çelebi Mîzânü'l-Hak ve Düstûru'l-Amel eserleriyle rasyonel çözümler sunmuştur."
          }
        ]
      },
      "2": {
        "title": "II. Meşrutiyet, 31 Mart Vakası ve Yıkıcı Savaşlar",
        "labels": {
          "matrix": "Olaylar matrisi",
          "compare": "İki savaşın karşılaştırması",
          "timeline": "Kronoloji",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Rejim Krizi",
            "d": "31 Mart Vakası II. Abdülhamidi tahttan indirdi, Bâb-ı Âli Baskını ise İttihat ve Terakkinin fiili tek parti iktidarını kurdu."
          },
          {
            "t": "Gönüllü Subaylar Destanı",
            "d": "Karadan ve denizden yardım gidemeyince Mustafa Kemal, Enver, Ali Fethi, Nuri ve Halil gizlice Libyaya geçip yerel halkı örgütledi."
          },
          {
            "t": "Rumelinin Kaybı",
            "d": "Ordunun terhis edilmesi ve siyasete karışması I. Balkan Savaşını bozguna çevirdi; batı sınırı Midye-Enez hattına geriledi."
          },
          {
            "t": "Edirnenin Geri Alınması",
            "d": "Balkan devletlerinin birbirine düşmesinden yararlanan Enver Bey, Edirne ve Kırklareliyi kurtararak Meriç sınırını belirledi."
          }
        ],
        "concepts": [
          {
            "term": "II. Meşrutiyet",
            "def": "23 Temmuz 1908de ilan edilen anayasal yönetim; özgürlük coşkusunun ardından siyasi belirsizlikler ve dış kayıplarla sarsıldı."
          },
          {
            "term": "31 Mart Vakası",
            "def": "13 Nisan 1909da şeriat talebiyle çıkan ayaklanma; Hareket Ordusu tarafından bastırıldı ve II. Abdülhamid tahttan indirildi."
          },
          {
            "term": "Hareket Ordusu",
            "def": "Selanikten gelen; komutanı Mahmut Şevket Paşa, kurmay başkanı Mustafa Kemal olan ve isyanı bastıran ordu."
          },
          {
            "term": "Bâb-ı Âli Baskını",
            "def": "23 Ocak 1913te Enver Bey liderliğinde sadrazam hükümetinin silah zoruyla devrildiği darbe; tek parti yönetimi kuruldu."
          },
          {
            "term": "Gönüllü Subaylar",
            "def": "Trablusgarpta tüccar veya gazeteci kılığıyla gizlice gidip kabileleri örgütleyen Mustafa Kemal, Enver, Ali Fethi, Nuri ve Halil."
          },
          {
            "term": "Uşi Antlaşması",
            "def": "18 Ekim 1912; Trablusgarp ve Bingazi İtalyaya bırakıldı, Rodos ve On İki Ada geçici olarak verildi ve geri alınamadı."
          },
          {
            "term": "Balkan İttifakı",
            "def": "Rusya teşvikiyle Bulgaristan, Sırbistan, Yunanistan ve Karadağın kurduğu; Ekim 1912de Osmanlıya saldıran ittifaktır."
          },
          {
            "term": "Midye-Enez Hattı",
            "def": "30 Mayıs 1913 Londra Antlaşması ile belirlenen batı sınırı; altı asırlık Rumeli bu hattın gerisinde kaybedildi."
          }
        ],
        "timeline": [
          {
            "year": "1908",
            "name": "II. Meşrutiyet İlanı",
            "desc": "Kanun-ı Esasi yeniden yürürlüğe girdi, seçimler yapıldı ve meşruti rejim başladı."
          },
          {
            "year": "1909",
            "name": "31 Mart Vakası",
            "desc": "Geri ayaklanma Hareket Ordusu ile bastırıldı; II. Abdülhamid tahttan indirildi, idare Bâb-ı Âliye kaydı."
          },
          {
            "year": "1911",
            "name": "Trablusgarp Savaşı",
            "desc": "28 Eylül ültimatomla İtalya Libyaya saldırdı; gönüllü subaylar gayrinizami direnişi örgütledi."
          },
          {
            "year": "1912",
            "name": "Uşi ve I. Balkan Savaşı",
            "desc": "18 Ekim Uşi ile Afrika kaybedildi; Ekimde Balkan İttifakı saldırdı, batı sınırı Midye-Enez hattına geriledi."
          },
          {
            "year": "1913",
            "name": "Bâb-ı Âli ve II. Balkan",
            "desc": "23 Ocak baskınıyla tek parti iktidarı kuruldu; Temmuzda Edirne ve Kırklareli geri alındı."
          }
        ],
        "matrix": {
          "rowTerm": "Olay",
          "hint": "Dönemin kırılma olayları ve sonuçları. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Tarih",
            "Kritik Sonuç"
          ],
          "rows": [
            {
              "label": "31 Mart Vakası",
              "cells": [
                "13 Nisan 1909",
                "Hareket Ordusu bastırdı; taht değişti, idare Saraydan Bâb-ı Âli ve bürokrasiye kaydı."
              ]
            },
            {
              "label": "Bâb-ı Âli Baskını",
              "cells": [
                "23 Ocak 1913",
                "İttihat ve Terakkinin fiili tek parti yönetimi kuruldu."
              ]
            },
            {
              "label": "Uşi Antlaşması",
              "cells": [
                "18 Ekim 1912",
                "Trablusgarp ve Bingazi İtalyaya bırakıldı, Rodos ve On İki Ada verildi."
              ]
            },
            {
              "label": "Londra Antlaşması",
              "cells": [
                "30 Mayıs 1913",
                "Batı sınırı Midye-Enez hattına çekildi, Rumeli ve Girit kaybedildi."
              ]
            },
            {
              "label": "İstanbul Antlaşması",
              "cells": [
                "29 Eylül 1913",
                "Meriç Nehri sınır kabul edildi, Edirne yeniden vatana katıldı."
              ]
            }
          ]
        },
        "compare": {
          "left": {
            "title": "TRABLUSGARP SAVAŞI",
            "points": [
              {
                "k": "Düşman",
                "v": "İtalya; geç siyasi birleşmiş sömürgeci devlet."
              },
              {
                "k": "Yöntem",
                "v": "Gönüllü subaylar ve gayrinizami harp (gerilla)."
              },
              {
                "k": "Lojistik",
                "v": "Mısır işgali ve abluka yüzünden kara ve deniz yardımı imkânsızdı."
              },
              {
                "k": "Sonuç",
                "v": "Uşi Antlaşması ile Kuzey Africadaki son topraklar kaybedildi."
              }
            ]
          },
          "right": {
            "title": "BALKAN SAVAŞLARI",
            "points": [
              {
                "k": "Düşman",
                "v": "Bulgaristan, Sırbistan, Yunanistan ve Karadağ (Balkan İttifakı)."
              },
              {
                "k": "Yöntem",
                "v": "Nizamî harp ve cephe savaşları; ordunun siyasete karışması."
              },
              {
                "k": "Lojistik",
                "v": "Anadoluya yakın ama 75.000 asker terhis edilmiş, ikmal yetersiz."
              },
              {
                "k": "Sonuç",
                "v": "Midye-Enez hattı; II. Balkanda Edirne ve Kırklareli geri alındı."
              }
            ]
          }
        },
        "quiz": [
          {
            "q": "31 Mart Vakası sonrası II. Abdülhamidin tahttan indirilmesiyle idare merkezi nereye kaymıştır?",
            "options": [
              "Yıldız Sarayı",
              "Bâb-ı Âli ve İttihatçı bürokrasi",
              "Dolmabahçe Sarayı"
            ],
            "answer": 1,
            "why": "Sarayın yetkisi azaldı; yönetim Bâb-ı Âli ve İttihat Terakki bürokrasisine kaydı."
          },
          {
            "q": "Trablusgarp Savaşında Mustafa Kemal hangi takma adla bölgeye girip direnişi örgütlemiştir?",
            "options": [
              "Naci Bey",
              "Şerif Bey",
              "Enver Bey"
            ],
            "answer": 1,
            "why": "Mustafa Kemal Şerif Bey takma adıyla gizlice Libyaya geçmiş, gayrinizami harbi başlatmıştır."
          },
          {
            "q": "I. Balkan Savaşı sonunda batıyı belirleyen hat hangisidir?",
            "options": [
              "Meriç Nehri",
              "Midye-Enez Hattı",
              "Çatalca Hattı"
            ],
            "answer": 1,
            "why": "Londra Antlaşması ile batı sınırı Midye-Enez hattına çekilmiştir; Meriç sınırı II. Balkan sonrası kabul edilmiştir."
          }
        ]
      },
      "3": {
        "title": "Mondros, İşgaller ve Milli Mücadele'nin Doğuşu",
        "labels": {
          "matrix": "İşgal bölgeleri",
          "tree": "Cemiyetler ağacı",
          "compare": "Teslimiyet ve direniş",
          "timeline": "Hazırlık rotası",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Mondrosun Ağır Faturası",
            "d": "7. ve 24. maddeler her stratejik noktayı ve altı vilayeti işgale açtı; asıl hedef doğuda bağımsız bir Ermenistan idi."
          },
          {
            "t": "İzmir Şoku",
            "d": "15 Mayıs 1919 İzmir işgali, yurt genelinde protesto mitinglerini başlatan ve milli uyanışı hızlandıran kırılma noktasıdır."
          },
          {
            "t": "Üç Cemiyet Grubu",
            "d": "Müdafaa-i Hukuk cemiyetleri vatanı savundu; mandacılığı savunanlar zararlı, azınlık cemiyetleri ayrılıkçı hedef taşıdı."
          },
          {
            "t": "Kuva-yı Milliye ve Hazırlık",
            "d": "Halk milisleri düşmanı oyalayıp düzenli orduya zaman kazandırdı; Samsun ve Havza Genelgesi direnişi ulusal bilince çevirdi."
          }
        ],
        "concepts": [
          {
            "term": "Mondros Mütarekesi",
            "def": "30 Ekim 1918de imzalanıp 31 Ekimde yürürlüğe giren ateşkes; Osmanlı'nın egemenliğini fiilen ortadan kaldırdı."
          },
          {
            "term": "7. Madde",
            "def": "İtilaf Devletlerine güvenlik gerekçesiyle her stratejik noktayı işgal yetkisi verdi; Anadoluyu açık işgal sahasına çevirdi."
          },
          {
            "term": "24. Madde",
            "def": "Doğu Anadoludaki altı vilayette karışıklık çıkarsa işgal yetkisi; temel amaç bağımsız bir Ermenistan devleti kurmaktı."
          },
          {
            "term": "Müdafaa-i Hukuk Cemiyetleri",
            "def": "Bölgesel hakları ve vatan bütünlüğünü savunan yararlı cemiyetler; miting ve basınla başladı, sonra silahlı direnişe geçti."
          },
          {
            "term": "Zararlı Cemiyetler",
            "def": "İşgalcilere boyun eğmeyi veya mandacılığı savunan cemiyetler; orn. İngiliz Muhipleri, Teâli-i İslam, Wilson Prensipleri."
          },
          {
            "term": "Azınlık Cemiyetleri",
            "def": "İtilaf desteğiyle Osmanlı topraklarında ayrılıkçı devlet kurmayı amaçlayan Rum ve Ermeni cemiyetleri (Mavri Mira, Taşnak, Hınçak)."
          },
          {
            "term": "Kuva-yı Milliye",
            "def": "Ordu terhis edilince halkın kendi imkanlarıyla kurduğu milis güçleri; ilk direnişler Ödemiş ve Ayvalık çevresinde çıktı."
          },
          {
            "term": "Havza Genelgesi",
            "def": "28 Mayıs 1919daki ilk eylem çağrısı; yurtta miting, protesto telgrafı ve silahların teslim edilmemesini istedi."
          }
        ],
        "timeline": [
          {
            "year": "1918",
            "name": "Mondros Mütarekesi",
            "desc": "30 Ekimde imzalandı; ordular terhis edildi, işgallerin hukuki zemini hazırlandı."
          },
          {
            "year": "1918",
            "name": "İstanbul Önünde 61 Parça Filo",
            "desc": "13 Kasımda müttefik donanması demirledi; Mustafa Kemal Geldikleri gibi giderler dedi."
          },
          {
            "year": "1919",
            "name": "İzmirin İşgali",
            "desc": "15 Mayista Yunan işgali şok yarattı; Anadolu genelinde protesto mitingleri başladı."
          },
          {
            "year": "1919",
            "name": "Samsuna Çıkış",
            "desc": "19 Mayista 9. Ordu Müfettişi Mustafa Kemal Paşa Samsuna ayak bastı; hazırlık safhası başladı."
          },
          {
            "year": "1919",
            "name": "Havza Genelgesi",
            "desc": "28 Mayista yayımlandı; uykudaki milli bilinci uyandırdı ve miting dalgasını başlattı."
          }
        ],
        "matrix": {
          "rowTerm": "İşgalci",
          "hint": "İtilaf devletlerinin işgal bölgeleri ve etkileri. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Başlıca Bölgeler",
            "Dikkat Çeken Nokta"
          ],
          "rows": [
            {
              "label": "İngilizler",
              "cells": [
                "Musul, Urfa, Çanakkale, İstanbul önleri",
                "61 parçalık filo 13 Kasım 1918de İstanbula demirledi."
              ]
            },
            {
              "label": "Fransızlar",
              "cells": [
                "Çukurova, Suriye",
                "Ermeni çeteleriyle işbirliğine karşı Güneyde halk direnişi doğdu."
              ]
            },
            {
              "label": "İtalyanlar",
              "cells": [
                "Antalya, Konya",
                "Trablusgarp sonrası Ege ve Akdenizde pay alma girişimidir."
              ]
            },
            {
              "label": "Yunanlılar",
              "cells": [
                "İzmir ve Ege",
                "15 Mayıs 1919 işgali milli uyanışın kırılma noktası oldu."
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "Milli (Yararlı) Cemiyetler",
            "desc": "Bölgesel hakları savunmak, işgalleri protesto etmek ve vatanın bütünlüğünü korumak amacıyla kuruldu.",
            "branches": [
              {
                "label": "Müdafaa-i Hukuk Cemiyetleri",
                "d": "Trakya-Paşaeli ve İzmir Müdafaa-i Hukuk; miting ve basınla başladı, işgal genişleyince silaha sarıldı."
              },
              {
                "label": "Doğu Cemiyetleri",
                "d": "Vilayât-ı Şarkiyye Müdafaa-i Hukuk doğu vilayetlerinin haklarını savundu, kongre sürecinin zeminini hazırladı."
              },
              {
                "label": "Trabzon Muhafaza-i Hukuk-ı Milliye",
                "d": "Karadenizde işgallere ve Ermeni tehdidine karşı halk savunmasını örgütledi."
              }
            ]
          },
          {
            "label": "Milli Varlığa Düşman Cemiyetler",
            "desc": "Müslüman ahali tarafından kuruldu; işgalcilere boyun eğmeyi veya mandacılığı çözüm olarak gördü.",
            "branches": [
              {
                "label": "İngiliz Muhipleri Cemiyeti",
                "d": "İngiliz himayesini ve mandasını savunan; milli mücadeleye karşı çıkan gruptur."
              },
              {
                "label": "Wilson Prensipleri Cemiyeti",
                "d": "Savaş sonrası düzende ABD himayesini ve Wilson ilkelerini bekleyen siyasettir."
              },
              {
                "label": "Teâli-i İslam ve Kürt Teali",
                "d": "Dini ve bölgesel ayrılıkçı söylemleriyle milli birliğe karşı konumlanan cemiyetlerdir."
              }
            ]
          },
          {
            "label": "Azınlık Cemiyetleri",
            "desc": "İtilaf Devletlerinin desteğiyle Osmanlı topraklarında bağımsız devlet kurmayı veya sınırlarını genişletmeyi amaçladı.",
            "branches": [
              {
                "label": "Rum Cemiyetleri",
                "d": "Mavri Mira, Etniki Eterya ve Pontus Rum cemiyetleri Karadeniz ve Egede ayrılık hedefledi."
              },
              {
                "label": "Ermeni Cemiyetleri",
                "d": "Hınçak ve Taşnak; doğuda bağımsız devlet ve Vilayet-i Sitte hedefini taşıdı."
              }
            ]
          }
        ],
        "compare": {
          "left": {
            "title": "İSTANBUL HÜKÜMETİ (Teslimiyetçi)",
            "points": [
              {
                "k": "Tutum",
                "v": "Mütareke şartlarına boyun eğdi, işgalleri önlemek için etkili girişimde bulunamadı."
              },
              {
                "k": "Yetki",
                "v": "Saray ve Bâb-ı Âli; meşruiyeti gün geçtikçe zayıfladı."
              },
              {
                "k": "Yöntem",
                "v": "Diplomatik itiraz ve teslimiyet; ordu terhis edildi, silahlar teslim edildi."
              },
              {
                "k": "Sonuç",
                "v": "Milli iradenin Anadoluya kaymasına ve yeni meclisin açılmasına zemin hazırladı."
              }
            ]
          },
          "right": {
            "title": "ANADOLUDA MİLLİ DİRENİŞ",
            "points": [
              {
                "k": "Tutum",
                "v": "İşgalleri tanımadı, kurtuluşu Anadoluda aradı."
              },
              {
                "k": "Yetki",
                "v": "Cemiyetler, Kuva-yı Milliye ve sivil inisiyatif; meşruiyeti milletten alıyor."
              },
              {
                "k": "Yöntem",
                "v": "Miting ve protesto, silahların Anadoluya kaçırılması, milis direnişi."
              },
              {
                "k": "Sonuç",
                "v": "Havza ve Amasya ile başlayan süreç ulusal bilince ve Milli Mücadeleye dönüştü."
              }
            ]
          }
        },
        "quiz": [
          {
            "q": "Mondros Mütarekesinin hangi maddesi her stratejik noktanın işgaline yetki veriyordu?",
            "options": [
              "7. Madde",
              "24. Madde",
              "1. Madde"
            ],
            "answer": 0,
            "why": "7. Madde güvenlik gerekçesiyle her noktanın işgalini; 24. Madde ise altı vilayeti konu alır."
          },
          {
            "q": "Mustafa Kemal Paşanın mitingler düzenlenmesini isteyen ilk belgesi hangisidir?",
            "options": [
              "Amasya Genelgesi",
              "Havza Genelgesi",
              "Sivas Kararları"
            ],
            "answer": 1,
            "why": "28 Mayıs 1919 tarihli Havza Genelgesi milli uyanışı başlatan ilk eylem çağrısıdır."
          },
          {
            "q": "Aşağıdakilerden hangisi Kuva-yı Milliyenin faydalarından biri değildir?",
            "options": [
              "Düşman ilerleyişini yavaşlatması",
              "Düzenli orduya zaman kazandırması",
              "Düşmanı yurttan tamamen atması"
            ],
            "answer": 2,
            "why": "Kuva-yı Milliye düşmanı oyalamış ve koruma sağlamıştır; kesin zafer düzenli ordu ile kazanılmıştır."
          }
        ]
      },
      "4": {
        "title": "Yeni Devletin Kuruluşu, TBMM ve Temeller",
        "labels": {
          "matrix": "Kongreler matrisi",
          "tree": "Meclis grupları",
          "compare": "Heyet-i Temsiliye ve Hükümet",
          "timeline": "Karar silsilesi",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Milli Egemenlik İlkesi",
            "d": "Amasya Genelgesi, bağımsızlığın yine milletin azim ve kararıyla kurtarılacağını söyleyerek millet iradesini öne çıkardı."
          },
          {
            "t": "Birleşen Direniş",
            "d": "Erzurum manda ve himayeyi reddetti, Sivas tüm Müdafaa-i Hukuk cemiyetlerini tek çatı altında topladı."
          },
          {
            "t": "Egemenliğin Ankara'ya İntikali",
            "d": "Misak-ı Milli ve 16 Mart 1920 İstanbul işgali, Ankarada yeni bir meclisin toplanmasını meşrulaştırdı."
          },
          {
            "t": "Kurucu Meclis",
            "d": "I. TBMM kurucu, ihtilalci ve demokratiktir; Meclis Hükümeti ve Güçler Birliği ile tüm yetkiler tek çatıdadır."
          }
        ],
        "concepts": [
          {
            "term": "Amasya Genelgesi",
            "def": "20-22 Haziran 1919; vatanın bütünlüğünün tehlikede olduğunu ve kurtuluşun milletin azim ve kararından geçeceğini ilan etti."
          },
          {
            "term": "Erzurum Kongresi",
            "def": "23 Temmuz - 7 Ağustos 1919; manda ve himaye reddedildi, Misak-ı Millinin temelleri atıldı ve Heyet-i Temsiliye kuruldu."
          },
          {
            "term": "Sivas Kongresi",
            "def": "4-11 Eylül 1919; tüm Müdafaa-i Hukuk cemiyetleri tek çatıda birleşti, Heyet-i Temsiliye yurdu kapsayacak şekilde genişletildi."
          },
          {
            "term": "Heyet-i Temsiliye",
            "def": "Mustafa Kemal başkanlığında kurulan, milli iradeyi temsil eden ve sonradan devleti fiilen yöneten yürütme organıdır."
          },
          {
            "term": "Misak-ı Milli",
            "def": "28 Ocak 1920de Son Osmanlı Meclis-i Mebusanınca kabul edilen; vatanın sınırlarını ve tam bağımsızlığı ilan eden kararlardır."
          },
          {
            "term": "Meclis Hükümeti",
            "def": "I. TBMMnin benimsediği, yasama, yürütme ve yargı yetkisini mecliste toplayan Güçler Birliği esasına dayalı sistemdir."
          },
          {
            "term": "Hıyanet-i Vataniye Kanunu",
            "def": "29 Nisan 1920de kabul edilen; devlet güvenliğini ve meclisin otoritesini korumaya yönelik ilk temel kanundur."
          },
          {
            "term": "İstiklal Mahkemeleri",
            "def": "18 Eylül 1920de kurulan; yargı yetkisini meclisin bizzat kullandığı, ayaklanma ve ihanetleri engelleyen olağanüstü mahkemelerdir."
          }
        ],
        "timeline": [
          {
            "year": "Haz 1919",
            "name": "Amasya Genelgesi",
            "desc": "Milli egemenlik ifadesi ilk kez dile getirildi; milli bir heyetin toplanması zorunlu kılındı."
          },
          {
            "year": "Tem-Ağu 1919",
            "name": "Erzurum Kongresi",
            "desc": "Manda ve himaye reddedildi, Misak-ı Millinin temelleri atıldı ve Heyet-i Temsiliye seçildi."
          },
          {
            "year": "Eyl 1919",
            "name": "Sivas Kongresi",
            "desc": "Cemiyetler tek çatıda birleşti, tek idare merkezi ve genişletilmiş Heyet-i Temsiliye oluşturuldu."
          },
          {
            "year": "Oca 1920",
            "name": "Misak-ı Milli",
            "desc": "28 Ocakta kabul edildi; 16 Mart 1920de İstanbul işgal edilip mebuslar sürgüne gönderildi."
          },
          {
            "year": "Nis 1920",
            "name": "I. TBMM'nin Açılışı",
            "desc": "23 Nisanda Ankarada açıldı; Mustafa Kemal 110 oyla meclis başkanı seçildi."
          }
        ],
        "matrix": {
          "rowTerm": "Kuruluş",
          "hint": "Amasyadan TBMMye karar basamakları. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Tarih",
            "Yer",
            "Önemi"
          ],
          "rows": [
            {
              "label": "Amasya Genelgesi",
              "cells": [
                "20-22 Haziran 1919",
                "Amasya",
                "Milli egemenlik düşüncesinin ilk ifadesi."
              ]
            },
            {
              "label": "Erzurum Kongresi",
              "cells": [
                "23 Temmuz - 7 Ağustos 1919",
                "Erzurum",
                "Manda ve himaye reddi; Heyet-i Temsiliye kuruldu."
              ]
            },
            {
              "label": "Sivas Kongresi",
              "cells": [
                "4-11 Eylül 1919",
                "Sivas",
                "Cemiyetler tek çatıda toplandı, heyet yurdu kapsadı."
              ]
            },
            {
              "label": "I. TBMM",
              "cells": [
                "23 Nisan 1920",
                "Ankara",
                "Yeni devletin hukuki temeli; Güçler Birliği ve meclis hükümeti."
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "I. Müdafaa-i Hukuk Grubu",
            "desc": "10 Mayıs 1921de Mustafa Kemal Paşa tarafından kurulan çoğunluk grubu; kararları hızlı alma amacı taşıyordu.",
            "branches": [
              {
                "label": "II. Müdafaa-i Hukuk Grubu",
                "d": "Temmuz 1922de kurulan muhalefet; meclis üstünlüğünü ve şahsi yönetimin sınırlandırılmasını savundu."
              }
            ]
          },
          {
            "label": "İstiklal Grubu",
            "desc": "Genç ve reformcu milletvekillerinden oluşan; inkılapçı söylemiyle öne çıkan azınlık grubudur.",
            "branches": []
          },
          {
            "label": "Halk Zümresi",
            "desc": "Bolşevik idaresindeki gelişmelerden etkilenen, sosyal reformları savunan sol eğilimli gruptur.",
            "branches": [
              {
                "label": "Yeşilordu ve Halk İştirakiyun",
                "d": "Meclis içindeki sol ve toplumcu eğilimli hareketlerdir."
              }
            ]
          },
          {
            "label": "Tesanüt ve Islahat Grupları",
            "desc": "Tesanüt eski İttihatçıların dayanışma grubudur; Islahat muhafazakar ve kademeli yeniliği savunur.",
            "branches": []
          }
        ],
        "compare": {
          "left": {
            "title": "HEYET-İ TEMSİLİYE",
            "points": [
              {
                "k": "Nitelik",
                "v": "Kongrelerde kurulan geçici ve icracı milli temsil heyetidir."
              },
              {
                "k": "Yetki",
                "v": "Tek merkezde toplanan fiili idare ve karar organıdır."
              },
              {
                "k": "Meşruiyet",
                "v": "Kongre delegelerinin ve Müdafaa-i Hukuk cemiyetlerinin yetkisidir."
              },
              {
                "k": "Örgütlenme",
                "v": "Yerel direniş odaklarını Ankarada merkezileştirdi."
              }
            ]
          },
          "right": {
            "title": "TBMM HÜKÜMETİ (23 Nisan 1920)",
            "points": [
              {
                "k": "Nitelik",
                "v": "Yasama ve yetkiyi kendinde toplayan meşru ulusal hükümettir."
              },
              {
                "k": "Yetki",
                "v": "Güçler Birliği ile yasama, yürütme ve yargı meclistedir."
              },
              {
                "k": "Meşruiyet",
                "v": "Seçimle oluşan milletvekillerinin iradesine dayanır."
              },
              {
                "k": "Örgütlenme",
                "v": "4 Mayıs 1920de meclis içinden seçilen 11 kişilik İcra Vekilleri Heyeti."
              }
            ]
          }
        },
        "quiz": [
          {
            "q": "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır ifadesi hangi belgededir?",
            "options": [
              "Amasya Genelgesi",
              "Erzurum Bildirisi",
              "Sivas Kararları"
            ],
            "answer": 0,
            "why": "Amasya Genelgesi milli egemenlik düşüncesini ilk kez açık biçimde dile getirmiştir."
          },
          {
            "q": "Heyet-i Temsiliye hangi kongrede Mustafa Kemal başkanlığında oluşturulmuştur?",
            "options": [
              "Sivas Kongresi",
              "Erzurum Kongresi",
              "Amasya Bildirisi"
            ],
            "answer": 1,
            "why": "Erzurum Kongresinde milli iradeyi temsil edecek Heyet-i Temsiliye seçilmiştir."
          },
          {
            "q": "I. TBMMnin benimsediği hükümet sistemi hangisidir?",
            "options": [
              "Parlamenter monarşi",
              "Başkanlık sistemi",
              "Meclis Hükümeti (Güçler Birliği)"
            ],
            "answer": 2,
            "why": "Yasama, yürütme ve yargı yetkileri mecliste toplanmış, meclis başkanı aynı zamanda hükümet başkanı olmuştur."
          }
        ]
      },
      "5": {
        "title": "Türk İstiklal Harbi: Cepheler ve Düzenli Ordu",
        "labels": {
          "matrix": "Cepheler matrisi",
          "tree": "Askeri yapılanma",
          "compare": "Milis vs düzenli ordu",
          "timeline": "Batı Cephesi akışı",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Kuva-yı Milliyeden Düzenli Orduya",
            "d": "Gediz Taarruzunun başarısızlığı milisle zafer kazanılamayacağını kanıtladı; Batı Cephesi ikiye bölünüp düzenli orduya geçildi."
          },
          {
            "t": "Üç Cephe Dengesi",
            "d": "Doğuda Gümrü, Güneyde Ankara Antlaşması ile güvenlik sağlandı; kaynaklar ana tiyatro olan Batı Cephesine aktarıldı."
          },
          {
            "t": "Sakarya Dönüm Noktası",
            "d": "22 gün süren muharebede sath-ı müdafaa stratejisi kazanıldı; Mustafa Kemal Gazi unvanı ve mareşallik rütbesini aldı."
          },
          {
            "t": "Topyekün Seferberlik",
            "d": "Tekâlif-i Milliye ile her evden giysi, ticaretin %40ına ve hayvanların %20sine el konularak ordu beslendi."
          }
        ],
        "concepts": [
          {
            "term": "Kuva-yı Milliye",
            "def": "Halkın kendi imkanlarıyla kurduğu düzensiz milis birlikleri; disiplin eksikliği ve keyfi uygulamalar nedeniyle yerini düzenli orduya bıraktı."
          },
          {
            "term": "Gediz Taarruzu",
            "def": "24 Ekim 1920de Kuva-yı Milliye ile başlatılan başarısız taarruz; düzenli orduya geçişin en somut gerekçesi olmuştur."
          },
          {
            "term": "Tekâlif-i Milliye",
            "def": "7-8 Ağustos 1921de yayımlanan topyekün seferberlik emirleri; giysi, gıda, taşıt ve hayvanların belirli oranlarına el konuldu."
          },
          {
            "term": "Gümrü Antlaşması",
            "def": "3 Aralık 1920; Ermenistanla imzalandı. TBMMnin uluslararası alanda imzaladığı ilk resmi antlaşmadır."
          },
          {
            "term": "Ankara Antlaşması",
            "def": "20 Ekim 1921; Fransa ile imzalandı, Güney Cephesi kapandı ve Hatay özel statüyle dışarıda bırakıldı."
          },
          {
            "term": "Sakarya Meydan Muharebesi",
            "def": "23 Ağustos - 13 Eylül 1921; 22 gün süren savaşta Yunan taarruzu kırıldı, 1683ten beri süren geri çekiliş son buldu."
          },
          {
            "term": "Başkomutanlık",
            "def": "Kütahya-Eskişehir yenilgisinden sonra Mustafa Kemal Paşaya 3 aylığına devredilen yetki; taarruzun hazırlığını sağladı."
          },
          {
            "term": "Mudanya Mütarekesi",
            "def": "11 Ekim 1922; Doğu Trakya ve Boğazlar savaş yapılmadan diplomatik yolla kurtarıldı."
          }
        ],
        "timeline": [
          {
            "year": "Oca 1921",
            "name": "I. İnönü Muharebesi",
            "desc": "Düzenli ordunun ilk zaferi; Çerkez Ethem fırsatçılığına karşı Yunan saldırısı püskürtüldü."
          },
          {
            "year": "Mar-Nis 1921",
            "name": "II. İnönü Muharebesi",
            "desc": "İsmet Paşa savunmayı başardı; milletin makûs talihinin de yendiği telgrafla duyuruldu."
          },
          {
            "year": "Tem 1921",
            "name": "Kütahya-Eskişehir",
            "desc": "Üstün taarruz karşısında ordumuz Sakaryanın doğusuna çekildi; Başkomutanlık yetkisi devralındı."
          },
          {
            "year": "Ağu-Eyl 1921",
            "name": "Sakarya Meydan Muharebesi",
            "desc": "22 gün 22 gece süren savunma zaferi; Gazi unvanı ve mareşallik rütbesi verildi."
          },
          {
            "year": "Ağu 1922",
            "name": "Büyük Taarruz",
            "desc": "26-30 Ağustos'ta Dumlupınarda Yunan ordusu imha edildi, 9 Eylülde İzmire girildi."
          }
        ],
        "matrix": {
          "rowTerm": "Cephe",
          "hint": "Üç cephenin askeri yapımı ve kapatan antlaşmalar. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Doğu Cephesi",
            "Güney Cephesi",
            "Batı Cephesi"
          ],
          "rows": [
            {
              "label": "Düşman Gücü",
              "cells": [
                "Ermenistan",
                "Fransa ve Ermeni çeteleri",
                "Yunanistan ve İngiltere desteği"
              ]
            },
            {
              "label": "Askeri Birlik",
              "cells": [
                "15. Kolordu (düzenli)",
                "Kuva-yı Milliye halk direnişi",
                "Kuva-yı Milliyeden düzenli orduya"
              ]
            },
            {
              "label": "Kritik Komutanlar",
              "cells": [
                "Kâzım Karabekir Paşa",
                "Sütçü İmam, Ali Saip, Şahin Bey",
                "İsmet Paşa ve Mustafa Kemal Paşa"
              ]
            },
            {
              "label": "Sonuçlandıran Belge",
              "cells": [
                "Gümrü Antlaşması (1920)",
                "Ankara Antlaşması (1921)",
                "Mudanya Mütarekesi (1922)"
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "Kuva-yı Milliye (Halk Milisleri)",
            "desc": "Yerel direnişi ateşledi; düşmanı oyaladı ve köyleri korudu, ancak disiplinsizliğiyle zafer getirmedi.",
            "branches": [
              {
                "label": "Gediz Taarruzu Kırılması",
                "d": "24 Ekim 1920 başarısızlığı düzensiz birliklerle stratejik zaferin mümkün olmadığını gösterdi."
              },
              {
                "label": "İsyan Eden Kollar",
                "d": "Çerkez Ethem ve Demirci Efe gibi liderler düzenli orduya katılmayı reddetti, yeni ordu bunları bastırdı."
              }
            ]
          },
          {
            "label": "Düzenli Ordu",
            "desc": "Merkezden komuta edilen, disiplinli ve donanımlı ordu; kesin zaferin taşıyıcısı olmuştur.",
            "branches": [
              {
                "label": "Batı Cephesi",
                "d": "İsmet Paşa komutasında Kuzey Cephesi; İnönü zaferlerinden Büyük Taarruza uzanan ana tiyatrodur."
              },
              {
                "label": "Güney Cephesi",
                "d": "Refet Bey komutasında Fransızlarla mücadele; Ankara Antlaşması ile kapandı."
              },
              {
                "label": "Doğu Cephesi",
                "d": "Kâzım Karabekirin 15. Kolordusu Gümrü zaferiyle doğuyu güvene aldı, birlikler Batıya kaydırıldı."
              }
            ]
          }
        ],
        "compare": {
          "left": {
            "title": "KUVA-YI MİLLİYE (Milis)",
            "points": [
              {
                "k": "Yönetim",
                "v": "Tek merkez yok; her çete lideri kendi kuvvetiyle müstakil hareket eder."
              },
              {
                "k": "Yöntem",
                "v": "Çete harbi ve gerilla; savunmacı, oyalayıcı direniş."
              },
              {
                "k": "Sınırlar",
                "v": "Keyfi mal toplama ve yargısız infaz riski; disiplin zayıflığı."
              },
              {
                "k": "İşlev",
                "v": "Düşmanı durdurmak, halkı korumak ve TBMMe zaman kazandırmak."
              }
            ]
          },
          "right": {
            "title": "DÜZENLİ ORDU",
            "points": [
              {
                "k": "Yönetim",
                "v": "Tek komuta ve hiyerarşi; Genelkurmay ve cephe komutanlıkları."
              },
              {
                "k": "Yöntem",
                "v": "Nizamî harp, cephane ve lojistikle taarruz gücü."
              },
              {
                "k": "Gerekçe",
                "v": "Gediz başarısızlığı ve disiplinli taarruz gücünün zorunluluğu."
              },
              {
                "k": "Sonuç",
                "v": "İnönüden Büyük Taarruza zafer ve Mudanya ile barış."
              }
            ]
          }
        },
        "quiz": [
          {
            "q": "Kuva-yı Milliyeden düzenli orduya geçişi kanıtlayan başarısızlık hangisidir?",
            "options": [
              "I. İnönü Muharebesi",
              "Gediz Taarruzu",
              "Kütahya-Eskişehir Muharebeleri"
            ],
            "answer": 1,
            "why": "24 Ekim 1920 Gediz Taarruzunun başarısızlığı üzerine düzenli orduya geçilmiştir."
          },
          {
            "q": "TBMMnin uluslararası alanda imzaladığı ilk resmi antlaşma hangisidir?",
            "options": [
              "Ankara Antlaşması",
              "Moskova Antlaşması",
              "Gümrü Antlaşması"
            ],
            "answer": 2,
            "why": "3 Aralık 1920de Ermenistanla imzalanan Gümrü Antlaşması TBMMnin ilk resmi antlaşmasıdır."
          },
          {
            "q": "Sakarya Meydan Muharebesi sonrası Mustafa Kemal Paşaya verilen unvan ve rütbeler hangileridir?",
            "options": [
              "Halaskar ve general",
              "Gazi ve mareşal",
              "Reis ve başkomutan"
            ],
            "answer": 1,
            "why": "Sakarya zaferi sonrası Mustafa Kemal Paşaya Gazi unvanı ve mareşallik rütbesi verilmiştir."
          }
        ]
      },
      "6": {
        "title": "Lozan Barış Antlaşması ve Kuruluş Belgesi",
        "labels": {
          "matrix": "Temel meseleler",
          "tree": "Antlaşma yapısı",
          "compare": "I. ve II. Dönem",
          "timeline": "Lozan kronolojisi",
          "factors": "Başarıda etkenler",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Saltanatın Kaldırılması Oyunu Bozdu",
            "d": "İtilaf Devletlerinin iki hükümeti de davet ederek Türk tarafını bölmek istemesi üzerine 1 Kasım 1922de saltanat kaldırıldı."
          },
          {
            "t": "İsmet Paşanın Duruşu",
            "d": "Ben buraya Mondrosdan değil, Mudanyadan geldim sözü, masaya eşit ve muzaffer devlet olarak oturmayı ifade eder."
          },
          {
            "t": "Kapitülasyonların Tam Kaldırılması",
            "d": "Adli, mali ve idari tüm kapitülasyonlar kayıtsız şartsız kaldırıldı; tam bağımsızlığın önündeki en büyük engel yok edildi."
          },
          {
            "t": "Lozan Tapu Senedidir",
            "d": "143 madde ve 17 ekle 24 Temmuz 1923te imzalanan antlaşma, Cumhuriyetin uluslararası hukuktaki kurucu belgesidir."
          }
        ],
        "concepts": [
          {
            "term": "Saltanatın Kaldırılması",
            "def": "1 Kasım 1922de kabul edilen kanun; İstanbul Hükümeti hukuken sona erdi ve Lozanda temsil yetkisi TBMMe geçti."
          },
          {
            "term": "Kapitülasyonlar",
            "def": "Osmanlıda yabancılara tanınan imtiyazlar; Lozanda adli, mali ve idari tümü kayıtsız şartsız kaldırıldı."
          },
          {
            "term": "Karaağaç",
            "def": "Yunanistanın ödemesi gereken savaş tazminatı yerine Doğu Trakya sınırındaki bu bölge Türkiyeye devredildi."
          },
          {
            "term": "Düyun-u Umumiye",
            "def": "Osmanlı borçlarının toplandığı idare; Lozan sonrasi kaldırıldı, borçlar bölünüp Türkiyenin payı kâğıt para üzerinden taksitlendirildi."
          },
          {
            "term": "Nüfus Mübadelesi",
            "def": "İstanbul Rumlari ve Batı Trakya Türkleri dışında Türkiyedeki Rumlarla Yunanistandaki Türklerin zorunlu nüfus değişimi kararlaştırıldı."
          },
          {
            "term": "Boğazlar Komisyonu",
            "def": "Lozanda başkanı Türk olan uluslararası bir komisyon kuruldu; 1936 Montrö ile tam Türk egemenliğine devredildi."
          },
          {
            "term": "Musul Meselesi",
            "def": "Lozanda çözülemeyen tek konu; Türkiye ile İngiltere arasında ikili görüşmelere bırakıldı, 1926da çözüldü."
          },
          {
            "term": "Patrikhane",
            "def": "Fanari Rum Patrikhanesinin yetkileri sınırlandı; Rumların Türkiye içinde dini bir merkeze bağlılık sorunu ele alındı."
          }
        ],
        "timeline": [
          {
            "year": "Eki 1922",
            "name": "Mudanya ve Davet",
            "desc": "Mudanya Mütarekesi ile askeri safha bitti; İtilaf Devletleri Lozan için davet mektubu gönderdi."
          },
          {
            "year": "Kas 1922",
            "name": "Saltanatın Kaldırılması",
            "desc": "1 Kasimda saltanat kaldırıldı; Vahdettin ülkeyi terk etti, temsil yetkisi TBMMe geçti."
          },
          {
            "year": "Kas 1922",
            "name": "I. Dönem Başladı",
            "desc": "20 Kasımda I. Dönem görüşmeleri başladı; Lord Curzon Sevrin hafifletilmesini dayatmaya çalıştı."
          },
          {
            "year": "Şub 1923",
            "name": "Kesinti",
            "desc": "4 Şubatta görüşmeler kesildi; arada İzmir İktisat Kongresi ile ekonomik bağımsızlık ilan edildi."
          },
          {
            "year": "Tem 1923",
            "name": "İmza",
            "desc": "24 Temmuz 1923te Rumine Sarayında Lozan Barış Antlaşması imzalandı."
          }
        ],
        "factors": {
          "items": [
            {
              "side": "ic",
              "t": "Askeri Zaferin Diplomasiye Gücü",
              "d": "Büyük Taarruz ve Mudanya, masaya muzaffer devlet olarak oturmayı sağladı."
            },
            {
              "side": "ic",
              "t": "Heyetin Kararlılığı",
              "d": "Tavizsiz kapitülasyon ve Ermeni yurdu reddi, görüşmelerin kesilmesine kadar götürdü."
            },
            {
              "side": "ic",
              "t": "Saltanatın Kaldırılması",
              "d": "İki hükümet oyunu bozuldu; tek meşru temsilci TBMM Hükümeti oldu."
            },
            {
              "side": "dis",
              "t": "İtilaf Devletleri Arasındaki Ayrılık",
              "d": "İngiltere, Fransa ve İtalya arasındaki çatışma Türkiyenin manevra alanını genişletti."
            },
            {
              "side": "dis",
              "t": "İzmir İktisat Kongresi",
              "d": "Kesinti döneminde ekonomik bağımsızlık ilanı, Türkiyenin yeni savaşı göze alabileceğini gösterdi."
            }
          ]
        },
        "compare": {
          "left": {
            "title": "I. DÖNEM (20 Kas - 4 Şub)",
            "points": [
              {
                "k": "Ağırlık",
                "v": "Sınır, askeri ve siyasi meseleler; Musul ve Ermeni yurdu talepleri."
              },
              {
                "k": "Baskı",
                "v": "Lord Curzon Mondros mantığıyla Sevrin hafifletilmesini dayatmaya çalıştı."
              },
              {
                "k": "Türk Duruşu",
                "v": "Mondrosdan değil Mudanyadan geldik; bağımsızlık talebi tavizsiz."
              },
              {
                "k": "Sonuç",
                "v": "4 Şubatta tıkanma; görüşmeler kesintiye uğradı."
              }
            ]
          },
          "right": {
            "title": "II. DÖNEM (23 Nis - 24 Tem)",
            "points": [
              {
                "k": "Ağırlık",
                "v": "Mali ve ekonomik konular; kapitülasyonlar, borçlar, tazminat."
              },
              {
                "k": "Baskı",
                "v": "İtilaf Devletleri geri adım atmak zorunda kaldı."
              },
              {
                "k": "Türk Duruşu",
                "v": "Kapitülasyonların tam kaldırılması ve Karaağaçın tazminat olarak alınması."
              },
              {
                "k": "Sonuç",
                "v": "24 Temmuzda 143 maddelik antlaşma imzalandı."
              }
            ]
          }
        },
        "quiz": [
          {
            "q": "Lozan davetinin iki hükümeti birden kapsaması üzerine Türkiyenin aldığı karar nedir?",
            "options": [
              "Konferansa katılmamak",
              "Saltanatı kaldırmak",
              "Heyeti geri çekmek"
            ],
            "answer": 1,
            "why": "1 Kasım 1922de saltanat kaldırılarak İstanbul Hükümeti hukuken sona erdi ve temsil yetkisi TBMMe geçti."
          },
          {
            "q": "Lozanda çözülemeyen ve ikili görüşmelere bırakılan tek konu hangisidir?",
            "options": [
              "Kapitülasyonlar",
              "Boğazlar",
              "Musul Meselesi"
            ],
            "answer": 2,
            "why": "Musul Meselesi Lozanda çözülememiş, 1926 Ankara Antlaşması ile sonuçlandırılmıştır."
          },
          {
            "q": "Lozan Barış Antlaşmasının imza tarihi ve sayısı nedir?",
            "options": [
              "24 Temmuz 1923, 143 madde",
              "11 Ekim 1922, 100 madde",
              "23 Nisan 1920, 24 madde"
            ],
            "answer": 0,
            "why": "24 Temmuz 1923te 143 madde ve 17 ek protokolle imzalanmıştır."
          }
        ]
      },
      "7": {
        "title": "Atatürk Dönemi İç Politika ve Siyasi Hayat",
        "labels": {
          "matrix": "Parti karşılaştırması",
          "tree": "Partiler tarihi",
          "compare": "CHF vs muhalefet",
          "timeline": "1923-1930 kronolojisi",
          "factors": "Çok partili hayat engelleri",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "Çift Başsızlığa Son",
            "d": "29 Ekim 1923 Cumhuriyet ve 3 Mart 1924 Halifeliğin Kaldırılması ile egemenlik kayıtsız şartsız millete geçti."
          },
          {
            "t": "Ordunun Siyasetten Ayrılması",
            "d": "Askerlik ve milletvekilliğinin birleşmemesi ilkesi, ilk muhalefet partisinin doğumuna zemin hazırladı."
          },
          {
            "t": "İki Deneme, İki Kapanış",
            "d": "TCF Şeyh Sait isyanından sonra, SCF Menemen ve Fırka Faciası sürecinde kapandı; çok partili hayat kesintiye uğradı."
          },
          {
            "t": "Takrir-i Sükûn ve İstiklal Mahkemeleri",
            "d": "1925 sonrası iç güvenlik rejimi, isyan ve suikast girişimlerine karşı devlet otoritesini güçlendirdi."
          }
        ],
        "concepts": [
          {
            "term": "Cumhuriyet Halk Fırkası",
            "def": "1923te Mustafa Kemal liderliğinde kurulan tek parti; 1930da CHP adını aldı; devrimlerin taşıyıcısıdır."
          },
          {
            "term": "Terakkiperver Cumhuriyet Fırkası",
            "def": "17 Kasım 1924te Karabekir, Cebesoy, Orbay, Bele ve Adıvar tarafından kurulan ilk muhalefet partisi; liberal ve adem-i merkeziyetçi."
          },
          {
            "term": "Serbest Cumhuriyet Fırkası",
            "def": "1930da Ali Fethi Okyar tarafından Mustafa Kemalin teşvikiyle kurulan ikinci çok partili deneme."
          },
          {
            "term": "Takrir-i Sükûn Kanunu",
            "def": "1925te çıkarıldı; rejim karşıtı hareketlerle mücadele için hükümete olağanüstü yetkiler verdi."
          },
          {
            "term": "İstiklal Mahkemeleri",
            "def": "Şeyh Sait isyanı sonrasi yeniden kuruldu; ihanet ve ayaklanmalara karşı olağanüstü yargı organıdır."
          },
          {
            "term": "İzmir Suikastı Girişimi",
            "def": "1926da Mustafa Kemal Paşaya yapılmak istenen suikast; eski İttihatçı ve muhalif çevrelerin yargılanmasına yol açtı."
          },
          {
            "term": "Menemen Olayı",
            "def": "1930da Asteğmen Kubilayın şehit edilmesi; toplumun çok partili hayata henüz hazır olmadığını gösterdi."
          },
          {
            "term": "Fırka Faciası",
            "def": "SCFnin hızlı yükselişinin ardından rejim karşıtı odakların toplanma merkezine dönüştüğünün görülmesi üzerine feshi."
          }
        ],
        "timeline": [
          {
            "year": "1923",
            "name": "Cumhuriyetin İlanı",
            "desc": "29 Ekimde devlet hanedanlıktan ulusal devlete dönüştürüldü; rejim temeli atıldı."
          },
          {
            "year": "1924",
            "name": "Halifelik ve TCF",
            "desc": "3 Martta halifelik kaldırıldı; 17 Kasım 1924te Terakkiperver Cumhuriyet Fırkası kuruldu."
          },
          {
            "year": "1925",
            "name": "Şeyh Sait ve TCF",
            "desc": "İşyan bastırıldı; Takrir-i Sükûn çıktı, İstiklal Mahkemeleri kuruldu, TCF 5 Haziranda kapandı."
          },
          {
            "year": "1926",
            "name": "İzmir Suikastı",
            "desc": "Suikast girişimi bastırıldı; iç güvenlik tedbirleri sıkılaştırıldı."
          },
          {
            "year": "1930",
            "name": "SCF ve Menemen",
            "desc": "Serbest Cumhuriyet Fırkası kuruldu; kasımda feshedildi, ardından Menemen Olayı yaşandı."
          }
        ],
        "matrix": {
          "rowTerm": "Parti",
          "hint": "Partilerin kurulus, ideoloji ve kapanis özeti. Mobilde tabloyu yana kaydirin.",
          "axes": [
            "Kurulus",
            "Ideoloji",
            "Kapanis Nedeni"
          ],
          "rows": [
            {
              "label": "CHF (CHP)",
              "cells": [
                "1923, Mustafa Kemal",
                "Milliyetçilik, devrimcilik, halkçılık",
                "1930da CHP adını aldı; 1946ya dek tek parti"
              ]
            },
            {
              "label": "TCF",
              "cells": [
                "17 Kasım 1924",
                "Muhafazakar demokrasi, liberalizm, dindar saygı",
                "Şeyh Sait isyanı bahanesiyle 5 Haziran 1925te kapandı"
              ]
            },
            {
              "label": "SCF",
              "cells": [
                "Ağustos 1930, Fethi Okyar",
                "Ekonomik bağımsızlık, muhalefet denetimi",
                "Fırka Faciası; 17 Kasım 1930da feshedildi"
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "CHF / CHP",
            "desc": "Milli Mücadele ve devrimlerin ana taşıyıcısı; tek parti döneminde rejimin kurumsal ekseni.",
            "branches": [
              {
                "label": "Devrimler",
                "d": "Halifelik, saltanat, harf ve medeni kanun değişiklikleri partinin programıdır."
              },
              {
                "label": "Ordu-Siyaset Ayrılımı",
                "d": "Askerler meclisten ayrıldı; muhalefet ordu dışından doğdu."
              }
            ]
          },
          {
            "label": "Terakkiperver Cumhuriyet Fırkası",
            "desc": "1924te kurulan ilk muhalefet; tüzüğünde dine saygı ve adem-i merkeziyetçilik vurgusu vardı.",
            "branches": [
              {
                "label": "Kurucular",
                "d": "Karabekir, Cebesoy, Orbay, Bele, Adıvar; meclisteki muhalefet çekirdeğidir."
              },
              {
                "label": "Kapanma",
                "d": "Şeyh Sait isyanı sonrası Takrir-i Sükûn döneminde 5 Haziran 1925te kapandı."
              }
            ]
          },
          {
            "label": "Serbest Cumhuriyet Fırkası",
            "desc": "1930da Ali Fethi Okyar liderliğinde; ekonomik kaygilar ve parti teşvikleriyle kuruldu.",
            "branches": [
              {
                "label": "Yükseliş",
                "d": "Halkın yoğun ilgisi; iktidar çevresinde çekince yarattı."
              },
              {
                "label": "Feshi",
                "d": "Fethi Okyar, Gazi ile karşı karşıya gelmemek adına 17 Kasım 1930da feshetti."
              }
            ]
          }
        ],
        "factors": {
          "items": [
            {
              "side": "ic",
              "t": "İç Güvenlik Krizleri",
              "d": "Şeyh Sait İsyanı, İzmir suikast girişimi ve Menemen, rejimin otoritesini sorgulattı."
            },
            {
              "side": "ic",
              "t": "Muhalefetin Yapısı",
              "d": "Eski İttihatçı ve milli mücadele kahramanlarının ayrışması partileşmeyi hızlandırdı."
            },
            {
              "side": "ic",
              "t": "İktisadi Bunalım",
              "d": "1929 Dünya Ekonomik Bunalımı, SCFnin kuruluş gerekçelerinden biri oldu."
            },
            {
              "side": "dis",
              "t": "Dış Baskı ve Tehdit Algısı",
              "d": "Sınır güvenliği ve rejimin tescili, merkeziyetçi ve güvenlikçi bir yapının kurulmasını telkin etti."
            }
          ]
        },
        "quiz": [
          {
            "q": "Terakkiperver Cumhuriyet Fırkası hangi görüş ayrılığı sonrasında kurulmuştur?",
            "options": [
              "İktisat politikaları",
              "Hükümetin otoriterleştiği ve devletçilik eleştirisi",
              "Halifelik konusu"
            ],
            "answer": 1,
            "why": "TCF kurucuları hükümetin otoriterleştiği ve devletçi iktisat politikalarının yetersiz kaldığı düşüncesindedir."
          },
          {
            "q": "Takrir-i Sükûn Kanunu hangi olay sonrası çıkartılmıştır?",
            "options": [
              "İzmir Suikastı",
              "Şeyh Sait İsyanı",
              "Menemen Olayı"
            ],
            "answer": 1,
            "why": "Şeyh Sait İsyanı sonrası 1925te çıkarılmıştır."
          },
          {
            "q": "Ordu ile siyasetin ayrılması ilkesi ilk muhalefet partisini nasıl etkilemiştir?",
            "options": [
              "Parti kapanmasına yol açtı",
              "Komutanların meclisteki muhalefete geçmesine zemin hazırladı",
              "Ordunun siyaseti bırakmasını engelledi"
            ],
            "answer": 1,
            "why": "Karabekir, Cebesoy ve Eğilmez gibi komutanlar ordudan istifa ederek meclisteki muhalefet saflarına katılmıştır."
          }
        ]
      },
      "8": {
        "title": "Atatürk Dönemi Dış Politika (1923-1938)",
        "labels": {
          "matrix": "Dönem karşılaştırması",
          "tree": "Paktlar ağı",
          "compare": "1923-32 ve 1932-38",
          "timeline": "Hatay ve Montrö akışı",
          "quiz": "Pekiştirme testi",
          "concepts": "Kavramlar"
        },
        "takeaways": [
          {
            "t": "İki Evre: Pürüzlerin Temizlenmesi ve Aktif Diplomasi",
            "d": "1923-1932 Lozanın kalan sorunlarını temizlerken, 1932-1938 kolektif güvenlik ve bölgesel paktlar dönemidir."
          },
          {
            "t": "Musul Kaybı, Petrol Geliri",
            "d": "1926 Ankara Antlaşması ile Musul Irakta bırakıldı; karşılıkta Irak petrol gelirlerinin %10u 25 yıl Türkiyeye verildi."
          },
          {
            "t": "Montrö ile Tam Egemenlik",
            "d": "20 Temmuz 1936 Montrö Sözleşmesi ile Boğazların tüm yönetimi ve askerlendirme hakkı Türkiyeye devredildi."
          },
          {
            "t": "Hatay ve Barış Paktları",
            "d": "Balkan Antantı ve Sadabat Paktı sınırları güvenceye aldı; Hatay 1939da anavatana katıldı."
          }
        ],
        "concepts": [
          {
            "term": "Milletler Cemiyeti Üyeliği",
            "def": "18 Temmuz 1932de 43 üye oy birliğiyle kabul etti; Türkiye davet edilirse katılır ilkesiyle girdi."
          },
          {
            "term": "Balkan Antantı",
            "def": "9 Şubat 1934te Türkiye, Yunanistan, Romanya ve Yugoslavya arasında Atinada imzalandı; Batı sınırları güvenceye alındı."
          },
          {
            "term": "Sadabat Paktı",
            "def": "8 Temmuz 1937de Türkiye, İran, Irak ve Afganistan arasında Tahrandaki Sadabat Sarayında kuruldu; doğu sınırlarını korumayı amaçladı."
          },
          {
            "term": "Montrö Boğazlar Sözleşmesi",
            "def": "20 Temmuz 1936; Uluslararası Boğazlar Komisyonu kaldırıldı, Boğazların tam egemenliği Türkiyeye geçti."
          },
          {
            "term": "Nüfus Mübadelesi (Etabli)",
            "def": "İstanbul Rumlari ve Batı Trakya Türklerinin etabli sayılması tartışması; 1930 Ankara Sözleşmesi ile çözüldü."
          },
          {
            "term": "Yabancı Okullar",
            "def": "Tevhid-i Tedrisat ile Türk kanunlarına uyma ve Türkçe-tarih derslerinin Türk öğretmenlerince okutulması şartı konuldu."
          },
          {
            "term": "Kellogg-Briand Paktı",
            "def": "1929da savaşı kanun dışı sayan pakta Türkiye de katıldı; barışçı çizginin göstergesi oldu."
          },
          {
            "term": "Hatay Meselesi",
            "def": "Atatürkün şahsi meselem dediği süreç; 1938de Bağımsız Hatay Devleti, 23 Haziran 1939da anavatana katılım."
          }
        ],
        "timeline": [
          {
            "year": "1926",
            "name": "Ankara Antlaşması (Musul)",
            "desc": "Musul Irakta bırakıldı; Irak petrol gelirlerinin %10u 25 yıl Türkiyeye verildi."
          },
          {
            "year": "1930",
            "name": "Ankara Sözleşmesi",
            "desc": "Nüfus mübadelesi etabli sorunu çözüldü; Türk-Yunan dostluğu ve Nobel adaylığı süreci."
          },
          {
            "year": "1932",
            "name": "Milletler Cemiyeti",
            "desc": "18 Temmuzda üye olundu; Musul kararı nedeniyle mesafeli duruş sona erdi."
          },
          {
            "year": "1936",
            "name": "Montrö Sözleşmesi",
            "desc": "20 Temmuzda imzalandı; Boğazlarda tam Türk egemenliği sağlandı."
          },
          {
            "year": "1939",
            "name": "Hatay Anavatana",
            "desc": "23 Haziran 1939da Hatay Millet Meclisi anavatana katılma kararı aldı."
          }
        ],
        "matrix": {
          "rowTerm": "Dönem",
          "hint": "1923-1932 ve 1932-1938 dönemlerinin stratejik özeti. Mobilde tabloyu yana kaydırın.",
          "axes": [
            "Ana Gündem",
            "Başlıca Adımlar"
          ],
          "rows": [
            {
              "label": "1923-1932",
              "cells": [
                "Lozanın kalan sorunları, egemenlik tescili",
                "Musul, yabancı okullar, etabli mübadelesi, ABD ile normalleşme"
              ]
            },
            {
              "label": "1932-1938",
              "cells": [
                "Kolektif güvenlik, aktif diplomasi",
                "Milletler Cemiyeti, Balkan Antantı, Montrö, Sadabat, Hatay"
              ]
            }
          ]
        },
        "tree": [
          {
            "label": "Barış ve Güvenlik Paktları",
            "desc": "Sınır güvenliğini ve kolektif savunmayı esas alan, Türkiyenin öncülük veya katıldığı antlaşmalar.",
            "branches": [
              {
                "label": "Balkan Antantı (1934)",
                "d": "Türkiye, Yunanistan, Romanya, Yugoslavya; Batı sınırı güvence altına alındı."
              },
              {
                "label": "Sadabat Paktı (1937)",
                "d": "Türkiye, İran, Irak, Afganistan; doğu sınırları korumaya alındı."
              },
              {
                "label": "Kellogg-Briand (1929)",
                "d": "Savaşı kanun dışı sayan pakta katılım; barışçı politikanın tescili."
              }
            ]
          },
          {
            "label": "Egemenlik Mimarisi",
            "desc": "Lozandan devralınan kısıtlamaları kaldıran ve tam bağımsızlığı pekiştiren adımlar.",
            "branches": [
              {
                "label": "Montrö (1936)",
                "d": "Boğazlarda tam egemenlik; komisyon yönetimi sona erdi."
              },
              {
                "label": "Hatay (1938-39)",
                "d": "Özerklik, bağımsız devlet ve anavatana katılım zinciri."
              }
            ]
          }
        ],
        "quiz": [
          {
            "q": "Boğazlarda tam Türk egemenliğini sağlayan antlaşma hangisidir?",
            "options": [
              "Lozan Boğazlar Kararı",
              "Montrö Boğazlar Sözleşmesi",
              "Ankara Sözleşmesi"
            ],
            "answer": 1,
            "why": "20 Temmuz 1936 Montrö Sözleşmesi ile Boğazların tüm yönetimi Türkiyeye devredildi."
          },
          {
            "q": "Türkiye Milletler Cemiyetine hangi yıl üye olmuştur?",
            "options": [
              "1926",
              "1932",
              "1934"
            ],
            "answer": 1,
            "why": "18 Temmuz 1932de davet üzerine 43 üyinin oy birliğiyle cemiyete girilmiştir."
          },
          {
            "q": "Hatayın anavatana katılma kararı hangi tarihte alınmıştır?",
            "options": [
              "2 Eylül 1938",
              "23 Haziran 1939",
              "20 Temmuz 1936"
            ],
            "answer": 1,
            "why": "Hatay Millet Meclisi 23 Haziran 1939da anavatana katılma kararı almıştır."
          }
        ]
      }
    }
  },
  "osmanlica-1": {
    "title": "Osmanlı Türkçesi I İnteraktif Paneli",
    "subtitle": "AÖF TAR111U müfredatına uygun modüler analiz",
    "labels": {},
    "takeaways": [
      {
        "t": "Alfabenin Esası ve Türkçe Unsurlar",
        "d": "Osmanlı Türkçesi, 28 Arap harfine pe, çe, je, nazal n, gef ve lamelif eklenerek oluşturulmuş bir alfabeyle yazılır. Türkçe kelimelerin okunuşunda okutucu harfler ve kalıplaşmış imla kuralları belirleyicidir."
      },
      {
        "t": "Fiil Kipleri ve Gramer Yapıları",
        "d": "Türkçe yapım ve çekim ekleri ile kipler kalıplaşmış harf dizilimleriyle gösterilir. Şahıs, iyelik ve yönelme eklerinde damaksı n (sağır kef) kullanımı öne çıkan imla özelliklerindendir."
      },
      {
        "t": "Arapça ve Farsça Kelime Yapısı",
        "d": "Arapça ve Farsça kökenli kelimelerde kısa ünlüler harfle yazılmazken uzun ünlüler elif, vav ve ye ile gösterilir. Arapça bükünlü bir yapıya sahip olup türetmeler aslî kök harfleri üzerinden yapılır."
      },
      {
        "t": "Masdarlar, Vezinler ve Çatılar",
        "d": "Arapça sülâsî mücerred masdarlar semâî iken mezîdünfih masdarlar kıyasî olarak türetilir. Mezîdünfih bablar ve türetilen ism-i fâil ile ism-i mef'ûl kalıpları kelimelere yeni anlamlar kazandırır."
      }
    ],
    "concepts": [
      {
        "term": "Okutucu Harfler",
        "def": "Türkçe kelimelerdeki ünlü sesleri göstermek için kullanılan elif (ا), he (ه), vav (و) ve ye (ى) harfleridir."
      },
      {
        "term": "Genizsi n (Sağır Kef)",
        "def": "Havanın geniz yolundan salınmasıyla çıkarılan ve Osmanlı imlasında kef (ك) harfiyle gösterilen Türkçe n sesidir."
      },
      {
        "term": "Bitişmeyen Harfler",
        "def": "Kendinden sonra gelen harfle birleşmeyen elif, dal, zel, rı, ze, je, vav ve sonda ünlü olan he harfleridir."
      },
      {
        "term": "Uzun Ünlüler (Hurûf-ı Med)",
        "def": "Arapça ve Farsça kelimelerde â, û ve î seslerini uzatarak okutan elif, vav ve ye harfleridir."
      },
      {
        "term": "Aslî ve Zâid Harfler",
        "def": "Arapça kelimelerde kökü oluşturan en az üç harf aslî, yeni kelime veya vezin türetmek için eklenen harfler ise zâid harflerdir."
      },
      {
        "term": "Vezin Sistematiği",
        "def": "Arapça kelimelerin aslî harflerinin yerine sırasıyla fe, ayn ve lam simgeleri konularak kelime kalıbının çıkarılmasıdır."
      },
      {
        "term": "Aksâm-ı Seb'a",
        "def": "Arapça kelimelerin kök harflerinin sahih veya illetli oluşuna göre sâlim, mehmûz, muzâaf, misâl, ecvef, nâkıs ve lefîf olarak yedi gruba ayrılmasıdır."
      },
      {
        "term": "Sülâsî Mücerred Masdar",
        "def": "Üç aslî harften oluşan ve yapısında ilave zâid harf barındırmayan kuralsız (semâî) masdarlardır."
      },
      {
        "term": "Mezîdünfih Masdar",
        "def": "Üç aslî harfli köklere zâid harfler eklenerek İf'âl, Tef'îl, Tefa''ul, Tefâ'ul ve Müfâ'ale gibi kalıplarla kurallı biçimde türetilen masdarlardır."
      }
    ],
    "chapters": {
      "1": {
        "title": "Osmanlı Türkçesi Alfabesi",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Bitişme Özellikleri Karşılaştırması",
          "matrix": "Harekeler ve İşaretler Tablosu"
        },
        "takeaways": [
          {
            "t": "Alfabenin Temeli ve İlave Harfler",
            "d": "Osmanlı alfabesi 28 harfli Arap alfabesine dayanır. Türkler ve İranlılar pe, çe, je, nazal n, gef ve lamelif harflerini ekleyerek alfabeyi genişletmişlerdir."
          },
          {
            "t": "Harekeler ve Yardımcı İşaretler",
            "d": "Kısa ünlüleri okutmak için üstün, esre ve ötre kullanılır. Şedde harfi iki kez okuturken cezm sakin okutur, med ise uzatma sağlar."
          },
          {
            "t": "Bitişen ve Bitişmeyen Harfler",
            "d": "Osmanlı Türkçesinde yazım sağdan sola doğrudur. Harflerin çoğu iki tarafa da bitişirken sekiz harf kendinden sonrakiyle birleşmez."
          },
          {
            "t": "Şekilce Benzer Harfler",
            "d": "Alfabetik sırada birçok harf temel gövde olarak birbirine benzer. Bu harfler sadece altlarına veya üstlerine konan nokta sayılarıyla ayırt edilir."
          }
        ],
        "concepts": [
          {
            "term": "Arap Alfabesi Temeli",
            "def": "Osmanlı Türkçesi yazı sisteminin esasını oluşturan 28 harfli temel alfabedir."
          },
          {
            "term": "İlave Harfler",
            "def": "Arapçada bulunmayıp Farsça ve Türkçe sesleri karşılamak için eklenen pe, çe, je, nazal n, gef ve lamelif harfleridir."
          },
          {
            "term": "Üstün (Fetha)",
            "def": "Harfin üstüne konulan ve harfi a veya e sesiyle okutan hareke işaretidir."
          },
          {
            "term": "Esre (Kesre)",
            "def": "Harfin altına konulan ve harfi ı veya i sesiyle okutan hareke işaretidir."
          },
          {
            "term": "Ötre (Damme)",
            "def": "Harfin üstüne konulan ve harfi o, ö, u veya ü sesiyle okutan hareke işaretidir."
          },
          {
            "term": "Şedde",
            "def": "Harfin üzerine konularak yan yana gelen aynı ünsüzün iki defa okunmasını sağlayan işarettir."
          },
          {
            "term": "Cezm (Sükun)",
            "def": "Harfin üzerine konularak o harfi ünsüz ve duruk biçimde okutan yardımcı işarettir."
          },
          {
            "term": "Bitişmeyen Harfler",
            "def": "Sadece kendinden önceki harfle birleşip sonrasıyla birleşmeyen elif, dal, zel, rı, ze, je, vav ve sonda ünlü olan he harfleridir."
          }
        ],
        "quiz": [
          {
            "q": "Aşağıdaki harflerden hangisi Arap alfabesinde bulunmayıp Farsça ve Türkçe sesler için alfabeye ilave edilen harflerden biridir?",
            "options": [
              "Sin",
              "Cim",
              "Çe (چ)",
              "Fe"
            ],
            "answer": 2,
            "why": "Çe (چ) harfi 28 harfli temel Arap alfabesinde bulunmaz; Farsça ve Türkçe sesleri karşılamak için alfabeye ilave edilmiştir."
          },
          {
            "q": "Harfin üzerine konarak o harfin ünsüz (sakin) okunmasını sağlayan yardımcı işaret aşağıdakilerden hangisidir?",
            "options": [
              "Cezm",
              "Şedde",
              "Esre",
              "Med"
            ],
            "answer": 0,
            "why": "Cezm işareti harfin üstüne konur ve harfi duruk/sakin ünsüz olarak okutur."
          },
          {
            "q": "Aşağıdaki harf gruplarının hangisinde yer alan harflerin tamamı kendisinden sonra gelen harfle bitişmeyen harflerdendir?",
            "options": [
              "be, te, se, cim",
              "fe, kaf, kef, lam",
              "sin, şın, sad, dad",
              "elif, dal, rı, vav"
            ],
            "answer": 3,
            "why": "Elif, dal, zel, rı, ze, je, vav ve sonda ünlü olan he harfleri kendisinden sonraki harfle bitişmeyen harflerdir."
          }
        ],
        "compare": {
          "left": {
            "title": "Bitişen Harfler",
            "points": [
              {
                "k": "Bitişme Yönü",
                "v": "Hem kendinden önceki hem de kendinden sonraki harflerle birleşirler."
              },
              {
                "k": "Şekil Değişimi",
                "v": "Kelime başında ve ortasında değişime uğrar, sonda yalın yazılırlar."
              },
              {
                "k": "Örnek Harfler",
                "v": "be, te, se, cim, çim, ha, hı, sin, şın, sad, dad, tı, zı, ayın, gayın, fe, kaf, kef, lam, mim, nun, ye."
              }
            ]
          },
          "right": {
            "title": "Bitişmeyen Harfler",
            "points": [
              {
                "k": "Bitişme Yönü",
                "v": "Kendinden önceki harflerle birleşir, sonrakilerle asla birleşmezler."
              },
              {
                "k": "Şekil Değişimi",
                "v": "Kelime başında, ortasında ve sonunda temel şekillerini korurlar."
              },
              {
                "k": "Örnek Harfler",
                "v": "elif (ا), dal (د), zel (ذ), rı (ر), ze (ز), je (ژ), vav (و) ve sonda ünlü olan he (ه)."
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "İşaret",
          "hint": "Harfe etkisi ve metindeki işlevi",
          "axes": [
            "Konumu",
            "Okutuluşu veya İşlevi"
          ],
          "rows": [
            {
              "label": "Üstün (Fetha)",
              "cells": [
                "Harfin üstünde",
                "Harfi a veya e sesiyle okutur"
              ]
            },
            {
              "label": "Esre (Kesre)",
              "cells": [
                "Harfin altında",
                "Harfi ı veya i sesiyle okutur"
              ]
            },
            {
              "label": "Ötre (Damme)",
              "cells": [
                "Harfin üstünde",
                "Harfi o, ö, u veya ü sesiyle okutur"
              ]
            },
            {
              "label": "Şedde",
              "cells": [
                "Harfin üstünde",
                "Harfi iki kez okutur"
              ]
            },
            {
              "label": "Cezm (Sükun)",
              "cells": [
                "Harfin üstünde",
                "Harfi ünsüz (sakin) okutur"
              ]
            },
            {
              "label": "Med",
              "cells": [
                "Elif harfinin üstünde",
                "Elif harfini uzun â sesiyle okutur"
              ]
            }
          ]
        }
      },
      "2": {
        "title": "Türkçe Ünlü ve Ünsüzlerin Yazılışı",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Kalın ve İnce Karşılığı Olan Ünsüzler",
          "matrix": "Okutucu Harfler Tablosu"
        },
        "takeaways": [
          {
            "t": "Arapça Kökenli Kalın ve İnce Harfler",
            "d": "Türkçe ünsüzlerde kalınlık incelik ayrımı olmasa da k, t, z, s, ğ seslerinin Arapçada kaf/kef, tı/te, zı/ze, sad/sin ve gayın/gef gibi kalın ve ince çiftleri vardır."
          },
          {
            "t": "Genizsi n (Sağır Kef)",
            "d": "Türkçedeki genizden çıkarılan n sesi Osmanlı Türkçesinde sağır kef (ك) ile gösterilmiştir. Zamanla konuşma dilinde normal diş n sesine dönüşmüştür."
          },
          {
            "t": "Okutucu Harfler ve Türkçe Ünlüler",
            "d": "Türkçedeki 8 ünlü sesi göstermek için elif, he, vav ve ye okutucu harfleri kullanılır. Bu harfler ünlünün kelime başı, ortası veya sonundaki konumuna göre seçilir."
          },
          {
            "t": "Kelime Başı s ve t Ünsüzleri",
            "d": "Kelime başındaki s ve t seslerinden sonra kalın ünlü gelirse sad ve tı harfleri, ince ünlü gelirse sin ve te harfleri tercih edilir."
          }
        ],
        "concepts": [
          {
            "term": "Kalın ve İnce Ünsüz Çiftleri",
            "def": "Arap harfli Osmanlı alfabesinde k, t, z, s ve ğ sesleri için kaf/kef, tı/te, zı/ze, sad/sin, gayın/gef biçiminde ikişer harf bulunmasıdır."
          },
          {
            "term": "Genizsi n (Sağır Kef)",
            "def": "Havanın geniz yolundan salınmasıyla çıkarılan ve Osmanlı alfabesinde kef (ك) harfiyle yazılan Türkçe n sesidir."
          },
          {
            "term": "Okutucu Harfler",
            "def": "Türkçe kelimelerde ünlü sesleri göstermek için kullanılan elif (ا), he (ه), vav (و) ve ye (ى) harfleridir."
          },
          {
            "term": "a Ünlüsünün Yazılışı",
            "def": "Türkçe kelimelerde a sesi kelime başında medli elif (آ), kelime içinde elif (ا), kelime sonunda ise elif veya he (ه) ile gösterilir."
          },
          {
            "term": "e Ünlüsünün Yazılışı",
            "def": "Kelime başında elif (ا), kelime sonunda güzel he (ه) ile yazılan, kelime içinde ise kural olarak harfle gösterilmeyen ünlüdür."
          },
          {
            "term": "ı ve i Ünlülerinin Yazılışı",
            "def": "Kelime başında elif ve ye, kelime içinde ve sonunda ise ye (ى) okutucu harfi ile gösterilen düz ünlü grubudur."
          },
          {
            "term": "o, ö, u, ü Ünlülerinin Yazılışı",
            "def": "Kelime başında elif ve vav, kelime içinde ve sonunda vav (و) okutucu harfi ile ifade edilen yuvarlak ünlülerdir."
          },
          {
            "term": "Kalın ve İnce l Sesi",
            "def": "Türkçede kalmak kelimesindeki çukur l ve dilmek kelimesindeki düz l olmak üzere iki ayrı le sesi bulunmasına rağmen alfabede ikisi için tek lam harfi kullanılır."
          }
        ],
        "quiz": [
          {
            "q": "Türkçe kelimelerde genizden çıkarılan 'n' sesi (sağır kef / kâf-ı nûnî) Osmanlı Türkçesinde hangi harfle gösterilmiştir?",
            "options": [
              "Nun",
              "Gef",
              "Kef (ك)",
              "Mim"
            ],
            "answer": 2,
            "why": "Genizsi n sesi Osmanlı Türkçesi alfabesinde sağır kef veya kâf-ı nûnî olarak anılan kef (ك) harfiyle gösterilmiştir."
          },
          {
            "q": "Türkçe 'e' ünlüsünün kelime içindeki yazılışı ile ilgili aşağıdaki ifadelerden hangisi doğrudur?",
            "options": [
              "Kelime içinde kural olarak yazılmaz.",
              "Kelime içinde daima medli elif ile gösterilir.",
              "Kelime içinde her zaman vav harfiyle yazılır.",
              "Kelime içinde daima çift ye harfiyle ifade edilir."
            ],
            "answer": 0,
            "why": "Türkçe 'e' ünlüsü kelime başında elif ile, kelime sonunda güzel he ile yazılırken kelime içinde kural olarak gösterilmez."
          },
          {
            "q": "Aşağıdaki harflerden hangisinin Osmanlı Türkçesi alfabesinde kalın ve ince hali için ayrı birer harf bulunur?",
            "options": [
              "b ünsüzü",
              "s ünsüzü",
              "m ünsüzü",
              "r ünsüzü"
            ],
            "answer": 1,
            "why": "Osmanlı alfabesinde s ünsüzünün kalını sad (ص), incesi sin (س) harfidir; b, m ve r harflerinin kalın-ince çifti yoktur."
          }
        ],
        "compare": {
          "left": {
            "title": "Kalın Ünsüz Karşılıkları",
            "points": [
              {
                "k": "Harf Çiftleri",
                "v": "kaf (ق), tı (ط), zı (ظ), sad (ص), gayın (غ)"
              },
              {
                "k": "Kullanım Amacı",
                "v": "Hecenin veya kelimenin kalın ünlüsünü belirtmek için tercih edilir."
              },
              {
                "k": "Kelime Başı Örneği",
                "v": "Sat (sat), tat (tat), akça (akça)"
              }
            ]
          },
          "right": {
            "title": "İnce Ünsüz Karşılıkları",
            "points": [
              {
                "k": "Harf Çiftleri",
                "v": "kef (ك), te (ت), ze (ز), sin (س), gef (گ)"
              },
              {
                "k": "Kullanım Amacı",
                "v": "Türkçe kelimelerin temel imlasında öncelikli ve yaygın olarak kullanılır."
              },
              {
                "k": "Kelime Başı Örneği",
                "v": "Ser (ser), ter (ter), ek (ek)"
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Okutucu Harf",
          "hint": "Türkçe ünlülerin kelime içi ve başı gösterimleri",
          "axes": [
            "Gösterdiği Ünlüler",
            "Kelime Başı Yazılışı",
            "Kelime İçinde/Sonda Yazılışı"
          ],
          "rows": [
            {
              "label": "Elif (ا)",
              "cells": [
                "a ünlüsü",
                "Medli elif (آ)",
                "Elif (ا) veya sonda he (ه)"
              ]
            },
            {
              "label": "He (ه)",
              "cells": [
                "e ünlüsü",
                "Elif (ا)",
                "Kelime içinde yazılmaz, sonda güzel he (ه)"
              ]
            },
            {
              "label": "Ye (ى)",
              "cells": [
                "ı ve i ünlüleri",
                "Elif + Ye (ای)",
                "Ye (ى) harfi ile"
              ]
            },
            {
              "label": "Vav (و)",
              "cells": [
                "o, ö, u, ü ünlüleri",
                "Elif + Vav (او)",
                "Vav (و) harfi ile"
              ]
            }
          ]
        }
      },
      "3": {
        "title": "Türkçe Kelimelerin Yapısı, Türkçe Kiplerin ve Edatların Yazılışı",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Kipler ve Yazılış Özellikleri Karşılaştırması",
          "matrix": "Edat Türleri ve Örnekler Tablosu"
        },
        "takeaways": [
          {
            "t": "Türkçe Kelime ve Hecelerin Yapısı",
            "d": "Türkçe kelimeler bir kök ile yapım ve çekim eklerinden oluşur. Heceler açık ve kapalı hece olarak ayrılır; Türkçe kelimeler çift ünsüzle başlamaz ve sonda tonlu ünsüzler bulunmaz."
          },
          {
            "t": "Fiil Kiplerinin İmlası",
            "d": "Dilek şart kipi -sa/-se tek şekilli olarak 'se' (سه) biçiminde yazılır. Gereklilik kipi -malı/-meli ise 'mali' (ملى) şeklinde yazılır ve olumsuzu fiil kökü ile ek arasına ma/me getirilerek yapılır."
          },
          {
            "t": "Şimdiki Zaman -makta/-mekte Eki",
            "d": "Türkçede şimdiki zaman eki olarak kullanılan -makta/-mekte ekleri 'makda/mekde' (مقده / مكده) şeklinde fiil tabanına ilave edilerek yazılır."
          },
          {
            "t": "Edat, Bağlaç ve Ünlemler",
            "d": "Osmanlı Türkçesinde Türkçe edatların yanı sıra Farsça ez, ba, be, ber, der, beray-ı gibi ön edatlar ve ey, ya, zihi gibi ünlemler sıkça kullanılır."
          }
        ],
        "concepts": [
          {
            "term": "Büyük Ünlü Uyumu",
            "def": "Türkçe kelime kök ve eklerinde kalın ünlülerin kalın ünlülerle, ince ünlülerin ince ünlülerle takip etmesi kuralıdır."
          },
          {
            "term": "Dilek ve Şart Kipi (-sa/-se)",
            "def": "Osmanlı Türkçesinde tek şekilli olarak 'se' (سه) biçiminde yazılan ve ses uyumlarına göre okunan fiil kipidir."
          },
          {
            "term": "İstek ve Emir Kipi",
            "def": "Tarihi süreç içinde ekleri birleşerek günümüzde tek şekil haline gelmiş kip yapısıdır. Hangi kip olduğu cümledeki anlam ve şartlara göre belirlenir."
          },
          {
            "term": "Gereklilik Kipi (-malı/-meli)",
            "def": "Fiil tabanına birleşik olarak 'mali' (ملى) şeklinde yazılan ve şahıs ekleriyle (3. çoğul hariç) birleşmeyen kiptir."
          },
          {
            "term": "Şimdiki Zaman Eki (-makta/-mekte)",
            "def": "Fiil tabanına ilave edilerek 'makda/mekde' (مقده / مكده) şeklinde yazılan ve şimdiki zaman işlevi gören ektir."
          },
          {
            "term": "Ön Edatlar",
            "def": "Arapça harf-i cerler ile Farsça ez (از), ba (با), be (ب/به), ber (بر), der (در) ve beray-ı (براى) gibi kelime başına getirilen edatlardır."
          },
          {
            "term": "Tekrarlı Bağlaçlar",
            "def": "Cümle içinde iki defa tekrar edilerek kullanılan hem...hem (هم...هم), ne...ne (نه...نه), gerek...gerekse (كرك...كركسه) gibi bağlaçlardır."
          },
          {
            "term": "Ünlemler",
            "def": "Duygu, seslenme ve çağırma bildiren ey (ای), ya (يا), zihi (زهى), ah (آه) ve eyvah (ايواه) gibi kelimelerdir."
          }
        ],
        "quiz": [
          {
            "q": "Osmanlı Türkçesinde dilek-şart kipi eki (-sa/-se) Arap harfleriyle nasıl yazılır?",
            "options": [
              "'se' (سه) şeklinde tek şekilli yazılır.",
              "'mali' (ملى) şeklinde yazılır.",
              "'makda' (مقده) şeklinde yazılır.",
              "'di' (دی) şeklinde yazılır."
            ],
            "answer": 0,
            "why": "Dilek-şart kipi eki -sa/-se Osmanlı Türkçesinde tek şekilli olarak 'se' (سه) biçiminde yazılır ve ses uyumuna göre okunur."
          },
          {
            "q": "Türkçe gereklilik kipi (-malı/-meli) ekinin yazılışı ve şahıs ekleriyle birleşmesi ile ilgili aşağıdakilerden hangisi doğrudur?",
            "options": [
              "Kendisinden sonra gelen bütün şahıs ekleriyle daima birleşir.",
              "Fiil tabanına birleşir ancak üçüncü çoğul şahıs hariç kendisinden sonraki eklere birleşmez.",
              "Hiçbir zaman fiil tabanına birleşmez.",
              "Yalnızca harekelerle gösterilir, harfle yazılmaz."
            ],
            "answer": 1,
            "why": "Gereklilik kipi eki 'mali' (ملى) fiil tabanına birleşir; ancak kendisinden sonra gelen şahıs eklerine birleşmez, bu durum sadece üçüncü çoğul şahısta (örneğin bitirmeliler) istisna oluşturur."
          },
          {
            "q": "Aşağıdaki edat ve anlam eşleştirmelerinden hangisi doğrudur?",
            "options": [
              "der-akab (در عقب): ne yazık ki",
              "ez-can u dil (از جان و دل): candan ve gönülden",
              "fe'emma (فاما): hemen o anda",
              "vaktaki (وقتاكى): kucaklama"
            ],
            "answer": 1,
            "why": "Farsça 'ez' ön edatıyla kurulan 'ez-can u dil' ifadesi 'candan ve gönülden' anlamına gelir; der-akab 'gecikmeksizin', fe'emma 'fakat/lakin', vaktaki ise 'ne vakit ki' demektir."
          }
        ],
        "compare": {
          "left": {
            "title": "Dilek-Şart Kipi (-sa/-se)",
            "points": [
              {
                "k": "Ek İmlası",
                "v": "Tek şekilli olarak 'se' (سه) biçiminde yazılır."
              },
              {
                "k": "Ek Birleşmesi",
                "v": "Şahıs ekleriyle birleşerek yazılır (ör. anlasam - اكالسه م)."
              },
              {
                "k": "Olumsuz Biçimi",
                "v": "Fiil köküne ma/me getirilerek yapılır (ör. donmasa - دومناسه)."
              }
            ]
          },
          "right": {
            "title": "Gereklilik Kipi (-malı/-meli)",
            "points": [
              {
                "k": "Ek İmlası",
                "v": "Temel olarak 'mali' (ملى) biçiminde yazılır."
              },
              {
                "k": "Ek Birleşmesi",
                "v": "Fiil tabanına birleşir ancak kendisinden sonraki şahıs eklerine (3. çoğul hariç) birleşmez."
              },
              {
                "k": "Olumsuz Biçimi",
                "v": "Fiil tabanı ile gereklilik eki arasına ma/me getirilir (ör. bakmamalısın - باقماماىل سك)."
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Edat Grubu",
          "hint": "Osmanlı Türkçesindeki edat çeşitleri ve örnek imlaları",
          "axes": [
            "İmla Şekli ve Yapısı",
            "Örnek Kullanım ve Anlamı"
          ],
          "rows": [
            {
              "label": "Farsça Ön Edatlar",
              "cells": [
                "Kelime başına eklenir; ez (از), ba (با), ber (بر), der (در)",
                "der-hal (در حال - hemen), ez-can u dil (از جان و دل - candan ve gönülden)"
              ]
            },
            {
              "label": "Bağlama Edatları",
              "cells": [
                "Tek kelime veya kalıplaşmış ifade; ancak (اجنق), çun (چون), ile (ايله)",
                "vaktaki (وقتاكى - ne vakit ki), fe'emma (فاما - amma, lakin)"
              ]
            },
            {
              "label": "Tekrarlı Bağlaçlar",
              "cells": [
                "İki unsur arasında tekrarlanarak yazılır",
                "hem...hem (هم...هم), gerek...gerekse (كرك...كركسه)"
              ]
            },
            {
              "label": "Ünlemler",
              "cells": [
                "Seslenme ve duygu belirten kelimeler; ey (ای), ya (يا)",
                "efsus (افسوس - ne yazık, eyvah), zihi (زهى - ne güzel)"
              ]
            }
          ]
        }
      },
      "4": {
        "title": "Türkçe Ek, Zamir, Zarf ve Sayıların Yazılışı",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Şahıs ve İşaret Zamirlerinin Çekimi",
          "matrix": "Ekler ve İmla Kuralları Tablosu"
        },
        "takeaways": [
          {
            "t": "Eklerin İmla Yapısı",
            "d": "Türkçe eklerin yazılışında kalıplaşmış imlalar esas alınır. Eklerdeki yardımcı ünlüler genellikle yazılmayarak seri yazım sağlanır."
          },
          {
            "t": "Sağır Kef Kullanımı",
            "d": "İkinci şahıs iyelik eklerinde, ilgi halinde ve zamir yönelme çekimlerinde damaksı n (sağır kef) kullanılır. Bana, sana, onun gibi sözcükler bu kurala örnektir."
          },
          {
            "t": "Zamir ve Zarfların Yazılışı",
            "d": "Şahıs ve işaret zamirleri kalıplaşmış biçimleriyle yazılır. Zarflar ise eylemleri ve sıfatları niteleyen zaman, yer ve miktar kelimelerinden oluşur."
          },
          {
            "t": "Rakamlar ve Sayı İsimleri",
            "d": "Sayı isimleri Türkçe sözcüklerle yazılırken rakamlar Arap alfabesindeki simgelerle soldan sağa doğru yazılır. 2 sağa, 6 sola bakarken 7 yukarı bakan v şeklindedir."
          }
        ],
        "concepts": [
          {
            "term": "Eklerde Yardımcı Ünlüler",
            "def": "Pratik yazımı sağlamak amacıyla eklerdeki yardımcı ünlülerin genel olarak yazılmaması kuralıdır."
          },
          {
            "term": "İyelik Eklerinde Sağır Kef",
            "def": "İkinci şahıs iyelik ve şahıs eklerinde damaksı n (sağır kef) harfinin kullanılmasıdır."
          },
          {
            "term": "İlgi Hali Eki (-ın/-in)",
            "def": "Ünlüyle biten kelimelerden sonra 'yin' (ين), ünsüzle bitenlerden sonra 'nin' (ن) şeklinde sağır kef ile yazılan ektir."
          },
          {
            "term": "Şahıs Zamirleri",
            "def": "Ben, sen, o, biz, siz, onlar kelimelerinin kalıplaşmış Arap harfli yazılışlarıdır."
          },
          {
            "term": "Zamirlerde Yönelme Çekimi",
            "def": "Bana (بكا), sana (سكا) ve ona (اوكا) örneklerinde olduğu gibi yönelme halinde sağır kef kullanılmasıdır."
          },
          {
            "term": "Zarflar",
            "def": "Fiil ve sıfatları nitelik, zaman, miktar ve yer yön bakımından tamamlayan kelimelerdir."
          },
          {
            "term": "Rakam Yönü",
            "def": "Osmanlı Türkçesi metinlerinin aksine rakam simgelerinin soldan sağa doğru yazılması kuralıdır."
          },
          {
            "term": "Sayı İsimleri İmlası",
            "def": "Bir, iki, üç, on, yirmi (يكرمی) gibi Türkçe sayıların kalıplaşmış harflerle yazılmasıdır."
          }
        ],
        "quiz": [
          {
            "q": "Osmanlı Türkçesinde iyelik eklerinde ikinci şahıs eklerini göstermek için hangi harf kullanılır?",
            "options": [
              "Nun (ن)",
              "Damaksı n / Sağır kef (ك)",
              "Mim (م)",
              "Ye (ى)"
            ],
            "answer": 1,
            "why": "İkinci şahıs iyelik ve aitlik eklerinde damaksı n veya sağır kef (ك / ڭ) harfi kullanılır."
          },
          {
            "q": "Aşağıdaki rakam simgelerinden hangisinin yönü veya biçimi ile ilgili bilgi doğrudur?",
            "options": [
              "Rakamlar metin gibi sağdan sola yazılır.",
              "7 rakamı aşağı bakan v şeklindedir.",
              "2 rakamı sağa, 6 rakamı sola bakar.",
              "8 rakamı yukarı bakan v şeklindedir."
            ],
            "answer": 2,
            "why": "Osmanlı Türkçesinde 2 rakamı sağa, 6 rakamı sola bakar; 7 yukarı bakan v, 8 ise aşağı bakan v şeklindedir ve rakamlar soldan sağa yazılır."
          },
          {
            "q": "Şahıs ve işaret zamirlerinin yönelme halinde (bana, sana, buna, şuna) görülen ortak imla özelliği aşağıdakilerden hangisidir?",
            "options": [
              "Yönelme ekinde sağır kef (ك) harfinin kullanılması",
              "Sadece elif okutucusu ile yazılmaları",
              "Çekim sırasında kelime kökünün tamamen değişmesi",
              "Eklerin kelimeden ayrı yazılması"
            ],
            "answer": 0,
            "why": "Bana (بكا), sana (سكا), buna (بوكا) ve şuna (شوكا) örneklerinde görüldüğü gibi yönelme çekiminde sağır kef harfi kullanılır."
          }
        ],
        "compare": {
          "left": {
            "title": "Şahıs Zamirleri",
            "points": [
              {
                "k": "Yalın Hal İmlası",
                "v": "ben (بن), sen (سن), o (او), biz (بز), siz (سز)"
              },
              {
                "k": "Yönelme Hali",
                "v": "bana (بكا), sana (سكا), ona (اوكا) sağır kef ile yazılır."
              },
              {
                "k": "İlgi Hali",
                "v": "benim (بنم), senin (سنك), onun (اونك) şeklinde çekimlenir."
              }
            ]
          },
          "right": {
            "title": "İşaret Zamirleri",
            "points": [
              {
                "k": "Yalın Hal İmlası",
                "v": "bu (بو), şu (شو) kelimeleri kalıplaşmış yazılışa sahiptir."
              },
              {
                "k": "Yönelme Hali",
                "v": "buna (بوكا), şuna (شوكا) örneklerinde sağır kef yer alır."
              },
              {
                "k": "İlgi Hali",
                "v": "bunun (بونك), şunun (شونک) şeklinde çekimlenir."
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Ek Türü",
          "hint": "Türkçe eklerin Osmanlıca imla özellikleri",
          "axes": [
            "İmla Şekli",
            "Örnek Kullanım"
          ],
          "rows": [
            {
              "label": "Çoğul Eki (-lar/-ler)",
              "cells": [
                "'lar/ler' (لر) şeklinde yazılır",
                "kitaplar (کتابلر)"
              ]
            },
            {
              "label": "Ayrılma Hali (-dan/-den)",
              "cells": [
                "'dan/den' (دن) şeklinde yazılır",
                "evden (اودن)"
              ]
            },
            {
              "label": "Bulunma Hali (-da/-de)",
              "cells": [
                "'da/de' (ده) şeklinde yazılır",
                "şehirde (شهرده)"
              ]
            },
            {
              "label": "Gelecek Zaman (-acak/-ecek)",
              "cells": [
                "'acak' (اجق) veya 'ecek' (ه جك) şeklinde yazılır",
                "gelecek (کله جک)"
              ]
            }
          ]
        }
      },
      "5": {
        "title": "Arapça ve Farsça Kelimelerde Ünlüler ve Yazılışları",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Ünlü Yapıları Karşılaştırması",
          "matrix": "Hicri Aylar ve Kısaltmalar Tablosu"
        },
        "takeaways": [
          {
            "t": "Kısa ve Uzun Ünlüler",
            "d": "Arapça ve Farsça kelimelerde kısa ünlüler harfle gösterilmeyip gerekirse harekelerle belirtilir. Uzun ünlüler ise elif, vav ve ye harfleriyle yazılır."
          },
          {
            "t": "Ayın ve Hemze Harfleri",
            "d": "Türkçede özgün ses karşılığı olmayan ayın ve hemze harfleri Arapça kökenli kelimelere özgüdür. Ayın boğaz ünsüzüyken hemze durağı ve kesmeyi temsil eder."
          },
          {
            "t": "Ünsüzlerin Kalınlık ve İnceliği",
            "d": "Kelimenin okunuşundaki ünlü niteliğini Arapça ve Farsça kelimelerdeki kalın ve ince ünsüzler belirler. Kalın ünsüzler ünlüyü kalın, ince ünsüzler ise ince okutur."
          },
          {
            "t": "Takvim ve Zaman İfadeleri",
            "d": "Osmanlı Devleti'nde kullanılan Hicri ay adları, Farsça gün isimleri ve bunlara ait resmi yazışma kısaltmaları kalıplaşmış imlalara sahiptir."
          }
        ],
        "concepts": [
          {
            "term": "Kısa Ünlüler",
            "def": "Arapça ve Farsça kelimelerde harfle yazılmayan, sadece ihtiyaç duyulduğunda üstün, esre ve ötre harekeleriyle gösterilen seslerdir."
          },
          {
            "term": "Uzun Ünlüler (Hurûf-ı Med)",
            "def": "Arapça ve Farsça kelimelerde â, û ve î seslerini uzatarak okutan elif (ا), vav (و) ve ye (ى) harfleridir."
          },
          {
            "term": "Ayın (ع) Harfi",
            "def": "Arapçaya özgü bir boğaz ünsüzü olup kelime başında ünlüyle okutulan, hece sonunda ise kendinden önceki ünlüyü uzatan harftir."
          },
          {
            "term": "Hemze (ء) Harfi",
            "def": "Kelime başında elif üzerinde, kelime içinde bir diş üzerinde veya hece sonunda tek başına yazılan ses kesme ve durak harfidir."
          },
          {
            "term": "Kalın Ünsüzler",
            "def": "Ha, hı, sad, dad, tı, zı, ayın, gayın ve kaf harflerinden oluşan, bulundukları kelimedeki ünlüleri kalın okutan ünsüz grubudur."
          },
          {
            "term": "Gurre ve Selh",
            "def": "Hicri ayların ilk gününü ifade etmek için gurre, son gününü ifade etmek için kullanılan selh terimleridir."
          },
          {
            "term": "Evâ'il, Evâsıt, Evâhir",
            "def": "Hicri ayların sırasıyla ilk ten (1-10), ikinci ten (11-20) ve son ten (21-30) günlerini belirten resmi tarih terimleridir."
          },
          {
            "term": "Farsça Gün İsimleri",
            "def": "Haftanın günlerini ifade eden Yekşenbe, Düşenbe, Seşenbe, Çehârşenbe, Pençşenbe, Cum'a ve Şenbe kelimeleridir."
          }
        ],
        "quiz": [
          {
            "q": "Arapça ve Farsça kelimelerdeki uzun ünlüler (â, û, î) Osmanlı alfabesinde hangi harflerle gösterilir?",
            "options": [
              "fetha, kesre ve damme harekeleriyle",
              "elif (ا), vav (و) ve ye (ى) harfleriyle",
              "sadece medli elif ve güzel he ile",
              "aynı cins ünsüzlerin ikizleştirilmesiyle"
            ],
            "answer": 1,
            "why": "Arapça ve Farsça kelimelerdeki uzun ünlüler hurûf-ı med denilen elif (ا), vav (و) ve ye (ى) harfleriyle gösterilir."
          },
          {
            "q": "Arapça kelimelere özgü olan, kelime başında ünlüyle okunan ve hece sonunda kendinden önceki ünlüyü uzatan harf aşağıdakilerden hangisidir?",
            "options": [
              "Kef",
              "Gef",
              "Lam",
              "Ayın (ع)"
            ],
            "answer": 3,
            "why": "Ayın (ع) harfi Arapçaya özgü bir boğaz ünsüzüdür; kelime başında ünlü sesiyle okunurken hece sonunda kendinden önceki ünlüyü uzatır."
          },
          {
            "q": "Hicri ayların ilk gününü ifade etmek için Osmanlı resmi belgelerinde ve tarihlerinde kullanılan terim aşağıdakilerden hangisidir?",
            "options": [
              "Gurre",
              "Selh",
              "Evâhir",
              "Evâsıt"
            ],
            "answer": 0,
            "why": "Hicri ayların ilk gününü belirtmek için gurre, son gününü belirtmek için selh terimi kullanılır."
          }
        ],
        "compare": {
          "left": {
            "title": "Kısa Ünlüler",
            "points": [
              {
                "k": "Harfle Gösterim",
                "v": "Metinlerde harfle yazılmazlar."
              },
              {
                "k": "İşaretler",
                "v": "Gerekli durumlarda harekelerle (üstün, esre, ötre) gösterilir."
              },
              {
                "k": "Örnek",
                "v": "ilm (علم), fikr (فكر), hükm (حكم)"
              }
            ]
          },
          "right": {
            "title": "Uzun Ünlüler (Hurûf-ı Med)",
            "points": [
              {
                "k": "Harfle Gösterim",
                "v": "Elif (ا), vav (و) ve ye (ى) harfleriyle yazılırlar."
              },
              {
                "k": "Ses Değeri",
                "v": "Sesi uzatarak â, û, î şeklinde okuturlar."
              },
              {
                "k": "Örnek",
                "v": "kitâb (كتاب), maktûb (مكتوب), mecîd (مجيد)"
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Ay ve Dönem İfadesi",
          "hint": "Hicri aylar ve resmi yazışma terimleri",
          "axes": [
            "İmla/Kısaltma Şekli",
            "Anlamı veya Kullanım Alanı"
          ],
          "rows": [
            {
              "label": "Muharrem",
              "cells": [
                "'m' (م) kısaltması",
                "Hicri senenin 1. ayı"
              ]
            },
            {
              "label": "Safer",
              "cells": [
                "'s' (ص) kısaltması",
                "Hicri senenin 2. ayı"
              ]
            },
            {
              "label": "Receb",
              "cells": [
                "'re' (ر) kısaltması",
                "Üç ayların ilki, 7. ay"
              ]
            },
            {
              "label": "Ramazân",
              "cells": [
                "'n' (ن) kısaltması",
                "Oruç ayı, 9. ay"
              ]
            },
            {
              "label": "Gurre",
              "cells": [
                "Kelime imlası gurre",
                "Ayın ilk günü"
              ]
            },
            {
              "label": "Selh",
              "cells": [
                "Kelime imlası selh",
                "Ayın son günü"
              ]
            }
          ]
        }
      },
      "6": {
        "title": "Arapça Kelimelerin Yapısı",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "Sâlim ve Mükesser Çoğul Karşılaştırması",
          "matrix": "Müenneslik Türleri Tablosu"
        },
        "takeaways": [
          {
            "t": "Tasrifli Diller Yapısı ve Kök Harfler",
            "d": "Arapça bükünlü bir dildir ve yeni kelimeler kökün başına, ortasına veya sonuna sesler eklenerek türetilir. Kelimeler en az üç aslî harften oluşur ve eklenen zâid harflerle yeni anlamlar kazanır."
          },
          {
            "t": "Vezin ve Kalıp Sistemi",
            "d": "Kelimenin aslî harfleri sırasıyla fe, ayn ve lam simgeleriyle gösterilir. İlave edilen zâid harfler ve harekeler kalıba aktarılarak kelimenin vezni çıkarılır."
          },
          {
            "t": "Müzekkerlik ve Müenneslik",
            "d": "Arapça isimler dişil (müennes) ve eril (müzekker) olarak ayrılır. Müenneslik kapalı te, kısa elif veya uzun elif gibi alâmetlerle ya da manevî ve semâî özelliklerle belirlenir."
          },
          {
            "t": "Sayı Kategorileri ve Çokluk Türleri",
            "d": "Arapçada tekil (müfred), ikilik (tesniye) ve çoğul (cem') kategorileri vardır. Çoğullar eklerle yapılan cem'-i sâlim ve kalıplarla yapılan cem'-i mükesser olarak ikiye ayrılır."
          }
        ],
        "concepts": [
          {
            "term": "Aslî Harfler",
            "def": "Kelimede anlamın temelini oluşturan ve en az üç harften meydana gelen kök harflerdir."
          },
          {
            "term": "Zâid Harfler",
            "def": "Yeni kelimeler ve anlamlar türetmek amacıyla üç aslî kök harfine ilave edilen elif, te, sin, mim, nun, he, vav, ye harfleridir."
          },
          {
            "term": "Vezin Çıkarma",
            "def": "Kelimenin ilk aslî harfi yerine fe, ikincisine ayn, üçüncüsüne lam yazılıp zâid harf ve harekelerin kalıba taşınması işlemidir."
          },
          {
            "term": "Tâ-i Merbûte (Kapalı Te)",
            "def": "Müennes kelimelerin sonunda yer alan ve Osmanlı Türkçesinde açık te veya he ile yazılan temel dişilik alâmetidir."
          },
          {
            "term": "Manevî ve Semâî Müennes",
            "def": "Şekilsel dişilik alâmeti taşımadığı halde kadın isimleri veya çift organlar gibi nedenlerle yahut doğrudan sözlükten öğrenilerek dişil kabul edilen isimlerdir."
          },
          {
            "term": "Tesniye (-eyn / -ân)",
            "def": "Arapçaya özgü ikili çokluk yapısı olup kelime sonuna -eyn veya -ân eki getirilerek oluşturulur."
          },
          {
            "term": "Cem'-i Sâlim",
            "def": "Tekil kelimenin kök yapısı bozulmadan sonuna müzekkerlerde -în veya -ûn, müenneslerde -ât eki getirilerek yapılan kurallı çoğuldur."
          },
          {
            "term": "Cem'-i Mükesser (Kırık Çoğul)",
            "def": "Tekil kelimenin vezni ve kök dizilimi değiştirilerek ef'âl, fu'ûl, mefâ'il gibi çeşitli kalıplarla yapılan semâî çoğuldur."
          }
        ],
        "quiz": [
          {
            "q": "Arapça kelimelerin veznini çıkarırken ilk aslî harf, ikinci aslî harf ve üçüncü aslî harf sırasıyla hangi simgelerle gösterilir?",
            "options": [
              "fe, ayn, lam (ف, ع, ل)",
              "elif, vav, ye (ا, و, ى)",
              "mim, nun, te (م, ن, ت)",
              "sin, fe, lam (س, ف, ل)"
            ],
            "answer": 0,
            "why": "Arapça kelimelerde vezin çıkarılırken ilk aslî harf fe (ف), ikinci aslî harf ayn (ع) ve üçüncü aslî harf lam (ل) simgesiyle temsil edilir."
          },
          {
            "q": "Osmanlı Türkçesinde ikili çokluk yapmak için kullanılan tesniye eki aşağıdakilerden hangisidir?",
            "options": [
              "-ât (ات)",
              "-în (ين)",
              "-eyn (ين)",
              "-ûn (ون)"
            ],
            "answer": 2,
            "why": "Arapçada tesniye (ikilik) eki -eyn (ين) veya -ân (ان) şeklindedir; Osmanlı Türkçesinde metinlerde en yaygın kullanılan biçim -eyn ekidir."
          },
          {
            "q": "Aşağıdaki kelimelerden hangisi cem'-i mükesser (kırık çoğul) yapısındadır?",
            "options": [
              "müminîn (مؤمنين)",
              "teşkîlât (تشكيلات)",
              "devleteyn (دولتين)",
              "mecâlis (مجالس)"
            ],
            "answer": 3,
            "why": "Mecâlis kelimesi meclis kelimesinin mefâ'il vezninde kırılmış (cem'-i mükesser) çoğuludur; müminîn cem'-i müzekker-i sâlim, teşkîlât cem'-i müennes-i sâlim, devleteyn ise tesniyedir."
          }
        ],
        "compare": {
          "left": {
            "title": "Cem'-i Sâlim (Kurallı Çoğul)",
            "points": [
              {
                "k": "Türetilme Biçimi",
                "v": "Tekil kelimenin yapısı korunarak sonuna çoğul eki eklenir."
              },
              {
                "k": "Müzekker Eki",
                "v": "Kelime sonuna -în veya -ûn eklenir (ör. memûrîn)."
              },
              {
                "k": "Müennes Eki",
                "v": "Dişilik alâmeti kaldırılıp sonuna -ât eklenir (ör. kelimât)."
              }
            ]
          },
          "right": {
            "title": "Cem'-i Mükesser (Kırık Çoğul)",
            "points": [
              {
                "k": "Türetilme Biçimi",
                "v": "Tekil kelimenin kök yapısı ve vezni değiştirilerek oluşturulur."
              },
              {
                "k": "Kural Durumu",
                "v": "Semâîdir; hangi kelimenin hangi kalıba gireceği sözlükten öğrenilir."
              },
              {
                "k": "Örnek Vezinler",
                "v": "ef'âl (akvâl), fu'ûl (ulûm), mefâ'il (mecâlis) kalıplarıdır."
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Müenneslik Türü",
          "hint": "Arapça isimlerde dişilik kategorileri ve belirleyici nitelikleri",
          "axes": [
            "Belirleyici Özellik veya Alâmet",
            "Örnek Kelimeler"
          ],
          "rows": [
            {
              "label": "Kapalı Te (ة) İle Müennes",
              "cells": [
                "Kelime sonunda kapalı te (açık te veya he) bulunmasıdır",
                "muallime (معلمه), katibe (كاتبه)"
              ]
            },
            {
              "label": "Elif-i Maksûre (ى) İle Müennes",
              "cells": [
                "Kelime sonunda zâid ve a sesi veren ye harfi bulunmasıdır",
                "dava (دعوى), kübra (كبرى)"
              ]
            },
            {
              "label": "Elif-i Memdûde (اء) İle Müennes",
              "cells": [
                "Kelime sonunda uzun elif ve hemze grubunun yer almasıdır",
                "sahra (صحراء), hamra (حمراء)"
              ]
            },
            {
              "label": "Manevî (İtibarî) Müennes",
              "cells": [
                "Kadın isimleri, ülke adları ve çift organ adlarıdır",
                "Meryem (مريم), Mısır (مصر), ayn (عين)"
              ]
            },
            {
              "label": "Semâî Müennes",
              "cells": [
                "Biçimsel veya manevi kuralı olmayıp sözlükten öğrenilenlerdir",
                "şems (شمس), arz (ارض), nar (نار)"
              ]
            }
          ]
        }
      },
      "7": {
        "title": "Aksâm-ı Seb'a, Mücerred Masdarlar, İsm-i Fâil ve İsm-i Mef'ûl",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "İsm-i Fâil ve İsm-i Mef'ûl Karşılaştırması",
          "matrix": "Aksâm-ı Seb'a Sınıflandırması"
        },
        "takeaways": [
          {
            "t": "Aksâm-ı Seb'a Yedi Kısım",
            "d": "Arapça kelimeler kök harflerinin sahih veya illetli oluşuna göre sâlim, mehmûz, muzâaf, misâl, ecvef, nâkıs ve lefîf olmak üzere yedi gruba ayrılır."
          },
          {
            "t": "Masdar Çeşitleri",
            "d": "Sülâsî mücerred masdarlar kırka yakın kalıpta semâî olarak gelir. Başına mim getirilenler mimli masdar, sonuna -iyyet eki getirilenler ise mec'ûl masdardır."
          },
          {
            "t": "İsm-i Fâil Kalıbı",
            "d": "Sülâsî mücerred masdarlardan işi yapanı gösteren etken yapıdaki ism-i fâil, fâil vezninde türetilir."
          },
          {
            "t": "İsm-i Mef'ûl Kalıbı",
            "d": "Yapılan işten etkileneni gösteren edilgen yapıdaki ism-i mef'ûl ise mef'ûl vezninde türetilir."
          }
        ],
        "concepts": [
          {
            "term": "Aksâm-ı Seb'a",
            "def": "Arapça isim ve fiillerin kök harflerinin niteliğine göre ayrıldığı yedi farklı kelime grubudur."
          },
          {
            "term": "Sahih Kelimeler",
            "def": "Kök harflerinde elif, vav veya ye illet harfleri bulunmayan sâlim, mehmûz ve muzâaf kelimelerdir."
          },
          {
            "term": "İlletli (Mu'tell) Kelimeler",
            "def": "Kök harflerinden en az biri elif, vav veya ye olan misâl, ecvef, nâkıs ve lefîf türü kelimelerdir."
          },
          {
            "term": "Sülâsî Mücerred Masdar",
            "def": "Üç aslî harften oluşan ve yapısına zâid harf katılmayan semâî karakterli masdarlardır."
          },
          {
            "term": "Mimli Masdar",
            "def": "Kök harflerinin başına zâid bir mim harfi getirilerek mef'al veya mef'il vezninde türetilen masdarlardır."
          },
          {
            "term": "Mec'ûl Masdar",
            "def": "Kelime sonuna -iyyet eki getirilerek yapılan ve Türkçedeki -lık/-lik ekine karşılık gelen yapma masdarlardır."
          },
          {
            "term": "İsm-i Fâil",
            "def": "Eylemi gerçekleştiren özneyi gösteren, sülâsî mücerredlerde fâil vezninde yapılan etken sıfat formudur."
          },
          {
            "term": "İsm-i Mef'ûl",
            "def": "Eylemden etkilenen nesneyi gösteren, sülâsî mücerredlerde mef'ûl vezninde yapılan edilgen sıfat formudur."
          }
        ],
        "quiz": [
          {
            "q": "Kök harflerinde elif, vav veya ye illet harflerinden biri bulunmayan, hemze ve şedde de içermeyen kelime türü Aksâm-ı Seb'a sınıflamasında aşağıdakilerden hangisidir?",
            "options": [
              "Ecvef",
              "Sâlim",
              "Misâl",
              "Nâkıs"
            ],
            "answer": 1,
            "why": "Sâlim kelimeler kök harflerinde illet harfi, hemze ve aynı harfin tekrarı (şedde) bulunmayan sahih kelimelerdir."
          },
          {
            "q": "Sülâsî mücerred masdarlardan türetilen 'kātil', 'âlim' ve 'âmil' kelimeleri hangi vezinde ve gramer kategorisindedir?",
            "options": [
              "fâil vezninde ism-i fâil",
              "mef'ûl vezninde ism-i mef'ûl",
              "mef'al vezninde mimli masdar",
              "fa'lele vezninde rubâî masdar"
            ],
            "answer": 0,
            "why": "Kātil, âlim ve âmil kelimeleri fâil vezninde olup eylemi gerçekleştireni gösteren ism-i fâil formundadır."
          },
          {
            "q": "Sülâsî mücerred bir masdarın edilgen sıfatı olan ism-i mef'ûl formu aşağıdaki vezinlerden hangisiyle türetilir?",
            "options": [
              "fâil",
              "mef'al",
              "mef'ûl",
              "fu'ûl"
            ],
            "answer": 2,
            "why": "Sülâsî mücerred masdarların ism-i mef'ûlü mef'ûl vezninde yapılır; örneğin mahfûz, mektûb, meşrûb."
          }
        ],
        "compare": {
          "left": {
            "title": "İsm-i Fâil (Etken Sıfat)",
            "points": [
              {
                "k": "Anlam İşlevi",
                "v": "Masdarın belirttiği eylemi yapanı veya durumu taşıyanı ifade eder."
              },
              {
                "k": "Sülâsî Vezni",
                "v": "Sülâsî mücerredlerde fâil vezninde türetilir."
              },
              {
                "k": "Örnekler",
                "v": "katl → kātil, amel → âmil, ilm → âlim"
              }
            ]
          },
          "right": {
            "title": "İsm-i Mef'ûl (Edilgen Sıfat)",
            "points": [
              {
                "k": "Anlam İşlevi",
                "v": "Masdarın belirttiği eyleme maruz kalanı veya etkileneni ifade eder."
              },
              {
                "k": "Sülâsî Vezni",
                "v": "Sülâsî mücerredlerde mef'ûl vezninde türetilir."
              },
              {
                "k": "Örnekler",
                "v": "şürb → meşrûb, hıfz → mahfûz, katl → maktûl"
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Aksâm-ı Seb'a Türü",
          "hint": "Kök harflerinin özellikleri ve örnek kelimeler",
          "axes": [
            "Kök Harf Özelliği",
            "Örnek Kelimeler"
          ],
          "rows": [
            {
              "label": "Sâlim",
              "cells": [
                "İllet harfi, hemze ve şedde içermeyen sahih kökler",
                "ilm, fikr, adl"
              ]
            },
            {
              "label": "Mehmûz",
              "cells": [
                "Aslî harflerinden biri hemze olan kökler",
                "emr, edeb, izn"
              ]
            },
            {
              "label": "Muzâaf",
              "cells": [
                "İkinci ve üçüncü kök harfi aynı olan şeddeli kelimeler",
                "redd, fenn, hakk"
              ]
            },
            {
              "label": "Misâl",
              "cells": [
                "İlk kök harfi vav veya ye olan illetli kelimeler",
                "vakt, vehm, yusr"
              ]
            },
            {
              "label": "Ecvef",
              "cells": [
                "Orta kök harfi illetli olan kelimeler",
                "savm, kavm, leyl"
              ]
            },
            {
              "label": "Nâkıs",
              "cells": [
                "Son kök harfi illetli olan kelimeler",
                "lağv, remy, meşy"
              ]
            },
            {
              "label": "Lefîf",
              "cells": [
                "Kök harflerinden ikisi illetli olan kelimeler",
                "vefâ, hayy, velî"
              ]
            }
          ]
        }
      },
      "8": {
        "title": "Mezîdünfih Masdarlar (I)",
        "labels": {
          "concepts": "Kavramlar",
          "quiz": "Pekiştirme testi",
          "compare": "İf'âl ve Tef'îl Babları Karşılaştırması",
          "matrix": "Beş Mezîdünfih Bab Kalıpları Tablosu"
        },
        "takeaways": [
          {
            "t": "Mezîdünfih Masdar Kavramı",
            "d": "Sülâsî mücerred masdarlara belirli zâid harfler eklenerek türetilen kıyasî masdar yapılarıdır. Kök kelimenin anlamını koruyarak yeni çatı ve anlamlar kazandırırlar."
          },
          {
            "t": "İlk Beş Bâbın Yapısı",
            "d": "Mezîdünfih masdarların ilk beşini İf'âl, Tef'îl, Tefa''ul, Tefâ'ul ve Müfâ'ale babları oluşturur. Her babın kendine özgü ek harfleri ve anlam özellikleri bulunur."
          },
          {
            "t": "Kıyasî İsm-i Fâil ve İsm-i Mef'ûl",
            "d": "Mezîdünfih bablarda etken ve edilgen sıfatlar tamamen kurallı olarak türetilir. Kural olarak kelime başına ötreli mim getirilir."
          },
          {
            "t": "İ'lâl ve Ses Değişimleri",
            "d": "Kök harflerinde illetli sesler bulunan kelimeler bu bablara nakledildiğinde uzama, düşme veya te ekleme gibi ses kuralları işler."
          }
        ],
        "concepts": [
          {
            "term": "Mezîdünfih Masdar",
            "def": "Üç aslî harfli sülâsî mücerred köklere zâid harfler eklenerek kurallı biçimde türetilen masdarlardır."
          },
          {
            "term": "İf'âl Bâbı",
            "def": "Başına hemze eklenerek yapılan, fiile geçişlilik ve ettirgenlik anlamı katan mezîdünfih masdar babıdır."
          },
          {
            "term": "Tef'îl Bâbı",
            "def": "Başına te ve ortasına ye eklenerek türetilen, geçişlilik ve çokluk veya şiddet anlamı kazandıran babdır."
          },
          {
            "term": "Tefa''ul Bâbı",
            "def": "Başına te eklenip orta harfi şeddelenerek yapılan, fiillere dönüşlülük ve yapmacıklık anlamı katan kalıptır."
          },
          {
            "term": "Tefâ'ul Bâbı",
            "def": "Başına te ve ilk harfinden sonra elif getirilerek kurulan, işteşlik ve tecâhül anlamı veren babdır."
          },
          {
            "term": "Müfâ'ale Bâbı",
            "def": "Başına mim ve ilk harfinden sonra elif eklenerek türetilen, eylemin karşılıklı yapıldığını gösteren işteşlik kalıbıdır."
          },
          {
            "term": "Kıyasî İsm-i Fâil",
            "def": "Mezîdünfih bablarda ötreli mim harfi ve sondan bir önceki harfin esresiyle yapılan etken sıfat formudur."
          },
          {
            "term": "Kıyasî İsm-i Mef'ûl",
            "def": "Mezîdünfih bablarda ötreli mim harfi ve sondan bir önceki harfin üstünüyle yapılan edilgen sıfat formudur."
          }
        ],
        "quiz": [
          {
            "q": "Sülâsî mücerred 'kerem' kökünden İf'âl babında türetilen 'ikrâm' kelimesinin etken sıfatı (ism-i fâili) aşağıdakilerden hangisidir?",
            "options": [
              "mükerrem",
              "mükrim",
              "mütekerrim",
              "mükerremât"
            ],
            "answer": 1,
            "why": "İf'âl babının ism-i fâili müf'il veznindedir; kerem kökünden ikrâm masdarının ism-i fâili mükrim olur."
          },
          {
            "q": "Eylemin iki veya daha fazla kişi arasında karşılıklı olarak yapıldığını gösteren ve 'muhâbere', 'mukâbele' gibi örneklere sahip olan mezîdünfih bab aşağıdakilerden hangisidir?",
            "options": [
              "Tef'îl babı",
              "İf'âl babı",
              "Tefa''ul babı",
              "Müfâ'ale babı"
            ],
            "answer": 3,
            "why": "Müfâ'ale babı (müfâ'ale vezni) eylemin karşılıklı yapıldığını bildiren işteşlik babıdır."
          },
          {
            "q": "Tef'îl babında 'ta'lîm' (öğretmek) masdarının edilgen sıfatı (ism-i mef'ûlü) olan 'mu'allem' kelimesi hangi vezindedir?",
            "options": [
              "mufa''al vezninde",
              "müf'il vezninde",
              "mütefa''il vezninde",
              "müfâ'al vezninde"
            ],
            "answer": 0,
            "why": "Tef'îl babının edilgen sıfatı olan ism-i mef'ûlü mufa''al veznindedir."
          }
        ],
        "compare": {
          "left": {
            "title": "İf'âl Bâbı (إفعال)",
            "points": [
              {
                "k": "Ek Harfler",
                "v": "Kökün başına hemze, ikinci harften sonra elif getirilir."
              },
              {
                "k": "Temel Anlam",
                "v": "Geçişsiz fiilleri geçişli yapar veya geçişliliği artırır."
              },
              {
                "k": "Örnek Kelimeler",
                "v": "ikrâm, ihsân, ihrâc, itmâm"
              }
            ]
          },
          "right": {
            "title": "Tef'îl Bâbı (تفعيل)",
            "points": [
              {
                "k": "Ek Harfler",
                "v": "Kökün başına te, ikinci harften sonra ye getirilir."
              },
              {
                "k": "Temel Anlam",
                "v": "Geçişlilik, eylemde şiddet veya çokluk ve saymak anlamı katar."
              },
              {
                "k": "Örnek Kelimeler",
                "v": "ta'lîm, takdîm, tasvîb, takrîr"
              }
            ]
          }
        },
        "matrix": {
          "rowTerm": "Mezîdünfih Bâbı",
          "hint": "Beş temel babın vezinleri, ism-i fâil ve ism-i mef'ûl formları",
          "axes": [
            "Masdar Vezni",
            "İsm-i Fâil Vezni",
            "İsm-i Mef'ûl Vezni"
          ],
          "rows": [
            {
              "label": "İf'âl",
              "cells": [
                "if'âl (إفعال)",
                "müf'il (mükrim)",
                "müf'al (mühkem)"
              ]
            },
            {
              "label": "Tef'îl",
              "cells": [
                "tef'îl (تفعيل)",
                "mufa''il (mu'allim)",
                "mufa''al (mürekkeb)"
              ]
            },
            {
              "label": "Tefa''ul",
              "cells": [
                "tefa''ul (تفعّل)",
                "mütefa''il (müteşebbis)",
                "mütefa''al (müteşebbes)"
              ]
            },
            {
              "label": "Tefâ'ul",
              "cells": [
                "tefâ'ul (تفاعل)",
                "mütefâ'il (mütekâmil)",
                "mütefâ'al (müte'âref)"
              ]
            },
            {
              "label": "Müfâ'ale",
              "cells": [
                "müfâ'ale (مفاعله)",
                "müfâ'il (muhâfız)",
                "müfâ'al (muhâtab)"
              ]
            }
          ]
        }
      }
    }
  }
};
