---
type: Quiz
title: Oracle Sınavı
description: Teknik Gelişim (Türkçe) dersi için 12 soruluk test.
course: teknik-gelistirim-tr
question_count: 12
pass_mark: 0.7
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/quiz.md
---

# Oracle Sınavı

Toplam 12 soru. Doğru cevaplar `*` ile işaretli seçeneklerdir; gerekçe ve çözüm seçenek altındadır.

## 1. Oracle veritabanı yama yönetimi yaşam döngüsünde Release Update (RU) ile Release Update Revision (RUR) arasındaki temel fark nedir?

*İpucu:* Yama türlerinden birinin yeni işlevsel hata düzeltmeleri sunmadan mevcut sürümün kararlılığını uzatma amacını düşünün.

A) RU; güvenlik güncellemeleri, yüksek değerli hata düzeltmeleri ve kararlılık iyileştirmelerini içeren çeyreklik birikimli yamadır; RUR ise yeni işlevsel hata düzeltmeleri sunmadan mevcut bir RU'nun ömrünü uzatan güvenlik ve regresyon odaklı yamadır. *
B) RU yalnızca güvenlik açıklarını kapatırken, RUR veritabanı ana sürümünü bir üst versiyona yükseltir.
C) RUR çeyreklik olarak yeni özellikler ekler, RU ise yalnızca acil durum yaması (one-off patch) olarak uygulanır.
D) RU ve RUR aynı içeriğe sahiptir; tek fark RU'nun PDB$SEED için, RUR'un ise CDB$ROOT için uygulanmasıdır.

**Cevap anahtarı:** A

**Gerekçe (A):** RU çeyreklik birikimli güncellemeleri sağlarken, RUR yeni işlevsel düzeltme eklemeden mevcut RU sürümünün kararlılığını ve güvenliğini korumak üzere tasarlanmıştır.

## 2. IFS Enterprise Oracle mimarisinde Automatic Storage Management (ASM) disk grubu tasarımında +DATA ve +RECO grupları için önerilen şeritlenme (striping) stratejisi hangisidir?

*İpucu:* Redo log dosyaları ile veri/indeks dosyalarının I/O erişim gereksinimlerini göz önüne alın.

A) +DATA için kaba şeritlenme (coarse-grained striping), +RECO için ince şeritlenme (fine-grained striping). *
B) +DATA için ince şeritlenme (fine-grained striping), +RECO için kaba şeritlenme (coarse-grained striping).
C) Her iki disk grubu için de yalnızca ince şeritlenme (fine-grained striping) uygulanmalıdır.
D) +DATA için şeritlenme tamamen kapatılmalı, +RECO için kaba şeritlenme kullanılmalıdır.

**Cevap anahtarı:** A

**Gerekçe (A):** +DATA kaba şeritlenme ile veri ve indeks dosyalarının I/O başarımını optimize ederken, +RECO ince şeritlenme ile redo ve kurtarma varlıklarını yönetir.

## 3. IFS Cloud 26R2 ortamında arka plan işlerinin (background jobs) temizlik parametreleri ayarlanırken tamamlanmış işler ve Hata (Error) durumundaki işler için önerilen saklama süreleri sırasıyla kaç gündür?

*İpucu:* Çekirdek tabloları hafif tutmak için tamamlanan işlerin kısa sürede, arıza teşhisi için ise hatalı işlerin daha uzun süre saklanması gerektiğini düşünün.

A) Tamamlanmış işler için 7 gün, Hata (Error) durumundaki işler için 180 gün. *
B) Tamamlanmış işler için 30 gün, Hata (Error) durumundaki işler için 90 gün.
C) Tamamlanmış işler için 1 gün, Hata (Error) durumundaki işler için 30 gün.
D) Tamamlanmış işler için 14 gün, Hata (Error) durumundaki işler için 365 gün.

**Cevap anahtarı:** A

**Gerekçe (A):** Tamamlanan işlerin 7 gün tutulması çekirdek tabloları lean tutarken, hatalı işlerin 180 gün saklanması kök neden analizi için yeterli teşhis geçmişi sağlar.

## 4. Oracle High Availability mimarisinde veritabanı örneği (database instance) ile veritabanı (database) arasındaki fark aşağıdakilerden hangisinde doğru tanımlanmıştır?

*İpucu:* Biri sunucu bellek ve süreçlerini, diğeri ise disk üzerindeki kalıcı dosyaları temsil eder.

