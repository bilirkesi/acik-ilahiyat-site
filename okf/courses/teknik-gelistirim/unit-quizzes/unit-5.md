---
type: Quiz
title: "Ünite 5 quizi: RAC and Grid Infrastructure"
description: Teknik Gelişim 5. ünite için 12 soruluk quiz.
course: teknik-gelistirim
unit: 5
question_count: 12
status: stable
generated: { by: acik-ilahiyat-exporter/1.0, at: 2026-11-10T11:25:36Z }
resource: /courses/teknik-gelistirim/unit-quizzes/unit-5.md
---

# Ünite 5: RAC and Grid Infrastructure

Toplam 12 soru.

## 1. Which component of the Oracle Grid Infrastructure stack is specifically responsible for managing cluster node membership and executing node evictions to prevent split-brain scenarios?

*İpucu:* Think of the lower-level Clusterware daemon responsible for heartbeat monitoring and keeping nodes in sync.

A) Event Manager (EVM)
B) Global Enqueue Service Daemon (LMD)
C) Cluster Ready Services (CRS)
D) Cluster Synchronization Services (CSS) *

**Cevap anahtarı:** D

**Gerekçe (D):** CSS tracks node membership across the cluster and handles eviction if a node loses communication or becomes unresponsive to maintain cluster integrity.

## 2. How does Oracle RAC Cache Fusion share modified data blocks between active database instances in the cluster?

*İpucu:* Consider how inter-instance memory sharing avoids slow storage I/O operations.

A) By transmitting modified block updates over the public network via Virtual IP (VIP) addresses.
B) By converting block updates into SQL statements and broadcasting them via Oracle GoldenGate.
C) By forcing the holding instance to flush dirty blocks to ASM storage before the requesting node reads them.
D) By transferring data blocks directly memory-to-memory across a high-speed private Interconnect. *

**Cevap anahtarı:** D

**Gerekçe (D):** Cache Fusion transfers data block images directly between instance SGAs over the private Interconnect without incurring disk write latency.

## 3. What is the primary role of the Global Resource Directory (GRD) in an active-active Oracle RAC environment?

*İpucu:* Focus on the shared memory tracking mechanism that prevents conflicting block updates.

A) It routes client connections to the least-loaded database instance using TNS connection descriptors.
B) It tracks the state, location, and lock status of every cached data block across all cluster nodes. *
C) It acts as a lightweight log-forwarding service to asynchronous Data Guard standby databases.
D) It manages the physical space allocation of ASM disk groups across shared storage arrays.

**Cevap anahtarı:** B

**Gerekçe (B):** The GRD maintains global memory metadata to prevent dirty reads and guarantee transactional consistency across all active instances.

## 4. Which background process in Oracle RAC records data file statuses, manages global data block access, and transmits block images between instance buffer caches?

*İpucu:* Look for the process designated specifically for Global Cache Service (GCS) messaging.

A) LMON (Global Enqueue Service Monitor)
B) ACMS (Atomic Controlfile to Memory Service)
C) LMS (Global Cache Service Process) *
D) LCK0 (Instance Enqueue Process)

**Cevap anahtarı:** C

**Gerekçe (C):** The LMS process handles message flow and transfers block images directly between SGA buffer caches as part of Cache Fusion.

## 5. What primary recovery responsibility is assigned to the Global Enqueue Service Monitor (LMON) background process?

*İpucu:* Recall which daemon manages global enqueue health and responds when an entire instance crashes.

A) Scrubbing bad sectors on ASM disks periodically to repair corruption.
B) Intercepting bad client connection requests and re-routing them to surviving SCAN listeners.
C) Monitoring global resources across the cluster and managing recovery associated with instance deaths. *
D) Cleaning up dead client sessions and releasing uncommitted user transaction locks on local instances.

**Cevap anahtarı:** C

**Gerekçe (C):** LMON oversees cluster-wide health, handles instance death events, and orchestrates global resource reconfiguration following a failure.

## 6. Architecturally, how do storage requirements for an Oracle RAC database differ from a standard single-instance Oracle database?

*İpucu:* Think about why surviving nodes need full access to all database structures during instance recovery.

A) Redo log files must be stored locally on each node while data files are maintained on shared storage.
B) Oracle RAC databases require cloud storage remote mirroring for basic data block updates.
C) Each node in Oracle RAC must maintain an independent, mirrored copy of all data files on local non-networked storage.
D) All data files, control files, SPFILEs, and redo logs must reside on cluster-aware shared storage accessible by all nodes. *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle RAC uses a shared-everything storage model where every active instance must simultaneously access the shared set of database files.

