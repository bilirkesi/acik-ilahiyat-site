---
type: Quiz
title: "Ünite 4 quizi: Storage, ASM and Capacity Management"
description: Teknik Gelişim 4. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 4
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-4.md
---

# Ünite 4: Storage, ASM and Capacity Management

Toplam 12 soru.

## 1. In Oracle Automatic Storage Management (ASM), which striping configuration and Allocation Unit (AU) subdivision pattern is assigned to Online Redo Logs (ORLs), Control Files, and Flashback Logs?

*İpucu:* Consider which striping strategy subdivides Allocation Units into smaller 128 KB chunks to handle rapid, small write operations.

A) Coarse-grained striping with 128 KB Allocation Units optimized for RMAN backup sets
B) Fine-grained striping with 1 MB Allocation Units optimized for parallel database table scans
C) Coarse-grained striping with full 1 MB to 4 MB Allocation Units optimized for large sequential reads
D) Fine-grained striping with 128 KB stripe sets optimized for low-latency write operations *

**Cevap anahtarı:** D

**Gerekçe (D):** Fine-grained striping breaks Allocation Units into 128 KB stripe sets to distribute rapid, small-payload concurrent write operations across physical devices.

## 2. Which failure group configuration and mirroring strategy defines High Redundancy in Oracle ASM?

*İpucu:* Think about the number of data copies created in mission-critical environments needing protection against multiple failures.

A) 3-way mirroring requiring a minimum of three Failure Groups *
B) Delegated hardware-level RAID 10 mirroring with zero Failure Groups
C) 2-way mirroring requiring a minimum of two Failure Groups
D) 4-way mirroring requiring a minimum of two Failure Groups

**Cevap anahtarı:** A

**Gerekçe (A):** High Redundancy enforces 3-way mirroring across at least three Failure Groups, making it standard for mission-critical IFS setups.

## 3. According to ASM disk group architecture guidelines for IFS Applications, which files should be placed in the RECO disk group to isolate recovery operations from core transactional disk I/O?

*İpucu:* Focus on storage files specifically used for backup, historical recovery, and archive tracking.

A) Archive logs, RMAN backup sets, control file copies, Flashback logs, and multiplexed copies of online redo logs *
B) Primary online redo log groups, active index tablespaces, and user tablespace data files
C) System tablespaces, temporary files, and primary operational data files only
D) Active data files, index tablespaces, system tablespaces (SYSTEM, SYSAUX), and temporary files

**Cevap anahtarı:** A

**Gerekçe (A):** The RECO (or FRA) disk group is dedicated to recovery assets to prevent archive and backup processes from competing for primary transactional bandwidth.

## 4. What is the primary operational objective of implementing Hash Partitioning on high-concurrency staging or interface tables in an IFS database?

*İpucu:* Recall which partitioning algorithm spreads incoming rows uniformly to avoid single-disk bottlenecks.

A) To distribute data evenly across a specified number of partitions and prevent I/O hotspots *
B) To group rows into partitions based on discrete ranges of transaction timestamps
C) To allow instant removal of historical partitions without performing SQL DELETE operations
D) To organize rows explicitly by categorical business units or regional site codes

**Cevap anahtarı:** A

**Gerekçe (A):** Hash partitioning applies a hashing algorithm on key columns to spread writes uniformly, eliminating physical disk bottlenecks on write-heavy tables.

## 5. How do Local Indexes behave during Partition Maintenance Operations (PMO), such as dropping or splitting a table partition?

*İpucu:* Consider how index structure alignment with underlying partitions affects maintenance overhead.

A) They span all table partitions independently and lock the entire table during maintenance
B) They require manual conversion into global indexes prior to executing any maintenance command
C) They become UNUSABLE across all partitions and require a mandatory full index rebuild
D) They update automatically in alignment with table partitions without rebuilding the entire index tree *

**Cevap anahtarı:** D

**Gerekçe (D):** Local indexes share the partitioning schema of the target table, allowing individual index partition maintenance without invalidating the rest of the index tree.

## 6. In Oracle Enterprise Manager (OEM) metric threshold management, what standard utilization percentages are recommended for Warning and Critical alerts on storage targets?

*İpucu:* Identify the standard two percentage boundaries that provide early maintenance notice and urgent outage prevention.

A) 75% capacity for Warning Thresholds and 90% capacity for Critical Thresholds
B) 85% capacity for Warning Thresholds and 95% capacity for Critical Thresholds *
C) 90% capacity for Warning Thresholds and 99% capacity for Critical Thresholds
D) 80% capacity for Warning Thresholds and 100% capacity for Critical Thresholds

