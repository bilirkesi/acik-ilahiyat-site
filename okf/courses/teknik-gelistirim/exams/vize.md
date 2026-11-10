---
type: Exam
title: Midterm Assessment
description: Covers the first half of the program.
course: teknik-gelistirim
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: vize
exam_window: midterm
exam_type: vize
question_count: 20
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/exams/vize.md
---

# Midterm Assessment

Ders: Teknik Gelişim · TEK · 2026-2027 Güz. Toplam 20 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. In Oracle Multitenant architecture, which container is responsible for managing background processes, shared system metadata, global initialization parameters, and common user accounts?

*İpucu:* Consider the top-level container that serves as the root of the entire multitenant database structure.

A) CDB$ROOT *
B) PDB$SEED
C) User PDB
D) SYS$CONTAINER

**Cevap anahtarı:** A

**Gerekçe (A):** The single root container (CDB$ROOT) manages global memory, background processes, system metadata, and common user accounts across the multitenant environment.

*Etiketler:* chapter-1

## 2. According to patch management guidelines for Oracle Database, how does a Release Update Revision (RUR) differ functionally from a Release Update (RU)?

*İpucu:* Think about which patch type extends an existing maintenance baseline without adding functional changes.

A) An RU is issued monthly for custom application enhancements, while an RUR is a yearly hardware driver update.
B) An RU provides quarterly cumulative bug fixes and security enhancements that increment the minor release version, whereas an RUR extends an existing RU's lifespan with security and regression fixes without introducing new functional bug fixes. *
C) An RUR alters the underlying database block structure, whereas an RU only updates SQL execution plans.
D) An RUR contains major release architectural updates, while an RU is limited to OS-level patches.

**Cevap anahtarı:** B

**Gerekçe (B):** Release Updates (RU) deliver quarterly stability fixes and minor release updates, while Release Update Revisions (RUR) focus strictly on targeted security and regression maintenance for an existing RU.

*Etiketler:* chapter-1

## 3. In memory architecture tuning for high-volume OLTP workloads, what is the primary role of configuring pga_aggregate_target?

*İpucu:* Focus on the private memory allocated to individual server processes executing sorts and joins.

A) It resizes the Buffer Cache to minimize physical disk block reads.
B) It controls the maximum allocation size for the Shared Pool SQL cache.
C) It optimizes per-process private memory for sort operations and hash joins, helping prevent temporary tablespace spilling during batch operations. *
D) It allocates shared memory segments for Cache Fusion block transfers across cluster nodes.

**Cevap anahtarı:** C

**Gerekçe (C):** PGA memory target settings govern process-private memory allocations for sorting and hash joins to reduce temporary tablespace I/O.

*Etiketler:* chapter-1

## 4. Which SQL statement sequence correctly opens a target Pluggable Database named ifsprod from the root container and switches the active session context to it?

*İpucu:* Identify the standard DDL command for opening a PDB followed by the session control statement for container context.

A) ALTER DATABASE ifsprod START; CONNECT TO ifsprod;
B) ALTER PLUGGABLE DATABASE ifsprod OPEN; ALTER SESSION SET CONTAINER = ifsprod; *
C) STARTUP PLUGGABLE DATABASE ifsprod; SWITCH CONTAINER ifsprod;
D) MOUNT PDB ifsprod; SET SYSTEM CONTAINER = ifsprod;

**Cevap anahtarı:** B

**Gerekçe (B):** Opening the PDB via ALTER PLUGGABLE DATABASE and then setting the session container via ALTER SESSION contextually attaches the session to the target PDB.

*Etiketler:* chapter-1

## 5. How does Automatic Storage Management (ASM) apply striping strategies across file types within a disk group?

*İpucu:* Recall which allocation unit size (128 KB vs 1 MB/4 MB) targets low-latency redo writes versus large data file reads.

