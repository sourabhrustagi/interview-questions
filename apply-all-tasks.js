const fs = require("fs");
const path = require("path");

const htmlPath = "/Users/sourabh/Documents/resume/study-plan-44-weeks.html";
const html = fs.readFileSync(htmlPath, "utf8");
const PlanLogic = require("/Users/sourabh/Documents/resume/plan-logic.js");

const archTasks = {
  1: ["lead", "Describe the Personal Ledger API & Android architecture to a peer engineer", [
    "Walk through the Hexagonal architecture (domain core, ports, web inbound adapter, JPA outbound adapter) on a whiteboard or diagram",
    "Explain how Clean Architecture + MVVM on Android maps domain state to Compose UI without leaking Room entities or DTOs",
    "Trace a complete transaction creation request from the Android HTTP client to the Postgres database row",
    "Defend the architectural decision to enforce integer minor units for currency and soft deletes for financial records"
  ]],
  2: ["lead", "Describe the full-stack web and mobile offline-sync architecture to a tech lead", [
    "Explain the feature-sliced React + TypeScript web architecture and how it consumes the same Spring Boot REST contract as Android",
    "Walk through the offline-first caching strategy on Android with Room, optimistic UI updates, and conflict resolution rules",
    "Explain how the AI auto-categorization fallback works (heuristic regex -> LLM prompt evaluation -> confidence threshold -> manual review queue)",
    "Discuss the feature-flagging kill-switch architecture for AI features in production and how rollback is verified"
  ]],
  3: ["lead", "Describe the database and query architecture to a backend lead", [
    "Walk through the relational schema design, primary/foreign key constraints, and index strategy (B-Tree, composite, and partial indexes)",
    "Explain the EXPLAIN ANALYZE execution plan before and after query tuning, demonstrating index scans vs sequential scans",
    "Describe transaction isolation levels, connection pooling (HikariCP), and pessimistic vs optimistic locking for concurrent expense writes",
    "Explain how the messy-data LLM pipeline parses and normalizes merchant names asynchronously before persisting to the database"
  ]],
  4: ["lead", "Describe the Kotlin Multiplatform shared core architecture to a mobile engineering manager", [
    "Explain what business logic is shared in the KMP commonMain module (budgeting engine, validation rules) vs what remains platform-native UI",
    "Walk through the reactive state flow: KMP StateFlow / Coroutines exposed to Android Jetpack Compose and iOS SwiftUI (via Combine / Swift async)",
    "Defend the architectural trade-offs of KMP vs full cross-platform frameworks (Flutter/React Native) regarding performance, binary size, and native UX",
    "Explain the unified error boundary and crash logging architecture across both native platforms"
  ]],
  5: ["lead", "Describe the resilient rate-ingestion and caching API architecture to a backend architect", [
    "Walk through the layered Node.js/TypeScript architecture and the Anti-Corruption Layer (ACL) wrapping the third-party rates provider",
    "Explain the caching architecture (Redis + in-memory L1 cache, TTL expiration, single-flight request coalescing to prevent thundering herds)",
    "Describe the failure-handling path: circuit breaker state transitions, fallback to stale cached rates with an explicit freshness indicator",
    "Trace how the rate feed anomaly detector flags suspicious currency swings before rates are served to downstream clients"
  ]],
  6: ["lead", "Describe the Flutter reactive architecture and multi-stack trade-offs to a mobile architect", [
    "Walk through the feature-first Flutter architecture using Riverpod / BLoC, showing the Widget tree, Element tree, and RenderObject lifecycle",
    "Explain state propagation from the WebSocket rates stream down to reactive UI components with minimal rebuilds",
    "Compare the architectural trade-offs across Native (Compose/SwiftUI), KMP, and Flutter regarding rendering pipeline, bridge overhead, and build times",
    "Defend the build-vs-buy decision for core currency conversion logic vs third-party market data charting widgets"
  ]],
  7: ["lead", "Describe the Kubernetes proxy and semantic cache architecture to an infrastructure lead", [
    "Walk through the cache-aside proxy architecture with decorator patterns intercepting outbound market-data HTTP requests",
    "Explain the semantic vector caching mechanism that matches semantically equivalent queries to avoid expensive model/API calls",
    "Describe the Kubernetes deployment manifest: Ingress, Service routing, horizontal pod autoscaling (HPA), and graceful shutdown hooks",
    "Walk through cache invalidation, write-through vs cache-aside trade-offs, and memory eviction policies (LRU/LFU) under load"
  ]],
  8: ["lead", "Describe the event-driven payment pipeline architecture to a distributed systems engineer", [
    "Walk through the event-driven architecture with Apache Kafka: partition key strategy, producer acks (all), and consumer groups",
    "Explain the Transactional Outbox pattern ensuring atomic database mutation and Kafka message emission without dual-write inconsistency",
    "Describe the idempotent consumer implementation using idempotency keys and unique database constraint checks to prevent double charging",
    "Trace the Dead-Letter Queue (DLQ) and retry backoff workflow when payment settlement encounters transient gateway failures"
  ]],
  9: ["lead", "Describe the hybrid GraphQL API and edge proxy architecture to an API platform lead", [
    "Walk through the GraphQL schema design (queries, mutations, custom scalar types) sitting in front of the payment core",
    "Explain the edge compute layer (Cloudflare Worker / Lambda@Edge) handling token verification, rate limiting, and DDoS mitigation",
    "Describe the SwiftUI payment-link client architecture and how it renders dynamic payment forms based on server-driven schema",
    "Explain the asynchronous trust & safety pipeline analyzing link descriptions and transaction metadata for fraud patterns"
  ]],
  10: ["lead", "Describe the KYC workflow state machine and document store architecture to a solutions architect", [
    "Walk through the MongoDB document schema, indexing on case status/assignee, and audit history sub-documents",
    "Explain the Finite State Machine (FSM) governing case progression (DRAFT -> SUBMITTED -> OCR_PROCESSING -> MANUAL_REVIEW -> APPROVED/REJECTED)",
    "Describe the offline Android capture client architecture: local encrypted SQLite queue, background WorkManager sync, and resume-on-connectivity",
    "Explain the document AI OCR ingestion pipeline and how extracted entity confidence scores route cases between auto-approval and human review"
  ]],
  11: ["lead", "Describe the double-entry ledger and security architecture to a fintech architect", [
    "Walk through the double-entry bookkeeping architecture: every transfer creates balanced debit and credit entries; wallet balances are calculated, never mutated via raw UPDATE",
    "Explain the hardened authentication architecture: OAuth2 / OpenID Connect, short-lived JWT access tokens, rotating refresh tokens in HttpOnly cookies",
    "Describe the SwiftUI client security architecture: Keychain token storage, biometric FaceID/TouchID step-up authentication, and SSL certificate pinning",
    "Walk through the multi-tenant isolation model preventing cross-tenant data leaks at the ORM and database layer"
  ]],
  12: ["lead", "Describe the WebSocket fan-out and streaming server architecture to a real-time systems engineer", [
    "Walk through the publish/subscribe fan-out architecture: Redis Pub/Sub backplane broadcasting market events across clustered WebSocket gateway servers",
    "Explain how per-connection backpressure and bounded queues prevent slow clients from exhausting server memory",
    "Describe the client reconnection state machine: exponential backoff with jitter, heartbeat ping/pong, and sequence gap detection with replay",
    "Walk through the deliberate chaos drill architecture and how the system auto-recovers when a broker node crashes mid-stream"
  ]],
  13: ["lead", "Describe the RAG retrieval pipeline and vector database architecture to an AI engineer", [
    "Walk through the Python FastAPI microservice architecture: document ingestion endpoint, text extraction, semantic chunking, and embedding generation",
    "Explain the vector database architecture with pgvector (HNSW indexing, cosine similarity vs L2 distance, cosine distance thresholds)",
    "Describe the Flutter chat interface architecture: streaming response rendering, token typing animation, and citation anchor linking",
    "Trace a user query from raw text to embedded vector, similarity retrieval, prompt augmentation, and grounded LLM completion"
  ]],
  14: ["lead", "Describe the hybrid search, reranking, and on-device privacy architecture to an ML lead", [
    "Walk through the two-stage retrieval architecture: dense semantic retrieval (pgvector) + sparse lexical retrieval (BM25) combined via Reciprocal Rank Fusion (RRF)",
    "Explain the Cross-Encoder reranking model layer filtering top-k context candidates for maximum relevance before context injection",
    "Describe the on-device PII masking architecture on mobile (Android/iOS regex + lightweight NLP tokenizer) scrubbing account numbers before API transit",
    "Walk through the automated evaluation pipeline: golden dataset scoring, ground-truth recall@k, precision, and hallucination evaluation gates in CI"
  ]],
  15: ["lead", "Describe the ReAct agent loop and tool execution gateway architecture to an AI platform architect", [
    "Walk through the ReAct (Reason + Act) loop architecture: user prompt -> thought generation -> structured tool selection -> execution -> observation -> final response",
    "Explain the tool execution gateway: OpenAPI schema reflection, parameter validation, rate limiting, and permission checking before executing money-moving operations",
    "Describe the React Native agent console architecture: rendering tool invocation cards, execution status indicators, and streaming thoughts",
    "Explain the safety policy boundary: max iteration limit (step bounding), financial spending limits, and mandatory human confirmation for state-mutating actions"
  ]],
  16: ["lead", "Describe the agent security and mobile client defense architecture to a security engineer", [
    "Walk through the multi-layer prompt injection defense architecture: input sanitization, dual-model verification, delimiter escaping, and canary tokens",
    "Explain the mobile application security posture: Android SafetyNet / Play Integrity API, jailbreak/root detection, and Network Security Config with SPKI pinning",
    "Describe the abuse detection and behavioral anomaly monitor analyzing high-frequency tool calls and atypical transaction patterns",
    "Trace an adversarial attack scenario (indirect prompt injection via uploaded statement) and demonstrate how the sandbox stops unauthorized execution"
  ]],
  17: ["lead", "Describe the analytical ELT pipeline and dashboard architecture to a data architect", [
    "Walk through the layered data warehouse architecture (Bronze/raw ingestion -> Silver/cleaned staging -> Gold/dimensional business marts)",
    "Explain the dimensional model (Star Schema): fact tables (fact_transactions, fact_spending) and dimension tables (dim_users, dim_merchants, dim_date)",
    "Describe the fast aggregation engine (DuckDB / ClickHouse / PostgreSQL views) serving low-latency interactive dashboard queries",
    "Trace the experimentation analysis pipeline: calculating sample size, statistical significance (p-values), and confidence intervals for A/B tests"
  ]],
  18: ["lead", "Describe the automated loan decisioning and IaC deployment architecture to a tech lead", [
    "Walk through the loan application lifecycle: ingestion, automated credit scoring, business rule validation, state machine transitions, and disbursement trigger",
    "Explain the model explainability service utilizing SHAP values to generate transparent reason codes for credit approvals and adverse actions (rejections)",
    "Describe the Terraform Infrastructure as Code (IaC) architecture: modular VPC, ECS/App Runner clusters, RDS PostgreSQL, and least-privilege IAM roles",
    "Trace the idempotent disbursement execution preventing duplicate fund release across banking rail integrations"
  ]],
  19: ["lead", "Describe the modular banking backend architecture to a principal architect", [
    "Walk through the modular monolith / microservices boundary: API Gateway, Identity & Access, Core Accounts, Transaction Ledger, and AI Banking Assistant",
    "Explain inter-service communication patterns: synchronous gRPC / REST for transactional reads vs asynchronous event bus for ledger auditing",
    "Describe the database per-module partitioning strategy ensuring clean separation of concerns and independent scalability",
    "Walk through the high-availability failover topology, load balancer routing rules, and distributed tracing context propagation across services"
  ]],
  20: ["lead", "Describe the Android banking app architecture and release pipeline to a mobile release lead", [
    "Walk through the Clean Architecture + MVI (Model-View-Intent) pattern on Android: UI layer (Compose), Domain (UseCases), Data (Repository + Retrofit/Room)",
    "Explain uni-directional data flow (UDF) ensuring deterministic state rendering and zero race conditions during complex financial workflows",
    "Describe the offline transaction queuing and synchronization engine with WorkManager and exponential backoff retry policies",
    "Walk through the automated mobile CI/CD pipeline: static analysis (ktlint/detekt), unit tests, UI instrumentation tests, and staged Google Play rollout"
  ]],
  21: ["lead", "Describe the POS terminal embedded client and reconciliation architecture to a hardware/payments lead", [
    "Walk through the hardware abstraction layer (HAL) communicating with the EMV chip/contactless card reader over USB/Bluetooth",
    "Explain the strict finite state machine enforcing card insertion, PIN entry, cryptogram generation, and terminal display state",
    "Describe the offline store-and-forward queue: transactions signed locally in secure hardware enclave and synced upon cellular/WiFi re-connection",
    "Walk through the end-of-day settlement and multi-party reconciliation server architecture comparing terminal logs against payment switch records"
  ]],
  22: ["lead", "Describe the real-time stream processing and alert notification architecture to a backend lead", [
    "Walk through the stream processing topology: Kafka event stream consumed by sliding-window processors (Flink / Kafka Streams) evaluating velocity rules",
    "Explain the CQRS read-model pattern storing aggregated risk scores in Redis sorted sets for sub-millisecond status lookups",
    "Describe the WebSocket / Server-Sent Events (SSE) notification gateway pushing real-time fraud flags to merchant and fraud analyst consoles",
    "Trace a simulated carding attack and demonstrate how the rules engine triggers auto-freezes within 50ms of stream ingestion"
  ]],
  23: ["lead", "Describe the agent tool-reflection and execution gateway architecture to a platform engineer", [
    "Walk through the dynamic tool-discovery engine parsing OpenAPI v3 specifications and generating JSON schema tool declarations for LLMs",
    "Explain runtime type casting, input schema validation, and error translation converting server 4xx/5xx responses into actionable LLM feedback",
    "Describe the Android agent console UI architecture visualizing dynamic tool schemas, parameters, and invocation statuses",
    "Trace the permission gating workflow verifying user session capabilities before allowing tool invocation against backend microservices"
  ]],
  24: ["lead", "Describe the multi-tier agent memory and context management architecture to an AI researcher", [
    "Walk through the three-tier memory architecture: short-term conversation buffer, working memory context, and long-term episodic vector recall",
    "Explain dynamic context window compression: recursive summarization of prior turns, entity extraction, and token budget allocation",
    "Describe the vector retrieval mechanism recalling past user preferences and account facts without overloading prompt tokens",
    "Walk through the memory eviction and privacy deletion pipeline ensuring compliance with user data-removal requests"
  ]],
  25: ["lead", "Describe the multi-agent graph orchestration architecture to a distributed systems architect", [
    "Walk through the hierarchical multi-agent architecture: Supervisor / Router agent triaging intents to specialized domain sub-agents (Support, Transfers, Analytics)",
    "Explain the agent communication protocol: structured state handoffs, conversation history forwarding, and shared scratchpad context",
    "Describe cycle detection, recursion depth limiting, and deterministic rule fallbacks when sub-agents encounter ambiguous queries",
    "Defend single-agent vs multi-agent trade-offs in terms of latency, token cost, failure compounding, and debuggability"
  ]],
  26: ["lead", "Describe the MCP server and tool interoperability architecture to a developer tools engineer", [
    "Walk through the Model Context Protocol (MCP) server architecture: JSON-RPC 2.0 transport over stdio and HTTP-SSE",
    "Explain the registration and dispatch of MCP Resources (account data, statement files), Tools (transfer money, lock card), and Prompts",
    "Describe how multiple heterogeneous AI clients (Claude Desktop, IDE assistants, mobile agents) interact with the unified MCP interface",
    "Walk through the authentication, capability negotiation, and sandboxed tool execution lifecycle inside the MCP server"
  ]],
  27: ["lead", "Describe the agent observability and automated evaluation architecture to an SRE / MLOps lead", [
    "Walk through the distributed tracing architecture capturing full agent execution spans: LLM inference latency, tool dispatch times, and retry counts",
    "Explain OpenTelemetry span instrumentation and context propagation across asynchronous agent worker tasks",
    "Describe the LLM-as-a-judge automated eval harness: scoring accuracy, tool selection correctness, and rubric compliance against a synthetic golden test suite",
    "Trace how CI merge gates use evaluation regression thresholds to block faulty prompt or tool schema updates"
  ]],
  28: ["lead", "Describe the zero-trust agent security and privilege boundary architecture to a CISO", [
    "Walk through the zero-trust execution sandbox: isolating tool code execution inside ephemeral Docker containers or gVisor sandboxes",
    "Explain capability-based Role-Based Access Control (RBAC): agents inherit only the explicitly delegated scopes of the calling user",
    "Describe the Human-in-the-Loop (HITL) approval architecture: asynchronous step-up authorization, push notification approvals, and cryptographic request signing",
    "Trace a privilege escalation attempt (prompt attempting to access admin endpoints) and demonstrate how the kernel-level sandbox prevents breakout"
  ]],
  29: ["lead", "Describe the distributed agent worker pool and crash recovery architecture to an infrastructure engineer", [
    "Walk through the distributed job queue architecture (BullMQ / Celery backed by Redis): priority queues, concurrency limits, and fair job distribution",
    "Explain agent task checkpointing: persisting intermediate thought-action-observation states in Postgres so crashed runs resume without re-running tools",
    "Describe worker health monitoring: heartbeat mechanisms, dead worker detection, lock renewal, and automatic task reassignment",
    "Walk through load-shedding and multi-provider LLM fallback routing (switching between Claude, OpenAI, and Gemini when providers throttle or fail)"
  ]],
  30: ["lead", "Describe the developer platform agent and automated PR review architecture to an engineering VP", [
    "Walk through the GitHub webhook ingestion server parsing PR events, extracting code diffs, and indexing modified AST nodes",
    "Explain the automated static analysis and AI review agent: checking architectural layer violations, security risks, missing unit tests, and style guides",
    "Describe the automated test generation bot reproducing reported bug stack traces and submitting minimal failing reproduction tests",
    "Walk through the business metrics dashboard tracking engineer hours saved, PR turnaround time reduction, and bot suggestion acceptance rate"
  ]],
  31: ["lead", "Describe the platform monitoring, metrics, and alerting architecture to an SRE manager", [
    "Walk through the unified telemetry stack: Prometheus metrics scraping, OpenTelemetry distributed tracing, and Loki/Elasticsearch log aggregation",
    "Explain the Service Level Indicator (SLI) and Service Level Objective (SLO) definitions for API availability (99.95%) and p99 latency (<200ms)",
    "Describe the Grafana executive and operational dashboard hierarchy providing instant drill-downs from high-level errors to individual traces",
    "Walk through the multi-tier alerting pipeline: Alertmanager routing, deduplication, paging policies, and runbook integration for on-call responders"
  ]],
  32: ["lead", "Describe the high-throughput server and latency optimization architecture to a performance architect", [
    "Walk through the k6 distributed load-testing harness simulating 50,000 concurrent virtual users across critical financial API endpoints",
    "Explain the p99 latency optimization path: non-blocking asynchronous I/O, JVM garbage collection tuning (ZGC / G1GC), and database connection pool sizing",
    "Describe the multi-tier caching hierarchy (client cache -> CDN edge -> Redis distributed cache -> DB buffer pool) and invalidation strategies",
    "Walk through CPU and memory flame graph profiling identifying lock contention, excessive object allocation, and slow ORM query generation"
  ]],
  33: ["lead", "Describe the multi-region disaster recovery and failover architecture to an enterprise cloud architect", [
    "Walk through the multi-region topology: primary active region (AWS us-east-1) with warm standby replica region (AWS us-west-2)",
    "Explain cross-region asynchronous database replication (Aurora Global Database / RDS read replicas) and data synchronization lag monitoring",
    "Describe the automated DNS health check and failover routing using AWS Route 53 with health checks and weighted routing policies",
    "Walk through the disaster recovery rehearsal: measuring Recovery Time Objective (RTO < 5 min) and Recovery Point Objective (RPO < 1 min) during simulated region outage"
  ]],
  34: ["lead", "Describe the enterprise security, KMS encryption, and threat model architecture to a compliance auditor", [
    "Walk through the STRIDE threat model covering spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege",
    "Explain envelope encryption using AWS KMS: customer master keys (CMKs) generating data encryption keys (DEKs) for AES-256 field-level encryption",
    "Describe the zero-trust network architecture: mutual TLS (mTLS) between microservices, VPC peering, private subnets, and AWS Secrets Manager auto-rotation",
    "Walk through the audit log immutable storage pipeline sending signed CloudTrail and application audit logs to an encrypted write-once S3 bucket"
  ]],
  35: ["lead", "Describe the modern data warehouse and analytical transformation architecture to a head of data engineering", [
    "Walk through the modern data stack: CDC (Change Data Capture) ingestion with Debezium/Kafka -> raw staging tables -> dbt transformation models",
    "Explain the dimensional modelling architecture (Star Schema with Kimball methodology): surrogate keys, slowly changing dimensions (SCD Type 2), and aggregate rollups",
    "Describe the columnar data storage engine (Snowflake / BigQuery / DuckDB) optimizing analytical aggregation queries across millions of rows",
    "Walk through the data lineage graph, schema documentation, and automated data quality assertions (null checks, uniqueness, referential integrity)"
  ]],
  36: ["lead", "Describe the end-to-end MLOps and model lifecycle architecture to an ML platform lead", [
    "Walk through the MLOps pipeline: automated model training on historical transactions -> artifact versioning in MLflow model registry",
    "Explain the shadow deployment architecture: routing live production traffic to both legacy and challenger models without impacting user latency",
    "Describe the real-time data and concept drift detection engine calculating Population Stability Index (PSI) and Kolmogorov-Smirnov (KS) test statistics",
    "Walk through the automated retraining pipeline triggered when drift metrics exceed predefined risk thresholds"
  ]],
  37: ["lead", "Describe the cloud economics, FinOps, and unit-cost architecture to a CTO / CFO", [
    "Walk through the FinOps cloud cost allocation architecture: comprehensive AWS cost-allocation tagging by service, environment, and engineering squad",
    "Explain infrastructure optimization strategies: right-sizing ECS task definitions, blending EC2 Spot and Compute Savings Plans, and S3 lifecycle tiering",
    "Describe AI inference cost optimization: prompt compression, model tiering (routing simple queries to lightweight models), and semantic caching",
    "Walk through the unit-economic metrics dashboard tracking infrastructure cost per active user, cost per payment transaction, and monthly savings trends"
  ]],
  38: ["lead", "Describe the developer platform, golden paths, and service scaffolding architecture to a staff developer experience engineer", [
    "Walk through the golden-path service scaffolding CLI: generating production-ready microservices with pre-configured Dockerfiles, CI pipelines, and metrics",
    "Explain the centralized shared library architecture: standardizing authentication, logging, error handling, and database connection pooling across repos",
    "Describe the internal developer portal (Backstage) visualizing service ownership, API documentation, health statuses, and deployment histories",
    "Walk through the automated cloud environment provisioning workflow spinning up ephemeral preview environments for every active pull request"
  ]],
  39: ["lead", "Describe your open-source library architecture and API design to a community maintainer / tech lead", [
    "Walk through the library architecture: zero external runtime dependencies, minimal binary footprint, and clean separation between public API and internal engine",
    "Explain API ergonomics: fluent builder interfaces, comprehensive TypeScript / Kotlin type definitions, and sensible defaults",
    "Describe the automated release engineering setup: semantic versioning, changelog generation, cross-platform CI matrix testing, and package publishing",
    "Walk through the performance benchmarking suite proving memory efficiency and sub-millisecond execution against existing industry libraries"
  ]],
  40: ["lead", "Describe your specialized domain system architecture to a domain principal engineer", [
    "Walk through the specialized high-performance domain architecture (e.g. ultra-low latency matching engine, on-device neural inference, or payment switch)",
    "Explain the critical path bottlenecks: memory layout, cache locality, lock-free concurrency primitives, and asynchronous non-blocking I/O",
    "Describe the state machine transitions and formal verification models proving correctness under edge-case concurrency conditions",
    "Walk through the benchmark comparison demonstrating how your architectural decisions beat industry-standard baseline throughput by 3x-5x"
  ]],
  41: ["lead", "Describe a complete large-scale system design architecture to a senior interviewer on a whiteboard", [
    "Walk through the structured 35-minute interview framework: functional/non-functional requirements, back-of-the-envelope capacity estimations (QPS, storage, bandwidth)",
    "Explain the high-level architecture: clients, load balancers, API gateways, stateless microservices, distributed cache, and sharded databases",
    "Describe deep-dive components: consistent hashing for partition distribution, asynchronous message queues for decoupling, and read/write separation",
    "Walk through fault-tolerance and scalability bottlenecks: single points of failure, partition rebalancing, rate limiting, and multi-region replication"
  ]],
  42: ["lead", "Describe component architecture and design decisions live during a technical interview round", [
    "Walk through the high-level modular component blueprint before writing any production code, establishing clear interface boundaries and data contracts",
    "Explain design pattern selection (e.g. Strategy, Factory, Observer, Decorator) matching problem requirements and maintainability goals",
    "Describe time and space complexity tradeoffs out loud while implementing clean, test-driven algorithms",
    "Walk through edge cases, concurrency hazards, and production readiness considerations as you refactor and finalize the code"
  ]],
  43: ["lead", "Describe a critical architecture decision and trade-off matrix to an Architecture Review Board", [
    "Walk through an Architecture Decision Record (ADR): context, problem statement, business constraints, evaluated alternatives, and final recommendation",
    "Explain the trade-off matrix comparing options across performance, operational complexity, total cost of ownership (TCO), and time-to-market",
    "Defend controversial technical choices (e.g. build vs buy, SQL vs NoSQL, synchronous vs asynchronous) with quantifiable benchmark data",
    "Walk through the risk mitigation plan, rollback contingencies, and ongoing operational governance model for the selected architecture"
  ]],
  44: ["lead", "Describe the complete enterprise banking platform architecture to an Executive CTO & Leadership Panel", [
    "Walk through the unified enterprise architecture: web banking (Next.js), native mobile clients (Android/iOS), API Gateway, and modular banking core",
    "Explain core banking service interactions: double-entry ledger, accounts, card issuing, loan management, bill pay, and payments pipeline",
    "Describe the integration of AI capabilities (RAG financial assistant, real-time fraud scoring, support triage) with strict security and permission boundaries",
    "Walk through enterprise security, multi-region disaster recovery, automated CI/CD governance, and scalable cloud infrastructure topology"
  ]]
};

