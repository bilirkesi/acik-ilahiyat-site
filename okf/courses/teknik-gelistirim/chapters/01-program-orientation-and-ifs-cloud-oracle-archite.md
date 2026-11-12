---
type: Chapter
title: Program Orientation and IFS Cloud Oracle Architecture
description: "This chapter covers the foundational enterprise architecture and administration practices required to manage Oracle Database 19c environments for IFS Applications and IFS Cloud. The curriculum covers "
course: teknik-gelistirim
chapter: 1
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T07:22:59Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

This chapter covers the foundational enterprise architecture and administration practices required to manage Oracle Database 19c environments for IFS Applications and IFS Cloud. The curriculum covers Multitenant Container Database (CDB) and Pluggable Database (PDB) isolation, dynamic memory architecture tuning for sga_target and pga_aggregate_target, and Release Update (RU) and Release Update Revision (RUR) patch lifecycles. The chapter also covers operational governance, background job lifecycle management, deployment prerequisites, and telemetry monitoring using the Application Monitoring Console in IFS Cloud 26R2, alongside operational report development in IFS Cloud 25R1.

# Sesli Ders

[Bölüm 1 sesli özeti](/audio/teknik-gelistirim/chapter-1.mp3) (5:30 dk, MP3)

# Öğrenme Hedefleri

1. administer Multitenant Container Database (CDB) structures and Pluggable Database (PDB) tenant isolation while tuning memory parameters sga_target and pga_aggregate_target for Oracle Database 19c.
2. align quarterly Release Update (RU) and Release Update Revision (RUR) patch maintenance cycles with IFS Applications and IFS Cloud maintenance windows.
3. execute operational governance, background process cleanup, deployment prerequisites, and server alert log monitoring within IFS Cloud 26R2 environments.

# Dersler

* IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines
* IFS Oracle DBA Training Setup
* Chapter 1 Core Topics Overview
* screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf
* IFS Oracle DBA Training Progress
* IFS Oracle DBA Eğitim Güncellemesi
* Training Progress and Chapter 6 Start
* IFS Oracle Eğitim İçeriği Güncellemesi
* Configure Scheduled Tasks - Technical Documentation For IFS Cloud
* Monitoring - Technical Documentation For IFS Cloud
* Preparing Installation - Technical Documentation For IFS Cloud
* Technical Administration and Operational Governance in IFS Cloud 26R2
* Technical Documentation For IFS Cloud

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is the detailed explanation of each specified objective.

---

### Objective 1: Multitenant CDB Structures, PDB Tenant Isolation, and Memory Tuning

For this objective, the following is covered:

* **CDB and PDB Architecture:** Managing the single root container database CDB$ROOT, which handles background processes, shared system metadata, and global memory [1]. Creating and administering dedicated pluggable databases, including PDB$SEED and User PDBs such as IFS_PROD, IFS_TEST, and DEV, to isolate distinct IFS application instances on shared server hardware [1-4].
* **Tenant Isolation and Session Management:** Managing PDB states, switching container contexts, and isolating transactional schema objects across environments [1, 4].
* **Resource Manager Governance:** Configuring Oracle Resource Manager policies using `CREATE_CDB_PLAN` to assign CPU shares (`shares`) and utilization limits (`utilization_limit`) at the CDB level, preventing non-production environments from starving production resources [2-4].
* **Dynamic Memory Tuning:** Configuring `sga_target` under Automatic Shared Memory Management (ASMM) to dynamically balance the Buffer Cache, Shared Pool, and Large Pool for high-volume OLTP transactions [1]. Configuring `pga_aggregate_target` optimizes per-process memory for sort operations and hash joins, preventing temporary tablespace spilling during large batch runs [1].
* **Capacity Parameters:** Tuning `open_cursors` and `processes` to support concurrent mid-tier application connection pools [1, 5].
* **Version Application:** The training sources apply these multitenant and parameter tuning concepts to IFS Applications (including IFS Cloud, IFS Applications 10, and IFS Applications 9) and specify Oracle 19c for the underlying storage tier in IFS Cloud 26R2 [1, 3, 5, 6]. Where the training sources present core ASMM parameter definitions without specifying a database version, the sources do not explicitly name the version [1, 5].

---

### Objective 2: RU and RUR Patch Maintenance Alignment

For this objective, the following is covered:

