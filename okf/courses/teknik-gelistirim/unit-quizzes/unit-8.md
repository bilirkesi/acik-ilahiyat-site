---
type: Quiz
title: "Ünite 8 quizi: Performance Management and Tuning"
description: Teknik Gelişim 8. ünite için 10 soruluk quiz.
course: teknik-gelistirim
unit: 8
question_count: 10
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-8.md
---

# Ünite 8: Performance Management and Tuning

Toplam 10 soru.

## 1. Which metric does the Automatic Database Diagnostic Monitor (ADDM) center its performance analysis around to evaluate the impact of system bottlenecks?

*İpucu:* Consider the key metric that combines CPU time and non-idle wait time across active session calls.

A) Hard Parses per Second
B) Redo Size per Second
C) DB Time *
D) Elapsed Time

**Cevap anahtarı:** C

**Gerekçe (C):** ADDM quantifies performance issues based on the percentage of total non-idle session call time accumulated by the database.

## 2. Which Oracle background process is responsible for periodically flushing Active Session History (ASH) in-memory data into AWR repository tables on disk?

*İpucu:* Identify the background process dedicated to managing background performance diagnostics and repository statistics.

A) RVWR (Recovery Writer)
B) DBWR (Database Writer)
C) MMON (Memory Monitor) *
D) LGWR (Log Writer)

**Cevap anahtarı:** C

**Gerekçe (C):** The Memory Monitor process automatically transfers sampled active session data from SGA ring buffers to disk tables during snapshot operations.

## 3. Which SQL*Plus diagnostic script generates an AWR Compare Period report for single-instance Oracle environments to evaluate performance changes across patch updates?

*İpucu:* Look for the standard reporting script name containing 'dd' to signify double-differential analysis for single instances.

A) addmrpt.sql
B) awrrpt.sql
C) awrddrpt.sql *
D) awrddrpi.sql

**Cevap anahtarı:** C

**Gerekçe (C):** This script prompts for two distinct snapshot pairs to generate a side-by-side performance delta report in single-instance databases.

## 4. What sampling interval does Active Session History (ASH) use to record active database session details inside the SGA ring buffer?

*İpucu:* Think about the sub-minute rate needed to catch brief I/O or locking bottlenecks.

A) Every 1 second *
B) Every 60 minutes
C) Every 5 seconds
D) Every 10 seconds

**Cevap anahtarı:** A

**Gerekçe (A):** ASH samples active sessions every second in memory, making it effective for catching transient performance spikes.

## 5. When diagnosing user I/O issues, which wait event typically signifies single-block data reads associated with index lookups or nested loop join operations?

*İpucu:* Recall the wait event name used when blocks are read one by one sequentially into memory.

A) db file sequential read *
B) db file scattered read
C) direct path read
D) buffer busy waits

**Cevap anahtarı:** A

**Gerekçe (A):** Single-block access paths reading contiguous index or table blocks generate this specific wait event.

## 6. Which database wait event is raised when multiple sessions attempt to update or delete the same rows concurrently without committing?

*İpucu:* Focus on the transaction enqueue event associated with row-level locking.

A) enq: ST - contention
B) latch: cache buffers chains
C) enq: TX - row lock contention *
D) library cache pin

**Cevap anahtarı:** C

**Gerekçe (C):** Transaction enqueues in row lock mode occur when a session waits for another uncommitted transaction to release its row lock.

## 7. Exceeding which initialization parameter limit results in an ORA-00020 error in Oracle Database?

*İpucu:* Select the static parameter that governs instance-wide operating system connection slots.

A) open_cursors
B) pga_aggregate_target
C) processes *
D) sga_target

**Cevap anahtarı:** C

**Gerekçe (C):** The static processes parameter caps total OS user processes connecting to the database; reaching this limit triggers ORA-00020.

## 8. Which dynamic function call in the DBMS_XPLAN package allows a DBA to inspect runtime execution plan metrics, comparing Estimated Rows (E-Rows) against Actual Rows (A-Rows)?

*İpucu:* Identify the function used to fetch cursor plans directly out of the shared SQL area.

A) DBMS_STATS.GATHER_TABLE_STATS
B) DBMS_XPLAN.DISPLAY_SQLSET
C) DBMS_XPLAN.DISPLAY_CURSOR *
D) DBMS_XPLAN.DISPLAY_AWR

**Cevap anahtarı:** C

**Gerekçe (C):** Using DISPLAY_CURSOR with the 'ALLSTATS LAST' format retrieves actual runtime row counts and execution statistics directly from memory.

## 9. Which initialization parameter sets an instance-wide limit for non-shared memory allocated to session work areas such as sort operations and hash joins?

*İpucu:* Look for the aggregate target parameter that controls Program Global Area allocations.

A) db_cache_size
B) sga_target
C) pga_aggregate_target *
D) open_cursors

**Cevap anahtarı:** C

**Gerekçe (C):** This parameter establishes an instance-wide target for total private process memory allocated across active database sessions.

## 10. As a general rule of thumb, how much free disk space should be provisioned at the auxiliary destination during an RMAN Table Point-in-Time Recovery (PITR)?

*İpucu:* Consider all the system and undo data files required to create an auxiliary database instance alongside the target table's tablespace.

A) Space equal to the SGA and PGA memory parameters combined
B) Space for SYSTEM + SYSAUX + active UNDO + the target tablespace (approx. 2x the target tablespace) *
C) Space strictly equal to the size of the dropped table's export dump
D) Space equal to 10% of the entire database backup size

**Cevap anahtarı:** B

**Gerekçe (B):** RMAN table PITR provisions an auxiliary instance requiring core system tablespaces alongside the tablespace housing the recovered table.
