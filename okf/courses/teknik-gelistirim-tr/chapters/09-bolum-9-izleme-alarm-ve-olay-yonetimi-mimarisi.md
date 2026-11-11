---
type: Chapter
title: "Bölüm 9: İzleme, Alarm ve Olay Yönetimi Mimarisi"
description: Öğrenci, Oracle Enterprise Manager (OEM) Cloud Control 13c/14c altyapı bileşenlerini (OMS, OMR/SYSMAN, OMA) emctl CLI ile yönetmeyi öğrenir. OEM olay yönetimi, incident rule set mantığı, karartma (bla
course: teknik-gelistirim-tr
chapter: 9
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Enterprise Manager (OEM) Cloud Control 13c/14c altyapı bileşenlerini (OMS, OMR/SYSMAN, OMA) emctl CLI ile yönetmeyi öğrenir. OEM olay yönetimi, incident rule set mantığı, karartma (blackout) takvimleri ve bildirim yöntemlerini yapılandırır. Ayrıca IFS Cloud 25R1 ve 26R2 ortamlarında Application Monitoring Console (AMM), Server Alert Log kategorileri, Oracle Advanced Queues ve EFK stack panellerini kullanır.

# Öğrenme Hedefleri

1. Öğrenci, OEM Cloud Control 13c/14c altyapı bileşenlerini ve emctl komut satırı aracını yönetebilir.
2. Öğrenci, OEM olay yönetimi ve incident rule set mantığı ile yanlış alarmları bastırıp kritik metrikleri olaylara dönüştürebilir.
3. Öğrenci, IFS Cloud 25R1 ve 26R2 ortamlarında AMM metrikleri, Server Alert Log kategorileri, Advanced Queues ve EFK stack panelleri ile izleme yapabilir.

# Dersler

* OEM 13c/14c Infrastructure Setup
* Automated Incident Rule sets & Notifications
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-010-planning-installation-010-storage-tier-considerations-010-oracle-db-19c-Oracle-19c-Enterprise-Edition-19c-options-and-feat.pdf
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf
* screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf
* Application Monitoring Console - Technical Documentation For IFS Cloud
* Monitor Server Alert Log - Technical Documentation For IFS Cloud
* Server Alert Log Categories - Technical Documentation For IFS Cloud
* Technical Administration and Operational Governance in IFS Cloud 26R2

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Sağlanan kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

### Hedef 1: OEM Cloud Control 13c/14c Altyapı Bileşenlerini ve `emctl` Komut Satırı Aracını Yönetme

* **OEM Cloud Control Mimarisi:** Oracle Enterprise Manager (OEM) Cloud Control, Oracle RAC düğümleri, ASM depolama, PDB/CDB yapıları ve sunucu donanımları genelinde uçtan uca operasyonel görünürlük sağlayan merkezi bir yönetim çerçevesidir [1].
* **Çok Katmanlı Altyapı Bileşenleri:**
  * **Oracle Management Service (OMS):** Oracle WebLogic Server üzerinde çalışan orta katman Java EE uygulamasıdır [1]. Host agent'ları tarafından yüklenen metrikleri işler, web tabanlı Cloud Control konsolunu sunar, yönetim işlerini dağıtır ve bildirim alarmlarını yönetir [1].
  * **Oracle Management Repository (OMR):** SYSMAN şemasını barındıran adanmış bir Oracle veritabanıdır [1]. Yapılandırma verilerini, hedef sağlık metriklerini, geçmiş performans temel çizgilerini, iş yürütme günlüklerini ve olay takip verilerini saklar [1].
  * **Oracle Management Agent (OMA):** Yönetilen her hedef sunucuda doğrudan çalışan hafif bir süreçtir [1]. Hedef sağlık metriklerini toplar, OMS tarafından dağıtılan görevleri yürütür ve durum güncellemelerini TCP port 3872 üzerinden OMS'e yükler [1].
  * **Management Plug-in'ler:** Özel donanımlar, depolama dizileri, üçüncü taraf veritabanları veya uygulama orta katmanları için izleme yeteneklerini genişleten yazılım eklentileridir [1].
* **`emctl` CLI Aracı İle Yönetim:**
  * OMS sunucusu üzerinde `emctl` aracı kullanılarak WebLogic servislerinin, HTTP sunucusunun ve repository bağlantısının durumu kontrol edilir [1].
  * Yönetilen düğümlerde agent yürütme dizininde `./emctl status agent` komutu çalıştırılarak OMA süreç sağlığı ve OMS ping bağlantısı doğrulanır veya `./emctl upload agent` ile toplanan telemetri verilerinin anında OMS'e yüklenmesi sağlanır [1].
* **Sürüm Bağlamı:** Eğitim çalışma notunda bu altyapı kurulumu "OEM 13c/14c Infrastructure Setup" olarak başlıklandırılmıştır [1]. Kaynaklar bileşenlerin çalışma mantığı ve `emctl` komutları için 13c ile 14c arasında spesifik bir sürüm kısıtlaması veya farkı belirtmemektedir [1].

---

### Hedef 2: OEM Olay Yönetimi ve Incident Rule Set Mantığı İle Yanlış Alarmları Bastırıp Kritik Metrikleri Olaylara Dönüştürme

* **Event ve Incident Yaşam Döngüsü:**
  * Oracle Management Agent (OMA) hedef metriklerini sürekli örnekler; bir metrik uyarı veya kritik eşiği geçtiğinde (örneğin sunucu CPU kullanımı %95'i aştığında) bir Event üretilir [2].
  * Event, ciddiyet seviyesine ve önceden tanımlanmış olay kurallarına dayanarak idari müdahale gerektiren bir Incident seviyesine otomatik yükseltilir [2].
* **Incident Rule Set Mantığı:**
  * Rule set'ler Event ve Incident'ların işlenme mantığını belirler [2].
  * Hedef kriterlerine, ciddiyet seviyelerine ve zaman pencerelerine göre otomatik e-posta bildirimleri gönderme, düzeltici eylem betikleri çalıştırma veya dış biletleme sistemlerinde (ServiceNow, Jira) bilet oluşturma adımlarını yürütür [2].
* **Bildirim Yöntemleri ve Karartma (Blackout) Takvimleri:**
  * Bildirim iletim kanalları olarak SMTP (E-posta), SNMP tuzakları ve işletim sistemi betikleri/webhook'ları kullanılır [2].
  * Planlı bakım pencereleri sırasında bildirimleri geçici olarak bastırmak ve IFS staging veya üretim ortamlarında yanlış alarmları (false-positive) önlemek için idari Blackout takvimleri tanımlanır [2].
* **Olay Geçmişi Doğrulaması:**
  * OMR repository yönetim görünümü `sysman.em_incidents` sorgulanarak kritik olayların (örneğin %95'i aşan tablespace kullanımı, %95'i aşan CPU kullanımı veya 900 saniyeyi aşan Data Guard uygulama gecikmesi) başarıyla takip edilen incident kaydı oluşturduğu doğrulanır [3].
* **Sürüm Bağlamı:** Çalışma notları bu olay yönetimi adımlarını IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarına uygular [2, 3]. Kaynaklar bu kural kümeleri ve blackout yapılandırması için belirli bir veritabanı veya OEM sürümü kısıtlaması belirtmemektedir [2, 3].

---

### Hedef 3: IFS Cloud 25R1 ve 26R2 Ortamlarında AMM Metrikleri, Server Alert Log Kategorileri, Advanced Queues ve EFK Stack Panelleri İle İzleme Yapma

* **IFS Cloud 25R1 EFK Stack Log İzleme Panelleri:**
  * IFS Cloud 25R1 Remote Deploy mimarisinde log izleme Elasticsearch, Fluentd ve Kibana'dan oluşan bir EFK stack ile yürütülür [4].
  * Elasticsearch günlük verilerini 7 günlük zorunlu saklama süresiyle depolar ve günlük çalışan curator cronjob 7 günden eski logları siler [4].
  * Fluentd log toplayıcı ve iletici (log shipper) olarak görev yapar [4].
  * Kibana, Kibana Query Language (KQL) kullanarak veri görselleştirme, sorgulama ve dashboard inceleme imkanı verir [4, 5].
  * Ortama aktarılan Response Time Detail View Dashboard, projeksiyon ve varlık (projections and entities) metriklerini varsayılan olarak en yüksek yanıt süresinden en düşük yanıt süresine doğru sıralayarak görüntüler [6, 7].
* **IFS Cloud 26R2 Application Monitoring Metrics (AMM) ve Console (AppMon):**
  * AMM mimarisi Metric, Threshold, Service, Service Groups, Expression ve Interval hiyerarşisine dayanır ve servis durumunu OK, Warning, Critical veya Unknown olarak değerlendirir [8, 9].
  * Solution Manager / Monitoring / Application Monitoring altındaki Application Monitoring Console, metrikleri alt ve üst uyarı limitlerine göre sunar [8, 10, 11]. "Show Alarms Only" filtresi ile problemli metrikler izole edilir ve Details görünümünden detaylı veriler (örneğin aktif batch queue süreçleri) incelenir [11].
  * AMM dışa aktarılan metrik kategorileri arasında BATCH_QUEUES (BATCH_QUEUE_CONFIG, BATCH_QUEUE_ACTIVE, BATCH_QUEUE_PROC, QUEUE_PROCESSES, DEFERRED_JOBS_EXECUTING_12H, STUCK_BATCH_QUEUE_PROCESSES), QUEUE_ENTRIES - Background Jobs (QUEUE_READY, QUEUE_WAIT, QUEUE_EXEC, QUEUE_ERROR) ve DATABASE_CONFIG (SGA_TARGET, PGA_AGGREGATE_LIMIT, DB_SESSIONS, DB_ACTIVE_SESSIONS, DB_BLOCKED_SESSIONS) bulunur [12-15].
* **IFS Cloud 26R2 Server Alert Log Kategorileri:**
  * Solution Manager / Monitoring / Server Alert Log Categories sayfasından yapılandırılır [16, 17].
  * Her kategori Category ID, Description, Enable (aktifleştirme), Cleanup ve Days to keep (saklama süresi) parametrelerine sahiptir [17, 18].
  * Standart kategoriler: Ddl Audit (DDL komutlarını veritabanı tetikleyicisiyle izler), Debug, Deployment, Deployment detail, Event errors, Server Errors (tüm ORA- veritabanı hatalarını AFTER ERROR tetikleyicisiyle izler), Sql Injections (Assert_SYS güvenlik denetimi hatalarını izler) ve In-Memory (In-Memory indeks silme olaylarını izler) [17, 19, 20].
* **IFS Cloud 26R2 Oracle Advanced Queues:**
  * Solution Manager / Monitoring / Oracle Queues penceresi üzerinden asenkron mesajlaşma kuyruk tabloları başlatılabilir, durdurulabilir ve temizlenebilir; Oracle Queue Subscribers penceresi üzerinden aboneler takip edilebilir [21].
* **IFS Cloud 26R2 Streams Arka Plan İş Bildirimleri:**
  * Streams yapısı, arka plan işleri ve raporlar tamamlandığında son kullanıcılara bildirim gönderir [22]. Tek seferlik işler (`Transaction_SYS.Deferred_Call`) ve zamanlanmış görevler (`Batch_SYS.New_Batch_Schedule`) `Transaction_SYS.Process_All_Pending` zamanlayıcısı ile yürütülür [22].
  * İsteğe bağlı opt-in parametreleri `stream_msg_on_completion_` (TRUE) ve `stream_notes_` ile yapılandırılır [22]. Bildirim metinleri `Transaction_SYS.Modify_Stream_Notification` Hooking API'si ile özelleştirilebilir [22].
* **Sürüm Bağlamı:** Kaynaklar IFS Cloud 25R1 (EFK stack, Kibana Response Time Detail View Dashboard) ile IFS Cloud 26R2 (AMM metrikleri, Application Monitoring Console, Server Alert Log kategorileri, Oracle Queues ve Streams bildirimleri) arasındaki sürüme özgü araç ve arayüz farklarını açıkça belirtmektedir [4, 8, 10, 11, 16, 17, 21, 22].

---

💡 **Sonraki Adımlar:** Studio panelinde hazır olan **Monitoring and Incident Management Overview** bilgi grafiğini incelemek veya **IFS Cloud Quiz** uygulamasını çözerek izleme ve olay yönetimi bilgilerinizi pekiştirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `e7afec70-f348-431b-baa5-f856ab0d8631`
* NotebookLM kaynağı `32cb5d69-b326-4f17-b312-0230a7c855d0`
* NotebookLM kaynağı `2bbb340b-2864-4e94-9a73-76eeaa5eafa5`
* NotebookLM kaynağı `a2830143-a7ee-43f3-8047-313346a164cd`
* NotebookLM kaynağı `77a5ea42-ab87-4cbb-83f2-34855168abed`
* NotebookLM kaynağı `616bc55c-014f-43c8-b15b-1931ffae437e`
* NotebookLM kaynağı `4d0ecd0a-f694-4af2-9ff9-418504a8ebff`
* NotebookLM kaynağı `7a268338-833c-4b04-b4ee-b4b9290d557d`
* NotebookLM kaynağı `973a447c-30ca-4ae2-8915-f0da6242afd4`
* NotebookLM kaynağı `65877721-8800-43e7-a699-f8583908e370`
* NotebookLM kaynağı `904f1647-1f0b-4d2d-a274-e421d1a003d4`
* NotebookLM kaynağı `6a588993-d227-428a-9859-3a67d5583e7b`
* NotebookLM kaynağı `aacb746e-7471-4005-8c02-71ce163a18de`
* NotebookLM kaynağı `fb3e40f1-7f6c-4f7d-b4a6-5fd27b7e8cbd`
* NotebookLM kaynağı `3478a28d-34c2-4b40-b268-a32e9d1fa4c5`
* NotebookLM kaynağı `3c509258-844c-4657-9b03-94c3e07e130a`
* NotebookLM kaynağı `8aea0ce6-8040-4f16-975c-45ec98debcb4`
