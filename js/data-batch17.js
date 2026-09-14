// ==========================================================
// Batch 17: System Design deep-dives
// Case-study system designs and core distributed-systems
// building blocks, following the table of contents of
// github.com/liquidslr/system-design-notes (estimation,
// consistent hashing, unique ID generation, and the classic
// large-scale system designs — crawler, feed, chat, YouTube,
// Drive, maps/proximity, queues, monitoring, ad aggregation,
// hotel booking, object storage, leaderboards, payments,
// stock exchange).
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b17-01",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Back-of-the-envelope estimation — what to actually calculate and why.",
  "difficulty": "Mid",
  "tags": [
    "Estimation",
    "Capacity Planning",
    "System Design & Scalability"
  ],
  "question": "How do you do back-of-the-envelope estimation in a system design interview, and what does it actually change about your design?",
  "answer": "<p>From the stated user count and usage pattern, derive QPS (average and peak &mdash; peak is usually 2&ndash;3x average, more for a spiky workload), storage growth per day/year (record size &times; write rate), and bandwidth. Round aggressively to powers of ten &mdash; the interviewer is checking that you can reason about order of magnitude, not that you can do exact arithmetic.</p>\n      <p>The numbers matter because they change the actual design: a system doing 100 QPS is a single well-indexed database; the same system at 100K QPS needs caching, read replicas, and probably sharding. Naming \"this is a 10K QPS, 500GB/year system\" up front lets every later design choice be justified against that number instead of against vague scale-speak like \"needs to be scalable.\"</p>"
},
{
  "id": "b17-02",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "A repeatable framework for any system design interview question.",
  "difficulty": "Mid",
  "tags": [
    "Interview Framework",
    "System Design",
    "System Design & Scalability"
  ],
  "question": "What's a repeatable framework for approaching any system design interview question, regardless of the specific system asked about?",
  "answer": "<p>Four phases, in order, and the biggest mistake is skipping the first one to jump straight to boxes and arrows: (1) Requirements &mdash; clarify functional scope (what must it do, what's explicitly out of scope) and non-functional requirements (read/write ratio, consistency vs availability needs, latency targets, scale); (2) Estimation &mdash; QPS, storage, bandwidth from those requirements; (3) High-level design &mdash; the core components and data flow, API shape, data model, kept deliberately simple first; (4) Deep dive &mdash; the interviewer will steer you into two or three components to go deep on (usually wherever the interesting trade-off lives: the data store choice, the fan-out strategy, the consistency model), and that's where most of the signal is actually generated.</p>\n      <p>The recurring failure mode is spending 80% of the time on the high-level box diagram and running out of time before any real trade-off gets discussed &mdash; the boxes are scaffolding, the trade-offs are the interview.</p>"
},
{
  "id": "b17-03",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Consistent hashing — what problem it solves and how it actually works.",
  "difficulty": "Senior",
  "tags": [
    "Consistent Hashing",
    "Distributed Systems",
    "System Design & Scalability"
  ],
  "question": "What problem does consistent hashing solve, and how does it work?",
  "answer": "<p>Naive hashing (`server = hash(key) % N`) means adding or removing one server changes the mapping for almost every key, forcing a near-total cache/data reshuffle. Consistent hashing places both servers and keys on a hash ring (hash space wrapped into a circle); a key belongs to the first server clockwise from its position. Adding or removing one server then only remaps the keys between it and its immediate neighbor on the ring &mdash; roughly 1/N of keys, not all of them.</p>\n      <p>The remaining problem it doesn't solve alone is uneven load if servers land unevenly on the ring (or have different capacities) &mdash; solved with virtual nodes: each physical server gets many points on the ring, so load balances out statistically and a server's virtual-node count can be tuned to its actual capacity. It's the mechanism behind sharding in Dynamo-style key-value stores and behind cache-server selection in a distributed cache.</p>"
},
{
  "id": "b17-04",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a distributed key-value store — replication and consistency trade-offs.",
  "difficulty": "Senior",
  "tags": [
    "Key-Value Store",
    "Replication",
    "CAP Theorem",
    "System Design & Scalability"
  ],
  "question": "Design a distributed key-value store (Dynamo/Cassandra-style). What are the core trade-offs?",
  "answer": "<p>Data is partitioned across nodes with consistent hashing, and each key is replicated to N nodes for durability. Reads and writes use quorum: a write succeeds once W replicas ack it, a read queries R replicas and returns the most recent version; choosing W + R &gt; N guarantees a read sees the latest write (strong consistency), while W + R &le; N trades that guarantee away for lower latency and higher availability during a partition &mdash; the CAP theorem made concrete as a tunable knob rather than a binary choice.</p>\n      <p>The other piece worth naming: since replicas can briefly disagree, the store needs a way to detect and resolve conflicting versions of the same key &mdash; vector clocks (or, more simply, last-write-wins with a timestamp, at the cost of silently dropping a concurrent write) &mdash; and a background anti-entropy process (Merkle trees comparing replica state) to repair replicas that drifted out of sync after a node was temporarily down.</p>"
},
{
  "id": "b17-05",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Distributed unique ID generation — why auto-increment doesn't scale, and Snowflake's approach.",
  "difficulty": "Senior",
  "tags": [
    "Unique ID Generator",
    "Snowflake",
    "System Design & Scalability"
  ],
  "question": "How do you generate unique IDs across multiple servers, and what does the Snowflake approach actually get you?",
  "answer": "<p>A single database's auto-increment doesn't work once there are multiple write nodes &mdash; two nodes would hand out the same ID. Twitter's Snowflake approach packs a 64-bit ID from a timestamp (most significant bits, so IDs are roughly time-sortable), a fixed machine/datacenter ID (so different nodes can never collide), and a per-millisecond sequence number local to that machine (so the same machine can mint many IDs in one millisecond without a shared counter).</p>\n      <p>This gets uniqueness with zero coordination between nodes at ID-generation time &mdash; the alternative, a centralized ID service handing out ranges, works too but adds a network round-trip and a single component every write depends on. The real cost of Snowflake-style IDs: they depend on each machine's clock being roughly correct, so clock skew or an NTP glitch needs to be handled explicitly (e.g. refusing to mint IDs if the clock appears to have moved backwards).</p>"
},
{
  "id": "b17-06",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a web crawler — how do you crawl billions of pages without melting anyone's server (including your own)?",
  "difficulty": "Senior",
  "tags": [
    "Web Crawler",
    "Distributed Systems",
    "System Design & Scalability"
  ],
  "question": "Design a web crawler that needs to crawl billions of pages. What are the hard parts?",
  "answer": "<p>Core loop: a URL frontier (queue) feeds URLs to a pool of fetcher workers, which download the page, hand it to a parser that extracts new links and content, and push newly discovered URLs back onto the frontier &mdash; a breadth-first traversal of the web graph, distributed across many workers for throughput.</p>\n      <p>The hard parts aren't the happy path: politeness (rate-limiting requests per host so the crawler doesn't DoS a site it's crawling &mdash; usually one queue per host with an enforced delay, honoring robots.txt); avoiding re-crawling the same URL (a distributed Bloom filter or a seen-URL hash set, sized for billions of entries with an acceptable false-positive rate); prioritization (a page that changes often or is highly linked-to deserves more frequent re-crawls than a static, obscure one); and avoiding crawler traps &mdash; infinite URL spaces generated by calendars or session-ID query parameters that would otherwise consume the crawler forever.</p>"
},
{
  "id": "b17-07",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a notification system — fan-out across push, SMS, and email at scale.",
  "difficulty": "Senior",
  "tags": [
    "Notification System",
    "Fan-out",
    "System Design & Scalability"
  ],
  "question": "Design a notification system that needs to deliver push, SMS, and email notifications to millions of users. What does the architecture look like?",
  "answer": "<p>Producers (any internal service that needs to notify a user) publish a notification event to a queue rather than calling delivery providers directly &mdash; that decoupling means a slow or down third-party provider (APNs, an SMS gateway) never blocks the service that triggered the notification. A pool of workers consumes the queue, looks up the user's channel preferences and device tokens, and dispatches to the right third-party provider per channel, each behind its own retry policy and circuit breaker.</p>\n      <p>Things that separate a working answer from a naive one: idempotency (a retried delivery must not double-notify the user &mdash; dedupe on a notification ID), per-user rate limiting (nobody should get 50 pushes in a minute because of a bug upstream), respecting user preferences and quiet hours, and a durable log of what was actually sent, since \"did this user get notified\" is a support and compliance question that comes up constantly.</p>"
},
{
  "id": "b17-08",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a news feed — fan-out on write vs fan-out on read.",
  "difficulty": "Senior",
  "tags": [
    "News Feed",
    "Fan-out",
    "System Design & Scalability"
  ],
  "question": "Design a news feed system (like Facebook/Twitter's home timeline). Fan-out on write vs fan-out on read — how do you choose?",
  "answer": "<p>Fan-out on write: when a user posts, immediately push that post into every follower's precomputed feed (stored in a fast store like Redis). Reading the feed is then a cheap lookup of an already-built list &mdash; great for the common case, but a celebrity with 50 million followers turns one post into 50 million writes, which is both slow and wasteful if most of those followers never open the app that day.</p>\n      <p>Fan-out on read: don't precompute anything; when a user opens their feed, query posts from everyone they follow and merge/rank on the fly. Cheap to write, expensive to read, and slow for a user following thousands of accounts. The standard production answer is hybrid: fan-out on write for ordinary users, fan-out on read (merged in at request time) for high-follower accounts &mdash; getting fast reads for the common case without the celebrity write-amplification problem.</p>"
},
{
  "id": "b17-09",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a real-time chat system — message delivery, ordering, and online presence.",
  "difficulty": "Senior",
  "tags": [
    "Chat System",
    "WebSockets",
    "System Design & Scalability"
  ],
  "question": "Design a real-time one-to-one and group chat system (WhatsApp-style). How do you handle delivery, ordering, and presence?",
  "answer": "<p>Clients hold a persistent connection (WebSocket, or a long-lived connection to a service like MQTT for mobile battery efficiency) to a chat server; a message from sender to recipient is written to storage first, then routed to the recipient's connection if they're online via a lookup table mapping user &rarr; which server instance holds their connection &mdash; if they're offline, it's delivered as a push notification and picked up on reconnect via a sync/pull of undelivered messages.</p>\n      <p>Ordering within a conversation is usually kept simple with a per-message sequence number or timestamp assigned at the server, not the client (clients' clocks aren't trustworthy or synchronized). Group chat fans a message out to every member's connection the same way a 1:1 message routes, just to more recipients. Presence (online/offline/typing) is normally its own lightweight, best-effort pub/sub system deliberately decoupled from message delivery &mdash; losing a typing indicator is fine; losing a message is not, so they shouldn't share a reliability guarantee or a failure path.</p>"
},
{
  "id": "b17-10",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design search-box autocomplete — serving top suggestions in milliseconds.",
  "difficulty": "Mid",
  "tags": [
    "Autocomplete",
    "Trie",
    "System Design & Scalability"
  ],
  "question": "Design a search autocomplete (typeahead) system. How do you serve top suggestions for a prefix in milliseconds?",
  "answer": "<p>Historical query logs are aggregated offline (batch job, hourly/daily) into a trie where each node caches the top-K most frequent completions below it &mdash; precomputing the ranking offline is what makes the online read path cheap: a lookup just walks the trie by prefix and returns the cached top-K at that node, no scoring at request time.</p>\n      <p>At real scale the trie itself is sharded (e.g. by first letter) across multiple servers behind a client-side cache, since latency budgets here are single-digit milliseconds and a network round-trip per keystroke has to stay fast. The main design tension is freshness vs cost: rebuilding the trie in real time as queries stream in is expensive and mostly unnecessary, since query popularity shifts slowly enough that a periodic offline rebuild (with a smaller, faster real-time layer for trending/breaking terms) is the standard trade-off.</p>"
},
{
  "id": "b17-11",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a video platform like YouTube — upload pipeline and playback delivery.",
  "difficulty": "Senior",
  "tags": [
    "Video Streaming",
    "CDN",
    "System Design & Scalability"
  ],
  "question": "Design a video sharing platform (YouTube-style). Walk through the upload pipeline and how playback is actually delivered.",
  "answer": "<p>Upload: the raw file goes to blob storage (S3-like object storage), then an async transcoding pipeline (a chain of workers, often orchestrated as a DAG) produces multiple resolutions/bitrates and formats from that source, splitting each into small chunks per format (DASH/HLS) so a player can adapt quality to the viewer's current bandwidth mid-playback rather than committing to one bitrate for the whole video.</p>\n      <p>Playback: transcoded chunks are pushed to a CDN, and the player fetches from the nearest edge location rather than the origin &mdash; this is what makes video the one workload where CDN is not optional, since origin-only delivery at this data volume and this geographic spread of viewers is both too slow and too expensive. Metadata (title, view count, comments) lives in a normal database, entirely decoupled from the video bytes themselves, so a metadata read never touches the (much larger, much more expensive) video storage path.</p>"
},
{
  "id": "b17-12",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design Google Drive / Dropbox — file sync across devices without conflicts.",
  "difficulty": "Senior",
  "tags": [
    "File Sync",
    "Google Drive",
    "System Design & Scalability"
  ],
  "question": "Design a cloud file storage and sync service (Google Drive/Dropbox-style). How do you keep multiple devices in sync without corrupting files?",
  "answer": "<p>A file is split into fixed-size blocks; only changed blocks are re-uploaded on an edit (block-level delta sync), which is what makes editing one paragraph of a large document fast instead of re-uploading the whole file. Each client keeps a local index of block hashes to detect what actually changed since the last sync, and a notification service pushes \"something changed\" events to a user's other online devices so they can pull the delta rather than polling.</p>\n      <p>The genuinely hard part is conflict resolution: two devices editing the same file while offline, then both reconnecting. The common real-world answer isn't automatic merging of file content (too fragile in general) &mdash; it's versioning with last-write-wins at the file level plus keeping both versions as a \"conflicted copy\" for the user to reconcile manually, which is honest about a limit application-level merge logic can't safely paper over for arbitrary file types.</p>"
},
{
  "id": "b17-13",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a proximity/nearby-search service — finding what's close, fast.",
  "difficulty": "Senior",
  "tags": [
    "Proximity Service",
    "Geohashing",
    "System Design & Scalability"
  ],
  "question": "Design a proximity service (e.g. 'find restaurants near me', or 'nearby friends'). How do you index location data so a radius query is fast?",
  "answer": "<p>A naive scan-and-compute-distance-for-everything doesn't scale past a small dataset. The standard fix is to encode 2D lat/long into a 1D spatial index that preserves locality &mdash; geohashing (recursively divides the map into a grid, encodes a cell as a string prefix, so nearby points usually share a prefix) or a quadtree/S2-cell approach achieve the same goal. A radius query then becomes: compute the geohash cells covering that radius, and query only entities in those cells &mdash; not the whole dataset.</p>\n      <p>For something like nearby friends where locations update constantly (unlike restaurants, which are near-static), the write path matters as much as the read path: location updates go to a fast in-memory geospatial index (Redis supports geohash-backed queries natively) rather than a full database write per update, since a moving user might update position every few seconds and a real database at that write rate, per user, doesn't scale.</p>"
},
{
  "id": "b17-14",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a distributed message queue (Kafka-style) — durability without losing throughput.",
  "difficulty": "Senior",
  "tags": [
    "Message Queue",
    "Kafka",
    "System Design & Scalability"
  ],
  "question": "Design a distributed message queue like Kafka. How does it get high throughput and durability at the same time?",
  "answer": "<p>A topic is split into partitions, each an append-only log stored sequentially on disk &mdash; sequential disk writes are nearly as fast as memory writes and far faster than random I/O, which is most of where the throughput comes from; there's no per-message overhead like a database transaction, just an append. Each partition is replicated across brokers (one leader takes writes, followers replicate), and a producer can choose how many replicas must ack before a write is considered durable &mdash; the same durability/latency knob as a key-value store's write quorum.</p>\n      <p>Consumers track their own read offset per partition rather than the broker tracking per-consumer state, which is what lets multiple independent consumer groups read the same log at their own pace, and lets a consumer replay from an earlier offset (reprocessing) since messages aren't deleted on read, only after a retention window. Ordering is guaranteed only within a partition, not across the whole topic &mdash; which is why the partition key (e.g. user ID) is the actual design decision that determines what ordering guarantee callers get.</p>"
},
{
  "id": "b17-15",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a metrics monitoring and alerting system.",
  "difficulty": "Senior",
  "tags": [
    "Monitoring",
    "Observability",
    "System Design & Scalability"
  ],
  "question": "Design a metrics monitoring and alerting system (a Datadog/Prometheus-style pipeline). What are the core pieces?",
  "answer": "<p>Agents on each host/service collect metrics and push (or expose for pull/scrape) them to a collection tier, which writes into a time-series database &mdash; a data store specialized for this write pattern (append-mostly, time-ordered, queried by time range and downsampled for older data) rather than a general relational store, since raw per-second metrics at fleet scale would be enormous otherwise.</p>\n      <p>Two pieces above storage matter more than the storage itself: a rules engine that evaluates alert conditions against incoming metrics (e.g. \"error rate &gt; 5% for 5 minutes\") and fires to an on-call/notification system, and downsampling/rollups (keep raw resolution for a short recent window, coarser aggregates for older data) since nobody queries per-second granularity from a year ago and storing it at full resolution forever is pure waste. The hard trade-off to name unprompted: push (agents proactively send data — simpler for agents behind NAT/firewalls) vs pull (a central scraper fetches from known targets — easier to reason about system health when a target stops responding, since a missing scrape is itself a signal).</p>"
},
{
  "id": "b17-16",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design an ad click event aggregation pipeline.",
  "difficulty": "Senior",
  "tags": [
    "Event Aggregation",
    "Stream Processing",
    "System Design & Scalability"
  ],
  "question": "Design a system to aggregate billions of ad click events per day for real-time and historical reporting. What's the pipeline?",
  "answer": "<p>Click events stream into a message queue first (buffering and decoupling ingestion from processing, since a burst of traffic shouldn't be lost just because the aggregator is momentarily behind), then a stream processor (Flink/Spark Streaming-style) aggregates counts per ad/campaign in windows &mdash; both a fast, approximate real-time view (for a live dashboard) and a slower, exact batch reprocessing pass over the same raw events (for the numbers that actually get billed to advertisers, where correctness matters more than latency).</p>\n      <p>Two correctness issues that separate a real design from a toy one: exactly-once counting despite at-least-once delivery from the queue (dedupe on a unique event ID, since double-counting a click directly overcharges an advertiser), and late/out-of-order events (a click can arrive minutes after it happened due to a mobile client retry) &mdash; handled with watermarking, which accepts events into a time window up to some lateness bound and finalizes/re-emits the aggregate once that bound passes.</p>"
},
{
  "id": "b17-17",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a hotel/ticket reservation system — preventing double-booking under concurrency.",
  "difficulty": "Senior",
  "tags": [
    "Reservation System",
    "Concurrency",
    "System Design & Scalability"
  ],
  "question": "Design a hotel (or event ticket) reservation system. How do you prevent two people from booking the same room/seat at the same time?",
  "answer": "<p>The core race condition: two requests both read \"room available,\" both proceed to book, and now the room is double-booked &mdash; a check-then-act sequence with no atomicity between the two. The fix is to make the booking itself the atomicity boundary: a conditional/atomic write at the database level (`UPDATE rooms SET status='booked' WHERE id=? AND status='available'`, checking rows-affected) or a pessimistic row lock held for the duration of the booking transaction, rather than checking availability in application code and booking in a separate step.</p>\n      <p>At higher scale, a short-lived reservation hold (10&ndash;15 minutes, e.g. while the user is on the payment page) is modeled as its own state, with a background job that releases holds that expire without completing payment &mdash; without it, a user who abandons checkout mid-payment would lock that room/seat away from everyone else indefinitely. Idempotency on the actual booking confirmation matters too, for the same reason it matters in payments: a retried confirmation request must not create two bookings for one successful payment.</p>"
},
{
  "id": "b17-18",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design an S3-like object storage service.",
  "difficulty": "Senior",
  "tags": [
    "Object Storage",
    "S3",
    "System Design & Scalability"
  ],
  "question": "Design an S3-like object storage service. How is it actually structured underneath a simple put/get API?",
  "answer": "<p>Two layers, deliberately separated: metadata (bucket/key name, size, content-type, permissions, the pointer to where the actual bytes live) in a fast, strongly-consistent database, and the object bytes themselves on a separate storage layer optimized purely for large sequential blobs. A large object is split into chunks distributed across many storage nodes, each chunk replicated (or erasure-coded, which trades some CPU/complexity for meaningfully less storage overhead than full replication at the same durability target) across multiple nodes/availability zones for durability.</p>\n      <p>The interesting design decisions live in the trade-offs, not the happy path: durability is bought by spreading replicas across failure domains (rack, datacenter) so a single hardware or power failure can't take out every copy of an object at once; and the API's simplicity (put/get/delete on an opaque key) is exactly what makes it horizontally scalable &mdash; there's no cross-object transaction or relational constraint to coordinate, so objects can be sharded and load-balanced independently of each other.</p>"
},
{
  "id": "b17-19",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a real-time gaming leaderboard for millions of players.",
  "difficulty": "Mid",
  "tags": [
    "Leaderboard",
    "Redis",
    "System Design & Scalability"
  ],
  "question": "Design a real-time leaderboard (top-N players by score, plus 'my rank') for a game with millions of concurrent players.",
  "answer": "<p>A relational `ORDER BY score DESC LIMIT N` re-sorting the whole players table on every score update doesn't hold up at this write rate. The standard answer is a sorted-set data structure (Redis `ZSET` is the textbook fit) keeping player &rarr; score with O(log n) inserts/updates and O(log n + N) range queries &mdash; both \"top N globally\" and \"this player's rank\" are cheap native operations on that structure, rather than a full table scan.</p>\n      <p>At true global scale, one sorted set becomes a bottleneck (all writes serialize through it), so it's sharded &mdash; e.g. by region or by score range &mdash; with a lightweight aggregation step to merge shards for a true global top-N view, or the product requirement is relaxed to \"top N per region\" or \"top N updated every few seconds via a periodic batch merge\" instead of a perfectly live global rank on every single write, since that relaxation is usually an acceptable, and much cheaper, trade-off for a leaderboard specifically.</p>"
},
{
  "id": "b17-20",
  "category": "system-design",
  "categoryName": "System Design",
  "topic": "System Design & Scalability",
  "title": "Design a payment processing system — correctness under failure matters more than throughput.",
  "difficulty": "Senior",
  "tags": [
    "Payment System",
    "Distributed Transactions",
    "System Design & Scalability"
  ],
  "question": "Design a payment processing system that moves money between a payer, your platform, and a payee. What makes this different from designing a typical high-throughput system?",
  "answer": "<p>Most system design problems optimize for throughput and tolerate an occasional lost or duplicated unit of work; a payment system inverts that priority &mdash; correctness (never lose money, never double-charge, never silently drop a transaction) matters far more than raw throughput, and every design decision should be read against that.</p>\n      <p>Concretely: every payment request carries a client-generated idempotency key so a network-timeout-induced retry can't double-charge; state transitions (initiated &rarr; authorized &rarr; captured &rarr; settled, or failed at any step) are recorded in an append-only ledger, not just a single mutable \"status\" column, so the full history is auditable and a reconciliation job can be run against it later; and a payment that spans two systems (debit the payer, credit the payee) uses the saga pattern &mdash; a sequence of local transactions each with a defined compensating action &mdash; rather than a single distributed transaction, since a two-phase commit across a service you don't own (the actual bank/card network) isn't achievable anyway. A separate, offline reconciliation process comparing your ledger against the payment processor's records is not optional polish here &mdash; it's the actual backstop that catches whatever the real-time path missed.</p>"
}
);
