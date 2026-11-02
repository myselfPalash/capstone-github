## Summary
Adds a single static `index.html` that displays "Welcome to EPAM." in an `<h1>`, so a user can see that the application has loaded. There is no backend, script or external resource. A small text-based check script is included to verify the page. Design review, code review and verification were all automated, and no human approval is implied. This is a draft PR awaiting human review.

## Changes Made
Branch `story/welcome-page-20261102084509-791e9e7a`, based on `main`. `README.md` was not modified.

Deliverable
- `index.html` (new): HTML5 document with `lang="en"`, `meta charset="utf-8"`, a viewport meta tag, the title "Welcome", and one `<h1>Welcome to EPAM.</h1>`. It has no script, link, image, form or anchor. Covers FR-1 to FR-3 (R1 to R3).
- `tests/verify-welcome.cmd` (new): a Windows batch check using only built-in `cmd.exe` and `findstr`. It runs four checks: the file exists and is non-empty; the exact case-sensitive heading; the doctype, `html lang` and `meta charset` markers; and the absence of forbidden content (script, form, link, img, anchors, iframe, http/https, src=, href=). It exits 0 only if all checks pass. It takes an optional path argument.

Lifecycle artifacts (new, repo root, automated drafts)
- `requirements.md`: requirements, acceptance criteria, assumptions and open questions, traced to the story.
- `architecture.md`: single-file static design, trust boundaries and testability.
- `design-review.md`: automated review, Round 1, RESULT: PASS, no blocking or high findings (2 medium, 4 low).
- `impl-plan.md`: tasks T1 to T5, the overwrite protection for `index.html`, and the check design.
- `verification.md`: recorded commands and results.
- `pr-draft.md`: this description.

## Test Evidence
Source: `verification.md`. Automated verification only.

1. Positive run of `cmd /c "C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd"` against the real `index.html`:
   - PASS: file exists and is non-empty
   - PASS: exact heading text
   - PASS: doctype, html lang, meta charset present
   - PASS: no forbidden content
   - RESULT: ALL CHECKS PASSED. Exit code 0.
2. Negative control against an altered copy kept outside the repo. The trailing period was removed from the heading, and `<script>1</script><a href="http://x">x</a>` was inserted.
   - Result: FAIL on exact heading text and on forbidden content (`<script`, `<a `, `http:`, `href=`).
   - RESULT: ONE OR MORE CHECKS FAILED. Exit code 1, as expected.
3. Static inspection of `index.html`: a single `<h1>Welcome to EPAM.</h1>`, with no scripts, links, forms or images.

Requirement outcomes as recorded:
- FR-1, FR-2 and FR-3: pass at the text level only.
- AC2: passes at source level, but rendering was not verified.
- AC1: only partially evidenced (file existence and structural markers).
- FR-4: not verified at runtime.

**T5, the manual browser check, was NOT run.** No claim is made that the page was loaded or rendered in a browser. No CI evidence exists or is claimed, and no other test suites exist in the repo.

## Known Limitations
- No browser load was performed (T5 not run), so FR-4 and AC1 are not verified by actual loading or rendering.
- The check is text-based (`findstr`). It is not an HTML parser or renderer, and it does not test visual display, console errors or failed resource requests.
- The forbidden-content list is a heuristic. The check relies on the `<h1>` being on a single line.
- The check script is Windows-only (`cmd.exe`).
- The title "Welcome", the `<h1>` choice, the viewport meta tag, and the file name and location (`index.html` at the repo root) are unconfirmed assumptions. There is no styling, accessibility audit or browser-support target.
- Committing `tests/verify-welcome.cmd` was a default decision. The plan notes it can be dropped without affecting `index.html`.
- The preflight check that no `index.html` exists on `main` is recorded as plan task T1; `verification.md` does not record its output, so reviewers should confirm it.
- Design review, code review and verification were automated. None of them is human approval.

## Reviewer Checklist
- [ ] Confirm that this draft PR is intended, and that no merge or ready-for-review happens without separate human authorization.
- [ ] Open `index.html` in a browser and confirm it loads without error and shows "Welcome to EPAM." (the T5 gap).
- [ ] Confirm the file name and location, the title "Welcome", the `<h1>` and the viewport tag, or request changes.
- [ ] Confirm no `index.html` already existed on `main`, and that nothing was overwritten.
- [ ] Decide whether `tests/verify-welcome.cmd` should be committed or dropped.
- [ ] Confirm the scope: no backend, scripts, forms, navigation or additional functionality (R3).
- [ ] Decide whether the lifecycle `.md` artifacts belong in the repo.
- [ ] Confirm there are no secrets or personal data in the changed files.
- [ ] Re-run `cmd /c "<repo>\tests\verify-welcome.cmd"` and confirm exit code 0.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
