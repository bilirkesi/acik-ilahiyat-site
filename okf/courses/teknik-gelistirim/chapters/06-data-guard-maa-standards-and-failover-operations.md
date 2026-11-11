---
type: Chapter
title: Data Guard, MAA Standards and Failover Operations
description: In this chapter, the student learns how to design, implement, and operate high availability and disaster recovery solutions for Oracle Database 19c supporting IFS Applications and IFS Cloud workloads.
course: teknik-gelistirim
chapter: 6
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T05:06:34Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to design, implement, and operate high availability and disaster recovery solutions for Oracle Database 19c supporting IFS Applications and IFS Cloud workloads. The curriculum covers Oracle Maximum Availability Architecture (MAA) Gold and Platinum standards, combining Oracle Real Application Clusters (RAC) with Active Data Guard (ADG), Real-Time Redo Apply via Standby Redo Logs (SRLs), and Data Guard Broker (dgmgrl) automation to achieve Recovery Point Objective (RPO = 0) and Recovery Time Objective (RTO < 5 minutes). Additionally, students learn to set proactive alert thresholds in Oracle Enterprise Manager (OEM) using DBMS_SERVER_ALERT for host CPU utilization at 85 percent warning and 95 percent critical, as well as Data Guard apply lag at 300 seconds warning and 900 seconds critical, while configuring dynamic mid-tier failover using SCAN listeners.

# Sesli Ders

[Bölüm 6 sesli özeti](/audio/teknik-gelistirim/chapter-6.mp3) (4:49 dk, MP3)

# Öğrenme Hedefleri

1. The student can deploy Oracle Maximum Availability Architecture (MAA) Gold and Platinum tiers for Oracle Database 19c by combining Oracle Real Application Clusters (RAC), Active Data Guard (ADG), and Edition-Based Redefinition (EBR) to enforce RPO = 0 and RTO < 5 minutes.
2. The student can administer Oracle 19c Data Guard Broker (dgmgrl) to execute automated planned switchover and emergency failover runbooks while managing Standby Redo Logs (SRLs) and Real-Time Redo Apply.
3. The student can configure warning and critical metric thresholds in Oracle Enterprise Manager (OEM) using DBMS_SERVER_ALERT for host CPU utilization at 85 percent warning and 95 percent critical, as well as Data Guard replication apply lag at 300 seconds warning and 900 seconds critical.

# Dersler

* Automated Switchover & Failover Runbooks
* Gold & Platinum MAA Standards Implementation
* RPO & RTO High Availability Optimization
* Real-Time Replica Synchronization
* CPU Utilization & Data Guard Lag Thresholds
* Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12
* Oracle Data Guard Concepts and Administration, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each specified objective:

---

### Objective 1: Deploying Oracle MAA Gold and Platinum Tiers for Oracle Database 19c

* **MAA Blueprint Scope:** The student learns that Oracle Maximum Availability Architecture (MAA) provides a best practices blueprint and reference architecture for database high availability, disaster recovery, and data protection [1, 2].
* **Tier Selection for IFS Applications:** For enterprise environments running IFS Applications (IFS Cloud, IFS Applications 10/9), organizations target Gold and Platinum tiers to eliminate single points of failure, provide active-active scalability, and enforce strict Recovery Point Objectives (RPO = 0) and Recovery Time Objectives (RTO < 5 minutes) [1, 3].
* **Gold Tier Architecture:** The MAA Gold tier combines Oracle Real Application Clusters (RAC) for local node failure protection with Active Data Guard (ADG) for remote disaster recovery [1]. Gold tier uses synchronous or fast asynchronous redo transport, Application Continuity for transparent mid-tier session failover, and RMAN and Flashback technologies [1].
* **Platinum Tier Architecture:** The MAA Platinum tier builds upon Gold by integrating active-active or multi-master replication solutions such as Oracle GoldenGate alongside Active Data Guard and RAC to eliminate maintenance window impact [1]. Platinum tier utilizes Edition-Based Redefinition (EBR) to enable zero-downtime online application schema upgrades while the system is fully operational [1].
* **Enforcing RPO and RTO Targets:** Enforcing RPO = 0 (zero data loss) is achieved by using Oracle Data Guard in synchronous (SYNC) protection mode [3]. Achieving RTO < 5 minutes is accomplished by automating failover workflows using Data Guard Broker and Fast-Start Failover (FSFO) [3].
* **Version Application:** The training notes apply these MAA standards to IFS Applications (IFS Cloud, IFS Applications 10/9) [1, 3]. Where general MAA tier definitions do not restrict a feature to a single database version, the sources do not explicitly state a database version limitation [1].

---

### Objective 2: Administering Oracle 19c Data Guard Broker (dgmgrl), Standby Redo Logs (SRLs), and Real-Time Redo Apply

