---
type: Exam
title: Uygulama Sınavı
description: Programın tamamına yayılan senaryo soruları.
course: teknik-gelistirim-tr
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: yaz-kursu
exam_window: summer
exam_type: yaz-kursu
question_count: 20
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/exams/yaz-kursu.md
---

# Uygulama Sınavı

Ders: Teknik Gelişim (Türkçe) · TEK · 2026-2027 Güz. Toplam 20 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. Oracle Multitenant mimarisinde, tüm Pluggable Database (PDB) yapıları tarafından paylaşılan sistem meta verilerini, ortak kullanıcı hesaplarını (common users) ve küresel veritabanı parametrelerini yöneten ana kök konteyner hangisidir?

*İpucu:* Veritabanı altyapısının en üst seviyesinde yer alan ana kök konteyner adını hatırlayın.

A) CDB$ROOT *
B) PDB$SEED
C) User PDB
D) Application Root

**Cevap anahtarı:** A

**Gerekçe (A):** CDB$ROOT, Oracle Multitenant mimarisinde ortak sistem verilerini, arka plan süreçlerini ve global veritabanı ayarlarını barındıran ana konteynerdir.

*Etiketler:* chapter-1

## 2. Oracle yama yaşam döngüsünde (patch management lifecycle), güvenlik açıklarını kapatan ve kritik kararlılık iyileştirmeleri sunarak minor veritabanı sürümünü artıran üç aylık kümülatif yama türü hangisidir?

*İpucu:* Üç aylık periyotlarla yayınlanan ana kümülatif güncelleme paketinin adını düşünün.

A) Release Updates (RU) *
B) Release Update Revisions (RUR)
C) Interim Patch
D) Diagnostic Patch

**Cevap anahtarı:** A

**Gerekçe (A):** Release Updates (RU), veritabanı sürüm numaralarını güncelleyen üç aylık kümülatif güvenlik ve işlevsel hata düzeltme paketleridir.

*Etiketler:* chapter-1

## 3. Automatic Shared Memory Management (ASMM) etkinleştirilip sga_target değeri belirlendiğinde, Oracle Veritabanı hangi bellek alanlarının boyutunu dinamik olarak otomatik düzenler?

*İpucu:* SGA bünyesindeki paylaşılan bellek havuzlarını göz önüne getirin.

A) Buffer Cache, Shared Pool ve Large Pool *
B) Process Sort Area ve Hash Join Work Area
C) Redo Log Buffer ve User Session PGA
D) Private SQL Area ve Call Stack

**Cevap anahtarı:** A

**Gerekçe (A):** sga_target ayarlandığında ASMM; Buffer Cache, Shared Pool, Large Pool ve Java Pool gibi SGA dinamik bileşenlerini otomatik dengeler.

*Etiketler:* chapter-1

## 4. Oracle Automatic Storage Management (ASM) mimarisinde Online Redo Log (ORL), Control File ve Flashback Log gibi düşük gecikmeli hızlı yazma gerektiren dosyalar için hangi şeritlenme (striping) stratejisi uygulanır?

*İpucu:* Redo loglar gibi düşük gecikmeli küçük yazma operasyonları için kullanılan ince taneli striping seçeneğidir.

A) Fine-Grained Striping (128 KB) *
B) Coarse-Grained Striping (1 MB - 4 MB)
C) External Mirroring Striping
D) High Redundancy Striping

**Cevap anahtarı:** A

**Gerekçe (A):** Fine-Grained Striping, Allocation Unit parçalarını 128 KB'lık küçük stripe setlerine bölerek hızlı ve eşzamanlı redo/kontrol dosyası yazmalarını optimize eder.

*Etiketler:* chapter-2

## 5. Kurumsal veritabanı altyapılarında veritabanı verilerinin +DATA, kurtarma ve log varlıklarının ise +RECO disk gruplarına ayrılmasının temel mimari sebebi nedir?

*İpucu:* Arşivleme ve yedekleme trafiğinin ana veri okuma/yazma performansı üzerindeki olumsuz etkisini düşünün.

A) Kurtarma ve arşiv log I/O trafiğini ana transactional veri I/O trafiğinden izole etmek *
B) SGA belleğinin taşmasını engellemek ve PGA kotasını artırmak
C) PDB'lerin otomatik olarak silinmesini engellemek
D) Kümedeki RAC node sayısına eşit miktarda disk grubu oluşturma zorunluluğu

**Cevap anahtarı:** A

