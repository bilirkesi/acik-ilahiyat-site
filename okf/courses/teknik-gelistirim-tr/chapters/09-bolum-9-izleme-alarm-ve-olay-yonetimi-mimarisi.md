---
type: Chapter
title: "Bölüm 9: İzleme, Alarm ve Olay Yönetimi Mimarisi"
description: "Oracle Enterprise Manager (OEM) Cloud Control 13c/14c altyapı bileşenlerinin (OMS, OMR/SYSMAN, OMA) emctl CLI ile yönetimi öğrenilir. OEM olay yönetimi, incident rule set mantığı, karartma (blackout) "
course: teknik-gelistirim-tr
chapter: 9
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T07:22:59Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Oracle Enterprise Manager (OEM) Cloud Control 13c/14c altyapı bileşenlerinin (OMS, OMR/SYSMAN, OMA) emctl CLI ile yönetimi öğrenilir. OEM olay yönetimi, incident rule set mantığı, karartma (blackout) takvimleri ve bildirim yöntemlerini yapılandırır. Ayrıca IFS Cloud 25R1 ve 26R2 ortamlarında Application Monitoring Console (AMM), Server Alert Log kategorileri, Oracle Advanced Queues ve EFK stack panellerini kullanır.

# Sesli Ders

[Bölüm 9 sesli özeti](/audio/teknik-gelistirim-tr/chapter-9.mp3) (6:02 dk, MP3)

# Öğrenme Hedefleri

1. OEM Cloud Control 13c/14c altyapı bileşenlerini ve emctl komut satırı aracını yönetebilir.
2. OEM olay yönetimi ve incident rule set mantığı ile yanlış alarmları bastırıp kritik metrikleri olaylara dönüştürebilir.
3. IFS Cloud 25R1 ve 26R2 ortamlarında AMM metrikleri, Server Alert Log kategorileri, Advanced Queues ve EFK stack panelleri ile izleme yapabilir.

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

Seçilen kaynaklara dayanarak, kurumsal Oracle veritabanı yöneticileri ve IFS Cloud operasyon mühendisleri için belirtilen her bir öğrenme hedefi doğrultusunda öğrenilenler aşağıda açıklanmaktadır.

---

### Hedef 1: OEM Cloud Control 13c/14c Altyapı Bileşenlerini ve `emctl` Komut Satırı Aracını Yönetme

* **Çok Katmanlı OEM Altyapı Mimarisi:** Oracle Enterprise Manager (OEM) Cloud Control mimarisinin veritabanı küme bileşenlerini, ASM depolama katmanını ve sunucu donanımlarını izleyen çok katmanlı bir yapıda tasarlandığını öğrenir [1].
* **Oracle Management Service (OMS):** Oracle WebLogic Server üzerinde çalışan OMS orta katman Java EE uygulaması, host agent süreçlerinden gelen verileri işler, web tabanlı Cloud Control yönetim konsolunu sunar, yönetim işlerini yönlendirir ve bildirim alarmlarını yönetir [1].
* **Oracle Management Repository (OMR):** `SYSMAN` şemasını barındıran adanmış Oracle veritabanı olan OMR, yapılandırma verilerini, hedef sağlık metriklerini, geçmiş performans verilerini, iş yürütme günlüklerini ve olay takip verilerini saklar [1].
* **Oracle Management Agent (OMA):** Yönetilen her hedef sunucuda doğrudan çalışan hafif OMA süreci, hedef metriklerini toplar, OMS tarafından dağıtılan görevleri yürütür ve durum güncellemelerini TCP 3872 portu üzerinden OMS ortamına yükler [1].
* **Management Plug-in Bileşenleri:** Özel donanım dizileri, üçüncü taraf veritabanları veya uygulama orta katmanları için izleme yeteneklerini genişleten yazılım eklentileridir [1].
* **`emctl` Komut Satırı İle Yönetim:** Veritabanı yöneticileri, OMS sunucusu üzerinde `emctl` komut satırı aracını çalıştırarak WebLogic servislerinin, HTTP sunucusunun ve repository bağlantısının çalışma durumunu doğrular [1].
* **Yönetilen Düğümlerde `emctl` Kullanımı:** Yönetilen hedef düğümlerde (örneğin bir Oracle RAC düğümünde) `emctl` komut satırı aracı ile OMA süreç sağlığı ve OMS ile agent arasındaki iletişim durumu denetlenir [1].
* **Sürüm Bağlamı:** Eğitim çalışma notlarında bu altyapı kurulumu "OEM 13c/14c Infrastructure Setup" başlığı altında sunulmuştur [1]. Kaynaklar bu altyapı bileşenlerinin çalışma prensipleri ve `emctl` komutları için 13c ile 14c sürümleri arasında spesifik bir işlevsel fark belirtmemektedir [1].

