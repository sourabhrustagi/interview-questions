// ==========================================================
// Android Interview Questions — Batch 2
// Authored to cover a senior Android/Kotlin/payments JD:
// lifecycle, Data Binding/MVVM/Compose migration, Hilt DI,
// Room & offline-first, Android IPC (Binder/AIDL), FSM & timers,
// testing pyramid & CI/CD, Gradle, Java interop & concurrency,
// Linux/firmware/hardware integration, and Payments/PCI.
// Appends into QUESTION_DATA (declared in js/data.js). Load this
// file AFTER js/data.js and js/data-kotlin-batch1.js, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b2-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Core & Lifecycle",
  "title": "Configuration change vs process death — what survives, and what's your job?",
  "difficulty": "Mid",
  "tags": [
    "Lifecycle",
    "SavedStateHandle",
    "ViewModel",
    "Android Core & Lifecycle"
  ],
  "question": "Walk through what happens to an Activity across a configuration change (e.g. rotation) versus process death — what survives each, and what's your job as the app author?",
  "answer": "<p>Config change: the Activity is destroyed and recreated on the <strong>same process</strong>. A <code>ViewModel</code> scoped to it survives via the retained <code>ViewModelStore</code>; a small transient-state <code>Bundle</code> also survives through <code>onSaveInstanceState</code>/<code>onRestoreInstanceState</code> — but that Bundle rides an IPC transaction with a roughly 1&nbsp;MB limit, so it's for scroll position and form text, not a photo.</p>\n      <p>Process death: the OS can kill the whole backgrounded process to reclaim memory. On relaunch, a plain <code>ViewModel</code> field is gone too — recovery has to go through <code>SavedStateHandle</code>, which is backed by the same instance-state mechanism but surfaced on the ViewModel.</p>\n      <p>Your job: put anything the user would be upset to lose in <code>SavedStateHandle</code>, keep it small, and treat the ViewModel as the config-change safety net and SavedStateHandle as the process-death safety net — they are not the same guarantee.</p>\n      <pre><code>class CheckoutViewModel(private val state: SavedStateHandle) : ViewModel() {\n  var amountEntered: String\n    get() = state[\"amount\"] ?: \"\"\n    set(v) { state[\"amount\"] = v }\n}</code></pre>"
},
{
  "id": "and-b2-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Core & Lifecycle",
  "title": "Why does an Activity Context in a singleton leak, and what's the fix?",
  "difficulty": "Senior",
  "tags": [
    "Memory Leak",
    "Context",
    "Android Core & Lifecycle"
  ],
  "question": "Why is holding an Activity Context in a singleton or other long-lived object a leak, and what's the fix?",
  "answer": "<p>A singleton (a Hilt <code>@Singleton</code>, or a manual object) lives for the process's lifetime, but an Activity's Context is meant to die with the Activity. If the singleton keeps a reference — directly, or transitively through a listener it registered — the whole Activity view tree stays reachable by the GC after the user has navigated away, so normal teardown never reclaims it. LeakCanary reports it as an <code>ActivityLeaked</code>.</p>\n      <p>Fix: inject <code>Application</code> context (<code>@ApplicationContext</code> in Hilt) into anything long-lived, never the Activity's context; for listeners, unregister in <code>onDestroy</code>/<code>onCleared</code>, or hold a <code>WeakReference</code>.</p>"
},
{
  "id": "and-b2-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Core & Lifecycle",
  "title": "Why collect Flow via viewLifecycleOwner, not the Fragment's own lifecycleScope?",
  "difficulty": "Mid",
  "tags": [
    "Fragment",
    "Lifecycle",
    "Android Core & Lifecycle"
  ],
  "question": "A Fragment instance can outlive its View. Why does that mean you should collect a Flow via viewLifecycleOwner.lifecycleScope, not the Fragment's own lifecycleScope?",
  "answer": "<p>A Fragment can be kept around — in a back stack, or briefly during a replace transaction — after <code>onDestroyView</code> has already torn down its view hierarchy. <code>lifecycleScope</code> tracks the <em>Fragment's</em> lifecycle, so a coroutine started with it keeps running — and keeps referencing now-destroyed views — past <code>onDestroyView</code>. <code>viewLifecycleOwner.lifecycleScope</code> tracks the <em>View's</em> lifecycle specifically and gets cancelled right at <code>onDestroyView</code>, which is what any UI-touching collector needs.</p>"
},
{
  "id": "and-b2-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "Data Binding, MVVM & Compose",
  "title": "Data Binding vs View Binding — what does each solve, and which do you default to?",
  "difficulty": "Mid",
  "tags": [
    "Data Binding",
    "View Binding",
    "Data Binding, MVVM & Compose"
  ],
  "question": "Data Binding vs View Binding — what does each actually solve, and why might you still choose View Binding in a new module even though Data Binding is more powerful?",
  "answer": "<p>View Binding just generates a typed binding class per XML layout — it replaces <code>findViewById</code> with null-safe, compile-time-checked references. Nothing else. Data Binding additionally supports binding expressions in XML (<code>@{viewModel.title}</code>), two-way binding, and <code>BindingAdapter</code>s — real power, at a real cost: slower annotation-processed builds, expressions that are hard to unit test, and stack traces that point at generated code instead of your logic. It also quietly moves business logic into markup.</p>\n      <p>Default to View Binding and drive the UI explicitly from Kotlin (<code>observe</code>/<code>collect</code> calls you can step through and test); reach for Data Binding only where two-way binding genuinely simplifies a form — and increasingly, just move that screen to Compose, which removes the whole XML-expression trade-off.</p>"
},
{
  "id": "and-b2-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "Data Binding, MVVM & Compose",
  "title": "In MVVM, what exactly does the ViewModel own, and what's the most common review violation?",
  "difficulty": "Mid",
  "tags": [
    "MVVM",
    "ViewModel",
    "Navigation",
    "Data Binding, MVVM & Compose"
  ],
  "question": "In MVVM on Android, what specifically does the ViewModel own, and what's the most common violation you see in review?",
  "answer": "<p>The ViewModel owns UI <em>state</em> and the logic to derive it from the domain layer — exposed as a <code>StateFlow</code>/<code>LiveData</code> the View passively observes. It must never hold a <code>View</code>, <code>Context</code>, or anything UI-shaped — that's exactly what makes it survive rotation and be unit-testable with no device.</p>\n      <p>The most common violation: a ViewModel that takes a <code>NavController</code> or a <code>View</code> \"just this once\" to trigger navigation. Fix: expose navigation as a one-off event through a <code>Channel</code> (the same StateFlow-vs-Channel-for-events rule from the Flow section) and let the View layer interpret it.</p>"
},
{
  "id": "and-b2-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "Data Binding, MVVM & Compose",
  "title": "Ship one new Compose section inside a large existing View screen this sprint — how?",
  "difficulty": "Senior",
  "tags": [
    "Compose",
    "Interop",
    "Migration",
    "Data Binding, MVVM & Compose"
  ],
  "question": "You have a large existing View-based screen and need to ship one new Compose-built section inside it this sprint, not rewrite the screen. How, and what are the two things people get wrong?",
  "answer": "<p><code>ComposeView</code> — drop it into the existing XML (or add it programmatically), call <code>setContent { }</code>, and it becomes a normal child in the same layout pass, able to read the same ViewModel. The reverse — a legacy View inside a Compose screen — uses <code>AndroidView(factory = { context -> ... })</code>.</p>\n      <p>Two common mistakes: forgetting to set a <code>ViewCompositionStrategy</code> (the default disposes on view-detach, which is usually wrong inside a Fragment's view that gets detached and reattached — use <code>DisposeOnViewTreeLifecycleDestroyed</code>); and recreating the legacy View inside <code>AndroidView</code>'s <code>update</code> block instead of <code>factory</code> — <code>update</code> runs on every recomposition, <code>factory</code> runs exactly once.</p>"
},
{
  "id": "and-b2-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "Dependency Injection (Hilt)",
  "title": "What do @HiltAndroidApp and @AndroidEntryPoint generate, and why field injection?",
  "difficulty": "Mid",
  "tags": [
    "Hilt",
    "Dagger",
    "Dependency Injection (Hilt)"
  ],
  "question": "What does @HiltAndroidApp / @AndroidEntryPoint actually generate, and why can't you use constructor injection in an Activity the way you do in a plain class?",
  "answer": "<p><code>@HiltAndroidApp</code> makes Hilt generate the full Dagger component graph rooted at your Application. <code>@AndroidEntryPoint</code> on an Activity/Fragment/Service generates a base class that, early in the lifecycle, pulls dependencies out of that graph and injects them into <code>@Inject</code>-annotated fields — field injection, not constructor injection.</p>\n      <p>The reason: Android instantiates Activities and Fragments itself via reflection, so there's no call site you control to pass constructor arguments into. ViewModels are the exception — <code>@HiltViewModel</code> allows constructor injection because you go through <code>ViewModelProvider.Factory</code>, a call site Hilt does control.</p>"
},
{
  "id": "and-b2-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "Dependency Injection (Hilt)",
  "title": "@Singleton vs @ActivityRetainedScoped vs @ViewModelScoped — how do you pick?",
  "difficulty": "Senior",
  "tags": [
    "Hilt",
    "Scopes",
    "Dependency Injection (Hilt)"
  ],
  "question": "@Singleton vs @ActivityRetainedScoped vs @ViewModelScoped in Hilt — how do you pick, and what breaks if you get it wrong?",
  "answer": "<p><code>@Singleton</code> — one instance for the whole process (a Retrofit client, a Room database). <code>@ActivityRetainedScoped</code> — survives configuration changes but not navigating away or process death; useful for state shared across several ViewModels in one flow (a checkout session object). <code>@ViewModelScoped</code> — one instance per ViewModel, torn down with it.</p>\n      <p>Too wide (a payment-session object as <code>@Singleton</code>) and stale state leaks across unrelated screens or users. Too narrow (<code>@ViewModelScoped</code> for something meant to survive navigation) and you silently lose state you thought was shared.</p>"
},
{
  "id": "and-b2-09",
  "category": "android",
  "categoryName": "Android",
  "topic": "Dependency Injection (Hilt)",
  "title": "Swap a Hilt binding for a fake in an instrumented test.",
  "difficulty": "Senior",
  "tags": [
    "Hilt",
    "Testing",
    "Dependency Injection (Hilt)"
  ],
  "question": "How do you swap a Hilt binding for a fake device implementation in an instrumented test?",
  "answer": "<p><code>@TestInstallIn</code> swaps a whole module for a fake, app-wide for the test APK — the mechanism that lets an instrumented UI test run with zero real hardware. Pair it with <code>@HiltAndroidTest</code> on the test class and <code>HiltAndroidRule</code> to trigger the injection. For finer control per test rather than per test APK, inject the fake and mutate it directly (<code>fakeCardReader.nextResult = Declined</code>) instead of swapping modules per test.</p>\n      <pre><code>@Module\n@TestInstallIn(components = [SingletonComponent::class], replaces = [CardReaderModule::class])\nobject FakeCardReaderModule {\n  @Provides fun provideReader(): CardReader = FakeCardReader()\n}</code></pre>"
},
{
  "id": "and-b2-10",
  "category": "android",
  "categoryName": "Android",
  "topic": "Room & Persistence",
  "title": "What does Room verify at compile time, and what's still on you at runtime?",
  "difficulty": "Mid",
  "tags": [
    "Room",
    "SQL",
    "Room & Persistence"
  ],
  "question": "What does Room actually verify at compile time, and what's still your responsibility at runtime?",
  "answer": "<p>Room's annotation processor parses every <code>@Query</code> string against the <code>@Entity</code>-derived schema and fails the build if a column or table doesn't exist, or the return type doesn't match the projected columns — genuinely compile-time SQL.</p>\n      <p>What it won't catch: forgetting to bump <code>version</code> for a schema change, or writing the migration itself. An unmigrated schema crashes at runtime with <code>IllegalStateException</code> unless you supply a <code>Migration</code> or explicitly opt into <code>fallbackToDestructiveMigration()</code>.</p>"
},
{
  "id": "and-b2-11",
  "category": "android",
  "categoryName": "Android",
  "topic": "Room & Persistence",
  "title": "Write a Room migration, and explain why destructive migration is dangerous for a payments app.",
  "difficulty": "Senior",
  "tags": [
    "Room",
    "Migration",
    "Room & Persistence"
  ],
  "question": "Write a Room migration that adds a nullable column, and explain why fallbackToDestructiveMigration() is specifically dangerous for a payments app.",
  "answer": "<p><code>fallbackToDestructiveMigration()</code> drops and recreates every table on a version mismatch, silently. For a cache of remote data that's fine — it just refetches. For a payments app, the local database is often the only record of a transaction until it syncs, or the only offline receipt — destroying it on an app update is a real financial and audit problem. Always write an explicit migration for anything the app itself is the source of truth for, and verify it with Room's <code>MigrationTestHelper</code>.</p>\n      <pre><code>val MIGRATION_1_2 = object : Migration(1, 2) {\n  override fun migrate(db: SupportSQLiteDatabase) {\n    db.execSQL(\"ALTER TABLE transactions ADD COLUMN authCode TEXT\")\n  }\n}\nRoom.databaseBuilder(context, AppDb::class.java, \"app.db\")\n  .addMigrations(MIGRATION_1_2)\n  .build()</code></pre>"
},
{
  "id": "and-b2-12",
  "category": "android",
  "categoryName": "Android",
  "topic": "Room & Persistence",
  "title": "Describe an offline-first repository pattern with Room as the single source of truth.",
  "difficulty": "Senior",
  "tags": [
    "Room",
    "Offline-first",
    "Repository",
    "Room & Persistence"
  ],
  "question": "Describe an offline-first repository pattern with Room as the single source of truth, and the one subtlety that breaks it.",
  "answer": "<p>The Repository exposes a <code>Flow</code> from the Room DAO as the one thing the UI observes; network calls never hand data straight to the UI — they write into Room, and the existing Flow emits the update automatically. Read: the UI collects <code>dao.observeTransactions()</code>. Write: <code>repo.sync()</code> calls the API, then <code>dao.upsertAll(result)</code> — the UI updates itself, and it keeps working, with the last-known-good data, with zero network.</p>\n      <p>The subtlety: conflict resolution. If the same row can be edited locally and updated remotely, this pattern silently lets the remote write clobber a pending local one unless you add a <code>syncState</code>/<code>updatedAt</code> column to decide who wins.</p>"
},
{
  "id": "and-b2-13",
  "category": "android",
  "categoryName": "Android",
  "topic": "Room & Persistence",
  "title": "Why does @Transaction matter for a Room Flow query joining two tables?",
  "difficulty": "Mid",
  "tags": [
    "Room",
    "Flow",
    "Transaction",
    "Room & Persistence"
  ],
  "question": "Why does a Room @Transaction on a multi-table @Query matter, specifically for Flow correctness?",
  "answer": "<p>Without <code>@Transaction</code>, Room re-runs the underlying query on any change to either observed table — but a multi-table read isn't atomic, so a collector can observe a transient, inconsistent snapshot (the parent row updated, the child rows not yet). <code>@Transaction</code> on the query makes the read itself atomic, so the Flow only ever emits consistent, matched snapshots.</p>"
},
{
  "id": "and-b2-14",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android IPC & Services",
  "title": "What is Binder, in one interview-length paragraph?",
  "difficulty": "Senior",
  "tags": [
    "Binder",
    "AIDL",
    "Android IPC & Services"
  ],
  "question": "What is Binder, in one paragraph you could say out loud in an interview?",
  "answer": "<p>A kernel driver (<code>/dev/binder</code>) plus a userspace protocol on top of it, that lets one process invoke a method on an object living in another process — arguments marshalled across in a Parcel — using one kernel-mediated copy and a context switch, not a full socket round trip. That's what makes it fast enough to be the backbone of the whole framework: every <code>ActivityManager</code> and <code>PackageManager</code> call is Binder underneath. AIDL is just a code-generation layer on top of it — it writes the Parcel marshalling and the Proxy/Stub boilerplate for you.</p>"
},
{
  "id": "and-b2-15",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android IPC & Services",
  "title": "A synchronous AIDL call from the main thread causes an ANR — what happened, and the two fixes?",
  "difficulty": "Senior",
  "tags": [
    "AIDL",
    "ANR",
    "Threading",
    "Android IPC & Services"
  ],
  "question": "You call a synchronous AIDL method from the main thread and the app ANRs. What happened, and what are your two fixes?",
  "answer": "<p>A non-<code>oneway</code> AIDL call blocks the calling thread until the remote process replies — the thread parks on the Binder transaction. Do that from the main thread and if the remote side takes more than ~5s (or never replies, because the peripheral service crashed), you get an ANR.</p>\n      <p>Fix 1: mark the method <code>oneway</code> if you don't need a return value — it becomes fire-and-forget and any result comes back via a registered callback interface instead. Fix 2: if you do need the return value, never call it from the main thread — wrap it in <code>withContext(ioDispatcher)</code> from a coroutine, the same pattern as wrapping a callback-based SDK.</p>"
},
{
  "id": "and-b2-16",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android IPC & Services",
  "title": "Bind safely to a vendor's AIDL-based payment device service.",
  "difficulty": "Mid",
  "tags": [
    "Bound Service",
    "Device SDK",
    "Android IPC & Services"
  ],
  "question": "A vendor's payment device SDK ships as an AIDL-based bound service, common for POS peripherals. Walk through binding to it safely.",
  "answer": "<p>Bind in <code>onStart</code>/unbind in <code>onStop</code> — not <code>onCreate</code>/<code>onDestroy</code>, since you don't want to hold the connection while backgrounded. Implement <code>ServiceConnection.onServiceDisconnected</code> to null out the Stub reference, because the remote process — often a separate, privileged process actually driving the hardware — can die and restart independently of your app. And treat every AIDL call as capable of throwing <code>RemoteException</code>, since the remote process can die mid-call; wrap it, don't let it become an uncaught crash.</p>\n      <p>This is the same shape as wrapping a callback-based device SDK in a coroutine, one layer further out: a domain interface hides the AIDL binding lifecycle so the rest of the app never sees a <code>ServiceConnection</code>.</p>"
},
{
  "id": "and-b2-17",
  "category": "android",
  "categoryName": "Android",
  "topic": "Finite State Machines & Timers",
  "title": "Why model a card-payment flow as an FSM instead of a set of booleans?",
  "difficulty": "Senior",
  "tags": [
    "FSM",
    "State",
    "Sealed Class",
    "Finite State Machines & Timers"
  ],
  "question": "A card-payment flow has around 8 states (Idle, WaitingForCard, Reading, Authorizing, Approved, Declined, Cancelled, Error) with real transition rules. Why is this an FSM, not a set of booleans?",
  "answer": "<p>With booleans (<code>isReading</code>, <code>isAuthorizing</code>, …) the illegal combinations — <code>isReading &amp;&amp; isDeclined</code> both true — are representable, and nothing stops a bug from producing one; you find out in production when the UI shows two conflicting things at once.</p>\n      <p>Modelled as a sealed class with a single <code>state: TxState</code> field and a <code>reduce(state, event): TxState</code> function, illegal states aren't representable — there's exactly one active state by construction — and the exhaustive <code>when</code> in <code>reduce</code> forces a decision for every event in every state, including the edge case boolean flags let a team forget: \"cancel pressed while authorizing.\"</p>"
},
{
  "id": "and-b2-18",
  "category": "android",
  "categoryName": "Android",
  "topic": "Finite State Machines & Timers",
  "title": "A 30-second card-wait timeout: why not Handler.postDelayed, what's the coroutine version?",
  "difficulty": "Mid",
  "tags": [
    "Timers",
    "Coroutines",
    "Finite State Machines & Timers"
  ],
  "question": "Implementing a 30-second 'waiting for card' timeout — why not Handler.postDelayed, and what's the coroutine-idiomatic version?",
  "answer": "<p><code>Handler.postDelayed</code> ties the timer to whichever Looper you posted from and needs a manual <code>removeCallbacks</code> in every exit path — success, cancel, <code>onDestroy</code> — or it leaks a reference to whatever it captured.</p>\n      <p><code>withTimeoutOrNull(30_000) { waitForCard() }</code> gets cancellation for free — it's structurally impossible to forget, because it's tied to the coroutine's own scope, which is already tied to the ViewModel/Fragment lifecycle.</p>"
},
{
  "id": "and-b2-19",
  "category": "android",
  "categoryName": "Android",
  "topic": "Testing & CI/CD",
  "title": "JUnit+Robolectric vs Espresso vs UI Automator — where does each belong?",
  "difficulty": "Mid",
  "tags": [
    "JUnit",
    "Espresso",
    "Robolectric",
    "Testing & CI/CD"
  ],
  "question": "JUnit+Robolectric vs Espresso vs UI Automator — where does each belong, and why is a test suite that's mostly Espresso a smell?",
  "answer": "<p>JUnit — pure logic, no Android framework, milliseconds each, runs on every commit. Robolectric — logic that touches Android classes (a <code>Context</code>, a <code>Resources</code> lookup) but doesn't need a real rendering pipeline; runs on the JVM, still fast, no emulator. Espresso — real instrumented UI tests, one app, on a device/emulator; correct but an order of magnitude slower and flakier. UI Automator — cross-app or system UI, since Espresso can only see inside your own app's window.</p>\n      <p>A suite that's mostly Espresso is slow in CI and flaky; the healthy pyramid is mostly JUnit, a good layer of Robolectric, and a thin top layer of Espresso for the handful of flows that genuinely need a real rendered screen.</p>"
},
{
  "id": "and-b2-20",
  "category": "android",
  "categoryName": "Android",
  "topic": "Testing & CI/CD",
  "title": "When do you reach for UI Automator over Espresso on a POS device?",
  "difficulty": "Mid",
  "tags": [
    "UI Automator",
    "System UI",
    "Testing & CI/CD"
  ],
  "question": "When would you reach for UI Automator over Espresso on a POS device specifically?",
  "answer": "<p>Anything crossing your app's own window: verifying a system permission dialog is handled correctly (camera/NFC/USB permission for a card reader), testing what happens when a phone call or system dialog interrupts a transaction mid-flow, or driving another app or launcher on a dedicated payment terminal. Espresso's idling/synchronization only understands your own app's main-thread work — it can't see or wait on system UI.</p>"
},
{
  "id": "and-b2-21",
  "category": "android",
  "categoryName": "Android",
  "topic": "Testing & CI/CD",
  "title": "Espresso suite is flaky in CI but passes locally — what do you check, in order?",
  "difficulty": "Senior",
  "tags": [
    "Espresso",
    "Flaky Tests",
    "CI",
    "Testing & CI/CD"
  ],
  "question": "Your Espresso suite is flaky in CI but passes locally. What do you actually check, in order?",
  "answer": "<p>First, animations — CI emulators often default differently; disable animator/transition/window-animation scale in the test APK setup, which alone fixes a large fraction of flakiness. Second, missing <code>IdlingResource</code> registration around async work Espresso's built-in idling can't see (it only automatically waits on the main-thread message queue). Third, shared mutable state between tests — a singleton, a static, a real backing database not reset between runs; tests should be independent and idempotent. Fourth: genuine CI emulator resource starvation exposing a real race that happened not to lose on your machine.</p>"
},
{
  "id": "and-b2-22",
  "category": "android",
  "categoryName": "Android",
  "topic": "Testing & CI/CD",
  "title": "Sketch a GitLab CI pipeline for an Android app.",
  "difficulty": "Mid",
  "tags": [
    "GitLab CI",
    "CI/CD",
    "Pipeline",
    "Testing & CI/CD"
  ],
  "question": "Sketch a GitLab CI pipeline for an Android app — the stages, and what runs where.",
  "answer": "<p>Roughly: lint + unit tests (JVM only, every push, fastest feedback) → build debug/release APK, signing config from CI secrets, never committed → Robolectric/JVM integration tests → instrumented tests on an emulator (Firebase Test Lab, or a runner with KVM), gated to merge-to-main rather than every push since it's the slowest stage → on tag/release, sign with the real release key from a secrets manager and publish via the Play Console API.</p>\n      <p>The design principle: order stages fastest-to-slowest so a broken build fails in seconds, not after a 20-minute emulator run.</p>"
},
{
  "id": "and-b2-23",
  "category": "android",
  "categoryName": "Android",
  "topic": "Gradle & Build",
  "title": "Why split a large Android app into Gradle modules, beyond 'it's tidy'?",
  "difficulty": "Mid",
  "tags": [
    "Gradle",
    "Modules",
    "Gradle & Build"
  ],
  "question": "Why split a large Android app into Gradle modules, beyond 'it's tidy'?",
  "answer": "<p>Build speed via parallel and incremental compilation — Gradle only recompiles the module(s) whose inputs changed, and builds independent modules in parallel; a monolithic <code>:app</code> recompiles a lot for a one-line change. It also enforces architecture: <code>:core:network</code> simply cannot import from <code>:feature:checkout</code> unless you add that dependency, so layering violations are caught by the build graph, not by review discipline.</p>\n      <p>The cost: more <code>build.gradle</code> boilerplate to maintain — usually solved with Gradle convention plugins (a shared <code>build-logic</code> module) instead of copy-pasting config into every module.</p>"
},
{
  "id": "and-b2-24",
  "category": "android",
  "categoryName": "Android",
  "topic": "Java & Concurrency",
  "title": "Checked exceptions vanish calling Java from Kotlin — what's the risk?",
  "difficulty": "Mid",
  "tags": [
    "Java",
    "Kotlin Interop",
    "Exceptions",
    "Java & Concurrency"
  ],
  "question": "What's a checked exception, and why does it disappear when a Java method is called from Kotlin — what's the risk?",
  "answer": "<p>Java's checked exceptions (<code>IOException</code> etc.) must be declared or caught at compile time — the compiler enforces handling. Kotlin has no checked exceptions at all, so calling Java code from Kotlin, the <code>throws</code> clause is invisible: nothing forces you to handle it, and it's easy to genuinely not know a call can throw until it does in production.</p>\n      <p>Fix: check the Javadoc/<code>@Throws</code>, and wrap the boundary explicitly rather than trusting the compiler to remind you — the same \"errors crossing a layer boundary\" discipline from the Kotlin section, tested for real at a Java interop seam.</p>"
},
{
  "id": "and-b2-25",
  "category": "android",
  "categoryName": "Android",
  "topic": "Java & Concurrency",
  "title": "A hardware callback thread flips a plain var a main-thread read sees stale — why, and why doesn't it show up locally?",
  "difficulty": "Senior",
  "tags": [
    "Concurrency",
    "Memory Model",
    "Volatile",
    "Java & Concurrency"
  ],
  "question": "A hardware callback fires on a vendor SDK's own background thread and flips a plain var isReady = true that the main thread reads. What can go wrong, and why doesn't it show up in testing on your laptop?",
  "answer": "<p>There's no happens-before relationship between the write and the read — the JVM memory model doesn't guarantee the main thread's core ever observes the new value; it can sit in a store buffer or a per-core cache and the read observes stale data indefinitely, not just \"sometimes.\"</p>\n      <p>It usually doesn't show up in testing because dev machines are x86, whose memory model is strong enough to mask it, while Android devices are ARM — a genuinely weaker model — so it surfaces in the field, rarely on an emulator on a laptop. Fix: <code>@Volatile</code>, an <code>AtomicBoolean</code>, or route the callback through a <code>Channel</code>/<code>MutableStateFlow</code>, which handles visibility for you and gives structured cancellation for free.</p>"
},
{
  "id": "and-b2-26",
  "category": "android",
  "categoryName": "Android",
  "topic": "Linux & Hardware Integration",
  "title": "Android runs on a Linux kernel — what does that buy an engineer working close to hardware?",
  "difficulty": "Mid",
  "tags": [
    "Linux",
    "Kernel",
    "Permissions",
    "Linux & Hardware Integration"
  ],
  "question": "Android runs on a Linux kernel — what does that buy an Android engineer working close to hardware, concretely?",
  "answer": "<p>Every app is a distinct Linux UID, so app sandboxing is enforced by the kernel's own file-permission model, not just app-level policy — that's why one app's private storage is unreadable to another at the OS level, not merely by convention. Hardware access permissions often map to a Linux group (e.g. access to <code>/dev/ttyUSB*</code> for a serial peripheral gated by group membership), so debugging \"my device isn't detected\" on a custom board often comes down to <code>adb shell ls -l /dev/...</code> and checking group ownership, not just the AndroidManifest. And <code>logcat</code>/ANR traces ultimately read the same kernel signal and coredump machinery any Linux process debugging uses.</p>"
},
{
  "id": "and-b2-27",
  "category": "android",
  "categoryName": "Android",
  "topic": "Linux & Hardware Integration",
  "title": "How does an app talk to firmware on a peripheral when there's no AIDL SDK for it?",
  "difficulty": "Senior",
  "tags": [
    "Firmware",
    "USB",
    "Serial",
    "Bluetooth",
    "Linux & Hardware Integration"
  ],
  "question": "How does an Android app typically talk to firmware on an attached peripheral (a card reader, a printer) when there's no AIDL SDK for it?",
  "answer": "<p>Usually one of: USB (<code>UsbManager</code>/<code>UsbDeviceConnection</code>, raw bulk/interrupt transfers, you implement the peripheral's own protocol on top), serial over USB (Android has no native serial API, so a library like <code>usb-serial-for-android</code>), or Bluetooth (classic RFCOMM, or BLE GATT for lower-power peripherals).</p>\n      <p>All three land in the same shape: a background thread — never the main thread, I/O blocks — reading and writing raw bytes, framing the peripheral's protocol yourself (start/end markers, checksums), and wrapping the whole thing behind a domain interface like <code>CardReader</code> so the rest of the app never sees USB/serial/BLE specifics, and a fake implementation can stand in for hardware in tests.</p>"
},
{
  "id": "and-b2-28",
  "category": "android",
  "categoryName": "Android",
  "topic": "Linux & Hardware Integration",
  "title": "A USB peripheral is plugged in but the app doesn't see it — why, and the fix?",
  "difficulty": "Mid",
  "tags": [
    "USB",
    "Permissions",
    "Linux & Hardware Integration"
  ],
  "question": "First time a USB peripheral is attached, the app doesn't see it even though the cable's plugged in. Why, and what's the fix?",
  "answer": "<p>Accessing a USB device needs explicit user permission, separate from any manifest permission — <code>UsbManager.requestPermission()</code> triggers a system dialog the first time, and the code must handle the async broadcast result (<code>ACTION_USB_PERMISSION</code>) rather than assuming synchronous access.</p>\n      <p>For a dedicated POS device where a dialog shouldn't interrupt every boot, ship a <code>device_filter.xml</code> matching the peripheral's vendor/product ID and request <code>android.hardware.usb.host</code> — combined with the OEM whitelisting the app as privileged/system, permission can be silently pre-granted.</p>"
},
{
  "id": "and-b2-29",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & PCI",
  "title": "What does PCI DSS actually constrain an Android engineer from doing?",
  "difficulty": "Senior",
  "tags": [
    "PCI DSS",
    "Security",
    "Compliance",
    "Payments & PCI"
  ],
  "question": "What does PCI DSS actually constrain an Android app engineer from doing, in practical terms?",
  "answer": "<p>The headline rule: full PAN (card number) and full track/CVV data must never be logged, stored unencrypted, or transmitted outside a PCI-scoped, encrypted channel — not in <code>Log.d</code>, not in a crash report, not in a local Room table \"just for debugging.\" Practically, the card-data path is usually isolated to certified hardware/firmware (the reader encrypts at the point of read — P2PE), and the app never sees raw card data at all, only a token or masked PAN it's allowed to display and log.</p>\n      <p>The interview-relevant discipline: treat \"does this field ever touch cardholder data\" as a design-time question for every log line, every DB column, every crash-reporting integration — not something retrofitted after a PCI audit finding.</p>"
},
{
  "id": "and-b2-30",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & PCI",
  "title": "App's role vs the secure payment core's role in an EMV chip transaction.",
  "difficulty": "Mid",
  "tags": [
    "EMV",
    "Payments",
    "Payments & PCI"
  ],
  "question": "At a high level, what's the app's role versus the secure payment core's role in an EMV chip transaction?",
  "answer": "<p>The secure core — often a certified module or a separate secure element/firmware, outside the general-purpose app's reach — handles the actual card cryptography: card authentication, PIN verification, the EMV kernel's decision to approve offline, go online, or decline. The app's role is orchestration and UI: tell the core \"start a transaction for this amount,\" show the resulting prompts (\"insert card,\" \"approved\"), and — if the core says go online — carry the resulting cryptogram to the payment processor and relay its response back to the core.</p>\n      <p>The app is deliberately kept out of the cryptographic path; that boundary is exactly what PCI scoping is drawn around.</p>"
},
{
  "id": "and-b2-31",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & PCI",
  "title": "Why can't PIN entry just be another screen in the app?",
  "difficulty": "Senior",
  "tags": [
    "PCI PTS",
    "PIN",
    "Security",
    "Payments & PCI"
  ],
  "question": "Why can't PIN entry just be another Compose/View screen in the app, even on a device with a touchscreen?",
  "answer": "<p>PCI PTS (PIN Transaction Security) requires the PIN entry path to run in a certified, tamper-resistant environment — the general-purpose Android app process is a much larger, less auditable attack surface than locked-down PIN pad firmware. In practice, PIN entry either happens on physically separate certified hardware, or, on integrated touchscreen devices, inside a certified secure/trusted execution environment the main app can't introspect — the app requests \"collect a PIN\" and gets back only an encrypted PIN block, never the PIN itself.</p>\n      <p>The app's job is again orchestration: show the \"enter PIN\" state, then move on once the secure component signals completion — it never has the PIN in memory.</p>"
},
{
  "id": "and-b2-32",
  "category": "android",
  "categoryName": "Android",
  "topic": "Debugging",
  "title": "Crash-free rate looks fine but support says the app 'freezes' — where do you look first?",
  "difficulty": "Mid",
  "tags": [
    "Debugging",
    "ANR",
    "StrictMode",
    "Debugging"
  ],
  "question": "A crash-free-rate metric looks fine but support tickets say the app 'freezes' on some devices. Where do you look first, in order?",
  "answer": "<p>ANR traces before crash reports — a freeze that recovers, or that the user force-closes, often never surfaces as a \"crash\" in crash-only reporting; it shows as an ANR, or nothing if it's under 5s and the user just waits. Filter by device/OEM — a freeze concentrated on one manufacturer often points at an OEM-specific background-process-killing policy or a vendor driver quirk, not application code. Then StrictMode in a debug build, to catch disk/network-on-main-thread violations that are silent in release but manifest as jank or a freeze under load. Only after those: attach a profiler and reproduce locally — \"reproduce first\" on a device-specific freeze wastes time you don't have.</p>"
}
);
