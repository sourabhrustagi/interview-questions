// ==========================================================
// Batch 26: React hooks fundamentals, React Native platform/
// security gap-fill, IC-level Mobile Architecture, and Spring
// Boot testing/production gap-fill.
// Researched against current (2026) interview-question sources
// to fill genuine gaps left after batches 1-25: this site's
// existing React coverage was 4 high-level "why React" questions
// with no hooks fundamentals; React Native/Spring Boot/mobile
// architecture were already deep on New Architecture, KMP,
// modularization, and virtual threads, so this batch adds only
// what wasn't already there (Expo vs bare, bridgeless mode,
// Testcontainers test slices, ControllerAdvice/ProblemDetail,
// React 19 Actions/useOptimistic/the React Compiler, etc.)
// rather than re-covering ground batches 7/12/14/18/24/25 and
// the android files already own.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b26-01",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useEffect's dependency array — the stale closure trap.",
  "difficulty": "Mid",
  "tags": [
    "React",
    "useEffect",
    "Stale Closures",
    "React Hooks & Fundamentals"
  ],
  "question": "What's the 'stale closure' bug with useEffect, and why does the dependency array exist in the first place?",
  "answer": "<p>Every render creates a new function scope, so the callback passed to <code>useEffect</code> \"closes over\" whatever values were in scope <em>at that render</em>. If the effect reads a piece of state or a prop but that value isn't listed in the dependency array, the effect keeps referencing the value from the render it was created in — even after that value has since changed — because React doesn't re-run the effect (and therefore never creates a new closure with the current value) unless a listed dependency changed.</p>\n      <p>The dependency array exists to tell React exactly when the effect needs to re-run to stay in sync with the values it actually uses — omitting a dependency to \"avoid extra re-runs\" doesn't fix a performance problem, it introduces a correctness bug (the effect silently operates on outdated data). The honest fix for an effect that fires too often usually isn't removing a dependency; it's moving what doesn't need to be reactive (like a ref for a value you read but don't want to re-trigger on) out of the dependency array's need entirely, or restructuring the effect so it depends on less.</p>"
},
{
  "id": "b26-02",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useMemo and useCallback — when they actually help vs premature optimization.",
  "difficulty": "Mid",
  "tags": [
    "React",
    "useMemo",
    "useCallback",
    "Performance",
    "React Hooks & Fundamentals"
  ],
  "question": "When does useMemo/useCallback actually pay off, and when is it just premature optimization that adds noise for no benefit?",
  "answer": "<p><code>useMemo</code> caches an expensive computed value between renders; <code>useCallback</code> caches a function reference. Both cost something too — React still has to store the cached value and compare the dependency array every render — so wrapping every value and every inline function in one of these \"just in case\" makes the code harder to read without measurably helping in the common case, since most renders and most computations are cheap enough that memoizing them costs more (in code complexity and a small runtime overhead) than it saves.</p>\n      <p>They earn their place in two specific situations: an actually expensive computation (a large sort/filter/transform) that would otherwise re-run every render, and stabilizing a reference specifically because it's passed to a memoized child component (<code>React.memo</code>) or into another hook's dependency array — without a stable reference there, the child re-renders or the effect re-fires every time regardless of whether the underlying value logically changed. Reach for them when a profiler or a concrete re-render problem points at one of these two cases, not as a default habit on every value.</p>"
},
{
  "id": "b26-03",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "What actually makes a function 'a hook' rather than a regular function?",
  "difficulty": "Mid",
  "tags": [
    "React",
    "Custom Hooks",
    "React Hooks & Fundamentals"
  ],
  "question": "You can extract logic into a plain JavaScript function or into a custom hook. What actually makes something a hook, and when do you need one instead of a plain helper function?",
  "answer": "<p>A function is a hook — by convention starting with <code>use</code>, which is what lets React's linter and internal rules enforce this — specifically when it calls other hooks (<code>useState</code>, <code>useEffect</code>, another custom hook) internally. That's the real dividing line: a plain function can encapsulate logic and get called from anywhere, any number of times, in any order; a hook is tied into React's per-component call order and lifecycle, which is exactly why hooks can't be called conditionally or inside a loop — React tracks hook state by call order across renders, and a hook call that sometimes happens and sometimes doesn't would desynchronize that tracking.</p>\n      <p>Extract logic into a custom hook specifically when it needs to hold or react to component state/lifecycle (a piece of state plus the effect that keeps it in sync with something external, like a subscription or a media query) and that pairing needs to be reused across components. If the logic is pure — same input always produces the same output, no state, no effect — it belongs in a plain function instead; wrapping it in a hook just to \"feel React-y\" adds the call-order constraints for no benefit.</p>"
},
{
  "id": "b26-04",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Context API causing every consumer to re-render — why, and the fix.",
  "difficulty": "Senior",
  "tags": [
    "React",
    "Context API",
    "Re-renders",
    "React Hooks & Fundamentals"
  ],
  "question": "Why does updating React Context re-render every component that consumes it, even ones that only care about a small slice of the context value, and how do you actually fix that?",
  "answer": "<p>Context has no built-in concept of \"selecting\" part of a value — every component calling <code>useContext</code> on a given Context re-renders whenever that Context's value reference changes, in full, regardless of whether the specific field that component reads actually changed. This bites hardest when a large, frequently-changing object is stuffed into one Context — a component reading only <code>user.name</code> still re-renders every time <code>user.lastActiveAt</code> ticks, because from Context's point of view the whole value changed.</p>\n      <p>The fixes all share one idea — stop making every consumer subscribe to the whole object: split one large Context into several smaller, independently-updating Contexts scoped to what actually changes together; memoize the parts that don't need to re-render with <code>React.memo</code> plus a stable prop reference; or reach for a state library (Zustand, Jotai) built around selector-based subscriptions, where a component only re-renders when the specific slice it selected actually changes. Context is fine for genuinely low-frequency values (theme, locale, auth state); it's the wrong tool for state that updates often and is read narrowly.</p>"
},
{
  "id": "b26-05",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "The key prop and reconciliation — why array index as a key silently breaks things.",
  "difficulty": "Mid",
  "tags": [
    "React",
    "Reconciliation",
    "Key Prop",
    "React Hooks & Fundamentals"
  ],
  "question": "What does the key prop actually do during React's reconciliation, and why does using an array index as the key cause subtle bugs?",
  "answer": "<p>When React re-renders a list, it needs to decide which DOM elements (and their component instances/state) to reuse versus recreate. The <code>key</code> is how it tells elements apart across renders — React matches elements by key, and an element whose key persists is treated as \"the same\" element being updated in place, keeping its internal state and DOM node; an element with a new key is treated as new (unmounted/remounted).</p>\n      <p>Array index as key breaks this the moment the list's order can change (an item is inserted, removed, or reordered) — the index no longer identifies the same logical item across renders, so React matches the wrong element to the wrong data. Concretely: a list of form inputs with local state, reordered by index-keyed rendering, ends up with the typed values staying attached to the wrong rows, because React thinks \"item at index 2\" is still the same element even though the underlying data at that position changed. The fix is a stable, unique identifier from the actual data (a database ID), not the item's position in the array — index-as-key is only safe for a list that's genuinely static and never reorders, inserts, or deletes.</p>"
},
{
  "id": "b26-06",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Error boundaries — what they catch, and the gaps that surprise people.",
  "difficulty": "Mid",
  "tags": [
    "React",
    "Error Boundaries",
    "Error Handling",
    "React Hooks & Fundamentals"
  ],
  "question": "What do React error boundaries actually catch, and what kinds of errors slip past them and surprise people?",
  "answer": "<p>An error boundary (a class component implementing <code>componentDidCatch</code>/<code>getDerivedStateFromError</code>, or a library wrapper for the equivalent) catches JavaScript errors thrown during rendering, in lifecycle methods, and in constructors of the component tree below it — and shows a fallback UI instead of unmounting the whole app with a blank white screen, which is what an uncaught render error does otherwise.</p>\n      <p>What it does <em>not</em> catch, and where people get surprised: errors inside event handlers (a click handler that throws doesn't crash rendering, so there's nothing for an error boundary to intercept — handle that with a normal try/catch instead), errors in asynchronous code (a <code>setTimeout</code> callback or an unhandled promise rejection inside <code>useEffect</code>), errors during server-side rendering, and errors thrown in the error boundary's own fallback rendering. The practical takeaway: error boundaries are specifically a safety net for render-time crashes, not a general-purpose error handler — async and event-handler errors still need their own explicit handling.</p>"
},
{
  "id": "b26-07",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "React 19 Actions, useActionState, and useOptimistic — what problem they actually solve.",
  "difficulty": "Senior",
  "tags": [
    "React 19",
    "Actions",
    "useActionState",
    "useOptimistic",
    "React Hooks & Fundamentals"
  ],
  "question": "React 19 introduced Actions along with useActionState and useOptimistic. What was the hand-rolled pattern before this, and what do these hooks actually replace?",
  "answer": "<p>Before React 19, a form submission handler was hand-rolled boilerplate repeated in every form: track a pending/loading state, call the async submit function, catch and store an error, and — if you wanted the UI to feel instant — manually apply an optimistic update to local state before the server confirmed it, then manually roll it back on failure. Every form reimplemented this same shape with its own bugs.</p>\n      <p>An <strong>Action</strong> is just a function (often async) passed directly to a <code>form</code>'s <code>action</code> prop or a transition; React automatically manages its pending state, so the form's built-in submission handling replaces a chunk of that manual plumbing. <code>useActionState</code> wraps an action and gives back its current state, a pending flag, and a dispatch function in one hook call — the loading/error tracking you used to write by hand. <code>useOptimistic</code> specifically handles the \"show the new state immediately, before the server has responded\" pattern — you give it the real state and an update function, and it returns an optimistic value that automatically reconciles back to the real value once the action settles (or reverts on failure) without you writing the rollback logic yourself.</p>"
},
{
  "id": "b26-08",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "The React Compiler — what it automates, and what you stop hand-optimizing.",
  "difficulty": "Senior",
  "tags": [
    "React Compiler",
    "Memoization",
    "Performance",
    "React Hooks & Fundamentals"
  ],
  "question": "What does the React Compiler actually do, and does it mean useMemo/useCallback/React.memo are now obsolete?",
  "answer": "<p>The React Compiler is a build-time tool that analyzes your component code and automatically inserts the equivalent of memoization wherever it determines a value or a JSX subtree doesn't need to be recomputed on a given render — the same class of optimization developers previously had to identify and hand-write with <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>, now done by static analysis of the component's actual data dependencies instead of a developer's manual judgment call about what's \"expensive enough\" to memoize.</p>\n      <p>It doesn't make those hooks meaningless overnight, for two reasons: existing code with manual memoization still works fine (the compiler is additive, not a replacement that breaks old patterns), and there are still cases the compiler can't safely reason about — code that violates the rules of hooks or mutates values in ways that defeat static analysis falls back to un-optimized behavior for that component, so understanding <em>why</em> memoization matters is still relevant even though you write far less of it by hand now. The practical shift: for new code following the rules of React correctly, you generally stop reaching for manual memoization as a first instinct and let the compiler handle it, reserving hand-written memoization for cases the compiler explicitly can't cover.</p>"
},
{
  "id": "b26-09",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Expo vs bare React Native workflow — the actual 2026 decision.",
  "difficulty": "Mid",
  "tags": [
    "Expo",
    "Bare Workflow",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "Expo vs the bare React Native workflow — what's the actual decision framework today, now that Expo supports prebuild and custom native code?",
  "answer": "<p>The old framing — \"Expo is for simple apps, bare RN is for anything needing native code\" — is stale: Expo's <em>prebuild</em> model generates the native <code>ios</code>/<code>android</code> projects from your Expo config rather than hiding them, and config plugins let you add arbitrary native code and third-party native SDKs without ejecting. That closes most of the historical gap, which is why Expo with prebuild has become the default starting point for a new app rather than the \"training wheels\" option it used to be seen as.</p>\n      <p>The remaining reasons to reach for a fully bare project instead: you need to hand-edit native project files directly and durably (rather than through a config plugin) as a routine part of your workflow, you're integrating a native SDK with no existing Expo config plugin and don't want to write and maintain one, or your team's existing native (Android/iOS) expertise and tooling investment makes owning the native projects directly the more natural fit organizationally. For a greenfield app without a specific reason to avoid it, Expo-with-prebuild is the default answer — the honest interview answer is naming the specific condition that would push you to bare, not reciting old folklore about Expo being limited.</p>"
},
{
  "id": "b26-10",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Bridgeless mode — what actually changed versus the old bridge.",
  "difficulty": "Senior",
  "tags": [
    "Bridgeless Mode",
    "JSI",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "React Native's 'bridgeless' mode is now the default under the New Architecture. What did the old bridge actually do, and what changes once it's removed?",
  "answer": "<p>The legacy bridge was an asynchronous, batched, JSON-serializing message queue between the JavaScript thread and native code — every call across that boundary (invoking a native module, updating a native view) had to be serialized into a JSON message, queued, and processed on the next batch, which added both latency and a hard ceiling on how chatty the JS-to-native communication could be without visibly janking the UI.</p>\n      <p>JSI (JavaScript Interface) replaced that queue with direct, synchronous C++ bindings that let JavaScript hold a real reference to a native object and call its methods directly, no serialization or queuing required — TurboModules and Fabric are built on top of JSI. \"Bridgeless mode\" is the last step of that transition: removing the legacy bridge entirely so every interaction goes through JSI, which is what actually delivers the New Architecture's promised wins — faster startup (no bridge initialization), synchronous native calls where they're needed (a layout measurement that used to require an async round-trip), and materially reduced overhead for view updates. The practical interview-relevant detail: a library that still assumes the old bridge's async messaging model (rather than being written against TurboModules/Fabric) is what actually breaks during a New Architecture migration — not application code itself, most of the time.</p>"
},
{
  "id": "b26-11",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Metro bundler — why React Native doesn't route-based code-split the way web apps do.",
  "difficulty": "Mid",
  "tags": [
    "Metro",
    "Bundling",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "Metro is React Native's JavaScript bundler. Why can't you route-based code-split an RN app the way you'd lazy-load routes in a web app with webpack/Vite?",
  "answer": "<p>A web app can lazy-load a route's JS chunk on navigation because the browser can fetch an additional small file over the network in the time it takes a user to click and wait a beat. A mobile app ships as a single installed binary with its JS bundle embedded (or fetched once via an OTA update) — there's no equivalent \"fetch this chunk from a CDN on demand\" step in the normal app lifecycle, so Metro has historically produced one single JS bundle per app rather than splitting it the way a web bundler splits by route.</p>\n      <p>This is genuinely changing — Metro added support for lazy bundle loading and RAM bundles/Hermes bytecode splitting so a very large app can defer loading rarely-used JS until it's needed, and libraries have built module-federation-style dynamic loading on top of that. But it's still the exception, not the default the way it is on web, and it needs to fetch the deferred chunk over the network (or have it embedded and just deferred in parsing) rather than a browser's ordinary asset request — so the tradeoff calculus (does the added complexity of splitting actually pay off for this app's size and update model) is a much more deliberate decision on RN than reaching for <code>React.lazy</code> is on web.</p>"
},
{
  "id": "b26-12",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Deep linking and universal links across iOS and Android in one RN app.",
  "difficulty": "Mid",
  "tags": [
    "Deep Linking",
    "Universal Links",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "How do you implement deep linking (opening a specific in-app screen from an external link) across both iOS and Android in a single React Native app?",
  "answer": "<p>Two link types, both needing platform-native configuration underneath a shared JS layer: a custom URL scheme (<code>myapp://product/123</code>) is simple to set up but any app can register the same scheme, so it's not provable which app should actually own a link, and it doesn't work at all if the app isn't installed. Universal Links (iOS) and App Links (Android) use real <code>https://</code> URLs instead, verified via a JSON file hosted at the domain's well-known path (<code>apple-app-site-association</code> / <code>assetlinks.json</code>) that cryptographically proves the domain authorizes that specific app to handle its links — which is also what lets the OS fall back gracefully to opening the link in a browser if the app isn't installed, rather than just failing.</p>\n      <p>On the RN side, <code>Linking.getInitialURL()</code> handles the case where the app was launched cold by a link, and the <code>Linking</code> event listener handles a link opened while the app is already running — both need to feed into the same navigation logic (typically the navigation library's own deep-linking config, mapping a URL pattern to a screen and its params) so a cold start and a warm resume both land the user on the right screen, not just the app's default home tab.</p>"
},
{
  "id": "b26-13",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Hardening a production React Native app — what actually needs locking down.",
  "difficulty": "Senior",
  "tags": [
    "Security",
    "Hardening",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "What does hardening a production React Native app for release actually involve, beyond the normal mobile security checklist?",
  "answer": "<p>RN-specific exposure that a plain native-app security checklist misses: the JS bundle itself is effectively readable — Hermes bytecode and even un-minified JS can be extracted from the shipped app and inspected, so any secret, API key, or business logic an attacker shouldn't see must never live in JS reachable at runtime, only server-side; debugging/inspection tools like Flipper must be excluded from release builds (they're dev-only by default in current RN, but a manual native integration can leave a debug bridge reachable in production if not gated carefully), since a debug bridge in a shipped app is a direct runtime-inspection and tampering vector.</p>\n      <p>Beyond the JS layer, the same mobile fundamentals still apply and still get missed: root/jailbreak detection for apps handling sensitive data (banking, payments) so the app can choose to degrade functionality on a compromised device rather than trust it blindly; certificate pinning so a compromised or misconfigured CA can't intercept traffic via a fake certificate; and not trusting client-side validation for anything security-relevant, since a modified client (or a request crafted outside the app entirely) can send whatever it wants — the server has to independently enforce every rule the client UI enforces for UX.</p>"
},
{
  "id": "b26-14",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Monorepo vs multi-repo for a portfolio of several mobile apps.",
  "difficulty": "Senior",
  "tags": [
    "Monorepo",
    "Mobile Architecture",
    "Code Sharing"
  ],
  "question": "Your company ships several mobile apps (say, a consumer app and an internal ops app) that share some but not all code. Monorepo or multi-repo, and how do you actually decide?",
  "answer": "<p>A monorepo (all apps and shared modules in one repository) makes cross-app refactors atomic — a change to a shared design-system module and every app consuming it land in one commit, so nothing can drift out of sync waiting for a separate repo to bump a dependency version — and gives every team visibility into how their shared code is actually used elsewhere. The cost is real: build tooling has to scale to the whole repo's size (incremental/cached builds become mandatory, not optional, past a certain size), and access control is coarser unless the tooling explicitly supports path-based permissions.</p>\n      <p>Multi-repo (shared code published as a versioned package, each app in its own repo) gives each app team full independence — they upgrade the shared package on their own schedule, and a breaking change in shared code doesn't force every app to deal with it immediately. The cost is the opposite of the monorepo's benefit: a bug fix in shared code takes a version bump plus an update PR in every consuming app to actually reach production, and it's easy for an app to quietly stay pinned to an old, unpatched version of shared code for months. The decision usually comes down to how tightly coupled the apps' release cadences need to be — genuinely independent release schedules favor multi-repo; a shared platform team pushing changes that should land everywhere quickly favors a monorepo.</p>"
},
{
  "id": "b26-15",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Choosing MVI over MVVM for a large, state-heavy screen.",
  "difficulty": "Senior",
  "tags": [
    "MVI",
    "MVVM",
    "Mobile Architecture",
    "Unidirectional Data Flow"
  ],
  "question": "MVVM is the common default in modern Android/Compose apps. When does it make sense to go further and adopt MVI (Model-View-Intent) instead, and what does MVI actually add?",
  "answer": "<p>A typical MVVM ViewModel exposes several independent pieces of observable state (a loading flag, an error, a data list, a filter selection) that the view combines. That's fine until a screen's state has enough independent pieces that they can drift into an inconsistent combination the view was never designed to handle — loading is true and data is also populated and an error is also set, all at once, because nothing enforced that these three fields move together as one coherent state.</p>\n      <p>MVI's core discipline is collapsing all of a screen's state into a single immutable data class representing every valid state the screen can be in, updated only by a pure reducer function processing one well-defined \"intent\" (user action or event) at a time — which makes an inconsistent combination structurally hard to represent rather than just discouraged by convention, and makes the exact history of state transitions easy to log and replay for debugging, since every state change is an explicit, traceable step rather than several independently-mutated fields. The real cost is more boilerplate per screen (sealed classes for every intent and every state), which is why it's a pattern to reach for on genuinely complex, state-heavy screens (a multi-step checkout, a live dashboard) rather than a wholesale replacement for MVVM on every simple list-and-detail screen in the app.</p>"
},
{
  "id": "b26-16",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Mobile observability — crash reporting, ANRs, and real-user performance.",
  "difficulty": "Senior",
  "tags": [
    "Observability",
    "Crash Reporting",
    "ANR",
    "Mobile Architecture"
  ],
  "question": "What does a real mobile observability strategy actually consist of, beyond just wiring up a crash reporter?",
  "answer": "<p>Crash reporting (Crashlytics, Sentry) catches fatal, app-terminating errors, but a meaningful chunk of what users actually experience as \"the app is broken\" never crashes at all: an ANR (Application Not Responding — Android specifically watchdogs the main thread and flags it if blocked too long) is a frozen, unresponsive UI with no crash and no automatic report unless you're specifically capturing ANR traces; and a silently swallowed exception in a background coroutine/thread can fail a feature with zero visible signal unless it's explicitly logged and reported, not just caught and dropped.</p>\n      <p>A real strategy layers three things: crash reporting for fatal errors with full stack traces and enough device/session context to reproduce; ANR detection and reporting, since it's a distinct failure mode from a crash and needs its own watchdog and reporting path; and real-user performance monitoring (cold/warm start time, frame-drop rate, network request latency) sampled from actual production devices — a phone lab or CI benchmark tells you how the app performs on one controlled device, not how it performs on the long tail of real user devices, OS versions, and network conditions your crash-free-rate target actually depends on.</p>"
},
{
  "id": "b26-17",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Designing a plugin/module architecture for a 'super app' with many semi-independent features.",
  "difficulty": "Senior",
  "tags": [
    "Super App",
    "Modularization",
    "Plugin Architecture",
    "Mobile Architecture"
  ],
  "question": "You're building a 'super app' — one app hosting many largely independent feature modules (ride-hailing, payments, food delivery, say). How do you architect that so feature teams can ship independently without every feature becoming tightly coupled to every other?",
  "answer": "<p>The foundation is the same Gradle-module boundary discipline as ordinary feature modularization, taken further: each feature is a module that depends only on a small set of shared core modules (design system, networking, auth) and never directly on another feature module — cross-feature communication goes through a thin, explicitly-defined contract (a shared interface module, or a navigation/deep-link contract) rather than one feature importing another feature's internals directly, which is what actually prevents two independently-owned features from becoming secretly coupled through convenience imports.</p>\n      <p>The parts that don't come for free from ordinary modularization: a feature registry or dynamic-feature-module setup (Play Feature Delivery on Android) so features can be delivered on-demand rather than bloating every user's install with every feature whether they use it or not; a shared design system enforced structurally, not just by convention, since a super app with a dozen independently-built features visually drifting apart looks and feels like several different apps stitched together; and an explicit versioning/compatibility policy for the shared core modules, since a breaking change there now has to be coordinated across every feature team rather than owned by one team alone. The interview-relevant judgment: recognizing that a super app's real architectural cost isn't the initial module split, it's the ongoing governance of the contracts between modules as more teams and features get added.</p>"
},
{
  "id": "b26-18",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Feature-flag-driven mobile experimentation without shipping a new build per test.",
  "difficulty": "Senior",
  "tags": [
    "Feature Flags",
    "A/B Testing",
    "Mobile Architecture"
  ],
  "question": "How do you architect a mobile app so product can run A/B tests and toggle features without waiting on an app-store release for every change?",
  "answer": "<p>The core mechanism is a remote-config layer (Firebase Remote Config, LaunchDarkly, or an in-house equivalent) fetched at app start (and periodically refreshed) that the app consults to decide which variant of a feature or flag state to render — the code for every variant already ships inside the binary, and the remote config just decides which path executes for a given user, which is what lets product change behavior for users on an already-installed app version without a new store release.</p>\n      <p>The architectural discipline this actually needs, beyond just wiring in a remote-config SDK: every flagged code path has to be genuinely safe to run in either state, tested as such, not \"the new path is untested because it's behind a flag so it's fine\" — a flag doesn't reduce the testing surface, it multiplies it; a defined default/fallback behavior for when the remote config hasn't loaded yet (cold start, no network) or returns a value the client doesn't recognize (an older app version encountering a flag value introduced after it shipped); and flag lifecycle hygiene — a flag that's been at 100% rollout for six months with no plan to remove the old code path <em>and</em> the flag itself is exactly the technical debt this pattern quietly accumulates if nobody owns cleaning it up.</p>"
},
{
  "id": "b26-19",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Testcontainers and @ServiceConnection — why it replaced manual @DynamicPropertySource wiring.",
  "difficulty": "Senior",
  "tags": [
    "Testcontainers",
    "Integration Testing",
    "@ServiceConnection",
    "Testing & Production Readiness"
  ],
  "question": "What problem does Testcontainers solve for Spring Boot integration tests, and what did @ServiceConnection change about using it?",
  "answer": "<p>An integration test that mocks the database tests your code against a fake that may not share your real database's actual behavior (its specific SQL dialect quirks, constraint enforcement, locking behavior) — passing against a mock and failing in production against the real thing is a common, expensive gap. Testcontainers closes that gap by spinning up a real, throwaway instance of your actual dependency (PostgreSQL, Kafka, Redis) in a Docker container for the duration of the test run, so the test exercises real behavior, then discards it — no shared test database to keep clean, no environment drift between what tests run against and what production runs.</p>\n      <p>Before Spring Boot 3.1, wiring the container's dynamically-assigned port and credentials into the Spring context required manually registering them via <code>@DynamicPropertySource</code> — boilerplate repeated in every test class using a container. <code>@ServiceConnection</code>, annotated directly on the container field, tells Spring Boot to auto-detect the container type and wire up the corresponding connection properties (datasource URL, Redis connection factory, Kafka bootstrap servers) automatically, eliminating that repeated manual property registration and making a Testcontainers-backed integration test look almost as simple to write as one against an in-memory fake.</p>"
},
{
  "id": "b26-20",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@DataJpaTest / @WebMvcTest vs @SpringBootTest — the test-slice tradeoff.",
  "difficulty": "Mid",
  "tags": [
    "Spring Boot Testing",
    "Test Slices",
    "Testing & Production Readiness"
  ],
  "question": "What's the actual difference between a Spring Boot test-slice annotation like @DataJpaTest or @WebMvcTest and a full @SpringBootTest, and how do you decide which to use?",
  "answer": "<p><code>@SpringBootTest</code> boots the entire application context — every bean, every auto-configuration — which gives you the most realistic test environment but is correspondingly the slowest to start, and a large test suite doing this for every test class adds up to real minutes of CI time spent just booting contexts repeatedly.</p>\n      <p>A test-slice annotation boots only the beans relevant to one architectural layer: <code>@DataJpaTest</code> configures an embedded/test datasource plus your JPA repositories and entities, with web-layer and service-layer beans excluded, for testing repository queries in isolation; <code>@WebMvcTest</code> configures the MVC layer (controllers, filters, exception handlers) with a mocked service layer, for testing request/response handling and validation without touching a real database. The decision is about what you're actually testing: a repository query's correctness needs <code>@DataJpaTest</code>, not a full context; a controller's request mapping and validation logic needs <code>@WebMvcTest</code>, not a real service or database; and a genuine end-to-end flow across multiple layers is exactly when the slower <code>@SpringBootTest</code> (often paired with Testcontainers for real dependencies) is the right, deliberate choice rather than a default reached for out of habit.</p>"
},
{
  "id": "b26-21",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Global exception handling with @ControllerAdvice and RFC 7807 ProblemDetail.",
  "difficulty": "Mid",
  "tags": [
    "Exception Handling",
    "@ControllerAdvice",
    "ProblemDetail",
    "Testing & Production Readiness"
  ],
  "question": "How do you handle exceptions consistently across every REST endpoint in a Spring Boot app, and what does the ProblemDetail type add over a hand-rolled error response?",
  "answer": "<p>Without centralized handling, each controller either duplicates its own try/catch-and-format-an-error-response logic, or lets an unhandled exception fall through to Spring's default error page/response — inconsistent shape, inconsistent status codes, and duplicated logic across every controller. A class annotated <code>@ControllerAdvice</code> (or <code>@RestControllerAdvice</code> for a JSON API) with <code>@ExceptionHandler</code> methods centralizes this: one place maps a given exception type to a status code and response body, applied automatically across every controller in the app, so a controller method just throws a meaningful exception and trusts the advice to translate it consistently.</p>\n      <p><code>ProblemDetail</code> (built into Spring 6/Boot 3) implements RFC 7807 — a standardized JSON shape for API error responses (<code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>, plus room for extension properties) instead of every team inventing its own ad-hoc error JSON shape. The real benefit shows up for API consumers integrating against your service: a standardized error shape means a client-side error handler can be written once against the RFC's fields rather than per-API-specific error formats, and the extension properties let you add domain-specific detail (a validation field name, an error code) without breaking that standard shape.</p>"
},
{
  "id": "b26-22",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@Cacheable — what Spring's cache abstraction does and doesn't solve for you.",
  "difficulty": "Mid",
  "tags": [
    "Caching",
    "@Cacheable",
    "Testing & Production Readiness"
  ],
  "question": "What does Spring's @Cacheable actually do under the hood, and what caching problems does it explicitly not solve for you?",
  "answer": "<p><code>@Cacheable</code> wraps a method with a proxy: on each call, Spring checks the configured cache (an in-memory <code>ConcurrentMapCache</code> by default, or Redis/Caffeine/EhCache in production) for an entry keyed by the method's arguments, returns the cached value on a hit, and only executes the actual method body and stores the result on a miss. <code>@CacheEvict</code> and <code>@CachePut</code> round this out — explicitly removing or replacing a cache entry, typically called from the method that mutates the underlying data the cache is caching.</p>\n      <p>What it doesn't solve, because it's a thin declarative wrapper rather than a full caching system: cache invalidation strategy is still entirely your responsibility — Spring won't figure out which cache entries a given write invalidates, you have to annotate that explicitly (or accept staleness up to a TTL); it does nothing about the thundering-herd problem (many concurrent requests all missing the same cache key at once and all hammering the underlying method simultaneously) unless the underlying cache provider specifically supports request coalescing; and self-invocation defeats it the same way it defeats <code>@Transactional</code> — calling a <code>@Cacheable</code> method from another method in the same class bypasses the Spring proxy entirely, since the proxy only intercepts calls that come in from outside the bean.</p>"
},
{
  "id": "b26-23",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "@Scheduled and @Async — the default single-thread trap.",
  "difficulty": "Mid",
  "tags": [
    "@Scheduled",
    "@Async",
    "Thread Pools",
    "Testing & Production Readiness"
  ],
  "question": "What's the default thread-pool trap with @Scheduled and @Async in Spring Boot that catches people who never configure anything?",
  "answer": "<p>Both annotations work out of the box with zero configuration — which is exactly the trap. By default, Spring runs every <code>@Scheduled</code> task on a single-threaded scheduler, meaning two scheduled tasks that happen to fire around the same time actually run one after another, not concurrently — a long-running scheduled job can silently delay every other scheduled task in the app behind it, with no error, just a growing backlog. <code>@Async</code> methods, if no custom executor is configured, fall back to Spring's <code>SimpleAsyncTaskExecutor</code>, which spins up a brand-new thread for every single invocation with no pooling and no upper bound — fine for occasional background work, but a genuinely dangerous default under real load, since nothing caps how many threads get created.</p>\n      <p>The fix for both is the same: define an explicit <code>TaskExecutor</code> (and a separate <code>TaskScheduler</code> for <code>@Scheduled</code> if concurrent scheduled tasks are needed) with a real bounded thread pool sized deliberately for the workload, and wire it in via <code>@Async(\"myExecutorBeanName\")</code> or the scheduler configuration — rather than relying on defaults that were designed to \"just work\" for a trivial case, not to be safe under production load.</p>"
},
{
  "id": "b26-24",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Boot 2 to 3 — the Jakarta EE namespace break and Java 17 baseline.",
  "difficulty": "Mid",
  "tags": [
    "Spring Boot 3",
    "Jakarta EE",
    "Migration",
    "Testing & Production Readiness"
  ],
  "question": "What actually breaks when migrating a Spring Boot 2 app to Spring Boot 3, and why is it a bigger jump than a normal major-version bump?",
  "answer": "<p>The headline breaking change isn't a Spring API change at all — it's that Java EE was donated to the Eclipse Foundation and renamed Jakarta EE, and as part of that transition every package under the old <code>javax.*</code> namespace (<code>javax.persistence</code>, <code>javax.servlet</code>, <code>javax.validation</code>) that Spring Boot depends on moved to <code>jakarta.*</code>. Every import of those packages across your codebase, and every third-party library you depend on that hasn't updated to the Jakarta namespace itself, has to change or your app simply won't compile — this is a mechanical but genuinely large-surface-area change, not a subtle behavioral one.</p>\n      <p>Layered on top of that: Spring Boot 3 raises the minimum Java baseline to Java 17, so an app still on Java 8 or 11 has to upgrade the JDK first as a prerequisite, potentially surfacing its own unrelated compatibility issues; and Spring Boot 3's auto-configuration registration mechanism changed from the old <code>META-INF/spring.factories</code> file to <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code>, which matters specifically if you maintain a custom auto-configuration library rather than just consuming Spring Boot's own. The practical migration approach: use Spring's own OpenRewrite-based migrator recipes to automate the mechanical namespace rewrite, then deal with the smaller number of genuinely manual issues (a third-party library with no Jakarta-compatible release, a custom auto-configuration file) individually.</p>"
},
{
  "id": "b26-25",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Micrometer's Observation API — one instrumentation point for both metrics and traces.",
  "difficulty": "Senior",
  "tags": [
    "Micrometer",
    "Observation API",
    "Distributed Tracing",
    "Testing & Production Readiness"
  ],
  "question": "What does Micrometer's Observation API add over instrumenting metrics and traces separately?",
  "answer": "<p>Before the Observation API, instrumenting a piece of code for both a metric (how many times did this run, how long did it take) and a trace span (where does this fit in a distributed request's timeline) meant writing two separate pieces of instrumentation code around the same operation — one against Micrometer's metrics API, one against a tracing library's span API — duplicated effort, and easy for the two to drift out of sync (a metric that gets added to a code path without the corresponding trace span, or vice versa).</p>\n      <p>An <code>Observation</code> wraps one instrumented operation once, and Micrometer fans that single instrumentation point out to whatever's actually configured to consume it — a timer metric, a trace span, or both simultaneously — via registered <code>ObservationHandler</code>s, so instrumenting an operation for observability is one piece of code regardless of how many different signal types you want out of it. Spring Boot 3's own auto-configuration for HTTP requests, database calls (via Micrometer-instrumented drivers), and other common operations is itself built on this API, which is why upgrading to Boot 3 often means metrics and traces for the same request start correlating automatically (sharing the same trace/span IDs) without any extra work — a benefit you specifically don't get from wiring up a metrics library and a tracing library independently of each other.</p>"
},
{
  "id": "b26-26",
  "category": "spring-boot",
  "categoryName": "Spring Boot",
  "topic": "Testing & Production Readiness",
  "title": "Spring Kafka listener — consumer group rebalancing and idempotent processing.",
  "difficulty": "Senior",
  "tags": [
    "Spring Kafka",
    "Consumer Groups",
    "Idempotency",
    "Testing & Production Readiness"
  ],
  "question": "You have a @KafkaListener consuming a topic in Spring Boot. What actually happens during a consumer group rebalance, and why does the listener method need to be idempotent?",
  "answer": "<p>Kafka splits a topic into partitions, and a consumer group shares them out — each partition is consumed by exactly one member of the group at a time. A rebalance (triggered by a consumer joining, leaving, or being considered dead after missing heartbeats) reassigns partitions across the group's current members, which means any partition your instance was consuming might be handed to a different instance mid-processing, and any partition being freshly assigned to your instance resumes from its last committed offset — not necessarily exactly where the previous owner left off, since the previous owner's last successful offset commit might lag behind what it had actually already processed in memory.</p>\n      <p>That gap between \"already processed\" and \"already committed\" is exactly why <code>@KafkaListener</code> methods need to be idempotent: Kafka's default delivery guarantee is at-least-once, so a message can be redelivered and reprocessed after a rebalance (or a retry after a transient failure) even though it was already successfully handled once before the offset commit landed. The practical fix is the same idempotency-key discipline used everywhere else redelivery is possible — track a processed-message ID (in a database, a dedup cache) and skip reprocessing a message whose ID has already been handled, rather than assuming \"the listener only fires once per message,\" which Kafka's own delivery model explicitly does not guarantee.</p>"
},
{
  "id": "b26-27",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Clean Architecture layering for mobile — what each layer is actually for.",
  "difficulty": "Senior",
  "tags": [
    "Clean Architecture",
    "Layering",
    "Mobile Architecture"
  ],
  "question": "What does applying Clean Architecture (data/domain/presentation layers) actually buy a mobile app, beyond just 'more organized folders'?",
  "answer": "<p>The point isn't the folder names — it's the dependency direction: the domain layer (business/use-case logic) depends on nothing outside itself, the data layer (network, database, device APIs) depends inward on domain's interfaces, and the presentation layer (ViewModel/screen state, UI) depends inward on domain too. Every dependency arrow points toward domain, never out of it, which means domain logic can be tested with zero Android/iOS framework, no emulator, no real network or database — just plain unit tests against a fake repository implementing the domain's own interface.</p>\n      <p>The concrete payoff that shows up in practice: swapping a data source (a REST backend for a GraphQL one, a local cache implementation) touches only the data layer's implementation of an existing interface, not the business logic or the UI that consume it; and a genuinely gnarly business rule (loan eligibility, a pricing calculation) lives in one place, tested in isolation, rather than smeared across a ViewModel and duplicated between platforms. The honest cost to name unprompted: the indirection (interfaces, mappers between layers) is real overhead for a simple CRUD screen, which is why teams often apply it selectively to the features whose business logic actually deserves the isolation, not uniformly to every screen in the app.</p>"
},
{
  "id": "b26-28",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Backward compatibility — supporting old app versions still in the wild.",
  "difficulty": "Senior",
  "tags": [
    "Backward Compatibility",
    "Force Update",
    "API Versioning",
    "Mobile Architecture"
  ],
  "question": "Unlike a web app, you can't force every user onto the latest version instantly. How do you architect for the reality that old app versions stay installed and in use for months or years?",
  "answer": "<p>Unlike a web deploy that updates every client the moment it ships, a mobile release only reaches users who choose to update — app stores don't force updates, and a real fraction of your install base can sit on a version from a year ago indefinitely, especially on Android where update friction is higher. The backend has to keep serving that old version's expected API contract for as long as it's supported, which means API changes need the same backward-compatibility discipline as any public API: additive changes are safe, but removing a field or changing its meaning breaks every old client still calling it, silently, with no way for the backend team to know until support tickets show up.</p>\n      <p>Two mechanisms handle this deliberately rather than hoping for the best: API versioning with an explicit deprecation window (old clients keep working against a versioned endpoint while you migrate traffic to the new one on your own schedule) and a server-driven minimum-supported-version check the app calls on launch — below a configured floor, show a blocking \"please update\" screen; between the floor and latest, a soft, dismissible nudge. The floor itself is a real product decision (how long do you actually support an old version) that engineering can enforce but shouldn't unilaterally set — it trades support/security burden against how much you're willing to lock out users who haven't updated.</p>"
},
{
  "id": "b26-29",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Localization architecture across iOS, Android, and a shared backend.",
  "difficulty": "Mid",
  "tags": [
    "Localization",
    "i18n",
    "RTL",
    "Mobile Architecture"
  ],
  "question": "How do you architect localization (multiple languages, including right-to-left ones) across native iOS, Android, and any shared cross-platform code, so it doesn't become an ad-hoc mess per platform?",
  "answer": "<p>Each platform has its own native string-resource mechanism (Android's <code>strings.xml</code> per locale, iOS's <code>.strings</code>/String Catalogs) precisely because the OS itself needs to resolve the right string synchronously at render time with no network dependency — so the string <em>files</em> stay platform-native, but the source of truth for the actual translated text should be centralized (a translation management platform like Lokalise or Phrase) that exports into each platform's native format via a build step, rather than three separate teams hand-editing three separate copies of the same strings and drifting out of sync.</p>\n      <p>Right-to-left languages (Arabic, Hebrew) are the part that actually breaks layouts, not just text: both platforms can auto-mirror a layout for RTL (Android's <code>start</code>/<code>end</code> instead of <code>left</code>/<code>right</code> in layout attributes, iOS's leading/trailing constraints), but only if the UI was actually built using those direction-aware primitives instead of hardcoded left/right — a codebase with hardcoded left/right values looks fine in every LTR language and silently breaks the moment RTL support is added, which is why enforcing direction-aware layout is a code-review-time discipline, not something you can retrofit cheaply once the app has scaled. Dates, numbers, currency, and pluralization rules also vary by locale and need the platform's own formatting APIs, not string concatenation — a naive \"1 item(s)\" pattern doesn't hold up once you add a language with more than two plural forms.</p>"
},
{
  "id": "b26-30",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Battery- and network-aware background work — architecting around OS constraints, not fighting them.",
  "difficulty": "Senior",
  "tags": [
    "Background Work",
    "WorkManager",
    "Battery",
    "Mobile Architecture"
  ],
  "question": "How do you architect background work (syncing data, uploading a queued file) so it actually runs reliably, given how aggressively both iOS and Android restrict background execution to save battery?",
  "answer": "<p>Both platforms treat background execution as a scarce, OS-managed resource, not something an app can freely claim — Android's Doze mode and App Standby batch and defer background work for apps the user isn't actively using, and iOS's Background App Refresh and BGTaskScheduler give the OS, not the app, the final say over when (or whether) a background task actually runs. Fighting this with a hand-rolled background thread or a foreground service used purely to dodge these restrictions gets the app flagged as a battery drain and is exactly the behavior these OS mechanisms exist to stop.</p>\n      <p>The architecture that actually works with the platform: declare work as constraint-based tasks (Android's <code>WorkManager</code>, iOS's <code>BGTaskScheduler</code>) — \"run this when there's a network connection and the device is charging,\" not \"run this at exactly 2am\" — and let the OS decide the actual execution moment based on system-wide battery and resource state it has visibility into that your app doesn't. Design the work itself to be resumable and idempotent, since the OS can and will interrupt a background task mid-execution if it needs the resources back, and never assume a background task ran (or ran to completion) without an explicit confirmation signal from it — a chronically \"my sync silently stopped working\" bug is almost always an app that assumed background execution is guaranteed rather than best-effort.</p>"
},
{
  "id": "b26-31",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "A shared design-system architecture across native and cross-platform surfaces.",
  "difficulty": "Senior",
  "tags": [
    "Design System",
    "Design Tokens",
    "Theming",
    "Mobile Architecture"
  ],
  "question": "Your company has a native Android app, a native iOS app, and a React Native app. How do you architect a design system so all three actually look and feel consistent, without three teams hand-maintaining three copies of the same colors and spacing?",
  "answer": "<p>The mechanism that scales is design tokens — colors, spacing, typography, and radii defined once as platform-agnostic values (in a tool like Style Dictionary, or a simple structured JSON the design tool exports) and compiled into each platform's native format: Compose theme objects for Android, a Swift enum/asset catalog for iOS, and a JS theme object for React Native. Design changes a token once, a build step regenerates all three platforms' native representations, and no platform can quietly drift from the others because there's only one source of truth feeding all three, not three people manually keeping their own copy in sync by convention.</p>\n      <p>Tokens alone don't guarantee consistent behavior, only consistent values — the actual components (a button, a text field) still get built three separate times, once per platform's native UI toolkit, and behavioral consistency (what counts as a \"pressed\" state, how an error message animates in) has to be a written spec the three implementations are checked against, not just inferred from a shared color palette. This is exactly why some orgs eventually push further into shared UI code (Compose Multiplatform, or leaning further into React Native for more surfaces) — token-level consistency solves the visual drift, but only shared component code solves behavioral drift, and that's a much bigger architectural commitment to weigh separately.</p>"
},
{
  "id": "b26-32",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Mobile security architecture beyond a checklist — what actually needs a design decision.",
  "difficulty": "Senior",
  "tags": [
    "Mobile Security",
    "Secure Storage",
    "Certificate Pinning",
    "Mobile Architecture"
  ],
  "question": "Mobile security checklists all list the same items — secure storage, certificate pinning, obfuscation. As an architect, which of these are actual design decisions with real tradeoffs, versus just boxes to tick?",
  "answer": "<p>Secure storage is a real decision, not a checkbox: the platform's hardware-backed keystore (Android Keystore, iOS Keychain/Secure Enclave) protects a key even if the device is rooted/jailbroken, but binds that key to one specific device — the actual design question is what happens on a device migration or app reinstall, since a key that can't be recovered by design (the security property you wanted) also means data encrypted with it is unrecoverable unless your architecture separately backs up the underlying data through a path that doesn't depend on that device-bound key.</p>\n      <p>Certificate pinning is a real tradeoff, not a default \"yes\": it meaningfully raises the bar against a man-in-the-middle attack using a compromised or rogue CA, but it also means a routine certificate rotation on your backend can break every pinned app version overnight if the pin set isn't updated and shipped in advance — pinning without a rotation plan and a remote kill-switch to disable pinning in an emergency is a self-inflicted outage waiting to happen, which is exactly why some architects pin to a backup CA or an intermediate cert with a longer validity window rather than a single leaf certificate. Obfuscation (ProGuard/R8, iOS bitcode stripping) is the one closest to a genuine checkbox — it raises the cost of casual reverse engineering but is not a security boundary a determined attacker can't cross, so it belongs in the \"do it, it's cheap and non-zero benefit\" category, not the \"this is why we're secure\" category — the actual security boundary is server-side validation and secrets that never reach the client at all.</p>"
},
{
  "id": "b26-33",
  "category": "mobile-architect",
  "categoryName": "Mobile Architect",
  "topic": "Mobile Architecture",
  "title": "Structuring release channels and build variants across a growing mobile team.",
  "difficulty": "Mid",
  "tags": [
    "Release Channels",
    "Build Variants",
    "Mobile Architecture"
  ],
  "question": "How do you structure build variants and release channels (dev, internal, beta, production) as a mobile team grows, so a bad build never reaches real users but engineers still get fast feedback?",
  "answer": "<p>Each channel exists to answer a different question, and conflating them is the usual failure mode: a <strong>dev/debug</strong> build (often pointed at a mock or staging backend, with debug tooling enabled) answers \"does this work at all,\" rebuilt on every commit; an <strong>internal/QA</strong> build (release-configured, pointed at staging, distributed via Firebase App Distribution or TestFlight's internal track) answers \"does this behave like production will, before anyone outside the company sees it\"; a <strong>beta</strong> build (production-configured, a small opt-in external audience) answers \"does this hold up with real users and real devices we don't control\"; and only after that does a build reach general production — each gate catching a different class of problem before it reaches the widest audience.</p>\n      <p>The build-variant mechanics that make this maintainable rather than four hand-maintained near-duplicate configs: platform build-variant/flavor systems (Android product flavors, Xcode configurations/schemes) parameterize the differences (API base URL, app ID suffix so dev and prod can be installed side by side, feature-flag defaults) from one shared codebase, rather than branching the code itself per channel — a channel should only ever differ in configuration, never in actual app logic, or you've lost the entire point of testing a build that's supposedly the same code path production will run.</p>"
},
{
  "id": "b26-34",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "React Navigation — stack, tab, and drawer navigators, and passing state between screens.",
  "difficulty": "Mid",
  "tags": [
    "React Navigation",
    "Navigation",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "How does React Navigation's stack/tab/drawer model actually work, and what's the right way to pass data between screens?",
  "answer": "<p>A stack navigator maintains a literal stack of screens — pushing a new screen adds to the top, back pops it off, and each screen instance keeps its own state until it's popped, which is why a stack navigator (not a tab or drawer) is the right container for a linear flow like checkout or onboarding. Tab and drawer navigators instead keep several screens mounted (or resident) side by side, switching which one is visible without pushing/popping a stack — appropriate for top-level, non-linear sections of an app a user jumps between freely. Real apps nest these — a tab navigator whose \"Profile\" tab itself contains its own stack navigator for drilling into settings sub-screens.</p>\n      <p>For passing data forward, route params (<code>navigation.navigate('Details', { id: 123 })</code>) are the right tool for a small amount of data a screen needs to render itself — an ID, a filter selection — read back via <code>route.params</code>. They're the wrong tool for large objects or anything that needs to update reactively after the navigation already happened; that belongs in shared state (Context, Redux, a query cache) that both screens read from, with the route param used only as a key/reference into that state rather than the payload itself. A common correctness bug follows from getting this backwards: passing a full object as a param, then having a stale copy of it linger in navigation history after the underlying data changes elsewhere in the app.</p>"
},
{
  "id": "b26-35",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "AsyncStorage vs MMKV — why the built-in storage got replaced in most serious apps.",
  "difficulty": "Mid",
  "tags": [
    "AsyncStorage",
    "MMKV",
    "Local Storage",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "AsyncStorage ships with React Native, but most production apps reach for MMKV instead. What's actually wrong with AsyncStorage?",
  "answer": "<p>AsyncStorage's API is asynchronous end to end (every read is a Promise) because its underlying implementation historically serialized everything to a single JSON blob on Android and made an async native-bridge round-trip for every operation — workable for occasional reads, but a real bottleneck for anything read frequently (a value checked on every render, or a large number of keys read at startup), since each one pays that async bridge-call cost.</p>\n      <p>MMKV (built by WeChat, wrapped for RN) is backed by memory-mapped files instead — reads and writes happen synchronously and are orders of magnitude faster because there's no bridge round-trip and no full-blob JSON parse/serialize per operation, and it's built to survive a crash mid-write without corrupting the whole store the way a naive JSON-blob approach can. The tradeoff to know: MMKV's synchronous API is also exactly why it can't be dropped in blindly everywhere AsyncStorage was used — a synchronous call on the JS thread for a very large value can itself introduce a small stall, so it's best suited to what it's actually for (many small, frequently-accessed key-value reads — user prefs, auth tokens, feature flags) rather than as a general-purpose replacement for a real embedded database when the data is large or relational.</p>"
},
{
  "id": "b26-36",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Push notifications in React Native — the parts that aren't just 'call a library'.",
  "difficulty": "Senior",
  "tags": [
    "Push Notifications",
    "FCM",
    "APNs",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "What does architecting push notifications in a React Native app actually involve, beyond wiring up a notification library?",
  "answer": "<p>iOS and Android use entirely separate push infrastructure underneath — APNs for iOS, FCM for Android — so a cross-platform RN app needs both native integrations configured (certificates/keys for APNs, a Firebase project for FCM) even though the JS-facing API (via a library like Notifee or React Native Firebase) presents one unified surface; the library is a convenience layer over two genuinely different native systems, not a replacement for understanding both.</p>\n      <p>The parts that actually require design decisions, not just library wiring: token lifecycle — a device's push token changes (reinstall, OS-level reset) and the backend needs a path to detect a stale token and stop sending to it, or you silently accumulate dead tokens and eventually hit provider rate limits sending to addresses that will never deliver; foreground vs background vs killed-app handling, since each state requires different handling code (a notification arriving while the app is open needs to be displayed manually, unlike the OS handling it automatically when backgrounded); and deep-link routing from a tapped notification into the right in-app screen, which reuses the same navigation-from-a-URL logic as ordinary deep linking, just triggered by a notification payload instead of a clicked link. Silent/data-only notifications (no visible alert, used to trigger a background data refresh) are the other common architecture piece — they need their own handling path and are subject to the same OS background-execution constraints as any other background work, not a free pass around them.</p>"
},
{
  "id": "b26-37",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "React Native vs Flutter — the honest technical comparison, not the tribal one.",
  "difficulty": "Senior",
  "tags": [
    "React Native",
    "Flutter",
    "Cross-Platform Comparison",
    "Platform, Tooling & Security"
  ],
  "question": "React Native vs Flutter — what's the actual technical difference, beyond 'one uses JS and one uses Dart'?",
  "answer": "<p>The deeper difference is the rendering model. React Native (with the New Architecture) renders through Fabric onto real native UI components — a React Native <code>&lt;Text&gt;</code> ultimately becomes an actual native <code>UILabel</code> or Android <code>TextView</code>, so the app inherits native look-and-feel, native accessibility behavior, and native platform updates (a new iOS design language shift shows up for free in native components) automatically. Flutter renders its own widgets directly onto a canvas (via Skia/Impeller) rather than mapping to native platform widgets at all — which buys pixel-perfect rendering consistency across platforms and versions (the same Flutter widget looks identical on both), at the cost of not automatically inheriting native platform look-and-feel changes or native accessibility semantics without Flutter's own team explicitly re-implementing them.</p>\n      <p>The practical decision drivers, honestly: team background (a team with existing JS/React web expertise ramps faster on RN; a team with no prior stake in either ramps roughly evenly on both, since Dart itself isn't the hard part of either), how much the app needs native-feeling per-platform UI versus a single consistent cross-platform brand look, and library/ecosystem maturity for the specific native integrations the app needs (payment SDKs, hardware integrations) — both ecosystems are mature enough today that this is usually the actual deciding factor over either framework's raw performance, which are comparable for the overwhelming majority of real apps.</p>"
},
{
  "id": "b26-38",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Styling in React Native — StyleSheet, Flexbox via Yoga, and why it isn't quite CSS.",
  "difficulty": "Mid",
  "tags": [
    "StyleSheet",
    "Yoga",
    "Flexbox",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "React Native styling looks like CSS-in-JS, but it isn't actually CSS. What's really happening under a StyleSheet, and where does the Flexbox model differ from web?",
  "answer": "<p><code>StyleSheet.create</code> doesn't produce CSS at all — there's no browser, no CSS engine, and no cascade/specificity resolution happening. It produces plain JavaScript objects (with an ID for a small optimization letting the native side reference styles by ID rather than serializing the same object repeatedly), and layout is computed by Yoga, an independent C++ Flexbox implementation embedded in React Native, not a browser's layout engine — which is exactly why RN styling supports the Flexbox properties Yoga implements and nothing beyond that: no CSS grid, no cascading inheritance from a parent selector, no pseudo-classes like <code>:hover</code>, since none of that machinery exists in this pipeline.</p>\n      <p>The specific Flexbox difference that trips people up coming from web: React Native's default <code>flexDirection</code> is <code>column</code>, not <code>row</code> — because a mobile screen's dominant natural axis is vertical scrolling content, unlike a web page's historical row-based document flow default. Every other Flexbox property (<code>justifyContent</code>, <code>alignItems</code>, <code>flex</code>) behaves the same as CSS Flexbox conceptually, but always assume the vertical-first default until proven otherwise when porting a web layout's mental model over, since forgetting that single flipped default is the most common first bug when a web developer starts writing RN layouts.</p>"
},
{
  "id": "b26-39",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Shrinking a React Native release build — what actually moves the app-size needle.",
  "difficulty": "Senior",
  "tags": [
    "App Size",
    "Hermes",
    "ProGuard",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "A React Native app's release build has gotten large. What actually reduces app size, versus changes that feel like they should but don't move the needle much?",
  "answer": "<p>The things that actually move the needle: Hermes precompiling JS to bytecode ahead of time (the default today) removes the need to ship a full JS engine's parser/compiler and lets the bytecode itself be smaller and faster to load than shipping raw JS source; enabling ProGuard/R8 on Android strips unused code and resources from both your JS bundle's native dependencies and your own native modules, and can meaningfully shrink the final APK/AAB when configured with the right keep rules for React Native's own reflection-based bits; and splitting the build by CPU architecture (ABI splits, or shipping an Android App Bundle so the Play Store serves only the architecture-specific native binaries a given device actually needs) avoids bundling every architecture's native libraries into every install.</p>\n      <p>What tends to feel like it should help but usually doesn't move much: manually minifying your own small JS business logic, since the bulk of a typical RN app's size is native dependencies and the JS engine/bridge runtime, not your own application code; and image assets are almost always the actual biggest single culprit in a bloated app, addressed by using vector assets where possible and properly compressed, appropriately-sized raster images rather than shipping a designer's un-optimized source PNGs directly into the bundle — checking asset size before reaching for exotic build-config tuning finds the bigger win faster in most real cases.</p>"
},
{
  "id": "b26-40",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Platform-specific code in React Native — Platform.OS vs .ios.js/.android.js files.",
  "difficulty": "Mid",
  "tags": [
    "Platform.OS",
    "Platform-Specific Code",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "React Native gives you both Platform.OS conditionals and .ios.js/.android.js file extensions for platform-specific code. When do you actually reach for each?",
  "answer": "<p>A <code>Platform.OS === 'ios'</code> (or <code>Platform.select</code>) conditional is right for a small, local difference inside an otherwise-shared component — a slightly different shadow style, a platform-conventional icon, a few pixels of padding — where the surrounding logic and structure are identical and only a small detail diverges. Reaching for it when the divergence is actually large makes the component hard to read, since the reader has to mentally execute both branches to understand what either platform actually renders.</p>\n      <p>The <code>.ios.js</code>/<code>.android.js</code> file-extension convention is the right tool once the divergence is large enough that it's really two different implementations sharing an interface, not one implementation with a few conditionals — Metro's bundler automatically picks the matching file per platform at bundle time, so neither platform's bundle even includes the other platform's code (a real, if usually small, bundle-size benefit too), and each file can be read top-to-bottom as a complete, uncluttered implementation for that one platform. The judgment call is proportional: a handful of conditionals scattered through a component is a sign it's crossed the threshold where splitting into separate platform files would actually be more readable, not less.</p>"
},
{
  "id": "b26-41",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Debugging a React Native memory leak — what to actually check.",
  "difficulty": "Senior",
  "tags": [
    "Memory Leaks",
    "Debugging",
    "React Native",
    "Platform, Tooling & Security"
  ],
  "question": "A React Native app's memory usage keeps climbing the longer it's used. What do you actually check to track down the leak?",
  "answer": "<p>The most common source is a subscription or listener started in <code>useEffect</code> (an event emitter, a WebSocket, a native module's event listener, a timer) with no cleanup function returned to tear it down — every time the component mounts (a screen visited repeatedly via navigation, not just once at app start) without the previous instance's subscription ever being removed, another live listener accumulates, each still holding a reference to a component instance that should have been garbage-collected but can't be, because the listener still references it.</p>\n      <p>The actual debugging path: reproduce the growth deliberately (navigate to and away from the suspected screen repeatedly) while watching native memory in Xcode Instruments (Allocations/Leaks) or Android Studio's Memory Profiler, since these show native heap growth that a JS-only tool can't see — a leak can live on either side of the JS/native boundary, and a React DevTools component-count check only catches the JS-side half of the picture. On the JS side specifically, check for exactly the same class of bug useEffect always causes when done wrong: an effect that subscribes without returning its unsubscribe function, a global event emitter accumulating listeners across screen visits, and closures capturing large objects (a full list, a big response payload) longer than they need to, keeping that memory alive well past when the screen that created it was left.</p>"
}
);
