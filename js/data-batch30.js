// ==========================================================
// Batch 30: Spring Boot — gap-fill installment 2.
// General-batch4/roadmap25/batch26 covered @SpringBootApplication,
// auto-config, DI annotations, @Transactional pitfalls, bean
// scopes, N+1/JPA, profiles, actuator, GraalVM, virtual threads,
// Security 6, JPA L2 cache, Resilience4j, Testcontainers +
// @ServiceConnection, test slices, @ControllerAdvice/ProblemDetail,
// @Cacheable, @Scheduled/@Async, the Jakarta EE/Boot 3 migration,
// Micrometer Observation, and Kafka listener idempotency. This
// batch covers validation, AOP, JPA specifications, optimistic/
// pessimistic locking, Flyway/Liquibase, Spring Cloud Config/
// Gateway, WebFlux basics and backpressure, JWT filter
// implementation, CORS, multi-module project structure,
// @ConfigurationProperties vs @Value, embedded-server choice,
// custom Actuator metrics, @Retryable, RabbitMQ ack modes, JPA
// auditing, startup-time optimization, Docker layered JARs,
// distributed transactions/Saga, @Transactional propagation, and
// MockMvc vs WebTestClient.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b30-01",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Bean Validation (@Valid) — where the actual validation logic runs, and writing a custom validator.",
  "difficulty": "Mid",
  "tags": ["Bean Validation", "@Valid", "Jakarta Validation", "Testing & Production Readiness"],
  "question": "How does @Valid on a controller method parameter actually trigger validation, and when do you need a custom validator instead of the built-in annotations?",
  "answer": "<p><code>@Valid</code> on a request body parameter tells Spring's argument-resolution machinery to run Jakarta Bean Validation against the incoming object before the controller method body even executes — each field's annotations (<code>@NotNull</code>, <code>@Size</code>, <code>@Email</code>, and so on) are checked by the Validation provider (Hibernate Validator, the default implementation), and a violation causes Spring to throw <code>MethodArgumentNotValidException</code> automatically, which a <code>@ControllerAdvice</code> can translate into a consistent error response — the controller method itself only ever runs with an already-valid object.</p>\n      <p>The built-in annotations cover single-field constraints well but can't express validation depending on more than one field at once — \"end date must be after start date,\" or \"exactly one of these two optional fields must be present.\" A custom validator (implementing <code>ConstraintValidator</code>, applied via a custom annotation) is the right tool for that class of cross-field rule, keeping it declarative and reusable rather than hand-writing an if-check inside the controller or service method — which would work but loses the automatic, consistent error-handling integration that annotation-driven validation gets for free.</p>"
},
{
  "id": "b30-02",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring AOP — advice types, and the proxy-based limitation that trips people up.",
  "difficulty": "Senior",
  "tags": ["Spring AOP", "Aspects", "Proxies", "Testing & Production Readiness"],
  "question": "What are the different advice types in Spring AOP, and why does the same proxy-based limitation that breaks self-invoked @Transactional calls also break aspects?",
  "answer": "<p>An aspect's advice can run <code>@Before</code> a method executes, <code>@After</code> it returns (or <code>@AfterThrowing</code> specifically on exception, <code>@AfterReturning</code> specifically on success), or <code>@Around</code> it — wrapping the call entirely, with full control over whether and how the original method actually runs, which is the most powerful and most commonly used form for things like timing a method's execution or implementing custom retry logic declaratively.</p>\n      <p>Spring AOP implements aspects the same way it implements <code>@Transactional</code> and <code>@Cacheable</code> — by wrapping the target bean in a proxy that intercepts calls arriving from <em>outside</em> the bean. A method calling another method on <code>this</code> within the same class bypasses the proxy entirely, since that call never goes through the external reference the proxy intercepts — so an aspect applied to a method that's only ever called via self-invocation from elsewhere in the same class simply never fires, a genuinely common source of \"why isn't my aspect running\" confusion that traces back to the exact same proxy limitation as the classic self-invoked <code>@Transactional</code> bug, just showing up in a different annotation.</p>"
},
{
  "id": "b30-03",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "JPA Specifications — building dynamic queries without string-concatenating JPQL.",
  "difficulty": "Senior",
  "tags": ["JPA", "Specifications", "Criteria API", "Testing & Production Readiness"],
  "question": "A search endpoint needs to filter by an arbitrary combination of optional parameters. Why not just build the JPQL query string dynamically, and what does the Specification API give you instead?",
  "answer": "<p>Hand-concatenating a JPQL or SQL string based on which optional filters are present is both a real injection risk if any piece of that concatenation isn't properly parameterized, and it produces a tangle of conditional string-building logic that gets progressively harder to read and maintain as more optional filters are added — a method with ten optional search parameters concatenated conditionally becomes genuinely hard to verify is correct for every combination.</p>\n      <p>Spring Data JPA's <code>Specification&lt;T&gt;</code> interface (built on the JPA Criteria API underneath) lets each optional filter be expressed as its own small, independently-testable predicate-building function, composed together with <code>Specification.where(...).and(...)</code> — only the specifications for filters that are actually present get combined, and each one is type-safe, checked against the entity's actual fields at compile time rather than a raw string. It's more verbose than a raw query for a query with all-required filters, which is exactly why it's reached for specifically when the combination of filters is genuinely dynamic and optional, not as a default replacement for a query that's always the same shape.</p>"
},
{
  "id": "b30-04",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Optimistic vs pessimistic locking in JPA — @Version and when each actually applies.",
  "difficulty": "Senior",
  "tags": ["JPA", "Optimistic Locking", "Pessimistic Locking", "@Version", "Testing & Production Readiness"],
  "question": "How does @Version-based optimistic locking actually prevent a lost update, and when is pessimistic locking the better choice instead?",
  "answer": "<p>A <code>@Version</code>-annotated field is included in every update's <code>WHERE</code> clause and incremented on every successful update — two concurrent transactions reading the same row both see the same version number, but whichever one commits its update first increments the version, so the second transaction's update (still matching the old version in its WHERE clause) matches zero rows and Spring throws <code>OptimisticLockException</code> instead of silently overwriting the first transaction's change. This is cheap (no actual database lock held while the user is thinking or the request is in flight) and works well when conflicting concurrent updates to the same row are genuinely rare — the common case for most application data.</p>\n      <p>Pessimistic locking (<code>SELECT ... FOR UPDATE</code>, via <code>@Lock(LockModeType.PESSIMISTIC_WRITE)</code>) instead acquires an actual database row lock at read time, blocking any other transaction from reading (in some lock modes) or writing that row until the first transaction commits or rolls back — the right choice specifically when conflicts are expected to be frequent enough that optimistic locking's retry-on-conflict pattern (catching the exception and retrying the whole operation) would thrash constantly, or when the business logic genuinely can't tolerate a failed-and-retried update (a financial ledger update that must succeed in its original attempt, not restart from scratch). The real cost of pessimistic locking is holding that lock for the duration of the transaction, which under high contention can itself become the bottleneck and risk deadlocks if lock acquisition order isn't disciplined across the codebase.</p>"
},
{
  "id": "b30-05",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Flyway vs Liquibase — and why 'just run the DDL manually' doesn't scale.",
  "difficulty": "Mid",
  "tags": ["Flyway", "Liquibase", "Database Migrations", "Testing & Production Readiness"],
  "question": "What problem do Flyway/Liquibase actually solve for a Spring Boot app's database schema, and how do you choose between them?",
  "answer": "<p>Manually running schema-change SQL against each environment (dev, staging, production) as engineers remember to means environments inevitably drift — one environment gets a column added, another doesn't, and nobody has a single reliable record of what schema state any given environment is actually in. A migration tool makes the schema's evolution itself versioned, ordered code: each migration is a numbered, immutable script, applied automatically and exactly once per environment on application startup (or via a separate CI step), with the tool tracking which migrations have already run in a metadata table — so a fresh environment and years-old production database both converge to the identical schema state by replaying the same ordered history.</p>\n      <p>Flyway's migrations are plain versioned SQL files (or Java-based migrations for logic too complex for SQL alone) — simple, SQL-native, and the default most Spring Boot teams reach for. Liquibase supports a database-agnostic changelog format (XML, YAML, or JSON) that can generate the actual SQL per target database dialect, which is the real reason to choose it specifically — a team supporting multiple database vendors (or migrating between them) benefits from Liquibase's dialect abstraction, while a team committed to one database engine usually finds Flyway's plain-SQL simplicity easier to read, review, and debug.</p>"
},
{
  "id": "b30-06",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Cloud Config Server — centralizing configuration across microservices.",
  "difficulty": "Senior",
  "tags": ["Spring Cloud Config", "Microservices", "Configuration", "Testing & Production Readiness"],
  "question": "What problem does a Spring Cloud Config Server actually solve for a microservices fleet, versus each service just having its own application.yml?",
  "answer": "<p>Each service having its own bundled configuration file works fine for a handful of services, but at real microservices scale it means a configuration value shared across many services (a common downstream endpoint, a shared feature-flag default) has to be updated in every single service's own repository and redeployed everywhere it's duplicated — and there's no single place to see or audit what configuration is actually running across the whole fleet at once.</p>\n      <p>A Config Server centralizes configuration in one place — typically backed by a Git repository, so configuration changes get the same review and version-history discipline as code — and services fetch their configuration from it at startup (and can refresh it at runtime via a <code>/refresh</code> endpoint or an event-driven bus, without a full redeploy for a config-only change). The real operational win: a configuration change that affects many services is made in one place and rolled out consistently, and the Git-backed history gives a genuine audit trail of what configuration value was active at any point in time — valuable specifically when debugging \"this worked yesterday, what changed\" across a fleet where nobody remembers who touched what config, when.</p>"
},
{
  "id": "b30-07",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Cloud Gateway — building an API gateway in Spring, not just fronting one.",
  "difficulty": "Senior",
  "tags": ["Spring Cloud Gateway", "API Gateway", "Reactive", "Testing & Production Readiness"],
  "question": "What does Spring Cloud Gateway actually give you over a standalone gateway product (Kong, Apigee), and why is it built on WebFlux specifically?",
  "answer": "<p>Spring Cloud Gateway is a code-first, reactive API gateway you configure and extend as a Spring application — routes, predicates (what request matches this route), and filters (what happens to the request/response, like adding a header or rewriting a path) are all Spring beans and configuration, meaning custom gateway logic can be written as ordinary Java/Kotlin code with full access to the Spring ecosystem (dependency injection, the same observability/tracing instrumentation as the rest of a Spring-based fleet), rather than a proprietary plugin language or configuration DSL a standalone gateway product requires.</p>\n      <p>It's built on WebFlux (Spring's reactive stack) rather than the traditional servlet stack specifically because a gateway's job is almost entirely I/O-bound — routing a request through, waiting on a downstream service's response, and passing it back — the classic case where non-blocking I/O lets one gateway instance handle far more concurrent in-flight requests per thread than the traditional one-thread-per-request servlet model would, since a thread isn't held blocked and idle while waiting on a slow downstream call. The tradeoff to know: this locks a gateway's own custom filter code into reactive programming's non-blocking discipline — a filter that calls a blocking library internally reintroduces exactly the thread-starvation risk the reactive stack was chosen to avoid.</p>"
},
{
  "id": "b30-08",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring WebFlux — Mono and Flux, and what 'reactive' actually changes about your code.",
  "difficulty": "Senior",
  "tags": ["WebFlux", "Reactive Programming", "Mono", "Flux", "Testing & Production Readiness"],
  "question": "What do Mono and Flux actually represent, and what has to change in how you write code compared to traditional Spring MVC?",
  "answer": "<p><code>Mono&lt;T&gt;</code> represents a stream that will emit zero or one value (or an error); <code>Flux&lt;T&gt;</code> represents a stream of zero to many values over time — both are lazy: nothing actually executes until something subscribes to the stream, unlike a traditional method that returns a value or throws synchronously the moment it's called. This is the biggest mental shift required: a WebFlux controller method returning <code>Mono&lt;Response&gt;</code> doesn't compute and return a response directly — it describes a pipeline of operations (map, flatMap, filter) that will run once subscribed, and blocking inside that pipeline to \"just get the value out\" (calling <code>.block()</code>) defeats the entire point and, on the WebFlux event-loop threads specifically, can seize up the small, fixed thread pool the whole reactive model depends on.</p>\n      <p>The practical consequence: every downstream call in a WebFlux code path — the database driver, an HTTP client calling another service, anything — needs its own genuinely non-blocking, reactive-compatible implementation (R2DBC instead of a traditional blocking JDBC driver, WebClient instead of a blocking RestTemplate), because a single blocking call anywhere in the chain reintroduces the exact thread-starvation problem the whole reactive architecture exists to avoid. This is also exactly why adopting WebFlux isn't a drop-in swap for an existing traditional Spring MVC app with JDBC and blocking clients already wired throughout — it's a genuine architectural commitment that needs every layer of the stack to actually be reactive, not just the web layer.</p>"
},
{
  "id": "b30-09",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Backpressure in WebFlux — what happens when a producer is faster than its consumer.",
  "difficulty": "Senior",
  "tags": ["WebFlux", "Backpressure", "Reactive Streams", "Testing & Production Readiness"],
  "question": "What is backpressure in the Reactive Streams sense, and what actually happens if a Flux producer emits data faster than the subscriber can process it?",
  "answer": "<p>Reactive Streams (the specification WebFlux/Project Reactor implements) builds backpressure into the subscription protocol itself: a subscriber explicitly requests how many items it's ready to receive (<code>request(n)</code>), and a well-behaved publisher only emits up to that requested amount, waiting for further requests before emitting more — rather than a traditional callback-based stream that just pushes data as fast as it's produced regardless of whether the receiver is ready, which is exactly what causes an unbounded buffer to grow (and eventually run out of memory) when a fast producer overwhelms a slow consumer.</p>\n      <p>When a source genuinely can't be made to respect backpressure requests (an external system pushing data at its own pace with no ability to slow down, like a raw incoming network stream), Reactor gives you explicit strategies to choose from rather than silently buffering forever: <code>onBackpressureBuffer</code> (buffer up to a configured limit, then apply a defined overflow strategy), <code>onBackpressureDrop</code> (discard excess items rather than buffering them), or <code>onBackpressureLatest</code> (keep only the most recent item, discarding older unprocessed ones) — the right choice depends entirely on whether the data is the kind where losing intermediate values is acceptable (a live sensor reading, where only the latest value matters) or not (a sequence of financial transactions, where dropping any is unacceptable and buffering with a hard limit plus an explicit failure signal is the safer choice).</p>"
},
{
  "id": "b30-10",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Writing a custom JWT authentication filter and registering it in the Spring Security chain.",
  "difficulty": "Senior",
  "tags": ["Spring Security", "JWT", "Filter Chain", "Testing & Production Readiness"],
  "question": "How do you actually implement JWT-based authentication in Spring Security — what does the custom filter do, and where does it sit in the chain?",
  "answer": "<p>A custom filter, typically extending <code>OncePerRequestFilter</code> (guaranteeing it runs exactly once per request regardless of how many times the request is internally forwarded/included), extracts the JWT from the <code>Authorization</code> header, validates its signature and expiry, and — if valid — constructs an <code>Authentication</code> object from its claims and sets it on the <code>SecurityContextHolder</code> for the remainder of that request's processing. It's registered into the filter chain with <code>addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)</code>, positioning it to run before Spring Security's own standard authentication filter, since by the time that filter would normally run, this custom filter has already established (or not) an authenticated context from the token.</p>\n      <p>The details that separate a correct implementation from a subtly broken one: an invalid or expired token should let the request continue unauthenticated (not throw an exception directly from the filter) so that a downstream authorization check produces the standard 401/403, rather than a raw filter exception producing an unhandled 500; and since Spring Boot 3's move to a fully stateless <code>SecurityFilterChain</code> configuration (no server-side session), every single request re-validates its own token independently — there's no session to fall back on, so a missing or malformed <code>Authorization</code> header on any protected endpoint has to be handled explicitly and consistently by this filter and the security configuration together, not left to whatever Spring's defaults happen to produce.</p>"
},
{
  "id": "b30-11",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "CORS configuration pitfalls — why it 'works in Postman but not in the browser'.",
  "difficulty": "Mid",
  "tags": ["CORS", "Spring Security", "Testing & Production Readiness"],
  "question": "A Spring Boot API works fine when called from Postman but the browser blocks it with a CORS error. What's actually happening, and what's the common misconfiguration?",
  "answer": "<p>CORS is a browser-enforced security policy, not a server-side restriction — Postman (and any non-browser HTTP client) never sends the preflight <code>OPTIONS</code> request or enforces the <code>Access-Control-Allow-Origin</code> response header at all, so a CORS misconfiguration is invisible to it entirely; it only ever shows up when a real browser's own JavaScript makes the cross-origin request and the browser itself blocks the response from reaching the calling script because the server's response headers didn't explicitly permit that origin.</p>\n      <p>The common misconfiguration: adding CORS configuration at the controller level (<code>@CrossOrigin</code>) while Spring Security's own filter chain rejects the request before it ever reaches the controller — Spring Security has its own separate CORS configuration (a <code>CorsConfigurationSource</code> bean wired into <code>http.cors()</code> in the security filter chain) that has to be configured, since a request blocked or misconfigured at the security-filter level never reaches the controller-level <code>@CrossOrigin</code> annotation at all. And a genuinely dangerous shortcut worth flagging: setting <code>Access-Control-Allow-Origin: *</code> alongside credentialed requests (cookies, <code>Authorization</code> headers) is actually disallowed by the CORS spec itself for exactly this reason — a wildcard origin combined with credentials would let any website make authenticated requests on a logged-in user's behalf, so a real allowlist of specific trusted origins is required once credentials are involved, not a wildcard.</p>"
},
{
  "id": "b30-12",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Structuring a multi-module Spring Boot project — what actually belongs in separate modules.",
  "difficulty": "Senior",
  "tags": ["Multi-Module", "Maven", "Gradle", "Project Structure", "Testing & Production Readiness"],
  "question": "How do you decide what belongs in separate Maven/Gradle modules for a growing Spring Boot application, versus keeping it as one module?",
  "answer": "<p>The same modularization discipline mobile architecture applies to Gradle feature modules applies here: a module boundary should enforce a real dependency direction, not just organize files into folders that could just as easily live in one module with good package naming. A common, defensible split for a Spring Boot app that's outgrown a single module: an <code>api</code> module (shared DTOs/contracts other services or modules consume, with zero dependency on implementation details), a <code>domain</code> module (core business logic with no framework dependency, testable in isolation), a <code>persistence</code> module (JPA entities and repositories, depending on domain), and an <code>app</code> module (the actual Spring Boot application, wiring everything together with configuration and controllers) — each module's <code>build.gradle</code>/<code>pom.xml</code> dependencies enforce that, say, <code>domain</code> genuinely cannot depend on <code>persistence</code>, catching a layering violation at build time rather than relying on code review to catch it.</p>\n      <p>The point where this stops paying for itself: a small application with one team and no plan to extract any part of it as an independently-deployable service gets real overhead (more build configuration, more inter-module dependency wiring) without a correspondingly real benefit — module boundaries earn their cost specifically when there's a genuine reason to enforce a dependency direction (multiple teams, a plan to eventually split out a service, a genuinely reusable core library) rather than being applied as a default best practice regardless of the actual need.</p>"
},
{
  "id": "b30-13",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@ConfigurationProperties vs @Value — why type-safe config binding wins at scale.",
  "difficulty": "Mid",
  "tags": ["@ConfigurationProperties", "@Value", "Configuration", "Testing & Production Readiness"],
  "question": "@Value('${some.property}') and @ConfigurationProperties both read configuration. What's the actual difference, and when does it matter?",
  "answer": "<p><code>@Value</code> injects one property at a time, referenced by its full string key at each injection point — scattered across however many classes happen to need that value, each with its own hardcoded key string, no compile-time check that the key actually exists in any configuration file, and no natural grouping of related properties that belong together conceptually.</p>\n      <p><code>@ConfigurationProperties</code> binds a whole related group of properties (everything under a common prefix, like <code>app.mail.*</code>) onto one strongly-typed class in a single place — a typo in a property key surfaces as a bind failure at startup (with <code>@ConstructorBinding</code> and validation annotations, actual startup-time failure rather than a silently-null value later at runtime), IDE autocomplete and refactoring work against the properties class the way they would for any other typed class, and related configuration values are discoverable in one place instead of scattered across dozens of <code>@Value</code> call sites. The practical guidance: <code>@Value</code> is fine for a genuinely one-off, single property referenced in exactly one place; a related group of configuration values used across a feature (any real integration's settings — a mail server, a third-party API's base URL and timeout) belongs in a properties class instead.</p>"
},
{
  "id": "b30-14",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Embedded Tomcat vs Netty vs Undertow — when the default embedded server is worth changing.",
  "difficulty": "Senior",
  "tags": ["Tomcat", "Netty", "Undertow", "Embedded Server", "Testing & Production Readiness"],
  "question": "Spring Boot defaults to embedded Tomcat for a traditional MVC app. When would you actually switch to Netty or Undertow instead?",
  "answer": "<p>Tomcat's traditional blocking, thread-per-request model is the right default for the overwhelming majority of Spring MVC applications — mature, well-understood, extensively battle-tested, and fine for typical request volumes where the number of concurrent in-flight requests stays well within a reasonably-sized thread pool. Netty is what Spring Boot uses automatically the moment you're on WebFlux rather than MVC, since Netty's own non-blocking, event-loop-based I/O model is what actually makes reactive programming's benefits real at the server level — pairing WebFlux with a traditional blocking server would defeat the entire premise.</p>\n      <p>Undertow is the case that actually involves a deliberate choice within traditional MVC: it's a genuinely lighter-weight, generally faster-starting embedded server than Tomcat for a servlet-based (non-reactive) app, which mainly matters for a use case where startup time or memory footprint per instance is itself a meaningful cost — a serverless/function-style deployment spinning up many short-lived instances, or a very high pod-density Kubernetes deployment where every instance's memory footprint compounds across a large replica count. For an ordinary long-running service with typical traffic, this difference rarely justifies switching away from the well-trodden Tomcat default — it's a genuine but narrow optimization, not a default-worthy change.</p>"
},
{
  "id": "b30-15",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Exposing custom business metrics through Actuator, not just JVM/HTTP defaults.",
  "difficulty": "Mid",
  "tags": ["Actuator", "Micrometer", "Custom Metrics", "Testing & Production Readiness"],
  "question": "Actuator gives you JVM and HTTP request metrics out of the box. How do you add a custom business metric — say, orders processed per minute — that Prometheus can actually scrape?",
  "answer": "<p>Actuator's built-in metrics come from Micrometer instrumentation already wired into Spring's own infrastructure (the servlet container, the HTTP client, the JVM). A custom business metric is registered the same way, just from your own code: inject a <code>MeterRegistry</code> bean and register a counter (<code>registry.counter(\"orders.processed\")</code>, incremented at the point in the code where an order actually completes) or a gauge (for a value that goes up and down, like a current queue depth, read on demand rather than incremented explicitly) — once registered, it's automatically exposed alongside every built-in metric at the same <code>/actuator/prometheus</code> endpoint, with no separate exposition mechanism to build.</p>\n      <p>The design decision that matters here: tag the metric with meaningful dimensions (a <code>region</code> or <code>orderType</code> tag on the counter) so it can be sliced and aggregated in Grafana along the dimensions that actually matter for the business question being asked, rather than one flat, undimensioned counter that can only ever answer \"how many total,\" never \"how many of which kind, broken down by where.\" The same cardinality-awareness that applies to any metrics system applies here too — tagging by something with unbounded distinct values (a raw user ID, say) explodes the number of distinct time series and can overwhelm the metrics backend, so tag values should be a bounded, meaningfully small set of categories.</p>"
},
{
  "id": "b30-16",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@Retryable — declarative retry, and the idempotency requirement it doesn't enforce for you.",
  "difficulty": "Mid",
  "tags": ["Spring Retry", "@Retryable", "Resilience", "Testing & Production Readiness"],
  "question": "What does @Retryable actually configure, and why doesn't adding it to a method automatically make retrying that method safe?",
  "answer": "<p><code>@Retryable</code> (from Spring Retry) wraps a method call so that specific declared exception types trigger an automatic retry, with configurable backoff (a fixed delay, or exponential backoff via <code>@Backoff</code>) and a maximum attempt count before finally giving up and either throwing or falling through to a <code>@Recover</code>-annotated fallback method. It's a declarative alternative to hand-writing a retry loop with try/catch and a sleep call, integrated cleanly with the rest of Spring's AOP-based cross-cutting-concern style.</p>\n      <p>What it explicitly doesn't do is make the underlying operation safe to retry — that's still entirely on the method's own logic. Retrying a method that performs a non-idempotent side effect (charging a payment, sending an email, inserting a row with no uniqueness constraint) on a transient failure risks executing that side effect twice if the first attempt actually succeeded server-side but the client-visible response looked like a failure (a timeout after the write already committed, say) — the same idempotency discipline as any other retry-prone integration point (an HTTP client, a Kafka consumer) applies here identically: only reach for <code>@Retryable</code> on operations that are genuinely idempotent, or make them idempotent first (an idempotency key, an upsert instead of an insert) before wrapping them in automatic retry.</p>"
},
{
  "id": "b30-17",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "RabbitMQ acknowledgment modes in Spring AMQP — what actually happens if the listener crashes mid-message.",
  "difficulty": "Senior",
  "tags": ["RabbitMQ", "Spring AMQP", "Message Acknowledgment", "Testing & Production Readiness"],
  "question": "Spring AMQP's default listener acknowledgment mode is AUTO. What does that actually mean, and what happens to a message if the listener crashes while processing it?",
  "answer": "<p>AUTO acknowledgment mode acks a message automatically once the listener method returns successfully, and nacks (or, depending on configuration, requeues) it if the listener throws an exception — the container manages the ack/nack lifecycle around your method for you, rather than your code manually calling acknowledge. If the listener process crashes entirely mid-processing (not a thrown exception the container can catch, but the JVM itself dying, or a hard process kill), the message was never acked at all — RabbitMQ, having received no ack, redelivers it to another consumer (or the same one, once it restarts) once the connection is detected as lost, which is exactly the at-least-once delivery guarantee that makes the listener's processing logic need to be idempotent, the identical requirement as any other message-queue consumer.</p>\n      <p>MANUAL acknowledgment mode hands that control to your own code explicitly (<code>channel.basicAck(...)</code>/<code>basicNack(...)</code>), which is the right choice when the ack decision genuinely needs to happen at a point other than \"the listener method simply returned\" — batched processing where several messages are acked together only once a whole batch succeeds, or a scenario where a message should be nacked-without-requeue (routed to a dead-letter queue instead) rather than the default requeue behavior on failure, since blindly requeuing a message that will deterministically fail again (a malformed payload, not a transient error) just produces an infinite redelivery loop instead of surfacing the problem.</p>"
},
{
  "id": "b30-18",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "JPA auditing — @CreatedDate/@LastModifiedBy, and what it doesn't give you.",
  "difficulty": "Mid",
  "tags": ["JPA Auditing", "@CreatedDate", "@LastModifiedBy", "Testing & Production Readiness"],
  "question": "Spring Data JPA's auditing annotations automatically stamp created/modified timestamps and users. What do they not cover that people sometimes assume they do?",
  "answer": "<p>With <code>@EnableJpaAuditing</code> and an entity annotated <code>@EntityListeners(AuditingEntityListener.class)</code>, fields marked <code>@CreatedDate</code>, <code>@LastModifiedDate</code>, <code>@CreatedBy</code>, and <code>@LastModifiedBy</code> are automatically populated by JPA's lifecycle callbacks on persist/update — genuinely useful for the common \"who created this, when was it last touched\" fields every entity tends to need, without hand-writing that logic into every service method that saves an entity.</p>\n      <p>What it doesn't give you, and what people sometimes mistakenly reach for it expecting: a full history of every change made to a record over time — auditing here only ever tracks the single latest creation/modification stamp, overwritten on each update, with no record of what the value was before or who made each intermediate change. Genuine change-history tracking (a full audit trail suitable for a regulated or financial system, where every historical state and who changed it needs to be reconstructible) needs a dedicated approach — Hibernate Envers (which persists a full versioned history table per entity) or an application-level event-sourcing pattern — not the basic auditing annotations, which are a lightweight convenience for the common created/modified-stamp case, not a compliance-grade audit log.</p>"
},
{
  "id": "b30-19",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Boot startup-time optimization — lazy initialization and class-data sharing.",
  "difficulty": "Senior",
  "tags": ["Startup Time", "Lazy Initialization", "CDS", "Testing & Production Readiness"],
  "question": "Beyond GraalVM native compilation, what actually reduces a regular JVM Spring Boot app's startup time?",
  "answer": "<p>Global lazy initialization (<code>spring.main.lazy-initialization=true</code>) defers bean creation until a bean is actually first needed rather than eagerly creating every bean at startup — this genuinely shortens startup time for an app with many beans not all needed immediately, but it trades that startup speedup for the first request touching a lazily-created bean paying its initialization cost at request time instead, which can show up as an unexpectedly slow first request per bean rather than a uniformly fast steady state; it's a real tradeoff to measure against your actual traffic pattern, not a strictly-free win.</p>\n      <p>Class Data Sharing (CDS), including Spring Boot's own support for generating an application-specific CDS archive, pre-processes and caches JVM class metadata so the JVM doesn't have to parse and verify every class from scratch on every single startup — a genuinely significant win specifically for short-lived process patterns (serverless functions, frequently-restarted containers) where startup cost is paid repeatedly and adds up, though it matters far less for a long-running service that starts once and runs for weeks. Beyond JVM-level tuning, the same discipline as mobile cold-start optimization applies here too: auditing what actually runs eagerly at startup (heavy bean initialization, an eager cache warm-up, a synchronous call to a downstream service during startup) and deferring or parallelizing what doesn't genuinely need to block the app from becoming ready to serve traffic.</p>"
},
{
  "id": "b30-20",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Layered JARs — why a naive Dockerfile rebuilds and re-pushes the whole app on every code change.",
  "difficulty": "Senior",
  "tags": ["Docker", "Layered JARs", "Spring Boot", "Testing & Production Readiness"],
  "question": "A Spring Boot app's Docker image gets rebuilt from scratch on every code change, even a tiny one. What does Spring Boot's layered JAR support actually fix?",
  "answer": "<p>A naive Dockerfile that <code>COPY</code>s the whole fat JAR into one Docker layer means that layer's cache is invalidated by <em>any</em> change to the JAR at all — including a change to just your own application code, even though the vast majority of a typical fat JAR's bytes are unchanged third-party dependencies. Docker's layer caching then has nothing to reuse, so every build re-copies (and every deploy re-pushes) the entire JAR, dependencies included, even when only a few kilobytes of your own compiled code actually changed.</p>\n      <p>Spring Boot's layered JAR support (via the Maven/Gradle plugin, or explicitly via <code>spring-boot:build-info</code>-style tooling) splits the JAR into separate layers by how frequently each part actually changes: dependencies (rarely change), Spring Boot's own loader classes (essentially never change), snapshot dependencies (change somewhat more often), and your own application classes and resources (change on every build). A Dockerfile built around this extracts and copies each layer separately, in that order — Docker's caching then only needs to rebuild and re-push the layers that actually changed, which in practice is almost always just the small application-code layer, dramatically shrinking both build time and the size of what actually gets pushed/pulled on a typical deploy.</p>"
},
{
  "id": "b30-21",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Implementing the Saga pattern in Spring Boot with an event-driven orchestrator.",
  "difficulty": "Senior",
  "tags": ["Saga Pattern", "Distributed Transactions", "Spring Boot", "Testing & Production Readiness"],
  "question": "How do you actually implement the Saga pattern's orchestration style in a Spring Boot service, concretely?",
  "answer": "<p>An orchestrator-style saga implementation is typically its own service (or a dedicated component within one) that holds the saga's current state explicitly — usually persisted to its own database table (a <code>saga_state</code> row per in-flight saga instance, with a state machine field tracking which step it's on) rather than kept only in memory, since a saga can legitimately span minutes or longer and the orchestrating process itself might restart mid-saga. Each step is triggered by the orchestrator publishing a command (via Kafka, RabbitMQ, or a direct call) to the relevant service, and completion or failure of that step arrives back as an event the orchestrator listens for, advancing (or compensating) the saga's state accordingly.</p>\n      <p>The genuinely hard part to get right in the implementation: every command needs an idempotency key so a redelivered command (the same at-least-once delivery concern as any message-driven system) doesn't re-execute a step that already completed, and the orchestrator needs a timeout mechanism per step — if a service never responds within an expected window, the saga needs to actively trigger compensation for the steps already completed rather than waiting indefinitely in limbo. Spring's own state-machine library (Spring Statemachine) or a workflow-orchestration tool (Temporal, Camunda) are common choices to avoid hand-rolling this state-tracking-plus-timeout-plus-compensation machinery from scratch, since getting all of it right by hand is a substantial undertaking most teams reasonably outsource to established tooling once a saga's complexity passes a simple two- or three-step case.</p>"
},
{
  "id": "b30-22",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@Transactional propagation — REQUIRES_NEW vs NESTED, and when the difference actually bites.",
  "difficulty": "Senior",
  "tags": ["@Transactional", "Propagation", "Testing & Production Readiness"],
  "question": "REQUIRES_NEW and NESTED both create what feels like a 'sub-transaction' inside a larger one. What's the actual difference, and when does it matter which you pick?",
  "answer": "<p><code>REQUIRES_NEW</code> suspends the currently-active transaction entirely and starts a genuinely independent new one — it commits or rolls back completely on its own, with zero relationship to the outer transaction's eventual outcome; if the outer transaction later rolls back, whatever the <code>REQUIRES_NEW</code> method already committed stays committed, unaffected. This is the right tool specifically for something that must survive regardless of the outer operation's fate — writing an audit log entry that should record \"an attempt was made\" even if the attempt itself ultimately fails and rolls back.</p>\n      <p><code>NESTED</code> instead creates a savepoint within the same physical database transaction — if the nested portion fails, only the work since that savepoint rolls back, while the outer transaction can continue and still ultimately commit its own other work; but if the <em>outer</em> transaction eventually rolls back, everything rolls back completely, nested portion included, since it was never actually a separate transaction, just a rollback point within one. The practical distinction: reach for <code>REQUIRES_NEW</code> when the inner operation's outcome must be genuinely independent of the outer transaction's fate; reach for <code>NESTED</code> when you want the ability to partially roll back just the inner operation while still letting the outer transaction ultimately decide everything's fate together — and note <code>NESTED</code> specifically requires the underlying JDBC driver to support savepoints, which not every database/driver combination does.</p>"
},
{
  "id": "b30-23",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "MockMvc vs WebTestClient — testing a controller without a running server.",
  "difficulty": "Mid",
  "tags": ["MockMvc", "WebTestClient", "Testing", "Testing & Production Readiness"],
  "question": "What's the actual difference between MockMvc and WebTestClient for testing a Spring controller, and when do you need WebTestClient specifically?",
  "answer": "<p>MockMvc tests a Spring MVC controller by simulating an HTTP request directly against the DispatcherServlet in memory, with no actual network socket or running server involved — fast, since there's no real HTTP round-trip, and sufficient for testing a traditional servlet-based (non-reactive) controller's request mapping, validation, and response shape end-to-end within the Spring context.</p>\n      <p>WebTestClient is built for testing reactive (WebFlux) endpoints, where the response is a <code>Mono</code>/<code>Flux</code> being asynchronously streamed rather than a value immediately available the way MockMvc's synchronous model expects — it can operate either the same way as MockMvc (bound directly to the application context, no real server) or against a genuinely running server over an actual HTTP connection, which matters specifically when testing something that depends on the real network stack behaving correctly (an actual streaming response body, real connection-level behavior) rather than the in-memory simulation. The decision is really just about which web stack you're testing: MockMvc for traditional Spring MVC, WebTestClient for WebFlux — and WebTestClient's real-server mode specifically for the narrower case of a true end-to-end test that needs the network layer to actually be exercised, not simulated.</p>"
},
{
  "id": "b30-24",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Actuator health indicators — building one that reflects a real dependency, not just 'the app is up'.",
  "difficulty": "Mid",
  "tags": ["Actuator", "Health Indicators", "Testing & Production Readiness"],
  "question": "The default /actuator/health only tells you the JVM process is running. How do you build a health indicator that actually reflects whether a critical downstream dependency is reachable?",
  "answer": "<p>A custom <code>HealthIndicator</code> bean implements one method that returns <code>Health.up()</code> or <code>Health.down()</code> (optionally with detail fields) based on an actual check — pinging a downstream service, verifying a database connection, checking a message broker's connectivity — rather than the default's trivial \"the process responded, so it must be fine\" signal, which tells an orchestrator nothing about whether the app can actually do its job if a critical dependency is unreachable.</p>\n      <p>The design decision that actually matters is distinguishing liveness from readiness the same way Kubernetes does at the pod level: a health check tied to a downstream dependency should generally inform <em>readiness</em> (take this instance out of load-balancer rotation until the dependency recovers) rather than <em>liveness</em> (kill and restart the process) — the exact same mistake as wiring a Kubernetes liveness probe to a downstream check, just at the Spring Boot Actuator level instead: if the health indicator for, say, a database connection is wired into the liveness group and the database blips, every instance's liveness check fails simultaneously and Kubernetes restarts the entire fleet at once over a transient dependency issue that a readiness-only check would have handled by simply routing traffic away until it recovered.</p>"
},
{
  "id": "b30-25",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Boot's DevTools — what the automatic restart actually does, and why it's disabled in production.",
  "difficulty": "Mid",
  "tags": ["Spring Boot DevTools", "Developer Experience", "Testing & Production Readiness"],
  "question": "What does spring-boot-devtools' automatic restart actually do under the hood, and why must it never end up in a production build?",
  "answer": "<p>DevTools watches the classpath for changes and, when a recompiled class is detected (triggered by your IDE's auto-compile-on-save, or an explicit rebuild), restarts the Spring application context using two separate classloaders — a \"base\" classloader for classes that rarely change (third-party libraries) and a \"restart\" classloader for your own application classes, so only the restart classloader needs reloading, making the restart noticeably faster than a full cold JVM start would be, since the base classloader's already-loaded dependencies aren't reloaded from scratch each time.</p>\n      <p>Shipping it into a production build is a real, well-documented risk, which is exactly why Spring Boot's own build tooling excludes it from the packaged production JAR by default when following the standard setup: DevTools also enables a set of properties intended purely to smooth local development (disabling caching for template engines, exposing extra debug endpoints) that are actively wrong for production — disabled caching costs real performance under production load, and some of the debug conveniences it enables are a genuine information-disclosure or resource-consumption risk if reachable by a real, hostile client rather than a trusted developer on localhost. The practical safeguard: DevTools is marked as an <code>optional</code>/development-only dependency specifically so a standard Maven/Gradle build naturally excludes it from the final artifact — the risk shows up specifically when a nonstandard build configuration accidentally includes it anyway.</p>"
}
);