A) It uses fine-grained striping for sequential data files and coarse-grained striping for online redo log files.
B) It applies Coarse Striping (1 MB or 4 MB Allocation Units) for large sequential files like data files and backups, and Fine-grained Striping (128 KB Allocation Units) for low-latency write operations like online redo logs. *
C) It stripes all files uniformly using 64 KB units regardless of file type.
D) It disables striping completely for data files when normal redundancy is selected.

**Cevap anahtarı:** B

**Gerekçe (B):** Coarse striping optimizes throughput for large sequential data access, whereas fine-grained striping distributes 128 KB units to optimize write latency for redo logs.

*Etiketler:* chapter-2

## 6. According to the Oracle Maximum Availability Architecture (MAA) specifications, how does Oracle RAC One Node differ from standard Oracle RAC in the Silver Tier?

*İpucu:* Consider the operational difference between running single-instance active-passive failover versus active-active multi-instance processing.

A) Oracle RAC One Node is an active-passive architecture running one active instance at a time during normal operations, whereas standard Oracle RAC is an active-active architecture running simultaneous instances across nodes. *
B) Oracle RAC One Node requires third-party clusterware, while Oracle RAC uses Grid Infrastructure.
C) Oracle RAC One Node does not support online maintenance or rolling patches.
D) Oracle RAC One Node requires asynchronous storage replication between nodes in the same data center.

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle RAC One Node provides active-passive failover with single-instance execution per database until node failover occurs, whereas Oracle RAC provides active-active multi-node execution.

*Etiketler:* chapter-2

## 7. What key architectural component distinguishes the MAA Gold Tier from the Silver Tier regarding disaster recovery?

*İpucu:* Focus on how data is maintained outside the primary data center to withstand full site outages.

A) The Gold Tier introduces local ASM mirroring, whereas the Silver Tier relies on hardware RAID.
B) The Gold Tier adds database replication technologies such as Oracle Active Data Guard or Oracle GoldenGate to eliminate single points of failure across remote sites. *
C) The Gold Tier replaces active-active Oracle RAC clusters with single-instance cold standbys.
D) The Gold Tier relies solely on tape-based RMAN backups for cross-site recovery.

**Cevap anahtarı:** B

**Gerekçe (B):** While Silver provides local cluster HA (RAC), Gold incorporates physical or logical replication across sites to protect against site failures and severe data corruptions.

*Etiketler:* chapter-2

## 8. In standard Oracle ASM disk group design, what is the primary purpose of designating a dedicated RECO disk group separate from the DATA disk group?

*İpucu:* Think about separating routine recovery/archiving I/O from active user transaction I/O.

A) To store temporary tablespaces and user index segments.
B) To isolate write-heavy recovery assets-such as archive logs, RMAN backup sets, and Flashback logs-from core transactional data file disk I/O. *
C) To host the Oracle Grid Infrastructure binary files.
D) To store static application binaries and client driver files.

**Cevap anahtarı:** B

**Gerekçe (B):** Separating recovery assets into RECO prevents heavy backup and archiving write streams from competing with primary data file transactions in DATA.

*Etiketler:* chapter-2

## 9. To satisfy a strict Zero Data Loss (RPO = 0) requirement using Oracle Active Data Guard, which transport mode and protection level configuration must be deployed?

*İpucu:* Determine which transport mode blocks transaction commit until redo is safely acknowledged by the standby.

A) Asynchronous transport (ASYNC) with Maximum Performance mode.
B) Synchronous transport (SYNC) with Maximum Availability mode. *
C) Delayed redo apply with Maximum Protection mode.
D) Batch log shipping via RMAN scheduled scripts.

**Cevap anahtarı:** B

**Gerekçe (B):** Maximum Availability mode with synchronous redo transport ensures that transaction redo is committed on the standby before primary commit completion, guaranteeing RPO = 0.

*Etiketler:* chapter-3

## 10. What operational capabilities does an Oracle Active Data Guard physical standby database offer to increase return on investment (ROI) during normal operations?

