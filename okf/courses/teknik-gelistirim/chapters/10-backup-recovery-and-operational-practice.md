---
type: Chapter
title: Backup, Recovery and Operational Practice
description: In this chapter, the student learns how to design, execute, and evaluate backup, recovery, and disaster recovery architectures for enterprise Oracle database environments supporting IFS Applications a
course: teknik-gelistirim
chapter: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T05:06:34Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to design, execute, and evaluate backup, recovery, and disaster recovery architectures for enterprise Oracle database environments supporting IFS Applications and ERP workloads. The curriculum covers Oracle Maximum Availability Architecture (MAA) Silver and Gold deployment topologies on Oracle Database@Azure, cross-platform migration from legacy Big-Endian environments to Oracle Database 19c or 26ai using Cross-Platform Transportable Tablespaces (XTTS v4) and Full Transportable Export/Import (FTEX), and Recovery Manager (RMAN) backup and recovery workflows. Additionally, students master post-outage incident reviews, investigating uncompleted batch cleanup processes using diagnostic queries against dba_scheduler_job_run_details and v$diag_alert_ext to refine pre-deployment checklists without requiring Diagnostics or Tuning Pack licenses, while completing comprehensive skills assessments on database resilience.

# Sesli Ders

[Bölüm 10 sesli özeti](/audio/teknik-gelistirim/chapter-10.mp3) (5:49 dk, MP3)

# Öğrenme Hedefleri

1. The student can deploy Oracle Maximum Availability Architecture (MAA) Silver and Gold topologies on Oracle Database@Azure and execute cross-platform migration to Oracle Database 19c and 26ai using Cross-Platform Transportable Tablespaces (XTTS v4) with Full Transportable Export/Import (FTEX).
2. The student can execute Recovery Manager (RMAN) backup, restore, and recovery operations in Oracle Database 19c, managing commands such as RESTORE, RECOVER, DUPLICATE, and FLASHBACK DATABASE while accounting for the deprecation of the Data Recovery Advisor (DRA).
3. The student can conduct post-outage incident investigations for incomplete IFS batch cleanup jobs using queries against dba_scheduler_job_run_details and v$diag_alert_ext to refine pre-deployment checklists and monitoring thresholds.

# Dersler

* IFS Enterprise Oracle Architecture & DBA Training Program Practice Test
* Kesinti incelemesi hazırlığı - 11.11.2026.docx
* Oracle Database Backup and Recovery Reference - Oracle Help
* Backup and Recovery User Guide

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the selected sources, here is what the student learns for each specified objective.

---

### Objective 1: Deploying MAA Silver and Gold Topologies on Oracle Database@Azure and Cross-Platform Migration

* **MAA Silver Architecture on Oracle Database@Azure:** The student learns that the MAA Silver reference architecture on Exadata Database Service on Dedicated Infrastructure (ExaDB-D) protects against local compute or software failures within a single Azure Availability Zone (AZ) using Oracle RAC for transparent node failover [1-3]. MAA Silver integrates with Autonomous Recovery Service (ARS) for an incremental forever backup strategy with real-time data protection [2, 4]. Deploying application VMs in the same Availability Zone as the database cluster achieves low application-to-database latency between 200 and 400 microseconds (or 300 to 500 microseconds) [5, 6].
* **MAA Gold Architecture on Oracle Database@Azure:** The student learns that the MAA Gold architecture uses Oracle Data Guard across separate Azure Availability Zones or regions to enforce zero data loss (Recovery Point Objective, RPO = 0) and rapid recovery (Recovery Time Objective, RTO) [1, 4, 7]. Cross-AZ Gold deployments use zero-data-loss synchronous replication, while cross-region deployments use OCI VCN Peering (recommended for higher single-process throughput) or Azure VNet Peering, with TDE encryption keys replicated via OCI Private Vault [7-11].
* **MAA Platinum Architecture on Oracle Database@Azure:** The student learns that MAA Platinum Option 1 requires Oracle AI Database 26ai or higher and Oracle Active Data Guard [7, 12].
* **Cross-Platform Migration:** The student learns that RMAN supports cross-platform data transport using image copies (`CONVERT TABLESPACE`, `CONVERT DATAFILE`, `CONVERT DATABASE`) and backup sets (`BACKUP ... FOR TRANSPORT` or `TO PLATFORM`, `RESTORE ... FROM PLATFORM`) based on platform endian formats listed in `V$TRANSPORTABLE_PLATFORM` [13-18].
* **Coverage Limitation:** The selected sources do not cover Cross-Platform Transportable Tablespaces (XTTS v4) or Full Transportable Export/Import (FTEX) [19].

---

### Objective 2: RMAN Backup, Restore, and Recovery Operations in Oracle Database 19c and Data Recovery Advisor (DRA) Deprecation