const mgmtTasks = {
  1: ["lead", "Weekly 15-person squad management: team kickoff, competency matrix & sprint 1 performance review", [
    "Establish the cross-functional team charter for 15 members (1 PM, 1 Designer, 4 Backend, 4 Mobile/Web, 3 QA, 2 DevOps): sprint cadences, WIP limits, Definition of Ready, and Definition of Done",
    "Conduct candidate interview: Senior Backend Engineer (REST API design, concurrency, Postgres indexing, behavioral ownership)",
    "Run 1:1 check-ins with Lead PM on backlog prioritization and Senior Designer on Figma design system handoffs",
    "Publish Weekly Squad Scorecard: sprint velocity baseline, PR review turnaround time (target < 24h), and individual feedback on Sprint 1 delivery"
  ]],
  2: ["lead", "Weekly 15-person squad management: cross-functional 1:1s, junior dev coaching & QA automation review", [
    "Conduct 1:1s with Junior Backend Dev (coaching on clean error handling) and Lead QA (evaluating end-to-end API test automation coverage)",
    "Conduct candidate interview: Mid-level QA Automation Engineer (REST Assured, mobile Appium, CI test flakiness triage)",
    "Resolve cross-functional friction between Product and Engineering regarding AI feature acceptance criteria and scope creep",
    "Publish Weekly Squad Scorecard: team sprint burndown, escaped bug rate in staging, and individual performance ratings for all 15 members"
  ]],
  3: ["lead", "Weekly 15-person squad management: database specialist interview, query performance SLA & 1:1s", [
    "Conduct candidate interview: Database/Backend Performance Specialist (PostgreSQL indexing, EXPLAIN tuning, connection pooling)",
    "Run 1:1s with Senior Mobile Dev (Compose performance) and Staff Backend Engineer (database migration risk and zero-downtime rollback)",
    "Address blocker: resolve database access bottleneck between QA automation scripts and backend staging instances",
    "Publish Weekly Squad Scorecard: query p95 latency tracking, team story point completion rate, and PR comment-to-merge metrics"
  ]],
  4: ["lead", "Weekly 15-person squad management: mobile team calibration, design sync & KMP adoption review", [
    "Conduct candidate interview: Senior iOS Engineer (SwiftUI, Combine/async, ARC memory management, cross-platform collaboration)",
    "Run 1:1 check-ins with Android and iOS engineers assessing Kotlin Multiplatform shared core developer experience (DevEx)",
    "Align Lead Designer and Product Manager on mobile accessibility standards and design token sync with frontends",
    "Publish Weekly Squad Scorecard: crash-free user sessions metric (target > 99.8%), sprint delivery fidelity, and 1:1 coaching action items"
  ]],
  5: ["lead", "Weekly 15-person squad management: API contract review, Node.js engineer interview & on-call readiness", [
    "Conduct candidate interview: Senior Node.js/TypeScript Engineer (event loop, streaming backpressure, Redis caching, microservices)",
    "Mediate API contract dispute between Backend and Mobile leads: establish OpenAPI-first spec reviews before sprint commitment",
    "Run 1:1 with DevOps Engineer reviewing staging environment reliability and CI pipeline build duration (< 8 minutes)",
    "Publish Weekly Squad Scorecard: API error rate, on-call alert noise reduction, and individual performance grading for all 15 reports"
  ]],
  6: ["lead", "Weekly 15-person squad management: Phase 1 team calibration, Flutter dev interview & build-vs-buy review", [
    "Conduct candidate interview: Flutter / Cross-Platform Mobile Engineer (Riverpod, render tree, platform channels, performance profiling)",
    "Run Phase 1 comprehensive performance calibration across all 15 team members: delivery output, code quality, and peer feedback",
    "Lead cross-functional retrospective on 3-client architecture delivery, celebrating wins and committing to 2 process improvements",
    "Publish Weekly Squad Scorecard: 6-week velocity trend, test coverage growth across services, and individualized development goals"
  ]],
  7: ["lead", "Weekly 15-person squad management: SRE hiring interview, Kubernetes readiness & infra unblocking", [
    "Conduct candidate interview: Senior SRE / DevOps Engineer (Kubernetes, Terraform, horizontal autoscaling, incident triage)",
    "Run 1:1s with Backend and QA engineers to unblock local Docker containerization and K8s namespace isolation issues",
    "Review cloud infrastructure spend with PM and DevOps: identify and terminate idle staging clusters",
    "Publish Weekly Squad Scorecard: deployment frequency, container startup latency, and individual sprint contribution scores"
  ]],
  8: ["lead", "Weekly 15-person squad management: high-stakes delivery, burnout check & Kafka pipeline review", [
    "Conduct candidate interview: Senior Distributed Systems / Data Streaming Engineer (Kafka, consumer lag, idempotency, event sourcing)",
    "Run proactive 1:1 burnout checks with engineers handling high-complexity Kafka payment pipeline: adjust sprint load and rebalance tickets",
    "Align QA Lead and Backend Lead on deterministic integration tests for asynchronous dead-letter queues",
    "Publish Weekly Squad Scorecard: message consumer lag metrics, team sprint velocity, and weekly peer recognition awards"
  ]],
  9: ["lead", "Weekly 15-person squad management: GraphQL API lead interview, PM scope negotiation & 1:1s", [
    "Conduct candidate interview: API Platform Lead (GraphQL schema governance, edge workers, rate limiting, N+1 query prevention)",
    "Negotiate scope with Product Manager: protect engineering capacity by deferring non-critical payment link customization to next quarter",
    "Run 1:1 with Senior UI/UX Designer: evaluate user testing feedback on payment link conversion flows",
    "Publish Weekly Squad Scorecard: PR cycle time, GraphQL endpoint p95 latency, and individual performance assessments"
  ]],
  10: ["lead", "Weekly 15-person squad management: QA automation assessment, document store interview & PRD quality", [
    "Conduct candidate interview: Lead SDET (mobile offline automation, contract testing, non-relational database verification)",
    "Evaluate QA team's automated regression pass rate and mobile offline sync test matrices with QA Lead",
    "Run 1:1 with Product Manager: review and tighten PRD acceptance criteria for document AI validation states",
    "Publish Weekly Squad Scorecard: sprint defect escape rate (target < 2%), automated test coverage %, and weekly squad health rating"
  ]],
  11: ["lead", "Weekly 15-person squad management: Fintech security interview, promotion cases & code review hygiene", [
    "Conduct candidate interview: Senior Fintech / Security Engineer (double-entry bookkeeping, OAuth2/JWT security, PCI compliance)",
    "Draft mid-year promotion cases and career development milestones for Senior Mobile Dev and Mid Backend Dev",
    "Conduct 1:1 with Staff Backend Engineer: establish strict code review standards for financial ledger transactions",
    "Publish Weekly Squad Scorecard: security audit finding resolution time, code review turnaround, and individual output ratings"
  ]],
  12: ["lead", "Weekly 15-person squad management: blameless post-mortem drill, real-time engineer interview & 1:1s", [
    "Conduct candidate interview: Senior Real-Time Systems Engineer (WebSockets, Redis Pub/Sub, connection backpressure, chaos engineering)",
    "Lead a blameless post-mortem drill with the entire 15-person squad following a simulated streaming outage: extract 3 actionable fixes",
    "Run 1:1 check-ins focusing on psychological safety, on-call confidence, and learning from operational incidents",
    "Publish Weekly Squad Scorecard: Mean Time to Detect (MTTD), Mean Time to Recover (MTTR), and team incident response scorecard"
  ]],
  13: ["lead", "Weekly 15-person squad management: AI engineer interview, team AI-upskilling & RAG delivery 1:1s", [
    "Conduct candidate interview: Senior AI / RAG Engineer (FastAPI, pgvector, embedding models, semantic chunking, evaluation baselines)",
    "Run 1:1s with developers transitioning into AI feature engineering: provide structured learning resources and pair programming support",
    "Align Lead Designer and PM on AI response streaming latency expectations and fallback UI micro-copy",
    "Publish Weekly Squad Scorecard: vector query latency, sprint goal completion rate, and individual developer productivity metrics"
  ]],
  14: ["lead", "Weekly 15-person squad management: ML eval gate review, SDET 1:1 & privacy compliance check", [
    "Conduct candidate interview: Machine Learning Evaluation Specialist (golden datasets, precision/recall metrics, hallucination scoring)",
    "Run 1:1 with Lead QA: review CI merge gates that block deployments when AI golden set accuracy drops below 92%",
    "Conduct 1:1 with Mobile Lead verifying on-device PII masking compliance before statements leave customer devices",
    "Publish Weekly Squad Scorecard: AI golden set pass rate, sprint delivery velocity, and weekly individual performance rankings"
  ]],
  15: ["lead", "Weekly 15-person squad management: agent platform interview, AI budget controls & underperformer coaching", [
    "Conduct candidate interview: Senior AI Agent / Systems Engineer (ReAct loops, function calling, state machines, step bounding)",
    "Conduct empathetic 1:1 coaching session with a developer struggling with complex async agent debugging: set weekly pair-programming goals",
    "Align PM, Backend Lead, and DevOps on financial spending guardrails and token budget rate limits for AI agent operations",
    "Publish Weekly Squad Scorecard: agent task completion accuracy, token cost per transaction, and weekly employee contribution notes"
  ]],
  16: ["lead", "Weekly 15-person squad management: AppSec engineer interview, red-team exercise & QA collaboration", [
    "Conduct candidate interview: Senior Application Security Engineer (prompt injection defense, mobile attestation, certificate pinning)",
    "Facilitate joint Red-Team exercise between Security, Developers, and QA testing agent jailbreak and financial prompt attacks",
    "Run 1:1 with Senior Designer reviewing security confirmation modal flows and biometric step-up UX",
    "Publish Weekly Squad Scorecard: vulnerability remediation time, sprint commitment fidelity, and individual performance ratings"
  ]],
  17: ["lead", "Weekly 15-person squad management: Data analyst interview, experimentation alignment & 1:1s", [
    "Conduct candidate interview: Senior Data / Analytics Engineer (dbt, Star Schema, ClickHouse/DuckDB, A/B test statistics)",
    "Run 1:1 with Lead PM reviewing A/B experiment sample sizes, statistical significance criteria, and feature launch decisions",
    "Review data pipeline freshness and query reliability with Data Engineer and QA automation specialists",
    "Publish Weekly Squad Scorecard: analytical query SLA compliance, sprint delivery burnup, and team-wide feedback notes"
  ]],
  18: ["lead", "Weekly 15-person squad management: mid-year performance reviews, compensation calibration & tech lead interview", [
    "Conduct candidate interview: Technical Lead / Solutions Architect (credit decisioning, IaC/Terraform, explainability, compliance)",
    "Execute formal Mid-Year Performance Reviews for all 15 team members: stack ranking, promotion recommendations, and merit adjustments",
    "Run 1:1 career roadmapping sessions with each report: establish 6-month growth objectives and personalized development plans",
    "Publish Weekly Squad Scorecard: comprehensive team velocity trend, talent retention score, and H2 squad OKR commitments"
  ]],
  19: ["lead", "Weekly 15-person squad management: Principal Architect interview, Capstone A scope & cross-squad alignment", [
    "Conduct candidate interview: Principal Backend Architect (modular monoliths, gRPC, distributed transaction boundaries, high availability)",
    "Coordinate cross-squad dependencies across Backend, Mobile, AI, and DevOps sub-teams for Capstone A banking release",
    "Run 1:1 with Lead PM: enforce strict MVP scope vs fast-follow backlog to prevent pre-launch timeline slippage",
    "Publish Weekly Squad Scorecard: inter-service API contract completion, sprint burndown, and individual delivery milestones"
  ]],
  20: ["lead", "Weekly 15-person squad management: Mobile release lead interview, staged rollout review & QA pass rates", [
    "Conduct candidate interview: Staff Mobile / Release Engineer (Android clean architecture, staged Google Play rollouts, crash telemetry)",
    "Review QA automation sign-off, regression suite pass rates (> 99%), and emergency hotfix runbooks with QA Lead",
    "Run 1:1 with DevOps Lead on automated mobile build pipeline stability and signing key management",
    "Publish Weekly Squad Scorecard: production crash-free rate (99.9%), Play Store release health, and weekly team performance scores"
  ]],
  21: ["lead", "Weekly 15-person squad management: Hardware/POS specialist interview, store-and-forward QA & 1:1s", [
    "Conduct candidate interview: Embedded / POS Payments Engineer (EMV card readers, hardware abstraction, offline store-and-forward, settlement)",
    "Resolve hardware vs software emulator testing friction between QA team and embedded mobile developers",
    "Run 1:1 with Senior Designer on physical terminal UI contrast, touch target constraints, and accessibility compliance",
    "Publish Weekly Squad Scorecard: hardware reconciliation accuracy, sprint task completion, and individual engineer ratings"
  ]],
  22: ["lead", "Weekly 15-person squad management: Stream processing engineer interview, carding attack drill & 1:1s", [
    "Conduct candidate interview: Senior Stream Processing Engineer (Flink, Kafka Streams, sliding window analytics, low-latency push)",
    "Supervise QA and backend load-testing simulation of a 50,000 TPS carding attack: verify auto-freeze latency (< 50ms)",
    "Run 1:1 with Senior Backend Dev on stateful stream state management and memory leak prevention",
    "Publish Weekly Squad Scorecard: stream latency p99 metrics, team sprint velocity, and weekly peer kudos"
  ]],
  23: ["lead", "Weekly 15-person squad management: Platform engineer interview, sub-team restructuring & tech debt review", [
    "Conduct candidate interview: Staff Platform Engineer (OpenAPI reflection, schema gateways, dynamic tool execution, developer platforms)",
    "Restructure the 15-person squad into 3 focused feature pods (Tooling Pod, Core Agent Pod, Client Experience Pod) with clear leads",
    "Run 1:1 with Staff Backend Engineer: prioritize technical debt reduction allocation (20% of sprint capacity)",
    "Publish Weekly Squad Scorecard: pod velocity metrics, tool schema error rates, and individual performance evaluations"
  ]],
  24: ["lead", "Weekly 15-person squad management: AI researcher interview, memory token efficiency & PM 1:1", [
    "Conduct candidate interview: AI Research / Context Engineer (multi-tier memory, semantic compression, episodic recall, context budgeting)",
    "Run 1:1 with Lead PM on user memory privacy policies, GDPR right-to-be-forgotten compliance, and retention limits",
    "Evaluate team token consumption metrics: reward developer who optimized conversational context compression by 40%",
    "Publish Weekly Squad Scorecard: token cost savings, sprint delivery progress, and weekly performance notes for all 15 reports"
  ]],
  25: ["lead", "Weekly 15-person squad management: Distributed systems interview, resolving architectural deadlock & 1:1s", [
    "Conduct candidate interview: Senior Distributed Systems Architect (multi-agent orchestration, supervisor patterns, DAG routing, deadlock recovery)",
    "Resolve architectural deadlock between senior engineers (Supervisor vs Swarm architecture) through structured ADR decision matrix",
    "Run 1:1s with dissenting engineers to ensure full organizational alignment, psychological safety, and shared ownership",
    "Publish Weekly Squad Scorecard: multi-agent task completion rate, PR review throughput, and individual performance ratings"
  ]],
  26: ["lead", "Weekly 15-person squad management: DevRel/Integrations engineer interview, MCP adoption & DevEx review", [
    "Conduct candidate interview: Developer Experience / Integrations Engineer (MCP protocol, JSON-RPC, SDK ergonomics, partner APIs)",
    "Review internal Developer Satisfaction (CSAT) survey regarding MCP tooling: assign 2 engineers to fix SDK friction points",
    "Run 1:1 with Designer on developer documentation portal UX and interactive API playground components",
    "Publish Weekly Squad Scorecard: internal SDK adoption rate, documentation clarity score, and weekly delivery scorecard"
  ]],
  27: ["lead", "Weekly 15-person squad management: MLOps/Observability lead interview, CI eval harness & QA 1:1", [
    "Conduct candidate interview: Staff MLOps & Observability Engineer (OpenTelemetry, distributed tracing, LLM-as-a-judge, CI eval pipelines)",
    "Run 1:1 with QA Lead: evaluate automated synthetic test harness stability and flaky test quarantine procedures",
    "Review trace span coverage across asynchronous agent worker tasks with DevOps Lead",
    "Publish Weekly Squad Scorecard: eval harness execution duration, sprint burndown, and individual performance ratings"
  ]],
  28: ["lead", "Weekly 15-person squad management: CISO interview, handling underperformance (PIP) & zero-trust review", [
    "Conduct candidate interview: Security & Compliance Director / CISO (zero-trust sandboxing, RBAC, human-in-the-loop approvals, audit compliance)",
    "Deliver a supportive, structured Performance Improvement Plan (PIP) to an underperforming engineer with explicit weekly milestones and mentorship",
    "Run 1:1 check-ins across the squad to maintain high team morale, transparency, and psychological safety",
    "Publish Weekly Squad Scorecard: security vulnerability burnup, sprint goal achievement, and individual contribution ratings"
  ]],
  29: ["lead", "Weekly 15-person squad management: Cloud infrastructure interview, on-call fair scheduling & worker resilience", [
    "Conduct candidate interview: Senior Cloud Infrastructure Engineer (distributed queues, Redis/BullMQ, worker heartbeats, load-shedding)",
    "Audit on-call shift distribution and weekend paging frequency: implement secondary rotation to prevent engineer burnout",
    "Run 1:1 with Senior Backend Engineer on worker crash recovery mechanisms and idempotency guarantees",
    "Publish Weekly Squad Scorecard: worker queue throughput, on-call incident count, and team delivery performance scores"
  ]],
  30: ["lead", "Weekly 15-person squad management: VP engineering review, AI tooling ROI presentation & team calibration", [
    "Conduct candidate interview: Engineering Manager / Technical Director (team scaling, organizational design, metrics-driven leadership)",
    "Present 15-person squad quarterly efficiency report to VP of Engineering: quantify developer hours saved via automated AI tooling (35% gain)",
    "Conduct quarterly team performance calibration across all 15 members: update promotion pipeline and reward top performers",
    "Publish Weekly Squad Scorecard: quarterly OKR completion rate, team velocity trend, and customized feedback for every report"
  ]],
  31: ["lead", "Weekly 15-person squad management: SRE manager interview, SLO error budgets & on-call rotation kickoff", [
    "Conduct candidate interview: Senior SRE Manager (Prometheus, Grafana, OpenTelemetry, SLO/error budget policy enforcement, paging runbooks)",
    "Establish team Error Budget Policy: enforce automatic feature freeze if 99.95% availability budget is exhausted in a rolling 30-day window",
    "Run 1:1 with Lead PM aligning product release schedules with SRE on-call coverage and deployment freeze windows",
    "Publish Weekly Squad Scorecard: SLI/SLO compliance dashboard, sprint velocity, and individual weekly performance ratings"
  ]],
  32: ["lead", "Weekly 15-person squad management: Performance architect interview, load testing sign-off & 1:1s", [
    "Conduct candidate interview: Principal Performance Engineer (k6 distributed load testing, JVM GC tuning, query optimization, flame graphs)",
    "Review 50,000 VU load test results with QA Lead and Backend Lead: establish sign-off gate for p99 latency < 200ms",
    "Run 1:1 with Senior Frontend Dev reviewing client-side Core Web Vitals and bundle size reduction techniques",
    "Publish Weekly Squad Scorecard: latency improvement %, sprint task completion, and individual delivery rankings"
  ]],
  33: ["lead", "Weekly 15-person squad management: Cloud architect interview, disaster recovery drill & team crisis leadership", [
    "Conduct candidate interview: Enterprise Cloud Solutions Architect (multi-region active-passive, Aurora global DB, Route 53 DNS failover, RTO/RPO)",
    "Lead live simulated multi-region failover drill with 15-person squad: evaluate cross-functional communication and crisis triage",
    "Run 1:1 check-ins with engineers post-drill to review operational pain points and update failover runbook documentation",
    "Publish Weekly Squad Scorecard: DR drill RTO/RPO actuals (RTO 3.8m, RPO 42s), sprint burndown, and individual performance ratings"
  ]],
  34: ["lead", "Weekly 15-person squad management: Security compliance interview, SOC2 audit preparation & 1:1s", [
    "Conduct candidate interview: Staff Security & Compliance Engineer (SOC2 Type II, KMS envelope encryption, mTLS, secret rotation, STRIDE)",
    "Review SOC2 evidence collection and audit controls with DevOps, Backend, and QA leads: ensure zero open high-severity findings",
    "Run 1:1 with Senior Backend Dev on automated database encryption key rotation and audit logging compliance",
    "Publish Weekly Squad Scorecard: compliance readiness %, security patch SLA adherence, and team performance metrics"
  ]],
  35: ["lead", "Weekly 15-person squad management: Data engineering lead interview, data warehouse alignment & PM 1:1", [
    "Conduct candidate interview: Head of Data Engineering / Principal Data Architect (dbt, Star Schema, Snowflake/BigQuery, CDC pipelines)",
    "Align Data Engineer, Backend Lead, and PM on unified business metrics definitions to eliminate reporting discrepancies",
    "Run 1:1 with QA Lead on automated data quality assertion tests (uniqueness, referential integrity, null checks in dbt)",
    "Publish Weekly Squad Scorecard: warehouse data freshness SLA, sprint velocity, and weekly individual performance scores"
  ]],
  36: ["lead", "Weekly 15-person squad management: MLOps platform engineer interview, model drift review & 1:1s", [
    "Conduct candidate interview: Senior MLOps Engineer (MLflow model registry, shadow deployments, PSI/KS drift detection, automated retraining)",
    "Review model drift telemetry and shadow deployment results with ML Engineer and Product Manager",
    "Run 1:1 with QA Lead reviewing model regression test suites and automated challenger model validation",
    "Publish Weekly Squad Scorecard: model inference accuracy, sprint delivery progress, and weekly performance grades for all 15 reports"
  ]],
  37: ["lead", "Weekly 15-person squad management: FinOps review, cloud cost optimization incentives & tech lead 1:1", [
    "Conduct candidate interview: FinOps / Cloud Economics Specialist (AWS cost tagging, Spot/Savings Plan blending, AI token optimization)",
    "Lead monthly Cloud Cost & Unit Economics Review with PM and Tech Leads: celebrate team achieving 28% reduction in monthly infrastructure bill",
    "Run 1:1 with DevOps Engineer reviewing auto-scaling policies, right-sizing ECS tasks, and S3 lifecycle rules",
    "Publish Weekly Squad Scorecard: monthly cloud cost savings ($), sprint task completion, and individual engineer ratings"
  ]],
  38: ["lead", "Weekly 15-person squad management: Staff DevEx engineer interview, developer satisfaction survey & 1:1s", [
    "Conduct candidate interview: Staff Developer Experience (DevEx) Engineer (golden paths, Backstage, CLI scaffolding, CI acceleration)",
    "Analyze quarterly 15-person squad DevEx Survey: identify top productivity friction points (CI build queue, staging test data creation)",
    "Run 1:1 with Junior Engineer to evaluate onboarding experience with new service scaffolding CLI",
    "Publish Weekly Squad Scorecard: CI build time reduction (from 14m to 6m), developer satisfaction score (4.6/5), and individual ratings"
  ]],
  39: ["lead", "Weekly 15-person squad management: Open source maintainer interview, public engineering brand & 1:1s", [
    "Conduct candidate interview: Senior Open-Source / DevRel Engineer (library architecture, API ergonomics, semantic versioning, benchmarking)",
    "Encourage and review public blog posts, open-source sample repos, and conference talk proposals authored by squad members",
    "Run 1:1 with Senior Mobile Dev on establishing public technical authority and career portfolio building",
    "Publish Weekly Squad Scorecard: external developer engagement, sprint velocity, and weekly individual performance scores"
  ]],
  40: ["lead", "Weekly 15-person squad management: Principal engineer interview, staff career coaching & specialization review", [
    "Conduct candidate interview: Domain Principal Engineer / Staff Plus Candidate (deep domain specialization, formal verification, low latency)",
    "Run dedicated Career Growth & Promotion Sponsorship 1:1s with Senior Engineers aspiring to Staff / Tech Lead roles",
    "Align Lead PM and Designer on specialized domain customer validation interviews and UX benchmarking",
    "Publish Weekly Squad Scorecard: specialization milestone completion, code review quality, and individual performance ratings"
  ]],
  41: ["lead", "Weekly 15-person squad management: Internal mock system design interviews, leveling calibration & 1:1s", [
    "Conduct internal Mock System Design Interviews for squad members: evaluate requirements gathering, estimation, and trade-off defense",
    "Provide detailed behavioral and technical rubric feedback to help engineers prepare for annual promotion boards",
    "Run 1:1 with QA Lead on leveling QA Engineers to Senior SDET competencies (chaos testing, performance test engineering)",
    "Publish Weekly Squad Scorecard: team interview readiness score, sprint delivery progress, and weekly performance grades"
  ]],
  42: ["lead", "Weekly 15-person squad management: Live coding mock interviews, compensation negotiation coaching & 1:1s", [
    "Conduct internal Mock Live Coding & Architecture Co-Design Interviews for engineers: assess problem-solving communication and TDD discipline",
    "Coach team leads on salary benchmarking, performance calibration defense, and effective career negotiation strategies",
    "Run 1:1 with Senior Designer on cross-functional collaboration feedback and UI design system governance",
    "Publish Weekly Squad Scorecard: sprint burndown velocity, code quality index, and individual developer ratings"
  ]],
  43: ["lead", "Weekly 15-person squad management: Annual 360-degree review cycle, executive alignment & leadership 1:1s", [
    "Facilitate Annual 360-Degree Peer Feedback collection across all 15 team members (Product, Design, Dev, QA, DevOps): synthesize balanced reviews",
    "Present squad annual achievement summary and business impact metrics to Executive Leadership / Architecture Review Board",
    "Run 1:1 check-ins with every report to review 360 feedback, celebrate career milestones, and discuss 12-month aspirations",
    "Publish Weekly Squad Scorecard: team retention rate (100%), annual promotion list, and individual performance scorecard"
  ]],
  44: ["lead", "Weekly 15-person squad management: Capstone C multi-squad delivery, launch retro & organizational scaling plan", [
    "Orchestrate the 15-person cross-functional squad across 6 sub-pods for Capstone C Enterprise Banking launch (Web, Mobile, Core, AI, QA, SRE)",
    "Conduct end-of-program team retrospective: celebrate 44 weeks of engineering excellence, project launches, and personal growth",
    "Finalize and deliver formal annual performance evaluations, promotion announcements, and compensation adjustments for all 15 reports",
    "Present the Organizational Scaling Blueprint to Executive CTO: strategy for expanding the 15-person squad into a 50-person engineering department"
  ]]
};