* **Release Updates (RU):** Understanding quarterly cumulative patches that contain security vulnerability fixes, high-value bug fixes, and critical stability enhancements, which increment the minor database release version [1, 4].
* **Release Update Revisions (RUR):** Understanding security and regression-focused patches that extend the lifespan of an existing RU without introducing new functional bug fixes, preserving production stability [1, 4].
* **Maintenance Window Alignment:** Aligning Oracle quarterly RU and RUR patching strategies with IFS Cloud and IFS Applications update and release cycles across production and non-production environments [1-5].
* **Version Application:** The sources present RU and RUR patch alignment for IFS Cloud as well as IFS Applications 10 and IFS Applications 9 without stating a specific database version limitation for the patch definition [1, 3, 5].

---

### Objective 3: Operational Governance, Process Cleanup, Prerequisites, and Alert Monitoring in IFS Cloud 26R2

For this objective, the following is covered from the official IFS Cloud 26R2 documentation:

* **Background Process Lifecycle:** Deferred transactions and automated maintenance operations progress through states to terminal states Ready, Warning, or Error [7, 8].
* **System Retention Parameters:** Automated purging is executed by Foundation1 Light Cleanup based on System Parameters in Solution Manager [9]. The default retention intervals are 7 days for completed jobs in state Ready, 30 days for jobs in state Warning, 180 days for jobs in state Error, and 7 days for inactive Scheduled tasks [9]. Setting the "Exclude from Cleanup" flag on a job overrides standard retention limits to preserve diagnostic data [10]. The system parameter "Number of background processes" defaults to 10 and is limited by Oracle's `JOB_QUEUE_PROCESSES` parameter [9].
* **Pre-Deployment Cleanup Isolation Sequence:** Executing Light Cleanup 24 hours prior to deployment to clear job backlogs and invalid materialized views [11]. Disabling scheduled maintenance tasks "Shrink LOB segments" and "Heavy Cleanup" in Solution Manager, setting batch queues to a stopped state to drain Executing jobs, and inspecting active Oracle sessions to terminate lingering background slave processes before running deployment scripts [11, 12].
* **Deployment Prerequisites Checklist:** Locking the Application Owner account for Remote Deployment models [6]. Verifying that active Oracle RMAN database archiving and continuous logging are healthy [6]. Pausing batch queues and suspending scheduled task daemons to prevent schema modification during delivery [6]. Confirming ICAM Blob and SMB file storage configuration, Kubernetes node labeling, persistent volume claims (PVCs), middle-tier container memory directives in `ifscloud-values.yaml` for pods such as `ifsapp-connect`, and pausing or draining transport connectors and IFS Connect message queues [6].
* **Server Alert Log Architecture:** Accessing database diagnostic logs via Solution Manager under Solution Manager / Monitoring / Server Alert Log [13]. Log entries record Category ID, Text 1 (primary error text), Text 2 (detailed SQL or PL/SQL block), F1 Identity, and OS Identity [14]. Categories are configured in Server Alert Log Categories using Enable, Cleanup, and Days to keep parameters [15]. Standard categories include Ddl Audit, Debug, Deployment, Deployment detail, Event errors, Server Errors (triggered by AFTER ERROR), Sql Injections (triggered by `Assert_SYS`), and In-Memory [16]. In production IFS Cloud 26R2 environments, Sql Injections and Server Errors are recommended to remain active, while trigger-based categories like Ddl Audit should be disabled during normal operations to avoid performance overhead [15-17].

---

💡 **Next Steps:** Would you like to generate a practice quiz covering these three modules, or explore the specific step-by-step SQL runbooks for PDB isolation and CDB Resource Manager configuration?

# Kaynaklar

* NotebookLM kaynağı `f3d4231d-7739-446f-a447-2c7906358ca3`
* NotebookLM kaynağı `239ebccb-fa0b-4409-9edf-967814bc054f`
* NotebookLM kaynağı `489d856f-f87e-4687-b920-4f6a8cc61ee8`
* NotebookLM kaynağı `616bc55c-014f-43c8-b15b-1931ffae437e`
* NotebookLM kaynağı `dd88611e-e6bf-4f32-996e-ea2a85ed30c1`
* NotebookLM kaynağı `494eab94-0a7b-410f-912a-9983479c88f7`
* NotebookLM kaynağı `f76cc808-6644-4ee4-95fa-7b0e0730e5f9`
* NotebookLM kaynağı `fe661ac6-8702-4032-a9a5-bb196794fe4a`
* NotebookLM kaynağı `8aea0ce6-8040-4f16-975c-45ec98debcb4`
