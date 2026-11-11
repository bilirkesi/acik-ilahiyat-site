---
type: Chapter
title: "Bölüm 5: RAC ve Grid Infrastructure Kümeleme Mimarisi"
description: Öğrenci, Oracle Real Application Clusters (RAC) ve Grid Infrastructure bileşenlerini, private Interconnect ve High Availability IP (HAIP) yapılandırmasını öğrenir. Cache Fusion veri bloğu transferleri
course: teknik-gelistirim-tr
chapter: 5
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Real Application Clusters (RAC) ve Grid Infrastructure bileşenlerini, private Interconnect ve High Availability IP (HAIP) yapılandırmasını öğrenir. Cache Fusion veri bloğu transferleri ve Global Resource Directory (GRD) kilit koordinasyon mekanizmalarını yönetmeyi kavrar. Dynamic Database Services, SCAN dinleyicileri ve Fast Application Notification (FAN) ile yük dengeleme ve kesintisiz bağlantı failover yapısını kurar.

# Öğrenme Hedefleri

1. Öğrenci, Oracle Grid Infrastructure mimarisinde HAIP ve özel interconnect ağını yapılandırarak Cache Fusion ve GRD koordinasyonunu optimize edebilir.
2. Öğrenci, Oracle RAC ortamında aktif-aktif düğüm kümeleme ve shared storage erişim mimarisini yönetebilir.
3. Öğrenci, Dynamic Database Services, SCAN listeners ve FAN altyapısını yapılandırarak otomatik bağlantı yük dengelemesi ve failover sağlayabilir.

# Dersler

* Active-Active Node Clustering
* RAC Grid Infrastructure & Interconnect Configuration
* I/O Bottleneck Identification
* Real Application Clusters Administration and Deployment Guide - Oracle Help Center
* Oracle Real Application Clusters Real Application Clusters Administration and Deployment Guide, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Seçili kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

---

### Hedef 1: Oracle Grid Infrastructure Mimarisinde HAIP ve Özel Interconnect Ağını Yapılandırarak Cache Fusion ve GRD Koordinasyonunu Optimize Etme

* **Grid Infrastructure Yazılım Yığını:** Öğrenci, Oracle Grid Infrastructure yazılımının Oracle Clusterware ve Automatic Storage Management (Oracle ASM) teknolojilerini işletim sistemi ile veritabanı örnekleri arasında tek bir yazılım yığınında birleştirdiğini öğrenir [1, 2].
  * **Cluster Synchronization Services (CSS):** CSS bileşeni küme düğüm üyeliğini takip eder, düğüm yanıt verme durumunu denetler ve iletişim kopukluğu veya düğüm arızası durumunda split-brain senaryolarını önlemek için düğüm tahliyesini (node eviction) gerçekleştirir [1, 3].
  * **Cluster Ready Services (CRS/CRSD):** CRSD ana süreci; VIP adresleri, SCAN (Single Client Access Name) dinleyicileri, veritabanı örnekleri ve servisler gibi yüksek erişilebilirlik kaynaklarını yönetir, başarısız olan kaynakları otomatik olarak yeniden başlatır veya taşır [1, 4].
  * **Event Manager (EVM/EVMD):** EVM bileşeni küme olaylarını ve uyarılarını yayınlayarak hızlı failover rutinlerini başlatır [1, 5, 6].
* **Özel Interconnect Ağı ve HAIP Yapılandırması:** Düğümler arası ve örnekler arası iletişim için özel bir interconnect ağı kullanılır [1, 7]. Interconnect ağı internal küme iletişimini, heartbeat sinyallerini ve disk I/O operasyonuna gerek duymadan bellekler arası Cache Fusion veri bloğu transferlerini yürütür [1, 7].
  * **Protokol Bilgisi:** Interconnect ağı üzerinde örnekler arası iletişim için UDP veya Reliable Data Socket (RDS) protokolleri kullanılır; Clusterware ise UDP protokolünü kullanır [8].
  * **High Availability IP (HAIP):** Oracle Grid Infrastructure 11g Release 2 (11.2) ve sonraki sürümlerde sunulan Redundant Interconnect Usage / HAIP (High Availability IP) veya işletim sistemi seviyesinde ağ kartı birleştirme (NIC bonding), birden fazla fiziksel NIC kullanarak yüksek verim ve ağ kartı arızasında kesintisiz çalışma sağlar [1, 9].
  * **Doğrulama Görünümleri:** Veritabanı yöneticileri özel interconnect yapılandırmasını `V$CLUSTER_INTERCONNECTS`, `V$CONFIGURED_INTERCONNECTS` veya `GV$CLUSTER_INTERCONNECTS` dinamik performans görünümlerini sorgulayarak doğrular [1, 10, 11].
