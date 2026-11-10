---
type: Quiz
title: "Ünite 10 quizi: Backup, Recovery and Operational Practice"
description: Teknik Gelişim 10. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 10
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-10.md
---

# Ünite 10: Backup, Recovery and Operational Practice

Toplam 12 soru.

## 1. Starting in Oracle Database 19c, which feature and its associated RMAN commands have been deprecated with no direct replacement?

*İpucu:* Consider RMAN diagnostic and automated repair commands deprecated in 19c.

A) Storage Snapshot Optimization, including commands like ALTER DATABASE BEGIN BACKUP
B) Data Recovery Advisor (DRA), including commands like LIST FAILURE, ADVISE FAILURE, REPAIR FAILURE, and CHANGE FAILURE *
C) Block Change Tracking (BCT), including commands like ALTER DATABASE ENABLE BLOCK CHANGE TRACKING
D) Incrementally Updated Backups, including commands like BACKUP FOR RECOVER OF COPY

**Cevap anahtarı:** B

**Gerekçe (B):** Oracle Database 19c deprecated the Data Recovery Advisor and its associated RMAN failure commands without providing a replacement feature.

## 2. In Oracle Database 19c, what is the Oracle-recommended alternative to the deprecated `RECOVER...SNAPSHOT TIME` command when performing storage snapshot recovery?

*İpucu:* Look for the procedure that puts the database into backup mode during snapshot creation.

A) Use `FLASHBACK DATABASE TO SNAPSHOT TIME` directly
B) Use `RESTORE CONTROLFILE FROM SNAPSHOT TIME` with `RECOVER DATABASE`
C) Use `ALTER DATABASE BEGIN/END BACKUP` around snapshot creation followed by `RECOVER...UNTIL TIME` *
D) Use `BACKUP AS COPY` combined with `RECOVER COPY OF DATABASE`

**Cevap anahtarı:** C

**Gerekçe (C):** Oracle recommends putting data files into online backup mode before taking storage snapshots and using point-in-time recovery to an SCN after `END BACKUP` completion.

## 3. According to the Oracle Database 19c RMAN documentation, what is the maximum length allowed for an RMAN command on a single line?

*İpucu:* Think about standard single-line character buffer limits in RMAN syntax.

A) 8192 characters
B) 4000 characters *
C) 1024 characters
D) 2048 characters

**Cevap anahtarı:** B

**Gerekçe (B):** RMAN limits single-line command text to 4000 characters, requiring longer commands to be split or span multiple lines.

## 4. When manually allocating channels within an RMAN `RUN` block, what is the maximum number of channels that can be allocated?

*İpucu:* Recall the upper bound on manual channel connections in a single RMAN job.

A) 128 channels
B) 64 channels
C) 1024 channels
D) 255 channels *

**Cevap anahtarı:** D

**Gerekçe (D):** RMAN permits up to 255 channels to be allocated simultaneously within a single job.

## 5. According to the incident preparation notes for IFS Cloud, which database view holds background deferred job history?

*İpucu:* Focus on the specific view used in IFS Cloud for tracking background job history.

A) DEFERRED_JOB *
B) V$DIAG_ALERT_EXT
C) IFS_BACKGROUND_JOB
D) DBA_SCHEDULER_JOB_RUN_DETAILS

**Cevap anahtarı:** A

**Gerekçe (A):** IFS Cloud stores background job execution records and history in the DEFERRED_JOB view.

## 6. Based on the Oracle Database 19c Backup and Recovery Reference, when was the desupport of Oracle Secure Backup (OSB) 19.1 announced?

*İpucu:* Identify the date specified in the RMAN reference notes regarding OSB 19.1 lifecycle changes.

A) October 2026
B) May 1, 2026 *
C) September 30, 2027
D) November 6, 2026

**Cevap anahtarı:** B

**Gerekçe (B):** Documentation explicitly notes that OSB 19.1 desupport was announced on May 1, 2026.

## 7. Which option in the RMAN `BACKUP` command tests data and index blocks that pass physical corruption checks for logical corruption?

*İpucu:* Think of the parameter that expands corruption checks beyond physical block validation.

A) CHECK LOGICAL *
B) VALIDATE
C) CONSISTENT
D) NOCHECKSUM

**Cevap anahtarı:** A

**Gerekçe (A):** Specifying CHECK LOGICAL tests both physical and logical block consistency, recording any detected logical errors to the alert log and trace files.

## 8. How does the `@@` (double at sign) command differ from the `@` (at sign) command when executed from inside an RMAN command file?

*İpucu:* Consider how relative path resolution works for nested command files.

A) It forces RMAN to search strictly in the default Oracle Home directory (`?/dbs`)
B) It executes the specified command file in parallel across all allocated channels
C) It bypasses RMAN syntax validation and sends raw SQL to the database instance
D) It directs RMAN to look for the specified script in the same directory as the calling command file *

**Cevap anahtarı:** D

**Gerekçe (D):** The @@ command resolves relative file paths relative to the directory containing the current script file.

## 9. How many of the most recent backups does the Block Change Tracking (BCT) file retain block change data for before overwriting the oldest bitmap?

*İpucu:* Identify the maximum number of historical backup bitmaps managed inside the change tracking file.

A) 16 most recent backups
B) 8 most recent backups *
C) 4 most recent backups
D) 32 most recent backups

**Cevap anahtarı:** B

**Gerekçe (B):** Oracle Database automatically manages space in the change tracking file to store bitmaps covering up to the 8 most recent backups.

## 10. Which RMAN `REPORT` command identifies data files that lack sufficient backups to satisfy a specific time-based retention requirement?

*İpucu:* Look for the clause under `REPORT NEED BACKUP` that checks against a target timeframe.

A) `REPORT NEED BACKUP RECOVERY WINDOW OF n DAYS` *
B) `REPORT OBSOLETE RECOVERY WINDOW OF n DAYS`
C) `REPORT SCHEMA UNRECOVERABLE n DAYS`
D) `REPORT NEED BACKUP REDUNDANCY n DAYS`

**Cevap anahtarı:** A

**Gerekçe (A):** This command reports data files that do not have sufficient backups to perform point-in-time recovery across the specified number of days.

## 11. According to the incident review preparation document, which diagnostic view can be queried directly by a DBA to check for ORA- errors and deadlocks without requiring Diagnostic or Tuning Pack licenses?

*İpucu:* Think of the diagnostic view exposed directly from the Automatic Diagnostic Repository.

A) V$DIAG_ALERT_EXT *
B) V$RMAN_OUTPUT
C) DBA_HIST_ACTIVE_SESS_HISTORY
D) V$SESSION_LONGOPS

**Cevap anahtarı:** A

**Gerekçe (A):** V$DIAG_ALERT_EXT exposes alert log messages directly from the diagnostic repository without requiring optional pack licenses.

## 12. Which subclause of the `BACKUP` command creates a cross-platform consistent backup of a PDB while storing the plug-in metadata into a specified XML file?

*İpucu:* Look for the command option that unplugs the PDB into a target metadata file during cross-platform backup.

A) `FOR TRANSPORT UNPLUG INTO 'filename'` *
B) `TO PLATFORM EXPORT XML 'filename'`
C) `ALLOW INCONSISTENT UNPLUG 'filename'`
D) `DATAPUMP UNPLUG METADATA 'filename'`

**Cevap anahtarı:** A

**Gerekçe (A):** This subclause creates a consistent cross-platform backup set of a closed PDB and saves its plug-in metadata to an XML file.
