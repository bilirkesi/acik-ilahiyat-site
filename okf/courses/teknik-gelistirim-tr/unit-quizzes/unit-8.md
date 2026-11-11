---
type: Quiz
title: "Ünite 8 quizi: Bölüm 8: Performans Yönetimi, Tuning ve Teşhis Araçları"
description: Teknik Gelişim (Türkçe) 8. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 8
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-8.md
---

# Ünite 8: Bölüm 8: Performans Yönetimi, Tuning ve Teşhis Araçları

Toplam 12 soru.

## 1. Oracle Veritabanı'nda ADDM (Automatic Database Diagnostic Monitor) analizi hangi temel metrik etrafında şekillenir ve varsayılan olarak hangi sıklıkla otomatik olarak yürütülür?

*İpucu:* Bu teşhis motoru, veritabanı oturumlarının aktif olarak harcadığı toplam süreyi analiz eder ve AWR snapshot periyodunu takip eder.

A) Redo Size metriği; log file sync bekleme olayı kritik seviyeye ulaştığında tetiklenir.
B) CPU Utilization metriği; yalnızca OEM Agent üzerinden manuel tetiklendiğinde çalışır.
C) Elapsed Time metriği; her 24 saatte bir gece toplu iş yükleri tamamlandığında çalışır.
D) DB Time metriği; her AWR anlık görüntüsünden (varsayılan olarak her 60 dakikada bir) sonra otomatik çalışır. *

**Cevap anahtarı:** D

**Gerekçe (D):** ADDM, boşta olmayan oturum çağrılarının toplam süresini ifade eden DB Time metriğini merkezine alır ve varsayılan olarak 60 dakikada bir alınan AWR snapshot noktaları arasında otomatik çalışır.

## 2. AWR (Automatic Workload Repository) istatistiklerini SGA'daki Active Session History (ASH) yapısından SYSAUX tablosundaki AWR deposuna (WRM$_* ve WRH$_*) aktarmaktan sorumlu arka plan süreci hangisidir?

*İpucu:* SGA belleğindeki istatistikleri izleyip diskteki depoya aktaran bellek izleme sürecini düşünün.

A) PMON (Process Monitor) süreci.
B) MMON (Memory Monitor) süreci. *
C) LGWR (Log Writer) süreci.
D) DBWR (Database Writer) süreci.

**Cevap anahtarı:** B

**Gerekçe (B):** MMON arka plan süreci, bellek içi performans verilerini ve ASH örneklerini periyodik olarak SYSAUX veritabanı alanındaki AWR tablolarına yazar.

## 3. Kısa süreli veya geçici (transient) performans sıçramalarını saniye bazında analiz etmek için kullanılan Active Session History (ASH) verileri bellekte nerede tutulur?

*İpucu:* Her saniye örneklenen verilerin dinamik performans görünümleri üzerinden erişildiği bellek yapısını hatırlayın.

A) SGA içerisindeki v$active_session_history halka tamponunda (ring buffer). *
B) PGA içerisindeki oturum özel bellek alanında.
C) SYSAUX alanındaki dba_hist_sysstat tablosunda.
D) RECO disk grubundaki izleme dosyalarında.

**Cevap anahtarı:** A

**Gerekçe (A):** ASH, her saniye aktif oturumları örnekleyerek SGA içerisindeki bellek içi v$active_session_history halka tamponunda saklar.

## 4. Bir AWR raporunda veya bekleme olayları analizinde 'db file scattered read' olayının yüksek süreli bekleme üretmesi genellikle hangi duruma işaret eder?

*İpucu:* Veri bloklarının belleğe ardışık olmayan (dağınık) çoklu bloklar halinde çekildiği erişim yöntemini değerlendirin.

A) Oturumların işlenmemiş işlemler nedeniyle satır düzeyinde kilit beklemesine.
B) Tekil blok indeks aramalarına veya B-Tree indeks parçalanmalarına.
C) Büyük işlem tablolarında yapılan çoklu blok okumalarına (Full Table Scan) ve eksik indeksleme stratejilerine. *
D) LGWR sürecinin online redo log dosyalarını diske yazarken yaşadığı I/O gecikmelerine.

**Cevap anahtarı:** C

