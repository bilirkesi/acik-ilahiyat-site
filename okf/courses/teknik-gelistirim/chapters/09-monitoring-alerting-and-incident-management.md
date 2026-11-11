---
type: Chapter
title: Monitoring, Alerting and Incident Management
description: In this chapter, the student learns how to establish and maintain centralized enterprise monitoring infrastructure using Oracle Enterprise Manager (OEM) Cloud Control 13c/14c, encompassing Oracle Mana
course: teknik-gelistirim
chapter: 9
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-11T19:31:19Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to establish and maintain centralized enterprise monitoring infrastructure using Oracle Enterprise Manager (OEM) Cloud Control 13c/14c, encompassing Oracle Management Service (OMS), Oracle Management Repository (OMR), and multi-node Oracle Management Agent (OMA) administration using emctl. The curriculum covers automated event management, incident rule set promotion, notification pipelines, blackout scheduling, and EFK stack log monitoring in IFS Cloud 25R1. Additionally, students master operational telemetry governance in IFS Cloud 26R2 using Application Monitoring Metrics (AMM), Application Monitoring Console, Server Alert Log categories, Oracle Advanced Queues, and Streams background job notifications.

# Sesli Ders

[Bölüm 9 sesli özeti](/audio/teknik-gelistirim/chapter-9.mp3) (5:15 dk, MP3)

# Öğrenme Hedefleri

1. The student can deploy and administer Oracle Enterprise Manager (OEM) Cloud Control 13c/14c infrastructure components, including Oracle Management Service (OMS), SYSMAN repository schema, and Oracle Management Agent (OMA) processes using the emctl CLI utility.
2. The student can configure OEM event management, incident rule set logic, blackout schedules, and notification delivery methods to automatically promote metric alerts to actionable incidents while suppressing false-positive alerts.
3. The student can utilize Application Monitoring Console (AMM) metrics, Server Alert Log categories, Oracle Advanced Queues, Streams background job notifications, and EFK stack dashboards to oversee system performance in IFS Cloud 25R1 and IFS Cloud 26R2.

# Dersler

* OEM 13c/14c Infrastructure Setup
* OEM Agent Administration across Nodes
* Automated Incident Rule sets & Notifications
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf
* screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf
* screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf
* About Server Alert Log - Technical Documentation For IFS Cloud
* Application Monitoring Console - Technical Documentation For IFS Cloud
* Monitor Server Alert Log - Technical Documentation For IFS Cloud
* Server Alert Log Categories - Technical Documentation For IFS Cloud

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each specified objective:

---

### Objective 1: Deploying and Administering OEM Cloud Control 13c/14c Infrastructure Components

* **Enterprise Infrastructure Architecture:** The student learns that Oracle Enterprise Manager (OEM) Cloud Control provides a multi-tier management framework to collect, process, and store performance diagnostics across managed targets, including Oracle RAC nodes, ASM instances, PDBs/CDBs, and host servers [1].
* **Oracle Management Service (OMS):** OMS is a middle-tier Java EE application running on Oracle WebLogic Server [1]. It processes metrics uploaded by host agents, renders the browser-based Cloud Control management console, dispatches administrative jobs, and manages notification alerts [1].
* **Oracle Management Repository (OMR):** OMR is a dedicated Oracle Database that houses the SYSMAN repository schema [1]. It stores configuration data, target health metrics, historical performance baselines, job execution logs, and incident tracking data [1].
* **Oracle Management Agent (OMA):** OMA processes deploy directly on each managed host server to continuously sample host CPU utilization, memory thresholds, ASM disk group space, and database instance availability [1, 2]. Agents communicate securely with the central OMS via dedicated bidirectional TCP port 3872 using HTTP/HTTPS protocols [2].
* **Management Plug-ins:** Plug-ins are software extensions integrated into OMS and OMA to extend monitoring capabilities to specific hardware, storage arrays, third-party databases, or enterprise application mid-tiers [1].
* **CLI Administration via `emctl`:** Database administrators use the `emctl` utility on the OMS host server to verify WebLogic services, HTTP server status, and repository connectivity [1]. On managed cluster nodes, DBAs navigate to the agent execution directory (such as `/u01/app/oracle/agent/agent_inst/bin`) and run `./emctl status agent` to verify agent process health and OMS ping connectivity, or `./emctl upload agent` to force an immediate upload of collected telemetry payload files to the OMS repository [2].
* **Version Context:** The training notes title this infrastructure setup as OEM 13c/14c Infrastructure Setup for environments running IFS Applications (IFS Cloud, IFS Applications 10/9) [1, 2]. Where the sources describe component roles and `emctl` commands without distinguishing between 13c and 14c, the sources do not specify a version limitation [1, 2].

