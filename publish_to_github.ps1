param(
  [string]$Owner = "CVNSS",
  [string]$Repo = "cvnss40-trace-learning-pro-v4",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " CVNSS4.0 Trace Learning Pro v4 - GitHub Publisher" -ForegroundColor Cyan
Write-Host " OWNER      : $Owner"
Write-Host " REPO       : $Repo"
Write-Host " VISIBILITY : $Visibility"
Write-Host " FOLDER     : $Root"
Write-Host "============================================================" -ForegroundColor Cyan

function Assert-Command($Name, $Hint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing command '$Name'. $Hint"
  }
}

Assert-Command git "Install Git for Windows: https://git-scm.com/download/win"
Assert-Command gh "Install GitHub CLI: https://cli.github.com/ then run: gh auth login"

try { gh auth status | Out-Null }
catch {
  Write-Host "[INFO] GitHub CLI is not logged in. Starting gh auth login..." -ForegroundColor Yellow
  gh auth login
}

if (-not (Test-Path "LICENSE")) {
@"
MIT License

Copyright (c) 2025 Long Ngo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@ | Set-Content -Encoding UTF8 LICENSE
}

if (-not (Test-Path ".git")) { git init }
git branch -M main
git add -A
try { git commit -m "Initial release: CVNSS4.0 Trace Learning Pro v4" }
catch { Write-Host "[INFO] Nothing new to commit, or commit already exists." -ForegroundColor Yellow }

$RepoExists = $true
try { gh repo view "$Owner/$Repo" | Out-Null }
catch { $RepoExists = $false }

if (-not $RepoExists) {
  Write-Host "[INFO] Creating repository $Owner/$Repo..." -ForegroundColor Yellow
  if ($Visibility -eq "private") {
    gh repo create "$Owner/$Repo" --private --source=. --remote=origin --push
  } else {
    gh repo create "$Owner/$Repo" --public --source=. --remote=origin --push
  }
} else {
  Write-Host "[INFO] Repository exists. Setting remote and pushing..." -ForegroundColor Yellow
  git remote remove origin 2>$null
  git remote add origin "https://github.com/$Owner/$Repo.git"
  git push -u origin main
}

Write-Host "`n[OK] Uploaded: https://github.com/$Owner/$Repo" -ForegroundColor Green
