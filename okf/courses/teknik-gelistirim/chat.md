---
type: Questions
title: "Teknik Gelişim Soru & Cevap"
description: Teknik Gelişim dersinin kaynaklarından üretilmiş 100 soru-cevap.
course: teknik-gelistirim
question_count: 100
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-12T06:36:15Z }
resource: /courses/teknik-gelistirim/chat.md
---

# Teknik Gelişim Soru & Cevap

Sorular dersin kendi kaynaklarından üretildi; her cevabın kaynak listesi vardır.

## 1. Bölüm: Program Orientation and IFS Cloud Oracle Architecture

### How are multitenant Container Database (CDB$ROOT) and Pluggable Database (PDB) structures used to isolate IFS environments?

The root container database (CDB\(ROOT) manages background processes, shared system metadata, and global memory allocations. Dedicated Pluggable Databases, including PDB\)SEED and user PDBs, isolate separate IFS application instances like DEV, TEST, and PROD on the same server hardware. This multitenant structure provides database-level isolation for data dictionaries and application schemas. The sources apply these multitenant architecture principles to IFS Applications (IFS Cloud and IFS Applications 10/9) without restricting them to a specific database version.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### How do Buffer Cache and Shared Pool memory components within the SGA support IFS mid-tier session activity?

Within the System Global Area (SGA), the Shared Pool stores parsed SQL and PL/SQL code, execution plans, and data dictionary information for reuse by IFS mid-tier sessions. The Buffer Cache caches data blocks read from disk to optimize query response times and reduce physical I/O. Dynamic allocation under sga_target balances these two components based on operational workload demands. The sources describe these SGA memory functions for IFS Applications (IFS Cloud and IFS Applications 10/9) without stating a specific database version restriction.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### How does setting an insufficient value for the processes parameter affect IFS mid-tier connections?

The processes static initialization parameter specifies the maximum number of operating system user processes that can simultaneously connect to the Oracle database instance. Each dedicated mid-tier connection pool, background process (such as PMON, DBWn, and LGWR), and DBA session consumes a process slot. Configuring this parameter too low causes incoming connections to be rejected with the ORA-00020: maximum number of processes exceeded error, preventing mid-tier application servers from establishing new sessions. The sources do not place a version restriction on this parameter definition.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### How is the curriculum for the IFS Enterprise Oracle DBA Training Program structured during program orientation?

During program orientation, the training curriculum is structured to align learner objectives with core architectural guidelines and technical tracks. The program covers foundational modules including multitenant isolation, RAC clustering, ASM storage management, Data Guard disaster recovery, and AWR/ASH performance diagnostics. It establishes a progressive learning roadmap for database administrators managing mission-critical enterprise workloads. The sources outline this training structure specifically for the IFS Enterprise Oracle Architecture & DBA Training Program.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What details do the sources provide regarding Oracle 19c database storage tiering and server requirements for IFS Cloud 25R1 and 26R2?

The selected sources do not contain specific technical details or sizing metrics regarding Oracle 19c storage tiering or server hardware requirements for IFS Cloud 25R1 and IFS Cloud 26R2. They only note generally that IFS Applications (IFS Cloud and IFS Applications 10/9) rely on Oracle Database backends for core ERP, EAM, and FSM workloads. The absence of specific storage tier and server sizing details for these releases is explicitly noted as not covered in the sources.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What foundational database pillars govern the Oracle infrastructure for mission-critical IFS enterprise applications?

The Oracle infrastructure guidelines for IFS enterprise applications are structured around five core architectural pillars. These pillars encompass multitenant database configuration, high availability frameworks, robust disaster recovery protocols, continuous performance tuning, and centralized system monitoring. Together, they provide database administrators with a blueprint to maintain a secure, scalable, and resilient operational environment. The sources present these guidelines for IFS Applications and IFS Cloud enterprise workloads without restricting them to a single database version.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What happens when the sga_target parameter is set to a non-zero value in an IFS Applications environment?

Setting sga_target to a non-zero value enables Automatic Shared Memory Management (ASMM) in the Oracle database. Under ASMM, Oracle dynamically balances memory allocation among the Buffer Cache, Shared Pool, Large Pool, and Java Pool. This dynamic tuning prevents hard parsing and disk I/O bottlenecks during heavy OLTP operations in IFS Applications (IFS Cloud and IFS Applications 10/9). The sources do not specify a database version restriction for these ASMM parameter definitions.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What is the difference between Release Update (RU) and Release Update Revision (RUR) in the Oracle maintenance lifecycle for IFS environments?

A Release Update (RU) is a quarterly cumulative patch containing security vulnerability fixes, high-value bug fixes, and stability improvements that increments the secondary version number. A Release Update Revision (RUR) extends the lifespan of a specific RU by providing security and regression fixes without introducing new functional bug fixes. RU patches are applied in non-production environments (DEV and TEST) during major update cycles, while RUR patches are preferred in production (PROD) to lock execution behavior. The sources present these patch lifecycle definitions for Oracle Database 19c and IFS Applications 10/9.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What is the purpose of the pga_aggregate_target parameter and how does it prevent performance degradation?

The pga_aggregate_target parameter establishes a global target for the total Program Global Area (PGA) memory allocated across all database sessions. It dynamically controls memory allocated to work areas for ORDER BY sorts, hash joins, and bitmap merges to keep them within limits. Proper configuration prevents excessive spilling of work area data to temporary tablespace during heavy batch reporting in IFS Applications (IFS Cloud and IFS Applications 10/9). The sources do not specify a version constraint for this PGA parameter setting.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

### What role does the open_cursors parameter play in managing Private SQL Area resources for Java/JDBC connection pools?

The dynamic open_cursors parameter specifies the maximum number of open cursors a single session can hold simultaneously in its Private SQL Area. Mid-tier frameworks, such as Java/JDBC connection pools in IFS environments, cache statement handles to increase execution speed. Setting this parameter sufficiently high prevents cursor leaks and Shared Pool memory exhaustion, avoiding the ORA-01000: maximum open cursors exceeded error in IFS Applications. The sources do not state a specific version restriction for this parameter.

**Kaynaklar:** IFS Applications & Cloud Oracle Infrastructure Architecture Guidelines, IFS Oracle DBA Training Setup, Chapter 1 Core Topics Overview, screencapture-docs-ifs-techdocs-25r1-060-development-025-operational-reporting-2026-11-08-09_42_53.pdf, IFS Oracle DBA Training Progress, IFS Oracle DBA Eğitim Güncellemesi, Training Progress and Chapter 6 Start, IFS Oracle Eğitim İçeriği Güncellemesi, Technical Administration and Operational Governance in IFS Cloud 26R2

## 2. Bölüm: Multitenant Database Administration: CDB and PDB

### How do PDB Resource Manager profiles prevent nonproduction workloads from impacting core Production performance?

