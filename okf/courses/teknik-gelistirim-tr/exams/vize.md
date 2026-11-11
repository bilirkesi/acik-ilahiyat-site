---
type: Exam
title: Ara Sınav
description: Programın ilk yarısını kapsar.
course: teknik-gelistirim-tr
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: vize
exam_window: midterm
exam_type: vize
question_count: 20
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/exams/vize.md
---

# Ara Sınav

Ders: Teknik Gelişim (Türkçe) · TEK · 2026-2027 Güz. Toplam 20 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. Oracle Multitenant mimarisinde ortak arka plan süreçlerini, paylaşılan sistem meta verilerini ve küresel bellek alanını yönetmekle yükümlü temel kapsayıcı aşağıdakilerden hangisidir?

*İpucu:* Sistem düzeyindeki ortak kaynakları yöneten en üst seviyedeki kök konteyner yapısını düşünün.

A) CDB$ROOT *
B) PDB$SEED
C) User PDB
D) RECO Disk Group

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle Multitenant mimarisinde CDB$ROOT, tüm sistem meta verilerini, ortak kullanıcıları ve küresel bellek yapısını barındıran kök kapsayıcıdır.

*Etiketler:* chapter-1

## 2. Oracle patching stratejisinde, mevcut bir RU sürümüne yalnızca kritik güvenlik ve regresyon düzeltmelerini ekleyen, yeni fonksiyonel hata düzeltmeleri içermeyen ve ikincil sürüm numarasını değiştirmeden revizyon hanesini artıran yama türü hangisidir?

*İpucu:* Üretim ortamlarında kararlılığı korumak adına yeni işlevsellik eklemeden sadece güvenlik düzeltmelerine odaklanan revizyon modelini dikkate alın.

A) Release Update Revision (RUR) *
B) Release Update (RU)
C) One-Off Patch
D) Major Release Patch

**Cevap anahtarı:** A

**Gerekçe (A):** RUR, mevcut bir RU'nun ömrünü uzatarak geniş kapsamlı kod değişiklikleri riski almadan kritik güvenlik güncellemelerini sağlar.

*Etiketler:* chapter-1

## 3. ASM striping stratejilerinde Fine-Grained (ince taneli) şeritlenme ile ilgili verilen ifadelerden hangisi doğrudur?

*İpucu:* Online Redo Log ve Control File gibi hızlı ve küçük yazma gerektiren dosyaların şerit kümesi boyutunu hatırlayın.

A) Tahsis Birimlerini (AU) 128 KB'lık alt kümelere bölerek düşük gecikmeli hızlı yazma işlemlerini optimize eder. *
B) Veritabanı veri dosyaları ve RMAN yedek setleri gibi büyük sıralı I/O işlemleri için 1 MB ile 4 MB arası tam AU kullanır.
C) Verileri disklere şeritlemek yerine sadece harici SAN donanımının RAID 10 yapılandırmasına güvenir.
D) Yalnızca geçici (TEMP) tabloların bellekten diske taşınması sırasında tetiklenir.

**Cevap anahtarı:** A

**Gerekçe (A):** Fine-Grained striping, AU birimlerini 128 KB şeritlere bölerek Online Redo Log gibi küçük payload'lu yazma gecikmesini düşürür.

*Etiketler:* chapter-1

## 4. Oracle ASM'de kritik IFS kurulumlarında maksimum erişilebilirlik sağlamak amacıyla kullanılan High Redundancy (Yüksek Kesintisizlik) modeli için gereken minimum Failure Group (Başarısızlık Grubu) sayısı kaçtır?

*İpucu:* 3 yönlü (3-way) aynalama mekanizmasının gerektirdiği minimum bağımsız grup sayısını düşünün.

A) 3 *
B) 2
C) 1
D) 5

**Cevap anahtarı:** A

**Gerekçe (A):** High Redundancy modeli 3 yönlü aynalama (3-way mirroring) uyguladığından en az 3 adet Failure Group gerektirir.

*Etiketler:* chapter-1

