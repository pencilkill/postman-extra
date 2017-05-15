@echo off
setlocal enabledelayedexpansion
::
set app=%1
set resources="%~dp0resources"

:: app directory
pushd %app%

set id=postman-custom-resources
set key=text/javascript

:: copy resource
xcopy /yse %resources% %app%

:: modify files, each version's file
for /f "delims=, tokens=*" %%i in ('%~2') do (
    for /f "delims= tokens=*" %%j in ('where /R %app% "%%~nxi"') do (
        call :modify "%%j" "%id%" "%key%" "%%i"
		type "%%j"	
    )
)
endlocal disabledelayedexpansion
goto:eof

:modify
setlocal enabledelayedexpansion
set bak="%~dpn1"
set /a ipos=0
set /a kpos=0
set /a pos=0
::
for /f "delims=: tokens=1" %%j in ('findstr /i /n %2 %1') do (
	if !ipos! equ 0 (
		set /a ipos=%%j-1
	)
)
::
for /f "delims=: tokens=1" %%j in ('findstr /i /n %3 %1') do (set /a kpos=%%j)
::
if %ipos% equ 0 (
	set /a ipos=%kpos%
)
::
ren %1 %~n1
cd.>%1
for /f "delims=" %%i in ('type %bak%') do (
	set /a pos=!pos!+1
	if !pos! leq !ipos! (
		setlocal disabledelayedexpansion
		echo %%i >> %1
		endlocal enabledelayedexpansion
	)
	if !pos! equ !ipos! (
		type %4 >> %1
		echo. >> %1
	)
	if !pos! gtr !kpos! (
		setlocal disabledelayedexpansion
		echo %%i >> %1
		endlocal enabledelayedexpansion
	)
)
del %bak%
endlocal disabledelayedexpansion
goto:eof
