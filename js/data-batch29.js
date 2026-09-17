// ==========================================================
// Batch 29: Mobile Architect — IC-level architecture gap-fill,
// installment 2.
// Batch 26 covered Clean Architecture layering, backward
// compatibility/force-update, localization/RTL, battery-aware
// background work, cross-platform design tokens, mobile
// security tradeoffs, and release-channel/build-variant
// structure (plus batch 18's monorepo/MVI/observability/
// super-app/feature-flags). This batch covers local-database
// choice, API client architecture, DI graph design at scale,
// Gradle build performance, iOS modularization, third-party
// SDK design, crash recovery strategy, analytics pipelines,
// A/B testing infra, offline outbox patterns, reactive-stream
// choice, single- vs multi-activity, dynamic feature modules,
// API contract governance, performance budgets, retry/backoff,
// push fan-out architecture, deep-link security, mobile CI/CD,
// privacy/consent architecture, widgets/extensions, database
// migrations, and image-loading pipelines.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b29-01",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Choosing a local persistence layer — Room/SQLite vs Realm vs ObjectBox.",
  "difficulty": "Senior",
  "tags": ["Room", "Realm", "ObjectBox", "Mobile Architecture"],
  "question": "How do you actually decide between Room (SQLite), Realm, and ObjectBox for a mobile app's local database?",
  "answer": "<p>Room is a thin, type-safe layer over plain SQLite — you write real SQL (or Room generates it from annotated queries), get compile-time verification of query correctness against your schema, and inherit SQLite's decades of battle-tested reliability and every standard SQL tool's compatibility. Its cost is boilerplate: entities, DAOs, and migrations are all explicit, and object-relational mapping overhead is real, if modest, compared to storing objects more directly.</p>\n      <p>Realm and ObjectBox are both object-database engines built specifically for mobile — objects are stored close to their in-memory representation, with fewer serialization/mapping steps, generally faster for object-graph-heavy access patterns, and both offer live, reactive queries that update automatically as underlying data changes without hand-wiring that reactivity yourself. The real tradeoff is ecosystem maturity and lock-in: SQL is a universally transferable skill and Room's underlying format is inspectable with any SQLite tool, while Realm/ObjectBox's proprietary storage format means less tooling interoperability and a real migration cost if you ever need to move away. For a team already comfortable with SQL and wanting maximum tooling compatibility, Room is the safer default; for an app with a complex, deeply-nested object graph and heavy reactive-query needs, the object-database engines' developer ergonomics can be a genuine win worth the lock-in tradeoff.</p>"
},
{
  "id": "b29-02",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "API client architecture — designing the interceptor chain, not just calling Retrofit.",
  "difficulty": "Senior",
  "tags": ["Retrofit", "OkHttp", "Interceptors", "Mobile Architecture"],
  "question": "What does a well-architected mobile API client's interceptor chain actually need to handle, beyond just making the HTTP call?",
  "answer": "<p>A production API client layers several cross-cutting concerns as ordered interceptors rather than duplicating each one inside every individual API call: auth (attaching the current access token, and specifically handling a 401 by pausing in-flight requests, refreshing the token once, then retrying — not re-triggering a refresh per concurrent 401'd request, which is a common bug that hammers the refresh endpoint); logging (redacting sensitive fields before logging request/response bodies, since a naive full-body logger leaks tokens and PII into logs); retry-with-backoff for transient network failures, distinguishing retryable failures (timeout, 503) from ones that shouldn't be retried blindly (a 400 validation error retried identically will just fail identically); and certificate pinning as a network-security-config-level concern.</p>\n      <p>The architectural discipline this needs: each concern lives in its own interceptor, composed in a deliberate order (auth before retry, so a retried request still carries a valid token; logging last, so it sees the final request that's actually sent) — mixing all of this ad hoc into individual call sites is exactly how a mobile codebase ends up with inconsistent auth-refresh behavior, incomplete logging, and duplicated retry logic scattered across dozens of call sites instead of one place to reason about and fix.</p>"
},
{
  "id": "b29-03",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Dependency injection graph design across many feature modules.",
  "difficulty": "Senior",
  "tags": ["Dependency Injection", "Hilt", "Modularization", "Mobile Architecture"],
  "question": "In a large, modularized app, how do you design the DI graph (Hilt/Dagger component scoping) so feature modules stay decoupled?",
  "answer": "<p>The naive approach — one giant application-scoped component every module contributes bindings to — technically works but quietly defeats the point of modularization: every feature module ends up needing visibility into a shared, monolithic graph, and a binding conflict or an accidental cross-feature dependency becomes possible again, exactly what module boundaries were supposed to prevent. The architectural fix is scoping deliberately: core, app-wide singletons (network client, database, auth state) live in an application-scoped component every feature can depend on; each feature module gets its own scoped component (or entry point) that depends only on the core component's exposed interfaces, never on another feature's internals directly.</p>\n      <p>The practical mechanism (Hilt specifically): feature modules expose only what they intend to share via an <code>@EntryPoint</code> or explicitly bound interface, not their concrete implementation classes, so another feature consuming that capability depends on an abstraction it can be tested against, not a concrete class that ties it to the providing feature's internals. The judgment call that separates a well-scoped graph from a tangled one: a new binding should make you ask \"does this genuinely need to be visible beyond this module,\" and default to module-local scope unless there's a real cross-feature need — the same discipline that keeps a super-app's plugin architecture from silently coupling features through convenience imports.</p>"
},
{
  "id": "b29-04",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Gradle build performance at scale — build cache and configuration cache.",
  "difficulty": "Senior",
  "tags": ["Gradle", "Build Performance", "Mobile Architecture"],
  "question": "A modularized Android app's build has gotten slow despite modularization. What actually needs tuning beyond just having more modules?",
  "answer": "<p>Modularization alone only buys incremental/parallel compilation — it doesn't automatically make Gradle's own configuration phase (evaluating every module's build.gradle before any compilation starts) fast, and a large module count with unoptimized per-module build scripts can make configuration itself the new bottleneck, especially since it re-runs on every build invocation by default. Gradle's configuration cache serializes the result of that configuration phase and reuses it across builds when nothing that affects configuration has changed, skipping re-evaluating every build script from scratch — often a larger win on a big multi-module project than any amount of further module-splitting.</p>\n      <p>The build cache (local or remote) is the complementary piece: it caches actual task outputs (compiled classes, generated code) keyed by their inputs, so a module whose inputs haven't changed reuses a previous build's output instead of recompiling — and critically, a <em>remote</em> build cache lets one CI build's cached outputs be reused by other developers' local builds and other CI runs, not just repeat builds on the same machine. Getting real benefit from either requires build-script hygiene most teams skip: avoiding non-deterministic task inputs (a build script reading the current timestamp, say) that invalidate the cache unnecessarily, and using Gradle's own build-scan/profiling output to actually identify which specific tasks or configuration steps are the real bottleneck, rather than guessing.</p>"
},
{
  "id": "b29-05",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "iOS modularization — Swift Package Manager vs CocoaPods for internal feature modules.",
  "difficulty": "Senior",
  "tags": ["Swift Package Manager", "iOS Modularization", "Mobile Architecture"],
  "question": "For an iOS app splitting into feature modules the way an Android app splits into Gradle modules, is Swift Package Manager or CocoaPods the right tool, and why?",
  "answer": "<p>For internal, first-party feature modules within your own app (as opposed to consuming external third-party dependencies), Swift Package Manager has become the clear default over CocoaPods — it's Apple's own first-party tooling, integrated directly into Xcode with no separate <code>pod install</code> step or generated workspace to manage, and it enforces the same explicit-dependency-declaration discipline Gradle modules do on Android: a package can only see what it explicitly declares a dependency on, which is what actually enforces architectural boundaries between features rather than relying on developer discipline alone.</p>\n      <p>CocoaPods still earns its place for consuming external third-party SDKs that only distribute via CocoaPods (a shrinking but real set) and for legacy projects with deep existing CocoaPods integration where migrating everything to SPM isn't worth the disruption yet. The practical modularization approach for a new or actively-modularizing iOS codebase: structure internal feature modules as local Swift Packages (referenced directly by relative path, not published anywhere), reserving CocoaPods purely for the specific external dependencies that still require it — mirroring the same core-vs-feature dependency-direction discipline as Android's Gradle module graph, just expressed through SPM's package manifest instead.</p>"
},
{
  "id": "b29-06",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing an SDK for third-party partner integration — the API-stability discipline.",
  "difficulty": "Senior",
  "tags": ["SDK Design", "Semantic Versioning", "API Stability", "Mobile Architecture"],
  "question": "Your company is shipping a mobile SDK that other companies will integrate into their own apps. What's genuinely different about designing this compared to an internal feature module?",
  "answer": "<p>An internal module's consumers are your own team — a breaking change is a coordinated, same-day fix across a codebase you control. An external SDK's consumers are integrated into apps you don't control, on release schedules you don't control, some of which will pin to an old SDK version indefinitely — a breaking change doesn't get fixed same-day, it either breaks a partner's production app on their next release or, more commonly, gets avoided entirely by partners simply never updating, fragmenting your actual install base across many old SDK versions you now have to consider supporting.</p>\n      <p>This forces a much stricter discipline than internal code needs: real semantic versioning enforced deliberately (a major version bump for any breaking change, genuinely rare and well-communicated in advance, not an afterthought), a public API surface kept deliberately minimal and stable (internal implementation details hidden behind an interface, never exposed as public types partners could come to depend on even accidentally), and a documented deprecation policy with a real support window before removing anything. The architectural implication: an SDK's public API is closer to a contract than ordinary application code, and every public class, method, and even public field is a promise to a partner you can't just refactor away on your own timeline the way you could inside your own app.</p>"
},
{
  "id": "b29-07",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "A global crash-recovery strategy — catching what a single try/catch can't.",
  "difficulty": "Senior",
  "tags": ["Crash Recovery", "Error Handling", "Resilience", "Mobile Architecture"],
  "question": "Beyond individual try/catch blocks, what does an app-wide crash-recovery architecture actually consist of?",
  "answer": "<p>An uncaught exception anywhere in the app terminates the process by default on both platforms — a global uncaught-exception handler (Android's <code>Thread.UncaughtExceptionHandler</code>, iOS's <code>NSSetUncaughtExceptionHandler</code> or a crash-reporting SDK's equivalent hook) is the last line of defense that at minimum ensures the crash is logged with full context (stack trace, breadcrumbs of recent user actions, app/device state) before the process actually dies, since a crash with no diagnostic trail is nearly impossible to reproduce and fix later.</p>\n      <p>The architectural layer above that single global handler is graceful degradation at the feature level: a single feature module's failure (a malformed response crashing one screen's rendering) shouldn't be architecturally capable of taking down the entire app if it can be contained — wrapping risky, isolated units of work (parsing a response from a specific feature, rendering a specific widget) so a failure there falls back to an error state for just that feature rather than propagating up to a full app crash. The judgment call is which failures are worth this containment effort versus which genuinely should crash loudly (a failure indicating corrupted local state that's unsafe to continue running against) — silently swallowing every possible error to avoid crashes at all costs just trades a visible crash for a much harder-to-diagnose silent malfunction.</p>"
},
{
  "id": "b29-08",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Architecting a product analytics pipeline that doesn't drown in duplicate/lost events.",
  "difficulty": "Senior",
  "tags": ["Analytics", "Telemetry", "Event Tracking", "Mobile Architecture"],
  "question": "What does a genuinely reliable mobile analytics/telemetry architecture need, beyond calling a track() function at various points in the code?",
  "answer": "<p>A naive <code>analytics.track('event')</code> call fired inline at dozens of scattered call sites across the codebase produces two chronic problems at scale: inconsistent event names and properties (one developer logs <code>button_clicked</code>, another logs <code>buttonClick</code> for the conceptually identical action, and now the data can't be reliably aggregated), and lost events on flaky mobile networks if the SDK doesn't buffer and retry — a user on a subway losing connectivity mid-session can silently drop a meaningful fraction of that session's events with no error surfaced anywhere.</p>\n      <p>The architectural fix: a typed event schema defined centrally (an enum or generated set of event types with their required properties, checked at compile time) so every call site is forced through the same defined shape rather than a free-form string, and a local durable queue (persisted to disk, not just in-memory) that buffers events and retries delivery on reconnect, with events assigned a client-generated timestamp and ID so out-of-order or delayed delivery can still be correctly reconstructed server-side. Sampling is the other deliberate decision worth naming — a high-frequency, low-value event (a scroll-position ping) is often sampled rather than logged every single time, trading some statistical precision for materially less data volume and battery/bandwidth cost, a tradeoff worth making explicitly rather than logging everything at full fidelity by default.</p>"
},
{
  "id": "b29-09",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "A/B testing infrastructure for mobile — the architecture behind 'just check a flag'.",
  "difficulty": "Senior",
  "tags": ["A/B Testing", "Experimentation", "Mobile Architecture"],
  "question": "What's actually involved in architecting mobile A/B testing infrastructure, beyond checking a remote-config flag to pick a variant?",
  "answer": "<p>Picking a variant is the easy part — the parts that make an experiment's results actually trustworthy are the harder architectural pieces: consistent variant assignment (the same user must see the same variant across the entire experiment duration and across app restarts, which needs a stable, deterministically-hashed assignment based on a persistent user/device ID, not a fresh random pick on every app launch), and correctly attributing the eventual outcome metric (a purchase, a signup) back to the specific variant the user was actually in when the relevant action happened — not the variant they're in at the moment the metric is recorded, which can differ if the experiment configuration changed mid-session.</p>\n      <p>The other architectural piece that's easy to skip and expensive to have skipped: exposure logging — recording precisely when a user was actually exposed to a given variant (not just that they were eligible for the experiment), since a user who was assigned to a variant but never actually saw the changed experience shouldn't be counted in that variant's outcome analysis, or the experiment's measured effect gets diluted and the result becomes unreliable. And the same code-path-safety discipline as any feature-flag system applies doubly here — every experiment variant's code path needs to be genuinely production-ready and tested, since an experiment is, by design, running an unproven code path against real production users.</p>"
},
{
  "id": "b29-10",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing an offline mutation queue (outbox pattern) for a mobile app.",
  "difficulty": "Senior",
  "tags": ["Offline-First", "Outbox Pattern", "Sync", "Mobile Architecture"],
  "question": "How do you architect an offline-first mutation queue so writes made while offline reliably reach the server once connectivity returns?",
  "answer": "<p>The core structure is the outbox pattern: every mutation (a create/update/delete) is first written to a local, durable queue table — not attempted directly against the network — tagged with a client-generated idempotency key, a timestamp, and enough context to retry it later without re-deriving anything from state that might have changed since. The UI reads from and updates local state optimistically against this same local store immediately, so the app feels fully responsive offline; a background worker separately drains the outbox queue whenever connectivity is available, sending each queued mutation and marking it synced (or handling its failure) independently of what the UI is doing.</p>\n      <p>The genuinely hard part is conflict handling once sync actually happens: two mutations to the same record made on two different offline devices (or one offline device and one online session) can arrive out of order or conflict outright, and the architecture needs an explicit policy for it — last-write-wins by server timestamp for low-stakes data, or a real merge/conflict-surfacing UI for anything where silently discarding one side's edit is unacceptable (the same tradeoff a Google-Drive-style sync service makes explicitly). Idempotency keys on every queued mutation are what make retrying a mutation that might have already partially succeeded (a request that timed out client-side but actually landed server-side) safe to resend rather than risking a duplicate write.</p>"
},
{
  "id": "b29-11",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Choosing a reactive-streams model — Kotlin Flow vs RxJava vs Combine.",
  "difficulty": "Senior",
  "tags": ["Kotlin Flow", "RxJava", "Combine", "Reactive Programming", "Mobile Architecture"],
  "question": "As an architect standardizing on a reactive-streams approach across a codebase, how do you decide between Kotlin Flow, RxJava, and (for iOS) Combine — and does the choice actually matter?",
  "answer": "<p>All three implement essentially the same conceptual model — a stream of values over time, with operators to transform, combine, and consume it — so the choice is less about capability and more about platform fit and existing investment. RxJava predates Flow and has a vastly larger, more mature operator library and a huge existing body of Android code built on it — a codebase already deeply invested in RxJava has a real, non-trivial migration cost to Flow that needs to be justified by something more than \"Flow is newer.\" Kotlin Flow is Kotlin-coroutine-native, integrates far more smoothly with <code>suspend</code> functions and structured concurrency (which Android's own architecture components now assume), and is Google's own recommended direction for new Android code — a new Android codebase with no legacy RxJava investment should default to Flow specifically because it composes naturally with the rest of modern Android's coroutine-based APIs.</p>\n      <p>Combine is Apple's own equivalent for iOS/Swift, filling the same conceptual role but with Swift-native syntax and its own operator set — there's no cross-platform code-sharing angle between Flow and Combine (they're different languages entirely), so the real decision on iOS is Combine vs a third-party Swift reactive library (RxSwift), which mirrors the exact same \"platform-native default vs an established third-party ecosystem\" tradeoff Android faces between Flow and RxJava. The architectural takeaway: standardize on one within a given platform's codebase deliberately, since mixing multiple reactive-stream libraries in one codebase (RxJava and Flow both present, interop layers bridging between them) is a real, ongoing complexity tax that's worth actively avoiding rather than accumulating gradually.</p>"
},
{
  "id": "b29-12",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Single-Activity vs multi-Activity Android architecture — what's actually at stake.",
  "difficulty": "Senior",
  "tags": ["Single Activity", "Android Architecture", "Navigation", "Mobile Architecture"],
  "question": "Google's own guidance pushes a single-Activity architecture with Fragments/Compose destinations. What's the actual architectural argument, and when would multi-Activity still be defensible?",
  "answer": "<p>A multi-Activity app pays real costs at each screen transition: a full Activity is a heavier lifecycle object than a Fragment or a Compose destination, each Activity transition involves the Android OS's own Activity-management overhead, and sharing state or animating a transition smoothly <em>across</em> Activities is genuinely harder than within a single Activity's own navigation graph, since two Activities are more isolated from each other by design than two destinations within one Activity's navigation stack.</p>\n      <p>A single-Activity architecture (one host Activity, with Navigation Component or Compose Navigation managing destinations within it) centralizes the navigation graph in one place, makes shared-element transitions and shared ViewModels scoped to the navigation graph straightforward, and matches what modern Android tooling and guidance is actually built around. The defensible cases for a separate Activity anyway: a genuinely independent entry point the OS itself needs to treat as its own launchable unit (a widget-configuration screen, a screen meant to be launched directly by another app via an explicit intent with no dependency on the main app's navigation state), or isolating a fundamentally different UI toolkit or process boundary (a legacy screen not yet migrated during an incremental modernization). For ordinary in-app navigation between a product's own screens, though, the single-Activity approach is the well-justified default today, not just current fashion.</p>"
},
{
  "id": "b29-13",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Dynamic feature modules — delivering features on-demand instead of bloating every install.",
  "difficulty": "Senior",
  "tags": ["Dynamic Feature Modules", "Play Feature Delivery", "App Size", "Mobile Architecture"],
  "question": "What does architecting an app with dynamic feature modules (delivered on-demand, not bundled in the base install) actually require beyond Gradle-module splitting?",
  "answer": "<p>Ordinary Gradle modularization is a build-time and code-organization concern — every module still ends up in the same installed APK/AAB whether the user needs that feature or not. Dynamic feature modules (Android's Play Feature Delivery) go further: a module marked as a dynamic feature is packaged separately and downloaded on-demand at runtime, either explicitly (the user opts into a rarely-used feature) or conditionally (delivered automatically only to devices matching specific criteria — a certain locale, a certain device capability) — which is what actually reduces the base install size for users who never touch that feature, rather than just organizing code more cleanly.</p>\n      <p>The architectural requirement this imposes: any code depending on a dynamic feature module has to handle the case where that module isn't installed yet — checking installation status, triggering an on-demand download with a loading UI, and handling a failed or declined download gracefully, since the feature genuinely might not be present at runtime the way a statically-bundled module always would be. This is real added complexity that only pays for itself when a feature is both substantial in size (a big native library, a large asset bundle) and genuinely used by a minority of the install base — splitting a small, universally-used feature into a dynamic module adds this complexity for negligible size benefit.</p>"
},
{
  "id": "b29-14",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Governing an API contract shared between mobile and backend teams.",
  "difficulty": "Senior",
  "tags": ["API Contract", "BFF", "Cross-Team Governance", "Mobile Architecture"],
  "question": "As the mobile architect, how do you govern the API contract with the backend team so mobile isn't perpetually blocked on backend changes or broken by them?",
  "answer": "<p>The contract itself (an OpenAPI/GraphQL schema) should be treated as reviewed, versioned source code both teams commit to, not an artifact backend produces and mobile discovers after the fact — a contract-review step before backend implementation starts, with mobile explicitly signing off on the shape before it's built, is what actually prevents the common failure mode of mobile building against an assumed shape that backend then delivers slightly differently.</p>\n      <p>The governance mechanism that keeps this working as both teams scale independently: mock servers generated directly from the agreed contract, so mobile development can proceed against a realistic mock the moment the contract is agreed, without waiting on a working backend implementation at all — and contract tests (consumer-driven contract testing, e.g. Pact) that fail backend's own CI if a change would break what mobile actually depends on, catching a breaking change before it ever reaches a build mobile pulls, rather than mobile discovering it via a crash report after backend already shipped. A named deprecation policy for API versions — how long an old contract version stays supported once superseded — is the piece that specifically protects mobile from being forced into an emergency update just because backend wants to move fast on their own timeline.</p>"
},
{
  "id": "b29-15",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Treating startup time and memory footprint as an enforced architectural budget.",
  "difficulty": "Senior",
  "tags": ["Performance Budgets", "Startup Time", "Memory", "Mobile Architecture"],
  "question": "How do you architect performance governance so cold-start time and memory footprint don't quietly regress feature by feature as the app grows?",
  "answer": "<p>Performance regressions in a growing app are almost never one dramatic change — they're dozens of individually-small additions (one more SDK initialized at startup, one more synchronous local-storage read added to the app's root component) each adding a barely-noticeable few milliseconds, that compound into a genuinely slow app over a year with no single commit anyone would flag in review as the culprit. The architectural fix is treating startup time and peak memory as an enforced budget with an automated gate, not a value someone occasionally remembers to check manually: a CI benchmark (Android's Macrobenchmark, or an equivalent on iOS) runs against every PR and fails the build if cold-start time or memory regresses past a defined threshold, forcing the specific PR that caused a regression to be flagged immediately rather than discovered months later when it's genuinely painful to bisect.</p>\n      <p>The organizational piece alongside the automated gate: any new SDK, library, or feature that wants to run code at app-startup time specifically needs an explicit justification and sign-off, not an assumed default — the same discipline as a budget review, applied to startup cost instead of money, since \"just initialize it eagerly, it's simpler\" is exactly the kind of individually-reasonable decision that produces a collectively slow app when made independently by a dozen different feature teams with no shared visibility into the cumulative cost.</p>"
},
{
  "id": "b29-16",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing a retry/backoff strategy for genuinely flaky mobile networks.",
  "difficulty": "Senior",
  "tags": ["Retry", "Exponential Backoff", "Resilience", "Mobile Architecture"],
  "question": "Mobile networks are far less reliable than a data center's internal network. How do you architect retry/backoff so the app is resilient without hammering the backend or draining battery?",
  "answer": "<p>A naive fixed-interval retry (retry every 2 seconds until it succeeds) has two failure modes at scale: it can turn a transient blip affecting many users simultaneously (a brief backend hiccup) into a synchronized retry storm that overwhelms the backend right as it's trying to recover, and it drains battery retrying aggressively against a connection that's actually down for a sustained period, not just momentarily flaky. Exponential backoff with jitter — each retry waits progressively longer, with a randomized component added so many clients don't retry in lockstep — spreads retry load out over time and avoids the synchronized-storm problem specifically.</p>\n      <p>The architectural pieces beyond the backoff curve itself: a maximum retry count or total time budget, after which the operation surfaces as a genuine failure to the user rather than retrying silently forever; distinguishing retryable failures (timeout, connection reset, 503) from non-retryable ones (a 400 validation error, a 401 that needs a token refresh, not a blind retry) so the system doesn't waste cycles retrying something identically doomed to fail again; and coordinating retries with the platform's own network-change signals (retry immediately on a detected reconnect event rather than waiting out a scheduled backoff interval that's now unnecessarily conservative) — reacting to an actual connectivity change is both faster for the user and cheaper than blind time-based polling alone.</p>"
},
{
  "id": "b29-17",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Push notification fan-out architecture — topics vs per-device targeting at scale.",
  "difficulty": "Senior",
  "tags": ["Push Notifications", "FCM", "Fan-out", "Mobile Architecture"],
  "question": "For a notification going out to millions of devices, how do you architect the fan-out — one push call per device, or something else?",
  "answer": "<p>Sending an individual push call per device for a broadcast-style notification (\"flash sale starting now\") to millions of devices means your backend making millions of individual API calls to the push provider — real throughput and rate-limit pressure on your own infrastructure for a message that's identical to every recipient. FCM's topic-based messaging exists specifically for this case: devices subscribe to a topic client-side, and the backend sends one message to the topic, letting the push provider's own infrastructure handle the actual per-device fan-out at their scale, not yours.</p>\n      <p>Topics are the wrong tool the moment the message needs genuine per-user personalization (a different message per recipient, not just the same message to a broadcast group) — that case still needs per-device (or per-device-token-batch, since most providers support batched multicast sends up to some batch size) targeting, but architected as an asynchronous, queued, rate-limited job against the provider's batch API rather than millions of synchronous individual calls from application request-handling code. The architectural split worth naming: genuinely broadcast, identical-content notifications route through topics; personalized notifications route through a dedicated, rate-limited, queue-backed fan-out worker — conflating the two into one code path is what produces both wasted infrastructure cost on the broadcast case and rate-limit trouble on the personalized case.</p>"
},
{
  "id": "b29-18",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Deep-link security — why an unvalidated deep link is a real attack surface.",
  "difficulty": "Senior",
  "tags": ["Deep Links", "Security", "App Links", "Mobile Architecture"],
  "question": "What's the actual security risk architecture needs to account for with deep links, beyond just routing a URL to the right screen?",
  "answer": "<p>A deep link is, from the app's point of view, untrusted external input — it can come from a malicious website, a phishing message, or another app, not just your own trusted backend or marketing emails, and a naive implementation that trusts every field in a deep link's query parameters as authoritative opens real attack surface: a deep link crafted to navigate directly into an authenticated, sensitive screen bypassing normal in-app navigation guards, or one that passes a parameter (a user ID, an amount, a redirect target) the receiving screen trusts without re-validating it server-side.</p>\n      <p>The architectural discipline: treat every value carried by a deep link exactly like any other untrusted client input — re-validate and re-authorize server-side before acting on it, never trust a deep link's parameters as sufficient authorization on their own (a link containing a user ID doesn't prove the current device's authenticated user actually is that user), and specifically verify Android App Links/iOS Universal Links' domain-verification mechanism is correctly configured, since that verification is what actually proves a link legitimately belongs to your domain rather than being a custom-scheme link any app could register and intercept. A deep link that navigates to a screen requiring authentication should still enforce that authentication check normally — the deep link should never be treated as an implicit bypass of a screen's normal access control.</p>"
},
{
  "id": "b29-19",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing a mobile CI/CD pipeline with per-environment build variants.",
  "difficulty": "Senior",
  "tags": ["CI/CD", "Fastlane", "Build Variants", "Mobile Architecture"],
  "question": "How do you architect a mobile CI/CD pipeline (Fastlane or similar) so the right build variant reaches the right environment automatically, without manual per-release fiddling?",
  "answer": "<p>The pipeline's stages should map directly onto the release-channel structure (dev → internal → beta → production): each stage's Fastlane lane builds the corresponding build variant/scheme (parameterized by API base URL, app ID suffix, signing configuration) and deploys to the matching distribution target (Firebase App Distribution for internal/beta, the app stores' beta tracks, then full production release) — triggered by the right event (a merge to a specific branch, a tagged release) rather than a person manually choosing which variant to build and where to upload it, which is exactly the manual step that eventually causes a dev-configured build to accidentally reach production.</p>\n      <p>The parts that need explicit architectural decisions, not just Fastlane scripting: code-signing credential management (release signing keys and provisioning profiles stored in a secrets manager the CI pipeline pulls at build time, never committed to the repo or held only on one engineer's machine — a lost signing key for a production Android app is unrecoverable and permanently orphans every future update to the existing app listing), and release-note/changelog generation tied to what actually shipped in that build, not written manually and prone to drifting from reality. The overall design goal: a human decides <em>when</em> to promote a build to the next stage, but never has to manually configure <em>what</em> gets built or signed for that stage — that should be entirely derived from the pipeline's own configuration.</p>"
},
{
  "id": "b29-20",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Architecting consent and privacy controls (GDPR/CCPA) into a mobile app from the start.",
  "difficulty": "Senior",
  "tags": ["Privacy", "GDPR", "Consent Management", "Mobile Architecture"],
  "question": "What does architecting for GDPR/CCPA-style privacy requirements actually require in a mobile app's design, beyond a consent popup on first launch?",
  "answer": "<p>A consent popup that isn't actually wired into the rest of the app's behavior is theater, not compliance — analytics and third-party SDKs need to be architected so they genuinely respect the user's recorded consent state (not initializing an analytics SDK at all until consent is granted, rather than initializing it eagerly and just suppressing some calls afterward, since the SDK itself may collect device identifiers the moment it initializes regardless of whether your code calls it). Consent state has to be checked before each SDK's initialization, and re-checked if the user later revokes consent, since a user changing their mind needs the app to actually stop collecting, not just stop displaying a preference.</p>\n      <p>The other architectural requirement these regulations create: a genuine data deletion and export capability — the ability to actually locate and delete (or export) everything associated with a specific user across every system that stores their data, which is far harder to build after the fact than to design in from the start with a consistent user-identifier scheme threaded through every data store and analytics pipeline. Retrofitting \"can we find and delete everything about this one user\" onto a system that was never designed with that traceability in mind is a genuinely large, error-prone undertaking — this is a case where the compliance requirement should shape the data architecture from day one, not be treated as a checklist item added right before a regulatory deadline.</p>"
},
{
  "id": "b29-21",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Architecting a home-screen widget or app extension that shares data with the main app.",
  "difficulty": "Senior",
  "tags": ["Widgets", "App Extensions", "Data Sharing", "Mobile Architecture"],
  "question": "A home-screen widget (Android App Widget, iOS WidgetKit) needs to show data from the main app. What's the actual architectural challenge in sharing that data?",
  "answer": "<p>A widget/extension runs in its own separate process with its own severely constrained resource budget and lifecycle — it can't simply import the main app's in-memory state or database connection object, since it isn't the same running process at all, and doesn't get to run arbitrary background logic on its own schedule (both platforms strictly rate-limit how often a widget can refresh, specifically to protect battery). The architecture has to treat the widget as an entirely separate, resource-constrained client of shared, on-disk state, not an extension of the main app's live memory.</p>\n      <p>The mechanism both platforms provide for this: a shared, sandboxed storage location both the main app and the widget/extension process can read (App Groups on iOS, a shared file/database location on Android) — the main app writes the data the widget needs to display into this shared store whenever it changes, and the widget reads from it independently on its own refresh schedule, rather than the two processes trying to communicate live. The architectural discipline this needs: keep what's written to shared storage for the widget deliberately small and pre-computed (the exact display-ready values, not a large raw dataset the widget would need to process itself), since the widget's own execution budget for rendering is tight, and any processing done there instead of by the main app ahead of time risks the widget being killed mid-render for exceeding its resource allowance.</p>"
},
{
  "id": "b29-22",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Local database migrations — why a mobile schema migration can't just be rolled back.",
  "difficulty": "Senior",
  "tags": ["Database Migrations", "Room", "Core Data", "Mobile Architecture"],
  "question": "A backend schema migration can usually be rolled back if something goes wrong. Why is a mobile app's local database migration architecturally riskier, and how do you design around that?",
  "answer": "<p>A backend migration runs against one database your team controls directly, with a rollback path (restoring a backup, running a down-migration) available if it goes wrong. A mobile schema migration runs independently on every single user's device the moment they update to the new app version, with your code, not a DBA, executing it, and no realistic way to \"roll back\" a device's local database once the migration has run and the old app version has already been uninstalled — there's no backup to restore on a device you don't have access to, and a failed migration that corrupts local data on even a small percentage of a large install base is a real, hard-to-fully-recover incident.</p>\n      <p>The architectural discipline this demands: every migration must be tested against real production-shaped data before release, not just a clean test database, since a migration that works on an empty or synthetic dataset can fail on the edge cases real accumulated user data actually contains; migrations should be designed to be safely re-runnable/idempotent in case a migration is interrupted mid-way (an app killed by the OS during the migration step); and a genuinely risky migration should ship behind a strategy that limits blast radius the same way any risky release does — a staged rollout percentage specifically for the release containing the migration, watched closely for a spike in crash reports before rolling out further, since a schema migration is exactly the kind of change where \"we'll just hotfix it if something's wrong\" doesn't actually work once it's already run on a user's device.</p>"
},
{
  "id": "b29-23",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing an image-loading and caching pipeline that doesn't quietly consume all available memory.",
  "difficulty": "Senior",
  "tags": ["Image Loading", "Caching", "Memory Management", "Mobile Architecture"],
  "question": "What does a well-architected image-loading pipeline (like what Coil/Glide/SDWebImage provide) actually need to get right, beyond just fetching and displaying an image?",
  "answer": "<p>The naive approach — fetch the full-resolution image and decode it directly into a bitmap at its native size — is exactly how an image-heavy screen (a feed, a gallery) exhausts memory and gets the process killed: a modern camera photo decoded at full resolution can be tens of megabytes in memory even though the on-screen thumbnail displaying it is a fraction of that size. A real pipeline decodes images downsampled to the actual target display size (using the platform's inSampleSize-style decoding options or the library's built-in resizing), never holding a full-resolution decode in memory just to display a small thumbnail.</p>\n      <p>The caching layer needs two distinct tiers with different eviction policies: an in-memory LRU cache (fast, but bounded and evicted under memory pressure — the OS can and will reclaim app memory aggressively, so nothing in the memory cache should be assumed durably present) and a disk cache (slower but survives app restarts and memory pressure, avoiding a redundant network fetch for an image already downloaded recently). The parts that get missed even by teams using an established library correctly: request cancellation tied to view lifecycle (a fast-scrolling list shouldn't keep loading images for cells that have already scrolled off-screen and been recycled — an in-flight request for a now-irrelevant cell wastes both bandwidth and, briefly, memory) and correctly handling a view being recycled mid-load (the classic RecyclerView/UITableView bug where a slow-loading image for a scrolled-away cell arrives late and gets displayed on the wrong, now-different, recycled cell if the load isn't explicitly tied to and cancelled with that specific view's lifecycle).</p>"
},
{
  "id": "b29-24",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Choosing between native modularized apps and a single cross-platform codebase as a product grows.",
  "difficulty": "Senior",
  "tags": ["Native vs Cross-Platform", "Architecture Decision Record", "Mobile Architecture"],
  "question": "A product started as two separate native apps (iOS/Android) and has grown large enough that the duplication is genuinely painful. How do you architect the decision of whether (and how) to consolidate onto a single cross-platform codebase?",
  "answer": "<p>The honest framing of this decision as an architect isn't \"cross-platform is more efficient\" in the abstract — it's a real migration with real risk against an already-shipping, revenue-generating product, and the actual comparison has to weigh the ongoing cost of duplicated feature work across two native codebases against the one-time (and genuinely large) cost of a migration, plus the ongoing cost of whatever native-integration friction the cross-platform choice reintroduces for the app's specific platform-heavy features (deep hardware integration, complex platform-specific UI). A product with light platform-integration needs and a lot of duplicated, straightforward CRUD-shaped feature work has a much stronger case than one whose core value is deep native capability that a cross-platform layer would just have to bridge around anyway.</p>\n      <p>If consolidation is justified, the architecture decision record should explicitly favor an incremental strangler-style migration over a big-bang rewrite — new features built cross-platform going forward while existing native screens are ported gradually and validated in production one at a time, keeping both native apps shippable and stable throughout rather than freezing feature development on two platforms for the duration of a risky full rewrite. The single biggest failure mode to name explicitly in the ADR: underestimating the tail of platform-specific edge cases (a native SDK integration, a deep OS-level feature) that don't port cleanly and end up needing native modules anyway, quietly eroding the promised \"one codebase\" savings the decision was originally justified by.</p>"
},
{
  "id": "b29-25",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Threat-modeling a mobile app architecture — what to actually walk through.",
  "difficulty": "Senior",
  "tags": ["Threat Modeling", "STRIDE", "Mobile Security", "Mobile Architecture"],
  "question": "As a mobile architect asked to threat-model a new feature before build starts, what does that exercise actually consist of?",
  "answer": "<p>A useful threat-modeling pass isn't a generic security checklist run against the whole app — it walks the specific feature's actual data flow (what data enters the device, where it's stored, what leaves the device and to where) and asks, at each boundary, what an attacker positioned there could actually do: intercept it in transit (is it over plain HTTP, is certificate pinning bypassed on a rooted device), read it at rest (is a sensitive field stored in plaintext in a database or shared preferences a rooted device's owner or a malicious app with the right permissions could read), or manipulate the client to lie about it (is a client-reported value like a price or a permission check trusted by the server without re-validation).</p>\n      <p>A structured framework like STRIDE (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) gives a checklist of attacker-goal categories to walk the feature's data flow against systematically, rather than relying purely on whatever specific risks happen to come to mind in the moment — for a new mobile payment feature, say, that means explicitly asking about spoofing (can a compromised client impersonate a legitimate one), tampering (can a modified client alter a transaction amount before it's sent), and elevation of privilege (can a normal user's client be manipulated into performing an action gated to an admin role) as separate, deliberate questions, not a single vague \"is this secure\" pass. The output that actually matters isn't a document that gets filed away — it's a concrete list of mitigations (specific validation added server-side, a specific field moved out of client-readable storage) that get built into the feature before it ships, not identified after a security review finds them in production.</p>"
}
);
