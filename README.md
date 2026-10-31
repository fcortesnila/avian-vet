# Avian Vet

A production-minded starter for an avian veterinary clinic: appointment and patient records, with a citation-grounded care information assistant. The assistant is informational only; it does not diagnose, triage emergencies, or replace a veterinarian.

## Stack

- **API:** Python 3.12, FastAPI, SQLAlchemy, MariaDB
- **Web:** React, TypeScript, Vite, Tailwind CSS
- **Local orchestration:** Docker Compose (web, API, persistent database)
- **Quality and delivery:** pytest, Vitest, GitHub Actions CI, Terraform AWS ECS/Fargate deployment starter

## Run locally

1. Copy `.env.example` to `.env` and set `MARIADB_ROOT_PASSWORD` and `MARIADB_PASSWORD`.
2. Run `docker compose up --build`.
3. Open http://localhost:5173 and API docs at http://localhost:8000/docs.

The database data is stored in the named `mariadb_data` volume. For development outside Docker, see each package's README. Seeded assistant material is in `backend/app/knowledge/` and deliberately uses short, illustrative clinic guidance. Replace it with reviewed, versioned clinic policy before any real use.

## Project evidence

- `docs/architecture.md` explains the system boundaries, data flow, and safety controls.
- `docs/ai-product-plan.md` describes the AI product lifecycle, evaluation, and release gates.
- `docs/technical-blog-draft.md` is a publishable design-decision draft.
- `docs/portfolio-and-application.md` provides an honest template for surfacing senior-level production experience; fill only with verifiable details.
- `.github/workflows/ci.yml` runs API and frontend checks on pull requests.
- `infra/terraform/` is an AWS ECS/Fargate deployment foundation, not a deployed environment. It needs account-specific networking, secrets, domain/TLS, registry, and review.

## Scope and limitations

This scaffold demonstrates a product direction, not a clinically validated system. The assistant uses a simple local retrieval baseline and returns citations; it has no external LLM provider configured. Add a provider behind the assistant interface only after privacy review, clinical approval, and the offline evaluation gates in the AI plan. Never enter real client or patient information into a third-party model without authorization and appropriate contracts.

## License

Use and adapt subject to your project requirements.
