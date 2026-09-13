@echo off
echo ==============================================================
echo Configurando Windows para permitir acceso externo a IIS Express
echo ==============================================================

:: Verificar permisos de administrador
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Permisos de administrador detectados. Procediendo...
) else (
    echo ==============================================================
    echo ERROR: Por favor, dale clic derecho a este archivo y 
    echo selecciona "Ejecutar como administrador".
    echo ==============================================================
    pause
    exit /b 1
)

:: Reservar URL para IIS Express
echo Reservando URL en HTTP.sys...
netsh http add urlacl url=http://*:57927/ user=Todos
netsh http add urlacl url=http://*:57927/ user=Everyone

:: Abrir puerto en el Firewall de Windows
echo Abriendo puerto 57927 en el Firewall de Windows...
netsh advfirewall firewall add rule name="IISExpress Web (57927)" dir=in action=allow protocol=TCP localport=57927

echo ==============================================================
echo TODO LISTO. Ahora debes REINICIAR IIS Express (Cierra tu app
echo y vuelve a darle Iniciar / F5 en Visual Studio).
echo ==============================================================
pause