---

### Objective 2: Configuring OEM Event Management, Incident Rule Sets, Blackout Schedules, and Notifications

* **Event to Incident Promotion Framework:** The Oracle Management Agent (OMA) continuously samples target metrics and generates an Event when a metric crosses a warning or critical threshold, such as host CPU utilization exceeding 95% [3]. Pre-configured incident rules evaluate event severity and automatically promote severe events into tracked Incidents in OEM, representing actionable operational issues requiring administrative intervention [3].
* **Incident Rule Sets:** Rule sets define the core logic for processing events and incidents [3]. They govern automated actions such as sending email notifications, executing corrective action scripts, or creating tickets in external enterprise ticketing systems (such as ServiceNow or Jira) based on target criteria, severity levels, and time windows [3].
* **Notification Delivery Methods:** OEM incorporates a notification framework supporting transport channels including SMTP email, SNMP traps, and operating system scripts or webhooks [3]. Subscriber lists map specific incident severity levels to designated notification subscribers [3].
* **Blackouts:** Administrative Blackouts can be scheduled during planned maintenance windows to temporarily suppress notifications and prevent false-positive alerts across IFS staging or production environments [3].
* **Incident History Verification:** DBAs verify active critical incidents by querying the OMR repository view `sysman.em_incidents` for `target_name`, `target_type`, `incident_name`, `severity`, `creation_date`, and `status` [4].
* **Version Context:** The training source applies event management and incident rule sets to IFS Applications (IFS Cloud, IFS Applications 10/9) [3]. The source does not state a specific database version restriction for setting up OEM incident rule sets and blackout schedules [3].

---

### Objective 3: Utilizing Monitoring Frameworks, Alert Logs, Advanced Queues, Streams, and EFK Stack Dashboards in IFS Cloud

