---
type: Quiz
title: "Ünite 3 quizi: Release Lifecycle and Patching: RU, RUR and Upgrades"
description: Teknik Gelişim 3. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 3
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-3.md
---

# Ünite 3: Release Lifecycle and Patching: RU, RUR and Upgrades

Toplam 12 soru.

## 1. In the Oracle Database patching lifecycle, what primary content distinguishes a Release Update Revision (RUR) from a standard Release Update (RU)?

*İpucu:* Think about which patch type is designed to extend an existing RU's lifespan with minimal functional change.

A) RURs deliver strictly critical security fixes and regression fixes for a specific RU without incorporating new functional bug fixes from subsequent RUs. *
B) RURs modify major release numbers, while RUs only increment the database patch revision digit.
C) RURs include new functional bug fixes from subsequent RUs, whereas RUs only contain security patches.
D) RURs replace binary files in $ORACLE_HOME without requiring datapatch to update SQL dictionary metadata.

**Cevap anahtarı:** A

**Gerekçe (A):** RURs are designed to extend an existing RU's lifespan by providing essential security and regression fixes while maintaining stability.

## 2. How does applying a Release Update Revision (RUR) impact the Oracle Database version string compared to applying a Release Update (RU)?

*İpucu:* Consider which digit changes when staying on a baseline RU while applying critical maintenance revisions.

A) Applying an RU increments the minor version digit (e.g., 19.11 to 19.12), whereas an RUR increments the revision digit (e.g., 19.11.0 to 19.11.1). *
B) Applying an RU increments the revision digit, while an RUR increments the minor version digit.
C) Applying an RU increments the major release version, while an RUR increments the minor release version.
D) Applying an RUR removes the version string completely from the dba_registry_sqlpatch view.

**Cevap anahtarı:** A

**Gerekçe (A):** RUs advance the database minor version, whereas RURs track maintenance iterations of a specific baseline RU.

## 3. During the two-stage Oracle Database patching process, what is the primary role of the datapatch utility?

*İpucu:* Recall which step occurs after binary patching has finished and database services are started.

A) It automates the upgrade of the OPatch binary utility to its minimum required version.
B) It updates SQL metadata, data dictionary objects, and PL/SQL packages inside CDB$ROOT and all pluggable databases after reopening the database. *
C) It performs pre-patch conflict detection against active background processes while the database is mounted.
D) It replaces executable binaries, libraries, and header files inside $ORACLE_HOME while database services are stopped.

**Cevap anahtarı:** B

**Gerekçe (B):** Datapatch automates post-patch SQL execution against data dictionary objects once the database is open.

## 4. Which prerequisite action must a database administrator perform prior to executing binary patch installation using opatch apply?

*İpucu:* Consider what must be checked regarding the patching tool itself and existing software components before stopping services.

A) Convert the Oracle ASFU database license to an FU license to grant binary modification permissions.
B) Compile all PL/SQL packages across all pluggable databases using Oracle Data Pump.
C) Execute datapatch while the database is shut down to clear existing patch registry entries.
D) Verify that OPatch meets the minimum required version in the Readme and perform conflict detection against $ORACLE_HOME. *

**Cevap anahtarı:** D

**Gerekçe (D):** Ensuring OPatch version compatibility and running conflict checks prevents partial patch applications and software issues.

## 5. Which database views allow a database administrator to inspect and confirm applied RU or RUR revision history in an Oracle Database environment?

*İpucu:* Look for dictionary views specifically dedicated to registry history and SQL patch information.

A) registry$history and dba_registry_sqlpatch *
B) v$instance and v$database
C) opatch_log_history and dba_patch_conflicts
D) dba_tablespaces and dba_data_files

**Cevap anahtarı:** A

**Gerekçe (A):** These views maintain records of applied patch histories, SQL patch execution statuses, and database registry updates.

## 6. According to the patching lifecycle guidelines for IFS/Oracle environments, what is the primary recommendation for production systems with strict change-management policies?

*İpucu:* Reflect on which strategy minimizes change scope and execution plan variance for mission-critical production systems.

