---
type: Chapter
title: Backup, Recovery and Operational Practice
description: In this chapter, the student learns how to design, execute, and evaluate backup, recovery, and disaster recovery architectures for enterprise Oracle database environments supporting IFS Applications a
course: teknik-gelistirim
chapter: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to design, execute, and evaluate backup, recovery, and disaster recovery architectures for enterprise Oracle database environments supporting IFS Applications and ERP workloads. The curriculum covers Oracle Maximum Availability Architecture (MAA) Silver and Gold deployment topologies on Oracle Database@Azure, cross-platform migration from legacy Big-Endian environments to Oracle Database 19c or 26ai using Cross-Platform Transportable Tablespaces (XTTS v4) and Full Transportable Export/Import (FTEX), and Recovery Manager (RMAN) backup and recovery workflows. Additionally, students master post-outage incident reviews, investigating uncompleted batch cleanup processes using diagnostic queries against dba_scheduler_job_run_details and v$diag_alert_ext to refine pre-deployment checklists without requiring Diagnostics or Tuning Pack licenses, while completing comprehensive skills assessments on database resilience.

# Öğrenme Hedefleri

1. The student can deploy Oracle Maximum Availability Architecture (MAA) Silver and Gold topologies on Oracle Database@Azure and execute cross-platform migration to Oracle Database 19c and 26ai using Cross-Platform Transportable Tablespaces (XTTS v4) with Full Transportable Export/Import (FTEX).
2. The student can execute Recovery Manager (RMAN) backup, restore, and recovery operations in Oracle Database 19c, managing commands such as RESTORE, RECOVER, DUPLICATE, and FLASHBACK DATABASE while accounting for the deprecation of the Data Recovery Advisor (DRA).
3. The student can conduct post-outage incident investigations for incomplete IFS batch cleanup jobs using queries against dba_scheduler_job_run_details and v$diag_alert_ext to refine pre-deployment checklists and monitoring thresholds.

# Dersler

* IFS Enterprise Oracle Architecture & DBA Training Program Practice Test
* Kesinti incelemesi hazırlığı - 11.11.2026.docx
* Oracle Database Backup and Recovery Reference - Oracle Help
* Backup and Recovery User Guide
* screencapture-medium-prabirkrkundu-oracle-maa-silver-and-gold-deployment-for-e-business-suite-on-oracle-database-azure-84cfaf11e336-2026-11-10-09_39_28.pdf

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Here is what the student learns for each objective based strictly on the provided sources:

---

### Objective 1: Deploying MAA Silver and Gold Topologies on Oracle Database@Azure and Cross-Platform Migration Using XTTS v4 with FTEX

* **MAA Silver Architecture on Oracle Database@Azure:** The student learns that the MAA Silver tier is the baseline architectural standard for Oracle E-Business Suite (EBS) on Exadata Database Service on Dedicated Infrastructure (ExADB-D), protecting against local compute or software failures within a single Azure Availability Zone [1]. It employs Oracle Real Application Clusters (RAC) for transparent node failover [1]. Integration with Autonomous Recovery Service (ARS) provides an incremental forever backup strategy with a 42 TB/hour backup capability [2]. The deployment maintains an intra-AZ application to database latency between 300 and 500 microseconds [2].
* **MAA Gold Architecture on Oracle Database@Azure:** The student learns that the MAA Gold architecture is mandatory when zero data loss (Recovery Point Objective, RPO = 0) and rapid recovery (Recovery Time Objective, RTO) are strictly governed by service level agreements [2]. It utilizes Oracle Data Guard to maintain a synchronized standby database in a separate Azure Availability Zone or region [2]. Cross-AZ deployments use zero-data-loss synchronous replication, while cross-region deployments use OCI VCN Peering or Azure Peering, replicating TDE encryption keys via OCI Private Vault [2, 3].
* **Cross-Platform Migration (Solaris to Azure):** Migrating from legacy Big-Endian Solaris environments to the Little-Endian Linux environment of Oracle Database@Azure uses Cross-Platform Transportable Tablespaces (XTTS) with Version 4 of the Perl script (`xttdriver.pl`) [3].
* **Migration Procedure Steps:**
  1. *Baseline Initialization:* Create RMAN image copies of source tablespaces and transfer them to destination Exadata storage cells [3].
  2. *Incremental Roll-Forward:* Execute the XTTS V4 script to apply frequent Level 1 incremental backups while the source database remains online [3].
  3. *Metadata Transfer:* Use Full Transportable Export/Import (FTEX) via Data Pump to move metadata (users, privileges, PL/SQL packages), which requires a source database version of at least 11.2.0.3 [3].
  4. *Final Cutover:* Place source tablespaces in READ ONLY mode, apply the final incremental backup, and execute metadata import to plug data files into the target Pluggable Database (PDB) [3]. FTEX enables a direct "Lift, Shift, and Upgrade" into an Oracle Database 19c or Oracle Database 26ai PDB architecture [3, 4].