* **Cache Fusion ve Global Resource Directory (GRD) Koordinasyonu:** Cache Fusion, bir veritabanı örneğinin bellek önbelleğinde bulunan veri bloklarının kopyalarını özel interconnect ağı üzerinden talep eden diğer örneğin bellek önbelleğine doğrudan aktaran disksiz bir bellek tutarlılık mekanizmasıdır [12-14].
  * **Kaynak Yönetimi:** Global Cache Service (GCS) ve Global Enqueue Service (GES) süreçleri, tampon bellek bloklarını ve kilitleri Global Resource Directory (GRD) içinde koordine eder [15-17].
  * **GRD Bellek Tüketimi:** GRD içeriği tüm aktif veritabanı örnekleri arasında dağıtılır ve bellek kullanımı toplam SGA alanının yaklaşık yüzde 10'una denk gelir [15].
  * **Arka Plan Süreçleri:** Global Cache Service Processes (LMS/LMSn) veri dosyası durumlarını ve önbelleğe alınmış blok bilgilerini GRD kayıtlarına işler, mesaj akışını yönetir ve blok görüntülerini aktarır [18, 19]. Global Enqueue Service Monitor (LMON) küme genelindeki kilitleri ve kaynakları izler, kilit kurtarmayı yönetir [20, 21]. Global Enqueue Service Daemon (LMD) ise gelen uzak kaynak taleplerini yönetir [17, 20].
* **Sürüm Uygulaması:** Resmî Oracle belgeleri bu özellikleri Oracle Database 19c ve Oracle Grid Infrastructure 19c sürümleri için detaylandırır [22-24]. Eğitim mimari notları ise Grid Infrastructure ve interconnect yapılandırmasını IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarına uygular [1].

---

### Hedef 2: Oracle RAC Ortamında Aktif-Aktif Düğüm Kümeleme ve Shared Storage Erişim Mimarisini Yönetme

* **Aktif-Aktif Düğüm Kümeleme Mimarisi:** Aktif-aktif düğüm kümelemesi, tek bir veritabanına erişen birden fazla veritabanı örneği (one-to-many ilişkisi) çalıştırarak tekil sunucu darboğazlarını ortadan kaldırır [12, 25].
  * **Eşzamanlı İşlem:** Aktif-pasif yapıların aksine, aktif-aktif mimarideki tüm düğümler eşzamanlı olarak aktif bağlantıları kabul eder ve IFS Applications (ERP, EAM, FSM) orta katman bağlantı havuzlarından gelen işlemleri yürütür [12].
  * **Bağımsız Bellek ve Arka Plan Süreçleri:** Kümedeki her bir düğüm kendi System Global Area (SGA) bellek yapılarını ve arka plan süreçlerini çalıştırır [12].
  * **Veritabanı Nesneleri:** Her veritabanı örneği en az bir ek redo izine (thread of redo) ve örneğe özel bir undo tablespace alanına sahiptir [26-28].
* **Paylaşılan Depolama (Shared Storage) Mimarisi:** Tüm küme örnekleri aynı paylaşılan veritabanı dosyalarını (veri dosyaları, kontrol dosyaları, SPFILE ve online redo log dosyaları) okur ve yazar [12, 29].
  * **Depolama Seçenekleri:** Paylaşılan depolama küme uyumlu çözümler gerektirir; Oracle Automatic Storage Management (Oracle ASM), Oracle Automatic Storage Management Cluster File System (Oracle ACFS) veya sertifikalı NFS çözümleri desteklenir [12, 24].
  * **Yedeklilik Modelleri:** Oracle ASM disk grupları veri güvenliğini sağlamak için Normal Redundancy (2 yönlü aynalama), High Redundancy (3 yönlü aynalama) veya External Redundancy (donanım/SAN aynalaması) modellerini sunar [30].
