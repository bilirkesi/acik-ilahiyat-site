---
type: Quiz
title: "Ünite 4 quizi: Bölüm 4: Depolama Mimarisi, ASM ve Kapasite Yönetimi"
description: Teknik Gelişim (Türkçe) 4. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 4
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-4.md
---

# Ünite 4: Bölüm 4: Depolama Mimarisi, ASM ve Kapasite Yönetimi

Toplam 12 soru.

## 1. Oracle ASM mimarisinde coarse-grained striping (kaba taneli şeritlenme) stratejisinin hedeflendiği veri varlıkları aşağıdakilerden hangisidir?

*İpucu:* Büyük ve sıralı I/O erişim modeline sahip depolama bileşenlerini düşünün.

A) Online Redo Log (ORL), Control File ve Flashback Log
B) Veritabanı veri dosyaları, indeks tablo alanları, geçici dosyalar ve RMAN yedek setleri *
C) Sadece işletim sistemi swap alanları ve audit izleme dosyaları
D) Yalnızca multiplexed online redo log kopyaları

**Cevap anahtarı:** B

**Gerekçe (B):** Coarse-grained striping, büyük ve sıralı I/O işlemlerinde bitişik veri bloklarını okuyup yazarak sıralı bant genişliğini maksimuma çıkarmak için tasarlanmıştır.

## 2. Fine-grained striping (ince taneli şeritlenme) uygulamasında Allocation Unit (AU) verileri kaç KB'lık şerit setlerine bölünerek disklere dağıtılır?

*İpucu:* Düşük gecikmeli, küçük boyutlu yazma operasyonları için kullanılan standart alt bölüm boyutunu hatırlayın.

A) 1 MB
B) 512 KB
C) 128 KB *
D) 64 KB

**Cevap anahtarı:** C

**Gerekçe (C):** Fine-grained striping, Allocation Unit yapılarını 128 KB boyutundaki şerit setlerine bölerek hızlı ve eş zamanlı yazma gecikmesini en aza indirir.

## 3. Mission-critical IFS kurulumlarında maksimum kullanılabilirlik sağlamak için önerilen High Redundancy (Yüksek Yedeklilik) modeli kaç yönlü aynalama yapar ve en az kaç Failure Group gerektirir?

*İpucu:* En yüksek veri güvenliği sağlayan üçlü koruma yapısını göz önüne alın.

A) 4 yönlü aynalama, en az 4 Failure Group
B) 3 yönlü aynalama, en az 3 Failure Group *
C) 2 yönlü aynalama, en az 2 Failure Group
D) Aynalama yapılmaz, en az 1 Failure Group

**Cevap anahtarı:** B

**Gerekçe (B):** High Redundancy modeli verileri 3 yönlü (3-way) aynalar ve tekil disk veya dizi arızalarına karşı en az üç farklı Failure Group bulunmasını zorunlu kılar.

## 4. ASM mimarisinde DATA disk grubunun üstlendiği temel rol aşağıdakilerden hangisidir?

*İpucu:* Canlı veritabanı işlemlerinin gereksinim duyduğu birincil depolama bileşenlerini düşünün.

A) Sadece Flashback logları ve kontrol dosyası kopyalarını saklayan felaket kurtarma havuzudur.
B) Yalnızca Oracle Enterprise Manager (OEM) log verilerini tutan geçici alandır.
C) Sadece arşiv logları ve RMAN yedek setlerini depolayan ikincil alandır.
D) Aktif veri dosyalarını, indeks tablo alanlarını, SYSTEM/SYSAUX alanlarını, geçici dosyaları ve online redo log gruplarını barındıran birincil operasyonel alandır. *

**Cevap anahtarı:** D

**Gerekçe (D):** DATA disk grubu canlı IFS işlemlerini desteklemek amacıyla yüksek okuma/yazma IOPS performansı sunan ana operasyonel depolama havuzudur.

## 5. RECO (veya FRA) disk grubunun veri mimarisindeki temel amacı aşağıdakilerden hangisidir?

*İpucu:* Yedekleme ve kurtarma operasyonlarının birincil veri trafiğinden ayrılması gerekçesini hatırlayın.

A) Canlı veritabanı tablolarının okuma performansını artırmak için önbellekleme yapmak
B) ASM failure group yapılandırmasını tamamen devre dışı bırakmak
C) Kurtarma trafiğini izole ederek yedekleme ve arşivleme operasyonlarının ana veri I/O bant genişliğiyle yarışmasını önlemek *
D) Geçici (TEMP) veritabanı tablolarını ana veriden ayırarak disk şişmesini engellemek

**Cevap anahtarı:** C

**Gerekçe (C):** RECO; arşiv logları, RMAN yedekleri, Flashback logları ve multiplexed redo log kopyalarını ayrı tutarak ana transactional disk performansını korur.

## 6. Oracle Enterprise Manager (OEM) ortamında depolama kapasitesi yönetimi için tanımlanan Uyarı (Warning) ve Kritik (Critical) varsayılan eşik değerleri yüzde kaçtır?

*İpucu:* Erken müdahale imkanı tanıyan ilk uyarı yüzdesini ve acil müdahale gerektiren son sınır değerini hatırlayın.

A) %85 Uyarı / %95 Kritik *
B) %80 Uyarı / %90 Kritik
C) %90 Uyarı / %99 Kritik
D) %75 Uyarı / %85 Kritik

**Cevap anahtarı:** A

**Gerekçe (A):** OEM mimarisinde %85 doluluk inceleme/planlama gerektiren Uyarı seviyesini, %95 doluluk ise acil müdahale gerektiren Kritik seviyeyi temsil eder.

