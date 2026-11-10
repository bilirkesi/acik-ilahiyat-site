---
type: Chapter
title: Data Guard, MAA Standards and Failover Operations
description: In this chapter, the student learns how to design, implement, and operate high availability and disaster recovery solutions for Oracle Database 19c supporting IFS Applications and IFS Cloud workloads.
course: teknik-gelistirim
chapter: 6
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to design, implement, and operate high availability and disaster recovery solutions for Oracle Database 19c supporting IFS Applications and IFS Cloud workloads. The curriculum covers Oracle Maximum Availability Architecture (MAA) Gold and Platinum standards, combining Oracle Real Application Clusters (RAC) with Active Data Guard (ADG), Real-Time Redo Apply via Standby Redo Logs (SRLs), and Data Guard Broker (dgmgrl) automation to achieve Recovery Point Objective (RPO = 0) and Recovery Time Objective (RTO < 5 minutes). Additionally, students learn to set proactive alert thresholds in Oracle Enterprise Manager (OEM) using DBMS_SERVER_ALERT for host CPU utilization at 85 percent warning and 95 percent critical, as well as Data Guard apply lag at 300 seconds warning and 900 seconds critical, while configuring dynamic mid-tier failover using SCAN listeners.

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
* Oracle 19c Data Guard & Data Guard Broker
* Oracle MAA Best Practices - Applications Considerations | PDF - Slideshare
* Oracle Data Guard Concepts and Administration, 19c

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each objective:

---

### Objective 1: Deploying Oracle MAA Gold and Platinum Tiers for Oracle Database 19c

* **Gold Tier Architecture:** The student learns that the Oracle Maximum Availability Architecture (MAA) Gold tier provides a high availability and disaster recovery blueprint for mission-critical IFS Applications (IFS Cloud, IFS Applications 10/9) [1]. The Gold tier combines local node failure protection using Oracle Real Application Clusters (RAC) with remote disaster recovery using Active Data Guard (ADG) [1].
* **Platinum Tier Architecture:** The student learns that the MAA Platinum tier delivers continuous availability and zero application downtime by building upon the Gold tier [1]. Platinum incorporates active-active replication solutions such as Oracle GoldenGate alongside Active Data Guard and RAC [1]. Platinum employs Edition-Based Redefinition (EBR) to enable zero-downtime online application schema upgrades while the system is fully operational [1].
* **RPO and RTO Targets:** Enforcing RPO = 0 (zero data loss) is achieved by using synchronous (SYNC) redo transport in Data Guard Maximum Availability or Maximum Protection modes [2, 3]. Achieving RTO < 5 minutes is accomplished by automating failover workflows through Data Guard Broker and Fast-Start Failover (FSFO) [3].
* **Version Application:** The training source notes apply these MAA standards to IFS Applications (IFS Cloud, IFS Applications 10/9) and present worked examples using Oracle Database 19c [1, 4, 5]. Where general MAA tier definitions do not restrict a capability to a single version, the sources do not explicitly state a database version limitation [1, 6].

---

### Objective 2: Administering Data Guard Broker (dgmgrl), Standby Redo Logs (SRLs), and Real-Time Redo Apply