*İpucu:* Consider how read-only queries and production backups can be handled off the primary server.

A) It can be opened read-write for active OLTP user transactions while accepting primary DML.
B) It can be opened read-only to offload reporting and ad-hoc queries, and can also offload RMAN database backup processing from the primary database. *
C) It automatically converts physical data blocks into JSON documents for web server caching.
D) It suspends Managed Recovery Process (MRP) execution whenever read-only queries are submitted.

**Cevap anahtarı:** B

**Gerekçe (B):** Active Data Guard permits read-only query execution and production backup offloading on the standby host while redo apply continuously runs.

*Etiketler:* chapter-3

## 11. In Oracle Database 12c and later, how does an Oracle Active Data Guard Far Sync instance enable zero data loss protection across long WAN distances without degrading primary database performance?

*İpucu:* Think about placing a lightweight redo collector near the primary to handle the synchronous network leg.

A) It stores full table data in local flash storage and executes SQL queries independently.
B) It acts as a lightweight redo receiver located near the primary site that receives redo synchronously and forwards it asynchronously to the remote standby database. *
C) It converts physical redo streams into logical SQL statements to bypass network latency.
D) It forces the primary database to switch to asynchronous transport whenever latency exceeds 5 milliseconds.

**Cevap anahtarı:** B

**Gerekçe (B):** Far Sync resides near the primary to accept SYNC redo over low-latency network connections, then asynchronously transmits that redo across high-latency WAN to the standby.

*Etiketler:* chapter-3

## 12. What is the primary operational advantage of enabling Block Change Tracking (BCT) during RMAN incremental backups?

*İpucu:* Focus on how RMAN identifies changed blocks without reading entire multi-terabyte data files.

A) It automatically repairs corrupted blocks on disk during active transaction processing.
B) It records changed blocks in a tracking file, allowing RMAN to scan only modified blocks rather than reading the entire data file during level 1 incremental backups. *
C) It compresses archived redo logs before they are written to the +RECO disk group.
D) It eliminates the need for standby redo logs on Active Data Guard targets.

**Cevap anahtarı:** B

**Gerekçe (B):** Block Change Tracking avoids full data file I/O scans during incremental backups by tracking changed blocks in a dedicated BCT file.

*Etiketler:* chapter-3

## 13. Which database table partitioning method is ideal for historical time-series data, such as audit logs and customer transaction timestamps, to optimize query performance via partition pruning?

*İpucu:* Select the strategy that groups continuous date and timestamp ranges into explicit chronological boundaries.

A) Hash Partitioning
B) Range Partitioning *
C) List Partitioning
D) System Partitioning

**Cevap anahtarı:** B

**Gerekçe (B):** Range partitioning maps rows based on value ranges (such as dates or quarters), enabling the optimizer to prune unneeded time periods during query execution.

*Etiketler:* chapter-4

## 14. When performing Partition Maintenance Operations (PMO) such as dropping an old archive partition, why are Local Indexes preferred over Global Indexes?

*İpucu:* Consider how index partition boundaries align with table partition boundaries during maintenance.

A) Local indexes consume zero storage space in the DATA disk group.
B) Local indexes are equipartitioned with the underlying table, so dropping a table partition automatically drops only the corresponding index partition without invalidating the remaining index partitions. *
C) Local indexes allow non-partitioned tables to bypass full table scans.
D) Global indexes require continuous manual locking of all PDB containers.

**Cevap anahtarı:** B

**Gerekçe (B):** Because local index partitions directly mirror table partitions, partition maintenance operations only impact the affected local partition, avoiding full index rebuilds.

*Etiketler:* chapter-4

## 15. What is the fundamental difference in sampling mechanics between Automatic Workload Repository (AWR) and Active Session History (ASH)?

*İpucu:* Compare long-term snapshot statistics with high-frequency memory sampling of active sessions.

