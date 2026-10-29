# Verification: Centered EPAM Heading Page

**Verdict: PASS under the user-authorized revised scope only.** Available automated checks pass. The original full manual and cross-browser DoD remains unproven; those specific checks were waived for this run and are not reported as passing.  
**Evidence date:** 2026-10-29, local time UTC+05:30 (execution approximately 11:37–11:39)  
**Run ID:** `20261029054026-83cadfb4`  
**Delivery repository:** `C:\Users\PalashManna\Desktop\capstone-github`  
**Expected and observed branch:** `story/centered-epam-heading-page-20261029054026-83cadfb4`  
**Expected base and observed HEAD:** `ec2ffdd3251016341618d148abcb2935417259a1`  
**Source:** `C:\Users\PalashManna\Desktop\Copilot-capston\input\user-story.txt`  
**Tested file:** `C:\Users\PalashManna\Desktop\capstone-github\index.html`  
**Tested file SHA-256:** `FDBAD97B43B6CCB0A719E810CD049800FABEFC4E99161CAEA79A663D8D156CBC`

This is fresh execution evidence for this story, not reuse of the automation workspace's 2026-10-28 results. No implementation changes, human acceptance, workflow approval, publishing, or PR drafting are claimed. Round 2 code review returned PASS under the revised scope, with no implementation findings, after review of fresh validator/browser evidence. The user expressly waived only manual desktop/mobile and Firefox/Safari checks for this run; none of those waived checks is claimed to have passed.

## Scope and safeguards

- Read the source TXT and delivery `requirements.md`, `architecture.md`, `design-review.md`, `impl-plan.md`, and `index.html`.
- Verified the expected delivery branch before writes, and again before creating this report. HEAD equals the supplied base SHA; implementation and lifecycle documents are untracked working-tree files, so HEAD alone does not identify their contents.
- All implementation commands/tests explicitly used the delivery repository as working directory and absolute delivery HTML path. The file was opened using `file:///C:/Users/PalashManna/Desktop/capstone-github/index.html`; no different application or automation-workspace acceptance test was run.
- Read the automation workspace's `verification.md` and `package.json` only as tooling references. Reused its installed Playwright module read-only; did not run its `npm test` or alter its files.
- No source was sent to an external HTML validator/service. Only the missing validator package was fetched from npm; validation ran locally.

## Tooling discovery and restoration

Playwright was successfully loaded using:

```powershell
Set-Location 'C:\Users\PalashManna\Desktop\capstone-github'
node -e "const p=require('C:/Users/PalashManna/Desktop/Copilot-capston/node_modules/playwright'); console.log('playwright',require('C:/Users/PalashManna/Desktop/Copilot-capston/node_modules/playwright/package.json').version); for(const n of ['chromium','firefox','webkit']) console.log(n,p[n].executablePath(),require('fs').existsSync(p[n].executablePath()));"
```

Result: Playwright **1.64.1**. Chromium binary exists; Playwright Firefox/WebKit binaries do not. This concretely investigated the existing-tooling lead rather than relying on delivery-scoped module resolution.

| Browser product / engine | Executable | Actual version | Availability / execution |
|---|---|---|---|
| Playwright Chromium / Chromium | `C:\Users\PalashManna\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe` | `156.0.8078.4` | Executed |
| Google Chrome / Chromium | `C:\Program Files\Google\Chrome\Application\chrome.exe` | `156.0.8078.48` | Executed installed browser |
| Microsoft Edge / Chromium | `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` | `156.0.4314.42` | Executed installed browser |
| Playwright Firefox / Gecko | `C:\Users\PalashManna\AppData\Local\ms-playwright\firefox-1555\firefox\firefox.exe` | Not available | Expected executable absent; not run |
| Playwright WebKit | `C:\Users\PalashManna\AppData\Local\ms-playwright\webkit-2370\Playwright.exe` | Not available | Expected executable absent; not run; would not establish Safari-product coverage anyway |
| Mozilla Firefox product | `C:\Program Files\Mozilla Firefox\firefox.exe` | Not available | Standard installation path checked and absent; no claim of exhaustive machine search |
| Safari product | No executable available in this Windows session | Not available | Not run |