## 5. Oracle RAC aktif-aktif kümeleme mimarisinde, veritabanı bloklarının disk seviyesine yazılmasına gerek kalmadan düğümler (nodes) arasında özel yüksek hızlı ağ üzerinden doğrudan aktarılmasını sağlayan teknoloji hangisidir?

*İpucu:* Düğümler arası özel Interconnect ağı üzerinden gerçekleşen bellekten belleğe blok transfer teknolojisini hatırlayın.

A) Cache Fusion *
B) Automatic Storage Management (ASM)
C) Global Resource Directory (GRD)
D) Fast Connection Failover (FCF)

**Cevap anahtarı:** A

**Gerekçe (A):** Cache Fusion, bellek bloklarını Interconnect ağı üzerinden aktif RAC düğümleri arasında doğrudan transfer ederek bellek tutarlılığını sağlar.

*Etiketler:* chapter-1

## 6. Oracle RAC ortamında tüm aktif düğümlerdeki önbelleğe alınmış veri bloklarının durumunu, konumunu ve kilit (lock) bilgilerini anlık olarak takip eden bileşen hangisidir?

*İpucu:* Aktif düğümlerde önbelleğe alınan blokların dağıtık kilit ve konum haritasını tutan küresel dizin yapısını düşünün.

A) Global Resource Directory (GRD) *
B) Shared Global Area (SGA)
C) Memory Monitor (MMON)
D) Grid Infrastructure

**Cevap anahtarı:** A

**Gerekçe (A):** GRD, RAC kümesinde tutarsız veri okumalarını önlemek ve blok kilitlerini yönetmek için tüm önbellek kaynaklarının durumunu izler.

*Etiketler:* chapter-1

## 7. Veritabanı bellek mimarisi yönetiminde sga_target ve pga_aggregate_target parametrelerinin kapsadığı bellek alanları ile ilgili hangi ifade doğrudur?

*İpucu:* Paylaşılan örnek (instance) önbelleği ile oturumlara özel sıralama/join alanlarının farkını değerlendirin.

A) sga_target paylaşılan Buffer Cache ve Shared Pool alanlarını dinamik yönetirken, pga_aggregate_target her bir oturum sürecinin sıralama ve hash birleştirme alanlarını sınırlar. *
B) sga_target yalnızca sıralama (ORDER BY) işlemlerini yönetirken, pga_aggregate_target veri sözlüğü önbelleğini (Data Dictionary Cache) kapsar.
C) Her iki parametre de PDB düzeyinde salt okunur olup değiştirilemez.
D) pga_aggregate_target tüm RAC düğümleri arasında ortak kullanılan paylaşımlı önbellektir.

**Cevap anahtarı:** A

**Gerekçe (A):** ASMM altında sga_target paylaşılan SGA havuzlarını otomatik dengelerken, pga_aggregate_target süreç bazlı özel çalışma alanlarının toplam sınırını belirler.

*Etiketler:* chapter-1

## 8. Paylaşımlı bir multitenant veritabanında, test veya geliştirme PDB'lerinin runaway sorgular çalıştırarak ana sunucudaki bellek kaynaklarını tükenme noktasına getirmesini engellemek için PDB düzeyinde hangi komutlar kullanılabilir?

*İpucu:* PDB bağlamına geçtikten sonra bellek üst limitlerini sınırlamak için kullanılan dinamik ALTER SYSTEM parametrelerini hatırlayın.

A) ALTER SYSTEM SET pga_aggregate_limit ve sga_target komutları ile ilgili PDB bağlamında bellek sınırları tanımlanabilir. *
B) ALTER DATABASE TRUNCATE FLASHBACK LOGS komutu koşturulmalıdır.
C) PDB düzeyinde bellek parametreleri değiştirilemez, sınırlar yalnızca CDB$ROOT içindeki SPFILE üzerinden atanır.
D) ALTER DISKGROUP DATA REBALANCE komutu çalıştırılmalıdır.

**Cevap anahtarı:** A

**Gerekçe (A):** PDB bağlamına geçilerek bu parametreler ayarlandığında, ilgili PDB'nin tüketebileceği maksimum bellek miktarı sınırlandırılmış olur.