## 7. Which two network communication protocols are supported for inter-instance messaging on the private Interconnect in Oracle RAC?

*İpucu:* Identify the low-latency network protocols designed specifically for interprocess communication (IPC).

A) Server Message Block (SMB) and Network File System (NFS)
B) User Datagram Protocol (UDP) and Reliable Data Socket (RDS) *
C) Transmission Control Protocol (TCP) and Hypertext Transfer Protocol (HTTP)
D) Fibre Channel Protocol (FCP) and Internet Small Computer System Interface (iSCSI)

**Cevap anahtarı:** B

**Gerekçe (B):** Oracle RAC supports both UDP and RDS protocols for high-speed inter-instance IPC communication across the private Interconnect.

## 8. According to the source documentation, how does Oracle RAC One Node operate differently from standard Oracle RAC during normal operation?

*İpucu:* Consider the key operational difference between active-active multi-instance clustering and active-passive single-instance deployment.

A) Oracle RAC One Node requires local disk storage instead of shared ASM disk groups.
B) Oracle RAC One Node does not utilize Oracle Grid Infrastructure or Clusterware daemons.
C) Oracle RAC One Node cannot perform rolling software maintenance across cluster nodes.
D) Oracle RAC One Node runs only a single active database instance on one node at a time. *

**Cevap anahtarı:** D

**Gerekçe (D):** Oracle RAC One Node is an active-passive failover solution that runs only one active instance under normal conditions, reducing memory overhead.

## 9. How do Oracle integrated clients leverage Fast Application Notification (FAN) events during an unplanned database node failure?

*İpucu:* Think about how application connection pools avoid waiting on hung socket connections when a server abruptly crashes.

A) They trigger an automatic switchover of the primary role to a secondary disaster recovery site.
B) They automatically repair block-level corruptions by requesting backup copies from the standby database.
C) They receive immediate state-change alerts to rapidly terminate dead connections and re-route connection pools. *
D) They initiate automated RMAN backup jobs on surviving cluster nodes to secure uncommitted transactions.

**Cevap anahtarı:** C

**Gerekçe (C):** FAN events immediately notify connection pools of DOWN events, avoiding TCP timeout delays and enabling rapid client connection failover.

## 10. What is the primary administrative purpose of the SYSRAC privilege introduced in Oracle Database 12c Release 2 (12.2)?

*İpucu:* Recall the security principle aimed at reducing excessive use of SYSDBA for routine cluster management.

A) To enforce separation of duties by allowing clusterware agents to connect without requiring full SYSDBA privileges. *
B) To allow external client applications to bypass Cache Fusion locking checks during bulk data loads.
C) To permit read-only analytical queries on Reader Nodes without generating redo entries.
D) To grant full operating system root access to database administrators during Clusterware installations.

**Cevap anahtarı:** A

**Gerekçe (A):** SYSRAC provides designated administrative privileges for Oracle RAC utilities (like SRVCTL) and Clusterware agents, eliminating reliance on SYSDBA.

## 11. Which action is taken by the Hang Manager (HM) background framework when a high-confidence database hang is detected in Oracle RAC?

*İpucu:* Focus on how Hang Manager resolves lock contention without requiring manual DBA intervention.

A) It analyzes process dependencies and automatically terminates the blocker process to preserve system availability. *
B) It dynamically allocates additional system RAM to the SGA to relieve memory pressure.
C) It evicts the node from the Grid Infrastructure cluster immediately to trigger instance recovery.
D) It immediately re-balances ASM disk extents across healthy storage failure groups.

**Cevap anahtarı:** A

**Gerekçe (A):** Hang Manager evaluates waiting sessions, identifies the root victim/blocker session, and terminates the blocker to resolve hangs automatically.

## 12. What benefit is provided by High Availability IP (HAIP) or Redundant Interconnect Usage within Oracle Grid Infrastructure?

*İpucu:* Consider how redundant physical network interface cards (NICs) are utilized for private cluster communication.

A) It provides active load balancing and seamless network failover across multiple physical NICs for Interconnect traffic. *
B) It converts active-active RAC instances into single-instance active-passive failover nodes.
C) It enables synchronous block replication between primary and standby databases over WAN distances.
D) It automatically routes external application connections to the least busy SCAN listener.

**Cevap anahtarı:** A

**Gerekçe (A):** HAIP/Redundant Interconnect manages multiple private network interfaces to increase throughput and guarantee high availability if an Interconnect NIC fails.
