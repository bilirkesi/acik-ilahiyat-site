---
type: Questions
title: "Teknik Gelişim (Türkçe) Soru & Cevap"
description: Teknik Gelişim (Türkçe) dersinin kaynaklarından üretilmiş 100 soru-cevap.
course: teknik-gelistirim-tr
question_count: 100
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T06:36:15Z }
resource: /courses/teknik-gelistirim-tr/chat.md
---

# Teknik Gelişim (Türkçe) Soru & Cevap

Sorular dersin kendi kaynaklarından üretildi; her cevabın kaynak listesi vardır.

## 1. Bölüm: Bölüm 1: Program Oryantasyonu ve IFS Cloud Oracle Altyapı Mimarisi

### IFS Applications orta katman oturumlarının yeniden kullanımı için Shared Pool ve Buffer Cache bileşenleri nasıl bir işlev görür?

System Global Area (SGA) bünyesindeki Shared Pool; ayrıştırılmış SQL, PL/SQL kodlarını, yürütme planlarını ve veri sözlüğü bilgilerini saklayarak IFS orta katman oturumlarının hızlı yeniden kullanımını sağlar [1]. Buffer Cache ise diskten okunan veri bloklarını önbelleğe alarak frequent sorguların yanıt sürelerini optimize eder [1]. sga_target altındaki dinamik tahsisat, bu iki bileşeni operasyonel iş yükü taleplerine göre dengeler [1]. Kaynaklar bu SGA bellek bileşenlerinin işlevleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Memory Architecture Tuning (sga_target & pga_aggregate_target)

### IFS Applications ve IFS Cloud veritabanı altyapısında sga_target parametresinin ayarlanması hangi bellek havuzlarını dinamik olarak dengeler ve sisteme nasıl katkı sağlar?

sga_target parametresinin sıfır olmayan bir değere ayarlanması Otomatik Paylaşılan Bellek Yönetimini (ASMM) etkinleştirerek Buffer Cache, Shared Pool, Large Pool ve Java Pool bellek havuzlarının boyutlarını dinamik olarak dengeler [1]. Shared Pool ayrıştırılmış SQL ve PL/SQL kodlarını saklarken, Buffer Cache veritabanı bloklarını önbelleğe alır [1]. Bu dinamik akortlama, IFS Applications (IFS Cloud ve IFS Applications 10/9) iş yüklerinde sabit ayrıştırma (hard parse) ve disk I/O darboğazlarını önler [1]. Kaynaklar bu ASMM parametre tanımları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Memory Architecture Tuning (sga_target & pga_aggregate_target)

### IFS Cloud 25R1 ve 26R2 mimarisi için Oracle 19c veritabanı depolama tier ve sunucu gereksinimleri hakkında kaynaklar hangi detayları vermektedir?

Seçilen kaynaklar içerisinde IFS Cloud 25R1 ve IFS Cloud 26R2 sürümlerine özel Oracle 19c veritabanı depolama tier ve sunucu kapasite gereksinimlerine dair somut teknik veriler bulunmamaktadır [1]. Kaynaklar yalnızca IFS Applications (IFS Cloud, IFS Applications 10/9) platformlarının kritik ERP, EAM ve FSM operasyonlarında Oracle veritabanı arka uçlarına dayandığını belirtmektedir [1]. Kaynakların kapsamadığı bu sürüme özel depolama ve donanım boyutlandırma detayları kaynaklarda yer almadığı için açıkça belirtilmiştir [1].

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines

### IFS Enterprise Oracle Architecture & DBA Eğitim Programı oryantasyonunda müfredat ve ders planı nasıl yapılandırılır?

Program oryantasyonunda müfredat, veritabanı yöneticilerinin hedeflerini mimari kılavuzlar ve teknik ders başlıklarıyla hizalayacak şekilde yapılandırılır [1, 2]. Eğitim programı multitenant izolasyonu, RAC kümelemesi, ASM depolama yönetimi, Data Guard felaket kurtarma ve AWR/ASH performans teşhisi gibi temel modülleri kapsar [1, 3]. Bu yapılandırma kurumsal veritabanı yöneticileri için kademeli bir öğrenme yol haritası sunar [1]. Kaynaklar bu eğitim yapısını IFS Enterprise Oracle Architecture & DBA Training Program kapsamına özgü olarak sunmaktadır [1, 2].

**Kaynaklar:** Chapter 1 Core Topics Overview, IFS Oracle DBA Training Setup, IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines

### IFS ortamlarında adanmış Pluggable Database (PDB) yapıları (PDB$SEED ve Kullanıcı PDB'leri) ne amaçla kullanılır?

PDB$SEED yapısı yeni pluggable veritabanları oluşturmak için sistem tarafından sağlanan şablon bir veritabanı olarak görev yapar [1]. Kullanıcı PDB'leri ise DEV, TEST ve PROD gibi ayrı IFS uygulama örneklerini aynı sunucu donanımı üzerinde izole etmek amacıyla oluşturulur [1]. Bu yapı sayesinde PDB durumları, konteyner bağlamları ve şema nesneleri veritabanı seviyesinde ayrıştırılır [1]. Kaynaklar bu PDB kullanım amaçları için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Chapter 1 Core Topics Overview

### IFS veritabanı ortamlarında pga_aggregate_target parametresi hangi işlemler için kullanılır ve yetersiz ayarlanması durumunda ne gibi sorunlar yaşanır?

pga_aggregate_target parametresi, tüm oturumlar genelinde tahsis edilen toplam Program Global Area (PGA) belleği için küresel bir hedef belirler [1]. Oracle, sıralama (ORDER BY), hash join ve bitmap birleştirme iş alanlarına ayrılan belleği dinamik olarak kontrol ederek bu limit dahilinde tutar [1]. Doğru yapılandırma, ağır toplu iş raporları sırasında geçici tablespace (temp tablespace) alanına aşırı veri taşmasını engeller [1]. Kaynaklar bu PGA parametre ayarı için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Memory Architecture Tuning (sga_target & pga_aggregate_target)

### IFS veritabanı yaşam döngüsünde Release Update (RU) ve Release Update Revision (RUR) yama stratejileri nasıl tanımlanır?

Release Update (RU), güvenlik açıklarını, yüksek değerli hata düzeltmelerini ve kritik kararlılık geliştirmelerini içeren üç aylık birikimli bir yamadır [1]. Release Update Revision (RUR) ise yeni işlevsel hata düzeltmesi eklemeden mevcut bir RU için kritik güvenlik ve regresyon düzeltmeleri sunarak RU ömrünü uzatır [1]. Üretim dışı ortamlarda (DEV ve TEST) RU tercih edilirken, üretim (PROD) ortamlarında kararlılık için RUR uygulanır [1]. Kaynaklar bu yama yaşam döngüsü tanımları için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Chapter 1 Core Topics Overview

### IFS veritabanı örneklerinde processes başlangıç parametresinin yetersiz ayarlanması hangi hataya yol açar ve bağlantı havuzlarını nasıl etkiler?

Statik bir başlangıç parametresi olan processes, Oracle veritabanı örneğine aynı anda bağlanabilecek maksimum işletim sistemi kullanıcı süreci sayısını tanımlar [1]. Her adanmış orta katman bağlantı havuzu, arka plan süreçleri (PMON, DBWn, LGWR) ve veritabanı yöneticisi oturumu bir süreç yuvası tüketir [1]. Parametrenin çok düşük ayarlanması ORA-00020: maximum number of processes exceeded hatasına yol açarak orta katman sunucularının yeni oturum açmasını engeller [1]. Kaynaklar bu parametre tanımı için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** Session & Cursor Capacity Parameter Tuning (open_cursors & processes)

### Oracle çok kiracılı (Multitenant) veritabanı mimarisinde CDB$ROOT kök konteyner yapısının temel işlevi ve yönetim sorumlulukları nelerdir?

CDB$ROOT tekil kök konteyner veritabanı, arka plan süreçlerini, paylaşılan sistem metadatasını ve küresel belleği yönetir [1]. Ortak kullanıcı hesaplarını, sistem metadatasını ve küresel veritabanı başlangıç parametrelerini saklar [1]. Bu yapı sayesinde farklı IFS uygulama ortamları ortak veritabanı altyapısını paylaşabilir [1]. Kaynaklar bu CDB$ROOT mimari tanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Chapter 1 Core Topics Overview

### Private SQL Area yönetimi için open_cursors parametresi nasıl bir rol oynar ve hangi kapasite hatasını önler?

Dinamik open_cursors parametresi, tek bir oturumun Private SQL Area içinde aynı anda açık tutabileceği maksimum imleç sayısını belirler [1]. IFS ortamındaki Java/JDBC bağlantı havuzları gibi orta katman çatıları yürütme hızını artırmak için ifade tanıtıcılarını önbelleğe alır [1]. Parametrenin yeterince yüksek ayarlanması imleç sızıntılarını önleyerek ORA-01000: maximum open cursors exceeded hatasını engeller [1]. Kaynaklar bu parametre için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Session & Cursor Capacity Parameter Tuning (open_cursors & processes)

## 2. Bölüm: Bölüm 2: Multitenant Veritabanı Yönetimi: CDB ve PDB İzolasyonu

### Aynı konteyner örneğinde çalışan kardeş PDB'leri etkilemeden gerçekleştirilebilecek bağımsız yaşam döngüsü operasyonları nelerdir?

Veritabanı yöneticileri, aynı CDB bünyesinde çalışan kardeş PDB'lerdeki operasyonları aksatmadan bireysel bir PDB'yi çıkarabilir (unplug), klonlayabilir (clone) veya silebilir (drop) [1]. Bu bağımsız yaşam döngüsü operasyonları sayesinde diğer IFS ortamlarının çalışması kesintiye uğramaz [1]. Böylece veritabanı yönetim yükü önemli ölçüde azalır [1]. Kaynaklar bu yaşam döngüsü operasyonları için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### Bir PDB içinde oturum konteyner izolasyonunu ve aktif oturumları doğrulamak için hangi SQL sorguları çalıştırılır?

