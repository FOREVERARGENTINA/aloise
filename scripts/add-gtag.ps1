$snippet = "`r`n  <!-- Google tag (gtag.js) -->`r`n  <script async src=`"https://www.googletagmanager.com/gtag/js?id=G-8HYLL3RKZQ`"></script>`r`n  <script>`r`n    window.dataLayer = window.dataLayer || [];`r`n    function gtag(){dataLayer.push(arguments);}`r`n    gtag('js', new Date());`r`n    gtag('config', 'G-8HYLL3RKZQ');`r`n  </script>`r`n</head>"

foreach ($f in @('quienes-somos.html','vende-con-nosotros.html','ficha.html','politica-privacidad.html','terminos-y-condiciones.html','404.html')) {
  $c = [System.IO.File]::ReadAllText("$PSScriptRoot\..\$f")
  if ($c -notmatch 'gtag') {
    $c = $c.Replace('</head>', $snippet)
    [System.IO.File]::WriteAllText("$PSScriptRoot\..\$f", $c)
    Write-Host "Updated: $f"
  } else {
    Write-Host "Already has gtag: $f"
  }
}
