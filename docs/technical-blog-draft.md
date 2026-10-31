# Why our clinic assistant starts without an LLM

*A technical design note for the Avian Vet project*

It is tempting to begin an AI product with a model call. For a veterinary care assistant, that puts the most variable component at the center before we know whether the product has the right boundaries or trustworthy source material.

Our first version separates clinic records from the care library. A patient lookup goes through the API to MariaDB. A general care question goes to a retrieval function that can read only approved reference files. The function returns the source excerpt, a scope reminder, and a clear fallback when it finds no useful match. This is a small design choice with a useful property: the assistant cannot silently personalize general content from a patient's chart.

The retrieval baseline is intentionally simple. It counts overlapping terms in local reference files. That is not a claim of high search quality; it is a measurable starting point. We can build a clinician-authored query set and inspect missed sources before adding embeddings or generation. If a later model rewrites retrieved material, we can compare its answers against the same source set and test whether its citations actually support its claims.

This sequence also changes how we define success. A polished paragraph is not enough. The product needs to find relevant reviewed material, abstain when evidence is missing, and reliably direct emergency or patient-specific questions to a veterinarian. We will measure those outcomes on a held-out set reviewed by clinicians, and keep explicit release gates for unsafe recommendations.

The tradeoff is that the current system is not yet a useful clinical assistant. Its corpus is illustrative, keyword matching is crude, and safety language is not a substitute for clinical validation. That is deliberate: a transparent prototype makes the missing work visible. The next step is not to turn on a model switch; it is to approve the knowledge sources, write evaluation cases, and establish privacy and incident processes. Only then can a model improve the user experience without obscuring the evidence or the product's limits.