* **IFS Cloud 25R1 Log Monitoring with EFK Stack:** In IFS Cloud 25R1 Remote Deployment, log monitoring uses an EFK stack comprising Elasticsearch, Fluentd, and Kibana [5]. Elasticsearch stores system activity logs with a 7-day data retention period, managed by a daily curator cronjob [5]. Fluentd acts as a log shipper collecting and forwarding log data [5]. Kibana provides data visualization and dashboards using Kibana Query Language (KQL) [5, 6]. Imported Kibana dashboards include the Response Time Detail View Dashboard, which displays projection and entity metrics automatically sorted from highest response time to lowest response time by default [7, 8].
* **IFS Cloud 26R2 Application Monitoring Metrics (AMM):** In IFS Cloud 26R2, AMM structures health indicators across a hierarchy of Metric, Threshold, Service, Service Groups, Expression, and Interval [9]. AMM exported metric categories include BATCH_QUEUES (such as BATCH_QUEUE_CONFIG, BATCH_QUEUE_ACTIVE, BATCH_QUEUE_PROC, QUEUE_PROCESSES, DEFERRED_JOBS_EXECUTING_12H, and STUCK_BATCH_QUEUE_PROCESSES) [10], QUEUE_ENTRIES - Background Jobs (QUEUE_READY, QUEUE_WAIT, QUEUE_EXEC, QUEUE_ERROR) [11], and DATABASE_CONFIG (SGA_TARGET, PGA_AGGREGATE_LIMIT, DB_SESSIONS, DB_ACTIVE_SESSIONS, DB_BLOCKED_SESSIONS) [12, 13].
* **IFS Cloud 26R2 Application Monitoring Console:** Accessed in Solution Manager under Solution Manager / Monitoring / Application Monitoring Console, this console displays upper and lower warning limits for monitored entries [14]. It features a "Show Alarms Only" filter and a Details view to inspect granular data, such as active batch queue processes [14].
* **IFS Cloud 26R2 Server Alert Log Categories:** Located in Solution Manager under Solution Manager / Monitoring / Server Alert Log Categories, administrators configure logging using Category ID, Description, Enable, Cleanup, and Days to keep parameters [15]. Standard categories include Ddl Audit (logs database DDL statements via a database trigger), Debug, Deployment, Deployment detail, Event errors, Server Errors (traces database errors via an AFTER ERROR trigger), Sql Injections (traces suspected SQL injections via `Assert_SYS`), and In-Memory (logs index removal for In-Memory tables) [15, 16].
* **IFS Cloud 26R2 Oracle Advanced Queues:** The Oracle Queues window in IFS Cloud enables starting, stopping, and purging queue tables for asynchronous background messaging, while the Oracle Queue Subscribers window tracks registered consumers and allows removing subscribers [17].
* **IFS Cloud 26R2 Streams Background Jobs:** Streams functionality alerts end users when background jobs or reports finish running, handling one-time background jobs (`Transaction_SYS.Deferred_Call`) and scheduled tasks (`Batch_SYS.New_Batch_Schedule`) executed by the `Transaction_SYS.Process_All_Pending` scheduler [18]. Notifications are configured using opt-in parameters `stream_msg_on_completion_` (set to TRUE) and `stream_notes_` [18]. Notification text can be customized using the Hooking API `Transaction_SYS.Modify_Stream_Notification` [18].
* **IFS Cloud 26R2 System Performance Screens:** Real-time database performance monitoring utilizes the `v$sql` view in Solution Manager [19]. The Custom Field Runtime Performance Overview screen filters active queries with an average elapsed time exceeding 2 seconds, while the All SQL Runtime Performance Overview screen displays overall SQL execution metrics sorted by default in descending order of Elapsed Time / Exec (s) [19, 20].
* **Version Context:** The sources explicitly distinguish between IFS Cloud 25R1 (EFK stack and Kibana Response Time Detail View) and IFS Cloud 26R2 (AMM metrics, Application Monitoring Console, Server Alert Log Categories, Oracle Queues, Streams background job notifications, and `v$sql` performance screens) [5, 7, 10, 14, 15, 17-19].

---

💡 **Next Steps:** Would you like to generate practice flashcards covering OEM `emctl` commands and AMM metric categories, or create a quiz to test your understanding of IFS Cloud 26R2 alert log categories and Streams notifications?

# Kaynaklar

* NotebookLM kaynağı `e7afec70-f348-431b-baa5-f856ab0d8631`
* NotebookLM kaynağı `f63c42ec-7ed9-44c7-80cb-d09716eeb506`
* NotebookLM kaynağı `32cb5d69-b326-4f17-b312-0230a7c855d0`
* NotebookLM kaynağı `a2830143-a7ee-43f3-8047-313346a164cd`
* NotebookLM kaynağı `77a5ea42-ab87-4cbb-83f2-34855168abed`
* NotebookLM kaynağı `4d0ecd0a-f694-4af2-9ff9-418504a8ebff`
* NotebookLM kaynağı `7a268338-833c-4b04-b4ee-b4b9290d557d`
* NotebookLM kaynağı `973a447c-30ca-4ae2-8915-f0da6242afd4`
* NotebookLM kaynağı `65877721-8800-43e7-a699-f8583908e370`
* NotebookLM kaynağı `904f1647-1f0b-4d2d-a274-e421d1a003d4`
* NotebookLM kaynağı `6a588993-d227-428a-9859-3a67d5583e7b`
* NotebookLM kaynağı `aacb746e-7471-4005-8c02-71ce163a18de`
* NotebookLM kaynağı `f317d051-6a57-41ae-8473-e98554c786af`
* NotebookLM kaynağı `1d057a25-8c1e-415f-925b-d4d6a46bfebc`
