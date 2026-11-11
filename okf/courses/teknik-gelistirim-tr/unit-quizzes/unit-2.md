---
type: Quiz
title: "Ünite 2 quizi: Bölüm 2: Multitenant Veritabanı Yönetimi: CDB ve PDB İzolasyonu"
description: Teknik Gelişim (Türkçe) 2. ünite için 11 soruluk quiz.
course: teknik-gelistirim-tr
unit: 2
question_count: 11
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-2.md
---

# Ünite 2: Bölüm 2: Multitenant Veritabanı Yönetimi: CDB ve PDB İzolasyonu

Toplam 11 soru.

## 1. Oracle Multitenant mimarisinde Oracle sistem meta verilerini, ortak kullanıcı hesaplarını ve global başlatma parametrelerini saklayan kök kapsayıcı veritabanı hangisidir?

*İpucu:* Tüm eklenebilir veritabanlarının bağlı olduğu en üst düzey kök kapsayıcı adını hatırlayın.

A) User PDBs
B) PDB$SEED
C) v$pdbs
D) CDB$ROOT *

**Cevap anahtarı:** D

**Gerekçe (D):** CDB$ROOT, Oracle sistem meta verilerini, ortak kullanıcı hesaplarını ve global parametreleri tutarak tüm yapının merkezini oluşturur.

## 2. Yeni eklenebilir veritabanlarını (PDB) hızlı bir şekilde dağıtmak ve oluşturmak amacıyla Oracle mimarisi tarafından sağlanan sistem şablonu hangisidir?

*İpucu:* Yeni veritabanı örneklerinin türetildiği çekirdek şablon adını düşünün.

A) ifstest
B) ifsprod
C) CDB$ROOT
D) PDB$SEED *

**Cevap anahtarı:** D

**Gerekçe (D):** PDB$SEED, yeni eklenebilir veritabanlarının hızlıca oluşturulmasını sağlayan sistem tarafından sağlanan salt okunur bir şablon PDB'dir.

## 3. IFS mimarisinde yer alan özel kullanıcı PDB'lerinin (User PDBs) temel işlevi nedir?

*İpucu:* Uygulama ortamlarının (DEV, TEST, PROD) birbirlerinin verilerine müdahale etmeden çalıştığı özel katmanı düşünün.

A) Tüm veritabanı sunucusunun global başlatma parametrelerini saklamak
B) Kullanıcı veri şemalarını, tablespace'leri ve uygulamaya özel meta verileri barındırmak *
C) Yeni PDB'lerin hızlıca dağıtımı için salt okunur şablon sağlamak
D) Ortak arka plan süreçlerini ve global veritabanı belleğini yönetmek

**Cevap anahtarı:** B

**Gerekçe (B):** Kullanıcı PDB'leri, IFS uygulamalarının ihtiyaç duyduğu özel veri şemalarını, nesneleri ve veritabanı alanlarını kapsayıcı düzeyinde izole eder.

## 4. Mevcut eklenebilir veritabanlarının (PDB) açık/kapalı durumlarını ve konteyner kimliklerini listelemek için hangi SQL görünümü sorgulanmalıdır?

*İpucu:* Pluggable database durumlarını gösteren ve 'v$' ile başlayan dinamik performans görünümünü hatırlayın.

A) v$pdbs *
B) v$containers
C) v$session
D) v$sys_context

**Cevap anahtarı:** A

**Gerekçe (A):** v$pdbs görünümü, veritabanındaki PDB'lerin container_id, name ve open_mode gibi durum bilgilerini sağlar.

## 5. Veritabanı oturum bağlamını değiştirmek ve belirli bir eklenebilir veritabanına (örneğin ifsprod) geçiş yapmak için hangi komut kullanılır?

*İpucu:* Geçerli oturum düzeyinde kapsayıcı tanımını ayarlamak için kullanılan DDL/DCL komut yapısını düşünün.

A) ALTER SYSTEM SET CONTAINER = ifsprod;
B) CONNECT ifsprod AS SYSDBA;
C) ALTER SESSION SET CONTAINER = ifsprod; *
D) ALTER PLUGGABLE DATABASE ifsprod OPEN;

**Cevap anahtarı:** C

**Gerekçe (C):** ALTER SESSION SET CONTAINER komutu, mevcut veritabanı oturumunun bağlamını hedeflenen PDB'ye geçirmek için kullanılır.

## 6. PDB'lerin mantıksal ve şema izolasyonu ile ilgili aşağıda verilen ifadelerden hangisi doğrudur?

*İpucu:* Ortak sistem meta verileri ile kullanıcıya özel veri sözlüğü arasındaki görev dağılımını göz önüne getirin.

