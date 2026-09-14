// ==========================================================
// Chief Manager — Batch 18: Enterprise Mobile/Web/Microservices
// Engineering Manager JD gap fill
// Targets the specific bullets not yet covered by batches
// 14-16: native-vs-cross-platform mobile architecture at
// enterprise scale, architecture/code-review governance across
// many teams, API-first strategy and API management platform
// governance, sprint/release estimation discipline, risk and
// dependency management across concurrent projects, owning
// production support and release management, consistency
// across mobile/web/PWA channels on shared microservices, and
// a repeatable technical hiring bar for a 15-30 engineer org.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "cm-b18-01",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technical Leadership & Architecture Governance",
  "title": "Native vs cross-platform mobile — your actual decision framework at enterprise scale.",
  "difficulty": "Senior",
  "tags": [
    "Mobile Architecture",
    "Native vs Cross-Platform",
    "Chief Manager",
    "Technical Leadership & Architecture Governance"
  ],
  "question": "For an enterprise customer-facing mobile app, how do you decide between native (Android/iOS) and a cross-platform framework like Flutter or React Native?",
  "answer": "<p><strong>In plain English:</strong> BFSI stands for Banking, Financial Services, and Insurance &mdash; industries with especially strict security and compliance requirements.</p>\n      <p>The decision turns on three things more than framework popularity: how deep the app needs to reach into platform-specific capability (biometric/secure hardware, background processing, camera/AR, deep OS integration) &mdash; the deeper that need, the more native's direct platform access earns its cost; the team's actual composition (a team already strong in Kotlin/Swift gets little from a cross-platform rewrite; a small team needing one codebase for two platforms gets a lot); and the long-term performance/UX bar the product actually needs &mdash; a transaction-heavy BFSI app with strict security review requirements on both platforms is a different calculus than a content app where near-native feel is good enough.</p>\n      <p>The trap to name unprompted: choosing cross-platform purely for short-term velocity and discovering the exit cost later &mdash; once significant platform-specific logic (payment SDKs, biometric flows, hardware integrations) has been bridged through native modules on both platforms, the promised \"one codebase\" benefit erodes, and migrating off becomes a bigger project than either platform choice would have been up front. Decide with a 3-year view of the app's platform-integration depth, not the current sprint's velocity target.</p>"
},
{
  "id": "cm-b18-02",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technical Leadership & Architecture Governance",
  "title": "Reviewing architecture and code quality across multiple teams without becoming the bottleneck.",
  "difficulty": "Senior",
  "tags": [
    "Architecture Review",
    "Coding Standards",
    "Chief Manager",
    "Technical Leadership & Architecture Governance"
  ],
  "question": "You're accountable for architecture, code quality, security, scalability, and performance across several teams' codebases. How do you actually review all of that without personally becoming the approval bottleneck?",
  "answer": "<p><strong>In plain English:</strong> An ADR (Architecture Decision Record) is just a short written document capturing what technical decision was made and why, so the reasoning isn't lost later.</p>\n      <p>The lazy trap is trying to personally review everything &mdash; it doesn't scale past one team and makes you the critical path on every release. The actual mechanism is tiered: written architecture guidelines and coding standards that encode your judgment once (not re-litigated per PR), a lightweight architecture decision record (ADR) requirement for anything that changes a service boundary, a data model, or a cross-team contract &mdash; reviewed by you or a designated architect before build starts, not after &mdash; and delegated code-quality gates enforced by tooling (linting, static analysis, coverage thresholds, security scanning in CI) so routine quality is caught automatically, not by a human reading every diff.</p>\n      <p>Where you personally stay in the loop: high-blast-radius decisions (a new service boundary, a shared data contract, anything touching security or a regulated data flow) and periodic architecture health checks per team (not per PR) to catch drift before it compounds. The signal you're doing this right is that most weeks you're reviewing decisions, not diffs.</p>"
},
{
  "id": "cm-b18-03",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technical Leadership & Architecture Governance",
  "title": "Driving API-first development and API management across an enterprise portfolio.",
  "difficulty": "Senior",
  "tags": [
    "API-First",
    "API Governance",
    "API Management",
    "Chief Manager",
    "Technical Leadership & Architecture Governance"
  ],
  "question": "What does it actually mean to 'drive API-first development' across an organization, beyond just choosing REST or GraphQL for one service?",
  "answer": "<p><strong>In plain English:</strong> OpenAPI and a GraphQL schema are just formats for writing down an API's contract &mdash; what requests it accepts and what data it returns &mdash; so both sides can agree on it before anyone starts coding.</p>\n      <p>API-first means the API contract is designed and agreed before implementation starts &mdash; a schema (OpenAPI for REST, a GraphQL schema) is the artifact frontend, backend, and any partner/vendor consuming it align on, so mobile, web, and downstream teams can build against a mocked contract in parallel instead of waiting on a working backend. Getting an org to actually work this way, not just say it does, needs a contract-review step before a sprint starts, not a description written after the code already exists to satisfy documentation.</p>\n      <p>At portfolio scale this becomes a governance problem: consistent auth/versioning/error-shape conventions across every service (so a client doesn't have to learn a different dialect per team), a central API catalog or management platform so teams can discover and reuse an existing API instead of building a duplicate, and a deprecation policy with a real sunset timeline communicated to every consumer &mdash; without which \"API-first\" degrades into every team designing its own inconsistent contract independently, which is arguably worse than not having a policy at all.</p>"
},
{
  "id": "cm-b18-04",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Engineering & Delivery Management",
  "title": "Protecting delivery commitments through sprint and release planning across multiple squads.",
  "difficulty": "Senior",
  "tags": [
    "Sprint Planning",
    "Estimation",
    "Release Planning",
    "Chief Manager",
    "Engineering & Delivery Management"
  ],
  "question": "How do you run sprint planning, release planning, and estimation across multiple squads so that delivery commitments actually hold?",
  "answer": "<p><strong>In plain English:</strong> 'Story points' are a relative, made-up unit of effort (not hours) that a team uses to size work by comparing it to work they've already done; 'velocity' is how many of those points a team typically completes per sprint.</p>\n      <p>The estimate itself matters less than what backs it: relative sizing (story points) calibrated against the team's own historical velocity, not an absolute time guess &mdash; a new estimate is only credible once it's been checked against how this specific team actually performed on similarly-sized work before. Commitments made at the release level should be built up from squad-level sprint commitments with explicit buffer for the two things that reliably eat schedule &mdash; cross-squad dependencies and unplanned production support &mdash; rather than assuming a sprint's planned capacity is 100% available for new feature work.</p>\n      <p>The discipline that actually protects a delivery date: a mid-sprint checkpoint that surfaces slippage while there's still time to react (descope, re-sequence, or escalate), rather than discovering it at sprint review; and treating a missed estimate as a data point to recalibrate future planning with, not a one-off to explain away &mdash; a team whose retrospectives never touch estimation accuracy will keep missing the same way indefinitely.</p>"
},
{
  "id": "cm-b18-05",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Engineering & Delivery Management",
  "title": "Tracking risk and dependencies across several concurrent projects.",
  "difficulty": "Senior",
  "tags": [
    "Risk Management",
    "Dependency Management",
    "Chief Manager",
    "Engineering & Delivery Management"
  ],
  "question": "You're running several concurrent projects at once. How do you actually track risk and dependencies rather than discovering them when they've already slipped a date?",
  "answer": "<p><strong>In plain English:</strong> A 'risk register' is a living document listing things that could go wrong in a project, each with an owner and a pre-planned response. A 'dependency' is when one team's work can't proceed until another team delivers something first &mdash; and the key is mapping these explicitly so a slip in one project automatically flags every downstream commitment it affects.</p>\n      <p>A risk/dependency register only works if it's a live artifact reviewed on a fixed cadence, not a document written once at kickoff and forgotten &mdash; each entry needs an owner, a trigger condition, and a mitigation already decided before the risk materializes, not improvised in the moment. Cross-project dependencies (team A's API needed by team B's feature, a shared infrastructure change gating multiple releases) get mapped explicitly as a dependency, with the earlier project's slip automatically flagged against every downstream commitment that depends on it &mdash; not left for the downstream team to notice on their own.</p>\n      <p>The habit that separates a leader who catches risk early from one who doesn't: actively asking each squad lead \"what could make this slip\" as a standing agenda item, rather than waiting for someone to raise a blocker &mdash; most engineers under-report risk until it's already a problem, out of a reasonable instinct not to sound like they're making excuses early, so the leader has to create the space for it explicitly.</p>"
},
{
  "id": "cm-b18-06",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Engineering & Delivery Management",
  "title": "Owning production support and release management as an engineering leader.",
  "difficulty": "Senior",
  "tags": [
    "Production Support",
    "Release Management",
    "Chief Manager",
    "Engineering & Delivery Management"
  ],
  "question": "What does actually owning production support and release management look like at your level, versus leaving it entirely to an on-call rotation?",
  "answer": "<p><strong>In plain English:</strong> MTTR (Mean Time To Recovery) is the average time it takes a team to fix a problem once something breaks in production.</p>\n      <p>Owning it means the on-call/incident process exists as a designed system &mdash; clear severity definitions, an escalation path that doesn't dead-end on one person, a defined hotfix release path that's faster than the normal release train but still passes through real (if abbreviated) testing and approval, and a blameless postmortem practice that actually produces follow-up action items which get prioritized, not just documented and shelved. Without that design, \"production support\" quietly becomes whichever engineer happens to be reachable at 2am improvising a fix.</p>\n      <p>The leadership-level responsibility beyond the mechanics: tracking incident trends over time (is MTTR improving, is the same class of failure recurring) and using that data to justify investment in the reliability work that prevents the next incident &mdash; rather than treating each incident as an isolated fire to put out and move past. A leader who can't say whether this quarter's incidents were better or worse than last quarter's isn't actually owning production support, just reacting to it.</p>"
},
{
  "id": "cm-b18-07",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technical Leadership & Architecture Governance",
  "title": "Keeping mobile, web, and PWA channels consistent on top of shared microservices.",
  "difficulty": "Senior",
  "tags": [
    "Multi-Channel Architecture",
    "Consistency",
    "Chief Manager",
    "Technical Leadership & Architecture Governance"
  ],
  "question": "Native mobile apps, a web app, and a PWA all sit on the same backend microservices. How do you keep them architecturally consistent instead of quietly diverging?",
  "answer": "<p><strong>In plain English:</strong> A BFF (Backend for Frontend) is a dedicated backend layer built specifically for one type of client, like mobile or web, shaped to exactly what that client needs.</p>\n      <p>Divergence usually starts small and compounds &mdash; one channel team adds a client-side workaround for a backend inconsistency instead of raising it, another builds its own version of shared logic (session handling, offline caching, retry policy) because coordinating with the other channel felt slower than just building it again. The structural fix is a shared client SDK or contract layer (a generated client from the OpenAPI/GraphQL schema, a shared design-token and validation-rule set) that every channel consumes rather than reimplements, so a backend or business-rule change propagates once instead of needing three separate teams to remember to update independently.</p>\n      <p>Where a BFF (backend-for-frontend) layer helps here specifically: it lets each channel get a shape suited to its constraints (a mobile client's bandwidth/battery profile is genuinely different from a desktop web client's) without each channel diverging on the underlying business logic itself &mdash; the BFF adapts presentation, not the rules. The governance habit that actually prevents drift: a recurring cross-channel architecture sync where a change proposed by one channel team is checked against the others before it ships, not after a user notices the web and mobile apps behave differently for the same action.</p>"
},
{
  "id": "cm-b18-08",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "People Management",
  "title": "Designing a repeatable technical hiring bar to scale a 15-30 engineer org.",
  "difficulty": "Senior",
  "tags": [
    "Hiring",
    "Interview Process",
    "Team Scaling",
    "Chief Manager",
    "People Management"
  ],
  "question": "You need to scale an engineering org from a handful of engineers to 15-30 across developers, leads, architects, and QA. How do you design a hiring bar and process that stays consistent as you scale, rather than depending on whoever happens to be interviewing that week?",
  "answer": "<p><strong>In plain English:</strong> A 'hiring bar' is the written standard of what 'good enough to hire' looks like for each role level &mdash; defined in specific, assessable terms rather than vague phrases like 'strong problem solver.' The challenge is keeping that bar consistent as more people join the interview process.</p>\n      <p>A consistent bar starts with writing down, per role level, what \"good\" actually looks like in concrete, assessable terms (not \"strong problem solver\" but specific signal: can this candidate reason about a system's failure modes, not just its happy path; can a lead-level candidate explain a trade-off they got wrong and what they'd do differently) &mdash; and structuring each interview round around a specific competency rather than letting every interviewer freelance the same general \"tell me about yourself\" conversation.</p>\n      <p>The mechanism that actually holds the bar steady as more people interview: a calibration step where interviewer feedback is compared against the written bar before a decision, and new interviewers shadow calibrated ones before running loops solo &mdash; without it, the bar silently drifts per-interviewer, and six months in you have a team whose quality varies by who happened to interview them. Equally important and often skipped: designing the onboarding and ramp-up plan alongside the hiring bar, since a strong hire who ramps slowly because there's no structured onboarding looks, from the business's perspective, indistinguishable from a weak hire.</p>"
}
);
