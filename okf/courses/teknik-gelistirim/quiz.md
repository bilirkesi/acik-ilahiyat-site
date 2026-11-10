---
type: Quiz
title: Oracle Quiz
description: Teknik Gelişim dersi için 12 soruluk test.
course: teknik-gelistirim
question_count: 12
pass_mark: 0.7
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/quiz.md
---

# Oracle Quiz

Toplam 12 soru. Doğru cevaplar `*` ile işaretli seçeneklerdir; gerekçe ve çözüm seçenek altındadır.

## 1. In Oracle Database 19c, which server-side service attribute must be set to enable Transparent Application Continuity (TAC) on a database service?

*İpucu:* Consider the parameter value that instructs the driver to automatically track state without requiring application code changes.

A) FAILOVER_TYPE = AUTO *
B) FAILOVER_TYPE = TRANSACTION
C) FAILOVER_RESTORE = LEVEL1
D) COMMIT_OUTCOME = TRUE

**Cevap anahtarı:** A

**Gerekçe (A):** Setting FAILOVER_TYPE to AUTO enables the database server and driver infrastructure to transparently track session state and inject implicit request boundaries.

## 2. How does the Oracle JDBC Thin driver handle Application Continuity replay when a connection obtained from an XA-capable data source participates in a global/XA transaction?

*İpucu:* Recall how multi-resource global transaction state affects safety guarantees during failover replay.

A) Replay is disabled on that connection until the next request begins. *
B) The global transaction is transparently converted to a local transaction during failover.
C) Application Continuity replays the transaction standardly across all involved XA resources.
D) An exception is thrown immediately when calling getXAResource() on the connection.

**Cevap anahtarı:** A

**Gerekçe (A):** Engaging in any global or XA transaction operation disables replay protection on that connection for safety until the connection starts its next request boundary.

## 3. In IFS Cloud 26R2, which Server Alert Log Category ID creates a system-level AFTER ERROR database trigger upon activation to log database failures?

*İpucu:* Look for the category designed specifically to capture transient database ORA-errors raised across application sessions.

A) Server Errors *
B) Ddl Audit
C) Event errors
D) Debug

**Cevap anahtarı:** A

**Gerekçe (A):** Activating the Server Errors category automatically creates an AFTER ERROR trigger in the database to intercept and log all runtime ORA-errors.

## 4. According to Oracle Maximum Availability Architecture (MAA) reference standards, which tier combines High Availability Clustering, Disaster Recovery, and Backup for mission-critical applications?

*İpucu:* Think of the standard MAA progression step between local HA clustering and extreme zero-downtime solutions.

A) Gold Tier *
B) Silver Tier
C) Bronze Tier
D) Platinum Tier

**Cevap anahtarı:** A

**Gerekçe (A):** The Gold MAA tier incorporates high availability clustering with database replication for disaster recovery to protect mission-critical business systems.

## 5. What is the primary operational distinction between an Oracle Release Update (RU) and a Release Update Revision (RUR)?

*İpucu:* Identify which patch maintenance strategy targets stability-focused systems by limiting functional scope changes.

A) RUs contain quarterly cumulative functional and security fixes that increment the minor release, whereas RURs extend an existing RU with security and regression fixes only. *
B) RUs are delivered monthly for production environments, while RURs are released quarterly for non-production environments.
C) RUs increment the revision digit (e.g., 19.11.0 to 19.11.1), while RURs increment the minor release version (e.g., 19.3.0 to 19.4.0).
D) RURs introduce brand-new application features, whereas RUs strictly contain security patches.

**Cevap anahtarı:** A

**Gerekçe (A):** RUs deliver broad proactive bug fixes and minor release increases, while RURs lock core execution behavior while providing strictly critical security and regression updates.

## 6. Which Oracle database background process is responsible for flushing in-memory statistics from the SGA into Automatic Workload Repository (AWR) tables in SYSAUX?

*İpucu:* Identify the background process focused on memory statistics collection and repository maintenance.

A) MMON *
B) ONS
C) PMON
D) CKPT

**Cevap anahtarı:** A

