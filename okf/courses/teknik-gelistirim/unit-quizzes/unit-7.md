---
type: Quiz
title: "Ünite 7 quizi: Application Continuity and Resilience"
description: Teknik Gelişim 7. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 7
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-7.md
---

# Ünite 7: Application Continuity and Resilience

Toplam 12 soru.

## 1. Which JDBC data source implementation class was introduced in Oracle Database 12c Release 2 (12.2.0.1) to support JDBC operation replay for XA-capable data sources paired with Universal Connection Pool (UCP) or WebLogic Active GridLink?

*İpucu:* Focus on the implementation class under the driver sub-package specifically designated for XA data sources.

A) oracle.jdbc.replay.OracleConnectionPoolDataSourceImpl
B) oracle.jdbc.replay.OracleDataSourceImpl
C) oracle.jdbc.replay.OracleXADataSourceFactory
D) oracle.jdbc.replay.driver.OracleXADataSourceImpl *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle Database 12c Release 2 introduced this specific class implementation for the XA Replay Data Source to support replay for applications using XA-capable data sources.

## 2. How does Transparent Application Continuity (TAC) primarily differ from standard Application Continuity (AC) regarding request boundary detection and application code modifications?

*İpucu:* Consider how TAC achieves complete application transparency without requiring developer code changes.

A) Standard AC automatically tracks session state without Transaction Guard, whereas TAC strictly requires Transaction Guard to be disabled.
B) TAC requires manual call boundary declarations using beginRequest and endRequest APIs, whereas standard AC automates them completely.
C) TAC disables session failover for all DML operations, whereas standard AC only replays SELECT queries.
D) TAC utilizes a state-tracking infrastructure to discover implicit request boundaries automatically without code changes, whereas AC relies on explicit boundaries or connection pool check-in/check-out. *

**Cevap anahtarı:** D

**Gerekçe (D):** TAC categorizes session state usage dynamically to detect implicit request boundaries, enabling session recovery without requiring knowledge of the application or code changes.

## 3. When configuring an Oracle Database 19c database service using srvctl for Transparent Application Continuity (TAC), which combination of service parameter values is required?

*İpucu:* Recall the service attribute values that enable automated failover typing and environment restoration.

A) -failovertype TRANSACTION -failover_restore LEVEL1 -commit_outcome FALSE
B) -failovertype SELECT -failover_restore NONE -commit_outcome TRUE
C) -failovertype AUTO -failover_restore AUTO -commit_outcome TRUE *
D) -failovertype AUTO -failover_restore NONE -commit_outcome FALSE

**Cevap anahtarı:** C

**Gerekçe (C):** Configuring -failovertype AUTO enables TAC, -failover_restore AUTO handles environment state restoration, and -commit_outcome TRUE activates Transaction Guard.

## 4. What core mechanism does Transaction Guard (TG) rely on to guarantee at-most-once transaction execution during failover replay?

*İpucu:* Look for the persistent identifier tracked across client and server to verify transaction outcomes.

A) Disabling redo generation whenever an application borrows a connection from the pool.
B) Forcing all DML calls to bypass the database buffer cache and write directly to secondary standby storage.
C) Assigning a globally unique Logical Transaction ID (LTXID) to each request to persistently store and check the commit outcome. *
D) Rolling back all active transactions across the entire cluster as soon as a node crash is detected.

**Cevap anahtarı:** C

**Gerekçe (C):** Transaction Guard assigns an LTXID to session requests, enabling the database to verify whether a transaction committed before an outage occurred and preventing duplicate execution.

## 5. How do standard Application Continuity (AC) and Transparent Application Continuity (TAC) handle external side effects (such as PL/SQL calls to UTL_SMTP or file transfers) by default during replay?

*İpucu:* Consider TAC's design principle regarding non-idempotent operations that leave persistent changes outside the database.

A) Neither AC nor TAC allows any PL/SQL procedures or package calls to run during normal operation.
B) Standard AC replays side effects by default unless explicitly disabled, whereas TAC detects side effects and suppresses capture/replay during their execution. *
C) Both AC and TAC automatically replay all side effects without exception.
D) Standard AC disables side-effect replay entirely, while TAC forces side effects to repeat until a confirmation signal is received.

**Cevap anahtarı:** B

**Gerekçe (B):** Standard AC will replay side effects unless the application calls disableReplay(), whereas TAC automatically detects non-idempotent side effects and disables capture during those calls.

## 6. Which set of parameter values aligns with Oracle's High Availability connection string recommendations for Oracle Database 12.2 and higher client drivers?

*İpucu:* Identify the parameter combination that balances fast socket failure detection with patient attempt retries.

