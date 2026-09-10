// ==========================================================
// Android Interview Questions — Batch 10
// Sapient (Publicis Sapient) Android & Kotlin interview prep:
// questions reconstructed from the candidate's own "QuizMe"
// assessment attempt (Section A: Android, 30-question MCQ),
// answered correctly and explained in depth here rather than
// reproduced with the in-the-moment selections — plus one
// architecture-comparison question (MVVM vs MVP vs MVI)
// researched from public interview reports about later rounds.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b10-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which OOP feature is most responsible for code reusability?",
  "difficulty": "Junior",
  "tags": [
    "OOP",
    "Inheritance",
    "Sapient Interview Prep"
  ],
  "question": "Which feature of OOP describes the reusability of code?",
  "answer": "<p><strong>Inheritance</strong> is the textbook answer — a subclass reuses (and extends) a superclass's fields and methods without rewriting them. Encapsulation is about hiding internal state; Polymorphism is one interface with many implementations; Abstraction hides complexity behind a simpler interface. Reusability specifically is inheritance's defining benefit.</p>\n      <p>Worth adding unprompted in an interview: in modern practice, composition/delegation is often preferred over inheritance for reuse — see the earlier \"why composition over inheritance\" answer in the OOP section for exactly why (the fragile base class problem).</p>"
},
{
  "id": "and-b10-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Is the Volley library suitable for large downloads or streaming?",
  "difficulty": "Junior",
  "tags": [
    "Volley",
    "Networking",
    "Sapient Interview Prep"
  ],
  "question": "Is the Volley library suitable for large downloads or streaming operations?",
  "answer": "<p>No. Volley was explicitly designed for small, frequent RPC-style calls — API requests, image thumbnails — and parses each full response into memory at once. It deliberately does not stream, so a large file download or a streaming response is a poor fit and can cause real memory pressure holding a huge response in memory at once.</p>\n      <p>For large downloads or streaming, use OkHttp directly (which supports streaming response bodies) or <code>DownloadManager</code> for file downloads.</p>"
},
{
  "id": "and-b10-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "In the LiveData observer pattern, which lifecycle state actually receives updates?",
  "difficulty": "Mid",
  "tags": [
    "LiveData",
    "Lifecycle",
    "Sapient Interview Prep"
  ],
  "question": "A LiveData observer updates a UI controller (such as a Fragment) only when the controller is in which of these states: Resumed, in the background, Paused, or Stopped?",
  "answer": "<p><strong>Resumed</strong> (and Started, more precisely — LiveData considers an observer \"active\" once its <code>LifecycleOwner</code> reaches <code>STARTED</code>, not only <code>RESUMED</code>). Paused and Stopped are not active states for LiveData's purposes — updates queue and are held back until the observer's lifecycle returns to at least <code>STARTED</code>.</p>\n      <p>This automatic gating is exactly what \"lifecycle-aware\" means for LiveData — it won't try to update a view that's currently paused or stopped, which is what protects against the classic \"updated a destroyed Fragment's view\" crash class.</p>"
},
{
  "id": "and-b10-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "What are the elements of MVVM?",
  "difficulty": "Junior",
  "tags": [
    "MVVM",
    "Architecture",
    "Sapient Interview Prep"
  ],
  "question": "What are the elements of MVVM?",
  "answer": "<p><strong>Model</strong> (data and business logic), <strong>View</strong> (the UI — passive, observes state and renders it), <strong>ViewModel</strong> (holds and exposes UI state derived from the Model, survives configuration change, and — critically — has no reference back to the View). All three together define the pattern; leaving any one out isn't MVVM.</p>"
},
{
  "id": "and-b10-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which lifecycle methods are shared between Activity and Fragment?",
  "difficulty": "Junior",
  "tags": [
    "Activity Lifecycle",
    "Fragment Lifecycle",
    "Sapient Interview Prep"
  ],
  "question": "Which of the following are methods in both the Activity and Fragment lifecycle?",
  "answer": "<p><code>onCreate()</code>, <code>onStart()</code>, <code>onResume()</code>, <code>onPause()</code>, <code>onStop()</code>, and <code>onDestroy()</code> are common to both. Fragment additionally has view-specific callbacks Activity doesn't — <code>onCreateView</code>, <code>onViewCreated</code>, <code>onDestroyView</code> — since a Fragment's own lifecycle and its View's lifecycle are genuinely separate, which is exactly why an earlier Android Core question covers collecting a Flow via <code>viewLifecycleOwner</code> rather than the Fragment's own <code>lifecycleScope</code>.</p>"
},
{
  "id": "and-b10-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "True or false: a ViewModel should never reference a Fragment, Activity, or View.",
  "difficulty": "Mid",
  "tags": [
    "ViewModel",
    "MVVM",
    "Sapient Interview Prep"
  ],
  "question": "A ViewModel should never contain any references to fragments, activities, or views. True or false?",
  "answer": "<p><strong>True.</strong> This is exactly why a ViewModel survives configuration changes and is unit-testable with no device: holding a UI reference would leak the old, destroyed Activity/Fragment instance across rotation (the ViewModel is retained, but the Activity it referenced isn't), and it would make the ViewModel untestable without instantiating Android framework classes.</p>"
},
{
  "id": "and-b10-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Does a coroutine started on the UI thread block that thread while suspended?",
  "difficulty": "Mid",
  "tags": [
    "Coroutines",
    "UI Thread",
    "Sapient Interview Prep"
  ],
  "question": "Does a coroutine started on the UI thread block the UI thread while it's suspended?",
  "answer": "<p><strong>No</strong> — that's the entire point of a suspending function. When a coroutine hits a suspension point, it releases the thread back to the dispatcher, which is then free to run other work (including other UI updates); the coroutine resumes on that thread later without ever having blocked it.</p>\n      <p>This is fundamentally different from a genuinely blocking call like <code>Thread.sleep()</code>, which does block the thread it runs on — the same distinction the Coroutines section's cancellation-cooperation answer draws on.</p>"
},
{
  "id": "and-b10-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Can messages be added directly to a MessageQueue?",
  "difficulty": "Mid",
  "tags": [
    "MessageQueue",
    "Handler",
    "Sapient Interview Prep"
  ],
  "question": "Can messages be added directly to a MessageQueue?",
  "answer": "<p>Not directly by app code — there's no public API to push onto a <code>MessageQueue</code> yourself. You go through a <code>Handler</code> (<code>sendMessage()</code>/<code>post()</code>), which internally enqueues onto its associated Looper's <code>MessageQueue</code>. The queue itself is an internal implementation detail of the Handler/Looper messaging system, not something app code touches directly.</p>"
},
{
  "id": "and-b10-09",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which Kotlin feature is used to handle null-related exceptions?",
  "difficulty": "Junior",
  "tags": [
    "Kotlin",
    "Null Safety",
    "Sapient Interview Prep"
  ],
  "question": "Which of the following is used to handle null exceptions in Kotlin: Range, Sealed Class, Elvis Operator, or Lambda function?",
  "answer": "<p>The <strong>Elvis operator</strong> (<code>?:</code>) supplies a default value when a nullable expression evaluates to null, working alongside safe calls (<code>?.</code>) — together these are Kotlin's primary tools for handling potential nulls without throwing. Covered in full depth in the Kotlin Fundamentals section's null-safety question.</p>"
},
{
  "id": "and-b10-10",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Where should you store data to avoid losing it on a configuration change?",
  "difficulty": "Mid",
  "tags": [
    "ViewModel",
    "Configuration Change",
    "Sapient Interview Prep"
  ],
  "question": "To avoid losing data during a device configuration change, store app data in which of these: ViewModel, LiveData, Fragment, or Activity?",
  "answer": "<p><strong>ViewModel</strong> — its instance survives a config-change-triggered Activity/Fragment recreation via the retained <code>ViewModelStore</code>. LiveData is commonly held inside a ViewModel and is a fine vehicle for exposing that state reactively, but the actual survival guarantee comes from the ViewModel, not LiveData by itself — a LiveData held as a plain field on the Activity would still be destroyed and recreated like anything else on that Activity.</p>"
},
{
  "id": "and-b10-11",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "In the LiveData observer pattern, what's actually being observed?",
  "difficulty": "Mid",
  "tags": [
    "LiveData",
    "Observer Pattern",
    "Sapient Interview Prep"
  ],
  "question": "In the LiveData observer pattern, what's the observable item — what is actually observed?",
  "answer": "<p>The <strong>data held inside the LiveData object instance</strong>. The LiveData wraps a value and notifies registered observers — a UI controller such as an Activity or Fragment, via a lifecycle-aware observer — whenever that wrapped value changes. The UI controller is the <em>observer</em>, not the thing being observed; it's easy to get this backwards when answering under time pressure.</p>"
},
{
  "id": "and-b10-12",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Does Kotlin have a static keyword?",
  "difficulty": "Junior",
  "tags": [
    "Kotlin",
    "Companion Object",
    "Sapient Interview Prep"
  ],
  "question": "Does Kotlin have a static keyword?",
  "answer": "<p><strong>No.</strong> Kotlin has no <code>static</code> keyword at all. The equivalent tools are a <code>companion object</code> (for members conceptually tied to the class rather than an instance) or top-level functions/properties in a file (for genuinely free-standing utilities).</p>\n      <p>This is a very common trap question precisely because Java developers moving to Kotlin instinctively look for <code>static</code> — it simply isn't there as a keyword, by design.</p>"
},
{
  "id": "and-b10-13",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which of these is not a valid Dark Theme mode?",
  "difficulty": "Mid",
  "tags": [
    "Dark Theme",
    "AppCompatDelegate",
    "Sapient Interview Prep"
  ],
  "question": "Which of the following is not a valid mode for Dark Theme (AppCompatDelegate night mode)?",
  "answer": "<p>The real <code>AppCompatDelegate</code> night-mode constants are <code>MODE_NIGHT_NO</code>, <code>MODE_NIGHT_YES</code>, <code>MODE_NIGHT_FOLLOW_SYSTEM</code>, and <code>MODE_NIGHT_AUTO_BATTERY</code> (plus an internal-default <code>MODE_NIGHT_UNSPECIFIED</code>). There is no <code>MODE_NIGHT_LIGHT</code> and no plain <code>MODE_NIGHT_DARK</code> constant in the real API — the YES/NO naming (rather than the more intuitive-sounding LIGHT/DARK) is exactly what this question is testing whether you actually remember.</p>"
},
{
  "id": "and-b10-14",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "True or false: WorkManager is for deferrable work that must run reliably even across app exit or device restart.",
  "difficulty": "Mid",
  "tags": [
    "WorkManager",
    "Sapient Interview Prep"
  ],
  "question": "WorkManager is intended for work that is deferrable — not required to run immediately — and required to run reliably even if the app exits or the device restarts. True or false?",
  "answer": "<p><strong>True</strong> — that is WorkManager's exact stated purpose in the official documentation: deferrable, guaranteed background work. It's distinct from work that must run immediately (that's a foreground service's job) or work that's fine to lose if the process dies (a plain coroutine in a ViewModel's scope, which is cancelled with the ViewModel).</p>"
},
{
  "id": "and-b10-15",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which design pattern decouples an abstraction from its implementation?",
  "difficulty": "Senior",
  "tags": [
    "Bridge Pattern",
    "Design Patterns",
    "Sapient Interview Prep"
  ],
  "question": "Which design pattern is used when you need to decouple an abstraction from its implementation so the two can vary independently?",
  "answer": "<p>The <strong>Bridge pattern</strong> — it splits a class hierarchy into two independent hierarchies, an abstraction and an implementation, connected by composition rather than inheritance, so either side can be extended without touching the other.</p>\n      <p>Distinct from Adapter, which makes an existing, incompatible interface work with client code — Adapter is about compatibility after the fact, Bridge is about designing for independent variation from the start.</p>"
},
{
  "id": "and-b10-16",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Does RxJava follow a 'push' or 'pull' pattern?",
  "difficulty": "Mid",
  "tags": [
    "RxJava",
    "Reactive Programming",
    "Sapient Interview Prep"
  ],
  "question": "Is RxJava following the 'push' or 'pull' pattern?",
  "answer": "<p><strong>Push</strong> — an RxJava <code>Observable</code> actively emits (pushes) items to its subscribers as they become available, rather than the consumer pulling/requesting each item on demand (closer to how a plain <code>Iterator</code> or a Kotlin <code>Sequence</code> works). This distinction is exactly why backpressure is a real concern in RxJava, and why <code>Flowable</code> exists alongside <code>Observable</code> specifically for push sources that can overwhelm a slow consumer.</p>"
},
{
  "id": "and-b10-17",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "True or false: the Runtime class is an example of Singleton.",
  "difficulty": "Junior",
  "tags": [
    "Singleton",
    "Java",
    "Sapient Interview Prep"
  ],
  "question": "Runtime class is an example of Singleton. True or false?",
  "answer": "<p><strong>True</strong> — <code>Runtime.getRuntime()</code> returns the single JVM-wide <code>Runtime</code> instance; the class has a private constructor and no public way to construct a new instance, a textbook Singleton implementation.</p>"
},
{
  "id": "and-b10-18",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "The CREATED lifecycle state for an Activity is reached in which cases?",
  "difficulty": "Senior",
  "tags": [
    "Lifecycle",
    "LifecycleOwner",
    "Sapient Interview Prep"
  ],
  "question": "The Created state for a LifecycleOwner is reached in which cases, for an Activity?",
  "answer": "<p>Right after <code>onCreate()</code> returns, <strong>and</strong> again right before <code>onDestroy()</code> is called on the way back down (after <code>onStop()</code>). <code>CREATED</code> is the state the lifecycle passes through both entering (post-creation, pre-start) and exiting (post-stop, pre-destroy) — a multi-select question where picking only one direction is the common mistake.</p>"
},
{
  "id": "and-b10-19",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which of these can be used to parse XML data on Android?",
  "difficulty": "Junior",
  "tags": [
    "XML Parsing",
    "Sapient Interview Prep"
  ],
  "question": "Which among the following can be used to parse XML data: DOMParser, XmlPullParser, ExpatPullParser, or all of the above?",
  "answer": "<p><strong>All of the above</strong>. <code>DOMParser</code> loads the whole document tree into memory — easy to navigate, memory-heavy for large documents. <code>XmlPullParser</code> is Android's standard streaming pull-parser, memory-efficient. <code>ExpatPullParser</code> is the underlying native Expat-based implementation Android's <code>XmlPullParser</code> often wraps. All three are valid, with different memory/ergonomics tradeoffs.</p>"
},
{
  "id": "and-b10-20",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Do threads have a message loop (Looper) by default?",
  "difficulty": "Mid",
  "tags": [
    "Looper",
    "Threading",
    "Sapient Interview Prep"
  ],
  "question": "Do threads by default have a message loop associated with them?",
  "answer": "<p><strong>No</strong> — only the main/UI thread gets a Looper automatically prepared for it by the Android framework. Any other thread that needs a Looper (to run a Handler on that thread) must explicitly call <code>Looper.prepare()</code> before creating the Handler, and <code>Looper.loop()</code> to actually start processing messages. <code>HandlerThread</code> is the convenience class that does this setup for you.</p>"
},
{
  "id": "and-b10-21",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "What is the minimum backoff delay in WorkManager?",
  "difficulty": "Mid",
  "tags": [
    "WorkManager",
    "Backoff",
    "Sapient Interview Prep"
  ],
  "question": "What is the minimum backOff delay in WorkManager?",
  "answer": "<p><strong>10 seconds</strong> (<code>WorkRequest.MIN_BACKOFF_MILLIS</code> = 10,000ms) — a hard floor WorkManager enforces on <code>setBackoffCriteria()</code>. You can't request a shorter minimum retry delay than that; it's a deliberate design choice to stop retrying work from draining the battery.</p>"
},
{
  "id": "and-b10-22",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "Which method returns a new Message instance from the global pool?",
  "difficulty": "Junior",
  "tags": [
    "Message",
    "Object Pooling",
    "Sapient Interview Prep"
  ],
  "question": "Which among the following methods returns a new Message instance from the global pool: getDataFromPool(), peekDataFromPool(), seekDataFromPool(), or obtain()?",
  "answer": "<p><code>Message.obtain()</code> — it pulls a recycled <code>Message</code> from an internal pool instead of allocating a new object every time. This matters because messages are posted at high frequency in some apps (a genuine hot path for Handler-based code); allocating a fresh object on every post would create real, avoidable GC pressure.</p>"
},
{
  "id": "and-b10-23",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "How do you retrieve the message queue from a Looper?",
  "difficulty": "Senior",
  "tags": [
    "Looper",
    "MessageQueue",
    "Sapient Interview Prep"
  ],
  "question": "How do you retrieve the message queue from a Looper?",
  "answer": "<p><code>Looper.myQueue()</code> — called on the current thread's Looper to get its associated <code>MessageQueue</code>. There's no <code>getMessageQueue()</code> method in the real API; that name is a plausible-sounding trap that follows ordinary Java getter-naming conventions Android's actual API doesn't always follow.</p>"
},
{
  "id": "and-b10-24",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "How do you terminate a Looper without processing remaining queued messages?",
  "difficulty": "Senior",
  "tags": [
    "Looper",
    "Threading",
    "Sapient Interview Prep"
  ],
  "question": "How do you terminate a Looper without processing any more messages already in the message queue?",
  "answer": "<p><code>Looper.quit()</code> — terminates immediately, discarding any messages still pending in the queue. <code>Looper.quitSafely()</code> is the gentler alternative: it lets already-due queued messages finish processing first, then terminates. The distinction between \"stop right now, drop what's pending\" and \"finish what's already queued, then stop\" is exactly the nuance this question tests.</p>"
},
{
  "id": "and-b10-25",
  "category": "android",
  "categoryName": "Android",
  "topic": "Sapient Interview Prep",
  "title": "MVVM vs MVP vs MVI — how do they differ, and which would you defend in a senior-round interview?",
  "difficulty": "Senior",
  "tags": [
    "MVVM",
    "MVP",
    "MVI",
    "Architecture",
    "Sapient Interview Prep"
  ],
  "question": "MVVM vs MVP vs MVI — how do they differ, and which does a later-round architecture interview expect you to be able to defend?",
  "answer": "<p><strong>MVP:</strong> the Presenter holds a direct reference to the View interface and calls its methods imperatively (<code>view.showLoading()</code>) — tightly coupled but simple to reason about, usually 1:1 Presenter-to-View.</p>\n      <p><strong>MVVM:</strong> the ViewModel exposes observable state (LiveData/StateFlow) and has <em>no</em> reference to the View at all — the View observes and renders itself, a much looser coupling, and exactly what Android's Architecture Components are built around.</p>\n      <p><strong>MVI:</strong> takes MVVM's one-way data flow further into a strict unidirectional cycle — Intent (user action) → a single reducer function produces a new immutable State → the View renders that State — trading more boilerplate for very predictable, easily testable state transitions (the same reducer/FSM discipline as the earlier \"why is a pure reducer better than the State pattern\" answer).</p>\n      <p>The senior-level answer names the real tradeoff rather than declaring a winner: MVVM is the pragmatic default today given first-class Jetpack support; MVP is legacy/simpler for a small app or an older codebase; MVI earns its extra ceremony specifically when a screen's state transitions are complex enough that \"what state can this screen actually be in\" needs to be exhaustively enumerable.</p>"
}
);