* **Data Guard Broker Administration (`dgmgrl`):** The student learns to administer the Data Guard Broker command-line utility `dgmgrl` to centralize and automate database role transitions [4, 7]. The Broker manages the configuration using commands such as `CREATE CONFIGURATION`, `ADD DATABASE`, `ENABLE CONFIGURATION`, `SHOW CONFIGURATION`, `VALIDATE DATABASE`, `SWITCHOVER TO`, and `FAILOVER TO` [7-9].
* **Planned Switchover:** A planned switchover executes a clean, two-way role reversal between primary and standby databases that flushes pending redo logs to guarantee zero data loss (RPO = 0) without database re-creation [4]. Application server connection pools for the IFS mid-tier fail over dynamically using Single Client Access Name (SCAN) listeners and Fast Connection Failover (FCF) services [4].
* **Emergency Failover:** An emergency failover executes a one-way role transition where a physical standby database is promoted to primary status following an unexpected failure on the primary site [4].
* **Standby Redo Logs (SRLs) Management:** Standby Redo Logs (SRLs) must be sized identically to the primary database's largest online redo log [10]. The required quantity of SRLs is calculated as `(threads * online groups) + 1 per thread` [10]. SRLs must be configured on the primary database prior to standby duplication so that the database is immediately ready to receive redo streams if roles reverse during a switchover [10, 11].
* **Real-Time Redo Apply Mechanics:** In Active Data Guard, the Remote File Server (RFS) process receives incoming redo streams over the network and writes them directly into Standby Redo Logs [12]. The Managed Recovery Process (MRP or `MRP0`) applies changes immediately from active SRLs as they fill, eliminating archive log shipping delays [12, 13]. Prior to enabling Data Guard Broker, manual MRP recovery must be stopped using `ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL` so the Broker takes exclusive control [14].
* **Version Application:** The sources document these Broker procedures and real-time apply steps specifically for Oracle Database 19c (19.16) CDB and PDB configurations [5, 15, 16].

---

### Objective 3: Configuring Metric Thresholds in OEM via DBMS_SERVER_ALERT

* **Host CPU Utilization Thresholds:** The student learns to configure proactive host CPU utilization thresholds in Oracle Enterprise Manager (OEM) to prevent operational bottlenecks in IFS Applications (IFS Cloud, IFS Applications 10/9) [17]. The warning threshold for host CPU utilization is set at 85 percent over sustained intervals to notify DBAs to investigate runaway queries, unindexed SQL statements, or insufficient server resource allocation [17]. The critical threshold for host CPU utilization is set at 95 percent, indicating severe CPU saturation that causes process queuing, resource throttling, and mid-tier connection timeouts [17].
* **Data Guard Replication Lag Thresholds:** The student learns to set replication apply lag thresholds to protect disaster recovery readiness [17]. The warning threshold for Data Guard replication apply lag is set at 300 seconds (5 minutes) to alert DBAs that the standby database is lagging behind the primary transaction stream and risking RPO compliance [17]. The critical threshold for Data Guard replication apply lag is set at 900 seconds (15 minutes) or aligned with service level agreements, signaling network transport bottlenecks, storage latency on Standby Redo Logs, or MRP apply stalls [17].
* **Programmatic Configuration and Verification:** Database administrators programmatically configure host CPU and Data Guard apply lag thresholds using the `DBMS_SERVER_ALERT` PL/SQL package [17]. Current synchronization latency and standby replication status are verified using dynamic performance views such as `V$DATAGUARD_STATS` [17-19].
* **Version Application:** The training source applies these monitoring thresholds to IFS Applications (IFS Cloud, IFS Applications 10/9) [17]. The source does not state a specific database version restriction for the `DBMS_SERVER_ALERT` metric settings, though adjacent Data Guard tutorials in the training program specify Oracle Database 19c [5, 17].

---

💡 **Next Steps:** Would you like to review the step-by-step `dgmgrl` commands for testing Fast-Start Failover (FSFO), or create flashcards covering the OEM threshold parameters and `V$DATAGUARD_STATS` views?

# Kaynaklar

* NotebookLM kaynağı `56218126-5b69-4170-afb4-a3f353aa9cbf`
* NotebookLM kaynağı `7903b197-ddd2-465f-8faa-0ae76a992be0`
* NotebookLM kaynağı `a027bf96-9d7a-43d6-a04d-2cfd37f3f0e5`
* NotebookLM kaynağı `3d916d1d-84f9-4986-998c-0fa6a07c6a66`
* NotebookLM kaynağı `475de504-e92a-4488-85d7-228e05f21e02`
* NotebookLM kaynağı `610ba785-ac7b-42c9-9df1-a26c41af7ac1`
* NotebookLM kaynağı `9e785eef-c017-4d65-9f93-362af60a3444`
* NotebookLM kaynağı `34f0cc1f-fe1e-435f-8b3d-9bd0542309f4`
* NotebookLM kaynağı `4101ab09-ff0d-4b11-b109-5c5cfc602472`
