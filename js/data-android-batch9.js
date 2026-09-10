// ==========================================================
// Android Interview Questions — Batch 9
// Mobile Developer (Telephony/PTT) JD: native platform depth
// vs RN/Flutter, SIP & RTP/SRTP, the Android audio subsystem,
// Android Enterprise/MDM (Device Owner, COSU), Bluetooth
// accessories (HFP/HID), wireless networking for VoIP (Wi-Fi
// roaming, jitter, packet loss), WebRTC/PTT floor control, and
// Cisco CUCM integration.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b9-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Native Platform vs Cross-Platform",
  "title": "Why native Kotlin/Java instead of React Native or Flutter for this class of product?",
  "difficulty": "Senior",
  "tags": [
    "React Native",
    "Flutter",
    "Platform Layer",
    "Native Platform vs Cross-Platform"
  ],
  "question": "Why does a VoIP/telephony product specifically require native Android in Kotlin or Java, ruling out React Native and Flutter?",
  "answer": "<p>RN and Flutter run business logic in a JS engine or Dart VM sitting above the Android platform layer, bridging out to native code for platform APIs — but several of the exact APIs this kind of product lives in are only shallowly wrapped, or not exposed at all, through that bridge:</p>\n      <ul>\n        <li><strong>Foreground service types</strong> (API 29+) — declaring <code>phoneCall</code> or <code>microphone</code> correctly, and getting the OS privileges that come with it, needs direct manifest and runtime control most bridges don't expose faithfully.</li>\n        <li><strong>Doze/App Standby exemption</strong> — keeping a SIP client's connection alive through deep power management is OS-level integration, not a JS API.</li>\n        <li><strong>Fine-grained AudioManager focus/routing</strong> — arbitrating call audio against other apps and switching earpiece/speaker/Bluetooth reliably.</li>\n        <li><strong>Background execution guarantees</strong> — surviving increasingly aggressive, OEM-specific process-killing policies (Samsung/Xiaomi in particular).</li>\n      </ul>\n      <p>A cross-platform bridge either omits these, or exposes a lowest-common-denominator subset that breaks down exactly where this product's reliability bar is strictest. Native gives direct access to the real APIs and their exact per-OEM quirks, with no bridge layer hiding or delaying platform behavior.</p>"
},
{
  "id": "and-b9-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Native Platform vs Cross-Platform",
  "title": "Foreground service types — why were they introduced, and what breaks if you declare the wrong one?",
  "difficulty": "Senior",
  "tags": [
    "Foreground Service",
    "Android 10",
    "Native Platform vs Cross-Platform"
  ],
  "question": "Foreground service types — why were they introduced, and what breaks if you declare the wrong one?",
  "answer": "<p>Before API 29, any foreground service could stay alive indefinitely with just a notification — an increasingly abused battery vector. Foreground service types (<code>phoneCall</code>, <code>mediaPlayback</code>, <code>microphone</code>, <code>connectedDevice</code>, etc.) force a declared reason, in both the manifest and at <code>startForeground()</code>, and the OS grants that specific type's privileges in return — <code>phoneCall</code> gets Doze leniency and priority scheduling a generic service doesn't.</p>\n      <p>Declaring the wrong type — or none — either fails Play Store review (declared-vs-actual mismatch), or the service gets killed under memory pressure because it lacks the priority its real behavior needs. A SIP call service mis-declared as <code>connectedDevice</code> instead of <code>phoneCall</code> is a classic silent field bug: it looks fine in testing and dies exactly when the OS is under real memory pressure.</p>"
},
{
  "id": "and-b9-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Native Platform vs Cross-Platform",
  "title": "Doze and App Standby — keeping a SIP client alive while the device is idle.",
  "difficulty": "Senior",
  "tags": [
    "Doze",
    "Battery Optimization",
    "FCM",
    "Native Platform vs Cross-Platform"
  ],
  "question": "What has to be done to keep a SIP client's connection alive while the device is idle in Doze mode?",
  "answer": "<p>Doze suspends network access and can drop long-lived sockets for non-exempt apps — catastrophic for a SIP client needing a persistent registration to receive incoming calls. The real answer has three parts: requesting the battery-optimization exemption (<code>REQUEST_IGNORE_BATTERY_OPTIMIZATIONS</code>, which Google restricts and requires real justification for in Play Console review), running as a proper <code>phoneCall</code>-type foreground service for the Doze leniency that grants, and — for genuinely reliable inbound call delivery — using high-priority FCM push to wake the device and re-establish the SIP connection just-in-time, rather than trusting a raw idle socket to survive arbitrary Doze maintenance windows, since even exempted apps only get network access in scheduled windows during deep Doze.</p>"
},
{
  "id": "and-b9-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "SIP & RTP/SRTP Telephony",
  "title": "SIP call setup end to end — INVITE through to media flowing.",
  "difficulty": "Senior",
  "tags": [
    "SIP",
    "Call Setup",
    "SDP",
    "SIP & RTP/SRTP Telephony"
  ],
  "question": "Walk through SIP call setup at a high level, from INVITE through to media actually flowing.",
  "answer": "<p>Caller sends INVITE (with an SDP offer describing supported codecs/media) to the SIP server or proxy — CUCM, in an enterprise deployment. The callee's device receives it, rings, and on answer sends 200 OK with its own SDP answer (negotiated codec, IP:port for RTP). The caller ACKs. Media — RTP, or SRTP if secured — then flows directly (or via a media relay/SBC) between the endpoints on the negotiated ports, entirely separate from the SIP signaling path, which stays open to carry further call-control (hold, transfer, BYE to hang up).</p>\n      <p>That signaling/media separation is the single most important structural fact about SIP: a call can be fully \"signaled\" — ringing, answered — while media never actually flows, which is exactly the one-way/no-audio bug class this kind of role debugs constantly.</p>"
},
{
  "id": "and-b9-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "SIP & RTP/SRTP Telephony",
  "title": "Debugging one-way audio from a packet capture.",
  "difficulty": "Senior",
  "tags": [
    "Packet Capture",
    "NAT",
    "Debugging",
    "SIP & RTP/SRTP Telephony"
  ],
  "question": "You open a packet capture on a call with one-way audio. What are you actually looking for?",
  "answer": "<p>First, confirm SIP signaling completed cleanly — INVITE/200/ACK, matching SDP negotiated on both legs. If signaling's fine, the bug lives in the RTP path, not call setup. Then check:</p>\n      <ul>\n        <li>Is RTP actually flowing in <em>both</em> directions at the IP:port pair each side advertised in its own SDP? The classic cause: NAT — one side advertised a private IP unreachable from outside, so the far end's packets go nowhere. That's the signature of missing or misconfigured NAT traversal.</li>\n        <li>Do both directions agree on the negotiated codec (payload type)? A mismatch produces garbled or silent audio, not always an outright failure.</li>\n        <li>Is a firewall dropping UDP in one direction only — common with asymmetric rules?</li>\n      </ul>\n      <p>One-way audio is almost always a NAT/firewall/SDP-address problem, not an app-side audio-routing bug — which is exactly why this role wants someone who can open Wireshark and tell the two apart instead of guessing.</p>"
},
{
  "id": "and-b9-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "SIP & RTP/SRTP Telephony",
  "title": "SRTP vs RTP — what it adds, and the practical cost.",
  "difficulty": "Senior",
  "tags": [
    "SRTP",
    "Encryption",
    "SIP & RTP/SRTP Telephony"
  ],
  "question": "SRTP vs RTP — what does SRTP actually add, and what's the practical cost?",
  "answer": "<p>RTP media is unencrypted by default — trivially interceptable on any shared network segment. SRTP adds per-packet encryption (typically AES) and authentication (an HMAC per packet), with keys negotiated during signaling (SDES inline keys over a secured SIP transport, or DTLS-SRTP as WebRTC uses).</p>\n      <p>Practical cost: real per-packet CPU overhead for encrypt/decrypt/HMAC at the codec's frame rate — rarely the bottleneck on modern hardware, but non-zero on older devices — and a genuinely harder debugging story: you can no longer read RTP payload straight out of a capture to check for garbled audio without the session keys to decrypt it first.</p>"
},
{
  "id": "and-b9-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "SIP & RTP/SRTP Telephony",
  "title": "The SIP re-INVITE — what it's for, and where it breaks in practice.",
  "difficulty": "Mid",
  "tags": [
    "Re-INVITE",
    "Hold and Resume",
    "SIP & RTP/SRTP Telephony"
  ],
  "question": "What's the SIP re-INVITE, and where does it show up in practice?",
  "answer": "<p>A re-INVITE renegotiates an already-established call's session mid-call without tearing it down — used for hold/resume (SDP media direction flips to <code>sendonly</code>/<code>recvonly</code>), codec renegotiation, adding video to an audio call, or a transfer scenario. A re-INVITE handled incorrectly on one side is a classic source of \"call went silent after hold and resume\" bugs — the SDP changed, but one endpoint's media pipeline never actually reconfigured to match, so it's still sending or expecting the old parameters.</p>"
},
{
  "id": "and-b9-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "SIP & RTP/SRTP Telephony",
  "title": "Designing SIP registration/reconnection to survive real mobile network conditions.",
  "difficulty": "Senior",
  "tags": [
    "SIP Registration",
    "Mobile Networking",
    "SIP & RTP/SRTP Telephony"
  ],
  "question": "How would you design a SIP client's registration and reconnection logic to survive real-world mobile network conditions?",
  "answer": "<p>SIP REGISTER carries an expiry the client must refresh well before it lapses, or the server considers it unreachable and incoming calls fail silently from the client's own view. On mobile specifically:</p>\n      <ul>\n        <li>Re-register immediately on any network change (Wi-Fi↔cellular handoff, reconnecting after a dead zone) — the client's IP/NAT mapping just changed, so the old binding is stale even if its expiry hasn't passed.</li>\n        <li>Prefer TCP or a keepalive-friendly transport over raw UDP — carrier NAT UDP bindings can time out in well under a minute of inactivity, silently breaking inbound reachability with no visible error until a call actually fails to arrive.</li>\n        <li>Treat \"registered\" as a continuously monitored state (periodic OPTIONS pings or the refresh cycle itself), not a one-time login — a mobile network can drop the underlying connection with no explicit signal at all.</li>\n      </ul>"
},
{
  "id": "and-b9-09",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Audio Subsystem",
  "title": "Audio focus — why does an app have to request it, not just play audio?",
  "difficulty": "Mid",
  "tags": [
    "AudioManager",
    "Audio Focus",
    "Android Audio Subsystem"
  ],
  "question": "Explain Android's audio focus system — why does an app need to 'request' it rather than just playing audio?",
  "answer": "<p>Multiple apps can want to produce audio at once — a call app, a music player, a notification sound, a GPS voice prompt — and the OS needs arbitration so they don't just overlap chaotically. <code>AudioManager</code>'s focus system lets an app request focus at a given type (<code>AUDIOFOCUS_GAIN</code> for exclusive use, <code>AUDIOFOCUS_GAIN_TRANSIENT</code> for a short interruption) and notifies currently-focused apps to duck, pause, or stop when a higher-priority request arrives.</p>\n      <p>A well-behaved VoIP app requests exclusive <code>GAIN</code> for call audio (not a ducking-transient type — a call shouldn't be quietly backgrounded by music) and correctly releases focus and reacts to <code>OnAudioFocusChangeListener</code> loss callbacks from other apps.</p>"
},
{
  "id": "and-b9-10",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Audio Subsystem",
  "title": "What causes one-way audio from a local audio-routing angle (not the network).",
  "difficulty": "Senior",
  "tags": [
    "Audio Routing",
    "One-Way Audio",
    "Android Audio Subsystem"
  ],
  "question": "Beyond the network/RTP causes, what can cause one-way audio purely from an Android audio-routing bug?",
  "answer": "<p>Three common local causes that look identical to the user as a network problem:</p>\n      <ul>\n        <li>The app never set <code>MODE_IN_COMMUNICATION</code> (staying at <code>MODE_NORMAL</code> breaks acoustic echo cancellation and can misroute audio entirely).</li>\n        <li>The audio route is stuck on a stale device — the call started on a wired headset, the headset was unplugged, and the app never handled the <code>ACTION_HEADSET_PLUG</code>/<code>AudioDeviceCallback</code> event to re-route to speaker or earpiece.</li>\n        <li>A permission race — <code>RECORD_AUDIO</code> granted at runtime after the <code>AudioRecord</code> instance was already constructed against a stale permission state, so the mic input silently never actually started.</li>\n      </ul>\n      <p>The debugging discipline: separate \"is RTP actually carrying audio both ways\" (packet capture) from \"is the device's local audio correctly routed and unmuted\" (AudioManager state) — conflating the two wastes time chasing the wrong layer.</p>"
},
{
  "id": "and-b9-11",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Audio Subsystem",
  "title": "Routing between speaker, earpiece, and Bluetooth — old APIs vs the newer AudioDeviceInfo model.",
  "difficulty": "Senior",
  "tags": [
    "Audio Routing",
    "AudioDeviceInfo",
    "Android Audio Subsystem"
  ],
  "question": "How does an app actually control audio routing between speaker, earpiece, and Bluetooth, and what changed with newer Android APIs?",
  "answer": "<p>Historically: <code>setSpeakerphoneOn()</code>/<code>startBluetoothSco()</code> as fairly blunt, call-specific toggles. Since Android 12 (API 31), the recommended API is <code>AudioManager.setCommunicationDevice(AudioDeviceInfo)</code>, working uniformly across earpiece, speaker, wired headset, and Bluetooth SCO by passing a specific device from <code>getAvailableCommunicationDevices()</code> — a cleaner model than the old per-route booleans.</p>\n      <p>Either API, the hard part is the same: correctly enumerating available devices, handling one becoming unavailable mid-call (headset unplugged, Bluetooth disconnects), and re-routing automatically to a sensible fallback — the API surface is the easy half of this problem.</p>"
},
{
  "id": "and-b9-12",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Audio Subsystem",
  "title": "Acoustic echo cancellation — why speakerphone specifically needs it.",
  "difficulty": "Senior",
  "tags": [
    "Echo Cancellation",
    "Speakerphone",
    "Android Audio Subsystem"
  ],
  "question": "What is acoustic echo cancellation, and why does it matter specifically for speakerphone calls?",
  "answer": "<p>On speakerphone, the microphone picks up the user's voice <em>and</em> the call audio coming out of the speaker — without cancellation, the far end hears their own voice echoed back with a delay, disorienting and prone to feedback. Android's <code>AcousticEchoCanceler</code> effect — a hardware/DSP-dependent effect, not guaranteed present on every device — subtracts a modeled version of the known speaker output from the mic input.</p>\n      <p>Getting it right depends on the app correctly setting <code>MODE_IN_COMMUNICATION</code> (which enables the platform's echo-aware audio path), and on devices without hardware AEC, potentially needing a software fallback — exactly the kind of device-fragmentation problem that makes VoIP-on-Android harder than \"just play some audio.\"</p>"
},
{
  "id": "and-b9-13",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Audio Subsystem",
  "title": "AudioRecord/AudioTrack vs MediaRecorder/MediaPlayer for a VoIP engine.",
  "difficulty": "Mid",
  "tags": [
    "AudioRecord",
    "AudioTrack",
    "Android Audio Subsystem"
  ],
  "question": "When would you reach for AudioRecord/AudioTrack instead of MediaPlayer/MediaRecorder for a VoIP app?",
  "answer": "<p><code>MediaPlayer</code>/<code>MediaRecorder</code> are file/stream-oriented and built for playback or recording of complete media assets — not for the real-time, low-latency, continuously streaming raw PCM a live SIP/RTP call needs, where the app itself owns the buffers feeding into (or pulled out of) a custom RTP/SRTP encode-decode pipeline in near real time.</p>\n      <p><code>AudioRecord</code>/<code>AudioTrack</code> operate directly on raw PCM buffers with tighter latency and full control over buffer sizing, sample rate, and exactly when audio data moves — the actual building blocks a SIP client's audio engine is built from, underneath any higher-level abstraction.</p>"
},
{
  "id": "and-b9-14",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Enterprise & MDM",
  "title": "Device Owner vs Profile Owner — and which applies to COSU.",
  "difficulty": "Mid",
  "tags": [
    "Device Owner",
    "Profile Owner",
    "COSU",
    "Android Enterprise & MDM"
  ],
  "question": "Device Owner vs Profile Owner — what's the actual difference, and which applies to a COSU deployment?",
  "answer": "<p>Profile Owner manages a work profile alongside a personal profile on a BYOD-style device — the organization controls the work profile only, the user keeps full control of the rest. Device Owner manages the <em>entire</em> device — provisioned via zero-touch enrollment or a factory-reset QR/NFC flow on a device with no prior account, giving the MDM full control, not just a profile.</p>\n      <p>COSU (Corporate-Owned, Single-Use — \"kiosk mode\") deployments, common for dedicated PTT/comms handsets issued to field workers, use Device Owner mode specifically because they need whole-device lockdown: no home-screen escape, no other installable apps, no settings access — guarantees only Device Owner privileges provide.</p>"
},
{
  "id": "and-b9-15",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Enterprise & MDM",
  "title": "What Device Owner mode actually stops your own app from doing.",
  "difficulty": "Senior",
  "tags": [
    "Device Owner",
    "LockTask",
    "Android Enterprise & MDM"
  ],
  "question": "What does a Device Owner-managed device actually stop your own app from doing, or require it to do differently?",
  "answer": "<p>Real design constraints on this kind of fleet:</p>\n      <ul>\n        <li>System UI restrictions (locked status bar, hidden navigation, single-app lock via <code>LockTask</code> mode) mean your comms app may need to explicitly cooperate with <code>startLockTask()</code> rather than assume normal Activity/window behavior.</li>\n        <li>Permission dialogs can be pre-granted or suppressed entirely by policy (<code>setPermissionGrantState</code>) — code that only handles \"user taps Allow\" is incomplete, since a permission might already be silently granted, or silently and unchangeably denied.</li>\n        <li>App distribution is typically MDM-controlled (Managed Google Play, a private catalog), not the normal Play Store update flow — your release process has to integrate with whatever channel the fleet uses.</li>\n      </ul>"
},
{
  "id": "and-b9-16",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Enterprise & MDM",
  "title": "Managed configurations — what they are, and how an app consumes one.",
  "difficulty": "Senior",
  "tags": [
    "Managed Configuration",
    "RestrictionsManager",
    "Android Enterprise & MDM"
  ],
  "question": "What is a managed configuration, and how does an app actually consume one?",
  "answer": "<p>A schema of settings — defined by the app itself via <code>res/xml/app_restrictions.xml</code> or the modern JSON-schema approach — that an IT admin sets remotely through the MDM/EMM console (a fleet's SIP server address, default codec, PTT channel) with no custom in-app admin UI or separate config backend needed.</p>\n      <p>The app reads these via <code>RestrictionsManager.getApplicationRestrictions()</code> and should register for <code>ACTION_APPLICATION_RESTRICTIONS_CHANGED</code> to react live if an admin pushes an update while the app is running — a genuinely different delivery mechanism than a typical consumer remote-config service, and exactly the kind of thing fleet-wide SIP settings get pushed through.</p>"
},
{
  "id": "and-b9-17",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Enterprise & MDM",
  "title": "Rolling an app update to 500 locked-down field devices — what's different from a Play Store rollout.",
  "difficulty": "Senior",
  "tags": [
    "MDM",
    "Fleet Rollout",
    "Android Enterprise & MDM"
  ],
  "question": "An MDM pushes an app update to a fleet of 500 locked-down COSU devices in the field. What can go wrong that wouldn't happen with a normal Play Store rollout?",
  "answer": "<p>A locked-down Device Owner device may have no user present to approve anything — if the new version introduces a runtime permission not pre-granted via managed configuration, the app can silently break in a way a consumer rollout would just show a dialog for. Devices in the field may be offline or poorly connected for long stretches (this exact role's core competency), so rollout can't assume the prompt fan-out a typical staged Play Store rollout does — some devices run the old version for a long tail.</p>\n      <p>And because these are often dedicated, unattended devices, there's frequently no human to notice or report a broken update quickly — which is why remote diagnostics and MDM-driven rollback matter as much as the update mechanism itself for this class of deployment.</p>"
},
{
  "id": "and-b9-18",
  "category": "android",
  "categoryName": "Android",
  "topic": "Android Enterprise & MDM",
  "title": "Why a field-comms product needs Device Owner/COSU, not just an in-app 'focus mode'.",
  "difficulty": "Mid",
  "tags": [
    "COSU",
    "LockTask",
    "Android Enterprise & MDM"
  ],
  "question": "Why would a field-communications product specifically need Device Owner / COSU mode rather than a normal consumer app with a built-in 'focus mode'?",
  "answer": "<p>An in-app kiosk mode (disabling the home button via a custom launcher, say) is fundamentally advisory — the user can still force-stop it, use recent apps, or factory reset around it. Device Owner-enforced <code>LockTask</code> mode is an OS-level guarantee, not an app convention — genuinely necessary when the device is company property handed to field workers who shouldn't install unapproved apps or disable the comms app, and where a lost or stolen device needs remote wipe the organization actually controls.</p>\n      <p>It's the difference between \"the app tries to stay in the foreground\" and \"the OS itself will not let another app take over.\"</p>"
},
{
  "id": "and-b9-19",
  "category": "android",
  "categoryName": "Android",
  "topic": "Bluetooth Accessories (HFP/HID)",
  "title": "HFP vs HSP — why it matters which one an accessory supports.",
  "difficulty": "Senior",
  "tags": [
    "HFP",
    "HSP",
    "Bluetooth",
    "Bluetooth Accessories (HFP/HID)"
  ],
  "question": "HFP vs HSP — what's actually different, and why does it matter which one an accessory supports?",
  "answer": "<p>HSP (Headset Profile) is the older, minimal profile — basic audio plus a single answer/hang-up button, no real call-state awareness. HFP (Hands-Free Profile) is richer — it exposes actual telephony state (call in progress, caller ID via AT commands over the Bluetooth RFCOMM channel), volume sync, and supports call waiting and three-way-call signaling.</p>\n      <p>A SIP app that wants a headset's hardware answer/end/mute button to actually control the SIP call state — not just the audio path — needs to correctly participate in the HFP AT-command exchange. An accessory or app implementing only the audio-routing side without the HFP signaling side will play and receive audio fine, but the physical buttons won't do anything meaningful to the actual call.</p>"
},
{
  "id": "and-b9-20",
  "category": "android",
  "categoryName": "Android",
  "topic": "Bluetooth Accessories (HFP/HID)",
  "title": "The Bluetooth pairing/connection lifecycle, and where it commonly breaks.",
  "difficulty": "Mid",
  "tags": [
    "Bluetooth Pairing",
    "HFP",
    "Bluetooth Accessories (HFP/HID)"
  ],
  "question": "Walk through the Bluetooth pairing and connection lifecycle from an app's perspective, and where it commonly breaks.",
  "answer": "<p>Discovery (scanning for nearby devices) → pairing/bonding (a long-term trust exchange, often with a PIN/passkey confirmation) → connection (establishing the actual profile session — HFP, A2DP — over the already-bonded link). Pairing and connecting are genuinely separate steps: a device can be paired but not currently connected.</p>\n      <p>An app listens for <code>ACTION_ACL_CONNECTED</code>/<code>DISCONNECTED</code> and the profile-specific state broadcast (<code>BluetoothHeadset.ACTION_CONNECTION_STATE_CHANGED</code> for HFP) to know the accessory's real state. Common breakage: assuming \"paired\" means \"ready to route audio\" (it doesn't — the HFP connection can fail or lag well after bonding succeeds), and not gracefully handling a mid-call disconnect.</p>"
},
{
  "id": "and-b9-21",
  "category": "android",
  "categoryName": "Android",
  "topic": "Bluetooth Accessories (HFP/HID)",
  "title": "A Bluetooth headset drops mid-call — what should the app do, and what commonly goes wrong?",
  "difficulty": "Senior",
  "tags": [
    "Bluetooth",
    "Headset Disconnect",
    "Failover",
    "Bluetooth Accessories (HFP/HID)"
  ],
  "question": "A Bluetooth headset drops mid-call. What should the app actually do, and what commonly goes wrong?",
  "answer": "<p>Detect the disconnect promptly via the HFP connection-state broadcast, and immediately fail the active call's audio route over to the next sensible option — earpiece or speaker — rather than leaving it silently routed to a now-nonexistent sink. A call that goes silent because the headset dropped and nothing re-routed is a severe field failure for a PTT/dispatch product where the user is often relying entirely on audio, not the screen.</p>\n      <p>Common failure: the app listens only for the general Bluetooth disconnect broadcast, not the audio-routing implication specifically, so the call state shows \"connected\" while no audio path actually exists — or the re-routing logic races with the OS's own automatic fallback, producing a noticeable glitch during handoff. Testing this by physically walking a headset out of range mid-call, not just simulating it, is exactly the kind of hands-on verification this role expects.</p>"
},
{
  "id": "and-b9-22",
  "category": "android",
  "categoryName": "Android",
  "topic": "Bluetooth Accessories (HFP/HID)",
  "title": "HID beyond keyboard/mouse — the hardware PTT button case.",
  "difficulty": "Senior",
  "tags": [
    "HID",
    "Hardware Button",
    "PTT",
    "Bluetooth Accessories (HFP/HID)"
  ],
  "question": "What is HID, and where would it show up in an Android comms/PTT product beyond a keyboard or mouse?",
  "answer": "<p>Human Interface Device profile — beyond the obvious keyboard/mouse use case, HID is how a dedicated hardware PTT button (a physical accessory, or a button on a ruggedized case/sled) reports button-press events to the OS, arriving as standard key events rather than anything Bluetooth-audio-specific.</p>\n      <p>This matters because a PTT product frequently needs a hardware button that works reliably even with the screen off or the app backgrounded — meaning correctly handling HID key events in a way that survives normal Activity lifecycle assumptions, sometimes requiring a foreground service with its own key-event path rather than relying purely on an Activity's <code>onKeyDown</code>.</p>"
},
{
  "id": "and-b9-23",
  "category": "android",
  "categoryName": "Android",
  "topic": "Bluetooth Accessories (HFP/HID)",
  "title": "Why proactively log Bluetooth connection state in a field-deployed comms app?",
  "difficulty": "Mid",
  "tags": [
    "Diagnostics",
    "Bluetooth Logging",
    "Bluetooth Accessories (HFP/HID)"
  ],
  "question": "Why is Bluetooth pairing/connection state something you'd want to actively monitor and log, rather than just handling it reactively in the moment?",
  "answer": "<p>When a field worker reports \"my headset stopped working,\" the diagnostic question is almost always: was it a Bluetooth disconnection, an HFP profile failure specifically, an app crash, or a SIP/network issue? Without proactive state logging — timestamped connection-state transitions, signal info where available, reconnection attempt history — that question is unanswerable after the fact, on a device now back in the office with the field conditions gone.</p>\n      <p>Same discipline as the earlier incident-postmortem answer, applied to the Bluetooth layer of a device class where hardware flakiness in the field is normal and expected, not an edge case.</p>"
},
{
  "id": "and-b9-24",
  "category": "android",
  "categoryName": "Android",
  "topic": "Wireless Networking for VoIP",
  "title": "Wi-Fi roaming — what happens during the handoff, and why it can break a call.",
  "difficulty": "Senior",
  "tags": [
    "Wi-Fi Roaming",
    "802.11r",
    "Wireless Networking for VoIP"
  ],
  "question": "Wi-Fi roaming — what actually happens when a device moves between two access points, and why can it break an active call?",
  "answer": "<p>Roaming means the radio disassociates from one AP and re-associates with another, ideally the same network — during that handoff window the device has no usable Wi-Fi at all, typically tens to a few hundred milliseconds with well-tuned 802.11r/k/v fast roaming, but potentially over a second on a poorly configured enterprise deployment doing a full re-authentication.</p>\n      <p>For an active RTP stream, that gap is packet loss, audible as a glitch or dropout; if the gap is long enough — or roaming crossed a subnet boundary and the IP actually changed — the underlying transport can break entirely, needing a re-INVITE or full re-registration to recover. This is why a fleet deployment for this kind of product usually requires working directly with the customer's network team on fast-roaming configuration — the app alone can't fully compensate for it.</p>"
},
{
  "id": "and-b9-25",
  "category": "android",
  "categoryName": "Android",
  "topic": "Wireless Networking for VoIP",
  "title": "Jitter — what it is, and how a jitter buffer addresses it.",
  "difficulty": "Senior",
  "tags": [
    "Jitter",
    "Jitter Buffer",
    "Wireless Networking for VoIP"
  ],
  "question": "Jitter — what is it exactly, and how does a jitter buffer address it?",
  "answer": "<p>Jitter is variation in inter-packet arrival timing — RTP packets sent at a steady interval by the sender can arrive unevenly due to variable network path delay, so playing each one back the instant it arrives produces choppy audio even with zero packet loss.</p>\n      <p>A jitter buffer holds incoming packets briefly and releases them for playback at a smoothed, steady cadence, trading a small amount of added latency for consistent timing. The real tension: too small a buffer doesn't absorb enough variance and still glitches; too large adds noticeable, cumulative conversational latency. An adaptive jitter buffer that resizes based on observed network conditions in real time is the sophisticated version — exactly the kind of tuning knob this role would own.</p>"
},
{
  "id": "and-b9-26",
  "category": "android",
  "categoryName": "Android",
  "topic": "Wireless Networking for VoIP",
  "title": "Packet loss — how it manifests in a call, and the mitigation options.",
  "difficulty": "Senior",
  "tags": [
    "Packet Loss",
    "FEC",
    "PLC",
    "Wireless Networking for VoIP"
  ],
  "question": "Packet loss — how does it actually manifest in a VoIP call, and what are the app-level mitigation options?",
  "answer": "<p>Lost RTP packets show up as brief silence, a click/pop, or garbled audio at the corresponding playback point, with severity scaling with loss rate and burstiness — scattered single-packet loss is far less perceptible than a burst of consecutive losses.</p>\n      <p>Mitigations: Packet Loss Concealment (PLC) — the codec or a post-processing step synthesizes a plausible replacement for a short gap rather than silence, since a very short (roughly 20ms) speech gap is often interpolatable acceptably; Forward Error Correction (FEC) — sending redundant data that reconstructs a lost packet without retransmission, since retransmission is usually too slow for real-time audio's latency budget; and codec choice itself (Opus, for instance, has real loss-resilience built in). The point of this question isn't whether the candidate can name these — it's whether they've actually worked with them in a shipped product, not just the terminology.</p>"
},
{
  "id": "and-b9-27",
  "category": "android",
  "categoryName": "Android",
  "topic": "Wireless Networking for VoIP",
  "title": "Diagnosing whether field call-quality issues are Wi-Fi or cellular, without being physically present.",
  "difficulty": "Senior",
  "tags": [
    "Diagnostics",
    "Field Debugging",
    "Wireless Networking for VoIP"
  ],
  "question": "How would you diagnose whether call quality problems in the field are a Wi-Fi issue or a cellular/data issue, given you can't be physically present?",
  "answer": "<p>Instrument the client to capture and report, alongside call-quality metrics (jitter, loss, RTT via RTCP if available), the active connection type and relevant radio details at the time of the call — SSID/BSSID and RSSI for Wi-Fi, or signal strength/network type for cellular — plus roaming/handoff events, all timestamped and correlated against the actual audio-degradation window.</p>\n      <p>Without that instrumentation, \"the call was bad\" reported after the fact is nearly undiagnosable. With it, a clear pattern — quality drops correlating with a specific AP's coverage edge, or a specific carrier's cell handoff — becomes visible in aggregate across a fleet, turning an anecdote into an actionable network problem to raise with the customer's IT team.</p>"
},
{
  "id": "and-b9-28",
  "category": "android",
  "categoryName": "Android",
  "topic": "WebRTC & PTT Systems",
  "title": "Where does WebRTC stop being the right answer for push-to-talk?",
  "difficulty": "Senior",
  "tags": [
    "WebRTC",
    "Push-to-Talk",
    "WebRTC & PTT Systems"
  ],
  "question": "Where does WebRTC stop being the right answer for push-to-talk?",
  "answer": "<p>WebRTC is built around full-duplex, always-on, peer-negotiated media sessions — ICE/STUN/TURN negotiation, a DTLS-SRTP handshake — genuinely heavyweight session setup relative to what PTT actually needs: a half-duplex, low-latency, often one-to-many audio burst that should start transmitting within tens of milliseconds of a button press, not after a full ICE round trip.</p>\n      <p>Real dispatch/PTT systems more often use a persistent, already-established channel session — closer in spirit to a SIP conference bridge or a dedicated PTT-over-cellular protocol — where \"press to talk\" just requests the floor on an already-live session, rather than establishing a brand-new WebRTC peer connection per transmission. WebRTC's strength — rich, standards-based full session negotiation — is close to the opposite of what PTT's latency and floor-control requirements want, which is exactly the nuance this question is testing, not \"do you know WebRTC.\"</p>"
},
{
  "id": "and-b9-29",
  "category": "android",
  "categoryName": "Android",
  "topic": "WebRTC & PTT Systems",
  "title": "Floor control in a PTT/group-communications system — why it's a hard problem.",
  "difficulty": "Senior",
  "tags": [
    "Floor Control",
    "PTT",
    "WebRTC & PTT Systems"
  ],
  "question": "What is 'floor control' in a PTT/group-communications system, and why is it a hard problem?",
  "answer": "<p>In a half-duplex group channel, only one participant can transmit (\"hold the floor\") at a time, and the system needs a mechanism to grant, queue, preempt, and release that floor — who gets it when two people press PTT simultaneously, whether a higher-priority user (a dispatcher, an emergency call) can preempt an in-progress transmission, and how the floor releases and re-grants cleanly with minimal gap for the next speaker.</p>\n      <p>It's hard because it's a distributed coordination problem across every device on the channel with real-time latency requirements — get it wrong and you get talk-over collisions, a floor that appears held by nobody, or unacceptable delay between pressing PTT and actually being heard, any of which is a serious failure for a product whose entire value is fast, reliable group communication.</p>"
},
{
  "id": "and-b9-30",
  "category": "android",
  "categoryName": "Android",
  "topic": "WebRTC & PTT Systems",
  "title": "A media/signaling server's role in PTT architecture vs pure peer-to-peer WebRTC.",
  "difficulty": "Senior",
  "tags": [
    "PTT Architecture",
    "Media Server",
    "WebRTC & PTT Systems"
  ],
  "question": "What's a media/signaling server's role in a PTT architecture, versus pure peer-to-peer WebRTC?",
  "answer": "<p>A centralized (or regionally distributed) server owns floor-control arbitration and media mixing/relay for a group channel — genuinely necessary at any meaningful group size, since a pure mesh (every device sending directly to every other) doesn't scale past a handful of participants and gives no natural place to implement floor control, priority preemption, or late-join behavior for a channel with dozens of geographically spread members on varying network conditions.</p>\n      <p>The server model trades the \"no infrastructure needed\" appeal of pure P2P WebRTC for the operational control a real dispatch product actually needs — exactly the kind of architecture question that separates someone who's built a two-person WebRTC demo from someone who's built a real fielded group-comms product.</p>"
},
{
  "id": "and-b9-31",
  "category": "android",
  "categoryName": "Android",
  "topic": "Cisco CUCM Integration",
  "title": "What is Cisco CUCM, and its role relative to a mobile client?",
  "difficulty": "Mid",
  "tags": [
    "Cisco CUCM",
    "Enterprise Telephony",
    "Cisco CUCM Integration"
  ],
  "question": "What is Cisco CUCM, and what's its role relative to the mobile client?",
  "answer": "<p>Cisco Unified Communications Manager — an enterprise IP telephony call-control system (a SIP/SCCP registrar, proxy, and call-routing engine) many large enterprises already run as their PBX backbone. A mobile SIP client integrating with CUCM registers as a SIP endpoint against it — device configuration, line/extension provisioning, often a specific device-type profile CUCM needs to recognize — rather than against a generic SIP server, meaning it has to correctly handle CUCM's specific SIP dialect and feature set (not always byte-for-byte standard SIP across every feature), its device/line provisioning model, and often its own certificate/TLS trust requirements for secure SIP registration.</p>"
},
{
  "id": "and-b9-32",
  "category": "android",
  "categoryName": "Android",
  "topic": "Cisco CUCM Integration",
  "title": "Common integration friction with CUCM vs a generic SIP PBX.",
  "difficulty": "Senior",
  "tags": [
    "Cisco CUCM",
    "SIP Interop",
    "Cisco CUCM Integration"
  ],
  "question": "What kind of integration friction is common when connecting a custom Android SIP client to CUCM specifically, versus a generic SIP PBX?",
  "answer": "<p>CUCM has its own device-type registration model — the client often needs to present itself as a specific recognized device or \"phone\" profile CUCM's admin has configured, not just any generic SIP UA — and has historically layered some feature-specific quirks on top of standard SIP (certain presence, hold/resume, or transfer behaviors implemented slightly differently than a textbook SIP PBX).</p>\n      <p>\"SIP-compliant\" isn't automatically \"works correctly against CUCM\" — real integration work typically means testing directly against CUCM, or a lab instance of it, rather than assuming generic SIP interop testing is sufficient. This is exactly the kind of narrow, hands-on integration knowledge that's hard to fake, and why the JD calls it out as a distinct, strongly-preferred skill rather than folding it into generic \"SIP experience.\"</p>"
},
{
  "id": "and-b9-33",
  "category": "android",
  "categoryName": "Android",
  "topic": "Cisco CUCM Integration",
  "title": "Why integrate with an existing CUCM deployment rather than standing up a separate SIP server?",
  "difficulty": "Mid",
  "tags": [
    "Cisco CUCM",
    "Enterprise Integration",
    "Cisco CUCM Integration"
  ],
  "question": "Why would an enterprise specifically want their PTT/comms Android app to integrate with their existing CUCM deployment rather than standing up a separate SIP server?",
  "answer": "<p>The enterprise likely already runs CUCM as their call-control backbone for desk phones, conferencing, and existing telephony — integrating the mobile/PTT client against it means one unified numbering plan, one set of admin tools, one place where call routing and policy live, and interoperability with the rest of the organization's phone system (a mobile PTT user reachable from, or able to transfer to, a desk phone) rather than a second, siloed communications system IT has to separately manage, secure, and keep in sync.</p>\n      <p>This is a real integration and procurement consideration, not just a technical preference — which is why understanding CUCM specifically, not just \"SIP in general,\" is valuable to an org already invested in it.</p>"
}
);