A) Deploy RUs exclusively in production while applying RURs in non-production development environments.
B) Skip binary patching entirely and apply SQL updates only via datapatch.
C) Apply Release Update Revisions (RURs) to lock core execution behavior while maintaining security compliance between major upgrade windows. *
D) Apply Release Updates (RUs) quarterly to introduce new functional enhancements immediately.

**Cevap anahtarı:** C

**Gerekçe (C):** RURs deliver critical security and regression fixes without altering broad application behavior or query execution plans.

## 7. According to the table of contents of Oracle Database Database Upgrade Guide 19c, which tool is featured in Chapter 3 for database upgrades?

*İpucu:* Appendix C covers DBUA and Chapter 4 covers the Parallel Upgrade Utility, so think about what Chapter 3 specifically focuses on.

A) Oracle Data Pump
B) Parallel Upgrade Utility
C) Database Upgrade Assistant (DBUA)
D) AutoUpgrade *

**Cevap anahtarı:** D

**Gerekçe (D):** Chapter 3 is dedicated to using AutoUpgrade for Oracle Database upgrades.

## 8. In Procedure 3 of cloud database migration for SAP on Oracle, which RMAN command creates an exact copy of the source database in the cloud without requiring a backup buffer?

*İpucu:* This procedure allows building an active copy directly over the network without stage-buffering export files or backups.

A) opatch apply
B) duplicate database from active database *
C) brbackup
D) cross platform transportable tablespaces

**Cevap anahtarı:** B

**Gerekçe (B):** RMAN duplicate database from active database transfers data over the network directly from the active source to the target.

## 9. Which procedure should be used when migrating an SAP Oracle database to Oracle Cloud Infrastructure across platforms with different endian types?

*İpucu:* Focus on the RMAN feature specifically designed to handle platform architecture differences like endianness.

A) RMAN cross platform transportable tablespaces command *
B) BR*Tools brbackup with Object Storage
C) RMAN duplicate database from active database
D) OPatch binary staging procedure

**Cevap anahtarı:** A

**Gerekçe (A):** Cross platform transportable tablespaces enable data movement between platforms with differing endianness.

## 10. Which cloud database migration method for SAP on Oracle enables a transparent database upgrade as part of the data movement process?

*İpucu:* This service generates custom scripts to create a target database, allowing structural and feature adjustments during migration.

A) OPatch binary replacement method
B) Oracle Lifecycle Migration Service (O2O / OOO) *
C) Procedure 1 (RMAN via Object Storage)
D) RMAN duplicate database from active database

**Cevap anahtarı:** B

**Gerekçe (B):** O2O creates a new target database in the cloud, allowing transparent database upgrades during data transfer.

## 11. What key functional difference distinguishes an Oracle Database with an Application Specific Full Use (ASFU) license from one with a Full Use (FU) license?

*İpucu:* Consider how license scope affects access to data from non-SAP software.

A) ASFU databases cannot be deployed on Oracle Exadata hardware.
B) ASFU databases lack support for Oracle Advanced Security encryption features.
C) ASFU databases may only be used by SAP ECC/NetWeaver applications, whereas FU databases allow access by non-SAP tools and third-party applications. *
D) ASFU license fees are calculated per processor core, whereas FU licenses are based on SAP contract percentages.

**Cevap anahtarı:** C

**Gerekçe (C):** ASFU licensing restricts direct database access exclusively to the bundled SAP application suite.

## 12. What benefit is gained by incorporating Oracle GoldenGate into the Oracle Lifecycle Migration Service (changing O2O into the OOO procedure)?

*İpucu:* GoldenGate's real-time data replication allows application activity to continue while initial data movement is taking place.

A) It eliminates the requirement to execute post-patch SQL automation via datapatch.
B) It performs automatic cross-platform byte swapping without pausing database operations.
C) It automatically converts an ASFU database license into a public cloud FU subscription.
D) It captures changes made during data transfer, enabling online migration and reducing SAP downtime to a short switchover. *

**Cevap anahtarı:** D

**Gerekçe (D):** GoldenGate continuously replicates transactions so that the application remains online until the final switchover.
