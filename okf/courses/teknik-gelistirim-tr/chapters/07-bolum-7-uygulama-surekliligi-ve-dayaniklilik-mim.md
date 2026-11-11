---
type: Chapter
title: "Bölüm 7: Uygulama Sürekliliği ve Dayanıklılık Mimarisi"
description: Öğrenci, Oracle Application Continuity (AC) ve Transparent Application Continuity (TAC) servis parametrelerini srvctl ile yapılandırmayı öğrenir. Transaction Guard ve Logical Transaction ID (LTXID) me
course: teknik-gelistirim-tr
chapter: 7
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T19:31:19Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Application Continuity (AC) ve Transparent Application Continuity (TAC) servis parametrelerini srvctl ile yapılandırmayı öğrenir. Transaction Guard ve Logical Transaction ID (LTXID) mekanizmaları ile kesinti anında işlemlerin tekrarlanmasını ve kesintisiz oturum failover'ını kavrar. IFS orta katman bağlantı yeniden kurma mantığını ve Fast Connection Failover (FCF) entegrasyonunu test eder.

# Sesli Ders

[Bölüm 7 sesli özeti](/audio/teknik-gelistirim-tr/chapter-7.mp3) (6:32 dk, MP3)

# Öğrenme Hedefleri

1. Öğrenci, srvctl ile Oracle Database 19c üzerinde TAC ve AC servis parametrelerini (-failovertype AUTO, -commit_outcome TRUE) yapılandırabilir.
2. Öğrenci, Application Continuity ve Transaction Guard ile kesintiler sırasında in-flight işlemlerin şeffaf bir şekilde yeniden çalıştırılmasını sağlayabilir.
3. Öğrenci, IFS orta katman bağlantı mantığını ONS ve SCAN üzerinden test ederek kesintisiz oturum aktarımı ve oturum boşaltma süreçlerini doğrulayabilir.

# Dersler

* IFS Mid-Tier Re-connection Logic Testing
* screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf
* 28 Application Continuity for Java - Database - Oracle Help Center
* Application Continuity for the Oracle Database
* Monitoring - Technical Documentation For IFS Cloud

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

**srvctl ile Oracle Database 19c Üzerinde TAC ve AC Servis Parametrelerini Yapılandırma**

* Oracle RAC ortamlarında Transparent Application Continuity (TAC) ve manuel Application Continuity (AC) destekleyen kullanıcı tanımlı veritabanı servisleri `srvctl` komut satırı aracı ile oluşturulur ve değiştirilir [1-3]. Single-instance veritabanlarında ise servisler `DBMS_SERVICE` paketi kullanılarak yapılandırılır [4].
* Servis oluşturulurken `-failovertype AUTO` parametresinin ayarlanması, Oracle Database 18c sürümünde tanıtılan ve Oracle Database 19c sürümünde desteklenen Transparent Application Continuity (TAC) modunu etkinleştirir [2, 5, 6]. TAC, oturum durumunu ve işlem bağlamını şeffaf bir şekilde izleyerek uygulama kodunda değişiklik yapılmasına gerek kalmadan kesinti sonrası oturumların kurtarılmasını sağlar [7, 8].
* Servis üzerinde `-failovertype TRANSACTION` parametresinin ayarlanması, Oracle Database 12c Release 1 (12.1) sürümünde sunulan manuel Application Continuity (AC) modunu yapılandırır [3, 9]. Manuel AC, uygulama taraflı istek sınırlarının (`beginRequest` ve `endRequest`) tanımlanmasını gerektirir [10, 11].
* Servis parametresi `-commit_outcome TRUE` olarak ayarlandığında Transaction Guard etkinleştirilir [2, 12]. Transaction Guard, her işleme benzersiz bir Mantıksal İşlem Kimliği (LTXID) atayarak kesinti sonrasında işlemin taahhüt durumunu sorgular ve mükerrer işlem çalıştırılmasını önler [12-14].
* Servis parametresi `-failover_restore AUTO` olarak ayarlandığında, TAC modunda oturum yeniden kurulurken yaygın NLS ayarları, zaman dilimleri, paket değişkenleri ve varsayılan oturum durumları otomatik olarak geri yüklenir [2, 15, 16]. Oracle Database 19c sürümünde `-failovertype AUTO` tanımlandığında `-failover_restore` değeri otomatik olarak `AUTO` yapılır [15]. Manuel AC modunda ise `-failover_restore LEVEL1` ayarlanarak önceden belirlenmiş temel oturum durumları geri yüklenir [3, 15].
* Oracle Database 19c sürümünde `FAILOVER_TYPE` parametresi `AUTO` yapıldığında, Oracle JDBC sürücüsü yeniden çalışma veri kaynağı üzerinden oluşturulan her yeni fiziksel bağlantıda implicit olarak bir istek başlatır (`beginRequest`), böylece üçüncü taraf bağlantı havuzları kod değişikliği yapmadan TAC kullanabilir [17].
* Veritabanı yöneticileri `srvctl` komutu ile `-clbgoal SHORT` (veya `LONG`), `-rlbgoal SERVICE_TIME`, `-failoverretry 30` (veya `1`), `-failoverdelay 10` (veya `3`), `-replay_init_time 1800` (veya `600`), `-retention 86400`, `-notification TRUE`, `-drain_timeout 300` ve `-stopoption IMMEDIATE` parametrelerini tanımlar [2, 3, 18].
* **Sürüm Bağlamı:** TAC ve `-failovertype AUTO` kullanımı Oracle Database 18c sürümünde getirilmiş ve Oracle Database 19c sürümünde desteklenmiştir [5, 7, 8, 17]. Manuel AC modundaki `-failovertype TRANSACTION` kullanımı Oracle Database 12c Release 1 (12.1) sürümüne aittir [9]. Kaynaklar genel `srvctl` parametre sözdizimlerinin diğer sürümler için olan kısıtlamalarını ayrıca belirtmemektedir.

