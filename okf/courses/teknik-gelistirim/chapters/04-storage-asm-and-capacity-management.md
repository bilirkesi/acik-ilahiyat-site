---
type: Chapter
title: Storage, ASM and Capacity Management
description: In this chapter, the student learns how to design and manage storage architecture using Oracle Automatic Storage Management (ASM) disk groups, including DATA and RECO, while configuring coarse-grained
course: teknik-gelistirim
chapter: 4
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T05:06:34Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to design and manage storage architecture using Oracle Automatic Storage Management (ASM) disk groups, including DATA and RECO, while configuring coarse-grained and fine-grained striping alongside redundancy models for high-concurrency OLTP workloads in IFS Cloud 25R1 and IFS Applications 10. The student explores table partitioning strategies such as Range, List, and Hash partitioning for high-volume transaction tables in Oracle Database 19c, utilizing partition pruning, local index maintenance, and Partition Maintenance Operations (PMO) to optimize query performance and disk reclamation. Additionally, the curriculum covers setting up warning thresholds at 85 percent and critical thresholds at 95 percent using DBMS_SERVER_ALERT in Oracle Enterprise Manager (OEM) to monitor logical tablespaces and physical ASM disk space, preventing unhandled out-of-space errors.

# Sesli Ders

[Bölüm 4 sesli özeti](/audio/teknik-gelistirim/chapter-4.mp3) (6:16 dk, MP3)

# Öğrenme Hedefleri

1. The student can configure Oracle Automatic Storage Management (ASM) DATA and RECO disk groups in Oracle Database 19c using fine-grained striping for online redo logs and coarse-grained striping for data files under external, normal, or high redundancy models.
2. The student can implement Range, List, and Hash table partitioning alongside local index strategies for high-volume transaction tables in Oracle Database 19c supporting IFS Cloud 25R1 to enable partition pruning and Partition Maintenance Operations.
3. The student can set warning thresholds at 85 percent and critical thresholds at 95 percent via DBMS_SERVER_ALERT and Oracle Enterprise Manager (OEM) to monitor tablespace and ASM disk group capacity boundaries.

# Dersler

* Disk Group Architecture (DATA & RECO)
* ASM Striping & Redundancy for OLTP
* Table Partitioning for Massive Transaction Tables
* Tablespace & ASM Disk Space Thresholds
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-010-planning-installation-010-storage-tier-considerations-010-oracle-db-19c-Oracle-19c-Enterprise-Edition-19c-options-and-feat.pdf
* Oracle Automatic Storage Management Administrator's Guide
* Oracle Database Database Reference, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each objective:

---

### Objective 1: Configuring ASM DATA and RECO Disk Groups, Striping Strategies, and Redundancy Models

* **Dedicated Disk Group Architecture:** The student learns that Oracle Automatic Storage Management (ASM) organizes physical disks into logical Disk Groups [1, 2].
  * The **DATA disk group** serves as the primary operational storage area housing active data files, index tablespaces, system tablespaces (SYSTEM, SYSAUX), temporary files, and online redo log groups [2, 3]. High read and write IOPS performance is prioritized in DATA to process active IFS mid-tier transactions [2, 3].
  * The **RECO (or FRA) disk group** serves as the dedicated recovery storage area housing archive logs, RMAN backup sets, control file copies, Flashback logs, and multiplexed copies of online redo logs [2, 3]. Isolating recovery files in RECO prevents backup or archiving operations from competing for disk bandwidth with primary transactional data operations [2, 3].
* **ASM Striping Strategies:**
  * **Coarse-Grained Striping:** Uses full Allocation Units (typically 1 MB to 4 MB or larger) designed for large, sequential I/O operations [1, 4]. Target files include database data files, index tablespaces, temporary files, and RMAN backup sets [1, 3, 4].
  * **Fine-Grained Striping:** Breaks Allocation Units into smaller 128 KB stripe sets distributed across all member disks [1, 4]. Fine-grained striping is optimized for low-latency, small-payload write operations to minimize write latency and distribute rapid concurrent writes across physical devices [1, 4]. Target files include Online Redo Logs (ORLs), Control Files, and Flashback Logs [1, 3, 4].
* **ASM Redundancy Models:**
  * **External Redundancy:** Delegates data protection entirely to underlying enterprise SAN hardware or host-level RAID controllers (such as RAID 10), providing no mirroring within ASM [1, 3, 4].
  * **Normal Redundancy:** Implements 2-way mirroring across ASM Failure Groups, requiring a minimum of two Failure Groups to protect against single-disk or array failures [1, 3, 4].
  * **High Redundancy:** Implements 3-way mirroring across ASM Failure Groups, requiring a minimum of three Failure Groups for mission-critical IFS setups demanding maximum data availability [1, 3, 4].
* **Version Application:** The official **Oracle Automatic Storage Management Administrator's Guide** documents these ASM storage management concepts for Release 19c [5]. The training program's architecture notes apply these storage configurations to IFS Applications (including IFS Cloud, IFS Applications 10, and IFS Applications 9) [3, 4].

