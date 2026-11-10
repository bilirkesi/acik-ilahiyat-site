---
type: Chapter
title: Monitoring, Alerting and Incident Management
description: In this chapter, the student learns how to establish and maintain centralized enterprise monitoring infrastructure using Oracle Enterprise Manager (OEM) Cloud Control 13c/14c, encompassing Oracle Mana
course: teknik-gelistirim
chapter: 9
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
notebook: "https://notebooklm.google.com/notebook/d9fbd16b-86fb-45ab-af81-dc503b2c5aad"
---

# Özet

In this chapter, the student learns how to establish and maintain centralized enterprise monitoring infrastructure using Oracle Enterprise Manager (OEM) Cloud Control 13c/14c, encompassing Oracle Management Service (OMS), Oracle Management Repository (OMR), and multi-node Oracle Management Agent (OMA) administration using emctl. The curriculum covers automated event management, incident rule set promotion, notification pipelines, blackout scheduling, and EFK stack log monitoring in IFS Cloud 25R1. Additionally, students master operational telemetry governance in IFS Cloud 26R2 using Application Monitoring Metrics (AMM), Application Monitoring Console, Server Alert Log categories, Oracle Advanced Queues, and Streams background job notifications.

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
* Optimizing Alert Monitoring with Oracle Enterprise Manager | PPTX - Slideshare
* About Server Alert Log - Technical Documentation For IFS Cloud
* Application Monitoring Console - Technical Documentation For IFS Cloud
* Monitor Server Alert Log - Technical Documentation For IFS Cloud
* Server Alert Log Categories - Technical Documentation For IFS Cloud

# İnteraktif Panel

