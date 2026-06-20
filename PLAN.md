# Cult Simulator — Concurrency-First Build Plan

Goal: 3 people building **fully in parallel**, zero idle time waiting on each
other, plus a system architecture where the 4 ideologies actually run
concurrently (not one-at-a-time) — matching MonadDB's async concurrent
read/write model.

---

## Step 0 (first 20–30 min): Lock the Contract, Then Split

This is the single biggest unlock for parallelism. Before any feature work
starts, freeze the shared data shapes in one file everyone imports
(`types.ts` / `schema.json`). Once this is locked, nobody needs to wait for
anyone else's real implementation — they build against the contract + mock
data and swap in the real thing later.

```ts
Ideology   { id, name, founderProphetId, doctrine, doctrineVersion, followers, reputation, treasury }
Prophet    { id, ideologyId, personality, history, goal }
Doctrine   { ideologyId, version, text, reason, timestamp }
Event      { type, ideologyId, payload, timestamp }   // join | doctrine_change | schism | alliance
Feedback   { ideologyId, userId, text, timestamp }
Schism     { parentIdeologyId, newIdeologyId, justification, timestamp }
```

Whoever finalizes this fastest pushes it first — everyone else pulls and
starts immediately. Don't refine it further mid-build; patch later if truly
broken.

## Step 1: Mock Everything, Block on Nothing
- User 1 ships a **hardcoded JSON** for all 4 ideologies/prophets in the
  first 30 min, before the real LLM calls are wired. Users 2 and 3 build
  against this immediately.
- User 2 ships a **stub Monad writer** (writes to local JSON/in-memory store
  with the same function signature the real chain call will have) so Users
  1 and 3 never wait on testnet latency or contract deploys.
- User 3 builds the UI against the mock data from minute 1 — never blocks
  on real backend responses.
- Real implementations get swapped in behind the same interface later —
  this is what makes the three tracks truly independent.

## Step 2: Git Workflow for Parallel Commits
- 3 branches: `agent-brain`, `chain-state`, `experience`. Each owner commits
  freely on their own branch, no PR review overhead during build hours.
- Merge to `main` only at the sync checkpoints below — not continuously —
  to avoid merge conflicts interrupting flow.
- Anyone touching the shared contract file does it in a 2-minute Slack/call
  sync, not silently — it's the only shared surface.

---

## System-Level Concurrency (the architecture itself)

Don't process the 4 ideologies sequentially — run them concurrently so the
build actually showcases Monad's async concurrent state model:

- **Reflection cycle**: instead of a for-loop over 4 ideologies, fire all 4
  reflection calls concurrently (`Promise.all` / async task queue). Each
  ideology's reflection is independent — no shared state between them — so
  there's no contention.
- **MonadDB writes**: scope every write by ideology ID as the key prefix
  (`ideology:{id}:doctrine`, `ideology:{id}:followers`). Since each
  ideology owns its own keyspace, concurrent writes from 4 simultaneous
  reflection cycles never collide — this is exactly what MonadDB's async
  concurrent read/write model is built for.
- **LLM calls**: batch/fire concurrently, not sequentially, both for the 4
  prophets' reflections and (later) the Schism Generator and Prophet Debate
  multi-agent calls.
- **Event Feed**: subscribes to writes rather than polling in a loop, so it
  doesn't serialize behind the reflection cycle.

This also speeds up dev itself: User 1 can test all 4 ideologies' reflection
logic in one concurrent run instead of waiting 4x sequential LLM round-trips.

---

## Ownership (unchanged — by USP)

| Track | Owner | Features |
|---|---|---|
| Agent Intelligence | User 1 | F1 Prophet Creation → F5 Reflection Cycle ⭐ → F7 Schism Generator ⭐⭐⭐ |
| Chain & State | User 2 | F3 Join → F4 Influence Doctrine → F6 Doctrine Versioning → F10 Monad Integration |
| Experience | User 3 | F2 Talk To Prophet → F8 Event Feed → F9 Prophet Debate |

## Compressed Timeline (10 hours, minimal sync overhead)

| Hour | User 1 | User 2 | User 3 |
|---|---|---|---|
| 0–0.5 | Lock contract + push hardcoded ideologies | Lock contract + stub Monad writer | Pull contract, scaffold UI on mocks |
| 0.5–2 | Real LLM gen for F1 | F3 Join Ideology | F2 Talk To Prophet |
| 2–5 | F5 Reflection Cycle ⭐ (concurrent across 4 ideologies) | F4 Influence Doctrine | F8 Event Feed v1 |
| 5–7 | F7 Schism Generator ⭐⭐⭐ | F6 Doctrine Versioning + real Monad write-through | F8 Event Feed v2 (schisms, alliances) |
| 7–9 | Tune cadence/seed beliefs so schism fires live | Finalize chain integration, clean repo | F9 Prophet Debate (if time) |
| 9–10 | **All three: merge, integration test, dry-run demo together** |

## Sync Checkpoints (kept to 3, not 5 — minimize interruptions)
1. **Hour 0.5** — contract locked, everyone unblocked and building independently.
2. **Hour 5** — merge branches, confirm reflection cycle visibly evolves a doctrine end-to-end.
3. **Hour 9** — merge branches, confirm a schism has fired, full demo dry run.

## Speed Rules
- No PR reviews during build — merge to main only at checkpoints.
- Mock first, wire real integrations second, never block on someone else's real implementation.
- If a real dependency isn't ready at a checkpoint, keep the mock and move on — swap later, don't wait.
- Cut F9 Prophet Debate first if time runs short — it's the only feature with no hard dependency from another user.

## Monad Blitz Submission Checklist
- [ ] Live deployment URL
- [ ] Public GitHub repository
- [ ] README with setup instructions
- [ ] 3-minute demo script rehearsed
- [ ] Reflection Cycle demonstrably evolving a doctrine, run concurrently across ideologies
- [ ] At least one Schism demonstrably occurring
- [ ] Monad Integration confirmed (identity, doctrine versions, schism/alliance records)
- [ ] Prophet Debate (F9) — only if time remains, not required for MVP