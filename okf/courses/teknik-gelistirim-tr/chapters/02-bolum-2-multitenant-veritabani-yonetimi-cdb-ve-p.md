---
type: Chapter
title: "Bölüm 2: Multitenant Veritabanı Yönetimi: CDB ve PDB İzolasyonu"
description: Öğrenci, Oracle Database 19c Multitenant mimarisinde CDB\(ROOT, PDB\)SEED ve kullanıcı Pluggable Database (PDB) yapılarını yönetmeyi öğrenir. Farklı IFS ortamları (PROD, TEST, DEV) arasında veritabanı
course: teknik-gelistirim-tr
chapter: 2
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Database 19c Multitenant mimarisinde CDB\(ROOT, PDB\)SEED ve kullanıcı Pluggable Database (PDB) yapılarını yönetmeyi öğrenir. Farklı IFS ortamları (PROD, TEST, DEV) arasında veritabanı seviyesinde izolasyon sağlama, PDB kaynak yöneticisi profillerini yapılandırma ve PDB yaşam döngüsü operasyonları kapsanmaktadır. PDB klonlama, takma/çıkarma ve PDB seviyesinde SGA/PGA kaynak sınırlandırmaları detaylandırılır.

# Öğrenme Hedefleri

1. Öğrenci, Oracle Database 19c Multitenant mimarisinde CDB$ROOT ve PDB yapılarını yöneterek ortamlar arası veri ve metadata izolasyonunu sağlayabilir.
2. Öğrenci, PDB seviyesinde sga_target ve pga_aggregate_limit parametreleri ile kaynak kotalarını belirleyip kaynak çakışmalarını önleyebilir.
3. Öğrenci, PDB klonlama, takma, çıkarma ve PDB$SEED üzerinden yeni PDB oluşturma operasyonlarını diğer veritabanlarını etkilemeden gerçekleştirebilir.

# Dersler

* Container Database (CDB) Administration
* Pluggable Database (PDB) Isolation & Operations
* Table Partitioning for Massive Transaction Tables
* About Server Alert Log - Technical Documentation For IFS Cloud
* Oracle Database Database Administrator's Guide, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Öğrencinin belirtilen hedefler doğrultusunda öğrendiği konular, sağlanan kaynaklara dayanarak aşağıda açıklanmaktadır:

### Hedef 1: CDB\$ROOT ve PDB Yapılarını Yöneterek Ortamlar Arası Veri ve Metadata İzolasyonunu Sağlama

* **Çok Kiracılı Mimari Yapısı:** Öğrenci, Oracle Multitenant mimarisinin veritabanı altyapısını tek bir kök konteyner veritabanı (CDB\$ROOT) ve bir veya daha fazla Pluggable Database (PDB) yapısına ayırdığını öğrenir [1].
  * **CDB\$ROOT:** Ortak arka plan süreçlerini, paylaşılan sistem metadatasını, ortak kullanıcı hesaplarını ve küresel veritabanı belleğini yönetir [1].
  * **PDB\$SEED:** Yeni pluggable veritabanlarını hızlı bir şekilde oluşturmak amacıyla kullanılan, sistem tarafından sağlanan şablon PDB'dir [1].
  * **Kullanıcı PDB'leri:** IFS Applications için gerekli olan kullanıcı veri şemalarını, tablespace yapılarını ve uygulamaya özel metadataları barındırır [1].
* **Mantıksal ve Şema İzolasyonu:** IFS Applications (IFS Cloud, IFS Applications 10/9) ortamında Development (DEV), Testing (TEST), Staging ve Production (PROD) gibi farklı uygulama aşamaları aynı fiziksel donanım üzerinde tam operasyonel izolasyonla çalıştırılır [1, 2].
  * **Özel Veri Sözlüğü:** CDB\$ROOT ortak sistem metadatasını yönetirken, her PDB kullanıcı tarafından oluşturulan tablolar, indeksler ve uygulama şemaları için kendi özel veri sözlüğünü (private data dictionary) korur [1, 2].
  * **İşlemsel Bağlam İzolasyonu:** Orta katman bağlantı havuzları yalnızca kendilerine atanan PDB servisi ile etkileşime girer; böylece üretim dışı (DEV veya TEST) ortam oturumlarının üretim (PROD) şema nesnelerine erişmesi veya bunları değiştirmesi engellenir [1, 2].
