---
type: Quiz
title: "Ünite 10 quizi: Bölüm 10: Yedekleme, Kurtarma ve Operasyonel Uygulama"
description: Teknik Gelişim (Türkçe) 10. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 10
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-10.md
---

# Ünite 10: Bölüm 10: Yedekleme, Kurtarma ve Operasyonel Uygulama

Toplam 12 soru.

## 1. Oracle Database 19c sürümünde Data Recovery Advisor (DRA) özelliğinin kullanımdan kaldırılmasıyla (deprecated) birlikte hangi RMAN komut grubu da erişime kapatılmıştır?

*İpucu:* Otomatik arıza tespiti ve onarım önerileri sunan RMAN komut ailesini hatırlayın.

A) DUPLICATE DATABASE, CONVERT DATAFILE ve TRANSPORT TABLESPACE
B) FLASHBACK DATABASE, RECOVER DATABASE ve RESTORE CONTROLFILE
C) LIST FAILURE, ADVISE FAILURE, REPAIR FAILURE ve CHANGE FAILURE *
D) CROSSCHECK, DELETE OBSOLETE ve RESYNC CATALOG

**Cevap anahtarı:** C

**Gerekçe (C):** Oracle Database 19c ile Data Recovery Advisor mimarisi kullanımdan kaldırıldığı için bu mekanizmayı yöneten tüm komutlar tamamen erişim dışı kalmıştır.

## 2. Oracle Database 19c rehberine göre, depolama anlık görüntülerinden (storage snapshot) zaman noktası kurtarmasında `RECOVER...SNAPSHOT TIME` yöntemi yerine hangi yaklaşım önerilmektedir?

*İpucu:* Veri dosyalarının anlık görüntü alınırken tutarlı moda geçirilmesi için veritabanı seviyesinde verilen komut dizisini düşünün.

A) Veritabanını tamamen kapatıp anlık görüntüyü geri yükledikten sonra RECOVER DATABASE NOREDO çalıştırmak
B) Sadece Data Pump export dump dosyalarını alıp impdp ile geri yüklemek
C) Doğrudan FLASHBACK DATABASE TO SNAPSHOT TIME komutunu çağırmak
D) Snapshot öncesi ve sonrası ALTER DATABASE BEGIN/END BACKUP kullanıp ardından RECOVER...UNTIL TIME çalıştırmak *

**Cevap anahtarı:** D

**Gerekçe (D):** Çalışan veritabanı anlık görüntülerinde veri bütünlüğünü garanti etmek için tutarlı yedekleme blokları oluşturulup ardından belirli bir SCN veya zamana kadar kurtarma yapılması önerilir.

## 3. RMAN `RECOVER TABLE` komutu çalıştırıldığında tablo kurtarma sürecinin arka planındaki temel mekanizma aşağıdakilerden hangisidir?

*İpucu:* Kurtarma esnasında hedef ortam dışında geçici olarak oluşturulan veritabanı yapısını dikkate alın.

A) Tüm veritabanı yedeği geçici bir ASM disk grubuna açılır ve tablo veri dosyası doğrudan kopyalanır.
B) Hedef veritabanı salt okunur (read-only) moda alınır ve tablo doğrudan mevcut tablo alanına yazılır.
C) Hedef sunucuda otomatik bir yardımcı (auxiliary) veritabanı kurulur, tablo buraya kurtarılır ve Data Pump ile dışa aktarılır. *
D) Tablo doğrudan Undo tablespace verileri kullanılarak canlı veritabanında geriye sarılır.

**Cevap anahtarı:** C

**Gerekçe (C):** RMAN, üretim ortamındaki diğer nesneleri etkilemeden tabloyu nesne bazlı kurtarmak için geçici bir yardımcı örnek oluşturur.

## 4. RMAN ile tablo kurtarırken (`RECOVER TABLE`), dışa aktarılan (export dump) tablo verilerinin hedef veritabanına otomatik olarak yüklenmesini önlemek için hangi yan cümlecik eklenmelidir?

*İpucu:* İçe aktarma (import) adımının yürütülmesini engelleyen olumsuz eki içeren terimi arayın.

A) NOPROMPT
B) EXCLUDE TABLE
C) NOTABLEIMPORT *
D) SKIP TABLESPACE

