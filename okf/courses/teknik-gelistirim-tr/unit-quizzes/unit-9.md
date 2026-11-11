---
type: Quiz
title: "Ünite 9 quizi: Bölüm 9: İzleme, Alarm ve Olay Yönetimi Mimarisi"
description: Teknik Gelişim (Türkçe) 9. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 9
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-9.md
---

# Ünite 9: Bölüm 9: İzleme, Alarm ve Olay Yönetimi Mimarisi

Toplam 12 soru.

## 1. Oracle Enterprise Manager (OEM) 13c/14c mimarisinde, yönetilen sunucu ve veritabanı hedeflerinden performans metriklerini toplayan ve 3872 portu üzerinden Oracle Management Service (OMS) ile iletişim kuran bileşen hangisidir?

*İpucu:* Yönetilen sunucu düğümlerinde konuşlandırılan ve merkez sistemle iletişim kuran hafif ajanı anımsayın.

A) Oracle Management Repository (OMR)
B) Oracle WebLogic Server Console
C) Management Plug-in
D) Oracle Management Agent (OMA) *

**Cevap anahtarı:** D

**Gerekçe (D):** Yönetilen her hedef sunucu üzerinde doğrudan çalışan ve topladığı metrikleri 3872 portu üzerinden orta katman OMS bileşenine aktaran hafif süreç OMA'dır.

## 2. OEM Cloud Control üzerinde ham bir metrik uyarısı kritik eşiği aştığında, bu olayın bir operasyonel olaya (Incident) dönüştürülmesini ve e-posta veya biletleme sistemlerine bildirim yönlendirilmesini sağlayan mekanizma nedir?

*İpucu:* Eşik ihlallerini eyleme dönüştüren ve bildirim boru hattını yöneten kural yapılandırmasını düşünün.

A) Administrative Blackouts (Yönetsel Karartmalar)
B) SMTP Transport Channels
C) Incident Rule Sets (Olay Kural Setleri) *
D) Management Repository Views

**Cevap anahtarı:** C

**Gerekçe (C):** Kural setleri, olayların önem derecesine ve hedef kriterlerine göre bildirim e-postası gönderme, betik tetikleme veya harici bilet oluşturma mantığını yönetir.

## 3. OEM veritabanı deposunda (OMR) son 24 saat içinde kaydedilen 'Critical' seviyesindeki olayları sorgulamak isteyen bir veritabanı yöneticisi hangi tablo veya görünümü kullanmalıdır?

*İpucu:* SYSMAN şeması altında olay (incident) kayıtlarını tutan repository tablosunu anımsayın.

A) sysman.em_incidents *
B) sysman.em_target_status
C) sysman.em_events_history
D) sysman.em_alert_rules

**Cevap anahtarı:** A

**Gerekçe (A):** OEM repository içerisinde oluşturulan olayların durumunu, önem derecesini ve oluşturulma zamanını saklayan resmi SYSMAN görünümü sysman.em_incidents yapısıdır.

## 4. IFS Cloud 26R2 arka plan işleme (Background Processing) mimarisinde, yürütülen bir arka plan işinin terminal durumlardan biri olan 'Warning' durumuna geçmesinin anlamı ve bu durumdaki işin modifikasyon kuralı nedir?

*İpucu:* Tamamlanmış ancak bilgi mesajı üretmiş işlerin değiştirilebilirlik kısıtını göz önüne getirin.

A) İş çalıştırma esnasında durdurulmuştur; parametreleri yeniden yapılandırılarak derhal çalıştırılabilir.
B) İş harici bir sunucu tarafından yürütülmektedir; yalnızca sistem yöneticisi tarafından silinebilir.
C) İş mantığı tamamlanmıştır ancak fonksiyonel uyarılar almıştır; tamamlanmış kabul edildiği için kullanıcılar tarafından düzenlenemez. *
D) İş henüz işleyici süreç tarafından alınmamıştır; kuyruk ataması veya parametreleri değiştirilebilir.