**Cevap anahtarı:** B

**Gerekçe (B):** Setting warning alerts at 85% and critical alerts at 95% enables proactive capacity expansion before complete storage exhaustion occurs.

## 7. Which PL/SQL procedure and metric constant are used to programmatically register tablespace warning and critical alert boundaries in Oracle Database?

*İpucu:* Look for the server alert package that manages database threshold parameters.

A) DBMS_STORAGE_MGMT.SET_ALERT with DBMS_STORAGE_MGMT.TABLESPACE_USAGE
B) DBMS_MONITOR.SET_ALERT_THRESHOLD with DBMS_MONITOR.SPACE_LIMIT
C) DBMS_SERVER_ALERT.SET_THRESHOLD with DBMS_SERVER_ALERT.TABLESPACE_SPACE_USAGE *
D) DBMS_ASM_ALERT.MODIFY_THRESHOLD with DBMS_ASM_ALERT.DISK_FREE_SPACE

**Cevap anahtarı:** C

**Gerekçe (C):** Executing DBMS_SERVER_ALERT.SET_THRESHOLD with the TABLESPACE_SPACE_USAGE metric constant configures automated alerts for logical tablespace capacity.

## 8. Which dynamic performance view can a DBA query when connected to an ASM instance (+ASM) to inspect total MB, free MB, and redundancy models across disk groups?

*İpucu:* Select the view whose name directly references aggregate ASM disk group metrics.

A) V$ASM_ALIAS
B) V$ASM_DISKGROUP *
C) DBA_THRESHOLDS
D) V$ASM_FILE

**Cevap anahtarı:** B

**Gerekçe (B):** Querying V$ASM_DISKGROUP returns capacity metrics, free space, Allocation Unit sizes, and redundancy settings for all mounted ASM disk groups.

## 9. According to technical documentation for IFS Cloud (Release 25R1), what structural limitation applies when deploying Oracle Database Standard Edition 2?

*İpucu:* Recall the exact constraints listed for Standard Edition 2 regarding CDB count, PDB count, and processing threads.

A) It is limited to 1 CDB, 3 PDBs, and 16 threads *
B) It is restricted strictly to non-production development environments
C) It is limited to 1 CDB, 1 PDB, and 8 threads
D) It requires an extra license for Oracle RAC One Node in all environments

**Cevap anahtarı:** A

**Gerekçe (A):** IFS Cloud documentation specifies that Standard Edition 2 deployment is limited to 1 Container Database, up to 3 Pluggable Databases, and a maximum of 16 threads.

## 10. According to technical documentation for IFS Applications 10, what constraint governs the Multitenant architecture deployment?

*İpucu:* Check the specific container-to-pluggable database ratio stated in the IFS Applications 10 compatibility matrix.

A) Up to sixteen pluggable databases per container are supported
B) Oracle Multitenant is not supported or verified for IFS Applications 10
C) Up to three pluggable databases per container are supported
D) Only one pluggable database per container is supported *

**Cevap anahtarı:** D

**Gerekçe (D):** IFS Applications 10 documentation explicitly notes that although Oracle Multitenant is supported, only single-PDB container setups are verified.

## 11. Which Oracle Management Pack is documented as required for generating Automatic Workload Repository (AWR) and Automatic Database Diagnostic Monitor (ADDM) reports?

*İpucu:* Identify the management pack responsible for core performance data collection and diagnostic reports.

A) Oracle Diagnostics Pack *
B) Oracle Tuning Pack
C) Oracle Database Lifecycle Management Pack
D) Oracle Cloud Management Pack for Oracle Database

**Cevap anahtarı:** A

**Gerekçe (A):** IFS documentation states that Oracle Diagnostics Pack is verified on IFS Applications 9 and 10 and is required for AWR and ADDM.

## 12. According to IFS Cloud documentation, which Oracle Database option is required to enable In-Memory column store functionality in IFS Applications 10?

*İpucu:* Look for the specific option named after the feature required for column-store memory execution.

A) Oracle Real Application Clusters (Oracle RAC)
B) Oracle Advanced Compression
C) Oracle Database In-Memory *
D) Oracle Active Data Guard

**Cevap anahtarı:** C

**Gerekçe (C):** The documentation specifies that utilizing In-Memory capabilities in IFS Applications 10 explicitly requires the Oracle Database In-Memory option.
