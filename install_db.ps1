$ErrorActionPreference = "Stop"

Write-Host "======================================================"
Write-Host "Instalador de Base de Datos - HomeChange (HomeMoney)"
Write-Host "======================================================"
Write-Host ""

$connectionString = "Data Source=(localdb)\MSSQLLocalDB;Integrated Security=True;database=master"

Write-Host "1. Limpiando instalaciones anteriores..."
try {
    $sqlConnection = New-Object System.Data.SqlClient.SqlConnection $connectionString
    $sqlConnection.Open()
    
    $command = $sqlConnection.CreateCommand()
    $command.CommandText = @"
    IF EXISTS (SELECT name FROM sys.databases WHERE name = N'homemoney')
    BEGIN
        ALTER DATABASE [homemoney] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
        DROP DATABASE [homemoney];
    END
"@
    $command.ExecuteNonQuery() > $null
    $sqlConnection.Close()
    Write-Host "   [OK] Base de datos limpia."
} catch {
    Write-Host "   [!] Advertencia en limpieza: $_"
}

function Execute-SqlScript($filePath, $connStr) {
    if (-not (Test-Path $filePath)) { return }
    $fileName = Split-Path $filePath -Leaf
    Write-Host "2. Aplicando $fileName..."
    $scriptContent = Get-Content -Path $filePath -Raw
    $batches = $scriptContent -split "(?m)^\s*GO\s*$"
    
    $conn = New-Object System.Data.SqlClient.SqlConnection $connStr
    $conn.Open()
    foreach ($batch in $batches) {
        if (-not [string]::IsNullOrWhiteSpace($batch)) {
            $cmd = $conn.CreateCommand()
            $cmd.CommandText = $batch
            $cmd.ExecuteNonQuery() > $null
        }
    }
    $conn.Close()
    Write-Host "   [OK] $fileName aplicado exitosamente."
}

$dbMaster = "Data Source=(localdb)\MSSQLLocalDB;Integrated Security=True;database=master"
$dbApp = "Data Source=(localdb)\MSSQLLocalDB;Integrated Security=True;database=homemoney"

# 1. Esquema
Execute-SqlScript (Join-Path -Path $PSScriptRoot -ChildPath "database_schema.sql") $dbMaster

# 2. Semillas de Catálogos
Execute-SqlScript (Join-Path -Path $PSScriptRoot -ChildPath "seed_catalogos.sql") $dbApp

# 3. Procedimientos Almacenados y Administrador
Execute-SqlScript (Join-Path -Path $PSScriptRoot -ChildPath "sps_and_admin.sql") $dbApp

Write-Host ""
Write-Host "======================================================"
Write-Host "¡TODO LISTO Y CONFIGURADO! Base de datos inicializada."
Write-Host "======================================================"
Write-Host "Credenciales de administrador:"
Write-Host "  Usuario: admin"
Write-Host "  Clave:   admin"
Write-Host "======================================================"