---

### Hedef 2: OEM Olay Yönetimi ve Incident Rule Set Mantığı İle Yanlış Alarmları Bastırıp Kritik Metrikleri Olaylara Dönüştürme

* **Event ve Incident Yaşam Döngüsü:** Oracle Management Agent (OMA) hedef metriklerini sürekli örnekler; bir metrik uyarı veya kritik eşiği geçtiğinde (örneğin sunucu CPU kullanımı %95 seviyesini aştığında) sistem bir Event üretir [2].
* **Events to Incidents Promotion:** Üretilen event, ciddiyet seviyesine ve önceden tanımlanmış olay kurallarına dayanarak idari müdahale gerektiren bir Incident seviyesine otomatik yükseltilir [2].
* **Incident Rule Set Mantığı:** Rule set yapıları, event ve incident süreçlerinin temel işleyiş mantığını belirler; hedef kriterlerine, ciddiyet seviyelerine ve zaman aralıklarına göre otomatik e-posta bildirimleri gönderme, düzeltici eylem betikleri çalıştırma veya dış biletleme sistemlerinde (ServiceNow, Jira) otomatik bilet açma adımlarını yönetir [2].
* **Bildirim İletim Yöntemleri:** Bildirim iletim kanalları olarak SMTP (E-posta), SNMP tuzakları ve işletim sistemi betikleri veya webhook yöntemleri kullanılır [2].
* **Blackout Takvimleri İle Bastırma:** Planlı bakım pencerelerinde idari Blackout takvimleri tanımlanarak bildirimler geçici olarak bastırılır ve IFS staging veya üretim ortamlarında yanlış alarmların (false-positive) oluşması engellenir [2].
* **Repository Olay Kaydı Doğrulaması:** Veritabanı yöneticileri OMR repository yönetim görünümü `sysman.em_incidents` sorgusunu çalıştırarak kritik alarmların (örneğin %95'i aşan tablespace kullanımı, %95'i aşan CPU kullanımı veya 900 saniyeyi aşan Data Guard uygulama gecikmesi) başarıyla kaydedildiğini ve takip edildiğini doğrular [3].
* **Sürüm Bağlamı:** Çalışma notları bu olay yönetimi mantığını IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarına uygular [2]. Kaynaklar olay yönetimi kuralları, blackout takvimleri ve `sysman.em_incidents` görünüm sorgulaması için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [2, 3].

---

### Hedef 3: IFS Cloud 25R1 ve 26R2 Ortamlarında AMM Metrikleri, Server Alert Log Kategorileri, Advanced Queues ve EFK Stack Panelleri İle İzleme Yapma

