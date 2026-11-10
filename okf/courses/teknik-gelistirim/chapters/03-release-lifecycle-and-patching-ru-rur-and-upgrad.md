---
type: Chapter
title: "Release Lifecycle and Patching: RU, RUR and Upgrades"
description: In this chapter, the student learns how to manage software maintenance, patch execution, and database upgrades for Oracle Database 19c supporting enterprise applications. The curriculum details the qu
course: teknik-gelistirim
chapter: 3
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to manage software maintenance, patch execution, and database upgrades for Oracle Database 19c supporting enterprise applications. The curriculum details the quarterly Release Update (RU) and Release Update Revision (RUR) lifecycle alignment, pre-patch verification with OPatch, two-stage binary patching via opatch apply, and post-patch SQL automation using datapatch across CDB$ROOT and pluggable databases (PDBs). Additionally, students explore upgrade methodologies including AutoUpgrade, DBUA, and Parallel Upgrade Utility, alongside cloud infrastructure maintenance and zero-downtime patching tools such as OS Management Hub and Ksplice.

# Öğrenme Hedefleri

1. The student can differentiate between quarterly Release Update (RU) and Release Update Revision (RUR) patch strategies to align Oracle Database 19c maintenance with enterprise application change management policies.
2. The student can execute two-stage patch maintenance using OPatch for binary updates in $ORACLE_HOME and datapatch for post-patch SQL metadata automation across CDB$ROOT and pluggable databases (PDBs).
3. The student can plan and execute database upgrades to Oracle Database 19c using AutoUpgrade, DBUA, or Parallel Upgrade Utility while leveraging OS Management Hub and Ksplice for Linux infrastructure maintenance.

# Dersler

* Release Update (RU) & Release Update Revision (RUR) Lifecycle
* Patch Application Execution
* Oracle for SAP Cloud and Infrastructure Update
* Oracle Database Database Upgrade Guide, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

### Objective 1: Differentiating Between Release Update (RU) and Release Update Revision (RUR) Patch Strategies

* **Release Update (RU) Definition:** A Release Update is a quarterly, cumulative patch that contains security vulnerability fixes, proactive high-value bug fixes, and critical stability enhancements [1].
* **RU Version Impact:** Applying an RU moves the database to a new minor release version, such as updating from 19.3.0 to 19.4.0 or from 19.11 to 19.12 in Oracle Database 19c [1].
* **Release Update Revision (RUR) Definition:** A Release Update Revision extends the operational lifespan of an existing RU by delivering strictly critical security fixes and regression fixes for that specific RU without incorporating new functional bug fixes [1].
* **RUR Version Impact:** Applying an RUR increments the revision digit of Oracle Database 19c, such as advancing from 19.3.0 to 19.3.1 or 19.3.2, or from 19.11.0 to 19.11.1 [1].
* **Release Frequency:** RUs and RURs are both released quarterly in January, April, July, and October, with up to two revisions delivered per RU for RURs [1].
* **Non-Production Strategy:** In multitenant CDB and PDB environments supporting IFS Applications (including IFS Cloud, IFS Applications 10, and IFS Applications 9), an RU strategy is recommended for non-production environments (DEV and TEST) during major update cycles to validate performance changes and execution plans [1].
* **Production Strategy:** An RUR strategy is used for production environments where strict enterprise change management policies require security updates while locking core execution behavior between major IFS application upgrade windows [1].
* **Version Application:** The training architecture notes distinguish Oracle Database 19c version numbers in worked examples and explicitly list IFS Cloud, IFS Applications 10, and IFS Applications 9 [1].

---

### Objective 2: Executing Two-Stage Patch Maintenance Using OPatch and Datapatch

* **Maintenance Rationale:** Applying RUs and RURs ensures that Oracle Database backends supporting IFS Applications remain secure, stable, and bug-free [2].
* **OPatch Version Alignment:** Database administrators must update the opatch utility to the minimum version specified in the Oracle Patch Readme before executing patch routines [2].
* **Conflict Detection:** Running conflict checks against the target \$ORACLE_HOME prevents partial patch applications and verifies prerequisites before shutting down database services [2].
* **Stage 1 - Binary Patching (`opatch apply`):** Binary patching replaces executable binaries, libraries, and header files within \$ORACLE_HOME while database services are down [2].
* **Stage 2 - Post-Patch SQL Automation (`datapatch`):** Post-patch SQL automation updates SQL metadata, data dictionary objects, and PL/SQL packages inside CDB\$ROOT and all pluggable databases (PDBs) once the database is reopened [2].
* **Registry Verification:** DBAs verify the patch application state across the Oracle home and pluggable databases by querying the `registry$history` and `dba_registry_sqlpatch` views [1].
* **Version Application:** The source outlines this two-stage pipeline for CDB\$ROOT and PDB structures without restricting the `opatch apply` and `datapatch` command steps to a single database version [1, 2].

---

### Objective 3: Planning and Executing Upgrades to Oracle Database 19c and Managing Linux Infrastructure

* **Upgrade Scope:** The official manual **Oracle Database Database Upgrade Guide, 19c** provides procedures for upgrading Oracle Database to release 19c (19.0.0.0) [3].
* **AutoUpgrade Method:** Upgrades to Oracle Database 19c can be planned and executed using AutoUpgrade [3].
* **Parallel Upgrade Utility Method:** Upgrades to Oracle Database 19c can be performed manually using the Parallel Upgrade Utility [3].
* **DBUA Method:** Upgrades to Oracle Database 19c can be conducted using the Oracle Database Upgrade Assistant (DBUA) [3].
* **Zero-Downtime Patching with Ksplice:** On the operating system level, Oracle Linux provides Ksplice for zero-downtime kernel patching [4].
* **OS Management Hub Administration:** Oracle OS Management Hub provides a single management console in OCI to automate, streamline, and simplify update and patch management for Oracle Linux systems [5].
* **Continuous Availability:** OS Management Hub integrates with Ksplice, enabling administrators to apply select security updates on Oracle Linux without rebooting, reducing application disruptions and maintaining continuous availability [5].
* **Version Application:** The upgrade tools (AutoUpgrade, Parallel Upgrade Utility, DBUA) apply specifically to Oracle Database 19c as documented in the 19c Database Upgrade Guide [3], while the sources do not state database version limits for OS Management Hub and Ksplice on Oracle Linux [4, 5].

---

💡 Would you like to generate a step-by-step SQL script for querying `dba_registry_sqlpatch` to verify your current patch revision level across all PDBs?

# Kaynaklar

* NotebookLM kaynağı `2f16cb24-12cc-447e-b1d9-730f21ba89d3`
* NotebookLM kaynağı `f712b4df-f0dd-42b8-a4cf-2775f6992718`
* NotebookLM kaynağı `399a3765-7361-4822-bd56-c0d8f8f5a596`
* NotebookLM kaynağı `6d64ce46-7a82-4114-b656-4fa48e39707a`
