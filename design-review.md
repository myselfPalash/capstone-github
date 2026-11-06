# Design Review: Welcome HTML Page (Personalized Message)

Review round: 1
Run branch: story/welcome-html-page-20261106082359-e683a9bb (as given in the delegation; no git command was run by the reviewer)
Reviewed: architecture.md against requirements.md (Confluence page 786433, version 2)
Approval status: NOT APPROVED (automated review only). This is not human approval.

Supersession notice: This file replaces the earlier design review for the story "Welcome to EPAM." The user authorized replacing prior-run lifecycle files on this run branch. The old version remains in git history. Prior decisions that still apply are carried forward below (D-1 to D-4 acceptance, open questions treated as assumptions).

## Summary
The design is one static `index.html` with a single `<h1>Welcome to Epam, Palash!!</h1>`, with no script and no external resources. It is proportionate to the story and traces FR-1 to FR-4 and AC1 to AC4 to design elements. I found no blocking or high findings.

## Findings

### Blocking
None.

### High
None.

### Medium
- M-1: The design updates the existing `index.html` in place (D-1), and the old "Welcome to EPAM." text must be fully removed. The design does not say how the plan should handle the existing file, for example by reading it first to confirm it is the earlier story's file. Overwriting without checking could discard unrelated user content.
  - Mitigation: the plan should read the current `index.html` before editing. If it holds more than the old welcome page, preserve that content or stop and report it. Replace only the old message and structure. This matches the requirements' supersession notice, which expects an update.
- M-2: Where the verification check lives and how it runs is left to planning (architecture section 7). It is unclear whether the script is committed or only run, and the manual browser open is "optional". AC4 ("opens successfully in a web browser") is then only indirectly evidenced by a static check.
  - Mitigation: the plan decides whether the script is committed. The script must use no new dependencies. Verification records only checks that actually ran. If no real browser open was done, verification must say AC4 was inferred from static checks and not claim a browser run.

### Low
- L-1: The viewport meta tag (D-4) is optional and goes slightly beyond the stated scope. It is harmless and labelled. Decision: keep it.
- L-2: The title "Welcome" (D-2) is a placeholder, labelled and non-blocking.
- L-3: The AC3-T check forbids `<a>`, `<link>` and `<img>`, which is stricter than the requirements need. It is consistent with the "no external resource" design and is acceptable.
- L-4: "Clearly visible" depends on browser default styling (A-5). There is no numeric threshold, and the architecture labels this as a limitation. If a stylesheet is ever added, the "no hiding or off-screen CSS" check must be rerun.
- L-5: The stale-text check searches for "Welcome to EPAM." case-sensitively. The plan should also search case-insensitively for "epam" occurrences other than the exact required phrase, so variants such as "EPAM" in comments or the title are caught.

## Assessment by area
- Completeness and traceability: complete. Every FR and AC maps to a design element.
- Component boundaries: clear. There is one deliverable, the browser is external, and the verification check is not shipped.
- Data flow: trivial and correct. There is no input, state or network call.
- Security and trust boundaries: appropriate. There is no script, input or external resource, so there is no injection surface. Story text is treated as untrusted and only the literal ASCII phrase is used. The only personal data is the first name given in the story. Hosting headers such as HTTPS and CSP are out of scope and labelled as such.
- Failure behavior and reliability: adequate for a static page. Missing file, encoding, altered text and stale text are covered.
- Testability: good. Exact match, stale-text and no-forbidden-elements checks are simple and dependency-free. AC4 is the weakest point (M-2).
- Scope: no creep. The out-of-scope list is explicit.

## Decisions
- D-1 to D-4 from architecture.md are accepted as labelled, unconfirmed assumptions: `index.html` at the repo root updated in place, title "Welcome", `<h1>`, and the viewport tag. A human has not confirmed them.
- Open questions 1 to 5 in architecture.md section 11 are treated as assumptions and not as failures. None makes the design unsafe.
- Mitigations M-1 and M-2 and L-5 are carried into planning.

## Recommended architecture revisions
None required for PASS. Optionally add to the architecture a note that the implementer must read the existing `index.html` first (M-1), and that the AC4 evidence is static unless a browser was actually used (M-2).

## Outcome
PASS (automated review only; no human approval implied). No unresolved blocking or high findings. Round 1.

RESULT: PASS
