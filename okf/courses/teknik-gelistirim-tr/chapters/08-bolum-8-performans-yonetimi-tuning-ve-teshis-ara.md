---
type: Chapter
title: "Bölüm 8: Performans Yönetimi, Tuning ve Teşhis Araçları"
description: SGA bellek havuzlarının (sga_target, pga_aggregate_target) ve oturum kapasite parametrelerinin (open_cursors, processes) optimize edilmesi öğrenilir. AWR raporları, ADDM önerileri ve ASH saniyelik örn
course: teknik-gelistirim-tr
chapter: 8
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T07:22:59Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

SGA bellek havuzlarının (sga_target, pga_aggregate_target) ve oturum kapasite parametrelerinin (open_cursors, processes) optimize edilmesi öğrenilir. AWR raporları, ADDM önerileri ve ASH saniyelik örnekleme verilerini analiz ederek I/O darboğazlarını, satır seviyesi kilitlenmeleri ve bellek latch çekişmelerini tespit eder. Execution plan profilleme ve indeks stratejileri ile SQL sorgularını iyileştirir.

# Sesli Ders

[Bölüm 8 sesli özeti](/audio/teknik-gelistirim-tr/chapter-8.mp3) (6:03 dk, MP3)

# Öğrenme Hedefleri

1. sga_target, pga_aggregate_target, open_cursors ve processes parametrelerini ayarlayarak ORA-01000 ve ORA-00020 hatalarını önleyabilir.
2. AWR raporları, ADDM önerileri ve ASH metriklerini değerlendirerek I/O darboğazlarını ve kilitlenme çekişmelerini izole edebilir.
3. execution plan analizi ve wait event teşhisleri (C.3) ile IFS veritabanı SQL performansını optimize edebilir.

# Dersler

* Execution Plan Profiling & Index Strategies
* ADDM Report Analysis & Proactive Recommendations
* Peak Hours & Batch Run AWR Generation
* OEM Agent Administration across Nodes
* AWR Performance Metrics Interpretation
* Locking & Latch Contention Drill-Downs
* C.3 Descriptions of Wait Events - Oracle Help Center
* Database Performance Tuning Guide
* Oracle Database Database Reference, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

### Hedef 1: Bellek ve Kapasite Parametreleri Yapılandırması (`sga_target`, `pga_aggregate_target`, `open_cursors`, `processes`)

* **ADDM Teşhis Önerileri:** Otomatik Veritabanı Teşhis Monitörü (ADDM), AWR yakalamalarını otomatik inceleyerek veritabanı yapılandırmasını iyileştirmeye yönelik önceliklendirilmiş öneriler sunar [1].
* **Bellek ve Bağlantı Parametreleri:** ADDM, veritabanı bellek havuzlarının (`sga_target`, `pga_aggregate_target`) ve bağlantı parametrelerinin (`open_cursors`, `processes`) ayarlanmasını yapılandırma seviyesinde aksiyon alınabilir çözümler olarak sunar [1].
* **Kaynak Kapsamı Notu:** Seçilen kaynaklar bu parametrelerin ayarlanmasını ADDM önerileri kapsamında işlemekte, ancak ORA-01000 veya ORA-00020 hata kodlarına ve bu parametrelerin spesifik veritabanı sürüm kısıtlamalarına dair ayrıntıları bu pasajlarda açıkça belirtmemektedir [1].

---

### Hedef 2: AWR Raporları, ADDM Önerileri ve ASH Metrikleri İle Performans Teşhisi