**Gerekçe (A):** RECO disk grubunun ayrılması, yedekleme ve arşivleme yükünün active OLTP veri dosyalarının disk bant genişliğiyle yarışmasını önler.

*Etiketler:* chapter-2

## 6. Oracle RAC aktif-aktif kümeleme altyapısında, düğümler (nodes) arasında veri bloklarının disk I/O yapılmadan doğrudan bellekten belleğe yüksek hızlı private Interconnect üzerinden aktarılmasını sağlayan teknoloji hangisidir?

*İpucu:* RAC düğümleri arasındaki yüksek hızlı önbellek senkronizasyonu teknolojisidir.

A) Cache Fusion *
B) Automatic Shared Memory Management
C) Block Change Tracking
D) Managed Recovery Process

**Cevap anahtarı:** A

**Gerekçe (A):** Cache Fusion, RAC kümesindeki SGA'lar arasında veri bloklarını özel Interconnect ağı üzerinden doğrudan transfer ederek disk yazma zorunluluğunu ortadan kaldırır.

*Etiketler:* chapter-3

## 7. Oracle Maximum Availability Architecture (MAA) Gold/Platinum standartlarında sıfır veri kaybı ($RPO = 0$) garantisi sağlamak için Data Guard mimarisinde hangi redo aktarım modu yapılandırılmalıdır?

*İpucu:* Birincil sunucudaki commit işleminin yedek sunucu onayına bağlandığı aktarım seçeneğidir.

A) Synchronous Redo Transport (Senkron Redo Aktarımı) *
B) Asynchronous Redo Transport (Asenkron Redo Aktarımı)
C) Periodic Flashback Logging
D) Manual Archivelog Shipping

**Cevap anahtarı:** A

**Gerekçe (A):** $RPO = 0$ gereksinimi, birincil veritabanındaki bir işlemin commit edilmeden önce standby tarafına yazılmasını zorunlu kılan senkron aktarım ile sağlanır.

*Etiketler:* chapter-3

## 8. Oracle Data Guard Broker yapısında yer alan ve Observer sürecinin birincil veritabanı hatasını algılayıp otomatik failover tetiklemesine kadar bekleyeceği süreyi belirleyen FastStartFailoverThreshold parametresinin birimi nedir?

*İpucu:* Zaman aşımı eşiğini tanımlamak için kullanılan temel standart zaman birimidir.

A) Saniye (Second) *
B) Dakika (Minute)
C) Milisaniye (Millisecond)
D) Saat (Hour)

**Cevap anahtarı:** A

**Gerekçe (A):** FastStartFailoverThreshold parametresi, otomatik kesinti geçişi kararı verilmeden önce beklenilecek süreyi saniye cinsinden ifade eder.

*Etiketler:* chapter-4

## 9. RMAN artımlı (incremental) yedekleme süreçlerinde veritabanı veri dosyalarının tamamını taramadan yalnızca değişen blokları tespit etmek ve yedekleme süresini kısaltmak için kullanılan özellik hangisidir?

*İpucu:* Değişen blokların izini sürerek disk taramasını engelleyen mekanizmadır.

A) Block Change Tracking (BCT) *
B) Automatic Storage Management (ASM)
C) Transparent Data Encryption (TDE)
D) Application Continuity (AC)

**Cevap anahtarı:** A

**Gerekçe (A):** Block Change Tracking (BCT), değişen veritabanı bloklarını küçük bir dosyada takip ederek RMAN'in verisetini taramadan doğrudan değişen blokları okumasını sağlar.

*Etiketler:* chapter-4

## 10. Active Session History (ASH) raporlarında ve v$active_session_history görünümünde bir SQL sorgusunun yoğun olarak db file sequential read bekleme olayı ürettiği görülüyorsa bu durum neye işaret eder?

*İpucu:* Bekleme adında 'sequential' geçmesine rağmen indeksli tekil erişimlerde oluşan olayı düşünün.

A) Sorgunun bir indeks kullanarak diskten tekil/rastgele veri blokları okuduğuna *
B) Sorgunun büyük bir tabloda Full Table Scan (çoklu blok okuma) yaptığına
C) Redo log dosyasına veri yazılırken I/O darboğazı yaşandığına
D) Shared Pool üzerinde kilitlenme (latch) meydana geldiğine

**Cevap anahtarı:** A

**Gerekçe (A):** db file sequential read bekleme olayı, adındaki sıradanlığın aksine B-Tree indeksler üzerinden yapılan tekil blok erişimlerini temsil eder.

*Etiketler:* chapter-5

