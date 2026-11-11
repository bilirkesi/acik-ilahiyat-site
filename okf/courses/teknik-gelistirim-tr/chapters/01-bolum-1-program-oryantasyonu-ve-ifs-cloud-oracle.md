---
type: Chapter
title: "Bölüm 1: Program Oryantasyonu ve IFS Cloud Oracle Altyapı Mimarisi"
description: Öğrenci, IFS Cloud ve IFS Applications platformlarının Oracle 19c veritabanı altyapı mimarisini, kurumsal mimari standartlarını ve eğitim programının temel bileşenlerini öğrenir. Mimari tasarım prensi
course: teknik-gelistirim-tr
chapter: 1
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, IFS Cloud ve IFS Applications platformlarının Oracle 19c veritabanı altyapı mimarisini, kurumsal mimari standartlarını ve eğitim programının temel bileşenlerini öğrenir. Mimari tasarım prensipleri, veritabanı kurulum hazırlıkları ve temel bellek ile süreç parametrelerinin genel yapısı incelenir. Ayrıca platform gereksinimleri ve lisanslama standartları ele alınır.

# Öğrenme Hedefleri

1. Öğrenci, IFS Cloud 25R1 ve 26R2 mimarisi için Oracle 19c veritabanı depolama tier ve sunucu gereksinimlerini planlayabilir.
2. Öğrenci, IFS Applications 10 ve IFS Cloud platformlarında veritabanı parametrelerinin temel ölçeklendirme standartlarını yapılandırabilir.
3. Öğrenci, enterprise ERP yükleri için veritabanı altyapı mimarisi kurulum ve oryantasyon adımlarını yönetebilir.

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

Seçili kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

### Hedef 1: IFS Cloud 25R1 ve 26R2 Mimarisi İçin Oracle 19c Veritabanı Depolama Tier ve Sunucu Gereksinimlerini Planlama

* **Kaynak Kapsamı ve Donanım Detayları:** Seçilen kaynaklar içerisinde IFS Cloud 25R1 ve IFS Cloud 26R2 sürümlerine özel veritabanı depolama tier (storage tier) ve sunucu boyutu gereksinimlerine dair somut teknik veriler yer almamaktadır [1, 2].
* **Teknik Dokümantasyon İstek Durumu:** Resmî IFS Cloud teknik dokümantasyon kaynakları (`Preparing Installation - Technical Documentation For IFS Cloud` ve `Technical Documentation For IFS Cloud`) yalnızca tarayıcı doğrulama uyarısı metnini içermekte olup donanım veya depolama kotalarını sunmamaktadır [1, 2].
* **Genel ERP Altyapı Bağlamı:** Eğitim programının mimari kılavuzları, IFS Applications (IFS Cloud, IFS Applications 10/9) platformlarının kritik ERP, EAM ve FSM operasyonları için Oracle Database arka uçlarına dayandığını belirtmektedir [3]. Kaynaklar belirli bir sürüm (IFS Cloud 25R1 veya 26R2) için depolama tier detaylarını vermediğinden, kaynaklarda bulunmayan ayrıntılar eklenmemiştir [1-3].

---

### Hedef 2: IFS Applications 10 ve IFS Cloud Platformlarında Veritabanı Parametrelerinin Temel Ölçeklendirme Standartlarını Yapılandırma

* **System Global Area (SGA) Akortlama (`sga_target`):** `sga_target` parametresinin sıfır olmayan bir değere ayarlanması Otomatik Paylaşılan Bellek Yönetimini (ASMM) etkinleştirir [4]. ASMM sayesinde Oracle; Buffer Cache, Shared Pool, Large Pool ve Java Pool bellek havuzlarının boyutlarını dinamik olarak ayarlar [4]. Shared Pool; IFS orta katman oturumlarının yeniden kullanımı için ayrıştırılmış SQL, PL/SQL kodlarını, yürütme planlarını ve veri sözlüğü bilgilerini saklar [4]. Buffer Cache ise diskten okunan veri bloklarını önbelleğe alarak sorgu yanıt sürelerini optimize eder [4]. SGA bellek havuzlarının dinamik akortlanması, IFS Applications (IFS Cloud ve IFS Applications 10/9) bünyesindeki yoğun OLTP işlemlerinde sabit ayrıştırma (hard parse) ve disk I/O darboğazlarını önler [4].
* **Program Global Area (PGA) Akortlama (`pga_aggregate_target`):** PGA, her bir sunucu süreci için bireysel olarak ayrılan paylaşılmayan bellek alanıdır [4]. `pga_aggregate_target` parametresi, tüm oturumlar genelinde tahsis edilen toplam PGA belleği için küresel bir hedef belirler [4]. Oracle, sıralama işlemleri (ORDER BY), hash join ve bitmap birleştirme iş alanlarına ayrılan belleği dinamik olarak kontrol ederek yoğun toplu iş raporları sırasında geçici tablespace'e (temp tablespace) aşırı veri taşmasını engeller [4].
* **Süreç Kapasite Parametresi Akortlama (`processes`):** Statik başlangıç parametresi `processes`, Oracle Database örneğine aynı anda bağlanabilecek maksimum işletim sistemi kullanıcı süreci sayısını tanımlar [5]. Her adanmış orta katman bağlantı havuzu, arka plan süreçleri (PMON, DBWn, LGWR) ve veritabanı yöneticisi (DBA) oturumu bir süreç yuvası tüketir [5]. Bu parametrenin çok düşük yapılandırılması gelen bağlantıların reddedilmesine ve `ORA-00020: maximum number of processes exceeded` hatasına yol açarak orta katman sunucularının yeni oturum açmasını engeller [5].
* **Açık İmleç Kapasite Parametresi Akortlama (`open_cursors`):** Dinamik parametre `open_cursors`, Özel SQL Alanında (Private SQL Area) tek bir oturumun aynı anda açık tutabileceği maksimum imleç sayısını belirler [5]. IFS ortamındaki Java/JDBC bağlantı havuzları gibi orta katman çatıları yürütme hızını artırmak için ifade tanıtıcılarını önbelleğe alır [5]. `open_cursors` parametresinin yeterince yüksek ayarlanması, imleç sızıntılarını ve Shared Pool bellek sınırlarının aşılmasını önleyerek `ORA-01000: maximum open cursors exceeded` hatasını engeller [5].
* **Sürüm Uygulaması:** Mimari notlar ve çalışma notları bu bellek ve kapasite parametresi ölçeklendirme standartlarını IFS Applications (IFS Cloud ve IFS Applications 10/9) iş yüklerine uygular [4, 5]. Kaynaklar bu parametre tanımları için belirli bir veritabanı sürümü kısıtlaması (örneğin Oracle Database 19c) belirtmediğinden, kaynakların belirtmediği bir veritabanı sürümü tahmin edilmemiştir [4, 5].

