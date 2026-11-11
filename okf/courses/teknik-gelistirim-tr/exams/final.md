---
type: Exam
title: Final Sınavı
description: Programın tamamını kapsar.
course: teknik-gelistirim-tr
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: final
exam_window: final
exam_type: final
question_count: 25
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/exams/final.md
---

# Final Sınavı

Ders: Teknik Gelişim (Türkçe) · TEK · 2026-2027 Güz. Toplam 25 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. Oracle ASM mimarisinde fine-grained (ince taneli) şeritleme stratejisinde Tahsis Birimleri (Allocation Unit - AU) kaç KB'lık şerit setlerine bölünür ve öncelikli olarak hangi dosya türlerini hedefler?

*İpucu:* Gecikmeye duyarlı ve hızlı concurrent yazma gerektiren redo log ve kontrol dosyası erişim kalıplarını düşünün.

A) 128 KB şerit setleri; Online Redo Loglar (ORL), Kontrol Dosyaları ve Flashback Loglar. *
B) 1 MB şerit setleri; Veritabanı veri dosyaları ve indeks tablo alanları.
C) 512 KB şerit setleri; RMAN yedek setleri ve geçici (temporary) dosyalar.
D) 64 KB şerit setleri; Sistem tablo alanları (SYSTEM, SYSAUX).

**Cevap anahtarı:** A

**Gerekçe (A):** İnce taneli şeritleme, küçük boyutlu ve düşük gecikme gerektiren yazma operasyonlarını optimize etmek için AU yapısını 128 KB'lık parçalara böler.

*Etiketler:* chapter-1

## 2. IFS uygulamalarının kritik üretim ortamlarında maksimum kullanılabilirlik (high availability) sağlamak üzere standart kabul edilen ve en az 3 Başarısızlık Grubu (Failure Group) gerektiren ASM esneklik modeli hangisidir?

*İpucu:* Üç yönlü aynalama (3-way mirroring) sağlayan yüksek kullanılabilirlik seçeneğini hatırlayın.

A) High Redundancy *
B) Normal Redundancy
C) External Redundancy
D) Dynamic Redundancy

**Cevap anahtarı:** A

**Gerekçe (A):** High Redundancy modeli 3 yönlü aynalama (3-way mirroring) sağlar ve veri koruması için en az 3 ayrı Failure Group gerektirir.

*Etiketler:* chapter-1

## 3. Oracle veritabanı kesinti ve failover çözümleri matrisine göre, uygulamanın nasıl kodlandığının bilinmediği ve bağlantı havuzu (connection pool) kullanılmadığı durumlarda destek sunan mimari çözüm hangisidir?

*İpucu:* Uygulama kodunda değişiklik gerektirmeyen ve bağlantı havuzuna bağımlı olmayan şeffaf süreklilik seçeneğine odaklanın.

A) TAC (Transparent Application Continuity) *
B) AC (Application Continuity)
C) TAF (Transparent Application Failover)
D) Draining

**Cevap anahtarı:** A

**Gerekçe (A):** TAC, uygulama kod mimarisi bilinmese ve connection pool kullanılmasa bile işlem durumunu koruyup failover sağlayabilir.

*Etiketler:* chapter-1

## 4. TAC (Transparent Application Continuity) failover diziliminde, istemci sürücüsü (client driver) sunucu çökmesi sonrasında işlem durumunu doğrulamak için surviving RAC örneğindeki Transaction Guard'ı hangi veri ile sorgular?

*İpucu:* Transaction Guard'ın mantıksal işlem takibi yapmak için kullandığı benzersiz tanımlayıcıyı düşünün.

A) Oturuma atanan LTXID (Logical Transaction ID) değeri *
B) Veritabanı SCN (System Change Number) damgası
C) GCS blok sahiplik kilidi adresi
D) İşletim sistemi PID ve SID eşleşme kimliği

**Cevap anahtarı:** A

**Gerekçe (A):** Sürücü, kesintiye uğrayan oturumun LTXID değerini Transaction Guard'a sorarak işlemin çökme öncesinde committed olup olmadığını teyit eder.

