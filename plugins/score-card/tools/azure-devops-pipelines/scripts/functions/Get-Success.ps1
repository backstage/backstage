<#
.SYNOPSIS
    Calculates the success based on $scorePercent
#>
function Get-Success($scorePercent) {
    switch ($scorePercent) {
        { $null -ne $_ -and $_ -ge 80 } { return "success" }
        { $null -ne $_ -and $_ -ge 60 -and $_ -lt 80 } { return "almost-success" }
        { $null -ne $_ -and $_ -ge 40 -and $_ -lt 60 } { return "partial" }
        { $null -ne $_ -and $_ -ge 20 -and $_ -lt 40 } { return "almost-failure" }
        { $null -ne $_ -and $_ -lt 20 } { return "failure" }
        Default { return "unknown" }
    };
}