Mevcut oturumun konteyner bağlamını ve id bilgisini doğrulamak için sys_context('USERENV', 'CON_NAME') ve sys_context('USERENV', 'CON_ID') fonksiyonları DUAL tablosundan sorgulanır [1]. PDB'ler genelindeki aktif oturum dağılımını ve durumlarını incelemek için ise v$session görünümü con_id, username ve status sütunlarına göre gruplanarak sorgulanır [1]. Bu doğrulama adımları oturumların doğru PDB bağlamında çalıştığını gösterir [1]. Kaynaklar bu doğrulama sorguları için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### IFS Applications ortamlarında Kullanıcı PDB'leri (User PDBs) hangi verileri barındırır ve ne amaçla kullanılır?

Kullanıcı PDB'leri, IFS Applications için gerekli olan kullanıcı veri şemalarını, tablespace yapılarını ve uygulamaya özel metadataları barındıran adanmış pluggable veritabanlarıdır [1]. Production, Test veya Development gibi bireysel IFS uygulama örneklerini birbirinden tamamen izole etmek için kullanılır [1]. Bu izolasyon sayesinde veritabanı düzeyinde uygulama şemaları ayrıştırılır [1]. Kaynaklar Kullanıcı PDB'leri için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** Container Database (CDB) Administration

### IFS Applications ortamlarında orta katman (mid-tier) bağlantı havuzlarının PDB ile etkileşimi mantıksal izolasyonu nasıl korur?

Orta katman bağlantı havuzları yalnızca kendilerine atanan PDB servisi ile etkileşime girer [1]. Bu işlemsel bağlam anahtarlaması sayesinde Development veya Testing gibi üretim dışı örneklerdeki oturumların Production şema nesnelerine erişmesi ya da bunları değiştirmesi engellenir [1]. Böylece farklı IFS uygulama aşamaları aynı fiziksel donanımda güvenle çalıştırılır [1]. Kaynaklar bu bağlantı havuzu izolasyonu için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### Oracle Multitenant mimarisinde CDB$ROOT kök konteyner veritabanı hangi temel bileşenleri ve kaynakları yönetir?

CDB$ROOT kök konteyner veritabanı Oracle sistem metadatasını, ortak kullanıcı hesaplarını ve küresel veritabanı başlangıç parametrelerini saklar [1]. Ayrıca arka plan süreçlerini, paylaşılan sistem metadatasını ve küresel veritabanı belleğini yönetir [1]. Bu mimari sayesinde farklı IFS uygulama ortamları ortak veritabanı altyapısını verimli bir şekilde paylaşabilir [1]. Kaynaklar bu CDB$ROOT mimari tanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Container Database (CDB) Administration

### Oracle Multitenant yapısında Pluggable Database (PDB) izolasyonu veri sözlüğü (data dictionary) düzeyinde nasıl sağlanır?

CDB$ROOT ortak sistem metadatasını yönetirken, her PDB kullanıcı tarafından oluşturulan tablolar, indeksler ve uygulama şemaları için kendi özel veri sözlüğünü (private data dictionary) korur [1]. Her PDB, bağlı olan orta katman uygulamasına bağımsız bir veritabanı gibi hizmet verir [1]. Bu özel veri sözlüğü yapısı sayesinde farklı ortamların metadataları birbirine karışmaz [1]. Kaynaklar bu veri sözlüğü izolasyonu için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### PDB seviyesinde bellek kullanımını sınırlandırmak için hangi parametreler kullanılır ve bu sınırlandırma ne sağlar?

PDB seviyesinde sga_min_size, sga_target ve pga_aggregate_limit parametreleri yapılandırılarak bellek kotaları belirlenir [1]. Bu bellek sınırları, tek bir konteynerdeki kontrolden çıkmış sorguların sunucudaki paylaşılan belleği tüketmesini engeller [1]. Bu sayede birincil işlem iş yükü kardeş PDB'lerin bellek kullanımından korunur [1]. Kaynaklar bu PDB bellek sınırlandırma parametreleri için belirli bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### Pluggable veritabanı oluşturma süreçlerinde PDB$SEED yapısının görevi ve kullanım amacı nedir?

PDB$SEED yapısı, sistem tarafından sağlanan şablon bir Pluggable Database (PDB) olarak görev yapar [1]. Yeni IFS ortamları için hızlı bir şekilde ek pluggable veritabanları oluşturmak amacıyla kullanılır [1]. Bu şablon mekanizması veritabanı devreye alma süreçlerini hızlandırır [1]. Kaynaklar PDB$SEED yapısının işlevi için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Container Database (CDB) Administration

### Veritabanı yöneticisi CDB root bağlamından hedef bir IFS PDB ortamını açmak ve konteyner bağlamını değiştirmek için hangi SQL komutlarını kullanır?

Hedef veritabanını açmak için ALTER PLUGGABLE DATABASE ifsprod OPEN komutu, oturum konteyner bağlamını değiştirmek için ise ALTER SESSION SET CONTAINER = ifsprod komutu kullanılır [1]. Mevcut veritabanı konteyner durumları ise v$pdbs görünümü sorgulanarak doğrulanır [1]. Bu komutlar multitenant yapıda güvenli bağlam geçişi sağlar [1]. Kaynaklar bu SQL komut dizilimleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Container Database (CDB) Administration

### Üretim dışı PDB iş yüklerinin Production performansını olumsuz etkilemesini önlemek için PDB Resource Manager profilleri neleri düzenler?

PDB Resource Manager profilleri, PDB başına CPU paylarını, paralel yürütme kuyruklarını ve oturum sınırlarını özel olarak tahsis eder [1]. Ağır test betiklerinin veya toplu işlerin kaynakları tüketmesini engelleyerek üretim ortamının performansını korur [1]. Böylece çekirdek üretim iş yükleri kaynak yetersizliğinden korunmuş olur [1]. Kaynaklar PDB Resource Manager profilleri için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

## 3. Bölüm: Bölüm 3: Sürüm Yaşam Döngüsü, Yama Yönetimi ve Veritabanı Yükseltme

### CDB$ROOT ve tüm PDB'lerde uygulanan yama seviyeleri ve SQL yama geçmişi hangi veri sözlüğü görünümlerinden doğrulanır?

Veritabanı yöneticileri CDB$ROOT ve tüm PDB yapılarında registry$history ve dba_registry_sqlpatch veri sözlüğü görünümlerini sorgular [1]. Bu sorgular sayesinde uygulanan RU veya RUR seviyeleri, yama kimlikleri ve SQL yama uygulama durumları doğrulanır [1]. Başarısız veya eksik kalan yama adımları bu görünümler üzerinden tespit edilir [1]. Kaynaklar bu veri sözlüğü görünümleri için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Release Update (RU) & Release Update Revision (RUR) Lifecycle

### Grafik arayüz üzerinden veritabanı yükseltme işlemlerini yürütmek için hangi resmî Oracle aracı kullanılır?

Grafiksel arayüz üzerinden adım adım veritabanı yükseltme operasyonlarını yönetmek için Database Upgrade Assistant (DBUA) aracı kullanılır [1]. DBUA, yükseltme adımlarını görsel bir sihirbaz üzerinden yapılandırıp çalıştırmaya imkan tanır [1]. Resmî kılavuz DBUA aracını Oracle Database 19c yükseltme kılavuzunda sunmaktadır [1].

**Kaynaklar:** [Oracle Database Database Upgrade Guide, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/upgrd/)

### IFS Applications bakım pencerelerinde yama stratejisinin üretim (PROD) ve üretim dışı (DEV/TEST) ortamlara dağıtımı nasıl planlanır?

Ana IFS güncelleme döngülerinde yeni işlevsel düzeltmeleri test etmek için üretim dışı ortamlarda (DEV ve TEST) Release Update (RU) uygulanır [1]. Üretim (PROD) ortamlarında ise yürütme planı kararlılığını korumak ve yalnızca kritik güvenlik düzeltmelerini almak amacıyla Release Update Revision (RUR) tercih edilir [1]. Bu hizalama sayesinde bakım pencerelerinde beklenmeyen performans değişiklikleri önlenir [1]. Kaynaklar bu yama dağıtım stratejisini Oracle Database 19c ve IFS Applications 10/9 ortamlarına uygulamaktadır [1].

**Kaynaklar:** Release Update (RU) & Release Update Revision (RUR) Lifecycle

### Oracle Database 19c resmî yükseltme kılavuzunda manuel yükseltme ve veri taşıma için hangi alternatif araçlar yer almaktadır?

Resmî yükseltme kılavuzu manuel yükseltme operasyonları için Parallel Upgrade Utility aracını tanımlamaktadır [1]. Veri taşıma ve aktarım yöntemleri için ise Oracle Data Pump altyapısı sunulmaktadır [1]. Bu araçlar yükseltme sürecinde alternatif veya tamamlayıcı yöntemler olarak kullanılır [1]. Resmî dokümantasyon bu kılavuz detaylarını Oracle Database 19c sürümüne özgü olarak sunmaktadır [1].

**Kaynaklar:** [Oracle Database Database Upgrade Guide, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/upgrd/)

### Oracle Database 19c veritabanı yükseltme süreçlerinde AutoUpgrade aracı hangi işlevleri üstlenir?

AutoUpgrade aracı veritabanı yükseltme süreçlerinin otomasyonunu, yükseltme öncesi kontrollerin (pre-checks) çalıştırılmasını ve yükseltme aşamalarının yönetilmesini sağlar [1]. Yükseltme boru hattını uçtan uca otomatik yöneterek manuel hata riskini en aza indirir [1]. Resmî dokümantasyon bu AutoUpgrade aracını doğrudan Oracle Database 19c sürüm yükseltmeleri için belgelendirmektedir [1].

**Kaynaklar:** [Oracle Database Database Upgrade Guide, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/upgrd/)

### Oracle veritabanı yama stratejisinde Release Update (RU) nedir ve veritabanı sürüm numarasına nasıl etki eder?

Release Update (RU), güvenlik açıklarını, yüksek değerli hata düzeltmelerini ve kritik kararlılık geliştirmelerini içeren üç aylık birikimli bir yamadır [1]. RU uygulaması veritabanını yeni bir ikincil sürüme taşır ve ikincil sürüm numarasını artırır (örneğin 19.11 değerinden 19.12 değerine) [1]. Performans değişikliklerini doğrulamak amacıyla ana güncelleme döngülerinde üretim dışı ortamlarda (DEV ve TEST) uygulanması önerilir [1]. Kaynaklar bu RU revizyon örneklerini Oracle Database 19c ve IFS Applications 10/9 ortamları bağlamında sunmaktadır [1].

