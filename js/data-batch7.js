// ==========================================================
// Frontend Frameworks, System Design Patterns & Leadership —
// Batch 7. Extends Full Stack (frontend framework choice,
// virtual DOM, RSC, state management, micro-frontends, plus
// system-design patterns: monolith/microservices, API gateway,
// circuit breaker, CQRS, event-driven architecture) and adds a
// new Project Mgmt topic, Leadership & Behavioral (STAR-format
// coaching for common behavioral/leadership interview questions).
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b7-01",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Frontend Frameworks & Architecture",
  "title": "What factors influence your decision to use React vs. another front-end framework?",
  "difficulty": "Mid",
  "tags": [
    "React",
    "Frontend Frameworks",
    "Frontend Frameworks & Architecture"
  ],
  "question": "What factors influence your decision to use React vs. another front-end framework?",
  "answer": "<p>Team familiarity and hiring pool size &mdash; React has the largest talent pool, which matters at scale. The specific rendering strategy needed: SSR/SSG maturity differs (Next.js for React is very mature; Nuxt for Vue and SvelteKit for Svelte are close behind, but the ecosystem depth differs). Bundle-size and performance budget &mdash; compile-time-reactive frameworks (Svelte, Solid) ship less runtime JS than React's virtual-DOM runtime, which matters more on a low-power device or a content-heavy public site than an internal dashboard. Ecosystem maturity for the specific need (state management, component libraries, testing tooling). And genuine team expertise &mdash; a team fluent in Vue's template syntax from prior projects has a real retraining cost onto JSX, and that cost is a legitimate input, not something to wave away because a framework is more popular.</p>\n      <p>The honest answer to \"why React\" is rarely \"React is best\" &mdash; it's \"React is the best fit given our team, our rendering needs, and our performance budget.\" Being able to say when it <em>wouldn't</em> be the right choice is what actually differentiates a senior answer here.</p>"
},
{
  "id": "b7-02",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Frontend Frameworks & Architecture",
  "title": "What problem does the Virtual DOM actually solve, and where does it fall short?",
  "difficulty": "Senior",
  "tags": [
    "Virtual DOM",
    "Rendering",
    "Frontend Frameworks & Architecture"
  ],
  "question": "What problem does the Virtual DOM actually solve, and where does it fall short compared to newer approaches?",
  "answer": "<p>Directly mutating the real DOM on every state change is expensive &mdash; each mutation risks triggering layout recalculation and repaint. The virtual DOM lets a framework batch a state change into an in-memory tree, diff it against the previous tree, and apply only the minimal set of real DOM operations needed.</p>\n      <p>It falls short against compile-time-reactive frameworks like Svelte or Solid, which skip the diffing step entirely &mdash; the compiler already knows, at build time, exactly which DOM nodes a given state change touches, and generates precise update code with no runtime tree-diffing at all. \"Virtual DOM is fast\" is true relative to naive DOM manipulation, not as an absolute performance ceiling &mdash; that nuance is worth stating unprompted.</p>"
},
{
  "id": "b7-03",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Frontend Frameworks & Architecture",
  "title": "What do React Server Components actually solve that traditional SSR doesn't?",
  "difficulty": "Senior",
  "tags": [
    "React Server Components",
    "SSR",
    "Frontend Frameworks & Architecture"
  ],
  "question": "What do React Server Components actually solve that traditional SSR doesn't?",
  "answer": "<p>Traditional SSR renders initial HTML on the server, but the client still has to download and hydrate the component's JavaScript to make it interactive &mdash; the component code ships either way. Server Components render on the server and never ship their code to the client at all, which means zero client bundle cost for anything server-only, and lets a component reach directly into a database or an internal service with no API layer in between.</p>\n      <p>The real cost: an explicit split between Server and Client Components with genuine rules about what can cross that boundary (no hooks, no browser APIs, no event handlers in a Server Component) &mdash; it's a real architectural constraint, not a free performance win.</p>"
},
{
  "id": "b7-04",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Frontend Frameworks & Architecture",
  "title": "When do you actually need Redux/Zustand instead of just React's built-in state?",
  "difficulty": "Mid",
  "tags": [
    "State Management",
    "Redux",
    "Frontend Frameworks & Architecture"
  ],
  "question": "When do you actually need a dedicated state management library (Redux, Zustand) instead of just React's built-in state?",
  "answer": "<p>Local component state should be the default &mdash; reaching for a global store on day one is a common overcorrection. A dedicated library earns its place when state is genuinely shared across many components with no natural common parent (avoiding deep prop drilling or Context re-render storms), when you need strict, auditable state transitions (Redux's action-based discipline, useful on a large team), or when the real problem is actually server state &mdash; cached API data, refetching, stale-while-revalidate &mdash; being managed as if it were client UI state.</p>\n      <p>That last one is the most common architecture mistake: server state (React Query/SWR/RTK Query) and client UI state are genuinely different problems, and conflating them into one store is usually where the pain comes from, not from \"not having Redux.\"</p>"
},
{
  "id": "b7-05",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "Frontend Frameworks & Architecture",
  "title": "When does a micro-frontend architecture actually make sense?",
  "difficulty": "Senior",
  "tags": [
    "Micro-frontends",
    "Architecture",
    "Frontend Frameworks & Architecture"
  ],
  "question": "When does a micro-frontend architecture actually make sense, versus just being extra complexity?",
  "answer": "<p>When multiple independent teams need to ship and deploy their part of a large frontend on their own schedule, without a single monolithic build/release train coupling every team's release cadence together &mdash; the same organizational motivation as microservices on the backend, applied to the frontend.</p>\n      <p>The real cost: keeping a consistent design system across independently-deployed pieces, avoiding shipping duplicate framework/library code to the client (module federation helps but adds its own complexity), and a genuinely harder debugging story across ownership boundaries. Not worth it for a single team's app; it earns its keep specifically once deploy-cadence coupling between teams is the actual, felt pain &mdash; not because it sounds more scalable.</p>"
},
{
  "id": "b7-06",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Walk me through a large-scale system you designed.",
  "difficulty": "Senior",
  "tags": [
    "System Design",
    "Architecture Patterns",
    "System Design & Scalability"
  ],
  "question": "Walk me through a large-scale system you designed. What architectural patterns did you use and why?",
  "answer": "<p>There's no single right system to describe &mdash; what actually differentiates a strong answer is structure and reasoning, not the specific project. Four things to get right:</p>\n      <ul>\n        <li>State concrete scale and constraints up front &mdash; user count, request volume, data volume, team size, latency requirements. A vague \"it was a big system\" answer gives the interviewer nothing to probe.</li>\n        <li>Name the actual patterns used AND why each was chosen over the alternative you didn't pick &mdash; \"we used event-driven pub/sub instead of synchronous REST between services because the consuming service could tolerate eventual consistency and we needed to decouple each team's deploy cadence\" is a real answer; \"we used microservices because they're scalable\" is not.</li>\n        <li>Name at least one real trade-off or regret &mdash; a system design story with zero friction reads as rehearsed or fabricated; interviewers are listening for judgment under real constraints, not a highlight reel.</li>\n        <li>Tie every pattern back to the specific failure mode it was chosen to prevent, not to its general reputation &mdash; \"we introduced CQRS specifically because our read and write load profiles diverged by 50x\" beats \"CQRS is a well-known pattern.\"</li>\n      </ul>\n      <p>Have two or three concrete patterns ready with this level of reasoning &mdash; API gateway, circuit breaker, database-per-service, event sourcing &mdash; rather than a shallow list of buzzwords.</p>"
},
{
  "id": "b7-07",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Monolith vs microservices — how do you actually decide?",
  "difficulty": "Senior",
  "tags": [
    "Monolith",
    "Microservices",
    "System Design & Scalability"
  ],
  "question": "Monolith vs microservices — how do you actually decide, beyond 'microservices are more modern'?",
  "answer": "<p>The decision is organizational as much as technical. A modular monolith &mdash; one deployable, but with clean internal module boundaries &mdash; gets you most of microservices' code-organization benefit with far less operational overhead (no distributed tracing, no service mesh, no network-call failure modes between what used to be function calls), and is usually the right starting point for a small team.</p>\n      <p>Microservices earn their cost specifically when independent teams need independent deploy cadences, when different parts of the system have genuinely different scaling profiles (one component needs 100x the compute of the rest), or when a specific part of the system needs a different technology or language. Splitting a monolith into microservices before you have the team size and operational maturity to run them is one of the most common architecture-driven ways for a small team to slow itself down.</p>"
},
{
  "id": "b7-08",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "What is the API gateway pattern, and what problem does it solve?",
  "difficulty": "Mid",
  "tags": [
    "API Gateway",
    "System Design",
    "System Design & Scalability"
  ],
  "question": "What is the API gateway pattern, and what problem does it actually solve?",
  "answer": "<p>A single entry point in front of a set of backend services, handling concerns that would otherwise be duplicated in every service &mdash; authentication, rate limiting, request routing, response aggregation from multiple services into one client-facing response, and protocol translation (a client-friendly REST/GraphQL surface in front of internal gRPC services, say).</p>\n      <p>It solves the \"every client has to know about every service and its auth/routing rules\" problem, at the cost of introducing a new single point that has to be built for high availability and low latency, since now everything routes through it.</p>"
},
{
  "id": "b7-09",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Circuit breaker pattern — what does it actually protect against?",
  "difficulty": "Senior",
  "tags": [
    "Circuit Breaker",
    "Resilience",
    "System Design & Scalability"
  ],
  "question": "Circuit breaker pattern — what does it actually protect against?",
  "answer": "<p>When a downstream service is failing or slow, callers that keep retrying it anyway don't just fail their own requests &mdash; they pile up threads and connections waiting on a service that isn't going to respond, and that resource exhaustion can cascade and take down the calling service too, and then whatever calls that.</p>\n      <p>A circuit breaker tracks the failure rate to a given dependency and, once it crosses a threshold, \"opens\" &mdash; failing fast locally without even attempting the call &mdash; giving the downstream service room to recover instead of being hit with a continued flood, and giving the calling service a fast, predictable failure instead of a slow, resource-consuming one. It periodically lets a trial request through (half-open) to detect recovery automatically.</p>"
},
{
  "id": "b7-10",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "CQRS — when does splitting reads and writes actually pay off?",
  "difficulty": "Senior",
  "tags": [
    "CQRS",
    "System Design",
    "System Design & Scalability"
  ],
  "question": "CQRS — when does actually splitting your read and write models pay off?",
  "answer": "<p>Command Query Responsibility Segregation splits the model used to write data from the model used to read it &mdash; often backed by genuinely different data stores optimized for each access pattern. It pays off when read and write load profiles diverge significantly (far more reads than writes, or the reverse), when the ideal read shape is very different from the natural write shape (a denormalized, pre-joined read model versus a normalized write model), or when reads and writes need to scale independently.</p>\n      <p>It's real added complexity &mdash; data has to propagate from the write side to the read side, usually asynchronously, meaning reads can be briefly stale &mdash; so it's a pattern to reach for once you've measured that divergence, not by default.</p>"
},
{
  "id": "b7-11",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "System Design & Scalability",
  "title": "Synchronous REST vs async messaging between services — the real tradeoff.",
  "difficulty": "Senior",
  "tags": [
    "Event-Driven Architecture",
    "Messaging",
    "System Design & Scalability"
  ],
  "question": "Event-driven architecture — synchronous REST calls between services vs async messaging. What's the actual tradeoff?",
  "answer": "<p>Synchronous REST between services is simple to reason about and gives an immediate result, but it couples the caller to the callee's availability and latency in real time &mdash; if the downstream service is slow or down, the caller is blocked or fails immediately, and a chain of synchronous calls compounds that fragility across every hop.</p>\n      <p>Async messaging (a message queue or event bus) decouples the two &mdash; the producer publishes and moves on, the consumer processes when it's able, and a temporarily-down consumer doesn't block the producer at all &mdash; at the cost of genuinely harder reasoning: eventual consistency, message ordering guarantees (or the lack of them), and needing to design for at-least-once delivery (idempotent consumers &mdash; the same principle as the payments idempotency-key answer). The right tool depends on whether the caller genuinely needs an immediate answer to proceed, or whether \"eventually processed\" is actually fine.</p>"
},
{
  "id": "b7-12",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "Led a team through the full SDLC — biggest challenges and how you addressed them.",
  "difficulty": "Senior",
  "tags": [
    "Leadership",
    "SDLC",
    "STAR Method",
    "Leadership & Behavioral"
  ],
  "question": "Tell me about a time when you led a team through the full software development lifecycle. What were the biggest challenges and how did you address them?",
  "answer": "<p>Structure this with STAR &mdash; Situation (the project and its real constraints: team size, timeline, technical complexity), Task (your specific role and what you owned), Action (the concrete decisions you made, not \"we did agile\" but the specific calls: how you scoped, how you handled a slipping estimate, how you kept design/build/test/deploy phases from becoming siloed handoffs), Result (a measurable outcome &mdash; shipped date, defect rate, team retention, whatever is genuinely true for your story).</p>\n      <p>The biggest challenge to actually name should be specific and a little uncomfortable &mdash; \"communication was hard\" is forgettable; \"the design phase ran long because we hadn't agreed on the API contract, so I forced that conversation at week 2 by writing the contract myself and having both sides react to a concrete draft instead of an abstract discussion\" is memorable and shows real judgment.</p>\n      <p>Interviewers are listening for ownership language (\"I decided,\" not \"we somehow ended up\"), and for genuine friction with a real resolution &mdash; not a story where everything went smoothly, which reads as either fabricated or shallow self-reflection.</p>"
},
{
  "id": "b7-13",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "A difficult technical trade-off under a deadline — how did you decide?",
  "difficulty": "Senior",
  "tags": [
    "Trade-offs",
    "Decision Making",
    "Leadership & Behavioral"
  ],
  "question": "Describe a time you had to make a difficult technical trade-off under a deadline. How did you decide?",
  "answer": "<p>A strong answer names the actual competing options and the real cost of each &mdash; not \"we had to move fast so we cut corners.\" Show the reasoning: what you'd lose by picking the slower, more correct option (a missed launch window, a lost customer) versus what you'd risk by picking the faster one (technical debt, a specific class of bug), and why the decision you made was right given who was actually accountable for the consequence.</p>\n      <p>The strongest version of this answer also names what you did to bound the risk of the fast option &mdash; a follow-up ticket that actually got prioritized, a feature flag to limit blast radius, extra monitoring around the corner you cut &mdash; rather than \"we cut the corner and hoped.\"</p>"
},
{
  "id": "b7-14",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "Disagreed with a technical decision made above you — what did you do?",
  "difficulty": "Senior",
  "tags": [
    "Conflict Resolution",
    "Leadership",
    "Leadership & Behavioral"
  ],
  "question": "Tell me about a time you disagreed with a technical decision made above you. What did you do?",
  "answer": "<p>The answer interviewers are listening for isn't \"I was right and they came around\" &mdash; it's how you disagreed. A strong structure: you made your case with concrete reasoning, not just an opinion; you made sure the decision-maker actually understood the specific risk you were flagging; and &mdash; critically &mdash; once the decision was made and you'd been heard, you committed to executing it well rather than quietly under-investing or relitigating it in every subsequent meeting (\"disagree and commit\").</p>\n      <p>If the story ends with you being vindicated, say so plainly, but the more important content of the answer is that you handled being overruled professionally, since that's the actual scenario being tested &mdash; everyone eventually gets overruled on something.</p>"
},
{
  "id": "b7-15",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "How do you mentor a junior engineer who's struggling?",
  "difficulty": "Mid",
  "tags": [
    "Mentoring",
    "Team Development",
    "Leadership & Behavioral"
  ],
  "question": "How do you mentor a junior engineer who's struggling?",
  "answer": "<p>Start by finding out what \"struggling\" actually is before prescribing a fix &mdash; is it a genuine skill gap, unclear expectations (they don't know what \"done\" looks like), or something outside work entirely.</p>\n      <p>Concrete mentoring moves that read as real rather than generic: pairing on their actual current ticket instead of abstract lessons, giving them a smaller, well-scoped win to rebuild confidence rather than immediately reassigning their hard ticket to someone else, and being specific in code review feedback (\"here's why, and here's what I'd do instead\" rather than just \"this is wrong\").</p>\n      <p>The failure mode worth naming: quietly doing their work for them, or quietly reassigning it away from them &mdash; both hide the gap instead of closing it, and the person never actually grows.</p>"
},
{
  "id": "b7-16",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "Led the response to a production incident — what did the postmortem look like?",
  "difficulty": "Senior",
  "tags": [
    "Incident Response",
    "Postmortem",
    "Leadership & Behavioral"
  ],
  "question": "Tell me about a production incident you led the response for. What did the postmortem process look like?",
  "answer": "<p>Structure: what broke and how it was detected (a real story names the actual detection mechanism &mdash; an alert, a customer report &mdash; since that itself is often the first thing worth improving), the immediate mitigation to stop the bleeding (often different from the actual root-cause fix &mdash; a rollback or a feature-flag kill switch buys time), and then the postmortem itself.</p>\n      <p>A good postmortem is blameless (focused on what about the system or process allowed the failure, not who caused it), produces concrete, owned, tracked action items rather than a vague \"we'll be more careful,\" and &mdash; the detail that signals real experience &mdash; at least one of those action items should be about the detection/response process itself, not just the root cause, since the next incident won't be the same bug.</p>"
},
{
  "id": "b7-17",
  "category": "project-management",
  "categoryName": "Project Mgmt",
  "topic": "Leadership & Behavioral",
  "title": "How do you decide when to escalate a problem versus solving it within the team?",
  "difficulty": "Senior",
  "tags": [
    "Escalation",
    "Decision Making",
    "Leadership & Behavioral"
  ],
  "question": "How do you decide when to escalate a problem versus solving it within the team?",
  "answer": "<p>Escalate when the decision genuinely requires authority or context you don't have &mdash; a cross-team resource conflict, a scope/timeline trade-off that affects a commitment someone above you made externally, or a risk large enough that the person accountable for it should knowingly own the call, not just discover it after the fact. Don't escalate what you're equipped to solve &mdash; that trains your manager to expect to be looped into everything, and trains your team to stop making decisions.</p>\n      <p>A useful test to state out loud in an interview: \"could I make this reversible cheaply if I'm wrong?\" &mdash; if yes, that's usually a decide-and-inform situation; if the cost of being wrong is high and hard to reverse, that's an escalate-and-align situation.</p>"
}
);
