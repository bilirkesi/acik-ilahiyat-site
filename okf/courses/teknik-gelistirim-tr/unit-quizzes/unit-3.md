---
type: Quiz
title: "Ünite 3 quizi: Bölüm 3: Sürüm Yaşam Döngüsü, Yama Yönetimi ve Veritabanı Yükseltme"
description: Teknik Gelişim (Türkçe) 3. ünite için 10 soruluk quiz.
course: teknik-gelistirim-tr
unit: 3
question_count: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-3.md
---

# Ünite 3: Bölüm 3: Sürüm Yaşam Döngüsü, Yama Yönetimi ve Veritabanı Yükseltme

Toplam 10 soru.

## 1. Oracle Database 19c ortamında bir Release Update (RU) uygulandığında veritabanı sürüm numarasında nasıl bir değişiklik meydana gelir?

*İpucu:* Üç aylık kümülatif yamaların veritabanının ikincil basamak numarası üzerindeki etkisini düşünün.

A) Ana sürüm numarasını değiştirerek veritabanını üst sürüme geçirir.
B) Yalnızca revizyon basamağını artırarak ikincil düzeltme numarasını günceller.
C) Küçük sürüm numarasını artırarak veritabanını yeni bir minor sürüm seviyesine taşır. *
D) Sürüm numarasını tamamen sabit tutarak sadece veri sözlüğü derleme numarasını değiştirir.

**Cevap anahtarı:** C

**Gerekçe (C):** RU, üç aylık kümülatif bir yama olup güvenlik ve proaktif işlevsel hata düzeltmelerini içererek veritabanını yeni bir küçük sürüme (örneğin 19.11'den 19.12'ye) yükseltir.

## 2. Oracle veritabanı yama boru hattında ikili dosya güncellemesi (`opatch apply`) tamamlandıktan sonra, veri sözlüğü nesnelerini ve PL/SQL paketlerini güncellemek için hangi otomasyon aracı kullanılır?

*İpucu:* Veritabanı açıldıktan sonra yürütülen ikinci aşama SQL otomasyon aracını hatırlayın.

A) dbua
B) autoupgrade
C) brspace
D) datapatch *

**Cevap anahtarı:** D

**Gerekçe (D):** datapatch komutu, veritabanı servisleri yeniden açıldıktan sonra CDB$ROOT ve tüm PDB'lerde post-patch SQL otomasyonunu yürüterek SQL meta verilerini günceller.

## 3. IFS multitenant mimarisinde, üretim (PROD) ortamlarında çekirdek yürütme davranışını riske atmadan güvenlik uyumluluğunu sürdürmek için neden tercihen RUR uygulanır?

*İpucu:* Sıkı değişiklik yönetimi uygulanan üretim sistemlerinde minimum risk ilkesini göz önüne alın.

A) İkili dosya yamalama adımını tamamen atlayarak sadece veri sözlüğünü güncellediği için.
B) Yeni işlevsel hata düzeltmelerini dahil etmeyip yalnızca kritik güvenlik ve regresyon düzeltmelerini sunduğu için. *
C) Veritabanının ana sürüm numarasını yükselterek lisans maliyetlerini düşürdüğü için.
D) DEV ve TEST ortamlarında yeni işlevlerin yürütme planlarını hızlıca doğrulamayı sağladığı için.

**Cevap anahtarı:** B

**Gerekçe (B):** RUR, mevcut bir RU'nun ömrünü uzatarak geniş kapsamlı işlevsel değişiklikler getirmeden sadece kritik güvenlik ve regresyon düzeltmelerini sağlar.

## 4. Veritabanı servisleri kapatılıp ikili yama uygulanmadan önce uyuşmazlıkları ve kısmi yama başarısızlıklarını önlemek için yapılmalıdır denilen kontrol hangisidir?

*İpucu:* Var olan yamalar ile yeni uygulanacak yama arasındaki uyuşmazlıkları tespit eden ön kontrolü düşünün.

A) Veritabanını Unicode karakter kümesine dönüştürmek.
B) CDB$ROOT kapsayıcısını silip yeniden başlatmak.
C) $ORACLE_HOME üzerinde çakışma tespiti (Conflict Detection) kontrollerini çalıştırmak. *
D) datapatch komutunu servisler kapalıyken önceden yürütmek.

**Cevap anahtarı:** C

**Gerekçe (C):** Çakışma tespiti yapmak, mevcut yüklü yamalar ile yeni uygulanacak yama arasındaki uyuşmazlıkları servisler durdurulmadan önce tespit etmeyi sağlar.

## 5. Oracle veritabanında uygulanan SQL yamalarının geçmişini ve RU/RUR revizyon seviyelerini sorgulamak için SYSDBA tarafından hangi veri sözlüğü görünümü kullanılır?

*İpucu:* SQL yamalarının veri sözlüğündeki kayıt geçmişini veren görünüm adını arayın.

A) dba_registry_sqlpatch *
B) V$DATABASE
C) V$CLUSTER_INTERCONNECTS
D) dba_tablespaces

**Cevap anahtarı:** A

**Gerekçe (A):** dba_registry_sqlpatch ve registry$history görünümleri veritabanına uygulanan SQL yamalarının ve revizyon seviyelerinin geçmişini sorgulamaya olanak tanır.

## 6. Linux X86-64 kaynaklı bir veritabanını RMAN `duplicate database from active database` komutuyla buluta taşırken Data Guard kullanımı nasıl bir avantaj sağlar?