* **Role Transition Governance:** In enterprise deployments running IFS Applications (IFS Cloud, IFS Applications 10/9), Data Guard Switchover and Failover procedures maintain business continuity during planned maintenance or site outages [4]. Data Guard Broker (dgmgrl) automates and validates planned switchover and emergency failover sequences across primary and standby nodes [4, 5].
* **Planned Switchover Operations:** A planned Switchover executes a clean, two-way role reversal that flushes pending redo data to guarantee zero data loss (RPO = 0) without database re-creation [4]. During a switchover, IFS Applications mid-tier connection pools dynamically fail over using Single Client Access Name (SCAN) listeners and Fast Connection Failover (FCF) services [4].
* **Emergency Failover Operations:** An emergency Failover executes a one-way role transition that forcibly promotes a standby database to primary status following an unexpected primary database failure [4].
* **Standby Redo Logs (SRLs) Configuration:** Active Data Guard relies on Standby Redo Logs (SRLs) created on the standby database, which must be sized identically to the primary database online redo logs [6].
* **Redo Transport Mechanics:** The Log Network Server (LNS) process on the primary instance transmits redo data over the network, and the Remote File Server (RFS) process on the standby instance receives the stream and writes it directly into Standby Redo Logs [6].
* **Real-Time Redo Apply Execution:** Real-Time Redo Apply uses the Recovery Writer process (MRP0) to apply redo changes from active Standby Redo Logs immediately as they fill, eliminating traditional archive log shipping delays [6].
* **Read-Only Reporting Offload:** Real-Time Apply enables the physical standby database to remain open in read-only mode, allowing IFS reporting queries and backups to offload production CPU overhead while staying current down to the last committed transaction [6].
* **Version Application:** Official documentation details Data Guard concepts and administration for Oracle Data Guard Concepts and Administration, 19c [7], while training notes apply these workflows to IFS Applications (IFS Cloud, IFS Applications 10/9) [4, 6, 8].

---

### Objective 3: Configuring Warning and Critical Metric Thresholds in OEM via DBMS_SERVER_ALERT

* **OEM Metric Threshold Architecture:** For enterprise systems running IFS Applications (IFS Cloud, IFS Applications 10/9), configuring warning and critical alert thresholds in Oracle Enterprise Manager (OEM) ensures DBAs receive early notifications before performance bottlenecks disrupt core ERP, EAM, and FSM workloads [8]. OEM evaluates monitored targets against predefined boundaries and triggers automated alerts when metrics cross limits [8].
* **Host CPU Utilization Thresholds:** Host CPU utilization warning threshold is set at 85% utilization over a sustained interval to alert DBAs to investigate runaway queries, unindexed SQL statements, or insufficient server resource allocation [8]. Host CPU utilization critical threshold is set at 95% utilization, signaling severe CPU saturation that causes process queuing, throttling, and mid-tier connection timeouts [8].
* **Data Guard Replication Apply Lag Thresholds:** Data Guard replication apply lag warning threshold is set at 300 seconds (5 minutes), signaling that the physical standby database is falling behind the primary transaction stream and risking RPO compliance [8]. Data Guard replication apply lag critical threshold is set at 900 seconds (15 minutes) or aligned with strict service level agreements, indicating major network transport bottlenecks, storage latency on Standby Redo Logs, or MRP apply stalls [8].
* **Programmatic Configuration & Verification:** Host CPU utilization alert thresholds are programmatically configured using the DBMS_SERVER_ALERT package [8]. Standby replication apply lag metrics and synchronization status are monitored and verified using dynamic performance views such as V\$DATAGUARD_STATS [8-10].
* **Version Application:** The training notes apply host CPU and Data Guard apply lag thresholds to IFS Applications (IFS Cloud, IFS Applications 10/9) [8]. The sources do not state a specific database version restriction for setting metric thresholds via DBMS_SERVER_ALERT [8].

---

💡 **Next Steps:** Would you like to review the step-by-step `dgmgrl` commands for testing Fast-Start Failover (FSFO), or create flashcards covering the OEM threshold parameters and V\$DATAGUARD_STATS views?

# Kaynaklar

* NotebookLM kaynağı `56218126-5b69-4170-afb4-a3f353aa9cbf`
* NotebookLM kaynağı `7903b197-ddd2-465f-8faa-0ae76a992be0`
* NotebookLM kaynağı `a027bf96-9d7a-43d6-a04d-2cfd37f3f0e5`
* NotebookLM kaynağı `3d916d1d-84f9-4986-998c-0fa6a07c6a66`
* NotebookLM kaynağı `475de504-e92a-4488-85d7-228e05f21e02`
* NotebookLM kaynağı `610ba785-ac7b-42c9-9df1-a26c41af7ac1`
* NotebookLM kaynağı `4101ab09-ff0d-4b11-b109-5c5cfc602472`
