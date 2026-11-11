---
type: Quiz
title: "Ünite 1 quizi: Bölüm 1: Program Oryantasyonu ve IFS Cloud Oracle Altyapı Mimarisi"
description: Teknik Gelişim (Türkçe) 1. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 1
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-1.md
---

# Ünite 1: Bölüm 1: Program Oryantasyonu ve IFS Cloud Oracle Altyapı Mimarisi

Toplam 12 soru.

## 1. IFS Enterprise Oracle altyapı mimarisinde CDB$ROOT kapsayıcı veritabanının temel görevi aşağıdakilerden hangisidir?

*İpucu:* Kök container yapısının tüm veritabanı genelindeki sistem düzeyindeki sorumluluklarını düşünün.

A) Arka plan süreçlerini, paylaşılan sistem meta verilerini ve küresel belleği yönetmek. *
B) Yeni veritabanlarının hızlıca klonlanabilmesi için salt okunur bir şablon sunmak.
C) Farklı IFS uygulama ortamlarına ait transactional şema nesnelerini birbirinden izole etmek.
D) Yalnızca RMAN yedekleme süreçlerini ve gömülü JVM işlemlerini yürütmek.

**Cevap anahtarı:** A

**Gerekçe (A):** CDB$ROOT, multitenant mimarisinde arka plan süreçlerinin yürütüldüğü, ortak sistem meta verilerinin ve küresel bellek kaynaklarının yönetildiği ana kök kapsayıcıdır.

## 2. DEV, TEST ve PROD gibi farklı IFS uygulama ortamlarını aynı sunucu donanımı üzerinde izole ederek çalıştırmak için hangi mimari bileşen kullanılır?

*İpucu:* Tek bir kök veritabanına takılıp çıkarılabilen bağımsız veritabanı birimlerini hatırlayın.

A) CDB$ROOT
B) Pluggable Databases (PDBs) *
C) Release Update Revisions (RUR)
D) Automatic Storage Management (ASM) Disk Grupları

**Cevap anahtarı:** B

**Gerekçe (B):** PDB'ler, ortak sunucu donanımını paylaşırken DEV, TEST ve PROD gibi ayrı IFS uygulama örneklerini ve transactional şemaları birbirinden izole etmeyi sağlar.

## 3. Oracle veritabanı yama yönetiminde Release Update (RU) paketlerinin temel özelliği aşağıdakilerden hangisidir?

*İpucu:* Üç aylık periyotlarda yayımlanan ve minor sürüm numarasını güncelleyen paket türüne odaklanın.

A) Güvenlik açığı düzeltmeleri, yüksek değerli hata düzeltmeleri içeren ve ikincil sürüm numarasını artıran üç aylık birikimli yamalardır. *
B) Yalnızca bellek parametrelerini sıfırlayan ve geçici tabloları temizleyen yama betikleridir.
C) Yalnızca yılda bir kez yayımlanan ve veritabanı mimarisini tamamen değiştiren ana sürüm yamalarıdır.
D) Yeni fonksiyonel hata düzeltmeleri sunmadan sadece mevcut RU'nun ömrünü uzatan güvenlik odaklı yamalardır.

**Cevap anahtarı:** A

**Gerekçe (A):** RU yamaları üç ayda bir yayımlanan, güvenlik ve kritik hata düzeltmelerini içeren ve minor sürüm numarasını güncelleyen birikimli paketlerdir.

## 4. Üretim ortamlarının kararlılığını korumak amacıyla, yeni fonksiyonel hata düzeltmeleri eklemeden mevcut bir RU'nun ömrünü uzatan yama türü hangisidir?

*İpucu:* Var olan üç aylık güncellemeyi yeni işlevsellik katmadan revize eden yapıyı düşünün.

A) ASMM Dynamic Patch
B) Major Release Patch
C) Release Update Revision (RUR) *
D) Release Update (RU)

**Cevap anahtarı:** C

**Gerekçe (C):** RUR, yeni fonksiyonel değişiklik getirmeden güvenlik ve regresyon odaklı düzeltmelerle mevcut RU'nun kararlı kalmasını sağlar.

## 5. Automatic Shared Memory Management (ASMM) altında sga_target parametresi yapılandırıldığında aşağıdaki bellek alanlarından hangileri dinamik olarak dengelenir?

*İpucu:* ASMM'nin paylaşılan bellek (SGA) havuzlarını dinamik olarak nasıl paylaştırdığını hatırlayın.

A) Buffer Cache, Shared Pool ve Large Pool *
B) Oturum imleç sınırları (open_cursors)
C) İşletim sistemi kullanıcı süreç sınırları (processes)
D) PGA süreç başına sıralama (sort) alanları

**Cevap anahtarı:** A

**Gerekçe (A):** ASMM etkinleştirildiğinde sga_target parametresi Buffer Cache, Shared Pool ve Large Pool gibi SGA dinamik bileşenlerini otomatik yönetir.

## 6. Yoğun toplu işler (batch runs) sırasında sıralama (ORDER BY) ve hash join işlemlerinin geçici tablos alanına (temp tablespace) taşmasını önlemek için hangi parametre kullanılır?

