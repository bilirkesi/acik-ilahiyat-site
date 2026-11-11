---
type: Chapter
title: Application Continuity and Resilience
description: In this chapter, the student learns how to deploy Application Continuity (AC) and Transparent Application Continuity (TAC) in Oracle Database 19c and Oracle Database 18c environments supporting IFS Ap
course: teknik-gelistirim
chapter: 7
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T05:06:34Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to deploy Application Continuity (AC) and Transparent Application Continuity (TAC) in Oracle Database 19c and Oracle Database 18c environments supporting IFS Applications and enterprise ERP workloads. The curriculum details how Active Data Guard read-only open mode enables offloading heavy analytical queries away from the primary database while Managed Recovery Process (MRP) maintains real-time synchronization via Standby Redo Logs (SRLs). Additionally, students examine Fast Connection Failover (FCF), Fast Application Notification (FAN), Transaction Guard commit outcome verification, and IFS mid-tier reconnection testing to achieve continuous application availability during planned maintenance or unplanned outages.

# Sesli Ders

[Bölüm 7 sesli özeti](/audio/teknik-gelistirim/chapter-7.mp3) (5:18 dk, MP3)

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

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each specified objective.

---

### Objective 1: Configuring TAC and AC Service Parameters in Oracle Database 19c Using `srvctl`

* **Service Management Utility:** User-defined database application services supporting Application Continuity (AC) and Transparent Application Continuity (TAC) on Oracle RAC are created and modified using the `srvctl` command-line utility [1-6]. (For single-instance databases, the `DBMS_SERVICE` package is used instead [7, 8].)
* **Failover Type Parameter (`-failovertype`):**
  * Setting `-failovertype AUTO` activates Transparent Application Continuity (TAC), introduced in Oracle Database 18c and supported in Oracle Database 19c [9-14]. TAC dynamically analyzes session state transitions and transparently tracks session context, NLS settings, and transaction boundaries without requiring application code modifications or explicit request boundary declarations [9, 11, 13, 14].
  * Setting `-failovertype TRANSACTION` enables manual Application Continuity (AC), introduced in Oracle Database 12c, which relies on application-aware connection pools and explicit request boundary declarations (`beginRequest` / `endRequest`) to track and replay uncommitted requests [3, 7, 13, 15-17].
* **Commit Outcome Parameter (`-commit_outcome`):** Setting `-commit_outcome TRUE` activates Transaction Guard [7, 14, 18, 19]. Transaction Guard assigns a persistent, globally unique Logical Transaction ID (LTXID) to user requests, enabling the replay engine to query the transaction outcome following an outage and prevent duplicate transaction execution [14, 18-20].
* **Failover Restore Parameter (`-failover_restore`):**
  * Setting `-failover_restore AUTO` enforces automatic session state restoration for TAC in Oracle Database 18c and 19c [10, 13, 14, 21, 22]. In Oracle Database 19c, specifying `-failovertype AUTO` automatically sets `-failover_restore` to `AUTO` [14, 21]. This restores common session states, package variables, NLS formats, and temporary table contexts upon reconnection [13, 14, 23, 24].
  * For manual Application Continuity (`-failovertype TRANSACTION`), setting `-failover_restore LEVEL1` restores preset common initial session states [3, 21, 25].
* **Implicit Request Begin in Oracle Database 19c:** Starting in Oracle Database 19c, setting `FAILOVER_TYPE` to `AUTO` causes the Oracle JDBC driver to implicitly begin a request on each new physical connection created through the replay data source, enabling third-party connection pools to leverage TAC without code changes [26].
* **Additional Operational Parameters:** Database administrators programmatically configure associated service parameters via `srvctl`, including `-clbgoal SHORT` (or `LONG`), `-rlbgoal SERVICE_TIME`, `-failoverretry 30` (or `10`), `-failoverdelay 10` (or `3`), `-replay_init_time 1800` (or `600`), `-retention 86400`, `-notification TRUE` (enabling FAN event delivery), `-drain_timeout 300` seconds, and `-stopoption IMMEDIATE` [2-4, 6, 7, 14].

---

### Objective 2: Offloading Read-Only Queries and Operational Reporting to an Active Data Guard Physical Standby Database

* **Active Data Guard Read-Only Open Mode:** In enterprise environments running IFS Applications (IFS Cloud, IFS Applications 10/9) or ERP workloads, Active Data Guard enables a physical standby database to open in read-only open mode (`READ ONLY`) while simultaneously applying incoming redo streams in real time [27-29].
* **Real-Time Apply Mechanics:** Real-Time Apply uses the Managed Recovery Process (`MRP0` or `MRP`) to continuously apply redo blocks received from the primary database via Standby Redo Logs (SRLs) as they fill [27-30]. This provides reporting sessions with near-instantaneous data synchronization (Recovery Point Objective, RPO near zero) without blocking or locking primary transaction writes [27, 28].
* **Workload Isolation Benefits:** Offloading resource-intensive analytical queries, end-of-month financial reports, and custom BI integrations to the physical standby database protects CPU and I/O capacity on primary production RAC nodes, maintaining high transaction throughput for core OLTP operations [27, 28].
* **Configuration Steps:** To open a physical standby database for read-only reporting offload:
  1. Temporarily cancel active managed recovery: `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;` [29]
  2. Open the standby database instance in read-only mode: `ALTER DATABASE OPEN;` [29]
  3. Resume real-time apply while keeping the database open read-only: `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE USING CURRENT LOGFILE DISCONNECT;` [29]