*Etiketler:* chapter-2

## 9. Oracle ASM disk grubu mimarisinde DATA ve RECO disk gruplarının iş yükü ayrımı ile ilgili aşağıdakilerden hangisi yanlıştır?

*İpucu:* Kurtarma (Recovery) odaklı dosyalar ile birincil operasyonel veri dosyalarının hangi disk grubunda tutulduğuna dikkat edin.

A) RECO disk grubu aktif veritabanı veri dosyalarını (Data Files) ve varsayılan TEMP tablolarını barındırmakla yükümlüdür. *
B) DATA disk grubu aktif veri dosyalarını, indeks tablolarını ve sistem (SYSTEM, SYSAUX) alanlarını tutar.
C) RECO disk grubu Archive Log, Flashback Log ve RMAN yedek setlerini barındırır.
D) Online Redo Log dosyalarının çoklamaları (multiplexed copies) RECO disk grubuna yerleştirilebilir.

**Cevap anahtarı:** A

**Gerekçe (A):** Aktif veritabanı veri dosyaları ve geçici dosyalar (TEMP) RECO grubunda değil, yüksek I/O performanslı DATA disk grubunda tutulur.

*Etiketler:* chapter-2

## 10. Active Session History (ASH) mimarisi ve bellek yönetimi hakkında verilen bilgilerden hangisi doğrudur?

*İpucu:* ASH'ın saniyelik bellek örnekleme mekanizmasını ve bu verileri diske aktaran arka plan sürecini düşünün.

A) ASH, aktif oturumları saniyede bir SGA bellek halka arabelleğine (ring buffer) örnekler ve MMON süreci bu verileri belirli aralıklarla diskteki AWR tablolarına aktarır. *
B) ASH verileri yalnızca saatlik snapshot alındığında toplanır ve doğrudan disk üzerindeki tablolara yazılır.
C) Active Session History verilerini diske aktarma görevini PMON işlemi gerçekleştirir.
D) ASH verilerine yalnızca veritabanı kapatılıp açıldıktan sonra V$ACTIVE_SESSION_HISTORY üzerinden erişilebilir.

**Cevap anahtarı:** A

**Gerekçe (A):** ASH saniyelik örnekleme yaparak kısa süreli darboğazları yakalar; MMON arka plan süreci verileri dba_hist_active_sess_history tablolarına aktarır.

*Etiketler:* chapter-2

## 11. Veritabanı izleme sürecinde 'db file sequential read' bekleme olayı (wait event) yüksek çıktığında yapılan teknik analiz ile ilgili hangisi doğrudur?

*İpucu:* Adı 'sequential' olsa da tekil blok okumasını ifade eden bu bekleme olayının verimsiz/seçici olmayan B-Tree indeks kullanımındaki etkisini hatırlayın.

A) B-Tree indeksi kullanılmasına rağmen sorgunun filtreleme oranının düşük (seçici olmayan) olması sonucu diskten tekil blok okumalarının aşırı çoğaldığını gösterebilir. *
B) Sorgunun hiçbir indeks kullanmayarak tabloyu baştan sona sıralı olarak toplu bloklar halinde (Full Table Scan) okuduğunu garanti eder.
C) Bellek havuzunda (Buffer Cache) yer kalmadığı için doğrudan Temp tablolarına yazma yapıldığını ifade eder.
D) Redo Log dosyalarının disk grubuna yazılması esnasında oluşan I/O tıkanıklığını belirtir.

**Cevap anahtarı:** A

**Gerekçe (A):** Seçici olmayan (unselective) indeks kullanımında Oracle binlerce kez tekil blok okumak zorunda kalarak Full Table Scan'den daha büyük bir I/O yükü yaratır.

*Etiketler:* chapter-2

## 12. Full Table Scan veya Fast Full Index Scan operasyonları yürütülürken çoklu blok okumaları sebebiyle ortaya çıkan temel veritabanı bekleme olayı aşağıdakilerden hangisidir?

*İpucu:* Blokların bellekte dağınık alanlara toplu halde okunmasını ifade eden bekleme olayı ismini hatırlayın.

