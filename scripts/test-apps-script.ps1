param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^https://script\.google\.com/')]
    [string]$WebAppUrl
)

$ErrorActionPreference = 'Stop'
$requestToken = [guid]::NewGuid().ToString()
$body = @{
    requestToken = $requestToken
    fullName = 'Luuiw Smoke Test'
    email = ''
    phone = '0900000000'
    service = 'System smoke test'
    subject = 'Google Apps Script smoke test'
    description = 'Automated smoke test request to verify Google Sheets and email delivery.'
    deadline = ''
    budget = 'Not applicable'
    preferredContact = 'Email'
    attachmentUrl = ''
    consent = 'true'
    website = ''
    source = 'manual-smoke-test'
    userAgent = 'PowerShell smoke test'
}

$response = Invoke-WebRequest -Uri $WebAppUrl -Method Post -Body $body -UseBasicParsing

if ($response.StatusCode -ne 200 -or $response.Content -notmatch '"ok":true') {
    throw 'Apps Script did not confirm success. Check the deployment and Execution log.'
}

if ($response.Content -match 'ML-\d{8}-[A-Z0-9]{4}') {
    Write-Output "Apps Script OK. Request ID: $($Matches[0])"
} else {
    Write-Output 'Apps Script returned success but the request ID could not be parsed.'
}