* **Diagnostic Verification:** DBAs verify operational status by querying `v$database` to confirm `DATABASE_ROLE` is `PHYSICAL STANDBY` and `OPEN_MODE` is `READ ONLY`, checking `v$managed_standby` to verify process `MRP0` status is `APPLYING_LOG`, and inspecting `v$dataguard_stats` to confirm `apply lag` is near zero [29].
* **Version Application:** The training architecture notes detail Active Data Guard read-only offloading and SRL sizing for Oracle 19c Maximum Availability Architecture [27, 30]. The working notes apply read-only offloading procedures to IFS Applications (IFS Cloud, IFS Applications 10/9) [28, 29]. Where general SQL commands do not specify a version limit, the sources do not name a version restriction.

---

### Objective 3: Testing IFS Mid-Tier Reconnection Logic, Fast Connection Failover (FCF), ONS, and SCAN Listeners

* **Fast Connection Failover (FCF) and ONS Framework:** Fast Connection Failover (FCF) uses Oracle Clusterware and database events published via Oracle Notification Service (ONS) over TCP port 6200 to notify mid-tier connection pools (such as JDBC Universal Connection Pool or WebLogic Data Sources) immediately when a database instance or node fails [7, 31-35]. ONS notifications break client threads out of TCP/IP timeout hangs, allowing connection pools to instantly invalidate dead connections and re-route traffic to surviving or newly promoted nodes [18, 32, 33, 35].
* **Single Client Access Name (SCAN) Routing:** SCAN listeners direct initial client connection requests to available cluster nodes and load balance connections across active RAC instances [35-38].
* **JDBC Thin Connection String Guidelines:** Starting in Oracle Database Release 12.1.0.2 / 12.2, JDBC Thin client connection descriptors require HA parameters including `TRANSPORT_CONNECT_TIMEOUT`, `CONNECT_TIMEOUT`, `RETRY_COUNT`, `RETRY_DELAY`, `FAILOVER=ON`, and `ADDRESS_LIST` definitions pointing to SCAN VIPs [35, 39-42]. Enabling ONS in UCP / Java data sources requires setting `fastConnectionFailoverEnabled=true` and configuring `onsConfiguration` or relying on auto-ONS via recommended TNS URLs [35, 43-45].
* **Planned Maintenance Session Draining:** Starting in Oracle Database 18c, the database marks sessions to drain during planned maintenance when instances, PDBs, or services are stopped or relocated [46-48]. FAN planned-down events signal FAN-aware connection pools to clear idle sessions and allow active requests to complete gracefully within the allocated `drain_timeout` (e.g. 300 seconds) before `stopoption` (`IMMEDIATE`) applies [14, 46-48].
* **IFS Mid-Tier Reconnection Testing Procedure:**
  1. Configure the IFS mid-tier data source URL with SCAN listener syntax and enable ONS configuration parameters (`PoolDataSourceFactory` property `setONSConfiguration`) [35].
  2. Initiate a planned Data Guard switchover from the Data Guard Broker command-line utility (`dgmgrl`) using `SWITCHOVER TO <standby_database>;` [35, 49, 50].
  3. Inspect application server log files to verify that ONS failover events are received, broken pool connections are cleaned up, and SQL execution resumes seamlessly against the newly promoted primary database without manual intervention or application crashes [35].
* **Version Application:** Auto-ONS configuration applies to Oracle Database 12c client drivers and later [33, 43]. Connection string parameters like `TRANSPORT_CONNECT_TIMEOUT` apply to Oracle Database Release 12.1.0.2 / 12.2 and higher [39, 41]. Server-side session draining was introduced in Oracle Database 18c [46, 47]. The training working notes detail mid-tier reconnection testing for IFS Applications (IFS Cloud, IFS Applications 10/9) [35].

---

💡 **Next Steps:** Would you like to review practice questions covering TAC and AC service parameters, or explore how `srvctl` commands interact with Data Guard role transitions?

# Kaynaklar

* NotebookLM kaynağı `a9510843-a2a8-4a5d-8c6b-0df37bdf8077`
* NotebookLM kaynağı `3d088243-3b09-4681-89e4-2a1a550147e9`
* NotebookLM kaynağı `7eedf1cb-fad7-4386-b919-18be8fb65007`
* NotebookLM kaynağı `2b498d6c-9371-4784-b2ce-35dee646323e`
* NotebookLM kaynağı `c478de5c-7f28-44d7-aa60-9c89de9da148`