* **Otomatik Veritabanı Teşhis Monitörü (ADDM):** ADDM, her AWR yakalamasının ardından (varsayılan olarak her 60 dakikada bir) son iki snapshot arasındaki performans farkını toplam veritabanı süresi (DB Time) odaklı analiz eder [1]. Üst düzey CPU ve bekleme süresi dağılımlarından başlayarak SQL ifadelerine, veritabanı nesnelerine ve donanım kaynaklarına kadar ağaç yapısında yukarıdan aşağıya darboğaz analizi yürütür ve verimli çalışan bileşenleri eleyerek doğrudan yüksek etkili sorunlara odaklanır [1]. ADDM bulguları `DBA_ADDM_FINDINGS` ve `DBA_ADDM_TASKS` görünümlerinden sorgulanabilir veya `addmrpt.sql` betiği ile raporlanabilir [1].
* **Otomatik İş Yükü Deposu (AWR) Analizi:** AWR, veritabanı istatistiklerini varsayılan olarak 60 dakikalık snapshot aralıklarıyla yakalar ve `SYSAUX` tablespace alanındaki depoda tutar [2]. AWR raporları, aktif kullanıcı oturumlarının harcadığı toplam süreyi gösteren DB Time değerini geçen süre (Elapsed Time) ile kıyaslar; DB Time değerinin Elapsed Time değerini belirgin şekilde aşması sistemde yüksek eşzamanlılık veya kaynak çekişmesi olduğunu gösterir [3-5]. Yük Profili (Load Profile) bölümü saniyelik ve işlem başına mantıksal okuma, fiziksel okuma, blok değişimi, redo boyutu ve sabit ayrıştırma (hard parse) metriklerini sunar [3-5]. AWR Raporları `awrrpt.sql` ile, yama öncesi ve sonrası gibi iki farklı dönemin kıyası ise AWR Compare Period raporları (`awrddrpt.sql` veya RAC için `awrddrpi.sql`) ile üretilir [3, 5].
* **Aktif Oturum Geçmişi (ASH) Örneklemesi:** ASH, SGA halka tamponunda (`v$active_session_history`) her saniye aktif oturumları örnekleyerek AWR snapshot saatlik ortalamalarının gizlediği kısa süreli performans sıçramalarını yakalar [2, 6]. Disk üzerine aktarılan geçmiş ASH verileri `dba_hist_active_sess_history` görünümünden sorgulanır [6].
* **I/O Darboğazlarının İzolasyonu:** Fiziksel I/O baskısı yaratan durumlar ASH sorgularıyla tespit edilir [6]:
  * `db file sequential read` (tek blok indeks okumaları) yüksek bekleme sayıları gösterdiğinde unindexed sorgulara veya parçalanmış B-Tree indekslerine işaret eder [4-6].
  * `db file scattered read` (çoklu blok tam tablo taramaları) toplu iş süreçlerindeki Full Table Scan operasyonlarını gösterir [4-6].
  * `direct path read` ve `direct path write` doğrudan disk I/O işlemlerini temsil eder [6].
  * `v$active_session_history` görünümü `dba_users` ve `dba_objects` ile birleştirilerek disk çekişmesine neden olan SQL ID (`sql_id`), kullanıcı adı, program ve veritabanı nesnesi (tablo veya indeks) doğrudan izole edilir [6].
* **Kilitlenme ve Latch Çekişmelerinin İzolasyonu:**
  * Satır seviyesinde kilitlenme çekişmeleri `enq: TX - row lock contention` bekleme olayı ile tespit edilir; IFS ortamlarında müşteri siparişleri, stok bakiyeleri veya muhasebe kayıtlarının eşzamanlı güncellenmesi sırasında taahhüt edilmemiş işlemlerden kaynaklanır [4, 5, 7].
  * Bellek latch çekişmelerinde `Cache Buffers Chains` latch çekişmesi sık erişilen sıcak bloklardan (hot blocks) kaynaklanır [7]. Shared Pool ve Library Cache latch/mutex çekişmeleri (örneğin `cursor: mutex S`, `cursor: mutex X`, `cursor: pin S`, `cursor: pin S wait on X`, `cursor: pin X`, `library cache: mutex X`) yüksek miktarda sabit ayrıştırma ve paylaşılmayan SQL ifadelerinden tetiklenir [7-14].
* **Sürüm Uygulaması:** AWR, ADDM ve ASH analiz yöntemleri temel veritabanı ayarları olarak açıklanmakta, AWR Compare Period raporlarında yama güncellemeleri (Release Update / Release Update Revision) değerlendirilmektedir [1, 3].

---

### Hedef 3: Execution Plan Analizi ve Wait Event Teşhisleri (C.3) İle SQL Performans Optimizasyonu

