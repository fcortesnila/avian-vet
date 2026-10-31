# AI product lifecycle: clinic care information assistant

## Product goal

Help clinic staff and bird owners locate clinic-approved general care material quickly, while directing individual medical decisions and urgent symptoms to a veterinarian. Measure useful, correctly sourced answers and safe abstention—not answer fluency.

## User and product boundaries

- Initial user: clinic staff testing general information retrieval.
- In scope: answer from an approved care corpus, show source and excerpt, abstain when there is no match, provide clinic contact/emergency guidance.
- Out of scope: diagnosis, medication dosing, patient-specific recommendations, autonomous triage, or replacing a clinician.
- Patient records are excluded from retrieval and model context.

## Lifecycle

1. **Design:** map common care questions with clinicians; classify urgent, patient-specific, and general requests. Complete privacy/threat modeling and identify data handling constraints.
2. **Corpus:** use versioned, dated clinic materials. Record author/reviewer, species scope, expiry/review date, and source. Remove stale material through a review workflow.
3. **Baseline:** deterministic retrieval establishes query logs without PHI, citations, and abstention behavior. Current implementation is a scaffold, not a released product.
4. **Model integration:** only behind a server-side provider interface. Send minimum necessary query and retrieved snippets; do not include patient identifiers. Configure contractual privacy protections, retention, and regional processing before provider selection.
5. **Evaluation:** maintain a clinician-authored holdout set containing common queries, ambiguous questions, emergency prompts, unsupported topics, and adversarial phrasing. Score citation support, retrieval recall, abstention, unsafe specificity, and escalation consistency. Require clinician signoff on every release candidate.
6. **Launch:** staff-only pilot; feature flag; feedback/reporting; rollback path; monitor latency, retrieval failures, abstentions, and safety incidents. Expand only after a documented review.

## Proposed release gates

- 100% of supported answers cite an approved source; no citation fabricated by generation.
- Zero critical unsafe recommendation in the clinician-reviewed emergency and medication test set.
- Unsupported or patient-specific questions abstain in at least 95% of the labeled set.
- Every answer includes scope reminder and urgent escalation instruction.
- No request or response logs contain owner/patient identifiers; verify with automated redaction checks.
- Clinician owner, rollback owner, corpus review date, and incident route are assigned.

Thresholds are proposed targets, not results. Establish baseline metrics with clinicians and revise before real use. Never represent passing a finite test suite as proof of clinical safety.

## Observability and incident response

Record request IDs, latency, corpus version, retrieval source IDs, and outcome category. Exclude raw queries by default; if sampled queries are needed for evaluation, obtain authorization, redact, restrict access, and set a short retention period. Provide a one-step assistant disable switch. Route suspected harmful output to a clinician owner for review and document corrective action.

## Next implementation increments

1. Add ORM integration tests with disposable MariaDB and migration tooling.
2. Add auth/RBAC and audit event design before any real records are entered.
3. Build a clinician-reviewed evaluation corpus and deterministic scorer.
4. Add provider abstraction plus mocked provider tests; make model access opt-in.
5. Add staged deployment, smoke tests, dashboards, alerts, backups, and restore verification.