## 7. Veritabanı yöneticileri bir ASM örneğinde (`+ASM`) veri dosyalarının fine-grained veya coarse-grained şeritlenme durumunu denetlemek için hangi veri sözlüğü görünümlerini sorgular?

*İpucu:* Doğrudan ASM instance üzerinde yer alan ve dosya ile takma ad bilgilerini saklayan dynamic performance görünümlerini düşünün.

A) V$ASM_FILE ve V$ASM_ALIAS *
B) V$INSTANCE ve V$DATABASE
C) DBA_TABLESPACES ve DBA_DATA_FILES
D) V$SESSION ve V$PROCESS

**Cevap anahtarı:** A

**Gerekçe (A):** ASM örneğine bağlı DBAs, dosya düzeyinde şeritlenme niteliklerini ve alias yapılarını doğrulamak için V$ASM_FILE ve V$ASM_ALIAS görünümlerini kullanır.

## 8. Tablespace alan eşik uyarıları ile ASM Disk Group alan eşik uyarıları arasındaki temel izleme odağı farkı nedir?

*İpucu:* Mantıksal veritabanı nesne sınırları ile fiziksel depolama havuzları arasındaki ayrımı düşünün.

A) Tablespace eşikleri veri dosyaları ve CDB/PDB içindeki mantıksal alan kullanımını; ASM Disk Group eşikleri ise DATA ve RECO gibi havuzlardaki fiziksel boş alanı izler. *
B) Tablespace eşikleri yalnızca geçici (TEMP) alanları izler, diğer yapılar ASM Disk Group tarafından yönetilir.
C) Tablespace eşikleri yalnızca RMAN yedeklerini; ASM Disk Group eşikleri ise sadece online redo logları denetler.
D) Tablespace eşikleri physical diskleri izlerken, ASM Disk Group eşikleri mantıksal tabloları izler.

**Cevap anahtarı:** A

**Gerekçe (A):** Tablespace uyarıları mantıksal veri alanı doluluğunu kontrol ederken, ASM uyarıları fiziksel disklerin ve failure group'ların toplam kapasitesini izler.

## 9. `DBMS_SERVER_ALERT.SET_THRESHOLD` prosedürü kullanılarak bir tablo alanı için alan kullanım eşikleri ayarlanırken `metric_id` parametresine hangi değer atanmalıdır?

*İpucu:* Tablo alanı düzeyindeki mantıksal alan kullanımını ifade eden metrik adını hatırlayın.

A) DBMS_SERVER_ALERT.TABLESPACE_SPACE_USAGE *
B) DBMS_SERVER_ALERT.DATAFILE_WRITE_TIME
C) DBMS_SERVER_ALERT.ASM_DISKGROUP_FREE_SPACE
D) DBMS_SERVER_ALERT.DATABASE_RECOVERY_USAGE

**Cevap anahtarı:** A

**Gerekçe (A):** Tablo alanı seviyesindeki mantıksal alan kullanım oranını programatik olarak yapılandırmak için bu metrik sabiti kullanılır.

## 10. Bir ASM örneğinde (`+ASM`) `DATA` ve `RECO` disk gruplarının toplam kapasitesini, boş alanını ve yüzde kullanım oranını hesaplamak için hangi dinamik performans görünümü sorgulanmalıdır?

*İpucu:* Disk gruplarının genel boyut ve boş alan metriklerini tutan ASM görünümünü düşünün.

A) V$ASM_DISKGROUP *
B) V$ASM_TEMPLATE
C) V$ASM_FILE
D) DBA_THRESHOLDS

**Cevap anahtarı:** A

**Gerekçe (A):** V$ASM_DISKGROUP görünümü; total_mb, free_mb ve disk grubu adı gibi temel kapasite metriklerini sorgulamak için kullanılır.

## 11. ASM External Redundancy (Dış Yedeklilik) modeli seçildiğinde veri koruması nasıl sağlanır?

*İpucu:* Aynalamanın ASM yazılımı yerine dış donanım denetleyicilerine bırakıldığı modeli düşünün.

A) ASM içinde hiçbir aynalama yapılmayıp, veri koruması tamamen altta yatan kurumsal SAN donanımına veya RAID denetleyicilerine (ör. RAID 10) devredilerek *
B) Veriler sadece RMAN ile yedeklenerek, disk seviyesinde koruma tamamen devreden çıkarılarak
C) ASM seviyesinde 2 yönlü otomatik aynalama yapılarak
D) ASM seviyesinde 3 yönlü otomatik aynalama yapılarak

**Cevap anahtarı:** A

**Gerekçe (A):** External Redundancy modelinde ASM yazılımsal aynalama yapmaz, veri güvenliğini donanım katmanındaki RAID/SAN yapılandırmasına bırakır.

## 12. Yeni oluşturulacak online redo log dosyalarının otomatik olarak fine-grained striping ve high redundancy özelliklerini almasını zorunlu kılmak için veritabanı yöneticisi hangi ASM yapısını değiştirmelidir?

*İpucu:* Yeni oluşturulan ASM dosyalarına varsayılan nitelikler atayan kural kümesini hatırlayın.

A) Disk Grubu Şablonları (Disk Group Templates) *
B) Coarse-Grained AU Boyutu Parametresi
C) V$ASM_ALIAS Görünümü
D) DBMS_SERVER_ALERT Paketi

**Cevap anahtarı:** A

**Gerekçe (A):** DBA'ler disk grubu şablonlarını (templates) alter ederek yeni oluşturulacak online redo log'ların otomatik olarak fine-grained ve high redundancy nitelikleriyle yaratılmasını sağlar.
