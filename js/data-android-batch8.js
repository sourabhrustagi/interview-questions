// ==========================================================
// Android Interview Questions — Batch 8
// Networking & Connectivity: designing for low/intermittent
// network conditions, connectivity detection, retry/backoff,
// offline queuing, and communicating connectivity state to
// the user.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b8-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Designing an Android app for users in low or intermittent network areas",
  "difficulty": "Senior",
  "tags": [
    "Offline-first",
    "Connectivity",
    "Networking & Connectivity"
  ],
  "question": "How do you design an Android app to handle a user in a low-network or intermittent-connectivity area, rather than just letting requests time out?",
  "answer": "<p>This is a layered problem, not a single fix — the pieces worth naming, in the order an interviewer expects:</p>\n      <ul>\n        <li><strong>Detect real connectivity, not just on/off.</strong> Use <code>ConnectivityManager.NetworkCallback</code> with <code>NetworkCapabilities</code> to see transport type and the system's own <code>NET_CAPABILITY_VALIDATED</code> flag — a device can be \"connected\" to a captive portal or a dead cell tower with zero real internet.</li>\n        <li><strong>Design offline-first.</strong> Room (or another local store) is the single source of truth the UI renders from; the network only ever updates that local store, so the UI keeps working — with the last-known-good data — even with zero connectivity. This is the same repository pattern as the earlier offline-first Room answer.</li>\n        <li><strong>Queue writes instead of failing them.</strong> A form submission or an inventory update made while offline goes into a durable queue (WorkManager with a <code>NetworkType.CONNECTED</code> constraint) rather than erroring out — it runs automatically once connectivity returns, surviving process death and reboot.</li>\n        <li><strong>Tune timeouts and back off properly.</strong> A bounded connect/read timeout so a stalled call fails predictably, exponential backoff with jitter for retries, and a hard cap on retry count/duration so a flaky connection doesn't drain the battery retrying forever.</li>\n        <li><strong>Tell the user the truth.</strong> A persistent, unobtrusive \"you're offline, changes will sync\" banner beats both silent failure and an infinite spinner.</li>\n      </ul>\n      <p>Naming all five unprompted — not just \"add a retry\" — is what separates a senior answer here.</p>"
},
{
  "id": "and-b8-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Detecting connectivity changes — NetworkCallback vs the old broadcast approach",
  "difficulty": "Mid",
  "tags": [
    "ConnectivityManager",
    "NetworkCallback",
    "Networking & Connectivity"
  ],
  "question": "How do you detect network connectivity changes in modern Android, and what's wrong with the old CONNECTIVITY_ACTION broadcast approach?",
  "answer": "<p><code>ConnectivityManager.registerNetworkCallback()</code> with a <code>NetworkRequest</code> is the modern approach — it gives explicit <code>onAvailable</code>/<code>onLost</code>/<code>onCapabilitiesChanged</code> callbacks per network and works correctly under Doze and background execution limits.</p>\n      <p>The old <code>CONNECTIVITY_ACTION</code> broadcast is deprecated since API 28 and was never reliable for background apps even before that — Android N's background execution limits mean a manifest-registered receiver for it simply stops firing for apps not in the foreground, so an app relying on it silently stops noticing connectivity changes the moment it's backgrounded.</p>"
},
{
  "id": "and-b8-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "NetworkCapabilities — distinguishing \"connected\" from \"actually usable\"",
  "difficulty": "Senior",
  "tags": [
    "NetworkCapabilities",
    "Captive Portal",
    "Networking & Connectivity"
  ],
  "question": "How do you actually distinguish 'connected but useless' (a captive portal, a cell tower with no real backhaul) from a genuinely usable connection?",
  "answer": "<p>Checking <code>hasCapability(NET_CAPABILITY_INTERNET)</code> alone isn't enough — that only means the network is <em>intended</em> for internet access, not that it actually has it. The flag that matters is <code>NET_CAPABILITY_VALIDATED</code>, set by the system only after it has actively verified real internet reachability (the same mechanism behind the \"sign in to this Wi-Fi network\" captive-portal notification). Checking for validation, not just presence of a network, is what catches hotel Wi-Fi with no login yet, or a cellular radio connected to a tower with a dead backhaul link.</p>"
},
{
  "id": "and-b8-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Why plain exponential backoff isn't enough — the case for jitter",
  "difficulty": "Senior",
  "tags": [
    "Exponential Backoff",
    "Jitter",
    "Networking & Connectivity"
  ],
  "question": "Exponential backoff with jitter — why is plain exponential backoff not enough for retrying a failed network call?",
  "answer": "<p>Plain exponential backoff (1s, 2s, 4s, 8s...) synchronizes every client that failed at the same moment — say, right after a brief server blip — onto the same growing retry schedule. They all retry together, creating repeated traffic spikes (a \"thundering herd\") that can prevent the server from ever actually recovering, since each spike looks like another overload event.</p>\n      <p>Adding jitter — randomizing the actual delay within the backoff window instead of using the exact computed value — spreads those retries out over time, smoothing the load instead of re-synchronizing it. Just as important: cap both the maximum backoff interval and the total retry count/duration, or a flaky connection just drains the battery retrying a request the user has long since navigated away from.</p>"
},
{
  "id": "and-b8-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "WorkManager for queuing work until connectivity returns",
  "difficulty": "Mid",
  "tags": [
    "WorkManager",
    "Offline Queue",
    "Networking & Connectivity"
  ],
  "question": "How does WorkManager help specifically with 'the user has no network right now' for something like syncing a queued form submission?",
  "answer": "<p><code>setRequiredNetworkType(NetworkType.CONNECTED)</code> (or <code>UNMETERED</code> for a large payload you don't want burning the user's mobile data) as a <code>Constraint</code> on the work request — the work simply doesn't run until that constraint is satisfied. WorkManager persists its queue in an internal Room database, so it survives process death and even a device reboot, meaning a submission queued while offline is guaranteed to eventually run once connectivity returns, with no need for the app to be open or for any manual re-trigger.</p>\n      <p>This is the durable-queue half of the \"queue writes instead of failing them\" point from the broader low-connectivity design answer.</p>"
},
{
  "id": "and-b8-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Centralizing retry-with-backoff via an OkHttp interceptor",
  "difficulty": "Senior",
  "tags": [
    "OkHttp",
    "Interceptor",
    "Retry",
    "Networking & Connectivity"
  ],
  "question": "How would you build a general-purpose retry-with-backoff layer without adding try/catch-with-backoff to every call site?",
  "answer": "<p>An OkHttp <code>Interceptor</code> can catch an <code>IOException</code> or a specific retryable HTTP status (503, 429) and retry <code>chain.proceed()</code> with backoff, transparently to every caller sharing that <code>OkHttpClient</code> — centralizing the retry policy once instead of duplicating it in every repository method.</p>\n      <p>The caution worth stating unprompted: don't blindly retry a non-idempotent request (a POST creating a resource) without an idempotency key — retrying a request that actually succeeded but whose response timed out can create a duplicate. Same principle as the earlier payments idempotency-key answer, now enforced centrally in the interceptor rather than trusted to every call site.</p>"
},
{
  "id": "and-b8-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Avoiding an infinite spinner on a technically-connected but unusable link",
  "difficulty": "Mid",
  "tags": [
    "Timeouts",
    "Loading State",
    "Networking & Connectivity"
  ],
  "question": "How do you avoid an infinite spinner when the network is technically 'connected' but effectively unusable — very low bandwidth or very high latency?",
  "answer": "<p>A connectivity check only answers \"is there a network,\" not \"is it usable\" — that's a separate problem. The fix is an explicit, bounded connect timeout and call/read timeout configured on the HTTP client, so a call that isn't progressing fails predictably instead of hanging, paired with UI that transitions to a clear error-and-retry state once that timeout fires rather than sitting in a loading spinner indefinitely.</p>\n      <p>For genuinely bandwidth-constrained scenarios, consider adapting the request itself rather than just timing it out faster — a lower-resolution image variant, a smaller page size — since a fixed request that's simply too large to complete in reasonable time on a 2G-equivalent link will keep failing no matter how the timeout is tuned.</p>"
},
{
  "id": "and-b8-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "Networking & Connectivity",
  "title": "Communicating connectivity state to the user — why silent failure hurts trust",
  "difficulty": "Mid",
  "tags": [
    "UX",
    "Offline Banner",
    "Networking & Connectivity"
  ],
  "question": "What UI/UX pattern do you use to communicate connectivity state to the user, and why is silent failure worse than an obvious one?",
  "answer": "<p>A persistent but unobtrusive banner — \"You're offline, changes will sync when you're back online\" — tied directly to the <code>NetworkCallback</code> state, rather than either silently swallowing a failed action or blocking the whole screen behind a full-screen error.</p>\n      <p>Silent failure is the worse failure mode: a save button that appears to succeed while the request actually failed leaves the user with no idea their data didn't actually save, and they typically only discover it much later — often after leaving the screen — which is a far harder trust problem to recover from than an honest, immediate \"this didn't go through, here's why, and here's what happens next.\"</p>"
}
);