These are three browser products but **one rendering-engine family**, not three independent engine checks. Versions are actual reported versions, not a claim that external release channels or every user's installation are current.

Initial `npm cache ls html-validate` / `npm cache ls vnu` through PowerShell's `npm.ps1` failed: script execution is disabled. This was a tooling failure, not an HTML failure. Used the installed `npm.cmd` entry point instead; no execution-policy changes were made. `npm.cmd cache ls vnu` returned no cached validator entry.

Exact dependency lookup/restoration commands (with delivery working directory above):

```powershell
java -version
npm.cmd view vnu-jar version dist.unpackedSize
npm.cmd install --prefix 'C:\Users\PalashManna\.copilot\session-state\de77739c-1bc8-438c-94cd-950c8eeabb7b\files\epam-validation-tools-83cadfb4' --no-save --package-lock=false --ignore-scripts --no-audit --no-fund vnu-jar@26.10.12
```

Results: Java `25.0.4.1`; npm metadata version `26.10.12`, unpacked size `32454108`; install succeeded, **1 package added**, exit 0. Package was isolated to a named session-only tools directory; no application dependency or manifest change was requested by these commands. Network access for the targeted restoration worked. No dependency audit or CI execution is implied.

## Actual HTML standards validation

Executed locally from delivery working directory:

```powershell
java -jar 'C:\Users\PalashManna\.copilot\session-state\de77739c-1bc8-438c-94cd-950c8eeabb7b\files\epam-validation-tools-83cadfb4\node_modules\vnu-jar\build\dist\vnu.jar' --version
java -jar 'C:\Users\PalashManna\.copilot\session-state\de77739c-1bc8-438c-94cd-950c8eeabb7b\files\epam-validation-tools-83cadfb4\node_modules\vnu-jar\build\dist\vnu.jar' --errors-only --format json 'C:\Users\PalashManna\Desktop\capstone-github\index.html'
java -jar 'C:\Users\PalashManna\.copilot\session-state\de77739c-1bc8-438c-94cd-950c8eeabb7b\files\epam-validation-tools-83cadfb4\node_modules\vnu-jar\build\dist\vnu.jar' --format json 'C:\Users\PalashManna\Desktop\capstone-github\index.html'
```

**PASS.** Both validation invocations exited 0 and returned:

```json
{"version":"26.10.12 (973e40b)","messages":[]}
```

The second invocation included all validator diagnostics, not only errors. This is actual Nu HTML Checker execution, not a parser/source-inspection proxy. It does not replace browser compatibility or manual visual verification.

## Actual rendered browser execution

Exact command:

```powershell
Set-Location 'C:\Users\PalashManna\Desktop\capstone-github'
node 'C:\Users\PalashManna\.copilot\session-state\de77739c-1bc8-438c-94cd-950c8eeabb7b\files\epam-browser-check-83cadfb4.cjs'
```

**PASS, exit 0:** `PASS: 24 rendered viewport checks, 6 contexts, 3 browser products (all Chromium engine).`

The temporary Node assertion script used the absolute existing Playwright module and explicit executable paths listed above, `headless: true`, and the delivery file URL. It created two fresh contexts per product, with device scale factor 1:

- Desktop context, sequential same-page viewports: **1280×800 → 1920×1080 → 768×1024 → 320×568 → 1280×800**.
- Mobile-emulated context (`isMobile: true`, `hasTouch: true`): **390×844 → 320×568 → 844×390**.

The first size was tested on load; subsequent sizes were tested after `page.setViewportSize` and two animation frames. Thus the results include actual resize/re-layout, not merely separate fresh screenshots. Mobile emulation is not a physical mobile device, mobile browser product, or mobile address-bar/chrome test.

