$f = Join-Path $PSScriptRoot '..\servicios.html'
$c = [System.IO.File]::ReadAllText($f)

# Remove the bad GA4 block entirely (everything between the comment and </head>)
$bad = [regex]::Escape('<!-- Google tag (gtag.js) -->')
$c = [regex]::Replace($c, '(?s)\s*<!-- Google tag \(gtag\.js\) -->.*?</head>', "`r`n</head>")

# Now insert correct block before </head>
$good = "  <!-- Google tag (gtag.js) -->`r`n  <script async src=`"https://www.googletagmanager.com/gtag/js?id=G-8HYLL3RKZQ`"></script>`r`n  <script>`r`n    window.dataLayer = window.dataLayer || [];`r`n    function gtag(){dataLayer.push(arguments);}`r`n    gtag('js', new Date());`r`n    gtag('config', 'G-8HYLL3RKZQ');`r`n  </script>`r`n</head>"

$c = $c.Replace('</head>', $good)
[System.IO.File]::WriteAllText($f, $c)
Write-Host 'Done'
