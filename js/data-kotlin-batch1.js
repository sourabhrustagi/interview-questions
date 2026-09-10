// ==========================================================
// Android & Kotlin Interview Drill — Batch 1 of 6
// Topics: 01 Kotlin Fundamentals, 02 Kotlin Advanced, 03 Coroutines,
//         04 Flow/StateFlow/SharedFlow/Channel, 05 OOP/SOLID/Patterns
// Generated from the pasted drill bank; appends into QUESTION_DATA
// (declared in js/data.js). Load this file AFTER js/data.js and
// BEFORE js/app.js. Each topic also gets a synthetic recap card
// (id ending in "-recap") carrying its "5 to memorise" list.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "kt-1-01",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "How does Kotlin's null safety actually work, and when is <code>!!</code> acceptable?",
  "difficulty": "Mid",
  "tags": [
    "!!",
    "String",
    "String?",
    "?.",
    "Kotlin Fundamentals"
  ],
  "question": "How does Kotlin's null safety actually work, and when is <code>!!</code> acceptable?",
  "answer": "<p>Nullability is part of the type: <code>String</code> and <code>String?</code> are different types, and the compiler refuses unsafe calls on the nullable one. <code>?.</code> short-circuits, <code>?:</code> supplies a default, <code>?.let</code> runs a block only when non-null. <code>!!</code> is a deliberate crash. It's acceptable only where you can prove non-null and a crash is the right outcome — a view binding after <code>onCreateView</code>, for example. Prefer <code>requireNotNull(x) { \"why\" }</code>, which crashes with a message.</p>\n      <pre><code>val len = name?.length ?: 0\nval cfg = requireNotNull(map[\"host\"]) { \"host missing from config\" }</code></pre>"
},
{
  "id": "kt-1-02",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "What is a platform type, and why is it dangerous?",
  "difficulty": "Mid",
  "tags": [
    "String!",
    "@Nullable",
    "@NonNull",
    "Kotlin Fundamentals"
  ],
  "question": "What is a platform type, and why is it dangerous?",
  "answer": "<p>A type coming from unannotated Java — written <code>String!</code>. Kotlin can't prove it non-null, so it relaxes the check and lets you use it as either. If it turns out null, you get an NPE at a line that looks perfectly safe. Fix at the source: annotate the Java with <code>@Nullable</code>/<code>@NonNull</code>, or immediately narrow it at the boundary — <code>val s: String = javaCall() ?: return</code>.</p>"
},
{
  "id": "kt-1-03",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>val</code> vs <code>var</code> vs <code>const val</code> — and does <code>val</code> mean immutable?",
  "difficulty": "Mid",
  "tags": [
    "val",
    "var",
    "const val",
    "object",
    "Kotlin Fundamentals"
  ],
  "question": "<code>val</code> vs <code>var</code> vs <code>const val</code> — and does <code>val</code> mean immutable?",
  "answer": "<p><code>val</code> is a read-only reference, not an immutable object. <code>const val</code> is a compile-time constant inlined at every call site — top-level or in an <code>object</code>, primitives and String only.</p>\n      <pre><code>const val TIMEOUT_MS = 30_000L       // inlined into callers\nval items = mutableListOf(1)          // items.add(2) is perfectly legal</code></pre>\n      <p><strong>Common wrong answer:</strong> \"val means immutable.\" It means you can't reassign the reference.</p>"
},
{
  "id": "kt-1-04",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "What exactly does a <code>data class</code> generate, and what does it miss?",
  "difficulty": "Mid",
  "tags": [
    "data class",
    "equals",
    "hashCode",
    "toString",
    "Kotlin Fundamentals"
  ],
  "question": "What exactly does a <code>data class</code> generate, and what does it miss?",
  "answer": "<p><code>equals</code>, <code>hashCode</code>, <code>toString</code>, <code>copy</code> and <code>componentN</code> — over constructor properties only. Properties declared in the body are invisible to all of them.</p>\n      <pre><code>data class Tx(val id: String) { var status = \"PENDING\" }\nTx(\"1\").apply { status = \"APPROVED\" } == Tx(\"1\")   // true — status ignored</code></pre>\n      <p>That bites hardest in <code>HashSet</code> and <code>DiffUtil.areContentsTheSame</code>, where a row silently refuses to re-render.</p>"
},
{
  "id": "kt-1-05",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "When should you not use a data class?",
  "difficulty": "Senior",
  "tags": [
    "copy()",
    "@ConsistentCopyVisibility",
    "Kotlin Fundamentals"
  ],
  "question": "When should you not use a data class?",
  "answer": "<p>When the type carries an invariant enforced outside the constructor. <code>copy()</code> is public even when the constructor is private, so it reopens the door you closed with a validating factory.</p>\n      <pre><code>data class Pan private constructor(val value: String) {\n  companion object { fun of(raw: String) = if (isLuhn(raw)) Pan(raw) else null }\n}\ngood.copy(value = \"0000\")   // compiles — bypasses the factory</code></pre>\n      <p><strong>Fixes:</strong> <code>@ConsistentCopyVisibility</code> (default from Kotlin 2.1), or a plain class with hand-written members. Also avoid data classes in a public API — adding a parameter changes <code>copy()</code>'s signature and breaks binary compatibility.</p>"
},
{
  "id": "kt-1-06",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>sealed class</code> vs <code>sealed interface</code> vs <code>enum</code>.",
  "difficulty": "Mid",
  "tags": [
    "sealed class",
    "sealed interface",
    "enum",
    "when",
    "Kotlin Fundamentals"
  ],
  "question": "<code>sealed class</code> vs <code>sealed interface</code> vs <code>enum</code>.",
  "answer": "<p>An enum fixes the set of instances, with no per-instance payload. A sealed type fixes the set of subtypes, each with its own data, and gives an exhaustive <code>when</code> at compile time. A sealed interface allows a subtype to join several hierarchies; a sealed class allows shared stored state.</p>\n      <pre><code>sealed interface TxState\ndata object Idle : TxState\ndata class Declined(val code: String) : TxState   // enum can't carry this</code></pre>\n      <p>Subclasses may live anywhere in the same package and module since Kotlin 1.5.</p>"
},
{
  "id": "kt-1-07",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Why is an <code>else</code> branch on a sealed <code>when</code> a bug?",
  "difficulty": "Mid",
  "tags": [
    "else",
    "when",
    "TxState.Idle -> Unit",
    "Kotlin Fundamentals"
  ],
  "question": "Why is an <code>else</code> branch on a sealed <code>when</code> a bug?",
  "answer": "<p>The whole value of sealed types is that adding a subtype breaks compilation at every call site so a human reviews each one. An <code>else</code> swallows the new case silently. If a branch genuinely does nothing, name it: <code>TxState.Idle -&gt; Unit</code>. Exhaustiveness is enforced when <code>when</code> is used as an expression; since Kotlin 1.7 it's an error for sealed subjects either way.</p>"
},
{
  "id": "kt-1-08",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "The three meanings of <code>object</code>.",
  "difficulty": "Mid",
  "tags": [
    "object",
    "Parcelable.Creator",
    "@JvmStatic",
    "data object",
    "Kotlin Fundamentals"
  ],
  "question": "The three meanings of <code>object</code>.",
  "answer": "<ul><li>Declaration — a lazy, thread-safe singleton (JVM class-init lock does the work).</li><li>Companion object — one per class; a real object, so it can implement interfaces (that's how <code>Parcelable.Creator</code> is done). <code>@JvmStatic</code> for clean Java interop.</li><li>Object expression — an anonymous instance, Kotlin's anonymous inner class.</li></ul>\n      <p><code>data object</code> (1.9+) adds a sensible <code>toString</code> and stable <code>equals</code> — use it for stateless states in a sealed hierarchy. Caution: an <code>object</code> with <code>var</code>s is global mutable state and is untestable; prefer an injected <code>@Singleton</code> class.</p>"
},
{
  "id": "kt-1-09",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "How are extension functions resolved?",
  "difficulty": "Mid",
  "tags": [
    "Kotlin Fundamentals"
  ],
  "question": "How are extension functions resolved?",
  "answer": "<p>Statically. They compile to a static method taking the receiver as the first argument, so they don't participate in polymorphism and can never override a member.</p>\n      <pre><code>fun Base.name() = \"Base\";  fun Derived.name() = \"Derived\"\nval x: Base = Derived()\nx.name()          // \"Base\" — chosen by the STATIC type</code></pre>\n      <p>And if a member with the same signature exists, the member always wins.</p>"
},
{
  "id": "kt-1-10",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Pick the right scope function: <code>let</code>, <code>run</code>, <code>apply</code>, <code>also</code>, <code>with</code>.",
  "difficulty": "Mid",
  "tags": [
    "let",
    "run",
    "apply",
    "also",
    "Kotlin Fundamentals"
  ],
  "question": "Pick the right scope function: <code>let</code>, <code>run</code>, <code>apply</code>, <code>also</code>, <code>with</code>.",
  "answer": "<ul><li><code>let</code> — <code>it</code>, returns the lambda result. Null-check plus transform.</li><li><code>run</code> — <code>this</code>, returns the lambda result. Configure and compute.</li><li><code>apply</code> — <code>this</code>, returns the object. Builder-style configuration.</li><li><code>also</code> — <code>it</code>, returns the object. Side effects such as logging.</li><li><code>with</code> — <code>this</code>, returns the lambda result. Grouping calls on one object.</li></ul>\n      <p><strong>Two axes only:</strong> receiver (<code>this</code> or <code>it</code>) and return value (object or result).</p>"
},
{
  "id": "kt-1-11",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>lateinit</code> vs <code>by lazy</code>.",
  "difficulty": "Mid",
  "tags": [
    "lateinit",
    "by lazy",
    "lateinit var",
    "::x.isInitialized",
    "Kotlin Fundamentals"
  ],
  "question": "<code>lateinit</code> vs <code>by lazy</code>.",
  "answer": "<p><code>lateinit var</code> — mutable, non-null, no primitives, throws <code>UninitializedPropertyAccessException</code> if read too early; check with <code>::x.isInitialized</code>. <code>by lazy</code> — <code>val</code>, computed on first access, thread-safe by default (<code>LazyThreadSafetyMode.NONE</code> if you're sure of the thread).</p>"
},
{
  "id": "kt-1-12",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>==</code> vs <code>===</code>.",
  "difficulty": "Mid",
  "tags": [
    "==",
    "===",
    "equals",
    "Kotlin Fundamentals"
  ],
  "question": "<code>==</code> vs <code>===</code>.",
  "answer": "<p><code>==</code> calls <code>equals</code> (null-safe); <code>===</code> is reference identity. In Java <code>==</code> on objects is reference equality — a classic interop bug when porting code.</p>"
},
{
  "id": "kt-1-13",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "What is the <code>equals</code>/<code>hashCode</code> contract, and how do you break it?",
  "difficulty": "Senior",
  "tags": [
    "equals",
    "hashCode",
    "val",
    "Kotlin Fundamentals"
  ],
  "question": "What is the <code>equals</code>/<code>hashCode</code> contract, and how do you break it?",
  "answer": "<p>Equal objects must have equal hash codes, and the hash must stay stable while the object lives in a hash container.</p>\n      <pre><code>data class P(var name: String)\nval set = hashSetOf(P(\"a\"))\nset.first().name = \"b\"\nset.contains(P(\"b\"))    // false — stranded in the old bucket</code></pre>\n      <p>Never use a mutable property as a hash key. This is why domain keys should be <code>val</code>.</p>"
},
{
  "id": "kt-1-14",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Read-only vs immutable collections.",
  "difficulty": "Mid",
  "tags": [
    "List",
    "MutableList",
    "toList()",
    "Kotlin Fundamentals"
  ],
  "question": "Read-only vs immutable collections.",
  "answer": "<p><code>List</code> is a read-only interface; the underlying object may still be a <code>MutableList</code> someone else holds. <code>toList()</code> snapshots. For real immutability use kotlinx immutable collections — which also fixes Compose stability.</p>"
},
{
  "id": "kt-1-15",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Sequences vs collections — when does <code>asSequence()</code> win?",
  "difficulty": "Mid",
  "tags": [
    "asSequence()",
    "first()",
    "take()",
    "Kotlin Fundamentals"
  ],
  "question": "Sequences vs collections — when does <code>asSequence()</code> win?",
  "answer": "<p>Collection operators are eager and allocate an intermediate list per step. Sequences are lazy — one pass, no intermediates, and short-circuit on <code>first()</code>/<code>take()</code>.</p>\n      <pre><code>list.map { }.filter { }                      // two lists allocated\nlist.asSequence().map { }.filter { }.first() // stops at the first match</code></pre>\n      <p>Win on large collections or long chains; for small lists the per-element overhead makes sequences slower.</p>"
},
{
  "id": "kt-1-16",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>fold</code> vs <code>reduce</code>.",
  "difficulty": "Mid",
  "tags": [
    "fold",
    "reduce",
    "Kotlin Fundamentals"
  ],
  "question": "<code>fold</code> vs <code>reduce</code>.",
  "answer": "<p><code>fold</code> takes an initial accumulator, works on an empty collection, and can change the result type. <code>reduce</code> uses the first element and throws on empty. Default to <code>fold</code>.</p>"
},
{
  "id": "kt-1-17",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Why does <code>runCatching</code> break coroutines?",
  "difficulty": "Senior",
  "tags": [
    "runCatching",
    "Throwable",
    "CancellationException",
    "Kotlin Fundamentals"
  ],
  "question": "Why does <code>runCatching</code> break coroutines?",
  "answer": "<p>It catches <code>Throwable</code>, which includes <code>CancellationException</code>. Swallowing that tells the coroutine machinery the work completed normally, so structured cancellation stops propagating.</p>\n      <pre><code>catch (c: CancellationException) { throw c }   // always rethrow first\ncatch (e: Exception) { Result.failure(e) }</code></pre>"
},
{
  "id": "kt-1-18",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "How should errors cross a layer boundary in Kotlin?",
  "difficulty": "Mid",
  "tags": [
    "require",
    "check",
    "error",
    "Kotlin Fundamentals"
  ],
  "question": "How should errors cross a layer boundary in Kotlin?",
  "answer": "<p>Kotlin has no checked exceptions, so an exception thrown across a boundary is invisible to callers. Return a sealed result type instead, and reserve exceptions for programmer errors (<code>require</code>, <code>check</code>, <code>error</code>).</p>\n      <pre><code>sealed interface AuthResult {\n  data class Approved(val code: String) : AuthResult\n  data class Declined(val code: String) : AuthResult\n  data object TimedOut : AuthResult\n}</code></pre>"
},
{
  "id": "kt-1-19",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "<code>require</code> vs <code>check</code> vs <code>error</code> vs <code>assert</code>.",
  "difficulty": "Mid",
  "tags": [
    "require",
    "check",
    "error",
    "assert",
    "Kotlin Fundamentals"
  ],
  "question": "<code>require</code> vs <code>check</code> vs <code>error</code> vs <code>assert</code>.",
  "answer": "<p><code>require</code> — argument validation, throws <code>IllegalArgumentException</code>. <code>check</code> — state validation, <code>IllegalStateException</code>. <code>error(msg)</code> — unconditional throw, useful as an expression. <code>assert</code> — only active with a JVM flag, so effectively a no-op on Android; don't rely on it.</p>"
},
{
  "id": "kt-1-20",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Interface vs abstract class in Kotlin.",
  "difficulty": "Mid",
  "tags": [
    "Kotlin Fundamentals"
  ],
  "question": "Interface vs abstract class in Kotlin.",
  "answer": "<p><strong>Interfaces:</strong> multiple inheritance, default implementations, but no backing state (a property in an interface is abstract or has a custom getter). Abstract classes: single inheritance, constructors, stored state. Model a capability with an interface; model partial implementation with state with an abstract class.</p>"
},
{
  "id": "kt-1-21",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "What Java-interop annotations do you actually need?",
  "difficulty": "Mid",
  "tags": [
    "@JvmOverloads",
    "Kotlin Fundamentals"
  ],
  "question": "What Java-interop annotations do you actually need?",
  "answer": "<pre><code>@file:JvmName(\"PaymentUtils\")\nclass Config @JvmOverloads constructor(val host: String, val timeoutMs: Long = 30_000) {\n  companion object { @JvmStatic fun default() = Config(\"api.example.com\") }\n  @JvmField val version = 1\n  @Throws(IOException::class) fun load() { }\n}</code></pre>\n      <p><code>@JvmOverloads</code> is the one that matters on Android — layout inflaters need the telescoping constructors.</p>"
},
{
  "id": "kt-1-22",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "What's a higher-order function, and what does it cost?",
  "difficulty": "Mid",
  "tags": [
    "forEach",
    "let",
    "use",
    "repeat",
    "Kotlin Fundamentals"
  ],
  "question": "What's a higher-order function, and what does it cost?",
  "answer": "<p>A function that takes or returns a function. Every lambda passed to a non-inline function allocates an object at the call site — real garbage in a hot loop or an adapter bind.</p>\n      <pre><code>suspend fun &lt;T&gt; withRetry(times: Int = 3, block: suspend () -&gt; T): T { … }\nval r = withRetry { api.authorize(req) }</code></pre>\n      <p>That's why <code>forEach</code>, <code>let</code>, <code>use</code> and <code>repeat</code> are all <code>inline</code>.</p>"
},
{
  "id": "kt-1-recap",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Fundamentals",
  "title": "Kotlin Fundamentals — the 5 to memorise",
  "difficulty": "Senior",
  "tags": [
    "Kotlin Fundamentals",
    "Recap"
  ],
  "question": "Under interview pressure, what are the five highest-yield facts to have ready for Kotlin Fundamentals?",
  "answer": "<p>A compressed recap of this section — the five points worth having ready verbatim before a senior Android/Kotlin loop.</p>",
  "keyTakeaways": [
    "1.4/1.5 — data class members cover constructor properties only, and <code>copy()</code> bypasses a private constructor.",
    "1.7 — never write <code>else</code> on a sealed <code>when</code>; the compile break is the feature.",
    "1.9 — extensions are static; a member always wins.",
    "1.13 — mutating a property used in <code>hashCode</code> strands the object in a hash container.",
    "1.17 — <code>runCatching</code> swallows <code>CancellationException</code>; rethrow it."
  ],
  "followUp": "\"I'd have to check the exact compiler behaviour, but the model I work from is — \" and then state the model. Reasoning from a stated model beats a guessed fact."
},
{
  "id": "kt-2-01",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Explain <code>in</code> and <code>out</code> variance.",
  "difficulty": "Mid",
  "tags": [
    "in",
    "out",
    "out T",
    "Producer<Cat>",
    "Kotlin Advanced"
  ],
  "question": "Explain <code>in</code> and <code>out</code> variance.",
  "answer": "<p><code>out T</code> — covariant, T only ever comes out (a producer). <code>Producer&lt;Cat&gt;</code> is a <code>Producer&lt;Animal&gt;</code>. <code>in T</code> — contravariant, T only goes in (a consumer). <code>Consumer&lt;Animal&gt;</code> is a <code>Consumer&lt;Cat&gt;</code>.</p>\n      <pre><code>interface Producer&lt;out T&gt; { fun produce(): T }\ninterface Consumer&lt;in T&gt; { fun consume(t: T) }</code></pre>\n      <p><strong>Mnemonic:</strong> PECS — producer extends, consumer super. That's why <code>List&lt;out E&gt;</code> is covariant and <code>MutableList</code> is not.</p>"
},
{
  "id": "kt-2-02",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Declaration-site vs use-site variance; what's a star projection?",
  "difficulty": "Mid",
  "tags": [
    "interface P<out T>",
    "Array<out Any>",
    "List<*>",
    "Any?",
    "Kotlin Advanced"
  ],
  "question": "Declaration-site vs use-site variance; what's a star projection?",
  "answer": "<p>Declaration-site is on the type itself (<code>interface P&lt;out T&gt;</code>) — Kotlin's improvement over Java. Use-site is per-usage (<code>Array&lt;out Any&gt;</code>) — Java's wildcards. <code>List&lt;*&gt;</code> is a star projection: \"some type, I don't care\" — you can read as <code>Any?</code> but can't write.</p>"
},
{
  "id": "kt-2-03",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What does <code>reified</code> do, and why does it require <code>inline</code>?",
  "difficulty": "Mid",
  "tags": [
    "reified",
    "inline",
    "T::class.java",
    "Kotlin Advanced"
  ],
  "question": "What does <code>reified</code> do, and why does it require <code>inline</code>?",
  "answer": "<p>Generics erase on the JVM, so <code>T::class.java</code> is normally illegal. <code>inline</code> copies the body to each call site, where the compiler substitutes the concrete type — that substitution is the mechanism, so <code>reified</code> can't exist without it.</p>\n      <pre><code>inline fun &lt;reified T : Activity&gt; Context.start() =\n    startActivity(Intent(this, T::class.java))\nstart&lt;PaymentActivity&gt;()</code></pre>"
},
{
  "id": "kt-2-04",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What does <code>inline</code> buy beyond avoiding an allocation?",
  "difficulty": "Mid",
  "tags": [
    "inline",
    "return",
    "Kotlin Advanced"
  ],
  "question": "What does <code>inline</code> buy beyond avoiding an allocation?",
  "answer": "<p>Non-local return. Because the body is copied in, a <code>return</code> inside the lambda returns from the enclosing function — impossible with a real lambda object, which has its own frame.</p>\n      <pre><code>fun findApproved(txs: List&lt;Tx&gt;): Tx? {\n  txs.forEach { if (it.isApproved) return it }  // returns from findApproved\n  return null\n}</code></pre>\n      <p><strong>Cost:</strong> bytecode bloat if the function is large or called from many sites. Inline small higher-order functions only.</p>"
},
{
  "id": "kt-2-05",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "<code>crossinline</code> vs <code>noinline</code>.",
  "difficulty": "Mid",
  "tags": [
    "crossinline",
    "noinline",
    "Kotlin Advanced"
  ],
  "question": "<code>crossinline</code> vs <code>noinline</code>.",
  "answer": "<p><code>crossinline</code> — still inlined, but forbids non-local return because the lambda escapes into another object (a listener). <code>noinline</code> — opts one parameter out of inlining so it can be stored or passed on as a real object.</p>\n      <pre><code>inline fun onClick(v: View, crossinline body: () -&gt; Unit) {\n  v.setOnClickListener { body() }    // needs crossinline\n}</code></pre>"
},
{
  "id": "kt-2-06",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What is a <code>value class</code> and when does it box?",
  "difficulty": "Senior",
  "tags": [
    "value class",
    "Stan",
    "Pan",
    "Any",
    "Kotlin Advanced"
  ],
  "question": "What is a <code>value class</code> and when does it box?",
  "answer": "<p>At runtime it is the wrapped primitive — no allocation. At compile time it's a distinct type, so <code>Stan</code> and <code>Pan</code> can't be swapped.</p>\n      <pre><code>@JvmInline value class Stan(val value: String)\nfun f(s: Stan)          // inlined → f(String)\nfun g(s: Stan?)         // BOXED — nullable needs an object\nval l: List&lt;Stan&gt;       // BOXED — generics erase</code></pre>\n      <p>Also boxes when used as a supertype (<code>Any</code>) or a type parameter. One <code>val</code> in the constructor, no backing fields in the body, can implement interfaces but not extend a class. JVM names are mangled — <code>@JvmName</code> if Java calls it.</p>"
},
{
  "id": "kt-2-07",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "<code>typealias</code> vs <code>value class</code>.",
  "difficulty": "Mid",
  "tags": [
    "typealias",
    "value class",
    "typealias Stan = String",
    "Kotlin Advanced"
  ],
  "question": "<code>typealias</code> vs <code>value class</code>.",
  "answer": "<p><code>typealias Stan = String</code> is documentation with zero safety — any String still fits. A value class is a real type. Use typealias to shorten long generic or function types; use a value class to prevent mix-ups.</p>"
},
{
  "id": "kt-2-08",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Class delegation with <code>by</code> — what problem does it solve?",
  "difficulty": "Mid",
  "tags": [
    "by",
    "Kotlin Advanced"
  ],
  "question": "Class delegation with <code>by</code> — what problem does it solve?",
  "answer": "<p>It generates the forwarding methods for composition, so a decorator only writes what it changes. This is how you stack behaviours without inheritance.</p>\n      <pre><code>class RetryingReader(private val d: CardReader, private val n: Int)\n    : CardReader by d {\n  override suspend fun waitForCard(t: Duration) = /* retry around d */\n}</code></pre>"
},
{
  "id": "kt-2-09",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Write a custom property delegate.",
  "difficulty": "Mid",
  "tags": [
    "lazy",
    "Delegates.observable",
    "Delegates.vetoable",
    "Delegates.notNull",
    "Kotlin Advanced"
  ],
  "question": "Write a custom property delegate.",
  "answer": "<pre><code>class Pref(private val key: String, private val p: SharedPreferences)\n    : ReadWriteProperty&lt;Any?, String&gt; {\n  override fun getValue(t: Any?, prop: KProperty&lt;*&gt;) = p.getString(key, \"\")!!\n  override fun setValue(t: Any?, prop: KProperty&lt;*&gt;, v: String) =\n      p.edit().putString(key, v).apply()\n}\nvar token: String by Pref(\"token\", prefs)</code></pre>\n      <p>Built-ins worth naming: <code>lazy</code>, <code>Delegates.observable</code>, <code>Delegates.vetoable</code>, <code>Delegates.notNull</code>, and map delegation.</p>"
},
{
  "id": "kt-2-10",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What is a function type with a receiver, and where have you used one?",
  "difficulty": "Mid",
  "tags": [
    "T.() -> R",
    "this",
    "T",
    "apply",
    "Kotlin Advanced"
  ],
  "question": "What is a function type with a receiver, and where have you used one?",
  "answer": "<p><code>T.() -&gt; R</code> — inside the lambda, <code>this</code> is a <code>T</code>. It's what makes <code>apply</code> work and what every Kotlin DSL is built on, including Compose's <code>content</code> slots and Gradle's Kotlin DSL.</p>\n      <pre><code>fun receipt(block: ReceiptBuilder.() -&gt; Unit) = ReceiptBuilder().apply(block).build()\nreceipt { line(\"MERCHANT\"); divider(); line(\"TOTAL 250.00\") }</code></pre>\n      <p><code>@DslMarker</code> stops outer receivers leaking into nested scopes.</p>"
},
{
  "id": "kt-2-11",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What are Kotlin contracts for?",
  "difficulty": "Mid",
  "tags": [
    "val x: Int; run { x = 1 }",
    "Kotlin Advanced"
  ],
  "question": "What are Kotlin contracts for?",
  "answer": "<p>They tell the compiler something it can't infer, so smart casts survive your own helper functions.</p>\n      <pre><code>fun Any?.isCard(): Boolean {\n  contract { returns(true) implies (this@isCard is CardData) }\n  return this is CardData\n}</code></pre>\n      <p>Also used by the stdlib to promise a lambda is invoked exactly once, which is how <code>val x: Int; run { x = 1 }</code> compiles.</p>"
},
{
  "id": "kt-2-12",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Operator overloading and <code>infix</code> — when is it appropriate?",
  "difficulty": "Mid",
  "tags": [
    "infix",
    "Money + Money",
    "Duration * 2",
    "+",
    "Kotlin Advanced"
  ],
  "question": "Operator overloading and <code>infix</code> — when is it appropriate?",
  "answer": "<p>When the operator's conventional meaning is exactly right — <code>Money + Money</code>, <code>Duration * 2</code>. Never for cleverness; a reader must not have to look up what <code>+</code> does.</p>\n      <pre><code>operator fun Money.plus(o: Money) = Money(minor + o.minor)\noperator fun Money.compareTo(o: Money) = minor.compareTo(o.minor)</code></pre>"
},
{
  "id": "kt-2-13",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "How does destructuring work, and what's the trap?",
  "difficulty": "Mid",
  "tags": [
    "component1()",
    "component2()",
    "Kotlin Advanced"
  ],
  "question": "How does destructuring work, and what's the trap?",
  "answer": "<p>It calls <code>component1()</code>, <code>component2()</code> … positionally. Reorder the constructor properties of a data class and every destructuring site silently changes meaning without a compile error.</p>\n      <pre><code>val (state, effects) = reduce(current, event)</code></pre>"
},
{
  "id": "kt-2-14",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Generic constraints and multiple bounds.",
  "difficulty": "Mid",
  "tags": [
    "<T : Comparable<T>>",
    "where",
    "Kotlin Advanced"
  ],
  "question": "Generic constraints and multiple bounds.",
  "answer": "<pre><code>fun &lt;T&gt; sorted(l: List&lt;T&gt;) where T : Comparable&lt;T&gt;, T : Parcelable = l.sorted()</code></pre>\n      <p>Single bound goes inline (<code>&lt;T : Comparable&lt;T&gt;&gt;</code>); multiple bounds need the <code>where</code> clause.</p>"
},
{
  "id": "kt-2-15",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Why can't you have two overloads that differ only by generic type?",
  "difficulty": "Mid",
  "tags": [
    "f(List<String>)",
    "f(List<Int>)",
    "@JvmName",
    "inline reified",
    "Kotlin Advanced"
  ],
  "question": "Why can't you have two overloads that differ only by generic type?",
  "answer": "<p>Erasure — <code>f(List&lt;String&gt;)</code> and <code>f(List&lt;Int&gt;)</code> have the same JVM signature. Workarounds: <code>@JvmName</code> on one of them, different parameter names with named arguments, or make one <code>inline reified</code>.</p>"
},
{
  "id": "kt-2-16",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What is an <code>inline class</code> hierarchy alternative — how do you model a closed set with behaviour?",
  "difficulty": "Mid",
  "tags": [
    "inline class",
    "Kotlin Advanced"
  ],
  "question": "What is an <code>inline class</code> hierarchy alternative — how do you model a closed set with behaviour?",
  "answer": "<p>Sealed interface with per-subtype behaviour, or an enum with abstract members:</p>\n      <pre><code>enum class Tender { CARD { override fun fee() = 2 },\n                    UPI  { override fun fee() = 0 };\n  abstract fun fee(): Int }</code></pre>\n      <p>Enum-with-behaviour is fine for a truly fixed set with no per-instance data; sealed once cases carry different payloads.</p>"
},
{
  "id": "kt-2-17",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "How do you make a class thread-safe in Kotlin?",
  "difficulty": "Mid",
  "tags": [
    "Mutex",
    "@Synchronized",
    "ReentrantLock",
    "synchronized",
    "Kotlin Advanced"
  ],
  "question": "How do you make a class thread-safe in Kotlin?",
  "answer": "<p><strong>In order of preference:</strong> make it immutable; confine it to one thread/dispatcher; use atomics; then a <code>Mutex</code> for suspending code or <code>@Synchronized</code>/<code>ReentrantLock</code> for blocking code. Never <code>synchronized</code> around a suspension point.</p>"
},
{
  "id": "kt-2-18",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "<code>@Volatile</code> in Kotlin and double-checked locking.",
  "difficulty": "Senior",
  "tags": [
    "@Volatile",
    "object",
    "by lazy",
    "Kotlin Advanced"
  ],
  "question": "<code>@Volatile</code> in Kotlin and double-checked locking.",
  "answer": "<p><strong>Same JVM semantics:</strong> visibility and ordering, not atomicity. Without <code>@Volatile</code>, DCL can publish a partially constructed object because the constructor's writes may be reordered after the reference assignment.</p>\n      <pre><code>@Volatile private var instance: Db? = null</code></pre>\n      <p>In Kotlin you'd normally just use <code>object</code> or <code>by lazy</code>, which handle it for you.</p>"
},
{
  "id": "kt-2-19",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "What is reflection's cost on Android, and what replaces it?",
  "difficulty": "Mid",
  "tags": [
    "kotlin-reflect",
    "Kotlin Advanced"
  ],
  "question": "What is reflection's cost on Android, and what replaces it?",
  "answer": "<p><code>kotlin-reflect</code> is a large dependency and slow; it also fights R8 (everything reflected must be kept). Prefer KSP-generated code — Room, Hilt, kotlinx.serialization all generate rather than reflect.</p>"
},
{
  "id": "kt-2-20",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "KAPT vs KSP.",
  "difficulty": "Mid",
  "tags": [
    "Kotlin Advanced"
  ],
  "question": "KAPT vs KSP.",
  "answer": "<p>KAPT generates Java stubs for every Kotlin file so a Java annotation processor can read them — slow. KSP reads the Kotlin symbol graph directly, typically ~2× faster and Kotlin-aware (nullability, default arguments). Migrate everything that offers KSP.</p>"
},
{
  "id": "kt-2-recap",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Kotlin Advanced",
  "title": "Kotlin Advanced — the 5 to memorise",
  "difficulty": "Senior",
  "tags": [
    "Kotlin Advanced",
    "Recap"
  ],
  "question": "Under interview pressure, what are the five highest-yield facts to have ready for Kotlin Advanced?",
  "answer": "<p>A compressed recap of this section — the five points worth having ready verbatim before a senior Android/Kotlin loop.</p>",
  "keyTakeaways": [
    "2.1 — <code>out</code> = producer, <code>in</code> = consumer; that's why <code>MutableList</code> is invariant.",
    "2.3/2.4 — <code>reified</code> needs <code>inline</code> because substitution at the call site is the mechanism; inline also enables non-local return.",
    "2.6 — a value class boxes when nullable, generic, or used as a supertype.",
    "2.8 — <code>by</code> makes decorators cheap; that's composition over inheritance in one keyword.",
    "2.20 — KSP over KAPT, always."
  ],
  "followUp": "tie it back to the JVM. Most Kotlin \"why\" questions bottom out in erasure, boxing, or static resolution — say which one you think applies and reason forward."
},
{
  "id": "kt-3-01",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "What is a coroutine, and how is it different from a thread?",
  "difficulty": "Mid",
  "tags": [
    "Coroutines"
  ],
  "question": "What is a coroutine, and how is it different from a thread?",
  "answer": "<p>A suspending computation multiplexed over threads. Suspension releases the thread instead of blocking it, so thousands of coroutines cost far less than thousands of threads (~1 MB of stack each). It's a library plus one compiler transform, not an OS concept.</p>"
},
{
  "id": "kt-3-02",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "What does the compiler do to a <code>suspend</code> function?",
  "difficulty": "Senior",
  "tags": [
    "suspend",
    "Continuation",
    "label",
    "suspendCancellableCoroutine",
    "Coroutines"
  ],
  "question": "What does the compiler do to a <code>suspend</code> function?",
  "answer": "<p><strong>CPS transform:</strong> it adds a hidden <code>Continuation</code> parameter and rewrites the body as a state machine with a <code>label</code> field, one state per suspension point. Resuming means re-entering the same function with the label advanced.</p>\n      <pre><code>// suspend fun auth(r: Req): Res\n// becomes ≈ fun auth(r: Req, cont: Continuation&lt;Res&gt;): Any?</code></pre>\n      <p>That's also why you can bridge a callback API with <code>suspendCancellableCoroutine</code> — you're handed the continuation.</p>"
},
{
  "id": "kt-3-03",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "What is structured concurrency and what does it guarantee?",
  "difficulty": "Mid",
  "tags": [
    "Job",
    "Coroutines"
  ],
  "question": "What is structured concurrency and what does it guarantee?",
  "answer": "<p>Every coroutine has a parent <code>Job</code>. Cancelling the parent cancels all children; the parent doesn't complete until its children do; a child failure propagates up. Practically: no orphaned work, and leaks become structurally difficult rather than a discipline problem.</p>"
},
{
  "id": "kt-3-04",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>launch</code> vs <code>async</code>.",
  "difficulty": "Mid",
  "tags": [
    "launch",
    "async",
    "Job",
    "Deferred<T>",
    "Coroutines"
  ],
  "question": "<code>launch</code> vs <code>async</code>.",
  "answer": "<p><code>launch</code> returns a <code>Job</code>, fire-and-forget, and an exception propagates to the parent immediately. <code>async</code> returns <code>Deferred&lt;T&gt;</code> and holds the exception until <code>await()</code> — so an <code>async</code> you never await can swallow a failure.</p>"
},
{
  "id": "kt-3-05",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Run two calls in parallel and combine them.",
  "difficulty": "Mid",
  "tags": [
    "coroutineScope",
    "Coroutines"
  ],
  "question": "Run two calls in parallel and combine them.",
  "answer": "<pre><code>suspend fun load(): Screen = coroutineScope {\n  val user = async { api.user() }\n  val txs  = async { db.recent() }\n  Screen(user.await(), txs.await())\n}</code></pre>\n      <p><code>coroutineScope</code> matters: it waits for both and cancels the sibling if one fails.</p>"
},
{
  "id": "kt-3-06",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>coroutineScope</code> vs <code>supervisorScope</code>.",
  "difficulty": "Mid",
  "tags": [
    "coroutineScope",
    "supervisorScope",
    "Coroutines"
  ],
  "question": "<code>coroutineScope</code> vs <code>supervisorScope</code>.",
  "answer": "<p><code>coroutineScope</code>: one child fails → siblings cancelled, exception rethrown. <code>supervisorScope</code>: children fail independently. Use supervisor when a non-critical child (fetching a logo) must not kill a critical one (the authorization).</p>"
},
{
  "id": "kt-3-07",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Explain the dispatchers.",
  "difficulty": "Mid",
  "tags": [
    "Main",
    "Main.immediate",
    "IO",
    "Default",
    "Coroutines"
  ],
  "question": "Explain the dispatchers.",
  "answer": "<ul><li><code>Main</code> — the UI looper. <code>Main.immediate</code> skips re-dispatch if already there.</li><li><code>IO</code> — elastic pool (default 64) for blocking IO.</li><li><code>Default</code> — sized to CPU cores, for CPU-bound work.</li><li><code>Unconfined</code> — resumes on whatever thread; avoid outside tests.</li></ul>\n      <p><code>IO</code> and <code>Default</code> share threads, so <code>withContext(IO)</code> from <code>Default</code> is often just a marker, not a thread hop.</p>"
},
{
  "id": "kt-3-08",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "What does <code>withContext</code> actually do?",
  "difficulty": "Mid",
  "tags": [
    "withContext",
    "launch",
    "Coroutines"
  ],
  "question": "What does <code>withContext</code> actually do?",
  "answer": "<p>It suspends the current coroutine and resumes the block on another dispatcher, then returns. It does not start a new coroutine and does not create a new branch of the job hierarchy — that's the difference from <code>launch</code>.</p>"
},
{
  "id": "kt-3-09",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Why is cancellation cooperative, and how do you break it?",
  "difficulty": "Mid",
  "tags": [
    "CancellationException",
    "delay",
    "isActive",
    "ensureActive()",
    "Coroutines"
  ],
  "question": "Why is cancellation cooperative, and how do you break it?",
  "answer": "<p>Cancellation sets a flag; suspension points check it and throw <code>CancellationException</code>. Code with no suspension point never notices.</p>\n      <pre><code>val job = launch { repeat(1000) { println(it); Thread.sleep(10) } }\ndelay(50); job.cancel()      // keeps printing — sleep isn't a suspension point</code></pre>\n      <p><strong>Fix:</strong> use <code>delay</code>, check <code>isActive</code>, or call <code>ensureActive()</code> in the loop.</p>"
},
{
  "id": "kt-3-10",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "How do you run cleanup that must survive cancellation?",
  "difficulty": "Mid",
  "tags": [
    "NonCancellable",
    "finally",
    "Coroutines"
  ],
  "question": "How do you run cleanup that must survive cancellation?",
  "answer": "<pre><code>try { work() } finally {\n  withContext(NonCancellable) { releaseHardware() }   // suspending cleanup\n}</code></pre>\n      <p>Without <code>NonCancellable</code>, any suspending call in the <code>finally</code> throws immediately because the job is already cancelled.</p>"
},
{
  "id": "kt-3-11",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>cancel()</code> vs <code>cancelAndJoin()</code>.",
  "difficulty": "Mid",
  "tags": [
    "cancel()",
    "cancelAndJoin()",
    "Coroutines"
  ],
  "question": "<code>cancel()</code> vs <code>cancelAndJoin()</code>.",
  "answer": "<p><code>cancel()</code> only requests and returns immediately. <code>cancelAndJoin()</code> waits until the coroutine has actually finished unwinding. Use the second when you must know a hardware handle or file was released before proceeding.</p>"
},
{
  "id": "kt-3-12",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "How does exception handling work — where does the handler go?",
  "difficulty": "Mid",
  "tags": [
    "CoroutineExceptionHandler",
    "launch",
    "async",
    "await()",
    "Coroutines"
  ],
  "question": "How does exception handling work — where does the handler go?",
  "answer": "<p><code>CoroutineExceptionHandler</code> works only on the scope (or the outermost <code>launch</code>), never on a child, and never for <code>async</code> — there the exception surfaces at <code>await()</code>.</p>\n      <pre><code>val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main + handler)</code></pre>\n      <p>Note <code>SupervisorJob</code>: with a plain <code>Job</code>, one failing child cancels the whole scope, so the next <code>launch</code> silently does nothing.</p>"
},
{
  "id": "kt-3-13",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>Job</code> vs <code>SupervisorJob</code>.",
  "difficulty": "Mid",
  "tags": [
    "Job",
    "SupervisorJob",
    "Coroutines"
  ],
  "question": "<code>Job</code> vs <code>SupervisorJob</code>.",
  "answer": "<p><code>SupervisorJob</code> doesn't propagate child failure upward or to siblings. Standard for a long-lived scope — a ViewModel or a repository — where one failed request must not kill the scope.</p>"
},
{
  "id": "kt-3-14",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Which scope, where?",
  "difficulty": "Mid",
  "tags": [
    "viewModelScope",
    "onCleared",
    "lifecycleScope",
    "GlobalScope",
    "Coroutines"
  ],
  "question": "Which scope, where?",
  "answer": "<p><code>viewModelScope</code> — cancelled in <code>onCleared</code>. <code>lifecycleScope</code> — cancelled on destroy. <code>viewLifecycleOwner.lifecycleScope</code> in a Fragment. <code>GlobalScope</code> — unscoped, a leak, never in app code. For work that must outlive the UI, use WorkManager, not a wider scope.</p>"
},
{
  "id": "kt-3-15",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Wrap a callback-based device SDK in a coroutine.",
  "difficulty": "Senior",
  "tags": [
    "Coroutines"
  ],
  "question": "Wrap a callback-based device SDK in a coroutine.",
  "answer": "<pre><code>suspend fun waitForCard(t: Duration): CardReadResult = withContext(sdkDispatcher) {\n  withTimeoutOrNull(t) {\n    suspendCancellableCoroutine { cont -&gt;\n      val done = AtomicBoolean(false)\n      val l = object : ReadListener {\n        override fun onCard(d: CardData) {\n          if (done.compareAndSet(false, true)) cont.resume(Success(d))\n        }\n      }\n      cont.invokeOnCancellation { sdk.cancelRead() }\n      sdk.startRead(l)\n    }\n  } ?: Timeout\n}</code></pre>\n      <p><strong>Three things to volunteer:</strong> resume exactly once (SDKs do fire twice), free the hardware on cancellation, and pin to a single-thread dispatcher because many terminal SDKs require one consistent thread.</p>"
},
{
  "id": "kt-3-16",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>withTimeout</code> vs <code>withTimeoutOrNull</code>.",
  "difficulty": "Mid",
  "tags": [
    "withTimeout",
    "withTimeoutOrNull",
    "TimeoutCancellationException",
    "CancellationException",
    "Coroutines"
  ],
  "question": "<code>withTimeout</code> vs <code>withTimeoutOrNull</code>.",
  "answer": "<p><code>withTimeout</code> throws <code>TimeoutCancellationException</code> (a <code>CancellationException</code>, so a bare <code>catch (e: Exception)</code> will eat it and confuse the scope). <code>withTimeoutOrNull</code> returns <code>null</code> — usually what you want, since a timeout is an expected outcome, not an error.</p>"
},
{
  "id": "kt-3-17",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "What is a <code>CoroutineContext</code> made of?",
  "difficulty": "Mid",
  "tags": [
    "CoroutineContext",
    "+",
    "Job",
    "CoroutineDispatcher",
    "Coroutines"
  ],
  "question": "What is a <code>CoroutineContext</code> made of?",
  "answer": "<p>An indexed set of elements combined with <code>+</code>: <code>Job</code>, <code>CoroutineDispatcher</code>, <code>CoroutineName</code>, <code>CoroutineExceptionHandler</code>. A child inherits the parent context with a new Job whose parent is the old one.</p>"
},
{
  "id": "kt-3-18",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>runBlocking</code> — where is it legitimate?",
  "difficulty": "Mid",
  "tags": [
    "runBlocking",
    "main()",
    "runTest",
    "delay",
    "Coroutines"
  ],
  "question": "<code>runBlocking</code> — where is it legitimate?",
  "answer": "<p>Tests, <code>main()</code>, and bridging into legacy blocking code. Never on the main thread in an app — it blocks the thread and defeats the point. In tests prefer <code>runTest</code>, which skips <code>delay</code>.</p>"
},
{
  "id": "kt-3-19",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>Mutex</code> vs <code>synchronized</code> in coroutine code.",
  "difficulty": "Mid",
  "tags": [
    "Mutex",
    "synchronized",
    "Mutex.withLock { }",
    "Coroutines"
  ],
  "question": "<code>Mutex</code> vs <code>synchronized</code> in coroutine code.",
  "answer": "<p><code>synchronized</code> blocks the thread and can't span a suspension point — do it and you can deadlock the dispatcher. <code>Mutex.withLock { }</code> suspends instead. It is also not reentrant, which surprises people.</p>"
},
{
  "id": "kt-3-20",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "How do you make coroutine code testable?",
  "difficulty": "Mid",
  "tags": [
    "Dispatchers.IO",
    "MainDispatcherRule",
    "Dispatchers.setMain/resetMain",
    "runTest",
    "Coroutines"
  ],
  "question": "How do you make coroutine code testable?",
  "answer": "<p>Inject the dispatcher. A class that references <code>Dispatchers.IO</code> directly cannot be made deterministic.</p>\n      <pre><code>class Repo(private val io: CoroutineDispatcher = Dispatchers.IO)\n// test: Repo(StandardTestDispatcher(scheduler))</code></pre>\n      <p>Plus a <code>MainDispatcherRule</code> calling <code>Dispatchers.setMain/resetMain</code>, and <code>runTest</code> with <code>advanceUntilIdle()</code>.</p>"
},
{
  "id": "kt-3-21",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "<code>StandardTestDispatcher</code> vs <code>UnconfinedTestDispatcher</code>.",
  "difficulty": "Mid",
  "tags": [
    "StandardTestDispatcher",
    "UnconfinedTestDispatcher",
    "Coroutines"
  ],
  "question": "<code>StandardTestDispatcher</code> vs <code>UnconfinedTestDispatcher</code>.",
  "answer": "<p>Standard queues coroutines and runs nothing until you advance the scheduler — good for asserting intermediate states. Unconfined runs eagerly to the first real suspension — good when you just want the end result. Most ViewModel tests use Unconfined for the Main rule.</p>"
},
{
  "id": "kt-3-22",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Common coroutine bug: parallel work in a loop.",
  "difficulty": "Mid",
  "tags": [
    "Coroutines"
  ],
  "question": "Common coroutine bug: parallel work in a loop.",
  "answer": "<pre><code>// leaks, no cancellation, no error propagation\nids.forEach { GlobalScope.launch { fetch(it) } }\n\n// correct\ncoroutineScope { ids.map { async { fetch(it) } }.awaitAll() }</code></pre>"
},
{
  "id": "kt-3-recap",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Coroutines",
  "title": "Coroutines — the 5 to memorise",
  "difficulty": "Senior",
  "tags": [
    "Coroutines",
    "Recap"
  ],
  "question": "Under interview pressure, what are the five highest-yield facts to have ready for Coroutines?",
  "answer": "<p>A compressed recap of this section — the five points worth having ready verbatim before a senior Android/Kotlin loop.</p>",
  "keyTakeaways": [
    "3.2 — CPS transform into a state machine with a hidden <code>Continuation</code>.",
    "3.9 — cancellation is cooperative; <code>Thread.sleep</code> and tight loops ignore it.",
    "3.12 — the handler goes on the scope, and <code>async</code> defers its exception to <code>await</code>.",
    "3.15 — resume once, cancel the hardware, pin the thread.",
    "3.20 — inject the dispatcher or you can't test it."
  ],
  "followUp": "\"Let me reason from the job hierarchy\" — nearly every coroutine question is answerable from parent/child job rules plus where the suspension points are."
},
{
  "id": "kt-4-01",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Cold vs hot — what's the practical difference?",
  "difficulty": "Mid",
  "tags": [
    "Flow",
    "Flow & Reactive Streams"
  ],
  "question": "Cold vs hot — what's the practical difference?",
  "answer": "<p>A cold <code>Flow</code> re-runs its producer block for every collector — two collectors means two database queries. A hot flow (StateFlow, SharedFlow, Channel) exists independently of collectors and emits whether anyone listens or not.</p>"
},
{
  "id": "kt-4-02",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Compare StateFlow, SharedFlow and Channel.",
  "difficulty": "Mid",
  "tags": [
    "distinctUntilChanged",
    "Flow & Reactive Streams"
  ],
  "question": "Compare StateFlow, SharedFlow and Channel.",
  "answer": "<ul><li>StateFlow — always has a value, conflates, drops duplicates (<code>distinctUntilChanged</code> built in), replays the latest to every new collector. UI state.</li><li>SharedFlow — configurable replay/buffer, many collectors, no buffering for absent collectors when replay = 0. Broadcast.</li><li>Channel — buffers while nobody listens, each element delivered exactly once to one consumer. One-shot events.</li></ul>"
},
{
  "id": "kt-4-03",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Why is StateFlow wrong for a navigation event?",
  "difficulty": "Senior",
  "tags": [
    "Flow & Reactive Streams"
  ],
  "question": "Why is StateFlow wrong for a navigation event?",
  "answer": "<p><strong>Three separate failures:</strong> it replays to a re-subscribing collector (rotate → navigate twice), it conflates (two toasts 10 ms apart → one), and it drops duplicates (the same decline code twice → the second emits nothing at all).</p>\n      <pre><code>private val _fx = Channel&lt;Effect&gt;(Channel.BUFFERED)\nval effects = _fx.receiveAsFlow()</code></pre>"
},
{
  "id": "kt-4-04",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Then why not <code>SharedFlow(replay = 0)</code> for events?",
  "difficulty": "Mid",
  "tags": [
    "SharedFlow(replay = 0)",
    "Flow & Reactive Streams"
  ],
  "question": "Then why not <code>SharedFlow(replay = 0)</code> for events?",
  "answer": "<p>Because it's hot with no buffer for absent collectors — an event emitted while the screen is stopped is dropped on the floor. A Channel buffers it and delivers on resume. Use SharedFlow for genuine broadcast where missing one is acceptable.</p>"
},
{
  "id": "kt-4-05",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Explain <code>stateIn</code> and <code>WhileSubscribed(5000)</code>.",
  "difficulty": "Mid",
  "tags": [
    "stateIn",
    "WhileSubscribed(5000)",
    "Eagerly",
    "Lazily",
    "Flow & Reactive Streams"
  ],
  "question": "Explain <code>stateIn</code> and <code>WhileSubscribed(5000)</code>.",
  "answer": "<pre><code>val items = repo.observe()\n  .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())</code></pre>\n      <p>Converts a cold flow to hot state, shared by all collectors. The 5-second grace keeps the upstream alive across a rotation instead of tearing down and re-running the query. Alternatives: <code>Eagerly</code> (starts immediately, never stops) and <code>Lazily</code> (starts on first collector, never stops).</p>"
},
{
  "id": "kt-4-06",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "What does <code>flowOn</code> affect?",
  "difficulty": "Mid",
  "tags": [
    "flowOn",
    "withContext",
    "flow { }",
    "Flow & Reactive Streams"
  ],
  "question": "What does <code>flowOn</code> affect?",
  "answer": "<p>Upstream only. Everything declared before it runs on that dispatcher; the collector stays where it was. This is context preservation — a flow can't change its collector's context, which is why <code>withContext</code> inside <code>flow { }</code> is illegal.</p>"
},
{
  "id": "kt-4-07",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "<code>buffer</code>, <code>conflate</code>, <code>collectLatest</code> — the backpressure toolkit.",
  "difficulty": "Mid",
  "tags": [
    "buffer",
    "conflate",
    "collectLatest",
    "buffer(n)",
    "Flow & Reactive Streams"
  ],
  "question": "<code>buffer</code>, <code>conflate</code>, <code>collectLatest</code> — the backpressure toolkit.",
  "answer": "<p><code>buffer(n)</code> — producer and consumer run concurrently, up to n queued. <code>conflate()</code> — keep only the newest, drop intermediates. <code>collectLatest</code> — cancel the previous collector body when a new value arrives. Also <code>debounce</code>, <code>sample</code>, and <code>onBufferOverflow = DROP_OLDEST</code>.</p>"
},
{
  "id": "kt-4-08",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "<code>flow { }</code> vs <code>channelFlow</code> vs <code>callbackFlow</code>.",
  "difficulty": "Mid",
  "tags": [
    "flow { }",
    "channelFlow",
    "callbackFlow",
    "trySend",
    "Flow & Reactive Streams"
  ],
  "question": "<code>flow { }</code> vs <code>channelFlow</code> vs <code>callbackFlow</code>.",
  "answer": "<p><code>flow { }</code> can only emit from its own coroutine. <code>channelFlow</code>/<code>callbackFlow</code> allow emission from other coroutines and callbacks via <code>trySend</code>.</p>\n      <pre><code>fun cardEvents() = callbackFlow {\n  val l = ReadListener { trySend(it) }\n  sdk.register(l)\n  awaitClose { sdk.unregister(l) }     // mandatory — this is what's checked\n}</code></pre>"
},
{
  "id": "kt-4-09",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "<code>combine</code> vs <code>zip</code>.",
  "difficulty": "Mid",
  "tags": [
    "combine",
    "zip",
    "Flow & Reactive Streams"
  ],
  "question": "<code>combine</code> vs <code>zip</code>.",
  "answer": "<p><code>combine</code> emits whenever any source emits, using each source's latest — but only after all of them have emitted once. <code>zip</code> pairs strictly one-to-one and completes when the shorter completes. Search filters use combine; pairing two request/response streams uses zip.</p>"
},
{
  "id": "kt-4-10",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "<code>flatMapLatest</code> vs <code>flatMapMerge</code> vs <code>flatMapConcat</code>.",
  "difficulty": "Mid",
  "tags": [
    "flatMapLatest",
    "flatMapMerge",
    "flatMapConcat",
    "mapLatest",
    "Flow & Reactive Streams"
  ],
  "question": "<code>flatMapLatest</code> vs <code>flatMapMerge</code> vs <code>flatMapConcat</code>.",
  "answer": "<p>Latest cancels the previous inner flow — search-as-you-type. Merge runs inner flows concurrently, order not guaranteed. Concat is sequential and order-preserving. <code>mapLatest</code> is the same idea without flattening.</p>"
},
{
  "id": "kt-4-11",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Build search-as-you-type.",
  "difficulty": "Mid",
  "tags": [
    "Flow & Reactive Streams"
  ],
  "question": "Build search-as-you-type.",
  "answer": "<pre><code>query\n  .debounce(300)\n  .filter { it.length &gt;= 2 }\n  .distinctUntilChanged()\n  .flatMapLatest { repo.search(it) }\n  .catch { emit(emptyList()) }\n  .flowOn(Dispatchers.IO)</code></pre>"
},
{
  "id": "kt-4-12",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "How do you retry a flow with backoff?",
  "difficulty": "Mid",
  "tags": [
    "Flow & Reactive Streams"
  ],
  "question": "How do you retry a flow with backoff?",
  "answer": "<pre><code>flow.retryWhen { cause, attempt -&gt;\n  if (cause is IOException &amp;&amp; attempt &lt; 3) {\n    delay(1000L shl attempt.toInt()); true\n  } else false\n}</code></pre>"
},
{
  "id": "kt-4-13",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Where does <code>catch</code> belong in a flow chain?",
  "difficulty": "Mid",
  "tags": [
    "catch",
    "collect",
    "try/catch",
    "Flow & Reactive Streams"
  ],
  "question": "Where does <code>catch</code> belong in a flow chain?",
  "answer": "<p><code>catch</code> only sees exceptions from upstream of itself — it cannot catch an exception thrown inside <code>collect</code>. Put a <code>try/catch</code> around the collect body for that, and place <code>catch</code> as far downstream as possible while still above the collector.</p>"
},
{
  "id": "kt-4-14",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Collect a flow safely from a Fragment.",
  "difficulty": "Mid",
  "tags": [
    "Flow & Reactive Streams"
  ],
  "question": "Collect a flow safely from a Fragment.",
  "answer": "<pre><code>viewLifecycleOwner.lifecycleScope.launch {\n  repeatOnLifecycle(Lifecycle.State.STARTED) {\n    vm.state.collect { render(it) }\n  }\n}</code></pre>\n      <p>A bare <code>lifecycleScope.launch { collect }</code> keeps collecting while the screen is stopped — wasted work and a common cause of \"why is the app doing network in the background\".</p>"
},
{
  "id": "kt-4-15",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Collect state in Compose — which API?",
  "difficulty": "Mid",
  "tags": [
    "collectAsStateWithLifecycle()",
    "collectAsState()",
    "Flow & Reactive Streams"
  ],
  "question": "Collect state in Compose — which API?",
  "answer": "<p><code>collectAsStateWithLifecycle()</code>, not <code>collectAsState()</code>. The former stops collecting when the lifecycle drops below STARTED; the latter keeps going while the app is backgrounded.</p>"
},
{
  "id": "kt-4-16",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "How do you test a Flow?",
  "difficulty": "Mid",
  "tags": [
    "toList()",
    "Flow & Reactive Streams"
  ],
  "question": "How do you test a Flow?",
  "answer": "<pre><code>vm.state.test {                       // Turbine\n  assertEquals(Idle, awaitItem().status)\n  vm.onEvent(StartPayment)\n  assertEquals(WaitingForCard, awaitItem().status)\n  cancelAndIgnoreRemainingEvents()\n}</code></pre>\n      <p>Turbine matters because a hot StateFlow never completes, so <code>toList()</code> would hang.</p>"
},
{
  "id": "kt-4-17",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "What does <code>distinctUntilChanged</code> do to a data class state?",
  "difficulty": "Senior",
  "tags": [
    "distinctUntilChanged",
    "equals",
    "Flow & Reactive Streams"
  ],
  "question": "What does <code>distinctUntilChanged</code> do to a data class state?",
  "answer": "<p>It compares with <code>equals</code>. If your state holds a property outside the constructor, or an array (identity equality), or a mutable list mutated in place, the comparison says \"unchanged\" and the UI never updates. State classes must be genuinely value-comparable.</p>"
},
{
  "id": "kt-4-18",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "<code>MutableStateFlow.update</code> vs assigning <code>.value</code>.",
  "difficulty": "Mid",
  "tags": [
    "MutableStateFlow.update",
    ".value",
    "update { }",
    ".value = _state.value.copy(...)",
    "Flow & Reactive Streams"
  ],
  "question": "<code>MutableStateFlow.update</code> vs assigning <code>.value</code>.",
  "answer": "<p><code>update { }</code> is an atomic compare-and-set loop. Read-modify-write via <code>.value = _state.value.copy(...)</code> is a race when two coroutines do it concurrently. Always <code>update</code>.</p>"
},
{
  "id": "kt-4-19",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Channel capacities.",
  "difficulty": "Mid",
  "tags": [
    "RENDEZVOUS",
    "send",
    "BUFFERED",
    "UNLIMITED",
    "Flow & Reactive Streams"
  ],
  "question": "Channel capacities.",
  "answer": "<p><code>RENDEZVOUS</code> (0, the default — <code>send</code> suspends until received), <code>BUFFERED</code> (64), <code>UNLIMITED</code>, <code>CONFLATED</code>. <code>trySend</code> is non-suspending and returns a result you should actually check.</p>"
},
{
  "id": "kt-4-20",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "What's the <code>select</code> expression good for?",
  "difficulty": "Mid",
  "tags": [
    "select",
    "Flow & Reactive Streams"
  ],
  "question": "What's the <code>select</code> expression good for?",
  "answer": "<pre><code>val outcome = select&lt;Outcome&gt; {\n  cards.onReceive { Outcome.Card(it) }\n  cancels.onReceive { Outcome.Cancelled }\n  onTimeout(30_000) { Outcome.TimedOut }\n}</code></pre>\n      <p>Wait on whichever of several sources completes first — card inserted, user cancelled, or timeout. Exactly the shape of a terminal's waiting state.</p>"
},
{
  "id": "kt-4-recap",
  "category": "kotlin",
  "categoryName": "Kotlin",
  "topic": "Flow & Reactive Streams",
  "title": "Flow & Reactive Streams — the 5 to memorise",
  "difficulty": "Senior",
  "tags": [
    "Flow & Reactive Streams",
    "Recap"
  ],
  "question": "Under interview pressure, what are the five highest-yield facts to have ready for Flow & Reactive Streams?",
  "answer": "<p>A compressed recap of this section — the five points worth having ready verbatim before a senior Android/Kotlin loop.</p>",
  "keyTakeaways": [
    "4.2/4.3 — StateFlow for state, Channel for events; StateFlow replays, conflates and dedupes.",
    "4.4 — <code>SharedFlow(replay=0)</code> drops events emitted with no collector.",
    "4.5 — <code>WhileSubscribed(5000)</code> survives rotation without restarting the query.",
    "4.6 — <code>flowOn</code> is upstream-only; context preservation.",
    "4.18 — <code>update { }</code>, never read-modify-write on <code>.value</code>."
  ],
  "followUp": "ask yourself \"is this a value that should be re-rendered, or something that happened once?\" That one question resolves most Flow API choices."
},
{
  "id": "kt-5-01",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "The four pillars, with a real example.",
  "difficulty": "Mid",
  "tags": [
    "var balance private set",
    "CardReader",
    "sealed",
    "OOP & Design Patterns"
  ],
  "question": "The four pillars, with a real example.",
  "answer": "<p>Encapsulation — state changes only through validated behaviour (<code>var balance private set</code>). Abstraction — expose what, hide how (a <code>CardReader</code> interface). Inheritance — a closed contract, best expressed as <code>sealed</code> in Kotlin. Polymorphism — one call site, many implementations.</p>"
},
{
  "id": "kt-5-02",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Why composition over inheritance? Show the failure.",
  "difficulty": "Senior",
  "tags": [
    "by",
    "OOP & Design Patterns"
  ],
  "question": "Why composition over inheritance? Show the failure.",
  "answer": "<p><strong>The fragile base class problem:</strong> a subclass depends on the parent's internals, not just its contract.</p>\n      <pre><code>open class Logger {\n  open fun log(t: Tx) { write(t) }\n  open fun logAll(l: List&lt;Tx&gt;) { l.forEach { log(it) } }  // self-call\n}\nclass Counting : Logger() {\n  var n = 0\n  override fun log(t: Tx) { n++; super.log(t) }\n  override fun logAll(l: List&lt;Tx&gt;) { n += l.size; super.logAll(l) }\n}\nCounting().logAll(listOf(a, b))   // n == 4, double counted</code></pre>\n      <p>Composition has no self-call to reason about, and <code>by</code> makes it cheap. It also avoids the class explosion: four decorators give you sixteen behaviours; four subclasses give you four.</p>"
},
{
  "id": "kt-5-03",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Single Responsibility — how do you recognise a violation?",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "Single Responsibility — how do you recognise a violation?",
  "answer": "<p>Count the reasons the class would change. A class that parses, validates, persists and formats changes for four unrelated reasons. Practical test: can you name the class without \"and\" or \"Manager\"?</p>"
},
{
  "id": "kt-5-04",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Open/Closed — but doesn't a sealed <code>when</code> violate it?",
  "difficulty": "Senior",
  "tags": [
    "when",
    "OOP & Design Patterns"
  ],
  "question": "Open/Closed — but doesn't a sealed <code>when</code> violate it?",
  "answer": "<p>Yes, deliberately. A sealed <code>when</code> forces you to edit every call site when you add a case — you trade OCP for compile-time exhaustiveness. That's the right trade for domain state, where a silent default means money moves wrongly. Where a new case really is self-contained, use a registry instead:</p>\n      <pre><code>class PaymentProcessor(handlers: Set&lt;TenderHandler&gt;) {\n  private val byType = handlers.associateBy { it.type }\n  suspend fun pay(t: TenderType, m: Money) = byType[t]?.authorize(m)\n}\n// adding cash = one new class + one @Binds @IntoSet. Nothing else is edited.</code></pre>"
},
{
  "id": "kt-5-05",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Liskov Substitution — give a concrete violation.",
  "difficulty": "Mid",
  "tags": [
    "Printer",
    "PrintResult.Rejected",
    "OOP & Design Patterns"
  ],
  "question": "Liskov Substitution — give a concrete violation.",
  "answer": "<p>A subtype must not strengthen a precondition or weaken a postcondition.</p>\n      <pre><code>class LabelPrinter : Printer {\n  override suspend fun print(r: Receipt) {\n    require(r.lines.size &lt;= 4)     // STRONGER than the interface promised\n  }\n}</code></pre>\n      <p>Every existing caller written against <code>Printer</code> now crashes. Fix by putting the constraint in the contract — return <code>PrintResult.Rejected</code> instead of throwing.</p>"
},
{
  "id": "kt-5-06",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "How do you spot an LSP violation in review?",
  "difficulty": "Mid",
  "tags": [
    "UnsupportedOperationException",
    "require",
    "if (x is Subtype)",
    "OOP & Design Patterns"
  ],
  "question": "How do you spot an LSP violation in review?",
  "answer": "<p><strong>Three smells:</strong> an override that throws <code>UnsupportedOperationException</code>; an override that opens with a <code>require</code> the parent didn't have; and — loudest — any <code>if (x is Subtype)</code> in a caller, which is the caller admitting the subtypes aren't substitutable. Practical technique: write one test suite against the interface and run it against every implementation.</p>"
},
{
  "id": "kt-5-07",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Interface Segregation, in a hardware context.",
  "difficulty": "Mid",
  "tags": [
    "CardReader",
    "PinPad",
    "Printer",
    "OOP & Design Patterns"
  ],
  "question": "Interface Segregation, in a hardware context.",
  "answer": "<p>One fat <code>Terminal { readCard(); printReceipt(); capturePin(); openDrawer() }</code> forces a pin-pad-only device to stub three methods. Split into <code>CardReader</code>, <code>PinPad</code>, <code>Printer</code> — each device implements only what it physically has.</p>"
},
{
  "id": "kt-5-08",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Dependency Inversion vs dependency injection.",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "Dependency Inversion vs dependency injection.",
  "answer": "<p><strong>Inversion is the principle:</strong> high-level policy depends on an abstraction the domain owns, and the vendor SDK implements it. Injection is the mechanism that supplies the implementation. You can inject and still violate inversion — if the interface lives in the SDK's module, you're still coupled to it.</p>"
},
{
  "id": "kt-5-09",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Which patterns do you actually use on Android, and where?",
  "difficulty": "Mid",
  "tags": [
    "Modifier",
    "ViewModelProvider.Factory",
    "NotificationCompat.Builder",
    "OOP & Design Patterns"
  ],
  "question": "Which patterns do you actually use on Android, and where?",
  "answer": "<ul><li>Observer — Flow/StateFlow, the whole reactive UI layer.</li><li>Strategy — tender handlers, sort comparators, retry policies.</li><li>Decorator — OkHttp interceptors, Compose <code>Modifier</code>, hardware wrappers.</li><li>Factory — <code>ViewModelProvider.Factory</code>, validated value construction.</li><li>Adapter — wrapping a vendor SDK behind your own interface.</li><li>Builder — <code>NotificationCompat.Builder</code>, Kotlin DSLs.</li><li>State — the transaction FSM.</li><li>Repository — single source of truth over DB + network.</li></ul>"
},
{
  "id": "kt-5-10",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Singleton — what's wrong with it, and what do you use instead?",
  "difficulty": "Mid",
  "tags": [
    "Context",
    "@Singleton class",
    "OOP & Design Patterns"
  ],
  "question": "Singleton — what's wrong with it, and what do you use instead?",
  "answer": "<p><strong>Global mutable state:</strong> untestable (tests can't isolate it), hides dependencies, and on Android it's a top leak source when it holds a <code>Context</code>. Replace with a DI-scoped <code>@Singleton class</code> — one instance, but injected, swappable and visible in the constructor.</p>"
},
{
  "id": "kt-5-11",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Decorator vs inheritance — write one.",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "Decorator vs inheritance — write one.",
  "answer": "<pre><code>class LoggingReader(private val d: CardReader) : CardReader by d {\n  override suspend fun waitForCard(t: Duration) =\n    d.waitForCard(t).also { Log.d(\"reader\", \"result=$it\") }\n}\nval reader = LoggingReader(RetryingReader(AidlCardReader(binder)))</code></pre>"
},
{
  "id": "kt-5-12",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "What's the Strategy pattern in idiomatic Kotlin?",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "What's the Strategy pattern in idiomatic Kotlin?",
  "answer": "<p>Often just a function type — you don't need an interface and three classes.</p>\n      <pre><code>class Retry(private val backoff: (Int) -&gt; Long)\nRetry { attempt -&gt; 1000L shl attempt }</code></pre>\n      <p>Use an interface when the strategy needs a name, several methods, or DI multibinding.</p>"
},
{
  "id": "kt-5-13",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "What is the State pattern, and why is a reducer better?",
  "difficulty": "Senior",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "What is the State pattern, and why is a reducer better?",
  "answer": "<p>Classic State puts behaviour in state objects, so transitions are scattered across classes. A pure reducer — <code>reduce(state, event) -&gt; state + effects</code> — puts every transition in one readable function that's trivially unit-testable and has no I/O. For a payment flow, that testability is the whole argument.</p>"
},
{
  "id": "kt-5-14",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Why do you prefer immutability?",
  "difficulty": "Mid",
  "tags": [
    "DiffUtil",
    "OOP & Design Patterns"
  ],
  "question": "Why do you prefer immutability?",
  "answer": "<p>Thread safety for free, no defensive copies, safe as a hash key, cheap equality-based change detection (Compose and <code>DiffUtil</code> both depend on it), and time-travel/replay of state becomes possible. Cost: allocation — which matters only in genuinely hot paths.</p>"
},
{
  "id": "kt-5-15",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Law of Demeter — why does <code>a.b().c().d()</code> matter?",
  "difficulty": "Mid",
  "tags": [
    "a.b().c().d()",
    "OOP & Design Patterns"
  ],
  "question": "Law of Demeter — why does <code>a.b().c().d()</code> matter?",
  "answer": "<p>Each link is a dependency you didn't declare, so a change three objects away breaks you. In practice on Android it shows up as a ViewModel reaching through a repository into a DAO into an entity. Ask for what you need, don't navigate to it.</p>"
},
{
  "id": "kt-5-16",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Cohesion vs coupling — how do you measure them in a review?",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "Cohesion vs coupling — how do you measure them in a review?",
  "answer": "<p><strong>Cohesion:</strong> do the class's methods use the same fields? If two groups of methods touch two disjoint field sets, it's two classes. Coupling: count the types in the constructor and how many modules they cross. More than about five constructor dependencies usually means a missing abstraction.</p>"
},
{
  "id": "kt-5-17",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Is inheritance ever the right answer?",
  "difficulty": "Mid",
  "tags": [
    "View",
    "Fragment",
    "OOP & Design Patterns"
  ],
  "question": "Is inheritance ever the right answer?",
  "answer": "<p>Yes — a genuine is-a with a stable, closed hierarchy that you own: sealed types, a custom <code>View</code>, a base <code>Fragment</code> in your own codebase. The heuristic: inherit to be substitutable, compose to reuse.</p>"
},
{
  "id": "kt-5-18",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "What does \"program to an interface\" cost when overdone?",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "What does \"program to an interface\" cost when overdone?",
  "answer": "<p>An interface with exactly one implementation and no test double adds indirection with no benefit — you navigate two files to read one behaviour. Introduce the interface when there's a second implementation, a fake needed for tests, or a module boundary to protect. Say this out loud; it shows judgment rather than dogma.</p>"
},
{
  "id": "kt-5-19",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "How do SOLID and testability relate?",
  "difficulty": "Mid",
  "tags": [
    "OOP & Design Patterns"
  ],
  "question": "How do SOLID and testability relate?",
  "answer": "<p>They're the same property from two angles. If a class is hard to test, it almost always violates one: too many responsibilities (S), a hard-coded dependency (D), or a fat interface forcing a huge fake (I). \"Is this testable without a device?\" is a faster review question than \"does this follow SOLID?\".</p>"
},
{
  "id": "kt-5-20",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "Design a hardware abstraction so the app runs with no device.",
  "difficulty": "Senior",
  "tags": [
    "@TestInstallIn",
    "OOP & Design Patterns"
  ],
  "question": "Design a hardware abstraction so the app runs with no device.",
  "answer": "<p>Domain owns three narrow interfaces (ISP). Two implementations each — a fake with injectable failure modes, and the vendor/AIDL one (DIP). Decorators add logging, metrics and retry (composition). Hilt swaps the binding per product flavor, and <code>@TestInstallIn</code> swaps it in tests. The payoff sentence: \"90% of the logic is testable without hardware, and that's an architecture decision, not an accident.\"</p>"
},
{
  "id": "kt-5-recap",
  "category": "oop",
  "categoryName": "OOP & Patterns",
  "topic": "OOP & Design Patterns",
  "title": "OOP & Design Patterns — the 5 to memorise",
  "difficulty": "Senior",
  "tags": [
    "OOP & Design Patterns",
    "Recap"
  ],
  "question": "Under interview pressure, what are the five highest-yield facts to have ready for OOP & Design Patterns?",
  "answer": "<p>A compressed recap of this section — the five points worth having ready verbatim before a senior Android/Kotlin loop.</p>",
  "keyTakeaways": [
    "5.2 — fragile base class; <code>by</code> makes decorators cheap.",
    "5.4 — sealed <code>when</code> trades OCP for exhaustiveness on purpose; registry where cases are self-contained.",
    "5.6 — <code>is Subtype</code> in a caller is the loudest LSP smell.",
    "5.8 — inversion is who owns the interface; injection is only the mechanism.",
    "5.18 — an interface with one implementation and no fake is indirection, not design."
  ],
  "followUp": "answer with a trade-off rather than a rule. \"I'd apply X here, and I'd skip it when Y\" reads as sixteen years; reciting the acronym reads as four."
}
);
