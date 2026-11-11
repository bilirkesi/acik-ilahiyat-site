---
type: Quiz
title: "Ünite 5 quizi: Bölüm 5: RAC ve Grid Infrastructure Kümeleme Mimarisi"
description: Teknik Gelişim (Türkçe) 5. ünite için 12 soruluk quiz.
course: teknik-gelistirim-tr
unit: 5
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T07:22:53Z }
resource: /courses/teknik-gelistirim-tr/unit-quizzes/unit-5.md
---

# Ünite 5: Bölüm 5: RAC ve Grid Infrastructure Kümeleme Mimarisi

Toplam 12 soru.

## 1. Oracle Database 19c (19.3) sürümüyle sunulan 'Dynamic Services Fallback Option' özelliğinin temel işlevi nedir?

*İpucu:* Servislerin planlanan öncelikli sunucularda çalıştırılmasını garanti altına alan erişilebilirlik seçeneğini düşünün.

A) Veritabanı istemcilerinin TCP/IP zaman aşımı sürelerini devre dışı bırakarak doğrudan ONS üzerinden bağlanmasını zorunlu kılmak.
B) Tercih edilen (preferred) bir örnek kullanılamaz hale gelip servis kullanılabilir (available) bir örneğe devredildikten sonra, tercih edilen örnek tekrar aktifleştiğinde servisin otomatik olarak bu örneğe geri dönmesini sağlamak. *
C) XA işlemlerindeki tüm dalları kümedeki rastgele bir örneğe dağıtarak yük dengesini eşitlemek.
D) Grid Infrastructure kurulumunda GIMR veritabanının zorunlu olarak yüklenmesini sağlamak.

**Cevap anahtarı:** B

**Gerekçe (B):** Bu özellik, bir servisin failover sonrasında tercih edilen örneği tekrar kullanılabilir olduğunda otomatik olarak ilk yerine geri dönmesini sağlayarak servis konumlandırmasında daha fazla kontrol sunar.

## 2. Oracle Database release 19.3 ile tanıtılan 'colocation_tag' parametresi bağlantı dizesinde (CONNECT_DATA) tanımlandığında ne sağlar?

*İpucu:* Örnekler arası (inter-instance) iletişimi azaltmak için aynı iş yüküne sahip oturumların gruplanmasını düşünün.

A) Oturumları bellek baskısı durumunda otomatik olarak Free server pool alanına taşır.
B) Bir DTP (Distributed Transaction Processing) servisini yalnızca tek bir örnekte çalışacak şekilde sınırlar.
C) Aynı etiket değerine sahip istemci oturumlarının, örnekler arası iletişimi azaltmak amacıyla mümkün olduğunda aynı veritabanı örneğine yönlendirilmesini sağlar. *
D) Sunucu tarafında FAN callout betiklerinin çalışmasını engeller.

**Cevap anahtarı:** C

**Gerekçe (C):** Co-location tag, aynı etiketi paylaşan istemcileri aynı örneğe yönlendirerek inter-instance Cache Fusion trafiğini düşürmeyi ve performansı artırmayı hedefler.

## 3. Oracle Grid Infrastructure mimarisinde Cluster Synchronization Services (CSS) bileşeninin temel görevi nedir?

*İpucu:* Küme üyeliğinin takibi ve bölünmüş küme (split-brain) durumlarının engellenmesi sürecini hatırlayın.

A) VIP adresleri, SCAN dinleyicileri ve veritabanı servisleri gibi yüksek erişilebilirlik kaynaklarını otomatik olarak başlatmak.
B) Küme olaylarını yayınlayarak sunucu tarafı betiklerini (callouts) tetiklemek.
C) Kümedeki düğüm üyeliğini yönetmek, düğüm durumlarını izlemek ve split-brain senaryolarını önlemek için yanıt vermeyen düğümleri kümeden tahliye (eviction) etmek. *
D) Düğümler arası Cache Fusion veri bloğu transferlerini yönetmek.

**Cevap anahtarı:** C

**Gerekçe (C):** CSS, küme genelinde tutarlı bir üyelik görünümü sağlar ve iletişimini kaybeden düğümleri kümeden çıkararak veri bütünlüğünü korur.

## 4. Oracle Database 12c release 2 (12.2) ve sonraki sürümlerde tüm istemciler Fast Application Notification (FAN) bildirimlerini almak için hangi mekanizmayı kullanır?

*İpucu:* 12.2 sürümüyle birlikte tüm istemciler için standartlaştırılan bildirim daemon servisini düşünün.

