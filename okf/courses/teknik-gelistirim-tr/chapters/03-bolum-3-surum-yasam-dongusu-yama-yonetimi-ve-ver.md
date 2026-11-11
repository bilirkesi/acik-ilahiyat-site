---
type: Chapter
title: "Bölüm 3: Sürüm Yaşam Döngüsü, Yama Yönetimi ve Veritabanı Yükseltme"
description: Öğrenci, Oracle Database 19c proaktif yama stratejilerini, Release Update (RU) ve Release Update Revision (RUR) yaşam döngüsünü öğrenir. OPatch ve datapatch araçlarını kullanarak ikili dosya ve SQL me
course: teknik-gelistirim-tr
chapter: 3
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

Öğrenci, Oracle Database 19c proaktif yama stratejilerini, Release Update (RU) ve Release Update Revision (RUR) yaşam döngüsünü öğrenir. OPatch ve datapatch araçlarını kullanarak ikili dosya ve SQL metadata güncellemelerini iki aşamalı olarak IFS bakım pencerelerine hizalamayı kavrar. Ayrıca AutoUpgrade, DBUA ve Parallel Upgrade Utility araçları ile Oracle 19c veritabanı yükseltme süreçlerini yönetir.

# Öğrenme Hedefleri

1. Öğrenci, üç aylık Release Update (RU) ve Release Update Revision (RUR) yama stratejilerini IFS Cloud ve IFS Applications bakım pencereleriyle hizalayabilir.
2. Öğrenci, OPatch ve datapatch otomasyonunu kullanarak CDB$ROOT ve tüm PDB'lerde iki aşamalı yama uygulama adımlarını çalıştırabilir.
3. Öğrenci, AutoUpgrade ve DBUA araçları ile Oracle Database 19c sürüm yükseltme planlarını hazırlayıp uygulayabilir.

# Dersler