**Gerekçe (C):** db file scattered read bekleme olayı, veritabanının bir tabloyu tam tarama (Full Table Scan) ile çoklu bloklar halinde okuduğunu ve eksik indekslerin varlığını gösterir.

## 5. Bir yama (patch) uygulaması sonrasında veritabanı performans değişikliklerini iki farklı zaman aralığı bazında karşılaştırmak için hangi Oracle SQL betiği kullanılır?

*İpucu:* Tek bir snapshot aralığı yerine iki ayrı periyot arasındaki farkları (diff) çıkaran betiği düşünün.

A) awrddrpt.sql (tek örnekli) veya awrddrpi.sql (RAC ortamları için). *
B) addmrpt.sql betiği.
C) ashrpt.sql betiği.
D) awrrpt.sql betiği.

**Cevap anahtarı:** A

**Gerekçe (A):** AWR Compare Period raporları (awrddrpt.sql/awrddrpi.sql), yama öncesi ve sonrası gibi iki ayrı zaman aralığını yan yana karşılaştırır.

## 6. Bellekte aktif olan bir SQL_ID'ye ait gerçek çalışma planını (actual execution plan) V$SQL_PLAN üzerinden çekmek ve tahmini satır sayısı (E-Rows) ile gerçekleşen satır sayısını (A-Rows) karşılaştırmak için hangi fonksiyon kullanılır?

*İpucu:* İmleç bellek alanındaki (cursor) gerçek istatistikleri ve runtime plan adımlarını listeleyen paketi hatırlayın.

A) DBMS_XPLAN.DISPLAY_CURSOR fonksiyonu (format => 'ALLSTATS LAST'). *
B) DBMS_LOCK.SLEEP prosedürü.
C) DBMS_XPLAN.DISPLAY fonksiyonu.
D) DBMS_STATS.GATHER_TABLE_STATS prosedürü.

**Cevap anahtarı:** A

**Gerekçe (A):** DBMS_XPLAN.DISPLAY_CURSOR fonksiyonu, bellekteki Imisli imleçlerin gerçek çalışma istatistiklerini (E-Rows ve A-Rows) görüntülemek için kullanılır.

## 7. Oracle Management Agent (OMA) ile merkezi Oracle Management Service (OMS) arasındaki iletişim varsayılan olarak hangi port ve protokol üzerinden güvenli şekilde sağlanır?

*İpucu:* Enterprise Manager mimarisinde ajanların OMS sunucusuna telemetry verisi gönderirken kullandığı özel port numarasını dikkate alın.

A) Tek yönlü TCP port 1521 üzerinden Oracle Net listener protokolü ile.
B) Çift yönlü TCP port 3872 üzerinden HTTP/HTTPS protokolleri ile. *
C) TCP port 8080 üzerinden SSH tünelleme ile.
D) TCP port 443 üzerinden yalnızca UDP soket bağlantısı ile.

**Cevap anahtarı:** B

**Gerekçe (B):** OMA, merkezi OMS ile varsayılan çift yönlü TCP 3872 portu üzerinden HTTP/HTTPS protokollerini kullanarak güvenli bir şekilde haberleşir.

## 8. RAC küme düğümlerinde çalışan OEM Agent sürecinin durumunu kontrol etmek veya toplanan metrikleri derhal OMS'e göndermeye zorlamak için sırasıyla hangi 'emctl' komutları kullanılır?

*İpucu:* Ajan durumunu öğrenmek için 'durum', verileri OMS'e aktarmak için 'yükleme' kelimelerinin İngilizce karşılıklarını düşünün.

A) ./emctl config agent ve ./emctl ping agent.
B) ./emctl status agent ve ./emctl upload agent. *
C) ./emctl start agent ve ./emctl stop agent.
D) ./emctl verify agent ve ./emctl clear agent.

**Cevap anahtarı:** B

**Gerekçe (B):** Ajanın çalışma ve bağlantı durumunu doğrulamak için status agent, metrik senkronizasyonunu anlık olarak tetiklemek için upload agent komutları yürütülür.

## 9. AWR analizi sırasında hesaplanan DB Time metriği ile Elapsed Time değeri karşılaştırıldığında, DB Time'ın Elapsed Time değerinden belirgin şekilde yüksek çıkması neyi ifade eder?

