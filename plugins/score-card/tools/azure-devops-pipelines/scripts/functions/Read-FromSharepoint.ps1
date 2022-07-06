<#
.SYNOPSIS
    Reads data from sharepoint and updates the item in hashtable
#>
function Read-FromSharepoint {
    [CmdLetBinding()]
    param (
        $hashTable,
        $itemName,
        $spItem,
        $spFieldMatch,
        $convertByTemplate,
        $sharepointAction
    )
    if ($null -eq $spFieldMatch) {
        $spFieldMatch = $itemName;
    }
    $spField = $spFields | Where-Object -Property Title -Match -Value $spFieldMatch;
    if ($null -ne $spField) {
        $spValue = $spItem.FieldValues[$spField.InternalName];
        
        if ($null -ne $spValue -and $null -ne $convertByTemplate.scoreChoices) {
            $spValue = ($spValue -split ':')[0]; #value in SP is "choice: XXX%"
            $choiceObj = $convertByTemplate.scoreChoices | Where-Object { ($_.PSObject.Properties | Select-Object -ExpandProperty Name -First 1) -eq $spValue };
            $spValue = $choiceObj."$spValue"; #we want to get percent value from template (percent can change over time)
        }
        
        if ($null -ne $convertByTemplate.scoreChecks) {
            $choices = $spValue; # already in a form of array
            $spValue = 0; #in case ($null -ne $spValue) we will have 0 as a result = failure
            foreach ($choice in $choices) {
                #each choice adds certain percent
                $choiceObj = $convertByTemplate.scoreChecks | Where-Object { ($_.PSObject.Properties | Select-Object -ExpandProperty Name -First 1) -eq $choice };
                if ($null -ne $choiceObj) {
                    $spValue += $choiceObj."$choice"; #we want to get percent value from template (percent can change over time)
                }
            }
        }
        
        if ($null -ne $spValue -and $spValue.GetType() -eq [double]) {
            $spValue = [int](100 * $spValue); #since we receive .xx from SP we need to have XX in json...
        }
        $hashTable[$itemName] = $spValue;
    }
}