# Implementation Plan: Welcome Page

Run branch: story/welcome-page-20261102084509-791e9e7a (expected; T1 verifies it)
Inputs: requirements.md, architecture.md, design-review.md (Round 1, RESULT: PASS, automated review only)
Approval status: NOT APPROVED. Automated draft; no human approval is implied.
Status of all work: PLANNED. Nothing below has been implemented or run yet.

## 1. Preconditions confirmed by the planner
- requirements.md, architecture.md and design-review.md exist in the delivery repo root; design review is PASS with no blocking or high findings.
- At planning time, the working tree of this branch holds only README.md, requirements.md, architecture.md, design-review.md (no index.html and no tests directory were seen). This is a point-in-time observation; T1 must re-check it.
- Other story branches from earlier runs exist locally and on origin. Whether any of them (or main) contains an `index.html` is NOT verified by the planner (answers review finding M-1 via T1).

## 2. Review findings carried into the plan
| Finding | Handling |
|---------|----------|
| M-1 existing index.html must not be silently overwritten | T1 preflight check; T2 is blocked by T1 and is create-only (see 4.1). |
| M-2 where the verification check lives and how it runs | Decided in section 5: committed file `tests/verify-welcome.cmd`, run with `cmd /c`. Created in T3, executed in T4. |
| L-1 viewport tag, L-2 placeholder title, L-3 strict FR-3 check, L-4 no support target | Accepted as labelled assumptions; no extra tasks. |

## 3. Tasks

Priority order is P1 first. Each task is sized for one implementation-agent delegation. Status of every task: PLANNED.

| ID | Pri | Task | Depends on | Maps to | Done when (verifiable) |
|----|-----|------|-----------|---------|------------------------|
| T1 | P1 | Preflight: confirm branch and that no `index.html` already exists. | none | M-1, FR-1 | (a) `git branch --show-current` prints `story/welcome-page-20261102084509-791e9e7a`. (b) `index.html` is absent from the working tree (path `C:\Users\PalashManna\Desktop\capstone-github\index.html`). (c) `git ls-tree -r --name-only main` and the same for `origin/main` do not list `index.html` (read-only; no checkout). (d) The result of (a)-(c) is stated in the implementer's report. If any check shows an existing `index.html`, T2 to T4 stay blocked and the agent reports a blocker without modifying that file. |
| T2 | P1 | Create `index.html` at the repo root with the exact content in 4.2, using a create-only write. | T1 (outcome: absent) | FR-1, FR-2, FR-3, FR-4, AC1, AC2 | File exists; content matches 4.2; contains exactly one `<h1>Welcome to EPAM.</h1>`; no `<script>`, `<link>`, `<img>`, `<form>`, `<a>` and no `http` or `//` string; README.md and the lifecycle `.md` files unchanged (`git status --short` shows only `index.html` as new, plus any tests file from T3). |
| T3 | P1 | Create the verification check `tests/verify-welcome.cmd` per section 5. | T1 (branch confirmed; `tests/verify-welcome.cmd` also must not already exist). Independent of T2 content, so may run before or after T2. | AC1-T, AC2-T, FR-3, M-2 | File exists; uses only built-in `cmd.exe` and `findstr`; takes an optional path argument; prints a PASS or FAIL line per check; exits 0 only if all checks pass, 1 otherwise. |
| T4 | P1 | Run the check against `index.html` and record the real output (positive run). Then run a negative control against a temporary altered copy kept in the scratchpad or temp directory (not committed). | T2, T3 | AC1-T, AC2-T, FR-2, FR-3, FR-4 | Positive run: exit code 0 and every check printed as PASS. Negative control: copy with `Welcome to EPAM` (missing period) or an added `<script>` gives exit code 1 and a FAIL line. Both transcripts, with exit codes, are reported verbatim. Temp copy is not left in the repo. |
| T5 | P2 | Optional manual browser check: open `index.html` via `file://` in any available browser. | T2 | AC1, AC2, FR-4 | Implementer or verifier reports what was actually seen (text shown, no error), or explicitly records "not run: no browser or display available". A claim is never made without running it. |

Dependency order: T1 -> T2 -> T4; T1 -> T3 -> T4; T2 -> T5.

Not planned (out of scope, per requirements section 7): CSS, JavaScript, frameworks, CI, hosting, additional pages, README edits.

## 4. Task details

