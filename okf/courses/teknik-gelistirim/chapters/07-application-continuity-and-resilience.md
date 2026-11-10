---
type: Chapter
title: Application Continuity and Resilience
description: In this chapter, the student learns how to deploy Application Continuity (AC) and Transparent Application Continuity (TAC) in Oracle Database 19c and Oracle Database 18c environments supporting IFS Ap
course: teknik-gelistirim
chapter: 7
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to deploy Application Continuity (AC) and Transparent Application Continuity (TAC) in Oracle Database 19c and Oracle Database 18c environments supporting IFS Applications and enterprise ERP workloads. The curriculum details how Active Data Guard read-only open mode enables offloading heavy analytical queries away from the primary database while Managed Recovery Process (MRP) maintains real-time synchronization via Standby Redo Logs (SRLs). Additionally, students examine Fast Connection Failover (FCF), Fast Application Notification (FAN), Transaction Guard commit outcome verification, and IFS mid-tier reconnection testing to achieve continuous application availability during planned maintenance or unplanned outages.

# Öğrenme Hedefleri

1. The student can configure Transparent Application Continuity (TAC) and Application Continuity (AC) service parameters in Oracle Database 19c using srvctl, including failovertype AUTO or TRANSACTION, commit_outcome TRUE, and failover_restore AUTO.
2. The student can offload read-only queries and operational reporting to an Active Data Guard physical standby database opened in read-only mode with real-time apply enabled using Standby Redo Logs (SRLs).
3. The student can test IFS mid-tier reconnection logic and Fast Connection Failover (FCF) using Oracle Notification Service (ONS) and SCAN listeners to ensure transparent session failover and session draining.

# Dersler

* Read-Only Query & Reporting Offloading
* IFS Mid-Tier Re-connection Logic Testing
* 28 Application Continuity for Java - Database - Oracle Help Center
* Application Continuity for the Oracle Database
* Architectural Blueprint for Oracle 19c Maximum Availability Architecture in Enterprise ERP Workloads
* How to Configure TAC in Oracle RAC – Step-by-Step Guide - Learnomate Technologies
* Oracle Application Continuity (AC & TAC) - Bugra Parlayan
* screencapture-web-archive-org-web-20231203162938-https-www-rackspace-com-blog-understanding-oracle-19c-transparent-application-continuity-2026-11-10-09_45_44.pdf

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each objective:

---

### Objective 1: Configuring TAC and AC Service Parameters in Oracle Database 19c Using `srvctl`

* **Service Creation Utility:** The student learns that user-defined database application services supporting Application Continuity (AC) and Transparent Application Continuity (TAC) are created and modified using the `srvctl` command-line utility [1-5].
* **Failover Type Parameter (`-failovertype`):** Setting `-failovertype AUTO` activates Transparent Application Continuity (TAC) to automatically track session state transitions and replay requests following recoverable outages [2-9]. Setting `-failovertype TRANSACTION` enables manual Application Continuity (AC) [5, 8-11].
* **Commit Outcome Parameter (`-commit_outcome`):** Setting `-commit_outcome TRUE` enables Transaction Guard, which stores Logical Transaction IDs (LTXID) to guarantee at-most-once transaction commit execution during replay [1-5, 7, 9, 11-13].
* **Failover Restore Parameter (`-failover_restore`):** Setting `-failover_restore AUTO` enforces automatic session state restoration for Transparent Application Continuity (TAC) [2-5, 7, 9, 14, 15]. Setting `-failover_restore LEVEL1` restores basic initial session states for manual Application Continuity [5, 9, 10, 15, 16].
* **Additional Operational Parameters:** Database administrators programmatically configure associated service options including `-clbgoal SHORT`, `-rlbgoal SERVICE_TIME`, `-replay_init_time 600` (or `1800`), `-failoverretry 30`, `-failoverdelay 10`, `-drain_timeout 300`, and `-notification TRUE` to manage load balancing, connection retries, session draining, and Fast Application Notification (FAN) events [1-5, 7, 9, 10, 14].
* **Version Application:** The official manuals and training architecture notes specify these `srvctl` service parameters for Oracle Database 19c and Oracle Database 18c [3, 4, 9, 17]. The sources state that TAC was introduced in Oracle Database 18c and supported in Oracle Database 19c [6, 18-21]. Where general `srvctl` parameters are described without restricting them to a single release, the sources do not explicitly name a version limit [1, 5].

---

### Objective 2: Offloading Read-Only Queries and Reporting to an Active Data Guard Physical Standby Database

