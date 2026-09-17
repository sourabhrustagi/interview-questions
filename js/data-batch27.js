// ==========================================================
// Batch 27: React (web) — deep hooks, patterns & rendering
// gap-fill, installment 1 of a larger expansion.
// Batch 26 covered useEffect/useMemo/custom hooks/Context/keys/
// error boundaries/React 19 Actions/the Compiler. This batch
// covers the hooks and patterns that weren't touched yet:
// useState/useReducer/useRef/useImperativeHandle/useLayoutEffect/
// useTransition/useDeferredValue/useSyncExternalStore/useId,
// component patterns (HOC, render props, compound components,
// controlled/uncontrolled), Portals, StrictMode, batching,
// Suspense, code-splitting, Fiber, reconciliation internals,
// synthetic events, and testing custom hooks.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
{
  "id": "b27-01",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useState's functional update form — the stale-state bug it fixes.",
  "difficulty": "Mid",
  "tags": ["React", "useState", "React Hooks & Fundamentals"],
  "question": "When do you need setCount(c => c + 1) instead of setCount(count + 1), and what bug does skipping it actually cause?",
  "answer": "<p><code>setCount(count + 1)</code> closes over whatever <code>count</code> was at the render that created the handler. Call it multiple times before a re-render happens (three calls queued inside one event handler, or inside a rapid-fire async callback), and all three read the same stale <code>count</code>, so the count only advances by one instead of three. The functional form <code>setCount(c => c + 1)</code> instead receives the truly latest pending state as its argument, since React applies queued updater functions in sequence, so each one operates on the previous update's result rather than a snapshot from render time.</p>\n      <p>The rule of thumb: whenever the next state genuinely depends on the previous state, use the functional form; when it depends on other values from render (a prop, a different piece of state), the direct form is fine since those aren't the ones going stale mid-batch.</p>"
},
{
  "id": "b27-02",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useReducer vs useState — when the reducer actually wins.",
  "difficulty": "Mid",
  "tags": ["React", "useReducer", "State Management", "React Hooks & Fundamentals"],
  "question": "useReducer looks like more ceremony than useState for the same job. When does it actually earn that ceremony?",
  "answer": "<p>useState is fine while a component has a handful of independent state values updated directly. It starts to strain once several pieces of state need to change together in response to one event — a form submission that should set loading, clear errors, and stash a request ID all atomically — because separate useState calls updated from separate places make it easy for one to be forgotten in one code path and not another, silently producing an inconsistent combination.</p>\n      <p>useReducer centralizes every possible transition into one function that takes the current state and an action and returns the next state — every valid transition is enumerated in one place, testable in isolation with no React rendering involved (it's a pure function), and the component only dispatches an action rather than juggling several setters directly. It's the same discipline MVI enforces at the mobile-architecture level, applied at component scope: reach for it when a component's state has real interdependencies, not as a default replacement for simple independent state.</p>"
},
{
  "id": "b27-03",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useRef — why mutating a ref doesn't trigger a re-render.",
  "difficulty": "Mid",
  "tags": ["React", "useRef", "React Hooks & Fundamentals"],
  "question": "useRef gives you a mutable .current property, unlike state. Why doesn't changing it re-render the component, and when is that exactly what you want?",
  "answer": "<p>State exists specifically to drive what's rendered — React tracks it and schedules a re-render whenever it changes, because the whole point of state is that the UI needs to reflect it. A ref is a plain mutable box that survives across renders without React watching it at all: mutating <code>ref.current</code> is a direct assignment, not an API call React can hook into, so nothing schedules a re-render — which is a deliberate design, not a limitation, for values the component needs to remember but that shouldn't themselves cause a visual update.</p>\n      <p>The two classic uses: holding a reference to a DOM node (to call <code>.focus()</code> or measure it imperatively) and holding a mutable value that needs to persist across renders but shouldn't participate in the render cycle at all — a timer ID to clear later, a previous-value snapshot for comparison, a flag tracking whether a component is still mounted before an async callback resolves. Reaching for a ref instead of state for a value that <em>should</em> visually update is the classic reverse mistake — the UI silently goes stale because nothing told React to re-render.</p>"
},
{
  "id": "b27-04",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "forwardRef vs React 19's ref-as-a-prop.",
  "difficulty": "Mid",
  "tags": ["React 19", "forwardRef", "Refs", "React Hooks & Fundamentals"],
  "question": "Why did passing a ref into a custom component need forwardRef before React 19, and what changed?",
  "answer": "<p>React reserves the <code>ref</code> prop name specially — historically, a function component receiving <code>ref</code> as a plain prop simply never saw it, React intercepted it before the component's own props object, which is exactly why passing a ref to a plain function component silently did nothing and needed the entire component wrapped in <code>forwardRef((props, ref) => ...)</code> to explicitly opt in to receiving it as a second argument.</p>\n      <p>React 19 removed that special-casing for function components: <code>ref</code> now arrives as a genuinely ordinary prop, readable directly off the props object like any other, so <code>forwardRef</code> is no longer required to accept a ref into a custom component. Existing <code>forwardRef</code>-wrapped components keep working unchanged, so this is additive rather than a breaking migration — new components can skip the wrapper entirely, while a large existing codebase has no obligation to rewrite what already works.</p>"
},
{
  "id": "b27-05",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useImperativeHandle — exposing a deliberately narrow imperative API from a child.",
  "difficulty": "Senior",
  "tags": ["React", "useImperativeHandle", "Refs", "React Hooks & Fundamentals"],
  "question": "What does useImperativeHandle actually let you do that a plain ref to a child doesn't, and why would you want that restriction?",
  "answer": "<p>A ref to a DOM node exposes the full native element API — every method and property the browser gives you, whether or not the component wants callers reaching for all of it. <code>useImperativeHandle</code> lets a component customize exactly what a parent's ref sees when it points at that component: instead of the raw DOM node (or nothing, for a component with no single underlying node), the parent gets back whatever object the component explicitly constructs and returns — a curated set of methods like <code>focus()</code> or <code>scrollIntoView()</code>, deliberately hiding the rest of the internal DOM structure.</p>\n      <p>The reason to want that restriction: it keeps the imperative surface a component exposes small and intentional, the same way a class exposes a narrow public API instead of every internal field — a parent that needs to imperatively focus a custom input component shouldn't also be able to reach in and mutate arbitrary internal DOM nodes the component didn't intend to expose, since that coupling makes the child's internals impossible to refactor safely later.</p>"
},
{
  "id": "b27-06",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useLayoutEffect vs useEffect — the timing difference that actually matters.",
  "difficulty": "Senior",
  "tags": ["React", "useLayoutEffect", "useEffect", "React Hooks & Fundamentals"],
  "question": "useLayoutEffect and useEffect look identical in signature. What's the actual timing difference, and what visible bug shows up if you use the wrong one?",
  "answer": "<p><code>useEffect</code> runs asynchronously after the browser has painted the updated DOM to the screen — the user already sees the new frame before the effect runs. <code>useLayoutEffect</code> runs synchronously after React has updated the DOM but <em>before</em> the browser paints, blocking the paint until it finishes.</p>\n      <p>That difference only matters when an effect needs to measure or mutate the DOM in a way that must be visually consistent before the user ever sees an intermediate state — measuring an element's size to position a tooltip based on it, say. Do that measurement-and-adjustment in <code>useEffect</code>, and the user briefly sees the tooltip in the wrong position for one frame before it snaps to the correct spot, because the browser already painted before the effect ran and corrected it — a visible flicker. <code>useLayoutEffect</code> makes the correction happen before that paint, so the user only ever sees the final, correct position. The tradeoff is real: because it blocks paint, an expensive <code>useLayoutEffect</code> can visibly delay the whole update, which is exactly why <code>useEffect</code> is the default and <code>useLayoutEffect</code> is reserved specifically for this DOM-measurement class of problem.</p>"
},
{
  "id": "b27-07",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useTransition — marking a state update as low-priority.",
  "difficulty": "Senior",
  "tags": ["React", "useTransition", "Concurrent Rendering", "React Hooks & Fundamentals"],
  "question": "What problem does useTransition actually solve, and how is a 'transition' update different from a normal state update?",
  "answer": "<p>A normal state update is treated as urgent — React tries to reflect it on screen as soon as possible, which is right for direct user input (typing in a field should feel instant) but wrong for a downstream update that's expensive to render, like re-filtering a huge list based on that typed text. Rendering that expensive list update with the same urgency as the keystroke itself blocks the input from feeling responsive, since React is busy computing the big re-render before it can process the next keystroke.</p>\n      <p><code>useTransition</code> lets you explicitly mark a state update as a low-priority \"transition\": React keeps the input responsive to urgent updates (still shows what was typed immediately) while rendering the transition's result in the background, interruptibly, and swaps it in once ready without blocking. It gives you an <code>isPending</code> flag for free, so you can show a subtle loading indicator for the deferred part while the input itself stays snappy — the point isn't making the expensive work faster, it's letting React deprioritize it relative to what the user is actively doing right now.</p>"
},
{
  "id": "b27-08",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useDeferredValue — deferring a value instead of a state setter.",
  "difficulty": "Senior",
  "tags": ["React", "useDeferredValue", "Concurrent Rendering", "React Hooks & Fundamentals"],
  "question": "useTransition and useDeferredValue solve a similar problem. When do you reach for useDeferredValue instead?",
  "answer": "<p><code>useTransition</code> requires you to control the state update itself — you wrap the <code>setState</code> call in <code>startTransition</code>. That's not always possible: if the expensive value comes from a prop, or from a third-party hook you don't control the setter for, there's no state-update call site to wrap.</p>\n      <p><code>useDeferredValue</code> works on the value directly instead: it gives you back a version of the value that \"lags behind\" during urgent updates and catches up once React has spare capacity, without needing access to whatever produced the value in the first place. The practical pattern is the same either way — render the expensive list against the deferred value rather than the immediate one, so typing stays responsive while the filtered result trails slightly and catches up, and use the immediate-vs-deferred comparison (<code>value !== deferredValue</code>) as a signal to show a subtle stale-content indicator if you want one.</p>"
},
{
  "id": "b27-09",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useSyncExternalStore — why subscribing to an external store outside useEffect is unsafe.",
  "difficulty": "Senior",
  "tags": ["React", "useSyncExternalStore", "External State", "React Hooks & Fundamentals"],
  "question": "Why does React need a dedicated hook for subscribing to an external (non-React) store, instead of just useEffect plus useState?",
  "answer": "<p>A hand-rolled subscription (useEffect subscribes, useState holds the latest value) has a real correctness gap under React's concurrent rendering: React can render a component multiple times for one commit, or interrupt and discard a render, and a naive subscription can catch the external store in a state that's inconsistent with what's actually being rendered — a classic symptom is \"tearing,\" where different parts of the UI briefly show different versions of the same external value during a single update.</p>\n      <p><code>useSyncExternalStore</code> is React's own primitive specifically built to subscribe to external state safely under concurrent rendering — it takes a subscribe function and a snapshot-getter, and React guarantees the value read stays consistent with what's actually committed to the screen, tearing-free, even across concurrent renders. It's mostly infrastructure other libraries build on rather than something application code reaches for directly — state libraries like Redux and Zustand use it internally specifically so their own store subscriptions are safe under React 18+'s concurrent features, which is the detail worth knowing even if you rarely call the hook yourself.</p>"
},
{
  "id": "b27-10",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "useId — why Math.random() for an accessibility ID breaks under SSR.",
  "difficulty": "Mid",
  "tags": ["React", "useId", "Accessibility", "SSR", "React Hooks & Fundamentals"],
  "question": "Why can't you just generate a random ID for linking a label to an input via aria-labelledby, and what does useId actually guarantee?",
  "answer": "<p>Accessibility attributes like <code>aria-labelledby</code> need a stable ID shared between two elements, generated once per component instance — not regenerated every render, or React sees a changed attribute and the association can flicker. Generating it with <code>Math.random()</code> or a global counter also breaks under server-side rendering specifically: the ID generated during the server render and the ID generated during the client's hydration render come from independent random sequences, so they mismatch, which either breaks the accessibility association after hydration or triggers a hydration-mismatch warning.</p>\n      <p><code>useId</code> generates an ID that's stable across a component's re-renders and guaranteed to match between server and client for the same component in the same tree position, by deriving it from the component's position in the render tree rather than randomness or a mutable counter. The one thing it explicitly isn't for is generating keys for a list — it's scoped to accessibility-attribute IDs within one component instance, not a general unique-ID utility.</p>"
},
{
  "id": "b27-11",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Controlled vs uncontrolled form inputs — the actual tradeoff.",
  "difficulty": "Mid",
  "tags": ["React", "Forms", "Controlled Components", "React Hooks & Fundamentals"],
  "question": "Controlled vs uncontrolled inputs in React — what's the real difference, and when is uncontrolled actually the better choice?",
  "answer": "<p>A controlled input's value lives in React state — every keystroke fires <code>onChange</code>, updates state, and React re-renders the input with that state as its value, so React is the single source of truth and the current value is always readable from state for validation, conditional logic, or submission. An uncontrolled input just lets the DOM hold its own value natively, read only when needed (typically via a ref, on submit) — React never re-renders on every keystroke because it isn't tracking the value at all.</p>\n      <p>Controlled is the right default when the UI needs to react to the value as it's typed — live validation, conditionally disabling a submit button, formatting input as you type. Uncontrolled genuinely wins for a large form where per-keystroke re-renders of the whole form component would be wasteful and nothing needs to react live to each field's value until submission — a large, mostly-static form read once on submit is a legitimate case for uncontrolled inputs (often via a library like react-hook-form, which uses refs under the hood specifically to avoid that per-keystroke re-render cost while still providing a controlled-feeling validation API).</p>"
},
{
  "id": "b27-12",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Higher-Order Components — what they did, and why hooks replaced most of them.",
  "difficulty": "Mid",
  "tags": ["React", "HOC", "Design Patterns", "React Hooks & Fundamentals"],
  "question": "What problem did the Higher-Order Component pattern solve, and why do you rarely see new ones written today?",
  "answer": "<p>An HOC is a function that takes a component and returns a new component wrapping it with extra behavior or props — <code>withAuth(MyComponent)</code>, say, injecting an authenticated user prop. Before hooks, this was the primary way to share stateful, cross-cutting logic (auth, data fetching, subscriptions) across components that had no other way to reuse a class component's internal state/lifecycle logic without literally copying it.</p>\n      <p>The pattern had two persistent costs: \"wrapper hell,\" where a component wrapped by several HOCs became deeply nested in React DevTools and hard to trace, and prop naming collisions between what different HOCs injected, since there was no scoping — two HOCs both wanting to inject a prop called <code>data</code> collide silently. A custom hook solves the same reuse problem — extracting stateful logic to share across components — without wrapping the component in an extra layer at all; the logic is called inline, its outputs are named locally by whoever calls it, and there's no extra layer showing up in DevTools. HOCs still show up for a narrow set of cases (wrapping a component to control what actually renders, like a route guard), but hooks took over the \"share stateful logic\" job HOCs used to own by default.</p>"
},
{
  "id": "b27-13",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Render props — the pattern hooks mostly obsoleted.",
  "difficulty": "Mid",
  "tags": ["React", "Render Props", "Design Patterns", "React Hooks & Fundamentals"],
  "question": "What was the render props pattern for, and why did hooks largely replace it too?",
  "answer": "<p>A render-props component takes a function as a prop (often named <code>children</code> or <code>render</code>) and calls it with some internal state or behavior, letting the consumer decide exactly what to render with that data — <code>&lt;MouseTracker render={({x, y}) => &lt;Cursor x={x} y={y} /&gt;} /&gt;</code>, sharing the mouse-tracking logic while leaving the rendering fully up to the caller. It solved the same cross-cutting-logic-sharing problem HOCs did, without the prop-collision issue, since the data comes back as function arguments the caller names however it wants.</p>\n      <p>Its own cost was nesting — several render-props components composed together produced a visibly indented \"pyramid\" of callback functions in JSX, harder to read than a flat list of hook calls. A custom hook gives you the same shared logic as a set of return values you destructure by name, with no wrapping component and no nesting at all — which is why, like HOCs, render props are now mostly seen in older codebases or libraries maintaining backward compatibility rather than written fresh today.</p>"
},
{
  "id": "b27-14",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Compound components — sharing implicit state between a parent and its children.",
  "difficulty": "Senior",
  "tags": ["React", "Compound Components", "Design Patterns", "React Hooks & Fundamentals"],
  "question": "What is the compound components pattern (like <Select><Select.Option>), and what problem does it solve over just passing props down explicitly?",
  "answer": "<p>Compound components let a parent and a set of related children share implicit state and behavior via React Context internally, while presenting a clean, declarative JSX API externally — <code>&lt;Tabs&gt;&lt;Tabs.List&gt;&lt;Tabs.Tab&gt;...&lt;/Tabs.Tab&gt;&lt;/Tabs.List&gt;&lt;Tabs.Panels&gt;...&lt;/Tabs.Panels&gt;&lt;/Tabs&gt;</code> — where <code>Tabs</code> owns the \"which tab is active\" state and every child reads and updates it through context, without the consumer ever having to manually wire an <code>activeTab</code> prop and an <code>onChange</code> handler through every layer themselves.</p>\n      <p>This beats a single monolithic component taking a big config object (<code>&lt;Tabs items={[...]} /&gt;</code>) specifically when the consumer needs real layout and content flexibility between the pieces — arbitrary JSX between tabs, conditional rendering of specific panels, custom styling per child — that a single data-driven prop can't express cleanly. The tradeoff: the children are tightly coupled to their specific parent's context and can't be used standalone or reordered arbitrarily without understanding that implicit contract, which is a deliberate cost paid for the flexible, readable JSX composition on the calling side.</p>"
},
{
  "id": "b27-15",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Prop drilling — when composition, not Context, is the actual fix.",
  "difficulty": "Mid",
  "tags": ["React", "Prop Drilling", "Composition", "React Hooks & Fundamentals"],
  "question": "Prop drilling is usually 'fixed' by reaching for Context. When is composition actually the better fix instead?",
  "answer": "<p>Prop drilling — passing a prop through several layers of components that don't use it themselves, just to reach one that does — feels like it needs Context to skip the middle layers. But often the real problem is a structural one: an intermediate component only exists to render its children plus some layout, and it's the one being forced to pass the prop through purely because of how the tree is nested, not because it genuinely needs to know about that data at all.</p>\n      <p>The composition fix: pass the deeply-nested component as <code>children</code> (or another prop holding JSX) to the intermediate component instead of a plain data prop, and render it directly where it's already fully constructed with the data it needs — the intermediate layer never has to know the prop exists at all, because it's just rendering whatever JSX it was handed, not threading a value through. Context is the right tool when a value genuinely needs to be available broadly and unpredictably across a subtree (theme, current user); composition is the right tool when the \"drilling\" is really just an artifact of how the component tree happens to be nested and can be restructured away entirely.</p>"
},
{
  "id": "b27-16",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "React.memo's shallow comparison — why an inline object or function prop defeats it.",
  "difficulty": "Mid",
  "tags": ["React", "React.memo", "Performance", "React Hooks & Fundamentals"],
  "question": "You wrapped a component in React.memo to stop unnecessary re-renders, but it still re-renders every time the parent does. Why?",
  "answer": "<p><code>React.memo</code> skips re-rendering only if every prop is shallowly equal to the previous render's props — for primitives (strings, numbers, booleans) that's a straightforward value comparison, but for objects, arrays, and functions it's a reference comparison. An inline object literal, array literal, or arrow function passed as a prop (<code>&lt;Child style={{color: 'red'}}&gt;</code>, <code>&lt;Child onClick={() => doThing()}&gt;</code>) creates a brand-new reference on every single parent render, even if its contents are identical every time — so the shallow-equality check always sees \"different\" and <code>React.memo</code> never actually gets to skip anything.</p>\n      <p>The fix is stabilizing the reference on the parent's side, not the child's — wrap the object/array/function in <code>useMemo</code>/<code>useCallback</code> so the same reference is passed across renders when the underlying value hasn't logically changed, giving <code>React.memo</code>'s comparison something meaningful to actually compare. Memoizing the child alone, without also stabilizing what's passed into it, is a common half-fix that looks right but does nothing.</p>"
},
{
  "id": "b27-17",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Portals — rendering outside the parent's DOM hierarchy, and why modals need them.",
  "difficulty": "Mid",
  "tags": ["React", "Portals", "Modals", "React Hooks & Fundamentals"],
  "question": "What does createPortal actually do, and why do modals/tooltips specifically tend to need it?",
  "answer": "<p><code>createPortal(children, domNode)</code> renders a subtree into a DOM node that lives somewhere else in the actual document, outside the calling component's normal DOM parent — but crucially, the component still participates in React's tree normally for everything else: context still flows through it, events still bubble up through the React tree (not the DOM tree) to the same ancestors they would if it hadn't been portaled at all.</p>\n      <p>Modals and tooltips need this because of CSS containment: a parent with <code>overflow: hidden</code>, a constrained <code>z-index</code> stacking context, or a fixed height clips or hides anything rendered as its literal DOM descendant, regardless of how that content is positioned. A modal rendered deep inside a scrollable card, say, would get clipped by that card's overflow rule if it stayed in the normal DOM hierarchy — rendering it into a portal attached directly to <code>document.body</code> escapes that ancestor's CSS constraints entirely while keeping the component logically part of the same React tree, so it still gets the click-outside-to-close behavior, context values, and state updates it would have had anyway.</p>"
},
{
  "id": "b27-18",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "StrictMode double-invoking effects — a bug detector, not a bug.",
  "difficulty": "Mid",
  "tags": ["React", "StrictMode", "useEffect", "React Hooks & Fundamentals"],
  "question": "Why does a component's effects fire twice in development under StrictMode, and what does that actually reveal?",
  "answer": "<p>React 18's StrictMode deliberately mounts a component, unmounts it, then immediately remounts it, running setup and cleanup functions twice — not because of a bug in React, but as a simulation of what React's concurrent features can legitimately do in production: mount a component, discard it, and remount it later (for example, when reusing state for an offscreen tree that becomes visible again). If an effect isn't actually safe to run twice, it has a bug that would otherwise only surface unpredictably under specific concurrent-rendering conditions in production — StrictMode surfaces it reliably and early, in development, instead.</p>\n      <p>The fix is never to suppress the double-invocation — it's to make the effect properly idempotent: an effect that subscribes to something must return a cleanup function that actually unsubscribes, so mount-unmount-remount nets out to exactly one active subscription, not two. An effect that breaks under double-invocation (a counter that increments without a matching decrement in cleanup, a subscription set up without a corresponding teardown) was already unsafe under real concurrent rendering — StrictMode just makes that visible on every dev run instead of intermittently in production.</p>"
},
{
  "id": "b27-19",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Automatic batching in React 18 — what changed from React 17.",
  "difficulty": "Senior",
  "tags": ["React 18", "Batching", "Performance", "React Hooks & Fundamentals"],
  "question": "What is 'automatic batching' in React 18, and what specifically was different about React 17's behavior?",
  "answer": "<p>Batching means React groups multiple state updates that happen within the same event into a single re-render instead of re-rendering once per <code>setState</code> call — several state updates inside one click handler produce one render, not three. React 17 only did this inside React's own event handlers; a state update triggered inside a native promise <code>.then()</code>, a <code>setTimeout</code> callback, or a raw DOM event listener bypassed batching entirely and triggered a separate synchronous render for each call, which was both a performance cost and a subtle correctness surprise for code that assumed state updates in one async callback would be batched together.</p>\n      <p>React 18 made batching automatic everywhere, regardless of where the update originates — inside promises, timeouts, and native event handlers, not just React's own synthetic event handlers — so multiple updates fired from any of those contexts within the same tick now batch into one render by default. The escape hatch, <code>flushSync</code>, exists for the rare case where you deliberately need a state update to apply and be reflected in the DOM synchronously before continuing — reading a DOM measurement immediately after a state-driven layout change, for instance — rather than waiting for React's batched, asynchronous flush.</p>"
},
{
  "id": "b27-20",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Suspense for data fetching — what it actually requires from the data source.",
  "difficulty": "Senior",
  "tags": ["React", "Suspense", "Data Fetching", "React Hooks & Fundamentals"],
  "question": "Suspense lets a component 'wait' for data before rendering. What does the data-fetching code actually have to do to plug into that mechanism?",
  "answer": "<p>Suspense works by a component <em>throwing a promise</em> during render instead of returning JSX — React catches that thrown promise, renders the nearest ancestor <code>&lt;Suspense fallback=&gt;</code>'s fallback UI instead, and re-attempts rendering the component once the promise resolves. This is fundamentally different from a plain <code>fetch</code> call inside <code>useEffect</code>, which returns a promise your own code awaits and then calls <code>setState</code> with — nothing about that shape is compatible with Suspense on its own, since Suspense specifically needs the promise thrown synchronously during the render phase, not resolved afterward via a state update.</p>\n      <p>This is why \"just add Suspense\" doesn't work with an arbitrary data-fetching hook — the data source has to be built (or wrapped) specifically to support this contract: caching the request, throwing the in-flight promise on a first read, and returning the resolved value (or throwing the error) on a subsequent read once it's settled. Frameworks and libraries built around Suspense (React Query's suspense mode, Relay, the <code>use()</code> hook in React 19 for reading a promise) handle that plumbing for you — writing that cache-and-throw logic by hand for a raw fetch call is exactly the kind of infrastructure most teams reach for a library to avoid reimplementing themselves.</p>"
},
{
  "id": "b27-21",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "React.lazy and code-splitting — what actually gets deferred, and the fallback tradeoff.",
  "difficulty": "Mid",
  "tags": ["React", "React.lazy", "Code Splitting", "React Hooks & Fundamentals"],
  "question": "What does React.lazy actually defer, and what's the real cost of splitting too aggressively?",
  "answer": "<p><code>React.lazy(() => import('./Component'))</code> tells the bundler (Webpack, Vite) to put that component's code into a separate chunk, fetched over the network only when that component is first rendered, rather than being included in the app's initial bundle — the browser downloads less JavaScript up front, which is a real win for a large route or feature that most users never visit in a given session.</p>\n      <p>The cost is a network round-trip the first time that lazy component is actually needed, during which the <code>&lt;Suspense&gt;</code> fallback shows — so splitting too aggressively (every small component gets its own chunk) trades a slightly smaller initial bundle for a proliferation of tiny network requests and loading-spinner flashes throughout the app, which can feel worse than one clean initial load, especially on a slow connection where each extra round-trip has real latency cost. The practical heuristic: split at route boundaries and genuinely large, infrequently-used features (a rich text editor, a charting library used on one settings page), not at the level of every individual component.</p>"
},
{
  "id": "b27-22",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "React Fiber — what problem the rearchitecture actually solved.",
  "difficulty": "Senior",
  "tags": ["React", "Fiber", "Reconciliation", "React Hooks & Fundamentals"],
  "question": "React rewrote its internal reconciler as 'Fiber' several years ago. What was actually broken about the old stack-based reconciler that Fiber fixed?",
  "answer": "<p>The pre-Fiber reconciler walked the component tree recursively using the JavaScript call stack itself — once it started reconciling a tree, it couldn't pause partway through, hand control back to the browser to handle an urgent event (a keystroke, a click), and resume later, because that would mean pausing in the middle of a native call stack, which JavaScript's synchronous execution model doesn't support. A large enough tree update could block the main thread for long enough to visibly freeze user input.</p>\n      <p>Fiber restructures the work into a linked list of units of work (\"fibers\") that can be processed incrementally, one small chunk at a time, checked against a deadline, and yielded back to the browser between chunks if something more urgent needs attention — reconciliation becomes interruptible and resumable instead of one uninterruptible synchronous pass. This isn't just an internal cleanup; it's the foundation everything built afterward depends on — concurrent rendering, <code>useTransition</code>, <code>Suspense</code>'s ability to pause and resume rendering, and prioritizing an urgent update over a low-priority one are all only possible because Fiber made rendering interruptible in the first place.</p>"
},
{
  "id": "b27-23",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Reconciliation's element-type rule — why changing a tag type remounts the whole subtree.",
  "difficulty": "Mid",
  "tags": ["React", "Reconciliation", "Diffing", "React Hooks & Fundamentals"],
  "question": "Why does swapping <div> for <section> at the same position in the tree destroy and recreate every child inside it, rather than just updating the wrapper?",
  "answer": "<p>React's diffing algorithm compares elements at the same tree position across renders, and its very first check is the element's type. Different types (<code>&lt;div&gt;</code> vs <code>&lt;section&gt;</code>, or <code>ComponentA</code> vs <code>ComponentB</code>) are assumed to produce structurally different trees underneath, so React doesn't attempt to diff their children against each other at all — it tears down the entire old subtree (unmounting every component inside it, losing all their internal state) and builds the new subtree from scratch, even if the actual JSX inside is identical.</p>\n      <p>This is a deliberate heuristic trade-off, not an oversight: exhaustively comparing children across genuinely different element types to find what could theoretically be reused would be far more expensive than assuming a type change means \"different enough, start over\" — and in practice a type change usually does correspond to a real structural change. The practical consequence worth knowing: conditionally rendering two different wrapper types around the same children (<code>condition ? &lt;div&gt;{children}&lt;/div&gt; : &lt;section&gt;{children}&lt;/section&gt;</code>) unmounts and remounts every child on every toggle, losing their state — keeping the wrapper type stable and toggling a class or attribute instead avoids that unnecessary remount.</p>"
},
{
  "id": "b27-24",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Synthetic events — why React wraps native browser events at all.",
  "difficulty": "Mid",
  "tags": ["React", "Synthetic Events", "Event Handling", "React Hooks & Fundamentals"],
  "question": "Why does React wrap native DOM events in its own SyntheticEvent object instead of just handing you the browser's native event directly?",
  "answer": "<p>Historically, this bought two things: a consistent event API across browsers that had genuinely inconsistent native event implementations (less relevant today with modern evergreen browsers, but the abstraction remained), and event delegation — rather than attaching a real event listener to every single DOM node that has an <code>onClick</code>, React attaches one listener at the root of the app and figures out which component's handler to invoke based on where the event originated, dramatically cutting down the number of actual native listeners for a large app.</p>\n      <p>The practical detail worth knowing: SyntheticEvent objects are pooled in older React versions (recycled after the handler returns for performance, so accessing an event property asynchronously after the handler exits could read a nulled-out reused object — a live footgun that required explicitly calling <code>event.persist()</code> to opt out of) — React 17+ removed pooling, so this specific gotcha is gone, but understanding why it existed explains a fair amount of odd-looking legacy code that calls <code>persist()</code> or copies event properties into local variables before an async operation.</p>"
},
{
  "id": "b27-25",
  "category": "full-stack",
  "categoryName": "Full Stack",
  "topic": "React Hooks & Fundamentals",
  "title": "Testing a custom hook in isolation with renderHook.",
  "difficulty": "Mid",
  "tags": ["React Testing Library", "renderHook", "Custom Hooks", "React Hooks & Fundamentals"],
  "question": "How do you actually test a custom hook without building a throwaway component just to call it?",
  "answer": "<p>A hook can only be called from inside a component's render — there's no way to invoke <code>useMyHook()</code> directly from a plain test function, since hooks depend on React's internal per-component call-order tracking. Historically, testing one meant building a minimal wrapper component whose only job was rendering the hook and exposing its return value somewhere the test could read.</p>\n      <p><code>renderHook</code> (from React Testing Library) does exactly that wrapping for you — it mounts a hidden, minimal test component that calls the hook, and gives the test a <code>result.current</code> handle to the hook's return value plus a <code>rerender</code> function to simulate the component re-rendering with new arguments. Testing an effect's async behavior or a state update triggered by an action still needs wrapping the triggering call in <code>act()</code> (or the library's <code>waitFor</code>) so React's state updates and effects flush before the assertion runs — the same requirement as testing components generally, just applied to a hook's isolated behavior instead of full rendered output.</p>"
}
);
