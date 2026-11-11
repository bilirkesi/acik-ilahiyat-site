---
type: Chapter
title: Performance Management and Tuning
description: In this chapter, the student learns how to diagnose and optimize database performance across memory architecture, session capacity, SQL execution, and recovery subsystems for IFS Applications. The cur
course: teknik-gelistirim
chapter: 8
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T05:06:34Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to diagnose and optimize database performance across memory architecture, session capacity, SQL execution, and recovery subsystems for IFS Applications. The curriculum covers instance memory tuning for sga_target and pga_aggregate_target, capacity parameter tuning for open_cursors and processes, AWR and ADDM report profiling during peak business hours and batch runs, and root-cause analysis of wait events including db file sequential read, db file scattered read, enq: TX - row lock contention, and latch contention. Additionally, students master Active Session History (ASH) diagnostics, execution plan profiling using DBMS_XPLAN.DISPLAY_CURSOR, and single-command RMAN table-level point in time recovery (RECOVER TABLE) introduced in Oracle Database 12c and extended in Oracle Database 19c and Oracle 26ai.

# Sesli Ders

[Bölüm 8 sesli özeti](/audio/teknik-gelistirim/chapter-8.mp3) (5:48 dk, MP3)

# Öğrenme Hedefleri

1. The student can configure instance memory parameters sga_target and pga_aggregate_target alongside session parameters open_cursors and processes to optimize SGA memory pools and prevent ORA-01000 and ORA-00020 capacity errors in Oracle Database 19c.
2. The student can evaluate Automatic Workload Repository (AWR) reports, Automatic Database Diagnostic Monitor (ADDM) recommendations, and Active Session History (ASH) sampling metrics to isolate I/O bottlenecks, row-level locking, and latch contention.
3. The student can execute RMAN table-level point in time recovery (RECOVER TABLE PITR) with an auxiliary destination in Oracle Database 12c, Oracle Database 19c, and Oracle 26ai to restore dropped or purged tables without full database restores or system downtime.

# Dersler

* Memory Architecture Tuning (sga_target & pga_aggregate_target)
* Session & Cursor Capacity Parameter Tuning (open_cursors & processes)
* Execution Plan Profiling & Index Strategies
* ADDM Report Analysis & Proactive Recommendations
* Peak Hours & Batch Run AWR Generation
* I/O Bottleneck Identification
* AWR Performance Metrics Interpretation
* Locking & Latch Contention Drill-Downs
* C.3 Descriptions of Wait Events - Oracle Help Center
* Database Performance Tuning Guide

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each specified objective:

---

### Objective 1: Memory Architecture and Capacity Parameter Tuning (sga_target, pga_aggregate_target, open_cursors, processes)

* **System Global Area (SGA) Tuning (sga_target):** The System Global Area (SGA) is an instance-wide shared memory structure allocated at database startup [1]. Setting `sga_target` to a non-zero value activates Automatic Shared Memory Management (ASMM), allowing Oracle to dynamically tune memory pools including the Buffer Cache (caching data blocks read from disk to optimize query response times), Shared Pool (storing parsed SQL, PL/SQL code, execution plans, and data dictionary information essential for IFS mid-tier session reuse), Large Pool, and Java Pool [1]. Dynamically tuning SGA memory pools prevents hard parses and disk I/O bottlenecks during peak transactional hours in environments running IFS Applications (IFS Cloud and IFS Applications 10/9) [1].
* **Program Global Area (PGA) Tuning (pga_aggregate_target):** The Program Global Area (PGA) is non-shared memory allocated individually for each server process handling a user session connection [1]. Setting `pga_aggregate_target` establishes an instance-wide global target for total PGA memory allocated across all sessions [1]. Oracle dynamically controls memory allocated to individual work areas for sort operations (ORDER BY), hash joins, and bitmap merges to stay within this limit under peak batch workloads, preventing excessive temporary tablespace spilling during heavy batch reports [1].
* **Processes Capacity Parameter Tuning (processes):** The static initialization parameter `processes` defines the maximum number of operating system user processes that can simultaneously connect to the Oracle Database instance [2]. Dedicated mid-tier connection pools, background processes (such as PMON, DBWn, and LGWR), and DBA sessions consume process slots [2]. Setting `processes` too low causes connection rejections with `ORA-00020: maximum number of processes exceeded`, preventing mid-tier application servers from establishing new sessions during traffic spikes [2].
* **Open Cursors Capacity Parameter Tuning (open_cursors):** The dynamic parameter `open_cursors` specifies the maximum number of open cursors a single session can hold simultaneously in the Private SQL Area [2]. Cursors handle parsed SQL statements and PL/SQL blocks, and mid-tier frameworks (such as Java/JDBC pools in IFS) cache statement handles to boost execution speed [2]. Setting `open_cursors` sufficiently high accommodates statement caching per session without leaking cursors or exceeding Shared Pool memory limits, preventing `ORA-01000: maximum open cursors exceeded` errors [2].
* **Version Application:** The training sources apply these memory and capacity parameter configurations to IFS Applications (IFS Cloud and IFS Applications 10/9) workloads [1, 2]. The provided sources do not specify a database version restriction (such as Oracle Database 19c) for these parameter definitions, so the sources do not explicitly state which database version applies to these parameters [1, 2].

