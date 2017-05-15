@echo off
:: Required : npm i asar -g

set cmd="%~dp0update.cmd"

:: Native Apps
set native="%localappdata%\Postman"
set asar="app.asar"

if exist %native% (
    echo.
    echo Native App Found ...
    echo.
	for /f "tokens=*" %%i in ('where /R %native% %asar%') do (
		asar e "%%i" "%%~dpni"
		call %cmd% "%%~dpni" "dir /s /b "%~dp0override\*.html""
		asar p "%%~dpni" "%%i"
		echo rd /s /q "%%~dpni"	
	)
)

goto:eof
