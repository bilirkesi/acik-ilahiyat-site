# Infografik PNG'leri Windows Türkçe OCR ile tarar, kelime kutularıyla JSON koyar.
# Kullanım: powershell -File scripts\ocr_infographics.ps1
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Foundation.IAsyncOperation`1, Windows.Foundation, ContentType=WindowsRuntime]

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() |
  Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 })[0]

function Await($WinRtTask, $ResultType) {
  $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
  $netTask = $asTask.Invoke($null, @($WinRtTask))
  $netTask.Wait(-1) | Out-Null
  $netTask.Result
}

$tr = [Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime]::new('tr')
$engine = [Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime]::TryCreateFromLanguage($tr)
if (-not $engine) { throw 'tr OCR engine yok' }

$root = 'C:\Users\Selahattin\NotebookProjects\acik-ilahiyat-poc\artifacts\nlm-infographics'
$outDir = Join-Path $root 'ocr'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

Get-ChildItem $root -Recurse -Filter 'unit-*.png' |
  Where-Object { $_.DirectoryName -notmatch '_backup-orig|_thumbs|ocr' } |
  ForEach-Object {
    $path = $_.FullName
    $slug = $_.Directory.Name
    $out = Join-Path $outDir ($slug + '__' + $_.BaseName + '.json')
    if (Test-Path $out) { Write-Host "skip $out"; return }
    $stream = [System.IO.File]::OpenRead($path)
    try {
      $ir = [System.IO.WindowsRuntimeStreamExtensions]::AsRandomAccessStream($stream)
      $dec = Await ([Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime]::CreateAsync($ir)) ([Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime])
      $bmp = Await ($dec.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap,Windows.Graphics.Imaging,ContentType=WindowsRuntime])
      $res = Await ($engine.RecognizeAsync($bmp)) ([Windows.Media.Ocr.OcrResult,Windows.Media.Ocr,ContentType=WindowsRuntime])
      $lines = @()
      foreach ($line in $res.Lines) {
        $words = @()
        foreach ($w in $line.Words) {
          $r = $w.BoundingRect
          $words += [ordered]@{ t = $w.RawText; x = [math]::Round($r.X,1); y = [math]::Round($r.Y,1); w = [math]::Round($r.Width,1); h = [math]::Round($r.Height,1) }
        }
        $lines += [ordered]@{ text = $line.Text; words = $words }
      }
      $doc = [ordered]@{ image = $_.Name; slug = $slug; w = [int]$bmp.PixelWidth; h = [int]$bmp.PixelHeight; lines = $lines }
      $json = $doc | ConvertTo-Json -Depth 8 -Compress
      [System.IO.File]::WriteAllText($out, $json, (New-Object System.Text.UTF8Encoding $false))
      Write-Host "ok $out ($($lines.Count) lines)"
    } finally { $stream.Dispose() }
  }