**Cevap anahtarı:** C

**Gerekçe (C):** Warning durumu, işin tamamlandığını ancak WARNING tipinde alt mesajlar kaydettiğini gösterir ve bitmiş bir iş süreci olduğu için parametreleri artık değiştirilemez.

## 5. IFS Cloud 26R2 Solution Manager üzerindeki varsayılan arka plan işi temizleme parametrelerine göre, 'Ready' (Tamamlandı) durumundaki arka plan işleri Light Cleanup tarafından silinmeden önce kaç gün saklanır?

*İpucu:* Başarıyla tamamlanmış standart işlerin sistemde kalma gün sayısını düşünün.

A) 60 saniye
B) 180 gün
C) 7 gün *
D) 30 gün

**Cevap anahtarı:** C

**Gerekçe (C):** Varsayılan 'Cleanup age limit in days for completed background jobs' parametresi 7 gün olarak belirlenmiştir.

## 6. IFS Cloud 26R2'de kritik bir arka plan işinin teşhis verilerinin rutin bakım temizlikleri (Foundation1 Light Cleanup) sırasında silinmesini engellemek için yönetici tarafından hangi bayrak ayarlanmalıdır?

*İpucu:* İş kaydını bakım temizlik süreçlerinin kapsamı dışında tutan bayrağı anımsayın.

A) Logging of background processes
B) TOKEN_UPDATE_INTERVAL
C) Scheduled tasks process startup
D) Exclude from Cleanup *

**Cevap anahtarı:** D

**Gerekçe (D):** 'Exclude from Cleanup' bayrağı, genel sistem parametrelerindeki saklama sürelerini geçersiz kılarak ilgili iş kaydını temizlik sweeps işlemlerinden korur.

## 7. Oracle Enterprise Edition üzerinde kullanılabilen 'Shrink LOB segments' bakım görevinin canlı çalışma saatlerinde yürütülmesinin temel operasyonel riski nedir?

*İpucu:* LOB segment alanlarını küçültürken veritabanı tabloları üzerinde uygulanan kilit türünü düşünün.

A) Foundation1 Light Cleanup parametresini otomatik olarak 180 günden 7 güne düşürmesi.
B) Application Owner hesabını kilitleyerek tüm dış kullanıcı oturumlarını derhal sonlandırması.
C) LOB alanlarını boşaltırken hedef tablo segmentlerine özel (exclusive) kilit koyarak DDL ve uygulama işlemlerini engellemesi. *
D) Oracle Management Agent (OMA) sürecini kapatıp 3872 portunu erişilemez hale getirmesi.

**Cevap anahtarı:** C

**Gerekçe (C):** Alan geri kazanımı sırasında koyulan exclusive segment kilitleri, eşzamanlı çalışan uygulama işlemlerini ve dağıtım senaryolarını kilit çakışması nedeniyle durdurabilir.

## 8. IFS Cloud 26R2'de veritabanı kilitleri nedeniyle ConnectTimerPostForwarder gibi entegrasyon servisleri 5000 ms zaman aşımı süresi içinde kaynağa erişemediğinde hangi istisna fırlatılır ve Kubernetes katmanında ne yaşanır?

*İpucu:* Eşzamanlı erişim zaman aşımı durumunda fırlatılan istisnai sınıfı ve konteyner döngüsünü göz önüne getirin.

A) DbUnreachableException fırlatılır ve Fluentd log toplama süreci derhal durdurulur.
B) ORA-00054 kilit hatası alınır ve Kubernetes ilgili orta katman düğümünün belleğini otomatik artırır.
C) ConcurrentAccessTimeoutException fırlatılır ve Kubernetes sağlık kontrolleri başarısız olduğu için ifsapp-connect pod'unu sürekli yeniden başlatır. *
D) ROWLOCK_Contention_Exception fırlatılır ve Kubernetes MX_T tablosunu otomatik olarak yeniden oluşturur.

**Cevap anahtarı:** C