For each rendered checkpoint, assertions checked:

- Exact `document.body.innerText.trim()` equal to literal `<EPAM>`, one heading, and visible body descendant tags exactly `["H1"]`. Source assertion separately confirmed `<h1>&lt;EPAM&gt;</h1>` and no scripts/images/links/buttons.
- No generated `::before`/`::after` content on body or heading. Combined with the inspected single-heading source, no extra visible content was detected.
- Heading bounding-box midpoint within **1 CSS px** of viewport midpoint on each axis; measured heading and text Range rectangles entirely inside the viewport.
- `documentElement.scrollWidth <= clientWidth` and `scrollHeight <= clientHeight`; exact requested `innerWidth`/`innerHeight`.
- Computed font size matched the implemented clamp (32px at 320px, 39px at 390px, 48px otherwise).
- Computed foreground/background contrast exceeded diagnostic reference 7:1. This reference is a test choice, not a new source-defined acceptance threshold.
- No console error events, uncaught page errors, or HTTP(S) requests.

### Measurements (CSS pixels)

All three products returned the same measurements for each matching viewport, including desktop/mobile-emulated 320×568 and repeated desktop 1280×800. Rectangle notation is `(x, y, width, height)`.

| Viewport | Heading rectangle | Text Range rectangle | Heading midpoint delta (x, y) | Font size |
|---|---|---|---|---|
| 1280×800 | (544.40625, 372.5, 191.1875, 55) | (544.40625, 373.5, 191.1875, 53) | (0, 0) | 48px |
| 1920×1080 | (864.40625, 512.5, 191.1875, 55) | (864.40625, 513.5, 191.1875, 53) | (0, 0) | 48px |
| 768×1024 | (288.40625, 484.5, 191.1875, 55) | (288.40625, 485.5, 191.1875, 53) | (0, 0) | 48px |
| 320×568 | (96.265625, 265.5, 127.453125, 37) | (96.265625, 265.5, 127.453125, 36) | (-0.0078125, 0) | 32px |
| 390×844 | (117.328125, 400, 155.34375, 44) | (117.328125, 400, 155.34375, 43) | (0, 0) | 39px |
| 844×390 | (326.40625, 167.5, 191.1875, 55) | (326.40625, 168.5, 191.1875, 53) | (0, 0) | 48px |

At all 24 checkpoints:

- Scroll width/client width equaled viewport width; scroll height/client height equaled viewport height. No measured horizontal or vertical overflow; all text Range and heading rectangles fit fully within the viewport.
- `visualViewport.width/height` equaled requested width/height with scale 1. `CSS.supports('min-height','100dvh')` was true.
- Font family was `Arial, Helvetica, sans-serif`, weight `700`; foreground `rgb(31, 41, 55)` (`#1f2937`), background `rgb(255, 255, 255)` (`#fff`). Calculated relative-luminance contrast was **14.67911847763172:1**.
- Each of six contexts recorded `consoleErrors: []`, `pageErrors: []`, `externalRequests: []`.

The Range midpoint differs from the viewport by at most 0.5px vertically and 0.0078125px horizontally. These are layout/text metrics, not rasterized glyph-ink optical-centering measurements or a human readability judgment. The 48px value is an example in the story, not a mandatory minimum; the 32px/39px values follow the reviewed responsive design.

## Acceptance coverage

