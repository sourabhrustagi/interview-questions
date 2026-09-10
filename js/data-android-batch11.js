// ==========================================================
// Android Interview Questions — Batch 11
// Secure Client-Server Communication: encrypting and
// decrypting data passed between an Android app and a web
// backend — payload vs transport encryption, hybrid
// (RSA + AES-GCM) encryption, key exchange & forward secrecy,
// nonce discipline, HMAC vs encryption, replay prevention,
// and common crypto mistakes.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "and-b11-01",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "HTTPS is already in use — when and why add application-layer encryption on top?",
  "difficulty": "Senior",
  "tags": [
    "TLS",
    "Payload Encryption",
    "Defense in Depth",
    "Secure Client-Server Communication"
  ],
  "question": "You need to send sensitive data from an Android app to your backend, and HTTPS is already in place. When and why would you add application-layer (payload) encryption on top of TLS?",
  "answer": "<p>TLS encrypts the transport, but it terminates wherever your TLS endpoint is — often a CDN, load balancer, or API gateway, not your actual application server. Everything between that termination point and your app logic (internal load balancers, logging proxies, a compromised internal segment, an over-permissioned engineer reading traffic dumps) sees plaintext.</p>\n      <p>Application-layer encryption keeps the data ciphertext until it reaches code that actually holds the decryption key — genuine defense in depth — and it's the only way to get true end-to-end confidentiality where even your own servers shouldn't be able to read the contents. The cost: real key-management complexity, and you must not roll your own — use a vetted construction (AES-GCM plus an authenticated key exchange), because a naive hand-built scheme is usually weaker than plain TLS.</p>"
},
{
  "id": "and-b11-02",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Hybrid encryption for an Android → server payload — why not just RSA or just AES?",
  "difficulty": "Senior",
  "tags": [
    "Hybrid Encryption",
    "RSA",
    "AES",
    "Secure Client-Server Communication"
  ],
  "question": "Walk through hybrid encryption for a payload sent from an Android app to your server. Why not just use RSA, or just AES?",
  "answer": "<p>RSA (asymmetric) can only encrypt small amounts of data — bounded by key size minus padding, a few hundred bytes for RSA-2048 — and is slow. AES (symmetric) is fast and handles any size, but both sides need the same key, and you cannot safely ship a static AES key inside an APK (it's extractable with <code>strings</code> or a hooking framework).</p>\n      <p>Hybrid encryption combines them: generate a fresh random AES-256 key per request (or per session), encrypt the actual payload with AES-GCM, then encrypt just that small AES key with the server's RSA or EC <em>public</em> key — which is safe to bundle in the app. Send both. The server decrypts the AES key with its private key, then decrypts the payload. You get AES's speed and size flexibility plus asymmetric crypto's no-shared-secret key distribution.</p>"
},
{
  "id": "and-b11-03",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Implement hybrid encryption of a request payload on Android.",
  "difficulty": "Senior",
  "tags": [
    "AES-GCM",
    "RSA-OAEP",
    "Code",
    "Secure Client-Server Communication"
  ],
  "question": "Show how you'd hybrid-encrypt a request body on Android — AES-GCM for the payload, the server's RSA public key to wrap the AES key.",
  "answer": "<p>Generate a per-request AES key and a fresh 12-byte nonce, encrypt the payload with AES-256-GCM, then RSA-OAEP-wrap the AES key with the server's bundled (and pinned) public key. Transmit the wrapped key, the nonce, and the ciphertext (the GCM tag is appended to the ciphertext by the JCE provider). Nothing here is secret except the AES key, which never leaves the device in the clear.</p>",
  "codeLanguage": "kotlin",
  "code": "fun hybridEncrypt(plaintext: ByteArray, serverPublicKey: PublicKey): EncryptedEnvelope {\n    // 1. Fresh symmetric key + nonce, per request\n    val aesKey = KeyGenerator.getInstance(\"AES\").apply { init(256) }.generateKey()\n    val nonce = ByteArray(12).also { SecureRandom().nextBytes(it) }\n\n    // 2. Encrypt the payload with AES-256-GCM (authenticated)\n    val gcm = Cipher.getInstance(\"AES/GCM/NoPadding\")\n    gcm.init(Cipher.ENCRYPT_MODE, aesKey, GCMParameterSpec(128, nonce))\n    val ciphertext = gcm.doFinal(plaintext)   // GCM tag appended automatically\n\n    // 3. Wrap the AES key with the server's public key (RSA-OAEP)\n    val rsa = Cipher.getInstance(\"RSA/ECB/OAEPWithSHA-256AndMGF1Padding\")\n    rsa.init(Cipher.ENCRYPT_MODE, serverPublicKey)\n    val wrappedKey = rsa.doFinal(aesKey.encoded)\n\n    return EncryptedEnvelope(\n        wrappedKey = wrappedKey.encodeBase64(),\n        nonce = nonce.encodeBase64(),\n        ciphertext = ciphertext.encodeBase64()\n    )\n}"
},
{
  "id": "and-b11-04",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Why must AES-GCM use a unique nonce per message, and what breaks on reuse?",
  "difficulty": "Senior",
  "tags": [
    "AES-GCM",
    "Nonce",
    "IV",
    "Secure Client-Server Communication"
  ],
  "question": "Why does AES-GCM require a unique IV/nonce per message, and what specifically breaks if you reuse one with the same key?",
  "answer": "<p>GCM's security depends on the (key, nonce) pair never repeating. Two failures on reuse:</p>\n      <ul>\n        <li>An attacker who captures two ciphertexts encrypted with the same key and nonce can XOR them to recover the XOR of the two plaintexts — the keystream cancels out.</li>\n        <li>Worse for GCM specifically: nonce reuse leaks the GCM authentication subkey (H), which lets an attacker forge valid authentication tags for arbitrary messages — completely defeating the integrity guarantee, not just confidentiality.</li>\n      </ul>\n      <p>Generate a fresh 12-byte random nonce (or a strictly-never-repeating counter) per encryption, and send it alongside the ciphertext — it isn't secret, it just has to be unique.</p>"
},
{
  "id": "and-b11-05",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "How do client and server agree on a key with no pre-shared secret — and what is forward secrecy here?",
  "difficulty": "Senior",
  "tags": [
    "ECDH",
    "Key Exchange",
    "Forward Secrecy",
    "Secure Client-Server Communication"
  ],
  "question": "How does the Android client and the server agree on an encryption key without a pre-shared secret, and what does perfect forward secrecy mean in this context?",
  "answer": "<p>Two common approaches:</p>\n      <ul>\n        <li><strong>Public-key wrapping:</strong> the app bundles the server's long-lived public key and uses it to wrap a per-request symmetric key. Simple — but if the server's private key is ever compromised, every past captured request can be decrypted. No forward secrecy.</li>\n        <li><strong>Ephemeral ECDH:</strong> client and server each generate an ephemeral key pair per session, exchange public keys (the server's signed by its long-lived identity key so a MITM can't substitute one), and independently derive the same shared secret. Because the ephemeral keys are discarded after the session, later compromise of the long-lived key doesn't decrypt past sessions — that's perfect forward secrecy.</li>\n      </ul>\n      <p>Ephemeral ECDH is exactly what TLS 1.3 does under the hood; re-implementing it at the app layer is only worth it for a genuine end-to-end requirement TLS can't satisfy.</p>"
},
{
  "id": "and-b11-06",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Where should the client's private key and the server's public key live on Android?",
  "difficulty": "Senior",
  "tags": [
    "Android Keystore",
    "Key Storage",
    "Key Pinning",
    "Secure Client-Server Communication"
  ],
  "question": "Where should the client's private key (if any) and the server's public key actually live on Android, and what should never happen?",
  "answer": "<p>The client's private key belongs in the <strong>Android Keystore</strong> — generated there so the raw key material never enters app memory or storage and can't be extracted even on a rooted device; the app gets a handle to perform operations, not the key bytes.</p>\n      <p>The server's public key isn't secret and can be bundled as an app resource — but <strong>pin it</strong> (compare against a known value at runtime) so a tampered APK or a MITM can't substitute an attacker's public key.</p>\n      <p>What must never happen: hardcoding a symmetric key or a private key as a string constant in code or a resource. R8/ProGuard obfuscation does not hide it — anyone can <code>strings</code> the APK or hook the decryption call with Frida.</p>"
},
{
  "id": "and-b11-07",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "HMAC / request signing vs full payload encryption — when do you want which?",
  "difficulty": "Senior",
  "tags": [
    "HMAC",
    "Request Signing",
    "Authenticated Encryption",
    "Secure Client-Server Communication"
  ],
  "question": "HMAC / request signing vs full payload encryption — when do you want each, and what's the common mistake?",
  "answer": "<p>Encryption protects <em>confidentiality</em> — nobody can read it. An HMAC (or an asymmetric signature) protects <em>integrity and authenticity</em> — nobody can tamper with it or forge it — without hiding the contents.</p>\n      <p>If the data isn't secret but you need to guarantee it came from your app unmodified — API request signing to prevent tampering and replay, webhook verification — an HMAC over (body + method + path + timestamp), keyed by a shared secret, is lighter and sufficient. If the data is sensitive, you need encryption — and specifically <em>authenticated</em> encryption (AES-GCM), which gives you confidentiality and integrity in one operation.</p>\n      <p>The common mistake: encrypting with an unauthenticated mode (AES-CBC with no MAC) and assuming the ciphertext can't be tampered with. It can — bit-flipping and padding-oracle attacks are real. Always use an authenticated mode, or encrypt-then-MAC.</p>"
},
{
  "id": "and-b11-08",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Replay attacks against an encrypted API — how do you prevent them?",
  "difficulty": "Senior",
  "tags": [
    "Replay Attack",
    "Nonce",
    "Timestamp",
    "Secure Client-Server Communication"
  ],
  "question": "What's a replay attack against your encrypted API, and how do you prevent it, given encryption alone doesn't stop it?",
  "answer": "<p>An attacker captures a valid encrypted request — they can't read it, but they can resend it byte-for-byte — and replays it, e.g. replaying a \"transfer funds\" request ten times. Encryption doesn't help because the replayed ciphertext is still perfectly valid.</p>\n      <p>Prevention: include a <strong>nonce and a timestamp inside the encrypted, authenticated payload</strong>. The server rejects any request whose timestamp is outside a small window (a few minutes, allowing for clock skew) and rejects any nonce it has already seen within that window (a short-lived server-side cache of seen nonces). For operations where a duplicate is especially costly, an idempotency key is the complementary defense — the same mechanism covered in the payments section.</p>"
},
{
  "id": "and-b11-09",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Common mistakes when adding payload encryption between Android and a backend.",
  "difficulty": "Senior",
  "tags": [
    "Crypto Mistakes",
    "ECB",
    "Logging",
    "Secure Client-Server Communication"
  ],
  "question": "What are the common mistakes engineers make when adding payload encryption between an Android app and a backend?",
  "answer": "<ul>\n        <li>Hardcoding a symmetric key or private key in the APK — extractable; obfuscation doesn't help.</li>\n        <li>AES in ECB mode — identical plaintext blocks produce identical ciphertext blocks, leaking structure (the famous \"ECB penguin\").</li>\n        <li>A static or predictable IV — weakens CBC and catastrophically breaks GCM.</li>\n        <li>Unauthenticated encryption (CBC with no MAC) — vulnerable to tampering and padding-oracle attacks. Use GCM.</li>\n        <li>Rolling a custom key-exchange or \"encryption\" scheme instead of a standard construction.</li>\n        <li>Encrypting the payload but logging the plaintext request/response for \"debugging\" — an OkHttp logging interceptor at BODY level in a release build, or a crash reporter attaching request bodies.</li>\n        <li>Not pinning the server's public key, so a MITM can substitute their own.</li>\n      </ul>"
},
{
  "id": "and-b11-10",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Decrypting a server response on the client — and knowing it's genuinely from your server.",
  "difficulty": "Senior",
  "tags": [
    "Response Decryption",
    "GCM Tag",
    "Authentication",
    "Secure Client-Server Communication"
  ],
  "question": "How do you decrypt a server response on the Android client, and how does the client know the response genuinely came from your server?",
  "answer": "<p>In a hybrid-per-request scheme, the server encrypts its response with the same AES session key the client generated and kept — so the client decrypts with that key. With ephemeral ECDH, the derived shared secret plays the same role.</p>\n      <p>Authenticity comes for free from AES-GCM's authentication tag: a valid tag proves the response wasn't altered in transit <em>and</em> that whoever produced it held the session key. Since that key was only ever delivered to your server (RSA-wrapped to its public key, or ECDH-derived with its authenticated identity), a valid tag means the response came from your server. The GCM tag is doing double duty — integrity plus implicit authentication.</p>"
},
{
  "id": "and-b11-11",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Field-level encryption vs whole-payload encryption — when is field-level worth it?",
  "difficulty": "Mid",
  "tags": [
    "Field-Level Encryption",
    "PCI",
    "Secure Client-Server Communication"
  ],
  "question": "Field-level encryption vs encrypting the whole payload — when is the extra complexity of field-level encryption actually worth it?",
  "answer": "<p>Whole-payload encryption is simpler and hides everything, including the request's structure. Field-level encryption — encrypting only specific values (a card number, an SSN) while leaving the rest of the JSON readable — is worth it when:</p>\n      <ul>\n        <li>Intermediate systems legitimately need the non-sensitive fields — an API gateway that logs request metadata, a message queue that partitions by a non-sensitive key.</li>\n        <li>Different fields have different retention or access policies — the encrypted card number goes to a PCI-scoped vault, the rest to normal storage.</li>\n      </ul>\n      <p>It's more complex — per-field nonces, a schema of which fields are encrypted, key rotation touching many fields — so use it only when something in the middle genuinely must read part of the payload.</p>"
},
{
  "id": "and-b11-12",
  "category": "android",
  "categoryName": "Android",
  "topic": "Secure Client-Server Communication",
  "title": "Certificate pinning and payload encryption — do you need both?",
  "difficulty": "Mid",
  "tags": [
    "Certificate Pinning",
    "Defense in Depth",
    "Secure Client-Server Communication"
  ],
  "question": "Certificate pinning and payload encryption — do you need both, or does one make the other redundant?",
  "answer": "<p>They defend different things. Pinning stops a MITM with a fraudulently-issued but CA-valid certificate from reading or altering your TLS traffic — it hardens the transport. Payload encryption protects the data <em>after</em> TLS terminates (at your CDN or gateway) and provides end-to-end confidentiality all the way to your application code.</p>\n      <p>For a high-security app you typically want both: pinning as cheap, high-value transport hardening (cross-reference the certificate-pinning question in the Security &amp; Hardening section for the SPKI-pinning and rotation details), and payload encryption for the sensitive subset of data that must stay ciphertext until it reaches code holding the key. Neither replaces the other.</p>"
}
);