**Gerekçe (C):** Sert kodlanmış 5000 ms zaman aşımı aşıldığında ConcurrentAccessTimeoutException fırlatılır; bu durum pod sağlık problarının kalmasına ve ifsapp-connect pod'unun crash loop'a girmesine neden olur.

## 9. IFS Cloud 26R2 Server Alert Log mimarisinde, veritabanı şemasına karşı çalıştırılan tüm DDL (CREATE, ALTER, DROP) işlemlerini yakalayan ve etkinleştirildiğinde sistem seviyesinde veritabanı tetikleyicisi oluşturan kategori hangisidir?

*İpucu:* Veritabanı nesne yapılarını değiştiren SQL komutlarını izleyen kategoriyi anımsayın.

A) Server Errors
B) Ddl Audit *
C) Event errors
D) Deployment detail

**Cevap anahtarı:** B

**Gerekçe (B):** Ddl Audit kategorisi aktifleştirildiğinde veritabanında sistem seviyesinde bir trigger oluşturarak şemayı değiştiren DDL komutlarını günlüğe kaydeder.

## 10. Server Alert Log kategorileri arasında yer alan ve Assert_SYS gibi girdi doğrulama rutinleri dinamik SQL ayrıştırmasında başarısız olduğunda güvenlik denetimi sağlamak amacıyla tüm ortamlarda sürekli açık tutulması önerilen kategori hangisidir?

*İpucu:* Dinamik SQL komutlarındaki güvenlik ihlali şüphelerini denetleyen kategoriyi düşünün.

A) Debug
B) Deployment
C) Sql Injections *
D) In-Memory

**Cevap anahtarı:** C

**Gerekçe (C):** Sql Injections kategorisi, dinamik SQL kontrolü yapan güvenlik denetimlerinin başarısız olduğu şüpheli durumları izlemek için her ortamda daima açık bırakılmalıdır.

## 11. IFS Cloud 26R2 Application Monitoring Metrics (AMM) mimarisinde, konfigüre edilen eşik değerlerini aktif girdilere karşı günlük olarak değerlendiren ve eşik ihlallerinde sistem uyarılarını tetikleyen zamanlanmış görev hangisidir?

*İpucu:* İzleme eşik değerlerini kontrol eden özel Foundation1 sistem görevini hatırlayın.

A) Transaction_SYS.Process_All_Pending
B) Foundation1 Monitoring *
C) Foundation1 Light Cleanup
D) Shrink LOB segments

**Cevap anahtarı:** B

**Gerekçe (B):** Foundation1 Monitoring zamanlanmış görevi günlük olarak çalışarak aktif izleme girdilerini uyarı limitlerine göre değerlendirir.

## 12. IFS Application Monitoring Console (AppMon) Metric & Service grupları bünyesinde yer alan 'Group 20' ve 'Group 180' sırasıyla hangi operasyonel alt sistemleri izlemekle görevlidir?

*İpucu:* Veritabanı kilitleri ve entegrasyon mesajlaşma motoruna karşılık gelen grup numaralarını düşünün.

A) Group 20 Geçersiz Veritabanı Nesnelerini, Group 180 ise Dokümantasyon Web Servislerini izler.
B) Group 20 Oracle Kilit Yöneticisini (Database Tier - Locks), Group 180 ise IFS Connect Entegrasyon Motorunu (Integration - Connect) izler. *
C) Group 20 Lisanslı Eşzamanlı Kullanıcıları, Group 180 ise Mobil Dokunmatik Servisleri izler.
D) Group 20 JVM Garbage Collection işlemlerini, Group 180 ise Yazıcı Kuyruklarını (Reporting - Print Queue) izler.

**Cevap anahtarı:** B

**Gerekçe (B):** Group 20 veritabanı seviyesindeki kilitleri (exclusive, DDL kilitleri) izlerken, Group 180 entegrasyon katmanındaki IFS Connect kuyruk ve mesaj durumlarını izler.
