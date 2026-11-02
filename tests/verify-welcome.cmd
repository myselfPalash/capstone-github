@echo off
rem Text-based check of the welcome page (not an HTML parser or renderer).
rem Usage: verify-welcome.cmd [path-to-html]   (default: ..\index.html next to this script)
rem Uses only built-in cmd.exe and findstr. Exit 0 if all checks pass, 1 otherwise.
setlocal
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%~dp0..\index.html"
set "RC=0"
echo Checking: %TARGET%

rem Check 1: file exists and is non-empty
if not exist "%TARGET%" (
  echo FAIL: file exists and is non-empty
  exit /b 1
)
for %%F in ("%TARGET%") do set "SIZE=%%~zF"
if "%SIZE%"=="0" (
  echo FAIL: file exists and is non-empty
  exit /b 1
)
echo PASS: file exists and is non-empty

rem Check 2: exact, case-sensitive heading (no /I)
findstr /C:"<h1>Welcome to EPAM.</h1>" "%TARGET%" >nul
if errorlevel 1 (echo FAIL: exact heading text) else (echo PASS: exact heading text)
if errorlevel 1 set "RC=1"

rem Check 3: structural markers
set "S3=0"
findstr /C:"<!DOCTYPE html>" "%TARGET%" >nul || set "S3=1"
findstr /C:"<html lang=\"en\">" "%TARGET%" >nul || set "S3=1"
findstr /C:"<meta charset=\"utf-8\">" "%TARGET%" >nul || set "S3=1"
if "%S3%"=="0" (echo PASS: doctype, html lang, meta charset present) else (echo FAIL: doctype, html lang, meta charset present)
if not "%S3%"=="0" set "RC=1"

rem Check 4: forbidden content (case-insensitive)
set "S4=0"
for %%P in ("<script" "<form" "<link" "<img" "<a " "<a>" "<iframe" "http:" "https:" "src=" "href=") do (
  findstr /I /C:%%P "%TARGET%" >nul && (echo FAIL: forbidden content found: %%~P & set "S4=1")
)
if "%S4%"=="0" (echo PASS: no forbidden content) else (echo FAIL: no forbidden content)
if not "%S4%"=="0" set "RC=1"

if "%RC%"=="0" (echo RESULT: ALL CHECKS PASSED) else (echo RESULT: ONE OR MORE CHECKS FAILED)
exit /b %RC%
