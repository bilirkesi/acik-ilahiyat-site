---
type: Exam
title: Final Assessment
description: Covers the whole program.
course: teknik-gelistirim
university: teknik
academic_year: 2026-2027
semester: guz
exam_id: final
exam_window: final
exam_type: final
question_count: 25
pass_mark: 0.7
has_answer_key: true
has_solutions: false
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/exams/final.md
---

# Final Assessment

Ders: Teknik Gelişim · TEK · 2026-2027 Güz. Toplam 25 soru. Doğru cevaplar `*`; her soruda gerekçe ve çözüm vardır.

## 1. Which specific implementation class was introduced in Oracle Database 12c Release 2 (12.2.0.1) to support JDBC operations replay for XA-capable data sources?

*İpucu:* Focus on the driver sub-package class name that implements the OracleXADataSource interface.

A) oracle.jdbc.replay.driver.OracleXADataSourceImpl *
B) oracle.jdbc.replay.OracleDataSourceImpl
C) oracle.jdbc.replay.OracleConnectionPoolDataSourceImpl
D) oracle.jdbc.replay.OracleXADataSourceFactory

**Cevap anahtarı:** A

**Gerekçe (A):** This class is the actual data source implementation class introduced in Release 12.2.0.1 for XA replay, implementing the oracle.jdbc.replay.OracleXADataSource interface.

*Etiketler:* chapter-1

## 2. When using an Oracle XA data source with Application Continuity, what occurs when a physical connection participates in a global/XA transaction?

*İpucu:* Consider how the replay driver protects boundaries when non-replayable distributed transaction calls occur.

A) Replay is disabled on that connection until the next request begins. *
B) Replay is automatically re-enabled as soon as the session switches back to local transaction mode.
C) The transaction immediately throws an ORA-19809 exception and aborts.
D) The XAConnection object transparently converts the global transaction into a local transaction.

**Cevap anahtarı:** A

**Gerekçe (A):** Engaging in any global/XA transaction operation disables replay on that connection, and it remains disabled until the start of the next request.

*Etiketler:* chapter-1

## 3. To enable Transparent Application Continuity (TAC) on the database server side, which value must be assigned to the FAILOVER_TYPE service attribute?

*İpucu:* Recall the setting introduced in Oracle Database Release 18c to allow automatic implicit request boundary detection.

A) AUTO *
B) TRANSACTION
C) SELECT
D) SESSION

**Cevap anahtarı:** A

**Gerekçe (A):** Setting FAILOVER_TYPE to AUTO on the server-side database service enables Transparent Application Continuity.

*Etiketler:* chapter-2

## 4. In Oracle Database Release 19c, which System or Connection property explicitly disables implicit beginRequest injection at physical connection creation when TAC is active?

*İpucu:* Look for the property specifically naming the connection creation event and beginRequest action.

A) oracle.jdbc.beginRequestAtConnectionCreation *
B) oracle.jdbc.enableImplicitRequests
C) oracle.jdbc.disableReplayAtConnection
D) oracle.jdbc.autoCommitSpec

**Cevap anahtarı:** A

**Gerekçe (A):** Setting oracle.jdbc.beginRequestAtConnectionCreation to false turns off the implicit beginRequest executed at connection creation.

*Etiketler:* chapter-2

## 5. During an RMAN Table-Level Point-in-Time Recovery (PITR), why is it critical to avoid locating AUXILIARY DESTINATION inside DB_RECOVERY_FILE_DEST?

*İpucu:* Think about storage quota accounting inside the Fast Recovery Area.

A) Auxiliary datafiles count against the Flash Recovery Area quota and can trigger ORA-19809 when space is exhausted. *
B) RMAN cannot generate control files within a directory managed by Fast Recovery Area policies.
C) Block Change Tracking (BCT) automatically disables table recovery when AUXILIARY DESTINATION is set to the FRA.
D) The auxiliary database instance requires raw disk partitions rather than file system paths.

**Cevap anahtarı:** A

**Gerekçe (A):** Placing the auxiliary destination within DB_RECOVERY_FILE_DEST causes restored datafiles to consume FRA space, potentially hanging the job with ORA-19809.

*Etiketler:* chapter-2

