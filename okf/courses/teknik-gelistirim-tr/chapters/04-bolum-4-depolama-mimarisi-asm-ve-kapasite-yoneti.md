---
type: Chapter
title: "Bölüm 4: Depolama Mimarisi, ASM ve Kapasite Yönetimi"
description: Öğrenci, Oracle Automatic Storage Management (ASM) DATA ve RECO disk grubu mimarisini, OLTP yükleri için striping ve redundancy modellerini öğrenir. Veritabanı tablo bölümleme (Range, List, Hash) stra
course: teknik-gelistirim-tr
chapter: 4
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T19:31:19Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Automatic Storage Management (ASM) DATA ve RECO disk grubu mimarisini, OLTP yükleri için striping ve redundancy modellerini öğrenir. Veritabanı tablo bölümleme (Range, List, Hash) stratejileri ve yerel indeks yapılandırmaları ile veri büyümesini ve bölüm bakım operasyonlarını yönetmeyi kavrar. Ayrıca OEM ve DBMS_SERVER_ALERT ile tablespace ve ASM alan eşik değerlerini izleme yeteneği kazanır.

# Sesli Ders

[Bölüm 4 sesli özeti](/audio/teknik-gelistirim-tr/chapter-4.mp3) (5:00 dk, MP3)

# Öğrenme Hedefleri

1. Öğrenci, Oracle ASM üzerinde DATA ve RECO disk gruplarını fine-grained ve coarse-grained şeritlendirme modellerine göre yapılandırabilir.
2. Öğrenci, IFS Cloud veritabanlarında yüksek hacimli işlem tabloları için tablo bölümleme ve yerel indeks stratejilerini uygulayabilir.
3. Öğrenci, DBMS_SERVER_ALERT ve OEM üzerinden tablespace ve ASM disk grubu için yüzde 85 uyarı ve yüzde 95 kritik alan eşiklerini tanımlayabilir.

# Dersler

* Disk Group Architecture (DATA & RECO)
* ASM Striping & Redundancy for OLTP
* Tablespace & ASM Disk Space Thresholds
* Oracle Automatic Storage Management Administrator's Guide

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Seçilen kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

---

### Hedef 1: Oracle ASM Üzerinde DATA ve RECO Disk Gruplarını Fine-Grained ve Coarse-Grained Şeritlendirme Modellerine Göre Yapılandırma

* **Disk Grubu Rolleri ve Depolama Ayrımı:**
  * Oracle Automatic Storage Management (ASM), fiziksel diskleri mantıksal Disk Gruplarına ayırarak veriyi tüm üye diskler üzerinde otomatik olarak dengeler [1, 2].
  * **DATA Disk Grubu:** Aktif veri dosyalarını, indeks tablespace'lerini, sistem tablespace'lerini (SYSTEM, SYSAUX), geçici dosyaları (temporary files) ve online redo log gruplarını depolayan birincil operasyonel depolama alanıdır [2]. IFS Applications (IFS Cloud, IFS Applications 10/9) orta katman işlemlerini yürütmek için yüksek okuma ve yazma IOPS performansına öncelik verir [2].
  * **RECO (veya FRA) Disk Grubu:** Arşiv logları, RMAN yedek kümeleri, kontrol dosyası kopyaları, Flashback logları ve online redo logların çoklanan kopyalarını depolayan adanmış kurtarma depolama alanıdır [2]. Kurtarma dosyalarının izole edilmesi, yedekleme veya arşivleme işlemlerinin DATA grubundaki birincil veri operasyonlarıyla disk bant genişliği yarışına girmesini engeller [2].
* **ASM Şeritlendirme (Striping) Stratejileri:**
  * **Coarse-Grained Striping (Kaba Taneli Şeritlendirme):** Genellikle 1 MB ila 4 MB veya daha büyük Allocation Unit (AU) boyutunu kullanır [1, 2]. Veritabanı veri dosyaları, indeks tablespace'leri, geçici dosyalar ve RMAN yedek kümeleri gibi büyük ve sıralı I/O operasyonları için tasarlanmıştır [1, 2].
  * **Fine-Grained Striping (İnce Taneli Şeritlendirme):** Allocation Unit birimlerini tüm diskler üzerine dağıtılan 128 KB boyutundaki daha küçük şerit kümelerine böler [1, 2]. Online Redo Logs (ORLs), Control Files ve Flashback Logs gibi düşük gecikmeli, küçük boyutlu yazma operasyonları için optimize edilmiştir [1, 2].
