---
type: Quiz
title: "Ünite 6 quizi: Bölüm 6: Data Guard, MAA Standartları ve Felaket Kurtarma Operasyonları"
description: Teknik Gelişim (Türkçe) 6. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 6
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-6.md
---

# Ünite 6: Bölüm 6: Data Guard, MAA Standartları ve Felaket Kurtarma Operasyonları

Toplam 12 soru.

## 1. Oracle MAA mimarisinde enterprise ERP sistemleri (Oracle EBS, SAP) için zorunlu kılınan, yerel RAC aktif-aktif kümelenmesi ile remote site Active Data Guard (ADG) felaket kurtarma yapısını birleştiren katman hangisidir?

*İpucu:* Misyon kritik ERP ortamları için zorunlu kabul edilen ve sıfır veri kaybı hedefleyen mimari katmanı düşünün.

A) Bronze Tier
B) Silver Tier
C) Gold Tier *
D) Platinum Tier

**Cevap anahtarı:** C

**Gerekçe (C):** Gold MAA Tier, misyon kritik ERP sistemleri için zorunlu mimari olup sıfır veri kaybı ($\text{RPO} = 0$) ve 1 dakikadan az kurtarma süresi ($\text{RTO} < 1\text{ dk}$) sunar.

## 2. Oracle Data Guard mimarisinde Maximum Availability koruma modunda Standby Redo Log (SRL) grup sayısını hesaplamak için kullanılan formül hangisidir?

*İpucu:* Her bir thread için tanımlı online redo log grup sayısına ilave edilen minimum grup kuralını hatırlayın.

A) $\text{Minimum SRL Grubu} = \text{Thread Başına ORL Grubu} - 1$
B) $\text{Minimum SRL Grubu} = \text{Thread Başına ORL Grubu} + 1$ *
C) $\text{Minimum SRL Grubu} = \text{Thread Başına ORL Grubu} \times 2$
D) $\text{Minimum SRL Grubu} = \text{RAC Düğüm Sayısı} + 1$

**Cevap anahtarı:** B

**Gerekçe (B):** Standby Redo Log grup sayısı, rol değişimlerinde kesintisiz redo aktarımı için her thread'deki Online Redo Log grup sayısının en az 1 fazlası olmalıdır.

## 3. Data Guard Broker yapılandırması sırasında karşılaşılan 'ORA-16698: member has a LOG_ARCHIVE_DEST_n parameter with SERVICE attribute set' hatasını gidermek için hangi işlem yapılmalıdır?

*İpucu:* Broker dinamik yönetime geçmeden önce çakışan manuel arşiv hedeflerine ne yapılması gerektiğini hatırlayın.

A) Standby veritabanında FLASHBACK DATABASE özelliğini devre dışı bırakmak
B) Manuel olarak ayarlanmış LOG_ARCHIVE_DEST_n (örneğin LOG_ARCHIVE_DEST_2) parametre değerini temizlemek *
C) Primary veritabanını kapatıp STARTUP MOUNT modunda açmak
D) FastStartFailoverThreshold parametresini 0 saniyeye çekmek

**Cevap anahtarı:** B

**Gerekçe (B):** Manuel arşiv destinasyon parametreleri Broker'ın dinamik taşıma ayarlarıyla çakıştığı için temizlenmesi gereklidir.

## 4. Oracle Data Guard Broker mimarisinde otomatik failover sağlayan Fast-Start Failover (FSFO) bileşeninde FastStartFailoverThreshold parametresinin zaman birimi ve temel işlevi nedir?

*İpucu:* Observer bağımsız sürecinin kesintiyi algılayıp failover başlatma zaman ölçüsünü düşünün.

A) Saniye (second) cinsindendir; Observer sürecinin primary yanıt veremediğinde failover başlatmak için beklediği süredir. *
B) Dakika (minute) cinsindendir; MRP0 sürecinin Standby Redo Log yazma süresini ifade eder.
C) Milisaniye (ms) cinsindendir; Cache Fusion üzerindeki blok kilitleme süresini ayarlar.
D) Saat (hour) cinsindendir; yedekleme penceresi süresini tanımlar.