## 6. When configuring an application database service for Application Continuity, what is the recommended value for REPLAY_INITIATION_TIMEOUT?

*İpucu:* Identify the time value specified in seconds that limits how long replay initiation can be attempted after an outage.

A) 900 *
B) 60
C) 30
D) 10

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle recommends setting REPLAY_INITIATION_TIMEOUT to 900 (seconds) on the service to define the max duration allowed for replay initiation.

*Etiketler:* chapter-3

## 7. What happens if an application attempts to execute beginRequest() or endRequest() while a local transaction is open on the connection?

*İpucu:* Consider how the JDBC Replay Driver handles invalid request boundary calls during uncommitted transactions.

A) An error is returned. *
B) The open transaction is implicitly committed.
C) The transaction is automatically rolled back to a savepoint.
D) Replay is silently disabled for all subsequent requests.

**Cevap anahtarı:** A

**Gerekçe (A):** Calling request boundary APIs while a local transaction is active is invalid and causes an error to be returned.

*Etiketler:* chapter-3

## 8. Under the IFS Enterprise Oracle Architecture Guidelines, how are ASM disk groups (+DATA and +RECO) configured for striping?

*İpucu:* Recall which striping pattern suits high-volume data files versus sequential redo log writes.

A) +DATA uses coarse striping, while +RECO uses fine striping. *
B) +DATA uses fine striping, while +RECO uses coarse striping.
C) Both +DATA and +RECO must be configured with fine striping.
D) Both +DATA and +RECO must be configured with coarse striping.

**Cevap anahtarı:** A

**Gerekçe (A):** Coarse striping is used for +DATA (data/index files) to optimize throughput, while fine striping is applied to +RECO for low-latency redo and recovery assets.

*Etiketler:* chapter-4

## 9. What are the target Maximum Availability Architecture (MAA) metrics specified for Gold/Platinum tiers in the IFS architecture guidelines?

*İpucu:* Look for zero data loss paired with a recovery time target under five minutes.

A) RPO = 0 and RTO < 5 mins *
B) RPO < 5 mins and RTO = 0
C) RPO = 15 mins and RTO < 1 hour
D) RPO = 0 and RTO = 0

**Cevap anahtarı:** A

**Gerekçe (A):** Gold and Platinum MAA architectures enforce zero data loss (RPO = 0) via synchronous transport and rapid failover (RTO < 5 minutes).

*Etiketler:* chapter-4

## 10. In Active Data Guard, which background process on the physical standby database applies redo directly from Standby Redo Logs (SRLs)?

*İpucu:* Focus on the background process responsible for continuous media recovery on standby databases.

A) Managed Recovery Process (MRP) *
B) Log Writer Process (LGWR)
C) Process Monitor (PMON)
D) Archiver Process (ARCn)

**Cevap anahtarı:** A

**Gerekçe (A):** MRP (Managed Recovery Process) applies incoming redo data from Standby Redo Logs onto the physical standby database.

*Etiketler:* chapter-4

## 11. What is the primary operational distinction between Oracle Release Updates (RU) and Release Update Revisions (RUR)?

*İpucu:* Think about which patch strategy extends an existing quarterly baseline without introducing functional code changes.

A) RURs focus on security and regression fixes to extend an existing RU's lifespan without adding new functional bug fixes. *
B) RUs contain only documentation updates, while RURs contain major database engine binary upgrades.
C) RURs increment the major database release version from 19c to 26ai automatically.
D) RUs are applied exclusively to non-production environments, whereas RURs are restricted to production RAC nodes.

**Cevap anahtarı:** A

**Gerekçe (A):** RURs extend the lifespan of a specific RU with targeted security/regression patches while avoiding new functional code alterations.

*Etiketler:* chapter-5

## 12. How does Oracle Database 23ai Database Native Transaction Guard enhance efficiency over earlier Transaction Guard implementations?

*İpucu:* Focus on where the transaction outcome state (LTXID) is stored during the commit process in 23ai.

A) It persists the LTXID and commit outcome inside the transaction commit record itself rather than writing to a separate table. *
B) It eliminates the need for Logical Transaction IDs (LTXIDs) during client session state checks.
C) It requires client applications to implement the oracle.jdbc.native.TG interface.
D) It bypasses redo log creation for all write operations executed under Application Continuity.

