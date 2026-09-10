// ==========================================================
// Android Interview Questions — Batch 3
// Security & Hardening (Keystore, encryption at rest, root/
// tamper detection, Play Integrity, cert pinning, biometrics,
// exported-component IPC risk) and Payments & POS Domain
// (terminal hardware, EMV chip/contactless flow, DUKPT, P2PE,
// tokenization, TMS, settlement, PIN pad tamper response).
// Appends into QUESTION_DATA. Load AFTER js/data.js,
// js/data-kotlin-batch1.js and js/data-android-batch2.js,
// BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b3-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Where do you store a secret — SharedPreferences vs the Keystore?",
  "difficulty": "Mid",
  "tags": [
    "Keystore",
    "Secrets",
    "SharedPreferences",
    "Security & Hardening"
  ],
  "question": "Where should you store a payment API key or session secret in the app — plain SharedPreferences vs EncryptedSharedPreferences vs the Keystore?",
  "answer": "<p>Plain <code>SharedPreferences</code> is an unencrypted XML file — trivially readable on a rooted device or from a backup. <code>EncryptedSharedPreferences</code> (Jetpack Security) wraps it with AES-256-GCM using a Keystore-backed master key — much better, but the value still has to pass through app memory in cleartext to be used.</p>\n      <p>The deeper point: any secret embedded in or handled by the client is ultimately extractable by a sufficiently motivated attacker with a rooted device and a debugger. A secret that grants real server access (an API key) belongs on a backend, never the client; only ephemeral, narrowly-scoped tokens belong client-side, and those should live in Keystore-backed storage.</p>"
},
{
  "id": "and-b3-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Android Keystore — why is hardware-backed key storage different from \"just encrypting with a key\"?",
  "difficulty": "Senior",
  "tags": [
    "Keystore",
    "TEE",
    "Security & Hardening"
  ],
  "question": "What is the Android Keystore system, and why is hardware-backed key storage fundamentally different from just encrypting data with a key you hold in the app?",
  "answer": "<p>Keystore lets you generate and use cryptographic keys where the key material never leaves secure hardware — a TEE (Trusted Execution Environment), or StrongBox on supported devices. The app gets a handle to <em>perform</em> crypto operations with the key, but can't extract the raw key bytes, even with root.</p>\n      <p>That's fundamentally different from \"encrypt with a key you hold\" — there, the key itself sits in app memory or app storage and is extractable by anyone who can read the process (root, a debugger attached to a debuggable build, a memory dump). Keystore moves the trust boundary from \"the app process\" to \"the secure hardware,\" which is the whole point on a device handling payment data.</p>"
},
{
  "id": "and-b3-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "StrongBox vs TEE-backed Keystore.",
  "difficulty": "Senior",
  "tags": [
    "StrongBox",
    "Keystore",
    "TEE",
    "Security & Hardening"
  ],
  "question": "StrongBox vs a TEE-backed Keystore key — what's the difference, and when do you actually need to check for it?",
  "answer": "<p>A TEE runs on the main SoC in an isolated execution mode — it protects key material against a compromised OS, but not against a sufficiently resourced hardware/side-channel attack on the same chip. StrongBox is a physically separate, dedicated secure element with its own CPU and RAM, certified to resist a higher bar of physical attack.</p>\n      <p>Not every device has StrongBox. Request it with <code>setIsStrongBoxBacked(true)</code> on the key spec, with a fallback path, and check <code>KeyInfo.isInsideSecureHardware()</code> to confirm what you actually got. For a certified payment terminal, the card/PIN cryptography itself typically lives in a dedicated payment secure element that's independently PCI-certified — well beyond what StrongBox alone guarantees — but StrongBox is the right default for any other sensitive key the general-purpose Android side manages.</p>"
},
{
  "id": "and-b3-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Encrypt data at rest with a Keystore-backed AES key.",
  "difficulty": "Mid",
  "tags": [
    "AES",
    "Keystore",
    "Encryption",
    "Security & Hardening"
  ],
  "question": "Show how to encrypt local data at rest using an AES key generated inside the Android Keystore.",
  "answer": "<p>The key never leaves the Keystore — you hand the Cipher a key <em>alias</em>, not key bytes. GCM gives you authenticated encryption (tamper-evident), so always store the IV alongside the ciphertext; it's not secret, but it's required to decrypt and must never be reused with the same key.</p>\n      <pre><code>val spec = KeyGenParameterSpec.Builder(\n    \"payment_data_key\",\n    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT\n).setBlockModes(KeyProperties.BLOCK_MODE_GCM)\n  .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)\n  .setKeySize(256)\n  .build()\n\nKeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, \"AndroidKeyStore\")\n  .apply { init(spec) }\n  .generateKey()\n\nval cipher = Cipher.getInstance(\"AES/GCM/NoPadding\")\ncipher.init(Cipher.ENCRYPT_MODE, keystore.getKey(\"payment_data_key\", null))\nval ciphertext = cipher.doFinal(plaintext)\nval iv = cipher.iv   // store alongside ciphertext — needed to decrypt, not secret</code></pre>"
},
{
  "id": "and-b3-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Why is FLAG_SECURE necessary on a payment/PIN screen?",
  "difficulty": "Mid",
  "tags": [
    "FLAG_SECURE",
    "Screen Capture",
    "Security & Hardening"
  ],
  "question": "Why is setting FLAG_SECURE on a payment amount or PIN entry screen's Window close to mandatory?",
  "answer": "<p><code>FLAG_SECURE</code> blocks screenshots and screen recording of that Activity — including its thumbnail in the Recents/task switcher — and prevents the content from being captured by screen-mirroring APIs or a malicious accessibility service posing as a screen reader. On a screen showing a transaction amount, a PAN, or a PIN pad, that closes off an entire class of \"just record the screen\" attacks that no amount of network or storage encryption addresses.</p>"
},
{
  "id": "and-b3-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "What is tapjacking, and how do you defend against it?",
  "difficulty": "Mid",
  "tags": [
    "Tapjacking",
    "UI Security",
    "Security & Hardening"
  ],
  "question": "What is tapjacking, and how do you defend against it on a sensitive confirm/pay button?",
  "answer": "<p>A malicious overlay app draws a transparent or disguised view over your sensitive button, so the user's tap is intercepted by the attacker's window instead of — or in addition to — reaching your button, potentially confirming an action the user never actually saw. Defense: <code>setFilterTouchesWhenObscured(true)</code> on the sensitive View, which makes the framework drop any touch that arrives while another window is detected obscuring it; combine with general scrutiny of what <code>SYSTEM_ALERT_WINDOW</code>-holding apps are permitted on a locked-down terminal in the first place.</p>"
},
{
  "id": "and-b3-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "How reliable is root detection, and what security posture does it actually buy?",
  "difficulty": "Senior",
  "tags": [
    "Root Detection",
    "Tamper Detection",
    "Security & Hardening"
  ],
  "question": "Root/jailbreak detection — how reliable is it, and what's the actual security posture it buys you?",
  "answer": "<p>Client-side root detection (checking for su binaries, Magisk traces, build tags, RootBeer-style heuristics) is a check running on a device the attacker fully controls — a hooking framework like Xposed or Frida can intercept your own detection code and simply make it lie. It is not a security control in the \"unbreakable gate\" sense; it's a risk signal.</p>\n      <p>Use it as an input to a risk-based decision (decline, step up authentication, flag for review) rather than a hard block you trust completely — and put the real security where it can't be patched client-side: hardware-backed keys, remote attestation, and server-side verification.</p>"
},
{
  "id": "and-b3-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Play Integrity API vs root detection you write yourself.",
  "difficulty": "Mid",
  "tags": [
    "Play Integrity",
    "Attestation",
    "Security & Hardening"
  ],
  "question": "What does the Play Integrity API actually verify, and how is it fundamentally different from root detection you write yourself?",
  "answer": "<p>Play Integrity returns a server-verifiable, Google-signed attestation covering three separate verdicts: app integrity (is this the genuine binary from Play, unmodified), device integrity (is this a genuine, unmodified Android device/OS), and account/licensing. Because the verdict is cryptographically signed by Google and verified on your own backend, an attacker on the device can't simply patch out an if-check the way they can with your own root-detection code — they'd have to defeat Google's attestation chain itself, a much higher bar.</p>"
},
{
  "id": "and-b3-09",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Certificate pinning — what it protects against, and how to avoid bricking the app on rotation.",
  "difficulty": "Senior",
  "tags": [
    "Certificate Pinning",
    "TLS",
    "MITM",
    "Security & Hardening"
  ],
  "question": "Certificate pinning — what specific attack does it protect against that plain TLS doesn't, and how do you avoid bricking the app on cert rotation?",
  "answer": "<p>Plain TLS trusts any certificate chaining to a CA in the OS trust store — that includes a corporate MITM proxy CA installed on the device, or a coerced/compromised CA anywhere in the world. Pinning says \"I trust exactly this key/cert for this domain,\" closing that gap.</p>\n      <p>Pin the public key (SPKI hash), not the leaf certificate — a routine cert renewal that reuses the same key pair then doesn't break pinning. And always ship a backup pin for the next key in rotation, or a remote kill-switch/config, or a planned cert rotation turns into an app-store-update-required outage the moment the old pin expires.</p>"
},
{
  "id": "and-b3-10",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Why isn't TLS \"done\" for a payment app — what does OWASP MASVS add?",
  "difficulty": "Mid",
  "tags": [
    "OWASP",
    "MASVS",
    "MSTG",
    "Security & Hardening"
  ],
  "question": "Why isn't relying on TLS enough to call a payment app secure — what does the OWASP MASVS/MSTG checklist add on top?",
  "answer": "<p>TLS secures the wire, not the endpoints. MASVS (Mobile App Security Verification Standard) and its testing guide, MSTG, cover exactly what TLS is silent on: secure local storage, correct Keystore usage, resilience against reverse engineering and tampering, safe platform interaction (exported components, IPC, deep links), and authentication/session handling on the client. A perfectly encrypted connection from a client that stores the session token in plaintext or exports a hijackable Activity is still broken.</p>"
},
{
  "id": "and-b3-11",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "BiometricPrompt — plain result vs crypto-object-bound, and which one authorizes a payment?",
  "difficulty": "Senior",
  "tags": [
    "Biometrics",
    "BiometricPrompt",
    "Keystore",
    "Security & Hardening"
  ],
  "question": "Using BiometricPrompt for authentication — what's the difference between the plain 'authenticated: true/false' mode and crypto-object-bound biometric auth, and which one should authorize a payment?",
  "answer": "<p>The plain mode just returns a boolean from a callback — fine for unlocking a UI, but on a compromised device a hooking framework can intercept that callback and simply force it to report success without the biometric check ever having passed. Crypto-object-bound mode ties the prompt to a Keystore key created with <code>setUserAuthenticationRequired(true)</code> — the key itself is only usable by the OS after a successful biometric match; there's no callback to fake, because the gate is enforced by secure hardware, not by app code.</p>\n      <p>Always use the crypto-bound mode to authorize an actual transaction; the boolean mode is for convenience UX only.</p>"
},
{
  "id": "and-b3-12",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Why is android:debuggable=\"true\" in a shipped release build a serious problem?",
  "difficulty": "Mid",
  "tags": [
    "Debuggable",
    "JDWP",
    "Release Build",
    "Security & Hardening"
  ],
  "question": "Why is android:debuggable=\"true\" in a shipped release APK a serious security problem, beyond just being slower?",
  "answer": "<p>A debuggable process accepts a JDWP debugger attach — on many Android versions with no root required — letting an attacker inspect and modify process memory, set breakpoints inside your own security checks, and read anything the process can read. It's also one of the signals Play Integrity's attestation checks. R8 strips the flag from a release build by default via manifest merging, but a misconfigured build variant or a manual manifest override can leave it on — verify the actual shipped APK (<code>aapt dump badging</code> or equivalent) rather than trusting the build config alone.</p>"
},
{
  "id": "and-b3-13",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Is ProGuard/R8 obfuscation a security control?",
  "difficulty": "Mid",
  "tags": [
    "ProGuard",
    "R8",
    "Obfuscation",
    "Security & Hardening"
  ],
  "question": "Is ProGuard/R8 code obfuscation a real security control for a payment app, or something else?",
  "answer": "<p>It's a speed bump, not a barrier — it raises the cost of casual static reverse engineering (renamed classes/methods, dead-code removal) but does nothing against a determined attacker with a decompiler and dynamic instrumentation (Frida can hook a method regardless of what it's named at the bytecode level). Never rely on obfuscation to hide a secret or gate a security check; it makes tampering marginally more annoying, it isn't a substitute for hardware-backed key storage or server-side verification of anything that actually matters.</p>"
},
{
  "id": "and-b3-14",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Envelope encryption — why not just encrypt everything with one long-lived key?",
  "difficulty": "Senior",
  "tags": [
    "Envelope Encryption",
    "Key Rotation",
    "Security & Hardening"
  ],
  "question": "Envelope encryption and key rotation — why not just encrypt everything with one long-lived AES key forever?",
  "answer": "<p>A single long-lived key is a single point of failure: if it's ever compromised, every piece of data it ever encrypted is compromised, and you can't selectively rotate without decrypting everything under the old key first — a huge, risky operation on live data.</p>\n      <p>Envelope encryption instead generates a fresh Data Encryption Key (DEK) per item or session, encrypts the actual data with the DEK, then encrypts that small DEK with a longer-lived Key Encryption Key (KEK, ideally Keystore-resident). Rotating the KEK just re-wraps the small DEKs, not the bulk data, and a single compromised DEK only exposes the one item it protected.</p>"
},
{
  "id": "and-b3-15",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "Why is java.util.Random wrong for a nonce/session token?",
  "difficulty": "Mid",
  "tags": [
    "SecureRandom",
    "Entropy",
    "Security & Hardening"
  ],
  "question": "Why is java.util.Random the wrong choice for generating a nonce or session token, and what should you use instead?",
  "answer": "<p><code>java.util.Random</code> is a deterministic PRNG, commonly seeded from the clock — predictable if an attacker can narrow the seed, or reconstruct internal state after observing enough outputs. That's exactly the property a nonce, session token, or IV needs NOT to have.</p>\n      <p>Use <code>SecureRandom</code>, a CSPRNG drawing from an OS entropy source — the only correct choice for anything whose security property depends on being genuinely unpredictable: tokens, nonces, IVs, salts.</p>"
},
{
  "id": "and-b3-16",
  "category": "android",
  "categoryName": "Android",
  "topic": "Security & Hardening",
  "title": "How does a poorly configured exported component become a hole on a POS device?",
  "difficulty": "Senior",
  "tags": [
    "Exported Components",
    "IPC Security",
    "Security & Hardening"
  ],
  "question": "How does a poorly configured exported Activity or Service become a real security hole specifically on a locked-down POS device?",
  "answer": "<p><code>exported=\"true\"</code> — explicit, or implicit via an intent-filter on API levels before 31 — means any other app on the device, including one somehow sideloaded onto a \"locked down\" terminal, can start that component directly, bypassing whatever navigation or auth guard your own UI enforces. On a POS device this is especially dangerous if the reachable component can trigger a transaction or read an Intent carrying transaction results.</p>\n      <p>Default every component to <code>exported=\"false\"</code> unless it genuinely needs to be an external entry point; if it does, validate the calling package/signature explicitly rather than trusting whatever Intent extras arrive.</p>"
},
{
  "id": "and-b3-17",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "What are the main hardware components of a payment terminal?",
  "difficulty": "Mid",
  "tags": [
    "POS Hardware",
    "Secure Element",
    "Payments & POS Domain"
  ],
  "question": "At a hardware level, what are the main components of a payment terminal, and which part is 'secure' versus 'general purpose'?",
  "answer": "<p>Roughly: a general-purpose application processor (running Android, your app, the UI) and a separate secure module — sometimes a discrete secure element chip, sometimes a fully independent certified sub-system — that owns the card reader, the PIN pad, and the cryptographic keys.</p>\n      <p>The Android side is deliberately kept \"dumb\" about card data: it orchestrates (\"start a $12.50 transaction\") and renders UI, while the actual card-present cryptography happens inside the certified secure module, audited and certified independently under PCI PTS — precisely so the much larger, harder-to-audit Android/app codebase never sits in the sensitive path. This is the same boundary the earlier \"app vs secure core\" EMV answer describes, now from the hardware side.</p>"
},
{
  "id": "and-b3-18",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Magstripe vs chip vs contactless — how does the terminal's job differ?",
  "difficulty": "Mid",
  "tags": [
    "EMV",
    "Magstripe",
    "Contactless",
    "NFC",
    "Payments & POS Domain"
  ],
  "question": "Magstripe vs chip (contact EMV) vs contactless (NFC/EMV contactless) — how does the terminal's job actually differ for each?",
  "answer": "<p>Magstripe: reads static track data off the stripe — no cryptography from the card itself, which is exactly why skimming/cloning is trivial and why it's being phased out. Chip (contact EMV): the terminal powers the chip and runs an ISO 7816 APDU conversation; the chip performs a cryptographic operation producing a dynamic cryptogram that can't be replayed, so a cloned copy of a chip card's static data still can't produce a valid chip transaction. Contactless (NFC): the same EMV cryptographic principle, over an RF interface (ISO 14443) instead of physical contacts, implemented by a scheme-specific \"kernel\" — Kernel 2 for Mastercard, Kernel 3 for Visa, and so on.</p>"
},
{
  "id": "and-b3-19",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Walk through a chip transaction end to end, from the terminal's perspective.",
  "difficulty": "Senior",
  "tags": [
    "EMV",
    "Transaction Flow",
    "Payments & POS Domain"
  ],
  "question": "Walk through a chip (contact EMV) transaction end to end, from the terminal's perspective.",
  "answer": "<p>Card inserted → terminal powers the chip and gets an ATR (answer to reset) → application selection (which EMV app on the card — e.g. Visa debit vs credit) → terminal sends transaction data (amount, currency, date) to the card → the card runs its own risk management and returns one of three outcomes with a cryptogram: TC (approve offline), ARQC (go online, ask the issuer), or AAC (decline) → on ARQC, the terminal forwards that cryptogram and transaction data through the acquirer/processor to the card network and issuer, and gets back an authorization response → the terminal sends the issuer's response back to the card for final confirmation (script processing) → receipt.</p>"
},
{
  "id": "and-b3-20",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Who decides whether a transaction goes online or approves offline?",
  "difficulty": "Mid",
  "tags": [
    "EMV",
    "Offline Authorization",
    "Payments & POS Domain"
  ],
  "question": "Why does a terminal sometimes go 'online' for approval and sometimes approve 'offline' — who actually decides?",
  "answer": "<p>The chip itself decides, based on risk parameters the issuer configured onto the card (velocity checks, cumulative amount thresholds, random transaction selection) — not the terminal and not the app. The terminal can't \"skip the online step to be faster\"; the card's own cryptogram response (TC / ARQC / AAC) dictates the path. This is part of what makes chip fraud far harder than magstripe: no amount of terminal or app-level control can force an offline approval the card didn't authorize.</p>"
},
{
  "id": "and-b3-21",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "What is DUKPT, and why derive a unique key per transaction instead of sharing one key?",
  "difficulty": "Senior",
  "tags": [
    "DUKPT",
    "Key Management",
    "Payments & POS Domain"
  ],
  "question": "What is DUKPT, and why is it used to manage keys across a fleet of terminals instead of one shared key?",
  "answer": "<p>Derived Unique Key Per Transaction — every terminal starts with a unique initial key, injected once at a secure key-injection facility, and derives a fresh, different encryption key for every single transaction via a one-way key derivation function plus a transaction counter. Recovering one transaction's derived key doesn't let you decrypt any other transaction, past or future, and compromising one terminal doesn't compromise the fleet — unlike a single master key shared across every device, where one leak is catastrophic across the whole estate.</p>"
},
{
  "id": "and-b3-22",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "What is P2PE, and how does it actually reduce PCI scope?",
  "difficulty": "Senior",
  "tags": [
    "P2PE",
    "PCI Scope",
    "Payments & POS Domain"
  ],
  "question": "What is P2PE (point-to-point encryption), and how does it actually reduce PCI scope — mechanically, not just 'it's encrypted'?",
  "answer": "<p>The card reader encrypts cardholder data at the instant it's read — before it ever reaches the terminal's general-purpose processor, OS, or app — using a key the merchant's own systems, and often even the acquirer, never possess; only the P2PE solution provider's certified decryption environment can decrypt it.</p>\n      <p>Because your Android app and its backend never handle unencrypted cardholder data, most PCI DSS requirements that would otherwise apply to \"any system that touches card data\" simply don't apply to your systems — that mechanical fact (never possessing the decryption capability) is what actually reduces scope, not the fact that HTTPS is also in use somewhere.</p>"
},
{
  "id": "and-b3-23",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Tokenization vs encryption — why does a merchant backend want a token, not decryptable ciphertext?",
  "difficulty": "Senior",
  "tags": [
    "Tokenization",
    "PCI Scope",
    "Payments & POS Domain"
  ],
  "question": "Tokenization vs encryption — why does a merchant's backend usually want a token for recurring billing, not just card data it could decrypt?",
  "answer": "<p>Encrypted card data is still cardholder data in PCI's eyes — if you hold ciphertext and could ever obtain the key, you're in scope for protecting it. A token is a non-reversible-by-you substitute value with no exploitable mathematical relationship to the real PAN; only the token vault operator (usually the processor) can map it back.</p>\n      <p>Storing tokens for recurring billing or refunds keeps a merchant's systems out of PCI scope for that stored value in a way \"we encrypted it, we just rarely decrypt it\" doesn't — because with encryption you retain the theoretical capability to reverse it, and that capability is exactly what scope is drawn around.</p>"
},
{
  "id": "and-b3-24",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "What does a Terminal Management System (TMS) actually do?",
  "difficulty": "Mid",
  "tags": [
    "TMS",
    "Fleet Management",
    "Payments & POS Domain"
  ],
  "question": "What does a Terminal Management System (TMS) actually do for a fleet of Android POS devices in the field?",
  "answer": "<p>Remote key injection and rotation (pushing new DUKPT base keys without a truck roll to every terminal), app whitelisting and deployment (the OS is typically locked down so only TMS-approved, signed apps can install), configuration push (merchant ID, terminal ID, acquirer endpoints per device), and remote monitoring/decommissioning (killing a stolen or compromised terminal's ability to transact instantly). It's the fleet-operations layer that makes \"a thousand terminals in merchants' hands\" operationally manageable, closer to managed embedded devices than to consumer phones with an app installed.</p>"
},
{
  "id": "and-b3-25",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Authorization vs settlement — what's the terminal's role in each?",
  "difficulty": "Mid",
  "tags": [
    "Settlement",
    "Batch Processing",
    "Payments & POS Domain"
  ],
  "question": "What's the terminal's role in settlement/batch processing, versus the real-time authorization the user sees?",
  "answer": "<p>Authorization is per-transaction and real-time — it confirms funds are available and reserves them, but doesn't move money. Settlement is a separate, usually end-of-day batch process where the terminal (or the processor on its behalf) submits the day's approved transactions for the actual fund transfer and clearing between the acquiring and issuing banks.</p>\n      <p>A terminal can authorize successfully but fail to settle — it never came back online, or a batch closed before a void was recorded — which is why reconciling \"what the terminal thinks it did\" against \"what actually settled\" is a real operational concern, not an edge case you can ignore.</p>"
},
{
  "id": "and-b3-26",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "EMV Level 1 / 2 / 3 — what's certified at each level?",
  "difficulty": "Mid",
  "tags": [
    "EMV Certification",
    "L1 L2 L3",
    "Payments & POS Domain"
  ],
  "question": "EMV Level 1, Level 2, and Level 3 — what's actually being certified at each level?",
  "answer": "<p>L1 — the physical/electrical/RF interface (contact and contactless characteristics conform to spec); a hardware certification, done once per terminal hardware model. L2 — the EMV kernel software itself, the chip/contactless transaction logic conforming to spec, independent of any particular payment application. L3 — the specific payment application's end-to-end behavior against a given acquirer/card-scheme's requirements — the one that has to be redone per acquirer relationship even on hardware and a kernel that are already L1/L2-certified, which is a major reason terminal certification projects run long.</p>"
},
{
  "id": "and-b3-27",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Who decides the cardholder verification method (PIN, signature, no CVM)?",
  "difficulty": "Senior",
  "tags": [
    "CVM",
    "PIN",
    "Signature",
    "Payments & POS Domain"
  ],
  "question": "Signature vs PIN vs 'no CVM required' — who or what decides which cardholder verification method applies to a given transaction?",
  "answer": "<p>The Cardholder Verification Method comes from a prioritized CVM list stored on the card itself, configured by the issuer, cross-referenced against what the terminal supports and the transaction amount — many schemes permit \"no CVM required\" under a small contactless floor limit. It isn't a terminal-side business decision made ad hoc; the terminal executes whichever CVM the card's list and the transaction context dictate, and reports back which one was actually used as part of the data sent to the issuer.</p>"
},
{
  "id": "and-b3-28",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Offline PIN vs online PIN — what's actually different about verification?",
  "difficulty": "Senior",
  "tags": [
    "PIN",
    "DUKPT",
    "PCI PTS",
    "Payments & POS Domain"
  ],
  "question": "Offline PIN vs online PIN — what's actually different about how the PIN gets verified in each case?",
  "answer": "<p>Offline PIN: the terminal encrypts the entered PIN and sends it to the card itself (contact chip, not typically contactless) for verification — the card compares it against its own stored reference and returns yes/no, no network round trip required. Online PIN: the terminal encrypts the PIN block, using a DUKPT-derived key from the certified PIN pad, and sends it all the way to the issuer as part of the authorization request — verification happens at the issuer, requiring the terminal to be online.</p>\n      <p>Either way, per PCI PTS, the PIN is encrypted at the point of entry by certified PIN pad hardware, and the general-purpose Android app never has access to the cleartext PIN — the same app/secure-core boundary as the earlier PIN entry security question, seen here from the terminal-protocol side.</p>"
},
{
  "id": "and-b3-29",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "What happens when a PIN pad detects physical tampering?",
  "difficulty": "Mid",
  "tags": [
    "PIN Pad",
    "Tamper Detection",
    "PCI PTS",
    "Payments & POS Domain"
  ],
  "question": "What happens if a certified PIN pad detects physical tampering — a drop, a pry attempt?",
  "answer": "<p>PCI PTS-certified PIN pads carry tamper-detection circuitry — mesh layers, sensors — that, on triggering, immediately and irreversibly zeroizes all cryptographic key material held in the device. The device is intentionally bricked from a crypto standpoint rather than risk continuing to operate with potentially compromised keys; recovery requires re-injection at a certified facility, sometimes physical device replacement. It's why a terminal that's been dropped hard or pried open sometimes keeps booting and running its OS fine, but simply refuses to process PIN debit anymore.</p>"
},
{
  "id": "and-b3-30",
  "category": "android",
  "categoryName": "Android",
  "topic": "Payments & POS Domain",
  "title": "Why is the OS itself part of what gets certified on an Android POS terminal, not just the app?",
  "difficulty": "Senior",
  "tags": [
    "POS OS",
    "Device Hardening",
    "PCI Certification",
    "Payments & POS Domain"
  ],
  "question": "On an Android-based POS terminal, why is the OS itself part of what gets certified and locked down, not just the payment app?",
  "answer": "<p>Android's own attack surface — sideloading, USB debugging, accessibility services, screen capture — sits directly adjacent to the payment app; a generic Android configuration would let a malicious sideloaded app attempt to read exported components, intercept Intents, or overlay the screen (tapjacking) during a transaction, regardless of how careful the payment app itself is.</p>\n      <p>Certified POS terminal OS builds are locked down as part of the terminal's overall PCI certification — no unauthorized app installation, no USB debugging in production mode, no unsigned OS updates, exported components disabled by policy. A secure payment app on top of an unlocked general-purpose OS isn't actually secure; the certification has to cover the whole stack.</p>"
}
);
