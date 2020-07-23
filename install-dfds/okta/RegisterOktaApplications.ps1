$token = "abcdef123456"
$header = @{"Authorization"=$token}
$url = "https://services.customer-iam.dfds.cloud/dev/customeriam-selfservice/api/v1/Application"

$backstageApplicationBody = @"
{
	"name": "Core.Selfservice.Application.Backstage4",
	"applicationType": "Service",
	"redirectUri": ["https://localhost:7000/auth/okta/handler/frame?env=development"],
	"postLogoutRedirectUri": ["https://localhost:3000"],
	"applicationAdmins": []
}
"@

$request = Invoke-RestMethod -Uri $url -Headers $header -Body $backstageApplicationBody -ContentType "application/json" -Method Post

Write-Host $request

{
	"id": "0oaofm6dvWx9aFfFb0x6",
	"clientId": "0oaofm6dvWx9aFfFb0x6",
	"clientSecret": "0Q6XsfJpwdCrpntCMts4CdB_0bTxSbSbkTY4xykF",
	"redirectUri": [
	  "https://localhost:7000/auth/okta/handler/frame?env=development"
	],
	"postLogoutRedirectUri": [
	  "https://localhost:3000"
	]
  }