A) db file scattered read *
B) db file sequential read
C) direct path read
D) latch: shared pool

**Cevap anahtarı:** A

**Gerekçe (A):** db file scattered read, diskten belleğe ardışık olmayan blokların toplu olarak okunduğu Full Table Scan durumlarında oluşur.

*Etiketler:* chapter-3

## 13. Zamana bağlı olarak hızla büyüyen IFS müşteri siparişleri veya denetim (audit) logları gibi tarih serisi içeren büyük tablo verilerini organize etmek için hangi bölümleme (partitioning) yöntemi en uygundur?

*İpucu:* Belirli takvim çeyrekleri veya tarih aralıklarına göre veriyi bölümlendiren yöntemi düşünün.

A) Range Partitioning *
B) List Partitioning
C) Hash Partitioning
D) Composite System Partitioning

**Cevap anahtarı:** A

**Gerekçe (A):** Range Partitioning, tarih veya zaman damgası aralıklarına göre verileri bölümlendirerek tarih bazlı sorgularda partition pruning sağlar.

*Etiketler:* chapter-3

## 14. Tablo bölümleme (Table Partitioning) mimarisinde Local Index ile Global Index arasındaki farklar değerlendirildiğinde aşağıdakilerden hangisi doğrudur?

*İpucu:* Tablo bölümleriyle aynı hiyerarşide oluşturulan ve bölüm bakım operasyonlarında tüm indeksi rebuild etme zorunluluğunu ortadan kaldıran indeks türünü düşünün.

A) Local Index'ler tablonun bölüm yapısıyla birebir uyumlu olarak otomatik bölümleme yapar; tablo bölümü silindiğinde indeks ağacını tamamen bozmadan güncellenir. *
B) Global Index'ler tabloya yeni bölüm eklendiğinde kendiliğinden otomatik olarak o bölüme özel parçalanır.
C) Local Index kullanımı durumunda partition pruning yapılması imkansızdır.
D) Global Index silindiğinde tablodaki veriler de kalıcı olarak silinir.

**Cevap anahtarı:** A

**Gerekçe (A):** Local Index her tablo bölümü için ayrı bir indeks bölümü oluşturduğundan bölüm bakım operasyonlarında (PMO) kolaylık sağlar.

*Etiketler:* chapter-3

## 15. ASM Coarse-Grained (kaba taneli) şeritlenme stratejisinin hedef dosya türleri arasında aşağıdakilerden hangisi yer almaz?

*İpucu:* 128 KB'lık alt birimlere bölünen Fine-Grained şeritlenmeyi zorunlu kılan düşük gecikmeli log dosya türünü hatırlayın.

A) Online Redo Logs (ORLs) *
B) Database Data Files
C) Temporary Files
D) RMAN Backup Sets

**Cevap anahtarı:** A

**Gerekçe (A):** Online Redo Log dosyaları düşük gecikmeli küçük yazma operasyonları gerektirdiğinden Fine-Grained striping kullanır.

*Etiketler:* chapter-3

## 16. Oracle RAC mimarisinde tüm veritabanı düğümlerinin (instances) aynı veri dosyalarına, kontrol dosyalarına ve redo log dosyalarına erişebilmesini sağlayan temel depolama mimarisi konsepti nedir?

*İpucu:* Tüm RAC düğümlerinin aynı paylaşımlı veritabanı dosyalarını okuyup yazabildiği mimari yaklaşımı tanımlayın.

A) Shared Everything Architecture *
B) Shared Nothing Architecture
C) Active-Passive Storage Replication
D) Distributed Local File System

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle RAC shared-everything mimarisi kullanır; küme genelindeki tüm örnekler ASM üzerindeki ortak disklere erişebilir.

*Etiketler:* chapter-4

## 17. IFS ERP canlı (PROD) ortamlarında veritabanı patch güncellemesi yapılırken RU yerine RUR (Release Update Revision) tercih edilmesinin temel işletimsel sebebi nedir?

