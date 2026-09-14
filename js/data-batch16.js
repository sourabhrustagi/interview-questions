// ==========================================================
// Chief Manager — Batch 16: Technology Strategy & Business
// Acumen + more Behavioral (Strategy & Execution)
// Researched against real CTO/Engineering-Manager interview
// question banks to fill genuine gaps: ROI evaluation, build
// vs buy, vendor negotiation, budget defense, board
// communication, multi-year roadmapping, legacy migration
// decisions, plus classic behavioral prompts not yet covered
// (a real failure, career-growth mechanics, competing
// stakeholder priorities, saying no, a peer-level technical
// disagreement).
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "cm-b16-01",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Evaluating ROI on a technology investment that isn't purely revenue.",
  "difficulty": "Senior",
  "tags": [
    "ROI",
    "Technology Investment",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "How do you evaluate ROI on a technology investment, especially one whose payoff isn't purely revenue — a platform rewrite, an observability investment, paying down infrastructure debt?",
  "answer": "<p><strong>In plain English:</strong> ROI (Return on Investment) is a way of asking 'was this worth the money and time put into it?' &mdash; usually by comparing what something cost against the value or savings it produced.</p>\n      <p>Translate the technical benefit into a business-legible cost it avoids or a capability it unlocks, rather than defending the work in purely technical terms. A platform rewrite's ROI is rarely \"cleaner code\" — it's \"we currently lose N engineer-days a month to this system's fragility, and every new feature here takes 2x longer than it should,\" both of which are real, quantifiable costs. An observability investment's ROI is \"our mean time to detect a production issue is currently X, and every hour of undetected degradation costs roughly Y in churn/support load.\"</p>\n      <p>Where the payoff is genuinely hard to quantify upfront, be honest about that rather than inventing a fake number to satisfy the format — name the qualitative risk being reduced (a security exposure, a single point of failure, a compliance gap) and the cost of inaction if it materializes, and let the decision-maker weigh a real risk against a real cost rather than presenting a spreadsheet number that looks precise but isn't.</p>"
},
{
  "id": "cm-b16-02",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Build vs buy — your actual decision framework.",
  "difficulty": "Senior",
  "tags": [
    "Build vs Buy",
    "Vendor Strategy",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "Build vs buy — walk through your actual decision framework, not just the general principle.",
  "answer": "<p><strong>In plain English:</strong> 'Total cost of ownership' (TCO) means the real, full cost of something over time &mdash; not just the sticker price, but also the ongoing cost of maintaining, running, and supporting it for years afterward.</p>\n      <p>A workable framework weighs four things explicitly rather than defaulting to instinct: is this capability core to the competitive differentiation of the product, or commodity infrastructure everyone needs (build the former, buy the latter); what's the real time-to-market difference, since a 6-month build for something a vendor delivers in weeks has a real opportunity cost; the honest 3-year total cost of ownership for build (including the ongoing maintenance burden, which teams systematically underestimate at decision time) versus the vendor's pricing at your actual future scale, not just today's usage tier; and the lock-in risk and exit cost of the buy option — can you actually leave if the vendor's pricing or reliability degrades, or does the integration depth make you hostage to them.</p>\n      <p>A concrete example is worth having ready: buying an authentication/identity provider almost always beats building one — commodity, high compliance burden, not a differentiator — while building the core domain logic that actually makes your product different is almost always worth owning, even if a vendor could technically do a rough version of it.</p>"
},
{
  "id": "cm-b16-03",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Negotiating a vendor/SaaS contract — what you protect beyond price.",
  "difficulty": "Senior",
  "tags": [
    "Vendor Negotiation",
    "Contracts",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "How do you negotiate with a vendor or SaaS provider, and what do you actually protect for in the contract beyond the headline price?",
  "answer": "<p><strong>In plain English:</strong> SaaS (Software as a Service) means software you rent and access over the internet rather than install and run yourself. An SLA (Service Level Agreement) is the contractual promise a vendor makes about things like uptime, with penalties if they fail to deliver it.</p>\n      <p>Price matters, but the terms that actually bite later are usually elsewhere: data portability and exit terms (can you actually get your data out in a usable format if you leave, and how long does that take), pricing at your projected scale two to three years out rather than the pilot-tier price you're quoted at signing, SLA terms with real financial teeth (a credit that matters to the vendor, not a token gesture), and security/compliance commitments in writing if you're in a regulated industry, since a verbal assurance from a sales rep is worth nothing during an audit.</p>\n      <p>The negotiating leverage worth using deliberately: multi-year commitments in exchange for price locks (protects you from a surprise renewal hike), and a genuine walk-away alternative — a vendor negotiation where you have no real alternative and they know it rarely gets you good terms, so knowing your actual build-or-switch alternative before you sit down is part of the preparation, not just a bluff.</p>"
},
{
  "id": "cm-b16-04",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Building and defending an engineering budget to non-technical executives.",
  "difficulty": "Senior",
  "tags": [
    "Budgeting",
    "Executive Communication",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "How do you build and defend an engineering budget to non-technical executives?",
  "answer": "<p><strong>In plain English:</strong> An 'engineering budget' is the money allocated for engineering salaries, tools, and infrastructure. Defending it to non-technical executives means translating technical needs into business outcomes they can evaluate &mdash; not 'we need a better platform,' but 'this investment reduces the checkout failures costing us X% of transactions.'</p>\n      <p>Structure the budget around business outcomes it enables, not the internal categories engineers think in — \"platform reliability\" is a harder sell than \"reducing the checkout failures that are costing us N% of transactions,\" even if they're the same underlying work. Separate run-the-business spend (keeping the lights on — this should be relatively stable and easy to justify with uptime/incident data) from grow-the-business spend (new capability, genuinely competitive for budget against other departments' asks) — conflating the two makes both harder to defend.</p>\n      <p>Come with a small number of real tradeoffs, not a single number to approve — \"at this budget we ship A and B; at 20% more we also get C, which reduces churn risk in this specific segment\" gives executives an actual decision to make rather than a yes/no on a black box. And track and report back against what was promised in the prior cycle — a leader whose past budget asks demonstrably delivered what they said gets more trust and less scrutiny on the next ask.</p>"
},
{
  "id": "cm-b16-05",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Communicating technical risk to a board or non-technical leadership.",
  "difficulty": "Senior",
  "tags": [
    "Board Communication",
    "Risk Communication",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "How do you communicate technical risk or strategy to a board or non-technical leadership audience?",
  "answer": "<p><strong>In plain English:</strong> A CVE is a publicly catalogued, known security vulnerability in a piece of software &mdash; this question is about explaining that kind of technical risk to people who aren't engineers.</p>\n      <p>Translate risk into business terms and a concrete probability/impact framing, not technical severity jargon — \"a critical CVE in a library we use\" means nothing to a board; \"there's a known vulnerability in a system handling customer payment data; here's our patch timeline and what happens if we don't hit it\" is legible and actionable. Lead with the decision you need from them, if any, rather than a status report — a board's time is for decisions and material risk, not a full technical debrief.</p>\n      <p>Use a small number of consistent metrics tracked over time (not a different slide of stats every quarter) so trend and material change are visible at a glance, and be honest and calibrated about uncertainty rather than false precision — \"we estimate 70-80% confidence this ships by Q3\" is more credible over time than an exact date that consistently slips, since credibility with a board is built cycle over cycle, not in one good presentation.</p>"
},
{
  "id": "cm-b16-06",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Setting a 3-year technology roadmap when the business strategy itself is still evolving.",
  "difficulty": "Senior",
  "tags": [
    "Technology Roadmap",
    "Strategic Planning",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "How do you set a multi-year technology roadmap when the business itself is still figuring out its own strategy?",
  "answer": "<p><strong>In plain English:</strong> A 'technology roadmap' is a plan laying out what technology investments the team will make over the coming years. The challenge is that when a business is still figuring out its own strategy, a detailed 3-year plan is unreliable &mdash; so the answer is splitting into a committed near-term and a directional, flexible long-term plan.</p>\n      <p>Don't fake false precision on a 3-year roadmap when the business context will genuinely change — instead, split it into a committed near-term (the next 2-3 quarters, specific and accountable) and a directional long-term (principles and capability bets, explicitly labeled as subject to revision, not a fixed feature list). The long-term part should describe architectural and capability investments that remain valuable across multiple plausible business directions — better observability, a more modular platform, stronger data infrastructure — rather than betting the whole roadmap on one specific business outcome that might not materialize.</p>\n      <p>Build in an explicit re-planning cadence (quarterly or twice-yearly) rather than treating \"the roadmap\" as a document written once and defended forever — a roadmap that never changes in a business whose strategy is still evolving is either lying about its own certainty or quietly ignoring new information, neither of which is good technology leadership.</p>"
},
{
  "id": "cm-b16-07",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Technology Strategy & Business Acumen",
  "title": "Evaluating whether to migrate off a long-standing legacy vendor or platform.",
  "difficulty": "Senior",
  "tags": [
    "Legacy Migration",
    "Vendor Risk",
    "Chief Manager",
    "Technology Strategy & Business Acumen"
  ],
  "question": "Describe how you'd evaluate whether to migrate off a legacy vendor or platform your company has depended on for years.",
  "answer": "<p><strong>In plain English:</strong> 'Legacy' here just means an old, established system the business has relied on for years. The 'strangler pattern' mentioned below means gradually replacing that old system piece by piece instead of switching everything over at once.</p>\n      <p>Separate the emotional case (\"it's old, it's ugly\") from the actual business case — a legacy system that's stable, well-understood, and cheap to run is not automatically worth migrating off just because it's unfashionable; migration itself carries real risk and cost that has to be justified against a genuine, named problem: rising vendor cost at renewal, a hard capability ceiling blocking a real business need, mounting security/compliance exposure, or a shrinking pool of people who can actually support it.</p>\n      <p>If migration is justified, plan it as an incremental strangler-pattern cutover (the same principle as the earlier digital-transformation answer) rather than a big-bang replacement, and be explicit about the fallback plan if the new platform underdelivers — a migration with no rollback path turns a bad vendor choice into an existential risk instead of a recoverable mistake.</p>"
},
{
  "id": "cm-b16-08",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Behavioral — Strategy & Execution",
  "title": "A significant failure or mistake as a leader, and what you learned.",
  "difficulty": "Senior",
  "tags": [
    "Failure",
    "Self-Awareness",
    "Chief Manager",
    "Behavioral — Strategy & Execution"
  ],
  "question": "Tell me about a time you failed or made a significant mistake as a leader. What did you learn?",
  "answer": "<p><strong>In plain English:</strong> This question tests self-awareness and honesty. The interviewer is looking for a genuine failure that was actually your fault &mdash; a real decision you got wrong with real consequences &mdash; not a disguised brag ('I was too hardworking') or an external event you couldn't control.</p>\n      <p>The single biggest tell in this answer is whether the failure named is genuinely yours, at genuine stakes — \"I delegated too much and something slipped through\" as a disguised brag is instantly recognizable to an experienced interviewer, and reads as an inability or unwillingness to be honestly self-critical, which is itself a leadership red flag.</p>\n      <p>Structure it with real content: what you actually got wrong (a decision, not just an outcome outside your control — \"the market changed\" isn't a leadership failure, \"I didn't build in a checkpoint to catch that the market was changing\" might be), the actual consequence, and — most important — a concrete, specific change you made afterward that you can point to as evidence the lesson stuck, not just \"I learned to communicate more.\" A leader with no real failure story either hasn't taken enough risk to have one, or isn't being honest in the interview — both read badly.</p>"
},
{
  "id": "cm-b16-09",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Behavioral — Strategy & Execution",
  "title": "How you manage your team's career growth, concretely.",
  "difficulty": "Mid",
  "tags": [
    "Career Development",
    "Growth Planning",
    "Chief Manager",
    "Behavioral — Strategy & Execution"
  ],
  "question": "How do you manage your team's career growth — not the philosophy, the actual mechanics?",
  "answer": "<p><strong>In plain English:</strong> This question asks for the actual mechanics of how you develop people &mdash; not a vague 'I care about growth' but concrete practices: regular dedicated growth conversations, written criteria for the next level, and stretch opportunities matched to what each person specifically wants to grow into.</p>\n      <p>Name the real mechanics, not just \"I care about my people's growth\": a documented individual growth conversation on a real cadence (not just folded into a generic 1:1 with no dedicated space for it), explicit next-level criteria the person actually knows and can work toward (not a mystery only you hold), and stretch opportunities matched to what someone specifically wants to grow into — a project, a cross-team initiative, ownership of a decision — not just \"more of the same work, but harder.\"</p>\n      <p>The honest, harder-to-fake detail: growth conversations sometimes reveal what someone wants isn't available on your team or even at your company, and handling that honestly — helping someone find that path even if it means eventually losing them — is a better answer than pretending every growth conversation ends with a promotion on your team, which isn't realistic for most.</p>"
},
{
  "id": "cm-b16-10",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Behavioral — Strategy & Execution",
  "title": "Aligning competing priorities from multiple business stakeholders.",
  "difficulty": "Senior",
  "tags": [
    "Prioritization",
    "Stakeholder Alignment",
    "Chief Manager",
    "Behavioral — Strategy & Execution"
  ],
  "question": "Tell me about a time you had to align competing priorities from multiple business stakeholders who each thought their initiative should come first.",
  "answer": "<p><strong>In plain English:</strong> When multiple business leaders each believe their project should be the top priority, this question tests whether you have a real framework for resolving that &mdash; visible prioritization criteria, getting stakeholders in the same room, and willingness to make an unpopular call and own it publicly.</p>\n      <p>Name the actual mechanism you used to resolve it, not just \"I had good conversations\" — a shared prioritization framework applied visibly and consistently (business impact, effort, dependency, risk) so the outcome is defensible as the framework's result, not your personal favoritism; getting the competing stakeholders in the same room to see each other's case and constraints, rather than mediating each conversation separately, which lets each side believe you sided with the other; and being willing to make an unpopular call and own it publicly once the input is gathered, rather than endlessly deferring the decision to avoid conflict.</p>\n      <p>The strongest version of this answer includes a case where you said yes to reprioritizing something genuinely important based on new information a stakeholder raised — showing the framework is real, not just a tool to justify decisions you'd already made.</p>"
},
{
  "id": "cm-b16-11",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Behavioral — Strategy & Execution",
  "title": "Deciding what not to build — a prioritization or 'no' framework.",
  "difficulty": "Senior",
  "tags": [
    "Prioritization",
    "Scope Management",
    "Chief Manager",
    "Behavioral — Strategy & Execution"
  ],
  "question": "How do you decide what not to build, or what to say no to, when everything feels important?",
  "answer": "<p><strong>In plain English:</strong> 'Prioritization' isn't about saying yes to things &mdash; it's about deciding what <em>not</em> to do. This question tests whether you have a real framework for saying no (is it reversible? does it align with strategy? what's the opportunity cost?) and whether you communicate that 'no' with a genuine reason, not a vague 'not right now.'</p>\n      <p>A concrete framework beats a gut feeling: is this reversible or irreversible (bias toward saying yes to cheap, reversible bets and being much more conservative about irreversible ones), does it serve the actual strategic bet the org has made or is it a plausible-sounding distraction from it, and what's the realistic opportunity cost — not \"can we do this\" but \"what doesn't happen if we do.\"</p>\n      <p>The harder, more honest part of this answer: saying no well means giving the requester a real reason tied to the framework, not a vague \"not right now,\" and following up later rather than letting a \"no\" quietly become a permanent black hole that erodes trust the next time you ask someone to trust your prioritization. A leader who says yes to everything isn't actually prioritizing — they're just deferring the cost of the tradeoff onto an overloaded team.</p>"
},
{
  "id": "cm-b16-12",
  "category": "chief-manager",
  "categoryName": "Chief Manager",
  "topic": "Behavioral — Strategy & Execution",
  "title": "A technical disagreement with a peer architect or product leader.",
  "difficulty": "Senior",
  "tags": [
    "Cross-Functional Collaboration",
    "Technical Disagreement",
    "Chief Manager",
    "Behavioral — Strategy & Execution"
  ],
  "question": "Describe a technical disagreement with a peer leader — an architect, a product manager — where you found common ground.",
  "answer": "<p><strong>In plain English:</strong> This question asks you to describe a real technical disagreement with a peer &mdash; an architect, a product manager &mdash; where you found common ground. The answer should name the competing concerns each side was optimizing for and show a real resolution, not an instant meeting-of-the-minds.</p>\n      <p>Name the actual substance of the disagreement specifically, not just \"we saw things differently\" — a real answer names the competing concern each side was actually optimizing for (you were protecting long-term maintainability, they were protecting a committed launch date, say), since most cross-functional technical disagreements are really a values/priority mismatch wearing a technical disguise.</p>\n      <p>Show the actual resolution mechanism: did you find a smaller, reversible version of the decision that let you ship on time while not locking in the architecture choice you were worried about; did you bring data or a prototype that changed the terms of the debate rather than just restating your opinion louder; or did you genuinely change your mind once you understood their constraint better. A believable answer includes real friction and a real resolution, not an instant meeting-of-the-minds — that reads as invented.</p>"
}
);