**Cevap anahtarı:** A

**Gerekçe (A):** Database Native Transaction Guard in 23ai stores LTXID state directly within the commit record, eliminating extra table I/O and redo generation.

*Etiketler:* chapter-5

## 13. Starting in Oracle Database Release 18c, which concrete class is supported with Application Continuity?

*İpucu:* Identify one of the classic oracle.sql Large Object (LOB) or type wrapper concrete classes enabled in 18c.

A) oracle.sql.BLOB *
B) oracle.sql.OPAQUE
C) oracle.jdbc.OracleBFILEImpl
D) oracle.sql.CUSTOM_TYPE

**Cevap anahtarı:** A

**Gerekçe (A):** Release 18c introduced explicit JDBC driver support for concrete classes including oracle.sql.BLOB, CLOB, STRUCT, and ARRAY under Application Continuity.

*Etiketler:* chapter-6

## 14. In a JDBC Thin driver connection URL using SCAN addresses, what value is explicitly recommended for TRANSPORT_CONNECT_TIMEOUT?

*İpucu:* Recall the millisecond parameter value recommended for transport connection setup in Oracle 12.1.0.2+ URLs.

A) 3000 *
B) 60
C) 20
D) 3

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle recommended URL configurations specify TRANSPORT_CONNECT_TIMEOUT=3000 (milliseconds) to handle connection establishment efficiently.

*Etiketler:* chapter-6

## 15. According to the operational governance rules for IFS Cloud 26R2, how long are background jobs in the Error state retained by default cleanup tasks?

*İpucu:* Distinguish between the 7-day retention for completed jobs and the longer diagnostic window for failed jobs.

A) 180 days *
B) 7 days
C) 30 days
D) 365 days

**Cevap anahtarı:** A

**Gerekçe (A):** Retaining failed jobs in Error state for 180 days ensures sufficient diagnostic history for complex problem resolution.

*Etiketler:* chapter-6

## 16. Which Oracle Resource Manager PL/SQL procedure is executed to establish resource governance plans across PDBs in a CDB?

*İpucu:* Look for the procedure name combining 'CREATE' and 'CDB_PLAN'.

A) CREATE_CDB_PLAN *
B) CREATE_PDB_POLICY
C) SET_TENANT_SHARES
D) ALTER_CONTAINER_RESOURCE

**Cevap anahtarı:** A

**Gerekçe (A):** CREATE_CDB_PLAN is used in Resource Manager to allocate CPU shares and utilization limits across pluggable databases.

*Etiketler:* chapter-7

## 17. In Oracle Database 19c Active Data Guard, which parameter controls automatic DML redirection from a read-only standby to the primary database?

*İpucu:* Look for the parameter prefix 'ADG_' combined with 'REDIRECT_DML'.

A) ADG_REDIRECT_DML *
B) ENABLE_STANDBY_WRITE
C) STANDBY_DML_FORWARD
D) LOG_ARCHIVE_DML_OPTION

**Cevap anahtarı:** A

**Gerekçe (A):** ADG_REDIRECT_DML enables automatic redirection of DML statements issued on an Active Data Guard standby to the primary database.

*Etiketler:* chapter-7

## 18. Which wait events are specifically analyzed in Chapter 4 performance diagnostics to detect single-block index lookups versus full table scan bottlenecks?

*İpucu:* Match single-block sequential access with multi-block scattered access wait event names.

A) db file sequential read and db file scattered read *
B) log file sync and log file parallel write
C) direct path read and direct path write
D) buffer busy waits and latch: cache buffers chains

**Cevap anahtarı:** A

**Gerekçe (A):** db file sequential read indicates single-block reads (index lookups), while db file scattered read indicates multi-block reads (table scans).

*Etiketler:* chapter-8

## 19. Which explicit method pair in the oracle.jdbc.OracleConnection interface marks request boundaries for Application Continuity?

*İpucu:* Identify the methods explicitly named with the word 'Request'.

A) beginRequest() and endRequest() *
B) startBoundary() and stopBoundary()
C) attachSession() and detachSession()
D) initReplay() and termReplay()