* **Resmî Wait Event Kataloğu (C.3):** Resmî Oracle kılavuzu "Database Reference 18" bünyesindeki "C.3 Descriptions of Wait Events" bölümü, oturumların hangi operasyonel nedenlerle durakladığını açıklayan veri sözlüğü kataloğudur [15]. Bu katalogda `buffer busy waits`, `cursor: mutex S`, `cursor: mutex X`, `cursor: pin S`, `cursor: pin S wait on X`, `cursor: pin X`, `db file scattered read`, `db file sequential read`, `direct path read`, `direct path write`, `enq: TX - row lock contention`, `latch free`, `library cache: mutex X` ve `log file sync` gibi bekleme olaylarının çalışma mekanizmaları ve parametreleri tanımlanmaktadır [8-14, 16-23].
* **Maliyet Tabanlı Eniyileyici (CBO) ve Yürütme Planları:** CBO; tablo istatistikleri, indeksler ve sorgu koşullarına dayanarak veri erişim yollarını belirler [24]. Tablo erişim yöntemlerinde `TABLE ACCESS FULL` (yüksek su seviyesine kadar tüm blokların taranması), `Index Unique Scan`, `Index Range Scan` ve `Index Fast Full Scan` değerlendirilir [24]. Birleştirme yöntemlerinde ise `Nested Loops`, `Hash Join` ve `Sort Merge Join` kullanılır [24].
* **Çalışma Zamanı Yürütme Planı Profilleme:** Bellekte aktif çalışan bir SQL cümlesinin gerçek yürütme planı `v$sql_plan` ve `dbms_xplan.display_cursor(sql_id => '&target_sql_id', cursor_child_number => NULL, format => 'ALLSTATS LAST')` çağrısıyla çekilir [24-27]. Yürütme planındaki Tahmini Satır Sayısı (`E-Rows`) ile Gerçekleşen Satır Sayısı (`A-Rows`) arasındaki büyük farklar bayat veya eksik tablo istatistiklerine işaret eder [25-27].
* **ASH ve Yürütme Planı Korelasyonu İle İyileştirme:**
  1. ASH taranarak en yüksek I/O veya CPU süresi tüketen SQL ID ve bekleme sınıfı tespit edilir [6, 25-27].
  2. ASH üzerinde `db file scattered read` bekleniyorsa yürütme planında büyük ERP tablolarındaki `TABLE ACCESS FULL` adımları incelenir [25-27].
  3. Hatalı maliyet hesaplamalarında tablo istatistikleri `DBMS_STATS.GATHER_TABLE_STATS(ownname => 'IFSAPP', tabname => 'CUSTOMER_ORDER_TAB', cascade => TRUE)` komutuyla güncellenir [25-27].
  4. Tam tablo taramalarını önlemek için B-Tree veya kompozit indeksler tasarlanır ve ilerideki çalıştırmalarda performans kararlılığı sağlamak için SQL Plan Baselines mekanizması uygulanır [25-27].
* **Sürüm Uygulaması:** Bekleme olayları açıklamaları resmî doküman "Database Reference 18" (Sürüm 18) kataloğuna aittir [15]. Performans akortlama temelleri "Database Performance Tuning Guide 19c" kılavuzunda sunulmaktadır [28]. Optimizasyon adımları ve `IFSAPP` şema örnekleri çalışma notlarında IFS ortamlarına uygulanmaktadır [25-27].

---

💡 **Sonraki Adımlar:** Studio paneline eklenen **Database Performance Management and Tuning** bilgi grafiğini incelemek veya **Oracle Performance Quiz** uygulamasını çözerek AWR, ADDM ve ASH analiz yeteneklerinizi test etmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `ccb29a2f-aa1f-47a3-a142-befdc1c2624e`
* NotebookLM kaynağı `4fab3e98-5068-47b1-aa07-37a106464d38`
* NotebookLM kaynağı `748b8d41-2aa0-49aa-9ecd-8a3de6b850d9`
* NotebookLM kaynağı `f63c42ec-7ed9-44c7-80cb-d09716eeb506`
* NotebookLM kaynağı `6788fff9-3d2b-4877-86aa-77fb3cb937de`
* NotebookLM kaynağı `dd60e449-4458-4561-92f0-7e84b9b2701d`
* NotebookLM kaynağı `9a96c24e-77c7-4dc1-acc2-8becadcb3d70`
* NotebookLM kaynağı `fb991bc1-c217-4dc6-a8e2-d4332a5e6a9b`
* NotebookLM kaynağı `e8ccb72a-074a-4053-a8bc-54c864851e88`
