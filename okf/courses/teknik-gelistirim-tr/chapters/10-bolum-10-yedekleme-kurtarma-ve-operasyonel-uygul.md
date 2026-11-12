---
type: Chapter
title: "Bölüm 10: Yedekleme, Kurtarma ve Operasyonel Uygulama"
description: Recovery Manager (RMAN) yedekleme, geri yükleme ve kurtarma operasyonlarının Oracle Database 19c ve 26ai ortamlarında yönetimi öğrenilir. RMAN RECOVER TABLE PITR ile silinen tabloları auxiliary destin
course: teknik-gelistirim-tr
chapter: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T07:22:59Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Recovery Manager (RMAN) yedekleme, geri yükleme ve kurtarma operasyonlarının Oracle Database 19c ve 26ai ortamlarında yönetimi öğrenilir. RMAN RECOVER TABLE PITR ile silinen tabloları auxiliary destination kullanarak veritabanı kesintisi olmadan kurtarır. Ayrıca kesinti incelemesi hazırlığı, dba_scheduler_job_run_details ve v$diag_alert_ext sorguları ile canlıya geçiş öncesi kontrol listelerini ve eğitim ilerleme durumunu değerlendirir.

# Sesli Ders

[Bölüm 10 sesli özeti](/audio/teknik-gelistirim-tr/chapter-10.mp3) (5:40 dk, MP3)

# Öğrenme Hedefleri

1. RMAN RESTORE, RECOVER, DUPLICATE ve FLASHBACK DATABASE komutlarını Data Recovery Advisor (DRA) amortismanını dikkate alarak çalıştırabilir.
2. Oracle 12c, 19c ve 26ai veritabanlarında RMAN RECOVER TABLE PITR ile auxiliary destination kullanarak tablo seviyesinde nokta zamanlı kurtarma yapabilir.
3. dba_scheduler_job_run_details ve v$diag_alert_ext sorguları ile kesinti sonrası incelemeleri yürüterek canlıya alım kontrol listelerini güncelleyebilir.

# Dersler

* IFS Enterprise Oracle Architecture & DBA Training Program Practice Test
* IFS Oracle DBA Training Progress
* IFS Oracle DBA Eğitim Güncellemesi
* Training Progress and Chapter 6 Start
* Kesinti incelemesi hazırlığı - 11.11.2026.docx
* IFS Oracle Eğitim İçeriği Güncellemesi
* Oracle Database Backup and Recovery Reference - Oracle Help
* Configure Scheduled Tasks - Technical Documentation For IFS Cloud
* Backup and Recovery User Guide
* Recovering Tables and Table Partitions
* Transporting Data Across Platforms

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

### Data Recovery Advisor (DRA) Amortismanı ve RMAN RESTORE, RECOVER, DUPLICATE ve FLASHBACK DATABASE Operasyonları

* **Data Recovery Advisor (DRA) Amortismanı (Deprecation):** Resmî Oracle dokümanı "Oracle Database Backup and Recovery Reference - Oracle Help", Oracle Database 19c sürümünden itibaren Data Recovery Advisor (DRA) özelliğinin kullanımının kaldırıldığını (deprecated) belirtmektedir. DRA özelliğinin amortismanı ile birlikte Recovery Manager (RMAN) bünyesindeki `LIST FAILURE`, `ADVISE FAILURE`, `REPAIR FAILURE` ve `CHANGE FAILURE` komutları da kullanımdan kaldırılmıştır. Veritabanı yöneticileri Oracle Database 19c sürümünde bu komutlara erişememektedir ve DRA için sunulmuş herhangi bir alternatif özellik bulunmamaktadır.
* **RMAN `RESTORE` Komutu Operasyonları:** `RESTORE` komutu; veri dosyalarını, kontrol dosyalarını, sunucu parametre dosyasını (spfile) veya arşiv redo log dosyalarını yedek kümelerinden (backup sets) veya disk kopyalarından varsayılan ya da yeni bir konuma geri yükler. Oracle Database 19c (ve 18c) sürümünde `RESTORE`, kurum içi (on-premises) veritabanı ile Oracle Cloud arasında şifrelenmemiş veya şifrelenmiş veritabanlarını taşırken `AS ENCRYPTED` veya `AS DECRYPTED` yan tümcelerini destekler. `RESTORE` komutu, `RESTORE FROM PLATFORM` veya `RESTORE ALL FOREIGN DATAFILES` kullanarak platformlar arası yedeklerin geri yüklenmesini sağlar.
* **RMAN `RECOVER` Komutu Operasyonları:** `RECOVER` komutu, geri yüklenen veri dosyalarına veya veri dosyası kopyalarına redo log dosyalarını ve artımlı yedekleri (incremental backups) uygulayarak dosyaları ileriye dönük günceller. Oracle Database 19c sürümünde depolama anlık görüntüleri (storage snapshots) kullanarak nokta zamanlı kurtarma yapmayı sağlayan `RECOVER...SNAPSHOT TIME` yöntemi kullanımdan kaldırılmıştır (deprecated). Oracle, depolama anlık görüntüsü almadan önce ve sonra `ALTER DATABASE BEGIN/END BACKUP` komutlarının çalıştırılmasını, ardından `END BACKUP` tamamlanma zamanından sonraki bir zamana veya SCN değerine `RECOVER...UNTIL TIME` ile kurtarma yapılmasını önermektedir. `RECOVER` komutu, fişlenebilir veritabanı kurtarma (`RECOVER PLUGGABLE DATABASE`) ve tablo seviyesinde kurtarma (`RECOVER TABLE`) işlemlerini yürütür.
* **RMAN `DUPLICATE` Komutu Operasyonları:** `DUPLICATE` komutu, kaynak veritabanının yedeklerini kullanarak test amaçlı benzersiz bir DBID değerine sahip kopyalanmış bir veritabanı (duplicate database) veya Data Guard ortamı için birincil veritabanı DBID değerini koruyan bir ikincil veritabanı (standby database) oluşturur. Çevrimiçi açık veritabanından doğrudan veritabanı kopyalama (active duplication) ve yedek tabanlı kopyalama (backup-based duplication) modlarını destekler. Oracle Database 18c sürümünde tanıtılan ve Oracle Database 19c sürümünde desteklenen `DUPLICATE PLUGGABLE DATABASE` komutu, `COMPATIBLE` parametresi 18.0.0 veya üzeri olduğunda bir PDB'yi mevcut bir CDB içerisine kopyalamaya izin verir.
* **RMAN `FLASHBACK DATABASE` Komutu Operasyonları:** `FLASHBACK DATABASE` komutu, veri dosyalarını yedekten geri yüklemeye gerek kalmadan Hızlı Kurtarma Alanı (FRA) içinde saklanan flashback log dosyalarını kullanarak tüm veritabanını (CDB) veya belirli bir PDB'yi belirtilen bir SCN, zaman, log sıra numarası veya geri yükleme noktasına (restore point) geri sarar. Proxy PDB üzerinde flashback operasyonları desteklenmemektedir.

