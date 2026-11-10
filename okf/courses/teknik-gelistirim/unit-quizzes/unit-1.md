---
type: Quiz
title: "Ünite 1 quizi: Program Orientation and IFS Cloud Oracle Architecture"
description: Teknik Gelişim 1. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 1
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-1.md
---

# Ünite 1: Program Orientation and IFS Cloud Oracle Architecture

Toplam 12 soru.

## 1. In the Oracle Multitenant Architecture utilized by IFS enterprise applications, what is the primary role of the root container database (CDB$ROOT)?

*İpucu:* Focus on the centralized architecture component that manages system metadata and background processes.

A) It stores isolated application-specific schemas and business data tablespaces exclusively for production workloads.
B) It manages background processes, shared system metadata, and global memory allocations across the container database structure. *
C) It serves as a system-provided template PDB used to clone new non-production environments.
D) It enforces user-level UI session persistence and external identity provider authentication tokens.

**Cevap anahtarı:** B

**Gerekçe (B):** The CDB$ROOT container database acts as the master management structure handling background processes, shared system metadata, and global memory for all connected pluggable databases.

## 2. What is the primary administrative function of PDB$SEED within an IFS Oracle Multitenant environment?

*İpucu:* Consider how new development or test environments are generated within a container database.

A) To act as a system-provided template PDB used for rapidly provisioning new user PDBs such as DEV, TEST, or PROD. *
B) To store backup catalog records and Block Change Tracking (BCT) metadata.
C) To manage global memory allocations under Automatic Shared Memory Management (ASMM).
D) To offload read-only reporting queries and batch generation jobs from the primary database instance.

**Cevap anahtarı:** A

**Gerekçe (A):** PDB$SEED is a read-only system template provided by Oracle to enable fast provisioning of new pluggable database instances.

## 3. How do Release Updates (RU) differ from Release Update Revisions (RUR) in the Oracle patch management lifecycle?

*İpucu:* Think about which patch type increments minor release versions versus which focus solely on targeted security and regression stability.

A) Release Updates (RU) contain major database release upgrades, whereas Release Update Revisions (RUR) contain emergency one-off PL/SQL scripts.
B) Release Updates (RU) require full database re-creation, while Release Update Revisions (RUR) are applied dynamically without stopping database services.
C) Release Updates (RU) are quarterly cumulative patches with bug fixes and enhancements that increment the minor release version, whereas Release Update Revisions (RUR) extend an existing RU with security and regression fixes without adding new functional bug fixes. *
D) Release Updates (RU) are applied exclusively to non-production environments, while Release Update Revisions (RUR) are applied exclusively to CDB$ROOT.

**Cevap anahtarı:** C

**Gerekçe (C):** RUs increment the minor release version quarterly with new enhancements and fixes, while RURs focus strictly on extending stability via security and regression patches for a specific RU.

## 4. Which initialization parameter is configured under Automatic Shared Memory Management (ASMM) to dynamically balance the Buffer Cache, Shared Pool, and Large Pool?

*İpucu:* Identify the parameter that specifically targets the System Global Area pool allocations.

A) processes
B) open_cursors
C) sga_target *
D) pga_aggregate_target

**Cevap anahtarı:** C

**Gerekçe (C):** Configuring sga_target under ASMM enables Oracle to automatically adjust memory distributions across the Buffer Cache, Shared Pool, and Large Pool to handle OLTP transaction loads.

## 5. What critical operational issue during large batch runs is prevented by properly tuning pga_aggregate_target?

*İpucu:* Recall which memory area handles per-process memory for sort and join operations.

A) Buffer cache buffer busy waits during high-volume insert statements.
B) Temporary tablespace spilling during sort operations and hash joins. *
C) Exclusive row-locking contention on core application tables.
D) Un-recompiled invalid database objects following a delivery deployment.

**Cevap anahtarı:** B

**Gerekçe (B):** Adequate PGA allocation ensures sorting and hash join operations complete in workarea memory rather than spilling over to disk-based temporary tablespaces.

## 6. In a shared Container Database hosting production and non-production PDBs, how does Oracle Resource Manager prevent lower environments from starving production resources?

*İpucu:* Consider the specific SQL directive used to construct Resource Manager governance plans across PDBs.