### 4.1 Overwrite protection (M-1), applies to T1, T2, T3
- T1 is the gate. T2 and T3 must re-check immediately before writing that their target path does not exist (a Write over an unread existing file is not allowed).
- If `index.html` exists on this branch, on `main`, or in the working tree: do NOT overwrite, rename or delete it. Stop and report a blocker. Documented alternatives for the orchestrator or a human to choose (not chosen by the plan): (1) keep the existing file and verify whether it already satisfies FR-2 (T3/T4 then run against it, with no edit); (2) a different file name, which requires a requirements change (A-2 / open question 1).
- Existing `index.html` on other story branches is NOT a blocker by itself, because those are separate branches; it is only relevant if it is present on `main` or in this working tree. This is an assumption.

### 4.2 Exact content of `index.html` (T2)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome</title>
</head>
<body>
  <h1>Welcome to EPAM.</h1>
</body>
</html>
```
- ASCII only, no BOM, one h1 on a single line (so the line-based check works). Title "Welcome" and the viewport tag are labelled assumptions (D-2, D-4).

## 5. Verification check design (M-2)

- Location: `C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd`. Assumption: it is committed to the delivery repo as a small test artifact (the architecture calls it "not shipped" meaning it is not part of the page deliverable). If the reviewer prefers no extra files, T3 can instead be run from the scratchpad and not committed; this is an open scope question (section 8).
- Technology: a Windows batch file using only `cmd.exe` and `findstr`, both built into Windows. No Node, Python, PowerShell or package is needed, because their availability is unknown. A `.cmd` file is not subject to the PowerShell execution policy.
- How to run (from any directory):
  `cmd /c "C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd"`
  Optional argument: path of the html file to check (default is `..\index.html` relative to the script, resolved via `%~dp0`). Quote paths that contain spaces.
- Checks (each prints `PASS: <name>` or `FAIL: <name>`; exit code 0 only if all pass):
  1. File exists and is non-empty (AC1-T).
  2. Exact, case-sensitive match of the string `<h1>Welcome to EPAM.</h1>` using `findstr /C:"<h1>Welcome to EPAM.</h1>"` (default findstr is case-sensitive; do not pass `/I`) (AC2-T, FR-2).
  3. Doctype, `<html lang="en">` and `<meta charset="utf-8">` are present (FR-4; light structural proxy for "parses").
  4. None of these appear (case-insensitive, `findstr /I /C:...`): `<script`, `<form`, `<link`, `<img`, `<a `, `<a>`, `<iframe`, `http:`, `https:`, `src=`, `href=` (FR-3, no external references so no failed requests).
- Known limitation (label in verification.md): this is a text-based check, not a real HTML parser or a rendering test. It cannot prove how a browser renders the page; T5 covers that only if actually run. Line-based matching assumes the h1 is on one line, as fixed in 4.2.
- Verification must record only checks that actually ran, including any failures (CLAUDE.md convention).

## 6. Test coverage map
| Requirement | Task(s) | Check |
|-------------|---------|-------|
| FR-1 single static page | T2 | `index.html` is the only new page file (git status in T2) |
| FR-2 exact text | T2, T3, T4 | check 2 (positive + negative control) |
| FR-3 no extra functionality | T2, T3, T4 | check 4 |
| FR-4 loads without error | T3, T4, T5 | checks 1, 3 and 4; manual T5 if possible |
| AC1 / AC1-T | T4, T5 | checks 1, 3, 4; T5 |
| AC2 / AC2-T | T4, T5 | check 2; T5 |
| M-1 | T1, T2 | preflight evidence and create-only write |
| M-2 | T3, T4 | section 5 |

## 7. Assumptions (unconfirmed; none have human approval)
- P-1: D-1 to D-4 from architecture.md hold (`index.html` at repo root, title "Welcome", `<h1>`, viewport tag).
- P-2: `cmd.exe` and `findstr` are available (Windows 11, planning environment); T4 will show this by running.
- P-3: The `tests/` directory and `verify-welcome.cmd` are acceptable to commit.
- P-4: Other story branches containing an `index.html` do not affect this run.
- P-5: Each task is delegated separately, and T2 and T3 may be combined in one delegation by the orchestrator if it prefers fewer round trips (they are independent and both small).

## 8. Unresolved scope questions and blockers
- Blockers: none at planning time. Conditional blocker: if T1 finds an existing `index.html` on `main` or in the working tree, T2 to T4 are blocked pending a human or orchestrator decision (see 4.1).
- Open scope question 1: commit the verification check (`tests/verify-welcome.cmd`, default here) or run it uncommitted? Default proceeds with committing; a reviewer can drop T3's commit without affecting T2.
- Open questions inherited from requirements.md and architecture.md (file name, title text, styling, support target) stay as labelled assumptions and do not block.

## 9. Completed work
None. This section is to be updated by later stages with only work that actually happened.