* **IFS Cloud 25R1 EFK Stack Log İzleme Panelleri:** IFS Cloud 25R1 Remote Deploy mimarisinde günlük izleme işlemleri Elasticsearch, Fluentd ve Kibana bileşenlerinden oluşan bir EFK stack üzerinden yürütülür [4]. Elasticsearch günlük verilerini 7 günlük saklama süresiyle tutar ve günlük çalışan curator cronjob 7 günden eski günlükleri otomatik siler [4]. Fluentd log toplayıcı ve iletici rolünü üstlenir; Kibana ise Kibana Query Language (KQL) kullanarak veri görselleştirme, sorgulama ve dashboard inceleme imkanı verir [4, 5].
* **Response Time Detail View Dashboard:** Kibana arayüzüne aktarılan Response Time Detail View Dashboard, projeksiyon ve varlık (projections and entities) metriklerini varsayılan olarak en yüksek yanıt süresinden en düşük yanıt süresine doğru sıralayarak görüntüler [6, 7].
* **IFS Cloud 26R2 Application Monitoring Metrics (AMM):** AMM mimarisi arka planda metrikleri tanımlanmış ifadelere göre değerlendirir ve OK, Warning, Critical veya Unknown servis durum kodlarını üretir [8, 9].
* **IFS Cloud 26R2 Application Monitoring Console (AppMon):** Solution Manager / Monitoring / Application Monitoring altından erişilen AppMon konsolu, metrikleri uyarı limitlerine göre sunar; "Show Alarms Only" filtresi ile problemli metrikler izole edilir ve Details ekranından detaylı veriler (örneğin aktif batch queue süreçleri) incelenir [10, 11]. Foundation1 Monitoring zamanlanmış görevi günlük olarak çalışarak aktif metrikleri değerlendirir [8].
* **IFS Cloud 26R2 Server Alert Log Kategorileri:** Solution Manager / Monitoring / Server Alert Log Categories penceresinden yapılandırılan her kategori Enable (etkinleştirme), Cleanup (temizlik bayrağı) ve Days to keep (saklama süresi) parametrelerine sahiptir [12, 13]. Standart kategoriler: Ddl Audit (DDL komutlarını veritabanı tetikleyicisiyle izler), Debug, Deployment, Deployment detail, Event errors, Server Errors (tüm ORA- hatalarını AFTER ERROR tetikleyicisiyle izler), Sql Injections (Assert_SYS güvenlik denetimi hatalarını izler) ve In-Memory (In-Memory indeks silme olaylarını izler) [13, 14].
* **IFS Cloud 26R2 Oracle Advanced Queues:** Solution Manager / Monitoring / Oracle Queues penceresinden asenkron mesajlaşma kuyruk tabloları başlatılabilir, durdurulabilir ve temizlenebilir; Oracle Queue Subscribers penceresinden ise aktif aboneler izlenebilir ve kaldırılabilir [15].
* **IFS Cloud 26R2 Streams Arka Plan İş Bildirimleri:** Streams işlevselliği, `Transaction_SYS.Deferred_Call` tek seferlik işleri ve `Batch_SYS.New_Batch_Schedule` zamanlanmış görevleri tamamlandığında `Transaction_SYS.Process_All_Pending` zamanlayıcısı üzerinden son kullanıcılara bildirim gönderir [16]. Bildirimler `stream_msg_on_completion_` (TRUE) ve `stream_notes_` parametreleri ile etkinleştirilir ve `Transaction_SYS.Modify_Stream_Notification` Hooking API'si ile özelleştirilebilir [16].
* **Sürüm Bağlamı:** Kaynaklar EFK stack panellerinin ve Kibana Response Time Detail View Dashboard aracının IFS Cloud 25R1 sürümüne; AMM metriklerinin, AppMon konsolunun, Server Alert Log kategorilerinin, Oracle Queues arayüzünün ve Streams bildirimlerinin ise IFS Cloud 26R2 sürümüne ait olduğunu açıkça belirtmektedir [4, 6, 10, 13, 15-17].

---

💡 **Sonraki Adımlar:** Studio paneline eklenen **Monitoring and Incident Management Overview** bilgi grafiğini incelemek veya **IFS Cloud Quiz** uygulamasını çözerek izleme ve olay yönetimi bilgilerinizi pekiştirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `e7afec70-f348-431b-baa5-f856ab0d8631`
* NotebookLM kaynağı `32cb5d69-b326-4f17-b312-0230a7c855d0`
* NotebookLM kaynağı `a2830143-a7ee-43f3-8047-313346a164cd`
* NotebookLM kaynağı `77a5ea42-ab87-4cbb-83f2-34855168abed`
* NotebookLM kaynağı `4d0ecd0a-f694-4af2-9ff9-418504a8ebff`
* NotebookLM kaynağı `7a268338-833c-4b04-b4ee-b4b9290d557d`
* NotebookLM kaynağı `973a447c-30ca-4ae2-8915-f0da6242afd4`
* NotebookLM kaynağı `65877721-8800-43e7-a699-f8583908e370`
* NotebookLM kaynağı `904f1647-1f0b-4d2d-a274-e421d1a003d4`
* NotebookLM kaynağı `6a588993-d227-428a-9859-3a67d5583e7b`
* NotebookLM kaynağı `aacb746e-7471-4005-8c02-71ce163a18de`
* NotebookLM kaynağı `8aea0ce6-8040-4f16-975c-45ec98debcb4`
* NotebookLM kaynağı `f317d051-6a57-41ae-8473-e98554c786af`
* NotebookLM kaynağı `1d057a25-8c1e-415f-925b-d4d6a46bfebc`