*İpucu:* Üretim ortamlarında geniş kapsamlı işlevsel kod değişikliklerinden kaçınarak kararlılığı koruma hedefini değerlendirin.

A) Yeni fonksiyonel kod değişikliklerinin getirebileceği çalışma planı (execution plan) değişim riskini almadan sadece kritik güvenlik ve regresyon düzeltmelerini uygulamak. *
B) RUR uygulandığında veritabanının yeniden başlatılmasına (restart) gerek kalmaması.
C) RUR paketlerinin yalnızca geliştirme (DEV) ortamlarında çalışacak şekilde tasarlanmış olması.
D) RUR sürümlerinin veritabanı minor versiyon numarasını yükseltmesi.

**Cevap anahtarı:** A

**Gerekçe (A):** RUR, yeni fonksiyonel kod geliştirmelerini hariç tutarak mevcut RU versiyonunu korur ve canlı sistemde çalışma planı sapmalarını engeller.

*Etiketler:* chapter-4

## 18. Oracle Multitenant ortamında tek bir Pluggable Database (PDB) üzerinde yürütülen bir bakım işlemi ile ilgili hangisi doğrudur?

*İpucu:* Multitenant yapısının sağladığı bağımsız PDB yaşam döngüsü yönetimini düşünün.

A) Diğer kardeş PDB'lerin (sibling PDBs) çalışmasını kesintiye uğratmadan hedef PDB takıp çıkarılabilir (unplug), klonlanabilir veya kapatılabilir. *
B) Bir PDB kapatıldığında (offline yapıldığında) aynı CDB$ROOT altındaki tüm PDB'ler otomatik olarak kapanır.
C) PDB klonlama işlemi yapılabilmesi için tüm CDB$ROOT bileşenlerinin salt okunur moda alınması şarttır.
D) PDB silindiğinde (DROP PDB) PDB$SEED şablonu da sistemden kaldırılır.

**Cevap anahtarı:** A

**Gerekçe (A):** PDB izolasyonu sayesinde her PDB bağımsız bir yaşam döngüsüne sahiptir ve kardeş PDB'leri etkilemeden yönetilebilir.

*Etiketler:* chapter-4

## 19. Bir veritabanı yöneticisi, ASM disk grubu şablonlarını (templates) değiştirerek yeni oluşturulacak Online Redo Log ve Flashback Log dosyalarının otomatik olarak almasını istediği şeritlenme ve aynalama yapılandırması aşağıdakilerden hangisidir?

*İpucu:* Hızlı, düşük gecikmeli yazma gerektiren dosyaların kullandığı 128 KB şeritlenme ve 3 yönlü aynalama birleşimini düşünün.

A) Fine-Grained Striping & High Redundancy *
B) Coarse-Grained Striping & External Redundancy
C) Fine-Grained Striping & No Redundancy
D) Coarse-Grained Striping & High Redundancy

**Cevap anahtarı:** A

**Gerekçe (A):** Düşük gecikmeli hızlı yazma gerektiren redo ve flashback logları için Fine-Grained striping ve maksimum erişilebilirlik için High Redundancy şablonu seçilir.

*Etiketler:* chapter-4

## 20. Memory Monitor (MMON) arka plan sürecinin Active Session History (ASH) verileri üzerindeki temel görevi nedir?

*İpucu:* Bellekteki geçici izleme verilerini disk tablolarına yazan süreci hatırlayın.

A) SGA belleğindeki (ring buffer) saniyelik ASH verilerini periyodik olarak disk üzerindeki AWR tablolarına (wrh$_active_session_history) aktarmak. *
B) Çöken veritabanı oturumlarının kilitlediği bellek kaynaklarını (locks) temizlemek.
C) RAC düğümleri arasındaki Interconnect ağ trafiğini şifrelemek.
D) Online Redo Log dosyalarını RECO disk grubuna arşivlemek.

**Cevap anahtarı:** A

**Gerekçe (A):** MMON süreci, geçici bellek içi ASH örneklerini kalıcı AWR disk tablolarına yazarak geçmişe dönük analize imkan tanır.

*Etiketler:* chapter-5