---

### Objective 2: Performance Evaluation using AWR Reports, ADDM Recommendations, and ASH Sampling Metrics

* **Automatic Workload Repository (AWR) Analysis:** AWR serves as Oracle's built-in historical performance data warehouse, automatically capturing snapshots (defaulting to 60 minutes) and retaining statistics (defaulting to 8 days) in the SYSAUX tablespace via the Memory Monitor (MMON) background process [3]. Database administrators analyze AWR reports to evaluate DB Time (cumulative time spent by active non-idle user sessions inside the database) against Elapsed Time (total wall-clock time between snapshots); if DB Time significantly exceeds Elapsed Time, the system is running under high concurrency or encountering severe wait contention [4]. AWR Load Profile metrics track per-second and per-transaction throughput, including logical reads, physical reads, block changes, redo size, and hard parses, generated using the standard script `awrrpt.sql` [4]. AWR Compare Period reports (`awrddrpt.sql` for single-instance or `awrddrpi.sql` for RAC environments) generate side-by-side metric comparisons between two distinct time periods to evaluate performance changes before and after applying patches [5].
* **Automatic Database Diagnostic Monitor (ADDM) Recommendations:** ADDM serves as an intelligent diagnostic engine built directly into Oracle Database that executes automatically after every AWR snapshot (by default, every 60 minutes) [6]. ADDM analyzes the performance delta between snapshot pairs based on DB Time consumption, conducts a tree-structured top-down bottleneck analysis, eliminates non-problem areas, and delivers prioritized recommendations covering hardware capacity, database configuration (`sga_target`, `pga_aggregate_target`, `open_cursors`, `processes`), and schema/SQL optimization [6]. ADDM findings can be queried programmatically via `DBA_ADDM_FINDINGS` and `DBA_ADDM_TASKS` or viewed via `addmrpt.sql` [6].
* **Active Session History (ASH) Diagnostics:** ASH samples active database sessions every second into an SGA ring buffer (`v$active_session_history`), capturing fine-grained performance data for active sessions consuming CPU or waiting on non-idle wait events [7-9]. Second-by-second sampling allows DBAs to isolate transient, short-term performance spikes during batch runs that hourly AWR snapshot averages smooth out [7-9]. Historical ASH data flushed to disk by MMON is queried via `dba_hist_active_sess_history` [7-9].
* **Isolating Physical I/O Bottlenecks:** Physical I/O bottlenecks are isolated in ASH views (`v$active_session_history` or `dba_hist_active_sess_history`) by analyzing specific wait events: `db file sequential read` (single-block reads typical for index lookups or nested loop joins; high wait counts indicate unindexed queries, fragmented indexes, storage latency on DATA disk groups, or unselective B-Tree index range scans), `db file scattered read` (multi-block reads typical for Full Table Scans or Fast Full Index Scans), and `direct path read` / `direct path write` (direct I/O bypassing the buffer cache, caused by large sorts, hash joins spilling to temporary tablespaces, or parallel queries) [8, 10-15]. Joining `v$active_session_history` with `dba_users` and `dba_objects` maps active sessions directly to specific SQL IDs (`sql_id`), usernames, programs, and database objects experiencing disk contention [7, 8]. Combining ASH queries with execution plan profiling via `DBMS_XPLAN.DISPLAY_CURSOR` allows DBAs to inspect runtime access paths (`TABLE ACCESS FULL`, `INDEX RANGE SCAN`) and compare estimated rows (`E-Rows`) against actual rows (`A-Rows`) to identify stale table statistics or suboptimal optimizer plans [16-18].
* **Isolating Row-Level Locking Contention:** Transactional row-level locking contention is isolated using the wait event `enq: TX - row lock contention`, which occurs when sessions wait for row-level locks held by uncommitted transactions [19, 20]. High enqueue wait counts in IFS environments typically stem from concurrent updates to the same customer order, inventory balance, or financial ledger records without proper queuing [20].
* **Isolating Memory Latch Contention:** Internal memory latches are lightweight serialization mechanisms protecting shared data structures within the System Global Area (SGA) [20]. `Cache Buffers Chains` latch contention arises from hot blocks (frequently accessed data blocks accessed concurrently by multiple sessions, such as sequence generators or high-frequency status update tables) [20]. Shared Pool and Library Cache latches and mutexes (such as `cursor: mutex S`, `cursor: mutex X`, `cursor: pin S`, `cursor: pin S wait on X`, `cursor: pin X`, and `library cache: mutex X`) are triggered by excessive hard parsing, unshared SQL statements, or frequent cursor reloads under high mid-tier connection volume [20-26].
* **Version Application:** The official manual Database Performance Tuning Guide 19c provides database performance tuning fundamentals, while Database Reference 18 documents wait event descriptions [27, 28]. The training notes apply AWR, ADDM, and ASH profiling workflows to IFS Applications (IFS Cloud and IFS Applications 10/9) workloads [6, 20, 29]. Where general AWR, ADDM, and ASH mechanics are presented without specifying a single database version, the sources do not explicitly state a version restriction [3, 6, 8, 29].

