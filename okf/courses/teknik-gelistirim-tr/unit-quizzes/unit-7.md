---
type: Quiz
title: "Ünite 7 quizi: Bölüm 7: Uygulama Sürekliliği ve Dayanıklılık Mimarisi"
description: Teknik Gelişim (Türkçe) 7. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 7
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-7.md
---

# Ünite 7: Bölüm 7: Uygulama Sürekliliği ve Dayanıklılık Mimarisi

Toplam 12 soru.

## 1. Oracle Database 18c ile sunulan Şeffaf Uygulama Sürekliliğini (Transparent Application Continuity - TAC) aktif hale getirmek için veritabanı servisindeki `FAILOVER_TYPE` parametresi hangi değere ayarlanmalıdır?

*İpucu:* Bu değer, veritabanının oturum durumlarını ve istek sınırlarını otomatik ve şeffaf biçimde yönetmesini ifade eden kelimedir.

A) SELECT
B) AUTO *
C) BASIC
D) TRANSACTION

**Cevap anahtarı:** B

**Gerekçe (B):** Transparent Application Continuity modunun sunucu ve sürücü düzeyinde otomatik durum takibi ve örtük istek sınırı algılaması yapabilmesi için serviste FAILOVER_TYPE parametresinin AUTO olarak yapılandırılması gerekir.

## 2. Oracle JDBC Thin sürücüsünde Uygulama Sürekliliği (Application Continuity) için açık istek sınırlarını (explicit request boundaries) belirlemek amacıyla `oracle.jdbc.OracleConnection` arayüzünde hangi metod çifti kullanılır?

*İpucu:* İsteklerin ne zaman başladığını ve bittiğini sürücüye bildiren açık ifade metodlarını düşünün.

A) openSession() ve closeSession()
B) startTransaction() ve commitTransaction()
C) beginRequest() ve endRequest() *
D) enableReplay() ve disableReplay()

**Cevap anahtarı:** C

**Gerekçe (C):** JDBC Replay Driver, çağrı geçmişinin nerede güvenle temizlenebileceğini ve replay kaydının nereden başlatılacağını bu metotlar vasıtasıyla tespit eder.

## 3. Oracle Database 12c Sürüm 2 (12.2.0.1) ile tanıtılan XA Replay Data Source (`OracleXADataSourceImpl`) kullanımında, bir veritabanı bağlantısı küresel/XA (global/XA) bir işleme katıldığında replay özelliği nasıl etkilenir?

*İpucu:* Dağıtık ve küresel işlemlerin getirdiği karmaşıklık nedeniyle replay kaydının durumunu düşünün.

A) Replay mekanizması yalnızca autocommit ayarı true yapıldığında aktif kalır.
B) XA işlemleri yerel işlemlerle aynı mantıkta tamamen kesintisiz replayed edilmeye devam eder.
C) Fiziksel bağlantı derhal kapatılır ve havuzdan zorunlu olarak yeni bir XAConnection nesnesi üretilir.
D) Bağlantı üzerinde replay otomatik olarak devre dışı bırakılır ve bir sonraki istek başlayana kadar kapalı kalır. *

**Cevap anahtarı:** D

**Gerekçe (D):** Bir fiziksel bağlantı küresel XA işlemine dahil olduğu an AC replay koruması güvenlik nedeniyle kapatılır ve yeni bir istek başlayana kadar etkinleşmez.

## 4. Uygulama içinde harici e-posta gönderimi (UTL_SMTP) veya harici web servisi çağrıları gibi tekrarlanmaması gereken yan etkiler bulunduğunda, ilgili istek özelinde replay kaydını durdurmak için hangi API çağrılmalıdır?

*İpucu:* Replay işlevini o anki istek için devre dışı bırakan yöntemi arayın.

A) oracle.jdbc.replay.ReplayableConnection.disableReplay() *
B) oracle.jdbc.OracleConnection.endRequest()
C) oracle.sql.ARRAY.clearCache()
D) oracle.jdbc.OracleDataSource.clearReplayStatistics()

**Cevap anahtarı:** A

**Gerekçe (A):** disableReplay API'si çağrıldığında, harici yan etkilerin replayed edilerek tekrar etmesini önlemek amacıyla ilgili isteğin sonuna kadar replay devre dışı kalır.

## 5. Uygulama Sürekliliği (AC) yeniden yürütme (replay) yaptığı esnada, kullanıcının sahip olduğu bir veritabanı dizisinin (`sequence.NEXTVAL`) değerlerinin korunması ve anahtarların eşleşmesi için hangi SQL komutu kullanılmalıdır?

*İpucu:* Bir veritabanı dizisinin özelliklerini değiştiren DDL komutunu düşünün.

A) GRANT KEEP SEQUENCE ON [dizi_adı] TO PUBLIC;
B) UPDATE SEQUENCE [dizi_adı] SET REPLAY_OPTION = 'KEEP';
C) ALTER SEQUENCE [dizi_adı] KEEP; *
D) ALTER SESSION SET KEEP_SEQUENCE_VALUES = TRUE;

**Cevap anahtarı:** C

**Gerekçe (C):** Kullanıcının kendi dizilerinde orijinal sequence değerlerinin replay sırasında korunması için sahiplik düzeyinde ALTER SEQUENCE ... KEEP komutu verilir.

## 6. Veritabanı servisinde `FAILOVER_TYPE` parametresi `AUTO` (TAC) yapıldığında, önceden tanımlı ortak oturum durumlarının otomatik geri yüklenmesini sağlayan `FAILOVER_RESTORE` servis parametresi hangi değere otomatik çekilir?

