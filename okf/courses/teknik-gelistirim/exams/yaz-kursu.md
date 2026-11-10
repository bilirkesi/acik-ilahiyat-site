---
type: Exam
title: Practical Assessment
description: Scenario questions across the whole program.
course: teknik-gelistirim
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: yaz-kursu
exam_window: summer
exam_type: yaz-kursu
question_count: 20
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/exams/yaz-kursu.md
---

# Practical Assessment

Ders: Teknik Gelişim · TEK · 2026-2027 Güz. Toplam 20 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. According to the Oracle Database 19c documentation for Application Continuity for Java, which JDBC driver is required to use Application Continuity?

*İpucu:* Consider which driver architecture provides client-side replay proxy capabilities without relying on native OCI C-libraries.

A) Oracle JDBC Thin driver *
B) Oracle JDBC OCI driver
C) Any third-party JDBC Type 4 driver
D) Oracle JDBC Server-side Internal driver

**Cevap anahtarı:** A

**Gerekçe (A):** Application Continuity is explicitly built as a feature of the Oracle JDBC Thin driver.

*Etiketler:* chapter-1

## 2. Starting in Oracle Database Release 18c, which setting for the server-side service attribute FAILOVER_TYPE enables Transparent Application Continuity (TAC)?

*İpucu:* Think of the attribute value that allows the database driver and server to automatically detect implicit request boundaries.

A) AUTO *
B) TRANSACTION
C) SELECT
D) SESSION

**Cevap anahtarı:** A

**Gerekçe (A):** Setting FAILOVER_TYPE to AUTO on the server-side service enables Transparent Application Continuity state tracking and implicit request boundaries.

*Etiketler:* chapter-1

## 3. In Oracle Database Release 19c, when FAILOVER_TYPE is set to AUTO on the database service, which Java system property can be set to false to explicitly turn off implicit beginRequest calls on new physical connections?

*İpucu:* Focus on the property specifically named after the connection creation phase and the beginRequest action.

A) oracle.jdbc.beginRequestAtConnectionCreation *
B) oracle.jdbc.enableImplicitRequests
C) oracle.jdbc.disableReplayAtConnection
D) oracle.jdbc.autoBeginTransaction

**Cevap anahtarı:** A

**Gerekçe (A):** Setting oracle.jdbc.beginRequestAtConnectionCreation to false overrides the default 19c behavior that implicitly begins a request on physical connection creation under TAC.

*Etiketler:* chapter-2

## 4. Which Java interface must an application implement to create a custom connection initialization callback for re-establishing initial session state after failover?

*İpucu:* Look for the interface in the oracle.jdbc.replay package dedicated specifically to initialization callback routines.

A) oracle.jdbc.replay.ConnectionInitializationCallback *
B) oracle.jdbc.replay.ReplayableConnection
C) oracle.jdbc.OracleConnection
D) javax.sql.XAConnection

**Cevap anahtarı:** A

**Gerekçe (A):** Implementing oracle.jdbc.replay.ConnectionInitializationCallback allows applications to register custom logic that executes immediately following a successful reconnection.

*Etiketler:* chapter-2

## 5. In Oracle Database 12c Release 2 (12.2.0.1) and later, what happens to Application Continuity replay on a connection once it participates in a global/XA transaction?

*İpucu:* Consider how long the disabling effect of an XA boundary lasts relative to request demarcation.

A) Replay is disabled on that connection and remains disabled until the next request begins. *
B) Replay automatically resumes as soon as the connection switches back to local transaction mode within the same request.
C) Replay remains active but switches automatically from manual Application Continuity to Transparent Application Continuity.
D) Replay throws a SQLRecoverableException immediately prior to executing the XA statement.

**Cevap anahtarı:** A

**Gerekçe (A):** Engaging in any XA operation disables replay protection on that physical connection for the remainder of the current request boundary.

*Etiketler:* chapter-3

## 6. According to the Oracle Automatic Storage Management (ASM) documentation for OLTP workloads, which striping configuration and allocation unit subdivision are used for Online Redo Logs (ORLs)?

*İpucu:* Recall which striping pattern breaks down Allocation Units into small 128 KB chunks for rapid, low-latency writes.

A) Fine-Grained Striping with 128 KB stripe sets *
B) Coarse-Grained Striping with 1 MB to 4 MB Allocation Units
C) Fine-Grained Striping with 512 KB stripe sets
D) Coarse-Grained Striping with 64 KB Allocation Units

**Cevap anahtarı:** A

**Gerekçe (A):** Fine-Grained Striping subdivides Allocation Units into 128 KB stripe sets across all disks to minimize latency for high-frequency write targets like ORLs.

