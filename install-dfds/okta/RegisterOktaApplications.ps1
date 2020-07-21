$token = "abcdef123456"
$header = @{"Authorization"=$token}
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/Application"

$backstageApplicationBody = @"
{
	"name": "CloudEngineering.Selfservice.Application.Backstage",
	"applicationType": "Browser",
	"redirectUri": [TODO],
	"postLogoutRedirectUri": [TODO],
	"applicationAdmins": [TODO]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $backstageApplicationBody -ContentType "application/json" -Method Post

Write-Host $request

$k8sApplicationBody = @"
{
	"name": "CloudEngineering.Selfservice.Application.Kubernetes",
	"applicationType": "Service",
	"redirectUri": [TODO],
	"postLogoutRedirectUri": [TODO],
	"applicationAdmins": [TODO]
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $k8sApplicationBody -ContentType "application/json" -Method Post

Write-Host $request