**Cevap anahtarı:** A

**Gerekçe (A):** beginRequest() and endRequest() explicitly mark request boundaries where call history can safely be purged or replayed.

*Etiketler:* chapter-8

## 20. In Chapter 6 security architecture guidelines, which three roles enforce strict separation of duties under Oracle Database Vault?

*İpucu:* Look for the security roles containing the 'DV_' prefix along with the standard system administrative privilege.

A) DV_OWNER, DV_AUDITOR, and SYSDBA *
B) DBA, RESOURCE, and CONNECT
C) IFSAPP, IFSADMIN, and SYS
D) SECURITY_ADMIN, AUDIT_ADMIN, and STORAGE_ADMIN

**Cevap anahtarı:** A

**Gerekçe (A):** Database Vault enforces separation of duties by isolating security configuration (DV_OWNER), auditing (DV_AUDITOR), and system administration (SYSDBA).

*Etiketler:* chapter-8

## 21. What happens if a connection initialization callback (ConnectionInitializationCallback) fails during reconnection at failover?

*İpucu:* Recall the safety protection mechanism applied when session initial state cannot be re-established.

A) Replay is disabled on that connection. *
B) The database instance automatically restarts.
C) The JDBC driver retries the callback up to FAILOVER_RETRIES times.
D) The transaction commits immediately to avoid state loss.

**Cevap anahtarı:** A

**Gerekçe (A):** If invocation of the registered initialization callback fails during reconnection, replay is disabled for that connection.

*Etiketler:* chapter-9

## 22. Which PL/SQL formatting function is used to compare estimated row counts (E-Rows) against actual row counts (A-Rows) in execution plans?

*İpucu:* Look for the DBMS_XPLAN package function that inspects the shared pool cursor memory.

A) DBMS_XPLAN.DISPLAY_CURSOR *
B) DBMS_AUTOTUNE.REPORT_PLAN
C) DBMS_MONITOR.DISPLAY_STATS
D) EXPLAIN_PLAN_ALL

**Cevap anahtarı:** A

**Gerekçe (A):** DBMS_XPLAN.DISPLAY_CURSOR allows DBAs to inspect runtime execution plan stats, including E-Rows and A-Rows deviations.

*Etiketler:* chapter-9

## 23. In OEM 13c/14c monitoring for Oracle Data Guard, what lag threshold is configured to generate critical incident alerts?

*İpucu:* Select the threshold defined in seconds that matches 15 minutes of redo lag.

A) Data Guard lag > 900 seconds *
B) Data Guard lag > 60 seconds
C) Data Guard lag > 5 minutes
D) Data Guard lag > 3600 seconds

**Cevap anahtarı:** A

**Gerekçe (A):** Enterprise Observability monitoring guidelines specify generating critical alerts when Data Guard lag exceeds 900 seconds.

*Etiketler:* chapter-10

## 24. Which API protocol is configured to connect enterprise ITIL automation tools (e.g., ManageEngine ServiceDesk Plus) with database alerting pipelines?

*İpucu:* Focus on the versioned REST protocol specified for ServiceDesk Plus ticket automation.

A) REST API v3 *
B) SOAP API v1
C) SNMP v2c Trap
D) GraphQL v2

**Cevap anahtarı:** A

**Gerekçe (A):** The training architecture specifies connecting Prometheus/Grafana alerts to ITIL ticketing systems using REST API v3 webhooks.

*Etiketler:* chapter-10

## 25. Why does Oracle strongly advise against using the default database service (DB_NAME or DB_UNIQUE_NAME) for application workloads?

*İpucu:* Think about why high availability features like RAC relocation and Data Guard switchover require custom application services.

A) It cannot be enabled/disabled, relocated on Oracle RAC, or switched over to Data Guard. *
B) It restricts database connections to single-threaded execution modes.
C) It disables Automatic Shared Memory Management (ASMM) across all instances.
D) It prevents RMAN from taking incremental block change tracking backups.

**Cevap anahtarı:** A

**Gerekçe (A):** The default database service is reserved for administrative tools because it lacks HA capabilities like relocation and failover management.

*Etiketler:* chapter-10