Bu bölümün içinde yaşadığı ders paneli: [Teknik Gelişim paneli](/courses/teknik-gelistirim.md#panel-öne-çıkanları).

# Kaynak Temellendirme

Based on the provided sources, here is what the student learns for each objective:

---

### Objective 1: Deploying and Administering OEM Cloud Control 13c/14c Infrastructure Components

* **Enterprise Infrastructure Architecture:** The student learns that Oracle Enterprise Manager (OEM) Cloud Control provides a multi-tier management framework to maintain operational health and visibility across Oracle RAC nodes, ASM storage, database instances, and host servers supporting IFS Applications [1].
* **Oracle Management Service (OMS):** The middle-tier Java EE application runs on Oracle WebLogic Server, rendering the browser-based Cloud Control management console, processing metrics uploaded by host agents, executing administrative jobs, and managing notification alerts [1].
* **Oracle Management Repository (OMR) and SYSMAN Schema:** A dedicated Oracle Database houses the SYSMAN repository schema to store configuration data, target health metrics, historical performance baselines, job execution logs, and incident tracking data [1].
* **Oracle Management Agent (OMA):** Lightweight agent processes deploy directly on each managed host server to sample host CPU, memory, ASM disk space, and database target availability, communicating securely with the central OMS over bidirectional TCP port 3872 using HTTP/HTTPS protocols [1, 2].
* **Management Plug-ins:** Software extensions integrate into OMS and OMA to extend monitoring capabilities to specific hardware, storage arrays, third-party databases, or enterprise application mid-tiers [1].
* **CLI Administration via `emctl`:** Database administrators use the `emctl` utility on the OMS host server to verify middle-tier service health, WebLogic status, and repository connectivity [1]. On managed RAC host nodes, DBAs navigate to the agent directory (e.g. `cd /u01/app/oracle/agent/agent_inst/bin`) and execute `./emctl status agent` to check process health and OMS ping connectivity, or `./emctl upload agent` to force an immediate upload of collected telemetry payload files to the OMS repository [2].
* **Version Context:** The training notes title this setup as OEM 13c/14c Infrastructure Setup for environments running IFS Applications (IFS Cloud, IFS Applications 10/9) [1, 2]. Where the sources describe component roles and `emctl` commands without distinguishing between 13c and 14c, the sources do not specify a version limitation [1, 2].

---

### Objective 2: Configuring OEM Event Management, Incident Rule Sets, Blackout Schedules, and Notifications

* **Event to Incident Promotion Framework:** The student learns that the Oracle Management Agent (OMA) continuously samples target metrics and generates an Event when a metric crosses a warning or critical threshold (such as host CPU utilization exceeding 95%) [3]. Pre-configured incident rules automatically promote severe events into tracked Incidents in the OMR repository, representing actionable issues requiring administrative intervention [3].
* **Incident Rule Sets:** Rule sets define automated operational logic to send email notifications, run corrective action scripts, or generate external tickets in enterprise systems (such as ServiceNow or Jira) based on target criteria, severity levels, and time windows [3].
* **Notification Framework:** OEM maps incident severity levels to notification delivery methods including SMTP email, SNMP traps, and operating system webhooks or scripts [3].
* **Blackout Scheduling:** Administrative Blackouts can be scheduled during planned maintenance windows to temporarily suppress notifications and prevent false-positive alerts across IFS staging or production environments [3].
* **Repository Verification:** DBAs verify active incidents by querying the OMR repository view `sysman.em_incidents` for target name, target type, incident name, severity, creation date, and status [4].
* **Metric Threshold Tuning:** Standardizing and customizing OEM monitoring templates to match specific operational baselines eliminates alert noise and prevents non-actionable alert flooding [5, 6].
* **Version Context:** The training architecture notes apply event management and incident rule sets to IFS Applications (IFS Cloud, IFS Applications 10/9) [3]. The source does not state a specific database version restriction for setting up OEM incident rule sets and blackout schedules [3].

---

### Objective 3: Utilizing Monitoring Frameworks, Alert Logs, Advanced Queues, Streams, and EFK Stack Dashboards in IFS Cloud

* **IFS Cloud 25R1 Log Monitoring with EFK Stack:** In IFS Cloud 25R1 Remote Deployment, log monitoring uses an EFK stack comprising Elasticsearch, Fluentd, and Kibana [7]. Elasticsearch stores system activity logs with a 7-day retention period, managed by a daily curator cronjob [7]. Fluentd collects and forwards logs to Elasticsearch [7]. Kibana provides data visualization using Kibana Query Language (KQL), featuring imported dashboards such as the Response Time Detail View Dashboard to analyze projection and entity performance sorted from highest to lowest response time by default [7-10].
* **IFS Cloud 26R2 Application Monitoring Metrics (AMM):** In IFS Cloud 26R2, AMM structures telemetry across a hierarchy of Metric, Threshold, Service, and Service Group [11]. Monitored categories include BATCH_QUEUES (metrics like BATCH_QUEUE_CONFIG, BATCH_QUEUE_ACTIVE, BATCH_QUEUE_PROC, QUEUE_PROCESSES, STUCK_BATCH_QUEUE_PROCESSES, and DEFERRED_JOBS_EXECUTING_12H), QUEUE_ENTRIES - Background Jobs (QUEUE_READY, QUEUE_WAIT, QUEUE_EXEC, QUEUE_ERROR), and DATABASE_CONFIG (SGA_TARGET, PGA_AGGREGATE_LIMIT, DB_SESSIONS, DB_ACTIVE_SESSIONS, DB_BLOCKED_SESSIONS) [12-15].
* **IFS Cloud 26R2 Application Monitoring Console:** Accessed in Solution Manager under Solution Manager / Monitoring / Application Monitoring Console, this console displays upper and lower warning limits for monitored entries and includes a "Show Alarms Only" filter alongside expanded Details views to inspect active queues and background tasks [16, 17].
* **IFS Cloud 26R2 Server Alert Log Categories:** Configured in Solution Manager under Solution Manager / Monitoring / Server Alert Log Categories, administrators toggle logging, cleanup, and retention days per category [17, 18]. Standard categories include Ddl Audit, Debug, Deployment, Deployment detail, Event errors, Server Errors (tracing database errors via AFTER ERROR triggers), Sql Injections (tracing suspected SQL injection attempts via Assert_SYS), and In-Memory [18, 19].
* **IFS Cloud 26R2 Oracle Advanced Queues Administration:** The Oracle Queues window allows starting, stopping, and purging queue tables for asynchronous background messaging, while the Oracle Queue Subscribers window tracks and manages registered consumer subscribers [20].
* **IFS Cloud 26R2 Streams Background Job Notifications:** Streams functionality notifies end users when one-time background jobs (`Transaction_SYS.Deferred_Call`) or scheduled tasks (`Batch_SYS.New_Batch_Schedule`) completed via `Transaction_SYS.Process_All_Pending` finish running [21]. Notifications are enabled via opt-in parameters `stream_msg_on_completion_` (set to TRUE) and `stream_notes_`, and message text can be customized using the Hooking API `Transaction_SYS.Modify_Stream_Notification` [21].
* **IFS Cloud 26R2 Real-Time System Performance Monitoring:** System administrators use the `v$sql` view in Solution Manager to inspect active SQL execution metrics, utilizing the All SQL Runtime Performance Overview and Custom Field Runtime Performance Overview screens to isolate queries exceeding 2 seconds elapsed time [22, 23].
* **Version Context:** The sources explicitly distinguish between IFS Cloud 25R1 (EFK stack and Kibana Response Time Detail View) and IFS Cloud 26R2 (AMM metrics, Application Monitoring Console, Server Alert Log Categories, Oracle Queues, Streams notifications, and `v$sql` performance screens) [7, 8, 11, 12, 16, 18, 20-22].

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
* NotebookLM kaynağı `cdb96ddd-9f69-4b98-a1c2-71919a96fb0f`
* NotebookLM kaynağı `54fe9696-9a03-4ed9-8525-b0b6a68930fc`
* NotebookLM kaynağı `fb3e40f1-7f6c-4f7d-b4a6-5fd27b7e8cbd`
* NotebookLM kaynağı `3478a28d-34c2-4b40-b268-a32e9d1fa4c5`
* NotebookLM kaynağı `3c509258-844c-4657-9b03-94c3e07e130a`