*Etiketler:* chapter-1

## 5. Oracle RAC ortamında 'gc buffer busy acquire' bekleme olayının kök nedeni ve önerilen operasyonel iyileştirme stratejisi hangisidir?

*İpucu:* Bir düğümün yoldaki (in-flight) bir bloğu beklediği durumu ve veri erişimini düğümlere göre ayırma yöntemini hatırlayın.

A) Yerel düğümün uzaktaki düğümden yoldaki bloğu beklemesi; Tabloları/indeksleri hash bölümleme ve yazma servisleri için düğüm meyniyeti (node affinity) yapılandırma. *
B) Uzaktaki düğümün bloğu exclusive modda tutması ve yavaş serbest bırakması; Jumbo Frames (MTU 9000) yapılandırma.
C) Eşzamanlı işlemlerin aynı satırları güncellemesi; İndekssiz foreign key sütunlarına indeks ekleme.
D) Veri sözlüğünde dizi numarası üretimi çekişmesi; CACHE değerini artırma.

**Cevap anahtarı:** A

**Gerekçe (A):** gc buffer busy acquire olayı, blokların düğümler arasında taşınırken yerel düğümde beklemesinden kaynaklanır; partitioning ve node affinity bu trafiği azaltır.

*Etiketler:* chapter-2

## 6. Oracle RAC ortamında dizi numarası (sequence generation) üretimi sırasında veri sözlüğü çekişmesinden kaynaklanan 'row cache lock (DC_SEQUENCES)' beklemesini gidermek için hangi adım atılmalıdır?

*İpucu:* Düğümler arası sıra senkronizasyon zorunluluğunu kaldıran ve bellekten numara tahsisini artıran parametre grubunu düşünün.

A) Sıraları (sequences) CACHE 1000 veya daha yüksek bir değere yükseltmek ve NOORDER ayarlamak. *
B) Ağ arabiriminde Jumbo Frames (MTU 9000) yapılandırmak.
C) Sıraları CYCLE ve ORDER moduna getirmek.
D) Shared Pool boyutunu küçülterek kilit alanını daraltmak.

**Cevap anahtarı:** A

**Gerekçe (A):** Sequence belleğini artırmak (CACHE >= 1000) ve kesin sıralama zorunluluğunu (NOORDER) kaldırmak veri sözlüğü kilit çekişmesini engeller.

*Etiketler:* chapter-2

## 7. Oracle Multitenant mimarisinde ortak arka plan süreçlerini, sistem meta verilerini ve küresel bellek alanını yöneten bileşen ile yeni PDB'ler provizyonlamak için kullanılan şablon sırasıyla hangileridir?

*İpucu:* Kök konteyner adı ile veritabanı kopyalamada kullanılan tohum şablon adını hatırlayın.

A) CDB$ROOT ve PDB$SEED *
B) PDB$SEED ve User PDB
C) CDB$ROOT ve SYSTEM$PDB
D) User PDB ve PDB$ROOT

**Cevap anahtarı:** A

**Gerekçe (A):** CDB$ROOT ana sistem metadata ve bellek alanını yönetirken, PDB$SEED yeni veritabanları klonlamak için hazır sistem şablonudur.

*Etiketler:* chapter-2

## 8. Oracle veritabanı bakım döngülerinde Release Update (RU) ile Release Update Revision (RUR) arasındaki temel fark nedir?

*İpucu:* Hangi paketin fonksiyonel içerik eklemeden sadece güvenlik ve regresyona odaklanarak mevcut sürümün ömrünü uzattığını düşünün.

A) RU, minor sürümü artıran üç aylık kümülatif güncellemeler sunarken; RUR, yeni fonksiyonel hata düzeltmesi eklemeden mevcut RU'nun ömrünü uzatan güvenlik ve regresyon odaklı yamadır. *
B) RU sadece güvenlik yamalarını içerirken; RUR tüm veritabanı çekirdeğini majör sürüme yükseltir.
C) RU alt ortamlara uygulanırken; RUR sadece CDB$ROOT konteynerine uygulanır.
D) RUR üç ayda bir kümülatif yeni özellikler getirirken; RU sadece kritik acil durumlarda yayımlanır.