A) Oracle GoldenGate Advanced Queueing (AQ)
B) Single Client Access Name (SCAN) Listener direct socket
C) Global Enqueue Service (GES)
D) Oracle Notification Service (ONS) *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle Database 12c release 2 (12.2) itibarıyla tüm istemciler FAN olaylarına abone olmak için standart olarak ONS kullanır.

## 5. Oracle RAC veritabanı yayım modellerinden biri olan 'Policy-managed' (Politika yönetimli) konuşlandırma modelinin ayırt edici özelliği nedir?

*İpucu:* Statik örnek ve düğüm eşleştirmeleri yerine Server Pool ve kardinalite kavramlarına dayanan yapıyı hatırlayın.

A) Her veritabanı örneğinin belirli bir düğüm üzerinde çalışacak şekilde statik olarak yapılandırılması ve servislerin tercih edilen/yedek örneklere elle atanması.
B) Veritabanı örneklerinin ve servislerinin Sunucu Havuzları (Server Pools) üzerinde tanımlanan kardinaliteye göre esnek ve dinamik olarak çalıştırılması. *
C) Veritabanının yalnızca tek bir sunucu üzerinde çalışmasına izin verilip failover seçeneklerinin kapatılması.
D) Servislerin doğrudan IP adresleri üzerinden yönetilip Clusterware kontrolünden çıkarılması.

**Cevap anahtarı:** B

**Gerekçe (B):** Policy-managed modelde veritabanı belirli bir sunucu listesine statik adımlarla atanmaz; sunucu havuzlarında tanımlı kurallara göre dinamik olarak konumlandırılır.

## 6. Oracle RAC mimarisinde özel Interconnect ağında kullanılan High Availability IP (HAIP) teknolojisinin temel amacı nedir?

*İpucu:* Özel küme ağında donanımsal NIC arızalarına karşı sunulan sanal IP yedekleme katmanını düşünün.

A) Veritabanı istemcilerinin doğrudan ASM disk grubuna erişmesini sağlamak.
B) SCAN IP adreslerini dış ağdan gelen istemci isteklerine dinamik olarak dağıtmak.
C) RMAN yedekleme trafiğini otomatik olarak ayrı bir kanala yönlendirmek.
D) Birden fazla fiziksel ağ arabirimi (NIC) üzerinden yedeklilik ve yük dağıtımı sağlayarak Interconnect arızalarında kesintisiz Cache Fusion iletişimini sürdürmek. *

**Cevap anahtarı:** D

**Gerekçe (D):** HAIP, Interconnect için birden fazla fiziksel ağ kartını birleştirerek yüksek bant genişliği ve kart arızalarına karşı sıfır kesinti koruması sunar.

## 7. Dağıtılmış İşlem İşlemede (Distributed Transaction Processing - DTP) Oracle RAC üzerinde XA affinity kullanmanın temel avantajı nedir?

*İpucu:* Aynı XA işlem dallarının (branches) aynı sunucuda toplanmasının inter-node iletişime etkisini hatırlayın.

A) Dağıtılmış bir işlemin her bir dalını farklı bir RAC düğümüne zorunlu olarak dağıtarak düğüm yüklerini eşitlemek.
B) İşlemlerin sadece Okuma Düğümleri (Reader Nodes) üzerinde çalışmasını zorunlu kılmak.
C) Aynı XA işlemine ait tüm dalları kümedeki tek bir örneğe yönlendirerek örnekler arası senkronizasyon maliyetini düşürmek ve performansı artırmak. *
D) Dağıtılmış işlemlerde veritabanı undo alanının kullanımını tamamen devre dışı bırakmak.

**Cevap anahtarı:** C

**Gerekçe (C):** XA affinity, aynı küresel işlemin dallarını aynı RAC örneğinde toplayarak küme içi kilit ve bellek eşitleme yükünü minimize eder.

## 8. Oracle RAC ortamlarında Load Balancing Advisory (Yük Dengeleme Danışmanı) bileşeninin çalışma prensibi nedir?

*İpucu:* Statik dağıtım yerine veritabanı örneklerinin anlık yük durumuna göre yönlendirme önerisi sunan mekanizmayı düşünün.

A) Servislerin anlık performans ve kalite metriklerini izleyerek gelen iş isteklerinin en iyi hizmeti sunacak örneklere yönlendirilmesi için FAN bildirimleriyle istemci havuzlarına tavsiyeler yayınlamak. *
B) Düğümler arasındaki CPU kullanımını izleyip sınırı aşan sunuculardaki veritabanı örneklerini otomatik olarak kapatmak.
C) Interconnect ağındaki paket kayıplarını tespit edip bant genişliğini dinamik olarak artırmak.
D) Her yeni istemci bağlantısını sırayla (round-robin) tüm küme düğümlerine eşit sayıda dağıtmak.