A) Test ortamındaki (TEST) oturumlar, üretim (PROD) PDB'sindeki şema nesnelerine doğrudan erişip değiştirebilir.
B) Tüm kullanıcı tabloları ve veri sözlüğü indeksleri yalnızca CDB$ROOT içerisinde tek bir merkezde depolanır.
C) PDB$SEED, aktif kullanıcı oturumlarının mantıksal şema verilerini canlı olarak günceller.
D) CDB$ROOT ortak sistem meta verilerini yönetirken, her PDB kullanıcı tabloları ve şemaları için kendi özel veri sözlüğünü (private data dictionary) tutar. *

**Cevap anahtarı:** D

**Gerekçe (D):** PDB izolasyonu, her PDB'nin kendi private data dictionary yapısına sahip olması sayesinde kullanıcı nesnelerinin ayrıştırılmasını sağlar.

## 7. Non-production (örneğin TEST) bir PDB'nin aşırı bellek tüketerek Production PDB performansını düşürmesini engellemek için PDB düzeyinde hangi bellek parametresi sınırlandırılabilir?

*İpucu:* İlgili çalışma örneğinde PDB düzeyinde bellek üst sınırı belirlemek için ALTER SYSTEM komutunda ayarlanan parametreyi hatırlayın.

A) pga_aggregate_limit *
B) sys_context
C) open_mode
D) container_id

**Cevap anahtarı:** A

**Gerekçe (A):** PDB düzeyinde sga_target veya pga_aggregate_limit parametrelerinin ayarlanması, ilgili konteynerin bellek kullanımını sınırlandırarak diğer PDB'leri korur.

## 8. Mevcut oturumun hangi PDB kapsayıcısı içerisinde çalıştığını doğrulamak için hangi SQL fonksiyonu kullanılabilir?

*İpucu:* 'USERENV' ad alanı (namespace) üzerinden bağlam bilgilerini getiren fonksiyonu düşünün.

A) sys_context('USERENV', 'CON_NAME') *
B) ALTER SESSION SET CONTAINER;
C) SHOW PARAMETER pga_aggregate_limit;
D) SELECT * FROM v$pdbs;

**Cevap anahtarı:** A

**Gerekçe (A):** USERENV parametresiyle çalışan sys_context fonksiyonu, oturumun aktif olduğu kapsayıcı adını (CON_NAME) veya ID değerini doğrular.

## 9. Oracle Multitenant mimarisinde bir DBA'in diğer kardeş PDB'lerin çalışmasını kesintiye uğratmadan tek bir PDB üzerinde gerçekleştirebileceği bağımsız işlem hangisidir?

*İpucu:* Bir PDB'nin yaşam döngüsünün (lifecycle) diğer PDB'lerden bağımsız yönetilmesi özelliğini düşünün.

A) PDB'yi fişten çekmek (unplug), klonlamak (clone) veya silmek (drop) *
B) PDB$SEED şablonunu silerek çalışan tüm canlı PDB'lerin veri sözlüğünü sıfırlamak
C) Tüm PDB'lerin ortak kullanıcı hesaplarını yalnızca tek bir PDB içinden kalıcı olarak kaldırmak
D) CDB$ROOT kapsayıcısını PDB'lerden bağımsız olarak silmek

**Cevap anahtarı:** A

**Gerekçe (A):** PDB bağımsız yaşam döngüsü sayesinde, bir PDB diğer eklenebilir veritabanları etkilenmeden unplug, clone veya drop edilebilir.

## 10. Farklı PDB'lerdeki aktif kullanıcı oturum sayısını gruplayarak incelemek için v$session görünümünde hangi kolon kullanılmalıdır?

*İpucu:* Kapsayıcıların sayısal tanımlayıcısını belirten kısa kolon adını hatırlayın.

A) open_mode
B) container_name
C) sga_target
D) con_id *

**Cevap anahtarı:** D

**Gerekçe (D):** v$session görünümündeki con_id kolonu, her oturumun hangi konteyner kimliğine ait olduğunu belirterek gruplama yapılmasına imkan tanır.

## 11. Kapalı durumda olan 'ifsprod' adındaki bir PDB'yi erişime açmak için kullanılan doğru SQL komutu hangisidir?

*İpucu:* Eklenebilir veritabanı durumunu değiştirmek için kullanılan 'ALTER PLUGGABLE DATABASE' yapısını düşünün.

A) STARTUP PDB ifsprod;
B) ALTER SESSION SET CONTAINER = ifsprod OPEN;
C) ALTER PLUGGABLE DATABASE ifsprod OPEN; *
D) ALTER SYSTEM SET ifsprod = OPEN;

**Cevap anahtarı:** C

**Gerekçe (C):** ALTER PLUGGABLE DATABASE <pdb_adı> OPEN komutu, hedeflenen eklenebilir veritabanını açarak kullanıma hazır hale getirir.