---

**Application Continuity ve Transaction Guard ile In-Flight İşlemlerin Şeffaf Şekilde Yeniden Çalıştırılması**

* Application Continuity (AC), planlı bakım veya beklenmeyen veritabanı kesintileri sonrasında oturum durumunu ve işlem bağlamını yeniden inşa ederek taahhüt edilmemiş veya tamamlanmamış in-flight veritabanı isteklerini yeni veritabanı örneği üzerinde güvenli bir şekilde yeniden çalıştırır [9, 19, 20].
* Application Continuity özelliğinin çalışması için Transaction Guard kullanımı zorunludur [13]. Transaction Guard, kesinti sırasında işlemin veritabanında taahhüt edilip edilmediğini doğrulamak için LTXID yapısını kullanır ve mükerrer işlem yürütülmesini engeller [12, 14].
* Transparent Application Continuity (TAC), uygulama çağrılarını izleyerek durum kullanımını kategorize eder ve açık imleç veya açık işlem bulunmayan emniyetli noktalarda örtük istek sınırları (implicit request boundaries) tespit ederek işlemleri kod değişikliği gerektirmeden kurtarır [6-8].
* Manuel Application Continuity (AC) modunda ise bağlantı havuzları veya uygulama kodları `oracle.jdbc.OracleConnection` arabirimindeki `beginRequest` ve `endRequest` API'lerini kullanarak istek sınırlarını açıkça bildirir; bu sınırlar bellek tüketimini azaltır ve kaydedilen çağrı geçmişini temizler [10, 11].
* Yeniden çalıştırma koruma seviyeleri ve metrikleri veritabanı içinde `V$SESSTAT`, `V$SYSSTAT` ve Oracle Database 19c sürümünün sonraki versiyonlarında `V$SERVICE_STATS` görünümleri üzerinden izlenebilir [21]. Ayrıca `ReplayableConnection.getReplayStatistics()` API'si ile toplam istek, korunan çağrı ve başarılı replay sayıları elde edilebilir [22, 23].
* E-posta gönderimi (`UTL_SMTP`), HTTP çağrıları (`UTL_HTTP`) veya harici dosya aktarımı gibi tekrarlanmaması gereken harici yan etkileri (side effects) bulunan isteklerde, `ReplayableConnection` üzerindeki `disableReplay()` API'si çağrılarak ilgili istek için replay devre dışı bırakılır [24-26]. TAC modunda ise sistem çalışma zamanında yan etkileri otomatik olarak tespit eder ve bu istekler için replay yakalamasını geçici olarak durdurur [27].
* **Sürüm Bağlamı:** TAC ve örtük istek tespiti Oracle Database 18c sürümünde tanıtılmış ve Oracle Database 19c sürümünde desteklenmiştir [7, 8, 17]. Manuel AC ise Oracle Database 12c Release 1 (12.1) sürümünden itibaren mevcuttur [9]. `V$SERVICE_STATS` üzerinden koruma istatistiklerinin takibi Oracle Database 19c sürümünün sonraki versiyonlarına aittir [21].

