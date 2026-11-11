---
type: Chapter
title: "Bölüm 6: Data Guard, MAA Standartları ve Felaket Kurtarma Operasyonları"
description: "Öğrenci, Oracle Maximum Availability Architecture (MAA) Silver, Gold ve Platinum referans mimarilerini ve Oracle Database@Azure entegrasyonunu öğrenir. Data Guard Broker (dgmgrl) ile otomatik planlı s"
course: teknik-gelistirim-tr
chapter: 6
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Maximum Availability Architecture (MAA) Silver, Gold ve Platinum referans mimarilerini ve Oracle Database@Azure entegrasyonunu öğrenir. Data Guard Broker (dgmgrl) ile otomatik planlı switchover ve acil durum failover runbook'larını çalıştırmayı kavrar. Standby Redo Logs (SRLs) ve Real-Time Redo Apply yapılandırması ile RPO = 0 ve RTO < 5 dakika hedeflerine ulaşmayı sağlar.

# Öğrenme Hedefleri

1. Öğrenci, Oracle Database 19c için MAA Silver, Gold ve Platinum mimarilerini değerlendirip felaket kurtarma çözümlerini uygulayabilir.
2. Öğrenci, Data Guard Broker (dgmgrl) kullanarak Standby Redo Logs ve Real-Time Redo Apply ile planlı switchover ve failover operasyonlarını yönetebilir.
3. Öğrenci, Active Data Guard fiziksel standby veritabanını salt okunur modda açarak raporlama yüklerini ikincil veritabanına aktarabilir.

# Dersler

* Automated Switchover & Failover Runbooks
* Gold & Platinum MAA Standards Implementation
* RPO & RTO High Availability Optimization
* Real-Time Replica Synchronization
* Read-Only Query & Reporting Offloading
* CPU Utilization & Data Guard Lag Thresholds
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf
* Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads
* Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12
* High Availability Best Practices and Overview
* Oracle Maximum Availability Architecture for Oracle Database@Azure

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Seçili kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

---

### Hedef 1: Oracle Database 19c İçin MAA Silver, Gold ve Platinum Mimarilerini Değerlendirme ve Felaket Kurtarma Çözümlerini Uygulama

* **MAA Çerçevesi ve Mimari Katmanlar:**
  * **Bronze Katmanı:** Tek veritabanı örneği, ASM ve Flashback Teknolojisi ile uzaktan depolama yedekleme replikasyonunu birleştirir; Kurtarma Süresi Hedefi (RTO) saatler veya günler düzeyinde olup Kurtarma Noktası Hedefi (RPO) > 0 değerine sahiptir; üretim dışı, geliştirme ve sandbox ortamlarını hedefler [1].
  * **Silver Katmanı:** Oracle Real Application Clusters (RAC) veya RAC One Node ile yerel yüksek erişilebilirlik ve replike yedek depolama sunar; RTO yerel düğüm arızasında dakikalar mertebesindedir [1]. Oracle Database@Azure ortamında Exadata Database Service on Dedicated Infrastructure (ExaDB-D) üzerinde tek bir Availability Zone (AZ) içinde yerel donanım ve yazılım arızalarına karşı koruma sağlar [2-4]. Uygulama sanal makineleri (VM) ile veritabanı kümesi arasındaki gecikme aynı AZ içinde 300 mikrosaniye, AZ'ler arasında 500 mikrosaniyedir [5]. Autonomous Recovery Service (ARS) entegrasyonu ile "incremental forever" (artımlı sonsuz) yedekleme politikası sunarak saatte 42 TB yedekleme ve 8.7 TB geri yükleme hızı sağlar [6, 7].
  * **Gold Katmanı:** Oracle RAC aktif-aktif kümelemesini uzak alanda Oracle Data Guard veya Active Data Guard (ADG) fiziksel replikasyonu ile birleştirir [1, 8]. Yerel HA ve Fast-Start Failover (FSFO) sayesinde RTO < 1 dakika (veya < 5 dakika) ve sıfır veri kaybı (RPO = 0) sağlar [1, 8, 9]. Görev kritik çekirdek ERP, EAM ve FSM sistemleri (IFS Applications, Oracle E-Business Suite, SAP) için zorunlu mimaridir [8-11].
  * **Platinum Katmanı:** Gold katmanı altyapısına Oracle GoldenGate aktif-aktif replikasyonu, Application Continuity ve Edition-Based Redefinition (EBR) teknolojilerini ekler [1, 9]. Kesintisiz 24/7/365 operasyonlar için sıfır bakım penceresi etkisi ve çevrimiçi uygulama şeması yükseltmeleri sunar [1, 9].
