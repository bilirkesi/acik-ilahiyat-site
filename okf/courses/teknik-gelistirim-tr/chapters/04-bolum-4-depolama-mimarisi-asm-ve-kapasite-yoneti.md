---
type: Chapter
title: "Bölüm 4: Depolama Mimarisi, ASM ve Kapasite Yönetimi"
description: Öğrenci, Oracle Automatic Storage Management (ASM) DATA ve RECO disk grubu mimarisini, OLTP yükleri için striping ve redundancy modellerini öğrenir. Veritabanı tablo bölümleme (Range, List, Hash) stra
course: teknik-gelistirim-tr
chapter: 4
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Automatic Storage Management (ASM) DATA ve RECO disk grubu mimarisini, OLTP yükleri için striping ve redundancy modellerini öğrenir. Veritabanı tablo bölümleme (Range, List, Hash) stratejileri ve yerel indeks yapılandırmaları ile veri büyümesini ve bölüm bakım operasyonlarını yönetmeyi kavrar. Ayrıca OEM ve DBMS_SERVER_ALERT ile tablespace ve ASM alan eşik değerlerini izleme yeteneği kazanır.

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

Seçili kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

### Hedef 1: Oracle ASM Üzerinde DATA ve RECO Disk Gruplarını Fine-Grained ve Coarse-Grained Şeritlendirme Modellerine Göre Yapılandırma

* **Disk Grupları ve Özel Roller:** Oracle Automatic Storage Management (ASM), fiziksel diskleri mantıksal Disk Gruplarına (Disk Groups) ayırarak veriyi tüm üye diskler arasında dinamik olarak dağıtır [1, 2].
  * **DATA Disk Grubu:** Aktif veri dosyalarını (data files), indeks tablespace'lerini, sistem tablespace'lerini (SYSTEM, SYSAUX), geçici dosyaları (temporary files) ve online redo log gruplarını (online redo log groups) barındıran birincil operasyonel depolama alanıdır [1, 2]. IFS mid-tier işlemlerini işlemek için yüksek okuma/yazma IOPS performansına öncelik verir [1, 2].
  * **RECO Disk Grubu:** Arşiv logları (archive logs), RMAN yedek kümelerini (RMAN backup sets), kontrol dosyası kopyalarını (control file copies), Flashback loglarını ve online redo logların çoklanan kopyalarını depolayan adanmış kurtarma depolama alanıdır [1, 2]. Kurtarma dosyalarının izole edilmesi, yedekleme veya arşivleme operasyonlarının DATA grubundaki birincil veri operasyonları ile disk bant genişliği için yarışmasını engeller [1, 2].
* **ASM Şeritlendirme (Striping) Stratejileri:**
  * **Coarse-Grained Striping (Kaba Taneli Şeritlendirme):** Allocation Unit (AU) boyutunun tamamını (genellikle 1 MB ila 4 MB veya daha büyük) kullanır [1, 2]. Veritabanı veri dosyaları, indeks tablespace'leri, geçici dosyalar ve RMAN yedek kümeleri gibi büyük ve sıralı I/O operasyonları için tasarlanmıştır [1, 2].
  * **Fine-Grained Striping (İnce Taneli Şeritlendirme):** Allocation Unit boyutunu 128 KB'lık daha küçük şerit kümelerine böler ve tüm diskler üzerine dağıtır [1, 2]. Online Redo Logs (ORLs), Control Files ve Flashback Logs gibi düşük gecikmeli, küçük boyutlu yazma operasyonları için optimize edilmiştir [1, 2].
* **ASM Yedeklilik (Redundancy) Modelleri:**
  * **External Redundancy:** ASM içinde aynalama yapmaz; veri korumasını tamamen donanım RAID kontrolcülerine veya SAN mimarisine devreder [1, 2].
  * **Normal Redundancy:** ASM Failure Groups arasında 2 yönlü (2-way) aynalama uygular ve en az iki Failure Group gerektirir [1, 2].
  * **High Redundancy:** ASM Failure Groups arasında 3 yönlü (3-way) aynalama uygular ve en az üç Failure Group gerektirir [1, 2]. Kritik IFS ortamlarında maksimum erişilebilirlik sağlamak için standarttır [1, 2].
* **Yönetim ve İnceleme Komutları:**
  * ASM örneğine (`+ASM`) bağlanılarak `V$ASM_FILE` ve `V$ASM_ALIAS` görünümleri üzerinden dosyaların fine veya coarse şeritlendirme durumları denetlenir [1].
  * `V$ASM_DISKGROUP` görünümü sorgulanarak disk grubu boş alanı, Allocation Unit boyutları ve yedeklilik modelleri doğrulanır [2].
  * ASM disk grubu şablonları (templates) değiştirilerek yeni oluşturulan online redo logların otomatik olarak fine-grained şeritlendirme ve high redundancy alması sağlanabilir [1].
  * Veritabanı örneği içinde Oracle Managed Files (OMF) parametreleri yapılandırılarak veri dosyaları ve kurtarma varlıkları otomatik olarak DATA ve RECO disk gruplarına yönlendirilir [2].
