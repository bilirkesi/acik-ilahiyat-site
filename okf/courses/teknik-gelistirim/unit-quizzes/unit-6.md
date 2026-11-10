---
type: Quiz
title: "Ünite 6 quizi: Data Guard, MAA Standards and Failover Operations"
description: Teknik Gelişim 6. ünite için 13 soruluk quiz.
course: teknik-gelistirim
unit: 6
question_count: 13
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-6.md
---

# Ünite 6: Data Guard, MAA Standards and Failover Operations

Toplam 13 soru.

## 1. Under Oracle Data Guard's Maximum Protection mode, what occurs to the primary database if network connectivity to all target standby databases is severed?

*İpucu:* Consider how strict RPO = 0 enforcement impacts primary availability when network communication to the standby is completely lost.

A) The primary database falls back to asynchronous mode and continues servicing application transactions.
B) The primary database switches automatically to Maximum Performance mode without stopping transactions.
C) The primary database prompts mid-tier application connection pools to suspend threads while remaining online.
D) The primary database automatically shuts down to prevent un-replicated commits and guarantee zero data loss. *

**Cevap anahtarı:** D

**Gerekçe (D):** In Maximum Protection mode, if no qualified standby can acknowledge a synchronous redo write, the primary database halts immediately to ensure zero-data-loss compliance.

## 2. According to Data Guard sizing rules, what is the standard formula for calculating the total number of Standby Redo Log (SRL) groups required for a RAC primary environment?

*İpucu:* Think about how online redo log groups per thread are multiplied and incremented based on each RAC thread.

A) (Threads × Online Groups) + 1 total
B) (Threads × 2) + Online Groups per thread
C) (Threads × Online Groups) + 1 per thread *
D) (Threads + Online Groups) × 2

**Cevap anahtarı:** C

**Gerekçe (C):** The sizing guideline specifies configuring Standby Redo Log groups as the product of RAC threads and online log groups, plus one additional SRL group per thread.

## 3. What are the standard OEM warning and critical alert thresholds for Data Guard Apply Lag (Replication Lag)?

*İpucu:* Recall the metric thresholds measured in minutes (5 minutes for early warning, 15 minutes for critical severity).

A) Warning at 300 seconds (5 minutes) and Critical at 900 seconds (15 minutes) *
B) Warning at 900 seconds (15 minutes) and Critical at 3600 seconds (1 hour)
C) Warning at 60 seconds (1 minute) and Critical at 300 seconds (5 minutes)
D) Warning at 150 seconds (2.5 minutes) and Critical at 600 seconds (10 minutes)

**Cevap anahtarı:** A

**Gerekçe (A):** The OEM metric architecture specifies a 300-second warning threshold for apply lag and a 900-second threshold for critical alerts.

## 4. Which component is introduced in the Oracle MAA Platinum Tier to enable zero-downtime online application schema upgrades alongside Active Data Guard and RAC?

*İpucu:* Look for the database technology that allows new application editions to coexist with old editions during active operations.

A) Single Client Access Name (SCAN) listeners
B) Fast-Start Failover (FSFO)
C) Edition-Based Redefinition (EBR) *
D) Standby Redo Logs (SRLs)

**Cevap anahtarı:** C

**Gerekçe (C):** MAA Platinum tier integrates Edition-Based Redefinition (EBR) and Oracle GoldenGate on top of Gold tier components to eliminate downtime during online application schema changes.

## 5. In Oracle Database 19c Active Data Guard, which parameter controls the automatic redirection of DML statements from a read-only standby database to the primary database?

*İpucu:* The parameter name explicitly combines the Active Data Guard abbreviation with its key redirection capability.

A) STANDBY_FILE_MANAGEMENT
B) LOG_ARCHIVE_CONFIG
C) DG_BROKER_START
D) ADG_REDIRECT_DML *

**Cevap anahtarı:** D

**Gerekçe (D):** ADG_REDIRECT_DML is the documented parameter introduced in Oracle 19c to enable and control DML redirection from Active Data Guard standby databases.

## 6. Prior to executing a planned switchover in Data Guard Broker (dgmgrl), which command checks database health and confirms readiness for role transition?

*İpucu:* Think of the dgmgrl verb used to inspect specific database member readiness before initiating a role swap.

A) SHOW REPLICATION HEALTH
B) VALIDATE DATABASE <db_unique_name> *
C) ALTER DATABASE PREPARE SWITCHOVER
D) CHECK SWITCHOVER STATUS

**Cevap anahtarı:** B

**Gerekçe (B):** Executing VALIDATE DATABASE in dgmgrl performs pre-flight readiness checks and reports whether a database is ready for switchover or failover.

## 7. Setting STANDBY_FILE_MANAGEMENT=AUTO on a Data Guard physical standby database ensures which automated behavior?