| Requirement / acceptance | Current evidence | Status |
|---|---|---|
| FR-01/02; AC-01, escaped exact literal visible text | Source assertion plus actual rendered body text and heading checks | PASS in executed products/viewports |
| FR-03; AC-02, horizontal/vertical midpoint | Actual bounding rectangles and viewport comparisons above | PASS automated geometry at sampled sizes |
| FR-03; AC-03, resize | Sequential same-page desktop and mobile-emulated resize series | PASS for tested series |
| NFR-01; AC-04, readable/high contrast | Computed 32–48px bold font and 14.679:1 contrast | Automated styling/contrast PASS; manual readability check waived/unrun, not passed |
| NFR-02; AC-05, current Chrome/Firefox/Safari/Edge behavior | Installed Chrome/Edge executed; Playwright Chromium additional evidence | PARTIAL: Firefox/Safari waived and unrun; one engine only; original AC remains unproven |
| FR-04, NFR-03; AC-06, narrow-screen visibility/no horizontal scroll | 320×568 in both context types; 390×844 and 844×390 mobile emulation; bounds/scroll checks | PASS automated sampled layouts; real-device/browser-chrome behavior unverified |
| FR-05; AC-07, no other visible content | Visible-descendant/text/pseudo-content checks and source inspection | PASS in executed products/viewports |
| NFR-04; AC-08, no validator/console errors plus manual desktop/mobile | Nu reports no diagnostics; six contexts report no errors | Validator/runtime portions PASS; manual DoD checks waived/unrun, not passed |

## Available test commands and inapplicable checks

- No story-specific unit suite, test directory/configuration, or application JavaScript is present in delivery. Unit/build checks are **inapplicable**, not passed. The declared `npm.cmd test` command was attempted; it failed because `playwright` was not recognized (exit 1), with no local `node_modules/@playwright/test` or test/config files. This is unavailable tooling, not an implementation test failure.
- The smallest relevant integration checks were the local validator invocation and standalone Playwright assertion runner above. These actually executed the delivery HTML without installing a runtime dependency in the application.
- A `package-lock.json` names the unrelated `simple-personal-todo` tooling. A matching `package.json` with `npm test` = `playwright test` appeared in the delivery listing during this session (file timestamp 11:37:05); it was absent in the first listing. Its origin was not established and it was preserved, not edited or deleted. No delivery test suite/configuration accompanied it. This report does not count a nominal package script or the automation workspace's old config tests as story coverage. `npm.cmd test` was run and failed as unavailable tooling; no test suite executed.
- No CI workflow/run, hosted deployment, external validator, accessibility certification, or dependency/security audit was executed or inferred.

## Lifecycle artifact quality inspection (static, not runtime evidence)

- `requirements.md`: source/run/repository metadata, confirmed facts, FR/NFR/AC traceability, scope, unresolved questions and draft/non-approval status are present. Literal `<EPAM>` interpretation is explicit, not silently substituted for the narrative.
- `architecture.md`: minimal static design, responsibilities, trust boundaries, failure behavior, viewport declaration, `100vh`/`100dvh`, responsive sizing and validation approach map to requirements; unresolved browser/visual questions are retained. Historical repository snapshots are drafting-time statements, not current inventory.
- `design-review.md`: round-1 DR-01 and decision retained; round 2 records resolution and design-only PASS. No implementation/manual testing is claimed by that design decision.
- `impl-plan.md`: dependency-ordered stable IDs IMP-001–004, priorities, traceability, implementation status, available validation, and exact run-specific manual/browser waivers are documented.
- `index.html`: source matches the scoped single escaped heading with embedded CSS; no feature additions were required by these checks. No implementation defect was observed in the available executions.
- `code-review.md`: records round 1 BLOCKED for missing evidence and round 2 PASS under revised acceptance scope, no implementation findings, reviewer evidence reviewed, and exact user-waived limitations.
- `verification.md`: records actual current-run commands, measured results, failures, coverage, authorized waivers, and the scoped final verdict.
- `pr-draft.md`: absent and intentionally not created; the caller explicitly directed verification to stop before PR drafting/publication.

The inspected planning/design documents describe this narrow scope. Waived checks leave the original full DoD unproven; this scoped verification is not human approval or final PR approval.

## Remaining unproven checks and scope boundary

