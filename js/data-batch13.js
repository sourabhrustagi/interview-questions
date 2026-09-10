// ==========================================================
// Interview Questions — Batch 13
// Two Project Mgmt topics relevant to consulting / TPM / EM roles:
//   - RFPs & Proposals: RFI/RFP/RFQ, estimating vague scope,
//     the technical solution section, assumptions/exclusions/
//     risks, pricing models, bid/no-bid, paid discovery, bid defense
//   - Quality Engineering: QA vs QC, shift-left, CI quality gates,
//     coverage as a metric, pyramid vs trophy, testing NFRs,
//     flaky tests systemically, quality ownership, quality metrics
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "pm-b13-01",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "RFI vs RFP vs RFQ — and the tech lead's role in responding.",
  "difficulty": "Senior",
  "tags": [
    "RFI",
    "RFP",
    "RFQ",
    "RFPs & Proposals"
  ],
  "question": "What's the difference between an RFI, RFP, and RFQ, and what's the engineering / tech-lead's role in responding to one?",
  "answer": "<p><strong>RFI</strong> (Request for Information) — early, exploratory: the client is gathering capabilities and shortlisting vendors, not yet buying. <strong>RFP</strong> (Request for Proposal) — the client has a defined problem and wants proposed solutions, approaches, timelines and pricing to compare. <strong>RFQ</strong> (Request for Quote) — the client knows exactly what they want and is comparing price on a well-specified scope.</p>\n      <p>The tech lead owns the technical solution narrative, the effort estimate and its assumptions, the delivery approach and team shape, and the technical risks with mitigations. The trap is treating it as a sales document and over-promising — your name is on the estimate you'll be held to, so the discipline is scoping tightly, stating assumptions explicitly, and being willing to say \"we'd need discovery to commit to that number.\"</p>"
},
{
  "id": "pm-b13-02",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "Estimating an RFP response when the requirements are deliberately vague.",
  "difficulty": "Senior",
  "tags": [
    "Estimation",
    "Assumptions",
    "RFPs & Proposals"
  ],
  "question": "How do you estimate effort for an RFP response when the requirements are deliberately vague or high-level?",
  "answer": "<p>You can't produce a precise number from a vague brief, and pretending otherwise is how projects go over. Instead:</p>\n      <ul>\n        <li>Break the scope into the features/capabilities you <em>can</em> infer, size each in a coarse bucket (S/M/L or a range), and roll up a range, not a point estimate.</li>\n        <li>State every assumption the estimate depends on explicitly — \"assumes an existing design system,\" \"assumes the client's API is documented and stable,\" \"assumes one target platform\" — so scope creep against those assumptions is a visible change, not an argument later.</li>\n        <li>Add an explicit contingency line scaled to the uncertainty, and be transparent that it's there.</li>\n        <li>Propose a paid discovery phase to convert the range into a commitment before the client asks you to commit to the low end of it.</li>\n      </ul>"
},
{
  "id": "pm-b13-03",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "The technical solution section of a proposal — what goes in, and how deep.",
  "difficulty": "Senior",
  "tags": [
    "Technical Proposal",
    "Solution Architecture",
    "RFPs & Proposals"
  ],
  "question": "What actually goes into the technical solution section of a proposal, and how detailed should it be?",
  "answer": "<p>Enough to show you understand the problem and have a credible, specific approach — not a full design doc. Typically: the proposed architecture at a component level (and <em>why</em> — the one or two decisions that matter, with the alternative you didn't pick), the tech stack with justification tied to the client's constraints (their team's skills, their existing infra, their compliance needs), the delivery approach (phasing, what ships first and why), the team composition and roles, integration points and dependencies on the client, and the testing/quality and release approach.</p>\n      <p>Depth calibration: deep enough that a technical evaluator on the client side believes you've done this before; shallow enough that you're not committing to design decisions you'd want discovery to validate. Name the risks and how you'd de-risk them — a proposal with zero acknowledged risk reads as naive.</p>"
},
{
  "id": "pm-b13-04",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "Assumptions, exclusions, dependencies and risks in a proposal.",
  "difficulty": "Senior",
  "tags": [
    "Assumptions",
    "Risk Management",
    "Scope",
    "RFPs & Proposals"
  ],
  "question": "How do you handle assumptions, exclusions, dependencies and risks in an RFP response, and why do they matter as much as the estimate?",
  "answer": "<p>They're the boundary of what you're committing to, and every dispute later traces back to one being unstated. Structure them explicitly:</p>\n      <ul>\n        <li><strong>Assumptions</strong> — conditions the estimate/plan depends on (\"client provides a staging environment by week 1,\" \"no more than 2 rounds of design revision per screen\").</li>\n        <li><strong>Exclusions</strong> — what's explicitly not in scope (\"content migration,\" \"third-party licence costs,\" \"post-launch support beyond 30 days\").</li>\n        <li><strong>Client dependencies</strong> — what you need from them and by when, with the impact if it slips.</li>\n        <li><strong>Risks</strong> — with likelihood, impact, and your mitigation/contingency for each.</li>\n      </ul>\n      <p>An assumption that turns out false becomes a change request against a documented baseline — not a \"you should have known\" argument. That's what protects both the margin and the relationship.</p>"
},
{
  "id": "pm-b13-05",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "Fixed-price vs T&M vs capped T&M — what do you propose and why?",
  "difficulty": "Senior",
  "tags": [
    "Fixed Price",
    "Time and Materials",
    "Contracts",
    "RFPs & Proposals"
  ],
  "question": "Fixed-price vs time-and-materials vs capped T&M in a proposal — how do you decide which to propose?",
  "answer": "<p><strong>Fixed-price</strong> transfers delivery risk to the vendor — appropriate only when scope is genuinely well-defined and stable; you price in a risk premium and manage change tightly, and the client gets budget certainty. <strong>T&M</strong> transfers risk to the client — appropriate for exploratory or evolving work; the client pays for what's actually done, but has no budget ceiling and must stay engaged in prioritization. <strong>Capped T&M</strong> (T&M with a not-to-exceed) splits the difference — the client gets a ceiling, the vendor gets paid for actual effort under it, and both are motivated to descope rather than blow the cap.</p>\n      <p>The signal to read: how well-defined is the scope, and how much is the client willing to stay involved? A client demanding fixed-price for a vague brief is asking you to price the risk of their indecision — either propose discovery first, or price the premium and expect a hard change-control conversation.</p>"
},
{
  "id": "pm-b13-06",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "The bid / no-bid decision.",
  "difficulty": "Senior",
  "tags": [
    "Bid Decision",
    "Pre-Sales",
    "RFPs & Proposals"
  ],
  "question": "How do you actually decide whether to bid on an RFP or decline it?",
  "answer": "<p>Bidding costs real senior time and, if you win a bad-fit engagement, far more. Evaluate:</p>\n      <ul>\n        <li><strong>Can we win?</strong> Is there an incumbent, a pre-wired favourite, or a relationship we lack? A \"compliance bid\" the client runs to satisfy procurement is a waste of everyone's time.</li>\n        <li><strong>Do we want it?</strong> Does it fit our capability and the kind of work we want to be known for, or is it a stretch we'd deliver badly?</li>\n        <li><strong>Is it deliverable?</strong> Is the timeline sane, the budget realistic for the scope, the client's expectations grounded? Red flags in the RFP itself (an impossible date, a fixed price on an undefined scope, a hostile contract) predict a painful delivery.</li>\n        <li><strong>Capacity</strong> — can we actually staff it with the people the proposal implies?</li>\n      </ul>\n      <p>A disciplined no-bid on a bad-fit RFP is a good outcome, not a failure.</p>"
},
{
  "id": "pm-b13-07",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "Proposing a paid discovery instead of a full fixed scope.",
  "difficulty": "Senior",
  "tags": [
    "Discovery",
    "Inception",
    "Estimation",
    "RFPs & Proposals"
  ],
  "question": "Why would you propose a paid discovery / inception phase rather than committing to a full fixed scope up front?",
  "answer": "<p>Because a fixed commitment on an under-specified problem forces you to either pad heavily (client overpays, you might lose the bid) or under-scope (you eat the overrun or fight change control the whole engagement). A short, paid discovery — typically a few weeks — produces the artifacts that let both sides commit with confidence: a validated backlog, a proven architecture direction, a de-risked estimate for the build, and often a working thin-slice prototype.</p>\n      <p>Framed to the client, it's risk reduction for <em>them</em>: they spend a small, bounded amount to replace a guess with a plan, and they get a real deliverable and an off-ramp if the numbers don't work. It also filters out clients who aren't serious enough to invest in getting the scope right.</p>"
},
{
  "id": "pm-b13-08",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "RFPs & Proposals",
  "title": "Defending your estimate and approach in an oral proposal / bid defense.",
  "difficulty": "Senior",
  "tags": [
    "Bid Defense",
    "Estimation",
    "Stakeholder Communication",
    "RFPs & Proposals"
  ],
  "question": "How do you defend your estimate and technical approach in an oral proposal or bid-defense session?",
  "answer": "<p>The evaluators are testing whether the proposal reflects real thinking or a template. Be ready to:</p>\n      <ul>\n        <li>Walk the estimate — show how it decomposes, which assumptions drive it, and where the uncertainty and contingency sit. \"It's X\" with no breakdown reads as a guess.</li>\n        <li>Defend the one or two architecture decisions that matter, including the option you rejected and why — and be willing to say \"we'd validate that in discovery\" rather than over-committing.</li>\n        <li>Answer \"what's the biggest risk?\" with a specific, uncomfortable answer and your mitigation — a candidate with no acknowledged risk is either inexperienced or hiding something.</li>\n        <li>Handle scope-reduction questions gracefully — \"if the budget were 30% lower, what would you cut and what would that cost you?\" — showing you think in trade-offs, not all-or-nothing.</li>\n      </ul>"
},
{
  "id": "pm-b13-09",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "QA vs QC vs testing — what's the actual distinction?",
  "difficulty": "Mid",
  "tags": [
    "QA",
    "Quality Control",
    "Testing",
    "Quality Engineering"
  ],
  "question": "QA vs QC vs testing — what's the actual distinction, and why does it matter how you frame it to a team?",
  "answer": "<p><strong>Quality Assurance</strong> is process-focused and preventive — building quality into how the team works: clear requirements, design review, definition of done, CI gates, coding standards. <strong>Quality Control</strong> is product-focused and detective — inspecting the built artifact for defects: running tests, exploratory testing, checking against acceptance criteria. <strong>Testing</strong> is one activity within QC.</p>\n      <p>Why the framing matters: a team that thinks \"quality = the QA team tests it at the end\" has QC with no QA, and defects are found late and expensively. Reframing quality as assurance — everyone's job, built in continuously — is the shift-left mindset, and it changes where you invest (better requirements and review, not just more test cases).</p>"
},
{
  "id": "pm-b13-10",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Shift-left testing — what it means concretely, and what it costs.",
  "difficulty": "Senior",
  "tags": [
    "Shift-Left",
    "TDD",
    "Prevention",
    "Quality Engineering"
  ],
  "question": "'Shift-left' testing — what does it mean concretely, and what does it actually cost?",
  "answer": "<p>Concretely: move quality activities earlier in the lifecycle. Test the requirement (is it testable? are the acceptance criteria clear?) before it's built. Write tests alongside or before the code (TDD). Run static analysis, linting and security scanning in the IDE and on every commit, not in a pre-release gate. Do design review before implementation. Involve QA in refinement, not just at the end.</p>\n      <p>The cost is real and worth stating: it front-loads effort (writing acceptance criteria and tests feels slower per story), it requires engineers to own testing rather than hand it off, and the payoff — cheaper defects, fewer late surprises — is diffuse and shows up as an absence of pain rather than a visible win, which makes it politically harder to sustain under deadline pressure.</p>"
},
{
  "id": "pm-b13-11",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Quality gates in a CI/CD pipeline — what belongs in one?",
  "difficulty": "Senior",
  "tags": [
    "CI/CD",
    "Quality Gate",
    "Static Analysis",
    "Quality Engineering"
  ],
  "question": "How do you define a quality gate in a CI/CD pipeline, and what actually belongs in it versus what doesn't?",
  "answer": "<p>A quality gate is an automated pass/fail checkpoint that blocks a change from proceeding. What belongs in it: compilation/build success, unit and fast integration tests passing, linting and static analysis with no new violations, a security/dependency scan with no new high-severity findings, and a coverage check on <em>new/changed</em> code (not the whole codebase). On merge to main, add the slower instrumented/e2e suite.</p>\n      <p>What doesn't belong: anything flaky (it trains the team to ignore or bypass the gate), anything that takes so long it stalls the pipeline (move it to a nightly or merge-gate stage), and subjective checks a machine can't reliably make. The gate must be trustworthy — a gate people routinely override or re-run until green is worse than no gate, because it launders a broken signal as a passing one.</p>"
},
{
  "id": "pm-b13-12",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Test coverage as a metric — why is 100% a bad target?",
  "difficulty": "Senior",
  "tags": [
    "Test Coverage",
    "Metrics",
    "Mutation Testing",
    "Quality Engineering"
  ],
  "question": "Test coverage as a metric — why is 100% coverage a bad target, and what's a better way to use coverage?",
  "answer": "<p>Coverage measures which lines executed during tests, not whether they were meaningfully asserted — you can hit 100% with tests that assert nothing. Chasing 100% produces low-value tests for trivial getters and generated code, tests that are brittle to refactor, and a false sense of safety. It also incentivizes gaming (asserting on implementation details just to touch a line).</p>\n      <p>Better use: treat coverage as a <em>floor on new code</em> (e.g. new/changed lines must be ≥80% covered, blocking a PR that adds untested logic) and as a <em>diagnostic</em> — a coverage report showing an entire critical module at 20% is a real signal worth acting on. But the target is \"the important behavior is tested,\" which coverage is a weak proxy for; mutation testing is a stronger (if more expensive) signal of test quality.</p>"
},
{
  "id": "pm-b13-13",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "The testing pyramid vs the testing trophy.",
  "difficulty": "Senior",
  "tags": [
    "Testing Pyramid",
    "Testing Trophy",
    "Test Strategy",
    "Quality Engineering"
  ],
  "question": "The testing pyramid vs the testing trophy — what does each say, and when does each apply?",
  "answer": "<p>The <strong>pyramid</strong> (many unit tests, fewer integration, few e2e) optimizes for speed and isolation — it fits backend services and libraries where units have clear contracts and integration points are limited.</p>\n      <p>The <strong>trophy</strong> (a bit of static analysis, some unit, <em>a lot</em> of integration, a few e2e) argues that for UI-heavy applications, integration tests — rendering a component with its real dependencies and asserting on user-visible behavior — catch the bugs that actually matter (wiring, data flow, state) while heavily-mocked unit tests often just test the mocks. It fits frontend and mobile UI work.</p>\n      <p>The real point of both: put your test effort where the risk and the bugs are for <em>your</em> system, and be suspicious of any test that only passes because of how it's mocked. Neither is a law.</p>"
},
{
  "id": "pm-b13-14",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Testing non-functional requirements — performance, reliability, security, accessibility.",
  "difficulty": "Senior",
  "tags": [
    "Non-Functional Requirements",
    "Performance Testing",
    "Security Testing",
    "Accessibility",
    "Quality Engineering"
  ],
  "question": "How do you actually test non-functional requirements — performance, reliability, security, accessibility — as opposed to just functional correctness?",
  "answer": "<ul>\n        <li><strong>Performance</strong> — define budgets (p95 latency, cold-start time, frame render time, bundle size), assert them in automated tests where possible, and load-test the critical paths; regressions in a budget fail the build.</li>\n        <li><strong>Reliability</strong> — chaos/fault-injection tests (kill a dependency, drop the network mid-flow), retry/timeout behavior tests, and monitoring the actual crash-free rate and error rate in production against an SLO.</li>\n        <li><strong>Security</strong> — SAST/DAST in the pipeline, dependency scanning, and periodic pen testing; treat a new high-severity finding as a build failure.</li>\n        <li><strong>Accessibility</strong> — automated checks (axe, Accessibility Scanner) in CI for the mechanical issues (labels, contrast, touch targets), plus manual screen-reader testing for the flow-level issues automation can't catch.</li>\n      </ul>\n      <p>The common failure is treating these as \"we'll get to it\" — bake each into the definition of done and the pipeline, or it doesn't happen.</p>"
},
{
  "id": "pm-b13-15",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Flaky tests as a systemic problem — how does a lead address it?",
  "difficulty": "Senior",
  "tags": [
    "Flaky Tests",
    "Test Reliability",
    "CI",
    "Quality Engineering"
  ],
  "question": "Flaky tests as a systemic problem — how do you address it as a lead, beyond fixing them one at a time?",
  "answer": "<p>One-off fixes lose to the rate of new flakiness. Systemic moves:</p>\n      <ul>\n        <li><strong>Measure it</strong> — track the flake rate (tests that pass on re-run without a code change) as a visible metric; you can't manage what you don't see.</li>\n        <li><strong>Quarantine, don't ignore</strong> — a flaky test is auto-moved to a non-blocking quarantine suite with an owner and a deadline; it's not just left failing in the main suite where people learn to re-run until green.</li>\n        <li><strong>Fix the causes, not the symptoms</strong> — the top causes are shared mutable state between tests, real time/network/animation dependencies, and missing synchronization; address the patterns, not each instance.</li>\n        <li><strong>Make green mean green</strong> — a routinely-overridden red build is a cultural problem; the flake rate has to be low enough that a red build is treated as real.</li>\n      </ul>"
},
{
  "id": "pm-b13-16",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "'Everyone owns quality' — making it real versus a slogan.",
  "difficulty": "Senior",
  "tags": [
    "Quality Ownership",
    "QA Strategy",
    "Team Culture",
    "Quality Engineering"
  ],
  "question": "How do you make 'everyone owns quality' actually real, rather than a slogan that means the QA team still catches everything at the end?",
  "answer": "<p>Slogans don't change behavior; structure and incentives do:</p>\n      <ul>\n        <li><strong>Engineers write and own the tests</strong> for their code, and a story isn't \"done\" without them — QA's job shifts to test strategy, exploratory testing, and hard-to-automate scenarios, not being the safety net for untested code.</li>\n        <li><strong>Bugs go back to the author</strong> to fix and to add the missing test, rather than to a bug-fix queue — the person who shipped it learns from it.</li>\n        <li><strong>Post-incident, ask what about the process let it through</strong>, blamelessly — and the action item is often a missing check, not \"be more careful.\"</li>\n        <li><strong>The team's DoD, quality gates and escaped-defect metric are visible and reviewed</strong> in retros, so quality is a shared, tracked concern, not an invisible one someone else handles.</li>\n      </ul>\n      <p>QA embedded in the team, pairing with engineers during development, makes this concrete far better than QA as a downstream gate.</p>"
},
{
  "id": "pm-b13-17",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Quality Engineering",
  "title": "Quality metrics that actually matter.",
  "difficulty": "Senior",
  "tags": [
    "Quality Metrics",
    "DORA",
    "Escaped Defects",
    "Quality Engineering"
  ],
  "question": "How do you measure software quality — which metrics actually matter, and which are vanity?",
  "answer": "<p>The ones worth tracking tie to outcomes:</p>\n      <ul>\n        <li><strong>Escaped defects</strong> — bugs found in production per release; the clearest measure of whether your process catches problems before users do.</li>\n        <li><strong>Change failure rate</strong> (DORA) — % of deploys causing a failure needing remediation.</li>\n        <li><strong>MTTR</strong> — how fast you recover when something does break; often more important than preventing every incident.</li>\n        <li><strong>Crash-free rate / error rate</strong> against an SLO — the user's actual experience of quality.</li>\n        <li><strong>Defect escape rate by stage</strong> — where in the pipeline bugs are caught, to see if shift-left is working.</li>\n      </ul>\n      <p>Vanity metrics: raw test count, raw coverage percentage, bugs closed per week (rewards churn), and \"quality score\" dashboards no one acts on. A metric that doesn't change a decision isn't worth tracking.</p>"
}
);