**Gerekçe (A):** The Memory Monitor (MMON) background process handles the periodic flushing of active session history and SGA performance statistics to the AWR repository.

## 7. When configuring a database service for Application Continuity, what value is assigned to FAILOVER_RESTORE when FAILOVER_TYPE is set to AUTO?

*İpucu:* The value of this restore attribute automatically inherits the setting mode specified for the failover type.

A) AUTO *
B) LEVEL1
C) NONE
D) MANUAL

**Cevap anahtarı:** A

**Gerekçe (A):** Setting FAILOVER_TYPE to AUTO automatically sets FAILOVER_RESTORE to AUTO, enforcing session initial state restoration.

## 8. To retain mutable function results (such as SYSDATE or SYS_GUID) during Application Continuity replay, what SQL privilege must a DBA grant to the application database user?

*İpucu:* Think of the grant syntax keyword specifically intended to preserve or keep function return values consistent.

A) KEEP privilege (e.g., KEEP DATE TIME, KEEP SYSGUID) *
B) EXECUTE privilege on DBMS_REPLAY
C) ALTER SESSION system privilege
D) FLASHBACK ANY TABLE privilege

**Cevap anahtarı:** A

**Gerekçe (A):** DBAs grant KEEP privileges to ensure Application Continuity can save and restore mutable function results for code executed by custom or app users.

## 9. To enforce a strict Recovery Point Objective of zero ($RPO = 0$) in an Oracle Data Guard architecture, which redo transport mode must be enabled on the primary database?

*İpucu:* Consider how transaction commits must wait for network acknowledgment from standby redo logs.

A) Synchronous (SYNC) transport mode *
B) Asynchronous (ASYNC) transport mode
C) Maximum Performance mode
D) Fast-Start Failover delay mode

**Cevap anahtarı:** A

**Gerekçe (A):** Synchronous transport ensures transaction commits on the primary are held until the redo data is written to standby redo logs on the remote site, preventing data loss.

## 10. Which explicit APIs are provided by the oracle.jdbc.OracleConnection interface to allow Java applications to declare request boundaries for memory purging and replay safety?

*İpucu:* Look for methods named directly after opening and closing a request boundary.

A) beginRequest() and endRequest() *
B) startTransaction() and commitTransaction()
C) enableReplay() and disableReplay()
D) checkOutConnection() and checkInConnection()

**Cevap anahtarı:** A

**Gerekçe (A):** The beginRequest and endRequest methods explicitly mark units of work, enabling the JDBC Replay Driver to purge call history and manage memory efficiently.

## 11. Starting with Oracle Database Release 12.1.0.2, which set of parameters is explicitly recommended in the JDBC thin driver connection URL to improve connection acquisition during failover and planned outages?

*İpucu:* Focus on parameters controlling client-side socket connection timeouts and retry attempts.

A) RETRY_COUNT, RETRY_DELAY, CONNECT_TIMEOUT, and TRANSPORT_CONNECT_TIMEOUT *
B) AUTOCOMMIT, STATEMENT_CACHE_SIZE, MAX_POOL_SIZE, and INACTIVE_TIMEOUT
C) INSTANCE_NAME, SID, SERVER_TYPE, and SERVICE_NAME
D) FAILOVER_MODE, TYPE=SELECT, METHOD=BASIC, and RETRIES=10

**Cevap anahtarı:** A

**Gerekçe (A):** These parameters optimize network connection acquisition timing across SCAN listeners and database host VIPs during runtime and failover events.

## 12. According to the IFS Cloud 25R1 technical documentation for Oracle 19c Enterprise Edition options, what is the official support status of Oracle Database Vault?

*İpucu:* Check the verification table status for Database Vault in contrast to Active Data Guard or Advanced Security.

A) Not tested/verified for IFS Cloud *
B) Fully supported and verified on IFS Applications 10 and IFS Cloud
C) Supported only with Standard Edition 2
D) Mandatory for all production installations

**Cevap anahtarı:** A

**Gerekçe (A):** The official IFS Cloud 25R1 matrix specifically marks Oracle Database Vault as 'Not tested/verified for IFS Cloud' (N).