**Cevap anahtarı:** A

**Gerekçe (A):** RU yeni işlevsel düzeltmeler ve ikincil sürüm artışı sağlarken, RUR mevcut RU sürümünün kararlılığını fonksiyonel değişiklik yapmadan sürdürür.

*Etiketler:* chapter-3

## 9. Oracle Otomatik Paylaşımlı Bellek Yönetimi (ASMM) etkinleştirildiğinde sga_target parametresi tarafından dinamik olarak yönetilen bellek havuzları hangileridir?

*İpucu:* ASMM çatısı altında dinamik olarak yeniden boyutlandırılabilen paylaşımlı bellek havuzlarını hatırlayın.

A) Buffer Cache, Shared Pool, Large Pool ve Java Pool. *
B) Sort Area, Hash Join Area ve Bitmap Merge Area.
C) PGA Aggregate Target, Process Memory ve Redo Log Buffer.
D) Shared Pool, PGA Target ve Temporary Tablespace.

**Cevap anahtarı:** A

**Gerekçe (A):** ASMM etkinleştirildiğinde Oracle, sga_target altındaki Buffer Cache, Shared Pool, Large Pool ve Java Pool boyutlarını otomatik dengeler.

*Etiketler:* chapter-3

## 10. IFS altyapı standartlarında DATA disk grubu ile RECO disk grubu arasındaki görev ayrımı nasıl tanımlanmıştır?

*İpucu:* Transactional I/O ile kurtarma/yedekleme (recovery) I/O yüklerinin ayrıştırıldığı depolama gruplarını düşünün.

A) DATA; aktif veri/indeks dosyaları ve online redo logları barındırırken, RECO; arşiv logları, RMAN yedekleri, flashback logları ve redo log kopyalarını barındırır. *
B) DATA sadece geçici (temp) dosyaları tutarken; RECO tüm üretim veri dosyalarını barındırır.
C) DATA arşiv loglarını ve yedek setlerini; RECO ise aktif sistem tablo alanlarını barındırır.
D) DATA harici depolama birimlerine bağlanırken; RECO yerel disklerde çalışmak zorundadır.

**Cevap anahtarı:** A

**Gerekçe (A):** DATA transactional I/O yükünü üstlenirken, RECO recovery ve kurtarma bileşenlerini izole ederek disk bant genişliği çakışmasını önler.

*Etiketler:* chapter-4

## 11. Data Guard Broker yapılandırmasında Fast-Start Failover sürecini otomatik tetiklemek için kullanılan FastStartFailoverThreshold parametresinin zaman birimi nedir?

*İpucu:* Observer'ın ana veritabanı yanıt vermediğinde failover başlatmadan önce beklediği standart zaman birimini hatırlayın.

A) Saniye (second) *
B) Dakika (minute)
C) Milisaniye (millisecond)
D) Saat (hour)

**Cevap anahtarı:** A

**Gerekçe (A):** FastStartFailoverThreshold parametresi, Observer'ın birincil veritabanı kesintisini tespit ettikten sonra failover başlatması için geçecek süreyi saniye cinsinden tanımlar.

*Etiketler:* chapter-4

## 12. Oracle RAC mimarisinde Cache Fusion mekanizmasının veritabanı bloklarını diske yazmadan örnekler (SGA) arasında aktarmasını sağlayan altyapı bileşeni nedir?

*İpucu:* Düğümler arası bellek bloklarının fiziksel disklere yazılmadan aktarıldığı özel ağ altyapısını düşünün.

A) Yüksek hızlı özel ağ olan Interconnect (ve HAIP/bonding) *
B) SCAN Listener ve VIP adresleri
C) ASM Rebalance motoru
D) Enterprise Manager OMA Ajanı

**Cevap anahtarı:** A

**Gerekçe (A):** Cache Fusion, blok transferlerini düğümler arasındaki dedicated yüksek hızlı Interconnect ağı üzerinden doğrudan RAM-to-RAM şeklinde gerçekleştirir.