A) AWR collects data every second, while ASH takes hourly snapshots of idle sessions.
B) AWR captures historical system performance statistics between periodic snapshots (typically hourly), whereas ASH samples active session wait states directly from SGA memory every second. *
C) ASH requires shutting down the database to analyze wait events, whereas AWR runs online.
D) AWR monitors non-Oracle application processes, while ASH monitors Oracle OS processes.

**Cevap anahtarı:** B

**Gerekçe (B):** AWR provides macro-level baseline snapshot metrics, while ASH provides second-by-second micro-level diagnostic visibility into active sessions.

*Etiketler:* chapter-4

## 16. In Oracle Database wait event analysis, what does a high frequency of db file sequential read wait events typically indicate?

*İpucu:* Identify whether single-block index lookups or multi-block full scans produce sequential read requests.

A) Full table scans reading multi-block clusters sequentially from disk.
B) Single-block index lookup reads from persistent storage. *
C) Buffer Cache latch contention during in-memory joins.
D) Heavy parallel execution slave synchronization bottlenecks.

**Cevap anahtarı:** B

**Gerekçe (B):** 'db file sequential read' indicates single-block synchronous physical disk reads, commonly associated with index lookups or direct rowid fetches.

*Etiketler:* chapter-4

## 17. In an Oracle Enterprise Manager (OEM) monitoring architecture, what is the specific operational function of the Oracle Management Agent (OMA)?

*İpucu:* Think about the client component deployed directly onto host servers to gather local system metrics.

A) It hosts the centralized GUI web console for database administrators.
B) It runs as a standalone process on managed target hosts to collect metrics, monitor local target health, and upload telemetry to the Oracle Management Service (OMS). *
C) It acts as the central relational repository storing historical OEM metrics.
D) It manages ASM disk group rebalancing operations automatically.

**Cevap anahtarı:** B

**Gerekçe (B):** The OMA is deployed directly on target servers to execute local monitoring checks and transmit metric data back to the central OMS.

*Etiketler:* chapter-5

## 18. Which infrastructure component of Oracle Enterprise Manager stores target configuration data, monitoring history, metric thresholds, and alert notifications?

*İpucu:* Identify the dedicated database backend underlying the Enterprise Manager ecosystem.

A) Oracle Management Repository (OMR) *
B) Oracle Management Service (OMS)
C) Management Agent (OMA)
D) Global Data Services (GDS)

**Cevap anahtarı:** A

**Gerekçe (A):** The OMR is an Oracle Database instance that maintains all historical metric telemetry, target specifications, and management metadata for OEM.

*Etiketler:* chapter-5

## 19. How are automated alerts and escalation pathways configured in Enterprise Manager (OEM) when performance or availability threshold limits are breached?

*İpucu:* Focus on the OEM administrative feature designed to group target events and trigger automated actions.

A) By manually executing SQL scripts against V$SESSION every 15 minutes.
B) By defining Incident Rules and Rulesets within OEM to automatically route metric threshold violations to administrators via notifications or ticketing integrations. *
C) By enabling HARD checks on Exadata storage cells.
D) By configuring pga_aggregate_target to trigger email alerts.

**Cevap anahtarı:** B

**Gerekçe (B):** Incident Rulesets evaluate incoming target events against defined thresholds and trigger automated notifications, incident logs, or ticket dispatches.

*Etiketler:* chapter-5

## 20. How is network communication secured between host Management Agents (OMA) and the central Oracle Management Service (OMS) in an enterprise OEM deployment?

*İpucu:* Consider standard web security protocols used to encrypt data transfers between agents and central services.

A) Via unencrypted HTTP over port 80.
B) Via encrypted HTTPS using dedicated agent communication ports and SSL/TLS security protocols. *
C) Via raw FTP transfers of flat log files.
D) Via direct shared memory segments across the network interconnect.

**Cevap anahtarı:** B

**Gerekçe (B):** OMAs communicate with the OMS over secure, encrypted HTTPS channels using designated secure ports to protect monitoring data.

*Etiketler:* chapter-5