---

### Objective 2: Implementing Range, List, and Hash Table Partitioning and Local Indexes

* **Table Partitioning Strategy:** The student learns that Table Partitioning breaks massive physical tables into smaller, manageable, independent logical segments [6]. This enables the Oracle Cost-Based Optimizer (CBO) to execute **partition pruning**, which scans only specific partitions relevant to a query and improves performance across high-volume operational tables [6].
* **Partitioning Methods:**
  * **Range Partitioning:** Maps data to partitions based on ranges of column values (such as transaction dates or order timestamps), making it the standard choice for time-series data like IFS audit logs and historical orders [6].
  * **List Partitioning:** Explicitly maps rows to partitions based on discrete lists of values in a column (such as regional site codes, business units, or country codes) [6].
  * **Hash Partitioning:** Distributes data evenly across a specified number of partitions using a hash algorithm applied to a partitioning key column, preventing I/O hotspots on high-concurrency staging or interface tables [6].
* **Index Strategies and Partition Maintenance:**
  * **Local Indexes:** Automatically partition in alignment with underlying table partitions; when a table partition is added or dropped, local indexes update automatically without requiring a full index rebuild [6].
  * **Global Indexes:** Span across all partitions independently of table structure, requiring maintenance or rebuilding after specific partition structural operations [6].
  * **Partition Maintenance Operations (PMO):** Allows database administrators to drop, truncate, merge, or split individual partitions instantly (such as dropping an obsolete archive partition via `ALTER TABLE DROP PARTITION`) without locking the entire table or executing expensive `DELETE` statements [6].
* **Support and Version Context:** According to official IFS technical documentation for Release 25R1 (**screencapture-docs-ifs-techdocs-25r1-070...pdf**), **Oracle Partitioning** is an option supported for use with IFS Cloud and verified on IFS Applications 9 & 10, with table partitioning, global index partitions, and local index partitions tested and verified [7]. The training architecture notes present table partitioning for massive transaction tables in Oracle Database 19c supporting IFS Cloud and IFS Applications 10/9 [6].

---

### Objective 3: Setting Warning and Critical Storage Thresholds via DBMS_SERVER_ALERT and OEM

* **Storage Threshold Architecture:** The student learns that sudden tablespace exhaustion or ASM disk group filling can cause abrupt transaction failures, database freezes, and critical system outages in IFS Applications [8]. Configuring proactive alert thresholds in Oracle Enterprise Manager (OEM) ensures early notification before storage capacity reaches 100 percent [8].
* **Warning and Critical Threshold Levels:**
  * **Warning Thresholds:** Set at 85 percent capacity utilization to notify DBAs to investigate growing data files, clean up old staging tables, or schedule storage expansions during regular maintenance windows [8].
  * **Critical Thresholds:** Set at 95 percent capacity utilization to signify urgent storage pressure demanding immediate intervention to prevent space exhaustion and database halts [8].
* **Alert Target Scope:**
  * **Tablespace Thresholds:** Monitor logical space allocation within individual data files and container/pluggable databases (CDB/PDB) [8].
  * **ASM Disk Group Thresholds:** Monitor physical free space across physical disks and failure groups within shared storage pools like DATA and RECO [8].
* **Programmatic Configuration (`DBMS_SERVER_ALERT`):**
  * Database administrators programmatically configure tablespace warning thresholds at 85 percent and critical thresholds at 95 percent using `DBMS_SERVER_ALERT.SET_THRESHOLD` with `metric_id => DBMS_SERVER_ALERT.TABLESPACE_SPACE_USAGE` and `dbobject_type => 'TABLESPACE'` [8].
  * DBAs verify registered threshold settings by querying the `DBA_THRESHOLDS` dictionary view [8].
* **ASM Capacity Verification:** DBAs connect to the ASM instance (`+ASM`) and inspect disk group capacity and utilization percentages across `DATA` and `RECO` by querying `V$ASM_DISKGROUP` [3, 8].
* **Version Application:** The official **Oracle Database Database Reference, 19c** defines static data dictionary views such as `DBA_THRESHOLDS` and dynamic performance views such as `V$ASM_DISKGROUP` for Release 19c [9]. The training architecture notes detail these threshold configurations for Oracle Database 19c environments supporting IFS Cloud and IFS Applications 10/9 [8].

# Kaynaklar

* NotebookLM kaynağı `1b04476c-4a75-4cff-b885-92515534b16e`
* NotebookLM kaynağı `f793ad75-751e-4c83-8ca8-28d381bab07b`
* NotebookLM kaynağı `64e17649-95cc-4200-ae0b-f756d52ffbb1`
* NotebookLM kaynağı `864e9db2-d8b7-49d5-ba58-f597500b415f`
* NotebookLM kaynağı `2bbb340b-2864-4e94-9a73-76eeaa5eafa5`
* NotebookLM kaynağı `667e3b8a-819a-4cdf-ae3c-94d88a2cbcbb`
* NotebookLM kaynağı `e8ccb72a-074a-4053-a8bc-54c864851e88`