*İpucu:* Süreç başına özel olan ve bellek içi sıralama/birleştirme işlemlerini yöneten parametreyi düşünün.

A) open_cursors
B) sga_target
C) processes
D) pga_aggregate_target *

**Cevap anahtarı:** D

**Gerekçe (D):** pga_aggregate_target, tüm oturumların PGA bellek alanlarını dinamik yöneterek bellek içi sıralama ve birleştirme işlemlerini optimize eder ve disk/temp kullanımını engeller.

## 7. IFS orta katman oturumlarının yeniden kullanımı için ayrıştırılmış SQL, PL/SQL kodlarını ve yürütme planlarını saklayan SGA bellek havuzu hangisidir?

*İpucu:* Sorgu yürütme planlarının ve veri sözlüğünün tüm oturumlarca ortak paylaşıldığı bellek havuzunu hatırlayın.

A) Large Pool
B) Private SQL Area
C) Shared Pool *
D) Buffer Cache

**Cevap anahtarı:** C

**Gerekçe (C):** Shared Pool, ayrıştırılmış (parsed) SQL, PL/SQL kodları, veri sözlüğü bilgileri ve execution plan'ları tutarak sabit ayrıştırma (hard parse) maliyetlerini önler.

## 8. Veritabanına eşzamanlı bağlanabilecek maksimum işletim sistemi süreç sayısını belirleyen processes parametresi yetersiz kaldığında hangi hatayla karşılaşılır?

*İpucu:* İşletim sistemi süreç (process) sınırının dolduğunu gösteren standart Oracle hata kodunu hatırlayın.

A) ORA-00942: table or view does not exist
B) ORA-00020: maximum number of processes exceeded *
C) ORA-03113: end-of-file on communication channel
D) ORA-01000: maximum open cursors exceeded

**Cevap anahtarı:** B

**Gerekçe (B):** processes parametresi aşıldığında veritabanı yeni gelen orta katman bağlantı taleplerini reddeder ve ORA-00020 hatası verir.

## 9. IFS orta katmanındaki Java/JDBC bağlantı havuzlarının deyim imleçlerini (statement handles) önbelleğe alabilmesini sağlayan ve oturum başına sınırı belirleyen parametre hangisidir?

*İpucu:* Oturum bazında 'ORA-01000' hatasının oluşmasını engelleyen parametreyi hatırlayın.

A) open_cursors *
B) sga_target
C) pga_aggregate_target
D) processes

**Cevap anahtarı:** A

**Gerekçe (A):** open_cursors parametresi, tek bir oturumun aynı anda açık tutabileceği maksimum imleç sayısını düzenleyerek ORA-01000 hatasını önler.

## 10. SGA dinamik bileşen boyutlarını ve PGA toplam tahsisatını gerçek zamanlı izlemek için hangi V$ dynamic performance görünümleri sorgulanır?

*İpucu:* SGA dinamik bileşenlerini ve PGA istatistiklerini veren 'dynamic components' ve 'pgastat' görünümlerini arayın.

A) V$SGA_DYNAMIC_COMPONENTS ve V$PGASTAT *
B) V$SESSION ve V$PROCESS
C) V$CLUSTER_INTERCONNECTS ve V$ASM_DISKGROUP
D) V$INSTANCE ve V$DATABASE

**Cevap anahtarı:** A

**Gerekçe (A):** Eğitim kaynaklarındaki örneklerde V$SGA_DYNAMIC_COMPONENTS bileşen boyutlarını, V$PGASTAT ise PGA hedef ve toplam tahsis miktarını izlemek için kullanılır.

## 11. IFS veritabanı altyapısında sga_target ve pga_aggregate_target parametrelerinin SQL komutu ile hem canlı bellekte hem de başlatma dosyasında güncellenmesi için hangi deyim kullanılır?

*İpucu:* Hem canlı bellek (memory) hem de parametre dosyası (spfile) üzerine aynı anda yazan seçeneği hatırlayın.

A) SCOPE = BOTH *
B) SCOPE = SPFILE
C) SCOPE = INSTANCE
D) SCOPE = MEMORY

**Cevap anahtarı:** A

**Gerekçe (A):** SCOPE = BOTH kullanımı, parametre değişikliğinin hem çalışan veritabanı belleğinde hem de SPFILE yapılandırma dosyasında geçerli olmasını sağlar.

## 12. SGA bellek mimarisinde yer alan Buffer Cache bileşeninin temel işlevi aşağıdakilerden hangisidir?

*İpucu:* Diske erişim ihtiyacını azaltmak için veri bloklarını bellekte saklayan bileşeni düşünün.

A) Veri sözlüğü ve önceden derlenmiş PL/SQL kodlarını depolamak.
B) Sadece sıralama (ORDER BY) ve hash join iş yüklerini barındırmak.
C) Sık sorulan sorgularda yanıt süresini optimize etmek için diskten okunan veri bloklarını bellekte tutmak. *
D) RMAN yedekleme tamponlarını ve paralel sorgu süreçlerini yönetmek.

**Cevap anahtarı:** C

**Gerekçe (C):** Buffer Cache, disk I/O darboğazlarını azaltmak amacıyla veritabanı veri bloklarını bellekte önbelleğe alır.
