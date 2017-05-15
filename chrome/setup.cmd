@echo off

set cmd="%~dp0update.cmd"

:: Chrome Extensions
set chrome="%localappdata%\Google\Chrome\User Data\Default\Extensions\fhbjgbiflinjbdggehcddcbncdddomop"

if exist %chrome% (
    echo.
    echo Chrome Extensions Found ...
    echo.
	call %cmd% %chrome% "dir /s /b "%~dp0override\*.html""
)

goto:eof