* **Küme Yönetimi ve Doğrulama:**
  * **Yönetim Modelleri:** Oracle RAC veritabanları Administrator-managed (örneklerin belirli düğümlere statik atanması) veya Policy-managed (server pool ve kardinalite bazlı) modelleriyle yönetilebilir [31, 32].
  * **Küme Durumu Doğrulama:** Veritabanı yöneticileri kümedeki aktif veritabanı örneklerinin durumunu ve paylaşılan veritabanı özelliklerini SQL*Plus üzerinden global dinamik performans görünümlerini (`GV$`) sorgulayarak veya SRVCTL ve Enterprise Manager araçlarını kullanarak doğrular [12, 33, 34].
* **Sürüm Uygulaması:** Resmî Oracle belgeleri aktif-aktif kümeleme ve paylaşılan depolama yönetimini Oracle Database 19c için tanımlar [22, 24, 25]. Eğitim mimari notları bu aktif-aktif küme mimarisini IFS Applications (IFS Cloud, IFS Applications 10/9) platformlarına uygular [12].

---

### Hedef 3: Dynamic Database Services, SCAN Listeners ve FAN Altyapısını Yapılandırarak Otomatik Bağlantı Yük Dengelemesi ve Failover Sağlama

* **Dynamic Database Services Yapılandırması:** Uygulamaların veritabanına kamu ağı (public network) üzerinden bağlanması için Dynamic Database Services kullanılması önerilir [35].
  * **Özel Servis Oluşturma:** Veritabanı kurulumuyla otomatik oluşturulan varsayılan veritabanı servisleri (`DB_NAME`, `DB_UNIQUE_NAME`, `PDB_NAME`) uygulama bağlantıları için kullanılmamalıdır; DBAlar `srvctl` veya Enterprise Manager ile kullanıcı tanımlı dinamik servisler oluşturmalıdır [36-38].
  * **Servis Yerleşimi:** Servisler belirli veritabanı örneklerine veya server pool yapılarına adanarak singleton (tek bir örnekte çalışan) veya uniform (tüm aktif örneklerde çalışan) olarak tanımlanabilir [31, 39].
* **Single Client Access Name (SCAN) ve Dinleyici Yönlendirmesi:** SCAN, DNS veya Grid Naming Service (GNS) içinde tanımlanan ve kümedeki üç SCAN VIP adresine döngüsel (round-robin) olarak çözümlenen tek bir ağ adıdır [40-42].
  * **Bağlantı Yönlendirme Adımları:**
    1. İstemci SCAN adına (public ağdaki SCAN VIP) bağlanarak servis adını SCAN dinleyicisine iletir [40].
    2. SCAN dinleyicisi ilgili servisi barındıran en uygun veritabanı örneğini belirler ve istemciyi o düğümdeki yerel dinleyiciye (local/node listener) yönlendirir [40].
    3. Düğüm VIP adresi üzerinde dinleyen yerel dinleyici, istemci bağlantısını yerel veritabanı örneğine bağlar [40].
  * **HTTP Protokol Desteği:** Oracle Database 12c Release 2 (12.2) ile birlikte SCAN dinleyicileri HTTP protokolünü tanıyarak HTTP istemcilerini küme düğümlerine yönlendirme yeteneğine sahip olmuştur [43, 44].
  * **Valid Node Checking:** Valid Node Checking for Registration (VNCR) özelliği, yalnızca izin verilen IP adresi veya alt ağların SCAN dinleyicisine dinamik servis kaydı yapmasını sağlar [45-47].
* **Fast Application Notification (FAN) ve ONS Altyapısı:** FAN, Oracle RAC yüksek erişilebilirlik çerçevesinin bir parçası olup veritabanı, düğüm, ağ ve servis durum değişikliklerini (UP ve DOWN olayları) ile Load Balancing Advisory metriklerini gerçek zamanlı yayınlar [48-50].
  * **ONS İletim Mekanizması:** Oracle Database 12c Release 2 (12.2) ve sonraki sürümlerde tüm istemciler FAN olaylarını almak için Oracle Notification Service (ONS) kullanır [42].
  * **Fast Connection Failover (FCF):** Entegre Oracle istemcileri (JDBC Thin, OCI, ODP.NET, Universal Connection Pool, WebLogic Server Active GridLink) ONS üzerinden FAN olaylarına abone olarak Fast Connection Failover (FCF) sağlar; bu sayede istemciler TCP/IP zaman aşımı askıda kalmalarından anında kurtulur ve kesintiye uğrayan ölü bağlantıları derhal temizler [42, 48, 49, 51-54].