**Kaynaklar:** Release Update (RU) & Release Update Revision (RUR) Lifecycle

### Release Update Revision (RUR) yamalarının temel kullanım amacı nedir ve Release Update (RU) paketlerinden farkı nasıl tanımlanır?

Release Update Revision (RUR), yeni işlevsel hata düzeltmesi eklemeden mevcut bir RU için kritik güvenlik ve regresyon düzeltmeleri sunarak RU ömrünü uzatır [1]. RUR uygulaması revizyon rakamını artırır (örneğin 19.11.0 değerinden 19.11.1 değerine) ve her RU için en fazla iki revizyon yayınlanır [1]. Temel yürütme davranışını kilitlerken güvenlik güncellemeleri gerektiren üretim (PROD) ortamlarında tercih edilir [1]. Kaynaklar bu RUR tanımını Oracle Database 19c ve IFS Applications ortamları için vermektedir [1].

**Kaynaklar:** Release Update (RU) & Release Update Revision (RUR) Lifecycle

### Veritabanı yama uygulaması öncesinde OPatch yardımcı programı ile hangi ön doğrulamalar ve kontroller yapılır?

Yama kurulumu çalıştırılmadan önce OPatch yardımcı programı Oracle Patch Readme dosyasında belirtilen minimum sürüme güncellenmelidir [1]. Oracle Home ($ORACLE_HOME) üzerinde çakışma tespiti (conflict detection) yapılarak kısmi yama uygulamaları engellenir ve veritabanı servisleri durdurulmadan önce tüm sistem önkoşulları doğrulanır [1]. Bu ön kontroller yazılım bozulmalarını ve beklenmeyen kesintileri önler [1]. Kaynaklar bu OPatch doğrulama adımları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Patch Application Execution

### İki aşamalı yama boru hattında birinci aşama olan ikili dosya yamalama (opatch apply) süreci nasıl yürütülür?

Birinci aşamada veritabanı servisleri tamamen durdurulmuş durumdayken opatch apply komutu çalıştırılır [1]. Bu komut $ORACLE_HOME dizinindeki yürütülebilir ikili dosyaları, kütüphaneleri ve başlık dosyalarını doğrudan günceller [1]. İkili dosya güncellemesi tamamlanmadan veritabanı servisleri yeniden başlatılmaz [1]. Kaynaklar ikili dosya yamalama süreci için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** Patch Application Execution

### İki aşamalı yama boru hattında ikinci aşama olan datapatch otomasyonu ne zaman ve hangi veritabanı katmanlarında çalıştırılır?

İkili dosya güncellemesi tamamlanıp veritabanı servisleri yeniden açıldıktan sonra datapatch otomasyonu çalıştırılır [1]. Datapatch aracı CDB$ROOT kök konteynerinde ve tüm Pluggable Database (PDB) yapılarında SQL metadatasını, veri sözlüğü nesnelerini ve PL/SQL paketlerini otomatik olarak günceller [1]. Bu sayede SQL düzeyindeki yama adımları tüm konteynerlere uygulanmış olur [1]. Kaynaklar multitenant veritabanlarında datapatch kullanımı için özel bir sürüm kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Patch Application Execution

## 4. Bölüm: Bölüm 4: Depolama Mimarisi, ASM ve Kapasite Yönetimi

### ASM Fine-Grained Striping mekanizması Allocation Unit birimlerini nasıl böler ve hangi veritabanı varlıklarında gecikmeyi düşürür?

Fine-Grained Striping, Allocation Unit birimlerini tüm diskler üzerine dağıtılan 128 KB boyutundaki daha küçük şerit kümelerine böler [1]. Online Redo Logs (ORLs), Control Files ve Flashback Logs gibi düşük gecikme gerektiren küçük boyutlu yazma operasyonlarında I/O süresini optimize etmek için kullanılır [1]. Bu sayede eşzamanlı küçük yazma operasyonlarındaki gecikmeler en aza indirilir [1]. Kaynaklar Fine-Grained Striping mekanizması için belirli bir veritabanı sürümü koymamaktadır [1].

**Kaynaklar:** ASM Striping & Redundancy for OLTP

### ASM disk gruplarının toplam kapasitesini, boş alanını ve kullanım yüzdesini sorgulamak için veritabanı yöneticileri hangi SQL sorgusunu çalıştırır?

Veritabanı yöneticileri ASM örneğine (+ASM) bağlanarak v$asm_diskgroup görünümünü sorgular [1]. Bu görünüm üzerinden total_mb ve free_mb sütunları kullanılarak disk grubunun toplam boyutu, boş alanı ve yüzde kullanım oranı hesaplanır [1]. Bu sorgu sayesinde DATA ve RECO disk gruplarının doluluk durumları anlık olarak izlenir [2, 1]. Kaynaklar bu görünüm sorgusu için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Tablespace & ASM Disk Space Thresholds, Disk Group Architecture (DATA & RECO)

### IFS Cloud ortamlarında tablo bölümleme (table partitioning) uygulaması kaynaklarda nasıl açıklanmaktadır?

Resmî IFS Cloud dokümantasyonunda Oracle Partitioning seçeneğinin IFS Cloud ile kullanımı desteklenen ('Y') bir özellik olarak belirtilmektedir [1]. Tablo bölümleme ile küresel ve yerel indeks bölümlerinin IFS Applications 9 & 10 üzerinde test edildiği ve doğrulandığı ifade edilmiştir [1]. Ancak kaynaklar yüksek hacimli işlem tablolarında bölümleme stratejilerinin adım adım uygulanmasına dair daha ayrıntılı kod veya komut bilgisi vermemektedir [1]. Kaynakların kapsamadığı bu uygulama ayrıntıları kaynaklarda yer almadığı için açıkça belirtilmiştir [1].

**Kaynaklar:** screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-010-planning-installation-010-storage-tier-considerations-010-oracle-db-19c-Oracle-19c-Enterprise-Edition-19c-options-and-feat.pdf

### Kurtarma operasyonları için ayrılan RECO disk grubunun rolü nedir ve veri dosyalarından izole edilmesi ne sağlar?

RECO (veya FRA) disk grubu; arşiv logları, RMAN yedek kümeleri, kontrol dosyası kopyaları, Flashback logları ve online redo logların çoklanan kopyalarını depolayan adanmış kurtarma alanıdır [1]. Kurtarma dosyalarının DATA grubundan izole edilmesi, ağır yedekleme veya arşivleme işlemlerinin aktif veritabanı işlemleriyle disk bant genişliği için yarışmasını engeller [1]. Bu sayede aktif işlem performansı aksamadan korunur [1]. Kaynaklar bu kurtarma alanı yapısı için özel bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### Oracle ASM depolama yapısında External, Normal ve High Redundancy modelleri veriyi nasıl korur?

External Redundancy modelinde ASM seviyesinde aynalama yapılmaz ve veri koruması donanım RAID veya SAN mimarisine bırakılır [1, 2]. Normal Redundancy en az iki Failure Group arasında 2 yönlü aynalama sağlarken, High Redundancy en az üç Failure Group arasında 3 yönlü aynalama uygular [1, 2]. Yüksek erişilebilirlik gerektiren kritik IFS kurumsal kurulumlarında High Redundancy tercih edilir [1, 2]. Kaynaklar bu yedeklilik seviyeleri için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1, 2].

**Kaynaklar:** Disk Group Architecture (DATA & RECO), ASM Striping & Redundancy for OLTP

### Oracle ASM şeritlendirme mimarisinde Coarse-Grained Striping hangi dosya türleri ve I/O erişim kalıpları için kullanılır?

Coarse-Grained Striping, Allocation Unit (AU) boyutunun tamamını (genellikle 1 MB ila 4 MB) kullanarak veriyi diskler üzerine dağıtır [1]. Veritabanı veri dosyaları, indeks tablespace'leri, geçici dosyalar ve RMAN yedek kümeleri gibi büyük ve sıralı I/O gerektiren veri yapıları için tasarlanmıştır [1]. Bu şeritlendirme modeli büyük veri bloklarının sıralı okunmasını optimize eder [1]. Kaynaklar Coarse-Grained Striping kullanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** ASM Striping & Redundancy for OLTP

### Oracle Automatic Storage Management (ASM) mimarisinde DATA disk grubunun birincil işlevi nedir ve hangi dosya türlerini barındırır?

DATA disk grubu, aktif veri dosyalarını, indeks tablespace'lerini, SYSTEM ve SYSAUX tablespace'lerini, geçici dosyaları ve online redo log gruplarını barındıran birincil operasyonel depolama alanıdır [1]. IFS Applications (IFS Cloud ve IFS Applications 10/9) orta katman işlemlerini yürütmek için bu grupta yüksek okuma ve yazma IOPS performansına öncelik verilir [1]. Bu depolama yapısı aktif veritabanı operasyonlarının yüksek başarım ile yürütülmesini sağlar [1]. Kaynaklar bu disk grubu tanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### Oracle Enterprise Manager (OEM) üzerinden tanımlanan yüzde 85 uyarı (warning) ve yüzde 95 kritik (critical) alan eşiklerinin operasyonel amacı nedir?

%85 uyarı eşiği, veritabanı yöneticilerine veri dosyası büyümesini inceleme ve rutin bakım pencerelerinde alan genişletme planlama imkanı tanır [1]. %95 kritik eşiği ise yetersiz alan nedeniyle oluşabilecek kesintileri ve veritabanı duraklamalarını önlemek için acil idari müdahale gerektiğini gösterir [1]. Bu iki kademeli uyarı yapısı ERP operasyonlarının kararlılığını korur [1]. Kaynaklar bu depolama eşik değerleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Tablespace & ASM Disk Space Thresholds

### Veritabanı seviyesinde tablespace alan kullanımı uyarı eşikleri programatik olarak hangi PL/SQL paketi ve yordamı ile tanımlanır?

Tablespace alan kullanımı uyarı eşikleri DBMS_SERVER_ALERT paketi ve SET_THRESHOLD yordamı çalıştırılarak programatik olarak tanımlanır [1]. warning_value parametresi '85', critical_value parametresi '95' ve metric_id parametresi TABLESPACE_SPACE_USAGE olarak ayarlanır [1]. Yapılandırılan bu eşik ayarları DBA_THRESHOLDS veri sözlüğü görünümü sorgulanarak doğrulanır [1]. Kaynaklar bu PL/SQL paketi ve görünüm kullanımı için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Tablespace & ASM Disk Space Thresholds