*Etiketler:* chapter-3

## 7. Which ASM redundancy model implements 3-way mirroring across Failure Groups and requires a minimum of three Failure Groups?

*İpucu:* Identify the redundancy level recommended for mission-critical setups requiring maximum fault tolerance through triple mirroring.

A) High Redundancy *
B) Normal Redundancy
C) External Redundancy
D) Extended Redundancy

**Cevap anahtarı:** A

**Gerekçe (A):** High Redundancy enforces 3-way mirroring across ASM Failure Groups, requiring at least three separate failure domains.

*Etiketler:* chapter-4

## 8. In the storage architecture guidelines for IFS Applications, which ASM disk group is designated to store active data files, index tablespaces, and system tablespaces?

*İpucu:* Distinguish between the primary operational disk group and the dedicated recovery disk group.

A) DATA *
B) RECO
C) SYSTEM
D) ARCH

**Cevap anahtarı:** A

**Gerekçe (A):** The DATA disk group serves as primary operational storage for active tablespaces, data files, indexes, and system tablespaces.

*Etiketler:* chapter-4

## 9. According to the Real Application Clusters Administration and Deployment Guide 19c, approximately what percentage of total System Global Area (SGA) memory is consumed by the Global Resource Directory (GRD) and Cache Fusion components?

*İpucu:* Think of the standard memory sizing adjustment factor required when converting a single-instance SGA to Oracle RAC.

A) Almost 10 percent *
B) Less than 1 percent
C) Exactly 25 percent
D) Up to 50 percent

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle RAC documentation notes that GRD locks and Cache Fusion tracking structures consume approximately 10 percent of total SGA memory.

*Etiketler:* chapter-5

## 10. In an active-active Oracle RAC cluster, which technology transfers cached database blocks directly between instance SGAs over the private Interconnect without writing to disk?

*İpucu:* Focus on the high-speed memory-sharing protocol that avoids disk I/O when instances request shared data blocks.

A) Cache Fusion *
B) Automatic Storage Management (ASM)
C) Fast Application Notification (FAN)
D) Transaction Guard

**Cevap anahtarı:** A

**Gerekçe (A):** Cache Fusion coordinates memory caches across instances by transferring data blocks directly over the Interconnect network.

*Etiketler:* chapter-5

## 11. According to the Oracle for SAP Cloud and Infrastructure Update, what combination of technologies powers the Persistent Memory Data & Commit Accelerator in Exadata X8M-2 running Oracle Database 19c?

*İpucu:* Identify the high-speed Ethernet protocol and persistent memory hardware module featured in Exadata X8M models.

A) Intel® Optane™ modules associated with RDMA over Converged Ethernet (RoCE) 100GbE *
B) Flash SSDs paired with InfiniBand 40GbE switches
C) NVMe drives managed by ASM Fine-Grained Striping
D) DRAM acceleration combined with TCP/IP over Public Network

**Cevap anahtarı:** A

**Gerekçe (A):** Exadata X8M-2 combines Intel® Optane™ persistent memory modules with 100GbE RoCE to enable direct remote memory access.

*Etiketler:* chapter-6

## 12. In Oracle Multitenant Architecture, which container is responsible for storing Oracle system metadata, common user accounts, and global initialization parameters?

*İpucu:* Recall the top-level root container name that anchors all background processes and global metadata.

A) CDB$ROOT *
B) PDB$SEED
C) User PDB
D) SYSTEM tablespace in a PDB

**Cevap anahtarı:** A

**Gerekçe (A):** The root container (CDB$ROOT) manages global memory, background processes, system metadata, and common administrative users.

*Etiketler:* chapter-6

## 13. How does a Release Update Revision (RUR) differ from a Release Update (RU) in the Oracle Database patch management lifecycle?

*İpucu:* Consider which patch type focuses strictly on stability and security maintenance for an established baseline.

A) An RUR provides security and regression-focused patches that extend the lifespan of an existing RU without introducing new functional bug fixes. *
B) An RUR is a quarterly cumulative patch that increments the minor release version and introduces new functional feature enhancements.
C) An RUR is applied only to CDB$ROOT while RUs are applied exclusively to individual PDBs.
D) An RUR replaces major database releases every two years while RUs are issued monthly.

**Cevap anahtarı:** A

**Gerekçe (A):** RURs extend an RU's maintenance window by adding critical security and stability fixes while avoiding functional changes.

*Etiketler:* chapter-7

