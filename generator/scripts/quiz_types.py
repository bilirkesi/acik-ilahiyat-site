"""Quiz soru tipleri: tek doğru kaynak.

`data/AGENTS.md` bu listeyi sözleşme olarak tanımlar. Sitenin puanlayıcısı
(`generator/site-template/app.js`, `GRADED`) ve denetleyiciler (`qa.py`,
`scripts/check_quiz_answers.py`) aynı listeyi kullanır. Ayrı listeler zamanla ayrışıyor
ve geçerli bir soru "bilinmeyen tip" diye reddediliyordu.
"""

# Sitenin otomatik puanladığı tipler: seçenekli, çoktan seçmeli, boşluk doldurma.
GRADED = {"multiple_choice", "multiple_select", "fill_in_the_blank"}

# Kısa cevap: sitede elle puanlanır, otomatik değil.
SHORT_ANSWER = {"short_answer"}

# Eski adlar: veride kullanılmıyor, geriye dönük uyum için kabul edilir.
LEGACY = {"test", "true_false"}

# Veri dosyalarında kabul edilen tipler (tip belirtilmemiş sorular da geçerlidir).
KNOWN = GRADED | SHORT_ANSWER | LEGACY | {None, ""}