* **Kaynak Hiyerarşisi ve Çakışma Yönetimi:** Resmî kılavuz olan "Oracle Maximum Availability Architecture for Oracle Database@Azure" belgesi, MAA Platinum Seçenek 1 mimarisi için Oracle AI Database 26ai veya üzerini ve Oracle Active Data Guard şart koşmaktadır [12, 13]. Eğitim programının mimari notu olan "Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads" ise Platinum katman standartlarını Oracle Database 19c bağlamında ele almaktadır [1]. Kaynak sıralama kuralı gereğince resmî Oracle dokümantasyonunun beyanı esas alınmış ve MAA Platinum Seçenek 1 mimarisinin Oracle AI Database 26ai veya daha yüksek bir sürüm gerektirdiği belirtilmiştir [12, 13].
* **Azure Üzerinde Bulut ve Bölgeler Arası Ağ Peering:**
  * Oracle Database@Azure üzerinde birincil ve standby Exadata sanal makine kümeleri ayrı Virtual Cloud Network (VCN) yapılarına dağıtılır [14].
  * Redo taşıma bant genişliğini artırmak ve taşıma gecikmesini düşürmek için OCI VCN Peering (Local Peering Gateway / Dynamic Routing Gateway ile) kullanılması önerilir; alternatif olarak Azure VNet Peering de kullanılabilir ancak tekil süreç redo aktarım hızı OCI Peering ile daha yüksektir [14-18]. TDE şifreleme anahtarları OCI Private Vault içinde tutulur ve bölgeler arasında replike edilir [19].
* **Sürüm Uygulaması:** Mimariler Oracle Database 19c için "Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads" notunda açıklanmış [1], Platinum Seçenek 1 için ise "Oracle Maximum Availability Architecture for Oracle Database@Azure" belgesinde Oracle 26ai vurgulanmıştır [12, 13]. Çalışma notları bu katmanları IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarına uygulamaktadır [9, 11].

---

### Hedef 2: Data Guard Broker (dgmgrl) Kullanarak Standby Redo Logs ve Real-Time Redo Apply ile Planlı Switchover ve Failover Operasyonlarını Yönetme

* **Standby Redo Logs (SRLs) Yapılandırma İlkeleri:**
  * Standby Redo Log (SRL) dosyaları hem birincil hem de standby veritabanlarında oluşturulmalıdır; böylece rol değişimlerinde her iki taraf da veri alabilir [20].
  * SRL dosya boyutları, birincil veritabanının Online Redo Log (ORL) dosyalarıyla birebir aynı boyutta olmalıdır [20].
  * Her bir redo kanalı (thread) için gerekli minimum SRL grup sayısı formülü: `Minimum SRL Grubu Sayısı = (Thread Başına ORL Grubu Sayısı) + 1` olarak hesaplanır [20].
* **Veri Taşıma ve Real-Time Redo Apply Süreçleri:**
  * Birincil veritabanındaki Log Network Server (LNS) süreci redo verisini ağ üzerinden iletir; standby tarafındaki Remote File Server (RFS) süreci bu akışı alarak doğrudan aktif SRL dosyalarına yazar [21].
  * Recovery Writer (MRP0) süreci, gelen redo verilerini SRL dosyalarından bellek ve diske anında uygulayarak geleneksel arşiv log biriktirme gecikmesini ortadan kaldırır ve Real-Time Redo Apply sağlar [21].
  * Maksimum Kullanılabilirlik (Maximum Availability) koruma modunda varsayılan olarak senkron redo taşıması (SYNC AFFIRM) kullanılır; ağ kopması durumunda sistem asenkron (ASYNC) moda düşer ve ağ düzeldiğinde tekrar senkron moda döner [22, 23].
* **Data Guard Broker (`dgmgrl`) Yönetimi ve ORA-16698 Çözümü:**
  * Data Guard Broker (`dgmgrl`) aracı; yapılandırma oluşturmayı, sağlık denetimlerini ve rol geçişlerini otomatikleştirmeyi sağlar [11, 24, 25].
  * Broker başlatılırken karşılaşılan ORA-16698 hatası (manuel `LOG_ARCHIVE_DEST_n` parametresinde `SERVICE` özniteliğinin bulunması durumu), manuel arşiv hedeflerinin temizlenmesi (`ALTER SYSTEM SET LOG_ARCHIVE_DEST_2='' SCOPE=BOTH SID='*';`) ve Broker'ın etkinleştirilmesi (`ALTER SYSTEM SET DG_BROKER_START=TRUE SCOPE=BOTH SID='*';`) ile çözülür [24, 25].
* **Rol Değişim Playbook'ları (Switchover ve Failover):**
  * **Planlı Switchover:** Birincil ve standby veritabanları arasında iki yönlü, sıfır veri kayıpsız (RPO = 0) rol değişimidir [11, 26, 27]. İşlem öncesinde tüm pending redo verileri standby tarafına aktarılır ve uygulanır [11]. Veritabanlarının yeniden oluşturulmasına gerek yoktur [11].
  * **Acil Durum Failover:** Birincil veritabanının çökmesi durumunda standby veritabanını birincil role yükselten tek yönlü acil durum işlemidir [11, 26, 27].
  * **Fast-Start Failover (FSFO):** Üçüncü bir konumda çalışan bağımsız Observer süreci aracılığıyla failover sürecini otomatikleştiren yapıdır [26, 28]. Observer birincil veritabanına ulaşamadığında ve gecikme eşiği (`FastStartFailoverThreshold`, saniye cinsinden) dolduğunda otomatik failover başlatır [26, 27, 29, 30]. FSFO kullanımı için Flashback Database özelliğinin aktif olması kesinlikle zorunludur [27].