## 14. When Automatic Shared Memory Management (ASMM) is enabled by setting sga_target to a non-zero value, which set of memory structures does Oracle dynamically tune?

*İpucu:* Identify the primary memory pools contained within the shared System Global Area (SGA).

A) Buffer Cache, Shared Pool, Large Pool, and Java Pool *
B) Program Global Area (PGA) work areas and sort buffers
C) Redo Log Buffer and Process Private Memory
D) ASM Allocation Units and Cache Fusion buffers

**Cevap anahtarı:** A

**Gerekçe (A):** ASMM dynamically adjusts allocations across the Buffer Cache, Shared Pool, Large Pool, and Java Pool based on workload demand.

*Etiketler:* chapter-7

## 15. What privilege must be granted to an application user in Oracle Database to retain function results for named mutable functions (such as SYSDATE or SYS_GUID) during Application Continuity replay?

*İpucu:* Look for the security keyword designed to 'preserve' original values across replay operations.

A) KEEP DATE TIME or KEEP SYSGUID privileges *
B) GRANT ALL ON DATABASE
C) EXECUTE ON DBMS_SERVICE
D) ALTER SYSTEM privileges

**Cevap anahtarı:** A

**Gerekçe (A):** Granting KEEP privileges (e.g., GRANT KEEP DATE TIME TO [user]) explicitly allows the replay driver to restore original runtime values during replay.

*Etiketler:* chapter-8

## 16. What are the default values for FAILOVER_RETRIES and FAILOVER_DELAY when configuring database services for Application Continuity?

*İpucu:* Recall the parameter table where retry count is a positive integer around 30 and delay is expressed in seconds.

A) FAILOVER_RETRIES = 30 and FAILOVER_DELAY = 10 *
B) FAILOVER_RETRIES = 10 and FAILOVER_DELAY = 30
C) FAILOVER_RETRIES = 900 and FAILOVER_DELAY = 60
D) FAILOVER_RETRIES = 5 and FAILOVER_DELAY = 1

**Cevap anahtarı:** A

**Gerekçe (A):** The standard default configuration allocates 30 retries with a 10-second delay between attempts.

*Etiketler:* chapter-8

## 17. What happens to the service attribute FAILOVER_RESTORE when FAILOVER_TYPE is set to AUTO on a database service in Oracle Database 18c and later?

*İpucu:* Consider how Transparent Application Continuity automates session restoration attributes alongside failover types.

A) FAILOVER_RESTORE is automatically set to AUTO and cannot be changed while FAILOVER_TYPE is AUTO. *
B) FAILOVER_RESTORE must be manually set to LEVEL1 via SRVCTL or service creation fails.
C) FAILOVER_RESTORE defaults to NONE, disabling session state restoration.
D) FAILOVER_RESTORE is overridden and disabled if any application callback is registered.

**Cevap anahtarı:** A

**Gerekçe (A):** Enabling Transparent Application Continuity (FAILOVER_TYPE=AUTO) automatically locks FAILOVER_RESTORE to AUTO to ensure initial state restoration.

*Etiketler:* chapter-9

## 18. Which initialization parameter sets the global target for total non-shared memory allocated across all server process work areas for sort operations and hash joins?

*İpucu:* Look for the parameter governing aggregate Program Global Area limits.

A) pga_aggregate_target *
B) sga_target
C) open_cursors
D) processes

**Cevap anahtarı:** A

**Gerekçe (A):** pga_aggregate_target controls the total memory dedicated to private process work areas across active sessions.

*Etiketler:* chapter-9

## 19. Which command-line utility is used in Oracle RAC to manage cluster services, database resources, and server pool configurations?

*İpucu:* Identify the primary utility acronym representing the Server Control tool.

A) SRVCTL *
B) RMAN
C) ORADIM
D) ASMCMD

**Cevap anahtarı:** A

**Gerekçe (A):** Server Control Utility (SRVCTL) is the standard administrative tool for managing RAC database resources, services, and server pools.

*Etiketler:* chapter-10

## 20. During a RAC node failover workflow using Application Continuity, what component does the client driver query on a surviving instance using the session's assigned LTXID to check if an in-flight transaction committed?

*İpucu:* Think of the Oracle feature required as a prerequisite for Application Continuity to guarantee transaction outcome certainty.

A) Transaction Guard *
B) Global Resource Directory (GRD)
C) Oracle Notification System (ONS)
D) Automatic Workload Repository (AWR)

**Cevap anahtarı:** A

**Gerekçe (A):** The driver queries Transaction Guard on a surviving instance using the Logical Transaction ID (LTXID) to verify commit outcome.

*Etiketler:* chapter-10