*İpucu:* Birden fazla oturumun aynı zaman dilimi içerisinde veritabanı içinde aktif olarak vakit harcamasını düşünün.

A) Redo log dosyalarının boyutunun gereğinden fazla büyük olduğunu.
B) Veritabanının tamamen boşta çalıştığını ve I/O kaynaklarının hiç kullanılmadığını.
C) Yalnızca tek bir oturumun aktif olduğunu ve sistemde hiç bekleme olmadığını.
D) Sistemde yüksek eşzamanlılık (concurrency) veya ciddi kaynak/bekleme çekişmesi olduğunu. *

**Cevap anahtarı:** D

**Gerekçe (D):** DB Time metrikleri tüm aktif oturumların sürelerinin toplamıdır; Elapsed Time'dan büyük olması birden fazla oturumun aynı anda bekleme veya CPU çekişmesi yaşadığını gösterir.

## 10. AWR raporundaki Top Foreground Wait Events listesinde 'log file sync' bekleme olayının üst sıralarda yer alması genellikle hangi teknik sorundan kaynaklanır?

*İpucu:* Kullanıcı oturumlarının bir işlemin kalıcılığını onaylarken (commit) Redo yazıcısını (LGWR) bekleme sebebini değerlendirin.

A) LGWR sürecinin redo kayıtlarını diske yazma gecikmesinden (RECO/DATA disk grubu latency) veya uygulamadaki aşırı COMMIT sıklığından. *
B) Shared Pool alanının yetersiz olmasından ve aşırı hard parse yapılmasından.
C) Tablolarda istatistiklerin bayat (stale) olmasından ve yanlış CBO yürütme planı seçilmesinden.
D) Veritabanı veri dosyalarında veri bloklarının bozulmasından.

**Cevap anahtarı:** A

**Gerekçe (A):** log file sync, kullanıcı oturumlarının COMMIT anında LGWR'nin log tamponunu diske yazmasını beklediği süredir; yavaş disk I/O'su veya sık COMMIT çağrıları bu değeri yükseltir.

## 11. Bir SQL sorgusunun yürütme planındaki E-Rows (Tahmini Satır Sayısı) ile A-Rows (Gerçekleşen Satır Sayısı) değerleri arasında belirgin bir uyumsuzluk görülürse ilk olarak hangi müdahale yapılmalıdır?

*İpucu:* Cost-Based Optimizer (CBO)'ın doğru tahmin yapabilmesi için ihtiyaç duyduğu veri sözlüğü metriklerini tazeleme işlemini düşünün.

A) DBMS_STATS.GATHER_TABLE_STATS kullanarak tablonun istatistiklerini güncellemek. *
B) Veritabanı sga_target belleğini derhal düşürmek.
C) Tablodaki tüm B-Tree indeksleri silmek.
D) OEM Agent sürecini emctl ile yeniden başlatmak.

**Cevap anahtarı:** A

**Gerekçe (A):** E-Rows ve A-Rows arasındaki devasa farklar, CBO'nun bayat (stale) veya eksik istatistikler nedeniyle yanlış maliyet hesabı yaptığını gösterir; istatistiklerin toplanması ilk adımdır.

## 12. ADDM (Automatic Database Diagnostic Monitor) tarafından tespit edilen bir performans sorunu için sunulan çözüm önerileri aşağıdaki kategorilerden hangilerini kapsar?

*İpucu:* Teşhis motorunun sorunun kökenine göre hem sunucu kaynakları, hem veritabanı parametreleri hem de yazılan SQL ve indeksler düzeyinde öneri sunduğunu hatırlayın.

A) Yalnızca Veri Tabanı Yedeği Alma ve RMAN Betik Güncellemeleri.
B) Donanım/Altyapı Ayarlaması, Veritabanı Yapılandırması ve Şema/SQL Optimizasyonu. *
C) Yalnızca İşletim Sistemi Çekirdek Yamaları ve Donanım Değişimi.
D) Yalnızca OEM Agent Sertifika Yenileme ve Port Değişikliği.

**Cevap anahtarı:** B

**Gerekçe (B):** ADDM önerileri; CPU/ASM ekleme (Donanım), sga_target/processes değiştirme (Yapılandırma) ve indeks oluşturma/istatistik toplama (Şema/SQL) gruplarında sunulur.
