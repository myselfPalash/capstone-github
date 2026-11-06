# Verification: Welcome HTML Page (Personalized Message)

Run branch: story/welcome-html-page-20261106082359-e683a9bb
Source story: Confluence page ID 786433 ("Welcome to Epam, Palash!!")
Inputs: requirements.md, impl-plan.md, architecture.md; code review round 1 = PASS (automated).
Approval status: NOT APPROVED. Automated verification only; no human approval is implied.

Supersession notice: this file replaces the earlier verification for story "Welcome to EPAM." The user authorized replacing prior-run lifecycle files on this run branch; the old version is in git history.

## 1. Commands actually run

Shell: Git Bash with `MSYS_NO_PATHCONV=1`, invoking `cmd /c`. Test script: `C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd` (findstr-based text checks; not an HTML parser or renderer).

Negative-control copies were created OUTSIDE the repo (derived from index.html via sed) in:
`C:\Users\PALASH~1\AppData\Local\Temp\claude\efe6019c425b481c\7afc8d8b-8809-4881-8fdf-ea1d996e4ea9\scratchpad\v`

### 1.1 Positive run on the deliverable

Command: `cmd /c "C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd" "C:\Users\PalashManna\Desktop\capstone-github\index.html"`

```
Checking: C:\Users\PalashManna\Desktop\capstone-github\index.html
PASS: file exists and is non-empty
PASS: exact heading text
PASS: no stale epam text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ALL CHECKS PASSED
EXIT=0
```

### 1.2 Negative controls (expected to FAIL)

Note on a discarded attempt: my first negative-control loop had a shell quoting error (`\$f` was passed literally), so the script reported "FAIL: file exists and is non-empty" with exit 1 for a nonexistent path. Those results were NOT real control results and are discarded. The runs below are the corrected, real ones.

Command pattern: `cmd /c "<repo>\tests\verify-welcome.cmd" "<scratchpad>\v\<name>.html"`

Control A: old text. `old.html` has `<h1>Welcome to EPAM.</h1>`
```
PASS: file exists and is non-empty
FAIL: exact heading text
FAIL: no stale epam text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ONE OR MORE CHECKS FAILED
EXIT=1
```

Control B: single "!". `single.html` has `<h1>Welcome to Epam, Palash!</h1>`
```
PASS: file exists and is non-empty
FAIL: exact heading text
FAIL: no stale epam text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ONE OR MORE CHECKS FAILED
EXIT=1
```
(The stale check also fails here because the altered h1 line still contains "Epam" but no longer equals the required line.)

Control C: `<!-- EPAM -->` on its own line in head, correct h1 kept. `comment.html`
```
PASS: file exists and is non-empty
PASS: exact heading text
FAIL: no stale epam text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ONE OR MORE CHECKS FAILED
EXIT=1
```

Control D: `<script></script>` line in head, correct h1 kept. `script.html`
```
PASS: file exists and is non-empty
PASS: exact heading text
PASS: no stale epam text
PASS: doctype, html lang, meta charset present
FAIL: forbidden content found: <script 
FAIL: no forbidden content
RESULT: ONE OR MORE CHECKS FAILED
EXIT=1
```

Each control exited 1 with the specific expected check failing, so the script detects these defects.

## 2. Static inspection (not runtime verification)

index.html was read directly. It contains: `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset="utf-8">`, a viewport meta, `<title>Welcome</title>`, and a single `<h1>Welcome to Epam, Palash!!</h1>` in body. No CSS, script, links, images or external resources. This is a reading of the file, not a rendered check.

## 3. Acceptance criteria checklist

| ID | Criterion | Evidence | Status |
|----|-----------|----------|--------|
| AC1 / FR-1 | Page created using HTML | Run 1.1: file exists, doctype/html lang/meta charset present (exit 0); static read shows html/head/body | PASS (text-check) |
| AC2 / FR-2 | Page displays exact text "Welcome to Epam, Palash!!" | Run 1.1 "exact heading text" PASS (case-sensitive findstr); controls A, B fail as expected | PASS (text-check) |
| AC3 / FR-3 | Message clearly visible on load | NOT tested at runtime. Static inference only: h1 in body, no CSS, no script, nothing hiding it, default browser h1 styling | NOT RUN (static inference only) |
| AC4 / FR-4 | Page opens successfully in a browser | NOT tested at runtime. Static inference only: well-formed-looking HTML5 with no external resources | NOT RUN (static inference only) |

## 4. Checks not run

- T5 (browser check): NOT RUN. No browser was launched and no page was rendered. AC3 (clearly visible) and AC4 (opens in browser) are therefore static inference only and are not claimed as runtime-verified.
- No HTML validator, accessibility, contrast, or cross-browser checks were run (unavailable/not applicable in this environment).
- No CI exists or was consulted; no CI evidence is claimed.

## 5. Limitations

- The exact-text check is a findstr substring match on the line `<h1>Welcome to Epam, Palash!!</h1>`; it is not an HTML parser and does not prove the rendered text.
- The stale-text check is substring-based: it flags any line containing "epam" (case-insensitive) other than the required h1 line, and the string "Welcome to EPAM.". It can false-positive on legitimate uses of "epam" and cannot detect stale text in other forms.
- The forbidden-content check is also substring-based (e.g. `<script`, `<a `, `http:`); it does not parse markup.
- Structural markers are checked as exact strings (case-sensitive), so equivalent valid variants would fail.
- No renderer: visibility, contrast and load success are unverified at runtime.
- Negative controls cover four defects only.

## 6. Conclusion

All executed automated checks behaved as expected: the positive run passed (exit 0) and all four negative controls failed as intended (exit 1). AC1 and AC2 are satisfied per the text-based checks. AC3 and AC4 are supported only by static inference; the browser check (T5) was not run. Status: NOT APPROVED (no human acceptance).

RESULT: PASS
