---
type: Quiz
title: "Ünite 2 quizi: Multitenant Database Administration: CDB and PDB"
description: Teknik Gelişim 2. ünite için 10 soruluk quiz.
course: teknik-gelistirim
unit: 2
question_count: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-2.md
---

# Ünite 2: Multitenant Database Administration: CDB and PDB

Toplam 10 soru.

## 1. What is the primary structural role of the root container database (CDB$ROOT) in an Oracle Multitenant architecture?

*İpucu:* Consider where global database initialization parameters and common user accounts reside versus application-specific data.

A) It enforces connection pool parameters exclusively for mid-tier application sessions.
B) It functions as a system-supplied template used to provision new pluggable databases.
C) It stores dedicated application schemas and tablespaces for individual IFS tenant environments.
D) It stores Oracle system metadata, common user accounts, and global initialization parameters. *

**Cevap anahtarı:** D

**Gerekçe (D):** The root container centrally manages Oracle system metadata, common users, and global memory/background processes for the entire CDB.

## 2. In an Oracle Multitenant environment supporting IFS Applications, what is the specific role of PDB$SEED?

*İpucu:* Think about how new PDBs are rapidly provisioned when adding environments to a multitenant structure.

A) It serves as a system-supplied template PDB used to rapidly provision new pluggable databases. *
B) It stores mid-tier connection configurations to prevent session leakage between environments.
C) It manages global background processes and shared SGA allocations across host memory.
D) It contains active production ERP transaction data and user schemas.

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle Multitenant includes PDB$SEED specifically as a template for rapidly creating additional PDB instances.

## 3. Which sys_context call retrieves the name of the current container for an active database session?

*İpucu:* Focus on the USERENV namespace attributes used to identify container names.

A) sys_context('DATABASE', 'PDB_NAME')
B) sys_context('USERENV', 'DB_NAME')
C) sys_context('USERENV', 'CON_NAME') *
D) sys_context('SESSION', 'CONTAINER_ID')

**Cevap anahtarı:** C

**Gerekçe (C):** The USERENV namespace parameter CON_NAME returns the exact name of the container context associated with the active session.

## 4. Which pair of memory parameters can be configured per PDB to prevent runaway queries from exhausting host memory?

*İpucu:* Think about SGA and PGA allocation settings used to restrict memory per container.

A) common_user_prefix and global_names
B) sga_target and pga_aggregate_limit *
C) open_mode and container_id
D) db_create_file_dest and log_archive_dest

**Cevap anahtarı:** B

**Gerekçe (B):** Setting sga_target and pga_aggregate_limit on a PDB establishes explicit memory boundaries to protect host resources from non-production workloads.

## 5. Which dynamic performance view is queried to inspect container IDs, names, and open modes for pluggable databases?

*İpucu:* Recall the dynamic performance view specifically named after pluggable databases.

A) v$instance
B) v$containers
C) v$pdbs *
D) v$session

**Cevap anahtarı:** C

**Gerekçe (C):** The v$pdbs view provides container IDs, PDB names, and their operational open modes.

## 6. Which SQL command successfully switches an administrative session's context from CDB$ROOT to a pluggable database named ifsprod?

*İpucu:* Look for the ALTER statement used to adjust session-level environment settings.

A) CONNECT / AS SYSDBA CONTAINER = ifsprod;
B) ALTER SYSTEM SET CONTAINER = ifsprod;
C) ALTER PLUGGABLE DATABASE ifsprod OPEN;
D) ALTER SESSION SET CONTAINER = ifsprod; *

**Cevap anahtarı:** D

**Gerekçe (D):** Executing ALTER SESSION SET CONTAINER switches the current session context to the targeted PDB.

## 7. In an Oracle Multitenant database, where are user-created tables, indexes, and application-specific metadata stored?

*İpucu:* Recall where independent schema objects and user tables reside versus common system metadata.

A) In the private data dictionary of each dedicated User PDB. *
B) In the central CDB$ROOT system catalog.
C) In global SGA shared memory structures accessible by all containers.
D) In the PDB$SEED template dictionary.

**Cevap anahtarı:** A

**Gerekçe (A):** Each User PDB maintains its own private data dictionary to isolate application schemas, tables, and indexes from other tenants.

## 8. How can database administrators control CPU shares, parallel execution queues, and session limits for specific PDBs?

*İpucu:* Consider the profiles used to restrict CPU, parallel queues, and session limits per container.

A) By assigning PDB Resource Manager Profiles. *
B) By consolidating all transactional schemas into CDB$ROOT.
C) By setting open_mode to read-only across all non-production instances.
D) By creating unique PDB$SEED templates for every environment.

**Cevap anahtarı:** A

**Gerekçe (A):** PDB Resource Manager Profiles allow administrators to enforce specific allocations of CPU, parallel execution queues, and session thresholds per container.

## 9. What lifecycle advantage does pluggable database isolation offer when performing maintenance on individual IFS environments?

*İpucu:* Think about how tenant isolation affects maintenance tasks on sibling containers.

A) Updating one PDB automatically updates the database kernel across all host servers.
B) PDB isolation requires all non-production environments to be shut down whenever Release Updates are applied to CDB$ROOT.
C) DBAs can unplug, clone, or drop an individual PDB without interrupting operations on sibling PDBs. *
D) Dropping a PDB deletes common user accounts centrally maintained in CDB$ROOT.

**Cevap anahtarı:** C

**Gerekçe (C):** Logical and operational isolation allows independent maintenance tasks on one PDB without impacting sibling PDBs on the same container database.

## 10. Why is resource management critical across PDBs in a shared physical hardware environment supporting IFS Applications?

*İpucu:* Focus on the primary operational goal of separating non-production workloads from production OLTP environments.

A) To force all test scripts to execute directly inside CDB$ROOT.
B) To automate the synchronization of Release Updates between DEV and PROD data dictionaries.
C) To prevent non-production workloads from degrading critical OLTP Production performance. *
D) To ensure that all PDBs consume identical memory limits regardless of workload size.

**Cevap anahtarı:** C

**Gerekçe (C):** Resource management caps memory, CPU, and process usage on non-production containers to safeguard production ERP transactions from resource starvation.