* Release Update (RU) & Release Update Revision (RUR) Lifecycle
* Patch Application Execution
* Oracle for SAP Cloud and Infrastructure Update
* Oracle Data Guard Concepts and Administration, 19c
* Oracle Database Database Upgrade Guide, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim (Türkçe) paneli](/courses/teknik-gelistirim-tr.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Sağlanan kaynaklara dayanarak, belirtilen öğrenme hedefleri doğrultusunda öğrencinin ne öğrendiği aşağıda açıklanmaktadır:

---

### Hedef 1: Üç Aylık Release Update (RU) ve Release Update Revision (RUR) Yama Stratejilerini IFS Cloud ve IFS Applications Bakım Pencereleriyle Hizalama

* **Yama Döngüsü ve IFS Ortamlarıyla Hizalanma:** Öğrenci, IFS Applications (IFS Cloud, IFS Applications 10 ve IFS Applications 9) altyapısını destekleyen Oracle veritabanı sistemlerinin güvenliğini ve kararlılığını korumak için Oracle'ın üç aylık (Ocak, Nisan, Temmuz, Ekim) yama bakım döngüsünün IFS Güncelleme ve Sürüm döngüleri ile hizalanması gerektiğini öğrenir.
* **Release Update (RU) Stratejisi:** Release Update (RU), güvenlik açığı düzeltmelerini, proaktif yüksek değerli hata düzeltmelerini ve kritik kararlılık geliştirmelerini içeren üç aylık birikimli bir yamadır. RU uygulaması veritabanını yeni bir ikincil sürüme taşır (örneğin 19.11 sürümünden 19.12 sürümüne). Performans değişikliklerini ve yürütme planlarını doğrulamak amacıyla ana IFS güncelleme döngüleri sırasında üretim dışı ortamlarda (DEV/TEST) kullanılması önerilir.
* **Release Update Revision (RUR) Stratejisi:** Release Update Revision (RUR), sonraki RU'lardan yeni işlevsel hata düzeltmeleri eklemeden, belirli bir RU için kritik güvenlik düzeltmeleri ve regresyon düzeltmeleri sunarak mevcut bir RU'nun ömrünü uzatır (her RU için 2 revizyona kadar). RUR uygulaması revizyon rakamını artırır (örneğin 19.11.0 sürümünden 19.11.1 sürümüne). Sıkı değişiklik yönetimi politikaları gerektiren ve temel yürütme davranışını kilitlerken güvenlik güncellemeleri gerektiren üretim (PROD) ortamlarında tercih edilir.
* **Sürüm Durumu:** Eğitim çalışma notları bu yama stratejilerini IFS Applications (IFS Cloud, IFS Applications 10 ve IFS Applications 9) ortamlarına uygular ve veritabanı sürüm örneği olarak Oracle Database 19c revizyonlarını (19.11, 19.12) sunar.

---

### Hedef 2: OPatch ve datapatch Otomasyonu ile CDB\$ROOT ve Tüm PDB'lerde İki Aşamalı Yama Uygulama Adımlarını Çalıştırma

* **Yama Öncesi Doğrulama ve Hazırlık:** Herhangi bir yama kurulumu çalıştırılmadan önce `opatch` yardımcı programı Oracle Patch Readme dosyasında belirtilen minimum sürüme güncellenmelidir. `$ORACLE_HOME` üzerinde çakışma tespiti (conflict detection) yapılarak kısmi yama uygulamaları önlenir ve veritabanı servisleri durdurulmadan önce tüm önkoşullar doğrulanır.
* **İki Aşamalı Yama Boru Hattı:**
  1. *İkili Dosya Yamalama (`opatch apply`):* Veritabanı servisleri kapalı durumdayken `$ORACLE_HOME` dizinindeki yürütülebilir ikili dosyaları, kütüphaneleri ve başlık dosyalarını değiştirir.
  2. *Yama Sonrası SQL Otomasyonu (`datapatch`):* Veritabanı yeniden açıldıktan sonra `CDB$ROOT` ve tüm Pluggable Database (PDB) yapılarında SQL metadatasını, veri sözlüğü nesnelerini ve PL/SQL paketlerini günceller.
* **Yama Kaydı Doğrulaması:** Veritabanı yöneticileri (DBA), `registry$history` ve `dba_registry_sqlpatch` veri sözlüğü görünümlerini sorgulayarak `CDB$ROOT` ve tüm PDB'lerde uygulanan RU/RUR seviyelerini ve SQL yama kaydını doğrular.
* **Sürüm Durumu:** Çalışma notları iki aşamalı yama boru hattını CDB ve PDB çok kiracılı mimarisine uygular; kaynaklar bu komutlar için belirli bir veritabanı sürüm kısıtlaması belirtmemektedir.

---

### Hedef 3: AutoUpgrade ve DBUA Araçları ile Oracle Database 19c Sürüm Yükseltme Planlarını Hazırlayıp Uygulama

* **Yükseltme Kılavuzu ve Yöntemleri:** Resmî Oracle belgesi "Oracle Database Database Upgrade Guide, 19c", Oracle Database 19c sürümüne geçiş süreçlerini düzenler. Kılavuz; yükseltme hazırlığı, otomatik ve manuel taşıma yöntemleri, sorun giderme, yükseltme sonrası görevler ve olası geri alma (downgrade) adımlarını kapsar.
* **AutoUpgrade Aracı:** "Using AutoUpgrade for Oracle Database Upgrades" (Bölüm 3) altında tanımlanan AutoUpgrade aracı, veritabanı yükseltmelerinin otomasyonunu, ön denetimlerin (pre-checks) çalıştırılmasını ve yükseltme aşamalarının yönetilmesini sağlar.
* **Database Upgrade Assistant (DBUA):** "Upgrading with Oracle Database Upgrade Assistant (DBUA)" (Ek C) altında tanımlanan DBUA aracı, grafiksel arayüz üzerinden veritabanı yükseltme adımlarını yönetir.
* **Manuel ve Alternatif Yöntemler:** Kılavuz ayrıca Parallel Upgrade Utility ile manuel yükseltme (Bölüm 4) ve Oracle Data Pump ile veri taşıma (Bölüm 9) yöntemlerini de içerir.
* **Sürüm Durumu:** Resmî kılavuz bu yükseltme planlarını ve araçlarını doğrudan Oracle Database 19c sürümüne özgü olarak belgeler.

---

💡 **Sonraki Adımlar:** `registry$history` ve `dba_registry_sqlpatch` görünümlerini sorgulayan örnek SQL kodlarını incelemek veya AutoUpgrade yapılandırma dosyası parametrelerini gözden geçirmek ister misiniz?

# Kaynaklar

* NotebookLM kaynağı `2f16cb24-12cc-447e-b1d9-730f21ba89d3`
* NotebookLM kaynağı `f712b4df-f0dd-42b8-a4cf-2775f6992718`
* NotebookLM kaynağı `399a3765-7361-4822-bd56-c0d8f8f5a596`
* NotebookLM kaynağı `4101ab09-ff0d-4b11-b109-5c5cfc602472`
* NotebookLM kaynağı `6d64ce46-7a82-4114-b656-4fa48e39707a`
