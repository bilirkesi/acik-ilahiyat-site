---
type: Chapter
title: "Bölüm 1: Program Oryantasyonu ve IFS Cloud Oracle Altyapı Mimarisi"
description: IFS Cloud ve IFS Applications platformlarının Oracle 19c veritabanı altyapı mimarisi, kurumsal mimari standartları ve eğitim programının temel bileşenleri öğrenilir. Mimari tasarım prensipleri, verita
course: teknik-gelistirim-tr
chapter: 1
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T07:22:59Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

IFS Cloud ve IFS Applications platformlarının Oracle 19c veritabanı altyapı mimarisi, kurumsal mimari standartları ve eğitim programının temel bileşenleri öğrenilir. Mimari tasarım prensipleri, veritabanı kurulum hazırlıkları ve temel bellek ile süreç parametrelerinin genel yapısı incelenir. Ayrıca platform gereksinimleri ve lisanslama standartları ele alınır.

# Sesli Ders

[Bölüm 1 sesli özeti](/audio/teknik-gelistirim-tr/chapter-1.mp3) (7:05 dk, MP3)

# Öğrenme Hedefleri

1. IFS Cloud 25R1 ve 26R2 mimarisi için Oracle 19c veritabanı depolama tier ve sunucu gereksinimlerini planlayabilir.
2. IFS Applications 10 ve IFS Cloud platformlarında veritabanı parametrelerinin temel ölçeklendirme standartlarını yapılandırabilir.
3. enterprise ERP yükleri için veritabanı altyapı mimarisi kurulum ve oryantasyon adımlarını yönetebilir.

# Dersler

* IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines
* IFS Oracle DBA Training Setup
* Memory Architecture Tuning (sga_target & pga_aggregate_target)
* Chapter 1 Core Topics Overview
* Session & Cursor Capacity Parameter Tuning (open_cursors & processes)
* Preparing Installation - Technical Documentation For IFS Cloud
* Technical Documentation For IFS Cloud
* Oracle Database Database Concepts, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Belirtilen öğrenme hedefleri doğrultusunda, sağlanan kaynaklara dayanarak öğrenilenler aşağıda açıklanmaktadır:

### Hedef 1: IFS Cloud 25R1 ve 26R2 Mimarisi İçin Oracle 19c Veritabanı Depolama Tier ve Sunucu Gereksinimlerini Planlama

* **Kaynak Kapsamı:** Seçilen kaynaklar içerisinde IFS Cloud 25R1 ve IFS Cloud 26R2 sürümlerine özel Oracle 19c veritabanı depolama tier (storage tier) ve sunucu kapasite gereksinimlerine dair somut teknik veriler bulunmamaktadır.
* **Genel ERP Altyapı Bağlamı:** Kaynaklar, IFS Applications (IFS Cloud, IFS Applications 10/9) platformlarının kritik ERP, EAM ve FSM operasyonlarında Oracle Database arka uçlarına dayandığını belirtmektedir [1]. Kaynaklar belirli bir sürüm (IFS Cloud 25R1 veya 26R2) için depolama tier ve sunucu boyutlandırma ayrıntılarını vermediğinden, kaynaklarda yer almayan hususlar kapsama dahil edilmemiştir.

---

### Hedef 2: IFS Applications 10 ve IFS Cloud Platformlarında Veritabanı Parametrelerinin Temel Ölçeklendirme Standartlarını Yapılandırma