**Cevap anahtarı:** C

**Gerekçe (C):** Bu yan cümlecik belirtildiğinde RMAN tabloyu yardımcı veritabanında kurtarıp dump dosyasını oluşturur fakat impdp adımını atlayarak dosyayı manuel aktarım için bırakır.

## 5. 11.11.2026 kesinti incelemesi notlarına göre, IFS sistemlerindeki Cleanup (temizleme) süreçlerinin çalışma yapısı ve kesintiye yol açan temel kısıt hangisidir?

*İpucu:* Bir iş adımının takılması durumunda zincirleme olarak diğer işlerin etkilenmesine yol açan mimari özelliği düşünün.

A) Cleanup adımlarının Data Guard standby sunucusunda çalıştırılamaması
B) Cleanup sürecinin yalnızca ASM disk grupları dolduğunda otomatik tetiklenmesi
C) Cleanup işlemlerinin sadece SYSDBA yetkisindeki oturumlar tarafından durdurulabilmesi
D) Cleanup süreçlerinin sıralı çalışması; bir adım takıldığında sonraki adımların da bekletilmesi *

**Cevap anahtarı:** D

**Gerekçe (D):** Temizleme görevleri ardışık bağımlılıkla çalıştığı için Heavy/Light Cleanup veya endeks derleme gibi tek bir adım kilitlendiğinde tüm süreç durmaktadır.

## 6. Kesinti analizi belgelerine göre, IFS arka plan işlerinin izlenmesinde (A8 kararı) ek Diagnostics/Tuning Pack lisans maliyeti getirmeyen izleme yaklaşımı nedir?

*İpucu:* Ek paket lisansı gerektirmeyen, salt okunur veri sözlüğü sorgulama yöntemini hatırlayın.

A) Oracle Enterprise Manager (OEM) Tuning Pack paketini tüm düğümlerde aktifleştirmek
B) Veritabanı seviyesinde Audit Vault kolektörlerini zorunlu kılmak
C) İzleme kullanıcısına eklenen tek bir SELECT yetkisi ile IFS iş tablolarından SQL tabanlı sorgulama yapmak *
D) Her 5 dakikada bir v$session ve v$active_session_history görünümlerini dışarı aktarmak

**Cevap anahtarı:** C

**Gerekçe (C):** DBA_HIST_* veya AWR/ASH paketleri ek lisans gerektirirken, doğrudan zamanlanmış iş tablolarından SQL ile durum ve süre okumak lisans dostu (licensing-friendly) bir çözümdür.

## 7. Oracle Advanced Queue (AQ) altyapısını kullanan IFS arka plan işleyicilerinde (listener/handler) bir takılma veya kilitlenme olduğunu gösteren temel izleme sinyali hangisidir?

*İpucu:* Kuyruğa giren mesajların işlenme hızını ve durumunu temsil eden metriğe odaklanın.

A) Kuyruktaki bekleyen (ready) mesaj sayısının (`ifs_aq` metriği) uzun süre düşmemesi ve birikmesi *
B) Veritabanında alert log dosyasına ORA-00060 deadlock hatasının düşmesi
C) ASM +RECO disk grubundaki doluluk oranının %95 eşiğini aşması
D) Geçersiz nesne (OracleInvalidObjects) sayısının birdenbire artması

**Cevap anahtarı:** A

**Gerekçe (A):** İşleyici fonksiyonunu kaybettiğinde gelen mesajlar işlenemediği için ready durumundaki kuyruk metrikleri sürekli artış gösterir veya yüksek kalır.

## 8. RMAN `BACKUP RECOVERY AREA` (veya `DB_RECOVERY_FILE_DEST`) komutu çalıştırıldığında yedekleme optimizasyonu (backup optimization) ile ilgili varsayılan davranış nedir?

*İpucu:* Fast Recovery Area yedeklemelerinde RMAN'in gereksiz dosya kopyalamayı önleyen varsayılan davranışını hatırlayın.