A) Veritabanı örneği, tek bir düğümde çalışan ve veritabanını istemcilere sunan sunucu süreçleri ve bellek yapıları kümesidir; veritabanı ise kalıcı depolamada bulunan paylaşımlı dosyalar kümesidir. *
B) Veritabanı örneği disktedir, veritabanı ise yalnızca RAM üzerinde çalışan geçici bir süreçtir.
C) Veritabanı örneği PDB$SEED yapısını temsil ederken, veritabanı yalnızca CDB$ROOT konteynerini ifade eder.
D) Veritabanı örneği birden fazla fiziksel kümede ortak paylaşılan depolamadır, veritabanı ise istemci bağlantı havuzudur.

**Cevap anahtarı:** A

**Gerekçe (A):** Veritabanı örneği RAM ve sunucu süreçlerini ifade ederken, veritabanı persistent storage üzerindeki data, index, control ve initialization dosyalarını kapsar.

## 5. Oracle Application Continuity (AC/TAC) ve planlı bakım sürecinde, bağlantı boşaltma (connection draining) konfigürasyonu yapılırken `replay_init_time` parametresi için önerilen değer yaklaşımı nedir?

*İpucu:* Bağlantı boşaltma süresi dolduktan sonra oturumun başarılı bir şekilde yeniden başlatılabilmesi için gereken zaman penceresini düşünün.

A) `replay_init_time` değeri, oturum durumunun korunması ve yeniden yürütme için `drain_timeout` süresinden belirgin şekilde daha uzun (örneğin en az 3 katı) olmalıdır. *
B) `replay_init_time` değeri her zaman `drain_timeout` değerinden tam olarak 10 saniye kısa olmalıdır.
C) `replay_init_time` parametresi yalnızca `failover_type` kapatıldığında sıfır (0) olarak ayarlanmalıdır.
D) `replay_init_time` ve `drain_timeout` parametreleri her zaman birbirine eşit ve maksimum 5 saniye olmalıdır.

**Cevap anahtarı:** A

**Gerekçe (A):** `replay_init_time`, bağlantı kesildikten sonra oturumun yeniden çalıştırılabilmesi için gerekli zaman penceresini tanımlar ve `drain_timeout` süresinden daha uzun tutulmalıdır.

## 6. Oracle Database Backup and Recovery Reference dokümanına göre, RMAN ve Multitenant mimarisi ile ilgili aşağıda verilen ifadelerden hangisi doğrudur?

*İpucu:* Dokümantasyonda PDB türlerinden biriyle ilgili yedekleme kısıtlamasına dair özel bir not bulunmaktadır.

A) Proxy PDB yedeğinin alınması (backing up a proxy PDB) desteklenmemektedir. *
B) Uzaktan ağ üzerinden veri geri yüklenirken `FROM SERVICE` seçeneğinin kullanımı yasaklanmıştır.
C) RMAN `RESTORE` işleminde veri aktarımı sırasında `SET ENCRYPTION` komutu kullanılamaz.
D) Multisection yedek setleri oluşturmak için `SECTION SIZE` parametresi yalnızca yerel disklerde kullanılabilir.

**Cevap anahtarı:** A

**Gerekçe (A):** RMAN mimarisinde proxy PDB yapıları doğrudan yedekleme işlemlerini desteklememektedir.

## 7. Oracle veritabanında Application Continuity mimarisinin temel yapı taşı olan 'Servis' (Service) kavramı hangi yönetimsel birimlerden oluşur?

*İpucu:* Servislerin iş yükünü yönetme, hızlı kurtarma sağlama ve hizmet kalitesi eşiklerini ölçme rollerini hatırlayın.

A) Yönetim birimi (unit for management), kullanılabilirlik birimi (unit for availability) ve performans birimi (unit for performance). *
B) Ağ birimi, disk grubu birimi ve hafıza alanı birimi.
C) Düğüm birimi, dinleyici (listener) birimi ve örnek (instance) birimi.
D) Şema birimi, tablo birimi ve indeks birimi.

**Cevap anahtarı:** A

**Gerekçe (A):** Servisler konum şeffaflığı sağlayan yönetim birimi, bağımsız kurtarma sağlayan kullanılabilirlik birimi ve AWR ile ölçülen performans birimi olarak tanımlanır.

## 8. IFS Cloud "System Performance" ekranında yer alan "Custom Field Runtime Performance Overview" görünümü, sorunlu SQL ifadelerini tespit etmek için varsayılan olarak hangi filtreleme kriterini uygular?

