# Architecture decision record: keep clinical data and AI retrieval apart

**Status:** Starter decision, pending clinic and security review  
**Date:** 2026-10-31

## Context

Clinic workflows contain sensitive owner and patient information. A useful care information assistant must make its source material visible, constrain its scope, and have a safe response when retrieval fails. At the same time, the first increment should be easy to run and inspect locally.

## Decision

Use a three-service local topology: React/Vite client, FastAPI API, and MariaDB. Patient records live behind the API and persist in a named database volume. The assistant endpoint retrieves only from a separate, versioned clinic knowledge directory and returns source identifiers with its response. The initial retrieval implementation is deterministic keyword matching and has no model provider or access to patient records.

## Data flow

```text
Browser ── patient CRUD ──> FastAPI ──> MariaDB volume
   └──── care question ───> FastAPI ──> reviewed knowledge files
                                     └─> answer + citations + safety notice
```

## Why this boundary

- No patient record is needed to answer general husbandry questions.
- Source citations make the retrieved evidence inspectable.
- A deterministic baseline creates evaluation cases before introducing model variability.
- API separation allows adding authentication, audit events, rate limits, and a managed model behind an interface without embedding secrets in the browser.

## Security and clinical controls still required

This template lacks authentication, authorization, encryption-at-rest configuration, audit logging, retention controls, migrations, and abuse protection. Those are release blockers for real clinic data. The knowledge corpus must be authored or approved by a qualified avian veterinary team, versioned, and reviewed. Emergency language is a prompt-independent product control, but cannot ensure users recognize every urgent situation. A qualified clinician must approve escalation wording and test it.

## Alternatives considered

- **Call a hosted LLM directly from the browser:** rejected because it exposes credentials and makes privacy controls difficult.
- **Send patient context to a RAG service by default:** rejected because general care questions do not require identifiable data.
- **Start with model-generated answers:** deferred until retrieval quality, clinical review, and safety evaluation are measurable.

## Consequences

The baseline is intentionally modest and can return irrelevant material; citations and the notice are not proof of correctness. Before production, add identity and role-based access, request validation, DB migrations, structured logging without PHI, secrets management, backups/restore drills, dependency and container scanning, and integration/evaluation gates.