// Parse clean WEEKS
const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
const code = scriptMatches[1][1];
const vm = require("vm");
const ctx = { PlanLogic, window: {}, document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, createElement: () => null, head: {}, body: {} }, localStorage: { getItem: () => null, setItem: () => {} }, location: { hash: "" } };
ctx.window = ctx;
vm.createContext(ctx);
const uiStart = code.indexOf("const $=s=>");
const dataCode = code.slice(0, uiStart) + "\nthis.WEEKS = WEEKS; this.BUILDS = BUILDS; this.BOOKS = BOOKS; this.TECHPAIRS = typeof TECHPAIRS !== \"undefined\" ? TECHPAIRS : [];";
vm.runInContext(dataCode, ctx);

// Insert tasks
ctx.WEEKS.forEach(w => {
  const at = archTasks[w.n];
  const mt = mgmtTasks[w.n];
  let idx = w.obj.findIndex(o => o[0] === "docs" || o[0] === "read");
  if (idx === -1) idx = w.obj.length;
  if (at && mt) {
    w.obj.splice(idx, 0, at, mt);
  } else if (at) {
    w.obj.splice(idx, 0, at);
  } else if (mt) {
    w.obj.splice(idx, 0, mt);
  }
});

function formatWeeks(weeks) {
  let s = "const WEEKS = [\n";
  weeks.forEach((w, wi) => {
    s += "  {n:" + w.n + ",p:" + w.p + ",title:" + JSON.stringify(w.title) + ",hours:" + w.hours + ",tech:" + JSON.stringify(w.tech) + ",deploy:" + JSON.stringify(w.deploy) + ",obj:[\n";
    w.obj.forEach((o, oi) => {
      s += "    [" + JSON.stringify(o[0]) + "," + JSON.stringify(o[1]) + ",\n      " + JSON.stringify(o[2]);
      if (o[3]) s += ",\n      " + JSON.stringify(o[3]);
      s += "]";
      if (oi < w.obj.length - 1) s += ",";
      s += "\n";
    });
    s += "  ]}";
    if (wi < weeks.length - 1) s += ",";
    s += "\n";
  });
  s += "];";
  return s;
}

const formattedWeeks = formatWeeks(ctx.WEEKS);
const startIdx = html.indexOf("const WEEKS = [");
const nextVar = html.indexOf("const TECHPAIRS =");
const endIdx = html.lastIndexOf("];", nextVar) + 2;

const newHtml = html.slice(0, startIdx) + formattedWeeks + html.slice(endIdx);
fs.writeFileSync(htmlPath, newHtml, "utf8");
console.log("SUCCESS: Applied both Architecture and 15-Person Squad Management tasks across all 44 weeks!");