A) (CONNECT_TIMEOUT=3)(RETRY_COUNT=0)(RETRY_DELAY=0)(TRANSPORT_CONNECT_TIMEOUT=90)
B) (CONNECT_TIMEOUT=90)(RETRY_COUNT=50)(RETRY_DELAY=3)(TRANSPORT_CONNECT_TIMEOUT=3) *
C) (CONNECT_TIMEOUT=604800)(RETRY_COUNT=5)(RETRY_DELAY=300)(TRANSPORT_CONNECT_TIMEOUT=0)
D) (CONNECT_TIMEOUT=1)(RETRY_COUNT=1)(RETRY_DELAY=60)(TRANSPORT_CONNECT_TIMEOUT=0)

**Cevap anahtarı:** B

**Gerekçe (B):** This configuration sets a fast transport timeout to detect network issues quickly while allowing sufficient retries and connection time to navigate failovers cleanly.

## 7. What key operational role does Fast Application Notification (FAN) play in High Availability connection management?

*İpucu:* Focus on how FAN prevents client connection pools from hanging when network connections or nodes fail.

A) It automatically creates missing indexes on foreign keys to prevent table lock contention.
B) It publishes out-of-band cluster status events so middle-tier connection pools immediately invalidate dead sessions and initiate session draining without waiting for TCP timeouts. *
C) It replays uncommitted transactions locally within the application server's heap memory.
D) It enforces source-side deduplicated backups for RMAN Level 1 incremental routines.

**Cevap anahtarı:** B

**Gerekçe (B):** FAN provides immediate notification of instance failures and maintenance events via ONS, allowing connection pools to terminate bad connections instantly and rebalance workloads.

## 8. When using a Java ConnectionInitializationCallback with Application Continuity, when is the callback's initialize(Connection connection) method invoked?

*İpucu:* Consider the exact moment when initial session states (like NLS settings or ALTER SESSION) must be established after failover.

A) Asynchronously in a background thread after the replay request has fully committed.
B) At each successful reconnection following a recoverable error, before request replay begins. *
C) Before every individual SELECT or DML statement executed inside a request.
D) Only when the database instance is initially created during installation.

**Cevap anahtarı:** B

**Gerekçe (B):** The initialization callback executes post-reconnection to re-establish the required initial session state (such as ALTER SESSION calls) before the replay driver replays saved calls.

## 9. What is the primary objective of service connection draining during planned maintenance on an Oracle RAC node?

*İpucu:* Think about how session draining hides planned maintenance by giving running requests time to complete.

A) To convert transactional DML into read-only reporting queries automatically.
B) To migrate physical datafiles from local ASM storage to remote Data Guard standby hosts.
C) To allow active database requests to finish gracefully within the drain_timeout period while preventing new connections, before taking the service offline. *
D) To immediately abort all active middle-tier sessions and force an emergency switchover.

**Cevap anahtarı:** C

**Gerekçe (C):** Draining marks active sessions and waits for them to complete current requests naturally before stopping the service or instance per the stopoption.

## 10. Which diagnostic utility, included with Oracle ORAchk, analyzes application trace files or code to report Application Continuity protection coverage and flag deprecated concrete classes?

*İpucu:* Identify the tool whose name explicitly refers to Application Continuity checking.

A) TKPROF
B) RMAN
C) srvctl
D) ACCHK (acchk) *

**Cevap anahtarı:** D

**Gerekçe (D):** ACCHK evaluates application trace files and application binaries to calculate the percentage of calls protected by Application Continuity and check for incompatible concrete classes.

## 11. If an application uses mutable functions such as SYSDATE, SYS_GUID, or sequence.NEXTVAL, what must be done to retain original runtime values during an Application Continuity replay?

*İpucu:* Recall the explicit SQL privilege clause required to preserve non-deterministic function results across failover replay.

A) Mutable functions must be called inside autonomous transactions with COMMIT_OUTCOME set to FALSE.
B) The JDBC driver automatically changes the server system clock during replay without requiring database grants.
C) The developer must replace all database sequences with random client-side UUID variables.
D) The DBA must grant KEEP privileges (e.g., GRANT KEEP DATE TIME, KEEP SYSGUID, or ALTER SEQUENCE ... KEEP) to the relevant application user or sequence object. *

**Cevap anahtarı:** D

**Gerekçe (D):** Granting KEEP privileges permits Application Continuity to save original function values at runtime and restore them during replay so key values match.

## 12. Which feature introduced in Oracle Database 23ai enhances Application Continuity by enabling reliable session state checkpointing and restoration?

*İpucu:* Think of the 23ai capability introduced to capture and re-establish complex session environments automatically during replay.

A) Database Templates for session state restoration. *
B) Mandatory deprecation of thin JDBC drivers in favor of thick OCI drivers.
C) Complete removal of Transaction Guard and Fast Application Notification.
D) Requirement to call disableReplay() before executing any standard SQL statement.

**Cevap anahtarı:** A

**Gerekçe (A):** Database Templates in 23ai provide automated checkpointing and restoration of session states, broadening AC applicability and reducing reliance on custom callbacks.