---

### Hedef 3: Enterprise ERP Yükleri İçin Veritabanı Altyapı Mimarisi Kurulum ve Oryantasyon Adımlarını Yönetme

* **Çok Kiracılı Mimari (CDB ve PDB) Yönetimi:** Kök konteyner veritabanı (CDB\$ROOT); arka plan süreçlerini, paylaşılan sistem verilerini ve küresel belleği yönetir [6]. Ayrı IFS uygulama örneklerini (DEV, TEST ve PROD gibi ortamlar) aynı sunucu donanımı üzerinde izole etmek için adanmış Pluggable Database'ler (PDB\$SEED ve Kullanıcı PDB'leri) oluşturulur ve yönetilir [6]. Konteynır bağlamları ve kiracı izolasyonu yönetilerek veritabanı seviyesinde ayrıştırma sağlanır [3, 6].
* **Yama Yönetimi ve Bakım Döngüleri (RU / RUR):** Release Update (RU); güvenlik açıklarını, yüksek değerli hata düzeltmelerini ve kararlılık iyileştirmelerini içeren ve ikincil veritabanı sürüm numarasını artıran üç aylık birikimli yamalardır [6]. Release Update Revision (RUR); yeni işlevsel hata düzeltmesi eklemeden mevcut bir RU'nun ömrünü uzatan, güvenlik ve regresyon odaklı yamalardır [6]. Oracle yama uygulama stratejileri IFS Cloud ve IFS Applications güncelleme döngüleri ile hizalanır [3, 6].
* **Temel Veritabanı Parametre ve Bellek Yapılandırması:** Yüksek işlem hacimli ERP, EAM ve FSM yükleri için `sga_target`, `pga_aggregate_target`, `open_cursors` ve `processes` parametreleri yapılandırılarak altyapı performansı optimize edilir [3, 6].
* **Eğitim Kurulumu ve Oryantasyon Süreci:** IFS Oracle DBA Eğitim Programı oryantasyonunda, kullanıcı hedefleri ve mimari kılavuzları doğrultusunda eğitim içeriği (örneğin Oracle RAC kurulumu, AWR/ASH performans akortlaması veya Data Guard yüksek erişilebilirlik çözümleri) belirlenir ve ders planı yapılandırılır [7, 8].

---

💡 **Sonraki Adımlar:** `open_cursors` ve `processes` parametrelerinin dinamik izleme sorgularını incelemek veya SGA bellek havuzlarının anlık dağılımını `V$SGA_DYNAMIC_COMPONENTS` görünümünden sorgulayan örnek SQL kodlarını gözden geçirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `f3d4231d-7739-446f-a447-2c7906358ca3`
* NotebookLM kaynağı `239ebccb-fa0b-4409-9edf-967814bc054f`
* NotebookLM kaynağı `1d3414e6-6bca-4230-b212-d0f61550560c`
* NotebookLM kaynağı `489d856f-f87e-4687-b920-4f6a8cc61ee8`
* NotebookLM kaynağı `4ebecd4a-16c1-4397-82eb-0db7fbfbdabd`
* NotebookLM kaynağı `2ac34d8a-8a27-4e29-96df-b28f71fd8ba0`
* NotebookLM kaynağı `7706b3f1-6058-4487-a86c-dc2125297e3c`
* NotebookLM kaynağı `eebd95b3-55c6-4178-a201-1ffd89aa06d8`
