---
type: Chapter
title: "Multitenant Database Administration: CDB and PDB"
description: In this chapter, the student learns how to administer Oracle Database 19c Multitenant Container Databases (CDB) and manage Pluggable Database (PDB) structural architecture, including CDB$ROOT, PDB$SEE
course: teknik-gelistirim
chapter: 2
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to administer Oracle Database 19c Multitenant Container Databases (CDB) and manage Pluggable Database (PDB) structural architecture, including CDB$ROOT, PDB$SEED, and user PDBs [1]. The student explores operational environment isolation and resource management techniques across IFS Applications instances to prevent data contamination and resource starvation [1, 2]. Additionally, the curriculum covers configuring PDB memory thresholds such as sga_target and pga_aggregate_limit, setting PDB Resource Manager profiles, and executing independent PDB lifecycle operations like cloning and unplugging without disrupting sibling databases [1, 2].

# Öğrenme Hedefleri

1. The student can administer Oracle Database 19c Multitenant architecture by managing CDB$ROOT, PDB$SEED, and user PDB structures to maintain schema and metadata isolation across IFS Applications environments [1, 2].
2. The student can configure PDB Resource Manager profiles and memory limits such as sga_target and pga_aggregate_limit in Oracle Database 19c to allocate CPU shares and prevent resource starvation [2].
3. The student can execute independent Pluggable Database lifecycle operations, including switching container contexts, provisioning from PDB$SEED, and cloning or unplugging PDBs without impacting sibling databases [1, 2].

# Dersler

* Container Database (CDB) Administration
* Pluggable Database (PDB) Isolation & Operations
* Oracle Database Database Administrator's Guide, 19c
* Oracle Database Database Concepts, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Here is what the student learns for each objective, based strictly on the provided sources.

---

### Objective 1: Administering Oracle Database 19c Multitenant Architecture and Managing CDB\\(ROOT, PDB\\)SEED, and User PDB Structures

* **Container Architecture Fundamentals:** The student learns that Oracle Multitenant architecture divides database infrastructure into a single root container database (CDB\$ROOT) and one or more Pluggable Databases (PDBs) [1, 2].
* **Root Container Management:** CDB\$ROOT manages common background processes, shared system metadata, global database memory, common user accounts, and global initialization parameters [1, 2].
* **Pluggable Database Types:** PDB\$SEED functions as a system-supplied template PDB used to rapidly provision new pluggable databases for additional IFS environments [1]. User PDBs are dedicated pluggable databases that hold user data schemas, tablespaces, and application-specific metadata required by IFS Applications [1].
* **Metadata and Schema Isolation:** Each PDB maintains its own private data dictionary for user-created tables, indexes, and application schemas while CDB\$ROOT handles shared system metadata [2]. Mid-tier connection pools interact exclusively with their assigned PDB service, ensuring sessions in non-production instances cannot access or modify Production schema objects [2].
* **IFS Application Stage Isolation:** In IFS Applications (specifically IFS Cloud and IFS Applications 10/9), tenant and environment isolation isolates ERP transaction data and schema objects across distinct operational stages (such as DEV, TEST, and PROD) while sharing physical hardware resources [1, 2].
* **Official Oracle 19c Manuals:** The official manuals **Oracle Database Database Administrator's Guide, 19c** and **Oracle Database Database Concepts, 19c** provide the core administrative framework and concepts for managing multitenant database structures [3-6].

---

### Objective 2: Configuring PDB Resource Manager Profiles and Memory Limits (sga_target, pga_aggregate_limit)

* **Resource Isolation Rationale:** In high-demand environments running IFS Cloud or IFS Applications 10/9, PDB-level resource controls must be configured to prevent heavy testing workloads or runaway queries from starving critical OLTP production workloads [1, 2].
* **PDB Resource Manager Profiles:** The student learns to configure PDB Resource Manager profiles to allocate specific shares of CPU, parallel execution queues, and session limits per PDB [2].
* **Memory Limit Parameters:** Memory boundaries can be configured per PDB using parameters such as `sga_min_size`, `sga_target`, and `pga_aggregate_limit` [2]. Setting limits like `pga_aggregate_limit` (for example, 4G) and `sga_target` (for example, 8G) on a non-production PDB shields host memory from being exhausted by individual containers [2].
* **Official Governance Framework:** Database Resource Management and Task Scheduling concepts are governed by Part IV of the **Oracle Database Database Administrator's Guide, 19c** [4].

---

### Objective 3: Executing Independent Pluggable Database Lifecycle Operations and Container Management

* **Independent Lifecycle Operations:** The student learns that DBAs can unplug, clone, or drop an individual PDB without interrupting active operations on sibling PDBs running on the same container instance [2].
* **PDB Provisioning:** Rapid provisioning of new pluggable databases across IFS application stages is executed using the template PDB\$SEED [1].
* **Container Context Switching:** DBAs switch session container contexts between CDB\$ROOT and target PDBs using SQL commands such as `ALTER SESSION SET CONTAINER = <container_name>;` [1, 2].
* **PDB State and Context Verification:** DBAs alter PDB states using commands like `ALTER PLUGGABLE DATABASE <pdb_name> OPEN;` and verify session container contexts via `sys_context('USERENV', 'CON_NAME')`, `sys_context('USERENV', 'CON_ID')`, `v$pdbs`, and `v$session` [1, 2].
* **Official Oracle 19c Lifecycle Standard:** Official multitenant lifecycle management procedures are defined in the **Oracle Database Database Administrator's Guide, 19c** [3, 4].

---

🛠️ **Suggested Next Step:** Would you like to generate a step-by-step SQL runbook for setting up PDB Resource Manager profiles and memory limits, or create flashcards to test your knowledge on CDB/PDB administration?

# Kaynaklar

* NotebookLM kaynağı `14af7919-6307-4898-8b35-3cdf88367336`
* NotebookLM kaynağı `dbe6ef64-6bf2-4686-a45f-7046ef47a754`
* NotebookLM kaynağı `aaaf38c9-d233-4e21-871e-e5375b696663`
* NotebookLM kaynağı `eebd95b3-55c6-4178-a201-1ffd89aa06d8`