A) Yalnızca SBT (tape) cihazlarına yedek alırken optimizasyon uygulanır, diske alırken uygulanmaz.
B) Optimizasyon varsayılan olarak kapalıdır, aktifleştirmek için OPTIMIZE ON yazılmalıdır.
C) CONFGURE BACKUP OPTIMIZATION ayarı OFF olsa dahi yedekleme optimizasyonu varsayılan olarak etkindir. *
D) Sadece kontrol dosyası otomatize yedeklerinde (autobackup) optimizasyon devreye girer.

**Cevap anahtarı:** C

**Gerekçe (C):** Fast Recovery Area içeriği yedeklenirken RMAN optimize çalışma modunu varsayılan yapar; bunu devre dışı bırakmak için FORCE parametresi gerekir.

## 9. Oracle kılavuzlarında yer alan duyuruya göre, Oracle Secure Backup (OSB) 19.1 sürümünün desteğinin sonlanması nedeniyle bulut yedeklemeleri için önerilen mimari çözüm hangisidir?

*İpucu:* Sıfır veri kaybı hedefleyen ve OCI üzerindeki otonom recovery servisini temel alan yapıyı düşünün.

A) Yalnızca Data Pump yardımıyla günlük schema export paketleri oluşturmak
B) Her saat başı ek harici disk alanına tam (Full) veritabanı görüntüsü kopyalamak
C) Geleneksel FTP/SFTP betikleri ile veri dosyalarının nesne depolamaya (Object Storage) aktarılması
D) OCI üzerinde Oracle Zero Data Loss Autonomous Recovery Service kullanan Oracle Database Zero Data Loss Cloud Protect *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle, bulut yedeklerinde gerçek zamanlı işlem koruması ve sürekli artımlı strateji sunan Cloud Protect / Autonomous Recovery Service mimarisini önermektedir.

## 10. RMAN kullanarak bir Pluggable Database (PDB) içerisindeki belirli bir tabloyu zaman noktasına göre kurtarmak için hangi komut kalıbı kullanılır?

*İpucu:* CDB kökünden belirli bir fişlenebilir veritabanı (PDB) altındaki nesneyi kurtarma sözdizimini anımsayın.

A) RECOVER TABLE schema.table OF PLUGGABLE DATABASE pdb_name UNTIL... *
B) FLASHBACK TABLE schema.table IN PDB pdb_name TO BEFORE DROP...
C) RESTORE PDB pdb_name TABLE schema.table TO SCN...
D) RECOVER PLUGGABLE DATABASE pdb_name TABLESPACE users...

**Cevap anahtarı:** A

**Gerekçe (A):** CDB kök konteynerine bağlandıktan sonra hedef PDB adını `OF PLUGGABLE DATABASE` ile belirterek tablo seviyesinde nokta zamanlı kurtarma yapılır.

## 11. RMAN tablo kurtarma (`RECOVER TABLE`) işlemi sırasında Linux işletim sisteminde `DATAPUMP DESTINATION` belirtilmediğinde, oluşturulan Data Pump dump dosyası varsayılan olarak hangi dizinde saklanır?

*İpucu:* Oracle veritabanı mimarisinde parametre dosyalarının ve varsayılan sistem çıktılarının tutulduğu ana dbs klasörünü hatırlayın.

A) /tmp/recovery
B) +DATA/DUMPFILE
C) $ORACLE_BASE/admin/dpdump
D) $ORACLE_HOME/dbs *

**Cevap anahtarı:** D

**Gerekçe (D):** Linux ortamında hedef veya yardımcı dizin açıkça verilmediğinde Varsayılan Data Pump dump konumu `$ORACLE_HOME/dbs` dizinidir.

## 12. RMAN ile kurtarılan bir tablonun hedef veritabanına farklı bir isimle veya farklı bir şemaya yüklenmesini sağlamak için hangi yan cümlecik kullanılır?

*İpucu:* Data Pump ve RMAN nesne yeniden eşleme teriminde kullanılan 'REMAP' ön ekini düşünün.

A) ALTER TABLE RENAME CLAUSE
B) REMAP TABLE *
C) SWITCH TABLE TO COPY
D) SET NEWNAME FOR TABLE

**Cevap anahtarı:** B

**Gerekçe (B):** REMAP TABLE yan cümleciği kurtarılan tablonun adını, şemasını veya hedef tablo alanını yeniden adlandırarak var olan tabloların üzerine yazılmasını engeller.