1. **Waived for this run; not performed:** story-required manual desktop/mobile checks (including perceived readability/centering and mobile visible-area/browser-chrome behavior).
2. **Waived for this run; not performed:** Firefox and Safari product coverage. Chromium/Chrome/Edge do not establish Gecko/Safari behavior.
3. Round 2 code review is recorded in `code-review.md`. No implementation fix is indicated by the available passing checks. Any future required fix must go through implementation, code review, and verification.

**Final verification result: PASS under the explicit user-authorized revised scope only.** This does not claim that manual desktop/mobile or Firefox/Safari checks passed, or that the original full DoD is proven. No human/PR approval, publishing, or PR action occurred.

## Temporary helper handling

The specifically named temporary script `epam-browser-check-83cadfb4.cjs` and isolated validator directory `epam-validation-tools-83cadfb4` in the supplied session files folder are removed after execution. Commands and measured outcomes are retained here; rerunning the deleted helper requires reconstructing its documented assertions. No broad deletion or automation-workspace cleanup is performed. Existing delivery source and lifecycle material are preserved.

Cleanup completed successfully using `Remove-Item -LiteralPath` for the named script and `Remove-Item -LiteralPath ... -Recurse` for only the named isolated validator directory; both subsequent `Test-Path` checks returned `False`. Final `Get-FileHash` returned the same HTML SHA-256 recorded above. `git --no-pager diff --exit-code` exited 0 (tracked files only; this does not assert that untracked files are committed or independently baseline-compared). The current worktree contains untracked implementation/artifact files; status alone does not establish their authorship or committed baseline. This verification activity updated only lifecycle artifacts (`requirements.md`, `impl-plan.md`, `verification.md`) and persisted the supplied review result in `code-review.md`; it did not write or modify `index.html`.

## Final verification amendment — 2026-10-29

- **Decision and authorization:** The user explicitly said “that is enough move to the next phase”. The run-specific waiver covers only manual desktop/mobile and Firefox/Safari product checks. `requirements.md` records that limited revision; original requirements remain preserved. The full original manual/cross-browser DoD remains unproven.
- **Code review:** Round 1 was BLOCKED for missing fresh evidence. Round 2 PASS reviewed the implementation plus the validator/browser evidence above; no implementation findings. Review outcome and limits are persisted in `code-review.md`.
- **Unchanged tested implementation:** Rechecked `index.html` SHA-256 using `Get-FileHash -Algorithm SHA256` from the delivery repository. Actual hash `FDBAD97B43B6CCB0A719E810CD049800FABEFC4E99161CAEA79A663D8D156CBC` equals the tested hash recorded above. No implementation file was written.
- **Branch/base:** Rechecked `git branch --show-current` = `story/centered-epam-heading-page-20261029054026-83cadfb4`; `git rev-parse HEAD` = base SHA `ec2ffdd3251016341618d148abcb2935417259a1`.
- **Declared test command:** From `C:\Users\PalashManna\Desktop\capstone-github`, ran `npm.cmd test`. **FAIL / unavailable test runner (exit 1):** `playwright` was not recognized as a command; delivery `node_modules/@playwright/test`, test directory, and Playwright config were absent. This did not execute a test suite. Unit tests/build are inapplicable to the static page and are not passing claims.
- **Applicable executed integration evidence:** Nu HTML Checker `26.10.12` on the absolute delivery `index.html` returned exit 0 with `messages: []`; the standalone Playwright assertion runner returned exit 0 with 24 rendered viewport checks in six contexts across Playwright Chromium, Chrome, and Edge (all Chromium engine). Exact commands, actual versions, measurements, and scope are retained above. Firefox/Safari and manual checks remain explicitly waived/unrun, not passed.
- **Final result:** **PASS only under the user-authorized revised scope**, supported by unchanged tested source, actual validator/browser evidence, and round 2 code-review PASS. This is not human approval or a claim that original full acceptance/DoD is satisfied. No PR draft/publication was created.