**Cevap anahtarı:** A

**Gerekçe (A):** Bu parametre saniye cinsinden olup Observer'ın birincil sunucudaki kesintiyi doğrulayıp otomatik failover'ı tetikleme sınırını belirler.

## 5. Fast-Start Failover (FSFO) mekanizmasında veri bütünlüğünü korumak ve 'split-brain' durumunu engellemek için hangi iki kritik gereksinim birlikte zorunludur?

*İpucu:* Otomatik failover sonrası eski birincil veritabanını geri döndürme teknolojisini ve 3. konumdaki kontrolcüyü hatırlayın.

A) Flashback Database zorunluluğu ve bağımsız 3. bir konumdaki Observer sürecinin heartbeat kilidi *
B) RMAN seviyesinde BCT dosyasının kapatılması ve RAC düğümlerinin durdurulması
C) Asenkron redo nakli ve manuel DBA komutu ile rol değişimi onaylama
D) Primary sunucuda çalışan Observer ve LOG_ARCHIVE_DEST_2 parametresinin silinmesi

**Cevap anahtarı:** A

**Gerekçe (A):** FSFO için Flashback Database kesinlikle zorunludur ve split-brain durumunu engellemek için Observer kalb atışı (heartbeat) denetimi yapıp kilitleme uygular.

## 6. Oracle Enterprise Manager (OEM) izleme standartlarına göre Data Guard Apply Lag (Uygulama Gecikmesi) metriği için önerilen Uyarı (Warning) ve Kritik (Critical) eşik değerleri sırasıyla nedir?

*İpucu:* Standart OEM MAA tablosundaki Apply Lag ikaz ve acil durum uyarı sürelerini düşünün.

A) $> 300 \text{ saniye}$ ve $> 900 \text{ saniye}$
B) $> 10 \text{ saniye}$ ve $> 30 \text{ saniye}$
C) $> 60 \text{ saniye}$ ve $> 300 \text{ saniye}$ *
D) $> 120 \text{ saniye}$ ve $> 600 \text{ saniye}$

**Cevap anahtarı:** C

**Gerekçe (C):** OEM MAA izleme standartlarında Apply Lag için 60 saniye üzeri uyarı, 300 saniye üzeri ise kritik alarm olarak belirlenmiştir.

## 7. Oracle Active Data Guard mimarisinde ikincil veritabanının salt okunur (read-only) açık durumdayken aynı zamanda canlı veri senkronizasyonunu sürdürmesini sağlayan teknik özellik nedir?

*İpucu:* Arşiv loglarının dolmasını beklemeden gelen veri akışını anında uygulayan mekanizmayı hatırlayın.

A) Edition-Based Redefinition (EBR) şema katmanı
B) Cache Fusion üzerinden LMD bellek eşitlemesi
C) Real-Time Apply (Gerçek Zamanlı Uygulama) ile Standby Redo Log (SRL) kullanımı *
D) Saatlik RMAN arşiv log aktarımı

**Cevap anahtarı:** C

**Gerekçe (C):** Active Data Guard, MRP0 sürecinin aktif SRL'lerden redo değişikliklerini anında uygulaması sayesinde veritabanı açıkken eşzamanlı senkronizasyon sağlar.

## 8. Real-Time Redo Apply sürecinde birincil (primary) veritabanındaki LNS sürecinden gelen redo akışını standby tarafında karşılayıp Standby Redo Log (SRL) dosyalarına yazan arka plan süreci hangisidir?

*İpucu:* Uzak siteden gelen dosya/redo akışını karşılayan sunucu sürecini düşünün.

A) MRP0 (Managed Recovery Process)
B) LMS (Global Cache Service)
C) RFS (Remote File Server) *
D) BCT (Block Change Tracking)

**Cevap anahtarı:** C

**Gerekçe (C):** RFS süreci birincil siteden ağ üzerinden gelen redo kayıtlarını alarak doğrudan Standby Redo Log dosyalarına yazar.