*İpucu:* Canlı veritabanından kopyalama ve sürekli senkronizasyonun kesinti süresine etkisini düşünün.

A) Veritabanı göçü sırasındaki iş kesintisini (downtime) yalnızca bir Data Guard rol değişimi (role switch) süresine indirger. *
B) Veritabanı ikili dosyalarını ($ORACLE_HOME) en son RU seviyesine otomatik yükseltir.
C) Veritabanının karakter kümesini SAP Unicode standartlarına otomatik olarak dönüştürür.
D) Yedek dosyalarının aktarımı için OCI Object Storage üzerinde geçici bir arabellek alanı zorunlu kılar.

**Cevap anahtarı:** A

**Gerekçe (A):** Hedef veritabanı Data Guard standby olarak yapılandırıldığında tüm değişiklikler canlı olarak aktarılır ve kesinti sadece rol değişimi süresi kadar olur.

## 7. Farklı platformlar veya endian türleri arasında RMAN `cross platform transportable tablespaces` yöntemiyle veritabanı taşınırken uygulamanın durdurulması gereken aşama hangisidir?

*İpucu:* Çevrimiçi artımlı yedeklemeler alındıktan sonra veri tutarlılığını sağlamak için uygulamanın ne zaman kapatıldığını hatırlayın.

A) Yalnızca son artımlı yedekleme ve meta veri dışa aktarımı (metadata export) yapılırken. *
B) Hedef tarafta yeni minimal veritabanı oluşturulması esnasında.
C) İlk veri yedeklemesinin başlatılmasından itibaren tüm göç süreci boyunca.
D) Hedef bulut ortamında OCI Object Storage yapılandırması ilk kurulurken.

**Cevap anahtarı:** A

**Gerekçe (A):** Çevrimiçi artımlı yedeklemeler veritabanı çalışırken alınabilir; sadece son değişikliklerin yakalanması ve meta veri dışa aktarımı sırasında uygulama durdurulur.

## 8. Oracle Lifecycle Migration Service (O2O) prosedürüne Oracle GoldenGate eklendiğinde (OOO prosedürü) göç sürecinde nasıl bir değişiklik elde edilir?

*İpucu:* Çevrimdışı (offline) bir taşıma prosedürünün canlı veri yakalama aracı eklenerek çevrimiçi (online) hale getirilmesini düşünün.

A) Göç başlangıcından itibaren gerçekleşen değişiklikler GoldenGate ile yakalanıp uygulanarak süreç neredeyse kesintisiz (online) hale getirilir. *
B) Betiklerin ve dışa aktarım dosyalarının depolanması için arabellek dosyası ihtiyacı son bulur.
C) SAP tabanlı Unicode dönüştürme işlemi veritabanı seviyesinde otomatize edilir.
D) Tabloların aktarımında database link ve export/import kullanımı tamamen kaldırılır.

**Cevap anahtarı:** A

**Gerekçe (A):** OOO prosedüründe GoldenGate kaynak veritabanındaki değişiklikleri yakalayıp hedefe uyguladığı için SAP yalnızca kısa bir geçiş (switchover) süresinde kapalı kalır.

## 9. Oracle veritabanı home dizinine bir Release Update (RU) uygulanmadan önce `opatch` yardımcı programı ile ilgili yerine getirilmesi gereken temel önkoşul nedir?

*İpucu:* Yamayı uygulayacak aracın kendisinin yama kılavuzundaki gereksinimlere uyarlanması gerektiğini hatırlayın.

A) opatch yardımcı programını yama Readme dokümanında belirtilen minimum sürüme güncellemek. *
B) opatch komutunu doğrudan PDB$SEED kapsayıcısı içinde çalıştırmak.
C) opatch komutunu veritabanı servisleri aktif çalışırken yürütmek.
D) opatch çalıştırmadan önce dba_registry_sqlpatch görünümünü silmek.

**Cevap anahtarı:** A

**Gerekçe (A):** Yama yükleme talimatlarında belirtildiği üzere, yama rutinleri çalıştırılmadan önce opatch aracının istenen minimum sürüme yükseltilmiş olması zorunludur.

## 10. Oracle Lifecycle Migration Service (O2O) yöntemiyle veritabanı yeni hedef sistemine taşınırken aşağıdaki işlemlerden hangisi O2O betikleri tarafından GERÇEKLEŞTİRİLEMEZ?

*İpucu:* Oracle veritabanı seviyesindeki esnek yapılandırmaların aksine, SAP uygulama sunucusu tarafından yapılması zorunlu olan özel dönüşüm sürecini hatırlayın.

A) Hedef veritabanında Database Vault veya RAC özelliklerini etkinleştirmek.
B) Veritabanı sürümünü şeffaf bir şekilde üst sürüme yükseltmek (upgrade).
C) Tablo alanlarında düzenleme yapmak ve veri sıkıştırma (compression) özelliğini aktifleştirmek.
D) SAP tabanlı Unicode dönüşümü işlemini tamamlamak. *

**Cevap anahtarı:** D

**Gerekçe (D):** O2O yöntemi yapısal güncellemeleri, sıkıştırmayı veya sürüm yükseltmeyi desteklese de SAP tabanlı Unicode dönüştürme işlemi mutlaka SAP sunucusu tarafından yapılmalıdır.