* **Active Data Guard Read-Only Architecture:** The student learns that Active Data Guard enables a physical standby database to open in read-only open mode while simultaneously applying incoming redo streams in real time [22, 23].
* **Real-Time Apply via Standby Redo Logs (SRLs):** The Managed Recovery Process (MRP) continuously applies redo blocks received from the primary database via Standby Redo Logs (SRLs), providing current data for reporting without blocking transactional writes on the primary site [22, 23].
* **Resource Protection for Primary Workloads:** Offloading heavy analytical queries, large financial reports, and custom BI integrations to the physical standby database protects CPU and I/O capacity on the primary database, ensuring high OLTP throughput for core IFS Applications (IFS Cloud, IFS Applications 10, and IFS Applications 9) [22].
* **Configuration Steps:** To set up reporting offloading, DBAs temporarily stop managed recovery using `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL`, open the database in read-only mode via `ALTER DATABASE OPEN`, and restart real-time apply using `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE USING CURRENT LOGFILE DISCONNECT` [23].
* **Diagnostic Verification:** DBAs verify operational status by querying `v$database` to confirm `DATABASE_ROLE` is `PHYSICAL STANDBY` and `OPEN_MODE` is `READ ONLY`, checking `v$managed_standby` to confirm process `MRP0` is `APPLYING_LOG`, and inspecting `v$dataguard_stats` to verify `apply lag` [23].
* **Version Application:** The training working notes present these steps for environments supporting IFS Applications (IFS Cloud, IFS Applications 10, and IFS Applications 9) [22]. The sources do not explicitly name a specific database version limitation for these SQL commands and Active Data Guard views [22, 23].

---

### Objective 3: Testing IFS Mid-Tier Reconnection Logic, FCF, ONS, and SCAN Listeners

* **Fast Connection Failover (FCF) and ONS Mechanics:** The student learns that Fast Connection Failover (FCF) utilizes Oracle Clusterware and database events published via Oracle Notification Service (ONS) to notify application server connection pools (such as JDBC Universal Connection Pool) immediately when a database instance or node fails [1, 24-28].
* **Single Client Access Name (SCAN) Routing:** SCAN listeners direct initial client connection requests to available cluster nodes and distribute incoming traffic across active RAC instances [26, 29-32].
* **Client Connection Properties:** DBAs configure SCAN-based JDBC thin connection URLs containing parameters such as `TRANSPORT_CONNECT_TIMEOUT`, `CONNECT_TIMEOUT`, `RETRY_COUNT`, `RETRY_DELAY`, and `FAILOVER=ON`, alongside enabling ONS properties (`PoolDataSourceFactory` property `setONSConfiguration` or `fastConnectionFailoverEnabled=true`) in the mid-tier data source [26, 30, 31, 33, 34].
* **Failover and Reconnection Testing:** Mid-tier reconnection logic is tested by simulating a database outage or executing a planned Data Guard switchover (`SWITCHOVER TO <standby_database>`) via Data Guard Broker (DGMGRL), then monitoring application server log files to verify that ONS notifications are received, broken connections are invalidated, and active sessions re-attach to the new primary instance [26, 35, 36].
* **Session Draining for Planned Maintenance:** Session draining allows active database requests to finish work gracefully during planned maintenance before instance shutdown or service relocation, while FCF and Application Continuity act as fallback mechanisms if work does not complete within the configured `drain_timeout` [28, 35, 37-40].
* **Version Application:** The training working notes detail these mid-tier reconnection testing procedures for IFS Applications (IFS Cloud, IFS Applications 10, and IFS Applications 9) [26]. Official manuals state that server-side session draining was introduced in Oracle Database 18c [35, 37], and connection URL parameters like `TRANSPORT_CONNECT_TIMEOUT` apply to Oracle Database release 12.2 and higher [30, 41]. Where general reconnection concepts are stated without a version, the sources do not explicitly name a version [26].

---

💡 **Next Steps:** Would you like to create a set of practice flashcards covering these high-availability reconnection properties and `srvctl` parameters, or generate a quiz to test your understanding of Active Data Guard offloading and TAC configuration?

# Kaynaklar

* NotebookLM kaynağı `a9510843-a2a8-4a5d-8c6b-0df37bdf8077`
* NotebookLM kaynağı `3d088243-3b09-4681-89e4-2a1a550147e9`
* NotebookLM kaynağı `7eedf1cb-fad7-4386-b919-18be8fb65007`
* NotebookLM kaynağı `2b498d6c-9371-4784-b2ce-35dee646323e`
* NotebookLM kaynağı `c478de5c-7f28-44d7-aa60-9c89de9da148`
* NotebookLM kaynağı `a20dcff8-a3f4-436e-aad7-fba62eeb1eac`
* NotebookLM kaynağı `42981782-a6d0-4c39-a675-8bf5565b7613`
* NotebookLM kaynağı `41a61ccb-4737-4a41-9a83-d74d9b1b76a6`