---

### RMAN `RECOVER TABLE PITR` ve Yardımcı Hedef (Auxiliary Destination) İle Tablo Seviyesinde Nokta Zamanlı Kurtarma

* **Amaç ve Kullanım Senaryoları:** RMAN `RECOVER TABLE` komutu, veritabanının diğer nesnelerini etkilemeden ve tüm veritabanını geri yükleme ihtiyacı veya sistem kesintisi yaratmadan, silinen veya mantıksal olarak bozulan tabloları ya da tablo bölümlerini RMAN yedeklerinden belirli bir geçmiş nokta zamana kurtarır. Bu işlem; geri alma (undo) verisi yetersiz olduğu için Flashback Table kullanılamadığında veya DDL yapısal değişiklikleri (truncate table gibi) Flashback Table kullanımını engellediğinde tercih edilir.
* **Gereksinimler ve Yedek Kapsamı:** Hedef veritabanının ARCHIVELOG modunda ve okuma-yazma modunda olması gerekir. Fişlenebilir veritabanlarında (PDB) tablo kurtarma işlemi için root konteyner (CDB\\(ROOT), CDB şablonu (PDB\\)SEED) ve ilgili PDB'nin SYSTEM, SYSAUX ve undo tablespace yedekleri ile tablonun bulunduğu tablespace yedeği zorunludur. SYS şemasına ait nesneler veya SYSTEM/SYSAUX tablespace içindeki tablolar bu yöntemle kurtarılamaz.
* **Nokta Zaman Belirleme:** Kurtarma noktası `UNTIL TIME` (zaman ifadesi), `UNTIL SCN` (Sistem Değişim Numarası) veya `UNTIL SEQUENCE` (log sıra numarası) parametreleriyle tanımlanır.
* **Otomatik Yardımcı Veritabanı (Auxiliary Database) Süreci:**
  1. RMAN, belirtilen zaman noktasına karşılık gelen uygun yedekleri belirler.
  2. RMAN, hedef sunucudaki disk alanını kontrol eder ve `AUXILIARY DESTINATION` tümcesi (veya `SET NEWNAME` komutları) ile belirtilen konumda otomatik olarak geçici bir yardımcı veritabanı örneği oluşturur.
  3. RMAN gerekli veri dosyalarını geri yükler ve yardımcı veritabanı içinde hedef tabloları belirtilen zaman noktasına kadar kurtarır.
  4. RMAN, kurtarılan nesneleri içeren bir Data Pump döküm dosyası (export dump file) oluşturur. Döküm dosyası konumu `DATAPUMP DESTINATION` ile belirlenir (belirtilmezse `AUXILIARY DESTINATION` konumu, o da yoksa varsayılan işletim sistemi dizini kullanılır; Linux üzerinde varsayılan dizin \$ORACLE_HOME/dbs konumudur).
  5. Varsayılan olarak RMAN, Data Pump döküm dosyasını hedef veritabanına otomatik aktarır (import eder). `NOTABLEIMPORT` yan tümcesi kullanılırsa import adımı atlanır ve döküm dosyası ileride manuel Data Pump Import ile aktarılmak üzere saklanır.