---

### Objective 3: RMAN Table-Level Point in Time Recovery (RECOVER TABLE PITR)

* **Purpose and Benefits:** The RMAN `RECOVER TABLE` command enables database administrators to recover one or more tables or table partitions to a specified point in time from RMAN backups without affecting remaining database objects or requiring full database restores or system downtime [30, 31]. This is useful when recovering tables that have been logically corrupted or dropped and purged, when Flashback Table is not possible because the target time is older than available undo, or when DDL structural changes (such as truncate table operations) prevent Flashback Table [32].
* **Prerequisites and Required Backups:** The target database must be in ARCHIVELOG mode and read-write mode [33]. RMAN requires a full backup of undo, SYSTEM, SYSAUX, and the tablespaces containing the target tables or partitions [34]. For pluggable databases (PDBs), backups of the SYSTEM, SYSAUX, and undo tablespaces of the root container (CDB\\(ROOT), CDB seed (PDB\\)SEED), and the specific PDB containing the tables are required [35]. Tables or partitions belonging to the SYS schema or SYSTEM and SYSAUX tablespaces cannot be recovered [36].
* **Point-in-Time Specification:** The point in time for recovery is specified using `UNTIL TIME` (a timestamp expression), `UNTIL SCN` (System Change Number), or `UNTIL SEQUENCE` (redo log sequence number and thread) [37, 38].
* **Automated Auxiliary Database Workflow:**
  1. RMAN determines which backup contains the target tables or partitions based on the specified point in time [39].
  2. RMAN checks space availability on the target host and automatically provisions an auxiliary database instance using the `AUXILIARY DESTINATION` clause (or `SET NEWNAME` commands) to store data files for the auxiliary database [39, 40].
  3. RMAN restores the necessary data files and recovers the specified tables or partitions to the designated point in time inside the auxiliary database [39].
  4. RMAN creates a Data Pump export dump file containing the recovered objects, with the directory specified via `DATAPUMP DESTINATION` (defaulting to `AUXILIARY DESTINATION` or `$ORACLE_HOME/dbs` on Linux) and the filename specified via `DUMP FILE` [39, 41].
  5. By default, RMAN automatically imports the Data Pump export dump file into the target database [39, 42]. Specifying `NOTABLEIMPORT` recovers the tables to the specified point in time and generates the dump file without performing the import, allowing manual import later via Data Pump Import [39, 42].
* **Remapping Tables, Schemas, and Tablespaces:** DBAs use the `REMAP TABLE` clause to rename recovered tables or table partitions in the target database [43, 44]. Starting in Oracle Database 12c Release 2 (12.2), `REMAP TABLE` also enables recovering tables or table partitions into a schema different from the original source schema [45]. The `REMAP TABLESPACE` clause imports recovered objects into a tablespace different from their original tablespace [43, 46].
* **PDB Support:** In multitenant environments, tables in a PDB are recovered using `RECOVER TABLE ... OF PLUGGABLE DATABASE <pdb_name>` while connected to the root container or target PDB, recovering the table without impacting other objects in the PDB [47, 48].
* **Version Application:** The official manual Backup and Recovery User Guide 19 documents `RECOVER TABLE` procedures for Oracle Database 19c and highlights schema remapping introduced in Oracle Database 12c Release 2 (12.2) [45, 49]. The provided sources do not mention or state facts regarding Oracle 26ai for `RECOVER TABLE` [30, 49, 50].

---

💡 **Next Steps:** Would you like to review practice questions from your saved **Performance Management and Tuning** quiz app, or explore the SQL scripts for querying `v$active_session_history` during peak batch runs?

# Kaynaklar

* NotebookLM kaynağı `1d3414e6-6bca-4230-b212-d0f61550560c`
* NotebookLM kaynağı `4ebecd4a-16c1-4397-82eb-0db7fbfbdabd`
* NotebookLM kaynağı `ccb29a2f-aa1f-47a3-a142-befdc1c2624e`
* NotebookLM kaynağı `4fab3e98-5068-47b1-aa07-37a106464d38`
* NotebookLM kaynağı `748b8d41-2aa0-49aa-9ecd-8a3de6b850d9`
* NotebookLM kaynağı `b4fb30df-ece6-4bb1-96cd-28c0ef4d8f3c`
* NotebookLM kaynağı `6788fff9-3d2b-4877-86aa-77fb3cb937de`
* NotebookLM kaynağı `dd60e449-4458-4561-92f0-7e84b9b2701d`
* NotebookLM kaynağı `9a96c24e-77c7-4dc1-acc2-8becadcb3d70`
* NotebookLM kaynağı `fb991bc1-c217-4dc6-a8e2-d4332a5e6a9b`
* NotebookLM kaynağı `9f88730c-e303-430d-af33-93a576c6f98d`
* NotebookLM kaynağı `d7d4fb71-bfab-4126-87a9-b52b14a6b928`