## 11. DBMS_XPLAN.DISPLAY_CURSOR veya AWR çalışma planı çıktısında yer alan E-Rows (Tahmini Satır Sayısı) ile A-Rows (Gerçekleşen Satır Sayısı) değerleri arasında uçurum olması temel olarak hangi sorunu gösterir?

*İpucu:* CBO'nun çalışma planını oluştururken temel aldığı istatistiksel verileri hatırlayın.

A) Tablo ve indeks istatistiklerinin bayat (stale) veya eksik olduğunu *
B) PGA alanının tamamen dolduğunu ve diske yazma yapıldığını
C) ASM disk grubunda yetersiz alan kaldığını
D) Active Data Guard senkronizasyonunun tamamen koptuğunu

**Cevap anahtarı:** A

**Gerekçe (A):** E-Rows ve A-Rows arasındaki büyük sapmalar, Cost-Based Optimizer'ın (CBO) güncel olmayan istatistikler nedeniyle hatalı satır tahmini yaptığını gösterir.

*Etiketler:* chapter-5

## 12. Active Session History (ASH) verilerinin bellek içi SGA ring buffer alanından diskteki AWR depolarına (WRH$_ACTIVE_SESSION_HISTORY) düzenli olarak aktarılmasını (flush) sağlayan veritabanı arka plan süreci hangisidir?

*İpucu:* Bellek izleme ve istatistik toplama işlerini yürüten ana monitor sürecini düşünün.

A) MMON (Memory Monitor) *
B) LMS (Global Cache Service Process)
C) PMON (Process Monitor)
D) CKPT (Checkpoint)

**Cevap anahtarı:** A

**Gerekçe (A):** MMON arka plan süreci, bellek içi AWR/ASH örneklerini toplar ve bunları düzenli aralıklarla diske kaydeder.

*Etiketler:* chapter-6

## 13. Oracle Enterprise Manager (OEM) Cloud Control mimarisinde, izlenen hedef sunucularda konuşlanarak sistem metriklerini toplayan ve Oracle Management Server (OMS) bileşenine ileten yapı hangisidir?

*İpucu:* Hedef makineler üzerinde çalışan yönetim ajanı bileşenidir.

A) Oracle Management Agent (OMA) *
B) Oracle Management Repository (OMR)
C) Global Resource Directory (GRD)
D) Grid Infrastructure (GI)

**Cevap anahtarı:** A

**Gerekçe (A):** OMA, izlenen hedef konaklarda (host) çalışan ve topladığı metrik verilerini OMS'e aktaran agent yazılımıdır.

*Etiketler:* chapter-6

## 14. OEM Cloud Control sisteminde ham metrik uyarılarının (Event) incelenip idari müdahale gerektiren bir olaya (Incident) dönüştürülmesini ve e-posta/ITSM bildirimlerinin tetiklenmesini sağlayan yapı mantığı nedir?

*İpucu:* Olay yükseltme ve bildirim yönlendirme mantığını barındıran kural kümesidir.

A) Incident Rule Sets (Olay Kural Setleri) *
B) Resource Manager Profiles
C) Fast-Start Failover Observer
D) Automatic Workload Repository (AWR)

**Cevap anahtarı:** A

**Gerekçe (A):** Incident Rule Sets, OEM bünyesinde hangi olayların incident seviyesine yükseltileceğini ve hangi bildirim kanallarının işletileceğini belirleyen kurallar dizisidir.

*Etiketler:* chapter-7

## 15. 11.11.2026 kesinti inceleme verilerine ve operasyonel teknik standartlara göre, IFS arka plan işleyicilerinin (job handlers) takıldığını gösteren ve izlemede ilk eklenmesi gereken kritik sinyal hangisidir?

*İpucu:* İşleme alınmayı bekleyen mesajların biriktiği veritabanı kuyruk metriğidir.

A) Oracle Advanced Queue (AQ) mesaj birikmesi (ifs_aq) *
B) SGA Buffer Cache doluluk oranı
C) Host CPU utilization limit aşımı
D) Flashback log alanının tükenmesi

**Cevap anahtarı:** A

**Gerekçe (A):** Kuyrukta bekleyen (ready) mesaj sayısının uzun süre düşmemesi (AQ birikmesi), arka plan işleyicisinin takıldığını gösteren en hızlı kök sinyaldir.

*Etiketler:* chapter-7

## 16. Extra Diagnostics veya Tuning Pack lisansı bulunmayan Oracle ortamlarda (ADR-0005 uyumlu), zamanlanmış görevlerin (Scheduled Tasks) geçmişini sorgulamak için hangi standart veri sözlüğü görünümü kullanılmalıdır?