**Cevap anahtarı:** A

**Gerekçe (A):** Load Balancing Advisory, servis seviyesi performans metriklerini değerlendirerek bağlantı havuzlarının (UCP, GridLink vb.) iş yükünü en uygun örneğe yönlendirmesini sağlar.

## 9. Oracle RAC veritabanlarını, örneklerini ve servislerini komut satırından yönetmek için kullanılan temel araç hangisidir?

*İpucu:* Servislerin, örneklerin ve küme veritabanının durumunu değiştirmek için kullanılan 'srvctl' kısaltmalı komut aracını hatırlayın.

A) SRVCTL (Server Control Utility) *
B) OIFCFG (Oracle Interface Configuration Tool)
C) ADRCI (Automatic Diagnostic Repository Command Interpreter)
D) RMAN (Recovery Manager)

**Cevap anahtarı:** A

**Gerekçe (A):** SRVCTL, veritabanı, örnek, servis ve VIP gibi tüm küme kaynaklarını tek bir noktadan yönetmeye yarayan standart komut satırı aracıdır.

## 10. Oracle RAC One Node veritabanı seçeneği ile sunulan 'Online Database Relocation' özelliğinin belirleyici niteliği nedir?

*İpucu:* Planlı bakım sırasında sunucu değiştirilirken uygulamanın kesinti yaşamaması için geçici olarak başlatılan ikinci örneği düşünün.

A) Tüm çok düğümlü RAC veritabanlarında sunucu çökmesi anında otomatik olarak devreye girmesi.
B) Planlı bir yer değiştirme sırasında hedef düğümde geçici olarak ikinci bir örnek oluşturularak veritabanı oturumlarının ve servislerin kesintisiz biçimde taşınması. *
C) Veri dosyalarını veritabanı çalışırken farklı bir SAN depolama ünitesine kopyalaması.
D) Sadece Okuma Düğümleri (Reader Nodes) arasında bellek eşitlemesi yapması.

**Cevap anahtarı:** B

**Gerekçe (B):** Online Database Relocation sırasında canlı oturumlar korunarak ikinci bir örnek başlatılır ve oturumlar aktarıldıktan sonra ilk örnek kapatılır.

## 11. Oracle RAC mimarisinde sunucu tarafında tanımlanan 'FAN Callouts' programlarının çalıştırma mantığı nedir?

*İpucu:* Kümede bir düğüm veya servis çöktüğünde/açıldığında sunucuda otomatik çalışan olay betiklerini (scripts) düşünün.

A) Kümede yüksek erişilebilirlik olayları (DOWN, UP vb.) gerçekleştiğinde otomatik olarak tetiklenerek arıza kaydı açma, e-posta gönderme veya harici uygulamaları başlatma/durdurma işlevlerini yürütmek. *
B) İstemci tarafında her SQL sorgusu derlendiğinde çalıştırma planını denetlemek.
C) Veritabanı başlatılırken SGA bellek boyutunu dinamik olarak büyütmek.
D) Interconnect ağındaki paket gecikmelerini düzeltmek amacıyla NIC sürücülerini yeniden başlatmak.

**Cevap anahtarı:** A

**Gerekçe (A):** FAN Callouts, sunucu tarafında olay dizininde yer alan ve bir bildirim geldiğinde Otomatik olarak Clusterware tarafından çalıştırılan betiklerdir.

## 12. Oracle Grid Infrastructure katmanında yer alan Cluster Ready Services (CRS) daemon'ının temel sorumluluğu nedir?

*İpucu:* VIP, SCAN listener, veritabanı ve servis gibi yüksek erişilebilirlik (HA) kaynaklarının yönetimini yapan ana süreci hatırlayın.

A) Yalnızca düğümler arasındaki kalp atışı (heartbeat) ağ sinyallerini denetlemek.
B) Veritabanı yedekleme dosyalarının RMAN tarafından otomatik olarak taranmasını sağlamak.
C) ONS mesajlarını sadece küme dışındaki istemcilere iletmek.
D) VIP adresleri, SCAN dinleyicileri, veritabanı örnekleri ve servisler gibi yüksek erişilebilirlik kaynaklarını yönetmek, arızalanan kaynakları otomatik olarak yeniden başlatmak veya başka düğüme taşımak. *

**Cevap anahtarı:** D

**Gerekçe (D):** CRS daemon (CRSD), tanımlı yüksek erişilebilirlik kaynaklarının durumunu ve bağımlılıklarını takip ederek otomatik restart ve failover işlemlerini yönetir.
