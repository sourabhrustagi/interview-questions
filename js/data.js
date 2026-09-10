// TechPrep Matrix - Comprehensive Interview Question Data Bank
const QUESTION_DATA = [
  // ==========================================
  // 1. ANDROID
  // ==========================================
  {
    id: "android-01",
    category: "android",
    categoryName: "Android",
    topic: "Jetpack Compose & Architecture",
    title: "How does Recomposition work in Jetpack Compose, and how do you optimize it?",
    difficulty: "Senior",
    tags: ["Jetpack Compose", "Recomposition", "Performance", "Kotlin"],
    question: "Explain the mechanics of Recomposition in Jetpack Compose. What triggers it, how does Compose decide which composables to skip, and what best practices should you follow to prevent unnecessary recompositions?",
    answer: `
      <p><strong>Recomposition</strong> is the process where Jetpack Compose re-executes composable functions in response to state changes to update the UI tree.</p>
      <h4>Mechanics of Recomposition:</h4>
      <ul>
        <li><strong>State Reading:</strong> Compose tracks state reads (e.g., <code>State&lt;T&gt;</code>) inside composable scopes during the composition phase.</li>
        <li><strong>Smart Recomposition:</strong> When a state value changes, Compose invalidates only the composable functions that read that specific state value, skipping unchanged parent or sibling composables.</li>
        <li><strong>Skipping Conditions:</strong> A composable can be skipped if:
          <ol>
            <li>All parameters are <strong>Stable</strong> or <strong>Immutable</strong>.</li>
            <li>None of the input parameters have changed (via <code>equals()</code> check).</li>
          </ol>
        </li>
      </ul>
      <h4>Optimization Techniques:</h4>
      <ul>
        <li><strong>Use Stable Data Types:</strong> Mark data classes with <code>@Stable</code> or <code>@Immutable</code> if Compose cannot infer stability automatically (e.g., when using standard Kotlin collections like <code>List&lt;T&gt;</code>). Alternatively, use Immutable Collections (<code>kotlinx.collections.immutable</code>).</li>
        <li><strong>Defer State Reads:</strong> Read state as late as possible. Pass lambdas (e.g., <code>{ scrollOffset }</code>) instead of raw values into child modifiers like <code>Modifier.offset { ... }</code>.</li>
        <li><strong>Use <code>derivedStateOf</code>:</strong> Wrap high-frequency state updates (like scroll positions or search query filtering) in <code>derivedStateOf</code> to trigger recomposition only when the computed result changes.</li>
        <li><strong>Remember Lambdas & Keys:</strong> Use <code>remember { ... }</code> for closures passed as callbacks and provide explicit keys in <code>LazyColumn</code> items.</li>
      </ul>
    `,
    codeLanguage: "kotlin",
    code: `// Optimizing Recomposition with derivedStateOf and Lambda Modifiers

@Composable
void ScrollToTopButton(listState: LazyListState, onClick: () -> Unit) {
    // 1. derivedStateOf prevents button recomposition on every single pixel scroll
    val showButton by remember {
        derivedStateOf { listState.firstVisibleItemIndex > 5 }
    }

    if (showButton) {
        Button(onClick = onClick) {
            Text("Top")
        }
    }
}

// 2. Stable Wrapper for Collections
@Immutable
data class UserListState(
    val users: ImmutableList<User> = persistentListOf()
)`,
    keyTakeaways: [
      "Compose tracks state reads per scope, invalidating only reading scopes.",
      "@Stable / @Immutable annotations help Compose skip composable functions.",
      "derivedStateOf buffers high-frequency state updates.",
      "Defer state reading by passing lambda state getters into modifiers."
    ],
    followUp: "How do Layout Inspector and Compose Compiler Metrics report unstable classes in your build?"
  },
  {
    id: "android-02",
    category: "android",
    categoryName: "Android",
    topic: "Coroutines & Concurrency",
    title: "Difference between launch and async, and Structured Concurrency principles",
    difficulty: "Mid",
    tags: ["Kotlin", "Coroutines", "Concurrency", "Flow"],
    question: "What is Structured Concurrency in Kotlin Coroutines? Compare `launch` vs `async` builders, and explain how failure propagates in a `CoroutineScope` vs `supervisorScope`.",
    answer: `
      <p><strong>Structured Concurrency</strong> ensures that new coroutines are launched within a specific <code>CoroutineScope</code>, linking child lifecycle to parent lifecycle and ensuring no coroutines are leaked.</p>
      <h4>Launch vs Async:</h4>
      <ul>
        <li><code>launch</code>: Fires and forgets. Returns a <code>Job</code>. Exceptions thrown inside are uncaught and immediately propagate up the parent scope hierarchy.</li>
        <li><code>async</code>: Expects a result. Returns a <code>Deferred&lt;T&gt;</code>. Exceptions are encapsulated inside the <code>Deferred</code> object and thrown when <code>.await()</code> is called (though in a standard <code>coroutineScope</code>, child failures still cancel the parent immediately!).</li>
      </ul>
      <h4>Failure Propagation:</h4>
      <ul>
        <li><strong>Standard <code>coroutineScope</code>:</strong> If any child coroutine fails with an exception (other than CancellationException), it cancels its parent and all sibling coroutines.</li>
        <li><strong><code>supervisorScope</code> / <code>SupervisorJob</code>:</strong> A child's failure does not cancel other children or the parent scope. Useful for independent background operations like downloading multiple thumbnails.</li>
      </ul>
    `,
    codeLanguage: "kotlin",
    code: `// Using supervisorScope to run parallel independent tasks safely
suspend fun fetchDashboardData(): DashboardResult = supervisorScope {
    val userDeferred = async { fetchUserProfile() } // May fail
    val notificationsDeferred = async { fetchNotifications() }

    val user = try {
        userDeferred.await()
    } catch (e: Exception) {
        User.Guest
    }
    
    val notifications = try {
        notificationsDeferred.await()
    } catch (e: Exception) {
        emptyList()
    }

    DashboardResult(user, notifications)
}`,
    keyTakeaways: [
      "Structured concurrency prevents background memory & thread leaks.",
      "launch returns Job (fire & forget); async returns Deferred (value provider).",
      "supervisorScope isolates child exceptions so sibling jobs aren't cancelled."
    ],
    followUp: "Why doesn't catching an exception inside async prevent parent cancellation when using coroutineScope?"
  },
  {
    id: "android-03",
    category: "android",
    categoryName: "Android",
    topic: "Architecture & Memory",
    title: "Android Memory Leaks: Common causes and LeakCanary detection",
    difficulty: "Senior",
    tags: ["Memory Leak", "Garbage Collection", "LeakCanary", "Android Internals"],
    question: "How do memory leaks occur in Android applications? Name 4 common scenarios and explain how to prevent and diagnose them using LeakCanary.",
    answer: `
      <p>A <strong>Memory Leak</strong> occurs when an object is no longer needed by the app, but a persistent reference (from Garbage Collection root) prevents the Garbage Collector (GC) from reclaiming its memory.</p>
      <h4>Common Memory Leak Causes:</h4>
      <ol>
        <li><strong>Static Context References:</strong> Holding an <code>Activity</code> or <code>View</code> reference in a <code>static</code> singleton object.</li>
        <li><strong>Unregistered Observers / Listeners:</strong> Registering location listeners, broadcast receivers, or EventBus instances without unregistering them in <code>onCleared()</code> or <code>onDestroy()</code>.</li>
        <li><strong>Non-static Inner Classes / Anonymous Handlers:</strong> Implicitly holding a reference to the outer <code>Activity</code> class inside long-running background threads or <code>Handler</code> messages.</li>
        <li><strong>ViewBinding in Fragments:</strong> Failing to nullify <code>_binding = null</code> in <code>onDestroyView()</code> causes the layout view tree to remain referenced by the Fragment instance.</li>
      </ol>
      <h4>Prevention & Detection:</h4>
      <ul>
        <li>Use <strong>LeakCanary</strong> in debug builds to track retained instances after lifecycle callbacks.</li>
        <li>Pass <code>ApplicationContext</code> instead of <code>ActivityContext</code> to long-lived singletons.</li>
        <li>Use <code>viewModelScope</code> or <code>lifecycleScope</code> so background jobs auto-cancel on view destruction.</li>
      </ul>
    `,
    codeLanguage: "kotlin",
    code: `// Fragment ViewBinding Leak Prevention Pattern
class ProfileFragment : Fragment(R.layout.fragment_profile) {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        _binding = FragmentProfileBinding.bind(view)
        binding.title.text = "Hello World"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null // Critical to prevent memory leak!
    }
}`,
    keyTakeaways: [
      "Leaks happen when GC roots maintain references to destroyed UI contexts.",
      "Fragment binding must be cleared in onDestroyView().",
      "LeakCanary monitors WeakReference queues after lifecycle destructions."
    ],
    followUp: "How does LeakCanary inspect memory heap dumps automatically without freezing app UI indefinitely?"
  },

  // ==========================================
  // 2. FLUTTER
  // ==========================================
  {
    id: "flutter-01",
    category: "flutter",
    categoryName: "Flutter",
    topic: "Core Architecture & Rendering",
    title: "Widget vs Element vs RenderObject trees in Flutter",
    difficulty: "Senior",
    tags: ["Flutter Engine", "Widget Tree", "RenderObject", "Dart"],
    question: "Explain the three-tree architecture in Flutter (Widget Tree, Element Tree, and RenderObject Tree). How do they interact during hot reload and UI updates?",
    answer: `
      <p>Flutter achieves high performance and declarative simplicity by separating UI configuration from structural lifecycle and actual pixel rendering into three parallel trees:</p>
      <h4>1. Widget Tree:</h4>
      <ul>
        <li>Immutable configuration blueprints created by developers (e.g., <code>Container</code>, <code>Text</code>).</li>
        <li>Extremely lightweight, created and discarded constantly during rebuilds.</li>
      </ul>
      <h4>2. Element Tree:</h4>
      <ul>
        <li>The persistent glue that manages the lifecycle of widgets and holds UI state (<code>ComponentElement</code> for Composables, <code>RenderObjectElement</code> for layout nodes).</li>
        <li>Compares new Widget blueprints against old ones using <code>Widget.canUpdate(oldWidget, newWidget)</code> (checks <code>runtimeType</code> and <code>key</code>).</li>
      </ul>
      <h4>3. RenderObject Tree:</h4>
      <ul>
        <li>Mutable objects handling actual layout geometry, sizing, painting, and hit testing on the Skia / Impeller canvas.</li>
        <li>Instantiated and updated by <code>RenderObjectElement</code>s when properties change.</li>
      </ul>
      <h4>Rebuild Optimization:</h4>
      <p>When state updates occur, Flutter diffs the new Widget against the existing Element. If <code>canUpdate</code> returns true, the Element is reused and updates its existing <code>RenderObject</code> properties without rebuilding the heavy rendering tree!</p>
    `,
    codeLanguage: "dart",
    code: `// Widget.canUpdate implementation concept in Flutter framework
static bool canUpdate(Widget oldWidget, Widget newWidget) {
  return oldWidget.runtimeType == newWidget.runtimeType
      && oldWidget.key == newWidget.key;
}`,
    keyTakeaways: [
      "Widgets are lightweight immutable blueprints.",
      "Elements hold lifecycle, state, and manage diffing.",
      "RenderObjects compute layout, perform painting, and handle hit testing."
    ],
    followUp: "What happens when you change a widget's order in a list without assigning Keys?"
  },
  {
    id: "flutter-02",
    category: "flutter",
    categoryName: "Flutter",
    topic: "State Management",
    title: "Comparing Riverpod vs BLoC architecture in Flutter",
    difficulty: "Mid",
    tags: ["Riverpod", "BLoC", "State Management", "Dart"],
    question: "Compare Riverpod and BLoC state management solutions in Flutter. What are the key architectural differences, pros, and cons of each?",
    answer: `
      <p>Both <strong>Riverpod</strong> and <strong>BLoC (Business Logic Component)</strong> are popular state management paradigms in Flutter designed to separate UI from business logic.</p>
      <h4>BLoC / Cubit Architecture:</h4>
      <ul>
        <li><strong>Pattern:</strong> Event-driven unidirectional data flow using Rx/Streams (<code>Event -> BLoC -> State</code>).</li>
        <li><strong>Pros:</strong> Extremely strict predictable flow, easily testable event transitions, widely adopted in enterprise teams.</li>
        <li><strong>Cons:</strong> Verbose boilerplate code for simple state updates (requires Events, States, and BLoC classes).</li>
      </ul>
      <h4>Riverpod Architecture:</h4>
      <ul>
        <li><strong>Pattern:</strong> Compile-safe reactive state container system (evolution of Provider without <code>BuildContext</code> limits).</li>
        <li><strong>Pros:</strong> Zero BuildContext dependency for reading state, automatic object disposal, built-in async caching (<code>FutureProvider</code>, <code>StreamProvider</code>), compile-time error checking.</li>
        <li><strong>Cons:</strong> Can lead to global provider proliferation if not structured modularly.</li>
      </ul>
    `,
    codeLanguage: "dart",
    code: `// Riverpod Notifier Example
@riverpod
class Counter extends _$Counter {
  @override
  int build() => 0;

  void increment() => state++;
}

// Consuming in ConsumerWidget
class CounterView extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('Count: $count');
  }
}`,
    keyTakeaways: [
      "BLoC relies on stream events and explicit event-state mapping.",
      "Riverpod provides dependency injection and state management without BuildContext.",
      "Use BLoC for complex event logging/auditing; Riverpod for clean modern apps."
    ],
    followUp: "How does autoDispose work in Riverpod when a screen is popped off the navigator stack?"
  },

  // ==========================================
  // 3. SWIFTUI
  // ==========================================
  {
    id: "swiftui-01",
    category: "swiftui",
    categoryName: "SwiftUI",
    topic: "State & Data Flow",
    title: "@State vs @StateObject vs @ObservedObject vs @Binding",
    difficulty: "Mid",
    tags: ["SwiftUI", "State Management", "Swift", "iOS"],
    question: "Explain the differences between property wrappers @State, @StateObject, @ObservedObject, and @Binding in SwiftUI, and when to use each.",
    answer: `
      <p>SwiftUI uses property wrappers to establish declarative data dependencies between model data and views:</p>
      <h4>1. <code>@State</code></h4>
      <ul>
        <li>Used for simple, value-type private state local to a single view (e.g., toggle state, text fields).</li>
        <li>SwiftUI manages the storage of the value outside the view struct lifecycle.</li>
      </ul>
      <h4>2. <code>@StateObject</code></h4>
      <ul>
        <li>Used when creating and instantiating an <code>ObservableObject</code> class for the <strong>first time</strong> inside a view.</li>
        <li>SwiftUI guarantees the object remains alive and won't be recreated when parent views invalidate/re-render.</li>
      </ul>
      <h4>3. <code>@ObservedObject</code></h4>
      <ul>
        <li>Used when receiving an existing <code>ObservableObject</code> that was created elsewhere (e.g., passed from parent view).</li>
        <li><em>Warning:</em> Do NOT instantiate inside <code>@ObservedObject init()</code> because parent redraws will re-instantiate it!</li>
      </ul>
      <h4>4. <code>@Binding</code></h4>
      <ul>
        <li>Creates a two-way read/write binding reference to state owned by another view without duplicating state.</li>
      </ul>
    `,
    codeLanguage: "swift",
    code: `// SwiftUI Property Wrapper Usage Pattern
class UserViewModel: ObservableObject {
    @Published var name: String = "Alice"
}

struct ParentView: View {
    // Owner of ViewModel lifecycle
    @StateObject private var viewModel = UserViewModel()
    @State private var isEditing = false

    var body: some View {
        ChildView(viewModel: viewModel, isEditing: $isEditing)
    }
}

struct ChildView: View {
    // Receiver of ViewModel reference
    @ObservedObject var viewModel: UserViewModel
    @Binding var isEditing: Bool

    var body: some View {
        TextField("Name", text: $viewModel.name)
    }
}`,
    keyTakeaways: [
      "@State is for local value types owned by the view.",
      "@StateObject creates and preserves ObservableObject reference lifecycles.",
      "@ObservedObject receives external reference types.",
      "@Binding provides a two-way value bridge."
    ],
    followUp: "How does the new @Observable macro in Swift 5.9 replace ObservableObject and property wrappers?"
  },
  {
    id: "swiftui-02",
    category: "swiftui",
    categoryName: "SwiftUI",
    topic: "Swift Concurrency & Memory",
    title: "Actors, MainActor, and ARC Memory Leak Prevention in Swift",
    difficulty: "Senior",
    tags: ["Swift", "Actors", "Concurrency", "ARC", "SwiftUI"],
    question: "How do Swift Actors prevent data races? Explain `@MainActor` and how to avoid strong reference cycles (retain cycles) in async Swift closures.",
    answer: `
      <p>Swift 5.5+ structured concurrency introduced <strong>Actors</strong> to deliver compile-time thread safety for mutable state.</p>
      <h4>1. Actors & Data Race Prevention:</h4>
      <ul>
        <li>An <code>actor</code> is a reference type that protects its internal mutable state by serializing access through an isolated synchronization queue.</li>
        <li>External interactions with actor properties or methods must be asynchronous using <code>await</code>.</li>
      </ul>
      <h4>2. <code>@MainActor</code>:</h4>
      <ul>
        <li>A global actor that executes all code on the main thread/dispatch queue, essential for updating SwiftUI views and UIKit components safely.</li>
      </ul>
      <h4>3. Preventing ARC Retain Cycles in Closures:</h4>
      <ul>
        <li>Closures capture surrounding object references. If an object captures an async <code>Task</code> or closure that captures <code>self</code> strongly, a retain cycle occurs.</li>
        <li>Solution: Use <code>[weak self]</code> capture lists or unowned references when referencing <code>self</code> inside escape closures or task blocks.</li>
      </ul>
    `,
    codeLanguage: "swift",
    code: `// Actor definition & MainActor ViewModel
actor BankAccount {
    private(set) var balance: Double = 100.0

    func deposit(amount: Double) {
        balance += amount
    }
}

@MainActor
class WalletViewModel: ObservableObject {
    @Published var totalDisplay: String = "$0"
    private val account = BankAccount()

    func refreshBalance() {
        Task { [weak self] in
            // Asynchronously await actor state
            let current = await self?.account.balance ?? 0.0
            self?.totalDisplay = "$\\(current)"
        }
    }
}`,
    keyTakeaways: [
      "Actors serialize mutable state access preventing concurrent data races.",
      "@MainActor routes execution to the main UI thread.",
      "Use [weak self] inside Task closures to prevent memory retain cycles."
    ],
    followUp: "What is the difference between Task.detached and Task { } in SwiftUI view handlers?"
  },

  // ==========================================
  // 4. PROJECT MANAGEMENT
  // ==========================================
  {
    id: "pm-01",
    category: "project-management",
    categoryName: "Project Management",
    topic: "Agile & Delivery",
    title: "Handling Scope Creep and Managing Sprint Bottlenecks",
    difficulty: "Mid",
    tags: ["Agile", "Scrum", "Scope Creep", "Risk Management"],
    question: "Midway through a 2-week sprint, key stakeholders request a major critical feature change. How do you handle this scope change without compromising team morale or sprint stability?",
    answer: `
      <p>Handling scope changes gracefully requires balancing stakeholder expectations with sprint integrity and team velocity.</p>
      <h4>Step-by-Step Response Strategy:</h4>
      <ol>
        <li><strong>Acknowledge & Assess Impact:</strong> Collaborate immediately with the Product Owner and Tech Lead to evaluate effort, dependencies, technical debt, and risks.</li>
        <li><strong>Enforce Trade-Off Principles (Iron Triangle):</strong> Communicate clearly that adding scope requires swapping out user stories of equivalent story point weight from the current sprint backlog.</li>
        <li><strong>Present Options to Stakeholders:</strong>
          <ul>
            <li><em>Option A:</em> Swap equivalent points out of the current sprint into the Next Sprint Backlog.</li>
            <li><em>Option B:</em> Queue the change directly into Sprint Planning for the next iteration.</li>
            <li><em>Option C:</em> If emergency hotfix, terminate the current sprint (rarely required).</li>
          </ul>
        </li>
        <li><strong>Protect Team Focus:</strong> Buffer team members from direct stakeholder pressure and update Jira/Kanban boards transparently.</li>
      </ol>
    `,
    codeLanguage: "text",
    code: `Agile Scope Swap Framework:
[New Request: 8 Story Points] 
  ==> Target Identification
  <== Remove: Story A (5 Points) + Story B (3 Points)
  ==> Outcome: Velocity Maintained (34 Points Total)`,
    keyTakeaways: [
      "Never accept unplanned scope changes without swapping equivalent story points.",
      "Evaluate technical debt & risks with the Engineering Lead first.",
      "Transparent trade-off options protect sprint commitments and prevent burnout."
    ],
    followUp: "How do you calculate Team Velocity when sprint scope changes occur mid-sprint?"
  },
  {
    id: "pm-02",
    category: "project-management",
    categoryName: "Project Management",
    topic: "Metrics & Risk",
    title: "Key Agile Metrics (Velocity, Burndown, Cycle Time, Lead Time)",
    difficulty: "Senior",
    tags: ["Metrics", "Cycle Time", "Lead Time", "Jira", "Sprint Planning"],
    question: "Explain the difference between Lead Time, Cycle Time, and Throughput. How do you diagnose a plateauing Burndown chart during a sprint?",
    answer: `
      <p>Quantitative Agile metrics provide visibility into team efficiency, bottlenecks, and delivery predictability.</p>
      <h4>Definitions:</h4>
      <ul>
        <li><strong>Lead Time:</strong> Total time elapsed from the moment a user story is created/requested to its final release in production.</li>
        <li><strong>Cycle Time:</strong> Time taken from when work actively begins on a story (In Progress) until it reaches Completed/Done status.</li>
        <li><strong>Throughput:</strong> Total number of user stories or work items completed per unit of time (e.g., per sprint).</li>
      </ul>
      <h4>Diagnosing a Flat Burndown Chart:</h4>
      <p>If the Sprint Burndown chart remains flat for several consecutive days, investigate the following root causes:</p>
      <ol>
        <li><strong>Large Monolithic Stories:</strong> Stories aren't split into smaller sub-tasks (should ideally be <= 2-3 days effort).</li>
        <li><strong>QA / Testing Bottlenecks:</strong> Code is written but blocked waiting for code review, staging deploy, or QA sign-off.</li>
        <li><strong>Hidden Unracked Work:</strong> Developers are handling unexpected bug fixes or production support tickets not tracked in the sprint.</li>
      </ol>
    `,
    codeLanguage: "text",
    code: `Time Spectrum:
|----------- Lead Time (Customer Request to Production) -----------|
                    |-- Cycle Time (In Progress to Done) --|
[Backlog Item Created] -> [In Progress] -> [In Review] -> [QA] -> [Done]`,
    keyTakeaways: [
      "Cycle time measures engineering workflow efficiency; Lead time measures total delivery speed.",
      "Flat burndown charts usually indicate stories are too large or QA review bottlenecks.",
      "Split user stories so value burn happens daily rather than at sprint end."
    ],
    followUp: "How do you use Cumulative Flow Diagrams (CFD) to identify WIP limit violations?"
  },

  // ==========================================
  // 5. PRODUCT MANAGEMENT
  // ==========================================
  {
    id: "prod-01",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Prioritization & Strategy",
    title: "Feature Prioritization Frameworks: RICE vs MoSCoW vs Kano Model",
    difficulty: "Senior",
    tags: ["RICE", "Product Strategy", "Prioritization", "Roadmapping"],
    question: "Compare the RICE, MoSCoW, and Kano prioritization frameworks. Walk through how you calculate a RICE score for a candidate product feature.",
    answer: `
      <p>Product Managers must evaluate competing features against user impact, strategic fit, and engineering effort.</p>
      <h4>1. RICE Framework:</h4>
      <p>Formula: <code>RICE Score = (Reach × Impact × Confidence) / Effort</code></p>
      <ul>
        <li><strong>Reach:</strong> Number of users impacted over a specific timeframe (e.g., 10,000 active users/month).</li>
        <li><strong>Impact:</strong> Massive (3x), High (2x), Medium (1x), Low (0.5x), Minimal (0.25x).</li>
        <li><strong>Confidence:</strong> Percentage score reflecting data backing (100% = high research data, 80% = medium, 50% = low gut feeling).</li>
        <li><strong>Effort:</strong> Estimated Person-Months required across Product, Design, and Engineering.</li>
      </ul>
      <h4>2. MoSCoW Method:</h4>
      <ul>
        <li><strong>Must Have:</strong> Non-negotiable launch requirements.</li>
        <li><strong>Should Have:</strong> High value, but workaround exists.</li>
        <li><strong>Could Have:</strong> Nice-to-have visual polish or minor enhancements.</li>
        <li><strong>Won't Have:</strong> Out of scope for current cycle.</li>
      </ul>
      <h4>3. Kano Model:</h4>
      <p>Categorizes features into <em>Basic Expectation (Must-be)</em>, <em>Performance (Linear)</em>, and <em>Delighters (Attractive)</em> based on user satisfaction vs implementation level.</p>
    `,
    codeLanguage: "text",
    code: `RICE Score Calculation Example:
Feature: One-Click Checkout
- Reach: 50,000 buyers/mo
- Impact: 2 (High conversion boost)
- Confidence: 80% (0.8 - validated by user interviews)
- Effort: 2 Person-Months

RICE Score = (50,000 * 2 * 0.8) / 2 = 40,000`,
    keyTakeaways: [
      "RICE removes subjective bias by quantifying reach, impact, confidence, and effort.",
      "Kano helps identify delighter features that drive organic word-of-mouth growth.",
      "Combine quantitative RICE metrics with strategic quarterly OKRs."
    ],
    followUp: "How do you handle a high-RICE score feature that conflicts with executive vision?",
    // Beginner-friendly definitions. The first mention of each term in the
    // answer above gets underlined and becomes clickable/tappable, showing
    // this explanation in a popup — so no prior PM background is assumed.
    glossary: {
      "RICE": "A scoring formula PMs use to rank features objectively: (Reach × Impact × Confidence) ÷ Effort. Bigger score = do it sooner.",
      "MoSCoW": "A quick way to sort requirements into 4 buckets by how essential they are: Must, Should, Could, Won't have.",
      "Kano Model": "A framework that sorts features by the *type* of satisfaction they create — expected basics, linear improvements, or surprise delighters — rather than by a single number.",
      "Reach": "How many users/customers the feature will actually touch in a given time window (e.g. \"10,000 users/month\"). Bigger reach = more people benefit.",
      "Impact": "How much difference the feature makes for each user it reaches, usually rated on a simple scale: Massive, High, Medium, Low, or Minimal.",
      "Confidence": "How sure you are about your Reach/Impact guesses, as a percentage. 100% = backed by real data, 50% = mostly a gut feeling.",
      "Effort": "How much work it takes to build, in person-months (1 person-month = one person working for one month).",
      "Must Have": "A requirement so essential the release can't ship without it.",
      "Should Have": "Important and valuable, but the release could ship without it if needed (a workaround exists).",
      "Could Have": "A nice-to-have — small polish or extras that are the first things cut if time runs out.",
      "Won't Have": "Explicitly agreed to be out of scope for this release, so nobody expects it.",
      "Basic Expectation (Must-be)": "A feature users don't notice when it's there, but get angry if it's missing — e.g. a login screen that actually works.",
      "Performance (Linear)": "A feature where more = better, in a straight line — e.g. faster load times keep making users happier the faster they get.",
      "Delighters (Attractive)": "An unexpected feature users didn't ask for — its absence isn't missed, but its presence creates delight and word-of-mouth."
    }
  },
  {
    id: "prod-02",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Metrics & Product Analytics",
    title: "North Star Metric, DAU/MAU Ratio, and Reducing User Churn",
    difficulty: "Lead",
    tags: ["North Star", "Metrics", "Retention", "Cohort Analysis"],
    question: "What is a North Star Metric? How do you define it for an e-commerce vs SaaS platform, and how do you analyze churn using cohort retention tables?",
    answer: `
      <p>A <strong>North Star Metric (NSM)</strong> is the key focal metric that best captures the core value your product delivers to customers, aligning product, engineering, and business teams.</p>
      <h4>North Star Metric Examples:</h4>
      <ul>
        <li><strong>Airbnb:</strong> Nights Booked (captures host revenue & guest satisfaction).</li>
        <li><strong>Spotify:</strong> Time Spent Listening to Music.</li>
        <li><strong>Slack:</strong> Messages Sent Within an Organization (captures viral collaboration depth).</li>
        <li><strong>E-Commerce (Amazon):</strong> Repeat Purchases per Customer per Month.</li>
      </ul>
      <h4>DAU/MAU Ratio (Product Stickiness):</h4>
      <p>Calculated as <code>(Daily Active Users / Monthly Active Users) * 100</code>. A ratio > 20% signifies strong habit-forming user retention.</p>
      <h4>Analyzing Churn via Cohort Analysis:</h4>
      <ul>
        <li>Track user groups bound by signup week/month over Day 1, Day 7, Day 30 retention.</li>
        <li>If the retention curve flattens out in parallel to the X-axis, the product has achieved true <strong>Product-Market Fit (PMF)</strong> for that segment!</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Cohort Retention Curve:
Retention %
100% | *
 60% |   *
 40% |     * * * * * * * * (Flattens out = Product-Market Fit)
  0% +---------------------------> Time (Days)`,
    keyTakeaways: [
      "The North Star Metric measures core customer value exchange.",
      "DAU/MAU measures product stickiness and daily habitual usage.",
      "A flattening cohort retention curve indicates product-market fit."
    ],
    followUp: "What is the difference between Leading and Lagging retention indicators?"
  },
  {
    id: "prod-03",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Mobile Architecture & Offline Sync",
    title: "Designing an Offline-First Sync Mechanism for High-SKU Inventory Updates",
    difficulty: "Lead",
    tags: ["Offline-First", "Mobile Sync", "Android", "Retail", "PRD"],
    question: "Walk through your approach to designing an offline-first sync mechanism for high-SKU inventory updates. When a device drops connectivity in a basement stockroom, how do you handle local caching, payload batching, and delta syncs upon reconnection?",
    answer: `
      <p>The core requirement is <strong>offline-first</strong>, not "offline-tolerant" — every read and write goes through a local store first, and sync is a background reconciliation step, never a blocker to the associate's task.</p>
      <h4>1. Local Caching (Source of Truth):</h4>
      <ul>
        <li>Room/SQLite is the single source of truth on-device. UI never waits on a network call to render or accept an edit.</li>
        <li>Every mutation is written to a local <strong>outbox/write-ahead queue</strong> with a client-generated UUID, timestamp, and device/user id — this makes retries idempotent server-side.</li>
      </ul>
      <h4>2. Payload Batching:</h4>
      <ul>
        <li>Group pending mutations by warehouse zone or SKU cluster into a single batched request rather than one network call per edit — critical in a basement stockroom where every connection window may be seconds long.</li>
        <li>Send <strong>delta payloads</strong> (only changed fields) instead of full SKU records to minimize bytes over a weak signal.</li>
      </ul>
      <h4>3. Sync Triggers & Delta Reconciliation:</h4>
      <ul>
        <li>Use <code>WorkManager</code> with network connectivity constraints for background sync, plus a <code>NetworkCallback</code>-driven immediate sync attempt the instant connectivity returns.</li>
        <li>Each SKU record carries a server-side <code>syncToken</code>/<code>updatedAt</code> version. On reconnect, the client requests "everything changed since my last checkpoint" rather than re-downloading the full catalog.</li>
      </ul>
      <h4>4. PRD Requirements to Specify:</h4>
      <ul>
        <li>Maximum acceptable local cache staleness (e.g., "allocation data no older than 4 hours before a sync is forced").</li>
        <li>Explicit conflict-resolution policy (see the SKU conflict question) rather than leaving it to engineering to assume.</li>
        <li>A visible sync-status indicator so the associate always knows whether their edits are saved-locally vs synced-to-server.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Sync Lifecycle:
[Edit made] -> [Written to local Room DB + Outbox queue] -> [UI updates instantly]
                                   |
                     (device offline in basement)
                                   |
                 [WorkManager waits on NETWORK_CONNECTED constraint]
                                   |
                     (connectivity restored)
                                   |
        [Batch pending outbox entries by zone] -> [Send delta payload]
                                   |
        [Pull server changes since local syncToken] -> [Merge + resolve conflicts]`,
    keyTakeaways: [
      "Local DB is the source of truth; sync is a background reconciliation, not a gate on usability.",
      "Batch and delta-encode payloads to survive short, weak connectivity windows.",
      "Use version tokens (not full re-download) for efficient delta sync on reconnect.",
      "PRD must explicitly define staleness tolerance, conflict policy, and sync-status visibility."
    ],
    followUp: "How would you instrument sync success/failure telemetry to catch silent sync failures in the field?"
  },
  {
    id: "prod-04",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Conflict Resolution & Data Integrity",
    title: "Conflict Resolution Framework for Concurrent Offline Edits to the Same SKU",
    difficulty: "Lead",
    tags: ["Conflict Resolution", "CRDT", "Offline-First", "Data Integrity"],
    question: "Two floor associates edit the allocation bounds of the same SKU cluster offline on different enterprise Android handhelds. What conflict-resolution framework (e.g., Last-Write-Wins, field-level merges, or manual conflict queues) do you specify, and why?",
    answer: `
      <p>A blind <strong>Last-Write-Wins (LWW)</strong> policy is the wrong default here — it silently discards a valid associate's work, which erodes trust in the tool and can hide real inventory-allocation errors.</p>
      <h4>Recommended Framework — Tiered Resolution:</h4>
      <ul>
        <li><strong>Additive/incremental edits (e.g., +5 units):</strong> Treat as CRDT-style commutative operations — merge automatically by summing deltas rather than overwriting an absolute value. Order doesn't matter, so this is always safe to auto-resolve.</li>
        <li><strong>Absolute bound edits (e.g., set cap to 120 units) that diverge within a small tolerance (e.g., &lt;15%):</strong> Auto-resolve using latest-timestamp-wins, but log both values for auditability.</li>
        <li><strong>Absolute edits that diverge beyond tolerance, or touch approval-gated thresholds:</strong> Never auto-resolve. Route to a <strong>manual conflict queue</strong> visible to the store/district manager, showing both associates' values, timestamps, and device ids, and require an explicit pick-or-merge decision.</li>
      </ul>
      <h4>Why This Split:</h4>
      <p>It matches resolution risk to resolution confidence: low-risk, mathematically safe merges shouldn't burden a human, while high-risk divergences that could mask a real stock discrepancy need a person to make the call. This also gives engineering a concrete, testable spec instead of "just handle conflicts."</p>
    `,
    codeLanguage: "text",
    code: `Conflict Decision Tree:
Is the edit additive (delta)?
  YES -> Auto-merge (sum deltas), no human review
  NO  -> Is the divergence between values < 15%?
           YES -> Auto-resolve by latest timestamp, log both for audit
           NO  -> Push to Manual Conflict Queue for manager arbitration`,
    keyTakeaways: [
      "Blind Last-Write-Wins silently destroys valid work and hides real discrepancies.",
      "Match the resolution strategy to risk: additive edits auto-merge, divergent absolute edits go to a human.",
      "Always retain an audit trail of both conflicting values, even when auto-resolved.",
      "A manual conflict queue is a first-class PRD feature, not an engineering afterthought."
    ],
    followUp: "How would you surface the conflict queue in the UI so managers actually act on it instead of ignoring it?"
  },
  {
    id: "prod-05",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Platform Constraints & Requirements",
    title: "How Android OS Constraints Shape Product Requirements on Ruggedized Devices",
    difficulty: "Senior",
    tags: ["Android", "Doze Mode", "WorkManager", "Ruggedized Devices"],
    question: "How do Android OS constraints—such as Doze Mode, background execution limits (WorkManager), battery throttling, and memory limits on ruggedized devices (like Zebra or Honeywell)—shape your product requirements?",
    answer: `
      <p>These OS-level constraints aren't engineering trivia — they directly bound what a PRD can promise, so a PM has to bake them into acceptance criteria up front rather than discover them during QA.</p>
      <ul>
        <li><strong>Doze Mode / App Standby:</strong> Background network access is throttled in maintenance windows. A PRD cannot promise "instant background sync" — it must state sync happens within a bounded window (e.g., "within 15 minutes in the background, immediately in the foreground") and use <code>WorkManager.setExpedited()</code> or a foreground service only for genuinely time-critical syncs.</li>
        <li><strong>WorkManager Constraints:</strong> Requirements like "only sync large SKU batches on Wi-Fi" or "don't run heavy jobs when battery is low" become explicit, testable PRD acceptance criteria, not implicit engineering choices.</li>
        <li><strong>Ruggedized Hardware Reality:</strong> Zebra/Honeywell devices often run 2–3 years behind on Android version and ship with 2–3GB RAM under enterprise MDM (StageNow/SOTI) lockdown. The PRD must set a minimum supported API level and a memory budget (e.g., image thumbnail caching limits) that reflects the oldest fleet device, not a flagship phone.</li>
        <li><strong>Battery Throttling:</strong> Continuous barcode/RFID scanning drains battery fast. The PRD should specify a "low battery mode" that reduces background chatter and scan frequency below a set threshold (e.g., 15%).</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `PRD Acceptance Criteria Examples:
- "Background sync completes within 15 min under Doze; foreground sync is immediate."
- "Full-catalog re-index only runs on Wi-Fi + battery > 20% (WorkManager constraints)."
- "App supports Android 9+ / 3GB RAM minimum (matches oldest fleet device)."
- "Below 15% battery, background polling frequency drops from 1min to 10min intervals."`,
    keyTakeaways: [
      "Doze/App Standby means background sync timing must be a stated range, not 'instant'.",
      "WorkManager constraints belong in the PRD as testable acceptance criteria.",
      "Design for the oldest device in the fleet, not the newest — ruggedized hardware lags flagship Android.",
      "Battery-aware behavior (low-power mode) is a product requirement, not just an engineering nicety."
    ],
    followUp: "How do you validate these constraints are actually met — real device farm testing vs simulator/emulator testing?"
  },
  {
    id: "prod-06",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Release Quality & UAT Readiness",
    title: "UI/UX Red Flags and Performance Bottlenecks to Check Before UAT Sign-Off",
    difficulty: "Senior",
    tags: ["UAT", "Quality Gate", "Performance", "Mobile QA"],
    question: "When evaluating a staging build, what specific Android UI/UX red flags or performance bottlenecks do you check for before approving it for UAT?",
    answer: `
      <p>A staging build review should be a structured checklist, not a vibe check. Key items:</p>
      <ul>
        <li><strong>Scroll performance on dense lists:</strong> SKU tables must hold ~60fps; check via GPU rendering profile / Perfetto trace for jank on the item list.</li>
        <li><strong>Touch target sizing:</strong> Minimum 48dp, ideally 56–64dp on primary actions, to account for gloved-hand use.</li>
        <li><strong>Cold start time:</strong> Target under 2 seconds on ruggedized hardware — a slow launch directly costs associate time on the floor.</li>
        <li><strong>Sync/offline status visibility:</strong> Confirm the offline banner and sync-pending indicators actually appear and update — a silently failing sync is the single worst UAT escape.</li>
        <li><strong>Battery & network regression:</strong> Compare against the previous build's baseline battery drain and data usage; flag any regression before it reaches the field.</li>
        <li><strong>Scanner hardware integration:</strong> Regression-test the barcode/RFID SDK path specifically — this integration is a common silent-break point across builds.</li>
        <li><strong>Crash-free session rate:</strong> Require a minimum threshold (e.g., &gt;99.5%) from internal dogfooding before promoting to client UAT.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Pre-UAT Checklist:
[ ] 60fps scroll on SKU list (Perfetto/GPU profiler)
[ ] Touch targets >= 48dp on primary actions
[ ] Cold start < 2s on ruggedized reference device
[ ] Offline/sync-status indicator verified end-to-end
[ ] Battery & data usage within baseline +/- 5%
[ ] Scanner (barcode/RFID) integration regression pass
[ ] Crash-free session rate > 99.5% in dogfood`,
    keyTakeaways: [
      "Use a repeatable checklist, not ad hoc impressions, to gate UAT promotion.",
      "Silent sync failures are the highest-risk UAT escape — always verify status indicators, not just the happy path.",
      "Test against the oldest ruggedized reference device, not a dev flagship phone.",
      "Set a numeric crash-free threshold as an objective go/no-go gate."
    ],
    followUp: "What's your rollback plan if a UAT-blocking issue is found after the client has already started testing?"
  },
  {
    id: "prod-07",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Field UX Design",
    title: "Designing for the Physical Reality of Retail Floor Associates",
    difficulty: "Mid",
    tags: ["Field UX", "Accessibility", "Mobile Design", "Retail Operations"],
    question: "Retail associates work under time pressure, often one-handed, gloved, and facing constant customer interruptions. How does this physical environment alter your design for core interactions like item scanning, bulk edits, and approval handoffs?",
    answer: `
      <p>Designing for the store floor means designing for interruption and physical constraint as the default case, not the edge case.</p>
      <ul>
        <li><strong>One-handed, thumb-reachable UI:</strong> Anchor primary actions at the bottom of the screen within thumb reach; avoid two-hand gestures (pinch-zoom, long-press-and-drag) for any critical flow.</li>
        <li><strong>Glove-friendly, low-typing interactions:</strong> Favor scan-to-select over manual SKU entry, and steppers/quick-quantity buttons over free-text keyboards wherever possible.</li>
        <li><strong>Interruption resilience:</strong> Autosave at the field level on every change — never rely on a multi-step form that loses state if the app is backgrounded mid-task (e.g., a customer question interrupts a bulk edit). On return, show "resume where you left off."</li>
        <li><strong>Low-friction approval handoffs:</strong> When a supervisor needs to approve on the same device, avoid a full logout/login cycle — use a quick-switch approval PIN or biometric step-up instead, so the handoff takes seconds, not a full re-authentication flow.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Design Principles Checklist:
- Primary actions live in the bottom third of the screen (thumb zone)
- No pinch/multi-touch gestures gate critical flows
- Every field-level edit autosaves immediately, no "Save" button required
- App backgrounding never loses in-progress form state
- Supervisor approval = PIN/biometric step-up, not full re-login`,
    keyTakeaways: [
      "Interruption is the default use case in retail floor work — design for resumability, not just completion.",
      "One-handed, glove-friendly interaction patterns should be the baseline, not an accessibility add-on.",
      "Approval handoffs need a lightweight step-up auth, not a full account switch."
    ],
    followUp: "How would you usability-test these interactions realistically — in a lab, or on the actual store floor?"
  },
  {
    id: "prod-08",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Information Density & UX",
    title: "Balancing Dense Merchandising Data on a Small Screen",
    difficulty: "Mid",
    tags: ["Information Architecture", "Progressive Disclosure", "Mobile UX"],
    question: "How do you balance displaying dense merchandising data (SKU metadata, historical sell-through, allocation recommendations) on a 5-to-6-inch screen without causing cognitive overload or accidental taps?",
    answer: `
      <p>The answer is <strong>progressive disclosure plus visual hierarchy</strong>, not cramming everything onto one screen.</p>
      <ul>
        <li><strong>Primary card view:</strong> Show only the 3–4 fields an associate needs to act in the moment — SKU, current quantity, recommended allocation, and the delta — using a color-coded chip (green = increase, red = decrease) instead of dense numeric tables.</li>
        <li><strong>Progressive disclosure:</strong> Secondary data — historical sell-through, trend sparkline, full SKU metadata — sits behind a single tap-to-expand, not on the primary card.</li>
        <li><strong>Bulk actions via a sticky action bar:</strong> Multi-select rows and act through one bottom action bar, rather than a button per row, which both reduces visual clutter and prevents accidental per-row taps.</li>
        <li><strong>Confirm high-impact actions lightly but clearly:</strong> A large re-allocation should trigger a brief bottom-sheet confirmation rather than a disruptive full-screen modal, preserving flow while still preventing costly mistakes.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Card Hierarchy:
Primary (always visible): SKU | Current Qty | Recommended | Delta chip
Secondary (tap to expand): Sell-through trend | Historical allocation | Metadata
Bulk mode: multi-select checkboxes -> sticky bottom action bar (no per-row buttons)`,
    keyTakeaways: [
      "Show only the decision-critical fields by default; disclose the rest on demand.",
      "Color-coded visual chips communicate deltas faster than raw numbers in a table.",
      "Sticky bulk-action bars reduce both clutter and accidental single-row taps.",
      "Confirm high-impact actions with lightweight, in-flow UI, not disruptive modals."
    ],
    followUp: "How would you measure whether the progressive disclosure pattern is actually reducing errors, not just looking cleaner?"
  },
  {
    id: "prod-09",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Resilience Requirements",
    title: "State-Preservation Requirement When a Device Dies Mid-Audit",
    difficulty: "Senior",
    tags: ["State Management", "Offline-First", "Given-When-Then", "Data Loss Prevention"],
    question: "If an associate is halfway through a 50-item allocation audit and their device battery dies, what is the exact state-preservation requirement you write to prevent data loss?",
    answer: `
      <p>The requirement has to be specific enough that engineering and QA can test it exactly, not a vague "don't lose data" ask.</p>
      <h4>Requirement:</h4>
      <p>Every item-level edit in the audit is written synchronously to the local Room database <strong>at the moment the associate confirms it</strong> — never held only in in-memory state or batched for a later bulk write. This guarantees zero data loss even on a hard, unexpected power-off.</p>
      <h4>Resume Behavior on Relaunch:</h4>
      <ul>
        <li>The app must resume the exact audit session — same item index, same filter/sort state — not restart the audit from item 1.</li>
        <li>A banner communicates state clearly: <em>"Resumed from previous session — 32 of 50 items reviewed."</em></li>
      </ul>
      <h4>Acceptance Criteria (Given-When-Then):</h4>
      <p><code>Given</code> an audit in progress with 32/50 items reviewed and saved locally,<br/>
      <code>When</code> the device loses power and is restarted,<br/>
      <code>Then</code> the audit resumes at item 33, all 32 prior edits are intact and marked "saved locally, pending sync," and no re-entry of completed items is required.</p>
    `,
    codeLanguage: "text",
    code: `Given an audit in progress with 32/50 items reviewed and saved locally
When the device loses power and is restarted
Then the audit resumes at item 33
And all 32 prior edits are intact, marked "saved locally, pending sync"
And no re-entry of already-completed items is required`,
    keyTakeaways: [
      "Persist every confirmed edit immediately — never rely on in-memory batching for audit data.",
      "Resume must restore exact position and filter state, not just 'the audit exists'.",
      "Write the requirement as a testable Given-When-Then, not a vague 'no data loss' statement."
    ],
    followUp: "How would this requirement change if two different audits could be in progress on the same device simultaneously?"
  },
  {
    id: "prod-10",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Acceptance Criteria",
    title: "Writing Given-When-Then Criteria for a Time-Boxed, Offline-Aware Feature",
    difficulty: "Senior",
    tags: ["Given-When-Then", "Acceptance Criteria", "Edge Cases", "Clock Skew"],
    question: "Provide an example of how you structure a user story using Given-When-Then acceptance criteria for a time-sensitive feature, such as an allocation-review edit window that closes at 5:00 PM when the device is offline.",
    answer: `
      <p>Time-boxed features need extra scenarios for the offline and clock-drift edge cases most PMs forget — the happy path alone isn't sufficient acceptance criteria.</p>
      <h4>Scenario 1 — Attempted edit after window closes, while offline:</h4>
      <p><code>Given</code> the allocation review window closes at 17:00 local store time, and the device has a locally cached window-close time,<br/>
      <code>When</code> the associate attempts to edit an allocation at 17:03 device-local time,<br/>
      <code>Then</code> the edit control is disabled with the message "Review window closed at 5:00 PM," any edit already queued before 17:00 still syncs normally, and any edit attempted after 17:00 is rejected locally and never queued — even before the device reconnects.</p>
      <h4>Scenario 2 — Clock drift edge case:</h4>
      <p><code>Given</code> the device clock is unsynced with server time by more than 2 minutes,<br/>
      <code>When</code> the app determines whether the review window is open,<br/>
      <code>Then</code> it uses the last server-synced timestamp plus elapsed device uptime — not the raw device clock — so a user can't extend the window by changing their device's clock.</p>
    `,
    codeLanguage: "text",
    code: `Scenario: Edit attempted after window closes while offline
Given the allocation review window closes at 17:00 local store time
And the device has a locally cached window-close time
When the associate attempts to edit at 17:03 device-local time
Then the edit control is disabled with "Review window closed at 5:00 PM"
And edits queued before 17:00 still sync normally
And edits attempted after 17:00 are rejected locally, never queued

Scenario: Device clock drift
Given the device clock is unsynced with server time by more than 2 minutes
When the app checks whether the review window is open
Then it uses last-synced server time + elapsed device uptime, not raw device clock`,
    keyTakeaways: [
      "Time-boxed offline features need explicit scenarios for the boundary moment, not just 'before' and 'after'.",
      "Always add a clock-drift/skew scenario — raw device time is not trustworthy for enforcement.",
      "Rejecting late edits locally (rather than queuing and rejecting on sync) avoids confusing the associate."
    ],
    followUp: "How would the acceptance criteria change for a multi-timezone retail chain?"
  },
  {
    id: "prod-11",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Stakeholder Alignment",
    title: "Tracking and Closing Open Product Decisions Under Stakeholder Conflict",
    difficulty: "Lead",
    tags: ["Stakeholder Management", "Decision Log", "RACI", "Enterprise PM"],
    question: "How do you identify, track, and close open product decisions (e.g., disposition of un-actioned items, approval thresholds) when enterprise stakeholders hold conflicting viewpoints?",
    answer: `
      <p>Open decisions that live in Slack threads or meeting memory stall engineering and resurface repeatedly. They need a structured, visible process.</p>
      <ul>
        <li><strong>Maintain a living Decision Log</strong> in the PRD: decision, options considered, owner, deadline, decided-by, and rationale — a single source of truth stakeholders can check instead of re-litigating in meetings.</li>
        <li><strong>Apply a lightweight RACI</strong>: product is Accountable for the final call; engineering, ops, and client stakeholders are Consulted — this stops decisions from stalling on consensus that will never fully arrive.</li>
        <li><strong>Force resolution with a default</strong>: state "if no decision is made by [date], the default behavior is X" so silence doesn't block delivery, and stakeholders who care must actively engage before the deadline.</li>
        <li><strong>Come with a data-backed proposal, not a blank question</strong>: for something like disposition of un-actioned items, propose a specific default (e.g., "auto-flag for manager review after 48 hours") and let stakeholders push back on a concrete starting point rather than debating from scratch.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Decision Log Entry:
Decision: Disposition of un-actioned allocation items after 48h
Options: (a) auto-flag for manager review (b) auto-approve (c) auto-reject
Proposed default: (a) auto-flag for manager review
Owner: Product (Accountable) | Consulted: Ops, Client Success, Engineering
Deadline: If undecided by [date], default (a) ships
Decided by / rationale: [filled once resolved]`,
    keyTakeaways: [
      "A visible decision log beats decisions scattered across meetings and chat threads.",
      "RACI clarity (product is Accountable) prevents indefinite consensus-seeking.",
      "Default-with-deadline forces resolution without blocking the roadmap.",
      "Propose a concrete default rather than opening with an open-ended question."
    ],
    followUp: "How do you handle a stakeholder who tries to reopen a decision after the deadline has passed?"
  },
  {
    id: "prod-12",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Technical Discovery",
    title: "Catching Hidden Architectural Implications in a 'Simple' Client Request",
    difficulty: "Senior",
    tags: ["Technical Discovery", "Scoping", "Engineering Partnership"],
    question: "Describe a situation where a seemingly simple client request had massive hidden architectural implications on the mobile client. How did you identify it and align engineering?",
    answer: `
      <p>A classic example: a client asks to "just add a photo to each allocation record." On the surface it's a one-field UI addition; underneath it touches offline photo storage and compression before sync, sync payload size in a bandwidth-constrained basement environment, EXIF/PII stripping for compliance, and per-tenant storage cost at scale in a multi-tenant platform.</p>
      <h4>How to Catch This Before It Blindsides the Timeline:</h4>
      <ul>
        <li>Run every "small" request through a quick technical-feasibility checklist before quoting effort: does this touch sync payload size, offline cache, storage cost, or multi-tenant configuration?</li>
        <li>Bring an engineer into <em>discovery</em>, not just planning — a 15-minute spike before committing to a timeline surfaces implications a PM alone would miss.</li>
        <li>Document the trade-off explicitly in the PRD rather than silently absorbing scope: e.g., "limit to 1 photo per record, compressed client-side to under 200KB, and synced only on Wi-Fi" — turning a hidden cost into a stated, negotiated constraint.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `"Simple" request: Add a photo to each allocation record

Hidden implications surfaced in a 15-min engineering spike:
- Offline photo capture + client-side compression before queuing
- Sync payload size impact in low-bandwidth basement connectivity
- EXIF metadata / PII stripping for compliance
- Per-tenant storage cost at scale (multi-tenant platform)

Negotiated scope: 1 photo/record, compressed to <200KB, Wi-Fi-only sync`,
    keyTakeaways: [
      "Treat every 'simple' UI request as a candidate for hidden architectural cost until an engineer confirms otherwise.",
      "A short spike before quoting effort is cheaper than discovering the cost mid-sprint.",
      "Turn hidden costs into explicit, negotiated PRD constraints instead of silently absorbing scope."
    ],
    followUp: "How do you handle it when the client pushes back on a scope constraint you've added after discovery?"
  },
  {
    id: "prod-13",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Multi-Tenant Platform Design",
    title: "Designing a Configurable Rule Engine Instead of Client-Specific Code Branches",
    difficulty: "Lead",
    tags: ["Multi-Tenant", "Platform Architecture", "Configuration", "Enterprise SaaS"],
    question: "Client A requires a strict three-tier managerial approval chain for any allocation edit above 10%, while Client B wants instant one-tap local overrides. How do you design a configurable platform rule engine rather than writing bespoke code branches?",
    answer: `
      <p>The failure mode to avoid is <code>if (clientId == 'A') { ... } else if (clientId == 'B') { ... }</code> scattered through the codebase — every new client then requires a code change and a deploy.</p>
      <h4>Design: Per-Tenant Approval-Workflow Configuration</h4>
      <ul>
        <li>Model approval behavior as tenant-level configuration, not code: thresholds, number of approval tiers, approver roles, and auto-approve boundaries all live in a config schema stored server-side per tenant.</li>
        <li>The client renders the approval workflow dynamically from that config — the same binary serves both Client A's three-tier chain and Client B's instant override with zero client-specific code paths.</li>
        <li>Provide a versioned schema with sensible defaults so onboarding a new client is an admin-console configuration task, not an engineering ticket.</li>
      </ul>
    `,
    codeLanguage: "json",
    code: `// Tenant-level approval config (drives client behavior, not code branches)
{
  "tenantId": "client-a",
  "approvalRules": [
    { "maxPercent": 10, "autoApprove": true },
    { "maxPercent": 100, "tiers": ["store-manager", "district-manager", "ops-director"] }
  ]
}

{
  "tenantId": "client-b",
  "approvalRules": [
    { "maxPercent": 100, "autoApprove": true }
  ]
}`,
    keyTakeaways: [
      "Never encode client-specific behavior as hardcoded conditionals — model it as configuration.",
      "A single rule-engine schema should express both strict multi-tier and instant-override workflows.",
      "Onboarding a new client's approval policy should be a config change, not a code deploy."
    ],
    followUp: "How do you version this config schema so you can evolve it without breaking existing tenants?"
  },
  {
    id: "prod-14",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Platform Integrity",
    title: "Recognizing and Pushing Back on Operational Anti-Pattern Requests",
    difficulty: "Lead",
    tags: ["Platform Strategy", "Enterprise PM", "Scope Negotiation"],
    question: "How do you identify when an enterprise client's feature request is an operational anti-pattern that risks polluting your core multi-tenant product? How do you push back or steer them toward a platform-compatible solution?",
    answer: `
      <p>Red flags that a request is an anti-pattern rather than a genuine product gap:</p>
      <ul>
        <li>It's a workaround for the client's own broken internal process, not a missing product capability.</li>
        <li>It asks to hardcode client-specific business logic into the core app rather than expressing it through configuration.</li>
        <li>It would set a precedent that conflicts with another client's opposite requirement.</li>
        <li>It's needed by a single client but adds ongoing maintenance burden disproportionate to its value.</li>
      </ul>
      <h4>How to Push Back Constructively:</h4>
      <ul>
        <li>Reframe around the underlying business need (the "why") instead of debating the literal ask (the "what") — often a platform-compatible alternative satisfies the real need.</li>
        <li>Propose that alternative concretely: a config flag, a webhook/integration point, or a professional-services layer outside the core app, rather than a flat "no."</li>
        <li>Bring data to the conversation — quantify the ongoing cost ("this adds 3 weeks now and becomes a maintenance branch for every future client with the opposite need") so the trade-off is visible, and escalate to the client's executive sponsor if alignment stalls.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Anti-Pattern Checklist:
[ ] Is this a workaround for the client's broken process, not a product gap?
[ ] Does it require hardcoding client-specific logic into core code?
[ ] Would it conflict with another client's opposite need?
[ ] Is the ongoing maintenance cost disproportionate to a single client's value?

If 2+ boxes checked -> propose a platform-compatible alternative, don't just say no.`,
    keyTakeaways: [
      "Distinguish a genuine product gap from a client-specific process workaround before committing to build it.",
      "Push back on the literal request, not the underlying need — offer a platform-compatible alternative for the same outcome.",
      "Quantify the long-term maintenance cost to make the trade-off concrete for the client."
    ],
    followUp: "What do you do if the client's executive sponsor insists on the anti-pattern despite the trade-off data?"
  },
  {
    id: "prod-15",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Agentic AI Product Design",
    title: "Designing Human-in-the-Loop Oversight for Agentic AI Allocation Proposals",
    difficulty: "Lead",
    tags: ["Agentic AI", "Human-in-the-Loop", "Trust & Explainability", "AI Product Design"],
    question: "Impact Analytics deploys agentic AI workflows. How do you design a mobile experience where autonomous AI agents propose allocation shifts, balancing automated execution with human-in-the-loop oversight to avoid confirmation fatigue?",
    answer: `
      <p>The key is a <strong>tiered autonomy model</strong> that matches the level of human review to the risk and confidence of the AI's proposal — a single "approve every suggestion" pattern guarantees confirmation fatigue and rubber-stamping.</p>
      <ul>
        <li><strong>Low-risk, high-confidence shifts</strong> (e.g., &lt;5% delta, high model confidence): auto-apply, but keep it transparent with a visible "AI-adjusted" badge and an easy one-tap undo window (e.g., 24 hours).</li>
        <li><strong>Medium-risk shifts:</strong> batch into a single daily digest for one bulk approve/reject decision, instead of a per-item confirmation for every proposal.</li>
        <li><strong>High-risk or high-magnitude shifts:</strong> always require explicit, individual human approval, with the AI's rationale and confidence score shown alongside the proposal so the reviewer isn't approving a black box.</li>
      </ul>
      <h4>Avoiding Confirmation Fatigue & Building Trust:</h4>
      <ul>
        <li>Batching decisions and surfacing confidence scores lets associates learn which suggestions to trust, rather than reflexively approving everything.</li>
        <li>Track approve/reject/override rates as a feedback loop to retrain autonomy thresholds over time.</li>
        <li>Log a full audit trail of AI-proposed vs. human-decided actions — essential for enterprise client accountability and explainability requirements.</li>
      </ul>
    `,
    codeLanguage: "text",
    code: `Tiered Autonomy Model:
Confidence + Magnitude        Action
------------------------------------------------------------
High confidence, <5% delta -> Auto-apply + "AI-adjusted" badge + 24h undo
Medium confidence/magnitude -> Batch into daily digest, bulk approve/reject
Low confidence or high risk -> Individual approval required, rationale shown

Feedback loop: track approve/reject/override rate -> retrain thresholds`,
    keyTakeaways: [
      "Tier autonomy by risk and confidence — don't apply one review pattern to every AI proposal.",
      "Batch medium-risk decisions into digests to prevent confirmation fatigue.",
      "Always show AI rationale and confidence, never a black-box suggestion, for high-risk actions.",
      "Log a full audit trail of AI vs. human decisions for enterprise explainability."
    ],
    followUp: "How would you detect and respond to the AI's confidence calibration drifting out of alignment with real outcomes over time?"
  },
  {
    id: "prod-16",
    category: "product-management",
    categoryName: "Product Management",
    topic: "Launch Risk & Triage",
    title: "Triage Framework for High Sync Failure Rates Three Weeks Before Go-Live",
    difficulty: "Lead",
    tags: ["Launch Readiness", "Risk Management", "Triage", "Stakeholder Communication"],
    question: "You are three weeks away from a major enterprise client go-live, and QA reports high sync failure rates under simulated poor network conditions. What is your triage framework to sequence fixes, adjust scope, and communicate risk to client leadership?",
    answer: `
      <p>With a hard deadline and a serious quality signal, the job is to triage systematically and give leadership real options — not just report the bug and hope it gets fixed in time.</p>
      <h4>1. Classify by Severity/Impact:</h4>
      <p>Bucket every failure as (a) data-loss risk, (b) UX friction, or (c) cosmetic. Data-loss issues are non-negotiable fixes; the rest gets triaged against the remaining timeline.</p>
      <h4>2. Root-Cause the Failure Pattern:</h4>
      <p>Are timeout thresholds too aggressive for real-world 2G/3G in basements? Is payload size too large for reliable batching? Is retry/backoff not exponential, causing a "thundering herd" of retries the moment connectivity returns?</p>
      <h4>3. Negotiate Scope Against the Timeline:</h4>
      <p>If the root cause needs a deep architecture change (e.g., moving from full-record sync to true delta sync) that can't safely land in three weeks, scope down: ship with tighter retry/backoff and clear "syncing" UI state now, and schedule the full architectural fix as a fast-follow patch shortly after launch.</p>
      <h4>4. Communicate Risk as Options, Not Just Status:</h4>
      <p>Bring client leadership a clear memo: (a) delay launch by N weeks for the full fix, (b) launch with a documented workaround and a committed fast-follow date, or (c) launch a limited subset of stores/features first. Recommend one option with its trade-offs stated plainly, rather than only surfacing the problem.</p>
      <h4>5. Validate on Real Devices Before Go-Live:</h4>
      <p>Add real-device field testing in actual basement/warehouse conditions in the final week — simulated network conditions alone aren't sufficient confidence for a go/no-go call.</p>
    `,
    codeLanguage: "text",
    code: `Triage Framework:
1. Classify: data-loss (must-fix) vs UX friction vs cosmetic
2. Root-cause: timeout thresholds? payload size? retry/backoff strategy?
3. Scope decision: full architectural fix vs tighter retry/backoff + fast-follow
4. Leadership memo: Option A (delay) / B (launch + fast-follow) / C (phased rollout)
   -> Recommend one, state trade-offs explicitly
5. Validate fix with real-device field testing, not just network simulation`,
    keyTakeaways: [
      "Always fix data-loss risks unconditionally; triage everything else against the remaining timeline.",
      "Root-cause the failure pattern before deciding whether it's a scope-down or a full fix.",
      "Give leadership a recommended option with trade-offs, not just a problem report.",
      "Validate under real network conditions on real devices before the go/no-go decision."
    ],
    followUp: "How would you structure the fast-follow commitment to the client so 'we'll fix it after launch' is credible and trackable?"
  },

  // ==========================================
  // 6. SPRING BOOT
  // ==========================================
  {
    id: "spring-01",
    category: "spring-boot",
    categoryName: "Spring Boot",
    topic: "Core & Spring Security",
    title: "Spring Boot Auto-Configuration mechanism and Bean Scope",
    difficulty: "Senior",
    tags: ["Spring Boot", "AutoConfiguration", "Spring Security", "Java"],
    question: "How does `@EnableAutoConfiguration` work under the hood in Spring Boot? List standard Bean Scopes and explain `@ConditionalOnProperty`.",
    answer: `
      <p>Spring Boot Auto-configuration automatically configures Spring Application beans based on classpath dependencies and application properties.</p>
      <h4>Under the Hood Mechanics:</h4>
      <ol>
        <li><code>@SpringBootApplication</code> meta-annotates <code>@EnableAutoConfiguration</code>, <code>@ComponentScan</code>, and <code>@SpringBootConfiguration</code>.</li>
        <li>It reads <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> (or legacy <code>spring.factories</code>).</li>
        <li>It loads conditional configuration classes annotated with <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>, or <code>@ConditionalOnProperty</code>.</li>
      </ol>
      <h4>Spring Bean Scopes:</h4>
      <ul>
        <li><code>singleton</code> (Default): One instance per Spring IoC Container.</li>
        <li><code>prototype</code>: Creates a new bean instance every time requested from container.</li>
        <li><code>request</code>: One instance per HTTP request lifecycle (Web apps).</li>
        <li><code>session</code>: One instance per HTTP Session.</li>
      </ul>
    `,
    codeLanguage: "java",
    code: `// Custom Spring Boot Auto-Configuration Condition
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnProperty(name = "custom.feature.enabled", havingValue = "true")
public class DatabaseFeatureAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public CustomService customService() {
        return new CustomServiceImpl();
    }
}`,
    keyTakeaways: [
      "Auto-configuration registers beans conditionally based on classpath & properties.",
      "AutoConfiguration.imports lists all framework configuration factories.",
      "Default bean scope is Singleton (thread-safe stateless implementation required)."
    ],
    followUp: "What problems occur when injecting a Prototype bean into a Singleton bean, and how do you solve it with @Lookup?"
  },
  {
    id: "spring-02",
    category: "spring-boot",
    categoryName: "Spring Boot",
    topic: "JPA & Microservices",
    title: "Solving N+1 Query Problem in Spring Data JPA and Hibernate",
    difficulty: "Senior",
    tags: ["Spring Data JPA", "Hibernate", "Performance", "SQL"],
    question: "What is the N+1 Query Problem in Spring Data JPA/Hibernate? How do `@EntityGraph`, `JOIN FETCH`, and DTO projections resolve it?",
    answer: `
      <p>The <strong>N+1 Query Problem</strong> occurs when fetching a parent entity with <em>N</em> child entities causes Hibernate to execute 1 query to retrieve parents and <em>N</em> additional individual SQL queries to fetch child collections.</p>
      <h4>Solutions to N+1 Problem:</h4>
      <ol>
        <li><strong>JPQL <code>JOIN FETCH</code>:</strong> Forces Hibernate to fetch parent and associated child entities in a single SQL <code>INNER JOIN</code> or <code>LEFT JOIN</code>.</li>
        <li><strong><code>@EntityGraph</code> Annotation:</strong> Declares fetch plan dynamically over JPA repositories without writing verbose JPQL joins.</li>
        <li><strong>DTO Projections:</strong> Query only required flat fields using constructor expressions (e.g., <code>SELECT new com.dto.UserDTO(u.id, u.name)</code>), completely bypassing the JPA L1/L2 entity cache overhead.</li>
      </ol>
    `,
    codeLanguage: "java",
    code: `@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Solution 1: JOIN FETCH JPQL
    @Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.status = :status")
    List<User> findAllUsersWithOrdersFetch(@Param("status") String status);

    // Solution 2: EntityGraph
    @EntityGraph(attributePaths = {"orders", "roles"})
    List<User> findByStatus(String status);
}`,
    keyTakeaways: [
      "N+1 triggers high database latency by executing individual queries inside loops.",
      "Use JOIN FETCH or @EntityGraph to eagerly fetch associations in 1 SQL query.",
      "DTO projections offer maximum performance for read-only API responses."
    ],
    followUp: "How does batch fetching with @BatchSize(size = 20) alter Hibernate query execution?"
  },

  // ==========================================
  // 7. NODE.JS
  // ==========================================
  {
    id: "node-01",
    category: "nodejs",
    categoryName: "Node.js",
    topic: "Event Loop & Architecture",
    title: "Node.js Event Loop Phases, libuv, and Microtasks vs Macrotasks",
    difficulty: "Senior",
    tags: ["Node.js", "Event Loop", "libuv", "Asynchronous", "JavaScript"],
    question: "Walk through the 6 phases of the Node.js Event Loop managed by libuv. Explain the execution priority of `process.nextTick()` and Promises vs `setImmediate()`.",
    answer: `
      <p>Node.js runs single-threaded JavaScript code asynchronously by delegating I/O operations to OS kernels or libuv thread pool workers, orchestrated by the <strong>Event Loop</strong>.</p>
      <h4>The 6 Phases of the Event Loop:</h4>
      <ol>
        <li><strong>Timers:</strong> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code>.</li>
        <li><strong>Pending Callbacks:</strong> Executes I/O callbacks deferred to the next loop iteration (e.g., TCP errors).</li>
        <li><strong>Idle, Prepare:</strong> Internal libuv framework housekeeping.</li>
        <li><strong>Poll:</strong> Retrieves new I/O events (file reads, network requests); executes node I/O callbacks.</li>
        <li><strong>Check:</strong> Executes callbacks invoked by <code>setImmediate()</code>.</li>
        <li><strong>Close Callbacks:</strong> Executes socket close events (e.g., <code>socket.on('close')</code>).</li>
      </ol>
      <h4>Microtask Priority:</h4>
      <ul>
        <li><code>process.nextTick()</code> queue executes immediately after the current operation finishes, <strong>before</strong> moving to microtasks or the next Event Loop phase.</li>
        <li>Promise microtasks (<code>.then()</code>/<code>await</code>) execute right after <code>nextTick()</code> queue empties.</li>
      </ul>
    `,
    codeLanguage: "javascript",
    code: `// Execution Order Puzzle
console.log('1. Main Script');

setTimeout(() => console.log('2. setTimeout (Timer Phase)'), 0);
setImmediate(() => console.log('3. setImmediate (Check Phase)'));

Promise.resolve().then(() => console.log('4. Promise (Microtask)'));
process.nextTick(() => console.log('5. nextTick (Highest Priority)'));

// Output Order:
// 1. Main Script
// 5. nextTick (Highest Priority)
// 4. Promise (Microtask)
// 2. setTimeout / 3. setImmediate (depending on I/O context)`,
    keyTakeaways: [
      "libuv manages event loop phases and worker thread pool for non-blocking I/O.",
      "process.nextTick executes before Promise microtasks and before event loop phase transitions.",
      "setImmediate executes in the Check phase immediately following Poll phase."
    ],
    followUp: "What happens when process.nextTick is called recursively in an infinite loop?"
  },
  {
    id: "node-02",
    category: "nodejs",
    categoryName: "Node.js",
    topic: "Streams & Worker Threads",
    title: "Handling CPU-intensive tasks with Worker Threads and Streams for Large Datasets",
    difficulty: "Senior",
    tags: ["Streams", "Worker Threads", "Backpressure", "Buffer"],
    question: "How do Node.js Streams handle backpressure when reading multi-gigabyte files? How do `worker_threads` differ from `child_process.fork()`?",
    answer: `
      <p>Node.js provides two primary mechanisms for scalable performance: <strong>Streams</strong> for data pipeline I/O and <strong>Worker Threads</strong> for CPU computational tasks.</p>
      <h4>1. Backpressure in Streams:</h4>
      <ul>
        <li>Backpressure occurs when the consumer (Writable Stream) receives data faster than it can process/write.</li>
        <li>When <code>writable.write(chunk)</code> returns <code>false</code>, the Readable stream automatically pauses reading from source until the Writable stream emits the <code>'drain'</code> event.</li>
        <li>Using <code>readable.pipe(writable)</code> or <code>stream.pipeline()</code> manages backpressure automatically!</li>
      </ul>
      <h4>2. Worker Threads vs Child Processes:</h4>
      <ul>
        <li><code>worker_threads</code>: Run inside the <em>same OS process</em>, sharing V8 instances and memory via <code>ArrayBuffer</code> / <code>SharedArrayBuffer</code> with low overhead.</li>
        <li><code>child_process.fork()</code>: Spawns a completely new standalone OS process with dedicated memory allocation and IPC socket communication.</li>
      </ul>
    `,
    codeLanguage: "javascript",
    code: `const fs = require('fs');
const { pipeline } = require('stream/promises');
const zlib = require('zlib');

// Safely compress a 10GB file without blowing V8 memory heap!
async function compressFile(inputPath, outputPath) {
  await pipeline(
    fs.createReadStream(inputPath),
    zlib.createGzip(),
    fs.createWriteStream(outputPath)
  );
  console.log('Compression complete with low memory usage!');
}`,
    keyTakeaways: [
      "Stream backpressure prevents memory buffer overflow when processing large files.",
      "pipeline() automatically manages error cleanup and backpressure.",
      "Worker Threads share memory for CPU computation; Child Processes isolate OS processes."
    ],
    followUp: "What memory limit does 64-bit V8 place on Node.js processes by default?"
  },

  // ==========================================
  // 8. FULL STACK
  // ==========================================
  {
    id: "fs-01",
    category: "full-stack",
    categoryName: "Full Stack",
    topic: "System Design & Architecture",
    title: "Designing a Scalable URL Shortener (Bit.ly) System Architecture",
    difficulty: "Lead",
    tags: ["System Design", "Database", "Caching", "Base62", "Scale"],
    question: "Design a scalable URL Shortener service handling 100M daily active redirects. Cover unique hash generation (Base62 vs Redis ID generator), database schema, caching strategy, and database sharding.",
    answer: `
      <p>Designing a high-throughput URL shortener service requires balancing fast reads (redirects) over less frequent writes (short URL creation).</p>
      <h4>1. Scale & Capacity Estimation:</h4>
      <ul>
        <li>Reads to Writes Ratio: 10:1 (100M redirects/day, 10M creates/day).</li>
        <li>Redirect QPS: 100,000,000 / 86,400 ≈ ~1,200 QPS (Peak 2,500 QPS).</li>
      </ul>
      <h4>2. Short Key Generation:</h4>
      <ul>
        <li>Using <strong>Base62 Encoding</strong> (<code>[a-z, A-Z, 0-9]</code>): A 7-character string yields $62^7 \approx 3.52 \text{ Trillion}$ unique shortened keys!</li>
        <li><strong>Strategy:</strong> Auto-incrementing distributed ID counter (e.g., Snowflake ID or Redis <code>INCR</code>) converted to Base62 string to guarantee zero collision without costly DB lookup.</li>
      </ul>
      <h4>3. Architecture & Caching:</h4>
      <ul>
        <li><strong>API Gateway & Load Balancer:</strong> Distributes traffic to stateless URL microservices.</li>
        <li><strong>Redis Cache Cluster:</strong> Caches top 20% most popular short key mappings with LRU eviction policy (301 Permanent Redirect vs 302 Temporary Redirect depending on analytics requirements).</li>
        <li><strong>Database:</strong> NoSQL Key-Value Store (DynamoDB / Cassandra) or PostgreSQL sharded by <code>short_key</code> hash.</li>
      </ul>
    `,
    codeLanguage: "javascript",
    code: `// Base62 Encoding Function in JS
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function encodeBase62(num) {
  let encoded = "";
  while (num > 0) {
    encoded = ALPHABET[num % 62] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded.padStart(7, '0');
}

console.log(encodeBase62(12589412)); // Output: 00000dE`,
    keyTakeaways: [
      "Base62 converts distributed integer IDs into collision-free 7-character URLs.",
      "Cache hot redirects in Redis with LRU to achieve sub-10ms latency.",
      "Use 302 redirects if click-analytics tracking is required; 301 for browser caching."
    ],
    followUp: "Why would you choose 302 Found over 301 Moved Permanently for URL shortener analytics?"
  },
  {
    id: "fs-02",
    category: "full-stack",
    categoryName: "Full Stack",
    topic: "Web Security & Authentication",
    title: "OWASP Top 10: XSS, CSRF, and Secure JWT Cookie Authentication Flow",
    difficulty: "Senior",
    tags: ["Security", "OWASP", "XSS", "CSRF", "JWT", "Web"],
    question: "Compare Cross-Site Scripting (XSS) vs Cross-Site Request Forgery (CSRF). Describe a secure enterprise authentication workflow using Access and Refresh JWT tokens.",
    answer: `
      <p>Securing web applications against malicious attacks requires defense-in-depth across client and server layers.</p>
      <h4>XSS vs CSRF:</h4>
      <ul>
        <li><strong>XSS (Cross-Site Scripting):</strong> Attacker executes malicious JavaScript in the victim's browser context (stealing tokens from <code>localStorage</code> or DOM). <em>Defense:</em> Sanitizing input, Content Security Policy (CSP), encoding output.</li>
        <li><strong>CSRF (Cross-Site Request Forgery):</strong> Attacker tricks victim's browser into submitting unauthorized requests to a site where victim is authenticated. <em>Defense:</em> <code>SameSite=Strict/Lax</code> cookies, Anti-CSRF double-submit tokens.</li>
      </ul>
      <h4>Secure JWT Authentication Architecture:</h4>
      <ol>
        <li><strong>Short-lived Access Token (15 min):</strong> Sent as <code>Authorization: Bearer &lt;token&gt;</code> header in memory (JS state variable, NOT stored in <code>localStorage</code>!).</li>
        <li><strong>Long-lived Refresh Token (7 days):</strong> Stored in an <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Strict</code> cookie inaccessible to JavaScript.</li>
        <li><strong>Silent Refresh Flow:</strong> When Access Token expires, API client uses silent refresh endpoint reading HttpOnly cookie to acquire a new Access Token.</li>
      </ol>
    `,
    codeLanguage: "text",
    code: `Cookie Header Parameters for Security:
Set-Cookie: refreshToken=xyz123; HttpOnly; Secure; SameSite=Strict; Path=/api/auth/refresh`,
    keyTakeaways: [
      "Never store sensitive JWT tokens in localStorage due to XSS vulnerability.",
      "HttpOnly cookies protect refresh tokens from client-side script read access.",
      "SameSite=Strict cookie attribute mitigates cross-site CSRF forgery."
    ],
    followUp: "How do you handle JWT token revocation before expiration time in stateless microservices?"
  }
];