*İpucu:* Ek paket lisansı gerektirmeyen standart Oracle Scheduler iş detay görünümüdür.

A) DBA_SCHEDULER_JOB_RUN_DETAILS *
B) DBA_HIST_ACTIVE_SESS_HISTORY
C) V$AWR_DATA
D) V$SQL_PLAN_STATISTICS_ALL

**Cevap anahtarı:** A

**Gerekçe (A):** DBA_SCHEDULER_JOB_RUN_DETAILS görünümü, ilave paket lisansı gerektirmeden standart Oracle Scheduler iş detaylarını ve geçmişini sunar.

*Etiketler:* chapter-8

## 17. IFS Cloud ve ERP ortamlarında güncelleme veya deploy işlemleri öncesinde nesnelerin INVALID duruma düşmesini ve veri kilitlenmelerini engellemek için deploy kontrol listesinde bulunması gereken temel şart nedir?

*İpucu:* Deploy başlatılmadan önce arka planda yürütülen süreçlerin durumunu kontrol etme adımıdır.

A) Açık veya çalışan arka plan işinin (background job) kalmadığının doğrulanması *
B) Tüm B-Tree indekslerinin geçici olarak silinmesi
C) SGA ve PGA boyutlarının sıfırlanması
D) Online Redo Log gruplarının silinip tek gruba düşürülmesi

**Cevap anahtarı:** A

**Gerekçe (A):** Deploy öncesi açık/çalışan batch işlerin temizlenmesi, deployment sırasında paketlerin ve nesnelerin kilitlenmesini ya da geçersizleşmesini önler.

*Etiketler:* chapter-8

## 18. Paylaşımlı bir Multitenant CDB ortamında, alt test PDB'si (örneğin IFS_TEST) üzerinde pga_aggregate_limit veya sga_target değerlerinin kısıtlanmasının temel amacı nedir?

*İpucu:* Çok kiracılı ortamda alt veritabanlarının üretimin kaynağını tüketmesini engelleme hedefini düşünün.

A) Non-production iş yüklerinin bellek sömürmesini ve üretim (IFS_PROD) PDB'sini yavaşlatmasını önlemek *
B) RAC Interconnect bant genişliğini otomatik olarak iki katına çıkarmak
C) RMAN artımlı yedeklemelerini tamamen devre dışı bırakmak
D) Redo log dosyalarını Coarse Striping yapmaya zorlamak

**Cevap anahtarı:** A

**Gerekçe (A):** PDB düzeyinde bellek sınırları belirlemek, alt ortamlardaki kontrolsüz sorguların sunucudaki tüm RAM'i tüketmesini engelleyerek üretim izolasyonunu korur.

*Etiketler:* chapter-9

## 19. IFS Cloud 26R2 mimarisinde sistem performansını ve uyarılara ilişkin eşik değerlerini değerlendirerek durum güncellemesi yapan zamanlanmış görev (Scheduled Task) hangisidir?

*İpucu:* IFS çekirdek altyapısında izleme eşiklerini kontrol eden scheduled task adını düşünün.

A) Foundation1 Monitoring *
B) Transaction_SYS Cleanup
C) Automatic Database Diagnostic Monitor
D) Oracle Management Agent

**Cevap anahtarı:** A

**Gerekçe (A):** IFS Cloud 26R2 teknik dokümantasyonuna göre Foundation1 Monitoring görevi, sistem eşik limitlerini değerlendirip durum üreten temel arka plan görevidir.

*Etiketler:* chapter-9

## 20. Active Data Guard altyapısında physical standby veritabanının verileri güncel tutarken aynı zamanda salt okunur (read-only) raporlama sorgularına hizmet vermesini sağlayan temel süreç ikilisi hangisidir?

*İpucu:* Yedek veritabanında redo verilerini anlık uygulayan recovery sürecini ve log yapısını hatırlayın.

A) Standby Redo Logs (SRLs) ve Managed Recovery Process (MRP) *
B) Memory Monitor (MMON) ve Process Monitor (PMON)
C) Global Cache Service (LMS) ve Global Enqueue Service (GES)
D) Oracle Management Agent (OMA) ve Listener

**Cevap anahtarı:** A

**Gerekçe (A):** Active Data Guard, Standby Redo Log'lar vasıtasıyla gelen redo verisini Managed Recovery Process (MRP) ile canlı uygulayarak veritabanının okuma amaçlı açık kalmasını sağlar.

*Etiketler:* chapter-10