* **Şema, Tablo ve Tablespace Yeniden Eşleme:** `REMAP TABLE` tümcesi kurtarılan tabloların adını değiştirmeyi sağlar. Oracle Database 12c Release 2 (12.2) sürümünden itibaren `REMAP TABLE` yan tümcesi tabloların orijinal şemadan farklı bir yeni şemaya aktarılmasına imkan tanır. `REMAP TABLESPACE` tümcesi ise tabloların farklı bir tablespace alanına aktarılmasını sağlar.
* **PDB Desteği:** Fişlenebilir veritabanlarında tablolar `RECOVER TABLE ... OF PLUGGABLE DATABASE <pdb_name>` komut satırı ile root konteynere veya ilgili PDB'ye yerel bağlanılarak kurtarılır.
* **Sürüm Durumu ve Kaynak Kapsamı:** Resmî Oracle belgeleri `RECOVER TABLE` süreçlerini Oracle Database 19c için açıklamakta ve şema yeniden eşleme özelliğinin Oracle Database 12c Release 2 (12.2) sürümünde getirildiğini belirtmektedir. Seçilen kaynaklar Oracle 26ai sürümü için `RECOVER TABLE` konusuna dair herhangi bir bilgi veya kural içermemektedir, bu nedenle Oracle 26ai detayları kaynak kapsamı dışında bırakılmıştır.

---

### Kesinti Sonrası `dba_scheduler_job_run_details` ve `v$diag_alert_ext` Sorguları İle İnceleme ve Canlıya Alım Kontrol Listelerini Güncelleme

* **Kesinti Analizi ve Sıralı Temizleme (Cleanup) Mantığı:** Eğitim kesinti notları ("Kesinti incelemesi hazırlığı, 11.11.2026.docx"), yazılım canlıya alımı (deploy) öncesinde temizlenmesi gereken toplu işlerin (batch jobs) tamamlanmaması nedeniyle yaşanan sistem kesintilerini inceler. Gece ve hafta sonu çalışan Cleanup süreçlerinin sıralı (sequential) çalıştığı, bir adım takıldığında sonraki adımların beklediği belirtilmektedir.
* **Teşhis Amaçlı Salt Okunur SQL Sorgularının Çalıştırılması:** Olay anına ait anlık görünümler (`gv$session` gibi) geçmiş veriyi korumadığı için, Diagnostics Pack veya Tuning Pack lisansı gerektirmeyen salt okunur SQL sorguları veritabanı yöneticisi (DBA) yetkileriyle çalıştırılır:
  * **`dba_scheduler_job_run_details` Görünümü:** Olay zaman aralığında (`WHERE actual_start_date BETWEEN :bas AND :bit`) Oracle Scheduler işlerinin çalışma geçmişini incelemek amacıyla `owner`, `job_name`, `status`, `actual_start_date`, `run_duration` ve `error#` sütunları sorgulanır.
  * **`v$diag_alert_ext` Görünümü:** Olay zaman aralığında (`WHERE originating_timestamp BETWEEN :bas AND :bit`) Oracle alert log kayıtlarını incelemek amacıyla mesaj metninde `%ORA-%` veya `%deadlock%` geçen ifadeler `originating_timestamp` ve `message_text` sütunlarından sorgulanır.
* **Canlıya Alım (Deploy) Kontrol Listeleri ve İzleme Eşiklerinin Güncellenmesi:**
  * Kesinti incelemesi bulguları doğrultusunda canlıya alım öncesinde açık arka plan işi kalıp kalmadığını denetleyen ("çalışan arka plan işi yok" / no active background jobs) denetim adımı canlıya alım kontrol listesine ve DBA runbook belgelerine eklenir.
  * Çalışmakta olan arka plan işlerinin çalışma sürelerini, bekleyen veya hatalı biten iş sayılarını ve Cleanup görevinin son başarılı çalışma zamanını takip eden izleme kuralları ve alarm eşikleri yapılandırılır.

---

💡 **Sonraki Adımlar:** RMAN komut kalıplarını ve `RECOVER TABLE` adımlarını pekiştirmek için Studio panelindeki **Backup and Recovery Operational Practice** bilgi grafiğini incelemek veya **RMAN Quiz** uygulamasını denemek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `e35c14f2-93a3-48bc-97bb-919d2dbc6af8`
* NotebookLM kaynağı `dd88611e-e6bf-4f32-996e-ea2a85ed30c1`
* NotebookLM kaynağı `494eab94-0a7b-410f-912a-9983479c88f7`
* NotebookLM kaynağı `f76cc808-6644-4ee4-95fa-7b0e0730e5f9`
* NotebookLM kaynağı `bb9376f9-7c81-4843-a754-a6b6f0e41bc1`
* NotebookLM kaynağı `fe661ac6-8702-4032-a9a5-bb196794fe4a`
* NotebookLM kaynağı `69cf0036-74c0-45d9-ad5f-91a557293747`
* NotebookLM kaynağı `a2c969ff-fe28-4362-a2d6-81807bf8d55c`
* NotebookLM kaynağı `9f88730c-e303-430d-af33-93a576c6f98d`
* NotebookLM kaynağı `d7d4fb71-bfab-4126-87a9-b52b14a6b928`