*Etiketler:* chapter-4

## 13. Oracle Veritabanı bekleme olaylarında 'library cache pin' neyi yönetir ve istemci nesneyi incelemek veya değiştirmek için kilit sonrasında ne elde etmelidir?

*İpucu:* Kütüphane önbelleğindeki (library cache) nesne yığınlarının (heaps) belleğe yüklenmesi ve incelenmesi sürecini düşünün.

A) Library cache eşzamanlılığını yönetir ve nesnenin yığınlarını (heaps) belleğe yüklemek için pin almalıdır. *
B) Tablo satır seviyesindeki kilitlemeyi yönetir ve kilit sonrası TX enqueue almalıdır.
C) Veri bloğunun diske yazılmasını yönetir ve DBWR sürecini tetiklemelidir.
D) Veri sözlüğü dizilerini yönetir ve DC_SEQUENCES kilidi almalıdır.

**Cevap anahtarı:** A

**Gerekçe (A):** Library cache pin, nesne heaps yapılarını belleğe yükler; istemci nesneyi incelemek veya değiştirmek için lock edindikten sonra pin almak zorundadır.

*Etiketler:* chapter-5

## 14. IFS Cloud 26R2 Uzaktan Dağıtım (Remote Deployment) modelinde harici kullanıcı oturumlarının dağıtım betikleri çalışırken şemayı değiştirmesini engellemek için zorunlu kılınan güvenlik adımı hangisidir?

*İpucu:* Dağıtım esnasında veritabanı şema sahibi hesabının dış oturumlara kapatılması kuralını düşünün.

A) Uygulama Sahibi Hesabının (Lock Application Owner Account - IFSAPP) kilitlenmesi *
B) PDB$SEED konteynerinin silinmesi
C) RMAN kataloğunun tamamen sıfırlanması
D) Kubernetes worker düğümlerinin etiketlerinin temizlenmesi

**Cevap anahtarı:** A

**Gerekçe (A):** Dağıtım öncesinde IFSAPP hesabının kilitlenmesi, harici kullanıcıların ve servislerin canlı şemayı değiştirmesini engellemek için zorunludur.

*Etiketler:* chapter-5

## 15. IFS Cloud operasyonel yönetişim standartlarına göre tamamlanan arka plan işleri (completed background jobs) ve Hata (Error) durumundaki işler için varsayılan temizlik yaş limitleri sırasıyla kaç gündür?

*İpucu:* Başarılı işlerin kısa sürede temizlenmesi ve başarısız işlerin kök neden analizi için uzun süre saklanması mantığını hatırlayın.

A) Tamamlanan işler için 7 gün; Hata durumundaki işler için 180 gün. *
B) Tamamlanan işler için 30 gün; Hata durumundaki işler için 90 gün.
C) Tamamlanan işler için 1 gün; Hata durumundaki işler için 365 gün.
D) Tamamlanan işler için 14 gün; Hata durumundaki işler için 30 gün.

**Cevap anahtarı:** A

**Gerekçe (A):** Veritabanını lehte tutmak için tamamlanan işler 7 günde temizlenirken, hata analiz geçmişini korumak için hatalı işler 180 gün saklanır.

*Etiketler:* chapter-6

## 16. IFS Cloud sisteminde Uygulama İzleme Metriklerini (AMM) eşik değerlerine göre günlük olarak değerlendirip sistem uyarılarını tetikleyen zamanlanmış görev (scheduled task) hangisidir?

*İpucu:* IFS Foundation1 altyapısının izleme metriklerini değerlendiren zamanlanmış görev adını düşünün.

A) Foundation1 Monitoring *
B) AMM Evaluator Daemon
C) Database Alert Log Checker
D) Transaction_SYS Clean Task

**Cevap anahtarı:** A

**Gerekçe (A):** Foundation1 Monitoring görevi günlük çalışarak AMM metriklerini uyarı limitleriyle karşılaştırır ve eşik ihlallerinde sistem alarmı üretir.

*Etiketler:* chapter-6

## 17. IFS Cloud log izleme mimarisindeki EFK (Elasticsearch, Fluentd, Kibana) yığınında Elasticsearch veri saklama süresi (retention period) kaç gündür?