* **Bağlam Yönetimi ve Doğrulama:** Oturum konteynır bağlamı `ALTER SESSION SET CONTAINER = ifsprod;` ile değiştirilir ve PDB `ALTER PLUGGABLE DATABASE ifsprod OPEN;` komutuyla açılır [1]. Mevcut oturum konteynır bağlamı `sys_context('USERENV', 'CON_NAME')` ve active oturumlar `v$session` sorgusu ile doğrulanır [2].
* **Sürüm Durumu:** Kaynaklar bu multitenant mimari prensiplerini IFS Applications (IFS Cloud, IFS Applications 10/9) ortamları için açıklar; ancak bu ifadelerin özel olarak hangi veritabanı sürümüne (örneğin Oracle Database 19c) ait olduğunu ayrıca belirtmemektedir [1, 2].

---

### Hedef 2: PDB Seviyesinde sga_target ve pga_aggregate_limit Parametreleri ile Kaynak Kotalarını Belirleme

* **Bellek İzolasyonu ve Kaynak Sınırları:** Öğrenci, çok kiracılı bir ortamda ağır test komut dosyaları veya toplu işler gibi üretim dışı iş yüklerinin üretim (PROD) performansını düşürmesini ve bellek kaynaklarını tüketmesini önlemek için PDB seviyesinde kaynak sınırlarının uygulandığını öğrenir [2].
* **PDB Seviyesinde Bellek Eşikleri:** Bellek kotaları (`sga_min_size`, `sga_target` ve `pga_aggregate_limit`) PDB bazında yapılandırılarak tek bir konteynerdeki kontrolden çıkmış sorguların sunucuda paylaşılan belleği tüketmesi engellenir [2].
* **Uygulama Örneği:** Üretim dışı bir PDB bağlamına geçilerek (`ALTER SESSION SET CONTAINER = ifstest;`) bellek sınırları `ALTER SYSTEM SET pga_aggregate_limit = 4G SCOPE = BOTH;` ve `ALTER SYSTEM SET sga_target = 8G SCOPE = BOTH;` komutlarıyla ayarlanır ve `SHOW PARAMETER pga_aggregate_limit;` ile doğrulanır [2].
* **PDB Resource Manager Profilleri:** CPU payları, paralel yürütme kuyrukları ve oturum sınırları PDB Resource Manager profilleri aracılığıyla PDB başına tahsis edilir [2].
* **Sürüm Durumu:** Kaynaklar PDB seviyesinde bellek parametresi yapılandırmasını tanımlamakta, ancak spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [2].

---

### Hedef 3: PDB Klonlama, Takma, Çıkarma ve PDB\$SEED Üzerinden Yeni PDB Oluşturma Operasyonları

* **PDB\$SEED ile Yeni PDB Oluşturma:** Öğrenci, PDB\$SEED yapısının ek IFS ortamları için yeni pluggable veritabanlarını hızlı bir şekilde oluşturmak üzere sistem tarafından sağlanan bir şablon olduğunu öğrenir [1].
* **Bağımsız Yaşam Döngüsü Operasyonları:** Veritabanı yöneticileri (DBA), aynı konteyner örneğinde çalışan kardeş PDB'lerdeki operasyonları ve yürütülen iş yüklerini kesintiye uğratmadan bireysel bir PDB'yi çıkarabilir (unplug), klonlayabilir (clone) veya silebilir (drop) [2].
* **Kapsam Notu:** Kaynaklar PDB\$SEED şablon kullanımını ve bir PDB'nin diğer kardeş PDB'leri etkilemeden unplug, clone veya drop edilebildiğini belirtmekte; ancak bu operasyonların komut satırı sözdizimi adımlarını ayrıntılandırmayıp kısa tutmaktadır [1, 2].
* **Sürüm Durumu:** Kaynaklar yaşam döngüsü operasyonlarının hangi veritabanı sürümüne ait olduğunu açıkça belirtmemektedir [1, 2].

---

💡 **Sonraki Adımlar:** PDB seviyesinde Resource Manager profillerini test etmek veya `v$pdbs` ve `v$session` görünümlerinden aktif oturum dağılımını sorgulayan örnek DDL/DML komutlarını incelemek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `14af7919-6307-4898-8b35-3cdf88367336`
* NotebookLM kaynağı `dbe6ef64-6bf2-4686-a45f-7046ef47a754`
* NotebookLM kaynağı `64e17649-95cc-4200-ae0b-f756d52ffbb1`
* NotebookLM kaynağı `54fe9696-9a03-4ed9-8525-b0b6a68930fc`
* NotebookLM kaynağı `aaaf38c9-d233-4e21-871e-e5375b696663`