*İpucu:* FAILOVER_TYPE parametresinin aldığı değerle eşleşen otomatik ayarı düşünün.

A) NONE
B) BASIC
C) LEVEL1
D) AUTO *

**Cevap anahtarı:** D

**Gerekçe (D):** FAILOVER_TYPE parametresi AUTO olarak ayarlandığında veritabanı FAILOVER_RESTORE değerini de otomatik olarak AUTO seviyesine getirir.

## 7. Uygulama Sürekliliğinde veritabanı veya servis kesintisi sırasında yeniden bağlantı için harcanacak maksimum gecikme süresi (maximum delay) hangi formülle hesaplanır?

*İpucu:* Deneme sayısı ile her bir deneme arasındaki sürenin etkileşimini düşünün.

A) RETRY_COUNT * RETRY_DELAY * TRANSPORT_CONNECT_TIMEOUT
B) FAILOVER_RETRIES * FAILOVER_DELAY *
C) REPLAY_INITIATION_TIMEOUT / FAILOVER_RETRIES
D) FAILOVER_DELAY + CONNECT_TIMEOUT

**Cevap anahtarı:** B

**Gerekçe (B):** Sürücü veya servisin bağlantıyı tekrar kurmak için deneyeceği toplam süre, deneme sayısı (FAILOVER_RETRIES) ile her deneme arasındaki bekleme süresinin (FAILOVER_DELAY) çarpımıdır.

## 8. Oracle Database 19c itibarıyla, `FAILOVER_TYPE=AUTO` etkinleştirildiğinde replay data source üzerinden oluşturulan her yeni bağlantıda sürücünün otomatik olarak `beginRequest` başlatmasını engellemek için hangi Java sistem özelliği `false` yapılmalıdır?

*İpucu:* Bağlantı oluşturma esnasında (connection creation) istek başlatma davranışını kontrol eden Java özelliğini arayın.

A) oracle.jdbc.implicitStatementCacheSize
B) oracle.jdbc.enableImplicitRequests
C) oracle.jdbc.beginRequestAtConnectionCreation *
D) FastConnectionFailoverEnabled

**Cevap anahtarı:** C

**Gerekçe (C):** Oracle Database 19c ile varsayılan değeri true olan bu özellik false yapıldığında, bağlantı oluşturma anında otomatik istek başlatılması açıkça kapatılmış olur.

## 9. Oracle Database 12.2 ve üzeri sürümler kullanan JDBC Thin istemcileri için yüksek kullanılabilirlik (HA) sağlayan bağlantı dizelerinde (TNS/URL) tüm bağlantı sürecini kapsayan ana zaman aşımı parametresi hangisidir?

*İpucu:* Veritabanına yapılan toplam bağlantı denemesinin sınırını çizen parametreyi düşünün.

A) TRANSPORT_CONNECT_TIMEOUT
B) CONNECT_TIMEOUT *
C) REPLAY_INITIATION_TIMEOUT
D) FAILOVER_DELAY

**Cevap anahtarı:** B

**Gerekçe (B):** CONNECT_TIMEOUT tüm bağlantı kurma sürecine uygulanan üst zaman aşımı süresini belirler (sqlnet.ora dosyasındaki SQLNET.OUTBOUND_CONNECT_TIMEOUT dengidir).

## 10. Uygulama Sürekliliği (Application Continuity) özelliğinin veritabanında tamamlanan işlemleri doğrulaması (Transaction Guard kullanımı) için veritabanı servisinde hangi parametrenin `TRUE` olarak ayarlanması zorunludur?

*İpucu:* İşlem sonucunu doğrulayan Transaction Guard altyapısını açan servis parametresini hatırlayın.

A) FAST_START_FAILOVER
B) COMMIT_OUTCOME *
C) DRAIN_TIMEOUT
D) AQ_HA_NOTIFICATIONS

**Cevap anahtarı:** B

**Gerekçe (B):** Transaction Guard'ın aktif olarak bir işlemin commit edilip edilmediğini doğrulayabilmesi için serviste COMMIT_OUTCOME=TRUE ayarının yapılması şarttır.

## 11. Oracle Database 18c itibarıyla JDBC sürücüsünün Uygulama Sürekliliği (AC) ile birlikte desteklemeye başladığı somut sınıflardan (concrete classes) biri aşağıdakilerden hangisidir?

*İpucu:* Metin karakter verilerini (Character Large Object) temsil eden desteklenen somut sınıfı arayın.

A) oracle.sql.OPAQUE
B) oracle.sql.ANYDATA
C) oracle.sql.CLOB *
D) oracle.sql.CustomClass

**Cevap anahtarı:** C

**Gerekçe (C):** Oracle Database 18c sürümü ile birlikte oracle.sql.CLOB, NCLOB, BLOB, BFILE, STRUCT, REF ve ARRAY gibi somut sınıflara AC desteği getirilmiştir.

## 12. IFS Orta Katman veritabanı yeniden bağlantı (re-connection) testi senaryosunda, Data Guard rol geçişini başlatmak amacıyla DGMGRL aracından hangi komut çalıştırılır?

*İpucu:* Planlı veritabanı rol değişimini ifade eden standart DGMGRL komutunu düşünün.

A) SWITCHOVER TO ifs_standby; *
B) FAILOVER TO ifs_standby;
C) RESTART DATABASE ifs_prod;
D) ALTER DATABASE RECONNECT;

**Cevap anahtarı:** A

**Gerekçe (A):** Planlı rol değişim testlerinde DGMGRL komut satırından SWITCHOVER TO <hedef_veritabanı> komutu verilerek birincil ve ikincil veritabanı rolleri değiştirilir.