* **Sürüm Uygulaması:** Resmî kılavuz "Oracle Automatic Storage Management Administrator's Guide" bu ASM süreçlerini Release 19c için belgeler [3]. Eğitim mimari notları bu ASM disk grubu mimarisini ve şeritlendirme stratejilerini IFS Applications (IFS Cloud, IFS Applications 10/9) platformlarına uygular [1, 2].

---

### Hedef 2: IFS Cloud Veritabanlarında Yüksek Hacimli İşlem Tabloları İçin Tablo Bölümleme ve Yerel İndeks Stratejilerini Uygulama

* **Kaynak Kapsamı:** Seçili kaynaklar içerisinde IFS Cloud veritabanlarında yüksek hacimli işlem tabloları için tablo bölümleme (table partitioning) ve yerel indeks (local index) stratejilerinin uygulanmasına dair bilgi yer almamaktadır [1-4].
* **İçerik Sınırı:** Kaynaklarda bulunmayan ayrıntılar için genel bilgiden boşluk doldurulmamış ve konu kapsam dışı bırakılmıştır [1-4].

---

### Hedef 3: DBMS_SERVER_ALERT ve OEM Üzerinden Tablespace ve ASM Disk Grubu İçin Yüzde 85 Uyarı ve Yüzde 95 Kritik Alan Eşiklerini Tanımlama

* **OEM Metrik Eşik Mimarisi:** Oracle Enterprise Manager (OEM) Cloud Control, izlenen hedefleri önceden tanımlanmış depolama sınırlarına göre değerlendirir ve kullanım yüzdeleri belirlenen limitleri aştığında uyarılar tetikler [4].
  * **Uyarı Eşiği (Warning Threshold):** Genellikle %85 kapasite kullanımına ayarlanır [4]. Veritabanı yöneticilerinin büyüyen veri dosyalarını incelemesine, eski staging tablolarını temizlemesine veya rutin bakım pencerelerinde depolama genişletmeleri planlamasına olanak tanır [4].
  * **Kritik Eşik (Critical Threshold):** Genellikle %95 kapasite kullanımına ayarlanır [4]. Yetersiz alan hatalarını ve veritabanı duraklamalarını önlemek için acil müdahale gerektiren yüksek depolama baskısını gösterir [4].
* **Tablespace ve ASM Disk Grubu Uyarı Ayrımı:**
  * **Tablespace Eşikleri:** Bireysel veri dosyaları ile CDB/PDB konteyner veritabanları içindeki mantıksal alan tahsisini izler [4].
  * **ASM Disk Grubu Eşikleri:** DATA ve RECO gibi paylaşılan depolama havuzlarındaki fiziksel diskler ve Failure Group'lar genelindeki fiziksel boş alanı izler [4].
* **Programlama ve Komut Dosyası İle Yapılandırma:**
  * Veritabanı seviyesinde tablespace alan kullanımı uyarıları `DBMS_SERVER_ALERT` PL/SQL paketi kullanılarak programatik olarak yapılandırılır [4].
  * `DBMS_SERVER_ALERT.SET_THRESHOLD` yordamı çalıştırılarak `metric_id => DBMS_SERVER_ALERT.TABLESPACE_SPACE_USAGE`, `warning_operator => DBMS_SERVER_ALERT.OPERATOR_GE`, `warning_value => '85'`, `critical_operator => DBMS_SERVER_ALERT.OPERATOR_GE`, `critical_value => '95'`, `observation_period => 1`, `consecutive_occurrences => 1`, `dbobject_type => 'TABLESPACE'` ve `dbobject_name => 'USERS'` parametreleriyle %85 uyarı ve %95 kritik eşikleri tanımlanır [4].
  * Yapılandırılan eşik ayarları `DBA_THRESHOLDS` veri sözlüğü görünümü (`SELECT metric_name, object_name, warning_value, critical_value FROM dba_thresholds WHERE metric_name LIKE '%Space Used%';`) sorgulanarak doğrulanır [4].
  * Fiziksel ASM disk grubu kapasitesi ve kullanım yüzdeleri, ASM örneğine (`+ASM`) bağlanılarak `V$ASM_DISKGROUP` görünümünden (`SELECT name, total_mb / 1024 AS total_gb, free_mb / 1024 AS free_gb, ROUND((1 - (free_mb / total_mb)) * 100, 2) AS used_percent FROM v$asm_diskgroup;`) sorgulanır ve anlık kullanım takip edilir [4].
* **Sürüm ve Uygulama Bağlamı:** Eğitim notları bu eşik yapılandırmalarını IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarındaki ERP, EAM ve FSM yüklerine uygular [4]. Kaynaklar `DBMS_SERVER_ALERT` paketi ve eşik tanımlamaları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [4].

---

💡 **Sonraki Adımlar:** Studio paneline eklenen **Oracle Storage** interaktif test uygulamasını çözerek ASM şeritlendirme ve eşik değerleri bilginizi pekiştirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `1b04476c-4a75-4cff-b885-92515534b16e`
* NotebookLM kaynağı `f793ad75-751e-4c83-8ca8-28d381bab07b`
* NotebookLM kaynağı `864e9db2-d8b7-49d5-ba58-f597500b415f`
* NotebookLM kaynağı `667e3b8a-819a-4cdf-ae3c-94d88a2cbcbb`