* **ASM Yedeklilik (Redundancy) Modelleri:**
  * **External Redundancy:** ASM seviyesinde aynalama yapmaz; veri korumasını tamamen donanım RAID kontrolcülerine veya SAN mimarisine devreder [1, 2].
  * **Normal Redundancy:** ASM Failure Groups arasında 2 yönlü (2-way) aynalama uygular ve en az iki Failure Group gerektirir [1, 2].
  * **High Redundancy:** ASM Failure Groups arasında 3 yönlü (3-way) aynalama uygular ve en az üç Failure Group gerektirir [1, 2]. En yüksek erişilebilirlik gerektiren görev kritik IFS kurulumları için standarttır [1, 2].
* **İnceleme ve Yapılandırma Operasyonları:**
  * Veritabanı yöneticileri (DBA), ASM örneğine (`+ASM`) bağlanarak `V$ASM_FILE` ve `V$ASM_ALIAS` görünümlerinden dosyaların fine veya coarse şeritlendirme durumlarını sorgular [1].
  * Disk grubu şablonları (templates) değiştirilerek yeni oluşturulan online redo log dosyalarının otomatik olarak fine-grained şeritlendirme ve high redundancy alması sağlanabilir [1].
  * ASM disk grubu kapasitesi, Allocation Unit boyutları ve yedeklilik modelleri `V$ASM_DISKGROUP` veya `v$asm_diskgroup` görünümünden doğrulanır [2, 3].
  * Oracle Managed Files (OMF) parametreleri yapılandırılarak veri dosyalarının ve kurtarma varlıklarının otomatik olarak ilgili DATA ve RECO disk gruplarına yönlendirilmesi sağlanır [2].
* **Sürüm Bağlamı:** Resmî Oracle kılavuzu "Oracle Automatic Storage Management Administrator's Guide", bu ASM yönetimi ve disk grubu süreçlerini Release 19c için belgeler [4]. Eğitim programının çalışma notları bu depolama ve şeritlendirme stratejilerini IFS Applications (IFS Cloud, IFS Applications 10/9) iş yüklerine uygular [1, 2].

---

### Hedef 2: IFS Cloud Veritabanlarında Yüksek Hacimli İşlem Tabloları İçin Tablo Bölümleme ve Yerel İndeks Stratejilerini Uygulama

* **Kaynak Kapsamı ve Destek Durumu:** Resmî IFS Cloud teknik dokümantasyonu ("screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-010-planning-installation-010-storage-tier-considerations-010-oracle-db-19c-Oracle-19c-Enterprise-Edition-19c-options-and-feat.pdf"), Oracle Database Options tablosunda Oracle Partitioning seçeneğinin IFS Cloud ile kullanımının desteklendiğini ('Y') belirtmektedir [5].
* **Test Edilen Özellikler:** Resmî doküman, tablo bölümleme (table partitioning) ile küresel ve yerel indeks bölümlerinin (global and local index partitions) IFS Applications 9 & 10 üzerinde test edildiğini ve doğrulandığını ifade etmektedir [5].
* **Ayrıntı Düzeyi:** Seçilen kaynaklar yüksek hacimli işlem tabloları için tablo bölümleme ve yerel indeks stratejilerinin adım adım uygulanmasına dair daha fazla teknik ayrıntı veya özel komut sözdizimi içermemektedir [5]. Kaynaklar bu noktayı kısa ele aldığı için kaynaklarda yer almayan hususlar kapsama dahil edilmemiştir [5].

---

### Hedef 3: DBMS_SERVER_ALERT ve OEM Üzerinden Tablespace ve ASM Disk Grubu İçin Yüzde 85 Uyarı ve Yüzde 95 Kritik Alan Eşiklerini Tanımlama

