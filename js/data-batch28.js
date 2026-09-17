// ==========================================================
// Batch 28: React Native — gap-fill installment 2.
// Batches 12/25/26 covered New Architecture/JSI/Fabric/
// TurboModules, Hermes, FlatList vs FlashList, Reanimated,
// Expo vs bare, bridgeless mode, Metro, deep linking, security
// hardening, navigation, AsyncStorage vs MMKV, push notifications,
// RN vs Flutter, styling/Yoga, app size, platform-specific code,
// and memory leak debugging. This batch covers gestures, safe
// areas, keyboard handling, responsive sizing, testing details,
// codegen, native-language interop, permissions, biometrics,
// WebViews, in-app purchases, cold start, orientation,
// accessibility, i18n libraries, large-list rendering, DevTools,
// offline databases, AppState, and monorepos.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b28-01",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "React Native Gesture Handler vs PanResponder — why RNGH exists at all.",
  "difficulty": "Senior",
  "tags": ["Gesture Handler", "PanResponder", "React Native", "Platform, Tooling & Security"],
  "question": "React Native ships PanResponder built in. Why does almost every serious app reach for react-native-gesture-handler instead?",
  "answer": "<p>PanResponder recognizes gestures entirely in JavaScript, on the JS thread — every touch event crosses the bridge to JS, gets evaluated against the gesture logic, and only then does anything happen. Under any JS thread load (a re-render in flight, a heavy computation), gesture recognition itself lags, which shows up directly as a laggy, unresponsive-feeling drag or swipe, exactly the kind of interaction where users notice a delay of even a few dozen milliseconds.</p>\n      <p>Gesture Handler recognizes gestures natively, off the JS thread entirely, using the platform's own native gesture-recognition APIs (UIGestureRecognizer on iOS, the equivalent on Android) — the JS thread only gets notified once a gesture is recognized, not evaluated on every raw touch move. Paired with Reanimated's worklets (which also run off the JS thread), this is what makes buttery, native-feeling drag/swipe/pinch interactions possible even while the JS thread is busy with something else — the two libraries are usually adopted together specifically because gesture handling and the animation responding to it both need to escape the JS thread's variable load to feel consistently smooth.</p>"
},
{
  "id": "b28-02",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "SafeAreaView and notch handling — why hardcoded padding breaks on new devices.",
  "difficulty": "Mid",
  "tags": ["SafeAreaView", "Notch", "Responsive Design", "Platform, Tooling & Security"],
  "question": "Why does a hardcoded top padding value for status-bar clearance inevitably break, and what does SafeAreaView (or react-native-safe-area-context) actually solve?",
  "answer": "<p>The notch/status-bar height, the home-indicator area at the bottom, and rounded-corner insets all vary by device model and orientation — a value hand-tuned against one iPhone or one Android device is wrong the moment the app runs on a device with a different notch shape, a punch-hole camera, a taller status bar, or gets rotated to landscape where the safe insets shift to the sides instead of top/bottom.</p>\n      <p><code>react-native-safe-area-context</code> (the maintained, more flexible successor to the built-in <code>SafeAreaView</code>) queries the actual device's safe-area insets at runtime via native APIs and exposes them as values your layout can use directly — either wrapping content in the provided <code>SafeAreaView</code> component, or reading the raw inset values via <code>useSafeAreaInsets()</code> when you need finer control than a simple wrapping component gives you (say, applying the inset to just one edge of a custom header). The practical rule: never hardcode a clearance value that's meant to avoid the notch/status bar/home indicator — always derive it from the actual device's reported insets, since the alternative is a layout that's correct on the one device you tested and subtly broken everywhere else.</p>"
},
{
  "id": "b28-03",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "KeyboardAvoidingView — why it works differently (and worse) on Android by default.",
  "difficulty": "Mid",
  "tags": ["KeyboardAvoidingView", "Keyboard Handling", "Platform, Tooling & Security"],
  "question": "KeyboardAvoidingView is supposed to keep an input visible above the keyboard, but the default setup often doesn't work well on Android. Why, and what's the actual fix?",
  "answer": "<p><code>KeyboardAvoidingView</code>'s <code>behavior</code> prop needs to be set per platform because iOS and Android handle keyboard-triggered layout adjustment fundamentally differently: iOS never resizes the app's window when the keyboard appears, so the app has to manually shift or resize its own content (<code>padding</code> or <code>position</code> behavior) to keep the focused input visible above the keyboard. Android, depending on the manifest's <code>windowSoftInputMode</code> setting, can automatically resize or pan the activity's window when the keyboard shows — which is why <code>behavior=\"height\"</code> (or sometimes no behavior at all, letting the native OS handle it) tends to work better on Android, while the iOS-style behaviors either do nothing useful or actively fight the OS's own resizing.</p>\n      <p>The practical setup: set <code>behavior</code> conditionally via <code>Platform.OS</code>, and equally important, get the Android manifest's <code>windowSoftInputMode</code> configured correctly (usually <code>adjustResize</code>) — a huge share of \"KeyboardAvoidingView doesn't work on Android\" reports trace back to the manifest setting being wrong, not the component itself, since the component's behavior is layered on top of whatever the OS-level manifest setting is already doing.</p>"
},
{
  "id": "b28-04",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Device-independent sizing in React Native — dp/pt units and pixel density.",
  "difficulty": "Mid",
  "tags": ["Responsive Design", "Pixel Density", "Platform, Tooling & Security"],
  "question": "React Native layout values (width: 100) aren't raw pixels. What are they actually, and why does that matter across devices with different screen densities?",
  "answer": "<p>A style value like <code>width: 100</code> is in density-independent points, not physical pixels — the same abstraction Android calls dp and iOS calls pt. A device with a higher pixel density (more physical pixels per inch) renders that same <code>100</code>-unit box using proportionally more actual pixels, so it occupies the same physical, visually-consistent size on screen regardless of the device's pixel density — without this abstraction, the same layout code would render dramatically different physical sizes across a cheap low-density phone and a high-density flagship.</p>\n      <p>The place this still needs deliberate handling: image assets, which are raster and do need multiple actual pixel-density versions (<code>@2x</code>, <code>@3x</code> suffixed files, matching iOS's and Android's own density-bucket conventions) so a crisp image is available at whatever density the device actually renders at — React Native's image loading picks the right density variant automatically based on the file naming convention, but only if those variants actually exist; providing just one low-density image and relying on the OS to upscale it produces a visibly blurry result on high-density screens.</p>"
},
{
  "id": "b28-05",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "React Native Testing Library — querying by role/text, not implementation detail.",
  "difficulty": "Mid",
  "tags": ["React Native Testing Library", "Testing", "Platform, Tooling & Security"],
  "question": "What's the actual philosophy behind React Native Testing Library's query methods, and why does testing by testID everywhere miss the point?",
  "answer": "<p>RNTL is deliberately built around querying the rendered tree the way a real user (or an accessibility service) would identify elements — by visible text, accessibility role, or accessibility label — rather than by internal implementation details like a component's display name or a hand-added testID on every single element. The stated philosophy is that a test coupled to implementation details breaks on a harmless refactor (renaming an internal prop, restructuring a component's internal JSX) even though the actual user-facing behavior didn't change at all — exactly the kind of false test failure that erodes trust in a test suite over time.</p>\n      <p><code>testID</code> still has a real, narrower place: for an element with no meaningful accessible text or role a user could actually identify it by — a bare icon button with no label, or a container element purely for layout — where querying by role/text genuinely isn't possible. Reaching for <code>testID</code> as the default query for everything defeats the actual point of the library, since it stops testing whether the feature is usable the way a real user or screen reader would encounter it, and just tests that a specific internal prop happens to exist.</p>"
},
{
  "id": "b28-06",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Snapshot testing in React Native — why it catches less than it looks like.",
  "difficulty": "Mid",
  "tags": ["Snapshot Testing", "Jest", "Testing", "Platform, Tooling & Security"],
  "question": "Snapshot tests feel like free regression coverage since they require almost no code. What's the actual failure mode that makes teams pull back from relying on them?",
  "answer": "<p>A snapshot test just serializes the rendered output and diffs it against a stored reference on every run — it doesn't encode any assertion about what's actually <em>correct</em>, only what changed. The failure mode that erodes trust: a snapshot breaks on nearly every intentional change (a class name tweak, reordering two unrelated props, a minor copy edit), and developers under time pressure get trained to reflexively run the \"update snapshots\" command without carefully reading the diff — at which point the test suite is green but isn't actually verifying anything meaningful, since a genuinely broken change gets rubber-stamped the same way a harmless one does.</p>\n      <p>The practical guidance most teams converge on: use snapshot tests sparingly, for components whose exact structure is genuinely worth pinning down and rarely changes (a design-system primitive), and prefer explicit behavioral assertions (\"clicking this button calls this handler,\" \"this text is visible after this state change\") for everything else — an explicit assertion fails only when the specific behavior it checks actually breaks, which is a far more reliable signal than a snapshot diff a reviewer has to manually judge as intentional or not.</p>"
},
{
  "id": "b28-07",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Maestro vs Detox — the actual tradeoff for end-to-end testing.",
  "difficulty": "Senior",
  "tags": ["Maestro", "Detox", "E2E Testing", "Platform, Tooling & Security"],
  "question": "Maestro has become a popular alternative to Detox for React Native E2E testing. What's the actual architectural difference, and when does each still win?",
  "answer": "<p>Detox is gray-box: it hooks into the app's own runtime (via a native library linked into the app itself) to know exactly when the app is idle — no pending network requests, animations, or JS work — before proceeding to the next test step, which gives it strong built-in synchronization against flakiness, but requires that native instrumentation to be correctly linked into every build under test, and can be genuinely fiddly to set up and keep working across native dependency upgrades.</p>\n      <p>Maestro is black-box: it drives the app purely through the accessibility tree and screen content from the outside, with no code linked into the app at all, using its own heuristics (polling, configurable waits) for synchronization instead of Detox's deep runtime hooks. That makes it dramatically simpler to adopt (no native build changes required, works against a plain release build) and its YAML-based test format is far more approachable for someone without a JS testing background to write and read — at the cost of Detox's stronger automatic synchronization guarantees against a genuinely flaky, animation-heavy app. The practical split: Maestro's simplicity wins for most teams' day-to-day E2E coverage; Detox's deeper hooks still earn their setup cost for an app with complex timing-sensitive flows where black-box heuristic waiting isn't reliable enough.</p>"
},
{
  "id": "b28-08",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Codegen for TurboModules and Fabric components — what it actually generates and why.",
  "difficulty": "Senior",
  "tags": ["Codegen", "TurboModules", "Fabric", "Platform, Tooling & Security"],
  "question": "The New Architecture requires a codegen step for TurboModules and Fabric components. What does that codegen actually produce, and why can't you just hand-write the native binding?",
  "answer": "<p>You declare a TurboModule's or Fabric component's interface once, in TypeScript (or Flow), as the single source of truth for its shape — method signatures, prop types, return types. Codegen reads that spec and generates the actual native interface code on both platforms (C++/Objective-C++ glue for iOS, Java/Kotlin interfaces for Android) that JSI needs to bind the JS-side call directly to the native implementation, plus the type-checking scaffolding that catches a mismatch between what JS calls and what native actually implements.</p>\n      <p>Hand-writing that native binding code for every module was exactly the error-prone, easy-to-drift-out-of-sync burden the old bridge architecture carried — a JS-side call signature and its native implementation could silently diverge, surfacing as a runtime crash or a silently wrong argument rather than a build-time error. Generating it from one declared spec means the JS and native sides can never drift apart without codegen itself failing to produce matching code, and it's also what gives JSI's direct, synchronous native calls their type safety — the generated interface is what the JS runtime actually calls into, not a loosely-typed bridge message.</p>"
},
{
  "id": "b28-09",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Writing a native module in Swift vs Objective-C — what actually changed with the New Architecture.",
  "difficulty": "Senior",
  "tags": ["Swift", "Objective-C", "Native Modules", "Platform, Tooling & Security"],
  "question": "Can you write a React Native iOS native module in Swift, and what's different about doing that under the New Architecture versus the old bridge?",
  "answer": "<p>Under the legacy bridge, a native module could be written in Swift, but it needed an Objective-C bridging header exposing it to the bridge's Objective-C-based registration mechanism — Swift itself was never the bridge's native language, it was always interoperating through that Objective-C layer, which added a real if small amount of ceremony (an <code>@objc</code>-annotated class, a separate <code>.m</code> file registering it).</p>\n      <p>Under the New Architecture, TurboModules are specified and codegen'd from a TypeScript spec, and the generated native interface is C++, which both Objective-C++ and Swift can conform to — Swift support has matured specifically because JSI's C++ core doesn't force everything through the Objective-C runtime the way the old bridge's registration mechanism did, though the practical ergonomics of writing a TurboModule in Swift still lag slightly behind Objective-C++ in tooling maturity as the ecosystem catches up. The real interview-relevant point: the choice of implementation language on iOS was never really about the bridge forcing Objective-C — it's about which language interoperates most smoothly with whatever native SDK the module is wrapping, and Swift is now a fully legitimate, increasingly first-class choice either way.</p>"
},
{
  "id": "b28-10",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Writing a native module in Kotlin vs Java — the same interop question, on Android.",
  "difficulty": "Mid",
  "tags": ["Kotlin", "Java", "Native Modules", "Platform, Tooling & Security"],
  "question": "Does React Native's Android native-module story favor Java or Kotlin, and does it matter which you pick for a new module?",
  "answer": "<p>React Native's Android native module APIs were originally Java-first, but Kotlin has full first-class support today, including in the official templates and documentation — a new native module written in Kotlin isn't a second-class or unsupported path, it's the more common choice for new code, matching where the broader Android ecosystem itself has settled.</p>\n      <p>The interop consideration that actually matters: a native module frequently needs to call into the rest of the app's existing native codebase (shared business logic, an existing SDK integration), and Kotlin and Java interoperate with each other essentially seamlessly on the JVM — so the real deciding factor is usually which language the surrounding native Android codebase is already written in, not any difference in what React Native's own APIs support. For a genuinely new module with no existing native code to match, Kotlin's more concise syntax and null-safety are the same reasons it's become the default for new Android code generally, React Native modules included.</p>"
},
{
  "id": "b28-11",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Requesting camera/location permissions consistently across iOS and Android.",
  "difficulty": "Mid",
  "tags": ["Permissions", "iOS", "Android", "Platform, Tooling & Security"],
  "question": "Why isn't a single cross-platform permission-request call enough, and what does each platform actually require separately?",
  "answer": "<p>Both platforms gate sensitive permissions (camera, location, contacts, notifications) behind an explicit runtime request the user must approve, but the required declarations and the request flow differ underneath: iOS requires a usage-description string declared in <code>Info.plist</code> for each permission type (<code>NSCameraUsageDescription</code>, say) — shown to the user in the system permission dialog — and requesting a permission with no matching Info.plist entry crashes the app outright rather than failing gracefully. Android requires the permission declared in the manifest plus, for dangerous-level permissions, an explicit runtime request call, and additionally has its own nuance for location specifically — a separate, harder-to-get \"background location\" permission tier beyond basic foreground access, requiring its own justification and (for apps in Google Play) a review process.</p>\n      <p>A cross-platform permissions library (like <code>react-native-permissions</code>) unifies the JS-facing API for checking and requesting, but doesn't remove the need to correctly configure both platforms' native declarations yourself — skipping the Info.plist string is one of the single most common \"works on Android, crashes instantly on iOS\" bugs in RN apps, precisely because nothing in JS surfaces that misconfiguration until the permission is actually requested on a real device.</p>"
},
{
  "id": "b28-12",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Biometric authentication (Face ID / fingerprint) — what the app can and can't actually verify.",
  "difficulty": "Senior",
  "tags": ["Biometrics", "Face ID", "Security", "Platform, Tooling & Security"],
  "question": "When you call a biometric-auth library in React Native, what is the app actually being told, and what security guarantee does (and doesn't) that give you?",
  "answer": "<p>A biometric prompt (Face ID, fingerprint) runs entirely inside the platform's secure hardware/OS layer — your app code never sees the actual biometric data, and the API returns a simple success/failure result. That's a UX convenience layer, not by itself a cryptographic guarantee tied to anything: a plain success/fail check can, on some implementations, be more easily spoofed or bypassed on a compromised device than developers assume, since it's just a boolean the app trusts.</p>\n      <p>The stronger pattern, matching how a mobile-architect-level security review would frame it: bind the biometric check to unlocking a cryptographic key stored in the platform's hardware-backed keystore (Android Keystore, iOS Secure Enclave via Keychain), rather than treating a bare boolean result as sufficient authorization for something sensitive (approving a payment, unlocking a stored credential). With that binding, a device without the correct biometric genuinely cannot access the key material at the hardware level — the security guarantee lives in the hardware-backed key, with biometric success merely being the gate that unlocks access to it, not the security boundary itself.</p>"
},
{
  "id": "b28-13",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Embedding a WebView — the security risks a naive integration misses.",
  "difficulty": "Senior",
  "tags": ["WebView", "Security", "postMessage", "Platform, Tooling & Security"],
  "question": "You need to embed a web page inside a React Native screen via WebView. What security risks does a naive integration miss?",
  "answer": "<p>A WebView loading arbitrary or third-party content shares none of React Native's own sandboxing assumptions — it's a real browser engine capable of running arbitrary JavaScript, and a naive setup with JavaScript injection enabled and no origin restriction lets any page it navigates to (including one reached via a redirect from the original trusted URL) execute code with access to whatever bridge you've exposed via <code>postMessage</code>, potentially including anything sensitive that bridge was built to expose to your <em>own</em> trusted content specifically.</p>\n      <p>Hardening it for anything beyond a fully-trusted, fully-controlled internal page: restrict navigation to an explicit allowlist of origins (many WebView libraries support an <code>originWhitelist</code> or equivalent, rejecting navigation to anything outside it, including via redirect); never expose a <code>postMessage</code> bridge with sensitive capabilities (auth tokens, native API access) to content you don't fully control and trust; and disable JavaScript injection entirely if the embedded content is purely static/read-only and doesn't need it. The general principle: a WebView is effectively a second, less-sandboxed execution environment nested inside your app, and every bridge connecting it back to native capability is a real attack surface proportional to what that bridge can actually do.</p>"
},
{
  "id": "b28-14",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "In-app purchase architecture — why you can't just trust the client's 'purchase succeeded'.",
  "difficulty": "Senior",
  "tags": ["In-App Purchases", "RevenueCat", "Billing", "Platform, Tooling & Security"],
  "question": "How do you architect in-app purchases in React Native so a user can't just fake unlocking premium content?",
  "answer": "<p>The purchase flow itself (presenting the native store's payment sheet, handling the transaction) has to go through each platform's own billing API (StoreKit on iOS, Google Play Billing on Android) — there's no cross-platform way around that, since app stores require purchases to flow through their own billing systems, both for policy compliance and because that's the only path that produces a store-signed receipt. A client-side \"purchase succeeded\" callback firing is not, by itself, proof of a legitimate purchase — a modified client, or a purchase later refunded through the store, can leave the app's local state saying \"unlocked\" indefinitely if nothing double-checks it.</p>\n      <p>The correct architecture verifies the purchase server-side: the client sends the store-issued receipt/token to your backend, which validates it directly against Apple's/Google's server-to-server verification APIs before actually granting entitlement, and re-checks periodically (or via the store's own server notifications for renewals/refunds/cancellations) so an unlocked feature reflects the purchase's <em>current</em> real status, not just its state at the moment of purchase. Services like RevenueCat exist specifically to abstract this cross-platform verification and entitlement-tracking complexity, since hand-rolling correct receipt validation against both stores' APIs, including subscription renewal and refund edge cases, is a genuinely large and easy-to-get-subtly-wrong undertaking most teams reasonably outsource.</p>"
},
{
  "id": "b28-15",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "React Native cold-start optimization beyond enabling Hermes.",
  "difficulty": "Senior",
  "tags": ["Cold Start", "Performance", "Hermes", "Platform, Tooling & Security"],
  "question": "Hermes is already enabled and cold start is still slow. What else actually moves the needle on app launch time?",
  "answer": "<p>Beyond Hermes's precompiled bytecode, the next biggest lever is deferring work that doesn't need to happen before the first screen is interactive: initializing every SDK (analytics, crash reporting, a chat widget) synchronously and eagerly at app start blocks the first paint on work the user doesn't actually need yet — deferring non-critical SDK initialization until just after the first screen renders (or lazily, on first actual use) is a common, high-leverage fix that costs little engineering effort.</p>\n      <p>Beyond that: minimizing what runs inside the app's root component before the first navigation/screen mount (heavy synchronous computation, large synchronous storage reads at startup should move to async or be deferred), enabling Android's App Startup library or equivalent to control initialization order explicitly rather than relying on whatever order content providers happen to initialize in, and profiling with the platform's own native startup tools (Android's Macrobenchmark, iOS's Instruments App Launch template) rather than guessing — a surprising share of \"RN app is slow to start\" investigations find the actual bottleneck is a specific unnecessary synchronous native SDK call, not React Native's own bridge/JS-execution overhead at all.</p>"
},
{
  "id": "b28-16",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Handling orientation changes without a jarring layout jump.",
  "difficulty": "Mid",
  "tags": ["Orientation", "Responsive Design", "Platform, Tooling & Security"],
  "question": "An app supports both portrait and landscape. What actually needs to change architecturally to avoid a jarring layout jump on rotation?",
  "answer": "<p>The trap is hardcoding layout based on a fixed assumption about which dimension is wider — a two-column layout hardcoded to \"left column is 300px, right column takes the rest\" looks fine in landscape and badly cramped in portrait, or vice versa. The fix is driving layout decisions from <code>useWindowDimensions()</code> (which reactively updates on rotation, unlike a one-time <code>Dimensions.get('window')</code> read at mount) so the component actually re-renders with new width/height values the moment orientation changes, rather than keeping stale dimensions until the next unrelated re-render happens to occur.</p>\n      <p>The layout logic itself should key off the actual aspect ratio or width/height comparison rather than an explicit \"is this portrait or landscape\" flag baked in once — a genuinely responsive layout (using Flexbox proportions, not fixed pixel widths, for anything that should adapt) handles a rotation as just another width/height change to reflow around, the same way it would handle running on a differently-sized device, rather than needing special-cased orientation-specific code paths at all.</p>"
},
{
  "id": "b28-17",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Accessibility in React Native — beyond alt text, what a screen reader actually needs.",
  "difficulty": "Senior",
  "tags": ["Accessibility", "Screen Reader", "Platform, Tooling & Security"],
  "question": "What does making a React Native app genuinely usable with a screen reader (VoiceOver/TalkBack) actually require, beyond adding accessibilityLabel to images?",
  "answer": "<p>A screen reader navigates the app's accessibility tree, not its visual layout — a custom touchable built from a plain <code>View</code> with an <code>onPress</code> and no <code>accessibilityRole</code> is, to a screen reader, an unlabeled, unidentified region rather than a recognizable \"button,\" so a sighted developer testing only visually will never notice it's effectively invisible to a screen-reader user. Setting <code>accessibilityRole=\"button\"</code>, a meaningful <code>accessibilityLabel</code>, and where relevant <code>accessibilityState</code> (disabled, selected, checked) on custom interactive components is what actually restores the semantic information a native button/checkbox/switch would have provided for free.</p>\n      <p>The parts that get missed even by teams that do label individual elements: focus order and grouping — a screen reader reads elements in the order they appear in the accessibility tree, which can diverge from visual order if the layout uses absolute positioning or a reordered flex direction, producing a confusing reading order; and dynamic content announcements — a value that updates without a full screen change (a live error message, a loading-to-loaded transition) needs an explicit <code>accessibilityLiveRegion</code> (Android) or equivalent so VoiceOver/TalkBack actually announces the change, since a screen reader has no way to notice a silent DOM-equivalent update on its own. The only reliable way to catch these is testing with the actual screen reader enabled, not just checking that labels are present in code.</p>"
},
{
  "id": "b28-18",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Choosing an i18n library for React Native — i18next vs react-intl vs a hand-rolled solution.",
  "difficulty": "Mid",
  "tags": ["i18n", "i18next", "react-intl", "Platform, Tooling & Security"],
  "question": "What's the actual decision between i18next, react-intl, and rolling your own translation lookup for a React Native app?",
  "answer": "<p>A hand-rolled solution (a flat key-to-string object per language, looked up manually) is genuinely fine for a small app with simple strings and no pluralization complexity — it's less dependency weight for a job that's actually simple. It breaks down the moment real localization complexity shows up: pluralization rules that vary by language (some languages have more than two plural forms), interpolating variables into a translated string safely, and lazy-loading only the current language's translation bundle rather than shipping every supported language's strings in the initial bundle.</p>\n      <p>i18next is the more full-featured, broadly-adopted choice — plugin ecosystem for lazy-loading language bundles, robust pluralization and interpolation, and a large community means most edge cases (date/number formatting per locale, nested translation keys) have an established pattern already. react-intl (built on the ICU message format) leans on the same standardized ICU pluralization/formatting rules used across many platforms, which is attractive specifically if the same message-format conventions are already used in a companion web app for consistency. The practical decision usually comes down to team familiarity and whether a companion web app's i18n choice should be mirrored for shared translation-file tooling, more than either library's raw feature set — both are mature enough to handle real localization needs correctly.</p>"
},
{
  "id": "b28-19",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Rendering a very large list without blocking the JS thread.",
  "difficulty": "Senior",
  "tags": ["FlatList", "Performance", "Large Lists", "Platform, Tooling & Security"],
  "question": "A screen needs to render thousands of items. Beyond just using FlatList/FlashList instead of map + ScrollView, what else actually matters?",
  "answer": "<p>List virtualization (rendering only the visible items plus a small buffer, recycling views as the user scrolls) is necessary but not sufficient on its own — if each individual row's render function is itself expensive (complex nested layout, an unmemoized computation run per row), scrolling still stutters because virtualization only limits <em>how many</em> rows render at once, not how expensive each one is. Wrapping each row component in <code>React.memo</code> (with a stable, correctly-compared set of props — the same shallow-equality caveat as any other memoization) prevents rows that haven't actually changed from re-rendering just because the parent list re-rendered for an unrelated reason.</p>\n      <p>Tuning the virtualization windowing itself matters too: <code>getItemLayout</code> (when every row has a known, fixed height) lets the list skip an expensive measurement pass and jump directly to any scroll position, and <code>windowSize</code>/<code>maxToRenderPerBatch</code> tuning trades memory for scroll smoothness — a larger window renders more offscreen buffer for smoother fast-scrolling at the cost of more memory and more rows kept alive. And for data flowing in from a slow source, rendering against a value wrapped in <code>useDeferredValue</code> keeps the list from blocking urgent interactions (like the scroll gesture itself) while a large re-filter or re-sort catches up in the background.</p>"
},
{
  "id": "b28-20",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Flipper vs the newer React Native DevTools — what each actually shows you.",
  "difficulty": "Mid",
  "tags": ["Flipper", "DevTools", "Debugging", "Platform, Tooling & Security"],
  "question": "React Native moved away from Flipper as the default debugging tool. What does the newer built-in React Native DevTools give you, and what does Flipper still cover that it doesn't?",
  "answer": "<p>The newer React Native DevTools (built on Chrome DevTools' own protocol, integrated more directly with Hermes) gives fast, reliable JS-side debugging — breakpoints, the React DevTools component tree and profiler, console output, and network inspection — with a much simpler setup than Flipper needed, and crucially without the plugin-compatibility fragility that made Flipper a frequent source of its own tooling bugs across RN and OS version upgrades.</p>\n      <p>What Flipper still covers, and why some teams keep it installed for specific investigations: native-side inspection — a native layout inspector showing the actual native view hierarchy Fabric produced (not just the React component tree), native crash/log viewers, and platform-specific native plugins (an app's own custom native debugging tools built as Flipper plugins). The practical split: React Native DevTools is now the right default for everyday JS-side debugging most developers need daily, while Flipper (or the platform's own native tools — Xcode/Android Studio directly) remains the right reach for genuinely native-layer investigation Chrome DevTools' protocol was never designed to see into.</p>"
},
{
  "id": "b28-21",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Nitro Modules — the next step past codegen'd TurboModules.",
  "difficulty": "Senior",
  "tags": ["Nitro Modules", "Codegen", "Performance", "Platform, Tooling & Security"],
  "question": "What problem do Nitro Modules (and similar next-generation codegen tools) address that standard TurboModules still leave on the table?",
  "answer": "<p>TurboModules already replaced the old bridge's JSON-serialized async messaging with direct JSI-based native calls, but the codegen and calling convention still carry some overhead per call — argument marshaling through the generated interface layer, and in some cases still going through a level of indirection that a hand-optimized direct C++ binding could skip. For a module doing high-frequency calls (a real-time signal-processing pipeline, a frame-by-frame camera filter), that remaining per-call overhead is exactly what shows up as a measurable bottleneck at high call volume.</p>\n      <p>Nitro Modules and similar tools push further toward near-zero-overhead native calls by generating even more direct C++ bindings with less runtime marshaling, plus stronger, more ergonomic type-safety across the JS/native boundary derived from the same single TypeScript spec. The practical takeaway for most apps: this class of optimization matters for a genuinely hot, high-frequency native call path, not for typical native-module usage (a one-off native API call, an occasional SDK integration) where standard TurboModules' overhead is already negligible relative to the actual work being done — reaching for the newest codegen tooling should follow a measured bottleneck, not a default upgrade.</p>"
},
{
  "id": "b28-22",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Offline-first local databases — WatermelonDB/Realm vs plain AsyncStorage/MMKV.",
  "difficulty": "Senior",
  "tags": ["WatermelonDB", "Realm", "Offline-First", "Platform, Tooling & Security"],
  "question": "When does an app need a real embedded database (WatermelonDB, Realm) instead of just AsyncStorage or MMKV for local data?",
  "answer": "<p>Key-value storage (AsyncStorage, MMKV) is right for exactly what its name says — simple, independent key-value pairs: auth tokens, user preferences, feature flags. It has no query capability at all — finding \"every order over $50 from the last week\" against a key-value store means loading and manually filtering everything yourself in JS, which stops scaling the moment the dataset is more than trivially small.</p>\n      <p>An embedded database (WatermelonDB, built specifically for React Native's performance constraints with lazy loading and observable queries; Realm, a broader cross-platform mobile database) gives you real indexed queries, relationships between records, and — critically for offline-first apps — a structured way to track local mutations pending sync versus already-synced state, which a flat key-value store gives you no scaffolding for at all. The decision point is genuinely about data shape and query needs, not raw data volume: an app storing thousands of simple, independent preference flags is still fine with MMKV; an app that needs to query, relate, and offline-sync structured records (a todo list, a catalog, a messaging history) needs the querying and relational capability only a real embedded database provides.</p>"
},
{
  "id": "b28-23",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Handling AppState transitions — what actually needs to happen on background/foreground.",
  "difficulty": "Mid",
  "tags": ["AppState", "Lifecycle", "Platform, Tooling & Security"],
  "question": "What actually needs to happen when an app moves to the background and back to the foreground, and how do you hook into that with AppState?",
  "answer": "<p>The <code>AppState</code> API's <code>change</code> event fires with the app's current status (<code>active</code>, <code>background</code>, and on iOS specifically <code>inactive</code> as a brief transitional state — a phone call interruption, the app switcher appearing) — subscribing to it is how a component knows to react to the app actually leaving or returning to the foreground, something a component has no other way to detect on its own since normal React lifecycle events don't fire for OS-level app-state transitions.</p>\n      <p>The concrete things this typically drives: pausing expensive or battery-costly work when backgrounded (a video player, a location-tracking poll, a WebSocket connection that can be safely torn down and reopened rather than held while backgrounded) and specifically refreshing potentially-stale data when the app returns to foreground after being backgrounded for a while — a session token that might have expired, a data feed that's now out of date, a lock-screen check for a sensitive app that should re-require authentication after being backgrounded past some threshold. Getting this wrong in either direction has a real cost: not pausing background work drains battery and burns resources for no user-visible benefit; not refreshing on foreground shows stale data the user has no way to know is stale.</p>"
},
{
  "id": "b28-24",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "Native dependency conflicts — when a Swift Package Manager and CocoaPods dependency collide.",
  "difficulty": "Senior",
  "tags": ["CocoaPods", "Swift Package Manager", "Dependency Management", "Platform, Tooling & Security"],
  "question": "React Native's iOS side is historically CocoaPods-based, but some native SDKs now ship only via Swift Package Manager. What actually happens when both need to coexist, and how do you resolve a conflict?",
  "answer": "<p>CocoaPods and Swift Package Manager are two entirely separate dependency-resolution and build-integration systems, each with its own idea of how a library is fetched, versioned, and linked into the Xcode project — they don't share a dependency graph or deduplicate transitive dependencies between them, so if both happen to pull in different versions of the same underlying library (a common analytics SDK's core, say) as a transitive dependency, the build can end up with genuinely conflicting symbol definitions or duplicate-framework link errors that neither tool is aware the other caused.</p>\n      <p>React Native's own build tooling (autolinking) is built around CocoaPods, so the pragmatic default for most teams is still routing new native dependencies through CocoaPods where a pod exists, and reaching for SPM specifically only for a library that's genuinely SPM-only with no CocoaPods distribution — accepting that mixing both in one project needs careful attention to transitive version conflicts, and in a genuinely thorny case, vendoring a manually-pinned version of the conflicting shared dependency to force both paths onto the same resolved version rather than letting each tool resolve it independently.</p>"
},
{
  "id": "b28-25",
  "category": "react-native",
  "categoryName": "React Native",
  "topic": "Platform, Tooling & Security",
  "title": "A React Native monorepo for multiple apps sharing code — the actual setup decisions.",
  "difficulty": "Senior",
  "tags": ["Monorepo", "Nx", "Turborepo", "Platform, Tooling & Security"],
  "question": "You have two React Native apps (say, a consumer app and a driver app) sharing a meaningful amount of code. What actually needs deciding when setting this up as a monorepo?",
  "answer": "<p>The core structural decision is what's shared as versioned internal packages versus what stays app-specific: UI components, API client code, and business logic that's genuinely identical across both apps become their own packages (<code>@company/ui</code>, <code>@company/api-client</code>) that both apps depend on, while navigation structure, app-specific screens, and anything genuinely divergent between the two apps' purposes stays in each app's own directory — the temptation to over-share everything \"to avoid duplication\" tends to produce shared packages riddled with conditional logic branching by which app is consuming them, which is worse than accepting some genuine duplication between two apps whose needs are actually different.</p>\n      <p>The tooling decision (Nx, Turborepo, or a plain Yarn/npm/pnpm workspace) mostly comes down to how much you need incremental, cached builds and task orchestration across packages versus a simpler workspace setup — a small two-app monorepo can often get by with plain workspaces and a couple of scripts, while a monorepo growing to many apps and shared packages benefits from Turborepo/Nx's caching and dependency-graph-aware task running so a change to one shared package doesn't force rebuilding everything from scratch. Native-side complexity is the part that doesn't parallel a JS monorepo cleanly: two RN apps still each need their own separate native iOS/Android projects, even when sharing most of the JS — the monorepo tooling manages the JS package graph, not the native build graph, which stays genuinely per-app.</p>"
}
);