### Veritabanı yöneticileri bir veritabanı dosyasının ASM şeritlendirme durumunu ve disk grubu özelliklerini hangi dinamik görünümlerden sorgular?

Veritabanı yöneticileri ASM örneğine (+ASM) bağlanarak V\(ASM_FILE ve V\)ASM_ALIAS görünümlerinden dosyaların fine veya coarse şeritlendirme durumlarını denetler [1]. Disk grubu boş alanı, Allocation Unit boyutları ve yedeklilik seviyeleri ise V$ASM_DISKGROUP görünümü üzerinden sorgulanır [2]. Bu görünümler depolama katmanının anlık durumunu inceleme imkanı verir [2, 1]. Resmî Oracle kılavuzu bu ASM yönetimi araçlarını Release 19c için belgelemektedir [3].

**Kaynaklar:** ASM Striping & Redundancy for OLTP, Disk Group Architecture (DATA & RECO), [Oracle Automatic Storage Management Administrator's Guide](https://docs.oracle.com/en/database/oracle/oracle-database/19/ostmg/)

## 5. Bölüm: Bölüm 5: RAC ve Grid Infrastructure Kümeleme Mimarisi

### Fast Application Notification (FAN) ve Oracle Notification Service (ONS) altyapısı istemci bağlantı havuzlarına nasıl bir fayda sağlar?

Fast Application Notification (FAN), veritabanı düğüm veya servis durum değişikliklerini (UP ve DOWN olayları) ve yük dengeleme metriklerini gerçek zamanlı yayınlar [1]. Oracle Database 12c Release 2 (12.2) ve sonraki sürümlerde tüm istemciler FAN olaylarını almak için Oracle Notification Service (ONS) kullanır [1]. Entegre bağlantı havuzları ONS üzerinden gelen FAN olaylarına abone olarak kesintiye uğrayan ölü bağlantıları derhal temizler ve TCP/IP zaman aşımı askıda kalmalarını önler [1]. Kaynaklar ONS kullanımının tüm istemciler için standart hale gelmesini Oracle Database 12c Release 2 (12.2) sürümü olarak belirtmektedir [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Global Resource Directory (GRD) yapısının Oracle RAC bellek yönetimi ve tampon bellek tutarlılığındaki rolü nedir?

Global Resource Directory (GRD), kümedeki tüm düğümler genelinde önbelleğe alınmış her bir veri bloğunun durumunu, konumunu ve kilit bilgisini anlık olarak takip eder [1, 2]. Global Cache Service (GCS) ve Global Enqueue Service (GES) süreçleri tampon bellek bloklarını ve kilitleri GRD üzerinde koordine ederek kirli okumaları (dirty reads) önler [1, 2]. GRD içeriği tüm aktif örnekler arasında dağıtılır ve bellek kullanımı toplam SGA alanının yaklaşık yüzde 10'una denk gelir [2]. Kaynaklar GRD yapısının bellek oranı ve işlevleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1, 2].

**Kaynaklar:** Active-Active Node Clustering, [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### High Availability IP (HAIP) teknolojisi Oracle RAC özel Interconnect ağında nasıl bir koruma ve yedeklilik sağlar?

High Availability IP (HAIP), Oracle Grid Infrastructure 11g Release 2 (11.2) ve sonraki sürümlerde sunulan ve birden fazla fiziksel ağ kartını (NIC) yedekli olarak kullanan bir teknolojidir [1, 2]. HAIP mimarisi, fiziksel bir Interconnect ağ kartı arızalandığında veya ağ hattı koptuğunda kesintisiz çalışma ve yüksek veri akışı sağlar [1, 2]. Bu sayede Cache Fusion bloğu transferleri ağ kartı arızalarından etkilenmeden devam eder [1]. Kaynaklar bu HAIP özelliğini Oracle Grid Infrastructure 11g Release 2 (11.2) ve sonrası sürümlere ait olarak belirtmektedir [1, 2].

**Kaynaklar:** RAC Grid Infrastructure & Interconnect Configuration, [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Oracle Clusterware mimarisinde Cluster Ready Services (CRS/CRSD) hangi küme kaynaklarını yönetir ve arıza durumunda nasıl tepki verir?

Cluster Ready Services (CRS/CRSD) ana süreci; VIP adresleri, SCAN dinleyicileri, veritabanı örnekleri ve kullanıcı tanımlı servisler gibi yüksek erişilebilirlik kaynaklarını yönetir [1]. Yönettiği bu kaynakların konfigürasyon bilgilerini Oracle Cluster Registry (OCR) deposunda saklar [2]. Bir kaynak arızalandığında CRS bu kaynağı otomatik olarak yeniden başlatır veya sağlıklı düğümlere taşır [1, 2]. Kaynaklar CRS bileşeninin bu kaynak yönetim işlevleri için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** RAC Grid Infrastructure & Interconnect Configuration, [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Oracle Grid Infrastructure yazılım yığını bünyesinde yer alan Cluster Synchronization Services (CSS) bileşeninin temel işlevi nedir?

Cluster Synchronization Services (CSS), küme düğüm üyeliğini takip eder ve düğümlerin yanıt verme durumlarını sürekli denetler [1]. Bir düğüm arızalandığında veya kümenin geri kalanıyla iletişimi koptuğunda, CSS bölünmüş beyin (split-brain) senaryolarını önlemek için ilgili düğümün kümeden tahliye edilmesini (eviction) sağlar [1]. Bu sayede veritabanı tutarlılığı ve küme bütünlüğü korunmuş olur [1]. Kaynaklar CSS bileşeninin bu temel görevi için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** RAC Grid Infrastructure & Interconnect Configuration

### Oracle RAC aktif-aktif kümeleme mimarisinde her bir veritabanı örneği (instance) bellek ve süreç bazında nasıl çalışır?

Oracle RAC aktif-aktif kümeleme mimarisinde her düğüm kendi System Global Area (SGA) bellek yapılarını ve arka plan süreçlerini çalıştırır [1]. Aktif-pasif yapılardan farklı olarak kümedeki tüm düğümler eşzamanlı olarak aktif bağlantıları kabul eder ve IFS Applications orta katman bağlantı havuzlarından gelen işlemleri yürütür [1, 2]. Tüm örnekler paylaşılan veritabanı dosyalarına Oracle ASM disk grupları üzerinden erişir [1]. Kaynaklar bu aktif-aktif mimari tanımları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** Active-Active Node Clustering, RAC Grid Infrastructure & Interconnect Configuration

### Oracle RAC mimarisinde özel Interconnect ağı ve Cache Fusion mekanizması veritabanı blok transferini nasıl gerçekleştirir?

Özel Interconnect ağı, küme düğümlerini doğrudan birbirine bağlayan adanmış ve yüksek hızlı bir ağ altyapısıdır [1, 2]. Cache Fusion mekanizması, bir veritabanı örneğinin bellek önbelleğinde bulunan veri bloklarını diske yazmaya gerek kalmadan özel Interconnect ağı üzerinden diğer örneğin önbelleğine doğrudan aktarır [1, 2]. Bu disksiz bellek aktarımı sayesinde I/O gecikmeleri en aza indirilir ve işlem performansı artırılır [1, 2]. Kaynaklar bu Interconnect ve Cache Fusion prensipleri için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** Active-Active Node Clustering, RAC Grid Infrastructure & Interconnect Configuration

### Oracle RAC ortamında run-time connection load balancing ve Load Balancing Advisory metrikleri nasıl çalışır?

Load Balancing Advisory, veritabanı örneklerinin sunduğu anlık servis kalitesini değerlendirerek performans tavsiyeleri üretir ve bu metrikleri ONS üzerinden yayınlar [1]. Entegre istemci bağlantı havuzları (UCP, OCI session pool, ODP.NET) bu tavsiyeleri alarak gelen iş isteklerini en iyi servis süresini sunan örneklere dinamik olarak yönlendirir [1]. Bu çalışma için servis üzerinde runtime load balancing goal (-rlbgoal SERVICE_TIME veya THROUGHPUT) ve connection load balancing goal (-clbgoal SHORT) yapılandırılmalıdır [1]. Kaynaklar bu yük dengeleme tavsiyesi parametreleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Oracle RAC veritabanı yöneticisi özel Interconnect ağının aktif kullanımını ve arayüz ayarlarını hangi SQL görünümlerinden denetler?

Veritabanı yöneticileri özel Interconnect ağ yapılandırmasını ve aktif kullanılan ağ arayüzlerini V\(CLUSTER_INTERCONNECTS, V\)CONFIGURED_INTERCONNECTS veya küme genelinde GV$CLUSTER_INTERCONNECTS görünümlerini sorgulayarak doğrular [1]. Bu görünümler IP adreslerini, ağ arabirim adlarını ve kaynağın Oracle Cluster Registry (OCR) olduğunu görüntüler [1]. Böylece Cache Fusion trafiğinin doğru özel ağ üzerinden aktığı teyit edilir [2, 1]. Kaynaklar bu performans görünümleri için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf), Active-Active Node Clustering

### Single Client Access Name (SCAN) ve SCAN dinleyicileri istemci bağlantılarını veritabanı düğümlerine nasıl yönlendirir?

Single Client Access Name (SCAN), küme içinde üç ayrı VIP adresine çözümlenen ve küme yaşam döngüsü boyunca değişmeyen tekil bir ağ adıdır [1]. İistemci SCAN adresine bağlandığında, SCAN dinleyicisi ilgili servisi barındıran en uygun veritabanı örneğini belirler ve istemciyi o düğümdeki yerel dinleyiciye (local listener) yönlendirir [1]. Oracle Database 12c Release 2 (12.2) sürümünde SCAN dinleyicisine HTTP protokolü desteği eklenerek HTTP istemcilerinin küme düğümlerine yönlendirilmesi sağlanmıştır [1]. Kaynaklar SCAN temel yönlendirme mekanizmasını açıklar, HTTP desteğini ise Oracle Database 12c Release 2 (12.2) sürümüne tarihler [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

## 6. Bölüm: Bölüm 6: Data Guard, MAA Standartları ve Felaket Kurtarma Operasyonları

### Active Data Guard ortamında birincil ve standby veritabanı rollerini ve Real-Time Apply durumunu doğrulamak için hangi veri sözlüğü görünümleri sorgulanır?

Veritabanı rolü ve açık olma modu v$database görünümündeki database_role ve open_mode sütunlarından doğrulanır. Kurtarma sürecinin aktifliği v$managed_standby görünümündeki MRP0 süreci ve status sütunundan denetlenir. Replikasyon gecikme süreleri ise v$dataguard_stats görünümündeki apply lag metriği sorgulanarak kontrol edilir. Kaynaklar bu doğrulama görünümleri için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Data Guard Broker (dgmgrl) etkinleştirilirken karşılaşılan ORA-16698 hatası ne anlama gelir ve nasıl çözülür?

ORA-16698 hatası, manuel LOG_ARCHIVE_DEST_n parametresinde SERVICE özniteliğinin tanımlı olmasından kaynaklanır. Hatayı çözmek için manuel arşiv hedefleri ALTER SYSTEM SET LOG_ARCHIVE_DEST_2='' SCOPE=BOTH SID='*'; komutuyla temizlenir. Ardından Data Guard Broker, ALTER SYSTEM SET DG_BROKER_START=TRUE SCOPE=BOTH SID='*'; komutuyla başlatılır. Mimari çalışma notları bu komutları ve hatanın çözümünü Oracle Database 19c sürümü için detaylandırmaktadır.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Data Guard Real-Time Redo Apply mekanizması geleneksel arşiv log uygulama yönteminden nasıl ayrılır ve RPO/RTO hedeflerine nasıl katkı sağlar?

Birincil veritabanındaki Log Network Server (LNS) süreci redo verisini iletir ve standby tarafındaki Remote File Server (RFS) süreci bu veriyi doğrudan aktif SRL dosyalarına yazar. Managed Recovery Process (MRP0), redo verilerini SRL dosyalarından bellek ve diske anında uygulayarak geleneksel arşiv log biriktirme gecikmesini ortadan kaldırır. Bu Real-Time Apply yapısı, veri kaybını önleyerek RPO = 0 ve hızlı failover ile RTO < 5 dakika hedeflerine ulaşılmasını sağlar. Kaynaklar bu mekanizmayı Oracle Database 19c ve IFS Applications iş yükleri için açıklamaktadır.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Data Guard rol geçişlerinde planlı switchover operasyonu ile acil durum failover operasyonu arasındaki temel farklar nelerdir?

Planlı switchover, birincil ve standby veritabanları arasında iki yönlü, sıfır veri kayıpsız (RPO = 0) ve veritabanlarının yeniden oluşturulmasını gerektirmeyen rol değişimidir. Acil durum failover ise birincil veritabanının çökmesi durumunda standby veritabanını birincil role yükselten tek yönlü bir acil durum işlemidir. Maximum Performance modunda yapılan failover işlemlerinde unapplied redo nedeniyle veri kaybı (RPO > 0) yaşanabilir. Kaynaklar bu rol değişim tanımları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Fiziksel bir standby veritabanını Active Data Guard ile salt okunur modda açmak için sırasıyla hangi SQL komutları çalıştırılır?

İlk olarak ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL; komutu ile mevcut yönetilen kurtarma durdurulur. Ardından ALTER DATABASE OPEN; komutu ile veritabanı salt okunur modda açılır. Son olarak ALTER DATABASE RECOVER MANAGED STANDBY DATABASE USING CURRENT LOGFILE DISCONNECT; komutu çalıştırılarak Real-Time Apply ile yönetilen kurtarma yeniden başlatılır. Kaynaklar bu SQL komut dizilimi için spesifik bir veritabanı sürümü belirtmemektedir.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Oracle Active Data Guard fiziksel standby veritabanının salt okunur (Read-Only) modda açılması veritabanı performansına nasıl katkı sağlar?

Active Data Guard, fiziksel standby veritabanının arka planda MRP0 süreci ile Real-Time Apply yaparken aynı anda salt okunur (READ ONLY) modda açılmasına imkan tanır. Ağır analitik sorgular, finansal raporlar ve harici BI entegrasyonları standby veritabanına yönlendirilir (query offloading). Bu sayede birincil veritabanındaki CPU ve I/O kaynakları korunarak çekirdek OLTP işlemlerinin yanıt süreleri optimize edilir. Kaynaklar bu Active Data Guard mimarisini Oracle Database 19c ve IFS Applications iş yükleri bağlamında sunmaktadır.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Oracle Data Guard Fast-Start Failover (FSFO) altyapısının temel çalışma prensibi nedir ve hangi teknik önkoşula dayanır?

Fast-Start Failover (FSFO), bağımsız bir konumda çalışan Observer süreci aracılığıyla birincil veritabanının çökmesi durumunda standby veritabanına otomatik failover gerçekleştiren mekanizmadır. Observer birincil veritabanına ulaşamadığında ve belirlenen FastStartFailoverThreshold süresi dolduğunda otomatik failover başlatır. FSFO mekanizmasının çalışabilmesi için veritabanında Flashback Database özelliğinin aktif olması kesinlikle zorunludur. Kaynaklar FSFO ve Flashback zorunluluğu için spesifik bir veritabanı sürümü kısıtlaması belirtmemektedir.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Oracle Data Guard altyapısında Standby Redo Logs (SRLs) yapılandırmasının temel kuralları nelerdir?

Standby Redo Log (SRL) dosyaları, rol değişimlerinde veri alabilmek için hem birincil hem de standby veritabanlarında oluşturulmalıdır. SRL dosya boyutları, birincil veritabanının Online Redo Log (ORL) dosyalarıyla birebir aynı boyutta ayarlanmalıdır. Her bir redo kanalı (thread) için gerekli minimum SRL grup sayısı formülü (Thread Başına ORL Grubu Sayısı) + 1 şeklinde hesaplanır. Kaynaklar bu SRL yapılandırma kuralları için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Oracle Database@Azure bulut altyapısında Data Guard senkronizasyonu için önerilen ağ peering yöntemi ve güvenlik yapılandırması nedir?

Oracle Database@Azure üzerinde birincil ve standby Exadata sanal makine kümeleri ayrı Virtual Cloud Network (VCN) yapılarına dağıtılır. Redo taşıma bant genişliğini artırmak ve taşıma gecikmesini düşürmek için OCI VCN Peering (Local Peering Gateway / Dynamic Routing Gateway) kullanılması önerilir. TDE şifreleme anahtarları OCI Private Vault içinde tutulur ve bölgeler arasında replike edilir. Resmî dokümantasyon bu bulut ağ mimarisini Oracle Database@Azure ortamına özgü olarak sunmaktadır.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

### Oracle Maximum Availability Architecture (MAA) bünyesinde tanımlanan Bronze, Silver, Gold ve Platinum katmanları arasındaki temel farklar nelerdir?

Bronze katmanı tek veritabanı örneği ve depolama yedeklemesi sunarken, Silver katmanı Oracle RAC ile yerel yüksek erişilebilirlik sağlar. Gold katmanı yerel RAC kümelemesini uzaktaki Oracle Data Guard veya Active Data Guard (ADG) fiziksel standby veritabanı ile birleştirerek RPO = 0 ve RTO < 1 dakika hedeflerini yakalar. Platinum katmanı ise Gold katmanına Oracle GoldenGate aktif-aktif replikasyonu ve Edition-Based Redefinition ekleyerek sıfır bakım penceresi etkisi sunar. Mimari notlar Gold mimarisini Oracle Database 19c bağlamında sunarken, resmî Oracle dokümantasyonu MAA Platinum Seçenek 1 mimarisi için Oracle AI Database 26ai veya üzerini şart koşmaktadır.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, Read-Only Query & Reporting Offloading, CPU Utilization & Data Guard Lag Thresholds, Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [High Availability Best Practices and Overview](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/), [Oracle Maximum Availability Architecture for Oracle Database@Azure](https://docs.oracle.com/en/database/oracle/oracle-database/19/haovw/oracle-maximum-availability-architecture-oracle-databaseazure.html)

## 7. Bölüm: Bölüm 7: Uygulama Sürekliliği ve Dayanıklılık Mimarisi

### Application Continuity kullanımı sırasında koruma seviyesi ve performans metrikleri hangi veritabanı görünümlerinden izlenir?

Application Continuity koruma seviyesi ve istek sınırlarına ait istatistikler veritabanı içinde V\(SESSTAT ve V\)SYSSTAT görünümleri üzerinden izlenebilir [1]. Oracle Database 19c sürümünün sonraki versiyonlarında bu metrikler ek olarak V$SERVICE_STATS görünümünde de sunulur [1]. Ayrıca AWR raporları bu koruma verilerini geçmişe dönük olarak saklar [1]. Kaynaklar V$SERVICE_STATS üzerinden izleme yapılmasını Oracle Database 19c sürümüne tarihlendirmektedir [1].

**Kaynaklar:** [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf)

### Application Continuity mekanizmasının kesinti sonrasında işlemleri güvenle yeniden çalıştırabilmesi için hangi veritabanı bileşeni zorunludur ve bu bileşen nasıl çalışır?

Application Continuity özelliğinin kullanılabilmesi için Transaction Guard bileşeninin kullanılması zorunludur [1]. Transaction Guard, yürütülen işlemlere Mantıksal İşlem Kimliği (LTXID) atayarak kesinti sonrasında işlemin taahhüt durumunu (commit outcome) kesin olarak doğrular. Bu doğrulama sayesinde tamamlanan işlemlerin mükerrer çalıştırılması engellenir ve güvenli kurtarma sağlanır [1, 2]. Kaynaklar Transaction Guard için spesifik bir sürüm kısıtlaması belirtmemektedir [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html), [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf)

### Application Continuity mimarisinde tekrarlanmaması gereken harici yan etkileri (side effects) bulunan işlemler için nasıl bir yöntem izlenir?

E-posta gönderimi (UTL_SMTP) veya HTTP çağrıları (UTL_HTTP) gibi geri alınamayan harici yan etkileri bulunan işlemlerde, ReplayableConnection arabirimindeki disableReplay metodu çağrılarak ilgili istek için replay devre dışı bırakılır [1]. Transparent Application Continuity (TAC) modunda ise sistem çalışma zamanında yan etkileri otomatik olarak tespit eder ve replay yakalamasını durdurur [2]. Böylece kesinti kurtarmasında mükerrer harici eylemler önlenir [2, 1]. Kaynaklar disableReplay API kullanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html), [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf)

### IFS Applications orta katman altyapısında veritabanı kesintilerini algılamak için ONS ve FCF nasıl yapılandırılır?

Enterprise ortamlarda çalışan IFS Applications altyapısı, kesintileri anında algılamak için Oracle Notification Service (ONS) ve Fast Connection Failover (FCF) mekanizmasını kullanır [1, 2]. ONS, veritabanı ve servis durum değişikliklerini (FAN olayları) varsayılan 6200 portu üzerinden yayınlar [1]. JDBC Universal Connection Pool (UCP) üzerinde fastConnectionFailoverEnabled=true ayarlanarak FCF etkinleştirilir ve kesintiye uğrayan ölü bağlantılar derhal temizlenir [2, 1]. Kaynaklar IFS mid-tier test senaryolarında bu yapılandırma için spesifik bir veritabanı sürümü belirtmemektedir [2].

**Kaynaklar:** [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf), IFS Mid-Tier Re-connection Logic Testing

### IFS Applications orta katman sunucularında Data Guard switchover sonrası yük devretme doğrulaması hangi adımlarla test edilir?

İlk olarak IFS orta katman veri kaynağı URL'si SCAN dinleyici sözdizimi ve ONS düğümleriyle yapılandırılır [1]. Ardından Data Guard Broker (DGMGRL) arayüzünden SWITCHOVER TO komutu çalıştırılarak birincil veritabanı rolü standby veritabanına devredilir [1]. IFS uygulama sunucusu günlük dosyaları (log files) incelenerek ONS FCF olaylarının alındığı, eski bağlantıların temizlendiği ve SQL sorgularının yeni birincil veritabanında kesintisiz çalıştığı doğrulanır [1]. Kaynaklar bu test adımlarını IFS mid-tier re-connection logic test dokümanı kapsamında sunmaktadır [1].

**Kaynaklar:** IFS Mid-Tier Re-connection Logic Testing

### Oracle Database 19c sürümünde veritabanı servisinde -failovertype AUTO tanımlandığında failover_restore parametresi nasıl davranır?

Oracle Database 19c sürümünde veritabanı servisine -failovertype AUTO atandığında, -failover_restore parametresinin değeri otomatik olarak AUTO yapılır [1]. Bu ayar, kesinti sonrasında yeni veritabanı örneğinde oturum yeniden kurulurken NLS ayarlarını, zaman dilimlerini ve oturum durumlarını otomatik olarak geri yükler [1]. Bu sayede uygulama katmanı durum kaybı yaşamadan çalışmaya devam eder [1]. Kaynaklar bu otomatik atanma davranışını Oracle Database 19c sürümüne özgü olarak sunmaktadır [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### Oracle veritabanı altyapısında Transparent Application Continuity (TAC) ile manuel Application Continuity (AC) arasındaki temel fark nedir ve TAC hangi sürümde tanıtılmıştır?

Transparent Application Continuity (TAC), uygulama kodunda değişiklik veya istek sınırı (request boundary) tanımlaması gerektirmeden oturum ve işlem durumunu şeffaf bir şekilde izler [1, 2]. Manuel Application Continuity (AC) ise uygulama tarafında beginRequest ve endRequest API çağrıları ile istek sınırlarının açıkça bildirilmesini gerektirir [1]. TAC özelliği Oracle Database 18c sürümünde tanıtılmış ve Oracle Database 19c sürümünde desteklenmiştir; manuel AC ise Oracle Database 12c Release 1 (12.1) sürümünden itibaren mevcuttur [1, 2].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html), [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf)

### Oracle veritabanında planlı bakım öncesinde sunucu tarafı oturum boşaltma (server-side session draining) süreci nasıl işler?

Planlı bakım başlatılmadan önce veritabanı servisleri üzerinden FAN planned DOWN olayları yayınlanır [1]. FAN uyumlu bağlantı havuzları boşta duran oturumları kapatır ve aktif oturumları belirlenen drain_timeout süresi içinde istek sınırlarında kesintisiz olarak boşaltır. İşlemler drain_timeout süresi içinde tamamlanamazsa stopoption (IMMEDIATE) devreye girerek kalan oturumları sonlandırır [1]. Kaynaklar veritabanı seviyesinde sunucu tarafı oturum boşaltma özelliğinin Oracle Database 18c sürümünde getirildiğini belirtmektedir [1].

**Kaynaklar:** [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf)

### Transparent Application Continuity (TAC) modunda srvctl aracı ile veritabanı servisi yapılandırılırken hangi parametreler ayarlanır?

srvctl aracı ile veritabanı servisi oluşturulurken -failovertype AUTO parametresi ayarlanarak Transparent Application Continuity (TAC) etkinleştirilir [1]. Servis üzerinde -commit_outcome TRUE parametresi tanımlanarak Transaction Guard altyapısı devreye sokulur [1]. Ayrıca yeniden başlatma gecikmelerini ve deneme sayılarını yönetmek için -failoverretry 30 ve -failoverdelay 10 parametreleri yapılandırılır [1]. Kaynaklar -failovertype AUTO parametresinin kullanımını Oracle Database 18c ve 19c sürümlerine bağlamaktadır [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### İstemci JDBC ve TNS bağlantı dizelerinde kesintisiz yük devretme sağlamak için hangi bağlantı parametreleri tanımlanmalıdır?

İstemci bağlantı tanımlarında CONNECT_TIMEOUT, RETRY_COUNT, RETRY_DELAY ve FAILOVER=ON parametrelerinin yer alması zorunludur. Oracle Database Release 12.1.0.2 ve üzeri sürümlerde ek olarak TRANSPORT_CONNECT_TIMEOUT parametresi tanımlanır [1, 2]. Ayrıca SCAN VIP adreslerini içeren bir ADDRESS_LIST yapısı tanımlanarak bağlantı isteklerinin aktif küme düğümlerine yönlendirilmesi sağlanır [3, 1]. Bu parametreler sunucu kesintilerinde istemcinin zaman aşımı askıda kalmasını önler [2, 1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html), [Application Continuity for the Oracle Database](https://www.oracle.com/docs/tech/database/applicationcontinuityformaa.pdf), IFS Mid-Tier Re-connection Logic Testing

## 8. Bölüm: Bölüm 8: Performans Yönetimi, Tuning ve Teşhis Araçları

### ASH sorgularında db file sequential read ve db file scattered read bekleme olayları hangi I/O operasyonlarını ve sorunları temsil eder?

db file sequential read bekleme olayı tek blok indeks okumalarını temsil eder ve yüksek bekleme süreleri gösterdiğinde indekslenmemiş sorgulara veya parçalanmış B-Tree indekslerine işaret eder [1, 2]. db file scattered read bekleme olayı ise çoklu blok tam tablo taramalarını (Full Table Scan) ve toplu iş süreçlerindeki okuma operasyonlarını temsil eder [1, 2]. Her iki bekleme olayı da diske erişim gerektiren I/O yüklerini gösterir [1]. Kaynaklar bu bekleme olaylarını Oracle Database 18 ve 19c referans kılavuzları kapsamında açıklamaktadır [1, 2].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### Aktif Oturum Geçmişi (ASH) örnekleme mekanizması AWR raporlarından nasıl ayrılır ve anlık performans sorunlarında nasıl kullanılır?

ASH, SGA halka tamponunda (v$active_session_history) her saniye aktif oturumları örnekleyerek AWR snapshot saatlik ortalamalarının gizlediği kısa süreli performans sıçramalarını yakalar [1]. Geçmiş ASH verileri disk üzerindeki dba_hist_active_sess_history görünümünden sorgulanır [1]. v$active_session_history görünümü dba_users ve dba_objects ile birleştirilerek dar boğaza neden olan SQL ID, kullanıcı ve nesne doğrudan izole edilir [1]. Kaynaklar ASH örnekleme mekanizması için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** AWR Performance Metrics Interpretation

### Bellekte aktif çalışan bir SQL cümlesinin gerçek yürütme planı ve çalışma zamanı istatistikleri hangi SQL komutu ile çekilir?

Bellekte aktif çalışan bir SQL cümlesinin gerçek yürütme planı dbms_xplan.display_cursor(sql_id => '&target_sql_id', cursor_child_number => NULL, format => 'ALLSTATS LAST') çağrısıyla çekilir [1, 2]. Yürütme planındaki Tahmini Satır Sayısı (E-Rows) ile Gerçekleşen Satır Sayısı (A-Rows) arasındaki büyük farklar bayat veya eksik tablo istatistiklerine işaret eder [1, 2]. Bu farkların giderilmesi için tablo istatistiklerinin güncellenmesi gerekir [2]. Kaynaklar bu display_cursor kullanımı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [2].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### IFS Applications veritabanlarında satır seviyesinde kilitlenme çekişmeleri (row-level locking) hangi bekleme olayı ile tespit edilir?

Satır seviyesinde kilitlenme çekişmeleri enq: TX - row lock contention bekleme olayı sorgulanarak tespit edilir [1, 2]. IFS ortamlarında müşteri siparişleri, stok bakiyeleri veya muhasebe kayıtlarının eşzamanlı güncellenmesi sırasında taahhüt edilmemiş (uncommitted) işlemlerden kaynaklanır [2]. Bu bekleme olayı bir oturumun başka bir oturum tarafından kilitlenen satırın serbest bırakılmasını beklediğini gösterir [2]. Kaynaklar bu kilit bekleme olayı için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [2].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### Otomatik Veritabanı Teşhis Monitörü (ADDM) veritabanı performans sorunlarını tespit ederken nasıl bir analiz yöntemi izler?

Otomatik Veritabanı Teşhis Monitörü (ADDM), her AWR snapshot yakalamasının ardından son iki snapshot arasındaki performans verilerini veritabanı süresi (DB Time) odaklı analiz eder [1]. Üst düzey CPU ve bekleme süresi dağılımlarından başlayarak SQL ifadelerine, veritabanı nesnelerine ve donanım kaynaklarına kadar ağaç yapısında yukarıdan aşağıya bir teşhis yürütür [1]. Bu yaklaşım verimli çalışan bileşenleri eleyerek doğrudan yüksek etkili sorunlara odaklanılmasını sağlar [1]. Kaynaklar ADDM analiz yöntemi için belirli bir veritabanı sürümü kısıtlaması belirtmemektedir [1].

**Kaynaklar:** ADDM Report Analysis & Proactive Recommendations

### Otomatik İş Yükü Deposu (AWR) raporlarında yer alan DB Time metriği ile Elapsed Time arasındaki ilişki veritabanı performansı açısından ne anlam ifade eder?

AWR raporlarında DB Time metriği, aktif kullanıcı oturumlarının CPU ve bekleme olaylarında harcadığı toplam süreyi temsil eder [1, 2]. DB Time değerinin geçen süreyi (Elapsed Time) belirgin şekilde aşması, veritabanında yüksek eşzamanlılık (concurrency) veya ciddi kaynak çekişmesi olduğunu gösterir [1, 2]. Bu durum sistemde aynı anda birden fazla oturumun kaynak beklediğine işaret eder [1]. Kaynaklar bu AWR metrik ilişkisi için spesifik bir veritabanı sürümü belirtmemektedir [1].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### Performans sorunlarının yama uygulaması sonrasındaki değişimini kıyaslamak için hangi AWR rapor türü ve SQL betiği kullanılır?

Yama güncellemeleri (Release Update veya Release Update Revision) öncesi ve sonrasındaki veritabanı davranışını kıyaslamak için AWR Compare Period raporları kullanılır [1]. Bu karşılaştırma raporları tekil veritabanı örneklerinde awrddrpt.sql betiği ile, Oracle RAC ortamlarında ise awrddrpi.sql betiği çalıştırılarak üretilir [1]. Raporlar yük profili ve kaynak tüketimindeki değişimleri yan yana sunarak performans gerilemelerini (regression) tespit eder [1]. Kaynaklar bu AWR kıyaslama betiklerini yama güncellemeleri bağlamında sunmaktadır [1].

**Kaynaklar:** ADDM Report Analysis & Proactive Recommendations

### Resmî Oracle kılavuzunda C.3 Descriptions of Wait Events bölümünün veritabanı performans teşhisindeki amacı nedir?

Resmî Oracle kılavuzu Database Reference 18 bünyesindeki C.3 Descriptions of Wait Events bölümü, oturumların hangi operasyonel nedenlerle durakladığını açıklayan veri sözlüğü kataloğudur [1]. Katalogda I/O, tampon bellek, kilitlenme ve küme iletişimine ait bekleme olaylarının çalışma mekanizmaları ve parametreleri tanımlanır [1]. Veritabanı yöneticileri oturumların duraklama nedenlerini anlamak için bu referans kataloğundan yararlanır [1]. Resmî kılavuz bu bekleme olayları kataloğunu Oracle Database Release 18 sürümü için belgelemektedir [1].

**Kaynaklar:** AWR Performance Metrics Interpretation

### Shared Pool ve Library Cache bellek alanlarındaki latch ve mutex çekişmeleri hangi bekleme olayları ile ortaya çıkar?

Bellek çekişmeleri cursor: mutex S, cursor: mutex X, cursor: pin S wait on X, cursor: pin X ve library cache: mutex X bekleme olayları ile ortaya çıkar [1, 2]. Bu çekişmeler yüksek miktarda sabit ayrıştırma (hard parse) ve paylaşılamayan SQL ifadelerinin Shared Pool üzerinde yarattığı baskıdan tetiklenir [2]. Aşırı ayrıştırma yükü bellek yapılarının kilitlenmesine neden olur [2]. Kaynaklar bu mutex ve latch bekleme olaylarını Oracle Database 18 referans kılavuzunda sunmaktadır [1].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### sga_target, pga_aggregate_target, open_cursors ve processes parametreleri ORA-01000 ve ORA-00020 hatalarını önlemedeki rolleri açısından kaynaklarda nasıl açıklanmaktadır?

ADDM raporları sga_target, pga_aggregate_target, open_cursors ve processes parametrelerinin ayarlanmasını yapılandırma seviyesinde aksiyon alınabilir çözümler olarak sunmaktadır [1]. Ancak seçilen kaynaklar bu parametrelerin spesifik olarak ORA-01000 veya ORA-00020 hata kodlarını önlemedeki doğrudan ilişkisine dair ayrıntıları bu pasajlarda açıkça belirtmemektedir [1]. Kaynakların kapsamadığı bu hata kodu detayları kaynaklarda yer almadığı için açıkça ifade edilmiştir [1]. Kaynaklar bu ADDM önerileri için özel bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** ADDM Report Analysis & Proactive Recommendations

## 9. Bölüm: Bölüm 9: İzleme, Alarm ve Olay Yönetimi Mimarisi

### IFS Cloud 25R1 Kibana arayüzünde toplanan metrikleri incelemek için Response Time Detail View Dashboard nasıl çalışır?

Response Time Detail View Dashboard, Kibana arayüzüne gerekli dosyalar yüklenip veri görünümü oluşturulduktan sonra projeksiyon ve varlık (projections and entities) metriklerini sunar. Dashboard ekranı metrikleri varsayılan olarak en yüksek yanıt süresinden en düşük yanıt süresine doğru sıralayarak görüntüler. Bu sıralama sayesinde teknik ekipler sistemdeki en yavaş çalışan operasyonları doğrudan izole eder. Kaynaklar bu dashboard aracını IFS Cloud 25R1 sürümü kapsamına tarihlendirmektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### IFS Cloud 25R1 Remote Deploy mimarisinde EFK stack log izleme altyapısı hangi bileşenlerden oluşur ve verileri ne kadar süre saklar?

IFS Cloud 25R1 Remote Deploy mimarisinde günlük izleme altyapısı Elasticsearch, Fluentd ve Kibana bileşenlerinden oluşan bir EFK stack ile yürütülür. Elasticsearch günlük verilerini zorunlu 7 günlük saklama süresiyle tutar ve günlük çalışan curator cronjob 7 günden eski kayıtları otomatik olarak siler. Fluentd günlük toplayıcı ve iletici işlevini üstlenirken Kibana veri görselleştirme ve sorgulama imkanı sunar. Kaynaklar bu EFK stack yapısını IFS Cloud 25R1 sürümüne özgü olarak belirtmektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### IFS Cloud 26R2 Application Monitoring Metrics (AMM) ve Application Monitoring Console (AppMon) mimarisi metrikleri nasıl değerlendirir?

AMM mimarisi metrikleri tanımlanmış eşik ifadelerine göre değerlendirerek OK, Warning, Critical veya Unknown servis durum kodlarını üretir. Solution Manager altından erişilen Application Monitoring Console (AppMon), metrik durumlarını görselleştirir ve Show Alarms Only filtresi ile problemli alanları izole eder. Foundation1 Monitoring zamanlanmış görevi günlük olarak çalışarak aktif metrik durumlarını günceller. Kaynaklar AMM ve AppMon izleme araçlarını doğrudan IFS Cloud 26R2 sürümüne ait olarak sunmaktadır.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### IFS Cloud 26R2 Server Alert Log Categories sayfasında tanımlanan varsayılan kategori türleri ve parametreleri nelerdir?

Server Alert Log Categories sayfasındaki her kategori Enable, Cleanup ve Days to keep saklama parametreleri ile yönetilir. Standart kategoriler arasında Ddl Audit, Debug, Deployment, Deployment detail, Event errors, Server Errors (ORA hataları), Sql Injections ve In-Memory kategorileri yer alır. Bu kategoriler sunucu olaylarını veritabanı tetikleyicileri veya iç denetim kuralları üzerinden kaydeder. Kaynaklar bu Server Alert Log kategorilerini IFS Cloud 26R2 sürümüne ait olarak detaylandırmaktadır.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### IFS Cloud 26R2 Streams işlevselliği arka plan işleri tamamlandığında son kullanıcılara bildirim iletimini nasıl gerçekleştirir?

Streams işlevselliği, Transaction_SYS.Deferred_Call tek seferlik işleri ve Batch_SYS.New_Batch_Schedule zamanlanmış görevleri tamamlandığında Transaction_SYS.Process_All_Pending zamanlayıcısı üzerinden bildirim gönderir. Bildirimler stream_msg_on_completion_ ve stream_notes_ parametreleri ile etkinleştirilir ve Transaction_SYS.Modify_Stream_Notification Hooking API'si ile özelleştirilebilir. Bu yapı arka plan rapor ve görev sonuçlarını kullanıcılara duyurur. Kaynaklar Streams bildirim mekanizmasını IFS Cloud 26R2 sürümüne tarihlendirmektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### IFS Cloud 26R2 ortamlarında Oracle Advanced Queues mesajlaşma yapısı hangi pencereler üzerinden yönetilir?

Solution Manager altındaki Oracle Queues penceresi üzerinden asenkron mesajlaşma kuyruk tabloları başlatılabilir, durdurulabilir ve temizlenebilir. Oracle Queue Subscribers penceresi üzerinden ise aktif aboneler (subscribers) takip edilebilir veya sistemden kaldırılabilir. Bu arayüzler veritabanı mesaj akışının ve arka plan süreçlerinin kontrolünü sağlar. Kaynaklar Oracle Queues arayüz yönetimini IFS Cloud 26R2 sürümüne özgü olarak belgelendirmektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### OEM Incident Rule Set ve Blackout takvimleri yanlış alarmları önlemek için nasıl yapılandırılır?

Incident Rule Set yapıları hedef kriterleri ve zaman pencerelerine göre otomatik bildirimler gönderme, betik çalıştırma veya dış biletleme sistemlerinde bilet açma adımlarını yönetir [1]. Planlı bakım pencerelerinde idari Blackout takvimleri tanımlanarak rutin bakımlar sırasında alarm bildirimi gönderilmesi geçici olarak bastırılır [1]. Bu bastırma mekanizması IFS staging veya üretim ortamlarında yanlış alarmların önüne geçer [1]. Kaynaklar bu kural kümeleri ve blackout takvimleri için spesifik bir sürüm belirtmemektedir [1].

**Kaynaklar:** Technical Administration and Operational Governance in IFS Cloud 26R2

### OEM olay yönetimi mimarisinde Event seviyesinden Incident seviyesine yükseltme (promotion) mantığı nasıl çalışır?

Oracle Management Agent (OMA) hedef metriklerini sürekli örnekler ve bir metrik uyarı veya kritik eşiği geçtiğinde sistem bir Event üretir [1]. Üretilen Event, tanımlanmış olay kuralları ve ciddiyet seviyeleri doğrultusunda idari müdahale gerektiren bir Incident seviyesine otomatik olarak yükseltilir [1]. Bu yükseltme mekanizması kritik sistem durumlarının takibini otomatikleştirmektedir [1]. Kaynaklar bu event ve incident yaşam döngüsü için belirli bir veritabanı sürümü kısıtlaması koymamaktadır [1].

**Kaynaklar:** Technical Administration and Operational Governance in IFS Cloud 26R2

### Oracle Enterprise Manager (OEM) Cloud Control mimarisinde OMS, OMR ve OMA altyapı bileşenlerinin temel görevleri nelerdir?

Oracle Management Service (OMS), WebLogic üzerinde çalışan ve metrikleri işleyerek Cloud Control konsolunu sunan orta katman yazılımıdır. Oracle Management Repository (OMR), SYSMAN şemasında metrik verilerini ve yapılandırmaları saklayan adanmış veritabanıdır. Oracle Management Agent (OMA) ise hedef sunucularda çalışan ve TCP 3872 portu üzerinden OMS bileşenine metrik toplayıp yükleyen süreçtir. Kaynaklar bu altyapı bileşenleri için OEM 13c/14c mimari kurulumunu temel almakta ve işlevsel bir sürüm farkı belirtmemektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### Oracle Enterprise Manager (OEM) ortamında emctl komut satırı aracı ile hangi altyapı yönetim işlemleri gerçekleştirilir?

emctl aracı OMS sunucusu üzerinde WebLogic servislerinin, HTTP sunucusunun ve repository bağlantısının durumunu denetlemek için kullanılır. Yönetilen hedef düğümlerde ise OMA agent süreç sağlığı ve OMS ping bağlantısı emctl status agent ile doğrulanır veya emctl upload agent ile telemetri verileri OMS ortamına anında yüklenir. Bu komut satırı aracı altyapı bileşenlerinin operasyonel yönetimi için standarttır. Kaynaklar bu emctl komutları için OEM 13c/14c arasında spesifik bir sürüm kısıtlaması belirtmemektedir.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, Technical Administration and Operational Governance in IFS Cloud 26R2, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

## 10. Bölüm: Bölüm 10: Yedekleme, Kurtarma ve Operasyonel Uygulama

### 11.11.2026 tarihli kesinti incelemesi sonrasında IFS Applications canlıya alım (deploy) öncesi kontrol listelerine hangi idari denetim kuralı eklenmiştir?

Kesinti incelemesi bulguları doğrultusunda, canlıya alım öncesinde arka planda tamamlanmamış veya takılmış toplu iş kalıp kalmadığını denetleyen denetim kuralı canlıya alım kontrol listesine eklenmiştir [1]. Bu kural, canlıya alım öncesinde çalışan arka plan işi olmadığını (no active background jobs) veritabanı sorgularıyla doğrulamayı şart koşar [1]. Böylece deploy sırasında nesnelerin geçersiz (INVALID) duruma düşmesi ve AQ kuyruklarında mesaj birikmesi engellenir [1].

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx

### IFS kesinti inceleme dokümanına göre Oracle Advanced Queues (AQ) mesaj birikmesi tespiti için hangi metrik ve alarm eşiği önerilmektedir?

IFS altyapısında asenkron işleyiciler takıldığında mesajlar Oracle Advanced Queues (AQ) kuyruklarında birikir [1, 2]. Veriler ifs_aq metriğinde toplanmakta olup bekleyen (ready) mesaj sayısının uzun süre düşmediği durumlar için AQ birikme alarmı tanımlanması önerilmiştir [1]. Bu uyarı sinyali, arka plan işleyicilerinin durakladığını erkenden haber vererek kesintilerin önüne geçer [1].

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx, IFS Oracle Eğitim İçeriği Güncellemesi

### Kesinti sonrası adli incelemelerde Oracle Scheduler işlerini analiz etmek ve alert log hatalarını taramak için hangi salt okunur SQL sorguları çalıştırılır?

Kesinti zaman aralığında Oracle Scheduler işlerinin durumunu incelemek amacıyla dba_scheduler_job_run_details görünümünden job_name, status, actual_start_date ve run_duration sütunları sorgulanır [1]. Oracle alert log kayıtlarındaki kritik hataları tespit etmek için v$diag_alert_ext görünümünden ORA- veya deadlock içeren mesajlar originating_timestamp ve message_text sütunlarından taranır [1]. Bu sorgular Diagnostics veya Tuning Pack lisansı gerektirmeden kesinti adımlarını ortaya çıkarır [1].

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx

### Oracle 26ai veritabanında RMAN RECOVER TABLE komutunun tablo kurtarma detayları hakkında kaynaklar hangi bilgileri vermektedir?

Seçilen kaynaklar içerisinde Oracle 26ai veritabanında RMAN RECOVER TABLE komutu ile tablo seviyesinde kurtarma yapılmasına dair herhangi bir detay veya kural bulunmamaktadır [1]. Kaynaklar tablo ve bölüm seviyesinde kurtarma adımlarını Oracle Database 19c ve Oracle Database 12c sürümleri kapsamında belgelendirmektedir [1]. Kaynakların kapsamadığı Oracle 26ai tablo kurtarma ayrıntıları kaynaklarda yer almadığı için açıkça ifade edilmiştir [1].

**Kaynaklar:** [Recovering Tables and Table Partitions](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/rman-recovering-tables-partitions.html)

### Oracle Database 19c sürümünde Data Recovery Advisor (DRA) özelliğinin kullanımdan kaldırılması (deprecation) hangi RMAN komutlarını etkilemiştir?

Oracle Database 19c sürümünde Data Recovery Advisor (DRA) özelliği kullanımdan kaldırılmıştır (deprecated) [1]. Bu kaldırma işlemi doğrultusunda LIST FAILURE, ADVISE FAILURE, REPAIR FAILURE ve CHANGE FAILURE RMAN komutları amorti edilmiş olup veritabanı yöneticilerinin kullanımına kapatılmıştır [1]. Resmî dokümantasyon DRA özelliği için doğrudan sunulmuş yeni bir alternatif komut veya ikame mekanizma bulunmadığını açıkça belirtmektedir [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### Oracle Database 19c sürümünde depolama anlık görüntüsü (storage snapshot) üzerinden veritabanı kurtarma yöntemindeki değişiklik ve önerilen yaklaşım nedir?

Oracle Database 19c sürümünde depolama anlık görüntülerini kullanarak nokta zamanlı kurtarma yapmayı sağlayan RECOVER...SNAPSHOT TIME yöntemi kullanımdan kaldırılmıştır (deprecated) [1]. Oracle, veritabanı açıkken anlık görüntü alınmadan önce ve sonra ALTER DATABASE BEGIN/END BACKUP komutlarının çalıştırılmasını şart koşmaktadır [1]. Depolama görüntüsü alındıktan sonra kurtarma işlemi END BACKUP tamamlanma zamanından sonraki bir SCN veya zamana RECOVER...UNTIL TIME komutuyla yürütülür [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### RMAN DUPLICATE komutu ile Pluggable Database (PDB) kopyalama desteği hangi sürümde getirilmiştir ve temel çalışma prensibi nedir?

Oracle Database 18c sürümünde tanıtılan ve Oracle Database 19c sürümünde desteklenen DUPLICATE PLUGGABLE DATABASE komutu, bir PDB'yi mevcut bir CDB içerisine kopyalamaya imkan tanır [1]. Bu işlemin gerçekleşebilmesi için kaynak ve hedef CDB ortamlarında COMPATIBLE başlangıç parametresinin 18.0.0 veya üzeri olarak ayarlanması zorunludur [1]. Komut, doğrudan açık veritabanından active duplication veya mevcut yedek kümelerinden backup-based duplication modlarında yürütülebilir [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### RMAN FLASHBACK DATABASE komutunun genel çalışma altyapısı ve PDB seviyesindeki teknik kısıtlamaları nelerdir?

FLASHBACK DATABASE komutu, veri dosyalarını yedekten geri yüklemeye gerek kalmadan Hızlı Kurtarma Alanı (FRA) içinde saklanan flashback loglarını kullanarak veritabanını geçmiş bir SCN veya zaman noktasına geri sarar. Pluggable Database (PDB) seviyesinde flashback işlemleri Oracle Database 12c Release 2 (12.2) ve üzeri sürümlerde COMPATIBLE >= 12.2.0.0 olduğunda desteklenir [1]. Ancak resmî dokümantasyon proxy PDB yapılarında flashback operasyonlarının desteklenmediğini açıkça belirtmektedir [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### RMAN RECOVER TABLE komutu ile tablo seviyesinde nokta zamanlı kurtarma (PITR) yapılırken arka planda hangi otomasyon adımları yürütülür?

RMAN, hedef sunucuda belirtilen AUXILIARY DESTINATION konumunda otomatik olarak geçici bir yardımcı veritabanı (auxiliary database) örneği oluşturarak gerekli yedekleri buraya geri yükler [1]. Nesneler belirlenen hedef zaman noktasına kadar kurtarıldıktan sonra RMAN, bu verileri içeren bir Data Pump döküm dosyası (export dump file) üretir [1]. Üretilen döküm dosyası hedef veritabanına otomatik aktarılır (import edilir) veya NOTABLEIMPORT tümcesi kullanılarak aktarım adımı atlanır [1].

**Kaynaklar:** [Recovering Tables and Table Partitions](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/rman-recovering-tables-partitions.html)

### RMAN RECOVER TABLE komutunda kurtarılan tabloları farklı bir şemaya ve farklı bir tablespace alanına aktarmak için hangi yan tümceler kullanılır?

Kurtarılan tabloları hedef veritabanında farklı bir tablespace alanına aktarmak için REMAP TABLESPACE yan tümcesi kullanılır [1]. Oracle Database 12c Release 2 (12.2) sürümünden itibaren REMAP TABLE yan tümcesi ile nesneler hem farklı bir tablo adına yeniden adlandırılabilir hem de doğrudan orijinal şemadan farklı yeni bir hedef şemaya aktarılabilir [1]. Bu yeniden eşleme adımlarında tanımlı kısıtlamalar (constraints) ve indeksler aktarılmaz [1].

**Kaynaklar:** [Recovering Tables and Table Partitions](https://docs.oracle.com/en/database/oracle/oracle-database/19/bradv/rman-recovering-tables-partitions.html)
