# Verification: Welcome Page

Branch (confirmed via `git branch --show-current`): story/welcome-page-20261102084509-791e9e7a
Status: automated verification only. No human approval is implied.

## Commands run and output

### 1. Positive run (real index.html)
Command (Bash, MSYS_NO_PATHCONV=1, stdin from /dev/null):
`cmd /c "C:\Users\PalashManna\Desktop\capstone-github\tests\verify-welcome.cmd"`

```
Checking: C:\Users\PalashManna\Desktop\capstone-github\tests\..\index.html
PASS: file exists and is non-empty
PASS: exact heading text
PASS: doctype, html lang, meta charset present
PASS: no forbidden content
RESULT: ALL CHECKS PASSED
```
Exit code: 0

### 2. Negative control (altered copy outside the repo)
Altered copy: `C:\Users\PALASH~1\AppData\Local\Temp\claude\C--Users-PalashManna-Desktop-Claude-Capstone\99e471dc-2ef2-4a47-8fb5-ad575768051a\scratchpad\altered.html`
Alteration: removed the trailing period from the heading, and inserted `<script>1</script><a href="http://x">x</a>` before `</body>`.
Command: `cmd /c "...\verify-welcome.cmd" "<altered path>"`

```
Checking: C:\Users\PALASH~1\AppData\Local\Temp\claude\C--Users-PalashManna-Desktop-Claude-Capstone\99e471dc-2ef2-4a47-8fb5-ad575768051a\scratchpad\altered.html
PASS: file exists and is non-empty
FAIL: exact heading text
PASS: doctype, html lang, meta charset present
FAIL: forbidden content found: <script 
FAIL: forbidden content found: <a  
FAIL: forbidden content found: http: 
FAIL: forbidden content found: href= 
FAIL: no forbidden content
RESULT: ONE OR MORE CHECKS FAILED
```
Exit code: 1 (expected). The check detects a missing period and forbidden content.

### 3. Inspection (index.html content read directly; static)
Single `<h1>Welcome to EPAM.</h1>` in the body, with no scripts, links, forms or images. `git status --short` after the runs showed only the expected untracked lifecycle files, `index.html` and `tests/`; the negative control file is outside the repo.

## Requirements mapping
| Item | Evidence | Result |
|------|----------|--------|
| FR-1 single simple static HTML page | Run 1 checks 1 and 3 (file exists, doctype/lang/charset); inspection | Pass (text-based) |
| FR-2 exact text "Welcome to EPAM." | Run 1 exact heading check (case-sensitive); Run 2 fails when the period is removed | Pass (text-based) |
| FR-3 no backend or extra functionality | Run 1 forbidden-content check; Run 2 shows it detects script/link/URL | Pass (text-based) |
| FR-4 loads in a browser without error and renders | NOT RUN. Only a text check; no browser load | Not verified at runtime |
| AC1 page loads successfully | Only file existence and structural markers are checked. Browser load not run | Partially evidenced (text-based) |
| AC2 page displays "Welcome to EPAM." | Source contains the exact heading; rendering not tested | Pass at source level; render not verified |

## Limitations
- Manual browser check (T5) was NOT run. FR-4 and AC1 are not verified by actual loading or rendering.
- The test is text-based (`findstr`), not an HTML parser or renderer. It does not test visual display, console errors, or failed resource requests.
- The forbidden-content list is a heuristic and does not cover every possible extra functionality.
- No CI evidence exists or is claimed. No other test suites exist in the repo.
- Results are automated only; they are not human acceptance.

## Outcome
All automated checks that were run behaved as expected (positive passed, negative control failed as intended). The browser check remains outstanding.