*İpucu:* EFK yığınında günlük curator görevi tarafından uygulanan standart saklama gün sayısını hatırlayın.

A) 7 gün (günlük çalışan curator-cronjob eski logları siler) *
B) 30 gün
C) 90 gün
D) 1 gün

**Cevap anahtarı:** A

**Gerekçe (A):** Elasticsearch veri saklama süresi varsayılan olarak 7 gündür ve günlük çalışan curator-cronjob 7 günden eski logları temizler.

*Etiketler:* chapter-6

## 18. Tek örnekli (single-instance) bir Oracle veritabanı Oracle RAC mimarisine dönüştürüldüğünde, GCS (Global Cache Service) her bir tampon (buffer) için yaklaşık 350 bayt ek alan gerektirdiği için SGA'da hangi parametrelerin artırılması önerilir?

*İpucu:* Veri tampon önbelleğini (buffer cache) doğrudan yöneten initialization parametrelerini düşünün.

A) DB_CACHE_SIZE ve DB_nK_CACHE_SIZE *
B) PGA_AGGREGATE_TARGET ve SGA_MAX_SIZE
C) SHARED_POOL_SIZE ve LOG_BUFFER
D) CLUSTER_INTERCONNECTS ve PARALLEL_MAX_SERVERS

**Cevap anahtarı:** A

**Gerekçe (A):** RAC dönüşümünde GCS tampon başına 350 bayt ek yük getirdiğinden swapping ve paging'i önlemek için DB_CACHE_SIZE ve DB_nK_CACHE_SIZE büyütülmelidir.

*Etiketler:* chapter-7

## 19. Oracle RAC mimarisinde Global Cache Service (GCS) ve Global Enqueue Service (GES) tarafından yönetilen Global Resource Directory (GRD) bellek miktarı toplam SGA'nın yaklaşık % kaçını tüketir?

*İpucu:* RAC kurulumunda tekil sunucudan RAC'a geçerken SGA artış planlamasında dikkate alınan yüzdeyi hatırlayın.

A) Yaklaşık %10'unu *
B) Yaklaşık %50'sini
C) Yaklaşık %2'sini
D) Yaklaşık %30'unu

**Cevap anahtarı:** A

**Gerekçe (A):** GRD ve diğer Cache Fusion bileşenleri, küresel önbellek tutarlılığını yönetebilmek için toplam SGA belleğinin yaklaşık %10'unu tüketir.

*Etiketler:* chapter-7

## 20. Veritabanında 'enq: TM - contention' bekleme olayının yaşanmasının temel kök nedeni ve operasyonel çözüm adımı nedir?

*İpucu:* Parent ve child tablolar arasındaki ilişkiyi ve kilitlenmeyi önleyen eksik indeksleme adımını düşünün.

A) Çocuk FK (Foreign Key) sütunlarında indeks bulunmayan üst (parent) tabloda DML çalıştırılması; Tüm eksik FK sütunlarına indeks oluşturulması. *
B) İki farklı oturumun aynı satırı güncellemeye çalışması; Oturumlara hemen ROLLBACK yaptırılması.
C) Eşzamanlı UNIQUE indeks eklemeleri; İndeksin REBUILD edilmesi.
D) Sequence değerlerinin önbelleksiz kullanılması; CACHE parametresinin artırılması.

**Cevap anahtarı:** A

**Gerekçe (A):** İndekssiz FK sütunları parent tabloda yapılan DML işlemlerinde tüm child tabloyu kilitleyerek enq: TM contention oluşturur; indeks eklemek bunu çözer.

*Etiketler:* chapter-8

## 21. Paylaşımlı bir multitenant ortamında hedef bir PDB'nin (örneğin ifstest) ana üretim üzerindeki bellek kaynağını tüketmesini önlemek için PDB düzeyinde hangi parametreler sınırlandırılabilir?

*İpucu:* PDB seviyesinde PGA ve SGA bellek tavanlarını kontrol eden parametre isimlerini hatırlayın.