## 9. MAA Platinum Tier katmanını Gold Tier katmanından ayıran ve veritabanı bakım ile şema güncellemelerinde sıfır planlı kesinti (zero downtime maintenance) sağlayan temel teknolojiler hangileridir?

*İpucu:* Güncelleme esnasında şema versiyonlaması sağlayan veritabanı özelliği ile aktif-aktif veri replikasyon aracını hatırlayın.

A) Oracle GoldenGate ve Edition-Based Redefinition (EBR) *
B) Active Data Guard ve Fast-Start Failover (FSFO)
C) Oracle RAC ve Single Client Access Name (SCAN)
D) Block Change Tracking (BCT) ve RMAN Table PITR

**Cevap anahtarı:** A

**Gerekçe (A):** Platinum Tier, Gold mimarisine ek olarak çift yönlü/aktif-aktif GoldenGate replikasyonu ve EBR ile kesintisiz online bakım olanağı sunar.

## 10. Oracle Data Guard koruma modlarından Maximum Availability modunun, bir ikincil site/ağ kesintisi yaşandığında Maximum Protection modundan temel farkı nedir?

*İpucu:* İş sürekliliğini veri koruma katılığına tercih ederek birincil veritabanının açık kalmasını sağlayan mekanizmayı düşünün.

A) Primary veritabanı kapanmak yerine geçici olarak Asenkron (ASYNC) moda düşerek üretime devam eder. *
B) Primary veritabanı otomatik olarak read-only moduna geçer.
C) Data Guard Broker yapılandırmayı otomatik olarak siler.
D) Primary veritabanı veri kaybını önlemek için derhal kendini kapatır (shutdown).

**Cevap anahtarı:** A

**Gerekçe (A):** Maximum Availability modunda ikincil site erişilmez olduğunda birincil veritabanı çalışmayı kesmez, ASYNC moda geçerek kullanılabilirliği korur.

## 11. Kurumsal ERP ortamlarında uzun süren kritik bir batch işinin geçici bir ağ dalgalanması sebebiyle istenmeyen bir Fast-Start Failover (FSFO) tetiklemesini önlemek için önerilen yöntemlerden biri nedir?

*İpucu:* Observer izleme tolerans süresini ayarlamayı veya batch süresince otomatik failover'ı geçici duraklatmayı düşünün.

A) LOG_ARCHIVE_DEST_2 parametresini tamamen silip Broker'ı kapatmak
B) Standby veritabanını kapatıp SHUTDOWN IMMEDIATE konumuna getirmek
C) Primary veritabanında FORCE LOGGING modunu devreden çıkarmak
D) FastStartFailoverThreshold parametre süresini uzatmak veya devasa batch penceresinde FSFO'yu geçici olarak manuel moda almak *

**Cevap anahtarı:** D

**Gerekçe (D):** FSFO threshold süresini uzatmak veya batch süresince manuel moda geçmek, geçici yük ve ağ gecikmelerinde hatalı failover oluşmasını engeller.

## 12. Oracle Data Guard rol değişim operasyonlarında Planlı Switchover ile Plansız Failover karşılaştırıldığında, Switchover işlemi hakkında hangisi doğrudur?

*İpucu:* Bakım zamanlarında iki veritabanı arasında yapılan temiz ve çift yönlü rol değişimini hatırlayın.

A) Yalnızca asenkron (ASYNC) taşıma modunda çalıştırılabilen riskli bir işlemdir.
B) Temiz, iki yönlü bir rol değişimi olup sıfır veri kaybı ($\text{RPO} = 0$) sağlar ve veritabanının yeniden kurulmasını gerektirmez. *
C) Yalnızca 3. konumdaki Observer süreci tarafından otomatik olarak tetiklenebilir.
D) Veritabanının yeniden oluşturulmasını (re-creation) gerektiren tek yönlü bir acil durum işlemidir.

**Cevap anahtarı:** B

**Gerekçe (B):** Switchover planlı bakımlarda primary ve standby rollerini karşılıklı olarak sorunsuz şekilde değiştirir ve veri kaybı yaşatmaz.
