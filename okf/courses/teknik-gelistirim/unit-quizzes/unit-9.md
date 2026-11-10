---
type: Quiz
title: "Ünite 9 quizi: Monitoring, Alerting and Incident Management"
description: Teknik Gelişim 9. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 9
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-9.md
---

# Ünite 9: Monitoring, Alerting and Incident Management

Toplam 12 soru.

## 1. In IFS Cloud 25R1 EFK stack log monitoring, what is the default data retention period for Elasticsearch logs before older records are deleted by the daily curator-cronjob?

*İpucu:* Think about the daily scheduled cronjob that cleans up historical log data in Elasticsearch.

A) 24 hours
B) 14 days
C) 7 days *
D) 30 days

**Cevap anahtarı:** C

**Gerekçe (C):** Elasticsearch data retention in IFS Cloud 25R1 is set to 7 days, after which a daily curator-cronjob checks and removes older log entries.

## 2. Which core Oracle Enterprise Manager (OEM) component runs as a middle-tier Java EE application on Oracle WebLogic Server to process metrics, render the management console, and dispatch administrative jobs?

*İpucu:* Consider the middle-tier application server component responsible for rendering the administrative web interface.

A) Oracle Management Agent (OMA)
B) Management Plug-in
C) Oracle Management Repository (OMR)
D) Oracle Management Service (OMS) *

**Cevap anahtarı:** D

**Gerekçe (D):** The OMS functions as the middle-tier Java EE application running on WebLogic Server to process agent metrics and render the browser-based Cloud Control management console.

## 3. When troubleshooting delayed telemetry following an IFS deployment, which command should an administrator execute on a host node to force immediate metric synchronization from the Oracle Management Agent (OMA) to the OMS?

*İpucu:* Focus on the specific emctl sub-command designed to push collected telemetry payload files immediately.

A) ./emctl start oma
B) ./emctl status agent
C) ./emctl sync repository
D) ./emctl upload agent *

**Cevap anahtarı:** D

**Gerekçe (D):** Executing `./emctl upload agent` forces immediate metric synchronization, transferring accumulated payload files directly to the OMS repository.

## 4. Which repository view inside the sysman schema can DBAs query to inspect recent critical incidents logged in the central Oracle Management Repository (OMR)?

*İpucu:* Look for the specific view named directly after the incident management framework entities in OEM.

A) sysman.oem_events_hist
B) sysman.mgmt_system_alerts
C) sysman.em_alert_logs
D) sysman.em_incidents *

**Cevap anahtarı:** D

**Gerekçe (D):** OEM logs tracked incidents, creation dates, and severity levels inside the `sysman.em_incidents` repository view.

## 5. In IFS Cloud 26R2 Application Monitoring Metrics (AMM), what concept is defined as providing the operational health status (Critical, Warning, OK, or Unknown) for a metric based on supplied thresholds?

*İpucu:* Identify the structural element that evaluates metric values against threshold limits to determine health status.

A) Service Group
B) Expression
C) Metric Group
D) Service *

**Cevap anahtarı:** D

**Gerekçe (D):** In AMM concepts, a Service provides the operational health status for a metric by evaluating supplied threshold values.

## 6. In IFS Cloud 26R2 Application Monitoring Metrics (AMM), how frequently is the BATCH_QUEUE_CONFIG metric sampled to verify whether background work queues are defined?

*İpucu:* Recall the standard short interval shared by several batch queue configuration checks.

A) Every minute
B) Every 2 hours
C) Every 24 hours
D) Every 10 minutes *

**Cevap anahtarı:** D

**Gerekçe (D):** The `BATCH_QUEUE_CONFIG` metric is sampled every 10 minutes to verify whether any background work queues are defined in the system.

## 7. On the Custom Field Runtime Performance Overview screen in IFS Cloud 26R2, what automatic filtering criterion is applied to isolate slow SQL statements?

*İpucu:* Consider the specific threshold for average execution duration used by this custom field overview page.

A) Elapsed Time / Exec (s) greater than 2 seconds *
B) CPU Time / Exec (s) greater than 10 seconds
C) Accumulated physical I/O reads exceeding 1,000 blocks
D) Blocked database sessions waiting over 5 seconds

**Cevap anahtarı:** A

**Gerekçe (A):** The Custom Field Runtime Performance screen automatically filters for custom field queries where the average elapsed time per execution exceeds 2 seconds.

## 8. In IFS Cloud 26R2 Server Alert Log Categories, which field specifies the duration for retaining log records when Heavy Cleanup runs?

*İpucu:* Think of the specific column name in the Server Log Categories configuration table that specifies a number of days.

A) Cleanup Interval
B) Expiry Threshold
C) Retention Period
D) Days to keep *

**Cevap anahtarı:** D

**Gerekçe (D):** The 'Days to keep' column in the Server Log Categories configuration screen defines how many days a log is retained before Heavy Cleanup purges it.

## 9. In IFS Cloud 26R2, which scheduled job controls the lifecycle of background tasks and updates their state so end users can receive Streams notifications upon completion?

*İpucu:* Focus on the system procedure named for processing all pending transactions in the background job framework.

A) Batch_SYS.New_Batch_Schedule__
B) Transaction_SYS.Process_All_Pending__ *
C) Event_SYS.Execute_Actions__
D) Stream_SYS.Notify_User__

**Cevap anahtarı:** B

**Gerekçe (B):** The `Transaction_SYS.Process_All_Pending__` procedure runs background jobs and updates their completion state to notify end users via Streams for Background Jobs and Reports.

## 10. In Oracle Enterprise Manager Cloud Control, what feature should administrators configure during planned maintenance windows to temporarily suppress notifications and avoid false alerts?

*İpucu:* Look for the formal OEM feature designed specifically to temporarily pause monitoring alerts during scheduled downtime.

A) Administrative Blackouts *
B) Subscriber Suppression Mode
C) Notification Rules Override
D) Metric Disablement

**Cevap anahtarı:** A

**Gerekçe (A):** Administrative Blackouts are scheduled during maintenance windows to suppress notification dispatches and prevent false-positive alerts across managed targets.

## 11. In IFS Cloud 25R1 EFK stack log monitoring, which query language is used within the Kibana interface to filter and query log data stored in Elasticsearch?

*İpucu:* Recall the native query language abbreviation specific to Kibana interface search fields.

A) Elasticsearch SQL (E-SQL)
B) Fluentd Search Syntax (FSS)
C) Lucene Expression Language (LEL)
D) Kibana Query Language (KQL) *

**Cevap anahtarı:** D

**Gerekçe (D):** KQL is the query language used inside Kibana search filter text boxes to query log data stored in Elasticsearch.

## 12. What default bidirectional TCP port is used by the Oracle Management Agent (OMA) to communicate securely with the central Oracle Management Service (OMS)?

*İpucu:* Identify the standard OEM agent port number referenced in the agent administration topology notes.

A) 3872 *
B) 1521
C) 8080
D) 7001

**Cevap anahtarı:** A

**Gerekçe (A):** Oracle Management Agents communicate with the central OMS middle tier over default bidirectional TCP port 3872 using HTTP/HTTPS.