---

**IFS Orta Katman Bağlantı Mantığını ONS ve SCAN Üzerinden Test Etme ve Oturum Boşaltma Süreçlerini Doğrulama**

* Enterprise ortamlarda çalışan IFS Applications (IFS Cloud, IFS Applications 10/9) sistemleri, veritabanı kesintilerini ve Active Data Guard rol değişimlerini algılamak için Fast Connection Failover (FCF) ve Oracle Notification Service (ONS) altyapısını kullanır [20].
* ONS, küme durum değişikliklerini (FAN olayları) varsayılan 6200 portu üzerinden yayınlayarak JDBC Universal Connection Pool (UCP) veya WebLogic Server bağlantı havuzlarını anında bilgilendirir [20, 28-30]. FCF mekanizması, kopan veya çöken veritabanı bağlantılarını geçersiz kılar ve bağlantı havuzunun TCP/IP zaman aşımı askıda kalmalarına düşmeden yeni bağlantılar açmasını sağlar [20, 28].
* SCAN dinleyicileri (Single Client Access Name), ilk bağlantı isteklerini aktif RAC düğümlerine yönlendirir ve küme genelinde yük dengelemesi sağlar [20, 31, 32].
* İstemci JDBC bağlantı dizesinde `CONNECT_TIMEOUT`, `RETRY_COUNT`, `RETRY_DELAY`, `TRANSPORT_CONNECT_TIMEOUT`, `FAILOVER=ON` ve SCAN VIP adreslerini içeren `ADDRESS_LIST` tanımlarının yapılması gereklidir [33-35]. UCP veri kaynaklarında ONS bildirimlerini almak için `fastConnectionFailoverEnabled=true` ayarlanır ve `onsConfiguration` veya auto-ONS yapılandırılır [20, 29, 36].
* Planlı bakım sırasında, FAN planned-down olayları yayınlandığında FAN uyumlu bağlantı havuzları boşta duran oturumları kapatır ve aktif oturumların yürütülen iş tamamlandığında kesintisiz şekilde kapanmasını sağlar [37-39]. İşlemler belirlenen `drain_timeout` (örneğin 300 saniye) süresi içinde tamamlanamazsa `stopoption` (`IMMEDIATE`) devreye girer [18, 38, 39]. Oracle Database 18c sürümünden itibaren veritabanının kendisi de güvenli boşaltma noktalarını tespit ederek oturumları otomatik boşaltır [37, 39, 40].
* **IFS Orta Katman Failover Test Adımları:**
  1. IFS orta katman veri kaynağı bağlantı URL'si SCAN dinleyici sözdizimiyle yapılandırılır ve `PoolDataSourceFactory` üzerindeki `setONSConfiguration` mülkü ile ONS düğümleri tanımlanır [20].
  2. Data Guard Broker arayüzünden `SWITCHOVER TO <standby_database>;` komutu çalıştırılarak birincil veritabanı rolü standby veritabanına devredilir [20, 41].
  3. IFS uygulama sunucusu günlük dosyaları (log files) incelenerek ONS FCF olaylarının alındığı, geçersiz bağlantıların havuzdan temizlendiği ve SQL sorgularının yeni birincil veritabanı örneği üzerinde kesintisiz çalışmaya devam ettiği doğrulanır [20].
* **Sürüm Bağlamı:** Sunucu tarafı oturum boşaltma (server-side draining) Oracle Database 18c sürümünde getirilmiştir [37, 39]. Bağlantı dizesindeki `TRANSPORT_CONNECT_TIMEOUT` parametresi Oracle Database Release 12.1.0.2 sürümünden itibaren geçerlidir [33]. İstemcide auto-ONS yapılandırması Oracle Database 12c ve sonrası istemci sürümlerinde desteklenmektedir [36, 42].

---

💡 **Sonraki Adımlar:** Universal Connection Pool (UCP) verilerini incelemek üzere Studio panelinde hazır bulunan **Application Continuity and Resilience** bilgi grafiğini veya **Application Continuity Quiz** uygulamasını denemek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `3d088243-3b09-4681-89e4-2a1a550147e9`
* NotebookLM kaynağı `7eedf1cb-fad7-4386-b919-18be8fb65007`
* NotebookLM kaynağı `2b498d6c-9371-4784-b2ce-35dee646323e`