* **Yük Dengeleme (Load Balancing) Yöntemleri:**
  * **Client-Side Load Balancing:** İstemci bağlantı tanımında `LOAD_BALANCE=ON` ayarlanarak gelen isteklerin SCAN dinleyicileri arasında rastgele dağıtılması sağlanır [44, 55].
  * **Server-Side Load Balancing:** SCAN dinleyicileri, servisin `-clbgoal` parametresine (`SHORT` veya `LONG`, Oracle tarafı `LONG` önerir) göre istemciyi en az yüklü veritabanı örneğine yönlendirir [44, 56, 57].
  * **Runtime Connection Load Balancing:** Bağlantı havuzları, ONS üzerinden yayınlanan Load Balancing Advisory olaylarını (`SERVICEMETRICS`) ve `-rlbgoal` ayarlarını (`SERVICE_TIME` veya `THROUGHPUT`) kullanarak iş taleplerini en iyi servis kalitesini sunan veritabanı örneklerine dinamik olarak yönlendirir [58-62].
  * **İstemci Bağlantı Dizesi Parametreleri:** İstemci TNS veya JDBC bağlantı dizelerinde `CONNECT_TIMEOUT`, `RETRY_COUNT`, `RETRY_DELAY`, `TRANSPORT_CONNECT_TIMEOUT` ve `FAILOVER=ON` parametrelerinin tanımlanması önerilir [57, 63, 64].
* **Oturum Boşaltma (Session Draining) ve Uygulama Sürekliliği:**
  * **Server-Side Session Draining:** Oracle Database 18c ile birlikte veritabanı seviyesinde sunucu tarafı oturum boşaltma özelliği getirilmiştir [65, 66]. Planlı bakım öncesinde gönderilen FAN planned DOWN olayları, FAN uyumlu bağlantı havuzlarının boşta duran oturumları kapatmasını ve aktif oturumları belirlenen `-drain_timeout` süresi içinde istek sınırlarında (request boundaries) kesintisiz boşaltmasını sağlar [65-69].
  * **Transparent Application Continuity (TAC):** Oracle Database 18c ile tanıtılan ve servis üzerinde `FAILOVER_TYPE=AUTO` ayarlanarak etkinleştirilen TAC, oturum ve işlem durumlarını şeffaf bir şekilde izleyerek kesintiler sonrasında oturumların güvenli bir şekilde failover edilmesini ve replaying yapılmasını sağlar [70, 71].
* **Sürüm Uygulaması:** Resmî belgeler SCAN dinleyici HTTP desteğini Oracle Database 12c Release 2 (12.2), sunucu tarafı session draining özelliğini Oracle Database 18c, TAC özelliğini Oracle Database 18c ve ONS varsayılan iletimini Oracle Database 12c Release 2 (12.2) olarak belirtir [42, 43, 65, 70]. Eğitim mimari notları EVM ve FAN altyapısını IFS Applications bağlantı havuzları failover rutinlerine uygular [1].

---

💡 **Sonraki Adımlar:** Küme genelindeki Cache Fusion trafiğini incelemek üzere `GV$CLUSTER_INTERCONNECTS` sorgularını çalıştırmak veya Studio panelinde hazır bulunan **RAC ve Grid Infrastructure** test uygulamasını çözerek bilgilerinizi pekiştirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `65c64754-fed7-4cdb-bcf3-e8fe3fdffe7c`
* NotebookLM kaynağı `0fe5fc0b-dbd0-4138-b90d-133c75d3abec`
* NotebookLM kaynağı `b4fb30df-ece6-4bb1-96cd-28c0ef4d8f3c`
* NotebookLM kaynağı `c228343b-b3bb-400d-a65d-bf7606a93b5d`
* NotebookLM kaynağı `e3ee6100-2d00-472d-a88d-3958b21025fd`
