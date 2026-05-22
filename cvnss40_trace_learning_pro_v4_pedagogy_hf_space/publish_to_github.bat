@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM ============================================================
REM CVNSS4.0 Trace Learning Pro v4 - One-shot GitHub uploader
REM Target default: https://github.com/CVNSS/cvnss40-trace-learning-pro-v4
REM License: MIT
REM ============================================================

set "OWNER=%~1"
set "REPO=%~2"
set "VISIBILITY=%~3"

if "%OWNER%"=="" set "OWNER=CVNSS"
if "%REPO%"=="" set "REPO=cvnss40-trace-learning-pro-v4"
if "%VISIBILITY%"=="" set "VISIBILITY=public"

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo.
echo ============================================================
echo  CVNSS4.0 Trace Learning Pro v4 - GitHub Publisher
echo  OWNER      : %OWNER%
echo  REPO       : %REPO%
echo  VISIBILITY : %VISIBILITY%
echo  FOLDER     : %ROOT%
echo ============================================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Chua cai Git. Tai Git for Windows tai: https://git-scm.com/download/win
  pause
  exit /b 1
)

where gh >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Chua cai GitHub CLI ^(gh^). Tai tai: https://cli.github.com/
  echo Sau khi cai, chay: gh auth login
  pause
  exit /b 1
)

gh auth status >nul 2>nul
if errorlevel 1 (
  echo [INFO] Ban chua dang nhap GitHub CLI. Dang mo quy trinh dang nhap...
  gh auth login
  if errorlevel 1 (
    echo [ERROR] Dang nhap GitHub CLI that bai.
    pause
    exit /b 1
  )
)

if not exist LICENSE (
  echo MIT License> LICENSE
  echo.>> LICENSE
  echo Copyright ^(c^) 2025 Long Ngo>> LICENSE
  echo.>> LICENSE
  echo Permission is hereby granted, free of charge, to any person obtaining a copy>> LICENSE
  echo of this software and associated documentation files ^(the "Software"^), to deal>> LICENSE
  echo in the Software without restriction, including without limitation the rights>> LICENSE
  echo to use, copy, modify, merge, publish, distribute, sublicense, and/or sell>> LICENSE
  echo copies of the Software, and to permit persons to whom the Software is>> LICENSE
  echo furnished to do so, subject to the following conditions:>> LICENSE
  echo.>> LICENSE
  echo The above copyright notice and this permission notice shall be included in all>> LICENSE
  echo copies or substantial portions of the Software.>> LICENSE
  echo.>> LICENSE
  echo THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR>> LICENSE
  echo IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,>> LICENSE
  echo FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE>> LICENSE
  echo AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER>> LICENSE
  echo LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,>> LICENSE
  echo OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE>> LICENSE
  echo SOFTWARE.>> LICENSE
)

if not exist .git (
  git init
)

git branch -M main

git add -A
git commit -m "Initial release: CVNSS4.0 Trace Learning Pro v4" 2>nul
if errorlevel 1 (
  echo [INFO] Khong co thay doi moi de commit hoac commit da ton tai.
)

gh repo view %OWNER%/%REPO% >nul 2>nul
if errorlevel 1 (
  echo [INFO] Repo chua ton tai. Dang tao repo %OWNER%/%REPO%...
  if /I "%VISIBILITY%"=="private" (
    gh repo create %OWNER%/%REPO% --private --source=. --remote=origin --push
  ) else (
    gh repo create %OWNER%/%REPO% --public --source=. --remote=origin --push
  )
  if errorlevel 1 (
    echo [ERROR] Tao repo hoac push that bai. Kiem tra quyen tao repo trong org %OWNER%.
    pause
    exit /b 1
  )
) else (
  echo [INFO] Repo da ton tai. Dang cau hinh remote va push...
  git remote remove origin >nul 2>nul
  git remote add origin https://github.com/%OWNER%/%REPO%.git
  git push -u origin main
  if errorlevel 1 (
    echo [ERROR] Push that bai. Thu chay: gh auth login hoac kiem tra quyen ghi repo.
    pause
    exit /b 1
  )
)

echo.
echo [OK] Da upload xong:
echo https://github.com/%OWNER%/%REPO%
echo.
echo Goi y tiep theo: vao repo ^> Settings ^> Pages neu muon bat GitHub Pages.
pause
endlocal
