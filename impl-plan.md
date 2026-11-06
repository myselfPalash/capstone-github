# Implementation Plan: Welcome HTML Page (Personalized Message)

Run branch: story/welcome-html-page-20261106082359-e683a9bb (checked out per delegation; T1 re-verifies)
Inputs: requirements.md, architecture.md, design-review.md (Round 1, RESULT: PASS, automated review only). Source: Confluence page 786433, version 2.
Approval status: NOT APPROVED. Automated draft; no human approval is implied.
Status of all work: PLANNED. Nothing below has been implemented or run yet.

Supersession notice: This plan replaces the earlier plan for the story "Welcome to EPAM." The user authorized replacing prior-run lifecycle files on this run branch; the old version remains in git history.

## 1. Preconditions confirmed by the planner
- requirements.md, architecture.md and design-review.md exist in the delivery repo root; design review is PASS with no blocking or high findings.
- Observed at planning time (point-in-time, T1 must re-check): `index.html` exists and contains the old story's page: doctype, html lang="en", meta charset, viewport meta, title "Welcome", and `<h1>Welcome to EPAM.</h1>`, nothing else. `tests/verify-welcome.cmd` exists and checks for the old text `<h1>Welcome to EPAM.</h1>`. README.md has no match for "welcome" or "epam".

## 2. Review findings carried into the plan
| Finding | Handling |
|---------|----------|
| M-1 existing index.html must be read first and unrelated content preserved | T1 reads it; T2 edits in place, changing only the h1 message. If extra content is found, preserve it or stop and report. |
| M-2 where the check lives, how it runs, and AC4 evidence | Check stays committed at `tests/verify-welcome.cmd` (existing file, updated in T3), run with `cmd /c` in T4. No new dependencies. AC4 evidence is static (inferred) unless T5 really runs a browser. |
| L-5 case-insensitive "epam" variants | T3 adds a stale-text check: any case-insensitive "epam" occurrence outside the exact required h1 line fails. |
| L-1 to L-4 | Accepted as labelled assumptions; no extra tasks. |

## 3. Tasks

Priority P1 first. Each task fits one delegation. Status of every task: PLANNED.

| ID | Pri | Task | Depends on | Maps to | Done when (verifiable) |
|----|-----|------|-----------|---------|------------------------|
| T1 | P1 | Preflight: confirm branch and read current `index.html` and `tests/verify-welcome.cmd`. | none | M-1 | Current branch name equals the run branch. Both files were read, and the report states whether `index.html` holds anything beyond the old minimal page. If it does, T2 is blocked until that content is preserved or a blocker is reported. |
| T2 | P1 | Update `index.html` in place: replace `<h1>Welcome to EPAM.</h1>` with `<h1>Welcome to Epam, Palash!!</h1>`. Use Edit, not a full rewrite. | T1 | FR-1 to FR-4, AC1 to AC3 | `index.html` has exactly one `<h1>Welcome to Epam, Palash!!</h1>` on one line; no other "epam" text (case-insensitive) anywhere, including title and comments; all other lines unchanged; no `<script>`, `<link>`, `<img>`, `<form>`, `<a>`, `http`; ASCII only. README.md and lifecycle `.md` files untouched. |
| T3 | P1 | Update `tests/verify-welcome.cmd` for the new text (Edit in place): (a) check 2 matches `<h1>Welcome to Epam, Palash!!</h1>` case-sensitively (no `/I`); (b) add a stale-text check: `findstr /I /C:"epam"` on the target, piped to `findstr /V /C:"<h1>Welcome to Epam, Palash!!</h1>"`, must produce no output, and explicitly also fail on `Welcome to EPAM.`; (c) keep checks 1, 3, 4 and the exit-code logic. | T1. May run before or after T2. | AC1-T, AC2-T, FR-2, FR-3, L-5, M-2 | Script has no reference to the old expected text as a pass condition; built-in `cmd.exe` and `findstr` only; prints PASS or FAIL per check; exits 0 only if all pass, else 1. |
| T4 | P1 | Run the check and record real output. Positive run on `index.html`. Negative controls on temporary copies outside the repo (scratchpad or temp, not committed): (i) old text `Welcome to EPAM.`, (ii) `Welcome to Epam, Palash!` (one "!"), (iii) correct h1 plus an `<!-- EPAM -->` comment, (iv) an added `<script>` tag. | T2, T3 | AC1-T, AC2-T, FR-2, FR-3, FR-4, L-5 | Positive run: exit code 0, every check PASS. Each negative control: exit code 1 and a FAIL line. Transcripts and exit codes are reported verbatim. No temp copies left in the repo. |
| T5 | P2 | Optional browser check: open `index.html` via `file://` in an available browser. | T2 | AC3, AC4, FR-3, FR-4 | Report what was actually seen, or record "not run: no browser or display available". If not run, verification states AC3 and AC4 were inferred from static checks only. |
| T6 | P2 | README check: confirm README.md does not mention the old text, and leave it unchanged. | T1 | D-1 | Grep of README.md for "epam" and "welcome" (case-insensitive) returns nothing at implementation time, and README.md is not modified. If it does mention the old text, report it as a scope question rather than editing. |

Dependency order: T1 -> T2 -> T4; T1 -> T3 -> T4; T2 -> T5; T1 -> T6.
T2 and T3 are independent and small; the orchestrator may combine them in one delegation (assumption P-4).

Not planned (out of scope): CSS, JavaScript, frameworks, CI, hosting, additional pages, README edits, new files.

## 4. Verification approach
- How to run: `cmd /c "C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd"`. Optional argument: path of the html file to check (default `..\index.html` relative to the script).
- Limitation to carry into verification.md: this is a text-based check, not an HTML parser or rendering test. It cannot prove browser rendering, visibility or contrast. AC3 and AC4 are static inferences unless T5 actually ran.
- Verification records only checks that actually ran, including failures.

## 5. Test coverage map
| Requirement | Task(s) | Check |
|-------------|---------|-------|
| FR-1 / AC1 | T2, T4 | check 1 (file exists), check 3 (doctype, html lang, charset) |
| FR-2 / AC2 | T2, T3, T4 | check 2 exact heading; stale-text check; negative controls i to iii |
| FR-3 / AC3 | T2, T4, T5 | check 4 (no hiding or extra elements, no script); T5 if run; otherwise static only |
| FR-4 / AC4 | T4, T5 | checks 1, 3, 4 (static); T5 only if a browser was really used |
| M-1 | T1, T2 | read-first evidence; in-place edit with unchanged other lines |
| M-2 | T3, T4, T5 | committed script, real run, AC4 evidence labelled |
| L-5 | T3, T4 | stale-text check; negative control iii |

## 6. Assumptions (unconfirmed; none have human approval)
- P-1: D-1 to D-4 from architecture.md hold (root `index.html` updated in place, title "Welcome", `<h1>`, viewport tag).
- P-2: `cmd.exe` and `findstr` are available (Windows 11); T4 shows this by running.
- P-3: `tests/verify-welcome.cmd` remains committed in the delivery repo as a small test artifact.
- P-4: T2 and T3 may be combined in one delegation.
- P-5: The exact text is case-sensitive and ASCII, per A-8.

## 7. Unresolved scope questions and blockers
- Blockers: none at planning time. Conditional: if T1 finds extra content in `index.html`, T2 pauses until that content is preserved or reported.
- Open questions inherited from requirements.md and architecture.md (file name, title text, styling, support target, "clearly visible" threshold) stay as labelled assumptions and do not block.

## 8. Completed work
None. Later stages update this section with only work that actually happened.
