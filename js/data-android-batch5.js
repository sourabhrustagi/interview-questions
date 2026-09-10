// ==========================================================
// Android Interview Questions — Batch 5
// Offline sync / conflict resolution for enterprise handheld
// scanners editing shared inventory data.
// Appends into QUESTION_DATA. Load AFTER the other data-*.js
// files, BEFORE js/app.js.
// ==========================================================
QUESTION_DATA.push(
  {
    "id": "and-b5-01",
    "category": "android",
    "categoryName": "Android",
    "topic": "Offline Sync & Conflict Resolution",
    "title": "Conflict Resolution Framework for Concurrent Offline Edits to the Same SKU",
    "difficulty": "Senior",
    "tags": ["Conflict Resolution", "Offline-first", "Field-level Merge", "Offline Sync & Conflict Resolution"],
    "question": "Two floor associates edit the allocation bounds of the same SKU cluster offline on different enterprise Android handhelds. What conflict-resolution framework — e.g. Last-Write-Wins, field-level merges, or a manual conflict queue — do you specify, and why?",
    "answer": "<p><strong>Field-level merge as the default, manual conflict queue as the fallback — never plain Last-Write-Wins here.</strong> LWW silently discards one associate's real, intentional input (a min/max allocation bound they typed on purpose) with no record it ever happened; on inventory data that's a business error hiding as a merge, not a UI nicety.</p>\n      <ul>\n        <li>Allocation bounds are largely independent fields, so merge per-field against each field's own last-synced version, not the whole record — if device A only changed <code>minUnits</code> and device B only changed <code>maxUnits</code>, both survive automatically.</li>\n        <li>Escalate to a manual conflict queue only for a true conflict — the <em>same</em> field edited differently on both devices. Don't guess; surface it to a supervisor queue, since picking one silently changes a number a person owns.</li>\n        <li>Needs a per-field <code>updatedAt</code>/version, not just a row-level timestamp, or you can't tell which fields actually collided versus which just happened to sync in the same batch.</li>\n      </ul>\n      <p>This slots into the same offline-first Room repository pattern as earlier — the sync step is where this merge logic lives, not the UI layer.</p>",
    "keyTakeaways": [
      "Never plain Last-Write-Wins on business data someone typed on purpose — it discards a real edit with no trace.",
      "Field-level merge handles the common case (different fields touched) with no human involved.",
      "Reserve a manual conflict queue for genuine same-field collisions — surface it, don't auto-resolve it.",
      "Requires per-field version/timestamp tracking, not just a row-level 'last updated' column."
    ],
    "followUp": "How would you extend this if allocation bounds had a business invariant (min <= max) that a field-level merge could silently violate?"
  }
);