* **Deprecation of Data Recovery Advisor (DRA) in Oracle Database 19c:** Starting in Oracle Database 19c, the Data Recovery Advisor (DRA) feature is deprecated [20, 21]. This deprecation includes the Recovery Manager (RMAN) commands `LIST FAILURE`, `ADVISE FAILURE`, `REPAIR FAILURE`, and `CHANGE FAILURE` [20-22]. Database administrators no longer have access to these commands in Oracle Database 19c, and Oracle provides no replacement feature for DRA [20, 21].
* **Executing RMAN `RESTORE` in Oracle Database 19c:** The `RESTORE` command restores data files, control files, server parameter files (spfile), or archived redo logs from backup sets or disk copies [23, 24]. In Oracle Database 19c (and 18c), `RESTORE` supports `AS ENCRYPTED` or `AS DECRYPTED` clauses when moving unencrypted or encrypted databases between on-premises environments and Oracle Cloud [25]. `RESTORE` also supports restoring cross-platform backups using `RESTORE FROM PLATFORM` or `RESTORE ALL FOREIGN DATAFILES` [26-28].
* **Executing RMAN `RECOVER` in Oracle Database 19c:** The `RECOVER` command applies redo log files and incremental backups to restored data files [26, 29]. In Oracle Database 19c, the `RECOVER...SNAPSHOT TIME` method of point-in-time recovery using storage snapshots is deprecated [20, 30, 31]. Oracle recommends executing `ALTER DATABASE BEGIN/END BACKUP` around storage snapshots, followed by `RECOVER...UNTIL TIME` to a timestamp or SCN after the `END BACKUP` completion time [30]. `RECOVER` supports recovering pluggable databases (`RECOVER PLUGGABLE DATABASE`) and table recovery (`RECOVER TABLE`) [32, 33].
* **Executing RMAN `DUPLICATE` in Oracle Database 19c:** The `DUPLICATE` command creates a duplicate database with a unique DBID for testing or a standby database retaining the primary DBID for Data Guard [24]. Starting in release 18c and supported in Oracle Database 19c, `DUPLICATE PLUGGABLE DATABASE` allows duplicating a PDB into an existing CDB when `COMPATIBLE` is set to 18.0.0 or higher [34, 35]. `DUPLICATE` supports `AS ENCRYPTED` or `AS DECRYPTED` clauses when duplicating databases to or from Oracle Cloud [36].
* **Executing RMAN `FLASHBACK DATABASE`:** The `FLASHBACK DATABASE` command rewinds the entire database (CDB) or a specific PDB to a target time, SCN, log sequence number, or restore point using flashback logs stored in the fast recovery area without restoring data files [37-39]. Flashback operations on a proxy PDB are not supported [37].

---

### Objective 3: Post-Outage Incident Investigations for Incomplete IFS Batch Cleanup Jobs

* **Incident Context and Sequential Cleanup:** The student learns to investigate past system outages caused when batch cleanup processes failed to finish prior to a deployment [40]. Cleanup steps execute sequentially, meaning if one step gets stuck, subsequent steps wait [40].
* **Executing Diagnostic SQL Queries:** Database administrators run read-only SQL queries that do not require Oracle Diagnostics Pack or Tuning Pack licenses [41, 42]:
  * **`dba_scheduler_job_run_details` View:** Querying `dba_scheduler_job_run_details` inspects Oracle Scheduler job execution history during the incident timeframe (`WHERE actual_start_date BETWEEN :bas AND :bit`), examining `owner`, `job_name`, `status`, `actual_start_date`, `run_duration`, and `error#` [41].
  * **`v$diag_alert_ext` View:** Querying `v$diag_alert_ext` inspects Oracle alert log entries during the incident window (`WHERE originating_timestamp BETWEEN :bas AND :bit`), filtering for error messages containing `%ORA-%` or `%deadlock%` [41].
* **Refining Pre-Deployment Checklists and Monitoring Thresholds:**
  * Investigation findings are used to add a mandatory pre-deployment verification check ("no active running background jobs") to the DBA runbook and pre-flight deployment checklist to halt deployment while background jobs remain active [42-44].
  * Investigation findings help establish monitoring rules and alarm thresholds to track active background job durations, error counts for waiting or failed jobs, and the last successful completion timestamp of Cleanup tasks [42, 44, 45].

---

💡 Would you like to review practice questions from your saved **RMAN Quiz** app, or generate a detailed runbook covering the diagnostic SQL queries for `dba_scheduler_job_run_details` and `v$diag_alert_ext`?

# Kaynaklar

* NotebookLM kaynağı `e35c14f2-93a3-48bc-97bb-919d2dbc6af8`
* NotebookLM kaynağı `bb9376f9-7c81-4843-a754-a6b6f0e41bc1`
* NotebookLM kaynağı `69cf0036-74c0-45d9-ad5f-91a557293747`
* NotebookLM kaynağı `a2c969ff-fe28-4362-a2d6-81807bf8d55c`
* NotebookLM kaynağı `2cce32bb-ac3a-4281-b84a-cade9a724b03`
* NotebookLM kaynağı `d7d4fb71-bfab-4126-87a9-b52b14a6b928`