PDB Resource Manager profiles allocate dedicated CPU shares, parallel execution queues, and session limits per PDB [1]. These controls prevent heavy testing scripts or batch jobs in one PDB from consuming excessive shared system resources [1]. Protecting core production workloads from resource starvation maintains consistent operational throughput [1]. The sources do not limit PDB Resource Manager profiles to a specific database version [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### How do midtier connection pools interact with PDB services to preserve logical isolation across IFS environments?

Midtier connection pools interact exclusively with their assigned PDB service name [1]. This transactional context switching prevents sessions in nonproduction environments like Development or Testing from accessing or modifying Production schema objects [1]. Consequently, different application stages can run safely on shared physical infrastructure [1]. The sources do not specify a version constraint for this connection pool isolation mechanism [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### How is dictionary isolation maintained between individual Pluggable Databases (PDBs) and the CDB$ROOT container?

While CDB$ROOT manages common system metadata, each PDB maintains its own private data dictionary for user created tables, indexes, and application schemas [1]. Each PDB functions as an independent database to connected midtier applications [1]. This private data dictionary design prevents metadata overlap and cross environment interference [1]. The sources do not place a database version restriction on PDB data dictionary isolation [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### What core components and system resources are managed by the CDB$ROOT container in an Oracle Multitenant database?

The root container database (CDB\(ROOT) manages background processes, shared system metadata, global memory allocations, and common database user accounts [1]. It also stores global initialization parameters shared across the multitenant structure [1]. This architecture enables different IFS application stages to share underlying database infrastructure efficiently [1]. The sources do not specify a version constraint for these CDB\)ROOT architectural definitions [1].

**Kaynaklar:** Container Database (CDB) Administration

### What data and Application schemas are stored inside User PDBs within an IFS Applications environment?

User PDBs contain application specific metadata, tablespace structures, and user data schemas required for IFS Applications workloads [1]. They are deployed as dedicated pluggable databases to completely isolate individual operational stages such as Production, Testing, or Development [1]. This isolation ensures that application schemas remain segregated at the database level [1]. The sources do not restrict User PDB operations to a single database version [1].

**Kaynaklar:** Container Database (CDB) Administration

### What independent lifecycle operations can administrators perform on a PDB without affecting sibling PDBs in the same CDB?

Database administrators can unplug, clone, or drop an individual PDB without disrupting active operations in sibling PDBs running on the same CDB [1]. These independent lifecycle operations allow maintenance and upgrades on specific IFS environments without causing global system downtime [1]. This flexibility significantly reduces administrative overhead in multitenant management [1]. The sources do not restrict these PDB lifecycle operations to a specific database version [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### What is the purpose and operational role of the PDB$SEED structure when creating new pluggable databases?

The PDB\(SEED structure serves as a system provided template Pluggable Database (PDB) used to quickly provision new pluggable databases [1]. It allows administrators to clone clean, standardized PDB instances for new IFS environments without manual setup [1]. This template mechanism accelerates environment deployment across application lifecycles [1]. The sources do not state a specific database version restriction for the PDB\)SEED template function [1].

**Kaynaklar:** Container Database (CDB) Administration

### Which SQL queries and built in functions are executed to verify session container context and active session distribution across PDBs?

To confirm the current session container context and ID, administrators query sys_context('USERENV', 'CON_NAME') and sys_context('USERENV', 'CON_ID') from the DUAL table [1]. Active session distribution across pluggable databases is audited by querying the v$session view grouped by con_id, username, and status [1]. These verification steps ensure sessions execute within their intended PDB container context [1]. The sources do not restrict these session verification queries to a specific database version [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

### Which SQL statements are used by a database administrator to open a target IFS PDB and switch container context from CDB$ROOT?

To open a target pluggable database from CDB\(ROOT, the administrator executes ALTER PLUGGABLE DATABASE ifsprod OPEN [1]. The session container context is then changed using the ALTER SESSION SET CONTAINER = ifsprod statement [1]. Current container statuses across the CDB are verified by querying the v\)pdbs view [1]. The sources do not specify a version constraint for these multitenant SQL administration commands [1].

**Kaynaklar:** Container Database (CDB) Administration

### Which initialization parameters are used to configure memory limits at the PDB level to control resource consumption?

PDB level memory limits are established by configuring the sga_min_size, sga_target, and pga_aggregate_limit parameters within individual pluggable databases [1]. These memory quotas prevent unconstrained queries in a single container from consuming shared host memory [1]. Setting these limits protects primary transaction processing workloads from memory contention caused by sibling PDBs [1]. The sources do not specify a database version restriction for these PDB memory control parameters [1].

**Kaynaklar:** Pluggable Database (PDB) Isolation & Operations

## 3. Bölüm: Release Lifecycle and Patching: RU, RUR and Upgrades

### How is the first stage of the two stage patch application pipeline executed during database maintenance?

The first stage of the patch application pipeline involves running the opatch apply command while database services are completely shut down [1]. This command directly updates and replaces executable binaries, libraries, and header files inside the $ORACLE_HOME directory [1]. Database services remain offline until the binary patching process finishes cleanly [1]. The sources present this binary patching procedure without placing a version restriction on the command usage [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### What core functions does the AutoUpgrade utility perform during Oracle Database 19c upgrades according to official documentation?

The AutoUpgrade utility automates the end to end database upgrade process, running preupgrade checks, executing upgrade steps, and handling postupgrade tasks [1]. It provides a streamlined command line pipeline that reduces manual errors during major database version migrations [1]. The official Oracle documentation documents the AutoUpgrade utility specifically within the Oracle Database 19c Database Upgrade Guide [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### What is a Release Update (RU) in the Oracle database patch maintenance strategy and how does it impact the version number?

A Release Update (RU) is a quarterly, cumulative patch containing security vulnerability fixes, proactive high-value bug fixes, and critical stability enhancements [1]. Applying an RU moves the database to a new minor release version, incrementing the minor version digit such as from 19.11 to 19.12 [1]. In IFS Applications multitenant environments, RUs are recommended for nonproduction environments like DEV and TEST during major update cycles to validate performance changes and execution plans [1]. The sources describe this RU patch lifecycle for Oracle Database 19c and IFS Applications 10/9 environments [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### What is the primary purpose of a Release Update Revision (RUR) and how does it differ from a Release Update (RU)?

A Release Update Revision (RUR) extends the lifespan of a specific RU by delivering strictly critical security fixes and regression fixes without incorporating new functional bug fixes [1]. Applying an RUR increments the revision digit, such as moving from version 19.11.0 to 19.11.1, with up to two revisions released per RU [1]. It is primarily used in production (PROD) environments where locking core execution behavior between major application upgrades is required while maintaining security compliance [1]. The sources present this RUR patching strategy for Oracle Database 19c and IFS Applications 10/9 [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### What prerequisite verification checks must database administrators perform using the OPatch utility before installing a patch?

Before executing patch installation commands on an Oracle Database home, the OPatch utility must be updated to the minimum version specified in the Oracle Patch Readme [1]. DBAs must perform conflict detection checks against $ORACLE_HOME to prevent partial patch applications and verify system prerequisites before shutting down database services [1]. Performing these verification checks avoids software corruption and minimizes unexpected service disruptions [1]. The sources describe these OPatch verification steps without stating a specific database version restriction [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### What technical details do the selected sources provide regarding automated AutoUpgrade REST API configurations for IFS Cloud 26R2?

The selected sources do not contain specific technical deployment steps or code samples for configuring AutoUpgrade REST APIs within IFS Cloud 26R2 environments [1]. The Oracle Database 19c Database Upgrade Guide lists AutoUpgrade REST APIs as a documentation appendix, but does not detail their integration into IFS Cloud release pipelines [1]. The absence of specific IFS Cloud 26R2 AutoUpgrade REST API implementation details is explicitly noted as not covered in the selected sources [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### When is the datapatch automation utility executed in the two stage patching pipeline and what database layers does it update?

The datapatch utility is executed during the second stage of the pipeline after binary patching is complete and database services are reopened [1]. Datapatch automatically updates SQL metadata, data dictionary objects, and PL/SQL packages inside CDB$ROOT and all Pluggable Databases (PDBs) across the multitenant container structure [1]. This step ensures SQL level patch automation is fully applied across all database containers [1]. The sources describe datapatch automation for Oracle multitenant databases without specifying a database version limit [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### Which alternative utilities and tools are documented in the Oracle Database 19c upgrade guide for manual upgrades and data migration?

For manual upgrade workflows, the upgrade guide documents the Parallel Upgrade Utility to run upgrade scripts in parallel [1]. For data migration across databases, Oracle Data Pump is provided to export and import database objects and data sets [1]. The documentation presents these tools as alternative or complementary migration paths in the Oracle Database 19c Database Upgrade Guide [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### Which data dictionary views are queried by database administrators to verify applied SQL patch history and RU or RUR revision levels?

Database administrators query the registry\(history and dba_registry_sqlpatch data dictionary views to audit applied patches [1]. These SQL queries allow DBAs to verify the current RU or RUR revision level and confirm patch application status across CDB\)ROOT and individual pluggable databases [1]. Inspecting these views ensures that postpatch SQL automation completed successfully [1]. The sources outline the use of these dictionary views for database patch verification without restricting them to a specific version [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

### Which official Oracle graphical user interface tool is available for step by step interactive database upgrades?

The Database Upgrade Assistant (DBUA) provides an interactive graphical user interface to guide database administrators step by step through the database upgrade workflow [1]. DBUA automates prerequisite checks, database configuration updates, and postupgrade verification through a visual wizard [1]. The official documentation presents DBUA as a supported upgrade option in the Oracle Database 19c Database Upgrade Guide [1].

**Kaynaklar:** [Oracle for SAP Cloud and Infrastructure Update](https://www.oracle.com/a/ocom/docs/oracle-sap-cloud-infrastructure-update.pdf)

## 4. Bölüm: Storage, ASM and Capacity Management

### How do ASM External, Normal, and High Redundancy models protect database files across Failure Groups?

External Redundancy provides no mirroring within ASM and delegates data protection entirely to underlying hardware RAID controllers or SAN hardware [1]. Normal Redundancy implements 2-way mirroring requiring at least two Failure Groups, while High Redundancy implements 3-way mirroring across at least three Failure Groups [1]. High Redundancy is standard for mission-critical IFS setups requiring maximum fault tolerance [1]. The sources detail these ASM redundancy models for IFS Applications (IFS Cloud, IFS Applications 10/9) without a specific database version limit [1].

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### How does ASM coarse grained striping operate and which database file types use this striping method?

ASM Coarse-Grained Striping allocates data across member disks using full Allocation Units typically sized between 1 MB and 4 MB or larger [1]. It is designed for large sequential I/O operations where reading or writing contiguous data chunks maximizes throughput [1]. Target file types for coarse-grained striping include database data files, index tablespaces, temporary files, and RMAN backup sets [1]. The sources describe Coarse-Grained Striping for IFS Applications environments without restricting it to a specific database version [1].

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### How does ASM fine grained striping subdivide Allocation Units and what database file types benefit from it?

ASM Fine-Grained Striping subdivides Allocation Units into smaller 128 KB stripe sets distributed across all disks in a disk group [1]. It optimizes small-payload write operations to minimize I/O latency and spread rapid concurrent writes across physical devices [1]. Target files utilizing fine-grained striping include Online Redo Logs (ORLs), Control Files, and Flashback Logs [1]. The sources outline Fine-Grained Striping for IFS Applications workloads without specifying a version restriction [1].

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### How is Oracle Partitioning supported in IFS Cloud environments and what table partitioning strategies are available?

Official IFS Cloud technical documentation confirms that Oracle Partitioning is supported ('Y') and verified for IFS Applications 9 & 10, covering table partitioning along with global and local index partitions . Oracle Database provides Range Partitioning for time-series data like audit logs, List Partitioning for discrete values like regional site codes, and Hash Partitioning to prevent I/O hotspots . However, the sources do not provide step-by-step SQL code examples specifically demonstrating range or hash partition creation for IFS Cloud 25R1 . The absence of detailed IFS Cloud 25R1 partitioning code samples is explicitly noted as not covered in the selected sources .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### What SQL query is executed against the ASM instance to calculate total storage capacity and percentage space utilization across mounted disk groups?

Database administrators connect to the ASM instance (+ASM) and query the V$ASM_DISKGROUP view to retrieve total_mb and free_mb columns for each mounted disk group . By calculating ROUND((1 - (free_mb / total_mb)) * 100, 2), DBAs determine the exact percentage utilization across DATA and RECO groups . This query allows administrators to establish baseline metrics before setting physical disk threshold alerts . The sources outline this ASM query for IFS Applications (IFS Cloud, IFS Applications 10/9) without specifying a version restriction .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### What is the primary operational role of the DATA disk group in Oracle Automatic Storage Management (ASM) and what database assets does it house?

The DATA disk group serves as the primary operational storage area housing active data files, index tablespaces, system tablespaces (SYSTEM and SYSAUX), temporary files, and online redo log groups . It prioritizes high read and write IOPS performance to process active IFS mid-tier transactions . This disk group layout ensures that active transaction processing runs with high efficiency . The sources describe this DATA disk group configuration for IFS Applications (IFS Cloud, IFS Applications 10/9) without stating a specific database version restriction .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### What is the purpose of the RECO disk group and why are recovery files isolated from primary database files?

The RECO (or FRA) disk group acts as the dedicated recovery storage area storing archive logs, RMAN backup sets, control file copies, Flashback logs, and multiplexed copies of online redo logs . Isolating recovery files from the DATA disk group prevents heavy backup or archiving operations from competing for disk bandwidth with primary data transactions . This isolation maintains core OLTP performance while guaranteeing recovery capabilities . The sources outline this RECO disk group architecture for IFS Applications (IFS Cloud, IFS Applications 10/9) without imposing a database version constraint .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### What operational roles do 85 percent warning and 95 percent critical storage alert thresholds serve in Oracle Enterprise Manager (OEM)?

OEM warning thresholds set at 85% capacity utilization alert DBAs to investigate growing data files and plan storage expansions during regular maintenance windows . Critical thresholds set at 95% capacity utilization signify urgent storage pressure requiring immediate administrative intervention to prevent out-of-space transaction halts . Tablespace thresholds monitor logical space in data files, whereas ASM disk group thresholds monitor physical free space across shared storage pools like DATA and RECO . The sources describe this alert threshold architecture for IFS Applications without stating a database version constraint .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### Which PL/SQL package and dictionary view are used to programmatically configure and verify tablespace warning and critical thresholds?

Database administrators programmatically configure tablespace warning and critical thresholds using the DBMS_SERVER_ALERT.SET_THRESHOLD procedure with the TABLESPACE_SPACE_USAGE metric . Warning parameters are set to 85 percent and critical parameters to 95 percent for specified tablespaces . DBAs verify registered threshold settings by querying the DBA_THRESHOLDS data dictionary view . The sources present this PL/SQL threshold procedure for Oracle databases without placing a version constraint on its usage .

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

### Which dynamic performance views do database administrators query inside an ASM instance to inspect file striping and disk group usage?

Database administrators query V$ASM_FILE and V\(ASM_ALIAS views while connected to the ASM instance (+ASM) to verify whether specific database files use fine or coarse striping [1]. Disk group capacity metrics, total megabytes, free space, and redundancy models are inspected by querying the V\)ASM_DISKGROUP view. These views allow DBAs to monitor disk utilization percentages across DATA and RECO groups. The official Oracle documentation documents these ASM views for Oracle Database 19c.

**Kaynaklar:** Disk Group Architecture (DATA & RECO)

## 5. Bölüm: RAC and Grid Infrastructure

### How do Fast Application Notification (FAN) events and Oracle Notification Service (ONS) assist integrated client connection pools?

Fast Application Notification (FAN) publishes real time notifications regarding cluster state changes such as UP and DOWN events for nodes, services, and instances [1]. Beginning with Oracle Database 12c Release 2 (12.2), all clients use Oracle Notification Service (ONS) to receive FAN events [1]. Integrated connection pools subscribe to ONS to immediately clean up dead physical connections during outages, eliminating TCP/IP timeout hangs [1]. The sources specify ONS usage as standard for all clients starting with Oracle Database 12c Release 2 (12.2) [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### How do private Interconnect network connectivity and Cache Fusion function together in Oracle RAC?

The private Interconnect is a dedicated high speed network that connects all servers in an Oracle RAC cluster [1]. Cache Fusion transfers database blocks directly between instance SGA memory caches across the Interconnect without writing updates to disk [1]. Direct cross node memory transfer reduces disk I/O latency during transaction processing [1]. The sources describe Cache Fusion and Interconnect mechanics without placing a version restriction on them [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### How do runtime connection load balancing goals work in conjunction with the Load Balancing Advisory?

The Load Balancing Advisory generates performance metrics and recommendations based on service quality or throughput [1]. Service runtime connection load balancing goals are configured using SRVCTL with -rlbgoal SERVICE_TIME or THROUGHPUT, alongside -clbgoal SHORT or LONG [1]. Integrated client pools use these advisory FAN events to direct incoming work requests to the least loaded instances [1]. The sources detail these load balancing parameters for Oracle RAC without stating a specific version limit [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### How does High Availability IP (HAIP) technology protect the private Interconnect in Oracle RAC?

High Availability IP (HAIP) utilizes redundant network interface cards (NICs) across multiple physical adapters to ensure continuous Interconnect connectivity [1]. It guarantees high throughput for internal cluster heartbeats and Cache Fusion memory transfers [1]. If an Interconnect NIC fails, HAIP prevents network outages and keeps Cache Fusion active without session disruption [1]. The sources present HAIP functionality for Oracle RAC environments without restricting it to a single database version [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### How does Single Client Access Name (SCAN) handle incoming client connection requests across cluster nodes?

Single Client Access Name (SCAN) provides a single network name resolving to three IP addresses that remain constant throughout the life of the cluster [1]. Incoming client connections are load balanced across the three SCAN listeners, which redirect requests to local listeners on appropriate nodes [1]. In Oracle Real Application Clusters 12c Release 2 (12.2), SCAN listeners were enhanced to support HTTP protocol awareness for redirecting HTTP clients across nodes [1]. The sources document SCAN routing behavior, noting the HTTP redirection enhancement specifically for Oracle Database 12c Release 2 (12.2) [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### How does every database instance operate in an Oracle RAC active active node clustering environment?

In an Oracle RAC active active node clustering environment, every node runs its own set of System Global Area (SGA) memory structures and background processes [1]. All nodes actively accept connections and process concurrent transactions from IFS mid-tier application server pools [1]. All cluster instances read from and write to the same shared database files hosted on Oracle Automatic Storage Management (ASM) disk groups [1]. The sources do not state a specific database version constraint for these active active clustering principles [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### What is the primary operational role of Cluster Synchronization Services (CSS) within Oracle Grid Infrastructure?

Cluster Synchronization Services (CSS) manages node membership in the cluster and continuously detects node responsiveness [1]. If a node fails or loses network communication with the rest of the cluster, CSS handles node eviction to prevent split brain scenarios [1]. This eviction mechanism preserves overall cluster health and data consistency [1]. The sources outline these CSS membership functions without imposing a specific database version limit [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### What is the role of the Global Resource Directory (GRD) in maintaining cache consistency across RAC nodes?

The Global Resource Directory (GRD) tracks the state, location, and lock status of every cached data block across all active nodes [1]. Global Cache Service (GCS) and Global Enqueue Service (GES) processes coordinate memory buffers and enqueues within the GRD to prevent dirty reads [1]. The memory required by the GRD and Cache Fusion components consumes approximately 10 percent of the total SGA [1]. The sources document these GRD specifications for Oracle RAC without specifying a version restriction [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Which dynamic performance views are queried to verify private Interconnect network settings across RAC instances?

Database administrators query V$CLUSTER_INTERCONNECTS and V\(CONFIGURED_INTERCONNECTS to inspect private Interconnect interface names, IP addresses, and configuration sources [1]. Querying the global GV\)CLUSTER_INTERCONNECTS view retrieves interconnect entries across all active instances in the cluster simultaneously [1]. These views allow DBAs to verify that Cache Fusion traffic flows over private network adapters [1]. The official Oracle documentation documents these interconnect performance views for Oracle Database 19c [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

### Which high availability resources are managed by Cluster Ready Services (CRS) in Oracle Clusterware?

Cluster Ready Services (CRS) manages high availability resources including Virtual IPs (VIPs), Single Client Access Name (SCAN) listeners, database instances, and services [1]. It automatically restarts failed resources or relocates them across healthy cluster nodes [1]. Configuration data for these managed resources is stored in the Oracle Cluster Registry (OCR) [1]. The sources present these CRS management functions without specifying a database version restriction [1].

**Kaynaklar:** [Real Application Clusters Administration and Deployment Guide - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/racad/real-application-clusters-administration-and-deployment-guide.pdf)

## 6. Bölüm: Data Guard, MAA Standards and Failover Operations

### How does Oracle Data Guard Fast Start Failover (FSFO) automate recovery and what prerequisite feature is mandatory?

Fast Start Failover (FSFO) uses an independent Observer process to monitor primary database health and execute automatic failover if the primary becomes unreachable. When primary connectivity is lost and the FastStartFailoverThreshold expires, the Observer automatically promotes the standby database. Enabling Flashback Database on both primary and standby databases is strictly mandatory for FSFO operation. The sources describe FSFO mechanics and Flashback prerequisites without imposing a specific database version restriction.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### How does Real Time Redo Apply differ from traditional archive log apply and how does it optimize RPO and RTO?

Under Real Time Redo Apply, the Log Network Server (LNS) process on the primary transmits redo directly to the Remote File Server (RFS) process on the standby, writing immediately to SRLs. The Managed Recovery Process (MRP0) applies redo directly from SRLs to memory and disk, eliminating lag associated with waiting for log switches. This continuous apply mechanism achieves zero data loss (RPO = 0) and rapid failover (RTO < 5 minutes) for IFS Applications workloads. The sources describe Real Time Apply mechanics for Oracle Database 19c and IFS Applications enterprise environments.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### How is the ORA 16698 error resolved when starting the Data Guard Broker in an Oracle Database 19c environment?

The ORA 16698 error occurs when the manual LOG_ARCHIVE_DEST_n parameter contains a SERVICE attribute before starting the broker. To resolve the conflict, administrators clear manual archive destinations using ALTER SYSTEM SET LOG_ARCHIVE_DEST_2='' SCOPE=BOTH SID='*'. After clearing manual destinations, the Data Guard Broker is initialized by setting ALTER SYSTEM SET DG_BROKER_START=TRUE SCOPE=BOTH SID='*'. The architecture notes document these specific commands and resolution steps for Oracle Database 19c.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### What are the core differences between the Bronze, Silver, Gold, and Platinum tiers in the Oracle Maximum Availability Architecture (MAA) framework?

The Bronze tier provides single instance database recovery using backups, while the Silver tier adds local high availability with Oracle RAC. The Gold tier combines local RAC clustering with a remote Oracle Data Guard or Active Data Guard physical standby database to achieve RPO = 0 and RTO < 1 minute. The Platinum tier extends Gold architecture by adding Oracle GoldenGate active active replication and Edition Based Redefinition for zero downtime maintenance. The architecture notes present Gold architecture for Oracle Database 19c, while official Oracle documentation requires Oracle AI Database 26ai or higher for Platinum Option 1.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### What are the fundamental differences between a planned Data Guard switchover and an emergency failover operation?

A planned switchover is a reversible, two way role transition between primary and standby databases that guarantees zero data loss (RPO = 0) without requiring database recreation. An emergency failover is an irreversible, one way transition triggered during catastrophic primary failure to promote the standby to the primary role. In Maximum Performance mode, an ungraceful failover may incur data loss (RPO > 0) due to unapplied redo logs. The sources present these role transition definitions without restricting them to a single database version.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### What configuration rules govern the setup of Standby Redo Logs (SRLs) in an Oracle Data Guard physical standby environment?

Standby Redo Logs (SRLs) must be created on both primary and standby databases to support role transitions seamlessly. Each SRL file must be sized to match the Online Redo Logs (ORLs) of the primary database exactly. The minimum number of SRL groups required per thread is calculated using the formula (ORL groups per thread + 1). The sources outline these SRL sizing rules for Oracle Data Guard physical standby setups without specifying a database version limit.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### What performance benefits does Active Data Guard offer when opening a physical standby database in Read Only mode?

Active Data Guard allows a physical standby database to remain open in READ ONLY mode while the Managed Recovery Process (MRP0) applies redo in real time. Heavy analytical reporting, financial queries, and external BI integrations are offloaded to the standby instance. Offloading query workloads frees CPU and I/O capacity on the primary database to optimize core OLTP transaction performance for IFS Applications. The sources detail Active Data Guard offloading for Oracle Database 19c and IFS Applications workloads.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### What technical guidance do the selected sources provide regarding Oracle Database@Azure cloud network peering and TDE key replication for Data Guard?

The selected sources do not contain technical network peering steps or TDE vault replication procedures for Oracle Database@Azure cloud deployments. The available sources focus on on-premise and general MAA Data Guard architecture, switchover runbooks, and replication lag thresholds. The absence of specific Oracle Database@Azure configuration procedures is explicitly noted as not covered in the selected sources.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### Which dynamic performance views are queried to verify Data Guard database roles, MRP0 process status, and apply lag?

Database roles and open modes are verified by querying the database_role and open_mode columns in the V$DATABASE view. The status of the Managed Recovery Process (MRP0) is checked by querying the V\(MANAGED_STANDBY view. Replication lag metrics including apply lag and transport lag are monitored through the V\)DATAGUARD_STATS view. The sources outline these verification views for Oracle Data Guard 19c administration.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

### Which exact SQL commands are executed in sequence to open a physical standby database in Active Data Guard Read Only mode?

First, administrators execute ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL to stop active recovery. Next, the database is opened using ALTER DATABASE OPEN. Finally, real time apply is resumed by executing ALTER DATABASE RECOVER MANAGED STANDBY DATABASE USING CURRENT LOGFILE DISCONNECT. The sources document this exact SQL command sequence for Active Data Guard without specifying a database version constraint.

**Kaynaklar:** Automated Switchover & Failover Runbooks, Gold & Platinum MAA Standards Implementation, RPO & RTO High Availability Optimization, Real-Time Replica Synchronization, CPU Utilization & Data Guard Lag Thresholds, [Maximum Availability Architecture(MAA): - Oracle E-Business Suite Release 12](https://www.oracle.com/technetwork/articles/oem/298391-132409.pdf), [Oracle Data Guard Concepts and Administration, 19c](https://docs.oracle.com/en/database/oracle/oracle-database/19/sbydb/)

## 7. Bölüm: Application Continuity and Resilience

### How are Fast Connection Failover (FCF) and Oracle Notification Service (ONS) configured to detect database outages in IFS Applications midtier environments?

Enterprise IFS Applications deployments utilize Fast Connection Failover (FCF) integrated with Oracle Notification Service (ONS) to detect database node outages instantly [1]. ONS broadcasts real-time FAN events across default port 6200 when instance or service state changes occur [1]. In JDBC Universal Connection Pool (UCP) configurations, FCF is enabled by setting fastConnectionFailoverEnabled to true and specifying SCAN-based ONS nodes [1]. The sources outline these FCF and ONS configuration steps for IFS midtier re-connection testing without restricting them to a specific database version [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### How are side effects handled during replay in Transparent Application Continuity versus manual Application Continuity?

Transparent Application Continuity automatically detects statements with external side effects such as sending email or accessing external URLs and disables replay capture during their execution [1]. Manual Application Continuity allows developers to customize side effect replay or manually disable replay for a request using the disableReplay API in the ReplayableConnection interface [1]. Disabling replay on a connection prevents duplicate execution of unrecoverable external actions following a failover [1]. The sources describe these side effect handling mechanisms for Oracle Database 18c and Oracle Database 19c [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### How does server side session draining operate during planned database maintenance?

Before planned maintenance begins, the database or administrator issues a FAN planned-down event, signaling FAN-aware connection pools to stop issuing new requests on target instances [1]. Active sessions are allowed to finish their executing work within a designated drain_timeout period before the connection is closed [1]. Starting with Oracle Database 18c, the server itself intercepts connection tests and inspects session boundaries to safely drain sessions even without client pool intervention [1]. If work does not complete within the drain_timeout, the stopoption IMMEDIATE terminates remaining sessions to initiate failover [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### How does the failover_restore parameter behave in Oracle Database 19c when failovertype AUTO is configured on a database service?

When -failovertype AUTO is assigned to a service in Oracle Database 19c, the -failover_restore parameter is automatically set to AUTO [1]. This setting automatically restores common initial session states such as NLS settings, time zones, and session context when establishing a new connection on a surviving instance [1]. This automatic restoration prevents application errors caused by lost session environment settings following an outage [1]. The sources present this automatic setting behavior specifically for Oracle Database 19c [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### How is a Data Guard switchover failover test validated from an IFS Applications midtier application server?

To test failover logic, the IFS midtier data source URL is configured with SCAN addresses and ONS configuration properties [1]. An administrator executes the SWITCHOVER TO command in Data Guard Broker (DGMGRL) to swap primary and standby database roles [1]. Midtier log files are then monitored to verify that ONS FAN events were received, broken physical connections were discarded, and active SQL sessions re-attached to the newly promoted primary database without manual restart [1]. The sources document these switchover validation steps in the IFS midtier re-connection testing guide [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### How is a database service configured for Transparent Application Continuity using the srvctl tool in Oracle RAC?

Using the srvctl tool, Transparent Application Continuity is enabled by setting the service attribute -failovertype AUTO [1]. To ensure full resilience, administrators also configure -failover_restore AUTO to restore session state, -commit_outcome TRUE to activate Transaction Guard, and -notification TRUE to publish FAN events [1]. Parameters such as -failoverretry 30 and -failoverdelay 10 manage reconnection attempts during service relocation or failover [1]. The srvctl syntax and service parameter definitions apply to Oracle Database 18c and Oracle Database 19c deployments [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### What is the main difference between Transparent Application Continuity (TAC) and manual Application Continuity (AC), and in which version was TAC introduced?

Transparent Application Continuity (TAC) transparently tracks and records session and transactional state without requiring code changes or explicit request boundaries [1]. Manual Application Continuity (AC) requires explicit request boundary declarations, such as beginRequest and endRequest API calls in Java applications [1]. TAC was introduced in Oracle Database 18c and is supported in Oracle Database 19c, whereas manual AC is available starting with Oracle Database 12c Release 1 (12.1) for Java thin drivers [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### Which connection string parameters are recommended to prevent timeout hangs and login storms during client failover?

Recommended JDBC thin driver connection strings include CONNECT_TIMEOUT, RETRY_COUNT, RETRY_DELAY, and FAILOVER=ON [1]. Setting RETRY_COUNT and RETRY_DELAY allows the client driver to retry connections repeatedly while a service relocates during planned maintenance or failover [1]. Adding TRANSPORT_CONNECT_TIMEOUT, introduced in Oracle Database Release 12.1.0.2, prevents client sessions from hanging on un-responsive network addresses [1]. The sources describe these connection descriptor parameters for Oracle Database 12c Release 1 and later drivers [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### Which database component is mandatory for enabling Application Continuity, and how does it prevent duplicate transaction execution following an outage?

Application Continuity strictly requires Transaction Guard to be enabled on the database service by setting COMMIT_OUTCOME=TRUE [1]. Transaction Guard assigns a globally unique Logical Transaction ID (LTXID) to every user request to verify whether an in-flight transaction committed before an outage occurred [1]. By checking the commit outcome using the LTXID during failover, Transaction Guard prevents completed transactions from being replayed multiple times [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

### Which dynamic performance views and metrics are used to measure protection levels under Application Continuity?

Protection levels under Application Continuity are monitored using statistics in V\(SESSTAT, V\)SYSSTAT, and V\(SERVICE_STATS views, which are also stored in Automatic Workload Repository (AWR) reports [1]. Key metrics include cumulative begin requests, cumulative end requests, cumulative user calls in requests, and cumulative user calls protected [1]. An application is fully protected when cumulative user calls protected equals cumulative user calls in requests and the values are greater than zero [1]. Monitoring via V\)SERVICE_STATS is documented specifically for Oracle Database 19c and later versions [1].

**Kaynaklar:** [28 Application Continuity for Java - Database - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/19/jjdbc/application-continuity.html)

## 8. Bölüm: Performance Management and Tuning

### How do database administrators inspect the actual runtime execution plan and row counts of a cached SQL statement in memory?

Database administrators retrieve actual cached execution plans by executing the DBMS_XPLAN.DISPLAY_CURSOR function with the format parameter set to ALLSTATS LAST for a target SQL ID [1]. This output displays the actual execution steps along with Estimated Rows (E-Rows) and Actual Rows (A-Rows) for each operation [1]. Large discrepancies between estimated and actual row counts signal stale or missing table statistics that require gathering fresh statistics with DBMS_STATS [1]. The sources describe this execution plan profiling workflow for Oracle Database 19c and IFS Applications workloads [1].

**Kaynaklar:** [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### How do sga_target, pga_aggregate_target, open_cursors, and processes parameters prevent database memory and capacity failures?

Setting sga_target enables Automatic Shared Memory Management (ASMM) to dynamically allocate memory to the Buffer Cache and Shared Pool, preventing hard parses and disk I/O bottlenecks [1]. The pga_aggregate_target parameter manages session work areas for sorts and hash joins, preventing excessive temporary tablespace spilling during batch jobs [1]. Proper tuning of processes prevents ORA-00020 connection rejection errors, while open_cursors prevents ORA-01000 cursor leak errors in Java connection pools [1]. The sources detail these parameter tuning functions for IFS Applications (IFS Cloud and IFS Applications 10/9) without specifying a version restriction [1].

**Kaynaklar:** [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### How does Active Session History (ASH) sampling work in memory, and how does it differ from hourly AWR snapshots?

Active Session History (ASH) samples active session state and wait event data every second directly into the SGA ring buffer (v$active_session_history) [1]. Unlike hourly AWR snapshots that average performance metrics over longer intervals, ASH captures short-lived, transient I/O spikes, locking conflicts, and runaway SQL executions in real time [1]. The MMON background process periodically flushes in-memory ASH samples to disk tables (dba_hist_active_sess_history) for historical analysis [1]. The sources describe ASH sampling mechanics for Oracle databases without placing a version constraint on its usage [1].

**Kaynaklar:** [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### How does the Automatic Database Diagnostic Monitor (ADDM) analyze database performance bottlenecks and make proactive recommendations?

The Automatic Database Diagnostic Monitor (ADDM) automatically evaluates performance metrics between consecutive AWR snapshots by focusing on total DB Time [1]. Using a top-down tree structure, it analyzes system performance from high-level CPU and wait-time distributions down to specific SQL statements, schema objects, and hardware resources while ruling out non-problem areas [1]. It then generates prioritized tuning recommendations covering infrastructure adjustments, database parameter modifications, and SQL optimizations for IFS Applications workloads [1]. The sources describe ADDM mechanics without specifying a database version restriction [1].

**Kaynaklar:** ADDM Report Analysis & Proactive Recommendations

### What causes row level locking enqueue contention in IFS Applications, and how is it identified using wait events?

Row level locking enqueue contention is identified by the enq: TX - row lock contention wait event when sessions attempt to modify rows locked by uncommitted transactions [1, 2]. In IFS Applications environments, this contention typically occurs during concurrent updates to customer orders, inventory balances, or financial ledgers without proper application level queuing [2]. The session holding the row lock must issue a COMMIT or ROLLBACK to release the TX enqueue and allow waiting sessions to proceed [1, 2]. The sources outline this row lock enqueue behavior for Oracle Database 18c and 19c enterprise workloads [1, 2].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### What is the relationship between DB Time and Elapsed Time in AWR reports, and what does it indicate when DB Time exceeds Elapsed Time?

In AWR reports, Elapsed Time measures wall-clock time between snapshots, whereas DB Time represents the cumulative active time spent by user sessions on CPU and non-idle wait events [1]. When DB Time significantly exceeds Elapsed Time during a peak operational window, it indicates high concurrency and severe resource or locking contention across database threads [1]. Tracking per-second metrics alongside DB Time helps database administrators identify whether bottlenecks stem from OLTP transaction spikes or unoptimized full table scans in IFS Applications [1]. The sources present these AWR performance metrics for IFS Applications (IFS Cloud and IFS Applications 10/9) without a specific database version limit [1].

**Kaynaklar:** AWR Performance Metrics Interpretation

### What reference information is provided in Section C.3 Descriptions of Wait Events in the official Oracle Database 18c Reference documentation?

Section C.3 Descriptions of Wait Events in the Oracle Database 18c Reference serves as a comprehensive catalog describing why database processes pause during execution [1]. It details operational causes, wait time durations, and parameter definitions for I/O waits, buffer cache locks, enqueue events, and cluster communication [1]. DBAs query the V$EVENT_NAME view or consult this section to interpret system wait statistics during performance troubleshooting [1]. The official Oracle documentation documents this wait event reference catalog specifically for Oracle Database 18c [1].

**Kaynaklar:** AWR Performance Metrics Interpretation

### What wait events indicate mutex and latch contention in the Shared Pool and Library Cache during heavy query parsing?

Mutex and latch contention during heavy SQL parsing is indicated by wait events such as cursor: mutex S, cursor: mutex X, cursor: pin S wait on X, cursor: pin X, and library cache: mutex X [1]. These wait events occur when high volume mid-tier connections generate excessive hard parsing or execute unshared SQL statements that hammer shared pool hash buckets [1, 2]. Holding exclusive mutexes or latches blocks concurrent sessions from accessing or updating cursor objects in memory [1, 2]. The sources document these cursor and library cache wait events in the Oracle Database 18c reference catalog [1].

**Kaynaklar:** AWR Performance Metrics Interpretation, [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html)

### Which AWR report script is used to compare performance baseline metrics before and after applying an Oracle Release Update patch?

Database administrators generate AWR Compare Period reports using the awrddrpt.sql script for single-instance databases or awrddrpi.sql for Oracle RAC environments to evaluate system stability after applying an Oracle Release Update [1]. The report provides side-by-side metric comparisons between equal-duration baseline and post-patch snapshot windows [1]. DBAs analyze load profile changes, top wait event shifts, SQL execution plan changes, and CPU or memory utilization to detect performance regressions [1]. The sources present this AWR comparison workflow for Oracle Database 19c and IFS Applications environments [1].

**Kaynaklar:** ADDM Report Analysis & Proactive Recommendations

### Why can an increase in the db file sequential read wait event indicate an unselective or improper index usage rather than a missing index?

The db file sequential read wait event captures single-block read operations, which occur when traversing B-tree index structures or fetching table rows via ROWID [1, 2]. When a query predicate is unselective and matches a large percentage of rows in a table, using an index forces Oracle to perform thousands of individual single-block I/O reads rather than a multi-block scan [1]. This unselective index traversal creates severe disk read bottlenecks that are far more costly than a full table scan [1]. The sources describe these wait event mechanics for Oracle Database 18c and 19c reference environments [1, 2].

**Kaynaklar:** [C.3 Descriptions of Wait Events - Oracle Help Center](https://docs.oracle.com/en/database/oracle/oracle-database/18/refrn/descriptions-of-wait-events.html), AWR Performance Metrics Interpretation

## 9. Bölüm: Monitoring, Alerting and Incident Management

### How are OEM Incident Rule Sets and Blackout calendars configured to manage notification routing and suppress false alarms?

Incident Rule Sets define automated responses based on target criteria, sending email alerts, executing corrective OS scripts, or creating external support tickets [1]. Administrative Blackout calendars temporarily pause metric collection and alert generation during scheduled maintenance windows [1]. Suppressing alerts during maintenance prevents false alarms from flooding operation teams during routine IFS environment updates [1]. The sources describe these rule sets and blackout calendars for OEM monitoring without restricting them to a single database version [1].

**Kaynaklar:** screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf

### How are messaging pipelines and active subscribers managed using the Oracle Queues interface in IFS Cloud 26R2?

The Oracle Queues page in Solution Manager allows administrators to start, stop, and clean up asynchronous Oracle Advanced Queuing message tables. The Oracle Queue Subscribers view lists active queue consumers and allows supervisors to remove obsolete subscriber entries safely. Managing these queues ensures smooth background message flow and data streaming across IFS modules. The sources present these Oracle Advanced Queuing management pages specifically for IFS Cloud 26R2.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### How do Application Monitoring Metrics (AMM) and the Application Monitoring Console (AppMon) evaluate health statuses in IFS Cloud 26R2?

Application Monitoring Metrics (AMM) evaluate raw diagnostic data against threshold expressions to produce OK, Warning, Critical, or Unknown status codes. The Application Monitoring Console (AppMon) in Solution Manager visualizes these metric statuses and provides a Show Alarms Only filter to isolate failing items. The Foundation1 Monitoring scheduled task runs daily to update metric statuses across application components. The sources outline AMM concepts and the AppMon console specifically for IFS Cloud 26R2.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### How does Streams functionality in IFS Cloud 26R2 notify users when background jobs and scheduled tasks complete?

Streams functionality sends notifications via the Transaction_SYS.Process_All_Pending scheduler when Transaction_SYS.Deferred_Call single-run jobs or Batch_SYS.New_Batch_Schedule tasks finish. Notifications are enabled using the stream_msg_on_completion_ and stream_notes_ parameters during job creation. Developers can customize notification messages using the Transaction_SYS.Modify_Stream_Notification Hooking API. The sources detail Streams notification mechanics specifically for IFS Cloud 26R2.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### How does the Response Time Detail View Dashboard in Kibana display projections and entities performance metrics?

The Response Time Detail View Dashboard in Kibana displays execution metrics for projections and entities once log data views are established. The dashboard automatically sorts performance records from slowest response times to fastest response times. Ordering metrics by response duration enables technical teams to identify and troubleshoot slow running operations quickly. The sources document this Kibana dashboard feature specifically for IFS Cloud 25R1.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### How does the promotion logic from metric Events to actionable Incidents work within the OEM event management architecture?

Oracle Management Agents continuously sample target metrics and generate an Event whenever a performance indicator crosses a warning or critical threshold [1]. An Incident Rule Set evaluates the incoming Event and automatically promotes it to an Incident if it requires administrative intervention [1]. Promoting Events to Incidents ensures that technical teams track and resolve high priority operational problems systematically [1]. The sources outline this event promotion lifecycle for OEM monitoring without placing a version restriction on it [1].

**Kaynaklar:** screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf

### What are the core operational roles of OMS, OMR, and OMA infrastructure components within Oracle Enterprise Manager (OEM) Cloud Control?

Oracle Management Service (OMS) is a WebLogic based middle-tier application that processes incoming telemetry and serves the Cloud Control management console. Oracle Management Repository (OMR) is a dedicated Oracle database storing configurations and metric histories within the SYSMAN schema. Oracle Management Agent (OMA) runs as a standalone process on managed target nodes to gather performance metrics and upload them to OMS over TCP port 3872. The sources describe these infrastructure components for OEM 13c/14c setups without specifying a database version restriction.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### What components comprise the EFK logging stack in IFS Cloud 25R1 Remote Deploy environments and how long are log records retained?

In IFS Cloud 25R1 Remote Deploy environments, log monitoring is implemented using an EFK logging stack composed of Elasticsearch, Fluentd, and Kibana. Fluentd collects container and application logs across nodes, while Elasticsearch stores log data for a mandatory seven-day retention cycle. A daily curator cronjob automatically deletes indices older than seven days to manage storage capacity. The sources present this EFK logging stack specifically for IFS Cloud 25R1 Remote Deploy deployments.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### Which administrative actions and agent lifecycle management operations are performed using the emctl command line utility?

The emctl command line utility is used on the OMS host to stop, start, or check the status of WebLogic middle-tier services and repository connections. On target nodes, administrators use emctl status agent to verify agent health and ping connectivity to the OMS server. Running emctl upload agent forces immediate metric uploads to OMS, while emctl secure agent synchronizes security certificates across nodes. The sources present these emctl command functions for OEM 13c/14c agent administration without imposing a specific version limit.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

### Which default log categories and retention settings are managed within the Server Alert Log Categories page in IFS Cloud 26R2?

The Server Alert Log Categories page allows administrators to configure categories including Ddl Audit, Debug, Deployment, Event errors, Server Errors (ORA errors), and Sql Injections. Each log category features an Enable toggle, a Cleanup toggle, and a configurable Days to keep retention setting. Managing these category settings enables administrators to capture server side errors while automatically purging aged logs to preserve space. The sources document these alert log categories specifically for IFS Cloud 26R2.

**Kaynaklar:** OEM 13c/14c Infrastructure Setup, OEM Agent Administration across Nodes, Automated Incident Rule sets & Notifications, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-010-response-time-detail-view-dashboard-2026-11-08-09_29_51.pdf, screencapture-docs-ifs-techdocs-25r1-070-remote-deploy-010-installing-fresh-system-030-preparing-server-54-log-monitoring-2026-11-08-09_27_30.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-047-database-alert-log-categories-2026-11-08-10_11_21.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-120-app-mon-console-2026-11-08-10_12_26.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-about-streams-background-jobs-2026-11-08-10_13_04.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-2026-11-08-10_09_39.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-008-metrics-details-2026-11-08-10_22_28.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-010-app-mon-metrics-concepts-2026-11-08-10_31_31.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-020-app-mon-100-app-mon-metrics-030-app-mon-metrics-2026-11-08-10_34_44.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-120-monitoring-080-oracle-queues-2026-11-08-10_35_49.pdf, screencapture-docs-ifs-techdocs-26r2-030-administration-140-system-info-and-util-022-system-performance-2026-11-08-10_40_05.pdf

## 10. Bölüm: Backup, Recovery and Operational Practice

### How can database administrators remap recovered tables to different schemas or tablespaces during RMAN table recovery?

During table recovery, administrators can use the REMAP TABLE clause to rename recovered tables or map them to a different schema in the target database [1]. The REMAP TABLESPACE clause imports recovered tables or table partitions into a target tablespace different from their original location [1]. Named constraints and indexes are not imported when using the REMAP TABLE or REMAP TABLESPACE options [1]. The sources describe these remapping options for RMAN table recovery operations [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### How does RMAN perform table level point in time recovery (PITR) using an auxiliary instance?

When executing the RECOVER TABLE command, RMAN automatically checks for sufficient space on the target host to store temporary files for an auxiliary instance [1]. It restores necessary backups to the auxiliary instance, recovers the specified tables to the target point in time, and generates a Data Pump export dump file [1]. By default, RMAN automatically imports the dump file into the target database unless the NOTABLEIMPORT clause is specified [1]. The sources present this automated table recovery process for Oracle database administration [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### What RMAN commands were deprecated due to the deprecation of the Data Recovery Advisor (DRA) feature in Oracle Database 19c?

Starting in Oracle Database 19c, the Data Recovery Advisor (DRA) feature is deprecated [1]. This deprecation includes the deprecation of the LIST FAILURE, ADVISE FAILURE, REPAIR FAILURE, and CHANGE FAILURE RMAN commands [1]. Database administrators no longer have access to these commands, and there is no replacement feature for DRA [1]. The sources document this deprecation specifically for Oracle Database 19c [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### What administrative pre deployment checklist rule was established following the November 11, 2026 incident review?

Following an unexpected system outage reported during the 2026 incident preparation meeting, an administrative rule was added requiring verification of active background jobs prior to software deployment. The deployment checklist mandates confirming that no uncompleted or stuck batch jobs remain active before starting a release [1]. This pre deployment check prevents database objects from entering an INVALID state and avoids queue message backlogs during updates [1]. The incident review document details this rule for IFS software deployment procedures [1].

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx

### What database compatibility requirements govern duplicating a Pluggable Database (PDB) to an existing CDB using RMAN?

The DUPLICATE PLUGGABLE DATABASE command is used to duplicate a PDB to an existing CDB, a feature introduced in Oracle Database 18c [1]. To duplicate a PDB to an existing CDB, the COMPATIBLE initialization parameter on both the source CDB and destination CDB must be set to 18.0.0 or higher [1]. Additional prerequisites require both source and destination CDBs to use local undo, and the destination CDB must be open in read write mode [1]. The sources state these requirements specifically for Oracle Database 18c and higher [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### What is the recommended procedure for database point in time recovery when taking storage snapshots in Oracle Database 19c?

In Oracle Database 19c, the RECOVER SNAPSHOT TIME method of recovering a database to a point in time using a storage snapshot is deprecated [1]. Instead, Oracle recommends executing ALTER DATABASE BEGIN/END BACKUP before and after creating the storage snapshot of the data files on a running database [1]. Point in time recovery is then performed using RECOVER UNTIL TIME to a specific timestamp or SCN after the END BACKUP completion time [1]. Archived redo logs must be separately backed up and restored for recovery operations [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### What monitoring metric and alert threshold is recommended to detect message backlogs in Oracle Advanced Queues (AQ)?

When asynchronous processors hang, messages accumulate inside Oracle Advanced Queues (AQ) message tables [1]. Metric data for queue depth is gathered under the ifs_aq metric, and an AQ backlog alarm is recommended when ready message counts remain high for an extended period [1]. Defining an alert threshold for pending messages provides an early warning signal that background queue processors have stalled [1]. The incident review document outlines this AQ backlog signal for IFS Cloud infrastructure monitoring [1]. animate

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx

### What prerequisites and restrictions apply when performing RMAN FLASHBACK DATABASE on a Pluggable Database (PDB)?

To perform flashback operations on a PDB, the COMPATIBLE initialization parameter must be set to 12.2.0.0 or higher, and RMAN must connect to the root as a common user [1]. The target PDB must be closed during the flashback operation while other PDBs can remain open and operational [1]. Flashback operations on a proxy PDB are not supported in Oracle Multitenant environments [1]. The sources detail these PDB flashback prerequisites and restrictions for Oracle Database 12c Release 2 (12.2) and higher [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### What technical details do the selected sources provide regarding RMAN RECOVER TABLE options for Oracle AI Database 26ai?

The selected sources do not contain technical details, command syntax, or specific rules for RMAN RECOVER TABLE operations in Oracle AI Database 26ai [1]. The available documentation details table recovery parameters for Oracle Database 12c, 18c, and 19c releases [1]. The absence of Oracle AI Database 26ai table recovery specifications is explicitly noted as not covered in the selected sources [1].

**Kaynaklar:** [Oracle Database Backup and Recovery Reference - Oracle Help](https://docs.oracle.com/en/database/oracle//oracle-database/19/rcmrf/oracle-ai-database-backup-and-recovery-reference.pdf)

### Which read only SQL queries are recommended to inspect Oracle Scheduler jobs and alert logs during post incident reviews without requiring pack licenses?

To analyze Oracle Scheduler job execution history during post incident reviews, database administrators query the owner, job_name, status, actual_start_date, and run_duration columns from dba_scheduler_job_run_details [1]. Oracle alert log records containing ORA errors or deadlocks are queried from the v$diag_alert_ext view filtered by originating_timestamp [1]. These queries require no Oracle Diagnostics or Tuning Pack licenses and do not grant new privileges to monitoring users [1]. The sources present these read only queries in the post incident review preparation guidelines [1].

**Kaynaklar:** Kesinti incelemesi hazırlığı - 11.11.2026.docx