*İpucu:* Focus on how storage expansion operations for new data files on the primary affect the physical standby.

A) New datafiles created on the primary database are automatically created on the standby database. *
B) Database control files are automatically backed up whenever a tablespace is added.
C) Missing archive log gaps are automatically downloaded from remote RMAN backups.
D) Standby redo log files are resized automatically when online redo logs change on the primary.

**Cevap anahtarı:** A

**Gerekçe (A):** The STANDBY_FILE_MANAGEMENT=AUTO parameter configures Oracle to replicate datafile additions transparently without manual DBA intervention on the standby.

## 8. Which dynamic performance view is queried on an Active Data Guard standby database to monitor 'transport lag' and 'apply lag' metrics?

*İpucu:* Look for the specific dynamic performance view name ending in STATS that tracks Data Guard replication latency.

A) V$DATABASE
B) V$ARCHIVE_DEST_STATUS
C) V$DATAGUARD_STATS *
D) V$MANAGED_STANDBY

**Cevap anahtarı:** C

**Gerekçe (C):** V$DATAGUARD_STATS records current real-time metrics including transport lag, apply lag, and time computed on standby instances.

## 9. What is the primary operational distinction between a Data Guard Switchover and a Data Guard Failover?

*İpucu:* Consider whether the event is planned or unplanned, and whether the role transition is two-way or one-way.

A) Switchover requires database re-creation from RMAN backups afterward, whereas Failover preserves the original primary instance intact.
B) Switchover forces standby promotion after primary hardware failure, whereas Failover is performed for routine maintenance.
C) Switchover operates strictly under Maximum Performance mode, whereas Failover requires Maximum Protection mode.
D) Switchover is a planned, two-way role reversal with zero data loss, whereas Failover is an unplanned, one-way emergency promotion of a standby database. *

**Cevap anahtarı:** D

**Gerekçe (D):** A switchover cleanly swaps primary and standby roles during planned events without data loss, while a failover forcibly promotes a standby following an unplanned primary outage.

## 10. How does Transparent Application Continuity (TAC) mask database node failures from client applications in an MAA environment?

*İpucu:* Focus on how session state tracking inside the database enables in-flight call replay without application modifications.

A) TAC forces the application connection pool to abort uncommitted transactions and issue an immediate rollback to the user.
B) TAC converts write operations into read-only queries during failover until the primary instance is restored.
C) TAC tracks session state inside the database, hides request errors, and replays in-flight transactions on a surviving instance. *
D) TAC buffers all SQL statements in mid-tier web server memory and resends them after a manual database restart.

**Cevap anahtarı:** C

**Gerekçe (C):** TAC rebuilds session state and replays held calls automatically without requiring application code changes, preventing mid-tier user-visible errors during node outages.

## 11. In the Data Guard Broker command line interface (dgmgrl), which command executes a planned switchover to a target standby database named 'PRODSTBY'?

*İpucu:* Identify the concise dgmgrl verb designed specifically for planned role swaps to a target standby database.

A) FAILOVER TO 'PRODSTBY';
B) SET PRIMARY DATABASE TO 'PRODSTBY';
C) ALTER DATABASE SWITCHOVER TO PRODSTBY;
D) SWITCHOVER TO 'PRODSTBY'; *

**Cevap anahtarı:** D

**Gerekçe (D):** In dgmgrl, issuing SWITCHOVER TO 'target_db' initiates the clean, automated role reversal process across both primary and standby databases.

## 12. According to the OEM metric threshold standards for database host infrastructure, what are the recommended Warning and Critical CPU utilization thresholds?

*İpucu:* Look for the pair of percentage values representing sustained high load (mid-80s) and severe saturation (mid-90s).

A) Warning at 90% utilization and Critical at 99% utilization
B) Warning at 75% utilization and Critical at 90% utilization
C) Warning at 85% utilization and Critical at 95% utilization *
D) Warning at 70% utilization and Critical at 85% utilization

**Cevap anahtarı:** C

**Gerekçe (C):** OEM architecture rules set the host CPU warning alert at 85% over sustained intervals and the critical threshold at 95% CPU saturation.

## 13. In Real-Time Redo Apply for Oracle Data Guard, which process on the standby database receives the incoming redo stream transmitted by the primary's LNS process?

*İpucu:* Focus on the standby network background process whose acronym stands for Remote File Server.

A) DMON (Data Guard Broker Monitor)
B) RFS (Remote File Server) *
C) DBW0 (Database Writer)
D) MRP0 (Managed Recovery Process)

**Cevap anahtarı:** B

**Gerekçe (B):** The RFS process runs on the standby database instance to receive redo data transmitted over the network by the primary's LNS process and write it into Standby Redo Logs.
