$ErrorActionPreference = "Stop"

Write-Host "Aplicando Procedimientos Almacenados y creando cuenta de Administrador..."
try {
    $sqlScriptPath = Join-Path -Path $PSScriptRoot -ChildPath "sps_and_admin.sql"
    $scriptContent = Get-Content -Path $sqlScriptPath -Raw
    
    # Split the script by GO to execute batch by batch
    $batches = $scriptContent -split "(?m)^\s*GO\s*$"
    
    $dbConnectionString = "Data Source=(localdb)\MSSQLLocalDB;Integrated Security=True;database=homemoney"
    $dbConnection = New-Object System.Data.SqlClient.SqlConnection $dbConnectionString
    $dbConnection.Open()
    
    foreach ($batch in $batches) {
        if (-not [string]::IsNullOrWhiteSpace($batch)) {
            $cmd = $dbConnection.CreateCommand()
            $cmd.CommandText = $batch
            $cmd.ExecuteNonQuery() > $null
        }
    }
    
    $dbConnection.Close()
    Write-Host ""
    Write-Host "======================================================"
    Write-Host "¡EXITO! Procedimientos Almacenados generados."
    Write-Host "Usuario Administrador creado exitosamente."
    Write-Host "======================================================"
} catch {
    Write-Host "Error al ejecutar el script: $_"
}

Write-Host ""
Read-Host -Prompt "Presiona Enter para salir"