A) pga_aggregate_limit ve sga_target *
B) db_create_file_dest ve log_archive_dest
C) processes ve open_cursors
D) audit_trail ve remote_login_passwordfile

**Cevap anahtarı:** A

**Gerekçe (A):** PDB düzeyinde sga_target ve pga_aggregate_limit parametreleri ayarlanarak ilgili konteynerin bellek tüketim tavanı izole edilebilir.

*Etiketler:* chapter-8

## 22. Oracle Clusterware altyapısında veritabanı, instance, servis, listener ve VIP gibi CRS kaynaklarını yönetmek ve komutların kaynaklar üzerindeki etkisini değerlendirmek için kullanılan araç ve mod hangisidir?

*İpucu:* Server Control Utility adıyla bilinen ve kaynak etkilerini simüle edebilen komut modunu düşünün.

A) SRVCTL komutu ve evaluate modu *
B) RMAN komut satırı ve report seçeneği
C) ASMCMD yardımcı programı ve ls-l parametresi
D) SQL*Plus ve ALTER SYSTEM komutu

**Cevap anahtarı:** A

**Gerekçe (A):** SRVCTL, Oracle tarafından tanımlı CRS kaynaklarını yönetir; evaluate modu ise komutun küme kaynakları üzerindeki etkisini önceden raporlar.

*Etiketler:* chapter-8

## 23. IFS Cloud 26R2 altyapı gereksinimlerine göre middle-tier Kubernetes podlarının (örneğin ifsapp-connect) out-of-memory (OOM) çökmelerini önlemek için bellek direktifleri hangi yapılandırma dosyasında belirtilmelidir?

*İpucu:* IFS Cloud Helm/Kubernetes dağıtım değerlerini belirleyen ana değerler (values) dosyasını hatırlayın.

A) ifscloud-values.yaml *
B) oracle-sga-config.xml
C) vmanomaly-config.yml
D) tnsnames.ora

**Cevap anahtarı:** A

**Gerekçe (A):** ifscloud-values.yaml dosyası middle-tier podlarının (ifsapp-connect gibi) Kubernetes bellek sınırlarını ve kaynak ayarlarını içerir.

*Etiketler:* chapter-9

## 24. IFS veritabanı performans optimizasyonunda, seçici olmayan (kötü) bir B-Tree indeksin kullanılması durumunda veritabanında aşırı CPU tüketimine ve disk kilitlenmesine yol açan wait event hangisidir?

*İpucu:* İndeks üzerinden tekil veri bloğu okumalarında tetiklenen sıralı okuma bekleme adını hatırlayın.

A) db file sequential read *
B) db file scattered read
C) direct path read
D) log file sync

**Cevap anahtarı:** A

**Gerekçe (A):** Seçici olmayan bir indeks üzerinden milyonlarca tekil blok okuması yapılması sistemi 'db file sequential read' döngüsüne sokarak diski kilitler.

*Etiketler:* chapter-9

## 25. TAC (Transparent Application Continuity) failover sürecinde kesintiye uğrayan uncommitted (taahhüt edilmemiş) bir işlem için oturum durumu tutarlılık kontrolleri başarılı olursa TAC ne yapar?

*İpucu:* TAC'ın uygulama tarafına hata hissettirmeden SQL komutlarını istek sınırları içinde yapma sürecini düşünün.

A) Oturum durumunu yeniden yapılandırır ve belirlenen istek sınırları (request boundary) dahilinde SQL ifadelerini yeniden oynatır (replay eder). *
B) İşlemi derhal ROLLBACK eder ve uygulamaya hata kodu ORA-0001 döner.
C) İşlemi yürütmeden doğrudan COMMIT edilmiş sayarak istemciye başarı mesajı gönderir.
D) Oturumu pasif moda alıp veritabanı örneğini kapatır.

**Cevap anahtarı:** A

**Gerekçe (A):** TAC, uncommitted işlemler için oturum tutarlılığı doğrulandıktan sonra SQL komutlarını request boundary dahilinde otomatik replay ederek kesintisiz çalışmayı sağlar.

*Etiketler:* chapter-10