*İpucu:* Özel alanlarla ilgili performans sorunlarını daraltmak için belirlenen saniye cinsinden ortalama yürütme süresi eşiğini hatırlayın.

A) Çalıştırma başına ortalama geçen süresi (average elapsed time per execution) 2 saniyeden büyük olan özel alan sorgularını filtreler. *
B) Yalnızca hard parse sayısı 1000'i geçen ve Shared Pool dışına taşan SQL'leri filtreler.
C) Yalnızca CPU süresi 10 saniyeyi aşan PL/SQL bloklarını filtreler.
D) Sadece `db file sequential read` bekleme olayına takılan sorguları filtreler.

**Cevap anahtarı:** A

**Gerekçe (A):** Ekran, çalıştırma başına ortalama geçen süresi 2 saniyeyi aşan özel alan SQL ifadelerini otomatik olarak öne çıkarır.

## 9. IFS Enterprise Oracle Mimari Standartlarına göre, Maximum Availability Architecture (MAA) Gold ve Platinum katmanlarında hedeflenen RPO (Recovery Point Objective) ve RTO (Recovery Time Objective) değerleri nelerdir?

*İpucu:* Senkron redo taşıma modları ile veritabanı seviyesinde tam koruma ve hızlı felaket kurtarımı hedeflerini göz önüne alın.

A) Sıfır veri kaybı ($RPO = 0$) ve 5 dakikanın altında neredeyse sıfır kesinti süresi ($RTO < 5\text{ dk}$). *
B) $RPO \le 1\text{ saat}$ ve $RTO \le 24\text{ saat}$.
C) $RPO = 24\text{ saat}$ ve $RTO = 0$.
D) $RPO < 5\text{ dk}$ ve $RTO = 0$.

**Cevap anahtarı:** A

**Gerekçe (A):** Gold ve Platinum MAA standartları senkron taşıma ile RPO=0 ve altyapı failover tasarımları ile RTO < 5 dk hedefler.

## 10. IFS Cloud 26R2 mimarisinde, Application Monitoring Metrics (AMM) eşik değerlerini günlük olarak değerlendirerek sistem uyarılarını tetikleyen zamanlanmış görev hangisidir?

*İpucu:* Mimaride altyapının izleme bileşenlerini günlük periyotta çalıştıran temel zamanlanmış görevin adını hatırlayın.

A) Foundation1 Monitoring *
B) Transaction_SYS.Process_All_Pending
C) Batch_Processor_Main
D) AMM_Alert_Evaluator_Task

**Cevap anahtarı:** A

**Gerekçe (A):** Foundation1 Monitoring görevi günlük olarak çalışarak yapılandırılmış uyarı limitlerine göre metrikleri değerlendirir.

## 11. Oracle Real Application Clusters (RAC) mimarisinde, düğümler arasında bellek bloklarının tutarlılığını sağlamak ve kaynakları yönetmek için kullanılan temel mekanizmalar hangileridir?

*İpucu:* RAC düğümlerinin veri bloklarını disk üzerinden okumadan doğrudan birbirlerinin RAM belleğinden aktarmasını sağlayan teknolojiyi düşünün.

A) Cache Fusion, Düşük gecikmeli Interconnect ve Global Resource Directory (GRD). *
B) Automatic Shared Memory Management (ASMM) ve Single Instance Listener.
C) Block Change Tracking (BCT) ve Recovery Catalog.
D) Enterprise Manager Cloud Control ve Database Vault Realm.

**Cevap anahtarı:** A

**Gerekçe (A):** RAC düğümleri Cache Fusion ve Interconnect trafiği üzerinden GRD aracılığıyla bellek bloklarını tutarlı şekilde paylaşır.

## 12. Oracle veritabanı bellek tuning adımlarında, büyük toplu işler (batch runs) sırasında sıralama (sort) ve hash join işlemlerinin geçici tablo alanına (temporary tablespace) taşmasını önlemek için kullanılan parametre hangisidir?

*İpucu:* Süreç başına düşen ve SQL operasyonlarının (sort, hash join) bellekte yürütülmesini sağlayan bellek parametresini düşünün.

A) `pga_aggregate_target` *
B) `sga_target`
C) `open_cursors`
D) `processes`

**Cevap anahtarı:** A

**Gerekçe (A):** `pga_aggregate_target` parametresi, süreç başına bellek tahsisini optimize ederek sort ve hash join operasyonlarının diske taşmasını önler.
