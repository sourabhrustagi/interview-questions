// ==========================================================
// General Track Interview Questions — Batch 4
// Popular/commonly-asked questions for the previously-thin
// categories: Flutter, SwiftUI, Project Management, Spring
// Boot, Node.js, and Full Stack. Content synthesized from
// widely-known interview themes and authored fresh in the
// site's own voice (no verbatim copying from any source).
// Appends into QUESTION_DATA. Load AFTER js/data.js and the
// other data-*.js files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "gen-b4-01",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Widgets & State Management",
  "title": "StatelessWidget vs StatefulWidget — and the real cost of overusing StatefulWidget.",
  "difficulty": "Mid",
  "tags": [
    "Widgets",
    "State",
    "Widgets & State Management"
  ],
  "question": "StatelessWidget vs StatefulWidget — what's the real cost of defaulting to StatefulWidget everywhere?",
  "answer": "<p><code>StatelessWidget</code> has no mutable state of its own — it rebuilds purely from the parameters it's given. <code>StatefulWidget</code> pairs with a <code>State</code> object that outlives individual <code>build()</code> calls and can call <code>setState</code> to trigger a rebuild.</p>\n      <p>Defaulting to StatefulWidget everywhere isn't just style — every stateful widget instance keeps its State object alive in the element tree, and a <code>setState</code> call rebuilds that widget's whole subtree unless you've broken it up. Overusing it means more objects retained in memory and wider, more expensive rebuild scopes than the UI change actually needs.</p>"
},
{
  "id": "gen-b4-02",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Widgets & State Management",
  "title": "Riverpod vs Provider vs BLoC — how do you actually pick?",
  "difficulty": "Senior",
  "tags": [
    "Riverpod",
    "Provider",
    "BLoC",
    "State Management",
    "Widgets & State Management"
  ],
  "question": "Riverpod vs Provider vs BLoC — how do you actually pick for a new large app?",
  "answer": "<p>Provider is InheritedWidget with a friendlier API — simple, but it's tied to the widget tree (you need a <code>BuildContext</code> to read it) and has no compile-time safety if a provider isn't found above you. Riverpod removes that tree dependency — providers are declared globally and are compile-time safe, testable with no widget tree at all, and support fine-grained rebuild scoping (`select`) more naturally.</p>\n      <p>BLoC enforces the strictest separation — every state change is an explicit, testable Event → State transition, which pays off on a large team with strict architecture review, at the cost of more boilerplate per feature. Rough rule: Provider for a small app or a quick prototype, Riverpod as the default for a new app today, BLoC where the team specifically wants the event-sourcing-style discipline and has the headcount to pay for the ceremony.</p>"
},
{
  "id": "gen-b4-03",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Widgets & State Management",
  "title": "What does setState actually trigger, and why does 'lift state up' matter?",
  "difficulty": "Senior",
  "tags": [
    "setState",
    "Rebuild",
    "Performance",
    "Widgets & State Management"
  ],
  "question": "What does calling setState actually trigger under the hood, and why does the advice to 'lift state up' matter for performance?",
  "answer": "<p><code>setState</code> marks that specific <code>Element</code> dirty and schedules a rebuild — Flutter then rebuilds that widget and its entire subtree on the next frame (it does not automatically know which descendants actually depend on the changed value). If you call <code>setState</code> high in a large tree for a change that only affects one small leaf widget, you rebuild everything underneath needlessly.</p>\n      <p>\"Lift state up\" is about the opposite problem — moving state to the right owner for correctness — but the performance-minded version is the reverse: push the state (and the <code>setState</code> call) as far <em>down</em> the tree as the piece of UI it actually affects, so the rebuild scope stays small. A `ValueListenableBuilder` or a scoped Riverpod provider around just the affected widget achieves the same thing more precisely.</p>"
},
{
  "id": "gen-b4-04",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "The three trees — Widget, Element, RenderObject — why does Flutter have all three?",
  "difficulty": "Senior",
  "tags": [
    "Widget Tree",
    "Element Tree",
    "RenderObject",
    "Architecture & Performance"
  ],
  "question": "Flutter has a Widget tree, an Element tree, and a RenderObject tree. Why three trees instead of one?",
  "answer": "<p>Widgets are cheap, immutable configuration — a new tree of them is created on every <code>build()</code>. Elements are the persistent, mutable glue: each Element holds a reference to its current Widget and is what actually survives across rebuilds, which is how Flutter can diff \"is this the same conceptual thing, just reconfigured\" versus \"this is a brand-new thing\" (widget <em>type</em> and <em>key</em> matching). RenderObjects do the actual layout and painting — they're the expensive part, so the Element layer's whole job is deciding when a RenderObject can be reused/updated in place versus torn down and recreated.</p>\n      <p>Splitting cheap-immutable-config from expensive-persistent-render-state is exactly what makes rebuilding a widget cheap even though layout and paint are not.</p>"
},
{
  "id": "gen-b4-05",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "Why do const constructors matter for rebuild performance?",
  "difficulty": "Mid",
  "tags": [
    "const",
    "Performance",
    "Rebuild",
    "Architecture & Performance"
  ],
  "question": "Why do const constructors matter for Flutter rebuild performance, beyond just being a lint suggestion?",
  "answer": "<p>A <code>const</code> widget is a compile-time constant — Flutter can recognize that the exact same instance is being passed again on a rebuild and skip rebuilding that subtree entirely, rather than just skipping expensive layout/paint for an equal-but-new instance. Without <code>const</code>, even a widget whose fields are all unchanged is still a fresh object each `build()`, and Flutter has to walk into it to find that out.</p>\n      <p>This is exactly why a large static decoration (an icon, a fixed-text label) buried inside a frequently-rebuilding parent should be marked <code>const</code> — it turns \"walk into and diff this subtree every frame\" into \"skip it, identical instance.\"</p>"
},
{
  "id": "gen-b4-06",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "When are Keys (ValueKey, GlobalKey) actually required in Flutter?",
  "difficulty": "Senior",
  "tags": [
    "Keys",
    "GlobalKey",
    "Reconciliation",
    "Architecture & Performance"
  ],
  "question": "When are Keys — ValueKey, GlobalKey — actually required in Flutter, versus when do people add them unnecessarily?",
  "answer": "<p>Keys matter when Flutter's default reconciliation (matching by widget type and position in a list of siblings) would match the wrong element — most commonly, a reorderable list of stateful items. Without a key, reordering two stateful list items just swaps their <em>configuration</em> onto the same two State objects in place, so per-item local state (a text field's cursor, an expand/collapse flag) stays attached to the wrong visual row. A <code>ValueKey</code> per item (keyed by a stable ID, not the index) fixes that — Flutter now matches by key, not position.</p>\n      <p><code>GlobalKey</code> is a much heavier tool — it lets you access another widget's State from anywhere and forces a full widget move instead of a rebuild, and re-parenting cost aside, using it for anything other than a genuine cross-tree reference (a Form's validation state, an animation controller reached from outside) is usually a sign the architecture should pass state down explicitly instead.</p>"
},
{
  "id": "gen-b4-07",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "How does Flutter avoid UI jank for CPU-heavy work — isolates and compute().",
  "difficulty": "Mid",
  "tags": [
    "Isolates",
    "compute",
    "Concurrency",
    "Architecture & Performance"
  ],
  "question": "Dart is single-threaded — how does Flutter avoid janking the UI when it needs to do real CPU-heavy work, like parsing a huge JSON payload?",
  "answer": "<p>Dart isolates — each isolate has its own memory heap and its own event loop, with no shared mutable memory between them (message-passing only, via <code>SendPort</code>/<code>ReceivePort</code>), so a heavy computation on a background isolate genuinely cannot block the UI isolate's frame rendering. <code>compute()</code> is the convenience wrapper: it spins up an isolate, runs a top-level or static function on it, sends the result back, and tears the isolate down.</p>\n      <pre><code>final parsed = await compute(parseLargeJson, rawJsonString);\n\nList<Item> parseLargeJson(String json) {\n  // runs on a separate isolate — no shared memory with the UI isolate\n  return (jsonDecode(json) as List).map((e) => Item.fromJson(e)).toList();\n}</code></pre>"
},
{
  "id": "gen-b4-08",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "Platform channels — how does Flutter call native Android/iOS code?",
  "difficulty": "Mid",
  "tags": [
    "Platform Channels",
    "Native Interop",
    "Architecture & Performance"
  ],
  "question": "How does Flutter call into native Android (Kotlin/Java) or iOS (Swift) code — walk through a platform channel.",
  "answer": "<p>A <code>MethodChannel</code> with a shared channel name, implemented on both sides: the Dart side invokes a named method with arguments, which get serialized (a standard binary codec, similar in spirit to Parcel), sent across the Flutter engine's native bridge, dispatched to a registered handler on the native side (an Android `MethodChannel.MethodCallHandler`, or the iOS equivalent), and the return value serializes back the same way. It's conceptually the AIDL-across-processes idea, but within one process, bridging the Dart and native runtimes instead of two OS processes.</p>\n      <p>For high-frequency data (camera frames, audio) a plain MethodChannel's per-call serialization overhead is too much — that's what <code>EventChannel</code> (streaming) or a <code>FlutterTexture</code>/platform view exists for.</p>\n      <pre><code>// Dart side\nstatic const _channel = MethodChannel('com.example/battery');\nfuture<int> getBatteryLevel() => _channel.invokeMethod('getBatteryLevel');\n\n// Android (Kotlin) side\nMethodChannel(flutterEngine.dartExecutor.binaryMessenger, \"com.example/battery\")\n  .setMethodCallHandler { call, result ->\n    if (call.method == \"getBatteryLevel\") result.success(batteryLevel())\n  }</code></pre>"
},
{
  "id": "gen-b4-09",
  "category": "flutter",
  "categoryName": "Flutter",
  "topic": "Architecture & Performance",
  "title": "Rebuild vs relayout vs repaint — Flutter's three-phase pipeline, and RepaintBoundary.",
  "difficulty": "Senior",
  "tags": [
    "Rendering Pipeline",
    "RepaintBoundary",
    "Performance",
    "Architecture & Performance"
  ],
  "question": "Flutter's frame pipeline has rebuild, layout, and paint as distinct phases. What triggers each, and what does RepaintBoundary actually buy you?",
  "answer": "<p>Rebuild (widget layer) runs on <code>setState</code>/provider changes and produces a new widget config; it does not by itself mean a relayout or repaint happened — Flutter still diffs, and an unchanged RenderObject can skip both. Layout runs when a RenderObject's constraints or intrinsic size might have changed; paint runs when its visual output might have changed but size/position didn't.</p>\n      <p><code>RepaintBoundary</code> isolates a subtree onto its own compositor layer, so repainting inside it doesn't force the parent (and siblings) to repaint too — the classic use case is an animation (a spinner, a progress indicator) nested inside an otherwise-static screen: without a boundary, every animation frame repaints the whole static screen around it too.</p>"
},
{
  "id": "gen-b4-10",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "State Management & Concurrency",
  "title": "@State vs @StateObject vs @ObservedObject vs @EnvironmentObject.",
  "difficulty": "Senior",
  "tags": [
    "State",
    "StateObject",
    "ObservableObject",
    "State Management & Concurrency"
  ],
  "question": "@State vs @StateObject vs @ObservedObject vs @EnvironmentObject — what's the actual difference, and what's the most common bug from mixing them up?",
  "answer": "<p><code>@State</code> — value-type local state, owned and stored by the View itself (SwiftUI persists it across that view's redraws). <code>@StateObject</code> — for a reference-type (<code>ObservableObject</code>) the View creates and owns; SwiftUI guarantees it's created exactly once for that view's identity, even across redraws. <code>@ObservedObject</code> — a reference to an <code>ObservableObject</code> owned by someone <em>else</em> (a parent) and just passed in.</p>\n      <p>The classic bug: using <code>@ObservedObject</code> where you should use <code>@StateObject</code> — if the containing view redraws (say, its parent's state changed) and the object was created inline as an <code>@ObservedObject</code>, it gets <em>recreated</em> on every redraw, silently losing its state. <code>@EnvironmentObject</code> is the same reference-sharing idea as <code>@ObservedObject</code>, injected implicitly down the view tree instead of passed explicitly.</p>"
},
{
  "id": "gen-b4-11",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "State Management & Concurrency",
  "title": "How does SwiftUI decide what to redraw — structural identity vs Identifiable.",
  "difficulty": "Senior",
  "tags": [
    "View Identity",
    "Diffing",
    "ForEach",
    "State Management & Concurrency"
  ],
  "question": "SwiftUI is declarative — how does it actually decide what needs to be redrawn when state changes, rather than just re-rendering everything?",
  "answer": "<p>SwiftUI diffs the view tree by <em>identity</em>, not by deep value comparison of everything: structural identity (same type, same position in the tree — the default for views without an explicit ID) versus explicit identity via <code>.id()</code> or <code>Identifiable</code> conformance in a <code>ForEach</code>. Where identity is preserved across a state change, SwiftUI reuses and updates the existing view's underlying storage/animation state in place; where identity changes (a different type, or a different explicit ID), it tears down the old view and creates a new one — losing any local `@State` in the process.</p>\n      <p>This is why an incorrectly-keyed <code>ForEach</code> (keyed by array index instead of a stable ID) causes rows to lose their local state or animate incorrectly when the list reorders — same bug class as a missing `key` in a Flutter list or a broken `equals`/`hashCode` in an Android `DiffUtil`.</p>"
},
{
  "id": "gen-b4-12",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "State Management & Concurrency",
  "title": "Combine vs Swift Concurrency — do you still need Combine?",
  "difficulty": "Mid",
  "tags": [
    "Combine",
    "Swift Concurrency",
    "async/await",
    "State Management & Concurrency"
  ],
  "question": "Combine vs async/await and AsyncSequence — do you still need Combine for new SwiftUI code?",
  "answer": "<p>Swift Concurrency (<code>async</code>/<code>await</code>, <code>AsyncSequence</code>, structured concurrency with <code>Task</code>) now covers what most app code used Combine for — a single async value, or a sequence of values over time — with simpler control flow and built-in cancellation propagation, closely mirroring Kotlin's <code>suspend</code> functions and Flow.</p>\n      <p>Combine still earns its place where you need its specific declarative operator set for combining/transforming multiple published streams (`combineLatest`, `debounce`, `removeDuplicates` chained together) — and for interop with older `ObservableObject`/`@Published` code that predates Swift Concurrency. For genuinely new code, default to async/await; reach for Combine deliberately, not by habit.</p>"
},
{
  "id": "gen-b4-13",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "State Management & Concurrency",
  "title": "@MainActor and Sendable — what data race problem do they actually solve?",
  "difficulty": "Senior",
  "tags": [
    "MainActor",
    "Sendable",
    "Data Races",
    "State Management & Concurrency"
  ],
  "question": "What problem do @MainActor and Sendable actually solve in Swift's concurrency model?",
  "answer": "<p><code>@MainActor</code> pins a type or function to the main thread and the compiler enforces it at compile time — calling a `@MainActor` method from a background context requires an explicit `await`, making a UI-thread violation a compile error instead of a runtime crash discovered in production. <code>Sendable</code> is the compiler's way of proving a type is safe to pass across concurrency domains (actors, tasks) — a class with mutable, unsynchronized state can't conform, and the compiler will reject passing it across an actor boundary.</p>\n      <p>Together they move the \"is this cross-thread access actually safe\" question from a runtime data race (Swift's equivalent of the JVM memory-visibility bug from the Android side) to a compile-time guarantee — a meaningfully stronger promise than what most other mobile concurrency models offer.</p>"
},
{
  "id": "gen-b4-14",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "SwiftUI's declarative diffing aside — where should business logic actually live?",
  "difficulty": "Mid",
  "tags": [
    "MVVM",
    "Architecture",
    "Architecture, Persistence & Testing"
  ],
  "question": "Given SwiftUI views are meant to be lightweight and redrawn constantly, where should business logic actually live?",
  "answer": "<p>Not in the View — a SwiftUI View struct is meant to be a cheap, disposable description of UI recomputed on every state change; putting real logic (validation, networking, formatting rules) there means it reruns on every redraw and is hard to unit test without instantiating a view. Push it into an `ObservableObject` view model (or a plain service the view model calls) — the same MVVM discipline as the Android side's \"ViewModel owns state and logic\" rule, just with `@Published` properties standing in for `StateFlow`.</p>"
},
{
  "id": "gen-b4-15",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "SwiftData vs Core Data — when do you pick which?",
  "difficulty": "Mid",
  "tags": [
    "SwiftData",
    "Core Data",
    "Persistence",
    "Architecture, Persistence & Testing"
  ],
  "question": "SwiftData vs Core Data — when would you still reach for Core Data on a new project?",
  "answer": "<p>SwiftData is the modern, Swift-native persistence layer — `@Model` macro-generated schema, much less boilerplate, built for Swift Concurrency from the start. Core Data is older, more verbose (`NSManagedObject` subclasses, `.xcdatamodeld` files), but has a much longer track record, broader platform/OS-version support, and considerably more mature tooling for complex migrations and CloudKit sync edge cases.</p>\n      <p>Pick Core Data when you need to support OS versions older than SwiftData's minimum, when the app has an existing large Core Data model you'd have to migrate off, or when you hit a SwiftData limitation around complex relationships/migrations that Core Data's more mature tooling handles better. For a genuinely new app targeting current OS versions, SwiftData is the sensible default.</p>"
},
{
  "id": "gen-b4-16",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "ARC and retain cycles — the classic closure capture bug.",
  "difficulty": "Mid",
  "tags": [
    "ARC",
    "Retain Cycle",
    "Memory Management",
    "Architecture, Persistence & Testing"
  ],
  "question": "ARC and retain cycles in Swift — walk through the classic closure-capture leak and the fix.",
  "answer": "<p>Swift uses Automatic Reference Counting — an object is deallocated when its retain count hits zero. A retain cycle happens when two objects hold strong references to each other (directly, or through a closure that captures `self` strongly while being stored as a property on that same object) — neither can ever reach zero, so neither is ever freed.</p>\n      <p>The classic version: a view model stores a closure (e.g. a completion handler passed to a network call) that captures `self` strongly, and that closure is itself retained by something the view model owns — `self` → closure → `self`. Fix: `[weak self]` in the capture list, and unwrap safely (`guard let self else { return }`) inside the closure body.</p>\n      <pre><code>class ProfileViewModel: ObservableObject {\n  func load() {\n    api.fetchProfile { [weak self] result in\n      guard let self else { return }\n      self.profile = result\n    }\n  }\n}</code></pre>"
},
{
  "id": "gen-b4-17",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "Keychain vs UserDefaults for an auth token — why does it matter?",
  "difficulty": "Mid",
  "tags": [
    "Keychain",
    "Security",
    "UserDefaults",
    "Architecture, Persistence & Testing"
  ],
  "question": "Why store an auth token in the Keychain instead of UserDefaults?",
  "answer": "<p><code>UserDefaults</code> is a plist file on disk with no encryption — readable on a jailbroken device, and included in unencrypted local backups unless explicitly excluded. Keychain entries are encrypted by the OS and tied to the device's hardware-backed security (Secure Enclave-derived protection classes), with fine-grained access control (e.g. `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` to prevent the value from restoring onto a different device from a backup).</p>\n      <p>Same underlying principle as the Android Keystore-vs-SharedPreferences answer — never put anything a security property depends on in plain, unencrypted app storage.</p>"
},
{
  "id": "gen-b4-18",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "@ViewBuilder and result builders — what do they let you write?",
  "difficulty": "Mid",
  "tags": [
    "ViewBuilder",
    "Result Builders",
    "DSL",
    "Architecture, Persistence & Testing"
  ],
  "question": "What is @ViewBuilder, and what does it actually let you write that plain Swift functions couldn't?",
  "answer": "<p><code>@ViewBuilder</code> is a Swift result builder — it transforms a block containing multiple statements (including `if`/`else`, loops via `ForEach`, `switch`) into a single composed value, here a `some View`, by wrapping the branches in the appropriate `_ConditionalContent`/`TupleView` types behind the scenes. Without it, a closure returning `some View` could only contain a single trailing expression — no `if` statement, no local variable followed by a view. It's the same mechanism (result builders) that powers SwiftUI's whole declarative view-building DSL, comparable in spirit to Kotlin's function-type-with-receiver DSL pattern.</p>"
},
{
  "id": "gen-b4-19",
  "category": "swiftui",
  "categoryName": "SwiftUI",
  "topic": "Architecture, Persistence & Testing",
  "title": "How do you actually test a SwiftUI view?",
  "difficulty": "Senior",
  "tags": [
    "Testing",
    "ViewModel",
    "Snapshot Testing",
    "Architecture, Persistence & Testing"
  ],
  "question": "SwiftUI views are structs recomputed constantly — how do you actually test one, and why is unit-testing the view itself usually the wrong approach?",
  "answer": "<p>Directly unit-testing a View struct's rendered output is fragile and mostly not how Apple's tooling is built to work — instead, push logic into the `ObservableObject` view model (per the earlier architecture answer) and unit-test that in complete isolation with no view involved at all: set inputs, call methods, assert on `@Published` properties. For the actual UI, use XCUITest for end-to-end flows, or snapshot testing (a screenshot diff against a golden image) to catch unintended visual regressions — neither of which needs to unit-test the View type directly.</p>"
},
{
  "id": "gen-b4-20",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Agile Delivery & Ceremonies",
  "title": "Agile vs Waterfall vs hybrid — how do you actually choose per project?",
  "difficulty": "Mid",
  "tags": [
    "Agile",
    "Waterfall",
    "Methodology",
    "Agile Delivery & Ceremonies"
  ],
  "question": "Agile vs Waterfall vs a hybrid approach — how do you actually decide which fits a given project, rather than defaulting to whatever your team already does?",
  "answer": "<p>Waterfall fits when requirements are genuinely stable and well-understood up front and the cost of changing course late is very high (regulated hardware, a fixed-date compliance deadline) — sequential phases with heavy up-front design reduce risk when the risk is \"we build the wrong thing due to churn,\" not \"requirements change.\" Agile/Scrum fits when requirements are expected to evolve as you learn (most product work) — short iterations let you course-correct cheaply instead of discovering a wrong assumption after a year of Waterfall planning.</p>\n      <p>Hybrid is common in practice: Waterfall-style fixed milestones and compliance gates at the program level, with Scrum sprints inside each phase for the actual engineering work. The interview-relevant point is choosing deliberately based on requirement volatility and cost-of-change, not methodology as identity.</p>"
},
{
  "id": "gen-b4-21",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Agile Delivery & Ceremonies",
  "title": "Scrum ceremonies — the four events, and the one teams skip that costs them the most.",
  "difficulty": "Mid",
  "tags": [
    "Scrum",
    "Ceremonies",
    "Retrospective",
    "Agile Delivery & Ceremonies"
  ],
  "question": "Walk through the four Scrum ceremonies and what each is actually for. Which one do teams most often skip, and what does that cost them?",
  "answer": "<p>Sprint Planning — the team commits to a scoped, achievable sprint goal and pulls in backlog items to match capacity. Daily Scrum — a short sync on progress toward the sprint goal and surfacing blockers early, not a status report to the manager. Sprint Review — demo working software to stakeholders and gather real feedback, closing the loop on whether what was built is actually right. Sprint Retrospective — the team inspects its own process and commits to one or two concrete improvements for next sprint.</p>\n      <p>Retrospective is the one teams skip first under deadline pressure — and it's the one whose absence compounds: without it, the same process friction (unclear tickets, unreliable CI, unclear Definition of Done) repeats every sprint indefinitely instead of getting fixed once.</p>"
},
{
  "id": "gen-b4-22",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Agile Delivery & Ceremonies",
  "title": "Story points vs hours — how do you actually estimate, and what is velocity for?",
  "difficulty": "Mid",
  "tags": [
    "Story Points",
    "Velocity",
    "Estimation",
    "Agile Delivery & Ceremonies"
  ],
  "question": "Story points vs hour-based estimates — why do most Scrum teams use story points, and what is velocity actually for?",
  "answer": "<p>Story points estimate relative effort/complexity/uncertainty, not calendar time — a 5-point story is roughly \"this is like the other 5-point stories we've done,\" deliberately decoupled from who's doing it or how long a specific day takes, which keeps estimates comparable sprint over sprint even as team composition shifts. Hour estimates tend to collapse into a false-precision commitment (\"I said 6 hours, why did it take 9\") that story points intentionally avoid.</p>\n      <p>Velocity — points completed per sprint, averaged over several sprints — is a planning input for that specific team's own forecasting, not a productivity metric to compare across teams (different teams calibrate points differently) and not a target to game by inflating point values.</p>"
},
{
  "id": "gen-b4-23",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Agile Delivery & Ceremonies",
  "title": "Definition of Ready vs Definition of Done — why do both matter?",
  "difficulty": "Mid",
  "tags": [
    "Definition of Done",
    "Definition of Ready",
    "Agile Delivery & Ceremonies"
  ],
  "question": "Definition of Ready vs Definition of Done — what's the difference, and why does a team need both?",
  "answer": "<p>Definition of Ready is the bar a backlog item must clear <em>before</em> it enters a sprint — clear acceptance criteria, no unresolved external dependency, small enough to fit in a sprint. Definition of Done is the bar work must clear <em>before</em> it counts as complete — code reviewed, tests passing, deployed to staging, whatever the team has actually agreed on, not just \"the code compiles.\"</p>\n      <p>Skipping Ready produces sprints full of half-understood work that balloons mid-sprint; skipping (or having a vague) Done produces \"done\" work that's actually 80% done, silently pushing real completion — and the discovery of what's missing — into the next sprint, which is how sprint after sprint quietly slips without anyone being able to point at why.</p>"
},
{
  "id": "gen-b4-24",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "How do you manage scope creep without becoming the team's 'no' person?",
  "difficulty": "Senior",
  "tags": [
    "Scope Creep",
    "Change Control",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "How do you actually manage scope creep on a project without becoming the person who just says no to every stakeholder request?",
  "answer": "<p>Scope creep usually isn't bad requests, it's unmanaged tradeoffs — the fix is making the tradeoff visible rather than blocking the request. A formal but lightweight change-control step: log the request, size it, and show the specific cost against the current commitment (\"yes, and here's what moves out of this sprint/release to make room\") — let the Product Owner or sponsor make the prioritization call with the real cost in front of them, rather than the PM either silently absorbing it (burning the team out) or unilaterally refusing it (looking obstructive).</p>\n      <p>The interview-relevant skill being tested here is stakeholder communication and prioritization facilitation, not gatekeeping.</p>"
},
{
  "id": "gen-b4-25",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "Burndown vs burnup charts — what does each actually tell you?",
  "difficulty": "Mid",
  "tags": [
    "Burndown",
    "Burnup",
    "Metrics",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "Burndown vs burnup charts — what does each actually tell you, and why do many PMs prefer burnup for stakeholder conversations?",
  "answer": "<p>A burndown chart shows remaining work trending toward zero — simple, but it conflates two different signals into one line: is the team completing work slower than planned, or did scope just get added mid-sprint? Both look identical on a burndown — the line just doesn't drop as expected.</p>\n      <p>A burnup chart plots two lines — work completed (rising) and total scope (which can itself rise if items are added) — so a stakeholder can see immediately whether a stalled burndown-equivalent is a velocity problem or a scope problem. That separation is exactly why burnup tends to produce more productive stakeholder conversations than a burndown chart alone.</p>"
},
{
  "id": "gen-b4-26",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "How do you get technical debt prioritized against new features?",
  "difficulty": "Senior",
  "tags": [
    "Technical Debt",
    "Prioritization",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "Technical debt competes with new features for the same sprint capacity — how do you actually get it prioritized, not just complained about?",
  "answer": "<p>Translate it into the language the roadmap already speaks — cost and risk, not \"the code is messy.\" Attach a concrete consequence to each debt item: this coupling adds roughly two extra days to every feature that touches this module, or this outdated dependency blocks the security patch the compliance team is asking about. A vague \"we should refactor this\" competes badly against a named feature with a clear business value; a debt item with a measured cost and an owner competes on equal footing.</p>\n      <p>Practically: keep a visible technical debt backlog alongside the feature backlog, and negotiate a standing capacity allocation (e.g. 10–20% of each sprint) rather than re-litigating it sprint by sprint — a recurring line item is much harder to zero out under pressure than a one-off ask.</p>"
},
{
  "id": "gen-b4-27",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "How do you handle conflicting priorities from multiple stakeholders?",
  "difficulty": "Senior",
  "tags": [
    "Stakeholder Management",
    "Prioritization",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "Two stakeholders each insist their feature is the top priority for the same sprint. How do you actually resolve that?",
  "answer": "<p>First, get the conflict onto shared, objective ground — a prioritization framework both stakeholders already trust (RICE, or whatever the org uses, matching the earlier RICE/MoSCoW/Kano material) rather than a negotiation based on who's louder or more senior. Surface the actual tradeoff explicitly: \"shipping A this sprint means B slips to next sprint — here's the impact of each,\" and get the decision made by whoever genuinely owns the prioritization call (a single Product Owner, ideally) rather than the PM arbitrating between two peers with no formal authority to.</p>\n      <p>The failure mode interviewers are listening for is a PM who tries to satisfy both by quietly overcommitting the team — that always ends worse than an uncomfortable but explicit tradeoff conversation up front.</p>"
},
{
  "id": "gen-b4-28",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "A team member is consistently underdelivering — what do you actually do?",
  "difficulty": "Senior",
  "tags": [
    "Team Management",
    "Performance",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "A team member is consistently missing sprint commitments. What do you actually do, step by step?",
  "answer": "<p>First, find out why before assuming it's a performance problem — it's often an estimation problem (their stories are systematically under-sized), a blocker they're not surfacing (ask privately, not in the daily standup), or a scope/dependency issue outside their control. A 1:1 conversation, not a public callout in the retro, is where this starts.</p>\n      <p>If it genuinely is a skill or motivation issue after ruling those out, that becomes a people-management conversation (pairing, mentoring, or escalating to their manager if you're not it) — not something to solve by silently re-assigning their tickets, which hides the problem from the person who needs to know about it and burdens the rest of the team.</p>"
},
{
  "id": "gen-b4-29",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Stakeholders, Risk & Metrics",
  "title": "Risk register — mitigation vs contingency, and how do you keep it from being theater?",
  "difficulty": "Mid",
  "tags": [
    "Risk Management",
    "Risk Register",
    "Stakeholders, Risk & Metrics"
  ],
  "question": "What's a risk register actually for, mitigation vs contingency planning, and how do you keep it a living tool instead of a document nobody reads after kickoff?",
  "answer": "<p>A risk register lists identified risks with likelihood, impact, an owner, and a plan — split into mitigation (reduce the probability or impact <em>before</em> it happens — e.g. adding a spike to de-risk an unfamiliar API early) and contingency (what you actually do <em>if</em> it happens anyway — e.g. a fallback vendor if the primary one misses a delivery date).</p>\n      <p>It stays theater if it's only reviewed at kickoff. Keep it alive by reviewing it briefly on a fixed cadence (e.g. at sprint planning or a biweekly checkpoint), retiring risks that no longer apply, and treating \"we identified this risk three sprints ago and did nothing\" as itself a process failure worth raising in retro.</p>"
},
{
  "id": "gen-b4-30",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "What does @SpringBootApplication actually bundle?",
  "difficulty": "Mid",
  "tags": [
    "Spring Boot",
    "Auto-Configuration",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "What does the single @SpringBootApplication annotation actually bundle, and what does each part do?",
  "answer": "<p>It's a meta-annotation combining three: <code>@Configuration</code> (this class can declare `@Bean` methods), <code>@ComponentScan</code> (scan this package and below for `@Component`/`@Service`/`@Repository`/`@Controller`), and <code>@EnableAutoConfiguration</code> — the one doing the \"magic\": it triggers Spring Boot to inspect the classpath and conditionally register a large set of pre-built configuration classes (a `DataSource` bean if a JDBC driver is present, an embedded Tomcat if `spring-boot-starter-web` is present, and so on).</p>"
},
{
  "id": "gen-b4-31",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "How does auto-configuration decide what to configure?",
  "difficulty": "Senior",
  "tags": [
    "Auto-Configuration",
    "Conditional Beans",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "How does Spring Boot's auto-configuration actually decide what to configure — what's happening when adding one dependency to the classpath changes app behavior with zero config?",
  "answer": "<p>Each auto-configuration class is guarded by conditional annotations — `@ConditionalOnClass` (only apply if a given class is on the classpath), `@ConditionalOnMissingBean` (only apply if the developer hasn't already defined their own bean of that type — auto-config always yields to an explicit bean), `@ConditionalOnProperty`, and others. Spring Boot loads the candidate list from `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (the old `spring.factories` mechanism pre-Boot 2.7), evaluates every condition, and only the ones that pass actually register beans.</p>\n      <p>That's the whole mechanism behind \"add the JPA starter, get a `DataSource`, an `EntityManagerFactory`, and Hibernate wired up with zero XML\" — it's conditional bean registration, not literal magic, and `@ConditionalOnMissingBean` is exactly why your own `@Bean` always wins if you define one.</p>"
},
{
  "id": "gen-b4-32",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "@Component vs @Service vs @Repository vs @Bean — practical differences.",
  "difficulty": "Mid",
  "tags": [
    "Component",
    "Service",
    "Repository",
    "Bean",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "@Component vs @Service vs @Repository vs @Bean — they're all beans, so what's the practical difference?",
  "answer": "<p>Functionally, `@Component`, `@Service`, and `@Repository` are the same mechanism (component-scanned, auto-registered) with different semantic labels for readability and tooling — but `@Repository` isn't purely cosmetic: it also enables Spring's persistence exception translation, converting a vendor-specific database exception into a consistent `DataAccessException` hierarchy.</p>\n      <p>`@Bean` is different in kind, not just label — it's a method inside an `@Configuration` class, used when you need to construct and configure a bean imperatively (a third-party class you don't own and can't annotate, or a bean whose construction genuinely needs conditional logic) rather than annotating a class you wrote yourself.</p>"
},
{
  "id": "gen-b4-33",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "Constructor injection vs field injection — why is constructor preferred?",
  "difficulty": "Mid",
  "tags": [
    "Dependency Injection",
    "Constructor Injection",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "Constructor injection vs field injection (@Autowired on a field) — why is constructor injection consistently recommended?",
  "answer": "<p>Constructor injection makes dependencies explicit and immutable — the class literally cannot be constructed without them, which means a missing dependency is a compile error (or an obvious constructor-call failure) rather than a `NullPointerException` discovered at runtime when the field is first used. It also makes plain unit testing trivial — `new MyService(mockDep)` — with no Spring container or reflection needed, and it surfaces circular dependencies immediately at startup (two constructors needing each other can't be satisfied) instead of Spring quietly resolving them via a proxy that field injection allows.</p>\n      <p>Field injection compiles fine with a genuinely incomplete object, requires reflection to test, and hides circular dependencies rather than failing fast on them.</p>"
},
{
  "id": "gen-b4-34",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "@Transactional pitfalls — self-invocation and the public-method requirement.",
  "difficulty": "Senior",
  "tags": [
    "Transactional",
    "Proxy",
    "Self-Invocation",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "@Transactional creates a proxy around the bean. What's the classic self-invocation bug, and why must the method be public?",
  "answer": "<p>`@Transactional` works by wrapping the bean in a proxy (JDK dynamic proxy for an interface, or a CGLIB subclass for a concrete class) that starts/commits/rolls back the transaction around the call — but that proxy only intercepts calls that come <em>through it</em>, i.e. calls from outside the bean. Calling a `@Transactional` method from another method on the <em>same</em> bean (`this.otherMethod()`) bypasses the proxy entirely — the annotation is silently ignored, no transaction boundary is created, and it's a notoriously easy bug to ship undetected because the code compiles and mostly works.</p>\n      <p>The method must be public for the same structural reason: a CGLIB subclass proxy overrides methods to add behavior, and it can only override what's visible to override — a private or package-private method is invisible to the subclass proxy, so the transactional wrapping silently never applies.</p>"
},
{
  "id": "gen-b4-35",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Core, Beans & Auto-Configuration",
  "title": "Bean scopes — singleton, prototype, request, session — and thread-safety implications.",
  "difficulty": "Senior",
  "tags": [
    "Bean Scopes",
    "Thread Safety",
    "Core, Beans & Auto-Configuration"
  ],
  "question": "Spring bean scopes — singleton, prototype, request, session — and what are the actual thread-safety implications of each?",
  "answer": "<p>Singleton (the default) — one instance for the whole application context, shared across every thread handling every request; it must be stateless or use only thread-safe state, since concurrent requests genuinely share the same instance. Prototype — a new instance per injection point/lookup; inherently free of the cross-request sharing problem, at the cost of losing Spring-managed lifecycle callbacks after creation. Request/session scopes — one instance per HTTP request or per HTTP session respectively, useful for holding request-scoped state without manually threading it through every method signature, but they need a scoped proxy to be injectable into a singleton bean at all (since the singleton is created once, long before any particular request exists).</p>"
},
{
  "id": "gen-b4-36",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Data, Transactions & Production",
  "title": "The N+1 query problem in JPA — how it happens, and the fixes.",
  "difficulty": "Senior",
  "tags": [
    "N+1",
    "JPA",
    "Hibernate",
    "Data, Transactions & Production"
  ],
  "question": "The N+1 query problem in JPA/Hibernate — how does it actually happen, and what are the fixes?",
  "answer": "<p>Fetching a list of N parent entities lazily-loads each parent's association individually the first time it's accessed — one query for the N parents, then one additional query per parent to fetch its association, N+1 queries total instead of the two (or one) it should take. It's easy to miss in development with a small dataset and painful in production once N is real.</p>\n      <p>Fixes: a `JOIN FETCH` in the JPQL query to pull the association in the same query, `@EntityGraph` to declare which associations to eager-fetch for a specific query without changing the entity's default fetch type globally, or batch fetching (`@BatchSize`/`hibernate.default_batch_fetch_size`) which turns N individual queries into a handful of `IN (...)` queries instead.</p>\n      <pre><code>// N+1: one query per order to fetch its items\nList<Order> orders = orderRepo.findAll();\norders.forEach(o -> o.getItems().size()); // triggers N extra SELECTs\n\n// fixed: one query total\n@Query(\"SELECT o FROM Order o JOIN FETCH o.items\")\nList<Order> findAllWithItems();</code></pre>"
},
{
  "id": "gen-b4-37",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Data, Transactions & Production",
  "title": "Spring profiles — how do you manage dev/staging/prod configuration?",
  "difficulty": "Mid",
  "tags": [
    "Spring Profiles",
    "Configuration",
    "Data, Transactions & Production"
  ],
  "question": "Spring profiles — how do you actually manage dev/staging/prod configuration differences cleanly?",
  "answer": "<p><code>application.yml</code> plus profile-specific overrides (`application-dev.yml`, `application-prod.yml`), activated via `spring.profiles.active` (an environment variable or a `-D` flag at launch, never hardcoded into the jar). `@Profile(\"prod\")` on a `@Configuration`/`@Bean` conditionally registers beans per environment — a real payment gateway client in prod, a stub/sandbox client in dev.</p>\n      <p>The discipline worth stating out loud: secrets (DB passwords, API keys) don't belong in any `application-*.yml` committed to source control regardless of profile — they come from environment variables or a secrets manager injected at deploy time, with the YAML files only holding non-secret structural config.</p>"
},
{
  "id": "gen-b4-38",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Data, Transactions & Production",
  "title": "Spring Boot Actuator — what does it actually give you in production?",
  "difficulty": "Mid",
  "tags": [
    "Actuator",
    "Observability",
    "Production",
    "Data, Transactions & Production"
  ],
  "question": "What does Spring Boot Actuator actually give you in production, beyond a health-check endpoint?",
  "answer": "<p>A set of production-ready operational endpoints beyond just `/health`: `/metrics` (JVM memory, GC, HTTP request latencies, exposed in a format Micrometer can ship to Prometheus/Datadog), `/info` (build/version metadata for \"what's actually deployed right now\"), `/loggers` (change log levels at runtime with no redeploy, invaluable for debugging a production issue live), and `/threaddump`/`/heapdump` for diagnosing a stuck or leaking JVM. It's the difference between \"the app returns 200\" and having real operational visibility — and every one of these endpoints needs its own access control in production, since `/heapdump` in particular can leak sensitive data if left open.</p>"
},
{
  "id": "gen-b4-39",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Data, Transactions & Production",
  "title": "GraalVM native image / AOT — why does it matter, and what breaks?",
  "difficulty": "Senior",
  "tags": [
    "GraalVM",
    "Native Image",
    "AOT",
    "Data, Transactions & Production"
  ],
  "question": "GraalVM native image and Spring's AOT processing — why does it matter, and what commonly breaks when you try it?",
  "answer": "<p>A native image compiles the app ahead-of-time into a standalone executable with no JVM startup cost — startup drops from seconds to milliseconds and memory footprint shrinks significantly, which matters a lot for serverless/scale-to-zero workloads where JVM cold-start was the dominant cost. Spring's AOT processing precomputes the bean definitions and proxy classes that would normally be figured out via classpath scanning and reflection at runtime, since native-image compilation needs to know ahead of time what reflection/proxying will happen — it can't discover it dynamically at runtime the way the JVM can.</p>\n      <p>What breaks: anything relying on genuinely dynamic reflection the AOT step can't predict (some third-party libraries, dynamic proxies constructed from runtime-only information) needs explicit reflection hints or simply isn't compatible yet — it's a real constraint, not a drop-in switch, which is exactly why mentioning \"AOT/native image\" unprompted signals someone who's actually run into this in practice.</p>"
},
{
  "id": "gen-b4-40",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Event Loop & Async Patterns",
  "title": "The event loop phases — walk through them.",
  "difficulty": "Mid",
  "tags": [
    "Event Loop",
    "Timers",
    "Event Loop & Async Patterns"
  ],
  "question": "Walk through the Node.js event loop's phases, in order, and what runs in each.",
  "answer": "<p>Timers — callbacks scheduled by `setTimeout`/`setInterval` whose threshold has elapsed. Pending callbacks — certain I/O callbacks deferred from the previous cycle. Poll — retrieves new I/O events and executes their callbacks; this is where the loop can block waiting for I/O if nothing else is scheduled. Check — `setImmediate` callbacks, which run right after poll. Close callbacks — `close` event handlers (e.g. a socket's). Microtasks (Promise callbacks, `process.nextTick`) aren't a phase of the macro loop at all — they drain completely between every phase transition, which is why they can starve the event loop if you chain them unboundedly.</p>"
},
{
  "id": "gen-b4-41",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Event Loop & Async Patterns",
  "title": "Node is 'single-threaded' — but not actually. Where does the thread pool come in?",
  "difficulty": "Senior",
  "tags": [
    "libuv",
    "Thread Pool",
    "Concurrency",
    "Event Loop & Async Patterns"
  ],
  "question": "Node.js is famously 'single-threaded' — but that's not really true. Where does libuv's thread pool actually come in?",
  "answer": "<p>JavaScript execution on the main thread is single-threaded — one call stack, no shared-memory data races in your own JS code. But I/O — file system operations, DNS lookups, some crypto operations, compression — is offloaded to libuv's thread pool (default size 4) under the hood, which is exactly what makes those operations non-blocking from JavaScript's point of view: the main thread issues the operation, keeps running other JS, and gets a callback (or resolved Promise) when the thread pool finishes.</p>\n      <p>This is also a real, easy-to-miss scaling limit: the thread pool size is fixed by default, so a burst of concurrent file reads doesn't scale past that pool without explicitly tuning `UV_THREADPOOL_SIZE` — it's not infinite, unbounded concurrency the way people sometimes assume \"non-blocking\" implies.</p>"
},
{
  "id": "gen-b4-42",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Event Loop & Async Patterns",
  "title": "process.nextTick vs setImmediate vs setTimeout(fn, 0) — ordering.",
  "difficulty": "Senior",
  "tags": [
    "process.nextTick",
    "setImmediate",
    "Event Loop Ordering",
    "Event Loop & Async Patterns"
  ],
  "question": "process.nextTick vs setImmediate vs setTimeout(fn, 0) — what's the actual execution order, and why does it matter?",
  "answer": "<p>`process.nextTick` queues a callback that runs before the event loop continues to the next phase at all — before even Promise microtasks in older Node versions, and it drains completely (including anything it itself schedules) before the loop proceeds, which is exactly why recursive `nextTick` calls can starve I/O entirely. `setImmediate` runs in the check phase, after poll. `setTimeout(fn, 0)` runs in the timers phase — its ordering relative to `setImmediate` is actually not guaranteed when called from the main module (it depends on process startup timing), but inside an I/O callback, `setImmediate` is always guaranteed to run before a `setTimeout(fn, 0)` scheduled at the same point, since check comes right after poll where the I/O callback fired.</p>"
},
{
  "id": "gen-b4-43",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Event Loop & Async Patterns",
  "title": "Callback hell to async/await — what is async/await actually sugar for?",
  "difficulty": "Mid",
  "tags": [
    "async/await",
    "Promises",
    "Event Loop & Async Patterns"
  ],
  "question": "Callback hell → Promises → async/await — what is async/await actually syntactic sugar for under the hood?",
  "answer": "<p>`async`/`await` desugars to Promise chaining and generator-like suspension — an `async function` always returns a Promise, and `await` suspends that function's execution (without blocking the event loop — other code keeps running) until the awaited Promise settles, then resumes with the resolved value or throws the rejection as a catchable exception. It's the same underlying idea as Kotlin's suspend-function CPS transform: a compiler/runtime-level rewrite that lets you write sequential-looking code over what's actually an asynchronous, callback-driven continuation underneath.</p>"
},
{
  "id": "gen-b4-44",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "Streams — the four types, and why stream instead of loading the whole file.",
  "difficulty": "Mid",
  "tags": [
    "Streams",
    "Memory",
    "Modules, Streams & Scaling"
  ],
  "question": "Node streams — the four types, and why would you stream a large file instead of just reading it all into memory?",
  "answer": "<p>Readable (a source you read from — a file, an incoming HTTP request body), Writable (a sink you write to — an outgoing HTTP response, a file), Duplex (both, independently — a TCP socket), Transform (a duplex stream that modifies data as it passes through — gzip compression, a CSV parser).</p>\n      <p>Streaming a large file processes it in chunks with roughly constant memory usage regardless of file size, versus `readFileSync`-style loading the whole thing into a Buffer first, which scales memory linearly with file size and can OOM a process on a genuinely large file (or just a burst of concurrent requests each holding a full file in memory). Piping (`readable.pipe(writable)`) also gets backpressure handling for free — the next question.</p>"
},
{
  "id": "gen-b4-45",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "Backpressure in streams — what happens if you ignore it?",
  "difficulty": "Senior",
  "tags": [
    "Backpressure",
    "Streams",
    "Modules, Streams & Scaling"
  ],
  "question": "What is backpressure in Node streams, and what actually goes wrong if you ignore it?",
  "answer": "<p>Backpressure is the signal that a writable destination can't accept data as fast as a readable source is producing it. `stream.write()` returns `false` when its internal buffer has exceeded its `highWaterMark`, signaling \"stop pushing data at me until I emit `drain`.\" Ignoring that return value and continuing to write anyway (a common bug: manually piping data in a loop without checking the return value, instead of using `.pipe()` which handles this automatically) means the writable's internal buffer grows unboundedly — a slow destination (a slow disk, a slow downstream HTTP client) combined with a fast source becomes an unbounded memory buffer, and eventually a crash.</p>"
},
{
  "id": "gen-b4-46",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "Worker threads vs child_process vs cluster — three ways to use multiple cores.",
  "difficulty": "Senior",
  "tags": [
    "Worker Threads",
    "child_process",
    "cluster",
    "Modules, Streams & Scaling"
  ],
  "question": "Worker threads vs child_process vs the cluster module — three different ways to use more than one core in Node. When is each the right tool?",
  "answer": "<p>Worker threads — genuine parallel JS execution within the same process, with `SharedArrayBuffer` available for efficient shared-memory communication; right for CPU-bound work (image processing, a heavy computation) that would otherwise block the event loop, without the overhead of spawning a whole separate process. `child_process` — a completely separate OS process (no shared memory, communicate via serialized IPC or stdio) — right for running another program entirely (a CLI tool, a different runtime) or for genuine process-level isolation where a crash in the child shouldn't affect the parent. `cluster` — spawns multiple worker <em>processes</em> that share a listening port, purpose-built specifically for scaling an HTTP server across CPU cores by load-balancing incoming connections across workers, not a general parallelism primitive.</p>"
},
{
  "id": "gen-b4-47",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "CommonJS vs ES Modules — why does interop still hurt?",
  "difficulty": "Senior",
  "tags": [
    "CommonJS",
    "ES Modules",
    "Interop",
    "Modules, Streams & Scaling"
  ],
  "question": "CommonJS (require) vs ES Modules (import) — what's the practical difference, and why is interop between them still painful?",
  "answer": "<p>CommonJS resolves and loads modules synchronously at `require()` time, and `module.exports` is a plain mutable object — you can reassign it dynamically, even conditionally. ES Modules are statically analyzable (imports/exports are determined at parse time, before any code runs), which is what enables tree-shaking and is required by the spec — but that same static nature is exactly what makes interop with CommonJS's fully dynamic export object awkward: a CJS module's `module.exports = someFunction` doesn't map cleanly onto ESM's static named-export model, which is why `import defaultExport from 'cjs-module'` sometimes doesn't give you what you expect and Node has specific (and occasionally surprising) interop rules for guessing named exports from a CJS module.</p>"
},
{
  "id": "gen-b4-48",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "Common causes of a memory leak in a long-running Node service.",
  "difficulty": "Senior",
  "tags": [
    "Memory Leak",
    "Debugging",
    "Modules, Streams & Scaling"
  ],
  "question": "What are the most common causes of a memory leak in a long-running Node.js service, and how would you actually find one?",
  "answer": "<p>Most common causes: an unbounded in-memory cache (a Map that only ever grows, with no eviction), event listeners registered repeatedly without ever being removed (each request adding a listener to a shared long-lived emitter), and closures that capture large objects unintentionally and get stored somewhere long-lived (a callback registered on a singleton, capturing a per-request object in its closure).</p>\n      <p>To find one: take heap snapshots (via `--inspect` and Chrome DevTools, or `node --heapsnapshot-signal`) at two points in time under load and diff them — a genuinely growing count of a specific object type between snapshots, with no corresponding drop, is the leak signature; correlate it back to whatever code path keeps creating (and never releasing a reference to) that object type.</p>"
},
{
  "id": "gen-b4-49",
  "category": "nodejs",
  "categoryName": "Node.js",
  "topic": "Modules, Streams & Scaling",
  "title": "How does Express middleware actually work — the next() chain.",
  "difficulty": "Mid",
  "tags": [
    "Express",
    "Middleware",
    "Modules, Streams & Scaling"
  ],
  "question": "How does Express middleware actually work — what is next() doing, and what happens if you forget to call it?",
  "answer": "<p>Each middleware function receives `(req, res, next)` and Express runs them in registration order for a matching route — `next()` is the explicit hand-off that tells Express \"I'm done, continue to the next middleware in the chain\" (or, for `next(err)`, \"skip straight to error-handling middleware\"). It's an explicit chain-of-responsibility, not automatic — nothing forces a middleware to call it.</p>\n      <p>Forget to call `next()` (and don't send a response yourself) and the request just hangs — no error, no response, the client eventually times out — which is exactly why a middleware with a conditional early return needs to make sure every code path either calls `next()` or sends a response, not just the happy path.</p>\n      <pre><code>app.use((req, res, next) => {\n  if (!req.headers.authorization) {\n    return res.status(401).send(\"Unauthorized\"); // must respond OR call next — never neither\n  }\n  next();\n});</code></pre>"
},
{
  "id": "gen-b4-50",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Design a URL shortener — walk through it.",
  "difficulty": "Senior",
  "tags": [
    "System Design",
    "URL Shortener",
    "System Design & Scalability"
  ],
  "question": "Design a URL shortener (like bit.ly) — walk through the core design decisions.",
  "answer": "<p>Core write path: given a long URL, generate a short unique key (base62-encode an auto-incrementing ID, or a hash of the URL with collision handling) and store `{shortKey: longUrl}`. Core read path: a GET to the short URL looks up the mapping and issues an HTTP redirect (301 for a permanent mapping if you want browsers/CDNs to cache it, 302 if you need every hit to actually reach your server — e.g. for click analytics).</p>\n      <p>Scaling considerations worth naming unprompted: reads vastly outnumber writes for this workload, so a cache (Redis) in front of the lookup, keyed by short code, absorbs almost all read traffic; the datastore itself can be a simple key-value store since there's no relational structure to the core mapping; and ID generation needs to not collide across multiple write servers — a centralized counter service, pre-allocated ID ranges per server, or a Snowflake-style distributed ID scheme are the standard answers, each with a different consistency/availability tradeoff.</p>"
},
{
  "id": "gen-b4-51",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "How do you scale a web app horizontally, and the sticky-session problem.",
  "difficulty": "Mid",
  "tags": [
    "Horizontal Scaling",
    "Sticky Sessions",
    "Load Balancing",
    "System Design & Scalability"
  ],
  "question": "How do you actually scale a web app horizontally, and what's the sticky-session problem it runs into?",
  "answer": "<p>Horizontal scaling means running many identical instances of the service behind a load balancer instead of one bigger machine — which only works cleanly if each instance is stateless, i.e. any instance can handle any request with no dependency on which instance handled the previous request from that user.</p>\n      <p>The classic violation: storing session state in server memory (an in-process session map). That forces \"sticky sessions\" — the load balancer must route the same user's subsequent requests back to the same instance — which undermines even load distribution and means losing that one instance (a deploy, a crash) drops every session pinned to it. Fix: externalize session state to a shared store (Redis, a database) all instances can read, or go fully stateless with a signed token (JWT) carrying the session data itself, so no server-side session store is needed at all.</p>"
},
{
  "id": "gen-b4-52",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Caching strategy — CDN vs Redis vs in-memory, and why invalidation is the hard part.",
  "difficulty": "Senior",
  "tags": [
    "Caching",
    "CDN",
    "Redis",
    "Cache Invalidation",
    "System Design & Scalability"
  ],
  "question": "CDN vs Redis vs in-process in-memory caching — where does each fit, and why is cache invalidation 'the hard problem' in caching?",
  "answer": "<p>CDN — caches static assets (and sometimes full page responses) at edge locations close to the user; right for content that's the same for every user and changes infrequently. Redis (or similar) — a shared cache all your app instances can read/write, right for data that's expensive to compute/fetch but needs to be consistent across a horizontally-scaled fleet (a computed dashboard, a session store). In-process memory — fastest of all, but private to one instance, so it's only safe for data that's fine to be briefly inconsistent across instances, or naturally instance-local.</p>\n      <p>Invalidation is hard because there are only two easy answers and both have sharp edges: time-based expiry (simple, but serves stale data for up to the TTL window) and explicit invalidation on write (fresher, but now every code path that mutates the underlying data must remember to invalidate every cache key derived from it — miss one, and you have a subtle, hard-to-reproduce stale-data bug that only shows up in production under real write traffic).</p>"
},
{
  "id": "gen-b4-53",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Rate limiting — token bucket vs sliding window, and why it matters.",
  "difficulty": "Mid",
  "tags": [
    "Rate Limiting",
    "Token Bucket",
    "System Design & Scalability"
  ],
  "question": "Rate limiting — token bucket vs sliding window, and why does an API actually need it beyond just 'stopping abuse'?",
  "answer": "<p>Token bucket — a bucket refills at a fixed rate up to a max capacity; each request consumes a token, and requests are rejected (or queued) once the bucket is empty — it naturally allows short bursts up to the bucket size while still capping average rate. Sliding window — counts requests in a moving time window (either a true sliding log, or the cheaper sliding-window-counter approximation blending the current and previous fixed windows) — smoother and harder to game at window boundaries than a naive fixed-window counter, at somewhat more implementation/storage cost.</p>\n      <p>Beyond abuse prevention: rate limiting is also load-shedding — it protects the service's own stability under a traffic spike (including a legitimate one, not just an attacker), and for a paid API it's the mechanism that actually enforces pricing tiers.</p>"
},
{
  "id": "gen-b4-54",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "JWT — how it actually works, and the classic storage mistake.",
  "difficulty": "Senior",
  "tags": [
    "JWT",
    "Authentication",
    "XSS",
    "Security & API Design"
  ],
  "question": "JWT-based authentication — how does it actually work end to end, and what's the classic client-side storage mistake?",
  "answer": "<p>The server signs a token (header.payload.signature, HMAC or RSA/ECDSA) containing claims (user ID, roles, expiry) after successful login; the client sends it back on every subsequent request (typically an `Authorization: Bearer` header); the server verifies the signature and expiry — no database lookup or server-side session needed to validate it, which is the whole appeal for stateless, horizontally-scaled services.</p>\n      <p>The classic mistake: storing the JWT in `localStorage`, which is readable by any JavaScript running on the page — meaning a single XSS vulnerability anywhere in the app hands the attacker the token directly. An `httpOnly`, `Secure`, `SameSite` cookie is inaccessible to JavaScript entirely, closing that specific attack path (at the cost of needing CSRF protection instead, since cookies are sent automatically). Also worth naming: JWTs can't be revoked before their expiry without extra machinery (a server-side blocklist, which reintroduces the statefulness you were trying to avoid) — which is why short-lived access tokens plus a longer-lived, rotatable refresh token is the standard pattern, not one long-lived JWT.</p>"
},
{
  "id": "gen-b4-55",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "Session-based auth vs token-based (JWT) auth — the real tradeoffs.",
  "difficulty": "Senior",
  "tags": [
    "JWT",
    "Sessions",
    "Authentication",
    "Security & API Design"
  ],
  "question": "Session-based auth vs token-based (JWT) auth — what are the actual tradeoffs, not just 'JWT is stateless'?",
  "answer": "<p>Session-based: the server holds the session state (in memory, or shared via Redis) and the client just holds an opaque session ID cookie. Trivially revocable (delete the session server-side, instantly logged out everywhere) and small on the wire, but requires that shared server-side store to scale horizontally, and every request costs a lookup.</p>\n      <p>JWT: self-contained, no server-side lookup needed to validate — cheap and horizontally-scaling-friendly, but not trivially revocable (the token remains valid until it expires, no matter what the server \"decides\" after issuing it, unless you add a blocklist — which brings back the exact state you were avoiding) and larger on the wire since the claims travel with every request. Neither is universally \"better\" — it's a genuine tradeoff between easy revocation and full statelessness, and the right answer often ends up hybrid (short-lived JWT access token + a server-tracked, revocable refresh token).</p>"
},
{
  "id": "gen-b4-56",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "Pick three OWASP Top 10 items and explain the actual attack and defense.",
  "difficulty": "Senior",
  "tags": [
    "OWASP",
    "SQL Injection",
    "XSS",
    "CSRF",
    "Security & API Design"
  ],
  "question": "Pick three OWASP Top 10 vulnerabilities and explain, concretely, the actual attack and the actual code-level defense — not just the name.",
  "answer": "<p><strong>SQL Injection:</strong> attacker-controlled input is concatenated directly into a SQL string (`\"SELECT * FROM users WHERE name = '\" + input + \"'\"`), letting the attacker inject SQL that changes the query's meaning entirely. Defense: parameterized queries/prepared statements — the input is bound as a literal value, never interpreted as SQL syntax, no matter what it contains.</p>\n      <p><strong>XSS (Cross-Site Scripting):</strong> attacker-controlled input is rendered into the page as raw HTML/JS instead of text, letting a script the attacker chose run in another user's browser session (stealing cookies/tokens, or acting as that user). Defense: output encoding by context (HTML-escape for HTML body content, JS-string-escape inside a script context) applied at render time, and a Content-Security-Policy header as defense in depth.</p>\n      <p><strong>CSRF (Cross-Site Request Forgery):</strong> a malicious site causes the victim's browser to submit a request to your site using the victim's already-authenticated cookies, without the victim intending it. Defense: a CSRF token embedded in forms/requests that an attacker's page can't read or guess (same-origin policy blocks reading it cross-site), or `SameSite=Strict/Lax` cookies, which stop the browser from attaching the cookie to a cross-site request in the first place.</p>"
},
{
  "id": "gen-b4-57",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "CORS — what does it actually protect against?",
  "difficulty": "Senior",
  "tags": [
    "CORS",
    "Same-Origin Policy",
    "Security & API Design"
  ],
  "question": "What does CORS actually protect against, and what's the dangerous misconfiguration people ship?",
  "answer": "<p>The browser's same-origin policy already blocks a script on `evil.com` from reading a response from `bank.com` by default. CORS is the mechanism by which `bank.com` can deliberately <em>relax</em> that restriction for specific origins via response headers (`Access-Control-Allow-Origin`) — it's an opt-in loosening of a browser protection, not itself a security barrier; the actual protection is same-origin policy, and CORS just controls exceptions to it.</p>\n      <p>The dangerous misconfiguration: `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` — the spec actually forbids that exact combination for credentialed requests precisely because it would let any site read authenticated responses on a logged-in user's behalf, but a surprising number of misconfigured backends still reflect the request's `Origin` header back verbatim as the allowed origin while also allowing credentials, which achieves the same dangerous effect the spec was trying to prevent.</p>"
},
{
  "id": "gen-b4-58",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "Idempotency in APIs — why isn't POST idempotent, and how do you make a payment API safely retryable?",
  "difficulty": "Senior",
  "tags": [
    "Idempotency",
    "API Design",
    "Payments",
    "Security & API Design"
  ],
  "question": "Idempotency in APIs — why isn't POST idempotent by default, and how do you make a payment/charge endpoint safely retryable?",
  "answer": "<p>GET, PUT, and DELETE are defined to be idempotent — calling them N times has the same effect as calling them once. POST is not — by default, retrying a POST (because the client timed out and doesn't know if the first request actually succeeded) can create a duplicate resource, or, worst case on a payments API, charge the customer twice.</p>\n      <p>The standard fix is an idempotency key: the client generates a unique key per logical operation (not per HTTP attempt) and sends it in a header; the server, on first seeing that key, performs the operation and stores the result keyed by it; on any retry with the same key, it returns the stored result instead of re-executing the charge. This is exactly the mechanism real payment processors (Stripe, etc.) expose publicly, and it directly ties back to the earlier lesson about network calls needing retry logic — retries are only safe once the operation they're retrying is actually idempotent.</p>\n      <pre><code>POST /charges\nIdempotency-Key: 7c3f9e2a-...\n\n// server: if this key was already processed, return the stored\n// result instead of creating a second charge</code></pre>"
},
{
  "id": "gen-b4-59",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Security & API Design",
  "title": "Database indexing — how does an index actually speed up a query, and what's the write-side cost?",
  "difficulty": "Mid",
  "tags": [
    "Database Indexing",
    "B-Tree",
    "Performance",
    "Security & API Design"
  ],
  "question": "How does a database index actually speed up a query, and what's the cost on the write side that stops you from just indexing everything?",
  "answer": "<p>A typical index (a B-tree, for most relational databases) maintains a sorted structure over the indexed column(s), turning a query that would otherwise scan every row (`O(n)`) into a lookup that walks the tree (`O(log n)`) — the difference between reading the whole table and reading a handful of tree nodes.</p>\n      <p>The cost: every index has to be updated on every `INSERT`/`UPDATE`/`DELETE` that touches the indexed column, so more indexes means slower writes and more storage — which is exactly why you index columns that are actually queried/filtered/joined on frequently (and match the query patterns — a composite index's column order matters, since it can only be used efficiently as a left-prefix), not every column defensively.</p>"
}
);