* **System Global Area (SGA) Akortlama (`sga_target`):** `sga_target` parametresinin sıfır olmayan bir değere ayarlanması Otomatik Paylaşılan Bellek Yönetimini (ASMM) etkinleştirir [2]. ASMM sayesinde Oracle; Buffer Cache (diskten okunan veri bloklarını önbelleğe alarak sorgu yanıt sürelerini optimize eder) [2], Shared Pool (IFS orta katman oturumlarının yeniden kullanımı için ayrıştırılmış SQL, PL/SQL kodlarını, yürütme planlarını ve veri sözlüğü bilgilerini saklar) [2], Large Pool ve Java Pool (paralel yürütme, RMAN yedekleme süreçleri ve gömülü JVM operasyonlarını destekler) [2] bellek havuzlarının boyutlarını dinamik olarak dengeler. SGA bellek havuzlarının dinamik akortlanması, IFS Applications (IFS Cloud ve IFS Applications 10/9) bünyesindeki yüksek hacimli OLTP işlemlerinde sabit ayrıştırma (hard parse) ve disk I/O darboğazlarını önler [2].
* **Program Global Area (PGA) Akortlama (`pga_aggregate_target`):** PGA, her bir sunucu süreci için bireysel olarak ayrılan paylaşılmayan bellek alanıdır [2]. Sıralama işlemleri (ORDER BY), hash join ve bitmap birleştirme iş alanları için kullanılır [2]. `pga_aggregate_target` parametresi, tüm oturumlar genelinde tahsis edilen toplam PGA belleği için küresel bir hedef belirler [2]. Oracle, iş alanlarına ayrılan belleği dinamik olarak kontrol ederek büyük toplu iş raporlarında geçici tablespace (temp tablespace) alanına aşırı veri taşmasını engeller [2].
* **Süreç Kapasite Parametresi Akortlama (`processes`):** Statik başlangıç parametresi `processes`, veritabanı örneğine aynı anda bağlanabilecek maksimum işletim sistemi kullanıcı süreci sayısını tanımlar [3]. Her adanmış orta katman bağlantı havuzu, arka plan süreçleri (PMON, DBWn, LGWR) ve veritabanı yöneticisi (DBA) oturumu bir süreç yuvası tüketir [3]. Bu parametrenin çok düşük yapılandırılması gelen bağlantıların reddedilmesine ve `ORA-00020: maximum number of processes exceeded` hatasına yol açarak orta katman sunucularının yeni oturum açmasını engeller [3].
* **Açık İmleç Kapasite Parametresi Akortlama (`open_cursors`):** Dinamik parametre `open_cursors`, Özel SQL Alanında (Private SQL Area) tek bir oturumun aynı anda açık tutabileceği maksimum imleç sayısını belirler [3]. İmleçler ayrıştırılmış SQL ifadelerini ve PL/SQL bloklarını işler [3]. IFS ortamındaki Java/JDBC bağlantı havuzları gibi orta katman çatıları yürütme hızını artırmak için ifade tanıtıcılarını önbelleğe alır [3]. `open_cursors` parametresinin yeterince yüksek ayarlanması, imleç sızıntılarını ve Shared Pool bellek sınırlarının aşılmasını önleyerek `ORA-01000: maximum open cursors exceeded` hatasını engeller [3].
* **Sürüm Uygulaması:** Mimari notlar ve çalışma notları bu bellek ve kapasite parametre ölçeklendirme standartlarını IFS Applications (IFS Cloud ve IFS Applications 10/9) iş yüklerine uygular [1-3]. Kaynaklar bu parametre tanımları için belirli bir veritabanı sürümü kısıtlaması (örneğin Oracle Database 19c) belirtmemektedir [2, 3].

---

### Hedef 3: Enterprise ERP Yükleri İçin Veritabanı Altyapı Mimarisi Kurulum ve Oryantasyon Adımlarını Yönetme

* **Çok Kiracılı Mimari (CDB ve PDB) Yönetimi:** Kök konteyner veritabanı (CDB\$ROOT); arka plan süreçlerini, paylaşılan sistem metadatasını ve küresel belleği yönetir [4]. Ayrı IFS uygulama örneklerini (DEV, TEST ve PROD gibi ortamlar) aynı sunucu donanımı üzerinde izole etmek için adanmış Pluggable Database'ler (PDB\$SEED, Kullanıcı PDB'leri) oluşturulur ve yönetilir [4]. PDB durumları, konteyner bağlamları ve şema izolasyonu yönetilerek veritabanı seviyesinde ayrıştırma sağlanır [1, 4].
* **Yama Yönetimi ve Bakım Döngüleri (RU / RUR):** Release Update (RU); güvenlik açıklarını, yüksek değerli hata düzeltmelerini ve kararlılık iyileştirmelerini içeren ve ikincil veritabanı sürüm numarasını artıran üç aylık birikimli yamalardır [4]. Release Update Revision (RUR); yeni işlevsel hata düzeltmesi eklemeden mevcut bir RU'nun ömrünü uzatan, güvenlik ve regresyon odaklı yamalardır [4]. Oracle yama uygulama stratejileri IFS Cloud ve IFS Applications güncelleme döngüleriyle hizalanır [1, 4].
* **Temel Veritabanı Parametre Yapılandırması:** Yüksek işlem hacimli ERP yükleri için `sga_target`, `pga_aggregate_target`, `open_cursors` ve `processes` parametreleri yapılandırılarak altyapı performansı optimize edilir [1, 4].
* **Eğitim Kurulumu ve Oryantasyon Süreci:** IFS Oracle DBA Eğitim Programı oryantasyonunda, kullanıcı hedefleri (örneğin Oracle RAC kurulumu, AWR/ASH performans akortlaması veya Data Guard yüksek erişilebilirlik çözümleri) belirlenir ve mimari kılavuzlar doğrultusunda eğitim içeriği yapılandırılır [5, 6].

---

💡 **Sonraki Adımlar:** `open_cursors` ve `processes` parametrelerinin dinamik izleme sorgularını incelemek veya SGA bellek havuzlarının anlık dağılımını `V$SGA_DYNAMIC_COMPONENTS` görünümünden sorgulayan örnek SQL kodlarını gözden geçirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `f3d4231d-7739-446f-a447-2c7906358ca3`
* NotebookLM kaynağı `239ebccb-fa0b-4409-9edf-967814bc054f`
* NotebookLM kaynağı `1d3414e6-6bca-4230-b212-d0f61550560c`
* NotebookLM kaynağı `489d856f-f87e-4687-b920-4f6a8cc61ee8`
* NotebookLM kaynağı `4ebecd4a-16c1-4397-82eb-0db7fbfbdabd`
* NotebookLM kaynağı `eebd95b3-55c6-4178-a201-1ffd89aa06d8`
* NotebookLM kaynağı `616bc55c-014f-43c8-b15b-1931ffae437e`