A) By enforcing CREATE_CDB_PLAN policies that allocate CPU shares and utilization limits at the container level. *
B) By restricting network connection pool requests exclusively to the primary Application Owner account.
C) By automatically terminating non-production database sessions when system memory exceeds 80%.
D) By enforcing fine-grained striping across dedicated RECO disk groups.

**Cevap anahtarı:** A

**Gerekçe (A):** Resource Manager plans configured via CREATE_CDB_PLAN establish explicit CPU shares and utilization limits to protect production PDBs from resource consumption spikes in non-production PDBs.

## 7. Which combination of database operational limits must be tuned to support concurrent connection pools from IFS mid-tier application servers?

*İpucu:* Look for parameters controlling maximum process connections and concurrent cursor statements.

A) db_create_file_dest and asm_diskgroups
B) log_archive_dest_1 and standby_file_management
C) open_cursors and processes *
D) audit_trail and recyclebin

**Cevap anahtarı:** C

**Gerekçe (C):** Tuning open_cursors and processes ensures the database tier can accommodate concurrent session requests and cursor handles generated by mid-tier connection pools.

## 8. Which SQL statement changes an administrative session context from CDB$ROOT to an isolated pluggable database named ifsprod?

*İpucu:* Focus on the standard ALTER SESSION clause used to specify a container target.

A) SWITCH DATABASE TO ifsprod;
B) CONNECT TO PDB ifsprod AS SYSDBA;
C) ALTER PLUGGABLE DATABASE ifsprod SET CONTEXT;
D) ALTER SESSION SET CONTAINER = ifsprod; *

**Cevap anahtarı:** D

**Gerekçe (D):** Executing ALTER SESSION SET CONTAINER changes the session context to the targeted pluggable database container.

## 9. Which dynamic performance view allows an administrator connected to CDB$ROOT to inspect the open status of all pluggable databases?

*İpucu:* Recall the specific v$ view designed to display PDB names and open modes.

A) v$instance_pdbs
B) v$containers_list
C) v$pdbs *
D) dba_pdbs

**Cevap anahtarı:** C

**Gerekçe (C):** Querying v$pdbs lists the container IDs, names, and current open modes (e.g., READ WRITE, MOUNTED) of all pluggable databases.

## 10. When a target IFS PDB named ifsprod is in MOUNTED state following a restart, which SQL command transitions it to operational status for application transactions?

*İpucu:* Identify the standard DDL command targeting a pluggable database to change its state to open.

A) ALTER DATABASE ifsprod OPEN READ ONLY;
B) EXECUTE DBMS_PDB.OPEN('ifsprod');
C) STARTUP PDB ifsprod FORCE;
D) ALTER PLUGGABLE DATABASE ifsprod OPEN; *

**Cevap anahtarı:** D

**Gerekçe (D):** The ALTER PLUGGABLE DATABASE <pdb_name> OPEN command changes the PDB state from MOUNTED to OPEN (READ WRITE), enabling transactions.

## 11. What is the key objective of aligning Oracle quarterly patch release cycles with IFS update schedules?

*İpucu:* Consider why maintenance windows across both the database engine and the ERP application need to be synchronized.

A) To automatically convert single-instance databases into multi-node RAC clusters.
B) To eliminate the requirement for testing patches in non-production environments prior to production rollout.
C) To replace standard RMAN backup routines with automated application patch scripts.
D) To coordinate infrastructure maintenance windows across non-production and production environments with application maintenance updates. *

**Cevap anahtarı:** D

**Gerekçe (D):** Aligning Oracle quarterly patching (RU/RUR) with IFS software release/update cycles ensures stable validation across non-production tiers before applying fixes to production.

## 12. What architectural advantage is provided by placing distinct IFS application environments (such as DEV, TEST, and PROD) into isolated user PDBs under a single CDB?

*İpucu:* Think about how Multitenant architecture optimizes physical server usage while keeping environment data separate.

A) They remove the need for system parameters such as open_cursors or processes.
B) They bypass the need for PGA memory configuration by sharing a single execution workarea across all tenants.
C) They automatically replicate production data changes to test environments in real time.
D) They isolate transactional schema objects and application data while sharing underlying server hardware and background process infrastructure. *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle Multitenant enables tenant isolation at the logical schema and tablespace level, allowing distinct environments to co-exist efficiently on shared hardware resources.