---

### Objective 2: RMAN Backup, Restore, and Recovery Operations in Oracle Database 19c and DRA Deprecation

* **Deprecation of Data Recovery Advisor (DRA) in Oracle Database 19c:** The student learns that starting in Oracle Database 19c, the Data Recovery Advisor (DRA) feature is deprecated [5, 6]. This deprecation includes the RMAN commands `LIST FAILURE`, `ADVISE FAILURE`, `REPAIR FAILURE`, and `CHANGE FAILURE` [5, 7-9]. Database administrators no longer have access to these commands in Oracle Database 19c, and Oracle provides no replacement feature for DRA [5, 9].
* **Executing RMAN Commands in Oracle Database 19c:**
  * **RESTORE:** Restores database files, control files, server parameter files, or archived logs from backup sets or disk copies to default or new locations [10]. In Oracle Database 19c, `RESTORE` supports `AS ENCRYPTED` or `AS DECRYPTED` clauses when moving databases to or from Oracle Cloud [11, 12].
  * **RECOVER:** Applies redo log files and incremental backups to restored data files or data file copies [10, 13]. In Oracle Database 19c, the `RECOVER...SNAPSHOT TIME` method is deprecated; Oracle recommends executing `ALTER DATABASE BEGIN/END BACKUP` around snapshots and using `RECOVER...UNTIL TIME` instead [5, 14].
  * **DUPLICATE:** Uses backups of a target database to create a duplicate database or standby database [10, 15]. Starting in release 18c and supported in 19c, `DUPLICATE PLUGGABLE DATABASE` allows duplicating a PDB into an existing CDB [16, 17].
  * **FLASHBACK DATABASE:** Rewinds the entire database or a specific PDB to a target time, SCN, log sequence number, or restore point using flashback logs [10, 18, 19]. Flashback operations on a proxy PDB are not supported [20].

---

### Objective 3: Post-Outage Incident Investigations, Diagnostic Queries, Checklists, and Thresholds

* **Incident Context:** The student learns to investigate past system outages caused when batch cleanup jobs fail to complete prior to a deployment [21]. Cleanup jobs execute sequentially, so a stuck step causes subsequent steps to wait [21].
* **Executing Diagnostic SQL Queries:**
  * **`dba_scheduler_job_run_details`:** Database administrators query `dba_scheduler_job_run_details` to inspect Oracle Scheduler job history during the incident timeframe (`WHERE actual_start_date BETWEEN :bas AND :bit`), examining `owner`, `job_name`, `status`, `actual_start_date`, `run_duration`, and `error#` [22].
  * **`v$diag_alert_ext`:** DBAs query `v$diag_alert_ext` to inspect Oracle alert log entries during the incident window (`WHERE originating_timestamp BETWEEN :bas AND :bit`), filtering for error messages containing `%ORA-%` or `%deadlock%` [22].
  * *Licensing Note:* These queries use standard dictionary views and do not require Oracle Diagnostics Pack or Tuning Pack licenses [22, 23].
* **Refining Checklists and Monitoring Thresholds:**
  * Post-incident reviews establish a timeline and determine root causes (identifying which background or scheduled job remained incomplete and why Cleanup bypassed or failed to clear it) [24-26].
  * Investigation findings are used to update pre-deployment checklists to enforce a mandatory pre-flight query confirming that no running background jobs exist before starting deployment scripts [26, 27].
  * Incident findings help establish monitoring rules to track active background job durations, background job error counts, and the last successful completion timestamp of Cleanup tasks [23, 24, 27].

---

💡 **Next Steps:** Would you like to generate a practice quiz covering these RMAN backup/recovery commands and MAA cloud migration pathways, or create flashcards to test your knowledge of the diagnostic queries for `dba_scheduler_job_run_details` and `v$diag_alert_ext`?

# Kaynaklar

* NotebookLM kaynağı `e35c14f2-93a3-48bc-97bb-919d2dbc6af8`
* NotebookLM kaynağı `bb9376f9-7c81-4843-a754-a6b6f0e41bc1`
* NotebookLM kaynağı `69cf0036-74c0-45d9-ad5f-91a557293747`
* NotebookLM kaynağı `a2c969ff-fe28-4362-a2d6-81807bf8d55c`
* NotebookLM kaynağı `30c8d921-9b1a-45f2-9e13-aeb376263794`
