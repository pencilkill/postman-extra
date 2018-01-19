@echo off

set cmd="%~dp0update.cmd"

::
set extensionId=fhbjgbiflinjbdggehcddcbncdddomop

:: Chrome Extensions
set location="%localappdata%\Google\Chrome\User Data\Default\Extensions\%extensionId%"

::
if exist %location% (
    echo.
    echo Chrome Extensions Found ...
    echo.
	call %cmd% %location% "dir /s /b "%~dp0override\*.html""
)

goto:eof