* **Sürüm Uygulaması:** "Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads" notu bu komutları ve dgmgrl adımlarını Oracle Database 19c için detaylandırır [20, 25, 27]. Çalışma notları ise bu adımları IFS Applications (IFS Cloud, IFS Applications 10/9) ortamlarında SCAN listeners ve Fast Connection Failover (FCF) entegrasyonu ile açıklar [11, 31].

---

### Hedef 3: Active Data Guard Fiziksel Standby Veritabanını Salt Okunur Modda Açarak Raporlama Yüklerini İkincil Veritabanına Aktarma

* **Active Data Guard Salt Okunur (Read-Only) Mimarisi:**
  * Active Data Guard, fiziksel standby veritabanının arka planda Managed Recovery Process (MRP0) ile gelen redo verilerini uygulamaya devam ederken (Real-Time Apply) aynı anda salt okunur erişim (`READ ONLY`) modunda açılmasına imkan tanır [21, 32, 33].
* **Raporlama Yüklerini Devretme (Query Offloading):**
  * Ağır OLAP analitik sorguları, geniş finansal raporlar ve harici BI entegrasyonları birincil veritabanındaki CPU ve I/O kaynaklarını tüketmesin diye ikincil standby veritabanına yönlendirilir [32].
  * Böylece birincil veritabanındaki çekirdek OLTP işlemlerinin yanıt süreleri ve işlem hacmi korunur [32].
* **Fiziksel Standby Veritabanını Salt Okunur Modda Yapılandırma Adımları:**
  1. *Mevcut Yönetilen Kurtarmayı İptal Etme:* `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;` [33]
  2. *Standby Veritabanını Salt Okunur Modda Açma:* `ALTER DATABASE OPEN;` [33]
  3. *Real-Time Apply İle Yönetilen Kurtarmayı Başlatma:* `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE USING CURRENT LOGFILE DISCONNECT;` [33]
* **Durum Doğrulama ve Teşhis Sorguları:**
  * `v$database` görünümünden `database_role` sütununun `PHYSICAL STANDBY` ve `open_mode` sütununun `READ ONLY` olduğu doğrulanır [33].
  * `v$managed_standby` görünümünden `MRP0` sürecinin durumunun `APPLYING_LOG` olduğu kontrol edilir [21, 33].
  * `v$dataguard_stats` görünümünden `apply lag` (uygulama gecikmesi) metriğinin sıfıra yakın olduğu doğrulanır [33].
* **Bağlantı Yönlendirmesi:**
  * İstemci bağlantı dizeleri ve özel veritabanı servisleri (Oracle Services) kullanılarak IFS raporlama işleri ve zamanlanmış görevler doğrudan ikincil standby veritabanına yönlendirilir [32].
* **Sürüm Uygulaması:** Mimari notlar bu yapıyı Oracle 19c Gold MAA mimarisi bünyesinde sunmaktadır [34, 35]. Çalışma notları ise read-only offloading adımlarını ve SQL sözdizimini IFS Applications (IFS Cloud, IFS Applications 10/9) iş yüklerine uygulamaktadır [32, 33]. Kaynaklar genel SQL komutları için spesifik bir sürüm kısıtlaması belirtmemektedir.

---

💡 **Sonraki Adımlar:** Data Guard Broker `dgmgrl` komut setiyle Fast-Start Failover (FSFO) test senaryolarını çalıştırmak veya Studio panelinde mevcut olan **Oracle Data Guard Zero Loss Failover** sesli özeti ile **Oracle Quiz** uygulamasını incelemek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `56218126-5b69-4170-afb4-a3f353aa9cbf`
* NotebookLM kaynağı `7903b197-ddd2-465f-8faa-0ae76a992be0`
* NotebookLM kaynağı `a027bf96-9d7a-43d6-a04d-2cfd37f3f0e5`
* NotebookLM kaynağı `3d916d1d-84f9-4986-998c-0fa6a07c6a66`
* NotebookLM kaynağı `a9510843-a2a8-4a5d-8c6b-0df37bdf8077`
* NotebookLM kaynağı `475de504-e92a-4488-85d7-228e05f21e02`
* NotebookLM kaynağı `f317d051-6a57-41ae-8473-e98554c786af`
* NotebookLM kaynağı `c478de5c-7f28-44d7-aa60-9c89de9da148`
* NotebookLM kaynağı `610ba785-ac7b-42c9-9df1-a26c41af7ac1`
* NotebookLM kaynağı `4b420ef3-e08b-4c97-98ed-a14ff57fc023`
* NotebookLM kaynağı `2cce32bb-ac3a-4281-b84a-cade9a724b03`