* **OEM Metrik Eşik Mimarisi:** Oracle Enterprise Manager (OEM) Cloud Control, izlenen hedefleri önceden tanımlanmış depolama sınırlarına göre değerlendirerek kullanım yüzdeleri eşikleri aştığında alarmlar üretir [3].
  * **Uyarı Eşiği (Warning Threshold):** Kapasite kullanımının %85 seviyesine ulaşması durumunda tetiklenir [3]. Veritabanı yöneticilerine büyüyen veri dosyalarını inceleme, eski staging tablolarını temizleme veya rutin bakım pencerelerinde alan genişletme planlama imkanı verir [3].
  * **Kritik Eşik (Critical Threshold):** Kapasite kullanımının %95 seviyesine ulaşması durumunda tetiklenir [3]. Veritabanı duraklamalarını ve aniden alan tükenmesi nedeniyle oluşacak kesintileri önlemek için acil idari müdahale gerektiğini gösterir [3].
* **Tablespace ve ASM Disk Grubu Uyarı Ayrımı:**
  * **Tablespace Eşikleri:** Bireysel veri dosyaları ile CDB/PDB konteyner veritabanları içindeki mantıksal alan tahsisini izler [3].
  * **ASM Disk Group Eşikleri:** DATA ve RECO gibi paylaşılan depolama havuzlarındaki fiziksel diskler ve Failure Group'lar genelindeki fiziksel boş alanı izler [3].
* **DBMS_SERVER_ALERT Paketi İle Programatik Yapılandırma:**
  * `DBMS_SERVER_ALERT.SET_THRESHOLD` yordamı çalıştırılarak `metric_id => DBMS_SERVER_ALERT.TABLESPACE_SPACE_USAGE`, `warning_operator => DBMS_SERVER_ALERT.OPERATOR_GE`, `warning_value => '85'`, `critical_operator => DBMS_SERVER_ALERT.OPERATOR_GE`, `critical_value => '95'`, `observation_period => 1`, `consecutive_occurrences => 1`, `dbobject_type => 'TABLESPACE'` ve `dbobject_name => 'USERS'` parametreleriyle %85 uyarı ve %95 kritik eşikleri tanımlanır [3].
  * Yapılandırılan eşik ayarları `DBA_THRESHOLDS` veri sözlüğü görünümünden (`SELECT metric_name, object_name, warning_value, critical_value FROM dba_thresholds WHERE metric_name LIKE '%Space Used%';`) sorgulanarak doğrulanır [3].
* **ASM Disk Grubu Kullanımının `v$asm_diskgroup` İle İzlenmesi:**
  * Veritabanı yöneticileri ASM örneğine (`+ASM`) bağlanarak `v$asm_diskgroup` görünümünden (`SELECT name, total_mb / 1024 AS total_gb, free_mb / 1024 AS free_gb, ROUND((1 - (free_mb / total_mb)) * 100, 2) AS used_percent FROM v$asm_diskgroup;`) DATA ve RECO disk gruplarının toplam kapasitesini, boş alanını ve yüzde kullanım oranını sorgular [3].
* **Sürüm Bağlamı:** Eğitim programının çalışma notları bu alan eşiği uyarılarını IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarındaki ERP, EAM ve FSM yüklerine uygular [3]. Kaynaklar `DBMS_SERVER_ALERT` paketi ve eşik yapılandırması için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [3].

---

💡 **Sonraki Adımlar:** Studio paneline eklenen **IFS Cloud ASM Depolama ve Kapasite Yönetimi** sesli özetini dinlemek veya **Oracle Storage** uygulamasındaki soruları çözerek bilginizi pekiştirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `1b04476c-4a75-4cff-b885-92515534b16e`
* NotebookLM kaynağı `f793ad75-751e-4c83-8ca8-28d381bab07b`
* NotebookLM kaynağı `864e9db2-d8b7-49d5-ba58-f597500b415f`
* NotebookLM kaynağı `667e3b8a-819a-4cdf-ae3c-94d88a2cbcbb`
* NotebookLM kaynağı `2bbb340b-2864-4e94-9a73-76eeaa5eafa5`
